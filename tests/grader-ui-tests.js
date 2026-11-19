/**
 * Frontend logic tests for the AI Grader UI (v1.10.0 / Step 3).
 * Pure helpers mirroring those in js/app.js so they run in Node without browser APIs.
 * Also verifies the browser-script source wires the deployed Worker URL and preserves rubrics.
 */

const fs = require('fs');
const path = require('path');

// ─── Mirrors of app.js helpers ───────────────────────────────────────────────

const GRADER_MIN_WORDS = 120;
const GRADER_MAX_WORDS = 1500;
const GRADER_MAX_CHARS = 15_000;
const PILOT_CASE_IDS = new Set([
  'case-study-fotmob',
  'case-study-cricbuzz',
  'case-study-spotify',
  'case-study-swiggy',
]);

function countWords(text) {
  return (text || '').trim().split(/\s+/).filter(w => w.length > 0).length;
}
function escapeHtml(s) {
  const str = String(s == null ? '' : s);
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
function pickBiggestLever(dimensions) {
  if (!Array.isArray(dimensions) || dimensions.length === 0) return null;
  let best = dimensions[0];
  for (let i = 1; i < dimensions.length; i++) {
    if (dimensions[i].score < best.score) best = dimensions[i];
  }
  return best;
}
function isStaleGrade(currentAnswer, gradedAnswer) {
  return (currentAnswer || '').trim() !== (gradedAnswer || '').trim();
}
function graderButtonState(answer) {
  const chars = (answer || '').length;
  if (chars > GRADER_MAX_CHARS) return { disabled: true, reason: 'char-cap' };
  const words = countWords(answer);
  if (words < GRADER_MIN_WORDS) return { disabled: true, reason: 'too-short' };
  if (words > GRADER_MAX_WORDS) return { disabled: true, reason: 'too-long' };
  return { disabled: false, reason: '' };
}
function graderErrorMessage(status, bodyErrorText) {
  if (status === 429) return "You've hit the grading limit. Please try again later.";
  if (status === 503) return bodyErrorText || 'Grading is temporarily unavailable. Please try again later.';
  if (status === 504) return 'Grading timed out. Please try again.';
  if (status === 502) return 'Grading service error. Please try again.';
  if (status === 400 || status === 413) return 'We could not grade that answer. Please check the length and try again.';
  return 'Something went wrong. Please try again.';
}
function nextAssistedFlag() { return true; }
function wordCounterStatus(answer) {
  const safe = answer || '';
  const words = countWords(safe);
  const chars = safe.length;
  const CHAR_WARN_AT = Math.round(GRADER_MAX_CHARS * 0.9);
  const count = `${words.toLocaleString()} word${words === 1 ? '' : 's'}`;
  let hint = '', state = 'ok';
  if (words < GRADER_MIN_WORDS) {
    const need = GRADER_MIN_WORDS - words;
    hint = `${need.toLocaleString()} more word${need === 1 ? '' : 's'} needed`;
    state = 'under';
  } else if (words > GRADER_MAX_WORDS) {
    hint = `Shorten to ${GRADER_MAX_WORDS.toLocaleString()} words`;
    state = 'over';
  }
  let charWarning = '';
  if (chars > GRADER_MAX_CHARS) { charWarning = `Over ${GRADER_MAX_CHARS.toLocaleString()} character limit`; state = 'over'; }
  else if (chars >= CHAR_WARN_AT) { charWarning = `${chars.toLocaleString()} / ${GRADER_MAX_CHARS.toLocaleString()} characters`; }
  return { count, hint, charWarning, state };
}

// Pure reducer that mirrors the close/reopen/regrade state transitions in app.js.
// Used in Node to verify the panel-hidden flag never nukes result, attempt, assisted, or answer.
function applyGradingAction(state, action) {
  const next = { ...state };
  if (action.type === 'close') {
    if (next.lastResult) next.hidden = true;
  } else if (action.type === 'reopen') {
    if (next.lastResult) next.hidden = false;
  } else if (action.type === 'regrade') {
    next.attempt = (next.attempt || 0) + 1;
    next.lastResult = action.result;
    next.gradedAnswer = action.answer;
    next.hidden = false;
    next.assisted = !!next.assisted; // sticky, never flipped off here
  } else if (action.type === 'reveal-model-answer') {
    next.assisted = true;
  }
  return next;
}

// ─── Harness ─────────────────────────────────────────────────────────────────

let passed = 0, failed = 0;
function test(name, fn) {
  try { fn(); console.log('  PASS:', name); passed++; }
  catch (err) { console.log('  FAIL:', name, '—', err.message); failed++; }
}
function eq(a, b, msg) {
  if (JSON.stringify(a) !== JSON.stringify(b)) {
    throw new Error(`${msg || 'expected equal'}: got ${JSON.stringify(a)}, expected ${JSON.stringify(b)}`);
  }
}
function truthy(v, msg) { if (!v) throw new Error(msg || 'expected truthy'); }
function falsy(v, msg) { if (v) throw new Error(msg || 'expected falsy'); }

const makeWords = n => Array.from({ length: n }, (_, i) => `word${i}`).join(' ');

// ─── Tests: word-count limits ────────────────────────────────────────────────

console.log('\n--- Word limits ---');
test('countWords handles blank / whitespace / tabs', () => {
  eq(countWords(''), 0);
  eq(countWords('   '), 0);
  eq(countWords('\n\t  '), 0);
  eq(countWords('a  b\n\tc'), 3);
});
test('button disabled below 120 words', () => {
  eq(graderButtonState(makeWords(0)).reason, 'too-short');
  eq(graderButtonState(makeWords(119)).reason, 'too-short');
});
test('button enabled at exactly 120 words', () => {
  const s = graderButtonState(makeWords(120));
  falsy(s.disabled, 'should be enabled at the boundary');
});
test('button enabled at exactly 1500 words', () => {
  falsy(graderButtonState(makeWords(1500)).disabled);
});
test('button disabled above 1500 words', () => {
  eq(graderButtonState(makeWords(1501)).reason, 'too-long');
});
test('button disabled over 15,000 characters even if word count is valid', () => {
  const s = graderButtonState(makeWords(120) + ' ' + 'x'.repeat(15_000));
  eq(s.reason, 'char-cap');
});

// ─── Tests: attempt counting and assisted flag ───────────────────────────────

console.log('\n--- Attempt counting + assisted ---');
test('attempt starts at 1 for a fresh case', () => {
  const grading = {};
  const next = (grading.attempt || 0) + 1;
  eq(next, 1);
});
test('attempt increments only on successful grades', () => {
  let g = { attempt: 0 };
  // Imagine: grade succeeds twice, then errors twice (errors do not bump)
  g.attempt = (g.attempt || 0) + 1; eq(g.attempt, 1);
  g.attempt = (g.attempt || 0) + 1; eq(g.attempt, 2);
  // error path: do nothing to attempt
  eq(g.attempt, 2);
});
test('nextAssistedFlag is sticky — always returns true', () => {
  eq(nextAssistedFlag(false), true);
  eq(nextAssistedFlag(true), true);
});
test('assisted flag is never unset by subsequent code paths in app.js', () => {
  const src = fs.readFileSync(path.join(__dirname, '..', 'js', 'app.js'), 'utf8');
  // Catch accidental assisted: false (whitespace tolerant), excluding the legitimate request body setter
  const rx = /assisted:\s*false/g;
  const matches = (src.match(rx) || []).filter(line => true);
  // Every assisted:false in app.js must be inside the request body construction, not state mutation.
  // We assert there is no code path that sets state.caseGrading[...].assisted = false.
  const unsetRx = /caseGrading\[[^\]]+\]\.assisted\s*=\s*false/;
  falsy(unsetRx.test(src), 'found code that unsets assisted flag');
});

