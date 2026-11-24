/**
 * Step 4 — Homepage AI Feedback Discovery tests.
 * Asserts the four pilot case studies are featured on the homepage with correct
 * markup, links, labels, and that the full library is untouched.
 */

const fs = require('fs');
const path = require('path');

const HTML = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const DATA = fs.readFileSync(path.join(__dirname, '..', 'js', 'data.js'), 'utf8');
const APP  = fs.readFileSync(path.join(__dirname, '..', 'js', 'app.js'), 'utf8');

const PILOT_IDS = ['case-study-fotmob', 'case-study-cricbuzz', 'case-study-spotify', 'case-study-swiggy'];
// Swiggy is promoted to the hero, so the grid holds the other three pilot cases.
const HERO_CASE_ID = 'case-study-swiggy';
const GRID_CASE_IDS = PILOT_IDS.filter(id => id !== HERO_CASE_ID);

// ─── Harness ────────────────────────────────────────────────────────────────
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

// Extract the featured-grid-ai block so we scope our assertions tightly to the homepage section.
function featuredBlock() {
  const start = HTML.indexOf('featured-grid-ai');
  truthy(start > 0, 'featured-grid-ai container missing');
  const openDiv = HTML.lastIndexOf('<div', start);
  const end = HTML.indexOf('</div>\n    </div>', openDiv);
  return HTML.slice(openDiv, end);
}

// ─── Section heading + copy ─────────────────────────────────────────────────

console.log('\n--- Section heading + section copy (v2.6.0 reactivation copy) ---');
test('section heading reads "Practice with AI Feedback"', () => {
  truthy(/<h2 class="featured-title">Practice with AI Feedback<\/h2>/.test(HTML),
    'heading missing — expected "Practice with AI Feedback"');
});
test('freeze-era heading "Featured Case Teardowns" is gone', () => {
  falsy(/>Featured Case Teardowns</.test(HTML),
    'freeze-era heading must not appear once the grader is reactivated');
});
test('kicker + subtitle describe the AI feedback benefit (not just release stage)', () => {
  truthy(/<div class="featured-kicker">Explore more cases<\/div>/.test(HTML), 'kicker missing');
  const sub = HTML.match(/<p class="featured-subtitle">([^<]+)<\/p>/);
  truthy(sub, 'subtitle missing');
  truthy(/AI/i.test(sub[1]) || /feedback/i.test(sub[1]),
    'subtitle must describe what users get (mention AI feedback or feedback on reasoning)');
  truthy(/improve|reasoning|discover/i.test(sub[1]),
    'subtitle must mention what the user learns or improves');
});
test('visible homepage-level experimental disclaimer is present (not hover-only)', () => {
  truthy(/class="featured-ai-disclaimer"/.test(HTML),
    'featured-ai-disclaimer element must be present as visible copy, not a tooltip');
  const disc = HTML.match(/<p class="featured-ai-disclaimer"[^>]*>([^<]+)<\/p>/);
  truthy(disc, 'disclaimer text missing');
  truthy(/experimental/i.test(disc[1]) && /directional/i.test(disc[1]) && /calibrat/i.test(disc[1]),
    'disclaimer must say grading is experimental, scores are directional, and calibration is ongoing');
  falsy(/expert[- ]?verified|scientifically|independently calibrated/i.test(HTML),
    'must not describe scoring as expert-verified, scientifically accurate, or independently calibrated');
});

// ─── Featured card selection ────────────────────────────────────────────────

