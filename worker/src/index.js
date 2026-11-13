import { validateInput } from './validate.js';
import { buildGradingContext } from './context.js';
import { mockLLM } from './mock-llm.js';
import { validateAndEnrichResponse } from './schema.js';
import { checkRateLimit } from './rate-limit.js';

const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: CORS_HEADERS });
}

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

    // Rate limit hook — no-op stub; replaced with KV + Durable Object guard in Step 3
    const rl = await checkRateLimit(request, env);
    if (!rl.ok) {
      return json({ error: rl.error }, 429);
    }

    // Body size cap
    const contentLength = parseInt(request.headers.get('content-length') ?? '0', 10);
    if (contentLength > 50_000) {
      return json({ error: 'Request body too large' }, 413);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: 'Invalid JSON body' }, 400);
    }

    const validation = validateInput(body);
    if (!validation.ok) {
      return json({ error: validation.error }, 400);
    }

    const { case_id, answer, attempt, assisted } = validation.data;

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
