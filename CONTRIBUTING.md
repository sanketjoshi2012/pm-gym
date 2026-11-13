# Contributing to PM Gym

PM Gym is open source and community-driven. The most valuable contributions are **new content** — lessons, quiz questions, case studies, and resources that help people break into Product Management.

You don't need to know how to code to contribute. If you can edit a JSON-style object and write clearly, you can add a topic.

---

## What We Need Most

- **New topics** for any level — especially Intermediate and Advanced
- **New case studies** — real PM scenarios with structured model answers
- **Better quiz questions** — harder distractors, clearer explanations
- **Resource links** — free, high-quality PM content only (no paywalls)
- **Bug reports** — wrong answers, broken links, typos

---

## How Content Is Structured

All content lives in one file: `js/data.js`. The app reads from it dynamically — no build step, no framework. Every topic, quiz question, and resource is a JavaScript object.

### Adding a New Topic (Lesson + Quiz + Resources)

Find the right level in `PM_GYM_DATA.levels` and add a new object to its `topics` array:

```js
{
  id: "unique-topic-id",        // kebab-case, must be unique across ALL topics
  title: "Your Topic Title",
  duration: "3 min read",
  lesson: {
    title: "Full Lesson Heading",
    content: `
      <p>Your lesson content. Use real examples from companies like Airbnb, Slack, Duolingo.</p>

      <h3>Section Heading</h3>
      <p>More content...</p>
      <ul>
        <li>Bullet point</li>
      </ul>
      <blockquote>Use blockquote for key frameworks, formulas, or memorable quotes</blockquote>
    `
  },
  quiz: [
    {
      question: "Clear, specific question — avoid 'which is best' without context",
      options: [
        "Plausible wrong answer",
        "The correct answer",
        "Another plausible wrong answer",
        "A common misconception"
      ],
      correct: 1,               // 0-indexed position of correct answer
      explanation: "Why the correct answer is right, and why the others are wrong."
    }
    // 4–5 questions per topic
  ],
  resources: [
    {
      title: "Resource Title",
      url: "https://...",
      description: "One sentence: what it is and why it's worth reading."
    }
    // 3 resources per topic
  ]
}
```

### Adding a New Case Study

Case studies go in the **Advanced** level. They replace the lesson/quiz with an open-ended PM scenario:

```js
{
  id: "case-study-unique-id",
  title: "Case Study: Short Descriptive Title",
  duration: "15–20 min",
  isCaseStudy: true,
  scenario: {
    title: "One-sentence headline of the scenario",
    context: "2–3 sentences: company, the problem/metric, the stakes. Be specific with numbers.",
    prompt: `1. First question for the candidate
2. Second question
3. Third question
4. Fourth question`,
    rubric: [
      {
        dimension: "Problem Decomposition",
        strong: "What a strong answer looks like for this dimension.",
        weak: "What a weak answer looks like."
      }
      // 4–5 rubric dimensions
    ],
    modelAnswer: `
      <h3>1. Section Heading</h3>
      <p>Model answer content with structured thinking...</p>
      <ul>
        <li>Bullet points are fine for lists</li>
      </ul>
    `
  }
}
```

### AI Grader Rubric Specification

The AI Grader scoring anchors live in `js/grader-rubric.js` — a file separate from `data.js`. It contains case-specific score-1, score-2, and score-3 descriptions for the four pilot cases (FotMob, Cricbuzz, Spotify, Swiggy) and the universal scoring rules.

**Rules for this file:**
- **Model answers must never be added here.** They stay in `data.js` only and must not appear in live grading prompts.
- Each dimension needs all three score anchors (`score_3`, `score_2`, `score_1`). Partial entries will be rejected in validation.
- `caseId` values must exactly match the `id` field of the corresponding case study in `data.js`.
- Score descriptions are guidelines, not checklists. Phrase them to describe demonstrated competence, not coverage of a list.

```js
// Example dimension entry
{
  name: "Problem Decomposition",
  score_3: "What strong competence looks like for this dimension.",
  score_2: "What partial competence looks like — neither fully strong nor fully weak.",
  score_1: "What a weak or absent response looks like for this dimension."
}
```

### Cloudflare Worker (AI Grader Backend)

The grading backend lives in `worker/`. It is a Cloudflare Worker project — a single-process JS service that runs locally via Wrangler and deploys to Cloudflare's edge when the time comes.

**Running locally (no Cloudflare account needed):**

```bash
cd worker
npm install
npm test          # run the 32-test suite with node --test
npm run dev       # start a local HTTP server on :8787
```

**Project structure:**

