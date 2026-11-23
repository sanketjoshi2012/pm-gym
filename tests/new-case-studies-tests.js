/**
 * Focused tests for the five newly added case studies (Slack, Netflix, Airbnb,
 * Google Maps, Figma). Verifies content integrity, category mapping, library size,
 * and — critically — that none of them is wired into AI grading.
 */

const fs = require('fs');
const path = require('path');

const DATA = fs.readFileSync(path.join(__dirname, '..', 'js', 'data.js'), 'utf8');
const APP  = fs.readFileSync(path.join(__dirname, '..', 'js', 'app.js'), 'utf8');
const HTML = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const GRADER_RUBRIC = fs.readFileSync(path.join(__dirname, '..', 'js', 'grader-rubric.js'), 'utf8');

const NEW_CASES = [
  { id: 'case-study-slack',       title: 'Slack Workspaces That Never Become Teams',   category: 'Work & Productivity'   },
  { id: 'case-study-netflix',     title: 'Netflix Cheaper Subscription Tier Decision', category: 'Media & Entertainment' },
  { id: 'case-study-airbnb',      title: 'Airbnb Reducing Misleading Listings',        category: 'Travel & Hospitality'  },
  { id: 'case-study-google-maps', title: 'Google Maps Route Recommendation Experiment',category: 'Maps & Navigation'     },
  { id: 'case-study-figma',       title: 'Figma Plugin Ecosystem Quality',             category: 'Work & Productivity'   },
];

const ORIGINAL_TEN = [
  'case-study-spotify', 'case-study-linkedin', 'case-study-chess',
  'case-study-fotmob', 'case-study-cricbuzz', 'case-study-flipkart',
  'case-study-swiggy', 'case-study-notion', 'case-study-revolut',
  'case-study-zalando',
];

const PILOT_IDS = new Set([
  'case-study-fotmob', 'case-study-cricbuzz',
  'case-study-spotify', 'case-study-swiggy',
]);

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

// Pull a single case-study's block out of data.js (from id: "..." up to the next id: declaration).
function sliceCase(id) {
  const start = DATA.indexOf(`id: "${id}"`);
  if (start < 0) throw new Error(`${id} not found in data.js`);
  const next = DATA.indexOf('\n          id: "', start + 1);
  return DATA.slice(start, next > 0 ? next : DATA.length);
}

// ─── Total count: 15 case studies in advanced level ─────────────────────────

