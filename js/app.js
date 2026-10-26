// PM Gym, Application Logic

const STORAGE_KEYS = {
  STREAK: 'pmgym_streak',
  LAST_ACTIVE: 'pmgym_last_active',
  COMPLETED_TOPICS: 'pmgym_completed',
  QUIZ_SCORES: 'pmgym_scores',
  DARK_MODE: 'pmgym_dark',
  CASE_ANSWERS: 'pmgym_case_answers',
  LESSON_DONE: 'pmgym_lessons',
};

// ─── State ───────────────────────────────────────────────────────────────────

let state = {
  currentView: 'landing',
  currentLevel: null,
  currentTopic: null,
  currentTab: 'lesson',
  quizState: {
    currentQ: 0,
    answers: [],
    answered: false,
  },
  completedTopics: new Set(),
  quizScores: {},
  lessonsDone: new Set(),
  streak: 0,
  lastActive: null,
  caseAnswers: {},
};

// ─── Storage ─────────────────────────────────────────────────────────────────

function loadState() {
  try {
    const completed = JSON.parse(localStorage.getItem(STORAGE_KEYS.COMPLETED_TOPICS) || '[]');
    state.completedTopics = new Set(completed);

    const scores = JSON.parse(localStorage.getItem(STORAGE_KEYS.QUIZ_SCORES) || '{}');
    state.quizScores = scores;

    const lessons = JSON.parse(localStorage.getItem(STORAGE_KEYS.LESSON_DONE) || '[]');
    state.lessonsDone = new Set(lessons);

    state.streak = parseInt(localStorage.getItem(STORAGE_KEYS.STREAK) || '0');
    state.lastActive = localStorage.getItem(STORAGE_KEYS.LAST_ACTIVE);

    const cases = JSON.parse(localStorage.getItem(STORAGE_KEYS.CASE_ANSWERS) || '{}');
    state.caseAnswers = cases;

    // Load theme
    const darkMode = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
    if (darkMode === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else if (darkMode === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    }

    updateStreak();
  } catch (e) {
    // Graceful fallback, storage might be blocked
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEYS.COMPLETED_TOPICS, JSON.stringify([...state.completedTopics]));
    localStorage.setItem(STORAGE_KEYS.QUIZ_SCORES, JSON.stringify(state.quizScores));
    localStorage.setItem(STORAGE_KEYS.LESSON_DONE, JSON.stringify([...state.lessonsDone]));
    localStorage.setItem(STORAGE_KEYS.STREAK, String(state.streak));
    localStorage.setItem(STORAGE_KEYS.LAST_ACTIVE, state.lastActive || '');
    localStorage.setItem(STORAGE_KEYS.CASE_ANSWERS, JSON.stringify(state.caseAnswers));
  } catch (e) {}
}

// ─── Streak ───────────────────────────────────────────────────────────────────

function updateStreak() {
  const today = new Date().toDateString();
  const last = state.lastActive;

  if (!last) {
    // First time
    return;
  }

  const lastDate = new Date(last);
  const todayDate = new Date();
  const diffDays = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));

  if (diffDays > 1) {
    // Streak broken
    state.streak = 0;
    saveState();
  }
}

function recordActivity() {
  const today = new Date().toDateString();
  const last = state.lastActive;

  if (last !== today) {
    if (last) {
      const lastDate = new Date(last);
      const todayDate = new Date();
      const diffDays = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        state.streak += 1;
      } else if (diffDays > 1) {
        state.streak = 1;
      } else {
        state.streak = Math.max(state.streak, 1);
      }
    } else {
      state.streak = 1;
    }

    state.lastActive = today;
    saveState();
    renderStreakBadge();
  }
}

// ─── Theme ────────────────────────────────────────────────────────────────────

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  try { localStorage.setItem(STORAGE_KEYS.DARK_MODE, next); } catch (e) {}
  updateThemeIcon();
}

function updateThemeIcon() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const btn = document.getElementById('themeToggle');
  if (btn) {
    btn.innerHTML = isDark
      ? '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>'
      : '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>';
  }
}

