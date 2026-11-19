// PM Gym, Application Logic

function mp(event, props) {
  try {
    if (localStorage.getItem('pmgym_analytics_consent') === 'accepted' && typeof mixpanel !== 'undefined') {
      mixpanel.track(event, props);
    }
  } catch (e) {}
}

// ─── Analytics Consent Management ────────────────────────────────────────────

let analyticsLoaded = false;

function loadAnalytics() {
  if (analyticsLoaded) return;
  analyticsLoaded = true;
  // Run the Mixpanel stub IIFE after consent — creates window.mixpanel queue object
  // and injects the CDN script. The stub queues init(); the full library processes it on load.
  (function(f,b){if(!b.__SV){var e,g,i,h;window.mixpanel=b;b._i=[];b.init=function(e,f,c){function g(a,d){var b=d.split(".");2==b.length&&(a=a[b[0]],d=b[1]);a[d]=function(){a.push([d].concat(Array.prototype.slice.call(arguments,0)))}}var a=b;"undefined"!==typeof c?a=b[c]=[]:c="mixpanel";a.people=a.people||[];a.toString=function(a){var d="mixpanel";"mixpanel"!==c&&(d+="."+c);a||(d+=" (stub)");return d};a.people.toString=function(){return a.toString(1)+".people (stub)"};i="disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split(" ");for(h=0;h<i.length;h++)g(a,i[h]);var j="set set_once union unset remove delete".split(" ");a.get_group=function(){function b(c){d[c]=function(){call2_args=arguments;call2=[c].concat(Array.prototype.slice.call(call2_args,0));a.push([e].concat(call2))}}for(var d={},e=["get_group"].concat(Array.prototype.slice.call(arguments,0)),c=0;c<j.length;c++)b(j[c]);return d};b._i.push([e,f,c])};b.__SV=1.2;e=f.createElement("script");e.type="text/javascript";e.async=!0;e.src="https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";g=f.getElementsByTagName("script")[0];g.parentNode.insertBefore(e,g)}})(document,window.mixpanel||[]);
  mixpanel.init('0b6a4fbd9406a3b8f42130b91e18321a', {
    api_host: 'https://api-eu.mixpanel.com',
    ip: false,
    loaded: function() { mpSessionEvents(); }
  });
}

function initConsentBanner() {
  const consent = localStorage.getItem('pmgym_analytics_consent');
  if (consent === 'accepted') {
    loadAnalytics();
  } else if (!consent) {
    const banner = document.getElementById('consentBanner');
    if (banner) banner.hidden = false;
  }
}

function acceptAnalytics() {
  try { localStorage.setItem('pmgym_analytics_consent', 'accepted'); } catch (e) {}
  hideConsentBanner();
  loadAnalytics();
}

function declineAnalytics() {
  const wasAccepted = localStorage.getItem('pmgym_analytics_consent') === 'accepted';
  try { localStorage.setItem('pmgym_analytics_consent', 'declined'); } catch (e) {}
  hideConsentBanner();
  if (wasAccepted) {
    try {
      if (typeof mixpanel !== 'undefined') {
        mixpanel.opt_out_tracking();
        mixpanel.reset();
      }
      localStorage.removeItem('mp_0b6a4fbd9406a3b8f42130b91e18321a_mixpanel');
      localStorage.removeItem('__mp_opt_in_out_0b6a4fbd9406a3b8f42130b91e18321a');
    } catch (e) {}
    window.location.reload();
  }
}

function hideConsentBanner() {
  const banner = document.getElementById('consentBanner');
  if (banner) banner.hidden = true;
}

function openConsentPreferences() {
  const banner = document.getElementById('consentBanner');
  if (banner) {
    banner.hidden = false;
    banner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function toggleConsentDetails() {
  const details = document.getElementById('consentDetails');
  const btn = document.getElementById('consentMoreBtn');
  if (!details || !btn) return;
  const isOpen = !details.hidden;
  details.hidden = isOpen;
  btn.setAttribute('aria-expanded', String(!isOpen));
  btn.textContent = isOpen ? 'Learn more' : 'Show less';
}

function openPrivacyInfo() {
  const overlay = document.getElementById('privacyDialogOverlay');
  if (!overlay) return;
  overlay.hidden = false;
  const closeBtn = overlay.querySelector('.privacy-dialog-close');
  if (closeBtn) closeBtn.focus();
  overlay._escHandler = function(e) { if (e.key === 'Escape') closePrivacyInfo(); };
  document.addEventListener('keydown', overlay._escHandler);
}

function closePrivacyInfo() {
  const overlay = document.getElementById('privacyDialogOverlay');
  if (!overlay) return;
  overlay.hidden = true;
  if (overlay._escHandler) {
    document.removeEventListener('keydown', overlay._escHandler);
    overlay._escHandler = null;
  }
}

function mpSessionEvents() {
  const today = new Date().toISOString().slice(0, 10);
  const deviceType = window.innerWidth < 768 ? 'mobile' : 'desktop';

  let firstDate, lastDate;
  try {
    firstDate = localStorage.getItem('pmgym_first_session_date');
    lastDate  = localStorage.getItem('pmgym_last_session_date');
  } catch (e) {}

  if (!firstDate) {
    try { localStorage.setItem('pmgym_first_session_date', today); } catch (e) {}
    firstDate = today;
  }

  mp('session_started', { device_type: deviceType, is_authenticated: false });

  if (lastDate && lastDate !== today) {
    try {
      const msPerDay = 86400000;
      const daysSinceFirst = Math.round((new Date(today) - new Date(firstDate)) / msPerDay);
      const daysSinceLast  = Math.round((new Date(today) - new Date(lastDate))  / msPerDay);
      mp('return_session_started', {
        days_since_first_session: daysSinceFirst,
        days_since_last_session:  daysSinceLast,
        return_variant: 'organic',
      });
    } catch (e) {}
  }

  try { localStorage.setItem('pmgym_last_session_date', today); } catch (e) {}
}

const STORAGE_KEYS = {
  STREAK: 'pmgym_streak',
  LAST_ACTIVE: 'pmgym_last_active',
  COMPLETED_TOPICS: 'pmgym_completed',
  QUIZ_SCORES: 'pmgym_scores',
  DARK_MODE: 'pmgym_dark',
  CASE_ANSWERS: 'pmgym_case_answers',
  CASE_GRADING: 'pmgym_case_grading',
  LESSON_DONE: 'pmgym_lessons',
};

// ─── AI Grader constants ─────────────────────────────────────────────────────

const GRADER_URL = 'https://pm-gym-grader-production.joshisanket80.workers.dev/grade';

// Public grader kill-switch. While false, the grader UI is fully hidden on every pilot case page,
// no fetch to GRADER_URL can be initiated from the UI, and no stored result will be re-hydrated
// into the DOM on reload. Drafts (pmgym_case_answers) and grading state (pmgym_case_grading) are
// preserved in localStorage. See CHANGELOG [2.3.0] for the Cohort 21 calibration freeze and the
// three-step reactivation procedure.
const GRADER_ENABLED = false;
const PILOT_CASE_IDS = new Set([
  'case-study-fotmob',
  'case-study-cricbuzz',
  'case-study-spotify',
  'case-study-swiggy',
]);
const GRADER_MIN_WORDS = 120;
const GRADER_MAX_WORDS = 1500;
const GRADER_MAX_CHARS = 15_000;

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
  quizFinalized: false,
  quizStartTime: null,
  questionStartTime: null,
  completedTopics: new Set(),
  quizScores: {},
  lessonsDone: new Set(),
  streak: 0,
  lastActive: null,
  caseAnswers: {},
  caseGrading: {},
};

// ─── Storage ─────────────────────────────────────────────────────────────────

// Reads and parses one localStorage key independently. Returns fallback on any error.
// Never throws, never deletes the raw stored value.
function safeLoadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    return fallback;
  }
}

function loadState() {
  // Each key is loaded independently so corruption in one does not affect the others.

  // COMPLETED_TOPICS: must be an array of strings
  const completedRaw = safeLoadJSON(STORAGE_KEYS.COMPLETED_TOPICS, []);
  state.completedTopics = new Set(Array.isArray(completedRaw) ? completedRaw : []);

  // QUIZ_SCORES: must be a plain object (non-array)
  const scoresRaw = safeLoadJSON(STORAGE_KEYS.QUIZ_SCORES, {});
  state.quizScores = (scoresRaw && typeof scoresRaw === 'object' && !Array.isArray(scoresRaw)) ? scoresRaw : {};

  // LESSON_DONE: must be an array of strings
  const lessonsRaw = safeLoadJSON(STORAGE_KEYS.LESSON_DONE, []);
  state.lessonsDone = new Set(Array.isArray(lessonsRaw) ? lessonsRaw : []);

  // Migration: add best-score fields to any legacy quiz score records
  let migrated = false;
  Object.keys(state.quizScores).forEach(id => {
    const s = state.quizScores[id];
    if (s && typeof s === 'object' && s.bestPct === undefined && typeof s.pct === 'number') {
      s.bestPct = s.pct;
      s.bestCorrect = s.correct;
      s.attempts = 1;
      migrated = true;
    }
  });

  // Migration: retroactively complete topics where the best quiz score is 60%+
  Object.keys(state.quizScores).forEach(id => {
    const s = state.quizScores[id];
    if (s && (s.bestPct ?? s.pct) >= 60) {
      if (!state.lessonsDone.has(id)) { state.lessonsDone.add(id); migrated = true; }
      if (!state.completedTopics.has(id)) { state.completedTopics.add(id); migrated = true; }
    }
  });

  if (migrated) {
    try {
      localStorage.setItem(STORAGE_KEYS.QUIZ_SCORES, JSON.stringify(state.quizScores));
      localStorage.setItem(STORAGE_KEYS.LESSON_DONE, JSON.stringify([...state.lessonsDone]));
      localStorage.setItem(STORAGE_KEYS.COMPLETED_TOPICS, JSON.stringify([...state.completedTopics]));
    } catch (e) {}
  }

  // STREAK: parseInt handles non-numeric strings gracefully
  try {
    state.streak = parseInt(localStorage.getItem(STORAGE_KEYS.STREAK) || '0', 10) || 0;
  } catch (e) {
    state.streak = 0;
  }

  // LAST_ACTIVE
  try {
    state.lastActive = localStorage.getItem(STORAGE_KEYS.LAST_ACTIVE) || null;
  } catch (e) {
    state.lastActive = null;
  }

  // CASE_ANSWERS: must be a plain object (non-array)
  const casesRaw = safeLoadJSON(STORAGE_KEYS.CASE_ANSWERS, {});
  state.caseAnswers = (casesRaw && typeof casesRaw === 'object' && !Array.isArray(casesRaw)) ? casesRaw : {};

  // CASE_GRADING: per-case {attempt, assisted, lastResult, gradedAnswer}. Corrupt entries fall back to empty.
  const gradingRaw = safeLoadJSON(STORAGE_KEYS.CASE_GRADING, {});
  state.caseGrading = (gradingRaw && typeof gradingRaw === 'object' && !Array.isArray(gradingRaw)) ? gradingRaw : {};

  // DARK_MODE: plain string, not JSON
  try {
    const darkMode = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
    if (darkMode === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else if (darkMode === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  } catch (e) {}

  updateStreak();
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEYS.COMPLETED_TOPICS, JSON.stringify([...state.completedTopics]));
    localStorage.setItem(STORAGE_KEYS.QUIZ_SCORES, JSON.stringify(state.quizScores));
    localStorage.setItem(STORAGE_KEYS.LESSON_DONE, JSON.stringify([...state.lessonsDone]));
    localStorage.setItem(STORAGE_KEYS.STREAK, String(state.streak));
    localStorage.setItem(STORAGE_KEYS.LAST_ACTIVE, state.lastActive || '');
    localStorage.setItem(STORAGE_KEYS.CASE_ANSWERS, JSON.stringify(state.caseAnswers));
    localStorage.setItem(STORAGE_KEYS.CASE_GRADING, JSON.stringify(state.caseGrading));
  } catch (e) {}
}

// ─── AI Grader helpers (pure; mirrored by tests/grader-ui-tests.js) ──────────

function countWords(text) {
  return (text || '').trim().split(/\s+/).filter(w => w.length > 0).length;
}

function isPilotCase(topicId) {
  return GRADER_ENABLED && PILOT_CASE_IDS.has(topicId);
}

function escapeHtml(s) {
  const str = String(s == null ? '' : s);
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Lowest score; ties broken by first-listed order (rubric order == dimensions array order)
function pickBiggestLever(dimensions) {
  if (!Array.isArray(dimensions) || dimensions.length === 0) return null;
  let best = dimensions[0];
  for (let i = 1; i < dimensions.length; i++) {
    if (dimensions[i].score < best.score) best = dimensions[i];
  }
  return best;
}

// Whether the displayed grade applies to a different answer than the textarea currently shows.
// Compared on trimmed text so trailing whitespace tweaks don't trigger a false "stale" flag.
function isStaleGrade(currentAnswer, gradedAnswer) {
  return (currentAnswer || '').trim() !== (gradedAnswer || '').trim();
}

// Returns {disabled, reason} for the Get AI feedback button based on the current draft.
function graderButtonState(answer) {
  const chars = (answer || '').length;
  if (chars > GRADER_MAX_CHARS) {
    return { disabled: true, reason: `Shorten to under ${GRADER_MAX_CHARS.toLocaleString()} characters` };
  }
  const words = countWords(answer);
  if (words < GRADER_MIN_WORDS) {
    return { disabled: true, reason: `Write at least ${GRADER_MIN_WORDS} words (${words} so far)` };
  }
  if (words > GRADER_MAX_WORDS) {
    return { disabled: true, reason: `Shorten to under ${GRADER_MAX_WORDS.toLocaleString()} words (${words} now)` };
  }
  return { disabled: false, reason: '' };
}

// Maps a Worker response (status + JSON body) to a user-facing error string.
function graderErrorMessage(status, bodyErrorText) {
  if (status === 429) return "You've hit the grading limit. Please try again later.";
  if (status === 503) return bodyErrorText || 'Grading is temporarily unavailable. Please try again later.';
  if (status === 504) return 'Grading timed out. Please try again.';
  if (status === 502) return 'Grading service error. Please try again.';
  if (status === 400 || status === 413) return 'We could not grade that answer. Please check the length and try again.';
  return 'Something went wrong. Please try again.';
}

// Decide whether to flip the per-browser assisted flag for a case when the model answer is revealed.
// Once true, stays true for this browser (until localStorage is cleared externally).
function nextAssistedFlag(prev) { return true; }

// Compact status for the word counter: {count, hint, charWarning, state}.
// count is always "N words"; hint is only set when below the minimum. charWarning only when nearing/over 15k chars.
function wordCounterStatus(answer) {
  const safe = answer || '';
  const words = countWords(safe);
  const chars = safe.length;
  const CHAR_WARN_AT = Math.round(GRADER_MAX_CHARS * 0.9); // 13,500
  const count = `${words.toLocaleString()} word${words === 1 ? '' : 's'}`;
  let hint = '';
  let state = 'ok';
  if (words < GRADER_MIN_WORDS) {
    const need = GRADER_MIN_WORDS - words;
    hint = `${need.toLocaleString()} more word${need === 1 ? '' : 's'} needed`;
    state = 'under';
  } else if (words > GRADER_MAX_WORDS) {
    hint = `Shorten to ${GRADER_MAX_WORDS.toLocaleString()} words`;
    state = 'over';
  }
  let charWarning = '';
  if (chars > GRADER_MAX_CHARS) {
    charWarning = `Over ${GRADER_MAX_CHARS.toLocaleString()} character limit`;
    state = 'over';
  } else if (chars >= CHAR_WARN_AT) {
    charWarning = `${chars.toLocaleString()} / ${GRADER_MAX_CHARS.toLocaleString()} characters`;
  }
  return { count, hint, charWarning, state };
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

  if (viewName === 'landing') {
    initDailyRep();
  }

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
    const ariaEl = document.getElementById('streakAriaLabel');
    if (ariaEl) ariaEl.textContent = state.streak + '-day streak';
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

function filterCaseStudies(category, button) {
  state.activeCaseCategory = category;
  const container = document.getElementById('topicsContainer');
  if (!container) return;

  container.querySelectorAll('.case-study-filter').forEach(filter => {
    const active = filter === button;
    filter.classList.toggle('active', active);
    filter.setAttribute('aria-pressed', String(active));
  });

  container.querySelectorAll('.topic-card[data-case-category]').forEach(card => {
    card.hidden = card.dataset.caseCategory !== category;
  });

  const count = container.querySelectorAll('.topic-card[data-case-category]:not([hidden])').length;
  const countEl = container.querySelector('#caseStudyResultCount');
  if (countEl) countEl.textContent = `${count} case ${count === 1 ? 'study' : 'studies'}`;
}

function renderTopics(levelId) {
  const level = PM_GYM_DATA.levels.find(l => l.id === levelId);
  if (!level) return;
  state.currentLevel = levelId;

  const container = document.getElementById('topicsContainer');
  if (!container) return;

  const doneCount = level.topics.filter(t => state.completedTopics.has(t.id)).length;
  const pct = level.topics.length ? Math.round((doneCount / level.topics.length) * 100) : 0;
  const caseStudies = level.topics.filter(topic => topic.isCaseStudy);
  const otherTopics = level.topics.filter(topic => !topic.isCaseStudy);

  // Dynamically derive categories from data.js
  const preferredOrder = ['Sports', 'Media & Entertainment', 'E-commerce & Fashion', 'Food Delivery', 'Work & Productivity', 'Fintech'];
  const uniqueCategories = [...new Set(caseStudies.map(t => t.category).filter(Boolean))];
  const categories = uniqueCategories.sort((a, b) => {
    const idxA = preferredOrder.indexOf(a);
    const idxB = preferredOrder.indexOf(b);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return a.localeCompare(b);
  });

  // Ensure active category is valid
  if (!state.activeCaseCategory || !categories.includes(state.activeCaseCategory)) {
    state.activeCaseCategory = categories[0] || '';
  }

  const renderTopicCard = topic => {
    const done = state.completedTopics.has(topic.id);
    const score = state.quizScores[topic.id];
    const isCaseStudy = topic.isCaseStudy;
    const category = topic.category || '';

    let badges = `<span class="topic-badge badge-duration">${topic.duration}</span>`;
    if (done) badges += `<span class="topic-badge badge-done">✓ Completed</span>`;
    if (isCaseStudy) {
      badges += `<span class="topic-badge badge-case">Case Study</span>`;
      if (category) {
        badges += `<span class="topic-badge badge-category">${category}</span>`;
      }
    }
    if (score !== undefined && !isCaseStudy) {
      const best = score.bestCorrect ?? score.correct;
      badges += `<span class="topic-badge badge-score">Quiz: ${best}/${score.total}</span>`;
    }

    const isHidden = isCaseStudy && category !== state.activeCaseCategory;

    return `
      <div class="topic-card ${done ? 'completed' : ''} ${isCaseStudy ? 'case-study' : ''}"
           ${isCaseStudy ? `data-case-category="${category}" ${isHidden ? 'hidden' : ''}` : ''}
           onclick="showView('module', {levelId: '${levelId}', topicId: '${topic.id}'})">
        <div class="topic-left">
          <div class="topic-title">${topic.title}</div>
          <div class="topic-meta">${badges}</div>
        </div>
        <div class="topic-arrow">→</div>
      </div>`;
  };

  const activeCategoryCount = caseStudies.filter(t => t.category === state.activeCaseCategory).length;

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
    ${caseStudies.length ? `
      <section class="case-study-library" aria-labelledby="caseStudyHeading">
        <div class="case-study-library-heading">
          <div>
            <h3 id="caseStudyHeading">Case studies</h3>
            <p>Choose an industry to find a scenario to practice.</p>
          </div>
          <span id="caseStudyResultCount" class="case-study-result-count">${activeCategoryCount} case ${activeCategoryCount === 1 ? 'study' : 'studies'}</span>
        </div>
        <div class="case-study-filters" role="group" aria-label="Filter case studies by industry">
          ${categories.map(category => {
            const count = caseStudies.filter(topic => topic.category === category).length;
            const isActive = state.activeCaseCategory === category;
            return `<button type="button" class="case-study-filter ${isActive ? 'active' : ''}" aria-pressed="${isActive}" onclick="filterCaseStudies('${category}', this)">${category} <span>${count}</span></button>`;
          }).join('')}
        </div>
        <div class="topics-list case-study-topics-list">
          ${caseStudies.map(renderTopicCard).join('')}
        </div>
      </section>` : ''}
    ${otherTopics.length ? `
      <section class="other-topics-section">
        <h3>More to explore</h3>
        <div class="topics-list">${otherTopics.map(renderTopicCard).join('')}</div>
      </section>` : ''}`;
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
    mp('practice_started', {
      content_type: 'case_study',
      content_id: topic.id,
      attempt_source: 'from_topic_page',
      is_first_attempt_of_content: !state.completedTopics.has(topic.id),
    });
    renderCaseStudy(container, topic, levelId);
    return;
  }

  mp('practice_started', {
    content_type: 'module',
    content_id: topic.id,
    attempt_source: 'from_topic_page',
    is_first_attempt_of_content: !state.lessonsDone.has(topic.id),
  });

  // Reset quiz state
  state.quizState = { currentQ: 0, answers: [], answered: false };
  state.quizFinalized = false;

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
  if (tab === 'quiz') {
    state.quizStartTime = Date.now();
    state.questionStartTime = Date.now();
    mp('practice_started', {
      content_type: 'quiz',
      content_id: state.currentTopic,
      attempt_source: 'from_topic_page',
      is_first_attempt_of_content: !state.quizScores[state.currentTopic],
    });
  }
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

  const isCorrect = chosenIdx === topic.quiz[qIndex].correct;
  const responseTime = state.questionStartTime ? Math.round((Date.now() - state.questionStartTime) / 1000) : null;
  mp('quiz_answer_submitted', {
    content_id: topicId,
    question_id: `${topicId}_q${qIndex + 1}`,
    is_correct: isCorrect,
    attempt_number: 1,
    ...(responseTime !== null && { response_time_seconds: responseTime }),
  });

  const quizContent = document.getElementById('quizContent');
  if (quizContent) quizContent.innerHTML = buildQuizQuestion(topic, qIndex);
}

function nextQuestion(topicId, nextIdx) {
  const level = PM_GYM_DATA.levels.find(l => l.topics.some(t => t.id === topicId));
  if (!level) return;
  const topic = level.topics.find(t => t.id === topicId);
  if (!topic) return;

  state.questionStartTime = Date.now();
  if (nextIdx >= topic.quiz.length) finalizeQuiz(topic);
  const quizContent = document.getElementById('quizContent');
  if (quizContent) quizContent.innerHTML = buildQuizQuestion(topic, nextIdx);
}

function finalizeQuiz(topic) {
  if (state.quizFinalized) return;
  state.quizFinalized = true;

  const quiz = topic.quiz;
  const answers = state.quizState.answers;
  const correct = answers.filter((a, i) => a === quiz[i].correct).length;
  const pct = Math.round((correct / quiz.length) * 100);

  // Capture retry status BEFORE writing the new score
  const isRetry = !!state.quizScores[topic.id];
  const existing = state.quizScores[topic.id];
  const prevBestPct = existing ? (existing.bestPct ?? existing.pct) : -1;
  const prevBestCorrect = existing ? (existing.bestCorrect ?? existing.correct) : 0;
  const bestPct = Math.max(prevBestPct, pct);
  const bestCorrect = pct >= prevBestPct ? correct : prevBestCorrect;
  const attempts = existing ? (existing.attempts ?? 1) + 1 : 1;

  state.quizScores[topic.id] = { correct, total: quiz.length, pct, bestPct, bestCorrect, attempts };
  saveState();

  const timeOnQuiz = state.quizStartTime ? Math.round((Date.now() - state.quizStartTime) / 1000) : null;
  mp('practice_completed', {
    content_type: 'quiz',
    content_id: topic.id,
    completion_status: isRetry ? 'completed_retry' : 'completed',
    ...(timeOnQuiz !== null && { time_to_complete_seconds: timeOnQuiz }),
    score_percent: pct,
    correct_count: correct,
    total_questions: quiz.length,
    passed: pct >= 60,
  });

  // Passing quiz at 60%+ auto-marks lesson done and completes topic
  if (pct >= 60) {
    state.lessonsDone.add(topic.id);
    if (!state.completedTopics.has(topic.id)) {
      state.completedTopics.add(topic.id);
      saveState();
      showToast(`✓ "${topic.title}" completed!`);
    } else {
      saveState();
    }
  }
}

function buildQuizResults(topic) {
  const quiz = topic.quiz;
  const answers = state.quizState.answers;
  const correct = answers.filter((a, i) => a === quiz[i].correct).length;
  const pct = Math.round((correct / quiz.length) * 100);

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

  const level = PM_GYM_DATA.levels.find(l => l.id === state.currentLevel);
  const nonCaseTopics = level ? level.topics.filter(t => !t.isCaseStudy) : [];
  const currentIdx = nonCaseTopics.findIndex(t => t.id === topic.id);
  const nextTopic = currentIdx >= 0 ? nonCaseTopics[currentIdx + 1] : null;

  return `
    <div class="quiz-results">
      <div class="result-score-circle">
        <div class="result-score-num">${correct}<span class="result-score-denom">/${quiz.length}</span></div>
      </div>
      <div class="result-title">${pct}%, ${pct >= 80 ? 'Mastered' : pct >= 60 ? 'Passed' : 'Needs Practice'}</div>
      <div class="result-desc">${msg}</div>
      <div class="result-actions">
        <button class="btn-secondary" onclick="retakeQuiz('${topic.id}')">↩ Retake Quiz</button>
        ${nextTopic
          ? `<button class="btn-next" onclick="showView('module', {levelId: '${state.currentLevel}', topicId: '${nextTopic.id}'})">Next: ${nextTopic.title} →</button>`
          : `<button class="btn-next" onclick="showView('topics', {levelId: '${state.currentLevel}'})">Back to Topics →</button>`
        }
      </div>
      ${pct >= 60 ? `
      <div class="share-result-section">
        <div class="share-result-label">Share your result</div>
        <div class="share-result-row">
          <span class="share-result-preview">Just scored ${pct}% on "${topic.title}" on PM Gym. If you're transitioning into PM, this is worth 15 minutes of your time: https://sanketjoshi2012.github.io/pm-gym/</span>
          <input type="hidden" id="shareText" value="Just scored ${pct}% on &quot;${topic.title}&quot; on PM Gym. If you're transitioning into PM, this is worth 15 minutes of your time: https://sanketjoshi2012.github.io/pm-gym/">
          <div class="share-result-actions">
            <button class="btn-secondary" onclick="copyShareText()">📋 Copy</button>
            <a class="btn-secondary" href="https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fsanketjoshi2012.github.io%2Fpm-gym%2F" target="_blank" rel="noopener">Share on LinkedIn →</a>
          </div>
        </div>
      </div>` : ''}
    </div>`;
}

function copyShareText() {
  const el = document.getElementById('shareText');
  if (!el) return;
  navigator.clipboard.writeText(el.value).then(() => showToast('📋 Copied to clipboard!'));
}

function retakeQuiz(topicId) {
  const level = PM_GYM_DATA.levels.find(l => l.topics.some(t => t.id === topicId));
  if (!level) return;
  const topic = level.topics.find(t => t.id === topicId);
  if (!topic) return;

  state.quizState = { currentQ: 0, answers: [], answered: false };
  state.quizFinalized = false;
  const quizContent = document.getElementById('quizContent');
  if (quizContent) quizContent.innerHTML = buildQuizQuestion(topic, 0);
}

// ─── Mark Lesson Done ────────────────────────────────────────────────────────

function markLessonDone(topicId) {
  state.lessonsDone.add(topicId);
  saveState();
  mp('practice_completed', { content_type: 'module', content_id: topicId, completion_status: 'completed' });

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
      <p class="case-disclaimer">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        Practice scenario: Figures and assumptions are illustrative and simplified. They do not represent actual company data.
      </p>
    </div>

    <div class="case-prompt">
      <h3>Your Task</h3>
      <ol>${scenario.prompt.split('\n').filter(l => l.trim().match(/^\d+\./)).map(l => `<li>${l.replace(/^\d+\.\s*/, '')}</li>`).join('')}</ol>
    </div>

    <textarea
      class="case-textarea"
      id="caseTextarea"
      placeholder="Write your answer here... Think through the problem systematically before revealing the model answer."
      ></textarea>
    ${isPilotCase(topic.id) ? `
    <div class="grader-helper">
      <div id="wordCounter" class="word-counter" aria-live="polite" role="status">
        <span class="word-counter-left">
          <span id="wordCounterCount" class="word-counter-count"></span>
          <span id="wordCounterHint" class="word-counter-hint-dynamic hidden"></span>
        </span>
        <span class="word-counter-right">
          <span id="wordCounterCharWarn" class="word-counter-charwarn hidden"></span>
          <span class="word-counter-limits">Min ${GRADER_MIN_WORDS} · Max ${GRADER_MAX_WORDS.toLocaleString()}</span>
        </span>
      </div>
    </div>` : ''}

    <div class="case-actions">
      ${isPilotCase(topic.id) ? `
      <button
        id="viewLastFeedbackBtn"
        class="view-last-feedback-btn hidden"
        type="button"
        onclick="reopenGradeResult('${topic.id}')"
        aria-label="View last AI feedback">
        <span class="vlf-label">↺ View last feedback</span>
        <span class="vlf-stale hidden">needs refresh</span>
      </button>
      <button class="grader-btn" id="getFeedbackBtn" type="button" onclick="requestGrade('${topic.id}')" aria-describedby="wordCounter">
        <span class="grader-btn-label">🪄 Get AI feedback</span>
        <span class="grader-btn-spinner" aria-hidden="true"></span>
      </button>` : ''}
      <button class="reveal-btn" onclick="toggleModelAnswer('${topic.id}')">
        <span id="revealBtnText">👁 Reveal Model Answer</span>
      </button>
      <button class="btn-secondary" onclick="saveCaseAnswer('${topic.id}')">💾 Save Draft</button>
    </div>

    ${isPilotCase(topic.id) ? `
    <div id="graderErrorBanner" class="grader-error-banner hidden" role="alert"></div>
    <div id="graderResult" class="grader-result hidden" tabindex="-1" aria-label="AI feedback result"></div>` : ''}

    <div id="modelAnswerSection" class="hidden">
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

  // Populate textarea via .value — never interpolate user content into innerHTML
  const textarea = document.getElementById('caseTextarea');
  if (textarea && savedAnswer) textarea.value = savedAnswer;

  if (isPilotCase(topic.id)) {
    // Re-render a previous result from localStorage so attempts survive reload.
    // If the learner closed the panel last session, keep it closed but expose "View last feedback".
    const grading = state.caseGrading[topic.id];
    if (grading && grading.lastResult && Array.isArray(grading.lastResult.dimensions) && !grading.hidden) {
      renderGradeResult(topic.id);
    }
    updateGraderUI(topic.id);
    if (textarea) {
      textarea.addEventListener('input', () => updateGraderUI(topic.id));
    }
  }
}

// ─── AI Grader UI ────────────────────────────────────────────────────────────

function currentAnswerFor(topicId) {
  const textarea = document.getElementById('caseTextarea');
  if (textarea) return textarea.value;
  return state.caseAnswers[topicId] || '';
}

function updateGraderUI(topicId) {
  if (!isPilotCase(topicId)) return;
  const answer = currentAnswerFor(topicId);
  const btnState = graderButtonState(answer);
  const status = wordCounterStatus(answer);

  const counter = document.getElementById('wordCounter');
  const countEl = document.getElementById('wordCounterCount');
  const hintEl = document.getElementById('wordCounterHint');
  const charWarnEl = document.getElementById('wordCounterCharWarn');
  if (counter && countEl) {
    countEl.textContent = status.count;
    if (hintEl) {
      hintEl.textContent = status.hint;
      hintEl.classList.toggle('hidden', !status.hint);
    }
    if (charWarnEl) {
      charWarnEl.textContent = status.charWarning;
      charWarnEl.classList.toggle('hidden', !status.charWarning);
    }
    counter.classList.toggle('ok', status.state === 'ok');
    counter.classList.toggle('over', status.state === 'over');
    counter.classList.toggle('under', status.state === 'under');
  }

  const btn = document.getElementById('getFeedbackBtn');
  if (btn) {
    btn.disabled = btnState.disabled;
    btn.title = btnState.reason || '';
    btn.setAttribute('aria-disabled', btnState.disabled ? 'true' : 'false');
  }

  // Previous result preserved; tag and visibly label it as stale if the answer has changed since grading.
  const grading = state.caseGrading[topicId];
  const resultEl = document.getElementById('graderResult');
  const stale = grading && grading.lastResult
    ? isStaleGrade(answer, grading.gradedAnswer)
    : false;
  if (grading && grading.lastResult && resultEl && !resultEl.classList.contains('hidden')) {
    resultEl.classList.toggle('stale', stale);
    let dynamicBadge = resultEl.querySelector('.stale-badge.dynamic');
    if (stale && !dynamicBadge) {
      dynamicBadge = document.createElement('div');
      dynamicBadge.className = 'stale-badge dynamic';
      dynamicBadge.textContent = "You've edited your answer since this feedback was generated. Click “Get AI feedback” again for an updated grade.";
      resultEl.prepend(dynamicBadge);
    } else if (!stale && dynamicBadge) {
      dynamicBadge.remove();
    }
  }

  // "View last feedback" is visible only when a result exists AND the panel is hidden.
  const vlfBtn = document.getElementById('viewLastFeedbackBtn');
  if (vlfBtn) {
    const hasHiddenResult = !!(grading && grading.lastResult && grading.hidden);
    vlfBtn.classList.toggle('hidden', !hasHiddenResult);
    const staleTag = vlfBtn.querySelector('.vlf-stale');
    if (staleTag) staleTag.classList.toggle('hidden', !(hasHiddenResult && stale));
    vlfBtn.classList.toggle('stale', hasHiddenResult && stale);
  }
}

function clearGraderError() {
  const banner = document.getElementById('graderErrorBanner');
  if (banner) { banner.textContent = ''; banner.classList.add('hidden'); }
}

function showGraderError(message) {
  const banner = document.getElementById('graderErrorBanner');
  if (!banner) return;
  banner.textContent = message;
  banner.classList.remove('hidden');
}

async function requestGrade(topicId) {
  if (!isPilotCase(topicId)) return;
  const btn = document.getElementById('getFeedbackBtn');
  const answer = currentAnswerFor(topicId);
  const btnState = graderButtonState(answer);
  if (btnState.disabled) { updateGraderUI(topicId); return; }

  // Persist the draft before sending so a reload mid-request doesn't lose it.
  state.caseAnswers[topicId] = answer;
  saveState();

  clearGraderError();
  if (btn) { btn.classList.add('loading'); btn.disabled = true; }
  const textarea = document.getElementById('caseTextarea');
  if (textarea) textarea.classList.add('dim');

  const grading = state.caseGrading[topicId] || {};
  const nextAttempt = (grading.attempt || 0) + 1;
  const assisted = !!grading.assisted;

  let result = null;
  let errorMsg = null;
  try {
    const response = await fetch(GRADER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ case_id: topicId, answer, attempt: nextAttempt, assisted }),
    });
    let body = null;
    try { body = await response.json(); } catch {}
    if (response.ok && body && Array.isArray(body.dimensions)) {
      result = body;
    } else {
      errorMsg = graderErrorMessage(response.status, body && body.error);
    }
  } catch (e) {
    errorMsg = 'Network error. Please check your connection and try again.';
  }

  if (btn) { btn.classList.remove('loading'); btn.disabled = false; }
  if (textarea) textarea.classList.remove('dim');
  updateGraderUI(topicId);

  if (errorMsg) { showGraderError(errorMsg); return; }

  // Persist the successful result alongside the exact answer it graded.
  // A fresh grade always shows the panel, so hidden resets to false.
  state.caseGrading[topicId] = {
    attempt: nextAttempt,
    assisted,
    lastResult: result,
    gradedAnswer: answer,
    hidden: false,
  };
  saveState();
  renderGradeResult(topicId);
  const resultEl = document.getElementById('graderResult');
  if (resultEl) { resultEl.focus(); resultEl.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
}

function renderGradeResult(topicId) {
  const container = document.getElementById('graderResult');
  if (!container) return;
  const grading = state.caseGrading[topicId];
  if (!grading || !grading.lastResult) { container.classList.add('hidden'); return; }

  const result = grading.lastResult;
  const dimensions = Array.isArray(result.dimensions) ? result.dimensions : [];
  const biggest = pickBiggestLever(dimensions);
  const total = Number.isInteger(result.total_score) ? result.total_score : null;
  const max = Number.isInteger(result.max_total_score) ? result.max_total_score : null;
  const assistedBadge = grading.assisted
    ? `<div class="assisted-badge">You saw the model answer before grading. Treat this score as a rough guide.</div>`
    : '';
  // Stale badge is owned exclusively by updateGraderUI (inserted as .stale-badge.dynamic) so it
  // can appear and disappear as the learner edits without re-rendering the whole panel.

  const rows = dimensions.map((d, i) => {
    const isStar = biggest && d.dimension === biggest.dimension && d.score === biggest.score ? ' ★' : '';
    const detailsId = `grader-row-${i}`;
    const quote = d.evidence_quote
      ? `<div class="dim-quote"><span class="dim-quote-label">Evidence:</span> &ldquo;${escapeHtml(d.evidence_quote)}&rdquo;</div>`
      : '';
    return `
      <details class="dim-row">
        <summary>
          <span class="dim-name">${escapeHtml(d.dimension)}${isStar}</span>
          <span class="dim-score">${Number(d.score)} / ${Number(d.max_score || 3)}</span>
        </summary>
        <div class="dim-body" id="${detailsId}">
          ${quote}
          <div class="dim-reasoning"><span class="dim-sub-label">Reasoning:</span> ${escapeHtml(d.reasoning || '')}</div>
          <div class="dim-improvement"><span class="dim-sub-label">To improve:</span> ${escapeHtml(d.improvement || '')}</div>
        </div>
      </details>`;
  }).join('');

  const scoreLine = (total !== null && max !== null) ? `${total} / ${max}` : '—';
  const overall = result.overall_comment ? escapeHtml(result.overall_comment) : '';
  const biggestBlock = biggest ? `
    <div class="biggest-lever">
      <div class="biggest-lever-label"><span class="bl-star" aria-hidden="true">★</span> Biggest lever</div>
      <div class="biggest-lever-body">${escapeHtml(biggest.improvement || '')}</div>
    </div>` : '';

  container.innerHTML = `
    <button
      class="grader-close-btn"
      type="button"
      onclick="closeGradeResult('${topicId}')"
      aria-label="Close feedback (your answer and grade are kept)"
      title="Close feedback — your answer and grade are kept">×</button>
    ${assistedBadge}
    <div class="grader-total">
      <div class="grader-total-row">
        <div class="grader-total-score">${scoreLine}</div>
        <div class="grader-ai-label" aria-label="AI-generated feedback">✦ AI-generated feedback</div>
      </div>
      ${overall ? `<div class="grader-total-sub">${overall}</div>` : ''}
    </div>
    ${biggestBlock}
    <button class="btn-primary improve-answer-btn" type="button" onclick="improveMyAnswer('${topicId}')">✎ Improve my answer</button>
    <div class="grader-dimensions">
      <div class="grader-dimensions-label">By dimension</div>
      ${rows}
    </div>
  `;
  container.classList.remove('hidden');
  // .stale class is managed by updateGraderUI alongside the dynamic stale badge.

  // Panel is visible, so clear the hidden flag and refresh the View Last Feedback button.
  const grading2 = state.caseGrading[topicId];
  if (grading2 && grading2.hidden) {
    state.caseGrading[topicId] = { ...grading2, hidden: false };
    saveState();
  }
  updateGraderUI(topicId);
}

// Closes the feedback panel without discarding the grade, the answer, or the attempt history.
function closeGradeResult(topicId) {
  const result = document.getElementById('graderResult');
  if (result) result.classList.add('hidden');
  const grading = state.caseGrading[topicId];
  if (grading && grading.lastResult) {
    state.caseGrading[topicId] = { ...grading, hidden: true };
    saveState();
  }
  updateGraderUI(topicId);
  // Return focus to the editor so keyboard users don't lose their place.
  const textarea = document.getElementById('caseTextarea');
  if (textarea) textarea.focus();
}

// Reopens the stored last result without regrading. Stale status reflects the current answer.
function reopenGradeResult(topicId) {
  const grading = state.caseGrading[topicId];
  if (!grading || !grading.lastResult) return;
  renderGradeResult(topicId);
  const result = document.getElementById('graderResult');
  if (result) { result.focus(); result.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
}

// Primary "Improve my answer" action: hide the panel (keep the grade), refocus the textarea.
function improveMyAnswer(topicId) {
  closeGradeResult(topicId);
  const textarea = document.getElementById('caseTextarea');
  if (textarea) {
    textarea.focus();
    textarea.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Back-compat alias so any lingering onclick="tryAgainWithFix(...)" still works.
function tryAgainWithFix(topicId) { improveMyAnswer(topicId); }

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

  // Once the learner has seen the model answer, every subsequent grading attempt for this case
  // in this browser is marked assisted. This cannot be undone by clearing the draft.
  if (isHidden && isPilotCase(topicId)) {
    const grading = state.caseGrading[topicId] || {};
    if (!grading.assisted) {
      state.caseGrading[topicId] = { ...grading, assisted: nextAssistedFlag(grading.assisted) };
      saveState();
      // If a result is already on screen, refresh so the assisted badge appears
      renderGradeResult(topicId);
    }
  }
}

function markCaseComplete(topicId, levelId) {
  state.completedTopics.add(topicId);
  saveState();
  mp('practice_completed', { content_type: 'case_study', content_id: topicId, completion_status: 'completed' });
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
      return { name: topic ? topic.title : id, pct: s.bestPct ?? s.pct, correct: s.bestCorrect ?? s.correct, total: s.total };
    })
    .sort((a, b) => a.pct - b.pct);

  const topicRows = PM_GYM_DATA.levels.flatMap(l =>
    l.topics.map(t => {
      const done = state.completedTopics.has(t.id);
      const hasDraft = t.isCaseStudy && !!(state.caseAnswers[t.id] || '').trim();
      const started = state.lessonsDone.has(t.id) || state.quizScores[t.id] !== undefined || hasDraft;
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
  initConsentBanner();

  // Navigate to hash on load, or landing if none
  navigateFromHash();

  // Back/forward button support
  window.addEventListener('popstate', navigateFromHash);
}

document.addEventListener('DOMContentLoaded', init);

document.addEventListener('keydown', function(e) {
  const quizContent = document.getElementById('quizContent');
  if (!quizContent) return;

  const num = parseInt(e.key, 10);
  if (num >= 1 && num <= 4) {
    const buttons = quizContent.querySelectorAll('.option-btn:not([disabled])');
    if (buttons[num - 1]) buttons[num - 1].click();
    return;
  }

  if (e.key === 'Enter') {
    const nextBtn = quizContent.querySelector('.btn-next:not([disabled])');
    if (nextBtn) nextBtn.click();
  }
});

// ─── Daily PM Rep Engine (v1.3.1) ──────────────────────────────────────────────

function getUtcDateKey() {
  const d = new Date();
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getLocalDateKey() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Parse two YYYY-MM-DD strings as local midnight to avoid DST arithmetic issues.
function daysBetween(isoA, isoB) {
  const [ya, ma, da] = isoA.split('-').map(Number);
  const [yb, mb, db] = isoB.split('-').map(Number);
  const a = new Date(ya, ma - 1, da);
  const b = new Date(yb, mb - 1, db);
  return Math.round((b - a) / (1000 * 60 * 60 * 24));
}

function formatUtcDisplayDate() {
  const d = new Date();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[d.getUTCMonth()]} ${d.getUTCDate()}`;
}

function getDailyRepPool() {
  if (typeof PM_GYM_DATA === 'undefined' || !PM_GYM_DATA.levels) return [];
  const pool = [];
  PM_GYM_DATA.levels.forEach(lvl => {
    lvl.topics.forEach(t => {
      if (Array.isArray(t.quiz) && t.quiz.length > 0) {
        t.quiz.forEach((q, qIdx) => {
          pool.push({
            id: `${t.id}-q${qIdx + 1}`,
            topicId: t.id,
            topicTitle: t.title,
            levelId: lvl.id,
            question: q.question,
            options: q.options,
            correct: q.correct,
            explanation: q.explanation
          });
        });
      }
    });
  });
  return pool;
}

function getTodayDailyItem(pool) {
  if (!pool || pool.length === 0) return null;
  const now = new Date();
  // Deterministic UTC day calculation since Unix epoch
  const dayIndex = Math.floor(now.getTime() / (24 * 60 * 60 * 1000));
  return pool[Math.abs(dayIndex) % pool.length];
}

function initDailyRep() {
  const container = document.getElementById('dailyRepCard');
  if (!container) return;

  const pool = getDailyRepPool();
  if (pool.length === 0) return;

  const currentItem = getTodayDailyItem(pool);
  if (!currentItem) return;

  const dateKey = getUtcDateKey();
  const storageKey = `pmgym_daily_rep_${dateKey}`;

  // Load saved attempt before resolving which question to display, so a pool
  // change after the user already answered does not let them answer again.
  let saved = null;
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) saved = JSON.parse(raw);
  } catch (e) {
    saved = null;
  }

  // Resolve display item. If the pool shifted since the user answered today,
  // try to recover the original question by its stored id. Never show saved
  // feedback against a different question.
  let displayItem = currentItem;
  let alreadyCompletedNeutral = false;

  if (saved && saved.questionId && saved.questionId !== currentItem.id) {
    const originalItem = pool.find(q => q.id === saved.questionId);
    if (originalItem) {
      displayItem = originalItem;
    } else {
      // Original question no longer in pool — cannot display it
      alreadyCompletedNeutral = true;
    }
  }

  // Date element
  const dateEl = document.getElementById('dailyRepDate');
  if (dateEl) dateEl.textContent = formatUtcDisplayDate();

  // Render streak
  updateDailyStreakDisplay();

  // Neutral state: user answered today but the original question is gone from the pool
  if (alreadyCompletedNeutral) {
    const topicEl = document.getElementById('dailyRepTopic');
    if (topicEl) topicEl.textContent = '';
    const questionEl = document.getElementById('dailyRepQuestion');
    if (questionEl) questionEl.textContent = "You've already completed today's practice.";
    const optionsEl = document.getElementById('dailyRepOptions');
    if (optionsEl) optionsEl.innerHTML = '';
    const feedbackEl = document.getElementById('dailyRepFeedback');
    if (feedbackEl) feedbackEl.style.display = 'none';
    window._currentDailyTopic = null;
    return;
  }

  // Topic badge
  const topicEl = document.getElementById('dailyRepTopic');
  if (topicEl) topicEl.textContent = `TOPIC: ${displayItem.topicTitle}`;

  // Question title
  const questionEl = document.getElementById('dailyRepQuestion');
  if (questionEl) questionEl.textContent = displayItem.question;

  const optionsEl = document.getElementById('dailyRepOptions');
  if (!optionsEl) return;
  optionsEl.innerHTML = '';

  // Resolve the index of the originally selected option in the current (possibly reordered)
  // options array. Prefers text matching (stable across reorders) over raw index.
  // Returns null when the original selection cannot be reliably determined.
  function resolveSelectedIndex(savedAttempt, item) {
    if (!savedAttempt) return null;
    const text = savedAttempt.selectedAnswerText;
    if (typeof text === 'string') {
      const idx = item.options.indexOf(text);
      return idx >= 0 ? idx : null;
    }
    // Legacy records have no text — raw index may be stale; do not guess.
    return null;
  }

  displayItem.options.forEach((optText, idx) => {
    const btn = document.createElement('div');
    btn.className = 'daily-rep-opt';
    btn.innerHTML = `<span class="daily-rep-opt-key">${String.fromCharCode(65 + idx)}</span> <span>${optText}</span>`;

    if (saved) {
      btn.classList.add('disabled');
      const resolvedIdx = resolveSelectedIndex(saved, displayItem);
      if (idx === displayItem.correct) {
        btn.classList.add('correct');
      } else if (resolvedIdx !== null && idx === resolvedIdx) {
        btn.classList.add('wrong');
      } else {
        btn.classList.add('dimmed');
      }
    } else {
      btn.onclick = () => handleDailyRepSelection(idx, displayItem, storageKey);
    }

    optionsEl.appendChild(btn);
  });

  if (saved) {
    // Trust the stored isCorrect rather than re-deriving from option index,
    // which would break for attempts saved before options were reordered.
    const wasCorrect = typeof saved.isCorrect === 'boolean'
      ? saved.isCorrect
      : resolveSelectedIndex(saved, displayItem) === displayItem.correct;
    showDailyRepFeedback(wasCorrect, displayItem);
  } else {
    const feedbackEl = document.getElementById('dailyRepFeedback');
    if (feedbackEl) feedbackEl.style.display = 'none';
  }

  window._currentDailyTopic = {
    levelId: displayItem.levelId,
    topicId: displayItem.topicId,
    topicTitle: displayItem.topicTitle
  };
}

function handleDailyRepSelection(selectedIdx, item, storageKey) {
  const isCorrect = selectedIdx === item.correct;
  const dateKey = getUtcDateKey();

  // Store user's Daily Rep attempt with complete schema.
  // selectedAnswerText persists the chosen option's content so it can be
  // matched by text if options are later reordered (stable across data updates).
  const attempt = {
    questionId: item.id,
    date: dateKey,
    selectedAnswer: selectedIdx,
    selectedAnswerText: item.options[selectedIdx],
    isCorrect: isCorrect,
    completed: true,
    answeredAt: Date.now()
  };

  try {
    localStorage.setItem(storageKey, JSON.stringify(attempt));
  } catch (e) {}

  // Update streak counter safely (only 1 increment per calendar day)
  incrementDailyStreak();

  const repStreak = parseInt(localStorage.getItem('pmgym_rep_streak') || '0', 10);
  mp('daily_rep_answered', { is_correct: isCorrect, streak_length: repStreak });

  // Disable options and style them immediately
  const options = document.querySelectorAll('.daily-rep-opt');
  options.forEach((btn, idx) => {
    btn.classList.add('disabled');
    btn.onclick = null;
    if (idx === item.correct) {
      btn.classList.add('correct');
    } else if (idx === selectedIdx) {
      btn.classList.add('wrong');
    } else {
      btn.classList.add('dimmed');
    }
  });

  showDailyRepFeedback(isCorrect, item);
  updateDailyRepStripCTA();
}

function showDailyRepFeedback(isCorrect, item) {
  const feedbackEl = document.getElementById('dailyRepFeedback');
  const resultEl = document.getElementById('dailyRepResult');
  const explanationEl = document.getElementById('dailyRepExplanation');
  const wrapperEl = document.getElementById('dailyRepExplanationWrapper');
  const toggleBtn = document.getElementById('dailyRepToggleBtn');
  const jumpBtn = document.getElementById('dailyRepJumpBtn');

  if (!feedbackEl || !resultEl || !explanationEl) return;

  feedbackEl.style.display = 'block';
  resultEl.className = 'daily-rep-result ' + (isCorrect ? 'success' : 'miss');
  resultEl.textContent = isCorrect ? 'Spot on! Correct answer.' : 'Not quite right.';
  explanationEl.textContent = item.explanation || '';

  // Ensure explanation is visible and toggle shows "Hide explanation"
  if (wrapperEl) wrapperEl.classList.remove('collapsed');
  if (toggleBtn) {
    toggleBtn.textContent = 'Hide explanation';
  }

  if (jumpBtn) {
    jumpBtn.textContent = `Want more practice? Explore ${item.topicTitle} →`;
  }
}

function toggleDailyRepExplanation() {
  const wrapperEl = document.getElementById('dailyRepExplanationWrapper');
  const toggleBtn = document.getElementById('dailyRepToggleBtn');
  if (!wrapperEl || !toggleBtn) return;

  const isCollapsed = wrapperEl.classList.toggle('collapsed');
  toggleBtn.textContent = isCollapsed ? 'Show explanation' : 'Hide explanation';
}

function updateDailyStreakDisplay() {
  const streakEl = document.getElementById('dailyRepStreakCount');
  if (!streakEl) return;

  let streak = 0;
  try {
    streak = parseInt(localStorage.getItem('pmgym_rep_streak') || '0', 10);
    // Reset stale streak: if more than 1 calendar day has passed since last activity, the streak is broken
    if (streak > 0) {
      const lastDate = localStorage.getItem('pmgym_rep_last_date');
      if (lastDate) {
        const gap = daysBetween(lastDate, getLocalDateKey());
        if (gap > 1) {
          streak = 0;
          localStorage.setItem('pmgym_rep_streak', '0');
        }
      }
    }
  } catch (e) {
    streak = 0;
  }

  // Clean label without duplicate emoji since SVG flame already precedes text
  if (streak === 0) {
    streakEl.textContent = 'Start your streak';
  } else if (streak === 1) {
    streakEl.textContent = '1-day streak';
  } else {
    streakEl.textContent = `${streak}-day streak`;
  }
}

function incrementDailyStreak() {
  const dateKey = getUtcDateKey();
  const lastActiveKey = localStorage.getItem('pmgym_rep_last_date');
  let streak = parseInt(localStorage.getItem('pmgym_rep_streak') || '0', 10);

  // If already completed today, do not increment again (prevents duplicate counting on refresh)
  if (lastActiveKey === dateKey) {
    updateDailyStreakDisplay();
    return;
  }

  if (!lastActiveKey) {
    // First completion ever
    streak = 1;
  } else {
    // Calculate calendar day difference
    try {
      const prevDate = new Date(lastActiveKey + 'T00:00:00Z');
      const currDate = new Date(dateKey + 'T00:00:00Z');
      const diffDays = Math.round((currDate - prevDate) / (24 * 60 * 60 * 1000));

      if (diffDays === 1) {
        // Consecutive calendar day
        streak = streak + 1;
      } else {
        // Missed one or more days: reset to 1 on this completion
        streak = 1;
      }
    } catch (e) {
      streak = 1;
    }
  }

  try {
    localStorage.setItem('pmgym_rep_streak', streak.toString());
    localStorage.setItem('pmgym_rep_last_date', dateKey);
  } catch (e) {}

  updateDailyStreakDisplay();
}

function jumpToDailyTopic() {
  if (window._currentDailyTopic) {
    showView('module', {
      levelId: window._currentDailyTopic.levelId,
      topicId: window._currentDailyTopic.topicId
    });
  }
}

// ─── Daily Rep Strip ──────────────────────────────────────────────────────────

function updateDailyRepStripCTA() {
  const btn = document.getElementById('dailyRepStripBtn');
  const label = document.getElementById('dailyRepStripBtnLabel');
  if (!btn || !label) return;
  const dateKey = getUtcDateKey();
  const saved = localStorage.getItem('pmgym_daily_rep_' + dateKey);
  label.textContent = saved ? 'Review today\'s rep' : 'Try today\'s question';
}

function toggleDailyRepStrip() {
  const body = document.getElementById('dailyRepStripBody');
  const btn = document.getElementById('dailyRepStripBtn');
  const chevron = document.getElementById('dailyRepStripChevron');
  if (!body || !btn) return;
  const isOpen = !body.hidden;
  body.hidden = isOpen;
  btn.setAttribute('aria-expanded', String(!isOpen));
  if (chevron) chevron.style.transform = isOpen ? '' : 'rotate(180deg)';
}

// Ensure Daily Rep re-inits whenever the landing view is shown
document.addEventListener('DOMContentLoaded', () => {
  initDailyRep();
  updateDailyRepStripCTA();
});