console.log('\n--- Featured cards ---');
test('grid holds the three non-hero pilot cases (Swiggy is the hero, not duplicated below)', () => {
  const block = featuredBlock();
  const cards = block.match(/class="featured-card ai-card"/g) || [];
  eq(cards.length, 3, `expected 3 AI cards in the grid (hero + 3 = 4 pilot cases total), found ${cards.length}`);
});
test('grid cards carry the three non-hero pilot IDs, in order', () => {
  const block = featuredBlock();
  const ids = Array.from(block.matchAll(/data-case-id="([^"]+)"/g)).map(m => m[1]);
  eq(ids, GRID_CASE_IDS);
});
test('grid never duplicates the hero case', () => {
  const block = featuredBlock();
  falsy(block.includes(`data-case-id="${HERO_CASE_ID}"`),
    `${HERO_CASE_ID} is the hero — it must not reappear in the grid`);
  // And checking from the other direction: the hero data-case-id outside the grid
  truthy(HTML.split(block).join('').includes(`data-case-id="${HERO_CASE_ID}"`),
    `${HERO_CASE_ID} should still exist as the hero elsewhere in the page`);
});
test('no non-pilot case is featured on the homepage', () => {
  const block = featuredBlock();
  for (const bad of ['case-study-chess', 'case-study-notion', 'case-study-linkedin',
                     'case-study-flipkart', 'case-study-revolut', 'case-study-zalando']) {
    falsy(block.includes(bad), `${bad} must not appear in the AI featured grid`);
  }
});
test('every pilot case (hero + 3 grid cards) carries an "AI Feedback Available" pill', () => {
  // The badge class name is retained from the Experimental Beta rollout; the user-visible label
  // was swapped to describe what the feature does, not just the release stage.
  const labels = (HTML.match(/AI Feedback Available/g) || []).length;
  eq(labels, 4, `expected 4 "AI Feedback Available" labels (hero + 3 grid cards), found ${labels}`);
  const pills = (HTML.match(/class="ai-beta-badge"/g) || []).length;
  eq(pills, 4, `expected 4 .ai-beta-badge pills (hero + 3 grid cards), found ${pills}`);
});
test('older freeze-era / beta-era label text is gone', () => {
  falsy(/AI · Experimental Beta|AI · Beta\b/.test(HTML),
    'previous release-stage labels must be replaced with benefit-oriented copy');
});
test('across the whole homepage, every pilot case appears exactly once', () => {
  // Hero markup + grid markup together should cover all four pilot IDs, with no duplicates.
  for (const id of PILOT_IDS) {
    const hits = (HTML.match(new RegExp(`data-case-id="${id}"`, 'g')) || []).length;
    eq(hits, 1, `${id} must appear exactly once (hero or grid, never both). Found ${hits}.`);
  }
});
test('AI label CSS is preserved for easy reactivation (markup removed, styles stay)', () => {
  // We deliberately keep .featured-ai-label CSS in styles.css so reactivation is a markup-only change.
  // No visual impact while freeze is in effect because no element carries the class.
  const css = fs.readFileSync(path.join(__dirname, '..', 'styles.css'), 'utf8');
  truthy(/\.featured-ai-label\s*\{/.test(css), '.featured-ai-label CSS must remain for reactivation');
});

// ─── Navigation wiring ──────────────────────────────────────────────────────

console.log('\n--- Card navigation ---');
test('each grid card has a card-level onclick to its own case', () => {
  const block = featuredBlock();
  for (const id of GRID_CASE_IDS) {
    const rx = new RegExp(`data-case-id="${id}"[\\s\\S]*?onclick="showView\\('module', \\{levelId: 'advanced', topicId: '${id}'\\}\\)"`);
    truthy(rx.test(block), `card ${id} missing matching onclick`);
  }
});
test('each grid card is keyboard-activatable (Enter / Space) and has role=button', () => {
  const block = featuredBlock();
  const roles = block.match(/role="button"/g) || [];
  eq(roles.length, 3, 'each grid card must have role=button');
  const tabindexes = block.match(/tabindex="0"/g) || [];
  eq(tabindexes.length, 3, 'each grid card must be tab-focusable');
  const keydowns = block.match(/onkeydown="if\(event\.key==='Enter'\|\|event\.key===' '\)/g) || [];
  eq(keydowns.length, 3, 'each grid card must handle Enter and Space');
});
test('inner "Open teardown →" button stopPropagation and routes to the same case', () => {
  const block = featuredBlock();
  for (const id of GRID_CASE_IDS) {
    const rx = new RegExp(`data-case-id="${id}"[\\s\\S]*?event\\.stopPropagation\\(\\); showView\\('module', \\{levelId: 'advanced', topicId: '${id}'\\}\\)`);
    truthy(rx.test(block), `${id} inner button must stopPropagation and route to self`);
  }
});

// ─── Library integrity ─────────────────────────────────────────────────────

console.log('\n--- Full library preserved ---');
test('data.js still defines all original ten case studies plus the five new ones', () => {
  const originalTen = [
    'case-study-spotify', 'case-study-linkedin', 'case-study-chess',
    'case-study-fotmob', 'case-study-cricbuzz', 'case-study-flipkart',
    'case-study-swiggy', 'case-study-notion', 'case-study-revolut',
    'case-study-zalando',
  ];
  const newFive = [
    'case-study-slack', 'case-study-netflix', 'case-study-airbnb',
    'case-study-google-maps', 'case-study-figma',
  ];
  for (const id of [...originalTen, ...newFive]) {
    truthy(DATA.includes(`id: "${id}"`), `${id} missing from data.js`);
  }
});
test('Notion is still fully available in the library (just no longer the hero)', () => {
  // Hero moved to Swiggy, but Notion remains defined in data.js and reachable via the library.
  truthy(DATA.includes('id: "case-study-notion"'), 'Notion case must still exist in data.js');
  // And is not the hero any more
  falsy(/featured-hero-card[\s\S]*?topicId: 'case-study-notion'/.test(HTML),
    'Notion must not be the hero after Step 4 correction');
});

// ─── Hero featured case points to an AI-enabled pilot case ──────────────────

console.log('\n--- Hero featured case ---');
// Helper: hero markup lives in hero-right, from <div class="featured-hero-card"...>
// up to the matching </div> that closes the Start-this-case button's parent.
function heroBlock() {
  const start = HTML.indexOf('class="featured-hero-card"');
  const anchor = HTML.lastIndexOf('<div', start);
  // End at the next sibling section rather than counting divs manually. The section comment
  // flips between "Practice with AI Feedback" (grader active) and "Featured Case Teardowns" (freeze);
  // try both so this helper survives either state.
  const markers = ['<!-- ─── Featured Case Teardowns ─── -->', '<!-- ─── Practice with AI Feedback ─── -->'];
  let end = -1;
  for (const m of markers) {
    const i = HTML.indexOf(m, anchor);
    if (i > 0) { end = i; break; }
  }
  return HTML.slice(anchor, end > 0 ? end : HTML.length);
}

test('hero featured card points to an AI-enabled pilot case', () => {
  const hero = heroBlock();
  const dataId = hero.match(/data-case-id="([^"]+)"/);
  truthy(dataId, 'hero must declare data-case-id');
  truthy(PILOT_IDS.includes(dataId[1]),
    `hero case id ${dataId[1]} must be one of the AI-enabled pilot cases ${PILOT_IDS.join(', ')}`);
  // Every navigation hook (card onclick, keydown, inner CTA) must route to that same id.
  // Handle both `topicId: '...'` and `topicId:'...'` (the keydown inline handler drops the space).
  const routes = Array.from(hero.matchAll(/topicId:\s*'([^']+)'/g)).map(m => m[1]);
  truthy(routes.length >= 3, `hero should have 3 navigation hooks, found ${routes.length}: ${routes.join(', ')}`);
  for (const r of routes) {
    eq(r, dataId[1], `every hero navigation target must match data-case-id (${dataId[1]}), got ${r}`);
  }
});
test('hero carries the "AI Feedback Available" pill', () => {
  const hero = heroBlock();
  truthy(/AI Feedback Available/.test(hero), 'hero must advertise AI Feedback Available');
  truthy(/class="ai-beta-badge"/.test(hero), 'hero must use the shared pill style for the AI label');
});
test('Swiggy hero description includes the personalized-feedback benefit line', () => {
  const hero = heroBlock();
  truthy(/personalized feedback/i.test(hero),
    'Swiggy hero copy must mention personalized feedback so the benefit is visible without a tooltip');
});
test('hero metadata (title, description, tags, icon) matches the chosen pilot case', () => {
  const hero = heroBlock();
  const dataId = hero.match(/data-case-id="([^"]+)"/)[1];
  // Specific to the Swiggy correction in this round — if the hero case ever changes,
  // this test will prompt the author to update the matching copy.
  if (dataId === 'case-study-swiggy') {
    truthy(/Swiggy Order Cancellations Spike/.test(hero), 'hero title must match Swiggy');
    truthy(/Cancellation rate jumped/.test(hero), 'hero description must match Swiggy');
    truthy(/Unit Economics/.test(hero) && /Logistics/.test(hero), 'hero tags must match Swiggy');
    // Notion-era metadata must be gone from the hero
    falsy(/Notion Onboarding Drop-off/.test(hero), 'legacy Notion title must be gone from the hero');
    falsy(/Diagnose the drop-off/.test(hero), 'legacy Notion description must be gone from the hero');
  }
});
test('hero is not duplicated — exactly one featured-hero-card in the markup', () => {
  const matches = HTML.match(/class="featured-hero-card"/g) || [];
  eq(matches.length, 1, 'hero should appear exactly once; duplicates would risk inconsistent copy');
});
test('Advanced level now lists exactly 15 case studies (10 original + 5 new)', () => {
  const advSection = DATA.slice(DATA.indexOf('id: "advanced"'), DATA.length);
  // Allow hyphens in slugs so multi-word ids like "case-study-google-maps" are counted.
  const caseIds = (advSection.match(/id: "case-study-[a-z-]+"/g) || []).map(m => m.replace(/.*"(case-study-[a-z-]+)".*/, '$1'));
  const unique = Array.from(new Set(caseIds));
  eq(unique.length, 15, `expected 15 case studies in advanced level, found ${unique.length}: ${unique.join(', ')}`);
});
test('non-pilot cases can still be opened via the library topics page', () => {
  // renderCaseStudy renders a case study regardless of pilot status — grader UI is gated separately.
  truthy(APP.includes('function renderCaseStudy'), 'renderCaseStudy must still exist');
  // isPilotCase gates only the grader UI, not the page itself
  const renderStart = APP.indexOf('function renderCaseStudy');
  const renderEnd = APP.indexOf('\n}', renderStart);
  const body = APP.slice(renderStart, renderEnd);
  truthy(/isPilotCase\(topic\.id\)/.test(body), 'grader must be gated by isPilotCase inside renderCaseStudy');
});

