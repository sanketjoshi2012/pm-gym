// Reruns the previously-failing Swiggy strong case up to 3 times after the truncation fix.
// Uses a $0.05 cumulative recorded-cost stop. NOT a guaranteed billing cap.
// Reports tokens, stop_reason, latency, schema-validation outcome and cost per attempt.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { anthropicLLM, MODEL_ID, GraderError, MAX_OUTPUT_TOKENS } from '../src/anthropic-llm.js';
import { buildGradingContext } from '../src/context.js';
import { validateAndEnrichResponse } from '../src/schema.js';
import { CALIBRATION_ANSWERS } from './calibration-answers.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const WORKER_ROOT = join(__dirname, '..');
const PRICE_INPUT_PER_MTOK = 0.10;
const PRICE_OUTPUT_PER_MTOK = 0.50;
const SPEND_STOP_USD = 0.05;
const MAX_ATTEMPTS = 3;

function loadApiKey() {
  const path = join(WORKER_ROOT, '.dev.vars');
  if (!existsSync(path)) { console.error('Missing worker/.dev.vars'); process.exit(1); }
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const m = /^ANTHROPIC_API_KEY=(.*)$/.exec(line.trim());
    if (m) return m[1];
  }
  console.error('ANTHROPIC_API_KEY not found in worker/.dev.vars'); process.exit(1);
}

function costOf(usage) {
  if (!usage) return 0;
  return (usage.input_tokens ?? 0) / 1e6 * PRICE_INPUT_PER_MTOK
       + (usage.output_tokens ?? 0) / 1e6 * PRICE_OUTPUT_PER_MTOK;
}
const fmtUsd = n => `$${n.toFixed(5)}`;

async function main() {
  const item = CALIBRATION_ANSWERS.find(a => a.label === 'Swiggy — strong');
  if (!item) { console.error('could not find Swiggy strong in calibration set'); process.exit(1); }

  const env = { ANTHROPIC_API_KEY: loadApiKey() };
  console.log(`Rerunning Swiggy strong up to ${MAX_ATTEMPTS} times on ${MODEL_ID} (max_tokens=${MAX_OUTPUT_TOKENS})`);
  console.log(`Stop threshold: ${fmtUsd(SPEND_STOP_USD)} cumulative (NOT a guaranteed billing cap)`);
  console.log('');

  const results = [];
  let cumulativeUsd = 0;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    process.stdout.write(`Attempt ${attempt}... `);
    if (cumulativeUsd >= SPEND_STOP_USD) { console.log('STOP: threshold reached'); break; }

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
        attempt,
        status: validated.ok ? 'OK' : `SCHEMA_FAIL: ${validated.error}`,
        total_score: validated.ok ? validated.data.total_score : null,
        max_total_score: validated.ok ? validated.data.max_total_score : null,
        scores: validated.ok ? validated.data.dimensions.map(d => d.score) : null,
        stop_reason: raw._stop_reason ?? 'end_turn',
        input_tokens: usage.input_tokens,
        output_tokens: usage.output_tokens,
        latency_ms: latency,
        cost_usd: cost,
      };
      console.log(
        `${outcome.status} | tokens ${usage.input_tokens}/${usage.output_tokens} | ${latency}ms | ${fmtUsd(cost)} | cumulative ${fmtUsd(cumulativeUsd)}` +
        (validated.ok ? ` | score ${validated.data.total_score}/${validated.data.max_total_score}` : ''),
      );
    } catch (err) {
      const latency = Date.now() - started;
      const usage = (err instanceof GraderError && err.usage) ? err.usage : null;
      const cost = costOf(usage);
      cumulativeUsd += cost;
      outcome = {
        attempt,
        status: err instanceof GraderError ? `GRADER_ERROR: ${err.reason}` : `UNEXPECTED: ${err.name}`,
        stop_reason: err instanceof GraderError ? err.stop_reason : null,
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
  console.log('===== SWIGGY RETRY SUMMARY =====');
  const successes = results.filter(r => r.status === 'OK');
  console.log(`Successful: ${successes.length} / ${results.length}`);
  console.log(`Total recorded cost: ${fmtUsd(cumulativeUsd)}`);

  writeFileSync(join(WORKER_ROOT, 'scripts', 'retry-swiggy-report.json'), JSON.stringify({
    model: MODEL_ID,
    max_output_tokens: MAX_OUTPUT_TOKENS,
    ran_at: new Date().toISOString(),
    total_cost_usd: cumulativeUsd,
    results,
  }, null, 2));
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
