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

**Resources**
- Free only (no paywalls, no affiliate links).
- Link directly to the content — not a homepage.
- Prioritize: Lenny's Newsletter, Reforge Blog, Amplitude, Exponent, HBR, company engineering blogs.

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

## Questions?

Open a GitHub Issue or start a Discussion. We read everything.
