import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { buildGradingContext } from '../src/context.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_JS = readFileSync(join(__dirname, '..', '..', 'js', 'data.js'), 'utf8');
import {
  anthropicLLM,
  buildPrompt,
  parseAnthropicResponse,
  extractJsonBlock,
  GraderError,
  MODEL_ID,
  API_URL,
  API_VERSION,
  MAX_OUTPUT_TOKENS,
} from '../src/anthropic-llm.js';
import { validateAndEnrichResponse } from '../src/schema.js';
import GRADER_RUBRIC from '../../js/grader-rubric.js';

const VALID_KEY = 'sk-ant-api03-test-key-not-real-' + 'x'.repeat(20);
const SAMPLE_ANSWER = Array.from({ length: 200 }, (_, i) => `word${i}`).join(' ');

const captureLogger = () => {
  const lines = [];
  return { log: msg => lines.push(String(msg)), lines };
};
const silentLogger = { log: () => {} };

function fakeFetch(handler) {
  const calls = [];
  const fn = async (url, init) => {
    calls.push({ url, init });
    return handler({ url, init, call: calls.length });
  };
  return Object.assign(fn, { calls });
}

function okResponse(payload) {
  return {
    ok: true,
    status: 200,
    json: async () => payload,
  };
}

function errorResponse(status, text = '{}') {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => JSON.parse(text),
  };
}

function wellFormedBody(context, { scoreByDimension } = {}) {
  const dimensions = context.dimensions.map((d, i) => ({
    dimension: d.name,
    score: scoreByDimension?.[d.name] ?? ((i % 3) + 1),
    evidence_quote: i % 2 === 0 ? context.answer.slice(0, 40) : null,
    reasoning: `Reasoning for ${d.name}. It is 2-3 sentences long. It references the answer.`,
    improvement: `To move up on ${d.name}, add one concrete thing.`,
  }));
  return {
    id: 'msg_test',
    content: [{ type: 'text', text: JSON.stringify({ dimensions, overall_comment: 'Strong structure, thin metrics.' }) }],
    usage: { input_tokens: 4800, output_tokens: 1700 },
  };
}

// ---- Prompt builder ----

describe('buildPrompt', () => {

  test('includes scenario, every question and all three anchors per dimension', () => {
    for (const spec of GRADER_RUBRIC.cases) {
      const ctx = buildGradingContext(spec.caseId, SAMPLE_ANSWER);
      const prompt = buildPrompt(ctx);
      assert.ok(prompt.includes(spec.scenario.context.slice(0, 40)), `${spec.caseId}: scenario missing`);
      for (const q of spec.scenario.questions) {
        assert.ok(prompt.includes(q), `${spec.caseId}: question missing`);
      }
      for (const dim of spec.dimensions) {
        assert.ok(prompt.includes(dim.name), `${spec.caseId}: dimension ${dim.name} missing`);
        assert.ok(prompt.includes(dim.score_3.slice(0, 40)), `${spec.caseId}: score_3 missing for ${dim.name}`);
        assert.ok(prompt.includes(dim.score_2.slice(0, 40)), `${spec.caseId}: score_2 missing for ${dim.name}`);
        assert.ok(prompt.includes(dim.score_1.slice(0, 40)), `${spec.caseId}: score_1 missing for ${dim.name}`);
      }
      for (const rule of GRADER_RUBRIC.universalRules) {
        assert.ok(prompt.includes(rule), `${spec.caseId}: rule missing: ${rule.slice(0, 40)}`);
      }
    }
  });

  test('never contains the model answer for any pilot case', () => {
    for (const spec of GRADER_RUBRIC.cases) {
      const match = DATA_JS.match(new RegExp(`id:\\s*["']${spec.caseId}["'][\\s\\S]{0,30000}?modelAnswer:\\s*\`([^\`]+)\``));
      const modelAnswer = match ? match[1] : null;
      assert.ok(modelAnswer && modelAnswer.length > 100, `data.js: could not locate model answer for ${spec.caseId}`);
      const ctx = buildGradingContext(spec.caseId, SAMPLE_ANSWER);
      const prompt = buildPrompt(ctx);
      assert.ok(!prompt.includes('modelAnswer'), `${spec.caseId}: 'modelAnswer' leaked`);
      const needle = modelAnswer.replace(/<[^>]+>/g, '').trim().split(/\s+/).slice(2, 10).join(' ');
      if (needle.length > 20) {
        assert.ok(!prompt.includes(needle), `${spec.caseId}: model-answer text leaked (needle: "${needle}")`);
      }
    }
  });

  test('includes the candidate answer verbatim', () => {
    const ctx = buildGradingContext('case-study-fotmob', 'UNIQUE_ANSWER_TOKEN ' + SAMPLE_ANSWER);
    assert.ok(buildPrompt(ctx).includes('UNIQUE_ANSWER_TOKEN'));
  });
});