// ─── Responsive: AI grid min width tuned for 4 columns ──────────────────────

console.log('\n--- Responsive grid ---');
test('featured-grid-ai uses minmax that permits 4 columns on wide screens', () => {
  const css = fs.readFileSync(path.join(__dirname, '..', 'styles.css'), 'utf8');
  const rule = css.match(/\.featured-grid-ai\s*\{[^}]+\}/);
  truthy(rule, 'featured-grid-ai rule missing');
  truthy(/minmax\(260px,\s*1fr\)/.test(rule[0]),
    'AI grid should use minmax(260px, 1fr) so 4 cards fit on desktop and stack on narrow screens');
});
test('card keeps focus-visible outline for keyboard a11y', () => {
  const css = fs.readFileSync(path.join(__dirname, '..', 'styles.css'), 'utf8');
  truthy(/\.featured-card\.ai-card:focus-visible/.test(css), 'ai-card:focus-visible rule missing');
});

// ─── Freeze guards ──────────────────────────────────────────────────────────

console.log('\n--- Grader reactivation (v2.6.0 benefit-oriented copy) ---');
test('GRADER_ENABLED constant is declared and set to true in app.js', () => {
  truthy(/const\s+GRADER_ENABLED\s*=\s*true\s*;/.test(APP),
    'app.js must declare `const GRADER_ENABLED = true;` for the 10-user experimental beta');
});
test('How-it-works flow uses the new wording', () => {
  truthy(/>Choose a case<\/span>/.test(HTML) || /Choose a case/.test(HTML),
    'step 1 must read "Choose a case"');
  truthy(/>Write your solution<\/span>/.test(HTML) || /Write your solution/.test(HTML),
    'step 2 must read "Write your solution"');
  truthy(/Get AI feedback/.test(HTML), 'step 3 must mention AI feedback and improvement');
  truthy(/class="hero-flow-note"/.test(HTML),
    'a visible note must clarify that AI feedback is available on 4 of the case studies');
  const note = HTML.match(/<p class="hero-flow-note"[^>]*>([^<]+)<\/p>/);
  truthy(note, 'hero-flow-note text missing');
  truthy(/4 selected cases|4 of the|4 case/i.test(note[1]),
    'clarification must name the 4-case scope so other cases aren’t implied to have AI');
  truthy(/model answers|evaluation rubric|rubric/i.test(note[1]),
    'clarification must say the other cases include model answers / rubrics');
});
test('Grid card CTAs read "Practice this case" (not "Open teardown")', () => {
  const block = featuredBlock();
  const practice = (block.match(/Practice this case/g) || []).length;
  eq(practice, 3, 'each of the three grid pilot cards must use "Practice this case" as its CTA');
  falsy(/Open teardown/.test(block), 'legacy "Open teardown" CTA must be removed from the grid');
});
test('isPilotCase helper is gated by GRADER_ENABLED', () => {
  const start = APP.indexOf('function isPilotCase');
  const end = APP.indexOf('}', start);
  const body = APP.slice(start, end);
  truthy(/GRADER_ENABLED/.test(body),
    'isPilotCase must AND with GRADER_ENABLED so one flag hides the whole UI');
});
test('GRADER_URL is preserved for easy reactivation', () => {
  truthy(APP.includes("https://pm-gym-grader-production.joshisanket80.workers.dev/grade"),
    'Worker URL must be preserved — reactivation flips a flag, no code hunt');
});
test('four pilot case IDs still declared so reactivation is a one-flag flip', () => {
  for (const id of PILOT_IDS) {
    truthy(APP.includes(`'${id}'`), `pilot id ${id} must remain in PILOT_CASE_IDS`);
  }
});

// ─── Summary ───────────────────────────────────────────────────────────────

console.log(`\n--- Summary ---`);
console.log(`  Passed: ${passed}  Failed: ${failed}`);
process.exit(failed === 0 ? 0 : 1);
