/**
 * Logic tests for Ranks 3, 4, 5 fixes.
 * Pure functions extracted from app.js so they run in Node without browser APIs.
 */

// ─── Helpers (mirrors app.js) ─────────────────────────────────────────────────

function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function daysBetween(isoA, isoB) {
  const [ya, ma, da] = isoA.split('-').map(Number);
  const [yb, mb, db] = isoB.split('-').map(Number);
  const a = new Date(ya, ma - 1, da);
  const b = new Date(yb, mb - 1, db);
  return Math.round((b - a) / (1000 * 60 * 60 * 24));
}

// ─── Rank 3: stale streak detection ──────────────────────────────────────────

function isStreakStale(lastDateKey, todayKey) {
  if (!lastDateKey) return false;
  return daysBetween(lastDateKey, todayKey) > 1;
}

// ─── Rank 5: best score calculation ──────────────────────────────────────────

function computeNewScore(correct, total, existing) {
  const pct = Math.round((correct / total) * 100);
  const isRetry = !!existing;
  const prevBestPct = existing ? (existing.bestPct ?? existing.pct) : -1;
  const prevBestCorrect = existing ? (existing.bestCorrect ?? existing.correct) : 0;
  const bestPct = Math.max(prevBestPct, pct);
  const bestCorrect = pct >= prevBestPct ? correct : prevBestCorrect;
  const attempts = existing ? (existing.attempts ?? 1) + 1 : 1;
  return { correct, total, pct, bestPct, bestCorrect, attempts, isRetry };
}

// ─── Rank 4: completion logic ─────────────────────────────────────────────────

function shouldComplete(pct) {
  return pct >= 60;
}

// ─── Migration logic ──────────────────────────────────────────────────────────

function migrateScores(scores) {
  const migrated = {};
  let changed = false;
  Object.keys(scores).forEach(id => {
    const s = { ...scores[id] };
    if (s.bestPct === undefined) {
      s.bestPct = s.pct;
      s.bestCorrect = s.correct;
      s.attempts = 1;
      changed = true;
    }
    migrated[id] = s;
  });
  return { scores: migrated, changed };
}

function migrateCompletions(scores, completedTopics, lessonsDone) {
  const completed = new Set(completedTopics);
  const lessons = new Set(lessonsDone);
  let changed = false;
  Object.keys(scores).forEach(id => {
    const s = scores[id];
    if ((s.bestPct ?? s.pct) >= 60) {
      if (!lessons.has(id)) { lessons.add(id); changed = true; }
      if (!completed.has(id)) { completed.add(id); changed = true; }
    }
  });
  return { completedTopics: completed, lessonsDone: lessons, changed };
}

// ─── Test runner ──────────────────────────────────────────────────────────────

let pass = 0;
let fail = 0;

function test(description, fn) {
  try {
    fn();
    console.log(`  ✓ ${description}`);
    pass++;
  } catch (e) {
    console.error(`  ✗ ${description}`);
    console.error(`    ${e.message}`);
    fail++;
  }
}

function assert(condition, msg) {
  if (!condition) throw new Error(msg || 'Assertion failed');
}

function assertEqual(a, b, msg) {
  if (a !== b) throw new Error(msg || `Expected ${JSON.stringify(a)} === ${JSON.stringify(b)}`);
}

// ─── Rank 3 tests ─────────────────────────────────────────────────────────────

console.log('\nRank 3: stale streak display');

test('streak completed today is not stale', () => {
  const today = getLocalDateKey();
  assert(!isStreakStale(today, today), 'same day should not be stale');
});

test('streak completed yesterday is not stale', () => {
  const yesterday = getLocalDateKey(new Date(Date.now() - 86400000));
  const today = getLocalDateKey();
  assert(!isStreakStale(yesterday, today), 'yesterday should not be stale');
});

test('streak completed 2 days ago is stale', () => {
  const twoDaysAgo = getLocalDateKey(new Date(Date.now() - 2 * 86400000));
  const today = getLocalDateKey();
  assert(isStreakStale(twoDaysAgo, today), 'two days ago should be stale');
});

test('streak completed a week ago is stale', () => {
  const weekAgo = getLocalDateKey(new Date(Date.now() - 7 * 86400000));
  const today = getLocalDateKey();
  assert(isStreakStale(weekAgo, today), 'week ago should be stale');
});

test('no last date returns false (streak cannot be stale)', () => {
  assert(!isStreakStale(null, getLocalDateKey()), 'null last date should not be stale');
});

test('daysBetween handles month boundary', () => {
  assertEqual(daysBetween('2026-01-31', '2026-02-01'), 1, 'Jan 31 to Feb 1 is 1 day');
});

test('daysBetween handles year boundary', () => {
  assertEqual(daysBetween('2025-12-31', '2026-01-01'), 1, 'Dec 31 to Jan 1 is 1 day');
});

