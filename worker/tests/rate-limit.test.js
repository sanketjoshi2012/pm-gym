import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import worker from '../src/index.js';
import { checkRateLimit, rateLimitSubject, PER_IP_HOURLY_LIMIT, PER_IP_DAILY_LIMIT } from '../src/rate-limit.js';
import { GlobalBudget, parseGlobalDailyCap, DEFAULT_GLOBAL_DAILY_CAP } from '../src/global-budget.js';

// ---- Fakes ----

const tick = () => new Promise(resolve => setImmediate(resolve));

class FakeKV {
  constructor() {
    this.store = new Map();
    this.failGet = false;
    this.failPut = false;
  }
  async get(key) {
    await tick();
    if (this.failGet) throw new Error('kv get failed');
    return this.store.has(key) ? this.store.get(key) : null;
  }
  async put(key, value) {
    await tick();
    if (this.failPut) throw new Error('kv put failed');
    this.store.set(key, value);
  }
}

class FakeStorage {
  constructor() {
    this.data = new Map();
    this.failPut = false;
  }
  async get(key) {
    await tick();
    return this.data.get(key);
  }
  async put(key, value) {
    await tick();
    if (this.failPut) throw new Error('storage put failed');
    this.data.set(key, structuredClone(value));
  }
}

function makeBudget({ cap, storage = new FakeStorage(), clock } = {}) {
  const state = { storage, blockConcurrencyWhile: fn => fn() };
  const budget = new GlobalBudget(state, cap === undefined ? {} : { GLOBAL_DAILY_CAP: cap });
  if (clock) budget.now = clock;
  return budget;
}

function makeNamespace(budget) {
  return {
    idFromName: name => name,
    get: () => ({ fetch: req => budget.fetch(req) }),
  };
}

const SALT = 'test-salt-that-is-long-enough';
const T0 = Date.UTC(2026, 10, 16, 9, 30, 0);

function makeEnv({ cap = '1000', clock } = {}) {
  const kv = new FakeKV();
  const storage = new FakeStorage();
  const budget = makeBudget({ cap, storage, clock });
  return { RATE_LIMIT_KV: kv, GLOBAL_BUDGET: makeNamespace(budget), IP_HASH_SALT: SALT, LLM_PROVIDER: 'mock', _kv: kv, _storage: storage, _budget: budget };
}

function req(ip, extraHeaders = {}) {
  const headers = { ...extraHeaders };
  if (ip) headers['CF-Connecting-IP'] = ip;
  return new Request('https://grader.test/grade', { method: 'POST', headers });
}

const reserve = budget => budget.fetch(new Request('https://global-budget/reserve', { method: 'POST' })).then(r => r.json());

function quiet(fn) {
  return async () => {
    const original = console.error;
    console.error = () => {};
    try { await fn(); } finally { console.error = original; }
  };
}

// ---- Per-IP limits (KV) ----