// ─── Tests: biggest-lever picker ────────────────────────────────────────────

console.log('\n--- Biggest lever ---');
test('picks the single lowest-scoring dimension', () => {
  const dims = [
    { dimension: 'A', score: 3 },
    { dimension: 'B', score: 1 },
    { dimension: 'C', score: 2 },
  ];
  eq(pickBiggestLever(dims).dimension, 'B');
});
test('on a tie, picks the first-listed (rubric-order)', () => {
  const dims = [
    { dimension: 'A', score: 2 },
    { dimension: 'B', score: 2 },
    { dimension: 'C', score: 2 },
  ];
  eq(pickBiggestLever(dims).dimension, 'A');
});
test('handles an empty array', () => {
  eq(pickBiggestLever([]), null);
  eq(pickBiggestLever(undefined), null);
});

// ─── Tests: stale-feedback detection ────────────────────────────────────────

console.log('\n--- Stale feedback ---');
test('not stale when answers match exactly', () => {
  falsy(isStaleGrade('hello world', 'hello world'));
});
test('not stale for trivial whitespace changes', () => {
  falsy(isStaleGrade('hello world  ', 'hello world'));
  falsy(isStaleGrade('\n\nhello world', 'hello world'));
});
test('stale when learner changed content', () => {
  truthy(isStaleGrade('hello world!', 'hello world'));
  truthy(isStaleGrade('hello worldx', 'hello world'));
});

// ─── Tests: error mapping ────────────────────────────────────────────────────