// ---- extractJsonBlock + parseAnthropicResponse ----

describe('parsing', () => {

  test('extractJsonBlock strips fenced output', () => {
    assert.equal(extractJsonBlock('```json\n{"a":1}\n```'), '{"a":1}');
    assert.equal(extractJsonBlock('```\n{"a":1}\n```'), '{"a":1}');
    assert.equal(extractJsonBlock('here is the result:\n{"a":1}'), '{"a":1}');
    assert.equal(extractJsonBlock('{"a":1}'), '{"a":1}');
  });

  test('parseAnthropicResponse returns the mock-compatible shape with usage', () => {
    const ctx = buildGradingContext('case-study-fotmob', SAMPLE_ANSWER);
    const body = wellFormedBody(ctx);
    const result = parseAnthropicResponse(body, ctx);
    assert.equal(result.case_id, 'case-study-fotmob');
    assert.equal(result.dimensions.length, ctx.dimensions.length);
    assert.equal(result._provider, 'anthropic');
    assert.equal(result._model, MODEL_ID);
    assert.deepEqual(result._usage, { input_tokens: 4800, output_tokens: 1700 });
    assert.ok(!('_mock' in result));
  });

  test('parsed output passes the existing schema validator', () => {
    const ctx = buildGradingContext('case-study-swiggy', SAMPLE_ANSWER);
    const raw = parseAnthropicResponse(wellFormedBody(ctx), ctx);
    const validated = validateAndEnrichResponse(raw, 'case-study-swiggy', SAMPLE_ANSWER, 1, false);
    assert.ok(validated.ok, validated.error);
    assert.equal(validated.data.case_id, 'case-study-swiggy');
    assert.equal(validated.data.max_total_score, ctx.dimensions.length * 3);
    assert.ok(!validated.data._mock);
  });

  test('parseAnthropicResponse throws GraderError 502 on malformed JSON', () => {
    const ctx = buildGradingContext('case-study-fotmob', SAMPLE_ANSWER);
    const body = { content: [{ type: 'text', text: 'this is not json at all' }] };
    assert.throws(() => parseAnthropicResponse(body, ctx), err => err instanceof GraderError && err.status === 502);
  });

  test('parseAnthropicResponse throws on missing content', () => {
    const ctx = buildGradingContext('case-study-fotmob', SAMPLE_ANSWER);
    assert.throws(() => parseAnthropicResponse({}, ctx), GraderError);
    assert.throws(() => parseAnthropicResponse({ content: [] }, ctx), GraderError);
    assert.throws(() => parseAnthropicResponse({ content: [{ type: 'image' }] }, ctx), GraderError);
  });
});

// ---- anthropicLLM end-to-end with injected fetch ----

