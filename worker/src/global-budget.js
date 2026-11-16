// Durable Object holding the global daily grading-request counter.
// A single instance serialises every reservation, so the cap cannot be exceeded under concurrency.
// It caps the NUMBER of grading requests per UTC day. It is not a currency spending cap.
// Stores only { day, count }. No answers, no IP addresses.

export const DEFAULT_GLOBAL_DAILY_CAP = 20;

export function parseGlobalDailyCap(raw) {
  if (raw === undefined || raw === null || raw === '') return DEFAULT_GLOBAL_DAILY_CAP;
  const text = String(raw).trim();
  if (!/^\d+$/.test(text)) return null;
  const cap = Number(text);
  return Number.isSafeInteger(cap) && cap > 0 ? cap : null;
}

export class GlobalBudget {
  constructor(state, env) {
    this.state = state;
    this.env = env;
    this.now = () => Date.now();
    this.day = null;
    this.count = 0;
    this.ready = state.blockConcurrencyWhile(async () => {
      const stored = await state.storage.get('counter');
      if (stored && typeof stored.day === 'string' && Number.isSafeInteger(stored.count) && stored.count >= 0) {
        this.day = stored.day;
        this.count = stored.count;
      }
    });
  }

  async fetch(request) {
    if (request.method !== 'POST') {
      return Response.json({ error: 'method_not_allowed' }, { status: 405 });
    }
    await this.ready;

    const cap = parseGlobalDailyCap(this.env.GLOBAL_DAILY_CAP);
    if (cap === null) {
      return Response.json({ error: 'invalid_cap' }, { status: 500 });
    }

    // Check and increment run synchronously with no await in between,
    // so two requests can never both observe the same remaining slot.
    const today = new Date(this.now()).toISOString().slice(0, 10);
    if (this.day !== today) {
      this.day = today;
      this.count = 0;
    }
    if (this.count >= cap) {
      return Response.json({ allowed: false });
    }
    this.count += 1;

    await this.state.storage.put('counter', { day: this.day, count: this.count });
    return Response.json({ allowed: true });
  }
}
