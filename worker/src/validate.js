import GRADER_RUBRIC from '../../js/grader-rubric.js';

const PILOT_CASE_IDS = new Set(GRADER_RUBRIC.cases.map(c => c.caseId));
const MIN_WORDS = 120;
const MAX_WORDS = 1500;
const MAX_CHARS = 15_000;

function countWords(text) {
  return text.trim().split(/\s+/).filter(w => w.length > 0).length;
}

export function validateInput(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { ok: false, error: 'Request body must be a JSON object' };
  }

  const { case_id, answer, attempt, assisted } = body;

  if (!case_id || typeof case_id !== 'string') {
    return { ok: false, error: 'case_id is required and must be a string' };
  }
  if (!PILOT_CASE_IDS.has(case_id)) {
    return {
      ok: false,
      error: `case_id "${case_id}" is not in the pilot. Valid IDs: ${[...PILOT_CASE_IDS].join(', ')}`,
    };
  }

  if (typeof answer !== 'string' || answer.trim() === '') {
    return { ok: false, error: 'answer is required and must be a non-empty string' };
  }
  if (answer.length > MAX_CHARS) {
    return { ok: false, error: `Answer exceeds the ${MAX_CHARS.toLocaleString()}-character limit` };
  }
  const wordCount = countWords(answer);
  if (wordCount < MIN_WORDS) {
    return { ok: false, error: `Answer is too short (${wordCount} words). Minimum is ${MIN_WORDS} words.` };
  }
  if (wordCount > MAX_WORDS) {
    return { ok: false, error: `Answer is too long (${wordCount} words). Maximum is ${MAX_WORDS} words.` };
  }

  if (attempt !== undefined) {
    if (!Number.isInteger(attempt) || attempt < 1) {
      return { ok: false, error: 'attempt must be a positive integer' };
    }
  }

  if (assisted !== undefined && typeof assisted !== 'boolean') {
    return { ok: false, error: 'assisted must be a boolean' };
  }

  return {
    ok: true,
    data: {
      case_id,
      answer,
      attempt: attempt ?? 1,
      assisted: assisted ?? false,
      word_count: wordCount,
    },
  };
}
