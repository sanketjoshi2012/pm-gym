import GRADER_RUBRIC from '../../js/grader-rubric.js';

const caseMap = new Map(GRADER_RUBRIC.cases.map(c => [c.caseId, c]));

export function buildGradingContext(case_id, answer) {
  const spec = caseMap.get(case_id);
  // case_id is guaranteed valid — validateInput checked it before this is called

  return {
    case_id,
    title: spec.title,
    scenario: {
      context: spec.scenario.context,
      questions: spec.scenario.questions,
    },
    // Scoring anchors for every dimension — model answer is never included
    dimensions: spec.dimensions.map(d => ({
      name: d.name,
      score_3: d.score_3,
      score_2: d.score_2,
      score_1: d.score_1,
    })),
    notes: spec.notes ?? null,
    universalRules: GRADER_RUBRIC.universalRules,
    answer,
  };
}
