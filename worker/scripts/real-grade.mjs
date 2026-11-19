// Standalone runner for the first 10 real Haiku 5.5 calls.
// Not part of `npm test`. Not run in CI. Only run manually after the user approves.
//
// Reads ANTHROPIC_API_KEY from .dev.vars (gitignored).
// Enforces a spending ceiling: stops as soon as cumulative cost crosses the cap.
// Prints a summary table (tokens, latency, pass/fail, cost). Writes a JSON report.
//
// Usage: node scripts/real-grade.mjs

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { anthropicLLM, MODEL_ID, GraderError } from '../src/anthropic-llm.js';
import { buildGradingContext } from '../src/context.js';
import { validateAndEnrichResponse } from '../src/schema.js';
import { CALIBRATION_ANSWERS } from './calibration-answers.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const WORKER_ROOT = join(__dirname, '..');

const PRICE_INPUT_PER_MTOK = 0.10;
const PRICE_OUTPUT_PER_MTOK = 0.50;
// The script stops launching new requests once cumulative recorded cost reaches this value.
// This is NOT a guaranteed billing cap: the provider bills by actual usage; this script
// only controls when we stop making requests, and a request already in flight will still bill.
// Set a provider-side spending limit in console.anthropic.com as an independent backstop.
const SPEND_STOP_USD = 0.05;

function loadDevVars() {
  const path = join(WORKER_ROOT, '.dev.vars');
  if (!existsSync(path)) {
    console.error('Missing worker/.dev.vars. Copy .dev.vars.example and set ANTHROPIC_API_KEY.');
    process.exit(1);
  }
  const vars = {};
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const m = /^([A-Z0-9_]+)=(.*)$/.exec(line.trim());
    if (m) vars[m[1]] = m[2];
  }
  return vars;
}

function costOf(usage) {
  if (!usage) return 0;
  const inUsd = (usage.input_tokens ?? 0) / 1e6 * PRICE_INPUT_PER_MTOK;
  const outUsd = (usage.output_tokens ?? 0) / 1e6 * PRICE_OUTPUT_PER_MTOK;
  return inUsd + outUsd;
}

function fmtUsd(n) { return `$${n.toFixed(5)}`; }

async function main() {
  const vars = loadDevVars();
  const apiKey = vars.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey.length < 20) {
    console.error('ANTHROPIC_API_KEY missing or too short in worker/.dev.vars');
    process.exit(1);
  }

  console.log(`Running up to ${CALIBRATION_ANSWERS.length} SYNTHETIC smoke-test calls on ${MODEL_ID}`);
  console.log(`Stop threshold: ${fmtUsd(SPEND_STOP_USD)} cumulative (NOT a guaranteed billing cap)`);
  console.log('');

  const env = { ANTHROPIC_API_KEY: apiKey };
  const results = [];
  let cumulativeUsd = 0;

  for (const [i, item] of CALIBRATION_ANSWERS.entries()) {
    const label = `${i + 1}. ${item.label}`;
    process.stdout.write(`${label}... `);

    if (cumulativeUsd >= SPEND_STOP_USD) {
      console.log(`STOP: cumulative cost ${fmtUsd(cumulativeUsd)} reached ${fmtUsd(SPEND_STOP_USD)} threshold; remaining calls skipped`);
      break;
    }

    const context = buildGradingContext(item.case_id, item.answer);
    const started = Date.now();
    let outcome;

    try {
      const raw = await anthropicLLM(context, env);
      const validated = validateAndEnrichResponse(raw, item.case_id, item.answer, 1, false);
      const latency = Date.now() - started;
      const usage = raw._usage ?? { input_tokens: null, output_tokens: null };
      const cost = costOf(usage);
      cumulativeUsd += cost;
      outcome = {
        label: item.label,
        case_id: item.case_id,
        quality: item.quality,
        status: validated.ok ? 'OK' : `SCHEMA_FAIL: ${validated.error}`,
        total_score: validated.ok ? validated.data.total_score : null,
        max_total_score: validated.ok ? validated.data.max_total_score : null,
        scores: validated.ok ? validated.data.dimensions.map(d => d.score) : null,
        input_tokens: usage.input_tokens,
        output_tokens: usage.output_tokens,
        latency_ms: latency,
        cost_usd: cost,
      };
      console.log(
        `${validated.ok ? 'OK' : 'SCHEMA_FAIL'} | tokens ${usage.input_tokens}/${usage.output_tokens} | ${latency}ms | ${fmtUsd(cost)} | cumulative ${fmtUsd(cumulativeUsd)}` +
        (validated.ok ? ` | score ${validated.data.total_score}/${validated.data.max_total_score}` : ''),
      );
    } catch (err) {
      const latency = Date.now() - started;
      // Billed tokens flow through even on parse/truncation failures, so we record them here.
      const usage = (err instanceof GraderError && err.usage) ? err.usage : null;
      const cost = costOf(usage);
      cumulativeUsd += cost;
      outcome = {
        label: item.label,
        case_id: item.case_id,
        quality: item.quality,
        status: err instanceof GraderError ? `GRADER_ERROR: ${err.reason}` : `UNEXPECTED: ${err.name}`,
        stop_reason: err instanceof GraderError ? (err.stop_reason ?? null) : null,
        input_tokens: usage?.input_tokens ?? null,
        output_tokens: usage?.output_tokens ?? null,
        latency_ms: latency,
        cost_usd: cost,
      };
      console.log(
        `${outcome.status}` +
        (usage ? ` | tokens ${usage.input_tokens}/${usage.output_tokens} | stop_reason ${outcome.stop_reason} | ${fmtUsd(cost)} | cumulative ${fmtUsd(cumulativeUsd)}` : ''),
      );
    }

    results.push(outcome);
  }

  console.log('');
  console.log('===== SUMMARY =====');
  const successes = results.filter(r => r.status === 'OK');
  console.log(`Successful: ${successes.length} / ${results.length}`);
  if (successes.length > 0) {
    const totalIn = successes.reduce((s, r) => s + (r.input_tokens ?? 0), 0);
    const totalOut = successes.reduce((s, r) => s + (r.output_tokens ?? 0), 0);
    const latencies = successes.map(r => r.latency_ms).sort((a, b) => a - b);
    const median = latencies[Math.floor(latencies.length / 2)];
    console.log(`Tokens: ${totalIn} in, ${totalOut} out | avg per call: ${Math.round(totalIn / successes.length)} in, ${Math.round(totalOut / successes.length)} out`);
    console.log(`Median latency: ${median}ms`);
    console.log(`Total cost: ${fmtUsd(cumulativeUsd)}`);
    console.log(`Per-call cost (mean): ${fmtUsd(cumulativeUsd / successes.length)}`);
  }

  const reportPath = join(WORKER_ROOT, 'scripts', 'real-grade-report.json');
  writeFileSync(reportPath, JSON.stringify({
    model: MODEL_ID,
    ran_at: new Date().toISOString(),
    total_cost_usd: cumulativeUsd,
    results,
  }, null, 2));
  console.log(`\nFull report: ${reportPath} (gitignored)`);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
