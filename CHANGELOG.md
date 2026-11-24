# Changelog

All notable changes to PM Gym are documented here.

Format: [Semantic Versioning](https://semver.org) — `MAJOR.MINOR.PATCH`
- **MAJOR** — breaking changes to structure or existing content
- **MINOR** — new topics, case studies, or levels added
- **PATCH** — fixes to existing content (typos, wrong answers, broken links)

---

## [2.6.0] — 2026-11-24

### Changed — Benefit-oriented homepage copy for the AI-enabled cases
Four cards switch from release-stage labelling (`AI · Beta`, `AI · Experimental Beta`) to a benefit label (`AI Feedback Available`) and the featured section is re-themed around the feedback promise rather than "teardowns". The 4-case scope and all 15 cases in the library are unchanged.

- **Featured section** — `h2` → *"Practice with AI Feedback"*; subtitle → *"Solve real-world inspired PM challenges, receive structured feedback on your reasoning, and discover what to improve next."*
- **Hero "How it works"** — steps become *"Choose a case → Write your solution → Get AI feedback & improve"*, with a new visible note below the strip: *"AI feedback is available on 4 selected cases. Other cases include model answers and evaluation rubrics."*
- **Swiggy hero** — adds *"Get personalized feedback on your PM reasoning, strengths, and areas to improve."* to the existing description; card height, CTA, and click behavior unchanged.
- **Grid CTAs** — three *"Open teardown →"* buttons become *"Practice this case →"*; navigation destinations unchanged.
- **Visible experimental disclaimer** — a new inline `.featured-ai-disclaimer` under the section header reads *"AI grading is experimental. Scores are directional and still being calibrated."* It is standard copy (not a tooltip), visible on mobile. The in-page `.grader-beta-banner` above the editor on each pilot case is preserved unchanged.
- **Non-pilot cases** — the other 11 cases carry no new badges, copy, or UI.

### Changed — Improve My Answer keeps guidance visible during revision
Clicking **Improve my answer** previously hid the entire feedback card, forcing the learner to remember the advice while editing. It now collapses the full feedback panel to a compact *Biggest Lever* panel below the editor, showing the lowest-scoring dimension's name, score, and the model's specific improvement note.

- New `#graderCompactLever` element rendered inside the pilot-case markup, immediately after the textarea. Visibility is gated on the same `hidden + lastResult` signal as the existing *View Last Feedback* button, so the two surfaces stay consistent.
- Content is pulled verbatim from the stored `lastResult` via the existing `pickBiggestLever` helper (lowest score, rubric order for tie-break). **No additional API call, no prompt or rubric change.**
- *"View full feedback"* link inside the compact panel calls `reopenGradeResult` — the existing behavior — so the full dimension-by-dimension view is one click away without a new grade.
- Stale behavior reuses the same signal as the full panel and the VLF button; the compact panel picks up the `.stale` class the moment the learner edits the textarea.
- On a successful regrade, `renderGradeResult` sets `hidden: false`, the full panel returns, the compact lever hides, and the attempt counter increments through the existing path.
- Mobile (375px): panel is inline, no sticky positioning, no horizontal overflow, does not cover the textarea or submit button; `.gcl-helper` wraps to its own line, `.gcl-dim` drops the `margin-left: auto` so the chip sits under the title instead of pushing off-screen.

### Unchanged in this release
- `GRADER_ENABLED = true`, `LLM_PROVIDER = "anthropic"`, the Cloudflare Worker, `PILOT_CASE_IDS`, score calculation, evidence quote validation, rate limits, daily budget cap, analytics events and consent flow, the 15 case studies, and all model-answer / rubric content.
- No new feedback forms, logins, dashboards, or product features.
- Zero paid AI API calls made for this release (all QA ran against a stubbed `fetch`).

---

## [2.5.0] — 2026-11-23

### Changed — AI grader reactivated for a 10-user experimental soft launch
Reverses the v2.3.0 freeze after a two-stage calibration pass: a 24-call synthetic consistency run and a 20-answer human-vs-AI blind benchmark. Soft-launch scope is unchanged: exactly four pilot cases (FotMob, Cricbuzz, Spotify, Swiggy) are AI-graded; the remaining eleven case studies are not.

- **Production Worker** — `worker/wrangler.toml` `LLM_PROVIDER` flipped `"off" → "anthropic"` and redeployed with `wrangler deploy --env production`. `GLOBAL_DAILY_CAP = "20"` retained. KV + Durable Object bindings unchanged.
- **Smoke-test** — one blind production `POST /grade` returned HTTP 200 with a valid five-dimension JSON response, totals computed server-side, and every evidence quote an exact substring of the submitted answer (prior freeze returned 503 before this path).
- **Frontend** — `js/app.js` `GRADER_ENABLED` flipped `false → true`. `isPilotCase` gate and `PILOT_CASE_IDS` set unchanged. Grader URL, drafts, and all stored grading records untouched.
- **UI labelling** — four pilot case cards on the homepage (hero + three grid cards) now carry a small `AI · Beta` / `AI · Experimental Beta` pill. Each pilot case page shows a short banner above the word counter: *"Experimental Beta — AI feedback is in calibration; treat scores as directional."* No new features, no feedback forms, no new case studies, no rubric changes.
- **Calibration evidence (summary, full reports kept in gitignored local files)** — 65.7% exact human–AI agreement across 105 dimension ratings, 95.2% within-one-point, 5 two-point disagreements (all AI more generous), MAE 0.39 on a 3-point scale, zero fabricated evidence quotes accepted. Feedback prose inspection: 3/3 PASS on strong / medium / keyword-stuffed representative answers. Combined paid-API spend across both calibration passes: ~$0.053.
- **To re-freeze if needed**: flip `GRADER_ENABLED` back to `false` in `js/app.js`, redeploy Pages; optionally also set `LLM_PROVIDER = "off"` in `worker/wrangler.toml` and redeploy the Worker so the backend returns 503 before any billable call.

### Unchanged in this release
- All 15 case studies, including the five from v2.4.0, are intact.
- Grading prompts, rubric anchors (`js/grader-rubric.js`), and the Worker schema validator are unchanged from v2.3.0 and before.
- Per-client rate limit, global daily cap, and Durable Object bindings.
- Analytics consent behavior and homepage structure.
- No public announcement; this is a 10-person private recruitment beta.

---

## [2.4.0] — 2026-11-23

### Added — Five new case studies (library grows from 10 → 15)
All five join the Advanced level and are available immediately in the library, category filters, Save Draft, Reveal Model Answer, Mark as Completed, and progress tracking. None of them is wired into AI grading — the public grader stays frozen.

- **Slack — Workspaces That Never Become Teams** (`case-study-slack`, Work & Productivity). B2B activation / organisational adoption scenario with illustrative hypothetical workspace-funnel metrics. Five prompt questions, five-dimension rubric, worked model answer that frames the workspace (not the user) as the primary activation unit.
- **Netflix — Cheaper Subscription Tier Decision** (`case-study-netflix`, Media & Entertainment). Monetisation and pricing scenario exploring incremental acquisition vs. cannibalisation among existing subscribers. Model answer insists on incremental-contribution economics over single-metric subscriber growth.
- **Airbnb — Reducing Misleading Listings Without Hurting Bookings** (`case-study-airbnb`, **Travel & Hospitality** — new category). Marketplace trust and safety scenario balancing guest trust against host supply friction. Model answer prefers risk-based verification with appeals over universal review.
- **Google Maps — An Experiment Improves Engagement but Not Navigation** (`case-study-google-maps`, **Maps & Navigation** — new category). Experimentation / A/B-testing scenario with a hypothetical four-week test where engagement moved but navigation outcomes did not. Model answer treats a statistically significant engagement change as insufficient for a launch decision.
- **Figma — Growing a Plugin Ecosystem Without Losing Product Quality** (`case-study-figma`, Work & Productivity). Platform governance and ecosystem growth scenario balancing user trust, developer friction, and discovery. Model answer scopes a quarter-sized MVP of trust/quality signals.

Every scenario context explicitly labels its invented figures as illustrative / hypothetical / fictional, and every model answer opens with "Illustrative PM reasoning. A well-argued alternative that addresses the underlying problem with evidence and trade-offs is also acceptable." Content governance keeps invented metrics distinct from stated company facts.

### Added — Two new industry categories
- **Travel & Hospitality** (Airbnb).
- **Maps & Navigation** (Google Maps).

The category system is unchanged in structure: `preferredOrder` in `renderTopics()` was extended with the two new categories plus "Gaming" (which already existed in data but was previously ordered alphabetically after the preferred list). Category filter chips, counts, hidden/visible card logic, badge rendering, and the active-category URL/hash flow work unchanged. Case studies now span exactly 9 unique categories across 15 cases:

    Sports 2 · Media & Entertainment 2 · E-commerce & Fashion 2 · Food Delivery 1 ·
    Work & Productivity 4 · Fintech 1 · Travel & Hospitality 1 · Maps & Navigation 1 · Gaming 1

No skill-based categories ("B2B SaaS", "Monetization", "Experimentation", "Trust & Safety") were introduced — categories remain industries, not PM skills.

### Preserved
- All ten existing case studies (Spotify, LinkedIn, Chess, FotMob, Cricbuzz, Flipkart, Swiggy, Notion, Revolut, Zalando) are unchanged in content, order, titles, rubrics, and model answers (verified by `git diff` showing zero deletions in the original regions of `js/data.js`).
- **AI grading remains frozen.** `GRADER_ENABLED = false` in `js/app.js`. Production Worker `[env.production.vars].LLM_PROVIDER = "off"` in `worker/wrangler.toml`. None of the five new IDs appears in `PILOT_CASE_IDS` or `js/grader-rubric.js`.
- No changes to `js/grader-rubric.js`, the Worker, analytics, consent logic, homepage featured case (Swiggy hero), homepage grid (FotMob / Cricbuzz / Spotify), `styles.css`, or draft / progress storage keys.

### Tests
- New `tests/new-case-studies-tests.js` (33 tests): library size, original-ten preservation, per-case structure / duration / category, per-case rubric depth, hypothetical-labelling, alternative-reasoning model-answer note, grading exclusion for each new case (both `PILOT_CASE_IDS` and `grader-rubric.js`), category system integrity (9 unique, two new present, skill-based categories absent), and cache-buster bump.
- `tests/homepage-ai-tests.js` updated in place to assert the library now holds fifteen case studies (not ten), with a regex that allows multi-word slugs.

### Cache busters
- `styles.css` unchanged.
- `index.html` references `data.js?v=1.3.0` and `app.js?v=1.8.1`.

---

## [2.3.0] — 2026-11-19

### Changed — AI Grader temporarily frozen for Cohort 21 calibration (Section 5)
Reversible freeze that hides the public AI grader without losing any code, data, or configuration. Participants will produce calibration answers offline (paper / docs); two independent human evaluations happen first, then we run those answers through the real grader using a private local script (see Section 5 note below).

- **Worker disabled** (`worker/wrangler.toml`): `[env.production.vars].LLM_PROVIDER` flipped from `"anthropic"` to `"off"`. Because `pickAdapter()` returns `null` for anything other than `"anthropic"` or `"mock"`, every `POST /grade` now returns `503 "Grading is temporarily unavailable. Please try again later."` before rate-limit check, context build, or any paid Anthropic call. Verified live:
  ```
  curl -i -X POST https://pm-gym-grader-production.joshisanket80.workers.dev/grade \
    -H 'Content-Type: application/json' \
    -d '{"case_id":"case-study-fotmob","answer":"<192-word synthetic>","attempt":1,"assisted":false}'
  # HTTP/2 503
  # {"error":"Grading is temporarily unavailable. Please try again later."}
  ```
  `ANTHROPIC_API_KEY`, `IP_HASH_SALT`, the KV namespace id, the `GlobalBudget` Durable Object binding, the `v1` migration, the production Worker name, CORS, and the global 20/day cap are all preserved.
- **Frontend grader UI fully hidden** (`js/app.js`): new `const GRADER_ENABLED = false;` next to `GRADER_URL`; `isPilotCase()` now returns `GRADER_ENABLED && PILOT_CASE_IDS.has(topicId)`. One flag flips off the word counter, Get AI feedback button, View last feedback button, result panel, hydration of stored grades, error banner, stale-badge listener, and the model-answer-revealed → assisted flip. `requestGrade()` early-returns. Drafts (`pmgym_case_answers`) and grading records (`pmgym_case_grading`) are preserved in every learner's browser.
- **Homepage AI promotional copy removed** (`index.html`): hero loses its `✦ AI Feedback Available` pill; the three grid cards lose theirs; section renamed "Practice with AI Feedback" → **"Featured Case Teardowns"** with kicker "Explore more cases" and the pre-AI subtitle. Hero still features Swiggy; grid still features FotMob / Cricbuzz / Spotify. The case pages themselves still open — they just no longer promise grading. `index.html` cache-busters bumped to `styles.css?v=1.7.2` and `app.js?v=1.8.0`.

### Preserved (bit for bit)
- `worker/src/*.js` — grader code, schema validator, Anthropic + mock adapters, Durable Object, `GraderError`.
- `js/grader-rubric.js`, `js/app.js` grader helpers and render functions, `js/data.js`, `styles.css` grader rules.
- `tests/grader-ui-tests.js` (77 tests) continues to run and protect the implementation.
- Analytics code, consent logic, rubrics, pilot IDs, production Worker name, KV id, DO binding, migration tag, Worker secrets.
- Every learner's `pmgym_case_answers` and `pmgym_case_grading` localStorage state.

### Added — Private calibration tooling (local only, no public exposure)
- `worker/scripts/real-grade.mjs` extended with `--answers=<path>`, `--repeat=<n>`, `--spend-stop=<usd>`, and `--report=<path>`. Calls the Anthropic adapter directly (no Worker, no `wrangler dev`). Captures per-run dimension-level scores, total scores, token usage, latency, and cost. **Never logs or writes participant answer text.** Reports go to a gitignored path by default.
- `worker/scripts/calibration-answers.mjs` header comment now spells out the privacy rule: real volunteer / Cohort 21 answers belong in a gitignored `*.local.mjs` file and must never be committed, even anonymised.
- `.gitignore` adds `worker/scripts/*.local.mjs` and `worker/scripts/*-report*.json` so neither inputs nor outputs of calibration runs can be committed by accident.

### Reactivation procedure (three steps, in order)
1. **Worker first.** In `worker/wrangler.toml` change `LLM_PROVIDER = "off"` back to `"anthropic"` under `[env.production.vars]`. Run `cd worker && wrangler deploy --env production`. Verify with a schema-valid curl to `/grade` (~0.1¢). The production 20/day cap resumes protecting cost.
2. **Frontend second.** In `js/app.js` set `GRADER_ENABLED = true`. Restore the AI label spans and the "Practice with AI Feedback" copy in `index.html` (git revert the freeze commit's `index.html` hunks is the cleanest route). Flip the homepage tests back to AI assertions. Bump cache-busters. Run all suites green locally.
3. **Push `origin/main`.** GitHub Pages ships the new HTML + JS. Saved drafts and prior grades surface automatically because nothing was deleted.

### Notes
- Zero paid API calls were made for this release.
- Section 5 calibration itself is offline. Participants submit answers on paper / docs; two independent human evaluations happen first; the local runner above is only used after that step. No participant-facing calibration interface was built.
- No changes to analytics, grading rubrics, Worker code, data, or the production daily cap.

---

## [2.2.0] — 2026-11-19

### Added
- **Homepage promotes AI-enabled case studies** (`index.html`, `styles.css`): the right-column hero card now features Swiggy Order Cancellations Spike with a subtle `✦ AI Feedback Available` pill; the lower section, renamed from "Featured Case Teardowns" to **Practice with AI Feedback**, showcases FotMob, Cricbuzz, and Spotify in a responsive card grid. Together the hero and the grid cover all four AI-enabled pilot cases exactly once.
- **"AI Feedback Available" label** on every promoted card (hero + three grid cards). Uses the existing accent tokens as a small pill that stays secondary to the title. No animation, no oversized badge, and never shown for cases that don't support AI grading.
- **Keyboard-activatable cards**: each promoted card is a `role="button"`, `tabindex="0"` surface that responds to Enter / Space; inner CTA buttons stop propagation so they still work independently.
- **Regression tests** (`tests/homepage-ai-tests.js`, +23 tests): assert that the hero points to an AI-enabled pilot case; that the grid holds exactly the three non-hero pilot cases in order; that every pilot id appears exactly once across the homepage (hero or grid, never both); that non-pilot cases are never featured; that all ten case studies remain in the library and reachable; that the AI label uses accent tokens with no animation; and that the responsive grid and focus-visible outline stay intact.

### Changed
- **Hero case swapped Notion → Swiggy** (`index.html`). Notion remains in `data.js` and reachable via the full library — it is no longer the hero, only to keep every promoted card linked to a case where visitors can actually try the AI grader.
- Section heading changed from "Featured Case Teardowns" to **"Practice with AI Feedback"**, with a single-line subtitle. Kicker reads "Try it now".

### Notes
- **AI grader, Cloudflare Worker, analytics consent logic, rubrics, draft persistence, quiz, lessons, homepage hero layout, and bottom-nav are unchanged.**
- **Full library preserved**: all ten case studies (including Notion, Chess.com, LinkedIn, Flipkart, Revolut, Zalando) remain available via Explore all case studies and Practice.
- **Verification**: 23 homepage tests + 77 grader + 163 quiz-validation + 40 logic + 102 Worker tests all pass. Zero paid AI grading requests were made for this change.

---

## [2.1.0] — 2026-11-19

### Added
- **AI Grader frontend wired up for the 4 pilot cases** (`js/app.js`, `styles.css`, `index.html`): FotMob, Cricbuzz, Spotify, and Swiggy case studies now expose a "Get AI feedback" control that calls the deployed Worker at `https://pm-gym-grader-production.joshisanket80.workers.dev/grade`. All other case studies are unchanged. `data.js`, `grader-rubric.js`, the Worker, and the homepage are untouched.
- **Learner-facing result panel**: total score, concise overall comment, a small `✦ AI-GENERATED FEEDBACK` label, a highlighted "Biggest lever" card with the single highest-leverage improvement, a prominent brand-blue "Improve my answer" primary action, and a "By dimension" accordion (collapsed by default) with per-dimension score, reasoning, improvement, and optional evidence quote. Previous attempts persist in `localStorage` under `pmgym_case_grading` and survive reloads; corrupted storage falls back safely to `{}` via `safeLoadJSON`.
- **Close / reopen panel without losing work**: an accessible `×` button in the top-right of the result panel hides the feedback (storing `hidden: true`) without discarding the grade, the attempt counter, the assisted flag, the graded answer, or the learner's current draft. A subtle "↺ View last feedback" button appears in the actions row whenever a stored result is hidden; it carries a `NEEDS REFRESH` pill when the current answer has drifted since grading. Reopening never regrades and never advances the attempt counter.
- **Draft protection**: once the learner reveals the model answer for a pilot case in this browser, every subsequent grade for that case is permanently flagged `assisted: true` (sticky — not cleared by closing, reopening, clearing the draft, or reloading). An "assisted" badge inside the result panel communicates this to the learner.
- **Word-count guidance**: a compact counter below the editor shows `N words` on the left with a contextual hint (`5 more words needed`) when under the 120-word minimum, and a `Min 120 · Max 1,500` chip on the right. A soft character warning appears at 90% of the 15,000-character limit; the limit itself is still enforced before any Worker call via `graderButtonState`.
- **Error surface**: network, 429, 502, 503, 504, 400, and 413 responses each map to a targeted banner. The Worker does not expose `Retry-After` to browser JS, so the 429 message stays generic. In every error path, the learner's draft text is preserved verbatim.
- **XSS safety**: every LLM-sourced field (dimension name, reasoning, improvement, evidence quote, overall comment, biggest-lever copy) is run through `escapeHtml` before interpolation. A grep-based test asserts no field reaches `innerHTML` unwrapped.

### Changed
- **Mobile consent banner compacted** (`styles.css`): on screens ≤ 500 px the banner padding tightens from `0.875rem` to `0.55rem`, text drops to `0.75rem` with a 2-line clamp, and the Accept / Decline buttons shrink to a single no-wrap row with a 36 px tap-target floor. The "Learn more" control was moved out of the clamped `<p>` in `index.html` so the privacy-details disclosure is never hidden by the clamp; its id, `onclick`, `aria-expanded`, and `aria-controls` are unchanged. Banner height on 375 × 812 drops from ~95 px to ~77 px (55 px without Learn more). Consent logic, storage, and analytics preferences are unchanged.
- **Grader panel badges** now reserve 2.5 rem of right padding so the absolute-positioned `×` never overlaps the stale-feedback warning or the assisted badge.

### Notes
- **Rate limits unchanged.** 10/hour and 50/day per client via KV (approximate), global 20/day via Durable Object (atomic). HMAC-salted identifiers only, no raw IPs or learner answers stored.
- **Rubrics, Worker, and analytics unchanged.** No new Mixpanel events in this release — analytics instrumentation for the grader is tracked as a separate task.
- **Verification**: 73 new frontend tests (word counter, close/reopen, VLF visibility, stale-across-hide/reopen, Improve My Answer styling, AI label, no bottom disclaimer, badge × clearance, consent banner mobile tuning, XSS guards) + the existing 163 quiz-validation, 40 logic, and 102 Worker tests all pass. One real production call (Swiggy, 14/18) was made during the first integration pass; this release adds no further paid calls.

---

## [2.0.0] — 2026-11-19

### Added
- **AI Grader backend deployed to Cloudflare** (`worker/wrangler.toml` `[env.production]`): the real Haiku 5.5 grading Worker is now live at `https://pm-gym-grader-production.joshisanket80.workers.dev/grade`. Production environment `pm-gym-grader-production` binds a dedicated KV namespace for per-client counters and a `GlobalBudget` Durable Object (SQLite-backed) for the atomic daily cap. The `v1` migration ran on first deploy.
- **Production configuration pinned in git**: `[env.production]` block adds `ENVIRONMENT="production"`, `LLM_PROVIDER="anthropic"`, `GLOBAL_DAILY_CAP="20"`, and the public KV namespace id. The default top-level `[vars]` block still omits `LLM_PROVIDER` so a bare `wrangler deploy` cannot ship the mock adapter to production.
- **Secrets configured via `wrangler secret put` (not in git)**: `ANTHROPIC_API_KEY` and `IP_HASH_SALT` are stored only as Cloudflare Worker secrets on the production environment.

### Verified at deploy time
- **Fail-closed before secrets:** the first `wrangler deploy --env production` left the Worker reachable but serving HTTP 503 on every `POST /grade` because `IP_HASH_SALT` was not yet set. No mock grading, no paid call. Confirmed with a live probe (latency ~57 ms, response `{"error":"Grading is temporarily unavailable..."}`).
- **One controlled live grading request succeeded** after both secrets were set. Response was a schema-valid feedback object on `case-study-fotmob` with real evidence quotes and reasoning (no `_mock` flag). Billed: 2,355 input + 1,525 output tokens on `claude-haiku-5-5`, Worker-side latency 6.3 s, stop_reason `end_turn`, cost ≈ $0.001 (0.1 ¢). The global daily counter advanced by exactly 1.

### Notes
- **Deployed, not yet integrated.** The Worker is live, but the PM Gym site has no "Get AI feedback" control; `app.js` and `index.html` do not call `/grade` from anywhere. End users still cannot reach the grader. Frontend integration is a separate step.
- **Rate limits and privacy protections unchanged.** 10/hour and 50/day per client via KV (approximate), global 20/day via Durable Object (atomic), HMAC-salted identifiers only, no raw IPs or learner answers stored.
- **Rubrics, website, homepage, and analytics unchanged.**
- The `workers.dev` subdomain `joshisanket80.workers.dev` is a Cloudflare account setting, created once during first deploy.

---

## [1.10.0] — 2026-11-19

### Added
- **Real LLM adapter** (`worker/src/anthropic-llm.js`): calls Anthropic's Messages API with `claude-haiku-5-5`. 15-second timeout, at most one retry (5xx / network / timeout only; no retry on 4xx, 429 or malformed output), 3,500-token output cap, 2-sentence reasoning constraint. Builds the prompt from the scenario, questions, 3-level scoring anchors and universal rules in `js/grader-rubric.js`; the model answer is never included. Evidence quotes are still verified server-side as exact substrings of the learner's answer; `total_score` and `max_total_score` are still computed in `schema.js`.
- **Explicit adapter selection with fail-closed default** (`worker/src/index.js`): the Worker now selects between the real adapter and the mock adapter from `env.LLM_PROVIDER`. Any value other than `"anthropic"` or `"mock"` (including missing) returns HTTP 503 before the rate-limit check or any paid call. `LLM_PROVIDER` is deliberately absent from `wrangler.toml [vars]` so a bare `wrangler deploy` cannot ship mock to production.
- **Truncation detection and failure accounting**: when the API returns `stop_reason: "max_tokens"`, the adapter short-circuits parsing with a distinct `output_truncated` reason. `GraderError` now carries the billed `usage` and `stop_reason` from the upstream response so parse failures and truncations record real costs instead of showing $0.
- **New offline tests** (`worker/tests/anthropic-llm.test.js`): 26 tests covering the prompt builder (every scenario, question and anchor present; model answer absent for all four pilot cases), JSON extraction and parsing, round-trip through the existing schema validator, retry behaviour, timeout handling, truncation detection, parse-failure accounting and log-line hygiene (no answer text, feedback text or API key in logs). Total Worker tests: 102.
- **Local smoke-test scripts** (`worker/scripts/`): `real-grade.mjs` runs up to 10 synthetic calls spanning all four pilot cases and four quality levels (strong, medium, weak, keyword-stuffed). `retry-swiggy.mjs` reruns the previously truncated Swiggy case up to three times. Both enforce a $0.05 cumulative recorded-cost stop in the script and write a JSON report under `scripts/`. The reports are gitignored.

### Changed
- **`wrangler.toml`**: the `LLM_PROVIDER` default was removed so production cannot silently run the mock adapter. The file now documents the production deployment sequence (`[env.production.vars]` with `LLM_PROVIDER = "anthropic"` plus `wrangler secret put ANTHROPIC_API_KEY`).
- **`.dev.vars.example`**: documents `LLM_PROVIDER=mock` (required for local development) and `ANTHROPIC_API_KEY` (required only when `LLM_PROVIDER=anthropic`). Real `.dev.vars` remains git-ignored.

### Notes
- **Implemented but not deployed.** The adapter is committed and offline-tested. The Cloudflare Worker is not deployed, the website has no "Get AI feedback" control, and no end user can reach the grader. Deployment and the frontend integration are separate steps.
- **Measured cost** (offline smoke test, not a production figure): mean ~$0.0011 per grading request on `claude-haiku-5-5`. At the current `GLOBAL_DAILY_CAP` of 20 requests/day, worst-case spend is in the low cents per day. These numbers come from a synthetic calibration set. Real learner costs will be measured again before deployment.
- The synthetic answers used in the smoke tests are clearly labelled in `scripts/calibration-answers.mjs` and must not be used as a human calibration benchmark. The Section-5 calibration against Cohort 21 answers is a separate step.
- Mock adapter retained for tests and local development.

---

## [1.9.0] — 2026-11-16

### Added
- **Per-client rate limiting** (`worker/src/rate-limit.js`): replaces the no-op stub. Uses Cloudflare KV to limit each client to 10 grading requests per hour and 50 per day. These limits are approximate by design because KV is eventually consistent. Clients are identified only from Cloudflare's `CF-Connecting-IP`; client-supplied headers such as `X-Forwarded-For` are never read. IPv6 clients are limited per /64.
- **Global daily request cap** (`worker/src/global-budget.js`): a Durable Object that enforces an exact, atomic cap on grading requests per UTC day across all users. Configurable through `GLOBAL_DAILY_CAP`, with a conservative default of 20. Concurrent requests cannot exceed it.
- **Fail closed behaviour**: if the KV binding, Durable Object binding, `IP_HASH_SALT` secret, or trusted client address is missing, or if any storage call fails, the Worker returns HTTP 503 and does not grade. Limit hits return HTTP 429 with a `Retry-After` header and a generic message.
- **Privacy**: rate-limit storage holds only keyed HMAC digests of client addresses and counters. No raw IP addresses and no learner answers are stored.
- **Rate-limit test suite** (`worker/tests/rate-limit.test.js`): 39 tests covering hourly limits, daily limits, the global cap, concurrent requests, failure conditions, and the request body size cap. Total Worker tests: 71.

### Changed
- **Rate-limit check moved after input validation** in `worker/src/index.js`, so rejected requests (bad case ID, too short, too long) never consume the global budget. It still runs immediately before the LLM call.

### Fixed
- **Request body size cap** (`worker/src/body.js`): the 50 KB limit previously trusted the `Content-Length` header, so a request with a missing or understated header could bypass it. The Worker now counts the bytes it actually receives and stops reading once the limit is passed, returning HTTP 413.

### Notes
- The global cap limits the number of grading requests. It is not a euro spending cap. Worst-case daily spend is roughly the cap multiplied by the maximum cost of one grading request, including retries. The production value must be chosen after measuring real model costs.
- Mock LLM still in place. No real AI provider connected. Worker not deployed.

---

## [1.8.0] — 2026-11-13

### Added
- **Cloudflare Worker** (`worker/`) — locally testable grading backend with a POST `/grade` endpoint. Accepts `case_id`, `answer`, `attempt`, and `assisted`; validates the case against the four pilot cases (FotMob, Cricbuzz, Spotify, Swiggy); enforces a 120-word minimum, 1500-word maximum, and 15,000-character cap; builds a grading context from `grader-rubric.js` with scoring anchors but no model answer; returns structured feedback with per-dimension `score` (1–3), `evidence_quote` (exact substring of the answer or null), `reasoning`, and `improvement`. `total_score` and `max_total_score` are computed server-side, never from the LLM. No real LLM connected and Worker not deployed; run locally with `npm run dev` or `npm test` from `worker/`.
- **Mock LLM adapter** (`worker/src/mock-llm.js`) — returns structurally valid stub feedback for all 21 dimensions across the four pilot cases, clearly marked `_mock: true`. Replaced with a real LLM call in a future step.
- **Rate-limit stub** (`worker/src/rate-limit.js`) — no-op with the fixed `checkRateLimit(request, env)` signature; replaced with a KV burst limiter and Durable Object budget guard in a future step.
- **Worker test suite** (`worker/tests/grade.test.js`) — 32 tests across 5 suites covering input validation, grading context, mock LLM output, schema validation, and end-to-end mock grading for all four pilot cases. Run with `node --test` (no Cloudflare account required).

### Changed
- **`js/grader-rubric.js`** — added a CommonJS export guard at the bottom so the Worker can import the file directly without maintaining a second copy. Guard is a no-op in browser `<script>` tags.

---

## [1.7.0] — 2026-11-12

### Added
- **AI Grader rubric specification** (`js/grader-rubric.js`) — machine-readable scoring anchors for the four-case AI Grader pilot: FotMob, Cricbuzz, Spotify, and Swiggy. Each of the 21 rubric dimensions has explicit score-1, score-2, and score-3 descriptions. Model answers are kept in `data.js` only and are excluded from the grader specification. File is a prerequisite for the Cloudflare Worker implementation; the Worker has not been built yet.

### Changed
- **Spotify case study** — Added a fifth task question: "How would you measure whether your proposed solution worked, and what guardrail metrics would you monitor?" This aligns the prompt with the existing Metrics for Success rubric dimension, which previously had no corresponding explicit question.

---

## [1.6.2] — 2026-11-09

### Fixed
- **Mixpanel SDK not initialising after consent** — `loadAnalytics()` injected the CDN script and waited for `onload` to call `init()`, but the Mixpanel full library requires a pre-existing stub object on `window.mixpanel` to initialise against. Without the stub, `window.mixpanel` remained undefined after the CDN script loaded, so `init()` was never called and no events were sent. Fixed by running the Mixpanel stub IIFE inside `loadAnalytics()` before injecting the CDN script. The stub is created synchronously on consent; the CDN library loads asynchronously, finds the stub, and processes the queued `init()` call. No SDK code runs before consent.

---

## [1.6.1] — 2026-11-09

### Changed
- **Footer privacy row** — Replaced the long privacy paragraph with two compact, centered text links: "Privacy information" and "Manage analytics preferences", separated by a dot. All privacy disclosures are preserved; they now live in a lightweight dialog opened by "Privacy information".

### Added
- **Privacy information dialog** — A centered modal opened from the footer. Contains all six privacy disclosures: local data saved in browser, analytics events tracked after consent, Mixpanel device identifier, IP address handling, how to withdraw consent, and how to clear local learning progress. Closes on X button, Escape key, or clicking outside. Keyboard accessible.

---

## [1.6.0] — 2026-11-09

### Changed
- **Analytics consent gate** — Mixpanel SDK is no longer loaded on page load. The SDK is fetched and initialised only after a visitor explicitly accepts analytics via the new consent banner. Declining keeps the SDK completely absent for that session and all future sessions until consent changes.
- **Google Analytics removed** — The GA4 snippet (G-K5383SFVVD) has been fully removed from index.html. Mixpanel (EU endpoint) remains as the sole analytics provider.
- **`mp()` hardened** — The Mixpanel tracking wrapper now checks `pmgym_analytics_consent === 'accepted'` and `typeof mixpanel !== 'undefined'` before sending any event, providing a second layer of protection independent of the SDK loading gate.
- **`mpSessionEvents()` moved into consent path** — Session start events fire only after the SDK loads and `init()` completes, never on page load or navigation before consent is given.
- **Mixpanel config** — Added `ip: false` to `mixpanel.init()` options. This instructs Mixpanel not to store the client IP as an event property. Note: the IP still reaches Mixpanel's EU servers at the network level during each HTTP request.

### Added
- **Consent banner** — A fixed bottom bar with "No thanks" and "Accept analytics" buttons. Appears on first visit when no consent preference is stored. Keyboard accessible (focus-visible outlines, full tab order). Includes a "Learn more" toggle that expands privacy details inline.
- **Privacy details panel** — Expandable section inside the consent banner listing: which data is saved locally, which events Mixpanel collects after consent, the device identifier, IP handling, and how to withdraw consent or clear local progress.
- **Footer privacy row** — Added below the copyright line. Describes local vs. analytics data storage, Mixpanel's device identifier, IP handling, and how to clear local progress. Includes a "Manage analytics preferences" button that reopens the consent banner.
- **Consent management** — `openConsentPreferences()` shows the banner without changing existing consent. `declineAnalytics()` calls `mixpanel.opt_out_tracking()` and `mixpanel.reset()` and clears Mixpanel localStorage keys when withdrawing from an accepted state, then reloads the page to guarantee the SDK is no longer active. Learning progress (streak, scores, drafts) is never touched.

---

## [1.5.0] — 2026-11-06

### Changed
- **Homepage layout** — Replaced the right-side Daily PM Rep hero card with a static Featured Case card (Notion Onboarding Drop-off). Daily PM Rep moved below the Featured Case Teardowns grid as a collapsible full-width strip.
- **Hero eyebrow** — Updated from "Free PM Learning Platform" to "Free PM case practice for career switchers".
- **Featured Case Teardowns kicker** — Updated from "10 real-world case studies available" to "Explore more cases" to frame the grid as discovery after the featured case.
- **Featured Case Teardowns grid** — Replaced Notion (now featured in hero) with Spotify Engagement Drop to avoid duplication. Grid is now: Spotify · Swiggy · Chess.com.

### Added
- **Daily PM Rep strip** — Compact horizontal strip with lightning icon, heading, description, and a CTA that reflects completion state: "Try today's question" before answering, "Review today's rep" after. Clicking expands the full Daily Rep interface inline; clicking again collapses it. No changes to question selection, streak, analytics, or answer persistence logic.

---

## [1.4.9] — 2026-11-06

### Changed
- **Banner copy** — "PM Gym is actively growing, content and scenarios are added weekly" replaced with "New cases and improvements are in development." Share link preserved.
- **Three-step flow copy** — "Pick Level → Learn & Quiz → Teardowns" updated to "Pick a case → Write your answer → Compare with the rubric" to describe the actual workflow more accurately.
- **Flow steps non-interactive** — Removed click handlers from the three How it works steps. Steps are now purely informational; hover highlight is preserved.

### Added
- **Maker pill** — Replaced the faded founder line with a compact pill below the hero description. Shows avatar initials, bio ("Built by Sanket · Data Scientist in Berlin → PM"), and two links: "Read my story" (About page) and "LinkedIn ↗" (external profile). Keyboard accessible with focus-visible outlines.
- **Streak badge accessibility** — Streak count now displays "N day streak" with an `aria-live` region and visually hidden label for screen readers. SVG flame icon marked `aria-hidden`.

---

## [1.4.8] — 2026-11-06

### Fixed
- **Case study model answer auto-reveals after saving a draft** — The model answer section used the presence of a saved draft to decide its initial visibility, so reopening any case study after saving a draft would immediately expose the model answer. Draft persistence and reveal visibility are now independent. The model answer always starts hidden; it appears only when the user explicitly clicks Reveal Model Answer. Existing drafts and completed progress are unaffected.

---

## [1.4.7] — 2026-11-06

### Fixed
- **Daily Rep pool stability** — If a question is added or removed from the pool after a user has already answered today's Daily Rep, the app now recovers their original answered question by its stored id rather than showing a different question with the wrong saved feedback. If the original question no longer exists in the pool, a neutral "already completed today" message is shown instead. Historical answers are never deleted. No duplicate streak increment or analytics event is fired for already-completed days.
- **Quiz finalization fires more than once** — `finalizeQuiz()` could be called twice on a rapid double-click of "See Results →" before the DOM updated, causing a duplicate Mixpanel `practice_completed` event and a second toast. A per-attempt guard (`state.quizFinalized`) ensures finalization, score saving, and the completion toast each run exactly once. The guard resets on retake and on fresh topic load.
- **Dashboard missing In Progress for case studies** — Case study drafts saved by the user were not counted in the In Progress status on the progress dashboard. A saved, non-empty (after trimming whitespace) draft now marks the case study as In Progress. Completed cases remain Done and are not double-counted.
- **localStorage corruption wipes unrelated state** — A single `JSON.parse` failure inside the previous monolithic `loadState()` try/catch would silently drop all subsequent keys, resetting streak, lessons, completed topics, and case drafts. Each key is now read and validated independently via a `safeLoadJSON` helper. Corrupted values fall back to their defaults; valid values are preserved. Raw corrupted values are never deleted.

---

## [1.3.5] — 2026-11-05

### Changed
- **Case study disclaimer styling** — Removed faded opacity from the disclaimer line below case study banners. Color stepped up from muted tertiary to secondary foreground for sharper contrast.

---

## [1.4.6] — 2026-11-05

### Fixed
- **Stale Daily Rep streak display** — The streak badge on the Daily Rep screen was read directly from storage with no date check on page load. If a user missed a day without opening the app, the badge would show an inflated streak. On load, the display now compares the last-active date against today; if more than one calendar day has passed, it resets the displayed streak to 0.
- **Quiz completion mismatch** — Completing a quiz at 60%+ now automatically marks the lesson as done and completes the topic, regardless of whether the lesson was explicitly opened first. Existing users are migrated on next load: any topic with a stored quiz score of 60%+ is retroactively completed.
- **Best quiz score not preserved** — Retaking a quiz previously overwrote the stored score, so a lower retry wiped a better earlier result. Scores now track `bestPct`, `bestCorrect`, and `attempts`. Topic cards and the progress dashboard show the best result. Existing scores are migrated on next load. Failing a retake never revokes a previously earned completion.
- **Mixpanel `completion_status` always reporting `completed_retry`** — The retry flag was evaluated after the score had already been saved, so every attempt was tracked as a retry. The flag is now captured before writing, so first attempts report `completed` and subsequent attempts report `completed_retry`.

---

## [1.4.5] — 2026-11-05

### Fixed
- **Model answer numerical targets** — FotMob, Cricbuzz, and Revolut model answers contained bare numerical targets with no stated reasoning. Each is now framed as an illustrative hypothesis with a note on how the real target should be calibrated.
- **Ken Norton resource descriptions** — Removed unsupported superlative "most-cited PM piece ever written" from two locations. "How to Hire a Product Manager" now reads "A classic essay on what makes a strong PM." Resource Library attribution for "Leading Cross-Functional Teams" now names the other essay by title instead.

---

## [1.4.4] — 2026-11-05

### Changed
- **Case study disclaimer** — Moved out of scenario text and into a rendered UI element. Appears below a hairline rule on every case study with an info icon and muted small text. Wording standardised to: "Practice scenario: Figures and assumptions are illustrative and simplified. They do not represent actual company data."

---

## [1.4.3] — 2026-11-05

### Fixed
- **DAU/MAU benchmark** — Removed unsourced specific benchmark figures from Metrics lesson quiz explanation. Replaced with framing that stickiness benchmarks depend on how often the user's need comes up.
- **A/B testing sample-size rule** — Removed hard user-count threshold presented as a universal rule. Replaced with: sample needed depends on baseline conversion and effect size; inline link to Evan Miller sample size calculator added.
- **Case study disclaimer** — Added "Scenario figures are illustrative and simplified for practice. They are not company data." to the top of all 10 advanced case study contexts.
- **LinkedIn, FotMob, Zalando cases** — "Internal data shows..." rephrased to "Assume your data shows..." to make scenario premises explicit rather than implied company data.
- **Swiggy model answer** — Removed unsourced causal claim about ETA ranges. Replaced with explicit hypothesis framing.
- **Chess.com category** — Changed from Sports to Gaming.
- **Chess.com context** — Removed unsourced DAU claim.
- **Chess.com model answer** — Removed unsourced audience demographic claim.

### Added
- **Tools & Calculators** category in Resource Library — Evan Miller A/B Test Sample Size Calculator.
- **Company facts content standard** in CONTRIBUTING.md — every company fact must be sourced, labelled as illustrative, or written as an explicit assumption.

---

## [1.4.2] — 2026-11-05

### Fixed
- **Duolingo NSM contradiction** — Metrics lesson and North Star lesson used conflicting descriptions of Duolingo's metric. Both now use a consistent, softened framing: "opening the app is not learning; lessons completed per learner per week is closer to the value the user gets than raw DAU." Quiz question reframed as a scenario to remove unverified factual claim.
- **Incorrect resource attribution** — North Star resources listed "Sean Ellis: The Metric that Matters" with a Brian Balfour URL. Title corrected to "Brian Balfour: North Star Metric." URL and description unchanged.
- **AARRR misdescribed as input tree** — Heading renamed from "The Input Metric Tree (AARRR)" and opening sentence corrected to: "AARRR maps the user lifecycle as a funnel. Use it to find which stage is leaking, then pick input metrics for that stage."
- **Unsupported Instagram Stories engagement claim** — Removed "Stories now drives more engagement than the main feed" (no source). Replaced with: "Instagram added Stories inside the existing app instead of launching a separate one, and it became one of the most used parts of the product. That choice is product judgment."

---

## [1.4.1] — 2026-11-05

### Changed
- **Mixpanel event schema** — Migrated all tracking events to the schema recommended by Mixpanel onboarding agent. Old event names (`module_started`, `quiz_question_answered`, `quiz_completed`, etc.) replaced with standardised names (`practice_started`, `quiz_answer_submitted`, `practice_completed`). Added `session_started` and `return_session_started` for retention cohort tracking.

### Fixed
- **Mixpanel EU endpoint** — New EU-region project requires `api-eu.mixpanel.com`; default US endpoint was set, causing events to not appear in the dashboard.

---

## [1.4.0] — 2026-11-04

### Added
- **Mixpanel analytics** — Replaced Google Analytics with Mixpanel (EU project). Events: `session_started`, `practice_started`, `quiz_answer_submitted`, `practice_completed`, `daily_rep_answered`, `return_session_started`.
- **Kill rule experiment documented in README** — 4-week AI grader bet, decision date 1 December 2026, thresholds published before data arrives.

### Fixed
- **`daily_rep_answered` event missing** — Daily Rep question answers were not tracked in Mixpanel. Added event with `is_correct` and `streak_length` properties.
- **`quiz_completed` double-fire** — Score save, Mixpanel event, and completion toast were inside `buildQuizResults()` (HTML builder), causing re-fires on re-renders. Extracted into `finalizeQuiz()` called exactly once from `nextQuestion()`.

---

## [1.3.6] — 2026-11-03

### Fixed
- **Daily Rep saved-answer display** — After a quiz answer reorder (v1.2.2), returning users saw the wrong option highlighted. Added `selectedAnswerText` to stored attempts; answer now matched by text, not index position. Legacy records fall back gracefully (wrong-answer highlight omitted rather than guessed).
- **Quiz validation threshold** — Automated test checked 100% (5/5) correct instead of PM Gym's actual passing bar of 60% (3/5). Corrected sweep test in `tests/quiz-validation.js`.

---

## [1.2.2] — 2026-10-30

### Changed
- **Quiz answer distribution rebalanced** — Correct answers were 29/35 at position B. Redistributed to A=9, B=9, C=8, D=9 across all 35 questions. No single letter reaches 60% in any quiz, so a constant-letter strategy cannot pass. Correct answer content unchanged; only position rotated.

### Added
- `tests/quiz-validation.js` — Node.js script checking structure, distribution, and sweep-test resistance across all quiz questions. Run with `node tests/quiz-validation.js`.

---

## [1.0.0] — 2026-10-15

### Added
- **Beginner level** (3 topics)
  - What Does a PM Do? — lesson, 5-question quiz, 3 resources
  - Introduction to Product Metrics — lesson, 5-question quiz, 3 resources
  - Key PM Frameworks — lesson, 5-question quiz, 3 resources
- **Intermediate level** (3 topics)
  - North Star Metrics — lesson, 5-question quiz, 3 resources
  - A/B Testing & Experimentation — lesson, 5-question quiz, 3 resources
  - Prioritization Frameworks (RICE, HEART, MoSCoW) — lesson, 5-question quiz, 3 resources
- **Advanced level** (10 case studies + 1 topic)
  - Case Study: Spotify Engagement Drop
  - Case Study: Design for LinkedIn Job Seekers
  - Case Study: Chess.com Puzzle Drop
  - Case Study: FotMob Between-Game Retention
  - Case Study: Cricbuzz Feature Prioritisation
  - Case Study: Flipkart Success Metrics
  - Case Study: Swiggy Order Cancellations Spike
  - Case Study: Notion Onboarding Drop-off
  - Case Study: Revolut Feature Prioritisation
  - Case Study: Zalando Responds to a New Competitor
  - Product Strategy Fundamentals — lesson, 5-question quiz, 3 resources
- **Daily Rep** — one practice question per day, streak tracking
- **Progress tracking** — streak counter, completed topics, quiz scores via localStorage
- **Resource Library** — curated links across Newsletters, YouTube, Books, Free Courses
- **Dark / light mode** toggle
- **Mobile-responsive** design with bottom navigation on phone

---

<!-- 
HOW TO ADD A NEW ENTRY:

## [1.X.Y] — YYYY-MM-DD

### Added
- Topic name (Level) — brief description of what's inside

### Changed
- What was updated and why

### Fixed
- What was corrected (wrong answer, broken link, typo)
-->
