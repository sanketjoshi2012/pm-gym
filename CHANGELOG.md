# Changelog

All notable changes to PM Gym are documented here.

Format: [Semantic Versioning](https://semver.org) — `MAJOR.MINOR.PATCH`
- **MAJOR** — breaking changes to structure or existing content
- **MINOR** — new topics, case studies, or levels added
- **PATCH** — fixes to existing content (typos, wrong answers, broken links)

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
