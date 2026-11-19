// Standalone runner for real Haiku 5.5 calibration calls.
// Not part of `npm test`. Not run in CI. Only run manually.
//
// Calls the Anthropic adapter directly (no Worker, no `wrangler dev`). Uses the exact same
// grading context builder, schema validator, and model identifier as production.
//
// Reads ANTHROPIC_API_KEY from worker/.dev.vars (gitignored).
// Enforces a local spending ceiling: stops once cumulative recorded cost reaches --spend-stop.
// This is independent of the production GLOBAL_DAILY_CAP and never touches production KV / DO.
//
// Privacy:
//   - Participant answer text is read from the --answers file and used to build the prompt.
//   - It is NEVER echoed to stdout and NEVER written into the JSON report.
//   - Reports hold only: label, case_id, quality, run_index, status, dimension scores,
//     total scores, token counts, latency, cost, and, on failure, stop_reason + error class.
//
// Usage:
//   node scripts/real-grade.mjs \
//     [--answers=<path-to-answers-file>]   default: ./scripts/calibration-answers.mjs (synthetic)
//     [--repeat=<n>]                       default: 1; repeat each answer n times for inter-run variance
//     [--spend-stop=<usd>]                 default: 0.05; stop issuing new calls above this cumulative
//     [--report=<path>]                    default: ./scripts/real-grade-report.json (gitignored)
//
// Example (Cohort 21 calibration, 3 runs per answer):
//   node scripts/real-grade.mjs \
//     --answers=worker/scripts/cohort21-answers.local.mjs \
//     --repeat=3 \
//     --report=worker/scripts/cohort21-report.local.json

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join, resolve, isAbsolute } from 'node:path';
import { anthropicLLM, MODEL_ID, GraderError } from '../src/anthropic-llm.js';
import { buildGradingContext } from '../src/context.js';
import { validateAndEnrichResponse } from '../src/schema.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const WORKER_ROOT = join(__dirname, '..');
const REPO_ROOT = join(WORKER_ROOT, '..');

const PRICE_INPUT_PER_MTOK = 0.10;
const PRICE_OUTPUT_PER_MTOK = 0.50;
const DEFAULT_SPEND_STOP_USD = 0.05;
const DEFAULT_ANSWERS_PATH = join(__dirname, 'calibration-answers.mjs');
const DEFAULT_REPORT_PATH = join(__dirname, 'real-grade-report.json');

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

function parseArgs(argv) {
  const out = {};
  for (const a of argv.slice(2)) {
    const m = /^--([a-z-]+)=(.+)$/.exec(a);
    if (m) out[m[1]] = m[2];
  }
  return out;
}

function resolveFromCwd(p) {
  return isAbsolute(p) ? p : resolve(process.cwd(), p);
}

// Import an answers file by path. The file must export CALIBRATION_ANSWERS as an array of
// { label, case_id, quality?, answer }. Answer text is used to build the prompt but never logged.
async function loadAnswersFile(path) {
  const abs = resolveFromCwd(path);
  if (!existsSync(abs)) {
    console.error(`Answers file not found: ${abs}`);
    process.exit(1);
  }
  const mod = await import(pathToFileURL(abs).href);
  const list = mod.CALIBRATION_ANSWERS;
  if (!Array.isArray(list) || list.length === 0) {
    console.error(`Answers file must export a non-empty array named CALIBRATION_ANSWERS: ${abs}`);
    process.exit(1);
  }
  for (const item of list) {
    if (!item.case_id || typeof item.answer !== 'string' || item.answer.length === 0) {
      console.error('Every answer entry needs { case_id, answer }. Offending entry:', { label: item.label, case_id: item.case_id });
      process.exit(1);
    }
  }
  return { answers: list, path: abs };
}

