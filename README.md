# 💪 PM Gym

**Free practice platform for aspiring Product Managers.**

Built for career switchers — analysts, engineers, designers, and consultants who want to break into PM without paying for a bootcamp.

🔗 **[Try it live →](https://sanketjoshi2012.github.io/pm-gym)**

---

## What's Inside

| Level | Topics | What You'll Learn |
|---|---|---|
| 🌱 Beginner | 3 modules | What a PM does, product metrics, key frameworks |
| 📈 Intermediate | 3 modules | North Star metrics, A/B testing, prioritization (RICE, HEART, MoSCoW) |
| 🚀 Advanced | 3 modules | Product strategy, full case studies with model answers |

**Every topic includes:**
- 📖 A 3-min lesson with real company examples (Spotify, Airbnb, Slack, Duolingo)
- 🧠 5 quiz questions with explanations for every answer
- 🔗 3 curated free resources (no paywalls)

**Advanced level adds:**
- 📋 Real PM case studies — write your answer, then reveal a structured model answer and rubric
- Self-evaluation against dimensions like Problem Framing, Data Investigation, and Solution Quality

**App features:**
- 🔥 Streak counter — tracks consecutive days practiced
- 📊 Progress dashboard — completed topics and quiz scores
- 🌙 Dark / light mode
- 📱 Mobile-first, works on any device
- 💾 Progress saved locally — no account needed

---

## Run Locally

No build step. No package installs. Just a browser.

```bash
git clone https://github.com/sanketjoshi2012/pm-gym.git
cd pm-gym
```

Then pick whichever option fits:

**Option 1: Node (recommended if you have Node installed)**
```bash
npx serve .
# Open http://localhost:3000
```

**Option 2: Python (if you have Python 3 installed)**
```bash
python3 -m http.server 4321
# Open http://localhost:4321
```

**Option 3: No server needed**
Just open `index.html` directly in your browser. Most things work fine without a server.

---

## Tech Stack

Intentionally minimal:

- Vanilla HTML, CSS, JavaScript — no frameworks
- `localStorage` for progress, streaks, and quiz scores
- Google Fonts (DM Sans + Space Grotesk)
- Zero build tooling, zero backend, zero API calls

---

## Contributing

PM Gym is community-driven. The most valuable contribution is **new content** — lessons, quiz questions, case studies, and resources.

You don't need to know how to code. If you can edit a text file and write clearly, you can add a topic.

**→ Read [CONTRIBUTING.md](CONTRIBUTING.md) for templates and content standards.**

Ideas for new topics:
- Intermediate: Stakeholder Management, Go-to-Market for PMs, User Research Methods
- Advanced: Meta Feed ranking drop, Notion onboarding redesign, DoorDash pricing strategy

---

## Current experiment 

**Bet: does AI scoring on case answers make people practise again?**

We will be adding an LLM grader that scores written case answers against the existing rubric, quotes the learner's own words as evidence, and says what a strong answer would add.

The question this answers: do people submit a second answer on the same case within 14 days?

**Decision Rule**

By end of week 4, among at least 25 people who submit one scored answer:

- **Continue** if 30% or more submit a second answer within 14 days, and the AI score agrees with my own grading on at least 16 of 20 test answers.
- **Freeze** if the repeat-submission rate is under 15%. Write up the case study, put it on the CV, move all evenings to job applications.
- **One more iteration** if between 15% and 30%: fix the single biggest drop-off visible in Mixpanel, then decide again. No third extension.

---

## Versioning

See [CHANGELOG.md](CHANGELOG.md) for a full history of what's been added.

Current version: **v1.3.6**

---

## License

[MIT](LICENSE) — free to use, share, and build on.

---

*Built by [Sanket Joshi](https://www.linkedin.com/in/sanket-joshi-897961102/). Contributions welcome.*