describe('per-IP limits', () => {

  test('allows 10 requests in an hour and blocks the 11th with 429', async () => {
    const env = makeEnv();
    for (let i = 0; i < PER_IP_HOURLY_LIMIT; i++) {
      assert.equal((await checkRateLimit(req('203.0.113.7'), env, T0)).ok, true, `request ${i + 1}`);
    }
    const blocked = await checkRateLimit(req('203.0.113.7'), env, T0);
    assert.equal(blocked.ok, false);
    assert.equal(blocked.status, 429);
    assert.match(blocked.error, /hourly/);
    assert.equal(blocked.retryAfter, 1800);
  });

  test('hourly limit resets in the next hour', async () => {
    const env = makeEnv();
    for (let i = 0; i < PER_IP_HOURLY_LIMIT; i++) await checkRateLimit(req('203.0.113.7'), env, T0);
    assert.equal((await checkRateLimit(req('203.0.113.7'), env, T0)).ok, false);
    assert.equal((await checkRateLimit(req('203.0.113.7'), env, T0 + 3_600_000)).ok, true);
  });

  test('one client hitting the limit does not block another', async () => {
    const env = makeEnv();
    for (let i = 0; i < PER_IP_HOURLY_LIMIT; i++) await checkRateLimit(req('203.0.113.7'), env, T0);
    assert.equal((await checkRateLimit(req('198.51.100.9'), env, T0)).ok, true);
  });

  test('allows 50 requests in a day and blocks the 51st with 429', async () => {
    const env = makeEnv();
    const dayStart = Date.UTC(2026, 10, 16, 0, 0, 0);
    let allowed = 0;
    for (let hour = 0; hour < 5; hour++) {
      for (let i = 0; i < PER_IP_HOURLY_LIMIT; i++) {
        if ((await checkRateLimit(req('203.0.113.7'), env, dayStart + hour * 3_600_000)).ok) allowed++;
      }
    }
    assert.equal(allowed, PER_IP_DAILY_LIMIT);
    const blocked = await checkRateLimit(req('203.0.113.7'), env, dayStart + 6 * 3_600_000);
    assert.equal(blocked.status, 429);
    assert.match(blocked.error, /daily/);
    assert.equal((await checkRateLimit(req('203.0.113.7'), env, dayStart + 86_400_000)).ok, true);
  });

  test('a blocked per-IP request does not consume global budget', async () => {
    const env = makeEnv();
    for (let i = 0; i < PER_IP_HOURLY_LIMIT + 5; i++) await checkRateLimit(req('203.0.113.7'), env, T0);
    assert.equal(env._budget.count, PER_IP_HOURLY_LIMIT);
  });

  test('ignores client-supplied forwarding headers', async () => {
    const env = makeEnv();
    for (let i = 0; i < PER_IP_HOURLY_LIMIT; i++) {
      await checkRateLimit(req('203.0.113.7', { 'X-Forwarded-For': `10.0.0.${i}`, 'X-Real-IP': `10.0.1.${i}` }), env, T0);
    }
    const blocked = await checkRateLimit(req('203.0.113.7', { 'X-Forwarded-For': '10.9.9.9' }), env, T0);
    assert.equal(blocked.status, 429);
  });

  test('IPv6 addresses in the same /64 share one limit', async () => {
    assert.equal(rateLimitSubject('2001:db8:1:2:aaaa::1'), rateLimitSubject('2001:0db8:0001:0002:bbbb:cccc:dddd:eeee'));
    assert.notEqual(rateLimitSubject('2001:db8:1:2::1'), rateLimitSubject('2001:db8:1:3::1'));
    assert.equal(rateLimitSubject('::ffff:203.0.113.7'), '203.0.113.7');
  });

  test('storage contains no raw IP addresses', async () => {
    const env = makeEnv();
    await checkRateLimit(req('203.0.113.7'), env, T0);
    await checkRateLimit(req('2001:db8:1:2::1'), env, T0);
    const dump = JSON.stringify([[...env._kv.store.entries()], [...env._storage.data.entries()]]);
    assert.ok(!dump.includes('203.0.113'));
    assert.ok(!dump.includes('2001:db8'));
    for (const value of env._kv.store.values()) assert.match(value, /^\d+$/);
    assert.deepEqual([...env._storage.data.keys()], ['counter']);
    assert.deepEqual(Object.keys(env._storage.data.get('counter')).sort(), ['count', 'day']);
  });
});

// ---- Global cap (Durable Object) ----

