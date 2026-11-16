// Two-tier protection in front of the (future) paid LLM call.
//   1. KV: approximate per-client limits. KV is eventually consistent, so these can be
//      slightly exceeded under bursts. They deter abuse; they do not protect the budget.
//   2. Durable Object: exact global daily request cap. This is the budget guard.
// Fails closed: any missing binding, missing client address, or storage error blocks grading.
// Storage holds only keyed HMAC digests and counters. No raw IPs, no answers.

export const PER_IP_HOURLY_LIMIT = 10;
export const PER_IP_DAILY_LIMIT = 50;

const HOUR_MS = 3_600_000;
const DAY_MS = 86_400_000;
const MIN_SALT_LENGTH = 16;

function unavailable(reason) {
  // Reason codes only. Never log IPs, answers, or feedback.
  console.error('rate_limit_unavailable', reason);
  return {
    ok: false,
    status: 503,
    error: 'Grading is temporarily unavailable. Please try again later.',
  };
}

function limited(error, retryAfter) {
  return { ok: false, status: 429, error, retryAfter };
}

function missingBinding(env) {
  if (!env) return 'env';
  const kv = env.RATE_LIMIT_KV;
  if (!kv || typeof kv.get !== 'function' || typeof kv.put !== 'function') return 'kv_binding';
  const budget = env.GLOBAL_BUDGET;
  if (!budget || typeof budget.idFromName !== 'function' || typeof budget.get !== 'function') return 'budget_binding';
  if (typeof env.IP_HASH_SALT !== 'string' || env.IP_HASH_SALT.length < MIN_SALT_LENGTH) return 'ip_hash_salt';
  return null;
}

// IPv6 clients control a whole /64, so they are limited per /64 rather than per address.
export function rateLimitSubject(ip) {
  const mapped = /^::ffff:(\d{1,3}(?:\.\d{1,3}){3})$/i.exec(ip);
  if (mapped) return mapped[1];
  if (!ip.includes(':')) return ip;

  const [head, tail] = ip.split('::');
  const headParts = head ? head.split(':') : [];
  const tailParts = tail ? tail.split(':') : [];
  const groups = tail === undefined
    ? headParts
    : [...headParts, ...Array(Math.max(0, 8 - headParts.length - tailParts.length)).fill('0'), ...tailParts];
  return groups.slice(0, 4).map(g => (parseInt(g, 16) || 0).toString(16)).join(':') + '::/64';
}

async function hashSubject(subject, salt) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', encoder.encode(salt), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const digest = await crypto.subtle.sign('HMAC', key, encoder.encode(subject));
  return [...new Uint8Array(digest)].slice(0, 16).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function readCount(kv, key) {
  const raw = await kv.get(key);
  if (raw === null || raw === undefined) return 0;
  const count = Number(raw);
  if (!Number.isSafeInteger(count) || count < 0) throw new Error('corrupt_counter');
  return count;
}

export async function checkRateLimit(request, env, now = Date.now()) {
  const missing = missingBinding(env);
  if (missing) return unavailable(missing);

  // CF-Connecting-IP is set by Cloudflare's edge and overwrites any client-supplied value.
  // X-Forwarded-For and similar headers are client-controlled and are never read.
  const ip = request.headers.get('CF-Connecting-IP');
  if (!ip) return unavailable('client_address');

  const secondsToNextHour = Math.ceil((HOUR_MS - (now % HOUR_MS)) / 1000);
  const secondsToNextDay = Math.ceil((DAY_MS - (now % DAY_MS)) / 1000);

  try {
    const kv = env.RATE_LIMIT_KV;
    const subject = await hashSubject(rateLimitSubject(ip), env.IP_HASH_SALT);
    const iso = new Date(now).toISOString();
    const hourKey = `rl:h:${iso.slice(0, 13)}:${subject}`;
    const dayKey = `rl:d:${iso.slice(0, 10)}:${subject}`;

    const [hourCount, dayCount] = await Promise.all([readCount(kv, hourKey), readCount(kv, dayKey)]);

    if (dayCount >= PER_IP_DAILY_LIMIT) {
      return limited('You have reached the daily grading limit. Please try again tomorrow.', secondsToNextDay);
    }
    if (hourCount >= PER_IP_HOURLY_LIMIT) {
      return limited('You have reached the hourly grading limit. Please try again later.', secondsToNextHour);
    }

    const stub = env.GLOBAL_BUDGET.get(env.GLOBAL_BUDGET.idFromName('global'));
    const reservation = await stub.fetch(new Request('https://global-budget/reserve', { method: 'POST' }));
    if (!reservation.ok) return unavailable('budget_error');
    const { allowed } = await reservation.json();
    if (allowed !== true) {
      return limited('AI grading has reached its daily capacity. Please try again tomorrow.', secondsToNextDay);
    }

    await Promise.all([
      kv.put(hourKey, String(hourCount + 1), { expirationTtl: 2 * 3600 }),
      kv.put(dayKey, String(dayCount + 1), { expirationTtl: 48 * 3600 }),
    ]);

    return { ok: true };
  } catch (err) {
    return unavailable(err instanceof Error ? err.name : 'unknown');
  }
}
