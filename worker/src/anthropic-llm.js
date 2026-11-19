// Real LLM adapter backed by Anthropic's Messages API.
// Returns the same feedback shape as mock-llm.js so schema.js and index.js do not care which runs.
// Throws GraderError on failure so the caller can pick the right HTTP status.
//
// Never logs answer text, feedback text, or the API key.

export const MODEL_ID = 'claude-haiku-5-5';
export const API_URL = 'https://api.anthropic.com/v1/messages';
export const API_VERSION = '2023-06-01';
// Bumped from 2500 after Swiggy (6 dimensions) truncated at 2500 in the first smoke test.
// 3500 gives 6-dimension cases ~580 tokens per dimension, comfortably above the ~400 observed on 5-dim strong answers.
export const MAX_OUTPUT_TOKENS = 3500;
export const DEFAULT_TIMEOUT_MS = 15_000;
export const DEFAULT_BACKOFF_MS = 500;
const MIN_KEY_LENGTH = 20;

export class GraderError extends Error {
  constructor(status, reason, userMessage, meta = {}) {
    super(reason);
    this.name = 'GraderError';
    this.status = status;
    this.reason = reason;
    this.userMessage = userMessage;
    // Optional provider metadata attached so the caller can record cost even on failures.
    this.usage = meta.usage ?? null;
    this.stop_reason = meta.stop_reason ?? null;
  }
}

const unavailable = (reason, meta) => new GraderError(503, reason, 'Grading is temporarily unavailable. Please try again later.', meta);
const upstream = (reason, meta) => new GraderError(502, reason, 'Grading service error', meta);
const timeout = () => new GraderError(504, 'timeout', 'Grading timed out. Please try again.');

export function buildPrompt(context) {
  const { title, scenario, dimensions, notes, universalRules, answer } = context;
  const rules = universalRules.map((r, i) => `${i + 1}. ${r}`).join('\n');
  const questions = scenario.questions.map((q, i) => `${i + 1}. ${q}`).join('\n');
  const rubric = dimensions.map(d =>
    `- ${d.name}\n  Score 3: ${d.score_3}\n  Score 2: ${d.score_2}\n  Score 1: ${d.score_1}`,
  ).join('\n\n');
  const notesBlock = notes ? `\n\nCase-specific notes:\n${notes}` : '';
  const dimensionNames = dimensions.map(d => `"${d.name}"`).join(', ');

  return `You are grading a product management case study answer against a rubric.

Case: ${title}

Scenario:
${scenario.context}

Questions the candidate was asked:
${questions}

Scoring dimensions (score each as 1, 2, or 3):

${rubric}${notesBlock}

Universal scoring rules:
${rules}

Additional scoring guidance:
- Use the full 1 to 3 range. Do not default to 2 when 1 or 3 is warranted.
- Reflect real differences between dimensions. If one is clearly stronger or weaker than the others, that must show in the scores.
- Keep each reasoning to 2 short sentences and each improvement to 1 short sentence. The feedback must complete within a bounded output size.

The candidate's answer:
<answer>
${answer}
</answer>

Return JSON only. No prose before or after. No markdown fences. Use this exact shape:

{
  "dimensions": [
    {
      "dimension": "<exact dimension name, one of: ${dimensionNames}>",
      "score": <integer 1, 2, or 3>,
      "evidence_quote": "<exact substring copied verbatim from the candidate's answer that supports your score, or null>",
      "reasoning": "<2 to 3 sentences on what the answer actually demonstrates for this dimension>",
      "improvement": "<1 to 2 sentences naming the single specific change that would raise this dimension's score>"
    }
  ],
  "overall_comment": "<one sentence summarising the strongest and weakest aspect>"
}

Rules:
- Return one entry per dimension, in the order listed above.
- Every evidence_quote must be an exact substring of the candidate's answer, copied verbatim, or null.
- Grade only what the candidate actually demonstrates. Do not reward length, framework name-dropping, or terminology.
- Accept unconventional but well-supported solutions.
- Scores must be integers 1, 2, or 3. No other values.`;
}

export function extractJsonBlock(text) {
  const trimmed = text.trim();
  if (trimmed.startsWith('{')) return trimmed;
  const fenced = /```(?:json)?\s*(\{[\s\S]*?\})\s*```/.exec(trimmed);
  if (fenced) return fenced[1];
  const first = trimmed.indexOf('{');
  const last = trimmed.lastIndexOf('}');
  if (first >= 0 && last > first) return trimmed.slice(first, last + 1);
  return trimmed;
}

