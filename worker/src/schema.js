// Validates and enriches the LLM response.
// total_score and max_total_score are always computed server-side — never trusted from LLM output.

function normalise(text) {
  return text.normalize('NFC').replace(/\s+/g, ' ').trim();
}

function isExactSubstring(quote, answer) {
  if (quote === null) return true;
  if (typeof quote !== 'string' || quote.trim() === '') return false;
  return normalise(answer).includes(normalise(quote));
}

export function validateAndEnrichResponse(raw, case_id, answer, attempt, assisted) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { ok: false, error: 'LLM response must be a JSON object' };
  }

  const { dimensions, overall_comment } = raw;

  if (!Array.isArray(dimensions) || dimensions.length === 0) {
    return { ok: false, error: 'dimensions must be a non-empty array' };
  }

  const validated = [];
  for (const dim of dimensions) {
    const { dimension, score, evidence_quote, reasoning, improvement } = dim;

    if (typeof dimension !== 'string' || dimension.trim() === '') {
      return { ok: false, error: `Missing dimension name in: ${JSON.stringify(dim)}` };
    }
    if (!Number.isInteger(score) || score < 1 || score > 3) {
      return { ok: false, error: `Score for "${dimension}" must be 1, 2, or 3 — got: ${JSON.stringify(score)}` };
    }
    if (evidence_quote !== null && typeof evidence_quote !== 'string') {
      return { ok: false, error: `evidence_quote for "${dimension}" must be a string or null` };
    }
    if (!isExactSubstring(evidence_quote, answer)) {
      return { ok: false, error: `evidence_quote for "${dimension}" is not an exact substring of the answer` };
    }
    if (typeof reasoning !== 'string' || reasoning.trim() === '') {
      return { ok: false, error: `reasoning for "${dimension}" is required` };
    }

    validated.push({
      dimension: dimension.trim(),
      score,
      max_score: 3,
      evidence_quote: evidence_quote ?? null,
      reasoning: reasoning.trim(),
      improvement: typeof improvement === 'string' ? improvement.trim() : null,
    });
  }

  const total_score = validated.reduce((sum, d) => sum + d.score, 0);
  const max_total_score = validated.length * 3;

  const response = {
    case_id,
    attempt,
    assisted,
    dimensions: validated,
    total_score,
    max_total_score,
    overall_comment: typeof overall_comment === 'string' ? overall_comment.trim() : '',
    graded_at: new Date().toISOString(),
  };

  if (raw._mock) {
    response._mock = true;
    response._mock_note = raw._mock_note;
  }

  return { ok: true, data: response };
}