describe('global daily cap', () => {

  test('uses a conservative default and rejects invalid configuration', () => {
    assert.equal(parseGlobalDailyCap(undefined), DEFAULT_GLOBAL_DAILY_CAP);
    assert.equal(parseGlobalDailyCap('75'), 75);
    for (const bad of ['0', '-5', 'abc', '1.5', '1e9', 'Infinity']) {
      assert.equal(parseGlobalDailyCap(bad), null, bad);
    }
  });

  test('allows exactly the cap, then denies', async () => {
    const budget = makeBudget({ cap: '3' });
    const results = [];
    for (let i = 0; i < 5; i++) results.push((await reserve(budget)).allowed);
    assert.deepEqual(results, [true, true, true, false, false]);
  });

  test('100 concurrent reservations never exceed the cap', async () => {
    const budget = makeBudget({ cap: '7' });
    const results = await Promise.all(Array.from({ length: 100 }, () => reserve(budget)));
    assert.equal(results.filter(r => r.allowed).length, 7);
    assert.equal(budget.count, 7);
  });

  test('count survives a restart of the object', async () => {
    const storage = new FakeStorage();
    const first = makeBudget({ cap: '2', storage, clock: () => T0 });
    await reserve(first);
    await reserve(first);
    const second = makeBudget({ cap: '2', storage, clock: () => T0 });
    assert.equal((await reserve(second)).allowed, false);
  });

  test('resets on the next UTC day', async () => {
    let now = T0;
    const budget = makeBudget({ cap: '1', clock: () => now });
    assert.equal((await reserve(budget)).allowed, true);
    assert.equal((await reserve(budget)).allowed, false);
    now = T0 + 86_400_000;
    assert.equal((await reserve(budget)).allowed, true);
  });

  test('worker returns 429 once the global cap is reached, across different clients', async () => {
    const env = makeEnv({ cap: '3' });
    const results = [];
    for (let i = 0; i < 5; i++) results.push(await checkRateLimit(req(`198.51.100.${i}`), env, T0));
    assert.deepEqual(results.map(r => r.ok), [true, true, true, false, false]);
    assert.equal(results[4].status, 429);
    assert.match(results[4].error, /daily capacity/);
  });

  test('50 concurrent requests from 50 clients cannot exceed the global cap', async () => {
    const env = makeEnv({ cap: '5' });
    const results = await Promise.all(
      Array.from({ length: 50 }, (_, i) => checkRateLimit(req(`198.51.100.${i}`), env, T0)),
    );
    assert.equal(results.filter(r => r.ok).length, 5);
    assert.ok(results.filter(r => !r.ok).every(r => r.status === 429));
    assert.equal(env._budget.count, 5);
  });
});

// ---- Fail closed ----

describe('fails closed', () => {

  const expectUnavailable = result => {
    assert.equal(result.ok, false);
    assert.equal(result.status, 503);
    assert.match(result.error, /temporarily unavailable/);
  };

  test('missing KV binding', quiet(async () => {
    const env = makeEnv();
    delete env.RATE_LIMIT_KV;
    expectUnavailable(await checkRateLimit(req('203.0.113.7'), env, T0));
  }));

  test('missing Durable Object binding', quiet(async () => {
    const env = makeEnv();
    delete env.GLOBAL_BUDGET;
    expectUnavailable(await checkRateLimit(req('203.0.113.7'), env, T0));
  }));

  test('missing or short IP_HASH_SALT', quiet(async () => {
    const env = makeEnv();
    delete env.IP_HASH_SALT;
    expectUnavailable(await checkRateLimit(req('203.0.113.7'), env, T0));
    env.IP_HASH_SALT = 'short';
    expectUnavailable(await checkRateLimit(req('203.0.113.7'), env, T0));
  }));

  test('undefined env', quiet(async () => {
    expectUnavailable(await checkRateLimit(req('203.0.113.7'), undefined, T0));
  }));

  test('missing trusted client address, even if X-Forwarded-For is present', quiet(async () => {
    const env = makeEnv();
    expectUnavailable(await checkRateLimit(req(null, { 'X-Forwarded-For': '203.0.113.7' }), env, T0));
    assert.equal(env._budget.count, 0);
  }));

  test('KV read failure', quiet(async () => {
    const env = makeEnv();
    env._kv.failGet = true;
    expectUnavailable(await checkRateLimit(req('203.0.113.7'), env, T0));
    assert.equal(env._budget.count, 0);
  }));

  test('KV write failure', quiet(async () => {
    const env = makeEnv();
    env._kv.failPut = true;
    expectUnavailable(await checkRateLimit(req('203.0.113.7'), env, T0));
  }));

  test('corrupt KV counter', quiet(async () => {
    const env = makeEnv();
    await checkRateLimit(req('203.0.113.7'), env, T0);
    for (const key of env._kv.store.keys()) env._kv.store.set(key, 'not-a-number');
    expectUnavailable(await checkRateLimit(req('203.0.113.7'), env, T0));
  }));

  test('Durable Object throws', quiet(async () => {
    const env = makeEnv();
    env.GLOBAL_BUDGET = { idFromName: n => n, get: () => ({ fetch: async () => { throw new Error('do down'); } }) };
    expectUnavailable(await checkRateLimit(req('203.0.113.7'), env, T0));
  }));

  test('Durable Object storage write failure', quiet(async () => {
    const env = makeEnv();
    env._storage.failPut = true;
    expectUnavailable(await checkRateLimit(req('203.0.113.7'), env, T0));
  }));

  test('invalid GLOBAL_DAILY_CAP', quiet(async () => {
    for (const cap of ['0', 'unlimited', '-1']) {
      expectUnavailable(await checkRateLimit(req('203.0.113.7'), makeEnv({ cap }), T0));
    }
  }));

  test('malformed Durable Object reply', quiet(async () => {
    const env = makeEnv();
    env.GLOBAL_BUDGET = { idFromName: n => n, get: () => ({ fetch: async () => Response.json({ allowed: 'yes' }) }) };
    const result = await checkRateLimit(req('203.0.113.7'), env, T0);
    assert.equal(result.ok, false);
  }));
});