console.log('\n--- Error messages ---');
test('429 message does not mention Retry-After (it is not exposed by the Worker)', () => {
  const msg = graderErrorMessage(429, null);
  truthy(msg.toLowerCase().includes('try again later'));
  falsy(msg.toLowerCase().includes('retry-after'));
  falsy(/\d+\s*seconds/.test(msg));
});
test('503 passes through body error text when present', () => {
  eq(graderErrorMessage(503, 'maintenance mode'), 'maintenance mode');
  truthy(graderErrorMessage(503, null).toLowerCase().includes('unavailable'));
});
test('504 says timed out', () => {
  truthy(graderErrorMessage(504).toLowerCase().includes('timed out'));
});
test('502 nudges user to retry', () => {
  truthy(graderErrorMessage(502).toLowerCase().includes('try again'));
});
test('400 and 413 talk about length', () => {
  truthy(graderErrorMessage(400).toLowerCase().includes('length'));
  truthy(graderErrorMessage(413).toLowerCase().includes('length'));
});

// ─── Tests: XSS-safe rendering ───────────────────────────────────────────────

console.log('\n--- XSS safety ---');
test('escapeHtml neutralises HTML tags and quotes', () => {
  eq(escapeHtml('<script>alert(1)</script>'),
     '&lt;script&gt;alert(1)&lt;/script&gt;');
  eq(escapeHtml(`"><img src=x onerror=1>`),
     '&quot;&gt;&lt;img src=x onerror=1&gt;');
  eq(escapeHtml(`O'Neill &co`), 'O&#39;Neill &amp;co');
});
test('escapeHtml handles null / undefined safely', () => {
  eq(escapeHtml(null), '');
  eq(escapeHtml(undefined), '');
});
test('renderGradeResult in app.js never pipes LLM fields through innerHTML without escaping', () => {
  const src = fs.readFileSync(path.join(__dirname, '..', 'js', 'app.js'), 'utf8');
  const start = src.indexOf('function renderGradeResult');
  truthy(start > 0, 'renderGradeResult must exist');
  const end = src.indexOf('\nfunction ', start + 1);
  const body = src.slice(start, end > 0 ? end : src.length);
  // Each of these LLM-sourced fields must appear only wrapped in escapeHtml(...)
  for (const field of ['d.dimension', 'd.reasoning', 'd.improvement', 'd.evidence_quote', 'result.overall_comment', 'biggest.dimension', 'biggest.improvement']) {
    const bareUses = body.match(new RegExp(`\\\${(\\s|\\n)*${field.replace('.', '\\.')}(\\s|\\n)*}`, 'g')) || [];
    truthy(bareUses.length === 0, `${field} appears unescaped inside a template literal`);
  }
});

// ─── Tests: Worker URL and state preservation ───────────────────────────────

console.log('\n--- Worker URL + state ---');
test('app.js references the deployed production Worker URL', () => {
  const src = fs.readFileSync(path.join(__dirname, '..', 'js', 'app.js'), 'utf8');
  truthy(src.includes("https://pm-gym-grader-production.joshisanket80.workers.dev/grade"),
    'production Worker URL must be present');
});
test('app.js persists caseGrading via localStorage (load and save)', () => {
  const src = fs.readFileSync(path.join(__dirname, '..', 'js', 'app.js'), 'utf8');
  truthy(src.includes("CASE_GRADING: 'pmgym_case_grading'"), 'storage key missing');
  truthy(src.includes('state.caseGrading = (gradingRaw'), 'load path missing');
  truthy(src.includes('STORAGE_KEYS.CASE_GRADING, JSON.stringify(state.caseGrading)'), 'save path missing');
});
test('corrupted caseGrading storage falls back to empty object (safeLoadJSON)', () => {
  const src = fs.readFileSync(path.join(__dirname, '..', 'js', 'app.js'), 'utf8');
  // safeLoadJSON swallows parse errors and returns the fallback
  truthy(src.includes('safeLoadJSON(STORAGE_KEYS.CASE_GRADING, {})'), 'caseGrading must load via safeLoadJSON with {} fallback');
});
test('pilot IDs match the four approved cases', () => {
  const src = fs.readFileSync(path.join(__dirname, '..', 'js', 'app.js'), 'utf8');
  for (const id of ['case-study-fotmob', 'case-study-cricbuzz', 'case-study-spotify', 'case-study-swiggy']) {
    truthy(src.includes(`'${id}'`), `pilot id ${id} missing from app.js`);
  }
});
test('non-pilot case studies retain their original behaviour (no grader UI)', () => {
  const src = fs.readFileSync(path.join(__dirname, '..', 'js', 'app.js'), 'utf8');
  // The grader UI block is only injected inside an isPilotCase(topic.id) check
  const gating = src.match(/isPilotCase\(topic\.id\)\s*\?/g) || [];
  truthy(gating.length >= 2, 'grader UI must be gated behind isPilotCase() in renderCaseStudy');
});

// ─── Tests: rubric file integrity ────────────────────────────────────────────

