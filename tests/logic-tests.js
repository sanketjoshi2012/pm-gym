/**
 * Logic tests for Ranks 3, 4, 5, 7, 8, 9, 10 fixes.
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

// ─── Rank 7: Daily Rep question resolution ────────────────────────────────────

// Mirrors the resolution logic in initDailyRep()
function resolveDailyDisplayItem(saved, currentItem, pool) {
  if (!saved || !saved.questionId || saved.questionId === currentItem.id) {
    return { displayItem: currentItem, neutral: false };
  }
  const originalItem = pool.find(q => q.id === saved.questionId);
  if (originalItem) {
    return { displayItem: originalItem, neutral: false };
  }
  return { displayItem: null, neutral: true };
}

console.log('\nRank 7: Daily Rep question resolution');

test('no saved attempt: display current scheduled question', () => {
  const pool = [{ id: 'q1' }, { id: 'q2' }];
  const { displayItem, neutral } = resolveDailyDisplayItem(null, pool[0], pool);
  assert(displayItem === pool[0], 'should display currentItem when no saved attempt');
  assert(!neutral, 'should not be neutral');
});

test('saved questionId matches current: display current question unchanged', () => {
  const pool = [{ id: 'q1' }, { id: 'q2' }];
  const saved = { questionId: 'q1', isCorrect: true };
  const { displayItem, neutral } = resolveDailyDisplayItem(saved, pool[0], pool);
  assert(displayItem === pool[0], 'should display current item when ids match');
  assert(!neutral, 'should not be neutral');
});

test('pool shifted: saved question still in pool — recover and display original', () => {
  const pool = [{ id: 'q-new' }, { id: 'q1' }, { id: 'q2' }];
  const saved = { questionId: 'q1', isCorrect: false };
  const currentItem = pool[0]; // pool shifted, today now points to q-new
  const { displayItem, neutral } = resolveDailyDisplayItem(saved, currentItem, pool);
  assert(displayItem.id === 'q1', 'should recover original question from pool');
  assert(!neutral, 'should not be neutral');
});

test('pool shifted: saved question removed from pool — show neutral state', () => {
  const pool = [{ id: 'q-new' }, { id: 'q2' }]; // q1 was removed
  const saved = { questionId: 'q1', isCorrect: true };
  const currentItem = pool[0];
  const { displayItem, neutral } = resolveDailyDisplayItem(saved, currentItem, pool);
  assert(neutral, 'should be neutral when original question is gone');
  assert(displayItem === null, 'displayItem should be null in neutral state');
});

test('saved attempt has no questionId (legacy): display current question', () => {
  const pool = [{ id: 'q1' }];
  const saved = { selectedAnswer: 0, isCorrect: true }; // no questionId field
  const { displayItem, neutral } = resolveDailyDisplayItem(saved, pool[0], pool);
  assert(displayItem === pool[0], 'legacy saved with no questionId should show current item');
  assert(!neutral, 'should not be neutral');
});

// ─── Rank 8: quiz finalization guard ──────────────────────────────────────────

function makeQuizFinalizer() {
  let finalized = false;
  let callCount = 0;
  function finalizeQuiz() {
    if (finalized) return;
    finalized = true;
    callCount++;
  }
  function retake() { finalized = false; }
  return { finalizeQuiz, retake, getCount: () => callCount };
}

console.log('\nRank 8: quiz finalization guard');

test('finalizeQuiz fires exactly once per attempt', () => {
  const { finalizeQuiz, getCount } = makeQuizFinalizer();
  finalizeQuiz();
  finalizeQuiz();
  finalizeQuiz();
  assertEqual(getCount(), 1, 'should fire exactly once despite three calls');
});

test('retake resets guard so next attempt can finalize', () => {
  const { finalizeQuiz, retake, getCount } = makeQuizFinalizer();
  finalizeQuiz(); // first attempt
  retake();
  finalizeQuiz(); // second attempt
  assertEqual(getCount(), 2, 'should fire once per attempt after retake');
});

test('retake does not finalize on its own', () => {
  const { retake, getCount } = makeQuizFinalizer();
  retake();
  assertEqual(getCount(), 0, 'retake should not trigger finalization');
});

// ─── Rank 9: dashboard In Progress with draft check ──────────────────────────

function computeStarted(topic, lessonsDone, quizScores, caseAnswers) {
  const hasDraft = topic.isCaseStudy && !!(caseAnswers[topic.id] || '').trim();
  return lessonsDone.has(topic.id) || quizScores[topic.id] !== undefined || hasDraft;
}

console.log('\nRank 9: dashboard In Progress');

test('case study with non-empty draft is In Progress', () => {
  const topic = { id: 'cs-1', isCaseStudy: true };
  assert(computeStarted(topic, new Set(), {}, { 'cs-1': 'some draft text' }), 'draft should mark as started');
});

test('case study with whitespace-only draft is not In Progress', () => {
  const topic = { id: 'cs-1', isCaseStudy: true };
  assert(!computeStarted(topic, new Set(), {}, { 'cs-1': '   \n\t  ' }), 'whitespace-only draft should not count');
});

test('case study with empty draft is not In Progress', () => {
  const topic = { id: 'cs-1', isCaseStudy: true };
  assert(!computeStarted(topic, new Set(), {}, { 'cs-1': '' }), 'empty draft should not count');
});

test('case study with no saved answer is not In Progress', () => {
  const topic = { id: 'cs-1', isCaseStudy: true };
  assert(!computeStarted(topic, new Set(), {}, {}), 'no draft should be not started');
});

test('completed case study with draft remains Done (not double-counted)', () => {
  const topic = { id: 'cs-1', isCaseStudy: true };
  const done = new Set(['cs-1']);
  // The dashboard logic: done takes precedence — started is irrelevant when done
  const started = computeStarted(topic, new Set(), {}, { 'cs-1': 'some draft' });
  assert(started, 'started is true (draft exists)');
  // The status would be 'done' because done is checked first — this is a contract test
  const status = done.has(topic.id) ? 'done' : started ? 'progress' : 'todo';
  assertEqual(status, 'done', 'done takes precedence over started');
});

test('regular topic with lesson done is In Progress', () => {
  const topic = { id: 'north-star', isCaseStudy: false };
  assert(computeStarted(topic, new Set(['north-star']), {}, {}), 'lesson done should count as started');
});

// ─── Rank 10: localStorage recovery ──────────────────────────────────────────

function safeLoadJSON(raw, fallback) {
  try {
    if (raw === null || raw === undefined) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    return fallback;
  }
}

function validateArray(val, fallback) {
  return Array.isArray(val) ? val : fallback;
}

function validateObject(val, fallback) {
  return (val && typeof val === 'object' && !Array.isArray(val)) ? val : fallback;
}

function loadStateFromValues(rawCompleted, rawScores, rawLessons, rawCases) {
  const completedTopics = new Set(validateArray(safeLoadJSON(rawCompleted, []), []));
  const quizScores = validateObject(safeLoadJSON(rawScores, {}), {});
  const lessonsDone = new Set(validateArray(safeLoadJSON(rawLessons, []), []));
  const caseAnswers = validateObject(safeLoadJSON(rawCases, {}), {});
  return { completedTopics, quizScores, lessonsDone, caseAnswers };
}

console.log('\nRank 10: localStorage recovery');

test('all keys valid: full state loaded correctly', () => {
  const state = loadStateFromValues(
    '["metrics","ab-testing"]',
    '{"metrics":{"correct":4,"total":5,"pct":80}}',
    '["metrics"]',
    '{"cs-1":"my draft"}'
  );
  assert(state.completedTopics.has('metrics'), 'metrics should be completed');
  assert(state.completedTopics.has('ab-testing'), 'ab-testing should be completed');
  assertEqual(state.quizScores.metrics.pct, 80, 'quiz score should be 80');
  assert(state.lessonsDone.has('metrics'), 'lesson should be marked done');
  assertEqual(state.caseAnswers['cs-1'], 'my draft', 'case answer should be loaded');
});

test('corrupted QUIZ_SCORES: other keys still load', () => {
  const state = loadStateFromValues(
    '["metrics"]',
    'not-valid-json{{{',
    '["metrics"]',
    '{}'
  );
  assert(state.completedTopics.has('metrics'), 'completed topics should still load');
  assert(state.lessonsDone.has('metrics'), 'lessons should still load');
  assertEqual(Object.keys(state.quizScores).length, 0, 'quiz scores should fall back to empty object');
});

test('corrupted COMPLETED_TOPICS: other keys still load', () => {
  const state = loadStateFromValues(
    '{invalid}',
    '{"metrics":{"correct":3,"total":5,"pct":60}}',
    '[]',
    '{"cs-1":"draft"}'
  );
  assertEqual(state.completedTopics.size, 0, 'completed topics should fall back to empty set');
  assertEqual(state.quizScores.metrics.pct, 60, 'quiz scores should still load');
  assertEqual(state.caseAnswers['cs-1'], 'draft', 'case answers should still load');
});

test('corrupted CASE_ANSWERS: other keys still load', () => {
  const state = loadStateFromValues(
    '["metrics"]',
    '{}',
    '["metrics"]',
    'undefined'
  );
  assert(state.completedTopics.has('metrics'), 'completed topics should load');
  assertEqual(Object.keys(state.caseAnswers).length, 0, 'case answers should fall back to empty');
});

test('valid JSON with wrong type: array where object expected falls back', () => {
  const state = loadStateFromValues('[]', '[1,2,3]', '[]', '[]');
  assertEqual(Object.keys(state.quizScores).length, 0, 'array for scores should fall back to {}');
  assertEqual(Object.keys(state.caseAnswers).length, 0, 'array for cases should fall back to {}');
});

test('valid JSON with wrong type: object where array expected falls back', () => {
  const state = loadStateFromValues('{"a":1}', '{}', '{"b":2}', '{}');
  assertEqual(state.completedTopics.size, 0, 'object for completed should fall back to empty set');
  assertEqual(state.lessonsDone.size, 0, 'object for lessons should fall back to empty set');
});

test('null stored values return defaults', () => {
  const state = loadStateFromValues(null, null, null, null);
  assertEqual(state.completedTopics.size, 0, 'null completed should give empty set');
  assertEqual(Object.keys(state.quizScores).length, 0, 'null scores should give empty object');
  assertEqual(state.lessonsDone.size, 0, 'null lessons should give empty set');
  assertEqual(Object.keys(state.caseAnswers).length, 0, 'null cases should give empty object');
});

test('existing migrations still apply to validly loaded scores', () => {
  // Mirrors the Rank 5 migration: legacy score gets bestPct/bestCorrect/attempts added
  const scores = { 'metrics': { correct: 3, total: 5, pct: 60 } };
  const { scores: migrated, changed } = migrateScores(scores);
  assertEqual(migrated.metrics.bestPct, 60, 'migration adds bestPct');
  assert(changed, 'migration reports change');
  // Rank 4 migration: topic with passing score gets completed
  const { completedTopics, changed: c2 } = migrateCompletions(migrated, new Set(), new Set());
  assert(completedTopics.has('metrics'), 'passing score completes topic');
  assert(c2, 'completion migration reports change');
});

// ─── Summary ──────────────────────────────────────────────────────────────────

console.log(`\n${pass + fail} tests: ${pass} passed, ${fail} failed\n`);
if (fail > 0) process.exit(1);