describe('anthropicLLM', () => {

  const ctx = () => buildGradingContext('case-study-fotmob', SAMPLE_ANSWER);
  const env = { ANTHROPIC_API_KEY: VALID_KEY };
  const opts = extra => ({ backoffMs: 0, timeoutMs: 100, logger: silentLogger, ...extra });

  test('calls the Messages API with the correct URL, headers, model and max_tokens', async () => {
    const fetchImpl = fakeFetch(() => okResponse(wellFormedBody(ctx())));
    await anthropicLLM(ctx(), env, opts({ fetchImpl }));
    assert.equal(fetchImpl.calls.length, 1);
    const { url, init } = fetchImpl.calls[0];
    assert.equal(url, API_URL);
    assert.equal(init.method, 'POST');
    assert.equal(init.headers['x-api-key'], VALID_KEY);
    assert.equal(init.headers['anthropic-version'], API_VERSION);
    assert.equal(init.headers['content-type'], 'application/json');
    const payload = JSON.parse(init.body);
    assert.equal(payload.model, MODEL_ID);
    assert.equal(payload.max_tokens, MAX_OUTPUT_TOKENS);
    assert.equal(payload.messages.length, 1);
    assert.equal(payload.messages[0].role, 'user');
    assert.ok(payload.messages[0].content.length > 500);
  });

  test('returns feedback that passes schema validation end to end', async () => {
    const c = ctx();
    const fetchImpl = fakeFetch(() => okResponse(wellFormedBody(c)));
    const raw = await anthropicLLM(c, env, opts({ fetchImpl }));
    const validated = validateAndEnrichResponse(raw, c.case_id, c.answer, 1, false);
    assert.ok(validated.ok, validated.error);
  });

  test('missing API key throws GraderError 503', async () => {
    await assert.rejects(
      anthropicLLM(ctx(), {}, opts({ fetchImpl: fakeFetch(() => { throw new Error('should not fetch'); }) })),
      err => err instanceof GraderError && err.status === 503 && err.reason === 'api_key_missing',
    );
  });

  test('short API key is rejected without a network call', async () => {
    const fetchImpl = fakeFetch(() => { throw new Error('should not fetch'); });
    await assert.rejects(
      anthropicLLM(ctx(), { ANTHROPIC_API_KEY: 'sk-too-short' }, opts({ fetchImpl })),
      err => err instanceof GraderError && err.status === 503,
    );
    assert.equal(fetchImpl.calls.length, 0);
  });

  test('401 returns 503 (fail closed on bad key) with no retry', async () => {
    const fetchImpl = fakeFetch(() => errorResponse(401));
    await assert.rejects(
      anthropicLLM(ctx(), env, opts({ fetchImpl })),
      err => err instanceof GraderError && err.status === 503,
    );
    assert.equal(fetchImpl.calls.length, 1);
  });

  test('400 returns 502 and does not retry', async () => {
    const fetchImpl = fakeFetch(() => errorResponse(400));
    await assert.rejects(
      anthropicLLM(ctx(), env, opts({ fetchImpl })),
      err => err instanceof GraderError && err.status === 502,
    );
    assert.equal(fetchImpl.calls.length, 1);
  });

  test('transient 500 retries once, then succeeds', async () => {
    const c = ctx();
    const fetchImpl = fakeFetch(({ call }) => call === 1 ? errorResponse(500) : okResponse(wellFormedBody(c)));
    const raw = await anthropicLLM(c, env, opts({ fetchImpl }));
    assert.equal(raw.case_id, c.case_id);
    assert.equal(fetchImpl.calls.length, 2);
  });

  test('two consecutive 500s give up (bounded retry)', async () => {
    const fetchImpl = fakeFetch(() => errorResponse(503));
    await assert.rejects(
      anthropicLLM(ctx(), env, opts({ fetchImpl })),
      err => err instanceof GraderError && err.status === 502,
    );
    assert.equal(fetchImpl.calls.length, 2);
  });

  test('timeout on the first call retries once and can then succeed', async () => {
    const c = ctx();
    const fetchImpl = fakeFetch(({ init, call }) => {
      if (call === 1) {
        return new Promise((_, reject) => init.signal.addEventListener('abort', () => {
          const e = new Error('aborted'); e.name = 'AbortError'; reject(e);
        }));
      }
      return okResponse(wellFormedBody(c));
    });
    const raw = await anthropicLLM(c, env, opts({ fetchImpl, timeoutMs: 20 }));
    assert.equal(raw.case_id, c.case_id);
    assert.equal(fetchImpl.calls.length, 2);
  });

  test('two timeouts in a row throw GraderError 504', async () => {
    const fetchImpl = fakeFetch(({ init }) => new Promise((_, reject) => init.signal.addEventListener('abort', () => {
      const e = new Error('aborted'); e.name = 'AbortError'; reject(e);
    })));
    await assert.rejects(
      anthropicLLM(ctx(), env, opts({ fetchImpl, timeoutMs: 20 })),
      err => err instanceof GraderError && err.status === 504,
    );
  });

  test('429 from provider surfaces as 502 and does not retry', async () => {
    const fetchImpl = fakeFetch(() => errorResponse(429));
    await assert.rejects(
      anthropicLLM(ctx(), env, opts({ fetchImpl })),
      err => err instanceof GraderError && err.status === 502,
    );
    assert.equal(fetchImpl.calls.length, 1);
  });

  test('malformed JSON in response body throws 502 (no retry)', async () => {
    const fetchImpl = fakeFetch(() => ({
      ok: true, status: 200,
      json: async () => ({ content: [{ type: 'text', text: 'definitely not JSON' }], usage: { input_tokens: 10, output_tokens: 10 } }),
    }));
    await assert.rejects(
      anthropicLLM(ctx(), env, opts({ fetchImpl })),
      err => err instanceof GraderError && err.status === 502 && err.reason === 'malformed_json',
    );
    assert.equal(fetchImpl.calls.length, 1);
  });

  test('log line contains tokens, latency, and model but never the answer, feedback, or API key', async () => {
    const c = buildGradingContext('case-study-fotmob', 'SECRET_ANSWER_MARKER_8f3a ' + SAMPLE_ANSWER);
    const fetchImpl = fakeFetch(() => okResponse({
      content: [{ type: 'text', text: JSON.stringify({
        dimensions: c.dimensions.map(d => ({
          dimension: d.name, score: 2,
          evidence_quote: null,
          reasoning: 'FEEDBACK_MARKER_TEXT reasoning here.',
          improvement: 'FEEDBACK_MARKER_TEXT improvement here.',
        })),
        overall_comment: 'FEEDBACK_MARKER_TEXT overall',
      }) }],
      usage: { input_tokens: 123, output_tokens: 456 },
    }));
    const logger = captureLogger();
    await anthropicLLM(c, env, opts({ fetchImpl, logger }));
    assert.equal(logger.lines.length, 1);
    const line = logger.lines[0];
    const parsed = JSON.parse(line);
    assert.equal(parsed.input_tokens, 123);
    assert.equal(parsed.output_tokens, 456);
    assert.equal(parsed.model, MODEL_ID);
    assert.ok(typeof parsed.latency_ms === 'number' && parsed.latency_ms >= 0);
    assert.ok(!line.includes('SECRET_ANSWER_MARKER_8f3a'));
    assert.ok(!line.includes('FEEDBACK_MARKER_TEXT'));
    assert.ok(!line.includes(VALID_KEY));
    assert.ok(!line.includes('sk-ant'));
  });
});