// ─── Rank 4 tests ─────────────────────────────────────────────────────────────

console.log('\nRank 4: quiz completion');

test('passing quiz (60%+) triggers completion', () => {
  assert(shouldComplete(60), '60% should complete');
  assert(shouldComplete(80), '80% should complete');
  assert(shouldComplete(100), '100% should complete');
});

test('failing quiz (<60%) does not trigger completion', () => {
  assert(!shouldComplete(59), '59% should not complete');
  assert(!shouldComplete(0), '0% should not complete');
  assert(!shouldComplete(40), '40% should not complete');
});

test('migration completes topic with passing legacy score', () => {
  const scores = { 'metrics': { correct: 3, total: 5, pct: 60 } };
  const { completedTopics, lessonsDone, changed } = migrateCompletions(scores, new Set(), new Set());
  assert(completedTopics.has('metrics'), 'metrics should be completed');
  assert(lessonsDone.has('metrics'), 'metrics lesson should be marked done');
  assert(changed, 'migration should report a change');
});

test('migration does not complete topic with failing legacy score', () => {
  const scores = { 'metrics': { correct: 2, total: 5, pct: 40 } };
  const { completedTopics, changed } = migrateCompletions(scores, new Set(), new Set());
  assert(!completedTopics.has('metrics'), 'metrics should not be completed');
  assert(!changed, 'migration should not change anything');
});

test('migration preserves already-completed topics', () => {
  const scores = { 'metrics': { correct: 3, total: 5, pct: 60 } };
  const { changed } = migrateCompletions(scores, new Set(['metrics']), new Set(['metrics']));
  assert(!changed, 'no change when already completed');
});

// ─── Rank 5 tests ─────────────────────────────────────────────────────────────

console.log('\nRank 5: best score preservation');

test('first attempt stores correct best score', () => {
  const result = computeNewScore(4, 5, null);
  assertEqual(result.pct, 80, 'pct should be 80');
  assertEqual(result.bestPct, 80, 'bestPct should be 80');
  assertEqual(result.bestCorrect, 4, 'bestCorrect should be 4');
  assertEqual(result.attempts, 1, 'attempts should be 1');
  assert(!result.isRetry, 'first attempt is not a retry');
});

test('higher retake improves best score', () => {
  const existing = { correct: 3, total: 5, pct: 60, bestPct: 60, bestCorrect: 3, attempts: 1 };
  const result = computeNewScore(5, 5, existing);
  assertEqual(result.bestPct, 100, 'best pct should update to 100');
  assertEqual(result.bestCorrect, 5, 'best correct should update to 5');
  assertEqual(result.attempts, 2, 'attempts should be 2');
  assert(result.isRetry, 'second attempt is a retry');
});

test('lower retake preserves best score', () => {
  const existing = { correct: 5, total: 5, pct: 100, bestPct: 100, bestCorrect: 5, attempts: 1 };
  const result = computeNewScore(3, 5, existing);
  assertEqual(result.pct, 60, 'latest pct should be 60');
  assertEqual(result.bestPct, 100, 'best pct should still be 100');
  assertEqual(result.bestCorrect, 5, 'best correct should still be 5');
  assertEqual(result.attempts, 2, 'attempts should be 2');
});

test('equal score retake keeps current best values', () => {
  const existing = { correct: 4, total: 5, pct: 80, bestPct: 80, bestCorrect: 4, attempts: 1 };
  const result = computeNewScore(4, 5, existing);
  assertEqual(result.bestPct, 80, 'best pct should still be 80');
  assertEqual(result.bestCorrect, 4, 'best correct should still be 4');
});

test('legacy score migration adds best score fields', () => {
  const scores = { 'metrics': { correct: 3, total: 5, pct: 60 } };
  const { scores: migrated, changed } = migrateScores(scores);
  assertEqual(migrated.metrics.bestPct, 60, 'bestPct should be set from pct');
  assertEqual(migrated.metrics.bestCorrect, 3, 'bestCorrect should be set from correct');
  assertEqual(migrated.metrics.attempts, 1, 'attempts should be 1');
  assert(changed, 'migration should flag a change');
});

test('already-migrated score is not re-migrated', () => {
  const scores = { 'metrics': { correct: 3, total: 5, pct: 60, bestPct: 80, bestCorrect: 4, attempts: 2 } };
  const { scores: migrated, changed } = migrateScores(scores);
  assertEqual(migrated.metrics.bestPct, 80, 'bestPct should be preserved');
  assert(!changed, 'no change when already migrated');
});

// ─── Summary ──────────────────────────────────────────────────────────────────

console.log(`\n${pass + fail} tests: ${pass} passed, ${fail} failed\n`);
if (fail > 0) process.exit(1);
