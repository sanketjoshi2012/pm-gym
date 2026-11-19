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
cp .dev.vars.example .dev.vars   # see "Environment variables" below for required values (never commit .dev.vars)
npm test          # run the 102-test suite with node --test
npm run dev       # start a local HTTP server on :8787 (KV and Durable Object are simulated locally)
```

**Project structure:**

| File | Purpose |
|---|---|
| `src/index.js` | POST `/grade` handler: routing, rate-limit check, response |
| `src/body.js` | Reads the request body with a 50 KB cap enforced on bytes actually received |
| `src/validate.js` | Input validation: `case_id`, word count (120–1500), char cap (15k) |
| `src/context.js` | Builds grading context from `grader-rubric.js` — no model answer |
| `src/mock-llm.js` | Mock adapter returning `_mock: true` feedback. Used for local development and tests |
| `src/anthropic-llm.js` | Real adapter for `claude-haiku-5-5`. Timeout, bounded retry, truncation detection, cost-preserving error handling |
| `src/schema.js` | Validates LLM output, checks `evidence_quote`, computes server-side totals |
| `src/rate-limit.js` | Per-client limits in KV (10 per hour, 50 per day), then the global cap. Fails closed |
| `src/global-budget.js` | Durable Object enforcing the atomic global daily request cap |
| `tests/grade.test.js` | 32 tests for validation, context, mock LLM, and schema |
| `tests/rate-limit.test.js` | 44 tests for per-client limits, global cap, concurrency, failure conditions, the body size cap, and adapter selection |
| `tests/anthropic-llm.test.js` | 26 tests for the real adapter: prompt, parsing, retries, timeout, truncation, failure accounting, log hygiene |
| `scripts/real-grade.mjs` | Local smoke-test runner (10 synthetic calls, $0.05 recorded-cost stop). Not part of `npm test` |
| `scripts/retry-swiggy.mjs` | Focused rerun of the Swiggy case (up to 3 attempts, $0.05 recorded-cost stop) |
| `scripts/calibration-answers.mjs` | Synthetic smoke-test answers. NOT a human calibration benchmark |

**Rules for Worker changes:**
- `case_id` values in `validate.js` must match the `caseId` fields in `grader-rubric.js` exactly.
- `buildGradingContext` must never include the model answer (it stays in `data.js` only).
- `total_score` and `max_total_score` are always computed in `schema.js` — never trusted from LLM output.
- `evidence_quote` must be verified server-side as an exact substring of the learner's answer.
- Do not deploy (`npm run deploy`) or connect a paid LLM without a separate approval step.
- Do not log learner answer text or feedback content.
- Rate limiting must fail closed. A missing binding, missing secret, or storage error returns 503 and must never fall through to grading.
- Identify clients only from `CF-Connecting-IP`. Never read `X-Forwarded-For` or other client-supplied headers.
- Rate-limit storage may hold only HMAC digests and counters. No raw IP addresses, no answers.
- Nothing billable may run before `checkRateLimit` succeeds. Any future LLM retry must reserve its own slot from the global cap.
- **Adapter selection fails closed.** `pickAdapter(env)` returns `null` unless `env.LLM_PROVIDER` is exactly `"anthropic"` or `"mock"`. The handler then returns 503 and never falls through to grading. `wrangler.toml [vars]` deliberately does not set `LLM_PROVIDER`, so a bare `wrangler deploy` cannot ship mock to production. Set it in `[env.production.vars]` or at deploy time.
- **The real adapter requires `env.ANTHROPIC_API_KEY`.** Store it as a Cloudflare Worker secret (`wrangler secret put ANTHROPIC_API_KEY --env production`) in production and in `.dev.vars` locally. Never put it in `wrangler.toml`, `.dev.vars.example`, source files, test fixtures, or chat.
- **Smoke-test scripts cost real money.** `scripts/real-grade.mjs` and `scripts/retry-swiggy.mjs` call the Anthropic API when `.dev.vars` carries a real key. They are not part of `npm test`. Both stop when cumulative recorded cost reaches $0.05, but that is not a guaranteed billing cap — set an independent spending limit in the Anthropic console too. Their JSON reports are gitignored.

**Environment variables**

| Variable | Where | Required when | What it does |
|---|---|---|---|
| `IP_HASH_SALT` | `.dev.vars` or Worker secret | Always | HMAC salt for rate-limit storage. Must be 16+ characters of randomness. Never an API key. |
| `LLM_PROVIDER` | `.dev.vars` locally, `[env.*.vars]` or deploy flag in production | Always | `"anthropic"` for real grading, `"mock"` for local development. Any other value returns 503. |
| `ANTHROPIC_API_KEY` | `.dev.vars` or Worker secret | Only when `LLM_PROVIDER=anthropic` | Credential for the Messages API. Never committed, never logged, never echoed back in chat. Rotate immediately if exposed. |
| `GLOBAL_DAILY_CAP` | `wrangler.toml [vars]` | Optional | Max grading requests per UTC day across all clients. Defaults to 20. See the request-cap-versus-spending-cap note below. |

**Request cap versus spending cap:**

`GLOBAL_DAILY_CAP` limits how many grading requests run per UTC day. It does not measure money. The real spending bound is:

```
worst-case daily spend = GLOBAL_DAILY_CAP x maximum cost of one grading request
```

The maximum cost of one request depends on the model's input and output token prices, the largest possible prompt (rubric plus a 1500-word answer), the output token limit, the number of retries, and the USD to EUR exchange rate. Before production: measure real per-request cost, set a hard output token limit on the LLM call, choose the cap from the formula above, and also set a spending limit in the model provider's console as an independent backstop.

Other limits to know: the per-client KV limits are approximate and exist to deter abuse, not to protect the budget. Each graded request makes 2 KV writes, and the Cloudflare free tier allows 1,000 KV writes per day, so the free tier supports about 500 graded requests per day.

**Current measured cost (synthetic calibration, not production):** mean ~$0.0011 per grading request on `claude-haiku-5-5` at verified pricing of $0.10 / $0.50 per million input / output tokens (prompts under 100k). At the default `GLOBAL_DAILY_CAP` of 20, worst-case spend is in the low cents per day. Re-measure with real learner traffic before raising the cap.

**Implemented, deployed, not yet integrated.** As of v2.0.0: the Worker is live at `https://pm-gym-grader-production.joshisanket80.workers.dev/grade` and will grade a well-formed `POST /grade` request on `claude-haiku-5-5`. However, `index.html` and `app.js` have **no "Get AI feedback" control**, and there is no code anywhere in the site that calls the production endpoint. End users cannot reach the grader without hand-crafting a request. The frontend integration is a separate step.

