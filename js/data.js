const PM_GYM_DATA = {
  levels: [
    {
      id: "beginner",
      title: "Beginner",
      subtitle: "I don't know what a PM does",
      description: "Covers: what is PM, key definitions, intro to metrics, basic frameworks",
      icon: "🌱",
      topics: [
        {
          id: "what-is-pm",
          title: "What Does a PM Do?",
          duration: "3 min read",
          lesson: {
            title: "What Does a Product Manager Do?",
            content: `
              <p>A Product Manager (PM) sits at the intersection of business, technology, and user experience. Their job is to figure out <strong>what to build, why to build it, and whether it worked</strong> — without directly managing the engineers, designers, or data scientists who do the building.</p>

              <h3>The Core Job</h3>
              <p>Think of a PM as the CEO of their product area. They own the "what" and "why," while engineering owns the "how." A PM working on Spotify's search feature, for example, is responsible for:</p>
              <ul>
                <li>Understanding why users struggle to find music</li>
                <li>Prioritizing improvements that matter most</li>
                <li>Writing clear specs so engineers know what to build</li>
                <li>Measuring whether the changes worked</li>
              </ul>

              <h3>What a PM's Week Actually Looks Like</h3>
              <p><strong>Monday:</strong> Review last week's metrics — did the new feature move the needle? Write up findings for the team.</p>
              <p><strong>Tuesday:</strong> User research session — interview 3 users to understand why they're abandoning the onboarding flow.</p>
              <p><strong>Wednesday:</strong> Sprint planning — work with engineers to scope what's feasible for the next two weeks.</p>
              <p><strong>Thursday:</strong> Write a PRD (Product Requirements Document) for the next feature.</p>
              <p><strong>Friday:</strong> Stakeholder sync — align with Marketing on the launch plan, align with Legal on compliance.</p>

              <h3>PM vs Other Roles</h3>
              <p><strong>PM vs Project Manager:</strong> A Project Manager ensures things get done on time. A PM decides <em>what</em> things should get done at all. PMs set direction; PjMs keep the train on schedule.</p>
              <p><strong>PM vs Designer:</strong> A Designer owns the look, feel, and usability of a product. A PM works with designers but owns the business goals and user outcomes — the "why," not just the "how it looks."</p>
              <p><strong>PM vs Engineer:</strong> Engineers build the product. PMs define what needs to be built and why. Great PMs earn engineers' trust by writing precise specs and shielding them from scope creep.</p>

              <h3>The "Without Authority" Problem</h3>
              <p>PMs influence without authority — they lead teams they don't manage. This means PMs win through <strong>clarity, credibility, and communication</strong>. When a PM says "we should build X," the engineers, designers, and stakeholders need a reason to believe them. That reason is usually: clear data, a deep understanding of users, and a logical argument.</p>

              <h3>Real Example: Instagram Stories</h3>
              <p>When Instagram's PM team saw Snapchat's Stories feature gaining traction, they had to make a hard call: copy the format or innovate. They chose to build Stories directly into Instagram. The PM's job was to define the exact feature scope (what makes a Story?), align Design and Engineering, and measure success post-launch. Stories now drives more engagement than the main feed — that's PM impact.</p>
            `
          },
          quiz: [
            {
              question: "A PM is often described as the 'CEO of the product.' What does this mean in practice?",
              options: [
                "They have authority to hire and fire engineers on their team",
                "They own the product vision and outcomes, but lead through influence rather than authority",
                "They report directly to the CEO and make all final product decisions",
                "They manage the budget for the product team"
              ],
              correct: 1,
              explanation: "PMs 'own' the product in the sense of accountability for outcomes, but they have no direct authority over engineers or designers. They must lead through credibility, data, and clear communication — hence the 'influence without authority' challenge."
            },
            {
              question: "Which of the following best describes the difference between a Product Manager and a Project Manager?",
              options: [
                "Product Managers focus on technical implementation; Project Managers focus on user needs",
                "Product Managers decide what to build and why; Project Managers ensure it gets delivered on time",
                "Product Managers work at startups; Project Managers work at enterprises",
                "There is no real difference — the titles are used interchangeably"
              ],
              correct: 1,
              explanation: "A PM sets product direction (what and why). A Project Manager (PjM) manages timelines, resources, and delivery (when and how it gets done). In many companies both roles exist; in startups, one person often does both."
            },
            {
              question: "A PM at a food delivery app notices that 40% of users abandon the app after placing their first order. What should be their FIRST step?",
              options: [
                "Immediately redesign the post-order experience to add more features",
                "Ask engineers to optimize the app's loading speed",
                "Investigate why users are dropping off — through data analysis and user research",
                "Launch a push notification campaign to bring users back"
              ],
              correct: 2,
              explanation: "Good PMs diagnose before prescribing. Before jumping to solutions, a PM must understand the root cause: Is it a bad experience? Unmet expectations? A competitor? Data and qualitative research answer these questions first."
            },
            {
              question: "A designer on your team disagrees with your decision to simplify a feature. How should a PM handle this?",
              options: [
                "Override the designer since PMs have final say on product decisions",
                "Defer entirely to the designer since they're the UX expert",
                "Share the user data and business reasoning behind the decision, and listen to their concerns",
                "Escalate to the VP of Product to resolve the disagreement"
              ],
              correct: 2,
              explanation: "PMs lead through transparency and reasoning, not authority. Sharing your logic — user data, business goals — invites genuine debate and often surfaces better ideas. Overriding or ignoring silences talented teammates and erodes trust."
            },
            {
              question: "Instagram's PM decided to add Stories to the main Instagram app rather than building a separate app. What PM skill does this best illustrate?",
              options: [
                "Technical architecture planning",
                "Strategic product judgment — deciding what to build and where to build it",
                "Project management — coordinating a cross-functional team",
                "User interface design"
              ],
              correct: 1,
              explanation: "The decision to add Stories to Instagram (not a new app) was a strategic product call: leverage existing distribution, user habit, and trust rather than starting from zero. That's PM judgment — picking the right problem, right scope, right approach."
            }
          ],
          resources: [
            {
              title: "Exponent — PM Interview Prep (YouTube Channel)",
              url: "https://www.youtube.com/@tryexponent",
              description: "The best free PM content on YouTube — role breakdowns, mock interviews, and framework walkthroughs. Browse the channel for intro videos."
            },
            {
              title: "Lenny Rachitsky: The Jobs of a Product Manager",
              url: "https://www.lennysnewsletter.com/p/jobs-of-product-manager",
              description: "A clear breakdown of the three core jobs every PM owns — directly from one of the most-read PM writers."
            },
            {
              title: "Ken Norton: How to Hire a Product Manager",
              url: "https://www.bringthedonuts.com/essays/productmanager.html",
              description: "The classic essay on what separates great PMs from good ones — still the most-cited PM piece ever written."
            }
          ]
        },
        {
          id: "intro-metrics",
          title: "Introduction to Product Metrics",
          duration: "3 min read",
          lesson: {
            title: "Why Metrics Are a PM's Best Friend",
            content: `
              <p>Product metrics are how you tell whether you're actually winning. Without them, product decisions are just opinions. A PM who says "users love the new onboarding" without data is guessing. A PM who says "onboarding completion rate improved from 42% to 68% after the change" is leading.</p>

              <h3>The Four Categories of Product Metrics</h3>

              <p><strong>1. Acquisition</strong> — How are users finding you?</p>
              <ul>
                <li>Signups per day, cost per acquisition (CPA), traffic by channel</li>
                <li>Example: "300 new users signed up today, 60% from organic search"</li>
              </ul>

              <p><strong>2. Activation</strong> — Are new users getting value quickly?</p>
              <ul>
                <li>Onboarding completion rate, time-to-first-value</li>
                <li>Example: "Users who complete onboarding within 24 hours are 3x more likely to return"</li>
              </ul>

              <p><strong>3. Retention</strong> — Are users coming back?</p>
              <ul>
                <li>Day-7 retention, Monthly Active Users (MAU), churn rate</li>
                <li>Example: "We have 80% D1 retention but only 20% D30 — something's wrong in weeks 2-4"</li>
              </ul>

              <p><strong>4. Revenue</strong> — Are you making money?</p>
              <ul>
                <li>Monthly Recurring Revenue (MRR), Average Revenue Per User (ARPU), conversion rate</li>
                <li>Example: "Our free-to-paid conversion rate is 3% — industry average is 5%"</li>
              </ul>

              <h3>Vanity Metrics vs. Actionable Metrics</h3>
              <p>A <strong>vanity metric</strong> looks good but doesn't drive decisions. Total app downloads is a vanity metric — it only goes up and doesn't tell you if users are getting value.</p>
              <p>An <strong>actionable metric</strong> connects to behavior and informs decisions. Daily Active Users (DAU) ÷ Monthly Active Users (MAU) = a "stickiness ratio" that tells you if users actually come back regularly.</p>

              <p><strong>Example:</strong></p>
              <ul>
                <li>Vanity: "We hit 1 million downloads!" ← says nothing about value</li>
                <li>Actionable: "Our 30-day retention is 15%, down from 22% — we're losing users in week 2" ← tells you exactly where to look</li>
              </ul>

              <h3>The Counter-Metric</h3>
              <p>Every metric needs a counter-metric — a guardrail to prevent gaming. If you optimize purely for "messages sent," users might spam each other. So you also track "message reply rate" (quality) and "report/block rate" (spam). Counter-metrics keep you honest.</p>

              <h3>Real Example: Duolingo</h3>
              <p>Duolingo's PM team discovered that "daily active users" was misleading — users would open the app, do one lesson, and leave. The more meaningful metric was "learning sessions completed per user per week." That shift changed what features they built: streaks, smarter lesson length, and social accountability — all targeting meaningful engagement, not just opens.</p>
            `
          },
          quiz: [
            {
              question: "A mobile app celebrates reaching '10 million downloads.' Why might a PM push back on using this as a key success metric?",
              options: [
                "Downloads are too hard to track accurately",
                "Downloads only go up — they don't reveal whether users are getting value or returning",
                "Downloads aren't tracked by Apple or Google accurately",
                "This metric is only useful for consumer apps, not B2B apps"
              ],
              correct: 1,
              explanation: "Total downloads is a classic vanity metric. It always increases and never decreases, so it creates a false sense of progress. Actionable metrics like Day-7 retention or activation rate reveal whether users actually found value."
            },
            {
              question: "Which metric best measures whether new users are experiencing value quickly after signing up?",
              options: [
                "Monthly Active Users (MAU)",
                "Time-to-first-value / Activation rate",
                "Total revenue",
                "App store rating"
              ],
              correct: 1,
              explanation: "Activation rate measures whether new users complete a key action that signals they've found value — like posting their first photo, sending their first message, or completing onboarding. It's the bridge between acquisition and retention."
            },
            {
              question: "Your app's MAU is 500,000 and DAU is 50,000. What is the DAU/MAU ratio and what does it tell you?",
              options: [
                "10% — the average user opens the app about 3 days per month",
                "90% — most monthly users are also daily users",
                "50% — exactly half of users are active every day",
                "The ratio cannot be calculated without knowing weekly actives"
              ],
              correct: 0,
              explanation: "DAU/MAU = 50,000 / 500,000 = 10%. This 'stickiness ratio' means the average user opens the app about 3 days per month (10% × 30 days). Facebook targets >60%; most consumer apps aim for >20%. A low ratio suggests users have no reason to return daily."
            },
            {
              question: "A PM is optimizing for 'number of messages sent per user.' What counter-metric should they also watch?",
              options: [
                "Number of users who signed up this month",
                "Message reply rate and spam/block rate",
                "Time spent in the app",
                "App store download count"
              ],
              correct: 1,
              explanation: "If you only optimize for messages sent, users might spam or send low-quality messages to inflate the number. Counter-metrics like reply rate (quality signal) and block/report rate (spam signal) prevent gaming and keep you focused on genuine engagement."
            },
            {
              question: "Duolingo shifted from tracking 'daily active users' to 'learning sessions completed per week.' What PM principle does this illustrate?",
              options: [
                "Revenue should always be the primary metric",
                "Measuring the action that most directly connects to user value, not just presence",
                "Weekly metrics are always better than daily metrics",
                "Simplifying metrics to make them easier to communicate to stakeholders"
              ],
              correct: 1,
              explanation: "Duolingo realized that simply opening the app doesn't equal learning. The metric 'learning sessions completed' is directly tied to the user outcome (language progress). Great PMs identify the metric most tightly linked to genuine value delivery."
            }
          ],
          resources: [
            {
              title: "Amplitude's North Star Playbook (Free PDF)",
              url: "https://amplitude.com/north-star",
              description: "Amplitude's comprehensive guide to identifying the metrics that actually matter for your product."
            },
            {
              title: "Andrew Chen: Why DAU/MAU is the key stickiness ratio",
              url: "https://andrewchen.com/dau-mau-is-an-important-metric/",
              description: "Andrew Chen breaks down the stickiness ratio that top consumer PMs live by — with examples from social and gaming products."
            },
            {
              title: "Andrew Chen: 5 Steps to a Metrics-Driven Business",
              url: "https://andrewchen.com/5-steps-towards-building-a-metrics-driven-business/",
              description: "A practical framework for building the habit of measuring what actually matters, not just what's easy to track."
            }
          ]
        },
        {
          id: "pm-frameworks",
          title: "Key PM Frameworks",
          duration: "3 min read",
          lesson: {
            title: "Frameworks PMs Use to Structure Thinking",
            content: `
              <p>Frameworks are mental shortcuts — they help PMs structure ambiguous problems, communicate clearly, and avoid forgetting important angles. You don't use frameworks to sound smart; you use them to think more completely.</p>

              <h3>1. The Problem Space vs. Solution Space</h3>
              <p>New PMs often jump straight to solutions ("we should build a notification!") before fully understanding the problem ("why are users not returning?"). The discipline is: <strong>spend more time in the problem space</strong> before entering the solution space.</p>
              <p>Problem space questions: Who is the user? What are they trying to accomplish? Where are they failing? Why does this matter?</p>
              <p>Solution space questions: What features could address this? What's the simplest version? What are the tradeoffs?</p>

              <h3>2. User Stories</h3>
              <p>A user story is a short template for expressing a requirement from the user's perspective:</p>
              <blockquote><em>"As a [type of user], I want to [do something], so that [I get some benefit]."</em></blockquote>
              <p>Example: "As a job seeker, I want to filter LinkedIn jobs by remote-only, so that I don't waste time applying to roles that require relocation."</p>
              <p>User stories keep requirements grounded in real user needs instead of arbitrary feature ideas.</p>

              <h3>3. The Jobs-to-be-Done Framework</h3>
              <p>Clayton Christensen's framework: users don't buy products — they "hire" products to do a job. People don't buy a quarter-inch drill; they hire it to make a quarter-inch hole.</p>
              <p>Example: People don't use Spotify to stream music; they hire Spotify to soundtrack their workout, manage their mood, or discover something new. These are different "jobs" — and Spotify should build features for each one.</p>

              <h3>4. The CIRCLES Method (for PM interviews)</h3>
              <p>A structured way to answer "design a product for X" questions:</p>
              <ul>
                <li><strong>C</strong>omprehend the situation — clarify constraints and goals</li>
                <li><strong>I</strong>dentify the customer — who is the user?</li>
                <li><strong>R</strong>eport the customer's needs — what are they trying to do?</li>
                <li><strong>C</strong>ut through prioritization — which needs matter most?</li>
                <li><strong>L</strong>ist solutions — brainstorm features</li>
                <li><strong>E</strong>valuate tradeoffs — pros, cons, risks</li>
                <li><strong>S</strong>ummarize your recommendation</li>
              </ul>

              <h3>5. PRDs — Product Requirements Documents</h3>
              <p>A PRD is the source of truth for what you're building. A good PRD includes:</p>
              <ul>
                <li><strong>Problem statement:</strong> Why are we building this?</li>
                <li><strong>Goals and success metrics:</strong> How will we know it worked?</li>
                <li><strong>User stories / requirements:</strong> What exactly should it do?</li>
                <li><strong>Out of scope:</strong> What are we explicitly NOT building?</li>
                <li><strong>Open questions:</strong> What's still unknown?</li>
              </ul>
              <p>The "out of scope" section is often the most important — it prevents scope creep and forces honest conversations.</p>
            `
          },
          quiz: [
            {
              question: "A PM says: 'We should add in-app chat because our competitor has it.' What PM principle are they violating?",
              options: [
                "They're skipping the problem space — they haven't established that users actually need this",
                "They're not using a formal framework like CIRCLES to evaluate the idea",
                "They're failing to write a proper PRD before proposing the feature",
                "They're prioritizing without a scoring model like RICE"
              ],
              correct: 0,
              explanation: "Jumping to a solution (in-app chat) because a competitor has it skips the problem space entirely. The right question first is: 'Do our users have a communication need we're not meeting?' Competitor features are signals, not requirements."
            },
            {
              question: "Which user story is written correctly?",
              options: [
                "'Build a dark mode for the app'",
                "'As a late-night user, I want a dark mode, so that I can read without straining my eyes'",
                "'Users want dark mode because everyone else has it'",
                "'Dark mode should be added in the next sprint'"
              ],
              correct: 1,
              explanation: "A proper user story follows: 'As a [user], I want [action], so that [benefit].' It grounds the requirement in a real user context and a clear reason — which makes it much easier to decide what to build and how to measure success."
            },
            {
              question: "According to the Jobs-to-be-Done framework, why do people actually use Instagram?",
              options: [
                "To upload and store photos",
                "To 'hire' the app for jobs like staying connected, getting validation, discovering trends, or building a personal brand",
                "To view content from their favorite influencers",
                "To access a social media feed"
              ],
              correct: 1,
              explanation: "JTBD reframes user motivation: people hire Instagram for specific emotional or functional jobs — feeling connected, getting attention, being entertained. Each 'job' has different requirements and should influence different feature decisions."
            },
            {
              question: "In a PM interview, you're asked: 'Design a product for elderly users to manage their medications.' What should you do FIRST?",
              options: [
                "List features: reminders, dosage tracking, doctor integration",
                "Clarify the goal — what does success look like? What constraints exist?",
                "Jump to the recommendation to show confidence",
                "Ask about the tech stack and platform constraints"
              ],
              correct: 1,
              explanation: "The first step in CIRCLES is 'Comprehend the situation.' Clarifying the goal, context, and constraints before brainstorming ensures you're solving the right problem. Jumping to features before understanding the problem produces low-quality, generic answers."
            },
            {
              question: "A PM is writing a PRD and lists: 'User profile customization, friend recommendations, and in-app payments.' Why is this PRD incomplete?",
              options: [
                "It doesn't include mockups or wireframes",
                "It's missing the problem statement, success metrics, and out-of-scope section",
                "The features listed are too broad — they need to be broken into tasks",
                "It hasn't been reviewed by engineering and design"
              ],
              correct: 1,
              explanation: "A feature list alone is an incomplete PRD. Without a problem statement (why?), success metrics (how will we know it worked?), and out-of-scope definition (what are we NOT building?), a team can't make good decisions or know when they're done."
            }
          ],
          resources: [
            {
              title: "Jobs-to-be-Done: A Framework for Customer Needs",
              url: "https://hbr.org/2016/09/know-your-customers-jobs-to-be-done",
              description: "Clayton Christensen's Harvard Business Review article explaining the original Jobs-to-be-Done framework."
            },
            {
              title: "How to Write a Great PRD (Jackie Bavaro)",
              url: "https://hackernoon.com/how-to-write-a-killer-prd-product-requirements-doc-that-gets-what-you-want-built-c6d95c26e5b8",
              description: "A practical, template-driven guide to writing PRDs from a former Asana and Google PM."
            },
            {
              title: "Mind the Product: Mental Models for PMs",
              url: "https://www.mindtheproduct.com/mental-models-product-managers",
              description: "A clear guide to the mental models PMs use to structure ambiguous problems — written for practitioners, not academics."
            }
          ]
        }
      ]
    },
    {
      id: "intermediate",
      title: "Intermediate",
      subtitle: "I have some idea about PM",
      description: "Covers: metrics deep-dive, frameworks (HEART, RICE, AARRR), prioritization, A/B testing",
      icon: "📈",
      topics: [
        {
          id: "north-star-metrics",
          title: "North Star Metrics",
          duration: "3 min read",
          lesson: {
            title: "Finding the One Metric That Captures Everything",
            content: `
              <p>A North Star Metric (NSM) is the single number that best captures whether your product is delivering value to users. It's not your revenue number (that's a lagging indicator) — it's the metric that, if it goes up, you're confident both users and the business are winning.</p>

              <h3>What Makes a Good North Star Metric?</h3>
              <p>A strong NSM has three properties:</p>
              <ul>
                <li><strong>It reflects user value</strong> — it measures whether users are actually getting something out of your product</li>
                <li><strong>It predicts long-term revenue</strong> — if this number grows, revenue will follow</li>
                <li><strong>It can be influenced by your team</strong> — your features and decisions can move it</li>
              </ul>

              <h3>Famous North Star Metrics</h3>
              <p><strong>Airbnb:</strong> Nights booked — captures both host and guest value in one number</p>
              <p><strong>Spotify:</strong> Time spent listening — the more you listen, the more value you're getting</p>
              <p><strong>Slack:</strong> Messages sent by org per day — signals active team collaboration</p>
              <p><strong>Facebook:</strong> Daily Active Users — measures whether users are returning (debated, but widely cited)</p>
              <p><strong>Duolingo:</strong> Daily Active Users completing at least one lesson — measures actual learning, not just presence</p>
              <p><strong>Uber:</strong> Trips per day — captures both rider and driver value simultaneously</p>

              <h3>NSM vs. Input Metrics</h3>
              <p>The NSM lives at the top. Below it are "input metrics" — the levers your team can actually pull. If your NSM is "nights booked," your inputs might be: search-to-booking conversion rate, listing quality score, and pricing competitiveness. Input metrics are what teams optimize daily; the NSM is what you track monthly to see if everything is working.</p>

              <h3>The Input Metric Tree (AARRR)</h3>
              <p>AARRR (Pirate Metrics) is a framework for mapping inputs:</p>
              <ul>
                <li><strong>A</strong>cquisition — how users find you</li>
                <li><strong>A</strong>ctivation — first experience of value</li>
                <li><strong>R</strong>etention — do they come back?</li>
                <li><strong>R</strong>eferral — do they tell others?</li>
                <li><strong>R</strong>evenue — do you make money?</li>
              </ul>

              <h3>Common Mistakes</h3>
              <p><strong>Mistake 1: Choosing revenue as your NSM.</strong> Revenue is a business outcome, not a user value signal. It lags behind what's actually happening in your product.</p>
              <p><strong>Mistake 2: Choosing an activity metric over a value metric.</strong> "Users who logged in today" is activity. "Users who completed a workout today" is value. The second tells you much more.</p>
              <p><strong>Mistake 3: Too many metrics called 'North Star.'</strong> If you have five North Stars, you have none. One metric, aligned across the company.</p>
            `
          },
          quiz: [
            {
              question: "Why is 'Monthly Revenue' generally a poor choice for a North Star Metric?",
              options: [
                "It's too difficult to track accurately across different currencies",
                "It's a lagging business outcome — it doesn't directly measure whether users are getting value",
                "Revenue metrics should be tracked weekly, not monthly",
                "It combines too many product lines into a single number"
              ],
              correct: 1,
              explanation: "Revenue is a consequence of user value, not the value itself. A company can grow revenue short-term through pricing changes or discounts while its product actually gets worse. NSMs should measure user value that predicts long-term revenue health."
            },
            {
              question: "Slack's North Star Metric is 'messages sent per active organization per day.' Why is this a strong NSM?",
              options: [
                "It's easy to manipulate and shows growth quickly",
                "It measures actual team collaboration behavior, which directly reflects Slack's core value proposition",
                "It's the metric investors care about most during fundraising",
                "It's aligned with how email metrics are tracked, making it easier to benchmark"
              ],
              correct: 1,
              explanation: "Slack's value is team communication. If teams are sending messages daily, they're actively collaborating — that's genuine product value. This metric also predicts retention (active teams keep paying) and is directly influenced by product improvements."
            },
            {
              question: "A PM at a recipe app has two candidate NSMs: (A) 'recipes viewed per week' and (B) 'recipes cooked per week.' Which is better and why?",
              options: [
                "A is better — it's easier to track and includes more user touchpoints",
                "B is better — it measures actual value delivery (cooking a meal), not just browsing behavior",
                "A is better — viewing more recipes indicates stronger intent to cook",
                "Both are equally valid as co-North Star metrics"
              ],
              correct: 1,
              explanation: "'Recipes cooked' is the actual value the app delivers — helping people cook meals. 'Recipes viewed' is a proxy that could include aimless browsing. NSMs should measure value delivered, not just activity. The gap between viewed and cooked would also reveal activation problems."
            },
            {
              question: "In the AARRR framework, the 'Activation' stage refers to:",
              options: [
                "The moment a new user first hears about your product",
                "The first time a user experiences the core value of your product",
                "When a user upgrades from free to paid",
                "The moment a user refers a friend"
              ],
              correct: 1,
              explanation: "Activation is about the 'aha moment' — when a new user first experiences why your product is valuable. For Dropbox, it's when you sync your first file across devices. For Twitter, it was following 30 people in your first week. Poor activation is why many apps have great downloads but poor retention."
            },
            {
              question: "What is the relationship between a North Star Metric and input metrics?",
              options: [
                "They are the same thing — input metrics is just another term for NSM",
                "The NSM is the top-level outcome; input metrics are the specific levers teams optimize to move it",
                "Input metrics measure user acquisition; the NSM measures long-term retention",
                "Input metrics are only used during growth phases; NSMs are used during maturity"
              ],
              correct: 1,
              explanation: "The NSM is the company-wide measure of value. Input metrics are the specific, actionable levers below it — like search conversion rate, onboarding completion, or feature adoption — that teams work on daily. Moving the inputs should move the NSM."
            }
          ],
          resources: [
            {
              title: "Amplitude North Star Playbook",
              url: "https://amplitude.com/north-star",
              description: "The definitive free guide to North Star Metrics — with worksheets and real company examples."
            },
            {
              title: "Sean Ellis: The Metric that Matters",
              url: "https://brianbalfour.com/essays/north-star-metric",
              description: "Brian Balfour's deep dive into how to find the right metric for your company."
            },
            {
              title: "Amplitude: Every Product Needs a North Star Metric",
              url: "https://amplitude.com/blog/product-north-star-metric",
              description: "Amplitude's blog post on how to define your North Star Metric — free, practical, with real company examples."
            }
          ]
        },
        {
          id: "ab-testing",
          title: "A/B Testing & Experimentation",
          duration: "3 min read",
          lesson: {
            title: "A/B Testing: Running Experiments That Actually Tell You Something",
            content: `
              <p>An A/B test (or experiment) splits your users into two groups: <strong>Group A</strong> sees the current experience (the control), and <strong>Group B</strong> sees the new version (the treatment). By comparing outcomes between the groups, you can determine whether a change actually caused an improvement.</p>

              <h3>Why A/B Testing Matters</h3>
              <p>Without A/B tests, you can't prove causation. If you launch a new button color and signups go up, was it the button? The season? A blog post? An A/B test isolates the variable and tells you what actually caused the change.</p>

              <h3>The A/B Testing Process</h3>
              <p><strong>Step 1: Form a hypothesis.</strong> "We believe that changing the CTA button from blue to green will increase signup rate because green signals 'go' and stands out more on our navy background."</p>
              <p><strong>Step 2: Define your success metric.</strong> What one number will tell you if the experiment worked? (e.g., "signup rate within 24 hours of landing")</p>
              <p><strong>Step 3: Calculate required sample size.</strong> You need enough users in each group to detect a meaningful difference. Underpowered tests produce unreliable results.</p>
              <p><strong>Step 4: Run the experiment.</strong> Split traffic randomly. Don't peek at results early — it inflates false positives.</p>
              <p><strong>Step 5: Analyze results.</strong> Is the difference statistically significant? Is the effect size meaningful?</p>

              <h3>Statistical Significance</h3>
              <p>When a result is "statistically significant at 95%," it means: if there were really no difference between A and B, we'd only see a result this extreme 5% of the time by chance. A p-value < 0.05 is the common threshold.</p>
              <p><strong>Critical: significance ≠ importance.</strong> A 0.01% improvement can be statistically significant with a billion users but meaningless in practice. Always check effect size, not just significance.</p>

              <h3>Common A/B Testing Mistakes</h3>
              <p><strong>Mistake 1: Stopping early.</strong> If you stop an experiment as soon as it looks significant, you're "peeking" — this inflates your false positive rate. Let the test run for the planned duration.</p>
              <p><strong>Mistake 2: Testing too many things at once.</strong> If you change the headline, button color, AND image simultaneously, you can't tell which change drove the result.</p>
              <p><strong>Mistake 3: Novelty effects.</strong> Sometimes a new experience gets engagement just because it's new. A/B tests need to run long enough for novelty to wear off.</p>
              <p><strong>Mistake 4: Not considering secondary metrics.</strong> Your CTA might get more clicks, but if users who clicked convert at half the rate, you've lost ground overall.</p>

              <h3>When NOT to A/B Test</h3>
              <p>A/B testing requires traffic volume and time. If you have fewer than 1,000 users, tests take too long to reach significance. Also, qualitative changes (a redesign, a new product direction) shouldn't be A/B tested first — use user research and judgment, then validate with metrics post-launch.</p>
            `
          },
          quiz: [
            {
              question: "Your team runs an A/B test on a new checkout flow. After 3 days, the variant is showing +8% conversion. Should you ship it?",
              options: [
                "Yes — an 8% improvement is significant and you should move fast",
                "No — you should wait for statistical significance and the pre-determined sample size before concluding",
                "Yes — 3 days is enough time to account for weekly user behavior patterns",
                "No — any change to checkout requires a minimum 30-day test by industry standard"
              ],
              correct: 1,
              explanation: "Stopping early ('peeking') is one of the most common A/B testing mistakes. Results after 3 days may not be statistically significant, and early positive signals often regress. Always run tests for the pre-determined duration and required sample size."
            },
            {
              question: "What does a p-value of 0.03 mean in an A/B test?",
              options: [
                "There is a 3% chance the variant is better than the control",
                "There is a 3% chance of seeing this result (or more extreme) if there were actually no difference",
                "The test has 3% more statistical power than needed",
                "The variant improved the metric by 3%"
              ],
              correct: 1,
              explanation: "A p-value of 0.03 means: if the null hypothesis (no real difference) were true, you'd only observe a difference this large by random chance 3% of the time. At a 0.05 threshold, this is statistically significant — but remember, significance doesn't equal practical importance."
            },
            {
              question: "You change the button text, color, AND position all at once in an A/B test, and the variant wins. What's the problem?",
              options: [
                "You violated statistical independence by changing three variables",
                "You can't determine which specific change caused the improvement — it could be any of the three",
                "The test will be considered invalid by most analysis tools",
                "There is no problem — the variant won, so ship it"
              ],
              correct: 1,
              explanation: "Changing multiple variables at once is a multivariate test, not a clean A/B test. You can't isolate which variable drove the result. If you want to learn what works (not just win this one test), change one variable at a time."
            },
            {
              question: "A new feature gets +40% engagement in its first week, then drops back to baseline in week 3. This is most likely:",
              options: [
                "A successful test — the feature worked and then users normalized",
                "A novelty effect — users engaged with something new, but it didn't provide lasting value",
                "Statistical noise — the initial result was a false positive",
                "A sign the feature needs more users to achieve significance"
              ],
              correct: 1,
              explanation: "The novelty effect is real: users engage with new things just because they're new, not because they're valuable. This is why A/B tests should run long enough for novelty to wear off — typically 2-4 weeks for most consumer products."
            },
            {
              question: "A PM wants to test whether a 20% price increase affects conversion. The current monthly traffic is 500 users. What's the key concern?",
              options: [
                "A price increase test requires regulatory approval",
                "500 users is likely too small to detect a meaningful difference within a reasonable time frame",
                "Price tests should only be run on premium users, not all users",
                "The test should be run for exactly 14 days to avoid novelty effects"
              ],
              correct: 1,
              explanation: "Statistical power requires sufficient sample size. With 500 monthly users, detecting a meaningful change in conversion rate (say 5%) would require many months of testing — far too slow to be practical. Small-volume products should use qualitative methods (user interviews, surveys) rather than A/B tests."
            }
          ],
          resources: [
            {
              title: "Evan Miller's A/B Test Sample Size Calculator",
              url: "https://www.evanmiller.org/ab-testing/sample-size.html",
              description: "The most widely-used free tool for calculating how many users you need before running an A/B test."
            },
            {
              title: "Ronny Kohavi: Trustworthy Online Controlled Experiments",
              url: "https://www.amazon.com/Trustworthy-Online-Controlled-Experiments-Practical/dp/1108724264",
              description: "The definitive book on A/B testing by Microsoft's former experimentation head — the industry bible."
            },
            {
              title: "Netflix: Experimentation at Scale",
              url: "https://netflixtechblog.com/its-all-a-bout-testing-the-netflix-experimentation-platform-4e1ca458c15b",
              description: "Netflix's engineering blog on how they run thousands of A/B tests simultaneously — great for understanding scale."
            }
          ]
        },
        {
          id: "prioritization",
          title: "Prioritization Frameworks",
          duration: "3 min read",
          lesson: {
            title: "How PMs Decide What to Build Next",
            content: `
              <p>Prioritization is arguably the hardest PM skill. Every team has more ideas than time, and every stakeholder is convinced their request is the most important. Frameworks give you a defensible, structured way to make decisions — and to explain them.</p>

              <h3>1. RICE Scoring</h3>
              <p>RICE is a quantitative framework developed at Intercom. Score each feature on four dimensions:</p>
              <ul>
                <li><strong>R</strong>each — how many users will this affect per period? (e.g., 2,000 users/month)</li>
                <li><strong>I</strong>mpact — how much will it improve each user's experience? (0.25 = minimal, 0.5 = low, 1 = medium, 2 = high, 3 = massive)</li>
                <li><strong>C</strong>onfidence — how sure are you? (80% = medium, 100% = high, 50% = low)</li>
                <li><strong>E</strong>ffort — how many person-months will it take?</li>
              </ul>
              <p><strong>RICE Score = (Reach × Impact × Confidence) / Effort</strong></p>
              <p>Example: A feature affecting 5,000 users/month, medium impact (1), 80% confidence, taking 2 months: RICE = (5,000 × 1 × 0.8) / 2 = 2,000</p>

              <h3>2. HEART Framework (Google)</h3>
              <p>HEART is a qualitative framework for evaluating UX quality — good for understanding the "why" behind prioritization:</p>
              <ul>
                <li><strong>H</strong>appiness — user satisfaction, NPS</li>
                <li><strong>E</strong>ngagement — depth of interaction</li>
                <li><strong>A</strong>doption — new users using the feature</li>
                <li><strong>R</strong>etention — users returning over time</li>
                <li><strong>T</strong>ask Success — users completing key actions</li>
              </ul>
              <p>HEART is most useful when defining what to measure, not just what to build.</p>

              <h3>3. MoSCoW Method</h3>
              <p>A simple framework for sprint or release planning:</p>
              <ul>
                <li><strong>M</strong>ust Have — essential for launch</li>
                <li><strong>S</strong>hould Have — important but not critical</li>
                <li><strong>C</strong>ould Have — nice-to-have if time allows</li>
                <li><strong>W</strong>on't Have (this time) — explicitly deferred</li>
              </ul>
              <p>The most important category is "Won't Have" — it forces explicit decisions about what you're NOT doing, which prevents scope creep.</p>

              <h3>4. The 2×2 Impact/Effort Matrix</h3>
              <p>Plot features on a 2×2 grid: high/low impact on Y-axis, high/low effort on X-axis.</p>
              <ul>
                <li><strong>High impact, low effort</strong> → Quick wins — do these first</li>
                <li><strong>High impact, high effort</strong> → Big bets — plan these carefully</li>
                <li><strong>Low impact, low effort</strong> → Fill-ins — do when nothing else is urgent</li>
                <li><strong>Low impact, high effort</strong> → Avoid — rarely worth it</li>
              </ul>

              <h3>When to Use What</h3>
              <p>Use <strong>RICE</strong> when you have quantitative data and need to justify ranking to stakeholders. Use <strong>MoSCoW</strong> for sprint planning and release scoping. Use <strong>HEART</strong> when defining success metrics for a feature. Use <strong>2×2</strong> for quick team alignment during brainstorms.</p>
            `
          },
          quiz: [
            {
              question: "Feature A has: Reach=1,000/month, Impact=2, Confidence=80%, Effort=1 month. Feature B has: Reach=500/month, Impact=3, Confidence=100%, Effort=2 months. Which has a higher RICE score?",
              options: [
                "Feature A — RICE = 1,600; Feature B — RICE = 750",
                "Feature B — it has higher impact and confidence",
                "Feature A — RICE = 1,600; Feature B — RICE = 750, so Feature A wins",
                "Both are equal when rounded to the nearest hundred"
              ],
              correct: 0,
              explanation: "Feature A: (1,000 × 2 × 0.8) / 1 = 1,600. Feature B: (500 × 3 × 1.0) / 2 = 750. Feature A wins despite lower individual impact because it reaches more people and requires less effort. RICE is about expected value per unit of investment."
            },
            {
              question: "A stakeholder insists that a niche feature should be 'Must Have' in MoSCoW because it's important to one key client. What should a PM do?",
              options: [
                "Agree — customer requests should always be Must Have",
                "Push back by asking whether this is truly essential for the product to function or for broader user value",
                "Accept it as Must Have but add extra time to the sprint",
                "Escalate to the CEO to decide"
              ],
              correct: 1,
              explanation: "'Must Have' should mean 'the product cannot launch or function without this' — not 'this is important to someone.' A niche request from one client is typically a Should Have or Could Have. MoSCoW only works if Must Haves are kept to a genuine minimum."
            },
            {
              question: "A team uses a 2×2 Impact/Effort matrix and identifies a 'low impact, low effort' feature. What should they do?",
              options: [
                "Build it immediately — low effort means low risk",
                "Make it a stretch goal — do it if bandwidth allows, but don't prioritize it",
                "Discard it entirely — low impact work should never be done",
                "Move it to 'Must Have' since it won't take long"
              ],
              correct: 1,
              explanation: "Low impact, low effort features are 'fill-ins' — fine to build when there's truly nothing more important, but they shouldn't displace high-impact work. They're not worth zero, but they shouldn't be prioritized over quick wins or big bets."
            },
            {
              question: "What is the primary weakness of the RICE scoring framework?",
              options: [
                "It requires too much engineering input to calculate",
                "The inputs (especially Impact and Confidence) are subjective estimates that can be gamed",
                "It doesn't account for revenue potential",
                "It can only be used for features affecting more than 1,000 users"
              ],
              correct: 1,
              explanation: "RICE's power is also its weakness: the numbers feel precise, but Impact and Confidence are subjective estimates. Teams can unconsciously inflate scores for features they're already excited about. RICE should be treated as a decision-aid, not a decision-maker."
            },
            {
              question: "The HEART framework's 'Task Success' dimension measures:",
              options: [
                "Whether users complete onboarding within 24 hours",
                "The efficiency, effectiveness, and error rate of users completing key tasks",
                "How many tasks are completed per session",
                "Whether users successfully refer friends after completing a task"
              ],
              correct: 1,
              explanation: "Task Success measures usability: can users actually complete the tasks your product is designed for? Metrics include completion rate, time-on-task, and error rate. A task that most users fail or struggle with signals a UX problem regardless of other HEART dimensions."
            }
          ],
          resources: [
            {
              title: "Intercom: Introducing RICE Scoring",
              url: "https://www.intercom.com/blog/rice-simple-prioritization-for-product-managers/",
              description: "The original RICE framework post from Intercom's product team — clear and practical."
            },
            {
              title: "Google HEART Framework",
              url: "https://research.google/pubs/pub36299/",
              description: "Google's research paper introducing HEART — the standard for UX quality measurement."
            },
            {
              title: "Reforge: Prioritization in Practice",
              url: "https://www.reforge.com/blog/prioritization-frameworks",
              description: "Reforge's analysis of when to use different prioritization frameworks — with real startup examples."
            }
          ]
        }
      ]
    },
    {
      id: "advanced",
      title: "Advanced",
      subtitle: "I want to practice real scenarios",
      description: "Covers: product sense case studies, scenario-based justification, company strategy analysis",
      icon: "🚀",
      topics: [
        {
          id: "case-study-spotify",
          title: "Case Study: Spotify Engagement Drop",
          duration: "15–20 min",
          isCaseStudy: true,
          scenario: {
            title: "Spotify Discover Weekly Engagement Drops 15%",
            context: `Spotify's Discover Weekly playlist — a personalized weekly playlist delivered every Monday — has seen a 15% drop in "full listen-through rate" (users listening to at least 80% of the playlist) over the past 8 weeks. Your team owns Discover Weekly. The head of product asks you to diagnose what's happening and propose next steps.`,
            prompt: `In your answer, address the following:
1. What are the possible root causes of this drop? (Structure your investigation across user, product, and external factors)
2. What data would you pull to narrow down the cause?
3. What's your initial hypothesis, and what experiment would you run to test it?
4. If confirmed, what specific features or changes would you propose?`,
            rubric: [
              {
                dimension: "Problem Decomposition",
                strong: "Breaks the problem into distinct hypotheses across user behavior, product changes, content quality, and external factors (Spotify app changes, music library, competitor launches).",
                weak: "Jumps to one cause without exploring alternatives."
              },
              {
                dimension: "Data-Driven Investigation",
                strong: "Names specific metrics to pull: listen-through rate by user segment (power users vs casual), skip rate per track, cohort behavior (new vs returning users), listening context (commute vs home), and whether the drop correlates with any product releases.",
                weak: "Says 'we should look at the data' without specifying what to look for."
              },
              {
                dimension: "Root Cause Hypothesis",
                strong: "Identifies a specific, testable hypothesis (e.g., 'Algorithm quality degraded after a model update — tracks are less personalized, causing users to skip more and abandon'). Mentions seasonal listening patterns as a confounder to rule out.",
                weak: "Vague hypothesis that doesn't point to a specific cause or test."
              },
              {
                dimension: "Proposed Solution",
                strong: "Ties solution directly to hypothesis: if algorithm quality, suggests retraining the model with more recent listening signals; if user expectations changed, suggests A/B testing a shorter playlist format; if competitor (Apple Music), analyze whether churned users are moving elsewhere.",
                weak: "Generic solution ('improve the algorithm') without specifics."
              },
              {
                dimension: "Metrics for Success",
                strong: "Defines success as returning full listen-through rate to baseline + monitoring skip rate and saves-per-playlist as leading indicators.",
                weak: "Doesn't define what success looks like post-fix."
              }
            ],
            modelAnswer: `
              <h3>1. Root Cause Framework</h3>
              <p>I'd start by structuring possible causes into three buckets:</p>
              <p><strong>Product-side changes:</strong> Did we ship any algorithm updates, model retrains, or data pipeline changes in the past 8 weeks? Even small changes to Discover Weekly's ranking model can meaningfully shift track quality. Also — did the playlist length change?</p>
              <p><strong>User-side shifts:</strong> Did listening context change? (e.g., summer vs. fall commute behavior). Are specific user cohorts driving the drop (new users who haven't built listening history vs. long-tenured users)? Did we change anything in how users access the playlist?</p>
              <p><strong>External factors:</strong> Did a major music release dominate listening and reduce Discover Weekly plays? Did a competitor launch a competing feature? Are there any app-level issues (crashes, slow loads for this specific feature)?</p>

              <h3>2. Data I'd Pull</h3>
              <ul>
                <li><strong>Listen-through rate by user segment:</strong> Power users (listen daily) vs. casual users. If only casual users dropped, the cause is different than a universal drop.</li>
                <li><strong>Skip rate per track position:</strong> Are users abandoning early (track 1-3) or late (track 20+)? Early abandonment suggests the opening tracks are mismatched; late abandonment suggests playlist fatigue.</li>
                <li><strong>Algorithm changelog:</strong> Cross-reference the 8-week drop with any model update or data pipeline change dates.</li>
                <li><strong>Save rate:</strong> Are users saving fewer tracks from Discover Weekly? A drop here alongside listen-through rate drop suggests quality decline, not just context change.</li>
                <li><strong>Seasonal baseline:</strong> Did listen-through rate drop at the same time last year? Controls for seasonal behavior.</li>
              </ul>

              <h3>3. Primary Hypothesis</h3>
              <p>My hypothesis: <em>A model update 8–9 weeks ago reduced personalization quality, causing the first 1-3 tracks to feel mismatched to recent listening behavior — leading to early abandonment.</em></p>
              <p>This would show up as: higher skip rates on tracks 1-3, a corresponding drop in save rate, no seasonal explanation, and a changelog entry near week -8.</p>
              <p><strong>Experiment:</strong> Create a holdback group that receives Discover Weekly built from the pre-update model. Compare listen-through rate between the old and new model over 2 weeks. If the old model outperforms, we have our cause.</p>

              <h3>4. Proposed Solutions</h3>
              <p>If the hypothesis is confirmed:</p>
              <ul>
                <li>Roll back or retrain the model with additional listening recency signals (last 2 weeks of listening should be weighted more heavily)</li>
                <li>Add a "warm-up" track at position 1 that is explicitly a high-confidence match (a song the user has liked before in a similar genre) to reduce early abandonment</li>
                <li>A/B test a shorter playlist format (15 tracks vs. 30) for users with lower listen-through history</li>
              </ul>
              <p><strong>Success metrics:</strong> Listen-through rate returning to baseline (7-day moving average), skip rate on tracks 1-3 returning to pre-drop levels, and save rate per playlist stable or improving.</p>
            `
          }
        },
        {
          id: "case-study-linkedin",
          title: "Case Study: Design for LinkedIn Job Seekers",
          duration: "15–20 min",
          isCaseStudy: true,
          scenario: {
            title: "Design a Feature for LinkedIn to Help Job Seekers",
            context: `LinkedIn has 900M+ members. The vast majority of LinkedIn's revenue comes from recruiters (LinkedIn Recruiter tool) — not from job seekers. Yet job seekers are what make the platform valuable to recruiters. Internal data shows that job seekers who are actively searching "go dark" — they stop engaging with LinkedIn content — about 3 weeks into their search. LinkedIn leadership wants to improve this.`,
            prompt: `In your answer, address the following:
1. What is the core problem you're solving, and for whom?
2. What are 3 distinct feature ideas that could help? For each, explain the user value and any risks.
3. Which one would you prioritize and why?
4. How would you measure success, and what's your MVP?`,
            rubric: [
              {
                dimension: "Problem Framing",
                strong: "Identifies the double-sided marketplace dynamic: LinkedIn needs engaged job seekers to serve recruiters. Going dark is bad for both. Frames the problem as 'job seekers disengage because job searching is isolating, opaque, and discouraging — they need progress signals and a supportive community.'",
                weak: "Treats it as a simple engagement problem without understanding why users disengage."
              },
              {
                dimension: "Feature Breadth & Insight",
                strong: "3 distinct features with different mechanisms: e.g., (1) a private job search dashboard with progress tracking, (2) an anonymous peer community for job seekers to share experiences, (3) AI-powered application feedback. Each feature addresses a different root cause of disengagement.",
                weak: "Features are too similar to each other or too generic (e.g., 'better notifications', 'more jobs listed')."
              },
              {
                dimension: "Prioritization Reasoning",
                strong: "Uses a framework (RICE, impact/effort) or a clear principle to choose between features. Considers LinkedIn's strategic goals (recruiter revenue), technical feasibility, and differentiation from competitors.",
                weak: "Picks a feature without explaining the reasoning."
              },
              {
                dimension: "MVP Scoping",
                strong: "Proposes a lean first version that tests the core hypothesis without full build-out (e.g., a static dashboard with manual status updates before building algorithm-driven tracking).",
                weak: "MVP is the full feature with all bells and whistles."
              },
              {
                dimension: "Success Metrics",
                strong: "Names specific metrics: engagement rate of job seekers at week 3+ (primary), profile update frequency, application submission rate, and a guardrail metric (recruiter tool revenue not decreasing).",
                weak: "Vague metric like 'improve engagement' with no specific number or timeframe."
              }
            ],
            modelAnswer: `
              <h3>1. Core Problem</h3>
              <p>The core problem: <em>Active job seekers disengage from LinkedIn 3 weeks into their search because the process feels isolating, opaque, and discouraging — applications go into a void, rejections are silent, and there's no visible progress.</em></p>
              <p>This matters for LinkedIn because job seekers are the "supply" that makes LinkedIn Recruiter valuable. If seekers disengage, they update profiles less, are less discoverable, and the network becomes less valuable. It's a structural threat to LinkedIn's business model.</p>

              <h3>2. Three Feature Ideas</h3>
              <p><strong>Feature 1: Job Search Dashboard (private)</strong></p>
              <p>A private dashboard showing the job seeker's application pipeline — status of each application, how many profile views they received, and where they stand in any active processes. <em>User value:</em> eliminates the "void" feeling by creating visibility. <em>Risk:</em> LinkedIn currently doesn't have application status data for most jobs (only for Easy Apply jobs). Limited data coverage could make the dashboard feel incomplete.</p>

              <p><strong>Feature 2: Anonymous Job Seeker Community</strong></p>
              <p>A separate, anonymous feed (like Blind or Reddit) for active job seekers to share experiences, ask questions, and get peer support — without it affecting their professional reputation. <em>User value:</em> combat the isolation and stigma of job searching. <em>Risk:</em> anonymous content is harder to moderate; could attract negativity or become a competitor complaint board. Also, building community is hard and slow.</p>

              <p><strong>Feature 3: AI Application Coach</strong></p>
              <p>After applying to a job, an AI tool analyzes your resume and cover letter against the job description and provides a readiness score + specific suggestions. <em>User value:</em> turns rejections into learning; gives seekers a sense of control. <em>Risk:</em> raises false expectations; if the AI is wrong, it damages trust in LinkedIn's advice.</p>

              <h3>3. Prioritization</h3>
              <p>I'd prioritize <strong>Feature 3: AI Application Coach</strong> because:</p>
              <ul>
                <li><strong>Feasibility:</strong> LinkedIn has all the data needed — job descriptions and member profiles. This is a natural extension of existing systems.</li>
                <li><strong>Differentiation:</strong> No other job platform provides post-application feedback. It's a genuine insight advantage.</li>
                <li><strong>Engagement:</strong> It gives seekers a reason to return after applying — the exact behavior we want to change.</li>
                <li><strong>Revenue alignment:</strong> Better-prepared candidates = higher acceptance rates = more successful recruiter placements = happy recruiters.</li>
              </ul>

              <h3>4. MVP and Success Metrics</h3>
              <p><strong>MVP:</strong> A post-application prompt (only for Easy Apply jobs) that shows a resume-job description match score and 3 specific suggestions to improve future applications. No AI coaching session, no real-time feedback — just a match score and suggestions after submission.</p>
              <p><strong>Success metrics:</strong></p>
              <ul>
                <li>Primary: Job seeker engagement rate at weeks 3-6 of active search (return visits, profile updates)</li>
                <li>Leading: Application submission rate per active seeker per week</li>
                <li>Guardrail: LinkedIn Recruiter seat revenue (must not decrease)</li>
              </ul>
              <p><strong>Timeline:</strong> 6-week test with 20% of active job seekers on Easy Apply jobs.</p>
            `
          }
        },
        {
          id: "product-strategy",
          title: "Product Strategy Fundamentals",
          duration: "4 min read",
          lesson: {
            title: "What Is Product Strategy and How Do You Write One?",
            content: `
              <p>Product strategy answers three questions: <strong>Where are we going? Why does it matter? How will we get there?</strong> A strategy isn't a roadmap (that's tactics) — it's the logic behind why you're making the choices you're making.</p>

              <h3>The Three Levels of Strategy</h3>
              <p><strong>Company strategy:</strong> What market does the company operate in? What is its competitive advantage? (e.g., Amazon's strategy: be the lowest-cost, fastest-delivery marketplace by owning logistics infrastructure)</p>
              <p><strong>Product strategy:</strong> What is the product's role in achieving company goals? Which users does it serve? What are the top 3-5 bets the product is making? (e.g., Spotify's product strategy: own audio, not just music — expand into podcasts and audiobooks to reduce dependency on record labels)</p>
              <p><strong>Roadmap:</strong> What specific things are you building this quarter to execute on the product strategy? This is tactical.</p>

              <h3>The "Good Strategy / Bad Strategy" Framework (Richard Rumelt)</h3>
              <p>Richard Rumelt's book Good Strategy Bad Strategy identifies a common mistake: people confuse goals with strategy. "We will grow to $100M by 2025" is not a strategy. It's a goal.</p>
              <p>Good strategy has three elements (the "kernel"):</p>
              <ul>
                <li><strong>Diagnosis:</strong> What is the challenge we face? Where is the real constraint? (e.g., "Our churn rate is high because users don't complete setup")</li>
                <li><strong>Guiding policy:</strong> What is our overall approach to addressing that challenge? (e.g., "We will reduce time-to-value by removing steps from onboarding")</li>
                <li><strong>Coherent actions:</strong> What specific steps follow from that policy? (e.g., "We will remove the address verification step, pre-fill defaults from social login, and add interactive onboarding tips")</li>
              </ul>

              <h3>Moats and Defensibility</h3>
              <p>A product strategy should answer: "Why won't a well-funded competitor copy this?" The answer is your moat. Common product moats:</p>
              <ul>
                <li><strong>Network effects:</strong> The product gets more valuable as more people use it (LinkedIn, WhatsApp)</li>
                <li><strong>Data advantage:</strong> The product gets smarter with use (Spotify's recommendations, Google Search)</li>
                <li><strong>Switching costs:</strong> Users have invested enough that leaving is painful (Salesforce, Slack integrations)</li>
                <li><strong>Brand:</strong> Trust and recognition that's hard to replicate (Apple)</li>
              </ul>

              <h3>Strategy vs. Roadmap Trap</h3>
              <p>Many companies confuse a list of features (a roadmap) with a strategy. A strategy explains <em>why</em> you're making these bets and what you're choosing NOT to do. The "won't do" is just as important as the "will do." A strategy that tries to do everything is no strategy at all.</p>
            `
          },
          quiz: [
            {
              question: "A product team's strategy statement reads: 'We will grow to $50M ARR by Q4 next year.' What is wrong with this?",
              options: [
                "The target is too ambitious for a single year",
                "This is a goal, not a strategy — it states where you want to go but not how or why",
                "ARR is a lagging metric that shouldn't appear in product strategy",
                "Strategies should be set for 3-5 year horizons, not 12 months"
              ],
              correct: 1,
              explanation: "Rumelt's key insight: strategy is the logic of how you'll win, not just where you want to end up. '$50M ARR' is a financial target. A strategy would say: 'Given that SMB customers churn due to poor onboarding, we'll invest in high-touch activation to reduce churn by 20% and expand via account expansion.'"
            },
            {
              question: "Spotify's decision to expand into podcasts and audiobooks is best described as:",
              options: [
                "A tactical product decision to add new content types",
                "A strategic move to reduce dependence on record labels and own a broader audio platform",
                "A response to Apple Podcasts' market dominance",
                "A way to improve Spotify's North Star metric of time spent listening"
              ],
              correct: 1,
              explanation: "This is a strategic move, not just a feature add. Spotify was heavily dependent on the major record labels for licensing. By expanding to podcasts (which they can own the distribution of) and audiobooks, they diversified their content moat and reduced leverage the labels had over them."
            },
            {
              question: "LinkedIn's primary competitive moat is best described as:",
              options: [
                "Its user interface and design quality",
                "Its brand recognition among job seekers",
                "Network effects — the value of LinkedIn grows as more professionals join, making the data and connections increasingly irreplaceable",
                "Its recommendation algorithm for job matching"
              ],
              correct: 2,
              explanation: "LinkedIn's moat is its professional network — 900M+ profiles connected to their work history, skills, and professional relationships. No competitor can replicate this without getting professionals to add their entire career history again, which they won't do if everyone is already on LinkedIn."
            },
            {
              question: "In Rumelt's strategy kernel, the 'Guiding Policy' element refers to:",
              options: [
                "The specific actions the team will take this quarter",
                "The overall approach or logic for addressing the diagnosed challenge",
                "The company's mission statement and values",
                "The compliance and legal policies that govern product decisions"
              ],
              correct: 1,
              explanation: "The guiding policy is the bridge between diagnosis (what's the problem?) and coherent actions (what do we do?). It's the 'bet' — the broad approach the team is committing to. Example: 'We will win by being the cheapest option' or 'We will win by being the best for power users, not beginners.'"
            },
            {
              question: "A PM says: 'Our product strategy is to build great features for all user types — enterprise, SMB, and consumers — with the best UX in the market.' What is the strategic problem here?",
              options: [
                "The strategy is too expensive to execute",
                "It tries to do everything, which means it makes no hard choices and offers no real direction",
                "Consumer and enterprise products need separate strategies",
                "UX should not be part of a product strategy"
              ],
              correct: 1,
              explanation: "A strategy that tries to serve everyone equally, in every segment, with no focus, is actually no strategy — it's just a list of aspirations. Real strategy means choosing what you will NOT do. Trying to win with enterprise, SMB, and consumers simultaneously usually results in a mediocre product for all three."
            }
          ],
          resources: [
            {
              title: "Good Strategy Bad Strategy (Richard Rumelt)",
              url: "https://www.amazon.com/Good-Strategy-Bad-Difference-Matters/dp/0307886239",
              description: "The most important book on strategy for PMs. Rumelt's kernel framework changes how you'll think about product decisions."
            },
            {
              title: "Stratechery by Ben Thompson",
              url: "https://stratechery.com",
              description: "Weekly essays on tech company strategy — arguably the best public source for product strategy thinking in tech."
            },
            {
              title: "Stratechery: The Aggregation Theory (Ben Thompson)",
              url: "https://stratechery.com/2015/aggregation-theory/",
              description: "Ben Thompson's foundational free essay on how internet companies build strategic moats — essential product strategy reading."
            }
          ]
        }
      ]
    }
  ],
  resources: [
    {
      category: "Articles & Blogs",
      items: [
        { title: "Lenny: What Makes a Great PM?", url: "https://www.lennysnewsletter.com/p/what-makes-a-great-pm", description: "Lenny Rachitsky's most-shared piece on the traits that separate great PMs from good ones." },
        { title: "Lenny: Choosing Your North Star Metric", url: "https://www.lennysnewsletter.com/p/choosing-your-north-star-metric", description: "Lenny's breakdown of how to pick the right North Star Metric — with examples from Airbnb, Slack, and more." },
        { title: "Amplitude: The North Star Checklist", url: "https://amplitude.com/books/north-star/the-north-star-checklist", description: "A practical checklist from Amplitude's North Star Playbook to validate and refine your North Star Metric." },
        { title: "Stratechery: Aggregation Theory", url: "https://stratechery.com/2015/aggregation-theory/", description: "Ben Thompson's foundational free essay on how internet companies build lasting product advantages." },
        { title: "Ken Norton: Leading Cross-Functional Teams", url: "https://www.bringthedonuts.com/essays/leading-cross-functional-teams.html", description: "How PMs lead teams they don't manage — by the author of the most-cited PM essay ever written." }
      ]
    },
    {
      category: "Books",
      items: [
        { title: "Inspired — Marty Cagan", url: "https://www.svpg.com/books/inspired-how-to-create-tech-products-customers-love-2nd-edition/", description: "The PM bible. Covers how top tech companies build products." },
        { title: "Continuous Discovery Habits — Teresa Torres", url: "https://www.amazon.com/Continuous-Discovery-Habits-Discover-Products/dp/1736633309", description: "The modern framework for user research integrated into product development." },
        { title: "Good Strategy Bad Strategy — Rumelt", url: "https://www.amazon.com/Good-Strategy-Bad-Difference-Matters/dp/0307886239", description: "The clearest book on what strategy actually is — and isn't." }
      ]
    },
    {
      category: "Free Courses",
      items: [
        { title: "Exponent Free PM Resources", url: "https://www.tryexponent.com/blog", description: "Exponent's free blog with PM interview guides, frameworks, and career advice — no paywall." },
        { title: "Product School Free Resources", url: "https://productschool.com/resources", description: "Free PM templates, webinars, and guides from Product School." },
        { title: "Reforge Blog", url: "https://www.reforge.com/blog", description: "Deep, free articles on growth, metrics, and PM thinking from the premium course platform." }
      ]
    }
  ]
};
