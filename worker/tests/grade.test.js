import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { validateInput } from '../src/validate.js';
import { buildGradingContext } from '../src/context.js';
import { mockLLM } from '../src/mock-llm.js';
import { validateAndEnrichResponse } from '../src/schema.js';

// ---- Helpers ----

function makeWords(n) {
  return Array.from({ length: n }, (_, i) => `word${i}`).join(' ');
}

const PILOT_CASE_IDS = [
  'case-study-fotmob',
  'case-study-cricbuzz',
  'case-study-spotify',
  'case-study-swiggy',
];

const VALID_ANSWER = makeWords(200);

// ---- validateInput ----

describe('validateInput', () => {

  test('accepts a valid request for all 4 pilot case IDs', () => {
    for (const id of PILOT_CASE_IDS) {
      const result = validateInput({ case_id: id, answer: VALID_ANSWER });
      assert.ok(result.ok, `Expected ok for ${id}, got: ${result.error}`);
      assert.equal(result.data.case_id, id);
      assert.equal(result.data.word_count, 200);
      assert.equal(result.data.attempt, 1);
      assert.equal(result.data.assisted, false);
    }
  });

  test('rejects an invalid case_id', () => {
    const result = validateInput({ case_id: 'case-study-unknown', answer: VALID_ANSWER });
    assert.ok(!result.ok);
    assert.match(result.error, /not in the pilot/);
  });

  test('rejects a missing case_id', () => {
    const result = validateInput({ answer: VALID_ANSWER });
    assert.ok(!result.ok);
    assert.match(result.error, /case_id/);
  });

  test('rejects an answer below 120 words', () => {
    const result = validateInput({ case_id: 'case-study-fotmob', answer: makeWords(119) });
    assert.ok(!result.ok);
    assert.match(result.error, /too short/);
  });

  test('accepts an answer of exactly 120 words', () => {
    const result = validateInput({ case_id: 'case-study-fotmob', answer: makeWords(120) });
    assert.ok(result.ok);
  });

  test('accepts an answer of exactly 1500 words', () => {
    const result = validateInput({ case_id: 'case-study-fotmob', answer: makeWords(1500) });
    assert.ok(result.ok);
  });

  test('rejects an answer above 1500 words', () => {
    const result = validateInput({ case_id: 'case-study-fotmob', answer: makeWords(1501) });
    assert.ok(!result.ok);
    assert.match(result.error, /too long/);
  });

  test('rejects an answer exceeding 15,000 characters', () => {
    const result = validateInput({ case_id: 'case-study-fotmob', answer: 'x'.repeat(15_001) });
    assert.ok(!result.ok);
    assert.match(result.error, /character limit/);
  });

  test('rejects a missing answer', () => {
    const result = validateInput({ case_id: 'case-study-fotmob' });
    assert.ok(!result.ok);
    assert.match(result.error, /answer/);
  });

  test('rejects an empty answer', () => {
    const result = validateInput({ case_id: 'case-study-fotmob', answer: '   ' });
    assert.ok(!result.ok);
  });

  test('rejects attempt that is not a positive integer', () => {
    const base = { case_id: 'case-study-fotmob', answer: VALID_ANSWER };
    assert.ok(!validateInput({ ...base, attempt: 0 }).ok);
    assert.ok(!validateInput({ ...base, attempt: -1 }).ok);
    assert.ok(!validateInput({ ...base, attempt: 1.5 }).ok);
  });

  test('rejects assisted that is not a boolean', () => {
    const result = validateInput({ case_id: 'case-study-fotmob', answer: VALID_ANSWER, assisted: 'yes' });
    assert.ok(!result.ok);
    assert.match(result.error, /assisted/);
  });

  test('passes through attempt and assisted when valid', () => {
    const result = validateInput({ case_id: 'case-study-fotmob', answer: VALID_ANSWER, attempt: 3, assisted: true });
    assert.ok(result.ok);
    assert.equal(result.data.attempt, 3);
    assert.equal(result.data.assisted, true);
  });
});

// ---- buildGradingContext ----