// ─── Navigation ───────────────────────────────────────────────────────────────

function viewToHash(viewName, data = {}) {
  if (viewName === 'module') return `#module/${data.levelId}/${data.topicId}`;
  if (viewName === 'topics') return `#topics/${data.levelId}`;
  if (viewName === 'landing') return '#home';
  return `#${viewName}`;
}

function hashToView(hash) {
  if (!hash || hash === '#' || hash === '#home') return { viewName: 'landing', data: {} };
  const parts = hash.slice(1).split('/');
  if (parts[0] === 'module' && parts[1] && parts[2]) return { viewName: 'module', data: { levelId: parts[1], topicId: parts[2] } };
  if (parts[0] === 'topics' && parts[1]) return { viewName: 'topics', data: { levelId: parts[1] } };
  return { viewName: parts[0], data: {} };
}

function showView(viewName, data = {}, { pushHash = true } = {}) {
  // Hide all views
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));

  // Show target
  const view = document.getElementById(`view-${viewName}`);
  if (view) view.classList.add('active');

  state.currentView = viewName;
  state.currentData = data;

  // Update nav active state
  document.querySelectorAll('.nav-link, .mobile-nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === viewName);
  });

  // Update URL hash without triggering hashchange
  if (pushHash) {
    const hash = viewToHash(viewName, data);
    if (window.location.hash !== hash) {
      history.pushState(null, '', hash);
    }
  }

  window.scrollTo(0, 0);

  // Render content for view
  if (viewName === 'levels') renderLevelCards();
  if (viewName === 'topics') renderTopics(data.levelId);
  if (viewName === 'module') renderModule(data.levelId, data.topicId);
  if (viewName === 'dashboard') renderDashboard();
  if (viewName === 'library') renderLibrary();
  if (viewName === 'about') renderAbout();
}

function navigateFromHash() {
  const { viewName, data } = hashToView(window.location.hash);
  showView(viewName, data, { pushHash: false });
}

// ─── Render: Streak Badge ─────────────────────────────────────────────────────

function renderStreakBadge() {
  const badge = document.getElementById('streakBadge');
  if (badge) {
    badge.querySelector('.streak-count').textContent = state.streak;
    badge.style.display = state.streak > 0 ? 'flex' : 'none';
  }
}

// ─── Render: Level Cards ──────────────────────────────────────────────────────

function renderLevelCards() {
  const grid = document.getElementById('levelsGrid');
  if (!grid) return;

  grid.innerHTML = PM_GYM_DATA.levels.map(level => {
    const topicCount = level.topics.length;
    const doneCount = level.topics.filter(t => state.completedTopics.has(t.id)).length;
    const pct = topicCount ? Math.round((doneCount / topicCount) * 100) : 0;

    const caseStudies = level.topics.filter(t => t.isCaseStudy);
    const nonCaseStudies = level.topics.filter(t => !t.isCaseStudy);
    const caseStudyDone = caseStudies.filter(t => state.completedTopics.has(t.id)).length;

    const topicItems = nonCaseStudies.map(t => {
      const done = state.completedTopics.has(t.id);
      return `<div class="level-topic-item ${done ? 'done' : ''}">
        <div class="topic-dot"></div>
        ${t.title}
      </div>`;
    });

    if (caseStudies.length > 0) {
      const allDone = caseStudyDone === caseStudies.length;
      topicItems.push(`<div class="level-topic-item ${allDone ? 'done' : ''}">
        <div class="topic-dot"></div>
        Case Studies (${caseStudies.length})
      </div>`);
    }

    const topicsHTML = topicItems.join('');

    return `
      <div class="level-card" onclick="showView('topics', {levelId: '${level.id}'})">
        <div class="level-icon">
          <span class="level-badge">LEVEL ${level.id === 'beginner' ? '01' : level.id === 'intermediate' ? '02' : '03'}</span>
        </div>
        <div class="level-title">${level.title}</div>
        <div class="level-subtitle">"${level.subtitle}"</div>
        <div class="level-desc">${level.description}</div>
        <div class="level-topics">${topicsHTML}</div>
        <div class="level-progress-bar">
          <div class="level-progress-fill" style="width: ${pct}%"></div>
        </div>
        <button class="btn-level">
          ${doneCount === 0 ? 'Start Level' : doneCount === topicCount ? '✓ Completed' : 'Continue'}
          <span style="margin-left: auto; opacity: 0.7; font-size: 0.8rem">${doneCount}/${topicCount} done</span>
        </button>
      </div>`;
  }).join('');
}