// ---- Through the HTTP handler ----

describe('POST /grade with rate limiting', () => {

  const answer = Array.from({ length: 200 }, (_, i) => `word${i}`).join(' ');

  function gradeRequest(body, ip = '203.0.113.7') {
    const headers = { 'Content-Type': 'application/json' };
    if (ip) headers['CF-Connecting-IP'] = ip;
    return new Request('https://grader.test/grade', { method: 'POST', headers, body: JSON.stringify(body) });
  }

  test('returns 200 mock feedback when within limits', async () => {
    const res = await worker.fetch(gradeRequest({ case_id: 'case-study-fotmob', answer }), makeEnv());
    assert.equal(res.status, 200);
    assert.equal((await res.json())._mock, true);
  });

  test('returns 429 with Retry-After and a safe message at the global cap', async () => {
    const env = makeEnv({ cap: '1' });
    assert.equal((await worker.fetch(gradeRequest({ case_id: 'case-study-fotmob', answer }), env)).status, 200);
    const res = await worker.fetch(gradeRequest({ case_id: 'case-study-fotmob', answer }, '198.51.100.9'), env);
    assert.equal(res.status, 429);
    assert.ok(Number(res.headers.get('Retry-After')) > 0);
    const body = await res.json();
    assert.deepEqual(Object.keys(body), ['error']);
    assert.ok(!/203\.0\.113|198\.51\.100|KV|Durable/i.test(body.error));
  });

  test('returns 503 and no feedback when bindings are missing', quiet(async () => {
    const res = await worker.fetch(gradeRequest({ case_id: 'case-study-fotmob', answer }), { ENVIRONMENT: 'development' });
    assert.equal(res.status, 503);
    const body = await res.json();
    assert.deepEqual(Object.keys(body), ['error']);
  }));

  test('invalid requests do not consume the global budget', async () => {
    const env = makeEnv({ cap: '1' });
    const bad = await worker.fetch(gradeRequest({ case_id: 'case-study-unknown', answer }), env);
    assert.equal(bad.status, 400);
    assert.equal(env._budget.count, 0);
    assert.equal(env._kv.store.size, 0);
  });
});

// ---- Request body size cap ----

