// js/grader-rubric.js
// Machine-readable scoring specification for the AI Grader pilot (4 cases).
// Model answers live in data.js only and must NOT be included in live grading prompts.
// score_3 = meets strong anchor | score_2 = partial | score_1 = meets weak anchor

const GRADER_RUBRIC = {
  version: "1.0",
  universalRules: [
    "Score only what the learner actually demonstrates.",
    "Do not reward verbosity, rubric keyword stuffing, or confident unsupported assertions.",
    "Do not require the answer to match the model answer.",
    "Do not invent evidence or penalise alternative valid reasoning.",
    "Use scores 1, 2, or 3 for every dimension.",
    "Examples in score descriptions are illustrative, not mandatory checklists. Score 3 represents strong demonstrated competence, not exhaustive coverage of every listed example."
  ],
  cases: [

    // ─────────────────────────────────────────────────────────────────
    // 1. FOTMOB
    // ─────────────────────────────────────────────────────────────────
    {
      caseId: "case-study-fotmob",
      title: "FotMob, Designing for Fans Who Only Show Up on Matchday",
      scenario: {
        context: "FotMob is a football scores and stats app used by millions of fans globally. Assume your data shows that a large segment of users, casual fans, only open the app on matchdays to check live scores. Between games, this segment's DAU drops to near zero. FotMob wants to increase engagement between matchdays without alienating their core power users (die-hard fans who already use the app daily). You are the PM for user engagement. Design a feature to bring casual fans back between matches.",
        questions: [
          "What do you know about the casual fan, their motivation, context, and what they care about?",
          "What are 3 distinct feature ideas to bring them back between matchdays? For each, describe the user value and the risk.",
          "Which one would you prioritise and why?",
          "What does your MVP look like?",
          "How would you measure success?"
        ]
      },
      dimensions: [
        {
          name: "User Understanding",
          score_3: "Demonstrates genuine insight into casual-fan motivation and context, distinguishing them meaningfully from power users. Strong answers typically address what casual fans care about, their usage context, and what between-match content would or would not resonate for them — but other credible, well-reasoned interpretations of casual-fan behaviour qualify equally.",
          score_2: "Identifies some casual-fan needs (e.g. they want quick or easy content) but the insight is surface-level — does not explain the underlying motivation or the contrast with power-user needs.",
          score_1: "Treats casual fans the same as power users, or ignores their motivations — e.g. proposes features clearly designed for die-hard fans (deep stats, tactical breakdowns) without acknowledging the different user need."
        },
        {
          name: "Feature Breadth & Insight",
          score_3: "Three meaningfully different ideas, each with a distinct mechanism for bringing casual fans back between matches. Each idea clearly states the user value and the risk.",
          score_2: "Either three ideas present with overlap in mechanism or incomplete value/risk articulation, OR two strong, meaningfully different ideas with clearly stated value and risks — both reflect partial achievement of this dimension.",
          score_1: "Only one idea, or multiple ideas that are essentially the same mechanism restated (e.g. several variations of push notifications with no distinct feature design)."
        },
        {
          name: "Prioritisation Reasoning",
          score_3: "Justifies the chosen feature using user value for casual fans, implementation feasibility, any relevant product advantage, trade-offs against the other ideas, and the guardrail of not disrupting power users.",
          score_2: "Makes a reasonable choice with some reasoning — cites user value or feasibility — but does not compare the chosen feature against the alternatives or does not address the power-user guardrail.",
          score_1: "Picks a feature without justifying it against the other ideas or against the casual fan's actual motivation."
        },
        {
          name: "MVP Scoping",
          score_3: "Strips the chosen feature to its minimum testable version with an explicit assumption being tested and a clear signal that would justify further investment. The MVP tests the hook before building the full experience.",
          score_2: "Reduces scope but does not articulate a clear learning objective — describes a smaller build without explaining what it is testing or what result would warrant continued investment.",
          score_1: "Describes the full feature as the MVP, or includes all proposed features, without proposing a smaller test first."
        },
        {
          name: "Success Metrics",
          score_3: "Primary metric targets casual-fan between-matchday engagement specifically, not overall DAU or MAU. Includes secondary retention measures for that segment and a guardrail that power-user engagement must not decline.",
          score_2: "Cites a relevant metric but is missing either the segment-specific framing, a secondary metric, or a power-user guardrail.",
          score_1: "Uses overall DAU, MAU, or vague engagement language that does not distinguish the casual-fan segment from the broader user base."
        }
      ]
    },

    // ─────────────────────────────────────────────────────────────────
    // 2. CRICBUZZ
    // ─────────────────────────────────────────────────────────────────
    {
      caseId: "case-study-cricbuzz",
      title: "Cricbuzz, Three Features, One Engineering Team",
      notes: "All three feature choices (vernacular, fantasy, smartwatch) can earn full marks on Decision & Reasoning if the argument is sufficiently strong, internally consistent, and addresses the engineering constraint.",
      scenario: {
        context: "Cricbuzz is India's largest cricket scores and news platform, with 50M+ monthly active users. Three internal teams have each proposed a feature for the next quarter, but there's only engineering capacity to ship one. The three proposals are:\n1. Live score widgets for smartwatches (Apple Watch + Wear OS)\n2. Fantasy cricket integration — allow users to build and track fantasy teams within Cricbuzz\n3. Vernacular language support — localise the app into 6 regional Indian languages (Hindi, Tamil, Telugu, Kannada, Bengali, Marathi)\n\nYou are the CPO. Which do you ship and why?",
        questions: [
          "What framework or criteria would you use to evaluate these three options?",
          "Walk through your evaluation of each feature against those criteria.",
          "Which feature do you choose, and what is your reasoning?",
          "What are the risks of your choice, and how would you mitigate them?",
          "What does success look like?"
        ]
      },
      dimensions: [
        {
          name: "Framework Clarity",
          score_3: "Defines explicit, appropriate criteria before evaluating — e.g. user reach, strategic fit, revenue potential, defensibility, implementation complexity. Applies the same criteria consistently to all three options.",
          score_2: "States relevant criteria but applies them inconsistently — e.g. evaluates reach and complexity for two options but not the third, or defines criteria after already revealing a preference.",
          score_1: "Provides no evaluation criteria — jumps directly to a preference without a structured framework."
        },
        {
          name: "Feature Evaluation Depth",
          score_3: "Covers meaningful trade-offs across user, strategic, commercial, and delivery dimensions for all three features. The learner may challenge received assumptions — e.g. argue that smartwatch penetration in India is growing faster than commonly assumed, or that fantasy's strategic risks are overstated — provided the challenge is evidence-aware and the trade-offs for all three options are addressed.",
          score_2: "Evaluates all three options but overlooks at least one major trade-off dimension, or only two of the three are evaluated in depth.",
          score_1: "Evaluates only one or two of the three options meaningfully, or treats all three as roughly equivalent without differentiation."
        },
        {
          name: "Decision & Reasoning",
          score_3: "Makes an evidence-aware decision aligned with the criteria the learner defined. The reasoning is explicit, accounts for the engineering constraint (one team, one quarter), and acknowledges the trade-offs of the unchosen options. Any of the three features can earn full marks if the argument is sufficiently strong and internally consistent.",
          score_2: "Makes a defensible choice with some reasoning but the connection to the stated criteria is incomplete, the engineering constraint is not addressed, or the trade-offs of the unchosen options are not acknowledged.",
          score_1: "Makes a choice driven by personal preference or unsupported claims — no connection to stated criteria or engineering context."
        },
        {
          name: "Risk Identification",
          score_3: "Names specific risks for the chosen feature with credible mitigation for each. Mitigations are actionable, not generic — e.g. names a concrete mechanism to address the risk rather than 'monitor and iterate'.",
          score_2: "Identifies relevant risks for the chosen feature but mitigations are vague or incomplete — names the right risks without explaining how to address them.",
          score_1: "States generic risks without specifics or mitigation — e.g. 'it might not work' or 'users might not like it'."
        },
        {
          name: "Success Metrics",
          score_3: "Defines success in terms of the specific user problem the chosen feature solves — metrics are feature-specific, include adoption or engagement outcomes, and include at least one guardrail.",
          score_2: "Cites relevant metrics but weakly connected to the feature's objective — e.g. overall engagement growth rather than feature-specific or segment-specific measures.",
          score_1: "Uses vanity metrics with no connection to the feature shipped — e.g. 'downloads increase' or 'DAU goes up'."
        }
      ]
    },

    // ─────────────────────────────────────────────────────────────────
    // 3. SPOTIFY
    // ─────────────────────────────────────────────────────────────────
    {
      caseId: "case-study-spotify",
      notes: "Do not favour the model answer's algorithm-quality hypothesis. Any specific, falsifiable hypothesis with a credible discriminating test earns full marks on Root Cause Hypothesis.",
      scenario: {
        context: "Spotify's Discover Weekly playlist — a personalized weekly playlist delivered every Monday — has seen a 15% drop in 'full listen-through rate' (users listening to at least 80% of the playlist) over the past 8 weeks. Your team owns Discover Weekly. The head of product asks you to diagnose what's happening and propose next steps.",
        questions: [
          "What are the possible root causes of this drop? (Structure your investigation across user, product, and external factors)",
          "What data would you pull to narrow down the cause?",
          "What's your initial hypothesis, and what experiment would you run to test it?",
          "If confirmed, what specific features or changes would you propose?",
          "How would you measure whether your proposed solution worked, and what guardrail metrics would you monitor?"
        ]
      },
      dimensions: [
        {
          name: "Problem Decomposition",
          score_3: "Generates a broad, logically structured set of plausible hypotheses covering both internal factors (product changes, algorithmic changes, feature modifications) and external or contextual factors (user behaviour shifts, seasonal patterns, competitive landscape). The investigation is sufficiently wide to avoid anchoring on a single cause too early. Explicit category labels are not required.",
          score_2: "Identifies multiple possible causes but the structure is weak — either all hypotheses cluster around one type of cause, or causes are listed without any organising logic that would guide a systematic investigation.",
          score_1: "Assumes a single cause without exploring alternatives — e.g. states 'the algorithm got worse' as a conclusion rather than one hypothesis among several."
        },
        {
          name: "Data-Driven Investigation",
          score_3: "Requests specific metrics, cohorts, and comparisons and explains what each would reveal about which hypothesis it supports or rules out. The data plan is designed to discriminate between causes, not just describe the symptom.",
          score_2: "Requests relevant metrics but does not connect each data request to a specific hypothesis — the reader cannot tell which data would confirm or rule out which cause.",
          score_1: "States 'we should look at the data' or 'pull engagement metrics' without specifying what to look for or how to segment."
        },
        {
          name: "Root Cause Hypothesis",
          score_3: "States a specific, falsifiable hypothesis — names the exact mechanism that would cause the observed drop — and proposes a credible discriminating test that would confirm or rule it out. The test must distinguish this hypothesis from alternatives.",
          score_2: "States a plausible hypothesis with a direction for investigation but the proposed test is vague or would not discriminate between causes.",
          score_1: "States an unsupported or untestable hypothesis — no mechanism is explained and no test is proposed, or the hypothesis is a restatement of the symptom."
        },
        {
          name: "Proposed Solution",
          score_3: "Proposes a specific, feasible intervention that is explicitly conditional on the validated hypothesis. The solution follows directly from the confirmed cause and is proportionate to it.",
          score_2: "Proposes a plausible solution but the link to the specific hypothesis is not made explicit — a reasonable idea that is not tied to the cause the learner identified.",
          score_1: "Proposes a generic change — 'improve the algorithm', 'make better recommendations' — without specifics or connection to the diagnosed cause."
        },
        {
          name: "Metrics for Success",
          score_3: "Defines success as listen-through-rate recovery to the pre-drop baseline with a comparison period specified. Includes at least one leading or diagnostic indicator and at least one guardrail metric.",
          score_2: "Names listen-through rate as the success metric but is missing a comparison baseline, a timeframe, or any guardrail.",
          score_1: "Does not define a meaningful success measure, or defines success in terms of a vanity metric unconnected to the diagnosed problem."
        }
      ]
    },

    // ─────────────────────────────────────────────────────────────────
    // 4. SWIGGY
    // ─────────────────────────────────────────────────────────────────
    {
      caseId: "case-study-swiggy",
      notes: "The increase from 8% to 10% is 25% relative (the stated spike) or 2 percentage points absolute. Both framings are acceptable; penalise only if the learner confuses relative and absolute in a way that affects their success definition.",
      scenario: {
        context: "Swiggy is one of India's largest food delivery platforms, operating in 500+ cities. Last week, your data team flagged that the order cancellation rate has increased by 25% over the past two weeks, from 8% to 10%. This is now the highest it has been in 18 months. You are the PM for the consumer experience team. The Head of Product wants your analysis and a plan by end of week.",
        questions: [
          "What clarifying questions would you ask before investigating?",
          "What are your top hypotheses for the spike? Rank them by likelihood.",
          "What data would you pull to validate or rule out each hypothesis?",
          "How would you segment the data to narrow down the cause?",
          "Based on your most likely hypothesis, what fix would you propose?",
          "How would you define success after the fix?"
        ]
      },
      dimensions: [
        {
          name: "Clarifying Questions",
          score_3: "Establishes the key context dimensions before investigating: where in the order journey the cancellation is happening, who is initiating it, where it is concentrated, how the metric is measured, and what changed recently in the product or operations. Strong answers address most of these; not every dimension is mandatory if the ones covered are well-chosen.",
          score_2: "Asks some useful clarifying questions but misses at least one critical dimension — most commonly fails to ask about cancellation stage or fails to distinguish customer-initiated from system-initiated cancellations.",
          score_1: "Dives into hypotheses without asking any clarifying questions about cancellation context, or asks only surface-level questions that do not direct the investigation."
        },
        {
          name: "Hypothesis Quality",
          score_3: "Generates diverse, plausible hypotheses that span the full order journey, ranked with explicit reasoning about likelihood. The illustrative examples — ETA spike, restaurant acceptance rate drop, UI change, payment data issue, external factors — represent strong answers but are not an exhaustive checklist. Any set of diverse, ranked, mechanism-based explanations spanning multiple journey stages qualifies.",
          score_2: "Lists multiple plausible causes but ranking is absent or based on intuition rather than reasoning, or one or two hypotheses are generic without connecting to a specific mechanism in the order journey.",
          score_1: "States one generic cause or lists unrelated guesses without connecting them to the order journey or the two-week spike pattern."
        },
        {
          name: "Data Investigation",
          score_3: "Specifies exactly what to pull and what signal each data request would produce to confirm or rule out a specific hypothesis. The investigation plan has explicit 'if I see X, that implicates hypothesis Y' reasoning.",
          score_2: "Requests useful data but does not connect each request to a specific hypothesis — the investigation plan lacks explicit discriminating logic.",
          score_1: "Says 'look at cancellation data' or 'pull analytics' without specifying breakdowns, comparisons, or time windows."
        },
        {
          name: "Segmentation Depth",
          score_3: "Segments by multiple meaningful dimensions and explicitly states what each segment would reveal about the cause. Each segmentation choice is diagnostic, not just exploratory.",
          score_2: "Segments the data by some relevant dimensions but does not connect each segment to a hypothesis — the segmentation is exploratory rather than diagnostic.",
          score_1: "Looks at the overall cancellation rate only, or suggests a single segment without explaining what it would reveal."
        },
        {
          name: "Fix Quality",
          score_3: "Proposes a specific, feasible intervention that is explicitly conditional on the confirmed root cause. The fix addresses the mechanism identified, with a validation step.",
          score_2: "Proposes a plausible fix but the link to the specific root cause is implicit rather than stated — a reasonable idea that could apply to multiple causes.",
          score_1: "Proposes a generic fix unrelated to any diagnosed cause — e.g. 'send users a discount to not cancel' without connecting to what is driving the spike."
        },
        {
          name: "Success Definition",
          score_3: "Defines success as cancellation rate recovering to the 8% baseline within a specified timeframe, with a leading indicator that would confirm the fix is working before the primary metric recovers, and guardrail metrics that ensure the fix does not damage adjacent health (e.g. customer satisfaction, restaurant NPS).",
          score_2: "States a target (return to 8% baseline) but is missing at least one of: a timeframe, a leading indicator, or guardrail metrics.",
          score_1: "Defines success vaguely — 'cancellations go down' or 'the rate improves' — with no baseline, timeframe, leading indicator, or guardrail."
        }
      ]
    }

  ]
};
