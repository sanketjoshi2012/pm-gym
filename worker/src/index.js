import { validateInput } from './validate.js';
import { buildGradingContext } from './context.js';
import { mockLLM } from './mock-llm.js';
import { validateAndEnrichResponse } from './schema.js';
import { checkRateLimit } from './rate-limit.js';
import { readJsonBody } from './body.js';

const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), { status, headers: { ...CORS_HEADERS, ...extraHeaders } });
}

export { GlobalBudget } from './global-budget.js';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (url.pathname !== '/grade') {
      return json({ error: 'Not found' }, 404);
    }

    if (request.method !== 'POST') {
      return json({ error: 'Method not allowed' }, 405);
    }

    const parsed = await readJsonBody(request);
    if (!parsed.ok) {
      return parsed.status === 413
        ? json({ error: 'Request body too large' }, 413)
        : json({ error: 'Invalid JSON body' }, 400);
    }

    const validation = validateInput(parsed.body);
    if (!validation.ok) {
      return json({ error: validation.error }, 400);
    }

    const { case_id, answer, attempt, assisted } = validation.data;

    // Runs after validation so rejected requests never consume the global budget,
    // and immediately before the LLM call so nothing billable can bypass it.
    const rl = await checkRateLimit(request, env);
    if (!rl.ok) {
      const extra = rl.retryAfter ? { 'Retry-After': String(rl.retryAfter) } : {};
      return json({ error: rl.error }, rl.status, extra);
    }

    const context = buildGradingContext(case_id, answer);
    const rawFeedback = await mockLLM(context);
    const result = validateAndEnrichResponse(rawFeedback, case_id, answer, attempt, assisted);

    if (!result.ok) {
      // LLM returned invalid schema — in production this would trigger a retry
      return json({ error: 'Grading service error', detail: result.error }, 502);
    }

    return json(result.data);
  },
};