describe('request body size cap', () => {

  const encoder = new TextEncoder();
  const answer = Array.from({ length: 200 }, (_, i) => `word${i}`).join(' ');

  function bodyOfExactly(bytes) {
    const base = JSON.stringify({ case_id: 'case-study-fotmob', answer, pad: '' });
    const text = JSON.stringify({ case_id: 'case-study-fotmob', answer, pad: 'x'.repeat(bytes - base.length) });
    assert.equal(encoder.encode(text).byteLength, bytes);
    return text;
  }

  function streamed(text, { chunkSize = 4096, headers = {} } = {}) {
    const bytes = encoder.encode(text);
    let offset = 0;
    let pulls = 0;
    const body = new ReadableStream({
      pull(controller) {
        pulls++;
        if (offset >= bytes.byteLength) return controller.close();
        controller.enqueue(bytes.slice(offset, offset + chunkSize));
        offset += chunkSize;
      },
    }, { highWaterMark: 0 });
    const request = new Request('https://grader.test/grade', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'CF-Connecting-IP': '203.0.113.7', ...headers },
      body,
      duplex: 'half',
    });
    return { request, pulls: () => pulls };
  }

  test('accepts a body of exactly 50,000 bytes', async () => {
    const { request } = streamed(bodyOfExactly(50_000));
    assert.equal((await worker.fetch(request, makeEnv())).status, 200);
  });

  test('rejects 50,001 bytes with 413 when Content-Length is missing', async () => {
    const { request } = streamed(bodyOfExactly(50_001));
    assert.equal(request.headers.get('content-length'), null);
    const env = makeEnv();
    const res = await worker.fetch(request, env);
    assert.equal(res.status, 413);
    assert.deepEqual(await res.json(), { error: 'Request body too large' });
    assert.equal(env._budget.count, 0);
    assert.equal(env._kv.store.size, 0);
  });

  test('rejects an oversized body with 413 when Content-Length understates it', async () => {
    const { request } = streamed(bodyOfExactly(60_000), { headers: { 'Content-Length': '100' } });
    assert.equal((await worker.fetch(request, makeEnv())).status, 413);
  });

  test('rejects with 413 when Content-Length is not a number', async () => {
    const { request } = streamed(bodyOfExactly(60_000), { headers: { 'Content-Length': 'abc' } });
    assert.equal((await worker.fetch(request, makeEnv())).status, 413);
  });

  test('rejects on declared Content-Length alone without reading the body', async () => {
    const { request, pulls } = streamed(bodyOfExactly(2_000), { headers: { 'Content-Length': '999999' } });
    assert.equal((await worker.fetch(request, makeEnv())).status, 413);
    assert.equal(pulls(), 0);
  });

  test('stops reading a huge stream soon after the cap is passed', async () => {
    const { request, pulls } = streamed('x'.repeat(5_000_000));
    assert.equal((await worker.fetch(request, makeEnv())).status, 413);
    assert.ok(pulls() < 20, `read ${pulls()} chunks`);
  });

  test('counts bytes, not characters', async () => {
    const text = JSON.stringify({ case_id: 'case-study-fotmob', answer, pad: 'é'.repeat(26_000) });
    assert.ok(text.length < 50_000);
    const { request } = streamed(text);
    assert.equal((await worker.fetch(request, makeEnv())).status, 413);
  });

  test('empty body, malformed JSON, and invalid UTF-8 return 400', async () => {
    const headers = { 'Content-Type': 'application/json', 'CF-Connecting-IP': '203.0.113.7' };
    const post = body => worker.fetch(new Request('https://grader.test/grade', { method: 'POST', headers, body }), makeEnv());
    assert.equal((await post(undefined)).status, 400);
    assert.equal((await post('{not json')).status, 400);
    assert.equal((await post(new Uint8Array([0x7b, 0xff, 0xfe, 0x7d]))).status, 400);
  });
});

// ---- Adapter selection (fail closed) ----

describe('adapter selection', () => {
  const answer = Array.from({ length: 200 }, (_, i) => `word${i}`).join(' ');
  const gradeRequest = () => new Request('https://grader.test/grade', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'CF-Connecting-IP': '203.0.113.7' },
    body: JSON.stringify({ case_id: 'case-study-fotmob', answer }),
  });

  test('returns 503 when LLM_PROVIDER is missing', quiet(async () => {
    const env = makeEnv(); delete env.LLM_PROVIDER;
    const res = await worker.fetch(gradeRequest(), env);
    assert.equal(res.status, 503);
    assert.equal(env._budget.count, 0);
    assert.equal(env._kv.store.size, 0);
  }));

  test('returns 503 for an unknown LLM_PROVIDER value', quiet(async () => {
    const env = makeEnv(); env.LLM_PROVIDER = 'secretly-live';
    assert.equal((await worker.fetch(gradeRequest(), env)).status, 503);
    assert.equal(env._budget.count, 0);
  }));

  test('returns 200 only when LLM_PROVIDER is explicitly set to mock', async () => {
    const env = makeEnv();
    assert.equal(env.LLM_PROVIDER, 'mock');
    assert.equal((await worker.fetch(gradeRequest(), env)).status, 200);
  });

  test('anthropic without an API key returns 503, not mock', quiet(async () => {
    const env = makeEnv(); env.LLM_PROVIDER = 'anthropic';
    const res = await worker.fetch(gradeRequest(), env);
    assert.equal(res.status, 503);
    const body = await res.json();
    assert.ok(!body._mock);
    assert.deepEqual(Object.keys(body), ['error']);
  }));
});