describe('buildGradingContext', () => {

  test('returns scenario, questions, and dimensions — no model answer', () => {
    for (const id of PILOT_CASE_IDS) {
      const ctx = buildGradingContext(id, VALID_ANSWER);
      assert.ok(ctx.scenario.context, `Missing scenario context for ${id}`);
      assert.ok(Array.isArray(ctx.scenario.questions) && ctx.scenario.questions.length > 0, `Missing questions for ${id}`);
      assert.ok(Array.isArray(ctx.dimensions) && ctx.dimensions.length > 0, `Missing dimensions for ${id}`);
      assert.ok(Array.isArray(ctx.universalRules));
      assert.ok(!JSON.stringify(ctx).includes('modelAnswer'), `modelAnswer leaked into context for ${id}`);
    }
  });

  test('each dimension has all three score anchors', () => {
    for (const id of PILOT_CASE_IDS) {
      const { dimensions } = buildGradingContext(id, VALID_ANSWER);
      for (const dim of dimensions) {
        assert.ok(dim.score_3?.length > 0, `Missing score_3 for ${dim.name} in ${id}`);
        assert.ok(dim.score_2?.length > 0, `Missing score_2 for ${dim.name} in ${id}`);
        assert.ok(dim.score_1?.length > 0, `Missing score_1 for ${dim.name} in ${id}`);
      }
    }
  });

  test('includes the learner answer', () => {
    const ctx = buildGradingContext('case-study-fotmob', VALID_ANSWER);
    assert.equal(ctx.answer, VALID_ANSWER);
  });
});

// ---- mockLLM ----

describe('mockLLM', () => {

  test('returns MOCK markers', async () => {
    const ctx = buildGradingContext('case-study-fotmob', VALID_ANSWER);
    const result = await mockLLM(ctx);
    assert.equal(result._mock, true);
    assert.ok(typeof result._mock_note === 'string' && result._mock_note.length > 0);
  });

  test('returns a dimension for every rubric dimension', async () => {
    for (const id of PILOT_CASE_IDS) {
      const ctx = buildGradingContext(id, VALID_ANSWER);
      const result = await mockLLM(ctx);
      assert.equal(result.dimensions.length, ctx.dimensions.length, `Wrong dimension count for ${id}`);
    }
  });

  test('every score is 1, 2, or 3', async () => {
    const ctx = buildGradingContext('case-study-swiggy', VALID_ANSWER);
    const result = await mockLLM(ctx);
    for (const dim of result.dimensions) {
      assert.ok([1, 2, 3].includes(dim.score), `Score out of range for ${dim.dimension}: ${dim.score}`);
    }
  });

  test('every evidence_quote is an exact substring of the answer or null', async () => {
    const ctx = buildGradingContext('case-study-fotmob', VALID_ANSWER);
    const result = await mockLLM(ctx);
    const normedAnswer = VALID_ANSWER.normalize('NFC').replace(/\s+/g, ' ').trim();
    for (const dim of result.dimensions) {
      if (dim.evidence_quote !== null) {
        const normed = dim.evidence_quote.normalize('NFC').replace(/\s+/g, ' ').trim();
        assert.ok(normedAnswer.includes(normed), `evidence_quote not in answer for ${dim.dimension}`);
      }
    }
  });
});

// ---- validateAndEnrichResponse ----

