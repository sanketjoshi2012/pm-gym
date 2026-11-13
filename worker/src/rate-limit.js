// No-op stub. Replaced with KV burst limiter + Durable Object budget guard in Step 3.
// Signature is fixed so the caller in index.js needs no changes when this is swapped out.
export async function checkRateLimit(_request, _env) {
  return { ok: true };
}