### Production deployment (operator reference)

**Account:** Cloudflare, `joshisanket80@gmail.com`, subdomain `joshisanket80.workers.dev`.
**Worker script:** `pm-gym-grader-production`.
**Endpoint:** `https://pm-gym-grader-production.joshisanket80.workers.dev/grade`.
**Bindings in production** (all declared under `[env.production]` in `worker/wrangler.toml`):

| Binding | Type | Value / class |
|---|---|---|
| `RATE_LIMIT_KV` | KV namespace | `ce2ff6ba6f984319901f764031d86d3b` |
| `GLOBAL_BUDGET` | Durable Object | class `GlobalBudget`, migration `v1` with `new_sqlite_classes` |
| `ENVIRONMENT` | var | `"production"` |
| `LLM_PROVIDER` | var | `"anthropic"` |
| `GLOBAL_DAILY_CAP` | var | `"20"` |
| `ANTHROPIC_API_KEY` | secret | set via `wrangler secret put`, not in git |
| `IP_HASH_SALT` | secret | set via `wrangler secret put`, not in git |

**Deploy a new version** (after a code change):

```bash
cd worker
npm test                              # must pass
npx wrangler deploy --env production  # ships the current working tree
```

**Rotate the Anthropic API key:**

1. Create a fresh key in [console.anthropic.com → API keys](https://console.anthropic.com/settings/keys). Copy it.
2. In a terminal (not Claude chat), run:
   ```bash
   cd worker
   npx wrangler secret put ANTHROPIC_API_KEY --env production
   ```
   Paste the new value at the prompt. Wait for `✨ Success!`. Each `secret put` auto-redeploys in a few seconds.
3. Revoke the old key in the Anthropic console.

**Rotate the IP hash salt** (invalidates all in-flight per-client counters; acceptable because they are approximate):

```bash
cd worker
openssl rand -hex 32                      # copy the output
npx wrangler secret put IP_HASH_SALT --env production
```

**Tail live logs:**

```bash
cd worker
npx wrangler tail --env production --format=json
```

Successful grading calls emit one structured JSON line per request with `provider`, `model`, `case_id`, `input_tokens`, `output_tokens`, `stop_reason`, `latency_ms`, `attempt` and `status`. No answer text, no feedback text, no secret ever appears in these logs.

**Rate-limit guarantees in production:**

- Per-client: 10 grading requests per rolling hour and 50 per rolling day, keyed by an HMAC of `CF-Connecting-IP`. KV is eventually consistent, so these can be slightly exceeded under bursts.
- Global: atomic daily cap of 20 requests per UTC day via the `GLOBAL_BUDGET` Durable Object. Concurrent requests cannot exceed it.
- A missing or invalid binding, missing secret, or storage error returns HTTP 503 and never reaches the LLM.
- The 20/day cap is a request count, not a euro amount. Measured cost at Haiku 5.5 prices is ~$0.0011/call, so the worst-case spend at the cap is ~$0.022/day, ~$0.66/month. Raise the cap only after real-traffic cost data is in.

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