// ─── Render: Topics List ──────────────────────────────────────────────────────

function renderTopics(levelId) {
  const level = PM_GYM_DATA.levels.find(l => l.id === levelId);
  if (!level) return;
  state.currentLevel = levelId;

  const container = document.getElementById('topicsContainer');
  if (!container) return;

  const doneCount = level.topics.filter(t => state.completedTopics.has(t.id)).length;
  const pct = level.topics.length ? Math.round((doneCount / level.topics.length) * 100) : 0;

  container.innerHTML = `
    <button class="back-btn" onclick="showView('levels')">← Back to Levels</button>
    <div class="level-header">
      <div class="level-header-top">
        <div>
          <span class="level-badge">LEVEL ${level.id === 'beginner' ? '01' : level.id === 'intermediate' ? '02' : '03'}</span>
          <h2 style="margin-top: 0.35rem;">${level.title}</h2>
          <p>${level.description}</p>
        </div>
      </div>
      <div class="overall-progress">
        <div class="overall-progress-bar">
          <div class="overall-progress-fill" style="width: ${pct}%"></div>
        </div>
        <div class="progress-label">${doneCount} / ${level.topics.length} completed</div>
      </div>
    </div>
    <div class="topics-list">
      ${level.topics.map(topic => {
        const done = state.completedTopics.has(topic.id);
        const score = state.quizScores[topic.id];
        const isCaseStudy = topic.isCaseStudy;

        let badges = `<span class="topic-badge badge-duration">${topic.duration}</span>`;
        if (done) badges += `<span class="topic-badge badge-done">✓ Completed</span>`;
        if (isCaseStudy) badges += `<span class="topic-badge badge-case">Case Study</span>`;
        if (score !== undefined && !isCaseStudy) {
          const pct = Math.round((score.correct / score.total) * 100);
          badges += `<span class="topic-badge badge-score">Quiz: ${score.correct}/${score.total}</span>`;
        }

        return `
          <div class="topic-card ${done ? 'completed' : ''} ${isCaseStudy ? 'case-study' : ''}"
               onclick="showView('module', {levelId: '${levelId}', topicId: '${topic.id}'})">
            <div class="topic-left">
              <div class="topic-title">${topic.title}</div>
              <div class="topic-meta">${badges}</div>
            </div>
            <div class="topic-arrow">→</div>
          </div>`;
      }).join('')}
    </div>`;
}

// ─── Render: Module ────────────────────────────────────────────────────────────

function renderModule(levelId, topicId) {
  const level = PM_GYM_DATA.levels.find(l => l.id === levelId);
  if (!level) return;

  const topic = level.topics.find(t => t.id === topicId);
  if (!topic) return;

  state.currentLevel = levelId;
  state.currentTopic = topicId;
  state.currentTab = 'lesson';

  const container = document.getElementById('moduleContainer');
  if (!container) return;

  recordActivity();

  const isCaseStudy = topic.isCaseStudy;

  if (isCaseStudy) {
    renderCaseStudy(container, topic, levelId);
    return;
  }

  // Reset quiz state
  state.quizState = { currentQ: 0, answers: [], answered: false };

  const tabs = ['lesson', 'quiz'];
  const tabLabels = { lesson: 'Lesson', quiz: 'Quiz' };

  container.innerHTML = `
    <button class="back-btn" onclick="showView('topics', {levelId: '${levelId}'})">← Back to ${level.title}</button>
    <h2 style="margin: 0 0 0.25rem; font-size: 1.5rem;">${topic.title}</h2>
    <p style="color: var(--fg-3); font-size: 0.875rem; margin: 0 0 1.75rem;">${topic.duration}</p>

    <div class="module-tabs">
      ${tabs.map(t => `<button class="tab-btn ${t === 'lesson' ? 'active' : ''}" data-tab="${t}" onclick="switchTab('${t}')">${tabLabels[t]}</button>`).join('')}
    </div>

    <div id="tab-lesson" class="tab-panel active">
      ${renderLessonPanel(topic)}
    </div>
    <div id="tab-quiz" class="tab-panel">
      ${renderQuizPanel(topic)}
    </div>`;
}