describe('validateAndEnrichResponse', () => {

  function makeRawDims(n, answer) {
    const words = answer.split(' ');
    return Array.from({ length: n }, (_, i) => ({
      dimension: `Dimension ${i + 1}`,
      score: (i % 3) + 1,
      evidence_quote: i % 3 === 2 ? null : words.slice(i * 2, i * 2 + 5).join(' '),
      reasoning: `Reasoning for dimension ${i + 1}.`,
      improvement: `Improvement for dimension ${i + 1}.`,
    }));
  }

  test('computes total_score and max_total_score server-side', () => {
    const raw = { dimensions: makeRawDims(5, VALID_ANSWER), overall_comment: 'Overall.' };
    const result = validateAndEnrichResponse(raw, 'case-study-fotmob', VALID_ANSWER, 1, false);
    assert.ok(result.ok, result.error);
    const expectedTotal = raw.dimensions.reduce((s, d) => s + d.score, 0);
    assert.equal(result.data.total_score, expectedTotal);
    assert.equal(result.data.max_total_score, 15);
  });

  test('ignores any total_score supplied by the LLM', () => {
    const raw = { total_score: 999, max_total_score: 999, dimensions: makeRawDims(5, VALID_ANSWER) };
    const result = validateAndEnrichResponse(raw, 'case-study-fotmob', VALID_ANSWER, 1, false);
    assert.ok(result.ok, result.error);
    assert.notEqual(result.data.total_score, 999);
  });

  test('rejects score outside 1-3 range', () => {
    const raw = { dimensions: [{ dimension: 'D1', score: 4, evidence_quote: null, reasoning: 'ok' }] };
    const result = validateAndEnrichResponse(raw, 'case-study-fotmob', VALID_ANSWER, 1, false);
    assert.ok(!result.ok);
    assert.match(result.error, /must be 1, 2, or 3/);
  });

  test('rejects score of 0', () => {
    const raw = { dimensions: [{ dimension: 'D1', score: 0, evidence_quote: null, reasoning: 'ok' }] };
    assert.ok(!validateAndEnrichResponse(raw, 'case-study-fotmob', VALID_ANSWER, 1, false).ok);
  });

  test('rejects evidence_quote that is not a substring of the answer', () => {
    const raw = {
      dimensions: [{ dimension: 'D1', score: 2, evidence_quote: 'XYZNOTINANSWERXYZ', reasoning: 'ok' }],
    };
    const result = validateAndEnrichResponse(raw, 'case-study-fotmob', VALID_ANSWER, 1, false);
    assert.ok(!result.ok);
    assert.match(result.error, /not an exact substring/);
  });

  test('accepts evidence_quote that is an exact substring of the answer', () => {
    const answer = 'First sentence here. Second sentence here. Third sentence here. ' + makeWords(100);
    const raw = {
      dimensions: [{ dimension: 'D1', score: 2, evidence_quote: 'Second sentence here.', reasoning: 'Found.' }],
    };
    assert.ok(validateAndEnrichResponse(raw, 'case-study-fotmob', answer, 1, false).ok);
  });

  test('accepts null evidence_quote', () => {
    const raw = { dimensions: [{ dimension: 'D1', score: 1, evidence_quote: null, reasoning: 'Nothing.' }] };
    const result = validateAndEnrichResponse(raw, 'case-study-fotmob', VALID_ANSWER, 1, false);
    assert.ok(result.ok, result.error);
    assert.equal(result.data.dimensions[0].evidence_quote, null);
  });

  test('rejects empty reasoning', () => {
    const raw = { dimensions: [{ dimension: 'D1', score: 2, evidence_quote: null, reasoning: '' }] };
    const result = validateAndEnrichResponse(raw, 'case-study-fotmob', VALID_ANSWER, 1, false);
    assert.ok(!result.ok);
    assert.match(result.error, /reasoning/);
  });

  test('includes case_id, attempt, assisted, and graded_at in output', () => {
    const raw = { dimensions: [{ dimension: 'D1', score: 3, evidence_quote: null, reasoning: 'Strong.' }] };
    const result = validateAndEnrichResponse(raw, 'case-study-spotify', VALID_ANSWER, 2, true);
    assert.ok(result.ok, result.error);
    assert.equal(result.data.case_id, 'case-study-spotify');
    assert.equal(result.data.attempt, 2);
    assert.equal(result.data.assisted, true);
    assert.ok(typeof result.data.graded_at === 'string');
  });

  test('propagates _mock flag and _mock_note from raw response', () => {
    const raw = {
      _mock: true,
      _mock_note: 'test note',
      dimensions: [{ dimension: 'D1', score: 2, evidence_quote: null, reasoning: 'mock.' }],
    };
    const result = validateAndEnrichResponse(raw, 'case-study-fotmob', VALID_ANSWER, 1, false);
    assert.ok(result.ok, result.error);
    assert.equal(result.data._mock, true);
    assert.equal(result.data._mock_note, 'test note');
  });
});

// ---- End-to-end: mockLLM output passes validateAndEnrichResponse for all 4 cases ----

describe('end-to-end mock grading', () => {

  test('mock output validates for all 4 pilot cases', async () => {
    for (const id of PILOT_CASE_IDS) {
      const ctx = buildGradingContext(id, VALID_ANSWER);
      const raw = await mockLLM(ctx);
      const result = validateAndEnrichResponse(raw, id, VALID_ANSWER, 1, false);
      assert.ok(result.ok, `Validation failed for ${id}: ${result.error}`);
      assert.equal(result.data._mock, true);
      assert.equal(result.data.case_id, id);
      assert.ok(result.data.total_score > 0);
      assert.ok(result.data.total_score <= result.data.max_total_score);
    }
  });

  test('mock response has correct dimension count for each case', async () => {
    const expectedDimensions = {
      'case-study-fotmob': 5,
      'case-study-cricbuzz': 5,
      'case-study-spotify': 5,
      'case-study-swiggy': 6,
    };
    for (const id of PILOT_CASE_IDS) {
      const ctx = buildGradingContext(id, VALID_ANSWER);
      const raw = await mockLLM(ctx);
      const result = validateAndEnrichResponse(raw, id, VALID_ANSWER, 1, false);
      assert.ok(result.ok, result.error);
      assert.equal(result.data.dimensions.length, expectedDimensions[id], `Wrong count for ${id}`);
      assert.equal(result.data.max_total_score, expectedDimensions[id] * 3);
    }
  });
});