export function parseAnthropicResponse(apiBody, context) {
  if (!apiBody || !Array.isArray(apiBody.content)) throw upstream('malformed_api_response');
  const textPart = apiBody.content.find(p => p && p.type === 'text' && typeof p.text === 'string');
  if (!textPart) throw upstream('no_text_block');

  let parsed;
  try {
    parsed = JSON.parse(extractJsonBlock(textPart.text));
  } catch {
    throw upstream('malformed_json');
  }
  if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.dimensions)) {
    throw upstream('malformed_json');
  }

  return {
    case_id: context.case_id,
    dimensions: parsed.dimensions,
    overall_comment: typeof parsed.overall_comment === 'string' ? parsed.overall_comment : '',
    _provider: 'anthropic',
    _model: MODEL_ID,
    _usage: apiBody.usage ?? null,
  };
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function singleCall(apiKey, prompt, fetchImpl, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl(API_URL, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': API_VERSION,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL_ID,
        max_tokens: MAX_OUTPUT_TOKENS,
        messages: [{ role: 'user', content: prompt }],
      }),
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timer);
  }
}

export async function anthropicLLM(context, env, options = {}) {
  const { fetchImpl = globalThis.fetch, clock = Date.now, timeoutMs = DEFAULT_TIMEOUT_MS, backoffMs = DEFAULT_BACKOFF_MS, logger = console } = options;

  const apiKey = env?.ANTHROPIC_API_KEY;
  if (typeof apiKey !== 'string' || apiKey.length < MIN_KEY_LENGTH) throw unavailable('api_key_missing');

  const prompt = buildPrompt(context);
  const started = clock();

  for (let attempt = 1; attempt <= 2; attempt++) {
    let response;
    try {
      response = await singleCall(apiKey, prompt, fetchImpl, timeoutMs);
    } catch (err) {
      const isTimeout = err && (err.name === 'AbortError' || err.message === 'aborted');
      if (attempt === 1) {
        if (backoffMs > 0) await sleep(backoffMs);
        continue;
      }
      throw isTimeout ? timeout() : upstream('network_error');
    }

    if (response.status >= 500 && attempt === 1) {
      if (backoffMs > 0) await sleep(backoffMs);
      continue;
    }
    if (response.status === 401 || response.status === 403) throw unavailable(`api_${response.status}`);
    if (response.status === 429) throw upstream('api_429');
    if (!response.ok) throw upstream(`api_${response.status}`);

    let body;
    try {
      body = await response.json();
    } catch {
      throw upstream('api_json_parse');
    }

    const usage = body.usage ?? null;
    const stop_reason = body.stop_reason ?? null;
    const meta = { usage, stop_reason };

    // Truncation check BEFORE parse: stop_reason === "max_tokens" means the model ran into
    // the output ceiling and the JSON is almost certainly incomplete. Fail fast with a
    // distinct reason, preserving usage so the caller can record the cost of the truncated call.
    if (stop_reason === 'max_tokens') {
      logger.log(JSON.stringify({
        event: 'grade_llm_truncated',
        provider: 'anthropic', model: MODEL_ID, case_id: context.case_id,
        input_tokens: usage?.input_tokens ?? null,
        output_tokens: usage?.output_tokens ?? null,
        latency_ms: clock() - started, attempt, status: response.status,
      }));
      throw upstream('output_truncated', meta);
    }

    let feedback;
    try {
      feedback = parseAnthropicResponse(body, context);
    } catch (err) {
      if (err instanceof GraderError) {
        err.usage = usage;
        err.stop_reason = stop_reason;
        logger.log(JSON.stringify({
          event: 'grade_llm_parse_fail',
          provider: 'anthropic', model: MODEL_ID, case_id: context.case_id,
          reason: err.reason, stop_reason,
          input_tokens: usage?.input_tokens ?? null,
          output_tokens: usage?.output_tokens ?? null,
          latency_ms: clock() - started, attempt, status: response.status,
        }));
      }
      throw err;
    }

    const latency_ms = clock() - started;

    logger.log(JSON.stringify({
      event: 'grade_llm_call',
      provider: 'anthropic',
      model: MODEL_ID,
      case_id: context.case_id,
      input_tokens: usage?.input_tokens ?? null,
      output_tokens: usage?.output_tokens ?? null,
      stop_reason,
      latency_ms,
      attempt,
      status: response.status,
    }));

    return feedback;
  }

  throw upstream('retry_exhausted');
}