function renderLessonPanel(topic) {
  const done = state.lessonsDone.has(topic.id);
  return `
    <div class="lesson-content">
      <h2 style="font-size: 1.5rem; margin: 0 0 1.5rem;">${topic.lesson.title}</h2>
      ${topic.lesson.content}
    </div>
    <button class="lesson-done-btn ${done ? 'completed' : ''}"
            id="lessonDoneBtn"
            onclick="markLessonDone('${topic.id}')">
      ${done ? '✓ Lesson Completed' : 'Mark as Read, Take the Quiz →'}
    </button>`;
}

function renderQuizPanel(topic) {
  return `<div id="quizContent">${buildQuizQuestion(topic, 0)}</div>`;
}

function renderResourcesPanel(topic) {
  if (!topic.resources || !topic.resources.length) return '<p>No resources available.</p>';

  return `<div class="resources-list">
    ${topic.resources.map(r => `
      <a href="${r.url}" target="_blank" rel="noopener" class="resource-item">
        <div class="resource-icon">🔗</div>
        <div class="resource-info">
          <div class="resource-title">${r.title}</div>
          <div class="resource-desc">${r.description}</div>
        </div>
        <div class="resource-arrow">↗</div>
      </a>`).join('')}
  </div>`;
}

function switchTab(tab) {
  state.currentTab = tab;
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('active', p.id === `tab-${tab}`));
}

// ─── Quiz Logic ───────────────────────────────────────────────────────────────

function buildQuizQuestion(topic, qIndex) {
  const quiz = topic.quiz;
  if (!quiz || !quiz.length) return '<p>No quiz available for this topic.</p>';

  if (qIndex >= quiz.length) {
    return buildQuizResults(topic);
  }

  const q = quiz[qIndex];
  const letters = ['A', 'B', 'C', 'D'];
  const answered = state.quizState.answers[qIndex] !== undefined;
  const selectedIdx = state.quizState.answers[qIndex];

  const dotsHTML = quiz.map((_, i) => {
    let cls = 'quiz-dot';
    if (i < state.quizState.answers.length) {
      cls += state.quizState.answers[i] === quiz[i].correct ? ' correct' : ' wrong';
    }
    return `<div class="${cls}"></div>`;
  }).join('');

  const optionsHTML = q.options.map((opt, i) => {
    let cls = 'option-btn';
    if (answered) {
      if (i === q.correct) cls += ' correct';
      else if (i === selectedIdx) cls += ' wrong';
    }
    return `<button class="${cls}" ${answered ? 'disabled' : ''}
              onclick="answerQuestion('${topic.id}', ${qIndex}, ${i})">
              <span class="option-letter">${letters[i]}</span>
              <span>${opt}</span>
            </button>`;
  }).join('');

  const explanationHTML = answered
    ? `<div class="explanation">💡 <strong>Explanation:</strong> ${q.explanation}</div>`
    : '';

  const nextBtn = answered
    ? `<button class="btn-next" onclick="nextQuestion('${topic.id}', ${qIndex + 1})">
        ${qIndex + 1 < quiz.length ? 'Next Question →' : 'See Results →'}
       </button>`
    : `<button class="btn-next" disabled>Select an answer</button>`;

  return `
    <div class="quiz-header">
      <div class="quiz-progress-text">Question ${qIndex + 1} of ${quiz.length}</div>
      <div class="quiz-progress-dots">${dotsHTML}</div>
    </div>
    <div class="question-card">
      <div class="question-text">${q.question}</div>
      <div class="options-list">${optionsHTML}</div>
      ${explanationHTML}
    </div>
    <div class="quiz-nav">
      <span></span>
      ${nextBtn}
    </div>`;
}

