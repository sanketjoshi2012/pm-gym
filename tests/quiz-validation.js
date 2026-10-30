// Quiz data validation — run with: node tests/quiz-validation.js
// Checks structure, answer distribution, and that no single-position sweep passes all quizzes.

const fs = require('fs');
const path = require('path');

// Load data.js by extracting the object literal
const src = fs.readFileSync(path.join(__dirname, '../js/data.js'), 'utf8');
const match = src.match(/^const PM_GYM_DATA\s*=\s*([\s\S]+?);\s*$/m);
if (!match) { console.error('FAIL: could not extract PM_GYM_DATA'); process.exit(1); }
const PM_GYM_DATA = eval('(' + match[1] + ')');

let passed = 0;
let failed = 0;

function assert(condition, label) {
  if (condition) {
    console.log('  PASS:', label);
    passed++;
  } else {
    console.error('  FAIL:', label);
    failed++;
  }
}

// Collect all non-case-study quiz questions
const allQuestions = [];
const perQuiz = [];

PM_GYM_DATA.levels.forEach(level => {
  level.topics.forEach(topic => {
    if (topic.isCaseStudy || !Array.isArray(topic.quiz) || topic.quiz.length === 0) return;
    const quizQuestions = [];
    topic.quiz.forEach((q, idx) => {
      const ref = `${topic.id} Q${idx + 1}`;
      allQuestions.push({ ref, q });
      quizQuestions.push({ ref, q });
    });
    perQuiz.push({ topicId: topic.id, questions: quizQuestions });
  });
});

console.log('\n--- Structural checks ---');

allQuestions.forEach(({ ref, q }) => {
  assert(Array.isArray(q.options) && q.options.length === 4, `${ref}: exactly 4 options`);
  assert(typeof q.correct === 'number' && q.correct >= 0 && q.correct <= 3, `${ref}: correct index 0-3`);
  assert(typeof q.explanation === 'string' && q.explanation.length > 10, `${ref}: explanation present`);
  const correctText = q.options[q.correct];
  assert(typeof correctText === 'string' && correctText.length > 0, `${ref}: correct option is non-empty string`);
});

console.log('\n--- Distribution: overall ---');

const counts = [0, 0, 0, 0];
allQuestions.forEach(({ q }) => counts[q.correct]++);
const total = allQuestions.length;
console.log(`  A=${counts[0]}  B=${counts[1]}  C=${counts[2]}  D=${counts[3]}  total=${total}`);
assert(total === 35, 'Total of 35 quiz questions');
counts.forEach((c, i) => {
  assert(c >= 6 && c <= 12, `Answer ${['A','B','C','D'][i]}=${c} within 6-12 (balanced)`);
});

console.log('\n--- Distribution: per quiz ---');

perQuiz.forEach(({ topicId, questions }) => {
  const qCounts = [0, 0, 0, 0];
  questions.forEach(({ q }) => qCounts[q.correct]++);
  console.log(`  ${topicId}: A=${qCounts[0]} B=${qCounts[1]} C=${qCounts[2]} D=${qCounts[3]}`);
  assert(
    !qCounts.some(c => c === 5),
    `${topicId}: no single answer position holds all 5 questions`
  );
  assert(
    !qCounts.some(c => c >= 4),
    `${topicId}: no single answer position holds 4+ of 5 questions`
  );
});

console.log('\n--- Sweep test: always picking same letter never passes all 7 quizzes ---');

[0, 1, 2, 3].forEach(pos => {
  const label = ['A', 'B', 'C', 'D'][pos];
  let quizzesPassed = 0;
  perQuiz.forEach(({ topicId, questions }) => {
    const correct = questions.filter(({ q }) => q.correct === pos).length;
    if (correct === questions.length) quizzesPassed++;
  });
  assert(quizzesPassed === 0, `Always picking ${label} passes 0 of ${perQuiz.length} quizzes (got ${quizzesPassed})`);
});

console.log('\n--- Summary ---');
console.log(`  Passed: ${passed}  Failed: ${failed}`);
if (failed > 0) process.exit(1);