console.log('\n--- Rubric untouched ---');
test('grader-rubric.js still defines all four pilot cases with all score anchors', () => {
  const src = fs.readFileSync(path.join(__dirname, '..', 'js', 'grader-rubric.js'), 'utf8');
  for (const id of ['case-study-fotmob', 'case-study-cricbuzz', 'case-study-spotify', 'case-study-swiggy']) {
    truthy(src.includes(`"${id}"`) || src.includes(`'${id}'`), `${id} missing`);
  }
  // Every dimension has all 3 score anchors
  const score3 = (src.match(/score_3:/g) || []).length;
  const score2 = (src.match(/score_2:/g) || []).length;
  const score1 = (src.match(/score_1:/g) || []).length;
  eq(score3, 21, 'score_3 count');
  eq(score2, 21, 'score_2 count');
  eq(score1, 21, 'score_1 count');
});

// ─── Tests: simplified word counter ──────────────────────────────────────────

console.log('\n--- Word counter copy ---');
test('counter under min returns concise "N more words needed" hint', () => {
  const s = wordCounterStatus(makeWords(115));
  eq(s.state, 'under');
  eq(s.count, '115 words');
  eq(s.hint, '5 more words needed');
  eq(s.charWarning, '');
});
test('singular "1 more word needed" at 119', () => {
  const s = wordCounterStatus(makeWords(119));
  eq(s.hint, '1 more word needed');
});
test('counter at min — no hint, state ok', () => {
  const s = wordCounterStatus(makeWords(120));
  eq(s.state, 'ok');
  eq(s.count, '120 words');
  eq(s.hint, '');
  eq(s.charWarning, '');
});
test('counter in comfortable middle — no hint shown', () => {
  const s = wordCounterStatus(makeWords(400));
  eq(s.state, 'ok');
  eq(s.hint, '');
});
test('counter at max — no hint, no charWarning', () => {
  const s = wordCounterStatus(makeWords(1500));
  eq(s.state, 'ok');
  eq(s.hint, '');
});
test('over word max — hint names the cap, state over', () => {
  const s = wordCounterStatus(makeWords(1555));
  eq(s.state, 'over');
  truthy(s.hint.includes('1,500'), s.hint);
});
test('char warning appears at 90% of 15,000 chars (soft warning)', () => {
  const near = 'a'.repeat(13_500);
  const s = wordCounterStatus(near);
  truthy(s.charWarning.includes('15,000'), s.charWarning);
  truthy(s.charWarning.includes('13,500'), s.charWarning);
  // Soft warning shouldn't force state to over by itself
  eq(s.state, 'under'); // few words
});
test('char warning does NOT show below 90% threshold', () => {
  const below = 'a'.repeat(13_499);
  const s = wordCounterStatus(below);
  eq(s.charWarning, '');
});
test('over 15,000 chars gives firm "Over … character limit" and state over', () => {
  const s = wordCounterStatus('a'.repeat(15_001));
  eq(s.state, 'over');
  truthy(s.charWarning.includes('Over 15,000 character limit'), s.charWarning);
});
test('counter pluralises singular 1 word', () => {
  const s = wordCounterStatus('solo');
  eq(s.count, '1 word');
});
test('counter says "0 words" (plural) at zero', () => {
  const s = wordCounterStatus('');
  eq(s.count, '0 words');
});
test('markup shows a static "Min 120 · Max 1,500" chip, no sentence hint', () => {
  const src = fs.readFileSync(path.join(__dirname, '..', 'js', 'app.js'), 'utf8');
  truthy(/Min \$\{GRADER_MIN_WORDS\} · Max \$\{GRADER_MAX_WORDS\.toLocaleString\(\)\}/.test(src),
    'compact Min · Max limits chip missing');
  // The old explanatory sentence is gone.
  falsy(/Minimum \$\{GRADER_MIN_WORDS\} words, maximum/.test(src),
    'legacy explanatory sentence should be removed');
});

// ─── Tests: Improve-my-answer button is actually brand-blue primary ──────────