function answerQuestion(topicId, qIndex, chosenIdx) {
  const level = PM_GYM_DATA.levels.find(l => l.topics.some(t => t.id === topicId));
  if (!level) return;
  const topic = level.topics.find(t => t.id === topicId);
  if (!topic) return;

  if (state.quizState.answers[qIndex] !== undefined) return;

  state.quizState.answers[qIndex] = chosenIdx;
  state.quizState.answered = true;

  const quizContent = document.getElementById('quizContent');
  if (quizContent) quizContent.innerHTML = buildQuizQuestion(topic, qIndex);
}

function nextQuestion(topicId, nextIdx) {
  const level = PM_GYM_DATA.levels.find(l => l.topics.some(t => t.id === topicId));
  if (!level) return;
  const topic = level.topics.find(t => t.id === topicId);
  if (!topic) return;

  const quizContent = document.getElementById('quizContent');
  if (quizContent) quizContent.innerHTML = buildQuizQuestion(topic, nextIdx);
}

function buildQuizResults(topic) {
  const quiz = topic.quiz;
  const answers = state.quizState.answers;
  const correct = answers.filter((a, i) => a === quiz[i].correct).length;
  const pct = Math.round((correct / quiz.length) * 100);

  // Save score
  state.quizScores[topic.id] = { correct, total: quiz.length, pct };
  saveState();

  let msg, emoji;
  if (pct >= 80) {
    msg = "Excellent work! You've mastered this topic.";
    emoji = "🏆";
  } else if (pct >= 60) {
    msg = "Good effort! Review the explanations and try again.";
    emoji = "📈";
  } else {
    msg = "Keep studying, re-read the lesson and retake the quiz.";
    emoji = "💪";
  }

  // Mark topic as completed if quiz passed
  if (pct >= 60 && state.lessonsDone.has(topic.id)) {
    state.completedTopics.add(topic.id);
    saveState();
    showToast(`✓ "${topic.title}" completed!`);
  }

  const weakAreas = answers.map((a, i) => ({
    q: quiz[i].question,
    correct: a === quiz[i].correct,
  })).filter(a => !a.correct);

  return `
    <div class="quiz-results">
      <div class="result-score-circle">
        <div class="result-score-num">${correct}</div>
        <div class="result-score-denom">/ ${quiz.length}</div>
      </div>
      <div class="result-title">${pct}%, ${pct >= 80 ? 'Mastered' : pct >= 60 ? 'Passed' : 'Needs Practice'}</div>
      <div class="result-desc">${msg}</div>
      ${weakAreas.length > 0 ? `
        <div style="text-align: left; margin-bottom: 1.5rem; padding: 1rem; background: var(--bg-subtle); border-radius: 8px;">
          <div style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--fg-3); margin-bottom: 0.5rem;">Review These:</div>
          ${weakAreas.slice(0, 2).map(w => `<div style="font-size: 0.85rem; color: var(--fg-2); margin-bottom: 0.35rem;">• ${w.q.substring(0, 80)}...</div>`).join('')}
        </div>` : ''}
      <div class="result-actions">
        <button class="btn-secondary" onclick="retakeQuiz('${topic.id}')">↩ Retake Quiz</button>
        <button class="btn-next" onclick="showView('topics', {levelId: '${state.currentLevel}'})">Back to Topics →</button>
      </div>
    </div>`;
}

function retakeQuiz(topicId) {
  const level = PM_GYM_DATA.levels.find(l => l.topics.some(t => t.id === topicId));
  if (!level) return;
  const topic = level.topics.find(t => t.id === topicId);
  if (!topic) return;

  state.quizState = { currentQ: 0, answers: [], answered: false };
  const quizContent = document.getElementById('quizContent');
  if (quizContent) quizContent.innerHTML = buildQuizQuestion(topic, 0);
}

// ─── Mark Lesson Done ────────────────────────────────────────────────────────