console.log('\n--- Library total ---');
test('Advanced level contains exactly 15 case studies', () => {
  const advSection = DATA.slice(DATA.indexOf('id: "advanced"'));
  const matches = advSection.match(/id: "case-study-[a-z-]+"/g) || [];
  const ids = Array.from(new Set(matches.map(m => m.replace(/.*"([^"]+)".*/, '$1'))));
  eq(ids.length, 15, `expected 15 case studies, got ${ids.length}: ${ids.join(', ')}`);
});
test('All ten original case studies are unchanged in presence and order', () => {
  // Order check only — content preservation is covered by the existing suite.
  let searchFrom = 0;
  for (const id of ORIGINAL_TEN) {
    const idx = DATA.indexOf(`id: "${id}"`, searchFrom);
    truthy(idx > 0, `${id} missing or out of order in data.js`);
    searchFrom = idx;
  }
});

// ─── Each new case defines the required scenario fields ─────────────────────

console.log('\n--- New cases: structure ---');
for (const c of NEW_CASES) {
  test(`${c.id}: declared with isCaseStudy, duration, category "${c.category}"`, () => {
    const block = sliceCase(c.id);
    truthy(/isCaseStudy:\s*true/.test(block), 'isCaseStudy must be true');
    truthy(/duration:\s*"20[–-]25 min"/.test(block), 'duration must be 20–25 min');
    truthy(block.includes(`category: "${c.category}"`), `category must be "${c.category}"`);
  });
  test(`${c.id}: scenario has title, context, prompt, rubric, modelAnswer`, () => {
    const block = sliceCase(c.id);
    truthy(/scenario:\s*\{/.test(block), 'scenario object missing');
    truthy(/title:\s*"/.test(block), 'scenario.title missing');
    truthy(/context:\s*`/.test(block), 'scenario.context missing');
    truthy(/prompt:\s*`/.test(block), 'scenario.prompt missing');
    truthy(/rubric:\s*\[/.test(block), 'scenario.rubric missing');
    truthy(/modelAnswer:\s*`/.test(block), 'scenario.modelAnswer missing');
  });
  test(`${c.id}: rubric has at least 5 dimensions with strong + weak responses`, () => {
    const block = sliceCase(c.id);
    const dims = (block.match(/dimension:\s*"/g) || []).length;
    truthy(dims >= 5, `expected ≥5 rubric dimensions, got ${dims}`);
    const strongs = (block.match(/\n\s{16,}strong:\s*"/g) || []).length;
    const weaks = (block.match(/\n\s{16,}weak:\s*"/g) || []).length;
    truthy(strongs >= 5, `expected ≥5 strong anchors, got ${strongs}`);
    truthy(weaks >= 5, `expected ≥5 weak anchors, got ${weaks}`);
  });
}

// ─── Hypothetical labels on invented figures ────────────────────────────────

console.log('\n--- Hypothetical labelling ---');
for (const c of NEW_CASES) {
  test(`${c.id}: context clearly marks invented figures as illustrative / hypothetical`, () => {
    const block = sliceCase(c.id);
    const contextMatch = block.match(/context:\s*`([\s\S]*?)`/);
    truthy(contextMatch, 'context not found');
    const ctx = contextMatch[1];
    truthy(/illustrative|hypothetical|fictional|for this exercise/i.test(ctx),
      `context must mark invented metrics as illustrative/hypothetical/fictional — none found`);
  });
}
test('model answers invite alternative well-reasoned approaches', () => {
  for (const c of NEW_CASES) {
    const block = sliceCase(c.id);
    const ma = block.match(/modelAnswer:\s*`([\s\S]*?)`\s*\}/);
    truthy(ma, `${c.id}: modelAnswer not found`);
    const txt = ma[1];
    truthy(/Illustrative PM reasoning/i.test(txt) || /alternative.*is also acceptable/i.test(txt),
      `${c.id}: model answer should flag that a strong alternative is acceptable`);
  }
});

// ─── CRITICAL: no AI grading for any of the five new cases ──────────────────

console.log('\n--- Grading exclusion (critical) ---');
test('PILOT_CASE_IDS in app.js still holds exactly the four original pilot cases', () => {
  const start = APP.indexOf('const PILOT_CASE_IDS');
  const end = APP.indexOf(']', start);
  const block = APP.slice(start, end);
  const ids = Array.from(block.matchAll(/'(case-study-[a-z-]+)'/g)).map(m => m[1]);
  eq(ids.sort(), ['case-study-cricbuzz','case-study-fotmob','case-study-spotify','case-study-swiggy'].sort(),
    'only the four original pilot cases may be in PILOT_CASE_IDS');
});
test('None of the new case IDs appears in PILOT_CASE_IDS', () => {
  const start = APP.indexOf('const PILOT_CASE_IDS');
  const end = APP.indexOf(']', start);
  const block = APP.slice(start, end);
  for (const c of NEW_CASES) {
    falsy(block.includes(c.id), `${c.id} must NOT be a pilot case`);
  }
});
test('grader-rubric.js does not define rubrics for any of the five new cases', () => {
  for (const c of NEW_CASES) {
    falsy(GRADER_RUBRIC.includes(`"${c.id}"`) || GRADER_RUBRIC.includes(`'${c.id}'`),
      `${c.id} must not have an entry in grader-rubric.js`);
  }
});
test('New cases are not pilot cases — grader state does not expose them', () => {
  // GRADER_ENABLED toggles with calibration cycles (false during freeze, true during beta).
  // The invariant this suite enforces is that the five new cases are never pilot cases,
  // regardless of whether the grader flag is on, which is covered above by PILOT_CASE_IDS
  // and grader-rubric.js assertions. The flag's own value is tested in homepage-ai-tests.js.
  truthy(/const\s+GRADER_ENABLED\s*=\s*(true|false)\s*;/.test(APP),
    'GRADER_ENABLED must be declared as a boolean constant');
});
test('New case files do not reference the grader UI or Worker URL', () => {
  for (const c of NEW_CASES) {
    const block = sliceCase(c.id);
    falsy(/pm-gym-grader|getFeedbackBtn|requestGrade|graderResult|GRADER_URL/.test(block),
      `${c.id} must not mention any grader internals`);
  }
});

// ─── Category system integrity ──────────────────────────────────────────────

console.log('\n--- Categories ---');
test('Two new categories ("Travel & Hospitality", "Maps & Navigation") are now present', () => {
  truthy(DATA.includes('category: "Travel & Hospitality"'), 'Travel & Hospitality missing in data.js');
  truthy(DATA.includes('category: "Maps & Navigation"'), 'Maps & Navigation missing in data.js');
});
test('Case studies cover exactly 9 unique categories across 15 cases', () => {
  const advSection = DATA.slice(DATA.indexOf('id: "advanced"'));
  const caseIds = Array.from(new Set(
    (advSection.match(/id: "case-study-[a-z-]+"/g) || []).map(m => m.replace(/.*"([^"]+)".*/, '$1'))
  ));
  const cats = new Set();
  for (const id of caseIds) {
    const block = sliceCase(id);
    const m = block.match(/category: "([^"]+)"/);
    truthy(m, `${id}: category missing`);
    cats.add(m[1]);
  }
  eq(cats.size, 9, `expected 9 unique case-study categories, got ${cats.size}: ${Array.from(cats).sort().join(', ')}`);
});
test('preferredOrder in app.js includes both new categories so they sort predictably', () => {
  const block = APP.match(/const preferredOrder = \[[^\]]+\]/);
  truthy(block, 'preferredOrder not found in app.js');
  truthy(block[0].includes('Travel & Hospitality'), 'preferredOrder missing Travel & Hospitality');
  truthy(block[0].includes('Maps & Navigation'), 'preferredOrder missing Maps & Navigation');
});
test('No skill-based category sneaked in (B2B SaaS, Monetization, Experimentation, Trust & Safety)', () => {
  // Per Step 5 direction: industry-only categories; skill-shaped tags belong elsewhere later.
  for (const skill of ['B2B SaaS', 'Monetization', 'Monetisation', 'Experimentation', 'Trust & Safety', 'Pricing', 'Activation']) {
    falsy(DATA.includes(`category: "${skill}"`), `category "${skill}" must not be used — categories are industries, not skills`);
  }
});

// ─── Cache busters bumped so clients re-download the new content ────────────

console.log('\n--- Cache busters ---');
test('index.html references the new data.js version', () => {
  truthy(/data\.js\?v=1\.3\.\d+/.test(HTML), 'data.js cache buster not bumped to 1.3.x');
});

// ─── Summary ────────────────────────────────────────────────────────────────

console.log(`\n--- Summary ---`);
console.log(`  Passed: ${passed}  Failed: ${failed}`);
process.exit(failed === 0 ? 0 : 1);