| File | Purpose |
|---|---|
| `src/index.js` | POST `/grade` handler — routing, body size cap, rate-limit hook |
| `src/validate.js` | Input validation: `case_id`, word count (120–1500), char cap (15k) |
| `src/context.js` | Builds grading context from `grader-rubric.js` — no model answer |
| `src/mock-llm.js` | Mock adapter returning `_mock: true` feedback — replace in a future step |
| `src/schema.js` | Validates LLM output, checks `evidence_quote`, computes server-side totals |
| `src/rate-limit.js` | No-op stub — replaced with KV + Durable Object guard in a future step |
| `tests/grade.test.js` | 32 tests, Node.js built-in runner |

**Rules for Worker changes:**
- `case_id` values in `validate.js` must match the `caseId` fields in `grader-rubric.js` exactly.
- `buildGradingContext` must never include the model answer (it stays in `data.js` only).
- `total_score` and `max_total_score` are always computed in `schema.js` — never trusted from LLM output.
- `evidence_quote` must be verified server-side as an exact substring of the learner's answer.
- Do not deploy (`npm run deploy`) or connect a paid LLM without a separate approval step.
- Do not log learner answer text or feedback content.

---

### Adding a Resource to the Library

Find the right category in `PM_GYM_DATA.resources` and add to its `items` array:

```js
{ title: "Title", url: "https://...", description: "One sentence." }
```

To add a new category entirely:

```js
{
  category: "Podcasts",
  items: [
    { title: "...", url: "...", description: "..." }
  ]
}
```

---

## Content Standards

**Lessons**
- 2–4 min read. Tight, specific, example-driven.
- Every abstract concept needs a real company example (Spotify, Airbnb, Slack, Notion, etc.)
- No "lorem ipsum" or vague filler. Write the way a good PM would explain something to a new hire.

**Quiz Questions**
- Wrong answers should be *plausible* — common misconceptions, not obviously silly options.
- Explanations should address why the wrong answers are wrong, not just why the right one is right.
- Avoid trick questions. Test understanding, not reading comprehension.

**Case Studies**
- Base them on realistic but clearly fictional scenarios (don't imply real internal data).
- The rubric should have 4–5 dimensions with specific, actionable descriptions.
- The model answer should model *structured thinking*, not just the right conclusion.
- Numerical targets in model answers must include a brief explanation of how they were chosen — a baseline, a share of the relevant segment, or an explicitly stated hypothesis. A bare number with no reasoning teaches learners to copy figures instead of derive them.

**Resources**
- Free only (no paywalls, no affiliate links).
- Link directly to the content — not a homepage.
- Prioritize: Lenny's Newsletter, Reforge Blog, Amplitude, Exponent, HBR, company engineering blogs.

**Company facts**
Every company fact on the site is one of three things, and the learner can tell which:
- **Sourced:** a verifiable public number, cited with a link (e.g. "Revolut reported 45M customers in its 2023 annual report [link]")
- **Illustrative:** a scenario figure, labelled with *"Scenario figures are illustrative and simplified for practice. They are not company data."*
- **Assumption:** an explicit scenario premise, written as "Assume your data shows..." or "In this scenario..."

Never present an unsourced number as a real company figure. If you can't source it, label it or frame it as an assumption.

---

## How to Submit

1. [Fork the repository](https://github.com/sanketjoshi2012/pm-gym/fork)
2. Create a branch: `git checkout -b add/topic-name`
3. Edit `js/data.js` with your content
4. Test locally: open `index.html` in a browser (or `python3 -m http.server` from the repo root)
5. Open a Pull Request — use the template provided

**In your PR description, include:**
- What topic/case study you added and which level it belongs to
- Your background (optional — but we love knowing if a working PM contributed!)
- Any sources you drew from

---

## Release Checklist

Before committing and pushing any meaningful change:

- [ ] **CHANGELOG.md updated** — add an entry under the correct version with Added / Changed / Fixed sections. Use today's date.
- [ ] **Version bump** — increment the cache-buster in `index.html` for whichever file changed: `data.js?v=X` for data-only changes, `app.js?v=X` for logic changes, `styles.css?v=X` for style changes. Bump all that apply.
- [ ] **Analytics consent respected** — new `mp()` calls must be inside user-action handlers only (not page load or view render). Never call `loadAnalytics()` or reference `window.mixpanel` directly. Never load the Mixpanel SDK unconditionally.
- [ ] **README.md checked** — if feature descriptions, content counts, setup instructions, or product positioning changed, update README to match.
- [ ] **No stale claims** — search for any documentation that describes removed or renamed features and correct or delete it.
- [ ] **Tests pass** — run `node tests/quiz-validation.js` after any change to `js/data.js`. Run `node tests/logic-tests.js` after any change to `js/app.js`. All checks must pass before pushing.
- [ ] **Diff reviewed** — read the full diff before committing. No unrelated files, no generated output, no secrets.
- [ ] **Deployment verified** — after pushing, confirm the GitHub Actions run succeeds at `github.com/sanketjoshi2012/pm-gym/actions`.

---

## Questions?

Open a GitHub Issue or start a Discussion. We read everything.