function markLessonDone(topicId) {
  state.lessonsDone.add(topicId);
  saveState();

  const btn = document.getElementById('lessonDoneBtn');
  if (btn) {
    btn.textContent = '✓ Lesson Completed';
    btn.classList.add('completed');
  }

  showToast('Lesson marked complete, take the quiz to finish!');

  // Auto-switch to quiz tab after a moment
  setTimeout(() => switchTab('quiz'), 1200);
}

// ─── Case Study ───────────────────────────────────────────────────────────────

function renderCaseStudy(container, topic, levelId) {
  const level = PM_GYM_DATA.levels.find(l => l.id === levelId);
  const scenario = topic.scenario;
  const savedAnswer = state.caseAnswers[topic.id] || '';
  const answered = !!savedAnswer;

  container.innerHTML = `
    <button class="back-btn" onclick="showView('topics', {levelId: '${levelId}'})">← Back to ${level.title}</button>
    <div style="margin-bottom: 1.25rem;">
      <span class="chip">Case Study</span>
      <span class="chip" style="margin-left: 0.5rem;">${topic.duration}</span>
    </div>

    <div class="case-study-banner">
      <div class="case-label">⚡ PM Scenario</div>
      <div class="case-title">${scenario.title}</div>
      <div class="case-context">${scenario.context}</div>
    </div>

    <div class="case-prompt">
      <h3>Your Task</h3>
      <ol>${scenario.prompt.split('\n').filter(l => l.trim().match(/^\d+\./)).map(l => `<li>${l.replace(/^\d+\.\s*/, '')}</li>`).join('')}</ol>
    </div>

    <textarea
      class="case-textarea"
      id="caseTextarea"
      placeholder="Write your answer here... Think through the problem systematically before revealing the model answer."
      >${savedAnswer}</textarea>

    <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 1.5rem; align-items: center;">
      <button class="btn-secondary" onclick="saveCaseAnswer('${topic.id}')">💾 Save Draft</button>
      <button class="reveal-btn" onclick="toggleModelAnswer('${topic.id}')">
        <span id="revealBtnText">👁 Reveal Model Answer</span>
      </button>
    </div>

    <div id="modelAnswerSection" class="${answered ? '' : 'hidden'}">
      <div class="model-answer">
        <div class="model-answer-header">⭐ Evaluation Rubric</div>
        <div class="model-answer-body">
          <div class="rubric-section">
            <h3>What to Look For</h3>
            <div class="rubric-grid">
              ${scenario.rubric.map(r => `
                <div class="rubric-row">
                  <div class="rubric-dimension">${r.dimension}</div>
                  <div class="rubric-strong">${r.strong}</div>
                  <div class="rubric-weak">${r.weak}</div>
                </div>`).join('')}
            </div>
          </div>
        </div>
      </div>

      <div class="model-answer">
        <div class="model-answer-header">Model Answer</div>
        <div class="model-answer-body">
          ${scenario.modelAnswer}
        </div>
      </div>

      <button class="btn-secondary" onclick="markCaseComplete('${topic.id}', '${levelId}')">
        ✓ Mark as Completed
      </button>
    </div>`;
}

function saveCaseAnswer(topicId) {
  const textarea = document.getElementById('caseTextarea');
  if (!textarea) return;
  state.caseAnswers[topicId] = textarea.value;
  saveState();
  showToast('💾 Draft saved');
}

function toggleModelAnswer(topicId) {
  saveCaseAnswer(topicId);
  const section = document.getElementById('modelAnswerSection');
  const btnText = document.getElementById('revealBtnText');
  if (!section) return;

  const isHidden = section.classList.contains('hidden');
  section.classList.toggle('hidden', !isHidden);
  if (btnText) btnText.textContent = isHidden ? '▲ Hide Model Answer' : '👁 Reveal Model Answer';
}

