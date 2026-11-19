// Synthetic calibration answers for the initial Haiku 5.5 test run.
// These are NOT the real Cohort 21 answers from Section 5. They exist to exercise the adapter
// against different answer qualities before we spend money on real calibration.
// quality: "strong" | "medium" | "weak" | "trap"

export const CALIBRATION_ANSWERS = [
  {
    label: 'FotMob — strong',
    case_id: 'case-study-fotmob',
    quality: 'strong',
    answer: `The casual fan watches football as entertainment, not identity. They open FotMob to settle an argument, check a score during lunch, or glance at a weekend fixture. Between matches they have no job for the app, which is why their DAU collapses. Three ideas to bring them back. One, a 60-second Sunday morning recap video for the leagues they follow, pushed as a notification; value is a low-effort weekly hit of context, risk is video content cost. Two, an "ask FotMob" lightweight AI explainer that answers questions like "why is Haaland not playing" in one line; value is turning passive curiosity into a visit, risk is answer quality. Three, a transfer-rumour digest curated for the user's clubs; value is tapping fandom's gossip loop, risk is clickbait reputation damage. I would ship the Sunday recap first. It needs no new editorial pipeline, aligns with their existing league coverage, and tests the core assumption that casual fans want a scheduled weekly touch rather than ad-hoc content. MVP: produce the recap for one top league, send to a 10% hold-out of users whose last session was over 48 hours ago. Success measured on casual-fan segment Monday-to-Thursday return rate, 14-day retention of that segment, and a power-user guardrail of no change in power-user session depth. Signal that would justify more investment: +5 percentage points return rate in the recap cohort versus control, with no drop in power-user engagement.`,
  },
  {
    label: 'FotMob — weak',
    case_id: 'case-study-fotmob',
    quality: 'weak',
    answer: `Casual fans like football. They want to see scores. The feature I would build is advanced tactical analysis with heatmaps and xG models so people can really understand the game between matches. Three ideas: more statistics, deeper player comparisons, and live tactical commentary during replays. I would pick the heatmap feature because it shows commitment to the hardcore community. MVP would be the full heatmap experience shipped to everyone. Success is measured by overall DAU going up and session length increasing across the whole user base. This will bring casual fans back because once they see how deep the data is, they will want to spend more time in the app learning about the game, and FotMob will become the deepest football app on the market, which is what casual fans secretly want.`,
  },
  {
    label: 'Cricbuzz — strong',
    case_id: 'case-study-cricbuzz',
    quality: 'strong',
    answer: `My criteria, applied to all three: user reach in India, strategic fit with Cricbuzz's content moat, revenue defensibility, and engineering complexity for one team in one quarter. Vernacular scores high on reach because a large share of the next 100M internet users will not read English comfortably; strategic fit is strong because content, not UI, is Cricbuzz's moat; revenue is indirect, through ads on expanded reach; complexity is high but mostly content translation, not engineering. Fantasy scores high on revenue and engagement but strategically risky because it puts Cricbuzz in competition with Dream11 and MPL who have head-start on brand, licences and user trust; complexity is high because of real-money regulation. Smartwatch scores high on delight for a power niche but tiny reach in India today; strategic fit weak because it is a channel extension, not a content moat move. I choose vernacular. The engineering constraint is manageable because translation is content work, which Cricbuzz already does operationally for commentary. Risks: translation quality and regional-specific moderation. Mitigations: launch with Hindi only, pair with existing regional editorial team for review, and keep English as default so we do not disrupt core users. Success looks like 15% of new signups in the launch regions selecting the Hindi UI within three months, with a guardrail that English-user session length does not drop.`,
  },
  {
    label: 'Cricbuzz — medium',
    case_id: 'case-study-cricbuzz',
    quality: 'medium',
    answer: `I would use reach, revenue, and complexity. Vernacular has huge reach because Hindi is widely spoken, fantasy has revenue because of in-app purchases, and smartwatch has low reach and low revenue. I pick fantasy because it directly makes money and that is what the business needs. Risks are that Dream11 is bigger, which we could handle by marketing hard. Success is money earned in the first quarter, and we aim for a crore in revenue.`,
  },
  {
    label: 'Spotify — strong',
    case_id: 'case-study-spotify',
    quality: 'strong',
    answer: `Possible root causes span three layers. User side: shifts in listening habits, new competing services (short-form audio, podcasts), or the drop concentrated in a cohort reaching the end of a free trial. Product side: a change to the recommendation algorithm, a UI change that buries the playlist in the home feed, a bug in playback completion attribution, or a change in playlist length. External: seasonality, device or OS updates breaking background playback, or a regional outage. Data to pull: full listen-through rate segmented by new versus returning users, by country, by device, and by cohort quarter-over-quarter. Look at algorithm change log against the start of the decline. Pull position-in-feed data to check if the playlist's prominence changed. My hypothesis is a ranking change on the home feed moved Discover Weekly down-fold for returning users, so it gets opened less rather than listened less once opened. Discriminating test: compare opens-per-delivery and completion-given-open separately. If opens dropped and completion held, it is a discovery problem not a quality problem. Experiment: bring the module back to its previous position for a 10% cohort. Proposed solution conditional on that: restore the position and add a mid-week re-surface push if the user has unopened content. Success: listen-through rate recovers to pre-drop baseline within four weeks; leading indicator is opens-per-delivery; guardrails: overall home-feed CTR and session length.`,
  },
  {
    label: 'Spotify — weak',
    case_id: 'case-study-spotify',
    quality: 'weak',
    answer: `The algorithm got worse. Spotify's recommendations have been slipping for a while and this shows it. We should pull the data and look at it. My hypothesis is the algorithm. To test it I would run an A/B test with a better algorithm. If it is confirmed I would improve the algorithm. Success is when the metric goes back up again, which is what matters here because if listen-through rate recovers then we know we fixed it. Monitor the metric weekly.`,
  },
  {
    label: 'Swiggy — strong',
    case_id: 'case-study-swiggy',
    quality: 'strong',
    answer: `Clarifying questions first. At which point in the order journey is the cancellation being counted, and is this customer-cancel, restaurant-reject, or system-cancel due to no delivery partner? Is the 25% relative, so 8% to 10%, or absolute? Any city or cuisine concentration? Any product, pricing, or ETA changes shipped in the window? My hypotheses, ranked. One, ETA promise accuracy has worsened because of rider shortage, so customers cancel after seeing a jumped ETA mid-order. Two, a restaurant-side reject spike due to supply issues during a festival or weather event. Three, a payment failure cascading into cancellations. Four, a UI change that made cancel too easy. Five, a bot or fraud wave. Data to pull: cancellation stage breakdown by week; delivery time between promise and dispatch, by city; restaurant reject rate; new user versus returning user cancel rate; payment method mix for cancelled orders. Segment by city, time-of-day, restaurant type, and new vs returning. If cancels concentrate post-dispatch in specific cities with higher delivery delays, that implicates hypothesis one. Fix if confirmed: cap promised ETA surge, pause the aggressive promise band during rider-shortage hours, and offer a "wait or cancel" nudge with a small credit. Success: cancellation rate returns to 8% within two weeks; leading indicator is promise-to-dispatch delta; guardrails are average order value, customer NPS, and restaurant acceptance rate so the fix does not shift the problem.`,
  },
  {
    label: 'Swiggy — trap (keyword-stuffed)',
    case_id: 'case-study-swiggy',
    quality: 'trap',
    answer: `I would apply the CIRCLES framework starting with Comprehend the situation, then Identify customer, then Report customer needs, then Cut, List solutions, Evaluate trade-offs, and Summarise. For hypotheses I would use the HEART framework: Happiness, Engagement, Adoption, Retention, Task success. Data investigation via AARRR funnel: Acquisition, Activation, Retention, Referral, Revenue. Segmentation would use RICE prioritisation: Reach, Impact, Confidence, Effort. My fix would use the Build Measure Learn loop. Success metrics would include North Star Metric, OKRs, KPIs, and we would monitor via dashboards. I would also leverage Jobs To Be Done and Blue Ocean strategy to find the underlying need and ship a solution that creates a new category rather than competing on cancellations. Growth hacking would help us iterate quickly. This is a classic product-market-fit problem that needs first-principles thinking.`,
  },
  {
    label: 'Spotify — medium',
    case_id: 'case-study-spotify',
    quality: 'medium',
    answer: `Possible causes: the algorithm changed, users got bored of the format, or something in the UI changed. I would pull the data on listen-through rate over the 8 weeks and compare with the previous period. Also check for any product releases in the window. Hypothesis is a change in recommendations. To test I would compare segments before and after. If confirmed I would roll back the change and investigate. Success is listen-through rate going back to where it was. Guardrails: overall engagement should not drop.`,
  },
  {
    label: 'FotMob — medium',
    case_id: 'case-study-fotmob',
    quality: 'medium',
    answer: `Casual fans only open the app on matchdays because they care about the result, not the deeper game. They probably want quick, light content between matches. Three ideas: a daily news digest, a predictions game, and short highlight clips. I would pick the highlights because video is engaging. MVP is a feed of three clips a day, personalised to the user's favourite teams. Success measured by daily opens in the casual segment and clicks on the clips. Risk is content licensing cost, which we would need to work around.`,
  },
];
