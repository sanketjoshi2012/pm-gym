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
              <p>A Product Manager (PM) sits at the intersection of business, technology, and user experience. Their job is to figure out <strong>what to build, why to build it, and whether it worked</strong>, without directly managing the engineers, designers, or data scientists who do the building.</p>

              <h3>The Core Job</h3>
              <p>Think of a PM as the CEO of their product area. They own the "what" and "why," while engineering owns the "how." A PM working on Spotify's search feature, for example, is responsible for:</p>
              <ul>
                <li>Understanding why users struggle to find music</li>
                <li>Prioritizing improvements that matter most</li>
                <li>Writing clear specs so engineers know what to build</li>
                <li>Measuring whether the changes worked</li>
              </ul>

              <h3>What a PM's Week Actually Looks Like</h3>
              <p><strong>Monday:</strong> Review last week's metrics, did the new feature move the needle? Write up findings for the team.</p>
              <p><strong>Tuesday:</strong> User research session, interview 3 users to understand why they're abandoning the onboarding flow.</p>
              <p><strong>Wednesday:</strong> Sprint planning, work with engineers to scope what's feasible for the next two weeks.</p>
              <p><strong>Thursday:</strong> Write a PRD (Product Requirements Document) for the next feature.</p>
              <p><strong>Friday:</strong> Stakeholder sync, align with Marketing on the launch plan, align with Legal on compliance.</p>

              <h3>PM vs Other Roles</h3>
              <p><strong>PM vs Project Manager:</strong> A Project Manager ensures things get done on time. A PM decides <em>what</em> things should get done at all. PMs set direction; PjMs keep the train on schedule.</p>
              <p><strong>PM vs Designer:</strong> A Designer owns the look, feel, and usability of a product. A PM works with designers but owns the business goals and user outcomes, the "why," not just the "how it looks."</p>
              <p><strong>PM vs Engineer:</strong> Engineers build the product. PMs define what needs to be built and why. Great PMs earn engineers' trust by writing precise specs and shielding them from scope creep.</p>

              <h3>The "Without Authority" Problem</h3>
              <p>PMs influence without authority, they lead teams they don't manage. This means PMs win through <strong>clarity, credibility, and communication</strong>. When a PM says "we should build X," the engineers, designers, and stakeholders need a reason to believe them. That reason is usually: clear data, a deep understanding of users, and a logical argument.</p>

              <h3>Real Example: Instagram Stories</h3>
              <p>When Instagram's PM team saw Snapchat's Stories feature gaining traction, they had to make a hard call: build it into the existing app or launch something separate. They chose to add Stories directly into Instagram. Instagram added Stories inside the existing app instead of launching a separate one, and it became one of the most used parts of the product. That choice is product judgment.</p>
            `
          },
          quiz: [
            {
              question: "A PM is often described as the 'CEO of the product.' What does this mean in practice?",
              options: [
                "They own the product vision and outcomes, but lead through influence rather than authority",
                "They have authority to hire and fire engineers on their team",
                "They report directly to the CEO and make all final product decisions",
                "They manage the budget for the product team"
              ],
              correct: 0,
              explanation: "PMs 'own' the product in the sense of accountability for outcomes, but they have no direct authority over engineers or designers. They must lead through credibility, data, and clear communication, hence the 'influence without authority' challenge."
            },
            {
              question: "Which of the following best describes the difference between a Product Manager and a Project Manager?",
              options: [
                "Product Managers focus on technical implementation; Project Managers focus on user needs",
                "Product Managers decide what to build and why; Project Managers ensure it gets delivered on time",
                "Product Managers work at startups; Project Managers work at enterprises",
                "There is no real difference, the titles are used interchangeably"
              ],
              correct: 1,
              explanation: "A PM sets product direction (what and why). A Project Manager (PjM) manages timelines, resources, and delivery (when and how it gets done). In many companies both roles exist; in startups, one person often does both."
            },
            {
              question: "A PM at a food delivery app notices that 40% of users abandon the app after placing their first order. What should be their FIRST step?",
              options: [
                "Immediately redesign the post-order experience to add more features",
                "Ask engineers to optimize the app's loading speed",
                "Investigate why users are dropping off, through data analysis and user research",
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
                "Escalate to the VP of Product to resolve the disagreement",
                "Share the user data and business reasoning behind the decision, and listen to their concerns"
              ],
              correct: 3,
              explanation: "PMs lead through transparency and reasoning, not authority. Sharing your logic, user data, business goals, invites genuine debate and often surfaces better ideas. Overriding or ignoring silences talented teammates and erodes trust."
            },
            {
              question: "Instagram's PM decided to add Stories to the main Instagram app rather than building a separate app. What PM skill does this best illustrate?",
              options: [
                "Strategic product judgment, deciding what to build and where to build it",
                "Technical architecture planning",
                "Project management, coordinating a cross-functional team",
                "User interface design"
              ],
              correct: 0,
              explanation: "The decision to add Stories to Instagram (not a new app) was a strategic product call: leverage existing distribution, user habit, and trust rather than starting from zero. That's PM judgment, picking the right problem, right scope, right approach."
            }
          ],
          resources: [
            {
              title: "Exponent, PM Interview Prep (YouTube Channel)",
              url: "https://www.youtube.com/@tryexponent",
              description: "The best free PM content on YouTube, role breakdowns, mock interviews, and framework walkthroughs. Browse the channel for intro videos."
            },
            {
              title: "Lenny Rachitsky: The Jobs of a Product Manager",
              url: "https://www.lennysnewsletter.com/p/jobs-of-product-manager",
              description: "A clear breakdown of the three core jobs every PM owns, directly from one of the most-read PM writers."
            },
            {
              title: "Ken Norton: How to Hire a Product Manager",
              url: "https://www.bringthedonuts.com/essays/productmanager.html",
              description: "A classic essay on what makes a strong PM."
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

              <p><strong>1. Acquisition</strong>, How are users finding you?</p>
              <ul>
                <li>Signups per day, cost per acquisition (CPA), traffic by channel</li>
                <li>Example: "300 new users signed up today, 60% from organic search"</li>
              </ul>

              <p><strong>2. Activation</strong>, Are new users getting value quickly?</p>
              <ul>
                <li>Onboarding completion rate, time-to-first-value</li>
                <li>Example: "Users who complete onboarding within 24 hours are 3x more likely to return"</li>
              </ul>

              <p><strong>3. Retention</strong>, Are users coming back?</p>
              <ul>
                <li>Day-7 retention, Monthly Active Users (MAU), churn rate</li>
                <li>Example: "We have 80% D1 retention but only 20% D30, something's wrong in weeks 2-4"</li>
              </ul>

              <p><strong>4. Revenue</strong>, Are you making money?</p>
              <ul>
                <li>Monthly Recurring Revenue (MRR), Average Revenue Per User (ARPU), conversion rate</li>
                <li>Example: "Our free-to-paid conversion rate is 3%, industry average is 5%"</li>
              </ul>

              <h3>Vanity Metrics vs. Actionable Metrics</h3>
              <p>A <strong>vanity metric</strong> looks good but doesn't drive decisions. Total app downloads is a vanity metric, it only goes up and doesn't tell you if users are getting value.</p>
              <p>An <strong>actionable metric</strong> connects to behavior and informs decisions. Daily Active Users (DAU) ÷ Monthly Active Users (MAU) = a "stickiness ratio" that tells you if users actually come back regularly.</p>

              <p><strong>Example:</strong></p>
              <ul>
                <li>Vanity: "We hit 1 million downloads!" ← says nothing about value</li>
                <li>Actionable: "Our 30-day retention is 15%, down from 22%, we're losing users in week 2" ← tells you exactly where to look</li>
              </ul>

              <h3>The Counter-Metric</h3>
              <p>Every metric needs a counter-metric, a guardrail to prevent gaming. If you optimize purely for "messages sent," users might spam each other. So you also track "message reply rate" (quality) and "report/block rate" (spam). Counter-metrics keep you honest.</p>

              <h3>Real Example: Duolingo</h3>
              <p>A useful way to think about Duolingo: opening the app is not learning. A metric like lessons completed per learner per week is closer to the value the user gets than raw DAU. Teams that make this distinction build different features, streaks, smarter lesson length, social accountability, all targeting meaningful engagement, not just opens.</p>
            `
          },
          quiz: [
            {
              question: "A mobile app celebrates reaching '10 million downloads.' Why might a PM push back on using this as a key success metric?",
              options: [
                "Downloads are too hard to track accurately",
                "Downloads only go up, they don't reveal whether users are getting value or returning",
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
                "Total revenue",
                "Time-to-first-value / Activation rate",
                "App store rating"
              ],
              correct: 2,
              explanation: "Activation rate measures whether new users complete a key action that signals they've found value, like posting their first photo, sending their first message, or completing onboarding. It's the bridge between acquisition and retention."
            },
            {
              question: "Your app's MAU is 500,000 and DAU is 50,000. What is the DAU/MAU ratio and what does it tell you?",
              options: [
                "10%, the average user opens the app about 3 days per month",
                "90%, most monthly users are also daily users",
                "50%, exactly half of users are active every day",
                "The ratio cannot be calculated without knowing weekly actives"
              ],
              correct: 0,
              explanation: "DAU/MAU = 50,000 / 500,000 = 10%. This 'stickiness ratio' means the average user opens the app about 3 days per month (10% × 30 days). Social apps that people open daily can have very high DAU/MAU. Many consumer apps would be happy above 20%. What counts as good depends on how often the user's need comes up. A low ratio suggests users have no reason to return daily."
            },
            {
              question: "A PM is optimizing for 'number of messages sent per user.' What counter-metric should they also watch?",
              options: [
                "Number of users who signed up this month",
                "Time spent in the app",
                "App store download count",
                "Message reply rate and spam/block rate"
              ],
              correct: 3,
              explanation: "If you only optimize for messages sent, users might spam or send low-quality messages to inflate the number. Counter-metrics like reply rate (quality signal) and block/report rate (spam signal) prevent gaming and keep you focused on genuine engagement."
            },
            {
              question: "A PM argues that tracking 'daily active users' is misleading because opening the app is not the same as getting value. They propose switching to 'sessions completed per week.' What PM principle does this illustrate?",
              options: [
                "Revenue should always be the primary metric",
                "Measuring the action that most directly connects to user value, not just presence",
                "Weekly metrics are always better than daily metrics",
                "Simplifying metrics to make them easier to communicate to stakeholders"
              ],
              correct: 1,
              explanation: "Opening an app does not equal getting value from it. A metric like 'sessions completed' is directly tied to the user outcome. Great PMs identify the metric most tightly linked to genuine value delivery, not just presence."
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
              description: "Andrew Chen breaks down the stickiness ratio that top consumer PMs live by, with examples from social and gaming products."
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
              <p>Frameworks are mental shortcuts, they help PMs structure ambiguous problems, communicate clearly, and avoid forgetting important angles. You don't use frameworks to sound smart; you use them to think more completely.</p>

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
              <p>Clayton Christensen's framework: users don't buy products, they "hire" products to do a job. People don't buy a quarter-inch drill; they hire it to make a quarter-inch hole.</p>
              <p>Example: People don't use Spotify to stream music; they hire Spotify to soundtrack their workout, manage their mood, or discover something new. These are different "jobs", and Spotify should build features for each one.</p>

              <h3>4. The CIRCLES Method (for PM interviews)</h3>
              <p>A structured way to answer "design a product for X" questions:</p>
              <ul>
                <li><strong>C</strong>omprehend the situation, clarify constraints and goals</li>
                <li><strong>I</strong>dentify the customer, who is the user?</li>
                <li><strong>R</strong>eport the customer's needs, what are they trying to do?</li>
                <li><strong>C</strong>ut through prioritization, which needs matter most?</li>
                <li><strong>L</strong>ist solutions, brainstorm features</li>
                <li><strong>E</strong>valuate tradeoffs, pros, cons, risks</li>
                <li><strong>S</strong>ummarize your recommendation</li>
              </ul>

              <h3>5. PRDs, Product Requirements Documents</h3>
              <p>A PRD is the source of truth for what you're building. A good PRD includes:</p>
              <ul>
                <li><strong>Problem statement:</strong> Why are we building this?</li>
                <li><strong>Goals and success metrics:</strong> How will we know it worked?</li>
                <li><strong>User stories / requirements:</strong> What exactly should it do?</li>
                <li><strong>Out of scope:</strong> What are we explicitly NOT building?</li>
                <li><strong>Open questions:</strong> What's still unknown?</li>
              </ul>
              <p>The "out of scope" section is often the most important, it prevents scope creep and forces honest conversations.</p>
            `
          },
          quiz: [
            {
              question: "A PM says: 'We should add in-app chat because our competitor has it.' What PM principle are they violating?",
              options: [
                "They're not using a formal framework like CIRCLES to evaluate the idea",
                "They're failing to write a proper PRD before proposing the feature",
                "They're prioritizing without a scoring model like RICE",
                "They're skipping the problem space, they haven't established that users actually need this"
              ],
              correct: 3,
              explanation: "Jumping to a solution (in-app chat) because a competitor has it skips the problem space entirely. The right question first is: 'Do our users have a communication need we're not meeting?' Competitor features are signals, not requirements."
            },
            {
              question: "Which user story is written correctly?",
              options: [
                "'As a late-night user, I want a dark mode, so that I can read without straining my eyes'",
                "'Build a dark mode for the app'",
                "'Users want dark mode because everyone else has it'",
                "'Dark mode should be added in the next sprint'"
              ],
              correct: 0,
              explanation: "A proper user story follows: 'As a [user], I want [action], so that [benefit].' It grounds the requirement in a real user context and a clear reason, which makes it much easier to decide what to build and how to measure success."
            },
            {
              question: "According to the Jobs-to-be-Done framework, why do people actually use Instagram?",
              options: [
                "To upload and store photos",
                "To view content from their favorite influencers",
                "To 'hire' the app for jobs like staying connected, getting validation, discovering trends, or building a personal brand",
                "To access a social media feed"
              ],
              correct: 2,
              explanation: "JTBD reframes user motivation: people hire Instagram for specific emotional or functional jobs, feeling connected, getting attention, being entertained. Each 'job' has different requirements and should influence different feature decisions."
            },
            {
              question: "In a PM interview, you're asked: 'Design a product for elderly users to manage their medications.' What should you do FIRST?",
              options: [
                "List features: reminders, dosage tracking, doctor integration",
                "Clarify the goal, what does success look like? What constraints exist?",
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
                "The features listed are too broad, they need to be broken into tasks",
                "It hasn't been reviewed by engineering and design",
                "It's missing the problem statement, success metrics, and out-of-scope section"
              ],
              correct: 3,
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
              description: "A clear guide to the mental models PMs use to structure ambiguous problems, written for practitioners, not academics."
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
              <p>A North Star Metric (NSM) is the single number that best captures whether your product is delivering value to users. It's not your revenue number (that's a lagging indicator), it's the metric that, if it goes up, you're confident both users and the business are winning.</p>

              <h3>What Makes a Good North Star Metric?</h3>
              <p>A strong NSM has three properties:</p>
              <ul>
                <li><strong>It reflects user value</strong>, it measures whether users are actually getting something out of your product</li>
                <li><strong>It predicts long-term revenue</strong>, if this number grows, revenue will follow</li>
                <li><strong>It can be influenced by your team</strong>, your features and decisions can move it</li>
              </ul>

              <h3>Famous North Star Metrics</h3>
              <p><strong>Airbnb:</strong> Nights booked, captures both host and guest value in one number</p>
              <p><strong>Spotify:</strong> Time spent listening, the more you listen, the more value you're getting</p>
              <p><strong>Slack:</strong> Messages sent by org per day, signals active team collaboration</p>
              <p><strong>Facebook:</strong> Daily Active Users, measures whether users are returning (debated, but widely cited)</p>
              <p><strong>Duolingo:</strong> Lessons completed per learner per week, closer to actual learning value than raw DAU</p>
              <p><strong>Uber:</strong> Trips per day, captures both rider and driver value simultaneously</p>

              <h3>NSM vs. Input Metrics</h3>
              <p>The NSM lives at the top. Below it are "input metrics", the levers your team can actually pull. If your NSM is "nights booked," your inputs might be: search-to-booking conversion rate, listing quality score, and pricing competitiveness. Input metrics are what teams optimize daily; the NSM is what you track monthly to see if everything is working.</p>

              <h3>AARRR (Pirate Metrics)</h3>
              <p>AARRR maps the user lifecycle as a funnel. Use it to find which stage is leaking, then pick input metrics for that stage.</p>
              <ul>
                <li><strong>A</strong>cquisition, how users find you</li>
                <li><strong>A</strong>ctivation, first experience of value</li>
                <li><strong>R</strong>etention, do they come back?</li>
                <li><strong>R</strong>eferral, do they tell others?</li>
                <li><strong>R</strong>evenue, do you make money?</li>
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
                "Revenue metrics should be tracked weekly, not monthly",
                "It's a lagging business outcome, it doesn't directly measure whether users are getting value",
                "It combines too many product lines into a single number"
              ],
              correct: 2,
              explanation: "Revenue is a consequence of user value, not the value itself. A company can grow revenue short-term through pricing changes or discounts while its product actually gets worse. NSMs should measure user value that predicts long-term revenue health."
            },
            {
              question: "Slack's North Star Metric is 'messages sent per active organization per day.' Why is this a strong NSM?",
              options: [
                "It measures actual team collaboration behavior, which directly reflects Slack's core value proposition",
                "It's easy to manipulate and shows growth quickly",
                "It's the metric investors care about most during fundraising",
                "It's aligned with how email metrics are tracked, making it easier to benchmark"
              ],
              correct: 0,
              explanation: "Slack's value is team communication. If teams are sending messages daily, they're actively collaborating, that's genuine product value. This metric also predicts retention (active teams keep paying) and is directly influenced by product improvements."
            },
            {
              question: "A PM at a recipe app has two candidate NSMs: (A) 'recipes viewed per week' and (B) 'recipes cooked per week.' Which is better and why?",
              options: [
                "'Recipes viewed' is better — it's easier to track and includes more user touchpoints",
                "'Recipes viewed' is better — viewing more recipes signals stronger intent to cook",
                "Both are equally valid as co-North Star metrics",
                "'Recipes cooked' is better — it measures actual value delivery (cooking a meal), not just browsing"
              ],
              correct: 3,
              explanation: "'Recipes cooked' is the actual value the app delivers, helping people cook meals. 'Recipes viewed' is a proxy that could include aimless browsing. NSMs should measure value delivered, not just activity. The gap between viewed and cooked would also reveal activation problems."
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
              explanation: "Activation is about the 'aha moment', when a new user first experiences why your product is valuable. For Dropbox, it's when you sync your first file across devices. For Twitter, it was following 30 people in your first week. Poor activation is why many apps have great downloads but poor retention."
            },
            {
              question: "What is the relationship between a North Star Metric and input metrics?",
              options: [
                "They are the same thing, input metrics is just another term for NSM",
                "Input metrics measure user acquisition; the NSM measures long-term retention",
                "The NSM is the top-level outcome; input metrics are the specific levers teams optimize to move it",
                "Input metrics are only used during growth phases; NSMs are used during maturity"
              ],
              correct: 2,
              explanation: "The NSM is the company-wide measure of value. Input metrics are the specific, actionable levers below it, like search conversion rate, onboarding completion, or feature adoption, that teams work on daily. Moving the inputs should move the NSM."
            }
          ],
          resources: [
            {
              title: "Amplitude North Star Playbook",
              url: "https://amplitude.com/north-star",
              description: "The definitive free guide to North Star Metrics, with worksheets and real company examples."
            },
            {
              title: "Brian Balfour: North Star Metric",
              url: "https://brianbalfour.com/essays/north-star-metric",
              description: "Brian Balfour's deep dive into how to find the right metric for your company."
            },
            {
              title: "Amplitude: Every Product Needs a North Star Metric",
              url: "https://amplitude.com/blog/product-north-star-metric",
              description: "Amplitude's blog post on how to define your North Star Metric, free, practical, with real company examples."
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
              <p><strong>Step 4: Run the experiment.</strong> Split traffic randomly. Don't peek at results early, it inflates false positives.</p>
              <p><strong>Step 5: Analyze results.</strong> Is the difference statistically significant? Is the effect size meaningful?</p>

              <h3>Statistical Significance</h3>
              <p>When a result is "statistically significant at 95%," it means: if there were really no difference between A and B, we'd only see a result this extreme 5% of the time by chance. A p-value < 0.05 is the common threshold.</p>
              <p><strong>Critical: significance ≠ importance.</strong> A 0.01% improvement can be statistically significant with a billion users but meaningless in practice. Always check effect size, not just significance.</p>

              <h3>Common A/B Testing Mistakes</h3>
              <p><strong>Mistake 1: Stopping early.</strong> If you stop an experiment as soon as it looks significant, you're "peeking", this inflates your false positive rate. Let the test run for the planned duration.</p>
              <p><strong>Mistake 2: Testing too many things at once.</strong> If you change the headline, button color, AND image simultaneously, you can't tell which change drove the result.</p>
              <p><strong>Mistake 3: Novelty effects.</strong> Sometimes a new experience gets engagement just because it's new. A/B tests need to run long enough for novelty to wear off.</p>
              <p><strong>Mistake 4: Not considering secondary metrics.</strong> Your CTA might get more clicks, but if users who clicked convert at half the rate, you've lost ground overall.</p>

              <h3>When NOT to A/B Test</h3>
              <p>A/B testing requires traffic volume and time. Small products often cannot run reliable A/B tests. The sample you need depends on your baseline conversion and the size of change you want to detect. Use the <a href="https://www.evanmiller.org/ab-testing/sample-size.html" target="_blank" rel="noopener">Evan Miller sample size calculator</a> before you plan a test. Also, qualitative changes (a redesign, a new product direction) shouldn't be A/B tested first, use user research and judgment, then validate with metrics post-launch.</p>
            `
          },
          quiz: [
            {
              question: "Your team runs an A/B test on a new checkout flow. After 3 days, the variant is showing +8% conversion. Should you ship it?",
              options: [
                "Yes, an 8% improvement is significant and you should move fast",
                "No, you should wait for statistical significance and the pre-determined sample size before concluding",
                "Yes, 3 days is enough time to account for weekly user behavior patterns",
                "No, any change to checkout requires a minimum 30-day test by industry standard"
              ],
              correct: 1,
              explanation: "Stopping early ('peeking') is one of the most common A/B testing mistakes. Results after 3 days may not be statistically significant, and early positive signals often regress. Always run tests for the pre-determined duration and required sample size."
            },
            {
              question: "What does a p-value of 0.03 mean in an A/B test?",
              options: [
                "There is a 3% chance the variant is better than the control",
                "The test has 3% more statistical power than needed",
                "The variant improved the metric by 3%",
                "There is a 3% chance of seeing this result (or more extreme) if there were actually no difference"
              ],
              correct: 3,
              explanation: "A p-value of 0.03 means: if the null hypothesis (no real difference) were true, you'd only observe a difference this large by random chance 3% of the time. At a 0.05 threshold, this is statistically significant, but remember, significance doesn't equal practical importance."
            },
            {
              question: "You change the button text, color, AND position all at once in an A/B test, and the variant wins. What's the problem?",
              options: [
                "You can't determine which specific change caused the improvement, it could be any of the three",
                "You violated statistical independence by changing three variables",
                "The test will be considered invalid by most analysis tools",
                "There is no problem, the variant won, so ship it"
              ],
              correct: 0,
              explanation: "Changing multiple variables at once is a multivariate test, not a clean A/B test. You can't isolate which variable drove the result. If you want to learn what works (not just win this one test), change one variable at a time."
            },
            {
              question: "A new feature gets +40% engagement in its first week, then drops back to baseline in week 3. This is most likely:",
              options: [
                "A successful test, the feature worked and then users normalized",
                "Statistical noise, the initial result was a false positive",
                "A novelty effect, users engaged with something new, but it didn't provide lasting value",
                "A sign the feature needs more users to achieve significance"
              ],
              correct: 2,
              explanation: "The novelty effect is real: users engage with new things just because they're new, not because they're valuable. This is why A/B tests should run long enough for novelty to wear off, typically 2-4 weeks for most consumer products."
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
              explanation: "Statistical power requires sufficient sample size. With 500 monthly users, detecting a meaningful change in conversion rate (say 5%) would require many months of testing, far too slow to be practical. Small-volume products should use qualitative methods (user interviews, surveys) rather than A/B tests."
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
              description: "The definitive book on A/B testing by Microsoft's former experimentation head, the industry bible."
            },
            {
              title: "Netflix: Experimentation at Scale",
              url: "https://netflixtechblog.com/its-all-a-bout-testing-the-netflix-experimentation-platform-4e1ca458c15b",
              description: "Netflix's engineering blog on how they run thousands of A/B tests simultaneously, great for understanding scale."
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
              <p>Prioritization is arguably the hardest PM skill. Every team has more ideas than time, and every stakeholder is convinced their request is the most important. Frameworks give you a defensible, structured way to make decisions, and to explain them.</p>

              <h3>1. RICE Scoring</h3>
              <p>RICE is a quantitative framework developed at Intercom. Score each feature on four dimensions:</p>
              <ul>
                <li><strong>R</strong>each, how many users will this affect per period? (e.g., 2,000 users/month)</li>
                <li><strong>I</strong>mpact, how much will it improve each user's experience? (0.25 = minimal, 0.5 = low, 1 = medium, 2 = high, 3 = massive)</li>
                <li><strong>C</strong>onfidence, how sure are you? (80% = medium, 100% = high, 50% = low)</li>
                <li><strong>E</strong>ffort, how many person-months will it take?</li>
              </ul>
              <p><strong>RICE Score = (Reach × Impact × Confidence) / Effort</strong></p>
              <p>Example: A feature affecting 5,000 users/month, medium impact (1), 80% confidence, taking 2 months: RICE = (5,000 × 1 × 0.8) / 2 = 2,000</p>

              <h3>2. HEART Framework (Google)</h3>
              <p>HEART is a qualitative framework for evaluating UX quality, good for understanding the "why" behind prioritization:</p>
              <ul>
                <li><strong>H</strong>appiness, user satisfaction, NPS</li>
                <li><strong>E</strong>ngagement, depth of interaction</li>
                <li><strong>A</strong>doption, new users using the feature</li>
                <li><strong>R</strong>etention, users returning over time</li>
                <li><strong>T</strong>ask Success, users completing key actions</li>
              </ul>
              <p>HEART is most useful when defining what to measure, not just what to build.</p>

              <h3>3. MoSCoW Method</h3>
              <p>A simple framework for sprint or release planning:</p>
              <ul>
                <li><strong>M</strong>ust Have, essential for launch</li>
                <li><strong>S</strong>hould Have, important but not critical</li>
                <li><strong>C</strong>ould Have, nice-to-have if time allows</li>
                <li><strong>W</strong>on't Have (this time), explicitly deferred</li>
              </ul>
              <p>The most important category is "Won't Have", it forces explicit decisions about what you're NOT doing, which prevents scope creep.</p>

              <h3>4. The 2×2 Impact/Effort Matrix</h3>
              <p>Plot features on a 2×2 grid: high/low impact on Y-axis, high/low effort on X-axis.</p>
              <ul>
                <li><strong>High impact, low effort</strong> → Quick wins, do these first</li>
                <li><strong>High impact, high effort</strong> → Big bets, plan these carefully</li>
                <li><strong>Low impact, low effort</strong> → Fill-ins, do when nothing else is urgent</li>
                <li><strong>Low impact, high effort</strong> → Avoid, rarely worth it</li>
              </ul>

              <h3>When to Use What</h3>
              <p>Use <strong>RICE</strong> when you have quantitative data and need to justify ranking to stakeholders. Use <strong>MoSCoW</strong> for sprint planning and release scoping. Use <strong>HEART</strong> when defining success metrics for a feature. Use <strong>2×2</strong> for quick team alignment during brainstorms.</p>
            `
          },
          quiz: [
            {
              question: "Feature A has: Reach=1,000/month, Impact=2, Confidence=80%, Effort=1 month. Feature B has: Reach=500/month, Impact=3, Confidence=100%, Effort=2 months. Which has a higher RICE score?",
              options: [
                "Feature A: RICE = 1,600; Feature B: RICE = 750. Feature A wins",
                "Feature B wins — higher impact (3) and full confidence outweigh Feature A's larger reach",
                "Feature B: RICE = 1,500; Feature A: RICE = 1,600. Feature A wins by a slim margin",
                "Both are equal when rounded to the nearest hundred"
              ],
              correct: 0,
              explanation: "Feature A: (1,000 × 2 × 0.8) / 1 = 1,600. Feature B: (500 × 3 × 1.0) / 2 = 750. Feature A wins despite lower individual impact because it reaches more people and requires less effort. RICE is about expected value per unit of investment."
            },
            {
              question: "A stakeholder insists that a niche feature should be 'Must Have' in MoSCoW because it's important to one key client. What should a PM do?",
              options: [
                "Agree, customer requests should always be Must Have",
                "Accept it as Must Have but add extra time to the sprint",
                "Push back by asking whether this is truly essential for the product to function or for broader user value",
                "Escalate to the CEO to decide"
              ],
              correct: 2,
              explanation: "'Must Have' should mean 'the product cannot launch or function without this', not 'this is important to someone.' A niche request from one client is typically a Should Have or Could Have. MoSCoW only works if Must Haves are kept to a genuine minimum."
            },
            {
              question: "A team uses a 2×2 Impact/Effort matrix and identifies a 'low impact, low effort' feature. What should they do?",
              options: [
                "Build it immediately, low effort means low risk",
                "Discard it entirely, low impact work should never be done",
                "Move it to 'Must Have' since it won't take long",
                "Make it a stretch goal, do it if bandwidth allows, but don't prioritize it"
              ],
              correct: 3,
              explanation: "Low impact, low effort features are 'fill-ins', fine to build when there's truly nothing more important, but they shouldn't displace high-impact work. They're not worth zero, but they shouldn't be prioritized over quick wins or big bets."
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
                "The efficiency, effectiveness, and error rate of users completing key tasks",
                "Whether users complete onboarding within 24 hours",
                "How many tasks are completed per session",
                "Whether users successfully refer friends after completing a task"
              ],
              correct: 0,
              explanation: "Task Success measures usability: can users actually complete the tasks your product is designed for? Metrics include completion rate, time-on-task, and error rate. A task that most users fail or struggle with signals a UX problem regardless of other HEART dimensions."
            }
          ],
          resources: [
            {
              title: "Intercom: Introducing RICE Scoring",
              url: "https://www.intercom.com/blog/rice-simple-prioritization-for-product-managers/",
              description: "The original RICE framework post from Intercom's product team, clear and practical."
            },
            {
              title: "Google HEART Framework",
              url: "https://research.google/pubs/pub36299/",
              description: "Google's research paper introducing HEART, the standard for UX quality measurement."
            },
            {
              title: "Reforge: Prioritization in Practice",
              url: "https://www.reforge.com/blog/prioritization-frameworks",
              description: "Reforge's analysis of when to use different prioritization frameworks, with real startup examples."
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
          category: "Media & Entertainment",
          scenario: {
            title: "Spotify Discover Weekly Engagement Drops 15%",
            context: `Spotify's Discover Weekly playlist, a personalized weekly playlist delivered every Monday, has seen a 15% drop in "full listen-through rate" (users listening to at least 80% of the playlist) over the past 8 weeks. Your team owns Discover Weekly. The head of product asks you to diagnose what's happening and propose next steps.`,
            prompt: `In your answer, address the following:
1. What are the possible root causes of this drop? (Structure your investigation across user, product, and external factors)
2. What data would you pull to narrow down the cause?
3. What's your initial hypothesis, and what experiment would you run to test it?
4. If confirmed, what specific features or changes would you propose?
5. How would you measure whether your proposed solution worked, and what guardrail metrics would you monitor?`,
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
                strong: "Identifies a specific, testable hypothesis (e.g., 'Algorithm quality degraded after a model update, tracks are less personalized, causing users to skip more and abandon'). Mentions seasonal listening patterns as a confounder to rule out.",
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
              <p><strong>Product-side changes:</strong> Did we ship any algorithm updates, model retrains, or data pipeline changes in the past 8 weeks? Even small changes to Discover Weekly's ranking model can meaningfully shift track quality. Also, did the playlist length change?</p>
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
              <p>My hypothesis: <em>A model update 8–9 weeks ago reduced personalization quality, causing the first 1-3 tracks to feel mismatched to recent listening behavior, leading to early abandonment.</em></p>
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
          category: "Work & Productivity",
          scenario: {
            title: "Design a Feature for LinkedIn to Help Job Seekers",
            context: `LinkedIn has 900M+ members. The vast majority of LinkedIn's revenue comes from recruiters (LinkedIn Recruiter tool), not from job seekers. Yet job seekers are what make the platform valuable to recruiters. Assume your data shows that job seekers who are actively searching "go dark", they stop engaging with LinkedIn content, about 3 weeks into their search. LinkedIn leadership wants to improve this.`,
            prompt: `In your answer, address the following:
1. What is the core problem you're solving, and for whom?
2. What are 3 distinct feature ideas that could help? For each, explain the user value and any risks.
3. Which one would you prioritize and why?
4. How would you measure success, and what's your MVP?`,
            rubric: [
              {
                dimension: "Problem Framing",
                strong: "Identifies the double-sided marketplace dynamic: LinkedIn needs engaged job seekers to serve recruiters. Going dark is bad for both. Frames the problem as 'job seekers disengage because job searching is isolating, opaque, and discouraging, they need progress signals and a supportive community.'",
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
              <p>The core problem: <em>Active job seekers disengage from LinkedIn 3 weeks into their search because the process feels isolating, opaque, and discouraging, applications go into a void, rejections are silent, and there's no visible progress.</em></p>
              <p>This matters for LinkedIn because job seekers are the "supply" that makes LinkedIn Recruiter valuable. If seekers disengage, they update profiles less, are less discoverable, and the network becomes less valuable. It's a structural threat to LinkedIn's business model.</p>

              <h3>2. Three Feature Ideas</h3>
              <p><strong>Feature 1: Job Search Dashboard (private)</strong></p>
              <p>A private dashboard showing the job seeker's application pipeline, status of each application, how many profile views they received, and where they stand in any active processes. <em>User value:</em> eliminates the "void" feeling by creating visibility. <em>Risk:</em> LinkedIn currently doesn't have application status data for most jobs (only for Easy Apply jobs). Limited data coverage could make the dashboard feel incomplete.</p>

              <p><strong>Feature 2: Anonymous Job Seeker Community</strong></p>
              <p>A separate, anonymous feed (like Blind or Reddit) for active job seekers to share experiences, ask questions, and get peer support, without it affecting their professional reputation. <em>User value:</em> combat the isolation and stigma of job searching. <em>Risk:</em> anonymous content is harder to moderate; could attract negativity or become a competitor complaint board. Also, building community is hard and slow.</p>

              <p><strong>Feature 3: AI Application Coach</strong></p>
              <p>After applying to a job, an AI tool analyzes your resume and cover letter against the job description and provides a readiness score + specific suggestions. <em>User value:</em> turns rejections into learning; gives seekers a sense of control. <em>Risk:</em> raises false expectations; if the AI is wrong, it damages trust in LinkedIn's advice.</p>

              <h3>3. Prioritization</h3>
              <p>I'd prioritize <strong>Feature 3: AI Application Coach</strong> because:</p>
              <ul>
                <li><strong>Feasibility:</strong> LinkedIn has all the data needed, job descriptions and member profiles. This is a natural extension of existing systems.</li>
                <li><strong>Differentiation:</strong> No other job platform provides post-application feedback. It's a genuine insight advantage.</li>
                <li><strong>Engagement:</strong> It gives seekers a reason to return after applying, the exact behavior we want to change.</li>
                <li><strong>Revenue alignment:</strong> Better-prepared candidates = higher acceptance rates = more successful recruiter placements = happy recruiters.</li>
              </ul>

              <h3>4. MVP and Success Metrics</h3>
              <p><strong>MVP:</strong> A post-application prompt (only for Easy Apply jobs) that shows a resume-job description match score and 3 specific suggestions to improve future applications. No AI coaching session, no real-time feedback, just a match score and suggestions after submission.</p>
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
          id: "case-study-chess",
          title: "Case Study: Chess.com Puzzle Drop",
          duration: "15–20 min",
          isCaseStudy: true,
          category: "Gaming",
          scenario: {
            title: "Chess.com, Daily Puzzle Completions Drop 20%",
            context: `Chess.com's Daily Puzzle is one of the platform's highest DAU drivers. Over the past 30 days, puzzle completion rates have dropped 20%. You are the PM for the Daily Puzzle feature. The head of product asks you to diagnose what's happening and propose next steps.`,
            prompt: `In your answer, address the following:
1. What clarifying questions would you ask before investigating?
2. What are your top hypotheses for the drop? Rank them by likelihood.
3. What data would you pull to validate or rule out each hypothesis?
4. Based on your most likely hypothesis, what fix would you propose?
5. How would you define success?`,
            rubric: [
              {
                dimension: "Clarify Before Diagnosing",
                strong: "Asks whether the 20% is a drop in completions per user, total users attempting, or both. Asks if anything changed in the product recently, UI update, difficulty algo, notification cadence. Asks if the drop is platform-specific (mobile vs web) or global.",
                weak: "Jumps straight into hypotheses without clarifying the scope or definition of the metric."
              },
              {
                dimension: "Hypothesis Quality",
                strong: "Generates multiple distinct hypotheses, difficulty spike, notification change, competing feature launch, seasonal effects (school exams, tournament season), technical bug, and ranks them by likelihood with reasoning.",
                weak: "Proposes one hypothesis or lists generic causes without ranking or reasoning."
              },
              {
                dimension: "Data-Driven Investigation",
                strong: "Names specific data cuts: completion rate by user segment (new vs returning, free vs paid), skip/abandon rate by puzzle step, correlation with product changelog, platform breakdown, and seasonal comparison (same period last year).",
                weak: "Says 'look at analytics' without specifying what to look for or how to segment."
              },
              {
                dimension: "Solution Tied to Root Cause",
                strong: "Proposes a fix that directly follows from the top hypothesis, e.g., if difficulty spiked: recalibrate the difficulty algo; if notifications dropped: A/B test re-engagement push; if seasonal: monitor and accept. Does not propose a generic fix.",
                weak: "Proposes a fix (e.g., 'send more notifications') without first establishing what caused the drop."
              },
              {
                dimension: "Success Definition",
                strong: "Defines success as puzzle completion rate returning to the 30-day pre-drop baseline, with a specific timeframe and a leading indicator (e.g., daily attempt rate stabilising first).",
                weak: "Vague success definition like 'completions go back up' with no baseline or timeframe."
              }
            ],
            modelAnswer: `
              <h3>1. Clarifying Questions</h3>
              <p>Before investigating, I'd ask:</p>
              <ul>
                <li><strong>Metric definition:</strong> Is the 20% drop in completion rate per user, total completions, or unique users attempting? These point to different problems.</li>
                <li><strong>Recency:</strong> Did anything change in the product 30 days ago, algo update, UI change, notification cadence, difficulty tuning?</li>
                <li><strong>Platform:</strong> Is the drop on mobile, web, or both?</li>
                <li><strong>Geography:</strong> Is it global or concentrated in specific regions?</li>
              </ul>

              <h3>2. Hypotheses, Ranked by Likelihood</h3>
              <ol>
                <li><strong>Difficulty spike</strong>, If the puzzle difficulty algorithm was updated, puzzles may be too hard for average users, causing abandonment. Most likely given the 30-day timeframe aligns with typical algo update cycles.</li>
                <li><strong>Notification change</strong>, If push notification delivery dropped (OS permission change, frequency cap), fewer users are being reminded to open the puzzle.</li>
                <li><strong>Competing feature</strong>, A new feature (e.g., a new game mode or live event) may be drawing attention away from Daily Puzzle.</li>
                <li><strong>Seasonal</strong>, School exam periods or major chess tournament seasons can shift user behavior. Chess.com's audience includes active tournament players.</li>
                <li><strong>Technical bug</strong>, Puzzle failing to load, timer not working, or incorrect answer validation causing users to abandon.</li>
              </ol>

              <h3>3. Data to Pull</h3>
              <ul>
                <li><strong>Completion rate by user segment:</strong> New vs returning users, free vs premium. A drop only among new users means something different than a universal drop.</li>
                <li><strong>Puzzle difficulty rating vs completion rate over time:</strong> If difficulty went up and completion went down in lockstep, that's the cause.</li>
                <li><strong>Abandon point analysis:</strong> Where do users quit, immediately on opening the puzzle, or after making a few moves? Early quit = puzzle feels too hard or loads slowly. Late quit = different problem.</li>
                <li><strong>Notification delivery rate:</strong> Did the number of puzzle reminder notifications sent or opened change?</li>
                <li><strong>Product changelog:</strong> Anything shipped in the last 30–35 days that touched the puzzle feature or difficulty engine?</li>
                <li><strong>Seasonal baseline:</strong> Did completion rate drop at the same time last year? Rules out seasonal effects.</li>
              </ul>

              <h3>4. Proposed Fix (Top Hypothesis: Difficulty Spike)</h3>
              <p>Assuming the data shows difficulty increased and completion dropped in lockstep:</p>
              <ul>
                <li>Recalibrate the difficulty distribution, target median puzzle at a rating where ~65–70% of attempting users complete it (up from the current lower rate).</li>
                <li>Add a difficulty indicator label (Easy / Medium / Hard) so users self-select and don't feel blindsided by a hard puzzle on a Tuesday morning.</li>
                <li>A/B test a "Hint" option that doesn't affect the streak but helps users complete harder puzzles, preserves engagement without removing challenge.</li>
              </ul>

              <h3>5. Success Metrics</h3>
              <p><strong>Primary:</strong> Puzzle completion rate returns to 30-day pre-drop baseline within 2 weeks of fix.</p>
              <p><strong>Leading indicator:</strong> Daily puzzle attempt rate stabilises first (users opening the puzzle), then completion rate follows.</p>
              <p><strong>Guardrail:</strong> Average puzzle difficulty rating does not drop so far that power users find puzzles too easy (track completion rate among top-rated users separately).</p>
            `
          }
        },
        {
          id: "case-study-fotmob",
          title: "Case Study: FotMob Between-Game Retention",
          duration: "15–20 min",
          isCaseStudy: true,
          category: "Sports",
          scenario: {
            title: "FotMob, Designing for Fans Who Only Show Up on Matchday",
            context: `FotMob is a football scores and stats app used by millions of fans globally. Assume your data shows that a large segment of users, casual fans, only open the app on matchdays to check live scores. Between games, this segment's DAU drops to near zero. FotMob wants to increase engagement between matchdays without alienating their core power users (die-hard fans who already use the app daily). You are the PM for user engagement. Design a feature to bring casual fans back between matches.`,
            prompt: `In your answer, address the following:
1. What do you know about the casual fan, their motivation, context, and what they care about?
2. What are 3 distinct feature ideas to bring them back between matchdays? For each, describe the user value and the risk.
3. Which one would you prioritise and why?
4. What does your MVP look like?
5. How would you measure success?`,
            rubric: [
              {
                dimension: "User Understanding",
                strong: "Clearly distinguishes casual fans from power users. Casual fans are driven by match outcomes and their club, they don't want deep stats or tactical analysis. They want to feel connected to their team with minimal effort. Considers their context: busy, limited time, open the app out of habit on matchday.",
                weak: "Treats all FotMob users the same or proposes features better suited to power users (deep stats, tactical breakdowns)."
              },
              {
                dimension: "Feature Breadth & Insight",
                strong: "Three meaningfully different feature directions, e.g., (1) a personalised 'Your Club This Week' digest (news, training updates, injury reports), (2) a lightweight weekly prediction game ('Who wins this weekend's top match?'), (3) a social layer, see which of your friends also support the same club. Each solves a different angle of the between-game gap.",
                weak: "Features are too similar or repackage existing features. Pure notification ideas don't count as features."
              },
              {
                dimension: "Prioritisation Reasoning",
                strong: "Selects one feature with clear reasoning tied to: casual fan motivation, low implementation complexity, FotMob's existing data advantage (match/player data), and differentiation from competitors. Acknowledges the guardrail: don't bloat the app for power users.",
                weak: "Picks a feature without justifying it against the others or against the user's actual motivation."
              },
              {
                dimension: "MVP Scoping",
                strong: "Strips the chosen feature to its minimum testable version, e.g., a weekly push notification with 3 personalised club facts, before building a full in-app digest. Tests whether the hook works before investing in a full build.",
                weak: "MVP includes all features or is described as a full build rather than a minimal test."
              },
              {
                dimension: "Success Metrics",
                strong: "Primary metric: between-matchday DAU for the casual fan segment (not overall DAU, which would be dominated by power users). Secondary: D7 retention for casual users. Guardrail: power user engagement metrics must not decline.",
                weak: "Uses overall DAU or MAU as the success metric, misses that the intervention targets a specific segment."
              }
            ],
            modelAnswer: `
              <h3>1. Understanding the Casual Fan</h3>
              <p>The casual fan's job-to-be-done is simple: <em>"I want to feel connected to my club and know what's happening, without it taking effort."</em></p>
              <p>They open FotMob on matchday because the outcome matters to them. Between games, there's no urgency, so they don't open the app. The key insight: casual fans are motivated by their <strong>club</strong>, not by football broadly. A feature that surfaces Barcelona news won't work for a Manchester City fan. Personalisation by club is non-negotiable.</p>
              <p>Context: they're busy, often check scores during a commute or break. Any between-game feature must be fast, low-effort, and feel relevant, not like homework.</p>

              <h3>2. Three Feature Ideas</h3>
              <p><strong>Feature 1: "Your Club This Week" Digest</strong></p>
              <p>A weekly push notification + in-app card summarising the 3 most important things about your club: next match opponent and kickoff time, key injury updates, last result summary. <em>User value:</em> zero-effort way to stay informed. <em>Risk:</em> if the content feels generic or stale, users will disable notifications permanently.</p>

              <p><strong>Feature 2: Weekly Match Prediction Game</strong></p>
              <p>A simple, lightweight game: each week, pick the winners of 5 upcoming matches. Points for correct predictions, a simple league table with friends. <em>User value:</em> creates a reason to open the app mid-week (to check predictions) and builds anticipation for the weekend's matches. <em>Risk:</em> low-investment users may not bother setting up predictions consistently. Needs to feel effortless, one tap per match, not a full form.</p>

              <p><strong>Feature 3: Club Social Layer</strong></p>
              <p>Show how many of your contacts also follow your club. Let users share match reactions or a weekly club mood (a single emoji). Creates a sense of shared identity. <em>User value:</em> taps into tribal identity, being a fan is social. <em>Risk:</em> social features are notoriously hard to bootstrap; needs critical mass to feel alive. Also, FotMob has no existing social graph to build on.</p>

              <h3>3. Prioritisation</h3>
              <p>I'd prioritise <strong>Feature 1: "Your Club This Week" Digest</strong> because:</p>
              <ul>
                <li>FotMob already has all the data needed, match schedules, injury reports, results. No new data partnerships required.</li>
                <li>It directly matches the casual fan's motivation: stay informed about their club with zero effort.</li>
                <li>It's testable as a pure notification before any in-app build is needed.</li>
                <li>It doesn't add complexity to the app UI, power users never see it if they don't need it.</li>
              </ul>

              <h3>4. MVP</h3>
              <p>Before building an in-app digest, test whether the hook works via notification alone:</p>
              <ul>
                <li>Send a mid-week push to casual fan segment (users with fewer than 2 non-matchday opens per week): "Your [Club] update: [Next opponent] on [day], [key injury player] doubtful."</li>
                <li>Measure click-through rate and whether those users open the app again before matchday.</li>
                <li>If CTR and follow-on opens are strong, invest in an in-app digest card. If weak, the content or timing needs rethinking before building.</li>
              </ul>

              <h3>5. Success Metrics</h3>
              <p><strong>Primary:</strong> Between-matchday DAU for the casual fan segment, baseline near zero. As an illustrative hypothesis: if the feature works, you might expect 15 to 20% of casual fans to open the app at least once between matches within 4 weeks. The right target should be set once you know the baseline more precisely.</p>
              <p><strong>Secondary:</strong> D7 retention for casual users (do they keep coming back week over week?).</p>
              <p><strong>Guardrail:</strong> Power user engagement metrics (daily session depth, match-day opens) must not decline, the feature should be additive, not a distraction.</p>
            `
          }
        },
        {
          id: "case-study-cricbuzz",
          title: "Case Study: Cricbuzz Feature Prioritisation",
          duration: "15–20 min",
          isCaseStudy: true,
          category: "Sports",
          scenario: {
            title: "Cricbuzz, Three Features, One Engineering Team",
            context: `Cricbuzz is India's largest cricket scores and news platform, with 50M+ monthly active users. Three internal teams have each proposed a feature for the next quarter, but there's only engineering capacity to ship one. The three proposals are:
1. Live score widgets for smartwatches (Apple Watch + Wear OS)
2. Fantasy cricket integration, allow users to build and track fantasy teams within Cricbuzz
3. Vernacular language support, localise the app into 6 regional Indian languages (Hindi, Tamil, Telugu, Kannada, Bengali, Marathi)

You are the CPO. Which do you ship and why?`,
            prompt: `In your answer, address the following:
1. What framework or criteria would you use to evaluate these three options?
2. Walk through your evaluation of each feature against those criteria.
3. Which feature do you choose, and what is your reasoning?
4. What are the risks of your choice, and how would you mitigate them?
5. What does success look like?`,
            rubric: [
              {
                dimension: "Framework Clarity",
                strong: "Defines explicit criteria before evaluating, e.g., user impact (how many users benefit), strategic alignment (does it strengthen Cricbuzz's core job-to-be-done), revenue potential, implementation complexity, and competitive differentiation. Applies the same criteria to all three options.",
                weak: "Jumps to a conclusion without a structured evaluation. Picks a favourite and works backwards."
              },
              {
                dimension: "Feature Evaluation Depth",
                strong: "For smartwatch widgets: niche audience, high delight for a small segment, low strategic leverage. For fantasy: high engagement + monetisation potential but raises a 'does this dilute Cricbuzz's identity as a scores platform?' question; also high build complexity. For vernacular: massive underserved audience, aligns with India's next-billion-user opportunity, defensible moat, relatively lower complexity vs. fantasy.",
                weak: "Treats all three as equally plausible without real differentiation or acknowledges obvious winner without evaluating trade-offs."
              },
              {
                dimension: "Decision & Reasoning",
                strong: "Chooses vernacular (or makes a well-reasoned case for fantasy) with clear reasoning: largest addressable user segment, strategic moat (hard to copy once done well), aligns with how India actually consumes content. If choosing fantasy: strong revenue argument + engagement depth argument with a clear scope for an MVP that doesn't turn Cricbuzz into a full fantasy platform.",
                weak: "Chooses smartwatch widgets without a strong strategic argument, or picks fantasy without addressing the identity/complexity risks."
              },
              {
                dimension: "Risk Identification",
                strong: "Names specific risks for the chosen feature and mitigation for each. For vernacular: translation quality risk (mitigate with native speaker review + community feedback loop); content pipeline risk (sports news needs to be translated in near-real-time). For fantasy: scope creep risk (mitigate with a tight MVP, only track pre-existing fantasy leagues, don't build team selection logic).",
                weak: "Identifies generic risks ('it might not work') without specifics or mitigation."
              },
              {
                dimension: "Success Metrics",
                strong: "Defines success in terms of the specific user problem solved, for vernacular: new user activation rate in target language regions, D30 retention for vernacular users vs. English users, share of MAU from non-English sessions. For fantasy: daily fantasy interactions per active user, retention impact.",
                weak: "Uses a single vanity metric like 'downloads increase' without segment-specific or behaviour-specific measures."
              }
            ],
            modelAnswer: `
              <h3>1. Evaluation Framework</h3>
              <p>I'd evaluate each feature across five criteria:</p>
              <ul>
                <li><strong>User reach:</strong> How many existing and potential users does this benefit?</li>
                <li><strong>Strategic fit:</strong> Does this strengthen Cricbuzz's core value proposition (the go-to place for cricket)?</li>
                <li><strong>Revenue potential:</strong> Does this open or strengthen a monetisation path?</li>
                <li><strong>Defensibility:</strong> Does this create a moat that's hard for competitors to replicate?</li>
                <li><strong>Implementation complexity:</strong> What's the realistic cost and timeline?</li>
              </ul>

              <h3>2. Evaluation</h3>
              <p><strong>Smartwatch widgets:</strong> Smartwatch penetration in India is low and skews premium urban. High delight for a small segment, but limited reach and no strategic leverage. Low complexity. Low priority.</p>

              <p><strong>Fantasy cricket integration:</strong> High engagement potential, fantasy cricket (Dream11, MPL) is massive in India. Adding it within Cricbuzz could drive daily active usage, not just during matches. Revenue potential is real (commission, partnerships). However: high complexity, and it risks diluting Cricbuzz's identity as a neutral scores platform. Fantasy is inherently partisan, you root for individual players, not teams. Also requires a significant product investment to do well; a half-built fantasy feature is worse than none.</p>

              <p><strong>Vernacular language support:</strong> India has 22 scheduled languages. A huge proportion of cricket fans, particularly in Tier 2/3 cities and rural areas, consume content in regional languages but are currently underserved by Cricbuzz. This is the next-billion-user opportunity. High reach, strong strategic fit (cricket is India's shared language, regional languages make Cricbuzz India's cricket platform, not just urban India's). Once done well, translation infrastructure is a defensible moat. Complexity is real but scoped: UI localisation + content translation pipeline.</p>

              <h3>3. Decision: Vernacular Language Support</h3>
              <p>I'd ship vernacular language support because:</p>
              <ul>
                <li>Largest addressable audience, unlocks users who are currently excluded, not just improving experience for existing users.</li>
                <li>Strategic moat, competitors who haven't invested in regional language infrastructure can't copy this overnight.</li>
                <li>Aligns with India's consumption shift, WhatsApp and YouTube's growth in regional India is a clear signal that vernacular is the unlock for the next wave of internet users.</li>
                <li>Fantasy is appealing but carries identity risk and scope risk. I'd revisit it next quarter with a clearer MVP scope.</li>
              </ul>

              <h3>4. Risks and Mitigation</h3>
              <ul>
                <li><strong>Translation quality:</strong> Machine translation of cricket commentary and match updates can feel unnatural. Mitigation: hire native-speaking editors per language for QA; use community feedback (report a translation) to improve over time.</li>
                <li><strong>Real-time content pipeline:</strong> Live scores and match updates need near-real-time translation. Mitigation: prioritise structured data (scores, player names, match status) first, these are template-based and easier to translate accurately. Long-form news articles can lag by minutes.</li>
                <li><strong>Which 6 languages first:</strong> Hindi, Tamil, Telugu, Kannada, Bengali, Marathi covers the major bases, but prioritise by user base size and competitive gap. Hindi and Bengali first (largest reach), then South Indian languages.</li>
              </ul>

              <h3>5. Success Metrics</h3>
              <p><strong>Primary:</strong> % of MAU using a non-English language within 90 days of launch. As a hypothesis: if regional-language users are currently underserved, a 10 to 15% adoption rate among MAU within 90 days would be a reasonable early signal. The actual target should be anchored to the share of users in supported regions.</p>
              <p><strong>Secondary:</strong> D30 retention for vernacular users vs. English baseline, hypothesis: regional language users retain better because the product finally feels native to them.</p>
              <p><strong>Leading indicator:</strong> Language selection rate during onboarding for new installs in target regions.</p>
              <p><strong>Guardrail:</strong> English user experience metrics must not degrade, no regression in load time, scores accuracy, or existing feature reliability.</p>
            `
          }
        },
        {
          id: "case-study-flipkart",
          title: "Case Study: Flipkart Success Metrics",
          duration: "15-20 min",
          isCaseStudy: true,
          category: "E-commerce & Fashion",
          scenario: {
            title: "Flipkart: How Would You Define and Measure Success?",
            context: `Flipkart is India's largest e-commerce marketplace with over 400 million registered users. It operates as a two-sided marketplace, creating value for customers who buy products and sellers who list and fulfil orders. You have just joined as a senior PM. In your first week, the CPO asks you: "How would you define success for Flipkart, and what metrics would you track?"`,
            prompt: `In your answer, address the following:
1. Start with a clarifying question. Is this about Flipkart as a whole business or a specific product area?
2. Frame Flipkart's business model and who the key stakeholders are.
3. Define a North Star Metric and explain why you chose it.
4. List the supporting metrics across customer growth, seller health, revenue, and operations.
5. Map the buyer journey and identify key leading indicators at each stage.
6. Identify guardrail metrics you would monitor to avoid optimising the wrong thing.
7. Discuss at least two trade-offs you would consider when making product decisions.`,
            rubric: [
              {
                dimension: "Clarifying Question",
                strong: "Asks whether the question is about overall business success or a specific feature or initiative before diving in. This shows structured thinking and avoids answering the wrong question.",
                weak: "Jumps straight into metrics without establishing scope."
              },
              {
                dimension: "Business Model Framing",
                strong: "Identifies Flipkart as a two-sided marketplace with three stakeholders: customers (discover and buy products), sellers (access buyers and fulfilment infrastructure), and Flipkart (sustainable revenue and trust). States that success means all three grow together.",
                weak: "Treats Flipkart as a simple retail site without acknowledging the marketplace dynamics and seller side."
              },
              {
                dimension: "North Star Metric",
                strong: "Chooses Successful Orders Delivered and explains why: it captures value for all three stakeholders at once. A successful delivery means the customer found the right product, trusted the platform, the seller fulfilled it, and logistics worked. It is a leading indicator of revenue and a lagging indicator of platform health.",
                weak: "Chooses GMV or revenue as the North Star, which are business outcomes not user value metrics, or picks DAU which does not reflect whether Flipkart is actually delivering value."
              },
              {
                dimension: "Metric Coverage",
                strong: "Covers all five areas: customer growth (MAU, repeat purchase rate, retention), seller health (active sellers, seller retention, fulfilment success rate), revenue (GMV, contribution margin), operations (on-time delivery rate, product availability, COD success rate), and customer experience (CSAT, NPS).",
                weak: "Only covers customer-side metrics and ignores seller health or operational efficiency."
              },
              {
                dimension: "Buyer Funnel and Leading Metrics",
                strong: "Maps the buyer journey step by step (open app, search, listing page, product detail, add to cart, checkout, payment, delivery) and identifies a leading metric at each step: search success rate, listing to detail CTR, add-to-cart rate, checkout completion rate, payment success rate, delivery success rate.",
                weak: "Lists metrics without connecting them to the funnel or explaining why they are leading indicators."
              },
              {
                dimension: "Guardrail Metrics",
                strong: "Identifies at least three guardrail metrics that prevent optimising one thing at the cost of another: return rate and refund rate (customer trust), order cancellation rate and late delivery rate (delivery quality), payment failure rate (platform health).",
                weak: "Does not identify guardrails, or identifies only one without explaining what it guards against."
              },
              {
                dimension: "Trade-offs",
                strong: "Discusses real trade-offs: if GMV grows through aggressive discounting but contribution margin falls, prioritise profitability; if faster delivery increases damaged goods or return rates, prioritise quality over speed; if seller acquisition grows but catalog quality falls, prioritise high-quality sellers over volume.",
                weak: "States generic trade-offs without grounding them in Flipkart's specific business context."
              }
            ],
            modelAnswer: `
              <h3>1. Clarifying Question</h3>
              <p>Before I define success, I want to clarify: are we evaluating Flipkart as an overall business, or are we evaluating the success of a specific product area or initiative? This changes what metrics matter most.</p>
              <p>For this answer, I will assume we are evaluating overall business success.</p>

              <h3>2. Business Model and Stakeholders</h3>
              <p>Flipkart is a two-sided marketplace. It creates value for three groups:</p>
              <ul>
                <li><strong>Customers:</strong> discover and purchase products conveniently.</li>
                <li><strong>Sellers:</strong> access millions of buyers along with payment, logistics, and fulfilment infrastructure.</li>
                <li><strong>Flipkart:</strong> generates sustainable revenue while maintaining customer trust.</li>
              </ul>
              <p>I would define success only when all three stakeholders grow together. Optimising for one at the cost of another is not sustainable.</p>

              <h3>3. North Star Metric: Successful Orders Delivered</h3>
              <p>I would choose Successful Orders Delivered as the North Star because it reflects value delivered to all three stakeholders at once. A successful delivery means the customer found the right product and trusted Flipkart enough to buy, the seller fulfilled the order, and the logistics network delivered it on time. It predicts long-term revenue without being a revenue metric itself.</p>

              <h3>4. Supporting Metrics</h3>
              <p><strong>Customer Growth:</strong> Monthly Active Customers, Repeat Purchase Rate, Customer Retention Rate.</p>
              <p><strong>Seller Health:</strong> Monthly Active Sellers, Seller Retention Rate, Seller Fulfilment Success Rate.</p>
              <p><strong>Revenue:</strong> Gross Merchandise Value (GMV), Contribution Margin.</p>
              <p><strong>Operations:</strong> On-Time Delivery Rate, Product Availability Rate, Cash on Delivery Success Rate.</p>
              <p><strong>Customer Experience:</strong> CSAT, NPS.</p>

              <h3>5. Buyer Journey and Leading Metrics</h3>
              <p>Open App → Search → Product Listing Page → Product Detail Page → Add to Cart → Checkout → Payment → Order Confirmation → Delivery.</p>
              <p>Key leading metrics at each stage: Search Success Rate, Listing to Detail CTR, Add-to-Cart Rate, Checkout Completion Rate, Payment Success Rate, Delivery Success Rate. These tell me where customers are dropping off before the North Star Metric is impacted.</p>

              <h3>6. Guardrail Metrics</h3>
              <p><strong>Customer trust:</strong> Return Rate, Refund Rate, Wrong or Damaged Product Rate.</p>
              <p><strong>Delivery quality:</strong> Order Cancellation Rate, Late Delivery Rate.</p>
              <p><strong>Platform health:</strong> Payment Failure Rate, Customer Support Resolution Time.</p>
              <p>These ensure that improvements in one area do not silently damage the customer experience.</p>

              <h3>7. Trade-offs</h3>
              <ul>
                <li>If GMV grows through aggressive discounting but Contribution Margin falls significantly, prioritise sustainable profitability over short-term GMV.</li>
                <li>If faster delivery increases damaged goods or return rates, prioritise delivery quality before adding more speed.</li>
                <li>If seller acquisition grows rapidly but catalog quality falls, prioritise high-quality sellers over volume.</li>
              </ul>
              <p>The goal is not to maximise a single metric but to build a healthy marketplace where customers receive value, sellers grow successfully, and Flipkart achieves sustainable growth.</p>
            `
          }
        },
        {
          id: "case-study-swiggy",
          title: "Case Study: Swiggy Order Cancellations Spike",
          duration: "15-20 min",
          isCaseStudy: true,
          category: "Food Delivery",
          scenario: {
            title: "Swiggy: Order Cancellation Rate Spiked 25% in Two Weeks",
            context: `Swiggy is one of India's largest food delivery platforms, operating in 500+ cities. Last week, your data team flagged that the order cancellation rate has increased by 25% over the past two weeks, from 8% to 10%. This is now the highest it has been in 18 months. You are the PM for the consumer experience team. The Head of Product wants your analysis and a plan by end of week.`,
            prompt: `In your answer, address the following:
1. What clarifying questions would you ask before investigating?
2. What are your top hypotheses for the spike? Rank them by likelihood.
3. What data would you pull to validate or rule out each hypothesis?
4. How would you segment the data to narrow down the cause?
5. Based on your most likely hypothesis, what fix would you propose?
6. How would you define success after the fix?`,
            rubric: [
              {
                dimension: "Clarifying Questions",
                strong: "Asks: Is the cancellation happening before or after the restaurant accepts the order? Is it customer-initiated or system-initiated (auto-cancel)? Is it concentrated in specific cities, restaurant types, or times of day? Did anything change in the product or operations in the last two weeks?",
                weak: "Dives into hypotheses without establishing when in the order journey cancellations are happening or who is initiating them."
              },
              {
                dimension: "Hypothesis Quality",
                strong: "Generates hypotheses across multiple categories: product changes (new cancellation flow is too easy to trigger accidentally), restaurant supply issues (restaurants declining orders at higher rates, leading to auto-cancel), delivery partner shortage (estimated delivery time has increased, making customers cancel), payment issues (payment failures being logged as cancellations), or external factors (festival season, bad weather, competitor promotion driving comparison shopping).",
                weak: "Only generates one or two hypotheses or lists generic causes without thinking through the order journey."
              },
              {
                dimension: "Data Investigation",
                strong: "Specifies exactly what to pull: cancellation rate broken down by stage (pre-accept, post-accept, post-pickup), by city tier, by time of day, by restaurant category, by delivery time estimate. Also looks at the product changelog and ops logs for the same two-week window.",
                weak: "Says look at the data without specifying what cuts or breakdowns would reveal the root cause."
              },
              {
                dimension: "Segmentation Depth",
                strong: "Segments by: cancellation stage (customer before restaurant accepts vs. after), user cohort (new vs. returning customers), geography (metro vs. Tier 2), device (Android vs. iOS), order type (standard vs. scheduled), and restaurant type (cloud kitchen vs. dine-in restaurant). Each segment either confirms or rules out a hypothesis.",
                weak: "Looks at overall cancellation rate without breaking it down into segments that would isolate the cause."
              },
              {
                dimension: "Fix Quality",
                strong: "Fix is specific to the root cause. If delivery time spikes are the cause: work with ops to improve restaurant assignment algorithm or add transparency to ETA. If the cancellation UI changed: A/B test reverting the change. If restaurants are declining more: create an incentive for restaurants to maintain acceptance rate above a threshold.",
                weak: "Proposes a generic fix such as reducing cancellation rate without linking it to the specific root cause identified."
              },
              {
                dimension: "Success Definition",
                strong: "Cancellation rate returns to the 18-month baseline of 8% within a defined timeframe (e.g., 2 weeks post-fix). Leading indicator: pre-accept cancellation rate stabilises first. Guardrail: customer satisfaction score and restaurant NPS must not deteriorate.",
                weak: "Vague success definition like cancellations go down with no baseline, timeframe, or guardrail metric."
              }
            ],
            modelAnswer: `
              <h3>1. Clarifying Questions</h3>
              <ul>
                <li><strong>Where in the journey?</strong> Is the spike in cancellations before the restaurant accepts, after acceptance, or after pickup? Each stage points to a different cause.</li>
                <li><strong>Who is cancelling?</strong> Are these customer-initiated cancellations or system-initiated auto-cancels (e.g., restaurant not responding in time)?</li>
                <li><strong>Where is it concentrated?</strong> Specific cities, times of day, restaurant categories, or device types?</li>
                <li><strong>What changed?</strong> Any product releases, restaurant partner changes, or operational changes in the last two weeks?</li>
              </ul>

              <h3>2. Hypotheses, Ranked by Likelihood</h3>
              <ol>
                <li><strong>Delivery time estimates increased</strong> — if ETA went up (due to driver shortage or traffic), customers are more likely to cancel after seeing the wait time. Most common cause of cancellation spikes.</li>
                <li><strong>Restaurant acceptance rate dropped</strong> — if restaurants are declining more orders (due to high demand, staffing issues, or a policy change), auto-cancels increase.</li>
                <li><strong>UI change made cancellation easier</strong> — if a recent release changed the cancellation flow, users may be triggering it accidentally.</li>
                <li><strong>Payment failure being logged as cancellation</strong> — a technical bug where failed payments appear as cancellations in the data.</li>
                <li><strong>External factor</strong> — festival season or competitor discount driving comparison shopping and cancel-and-reorder behaviour.</li>
              </ol>

              <h3>3. Data to Pull</h3>
              <ul>
                <li>Cancellation rate broken down by stage: pre-accept, post-accept, post-pickup.</li>
                <li>Average delivery time estimate over the same two-week window vs. the prior period.</li>
                <li>Restaurant acceptance rate over the same window.</li>
                <li>Product changelog: any releases in the last two weeks that touched the order flow or cancellation UI.</li>
                <li>Payment failure rate: has it changed in the same window?</li>
              </ul>

              <h3>4. Segmentation</h3>
              <p>Break the 25% spike down by: city (metro vs. Tier 2), time of day (lunch vs. dinner peak), restaurant type (cloud kitchen vs. dine-in), user type (new vs. returning), and device (Android vs. iOS). If the spike is concentrated in one segment, the root cause is almost certainly specific to that segment.</p>

              <h3>5. Fix (Top Hypothesis: ETA Spike)</h3>
              <p>If data shows delivery time estimates increased and pre-accept cancellations are driving the spike:</p>
              <ul>
                <li>Work with the supply ops team to improve restaurant-to-driver assignment in high-demand periods to reduce ETA.</li>
                <li>Add a real-time ETA confidence indicator so customers know if the estimate is likely to improve once a driver is assigned.</li>
                <li>A/B test showing customers a range (30-40 min) rather than a single number. One hypothesis worth testing: showing a range instead of a single ETA sets better expectations. I would A/B test it.</li>
              </ul>

              <h3>6. Success Definition</h3>
              <p><strong>Primary:</strong> Cancellation rate returns to 8% (18-month baseline) within two weeks of fix deployment.</p>
              <p><strong>Leading indicator:</strong> Pre-accept cancellation rate stabilises within 3 days of fix.</p>
              <p><strong>Guardrail:</strong> Customer CSAT and restaurant NPS must not deteriorate. Average order value must not fall (indicating customers are not downgrading to cheaper, faster options).</p>
            `
          }
        },
        {
          id: "case-study-notion",
          title: "Case Study: Notion Onboarding Drop-off",
          duration: "15-20 min",
          isCaseStudy: true,
          category: "Work & Productivity",
          scenario: {
            title: "Notion: New Users Are Not Returning After Day 1",
            context: `Notion is an all-in-one workspace tool used by individuals and teams for notes, wikis, project management, and databases. Despite strong top-of-funnel growth (driven by word of mouth and social media), the data team has flagged that D7 retention for new users is at 18%, significantly below the industry benchmark of 35% for productivity tools. Users sign up, spend time exploring Notion on Day 0, but most do not return by Day 7. You are the PM for the new user experience. Design a solution.`,
            prompt: `In your answer, address the following:
1. What do you think is the core user problem driving the drop-off?
2. How would you validate your hypothesis before building anything?
3. What are three distinct feature or experience changes you would consider to improve D7 retention?
4. Which one would you prioritise and why?
5. What does your MVP look like and how would you measure success?`,
            rubric: [
              {
                dimension: "Problem Diagnosis",
                strong: "Identifies the core issue: Notion is a blank canvas. It is infinitely powerful but that power creates paralysis. New users do not know what to build first, spend time exploring rather than completing a meaningful task, and leave without experiencing a moment of value. The insight is that the problem is not feature-related but activation-related: users need to reach their first aha moment faster.",
                weak: "Identifies the problem as Notion being too complex without digging into why that leads to drop-off, or assumes users need more features rather than a better path to existing ones."
              },
              {
                dimension: "Validation Approach",
                strong: "Before building, talks to churned users (why did you stop using Notion after Day 1?), looks at session recordings for new users on Day 0 (where do they spend time, where do they drop off?), and analyses what actions the 18% who return actually complete on Day 0 that the 82% who churn do not. The goal is to find the activation event that predicts retention.",
                weak: "Proposes building immediately without validating the hypothesis, or proposes a survey alone without looking at behavioural data."
              },
              {
                dimension: "Solution Breadth",
                strong: "Three meaningfully different directions: (1) use-case based onboarding that asks users what they want to do and drops them into a pre-built template relevant to that goal; (2) a guided first task that walks new users through completing one meaningful action (e.g., moving a to-do list from another tool) before letting them explore freely; (3) a personal AI setup assistant that asks 3 questions and generates a starter workspace for the user.",
                weak: "Three solutions are too similar (all are variations of a tutorial or tooltip overlay) or are too complex (a full redesign of the editor) without scoping to what would actually move D7 retention."
              },
              {
                dimension: "Prioritisation",
                strong: "Prioritises the use-case based onboarding with templates because: templates solve the blank canvas problem immediately without requiring the user to learn Notion's system; templates are already a Notion strength (thousands exist); it is low implementation risk (existing infrastructure); and it directly creates the first moment of value, which is the most important factor for Day 1 retention.",
                weak: "Picks a solution without explaining why it addresses the root cause better than the alternatives, or picks the most technically complex option without justification."
              },
              {
                dimension: "MVP and Metrics",
                strong: "MVP: a 3-question onboarding flow (What do you want to use Notion for? Are you using it for work, personal, or both? Have you used a tool like Notion before?) that routes users to one of five starter templates and prompts them to edit one thing in the template before they can freely explore. No AI, no complex personalisation. Just routing to a template and a guided first edit. Success metric: D7 retention for users who go through the new flow vs. control. Leading indicator: percentage of new users who make their first edit within 10 minutes of signing up.",
                weak: "MVP is too large (full redesign) or too small (just a tooltip), or success is defined as sign-up rate rather than retention."
              }
            ],
            modelAnswer: `
              <h3>1. Core User Problem</h3>
              <p>Notion is a blank canvas. That is its strength and its biggest onboarding problem. New users sign up because they heard Notion can do everything. They open the app and see... nothing. No structure, no starting point, no clear first task. The natural response is to explore, get overwhelmed, and leave before reaching any meaningful value.</p>
              <p>The core problem is not that Notion is too complex. It is that users cannot find their first moment of value quickly enough. The gap between "signing up" and "this is useful to me" is too wide.</p>

              <h3>2. Validation Before Building</h3>
              <ul>
                <li><strong>Talk to churned users:</strong> interview 10 people who signed up in the last 30 days and did not return. Ask: what did you do on Day 0? What were you hoping Notion would help you with? What made you stop?</li>
                <li><strong>Session recordings:</strong> watch new user sessions on Day 0. Where do they spend their time? Where do they abandon?</li>
                <li><strong>Activation event analysis:</strong> find the one action that the 18% who return on Day 7 complete on Day 0 that the 82% who churn do not. That action is the activation event to optimise for.</li>
              </ul>

              <h3>3. Three Feature Ideas</h3>
              <p><strong>Option 1: Use-case based onboarding with templates</strong></p>
              <p>Ask users 3 questions at signup (What do you want to use Notion for? Work or personal? Have you used a similar tool?). Route them to a relevant starter template. They start with a pre-built structure and customise it rather than starting from nothing.</p>

              <p><strong>Option 2: Guided first task</strong></p>
              <p>After signup, show a single guided task: "Add your first to-do list." Walk the user through completing one concrete task step by step before letting them explore freely. Forces them to experience a moment of value before they can leave.</p>

              <p><strong>Option 3: AI setup assistant</strong></p>
              <p>A conversational setup flow where users describe what they want in plain language ("I want to track my job applications") and Notion generates a starter workspace for them automatically. High delight but higher implementation complexity.</p>

              <h3>4. Prioritisation: Option 1</h3>
              <p>Use-case based onboarding with templates is the right first bet because:</p>
              <ul>
                <li>Templates solve the blank canvas problem immediately without users needing to learn Notion's system first.</li>
                <li>Notion already has thousands of templates. The infrastructure exists.</li>
                <li>Low implementation risk: the change is in the onboarding routing logic, not the core product.</li>
                <li>Directly drives the activation event: a user who edits a template has experienced value. One who looked at the editor and closed it has not.</li>
              </ul>

              <h3>5. MVP and Success Metrics</h3>
              <p><strong>MVP:</strong> a 3-question onboarding screen that routes new users to one of five starter templates (Personal tasks, Team project, Note-taking, Job search tracker, Study notes). After landing on the template, users are prompted to make one edit before they can explore freely. No AI, no personalisation engine. Just smart routing and a guided first edit.</p>
              <p><strong>Primary metric:</strong> D7 retention for users who go through the new flow vs. a control group on the old blank canvas experience.</p>
              <p><strong>Leading indicator:</strong> percentage of new users who make their first edit within 10 minutes of signup (the activation event).</p>
              <p><strong>Guardrail:</strong> time to first edit should not increase (the new flow must not add friction for users who already know what they want to do).</p>
            `
          }
        },
        {
          id: "case-study-revolut",
          title: "Case Study: Revolut Feature Prioritisation",
          duration: "15-20 min",
          isCaseStudy: true,
          category: "Fintech",
          scenario: {
            title: "Revolut: Three Features, One Quarter",
            context: `Revolut is a UK-based fintech super-app with 45 million customers across Europe and globally. It offers banking, currency exchange, stock trading, crypto, and insurance. Three product teams have each proposed a major feature for Q1. Engineering capacity allows only one to be shipped. The three proposals are:
1. Savings Vaults 2.0: allow users to create multiple savings goals with automatic round-up contributions and interest on each vault separately.
2. Shared Expenses: a bill-splitting feature integrated into the app, letting groups of friends track shared spending (similar to Splitwise but native to Revolut).
3. Credit Score Monitoring: show users their credit score within the app, updated monthly, with tips to improve it.
You are the CPO. Which do you ship and why?`,
            prompt: `In your answer, address the following:
1. What framework or criteria would you use to evaluate these options?
2. Walk through your evaluation of each feature.
3. Which feature do you choose and what is your reasoning?
4. What are the risks of your choice and how would you mitigate them?
5. What does success look like?`,
            rubric: [
              {
                dimension: "Framework",
                strong: "Defines explicit criteria before evaluating: strategic fit (does this strengthen Revolut's core proposition of being a financial super-app?), user impact (how many users benefit and how often?), revenue potential (does this drive premium subscriptions or reduce churn?), defensibility (is this hard to copy?), and implementation risk.",
                weak: "Picks a favourite without a structured evaluation framework, or uses a framework that does not fit a fintech context."
              },
              {
                dimension: "Feature Evaluation",
                strong: "Savings Vaults 2.0: high engagement for existing users, strengthens the savings habit loop, but marginal improvement on an existing feature rather than a new user segment. Shared Expenses: high social virality potential, could drive acquisition (non-Revolut users get invited), but Splitwise already has strong network effects and this is a new product category for Revolut. Credit Score Monitoring: high awareness and utility, especially in markets like UK where credit scores are opaque, drives daily habit and trust, low complexity, and creates a clear upsell path to Revolut's credit products.",
                weak: "Evaluates features without considering Revolut's strategic position, existing competition, or the frequency with which users would engage with each feature."
              },
              {
                dimension: "Decision and Reasoning",
                strong: "Chooses Credit Score Monitoring (or makes a strong case for Shared Expenses with a clear virality argument). For Credit Score: it requires only a data partnership with credit bureaus, drives a daily or weekly habit (users check their score regularly), creates a natural entry point for Revolut's credit products, and builds trust in a category (financial health) where Revolut has no strong competitor inside the app. It is also the lowest implementation risk of the three.",
                weak: "Chooses Shared Expenses without addressing the Splitwise network effect problem, or chooses Savings Vaults 2.0 without explaining how it grows the user base rather than just improving existing users' experience."
              },
              {
                dimension: "Risk and Mitigation",
                strong: "Names specific risks for the chosen feature. For Credit Score: data partnership risk (credit bureaus are slow to integrate, mitigate by starting with one bureau and expanding); accuracy risk (a wrong score damages user trust, mitigate by showing the bureau source and a clear disclaimer); engagement risk (users check once and forget, mitigate by adding monthly score change notifications and personalised improvement tips to drive repeat opens).",
                weak: "Names generic risks without specific mitigation strategies tied to the fintech context."
              },
              {
                dimension: "Success Metrics",
                strong: "Primary: weekly active users of the Credit Score feature within 90 days of launch, targeting 30% of eligible users. Secondary: conversion rate from Credit Score screen to Revolut credit product pages. Guardrail: overall app session frequency must not decrease (credit score monitoring should add a reason to open the app, not replace other habits).",
                weak: "Uses sign-up rate or downloads as the success metric, which do not capture whether the feature is actually being used or whether it is driving the intended behaviour."
              }
            ],
            modelAnswer: `
              <h3>1. Evaluation Framework</h3>
              <p>I would evaluate each feature across five criteria: strategic fit with Revolut's super-app vision, user reach and engagement frequency, revenue or retention impact, defensibility, and implementation risk.</p>

              <h3>2. Feature Evaluation</h3>
              <p><strong>Savings Vaults 2.0:</strong> Good for existing users who already use vaults, strengthens the savings habit loop. But it is an improvement to an existing feature rather than a new capability. It does not attract new users or open a new revenue stream. Medium impact, low risk.</p>

              <p><strong>Shared Expenses:</strong> High virality potential. When one Revolut user invites five friends to split a bill, non-Revolut users get exposed to the product. But Splitwise has strong network effects and a loyal user base. Building a competing product from scratch in a category where the incumbent has years of trust is a high-risk bet. It would also require significant product investment to match Splitwise's feature depth. High potential, high risk.</p>

              <p><strong>Credit Score Monitoring:</strong> In most European markets, users have almost no visibility into their credit score. Bringing this into Revolut creates a weekly or monthly habit (users check their score and its changes), builds trust in the financial health category, and creates a natural upsell path to Revolut's own credit and loan products. It requires a data partnership with credit bureaus rather than a complex product build. Low implementation risk, high strategic value.</p>

              <h3>3. Decision: Credit Score Monitoring</h3>
              <ul>
                <li>It solves a real, frequent user need (understanding financial health) where no competitor inside Revolut's app currently exists.</li>
                <li>It drives weekly engagement rather than one-off use.</li>
                <li>It creates a direct path to Revolut's premium subscription tiers and credit products.</li>
                <li>It is the lowest implementation risk of the three: the main dependency is a credit bureau API, not a complex new product category.</li>
              </ul>

              <h3>4. Risks and Mitigation</h3>
              <ul>
                <li><strong>Data partnership risk:</strong> credit bureau integrations can be slow. Mitigate by starting with one bureau and building the product to be bureau-agnostic so we can add more over time.</li>
                <li><strong>Accuracy risk:</strong> a wrong credit score damages user trust significantly in a financial context. Mitigate by always showing the bureau source, a last-updated date, and a clear disclaimer that this is informational.</li>
                <li><strong>Engagement drop-off:</strong> users check once and forget. Mitigate by adding monthly score change notifications and personalised tips to improve the score, creating a reason to return each month.</li>
              </ul>

              <h3>5. Success Metrics</h3>
              <p><strong>Primary:</strong> 30% of eligible users actively using the Credit Score feature within 90 days of launch (defined as opening the feature at least once per month). This is an illustrative hypothesis. The actual target should be calibrated against comparable feature adoption rates within Revolut.</p>
              <p><strong>Secondary:</strong> conversion rate from the Credit Score screen to Revolut credit product pages.</p>
              <p><strong>Guardrail:</strong> overall app session frequency must not decrease. Credit Score Monitoring should add a reason to open the app, not replace other habits.</p>
            `
          }
        },
        {
          id: "case-study-zalando",
          title: "Case Study: Zalando Responds to a New Competitor",
          duration: "15-20 min",
          isCaseStudy: true,
          category: "E-commerce & Fashion",
          scenario: {
            title: "Zalando: A Fast Fashion Competitor Has Entered Your Market",
            context: `Zalando is Europe's largest online fashion platform, operating in 25 European markets with 50 million active customers. It positions itself as a premium fashion destination with strong brand partnerships, a wide assortment, and a high-quality customer experience (free returns, fast delivery, personal styling features). A new ultra-fast-fashion competitor (think Shein-style) has just launched aggressively in Zalando's core markets, targeting younger demographics with extremely low prices, heavy social media marketing, and a broad but low-cost product range. Assume your data shows that customer acquisition cost has increased 15% and conversion rate among 18-24 year olds has dropped 8% in the past quarter. You are the Chief Product Officer. What do you do?`,
            prompt: `In your answer, address the following:
1. How do you frame the competitive threat? Is this a crisis, a signal, or a distraction?
2. What data would you gather before deciding on a response strategy?
3. What are the strategic options available to Zalando? Evaluate at least three.
4. What is your recommended response and why?
5. What product changes would you prioritise in the next 90 days?
6. How would you define success?`,
            rubric: [
              {
                dimension: "Threat Framing",
                strong: "Frames it as a real but manageable signal rather than an existential crisis. The competitor is winning on price with a younger demographic. Zalando's core strength is curation, brand trust, and returns policy. The question is whether Zalando should compete on price (which it cannot win) or double down on what it does better. Recognises that the 18-24 segment is important for long-term customer lifetime value but is not Zalando's most profitable segment today.",
                weak: "Either dismisses the threat entirely or panics and recommends Zalando try to compete directly on price, which plays into the competitor's strength."
              },
              {
                dimension: "Data Gathering",
                strong: "Before deciding, gathers: which 18-24 users are leaving (new customers or returning?), where they are going (exit surveys, attribution data), what they are buying on the competitor (is it overlapping product categories or purely the low-price segment?), and whether brand partners are also seeing pressure. Also looks at whether the conversion drop is across all categories or specific ones (casual wear vs. premium brands).",
                weak: "Makes strategic recommendations without specifying what data is needed to validate the diagnosis first."
              },
              {
                dimension: "Strategic Options",
                strong: "Evaluates at least three distinct options: (1) compete on price in selected categories (risky, damages brand perception, hard to win against a lower-cost operator); (2) double down on Zalando's differentiation (curation, sustainability, brand partnerships, returns, styling features) and accept losing the ultra-price-sensitive segment; (3) create a separate brand or sub-platform targeting younger, price-sensitive users without cannibalising the main brand. Also considers: accelerate loyalty programme to improve retention among at-risk users.",
                weak: "Only considers one or two options, or all options are variations of the same strategy (e.g., all price-based)."
              },
              {
                dimension: "Recommended Response",
                strong: "Recommends doubling down on differentiation rather than competing on price. Zalando cannot win a price war against a vertically integrated ultra-fast-fashion competitor. Instead, invest in the features that make Zalando worth paying more for: better discovery (personalisation, trend curation), sustainability signals that resonate with value-conscious younger Europeans, a stronger loyalty programme that rewards repeat purchase, and a social/community layer that creates belonging rather than just transactions.",
                weak: "Recommends price matching or discounting without acknowledging that this destroys Zalando's margin and brand positioning."
              },
              {
                dimension: "90-Day Product Priorities",
                strong: "Specific and sequenced: (1) launch or improve a sustainability filter and badge system (resonates with European 18-24 consumers who care about ethics alongside price); (2) improve the personalisation and discovery experience for the 18-24 segment specifically (they are driven by trends, not brand names); (3) run a retention campaign for at-risk 18-24 users already in the database before they fully switch. All three are achievable in 90 days without a platform rebuild.",
                weak: "90-day priorities are either too high-level (improve the product) or too ambitious (rebuild the entire mobile experience)."
              },
              {
                dimension: "Success Metrics",
                strong: "Primary: conversion rate recovery among 18-24 year olds back to pre-competitor baseline within two quarters. Secondary: repeat purchase rate among 18-24 users (retention, not just acquisition). Guardrail: average order value and brand partner satisfaction scores must not deteriorate (Zalando's premium positioning must remain intact).",
                weak: "Defines success as market share or gross revenue, which are lagging indicators that would not tell Zalando quickly enough whether the response is working."
              }
            ],
            modelAnswer: `
              <h3>1. Framing the Threat</h3>
              <p>This is a real signal but not an existential crisis. The competitor is winning on price with a demographic that is inherently price-sensitive. Zalando's strength is curation, brand trust, returns, and the experience of shopping for fashion you feel good about. The mistake would be to try to compete on the competitor's terms. Zalando cannot win a price war against a vertically integrated low-cost operator without destroying its margins and damaging its brand partnerships.</p>
              <p>The 8% conversion drop among 18-24 year olds is a warning, not a catastrophe. This age group has the lowest lifetime value today but the highest potential for the future. The question is how to retain them without compromising what makes Zalando valuable to its core customers.</p>

              <h3>2. Data to Gather First</h3>
              <ul>
                <li>Are the 18-24 users leaving new customers or returning ones? Losing new customers is a different problem from losing loyal ones.</li>
                <li>Exit survey or attribution data: where are these users going? Is it directly to the competitor or are they just not converting anywhere?</li>
                <li>Which product categories are affected? Is the drop in casual everyday wear (where price matters most) or across all categories including premium brands?</li>
                <li>Are brand partners reporting pressure from the same competitor?</li>
              </ul>

              <h3>3. Strategic Options</h3>
              <p><strong>Option 1: Compete on price in selected categories.</strong> Match or approach the competitor's prices in high-volume casual categories. Risk: destroys margin, sends a confusing signal to brand partners, and Zalando structurally cannot be the cheapest due to its cost base. Not recommended.</p>

              <p><strong>Option 2: Double down on differentiation.</strong> Accept that Zalando will not win the ultra-price-sensitive segment. Invest in what makes Zalando worth more: better curation, sustainability, brand partnerships, returns, and a more personalised experience. Risk: Zalando cedes the 18-24 volume segment in the short term. Recommended.</p>

              <p><strong>Option 3: Create a separate value sub-brand.</strong> Launch a separate, clearly distinct value platform targeting younger and more price-sensitive users, without cannibalising the main Zalando brand. Risk: operationally complex and expensive. Consider for a later phase if Option 2 does not slow the decline.</p>

              <p><strong>Option 4: Accelerate loyalty programme.</strong> Invest in retaining the 18-24 users already in the Zalando ecosystem before they switch. Upgrade rewards, introduce early access to drops and exclusive collections, and personalise offers to this cohort. This is complementary to Option 2.</p>

              <h3>4. Recommended Response</h3>
              <p>Double down on differentiation (Option 2) combined with a targeted loyalty push (Option 4). Zalando's moat is trust, curation, and the experience of shopping for fashion that feels considered rather than disposable. These values actually resonate with European 18-24 year olds who are increasingly concerned about sustainability and conscious consumption, even while they are price-sensitive. The response is to make those values more visible and actionable inside the product.</p>

              <h3>5. 90-Day Product Priorities</h3>
              <ol>
                <li><strong>Sustainability filter and badge system:</strong> make it easy for users to filter by certified sustainable brands and show sustainability credentials on product cards. Resonates with European Gen Z values and differentiates from the competitor, which has a poor sustainability reputation.</li>
                <li><strong>Improved trend discovery for 18-24 users:</strong> this segment is driven by trends and social signals, not brand names. Improve the personalisation algorithm and add a trend-led discovery surface (what is popular this week in your city, style inspiration from real people).</li>
                <li><strong>Retention push for at-risk 18-24 users:</strong> identify users in this cohort who have not purchased in the last 60 days and run a targeted retention campaign with personalised recommendations and a first-order-back incentive.</li>
              </ol>

              <h3>6. Success Metrics</h3>
              <p><strong>Primary:</strong> conversion rate among 18-24 year olds recovers to the pre-competitor baseline within two quarters.</p>
              <p><strong>Secondary:</strong> repeat purchase rate among 18-24 users (we want retention, not just a one-time conversion).</p>
              <p><strong>Guardrail:</strong> average order value and brand partner satisfaction scores must not deteriorate. Zalando's premium positioning must remain intact even as we work to win back the younger segment.</p>
            `
          }
        },
        {
          id: "case-study-slack",
          title: "Case Study: Slack Workspaces That Never Become Teams",
          duration: "20–25 min",
          isCaseStudy: true,
          category: "Work & Productivity",
          scenario: {
            title: "Slack: Workspaces That Never Become Teams",
            context: `Slack is a workplace communication platform that helps teams exchange messages and collaborate. Assume the following illustrative, hypothetical analytics for this exercise: 10,000 new workspaces are created each month, 65% of workspace creators invite at least one teammate within seven days, but only 20% of new workspaces reach meaningful collaboration within 30 days. Workspaces that achieve meaningful collaboration show significantly stronger long-term retention. For this exercise, meaningful collaboration means at least three members exchanging messages across two separate days within their first 30 days. You are the PM responsible for new-workspace activation. Leadership wants to improve the 30-day collaboration rate without introducing unnecessary onboarding complexity.`,
            prompt: `In your answer, address the following:
1. How would you distinguish a successful workspace signup from successful team activation?
2. What data and qualitative research would you use to identify the largest activation barriers?
3. Propose three distinct product interventions and explain the user value and risks of each.
4. Which intervention would you prioritise, and what would its minimum viable experiment look like?
5. How would you measure success, including guardrail metrics?`,
            rubric: [
              {
                dimension: "Activation Framing",
                strong: "Distinguishes workspace creation, invitations, teammate onboarding, and repeated collaboration. Treats the workspace (not the individual) as the primary unit of analysis because Slack's value depends on multiple people participating.",
                weak: "Treats new workspace creation as activation, or ignores that Slack's value is multi-user by nature."
              },
              {
                dimension: "Investigation",
                strong: "Would analyse invitation acceptance rates, first shared conversations, workspace size distribution, and differences between activating and abandoning workspaces. Would interview creators and invitees separately because they face different problems.",
                weak: "Assumes inactivity is caused by a missing feature, or jumps to solutions without diagnosing the funnel first."
              },
              {
                dimension: "Solution Breadth",
                strong: "Proposes meaningfully different interventions targeting separate funnel barriers (e.g., a guided first collaboration, team-specific templates, and richer invitation context) with explicit user value and risks for each.",
                weak: "Suggests several variations of reminder notifications or three near-identical onboarding tweaks."
              },
              {
                dimension: "Prioritisation and MVP",
                strong: "Selects a specific barrier based on evidence from the funnel analysis and scopes a narrow test (for example, a short setup prompt for a random slice of new workspaces that guides the creator to start one team conversation).",
                weak: "Proposes a complete onboarding redesign immediately, or picks a solution without connecting it to a diagnosed barrier."
              },
              {
                dimension: "Metrics and Guardrails",
                strong: "Measures collaborative activation by workspace cohort (not individual engagement) and monitors invitation acceptance, time to first multi-person conversation, notification fatigue, and retention. Guardrails cover workspace creation completion, onboarding abandonment, and opt-outs.",
                weak: "Uses signups or total message volume alone, which conflates per-workspace success with workspace size."
              }
            ],
            modelAnswer: `
              <p><em>Illustrative PM reasoning. A well-argued alternative that addresses the underlying problem with evidence and trade-offs is also acceptable.</em></p>

              <h3>1. Define Activation</h3>
              <p>Workspace creation is an expression of intent, not proof of collaborative value. I would map activation as a sequence: <strong>workspace created → teammates invited → invitations accepted → first meaningful exchange → repeat collaboration</strong>.</p>
              <p>The primary unit of analysis should be the <strong>workspace</strong>, not the individual user, because Slack's value depends on multiple people participating. A workspace with three regular contributors is far more valuable than one with ten passive accounts.</p>

              <h3>2. Investigate the Funnel</h3>
              <ul>
                <li>Invitation acceptance rates and time to acceptance.</li>
                <li>Percentage of workspaces with at least three active members within 30 days.</li>
                <li>Time from first invitation to first multi-person conversation.</li>
                <li>Activation by workspace size, company type, and acquisition channel.</li>
                <li>Differences between workspaces that activate and those that abandon setup.</li>
              </ul>
              <p>Qualitatively, I would interview creators and invitees <em>separately</em>. A workspace creator might struggle to convince colleagues to join. An invitee might join but see no reason to contribute. Those are different problems requiring different solutions.</p>

              <h3>3. Three Interventions</h3>
              <p><strong>Option A: Guided first collaboration.</strong> Help creators invite teammates and complete one useful collaborative task, such as a team check-in. <em>Value:</em> demonstrates the product's purpose quickly. <em>Risk:</em> generic guidance may not fit every team's workflow.</p>
              <p><strong>Option B: Team-specific workspace templates.</strong> Offer templates for project teams, small businesses, or community groups. <em>Value:</em> reduces the blank-workspace problem and establishes context. <em>Risk:</em> templates can create unnecessary channels and complexity.</p>
              <p><strong>Option C: Invitation context.</strong> Let workspace creators include a clear reason for joining, such as a project or shared goal, in invitations. <em>Value:</em> improves invitee understanding and willingness to participate. <em>Risk:</em> additional invitation steps could reduce invitations sent.</p>

              <h3>4. Prioritise and Test</h3>
              <p>I would not select a solution before examining the funnel. If invitation acceptance is healthy but conversations rarely begin, I would prioritise <strong>guided first collaboration</strong>. The MVP would introduce a short setup prompt to a randomly selected group of newly created workspaces, guiding the creator to start one team conversation. I would avoid rebuilding the entire onboarding experience.</p>

              <h3>5. Define Success</h3>
              <p><strong>Primary metric:</strong> percentage of new workspaces reaching meaningful collaboration (three members exchanging messages across two separate days) within 30 days.</p>
              <p><strong>Leading metrics:</strong> invitation acceptance, first multi-person conversation, and time to first collaboration.</p>
              <p><strong>Guardrails:</strong> workspace creation completion rate, onboarding abandonment, notification opt-outs, and member satisfaction.</p>
              <p>I would examine results by workspace cohort rather than relying on total message volume, which larger workspaces would dominate.</p>
              <p><strong>Key learning:</strong> B2B activation is about helping multiple users reach shared value, not merely increasing individual engagement.</p>
            `
          }
        },
        {
          id: "case-study-netflix",
          title: "Case Study: Netflix Cheaper Subscription Tier Decision",
          duration: "20–25 min",
          isCaseStudy: true,
          category: "Media & Entertainment",
          scenario: {
            title: "Netflix: Should We Introduce a Cheaper Subscription Tier?",
            context: `Netflix operates a subscription-based video streaming platform. Assume the following illustrative, hypothetical situation for this exercise: subscriber growth has slowed in a particular market, price-sensitive users have a higher cancellation rate than other subscribers, consumer research suggests some non-subscribers consider the current entry price too high, and the business is considering a new lower-priced subscription tier with restricted features. Leadership expects the cheaper tier to attract new subscribers but worries it may encourage existing subscribers to downgrade. You are the PM responsible for subscription growth and monetisation in this market. Should Netflix introduce the new tier?`,
            prompt: `In your answer, address the following:
1. How would you frame the business problem and identify the relevant subscriber segments?
2. What data would you gather to understand willingness to pay, churn, and potential cannibalisation?
3. What pricing or packaging alternatives would you evaluate?
4. How would you design an experiment to determine whether the new tier creates incremental value?
5. What metrics and decision criteria would determine whether to launch, iterate, or reject it?`,
            rubric: [
              {
                dimension: "Business Framing",
                strong: "Differentiates acquisition, retention, pricing accessibility, and revenue objectives, and recognises that these can conflict. Identifies segments: price-sensitive prospects, recent churners, existing subscribers likely to downgrade, and subscribers with low price sensitivity.",
                weak: "Assumes lower prices automatically improve the business, or treats the decision as a single-metric optimisation."
              },
              {
                dimension: "Customer and Revenue Analysis",
                strong: "Examines churn and cancellation reasons by tier, historical price-change response, acquisition conversion by segment, margin per subscriber, and downgrade behaviour. Uses stated willingness to pay as a signal but relies on revealed behaviour for the decision.",
                weak: "Focuses exclusively on subscriber growth, or relies on surveyed willingness to pay without validating against actual behaviour."
              },
              {
                dimension: "Option Evaluation",
                strong: "Considers at least three distinct approaches (new restricted tier, limited-duration acquisition offer, repackaged existing tiers) with explicit trade-offs for each.",
                weak: "Treats a cheaper tier as the only solution, or considers alternatives that are variants of the same lever."
              },
              {
                dimension: "Experiment Design",
                strong: "Tests incremental acquisition against cannibalisation with an appropriate control (contained market or eligible prospect population), defines a minimum acceptable improvement in incremental contribution, and runs long enough to observe cancellation and downgrade behaviour.",
                weak: "Launches broadly and compares before-and-after subscribers, or ignores cannibalisation."
              },
              {
                dimension: "Financial Metrics",
                strong: "Evaluates incremental contribution, ARPU, retention, downgrade rates, and costs. Guardrails cover existing-subscriber downgrade rate, ARPU, customer support contacts, and dissatisfaction with plan restrictions.",
                weak: "Measures success using total subscriptions alone, ignoring unit economics."
              }
            ],
            modelAnswer: `
              <p><em>Illustrative PM reasoning. A well-argued alternative that addresses the underlying problem with evidence and trade-offs is also acceptable.</em></p>

              <h3>1. Frame the Problem</h3>
              <p>I would first clarify whether the primary objective is new customer acquisition, reduced churn, or improved revenue. These objectives can conflict: a lower-priced plan may increase subscriber count while reducing total contribution if too many existing customers downgrade.</p>
              <p>I would segment users into price-sensitive prospects, recent churners, existing subscribers likely to downgrade, and subscribers with low price sensitivity.</p>

              <h3>2. Understand Willingness to Pay</h3>
              <ul>
                <li>Churn and cancellation reasons by tier.</li>
                <li>Historical subscriber response to past pricing changes.</li>
                <li>Acquisition conversion by market and customer segment.</li>
                <li>Revenue and variable service costs per subscriber.</li>
                <li>Qualitative research about which features customers value most.</li>
              </ul>
              <p>Surveyed willingness to pay is useful but insufficient on its own. Actual purchase behaviour should drive the decision.</p>

              <h3>3. Consider Alternatives</h3>
              <p><strong>Option A: Lower-priced restricted tier.</strong> Attracts price-sensitive consumers. <em>Risk:</em> existing subscribers downgrade.</p>
              <p><strong>Option B: Limited-duration acquisition offer.</strong> Reduces initial commitment for new customers. <em>Risk:</em> attracts deal-seekers who churn after the offer.</p>
              <p><strong>Option C: Adjust existing tier packaging.</strong> Differentiate plans by features, access, or usage without necessarily lowering the entry price as much. <em>Risk:</em> more confusing plan choices.</p>

              <h3>4. Design the Experiment</h3>
              <p>I would test the new tier in a contained market or eligible prospect population, with a comparable control group. Crucially, the test must allow us to estimate cannibalisation among eligible existing customers, not just new subscriptions. I would predefine a minimum acceptable improvement in incremental contribution and run the experiment long enough to observe meaningful cancellation and downgrade behaviour.</p>

              <h3>5. Define Success</h3>
              <p><strong>Primary metric:</strong> incremental contribution profit attributable to the new tier over a defined period.</p>
              <p><strong>Secondary metrics:</strong> incremental paid acquisition, conversion, retention, and subscriber lifetime value.</p>
              <p><strong>Guardrails:</strong> existing subscriber downgrade rate, ARPU, customer support contacts, and dissatisfaction with plan restrictions.</p>
              <p>I would launch only if the evidence suggests the new tier produces incremental value, not simply a higher subscriber count.</p>
              <p><strong>Key learning:</strong> monetisation decisions require optimising business value, not maximising a single growth metric.</p>
            `
          }
        },
        {
          id: "case-study-airbnb",
          title: "Case Study: Airbnb Reducing Misleading Listings",
          duration: "20–25 min",
          isCaseStudy: true,
          category: "Travel & Hospitality",
          scenario: {
            title: "Airbnb: Reducing Misleading Listings Without Hurting Bookings",
            context: `Airbnb is a marketplace connecting travellers with accommodation hosts. Assume the following illustrative, hypothetical quarterly business review for this exercise: guest reports about misleading listings have increased by 30%, complaints primarily involve inaccurate property descriptions, outdated photos, and missing amenities, and some complaints result in refunds, cancellations, and negative guest experiences. Leadership proposes introducing stricter host verification before listings can accept bookings. However, hosts worry that additional verification requirements could delay listing activation and increase administrative work. You are the PM responsible for listing quality and guest trust. Your goal is to improve listing reliability while maintaining a healthy supply of accommodation.`,
            prompt: `In your answer, address the following:
1. How would you define and size the trust problem before deciding on a solution?
2. What data would you investigate, and how would you segment affected listings and guests?
3. Evaluate three possible interventions, including their impact on guests and hosts.
4. What solution would you prioritise, and how would you test it safely?
5. How would you measure trust improvements while protecting marketplace health?`,
            rubric: [
              {
                dimension: "Trust Problem Framing",
                strong: "Separates complaint volume, complaint rate (per completed stay), severity, and actual listing inaccuracies. Recognises that rising reports may reflect worsening quality, higher booking volume, or improved reporting.",
                weak: "Assumes every complaint represents fraud, or confuses raw complaint count with trust deterioration."
              },
              {
                dimension: "Marketplace Investigation",
                strong: "Considers guests, hosts, listing characteristics, complaint validity, severity, and both sides of the marketplace. Segments by host type, property, location, listing age, and the proportion of complaints that are substantiated.",
                weak: "Examines guest complaints without considering host supply, or ignores complaint validity."
              },
              {
                dimension: "Intervention Trade-offs",
                strong: "Evaluates verification, post-stay accuracy feedback, and quality signals, and explicitly weighs host burden, supply growth, and false-positive risk alongside guest protection.",
                weak: "Assumes universal strict verification is risk-free, or ignores host friction entirely."
              },
              {
                dimension: "Risk-Based Prioritisation",
                strong: "Targets higher-risk listings based on validated signals (repeated complaints, outdated information), tests enforcement with safeguards (appeal and correction), and keeps serious safety issues in existing escalation paths.",
                weak: "Applies expensive restrictions indiscriminately, or disregards appeal and correction mechanisms."
              },
              {
                dimension: "Marketplace Metrics",
                strong: "Balances verified listing accuracy, guest outcomes (refunds, cancellations), supply activation, host fairness, and complaint reporting rates. Watches for reduced reporting as a false improvement signal.",
                weak: "Measures only reduction in complaints, missing the risk of suppressed reporting."
              }
            ],
            modelAnswer: `
              <p><em>Illustrative PM reasoning. A well-argued alternative that addresses the underlying problem with evidence and trade-offs is also acceptable.</em></p>

              <h3>1. Define the Problem</h3>
              <p>I would distinguish deliberate misrepresentation from inaccurate but unintentional listing information. A 30% rise in reports might reflect worsening listing quality, increased booking volume, or improved complaint reporting.</p>
              <p>I would measure the rate of substantiated complaints per completed stay and categorise complaints by severity. Raw complaint count on its own is not a trust metric.</p>

              <h3>2. Investigate the Data</h3>
              <ul>
                <li>New versus established hosts.</li>
                <li>Professional versus occasional hosts.</li>
                <li>Property type, location, and listing age.</li>
                <li>Complaint category and severity.</li>
                <li>Listings with repeated complaints.</li>
                <li>Time since photos and amenities were last updated.</li>
              </ul>
              <p>I would also examine the proportion of complaints that are validated, and their refund and cancellation outcomes.</p>

              <h3>3. Evaluate Interventions</h3>
              <p><strong>Option A: Universal listing verification.</strong> Requires hosts to verify descriptions, photos, and amenities. <em>Benefit:</em> broad coverage. <em>Risk:</em> onboarding friction, operational expense, and slower supply growth.</p>
              <p><strong>Option B: Risk-based verification.</strong> Target listings with repeated complaints, outdated information, or other validated risk indicators. <em>Benefit:</em> directs verification effort where it is most useful. <em>Risk:</em> false positives and unfair treatment of certain host segments.</p>
              <p><strong>Option C: Improved post-stay listing accuracy feedback.</strong> Ask guests to confirm whether key amenities and descriptions were accurate. <em>Benefit:</em> generates ongoing quality signals. <em>Risk:</em> feedback can be noisy, incomplete, or biased.</p>

              <h3>4. Prioritise and Test</h3>
              <p>I would start with risk-based verification paired with clearer listing accuracy feedback. First, validate the risk signals using historical complaints. Then introduce the process to a limited group of listings, monitor false positives, and provide hosts with an appeal and correction process. Serious safety violations should continue through existing safety escalation processes rather than being left to the experiment.</p>

              <h3>5. Define Success</h3>
              <p><strong>Primary metric:</strong> rate of substantiated material listing inaccuracies per completed stay.</p>
              <p><strong>Secondary metrics:</strong> refunds, listing-related cancellations, repeated complaints, and guest trust scores.</p>
              <p><strong>Guardrails:</strong> host listing activation time, active supply, booking conversion, false-positive verification flags, and host satisfaction.</p>
              <p>I would also monitor complaint reporting rates to avoid mistaking reduced reporting for improved trust.</p>
              <p><strong>Key learning:</strong> marketplace safety improvements must protect guests without unnecessarily penalising legitimate supply.</p>
            `
          }
        },
        {
          id: "case-study-google-maps",
          title: "Case Study: Google Maps Route Recommendation Experiment",
          duration: "20–25 min",
          isCaseStudy: true,
          category: "Maps & Navigation",
          scenario: {
            title: "Google Maps: An Experiment Improves Engagement but Not Navigation",
            context: `Google Maps helps people discover places and navigate routes. Imagine your team has developed a hypothetical AI-powered route recommendation experience. Instead of only displaying conventional route choices, the feature highlights a recommended route with a brief explanation. Assume the following illustrative, fictional four-week A/B test, with eligible users randomly assigned to control and treatment. Route recommendation engagement: control 40% versus treatment 48%. Median journey completion time: 28 minutes in both arms. Post-trip satisfaction: 4.3 out of 5 in both arms. Route changes during navigation: control 12% versus treatment 15%. The engagement increase is statistically significant at the experiment's predefined threshold. The other differences have not been established as statistically significant. Your team is excited about the engagement increase and recommends a full rollout. You are the PM responsible for the experiment.`,
            prompt: `In your answer, address the following:
1. What decision should this experiment help you make, and which metric should be primary?
2. How would you interpret the results? What can and cannot you conclude?
3. What additional analyses would you conduct before making a decision?
4. Would you launch, iterate, or stop the feature? Explain your reasoning and next experiment.
5. What launch criteria and guardrails would you establish?`,
            rubric: [
              {
                dimension: "Objective and Metric Selection",
                strong: "Aligns the primary metric with navigation usefulness (validated travel outcome, successful journey completion, user satisfaction), not feature engagement alone.",
                weak: "Treats recommendation clicks as proof of better navigation."
              },
              {
                dimension: "Statistical Interpretation",
                strong: "Separates statistically significant findings from inconclusive ones. Recognises that a non-significant result is not the same as 'no effect', and considers uncertainty and practical impact.",
                weak: "Treats nonsignificant results as proof of no effect, or ignores confidence intervals."
              },
              {
                dimension: "Diagnostic Depth",
                strong: "Checks exposure, randomisation balance, sample size and power, segments (urban vs rural, driving/walking/transit, short vs long trips), route types, and instrument quality.",
                weak: "Accepts aggregate numbers without investigating heterogeneity or power."
              },
              {
                dimension: "Product Decision",
                strong: "Makes a defensible decision (hold or run a targeted follow-up) and specifies the next experiment, including which hypothesis it is testing.",
                weak: "Launches solely because engagement increased, or proposes continuous testing without a clear decision point."
              },
              {
                dimension: "Experimental Safeguards",
                strong: "Pre-registers primary metric, minimum practically meaningful improvement, power and duration requirements, and guardrails (rerouting, journey duration, distraction/safety signals).",
                weak: "No launch criteria or guardrails, or vague thresholds that cannot settle a launch decision."
              }
            ],
            modelAnswer: `
              <p><em>Illustrative PM reasoning. A well-argued alternative that addresses the underlying problem with evidence and trade-offs is also acceptable.</em></p>

              <h3>1. Identify the Objective</h3>
              <p>The objective should be to help people select routes that improve their travel experience. Higher engagement with an explanation is useful only if it supports that outcome. I would prioritise a validated navigation quality metric that considers successful route completion, travel outcomes, and user satisfaction.</p>

              <h3>2. Interpret the Results</h3>
              <p>The treatment increased engagement from 40% to 48%, an absolute increase of eight percentage points. However, journey completion time and reported satisfaction did not show a demonstrated improvement.</p>
              <p>Route changes increased numerically, from 12% to 15%, but without established significance we cannot conclude that the feature caused a genuine deterioration.</p>
              <p>The experiment shows people interact with the feature more. It does not yet establish that their journeys improve.</p>

              <h3>3. Investigate Further</h3>
              <ul>
                <li>Experiment sample size and statistical power.</li>
                <li>Confidence intervals for each outcome.</li>
                <li>Randomisation balance and instrumentation.</li>
                <li>Urban versus rural routes.</li>
                <li>Driving, walking, and public transport segments.</li>
                <li>Short versus long trips.</li>
                <li>Whether route changes reflect confusion, better alternatives, or changing traffic conditions.</li>
              </ul>
              <p>I would also inspect whether users understand the explanation and whether the additional interaction creates distraction.</p>

              <h3>4. Make the Decision</h3>
              <p>I would <strong>not approve a full rollout yet</strong>. I would keep the existing experience for the majority of users and run a targeted follow-up experiment focused on the segments where recommendations appear most useful. Potential refinements include explanation clarity, route comparison, or restricting recommendations to situations where there is meaningful trade-off information.</p>

              <h3>5. Define Launch Criteria</h3>
              <p>I would pre-register the primary navigation outcome, the minimum practically meaningful improvement, sample-size requirements, and experiment duration.</p>
              <p><strong>Primary metric:</strong> a validated measure of successful navigation quality.</p>
              <p><strong>Secondary metrics:</strong> route selection confidence and post-trip satisfaction.</p>
              <p><strong>Guardrails:</strong> excessive rerouting, journey duration deterioration, and distraction-related safety indicators.</p>
              <p><strong>Key learning:</strong> a statistically significant change in feature engagement does not automatically justify a product launch.</p>
            `
          }
        },
        {
          id: "case-study-figma",
          title: "Case Study: Figma Plugin Ecosystem Quality",
          duration: "20–25 min",
          isCaseStudy: true,
          category: "Work & Productivity",
          scenario: {
            title: "Figma: Growing a Plugin Ecosystem Without Losing Product Quality",
            context: `Figma is a collaborative design platform with an ecosystem of third-party plugins that extend its functionality. Assume the following illustrative, hypothetical situation for this exercise: plugin submissions have doubled over the past year, plugin discovery is becoming difficult as the catalogue grows, users increasingly report outdated plugins, unreliable performance, and unclear permission requests, and developers argue that stricter reviews and approval requirements could discourage innovation. Leadership wants to accelerate ecosystem growth while maintaining trust in the core design experience. You are the PM responsible for Figma's plugin ecosystem. You have one quarter to improve ecosystem quality without materially slowing developer participation.`,
            prompt: `In your answer, address the following:
1. How would you define a healthy plugin ecosystem for users, developers, and the platform?
2. What data would you gather to identify the most important quality and discovery problems?
3. Evaluate three possible initiatives to improve the ecosystem, including their trade-offs.
4. Which initiative would you prioritise for the next quarter, and how would you scope its MVP?
5. What metrics would you use to evaluate ecosystem health and developer experience?`,
            rubric: [
              {
                dimension: "Ecosystem Framing",
                strong: "Identifies incentives and needs of users, plugin developers, and the platform, and recognises plugin count alone is a weak measure of ecosystem success.",
                weak: "Focuses only on the number of available plugins or treats developers as a single undifferentiated group."
              },
              {
                dimension: "Quality Investigation",
                strong: "Evaluates adoption, retention, crash and failure rates, support complaints, permission concerns, discovery-to-install conversion, and developer submission-to-approval time.",
                weak: "Assumes more review requirements automatically improve quality without diagnosing the underlying problem."
              },
              {
                dimension: "Strategic Options",
                strong: "Compares discovery improvements, quality signals, risk-based governance, and developer tooling. Separates discovery problems from quality and security problems.",
                weak: "Recommends only tighter approval processes, or conflates discovery, quality, and security into one lever."
              },
              {
                dimension: "Prioritisation and MVP",
                strong: "Selects an evidence-based intervention, defines a small initial scope (for example, trust signals shown on a subset of plugins), and considers the impact on smaller developers.",
                weak: "Proposes rebuilding the marketplace without a testable hypothesis or an MVP that can be delivered within one quarter."
              },
              {
                dimension: "Ecosystem Metrics",
                strong: "Measures trusted adoption (installations that lead to meaningful repeat usage without trust incidents), reliability, developer participation, and marketplace efficiency. Guardrails cover developer approval time and false-positive enforcement.",
                weak: "Measures success only through submission growth or raw install counts."
              }
            ],
            modelAnswer: `
              <p><em>Illustrative PM reasoning. A well-argued alternative that addresses the underlying problem with evidence and trade-offs is also acceptable.</em></p>

              <h3>1. Define Ecosystem Health</h3>
              <p>A healthy ecosystem creates value for three stakeholders. <strong>Users</strong> can find useful, reliable plugins that respect their data. <strong>Developers</strong> can build, publish, and improve plugins without unnecessary friction. <strong>Figma</strong> benefits from a platform that becomes more useful without undermining its core product experience.</p>
              <p>Plugin count alone is a weak measure of ecosystem success.</p>

              <h3>2. Diagnose the Issues</h3>
              <ul>
                <li>Plugin discovery-to-install conversion.</li>
                <li>Active usage and repeat usage by plugin category.</li>
                <li>Crash and failure rates.</li>
                <li>Frequency of plugin updates.</li>
                <li>Complaints and permission-related concerns.</li>
                <li>Developer submission-to-approval time.</li>
                <li>Developer abandonment during publishing.</li>
              </ul>
              <p>I would separate discovery problems from quality and security problems rather than assuming a single solution addresses all three.</p>

              <h3>3. Evaluate Strategic Initiatives</h3>
              <p><strong>Option A: Trust and quality signals.</strong> Display verified information about update recency, permissions, and reliability. <em>Benefit:</em> users make better-informed decisions. <em>Risk:</em> simplified quality labels may unfairly penalise new plugins.</p>
              <p><strong>Option B: Risk-based plugin reviews.</strong> Require stronger review for plugins with sensitive permissions or elevated risk. <em>Benefit:</em> protects users while avoiding universal review overhead. <em>Risk:</em> inconsistent classification and longer approval times for some developers.</p>
              <p><strong>Option C: Improved discovery and recommendations.</strong> Help users find relevant plugins based on their workflows. <em>Benefit:</em> greater value from the existing catalogue. <em>Risk:</em> recommendations may disproportionately favour established developers.</p>

              <h3>4. Prioritise and Scope</h3>
              <p>I would begin by assessing which issue creates the greatest measurable harm. If reliability and unclear permissions are major drivers of dissatisfaction, I would prioritise <strong>trust and quality signals</strong>, supported by a targeted verification process.</p>
              <p>The MVP would show permission disclosures, last update date, and a limited reliability indicator for a subset of plugins. I would test whether these signals improve successful plugin adoption without unfairly reducing discovery of smaller developers. Plugins presenting serious security risks should be handled through existing security controls, independently of the experiment.</p>

              <h3>5. Define Success</h3>
              <p><strong>Primary metric:</strong> percentage of plugin installations that lead to meaningful repeat usage without a reliability or trust incident.</p>
              <p><strong>Secondary metrics:</strong> discovery-to-install conversion, plugin retention, reported issues, and successful developer publications.</p>
              <p><strong>Guardrails:</strong> developer approval time, developer retention, discoverability of new plugins, and false-positive enforcement actions.</p>
              <p><strong>Key learning:</strong> platform strategy is about balancing ecosystem growth, developer incentives, governance, and user trust.</p>
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
              <p>Product strategy answers three questions: <strong>Where are we going? Why does it matter? How will we get there?</strong> A strategy isn't a roadmap (that's tactics), it's the logic behind why you're making the choices you're making.</p>

              <h3>The Three Levels of Strategy</h3>
              <p><strong>Company strategy:</strong> What market does the company operate in? What is its competitive advantage? (e.g., Amazon's strategy: be the lowest-cost, fastest-delivery marketplace by owning logistics infrastructure)</p>
              <p><strong>Product strategy:</strong> What is the product's role in achieving company goals? Which users does it serve? What are the top 3-5 bets the product is making? (e.g., Spotify's product strategy: own audio, not just music, expand into podcasts and audiobooks to reduce dependency on record labels)</p>
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
                "ARR is a lagging metric that shouldn't appear in product strategy",
                "This is a goal, not a strategy, it states where you want to go but not how or why",
                "Strategies should be set for 3-5 year horizons, not 12 months"
              ],
              correct: 2,
              explanation: "Rumelt's key insight: strategy is the logic of how you'll win, not just where you want to end up. '$50M ARR' is a financial target. A strategy would say: 'Given that SMB customers churn due to poor onboarding, we'll invest in high-touch activation to reduce churn by 20% and expand via account expansion.'"
            },
            {
              question: "Spotify's decision to expand into podcasts and audiobooks is best described as:",
              options: [
                "A tactical product decision to add new content types",
                "A response to Apple Podcasts' market dominance",
                "A way to improve Spotify's North Star metric of time spent listening",
                "A strategic move to reduce dependence on record labels and own a broader audio platform"
              ],
              correct: 3,
              explanation: "This is a strategic move, not just a feature add. Spotify was heavily dependent on the major record labels for licensing. By expanding to podcasts (which they can own the distribution of) and audiobooks, they diversified their content moat and reduced leverage the labels had over them."
            },
            {
              question: "LinkedIn's primary competitive moat is best described as:",
              options: [
                "Its user interface and design quality",
                "Network effects, the value of LinkedIn grows as more professionals join, making the data and connections increasingly irreplaceable",
                "Its brand recognition among job seekers",
                "Its recommendation algorithm for job matching"
              ],
              correct: 1,
              explanation: "LinkedIn's moat is its professional network, 900M+ profiles connected to their work history, skills, and professional relationships. No competitor can replicate this without getting professionals to add their entire career history again, which they won't do if everyone is already on LinkedIn."
            },
            {
              question: "In Rumelt's strategy kernel, the 'Guiding Policy' element refers to:",
              options: [
                "The overall approach or logic for addressing the diagnosed challenge",
                "The specific actions the team will take this quarter",
                "The company's mission statement and values",
                "The compliance and legal policies that govern product decisions"
              ],
              correct: 0,
              explanation: "The guiding policy is the bridge between diagnosis (what's the problem?) and coherent actions (what do we do?). It's the 'bet', the broad approach the team is committing to. Example: 'We will win by being the cheapest option' or 'We will win by being the best for power users, not beginners.'"
            },
            {
              question: "A PM says: 'Our product strategy is to build great features for all user types, enterprise, SMB, and consumers, with the best UX in the market.' What is the strategic problem here?",
              options: [
                "The strategy is too expensive to execute",
                "Consumer and enterprise products need separate strategies",
                "UX should not be part of a product strategy",
                "It tries to do everything, which means it makes no hard choices and offers no real direction"
              ],
              correct: 3,
              explanation: "A strategy that tries to serve everyone equally, in every segment, with no focus, is actually no strategy, it's just a list of aspirations. Real strategy means choosing what you will NOT do. Trying to win with enterprise, SMB, and consumers simultaneously usually results in a mediocre product for all three."
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
              description: "Weekly essays on tech company strategy, arguably the best public source for product strategy thinking in tech."
            },
            {
              title: "Stratechery: The Aggregation Theory (Ben Thompson)",
              url: "https://stratechery.com/2015/aggregation-theory/",
              description: "Ben Thompson's foundational free essay on how internet companies build strategic moats, essential product strategy reading."
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
        { title: "Lenny: Choosing Your North Star Metric", url: "https://www.lennysnewsletter.com/p/choosing-your-north-star-metric", description: "Lenny's breakdown of how to pick the right North Star Metric, with examples from Airbnb, Slack, and more." },
        { title: "Amplitude: The North Star Checklist", url: "https://amplitude.com/books/north-star/the-north-star-checklist", description: "A practical checklist from Amplitude's North Star Playbook to validate and refine your North Star Metric." },
        { title: "Stratechery: Aggregation Theory", url: "https://stratechery.com/2015/aggregation-theory/", description: "Ben Thompson's foundational free essay on how internet companies build lasting product advantages." },
        { title: "Ken Norton: Leading Cross-Functional Teams", url: "https://www.bringthedonuts.com/essays/leading-cross-functional-teams.html", description: "How PMs lead teams they don't manage, by the author of How to Hire a Product Manager." }
      ]
    },
    {
      category: "Books",
      items: [
        { title: "Inspired, Marty Cagan", url: "https://www.svpg.com/books/inspired-how-to-create-tech-products-customers-love-2nd-edition/", description: "The PM bible. Covers how top tech companies build products." },
        { title: "Continuous Discovery Habits, Teresa Torres", url: "https://www.amazon.com/Continuous-Discovery-Habits-Discover-Products/dp/1736633309", description: "The modern framework for user research integrated into product development." },
        { title: "Good Strategy Bad Strategy, Rumelt", url: "https://www.amazon.com/Good-Strategy-Bad-Difference-Matters/dp/0307886239", description: "The clearest book on what strategy actually is, and isn't." },
        { title: "Agile Product Management with Scrum, Roman Pichler", url: "https://www.amazon.de/-/en/Agile-Product-Management-Scrum-Addison-Wesley/dp/0321605780", description: "How to apply Scrum as a Product Owner, practical and concise." }
      ]
    },
    {
      category: "Tools & Calculators",
      items: [
        { title: "Evan Miller: A/B Test Sample Size Calculator", url: "https://www.evanmiller.org/ab-testing/sample-size.html", description: "Free calculator for determining how many users you need in each variant before running an A/B test." }
      ]
    }
  ]
};