// ---- Truncation and usage-on-failure ----

describe('truncation and failure accounting', () => {

  const ctx = () => buildGradingContext('case-study-swiggy', SAMPLE_ANSWER);
  const env = { ANTHROPIC_API_KEY: VALID_KEY };
  const opts = extra => ({ backoffMs: 0, timeoutMs: 100, logger: silentLogger, ...extra });

  test('MAX_OUTPUT_TOKENS is at least 3500 after the Swiggy fix', async () => {
    const { MAX_OUTPUT_TOKENS: ceiling } = await import('../src/anthropic-llm.js');
    assert.ok(ceiling >= 3500, `Expected ceiling >= 3500, got ${ceiling}`);
    const fetchImpl = fakeFetch(() => okResponse(wellFormedBody(ctx())));
    await anthropicLLM(ctx(), env, opts({ fetchImpl }));
    const sent = JSON.parse(fetchImpl.calls[0].init.body);
    assert.equal(sent.max_tokens, ceiling);
  });

  test('stop_reason="max_tokens" throws output_truncated with usage attached, no parse attempted', async () => {
    const fetchImpl = fakeFetch(() => ({
      ok: true, status: 200,
      json: async () => ({
        content: [{ type: 'text', text: '{"dimensions":[{"dimension":"Clarifying Questions","score":2,"evidence_quote":null,"reasoning":"half a sente' }],
        stop_reason: 'max_tokens',
        usage: { input_tokens: 2700, output_tokens: 3500 },
      }),
    }));
    try {
      await anthropicLLM(ctx(), env, opts({ fetchImpl }));
      assert.fail('should have thrown');
    } catch (err) {
      assert.ok(err instanceof GraderError, 'should be GraderError');
      assert.equal(err.status, 502);
      assert.equal(err.reason, 'output_truncated');
      assert.deepEqual(err.usage, { input_tokens: 2700, output_tokens: 3500 });
      assert.equal(err.stop_reason, 'max_tokens');
    }
    assert.equal(fetchImpl.calls.length, 1, 'no retry on truncation');
  });

  test('malformed JSON preserves usage and stop_reason on the thrown error', async () => {
    const fetchImpl = fakeFetch(() => ({
      ok: true, status: 200,
      json: async () => ({
        content: [{ type: 'text', text: 'definitely not JSON at all' }],
        stop_reason: 'end_turn',
        usage: { input_tokens: 2700, output_tokens: 180 },
      }),
    }));
    try {
      await anthropicLLM(ctx(), env, opts({ fetchImpl }));
      assert.fail('should have thrown');
    } catch (err) {
      assert.ok(err instanceof GraderError);
      assert.equal(err.reason, 'malformed_json');
      assert.deepEqual(err.usage, { input_tokens: 2700, output_tokens: 180 });
      assert.equal(err.stop_reason, 'end_turn');
    }
  });

  test('truncation log event names the failure and includes token counts (but not answer text)', async () => {
    const c = buildGradingContext('case-study-swiggy', 'UNIQUE_LEARNER_PHRASE_9z4j ' + SAMPLE_ANSWER);
    const fetchImpl = fakeFetch(() => ({
      ok: true, status: 200,
      json: async () => ({
        content: [{ type: 'text', text: '{"dimensions":[{"dimension":"X","score":2,"evidence_quote":null,"reasoning":"...' }],
        stop_reason: 'max_tokens',
        usage: { input_tokens: 2700, output_tokens: 3500 },
      }),
    }));
    const logger = captureLogger();
    try { await anthropicLLM(c, env, opts({ fetchImpl, logger })); } catch { /* expected */ }
    const line = logger.lines.find(l => l.includes('grade_llm_truncated'));
    assert.ok(line, 'expected a grade_llm_truncated log line');
    const parsed = JSON.parse(line);
    assert.equal(parsed.input_tokens, 2700);
    assert.equal(parsed.output_tokens, 3500);
    assert.ok(!line.includes('UNIQUE_LEARNER_PHRASE_9z4j'));
  });

  test('successful call log line now includes stop_reason', async () => {
    const c = ctx();
    const fetchImpl = fakeFetch(() => okResponse({
      ...wellFormedBody(c),
      stop_reason: 'end_turn',
    }));
    const logger = captureLogger();
    await anthropicLLM(c, env, opts({ fetchImpl, logger }));
    const line = logger.lines.find(l => l.includes('grade_llm_call'));
    assert.ok(line);
    assert.equal(JSON.parse(line).stop_reason, 'end_turn');
  });

  test('prompt asks for concise feedback (bounded output size)', () => {
    const prompt = buildPrompt(buildGradingContext('case-study-swiggy', SAMPLE_ANSWER));
    assert.match(prompt, /bounded output size|short sentences?/i);
  });
});