function markCaseComplete(topicId, levelId) {
  state.completedTopics.add(topicId);
  saveState();
  showToast('✓ Case study completed!');
  setTimeout(() => showView('topics', { levelId }), 1000);
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

function renderDashboard() {
  const container = document.getElementById('dashboardContainer');
  if (!container) return;

  let totalTopics = 0;
  let doneTopics = 0;
  PM_GYM_DATA.levels.forEach(l => {
    totalTopics += l.topics.length;
    doneTopics += l.topics.filter(t => state.completedTopics.has(t.id)).length;
  });

  const quizScoreList = Object.entries(state.quizScores)
    .map(([id, s]) => {
      const topic = PM_GYM_DATA.levels.flatMap(l => l.topics).find(t => t.id === id);
      return { name: topic ? topic.title : id, pct: s.pct, correct: s.correct, total: s.total };
    })
    .sort((a, b) => a.pct - b.pct);

  const topicRows = PM_GYM_DATA.levels.flatMap(l =>
    l.topics.map(t => {
      const done = state.completedTopics.has(t.id);
      const started = state.lessonsDone.has(t.id) || state.quizScores[t.id] !== undefined;
      const levelLabel = l.title;
      return { name: t.title, done, started, level: levelLabel };
    })
  );

  container.innerHTML = `
    <div class="section-header" style="text-align:left; margin-bottom: 1.5rem;">
      <h2>Your Progress</h2>
      <p>Track your learning journey across all PM Gym topics</p>
    </div>

    <div class="dashboard-top">
      <div class="stat-card">
        <div class="stat-card-label">Streak</div>
        <div class="stat-card-value">${state.streak || 0}🔥</div>
        <div class="stat-card-sub">consecutive days</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">Completed</div>
        <div class="stat-card-value">${doneTopics}</div>
        <div class="stat-card-sub">of ${totalTopics} topics</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">Quizzes Taken</div>
        <div class="stat-card-value">${Object.keys(state.quizScores).length}</div>
        <div class="stat-card-sub">topics scored</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">Avg Quiz Score</div>
        <div class="stat-card-value">${quizScoreList.length ? Math.round(quizScoreList.reduce((a, b) => a + b.pct, 0) / quizScoreList.length) : 0}%</div>
        <div class="stat-card-sub">across all quizzes</div>
      </div>
    </div>

    <div class="dashboard-sections">
      <div>
        <div class="dashboard-section-title">All Topics</div>
        <div>
          ${topicRows.map(t => {
            const status = t.done ? 'done' : t.started ? 'progress' : 'todo';
            const label = t.done ? '✓ Done' : t.started ? 'In Progress' : 'Not Started';
            return `<div class="topic-progress-row">
              <div class="topic-progress-name">
                <strong>${t.name}</strong>
                <span style="font-size: 0.78rem; color: var(--fg-3); margin-left: 0.5rem;">${t.level}</span>
              </div>
              <div class="topic-progress-status status-${status}">${label}</div>
            </div>`;
          }).join('')}
        </div>
      </div>

      ${quizScoreList.length > 0 ? `
        <div>
          <div class="dashboard-section-title">Quiz Scores</div>
          <div>
            ${quizScoreList.map(s => `
              <div class="weak-area">
                <div class="weak-area-name">${s.name}</div>
                <div class="weak-area-score" style="color: ${s.pct >= 80 ? 'var(--success)' : s.pct >= 60 ? 'var(--warning)' : 'var(--danger)'}">
                  ${s.correct}/${s.total} (${s.pct}%)
                </div>
              </div>`).join('')}
          </div>
        </div>` : ''}
    </div>`;
}

// ─── Resource Library ─────────────────────────────────────────────────────────

function renderLibrary() {
  const container = document.getElementById('libraryContainer');
  if (!container) return;

  const categoryIcons = {
    'Articles & Blogs': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
    'Newsletters': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>',
    'Books': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10M6 10h10"/></svg>',
    'Free Courses': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>',
  };

  container.innerHTML = `
    <div class="section-header">
      <h2>Resource Library</h2>
      <p>Curated free resources organized by format</p>
    </div>
    <div class="library-disclaimer">
      <span class="disclaimer-icon"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg></span>
      <span>These resources are curated based on what Sanket personally went through while transitioning into PM. Know something better? <a href="https://github.com/sanketjoshi2012/pm-gym" target="_blank" rel="noopener">Contribute to the repo ↗</a></span>
    </div>
    <div class="resource-categories">
      ${PM_GYM_DATA.resources.map(cat => `
        <div class="resource-category">
          <h3 style="display:flex; align-items:center; gap:0.5rem;">${categoryIcons[cat.category] || ''} <span>${cat.category}</span></h3>
          <div class="category-grid">
            ${cat.items.map(item => `
              <a href="${item.url}" target="_blank" rel="noopener" class="resource-item">
                <div class="resource-icon">${categoryIcons[cat.category] || '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>'}</div>
                <div class="resource-info">
                  <div class="resource-title">${item.title}</div>
                  <div class="resource-desc">${item.description}</div>
                </div>
                <div class="resource-arrow">↗</div>
              </a>`).join('')}
          </div>
        </div>`).join('')}
    </div>`;
}

// ─── Render: About ───────────────────────────────────────────────────────────

function renderAbout() {
  const container = document.getElementById('aboutContainer');
  if (!container) return;

  container.innerHTML = `
    <div class="section-header">
      <h2>About PM Gym</h2>
      <p>Who built this and why</p>
    </div>

    <div class="about-layout">
      <div class="about-card">
        <div class="about-avatar">SJ</div>
        <div class="about-bio">
          <h3>Sanket Joshi</h3>
          <p class="about-role">Data &amp; Analytics Professional · Transitioning to APM / PM</p>
          <p class="about-location">📍 Berlin, Germany · 7+ years in data &amp; analytics</p>
          <p class="about-text">
            Most recently at <strong>KNIME GmbH</strong> in Berlin, started as a Data Analyst owning content marketing analytics end-to-end, then moved to Data Scientist building agentic AI workflows with LLM tool-calling. Before that: consulting in insurance operations at Syntel (India), and a Master's in Data &amp; Knowledge Engineering at Otto von Guericke Universität Magdeburg.
          </p>
          <p class="about-text">
            I built PM Gym because I'm making the same transition I'm helping you prepare for. Everything here is what I personally read, practiced, and found valuable, nothing padded, nothing paywalled.
          </p>
          <div class="about-links">
            <a href="https://www.linkedin.com/in/sanket-joshi-897961102/" target="_blank" rel="noopener" class="about-link">LinkedIn ↗</a>
            <a href="https://github.com/sanketjoshi2012/pm-gym" target="_blank" rel="noopener" class="about-link">GitHub ↗</a>
          </div>
        </div>
      </div>

      <div class="about-contribute">
        <h3>🤝 This is a Community Project</h3>
        <p>PM Gym is fully open source. If you know a resource that should be here, a case study that would help, or a topic that's missing, pull requests are welcome.</p>
        <p>Have a real PM scenario from your work? Describe the problem, how you tackled it, and what the outcome was. The best submissions get featured as practice scenarios. We credit you by name.</p>
        <div class="about-contribute-actions">
          <a href="https://tally.so/r/rDyLDR" target="_blank" rel="noopener" class="btn-primary">Share a PM Scenario ↗</a>
          <a href="https://github.com/sanketjoshi2012/pm-gym" target="_blank" rel="noopener" class="btn-secondary">View on GitHub ↗</a>
          <a href="https://github.com/sanketjoshi2012/pm-gym/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener" class="btn-secondary">How to Contribute</a>
        </div>
      </div>
    </div>`;
}

// ─── Toast Notification ───────────────────────────────────────────────────────

function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }

  toast.textContent = msg;
  toast.classList.add('show');

  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ─── Init ─────────────────────────────────────────────────────────────────────

function updateStats() {
  const totalCaseStudies = PM_GYM_DATA.levels.reduce((sum, level) =>
    sum + level.topics.filter(t => t.isCaseStudy).length, 0);
  const el = document.getElementById('statCaseStudies');
  if (el) el.textContent = totalCaseStudies;
}

function init() {
  loadState();
  renderStreakBadge();
  updateThemeIcon();
  updateStats();

  // Navigate to hash on load, or landing if none
  navigateFromHash();

  // Back/forward button support
  window.addEventListener('popstate', navigateFromHash);
}

document.addEventListener('DOMContentLoaded', init);