async function main() {
  const args = parseArgs(process.argv);
  const answersPath = args.answers ?? DEFAULT_ANSWERS_PATH;
  const repeat = Math.max(1, Math.min(10, parseInt(args.repeat ?? '1', 10) || 1));
  const spendStop = Math.max(0.001, parseFloat(args['spend-stop'] ?? DEFAULT_SPEND_STOP_USD));
  const reportPath = args.report ?? DEFAULT_REPORT_PATH;

  const vars = loadDevVars();
  const apiKey = vars.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey.length < 20) {
    console.error('ANTHROPIC_API_KEY missing or too short in worker/.dev.vars');
    process.exit(1);
  }

  const { answers, path: answersAbs } = await loadAnswersFile(answersPath);
  const totalPlannedCalls = answers.length * repeat;

  // Report metadata only — never the answers file contents.
  const isDefaultFixture = answersAbs === DEFAULT_ANSWERS_PATH;
  console.log(`Answers file: ${answersAbs}${isDefaultFixture ? ' (synthetic fixture)' : ' (private — content will not be logged)'}`);
  console.log(`Model:        ${MODEL_ID}`);
  console.log(`Runs:         ${answers.length} answer(s) x ${repeat} = up to ${totalPlannedCalls} calls`);
  console.log(`Spend stop:   ${fmtUsd(spendStop)} cumulative (NOT a guaranteed billing cap)`);
  console.log(`Report:       ${resolveFromCwd(reportPath)}`);
  console.log('');

  const env = { ANTHROPIC_API_KEY: apiKey };
  const results = [];
  let cumulativeUsd = 0;
  let stopped = false;

  outer: for (const [i, item] of answers.entries()) {
    for (let run = 1; run <= repeat; run++) {
      // Label uses only metadata — not the answer. Keeps logs free of participant text.
      const label = `${i + 1}/${answers.length} · ${item.label ?? item.case_id} · run ${run}/${repeat}`;
      process.stdout.write(`${label}... `);

      if (cumulativeUsd >= spendStop) {
        console.log(`STOP: cumulative cost ${fmtUsd(cumulativeUsd)} reached ${fmtUsd(spendStop)} threshold; remaining calls skipped`);
        stopped = true;
        break outer;
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
          label: item.label ?? item.case_id,
          case_id: item.case_id,
          quality: item.quality ?? null,
          run_index: run,
          status: validated.ok ? 'OK' : `SCHEMA_FAIL: ${validated.error}`,
          // Dimension-level scores for inter-run variance analysis (names only, no reasoning/evidence text).
          dimensions: validated.ok
            ? validated.data.dimensions.map(d => ({ dimension: d.dimension, score: d.score, max_score: d.max_score ?? 3 }))
            : null,
          total_score: validated.ok ? validated.data.total_score : null,
          max_total_score: validated.ok ? validated.data.max_total_score : null,
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
          label: item.label ?? item.case_id,
          case_id: item.case_id,
          quality: item.quality ?? null,
          run_index: run,
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

  // Per-answer variance across runs (only when repeat > 1). Metadata only.
  if (repeat > 1 && successes.length > 1) {
    const byLabel = new Map();
    for (const r of successes) {
      if (!byLabel.has(r.label)) byLabel.set(r.label, []);
      byLabel.get(r.label).push(r.total_score);
    }
    console.log('');
    console.log('Inter-run variance (total_score):');
    for (const [label, totals] of byLabel) {
      const min = Math.min(...totals);
      const max = Math.max(...totals);
      const mean = totals.reduce((s, n) => s + n, 0) / totals.length;
      console.log(`  ${label}: runs=${totals.length}, min=${min}, mean=${mean.toFixed(2)}, max=${max}, spread=${max - min}`);
    }
  }

  const absReportPath = resolveFromCwd(reportPath);
  writeFileSync(absReportPath, JSON.stringify({
    model: MODEL_ID,
    ran_at: new Date().toISOString(),
    answers_file: answersAbs,
    repeat,
    total_cost_usd: cumulativeUsd,
    spend_stop_usd: spendStop,
    stopped_early: stopped,
    results,
  }, null, 2));
  console.log(`\nFull report: ${absReportPath} (gitignored — scores, tokens, latency only; no answer text)`);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
