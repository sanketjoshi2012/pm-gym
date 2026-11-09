# Changelog

All notable changes to PM Gym are documented here.

Format: [Semantic Versioning](https://semver.org) — `MAJOR.MINOR.PATCH`
- **MAJOR** — breaking changes to structure or existing content
- **MINOR** — new topics, case studies, or levels added
- **PATCH** — fixes to existing content (typos, wrong answers, broken links)

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