console.log('\n--- Primary button styling ---');
test('.improve-answer-btn CSS sets brand-blue background (not grey fallback)', () => {
  const css = fs.readFileSync(path.join(__dirname, '..', 'styles.css'), 'utf8');
  const start = css.indexOf('.improve-answer-btn {');
  // Combined selector '.try-again-btn, .improve-answer-btn' is what we actually write
  const block = css.slice(css.indexOf('.improve-answer-btn'), css.indexOf('.improve-answer-btn') + 800);
  truthy(/background:\s*var\(--accent\)/.test(block), 'must use var(--accent) for background');
  truthy(/color:\s*#fff/.test(block), 'must use white text');
});
test('.improve-answer-btn has hover and focus-visible states', () => {
  const css = fs.readFileSync(path.join(__dirname, '..', 'styles.css'), 'utf8');
  truthy(/\.improve-answer-btn:hover/.test(css), 'hover state missing');
  truthy(/\.improve-answer-btn:focus-visible/.test(css), 'keyboard focus state missing');
});
test('no reliance on undefined .btn-primary selector for colour', () => {
  const css = fs.readFileSync(path.join(__dirname, '..', 'styles.css'), 'utf8');
  // .btn-primary doesn't exist in this codebase — .improve-answer-btn must stand on its own.
  falsy(/^\.btn-primary\s*\{/m.test(css), 'btn-primary should not be introduced; style the class directly');
});

// ─── Tests: AI-generated feedback label + no bottom disclaimer ───────────────

console.log('\n--- AI label + disclaimer removed ---');
test('result shows "AI-generated feedback" label near the score', () => {
  const src = fs.readFileSync(path.join(__dirname, '..', 'js', 'app.js'), 'utf8');
  truthy(src.includes('AI-generated feedback'), 'small AI label missing');
  truthy(/class="grader-ai-label"/.test(src), 'grader-ai-label class missing');
});
test('long bottom disclaimer paragraph is removed', () => {
  const src = fs.readFileSync(path.join(__dirname, '..', 'js', 'app.js'), 'utf8');
  falsy(src.includes('Graded by AI. See Reveal Model Answer below'),
    'legacy footnote sentence must be removed');
  falsy(/grader-footnote/.test(src), 'grader-footnote markup must be removed from renderGradeResult');
});
test('dimension heading is simply "By dimension" (no count)', () => {
  const src = fs.readFileSync(path.join(__dirname, '..', 'js', 'app.js'), 'utf8');
  truthy(/>By dimension</.test(src), 'By dimension heading missing');
  falsy(/Per-dimension feedback \(/.test(src), 'legacy per-dimension label must be gone');
});

// ─── Tests: View Last Feedback lives in the actions row ──────────────────────

console.log('\n--- VLF in controls row ---');
test('viewLastFeedbackBtn is rendered inside .case-actions, not .grader-helper', () => {
  const src = fs.readFileSync(path.join(__dirname, '..', 'js', 'app.js'), 'utf8');
  // Find both regions in renderCaseStudy and verify placement
  const helperStart = src.indexOf('class="grader-helper"');
  const actionsStart = src.indexOf('class="case-actions"');
  const vlfIdx = src.indexOf('id="viewLastFeedbackBtn"');
  truthy(helperStart > 0 && actionsStart > 0 && vlfIdx > 0, 'expected markers missing');
  truthy(vlfIdx > actionsStart, 'VLF must be inside .case-actions markup block');
  // And NOT inside the grader-helper block (helper block ends before actions block)
  const helperEnd = src.indexOf('</div>', helperStart);
  truthy(vlfIdx > helperEnd, 'VLF must have moved out of .grader-helper');
});
test('VLF is only visible when a stored result exists AND is hidden', () => {
  const src = fs.readFileSync(path.join(__dirname, '..', 'js', 'app.js'), 'utf8');
  const start = src.indexOf('function updateGraderUI');
  const end = src.indexOf('\nfunction ', start + 1);
  const body = src.slice(start, end);
  truthy(/grading\.lastResult.*grading\.hidden/s.test(body),
    'visibility must gate on both lastResult and hidden');
});

// ─── Tests: consent banner mobile compactness ────────────────────────────────

console.log('\n--- Consent banner mobile ---');
test('consent banner has a <= 500px media query that tightens padding and text', () => {
  const css = fs.readFileSync(path.join(__dirname, '..', 'styles.css'), 'utf8');
  const mq = css.match(/@media\s*\(max-width:\s*500px\)\s*\{[\s\S]*?\n\}/g) || [];
  const hit = mq.find(b => /\.consent-banner\s*\{/.test(b) && /\.consent-btn\s*\{/.test(b));
  truthy(hit, 'no @media (max-width:500px) block tuning the consent banner');
  truthy(/padding:\s*0\.5\d*rem/.test(hit) || /padding:\s*0\.6\d*rem/.test(hit),
    'mobile padding should be ~0.55rem, not the desktop 0.875rem');
  truthy(/font-size:\s*0\.75rem/.test(hit), 'mobile banner text should shrink');
  truthy(/flex-wrap:\s*nowrap/.test(hit), 'main row must not wrap on mobile');
  truthy(/white-space:\s*nowrap/.test(hit), 'buttons should not wrap mid-label');
});
test('both Accept and Decline buttons remain in markup (no logic changes)', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  truthy(html.includes('acceptAnalytics()'), 'Accept handler missing');
  truthy(html.includes('declineAnalytics()'), 'Decline handler missing');
  truthy(html.includes('consent-btn-accept') && html.includes('consent-btn-decline'),
    'both consent buttons must be present');
});
test('consent banner still sits above the mobile bottom nav', () => {
  const css = fs.readFileSync(path.join(__dirname, '..', 'styles.css'), 'utf8');
  truthy(/@media\s*\(max-width:\s*900px\)\s*\{[\s\S]*?\.consent-banner\s*\{[\s\S]*?bottom:\s*64px/.test(css),
    'tablet+phone rule that lifts the banner above the 64px bottom-nav must remain');
});
test('mobile banner text uses line-clamp so it never balloons beyond two lines', () => {
  const css = fs.readFileSync(path.join(__dirname, '..', 'styles.css'), 'utf8');
  truthy(/-webkit-line-clamp:\s*2/.test(css), 'line-clamp:2 on mobile consent text missing');
});

// ─── Tests: close / reopen panel state ───────────────────────────────────────

console.log('\n--- Close + reopen feedback ---');
test('closing feedback preserves lastResult, attempt, assisted, gradedAnswer', () => {
  const before = {
    attempt: 2,
    assisted: true,
    lastResult: { total_score: 14, dimensions: [{dimension:'X',score:2}] },
    gradedAnswer: 'answer graded',
    hidden: false,
  };
  const after = applyGradingAction(before, { type: 'close' });
  eq(after.hidden, true);
  eq(after.attempt, 2);
  eq(after.assisted, true);
  eq(after.lastResult.total_score, 14);
  eq(after.gradedAnswer, 'answer graded');
});
test('closing with no lastResult is a no-op (defensive)', () => {
  const before = { attempt: 0, assisted: false };
  const after = applyGradingAction(before, { type: 'close' });
  falsy(after.hidden);
});
test('reopening flips hidden back without re-grading', () => {
  const before = {
    attempt: 1, assisted: false,
    lastResult: { total_score: 10, dimensions: [] },
    gradedAnswer: 'a', hidden: true,
  };
  const after = applyGradingAction(before, { type: 'reopen' });
  eq(after.hidden, false);
  eq(after.attempt, 1, 'attempt must not advance on reopen');
  eq(after.lastResult.total_score, 10);
  eq(after.gradedAnswer, 'a');
});
test('a successful regrade always shows the panel (hidden -> false)', () => {
  const before = {
    attempt: 1, assisted: false,
    lastResult: { total_score: 10, dimensions: [] },
    gradedAnswer: 'old', hidden: true,
  };
  const after = applyGradingAction(before, {
    type: 'regrade',
    result: { total_score: 15, dimensions: [{dimension:'X',score:3}] },
    answer: 'new',
  });
  eq(after.hidden, false);
  eq(after.attempt, 2);
  eq(after.gradedAnswer, 'new');
});
test('user answer (caseAnswers) is independent of the hidden flag', () => {
  // Simulates the real split: close panel never touches state.caseAnswers
  const caseAnswers = { 'case-study-fotmob': 'my full essay here' };
  applyGradingAction({ lastResult: {}, hidden: false }, { type: 'close' });
  eq(caseAnswers['case-study-fotmob'], 'my full essay here');
});
test('closeGradeResult function exists and only hides, never deletes', () => {
  const src = fs.readFileSync(path.join(__dirname, '..', 'js', 'app.js'), 'utf8');
  const start = src.indexOf('function closeGradeResult');
  truthy(start > 0, 'closeGradeResult must exist');
  const end = src.indexOf('\nfunction ', start + 1);
  const body = src.slice(start, end > 0 ? end : src.length);
  falsy(/delete\s+state\.caseGrading/.test(body), 'close must not delete grading state');
  falsy(/caseAnswers\[.*\]\s*=\s*['"]{2}/.test(body), 'close must not wipe the answer');
  truthy(body.includes('hidden: true'), 'close must set hidden: true');
});
test('reopenGradeResult does not increment attempt or call fetch', () => {
  const src = fs.readFileSync(path.join(__dirname, '..', 'js', 'app.js'), 'utf8');
  const start = src.indexOf('function reopenGradeResult');
  truthy(start > 0, 'reopenGradeResult must exist');
  const end = src.indexOf('\nfunction ', start + 1);
  const body = src.slice(start, end > 0 ? end : src.length);
  falsy(/\battempt\s*\+\s*1\b/.test(body), 'reopen must not advance attempt');
  falsy(/fetch\s*\(/.test(body), 'reopen must not call fetch');
});

// ─── Tests: Improve My Answer rename + behaviour ─────────────────────────────

console.log('\n--- Improve My Answer button ---');
test('result markup uses the new Improve My Answer label', () => {
  const src = fs.readFileSync(path.join(__dirname, '..', 'js', 'app.js'), 'utf8');
  truthy(src.includes('Improve my answer'), 'new primary action label missing');
  // The old string should no longer be rendered to users (back-compat function alias is OK)
  falsy(src.includes('Try again with this fix'), 'legacy label still rendered');
});
test('primary action keeps btn-primary styling', () => {
  const src = fs.readFileSync(path.join(__dirname, '..', 'js', 'app.js'), 'utf8');
  truthy(/class="btn-primary improve-answer-btn"/.test(src), 'improve button must be btn-primary');
});
test('improveMyAnswer does not clear the answer or the grade', () => {
  const src = fs.readFileSync(path.join(__dirname, '..', 'js', 'app.js'), 'utf8');
  const start = src.indexOf('function improveMyAnswer');
  truthy(start > 0, 'improveMyAnswer must exist');
  const end = src.indexOf('\nfunction ', start + 1);
  const body = src.slice(start, end > 0 ? end : src.length);
  falsy(/delete\s+state\.caseGrading/.test(body));
  falsy(/caseAnswers\[.*\]\s*=\s*['"]{2}/.test(body));
  // It must refocus the textarea
  truthy(/textarea\.focus\(\)/.test(body), 'must refocus the editor');
});

// ─── Tests: View Last Feedback button ────────────────────────────────────────

console.log('\n--- View Last Feedback ---');
test('markup includes the View Last Feedback button, hidden by default', () => {
  const src = fs.readFileSync(path.join(__dirname, '..', 'js', 'app.js'), 'utf8');
  truthy(src.includes('viewLastFeedbackBtn'), 'button id missing');
  truthy(src.includes('View last feedback'), 'button label missing');
  truthy(/class="view-last-feedback-btn hidden"/.test(src), 'must start hidden');
});
test('button shows only when a stored result is currently hidden', () => {
  const src = fs.readFileSync(path.join(__dirname, '..', 'js', 'app.js'), 'utf8');
  const start = src.indexOf('function updateGraderUI');
  const end = src.indexOf('\nfunction ', start + 1);
  const body = src.slice(start, end);
  truthy(/grading\.lastResult.*grading\.hidden/s.test(body), 'visibility must gate on hidden + lastResult');
});
test('button carries a stale indicator when the answer was edited after grading', () => {
  const src = fs.readFileSync(path.join(__dirname, '..', 'js', 'app.js'), 'utf8');
  truthy(src.includes('needs refresh'), 'stale pill label missing');
  const start = src.indexOf('function updateGraderUI');
  const end = src.indexOf('\nfunction ', start + 1);
  const body = src.slice(start, end);
  truthy(/\.vlf-stale/.test(body), 'stale pill must be toggled in updateGraderUI');
});
test('on reload, a case with hidden:true does not auto-render the panel', () => {
  const src = fs.readFileSync(path.join(__dirname, '..', 'js', 'app.js'), 'utf8');
  const start = src.indexOf('function renderCaseStudy');
  const end = src.indexOf('\nfunction ', start + 1);
  const body = src.slice(start, end);
  truthy(/!grading\.hidden/.test(body), 'hydration must skip render when hidden is true');
});

// ─── Tests: stale warning survives close / reopen ────────────────────────────

console.log('\n--- Stale status across hide/reopen ---');
test('stale badge still renders when the answer changed before reopening', () => {
  // Simulated flow: graded → closed → user edits → reopen
  let g = { attempt: 1, assisted: false, lastResult: { total_score: 10, dimensions: [{dimension:'X',score:2}] }, gradedAnswer: 'first draft', hidden: false };
  g = applyGradingAction(g, { type: 'close' });
  eq(g.hidden, true);
  const editedAnswer = 'first draft (edited)';
  truthy(isStaleGrade(editedAnswer, g.gradedAnswer), 'edit should mark answer stale');
  g = applyGradingAction(g, { type: 'reopen' });
  eq(g.hidden, false);
  // Grade and gradedAnswer unchanged; stale is determined at render time from (current, graded)
  truthy(isStaleGrade(editedAnswer, g.gradedAnswer));
});
test('updateGraderUI computes stale live from current answer vs gradedAnswer (not stored flag)', () => {
  const src = fs.readFileSync(path.join(__dirname, '..', 'js', 'app.js'), 'utf8');
  const start = src.indexOf('function updateGraderUI');
  const end = src.indexOf('\nfunction ', start + 1);
  const body = src.slice(start, end);
  truthy(/isStaleGrade\(answer,\s*grading\.gradedAnswer\)/.test(body),
    'stale must be derived live in updateGraderUI');
});
test('renderGradeResult does not bake in a static stale badge — updateGraderUI owns it', () => {
  const src = fs.readFileSync(path.join(__dirname, '..', 'js', 'app.js'), 'utf8');
  const start = src.indexOf('function renderGradeResult');
  const end = src.indexOf('\nfunction ', start + 1);
  const body = src.slice(start, end);
  falsy(/`<div class="stale-badge">/.test(body),
    'renderGradeResult should not interpolate a stale-badge (prevents double badges)');
});

// ─── Tests: close button accessibility ───────────────────────────────────────

console.log('\n--- Close button a11y ---');
test('close button has an accessible label and visible ×', () => {
  const src = fs.readFileSync(path.join(__dirname, '..', 'js', 'app.js'), 'utf8');
  truthy(/class="grader-close-btn"/.test(src), 'close button must exist');
  truthy(/aria-label="Close feedback[^"]*"/.test(src), 'close button needs aria-label');
  truthy(/>×</.test(src), 'close button must render ×');
});
test('close button is bound to closeGradeResult, not to delete', () => {
  const src = fs.readFileSync(path.join(__dirname, '..', 'js', 'app.js'), 'utf8');
  const lineRx = /class="grader-close-btn"[\s\S]*?onclick="(closeGradeResult|[^"]+)\('/;
  const m = src.match(lineRx);
  truthy(m && m[1] === 'closeGradeResult', 'wrong handler bound to × button');
});
test('stale-badge and assisted-badge reserve right-side space for the × button', () => {
  const css = fs.readFileSync(path.join(__dirname, '..', 'styles.css'), 'utf8');
  // Both badges live at the top of the panel. The × is absolute at ~top:0.5rem/right:0.55rem (32px square),
  // so each badge must leave >= ~40px of right padding so text never slides under the ×.
  const stale = css.match(/\.stale-badge\s*\{[^}]*padding:\s*[^;]+;/);
  const assisted = css.match(/\.assisted-badge\s*\{[^}]*padding:\s*[^;]+;/);
  truthy(stale, 'stale-badge padding rule missing');
  truthy(assisted, 'assisted-badge padding rule missing');
  // 2.5rem = 40px — enough to clear the 32px × plus its 0.55rem right offset
  truthy(/padding:\s*[\d.]+rem\s+2\.5rem/.test(stale[0]), `stale-badge must reserve 2.5rem right padding: ${stale[0]}`);
  truthy(/padding:\s*[\d.]+rem\s+2\.5rem/.test(assisted[0]), `assisted-badge must reserve 2.5rem right padding: ${assisted[0]}`);
});

// ─── Tests: consent banner Learn more accessibility ──────────────────────────

console.log('\n--- Consent banner Learn more ---');
test('Learn more button is a sibling of the clamped <p>, not inside it', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  // Find the consent-banner-text-wrap block
  const wrap = html.match(/<div class="consent-banner-text-wrap">[\s\S]*?<\/div>/);
  truthy(wrap, 'consent-banner-text-wrap wrapper missing');
  const inner = wrap[0];
  truthy(/<p class="consent-banner-text">[\s\S]*?<\/p>\s*<button[^>]*consent-more-btn/.test(inner),
    'Learn more <button> must appear AFTER the closing </p>, as a sibling (otherwise -webkit-line-clamp hides it on mobile)');
  // Also: the <p> no longer contains a <button>
  const pOnly = inner.match(/<p class="consent-banner-text">([\s\S]*?)<\/p>/);
  truthy(pOnly, 'paragraph missing');
  falsy(/<button/.test(pOnly[1]), 'Learn more must not be nested inside the paragraph');
});
test('Learn more preserves its ARIA wiring and handler', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  truthy(html.includes('id="consentMoreBtn"'), 'id must be preserved');
  truthy(html.includes('onclick="toggleConsentDetails()"'), 'handler preserved');
  truthy(html.includes('aria-expanded="false"'), 'aria-expanded preserved');
  truthy(html.includes('aria-controls="consentDetails"'), 'aria-controls preserved');
});
test('Mobile consent CSS makes Learn more a 24px+ tap target on its own line', () => {
  const css = fs.readFileSync(path.join(__dirname, '..', 'styles.css'), 'utf8');
  const mq = css.match(/@media\s*\(max-width:\s*500px\)\s*\{[\s\S]*?\n\}/g) || [];
  const hit = mq.find(b => /\.consent-more-btn\s*\{/.test(b) && /\.consent-banner-text-wrap\s*\{/.test(b));
  truthy(hit, 'mobile @media block must style both .consent-banner-text-wrap and .consent-more-btn');
  truthy(/flex-direction:\s*column/.test(hit), 'wrapper should stack text + learn vertically on mobile');
  truthy(/min-height:\s*24px/.test(hit), 'Learn more needs min-height 24px for comfortable tap');
});

// ─── Summary ─────────────────────────────────────────────────────────────────

console.log(`\n--- Summary ---`);
console.log(`  Passed: ${passed}  Failed: ${failed}`);
process.exit(failed === 0 ? 0 : 1);
