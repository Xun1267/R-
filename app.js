/* ============================================================
   工具函数
============================================================ */
const $ = id => document.getElementById(id);

function showToast(msg, type = 'default') {
  const el = document.createElement('div');
  el.className = 'toast';
  const icon = { success:'✅', error:'❌', warning:'⚠️', default:'💬' }[type] || '💬';
  el.innerHTML = `${icon} ${msg}`;
  $('toast-container').appendChild(el);
  setTimeout(() => el.style.opacity = '0', 2800);
  setTimeout(() => el.remove(), 3200);
}

function openModal(title, body, cb) {
  $('modal-title').textContent = title;
  $('modal-body').textContent  = body;
  $('modal-confirm-btn').onclick = () => { cb && cb(); closeModal(); };
  $('modal-confirm').classList.add('active');
}
function closeModal() { $('modal-confirm').classList.remove('active'); }

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random()*16|0, v = c==='x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}
function formatDate(iso) {
  if (!iso) return '——';
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function now() { return new Date().toISOString(); }

/* ============================================================
   学习档案系统
============================================================ */
const LS_KEY = 'r_training_profile_v1';

function loadProfile() {
  try { return JSON.parse(localStorage.getItem(LS_KEY)); } catch(e) { return null; }
}
function saveProfile(p) {
  localStorage.setItem(LS_KEY, JSON.stringify(p));
}

function buildDefaultProfile(username) {
  return {
    profile: {
      profileId:  uuid(),
      username:   username || '研究者',
      createdAt:  now(),
      lastUsedAt: now(),
      appVersion: '0.1.0'
    },
    settings: { theme:'glass', showHints:true, editorFontSize:14 },
    topicProgress: {
      riclpm: {
        completedModules:   [],
        completedQuestions: [],
        mastery: { concepts:0, code:0, output:0, writing:0 }
      }
    },
    attempts: [],
    drafts:   {},
    questionInstances: {}
  };
}

function getRiclpmProgress(p) {
  if (!p) return { completedModules: [], completedQuestions: [], mastery: { concepts:0, code:0, output:0, writing:0 } };
  p.topicProgress = p.topicProgress || {};
  p.topicProgress.riclpm = p.topicProgress.riclpm || {
    completedModules: [],
    completedQuestions: [],
    mastery: { concepts:0, code:0, output:0, writing:0 }
  };
  return p.topicProgress.riclpm;
}

function getAllTopics() {
  return SITE_ARCHITECTURE.flatMap(group => group.topics.map(topic => ({ ...topic, groupKey: group.key, groupName: group.name })));
}

function getTopicLabel(key) {
  const topic = getAllTopics().find(item => item.key === key);
  return topic ? topic.name : key;
}

function createProfile() {
  const name = $('input-username').value.trim() || '研究者';
  if (loadProfile()) {
    openModal('覆盖现有档案', `当前已有档案"${loadProfile().profile.username}"，创建新档案将覆盖。确认继续？`, () => {
      doCreate(name);
    });
  } else {
    doCreate(name);
  }
}
function doCreate(name) {
  const p = buildDefaultProfile(name);
  saveProfile(p);
  updateNavProfile(p);
  showToast(`档案已创建：${name}`, 'success');
  goPage('topicmap');
}

function updateNavProfile(p) {
  if (!p) return;
  const name = p.profile.username;
  $('nav-username').textContent = name;
  $('nav-avatar').textContent   = name.charAt(0).toUpperCase();
}

function handleNavProfile() {
  const p = loadProfile();
  if (p) goPage('progress');
  else goPage('profile');
}

/* ============================================================
   导入导出
============================================================ */
function triggerImport() { $('file-import-input').click(); }

function handleImportFile(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    try {
      const data = JSON.parse(ev.target.result);
      if (!data.profile || !data.profile.profileId) throw new Error('格式错误');
      saveProfile(data);
      updateNavProfile(data);
      refreshProgressPage();
      showToast(`档案已导入：${data.profile.username}`, 'success');
      goPage('progress');
    } catch(err) {
      showToast('文件格式不正确，请导入平台导出的 JSON 文件', 'error');
    }
  };
  reader.readAsText(file);
  e.target.value = '';
}

function exportProfile() {
  const p = loadProfile();
  if (!p) { showToast('请先创建学习档案', 'warning'); return; }
  p.profile.lastUsedAt = now();
  saveProfile(p);
  const blob = new Blob([JSON.stringify(p, null, 2)], { type:'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${p.profile.username}_r_training_profile.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('学习档案已导出', 'success');
}

function exportTopicRecord() {
  const p = loadProfile();
  if (!p) { showToast('请先创建学习档案', 'warning'); return; }
  const riclpmProgress = getRiclpmProgress(p);
  const record = {
    username: p.profile.username,
    profileId: p.profile.profileId,
    exportedAt: now(),
    topic: 'riclpm',
    topicName: '随机截距交叉滞后模型（RI-CLPM）',
    topicProgress: riclpmProgress,
    attempts: p.attempts.filter(a => a.topic === 'riclpm')
  };
  const blob = new Blob([JSON.stringify(record, null, 2)], { type:'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${p.profile.username}_riclpm_topic_record.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('专题记录已导出', 'success');
}

function exportCurrentRecord() {
  showToast('本题记录已导出', 'success');
  exportTopicRecord();
}

function confirmResetProfile() {
  openModal('重置学习档案', '此操作将删除所有本地练习记录，无法恢复。确认重置？', () => {
    localStorage.removeItem(LS_KEY);
    $('nav-username').textContent = '未登录';
    $('nav-avatar').textContent   = '?';
    showToast('档案已重置', 'default');
    goPage('home');
  });
}

/* ============================================================
   页面路由
============================================================ */
const PAGES = ['home','profile','topicmap','module','workspace','feedback','progress'];
let currentPage = 'home';
let currentModuleId  = null;
let currentQuestionId = 1;
const PAGE_TRANSITION_MS = 260;
let pageTransitionTimer = null;

function goPage(name) {
  const target = $('page-' + name);
  if (!target) return;

  const hooks = {
    home:      refreshHomePage,
    topicmap:  refreshTopicMapPage,
    progress:  refreshProgressPage,
  };
  if (hooks[name]) hooks[name]();

  document.querySelectorAll('[data-nav]').forEach(el => {
    el.classList.toggle('active', el.dataset.nav === name);
  });

  const previous = $('page-' + currentPage);
  const isSamePage = currentPage === name && target.classList.contains('active');
  const reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (pageTransitionTimer) clearTimeout(pageTransitionTimer);

  if (isSamePage || reduceMotion) {
    PAGES.forEach(id => {
      const el = $('page-' + id);
      if (!el) return;
      el.classList.remove('is-exiting', 'page-entering');
      el.classList.toggle('active', id === name);
    });
    currentPage = name;
    window.scrollTo(0, 0);
    return;
  }

  document.querySelectorAll('.page.is-exiting').forEach(el => {
    if (el !== previous) el.classList.remove('is-exiting');
  });

  if (previous && previous !== target) {
    previous.classList.remove('active', 'page-entering');
    previous.classList.add('is-exiting');
  }

  PAGES.forEach(id => {
    const el = $('page-' + id);
    if (!el || el === target || el === previous) return;
    el.classList.remove('active', 'is-exiting', 'page-entering');
  });

  target.classList.remove('is-exiting', 'page-entering');
  target.classList.add('active', 'page-entering');
  window.scrollTo(0, 0);

  currentPage = name;
  pageTransitionTimer = setTimeout(() => {
    document.querySelectorAll('.page.is-exiting').forEach(el => el.classList.remove('is-exiting'));
    target.classList.remove('page-entering');
  }, PAGE_TRANSITION_MS + 80);
}

/* ============================================================
   首页
============================================================ */
function refreshHomePage() {
  const p = loadProfile();
  const card = $('home-progress-card');
  if (p) {
    updateNavProfile(p);
    card.classList.add('show');
    $('home-progress-name').textContent = p.profile.username;
    const pct = calcTopicPct(p);
    $('home-progress-pct').textContent = pct + '%';
    $('home-progress-pct-inline').textContent = pct + '%';
    $('home-progress-bar').style.width = pct + '%';
  } else {
    card.classList.remove('show');
  }
}

function calcTopicPct(p) {
  if (!p) return 0;
  const done = (getRiclpmProgress(p).completedQuestions || []).length;
  return Math.round(done / 16 * 100);
}

function calcPlatformPct(p) {
  if (!p) return 0;
  const done = (getRiclpmProgress(p).completedQuestions || []).length;
  return Math.round(done / 16 * 100);
}

function handleStartTraining() {
  const p = loadProfile();
  if (p) {
    handleContinueTraining();
    return;
  }
  openModal('请先创建学习档案', '开始训练前，需要创建一个本地学习档案来保存你的练习记录。', () => {
    goPage('profile');
  });
}

function handleContinueTraining() {
  const p = loadProfile();
  if (!p) {
    openModal('请先创建学习档案', '继续训练前，需要创建一个本地学习档案来保存你的练习记录。', () => {
      goPage('profile');
    });
    return;
  }

  const target = getResumeTarget(p);
  if (target) {
    goQuestion(target.moduleId, target.qIndex);
    const q = MODULE_DATA[target.moduleId].questions[target.qIndex];
    showToast(`继续：${q.title}`, 'success');
    return;
  }

  showToast('进入 RI-CLPM 模块选择', 'success');
  renderModuleOverview();
  goPage('module');
}

function getResumeTarget(p) {
  const latestActivity = getLatestActivityTarget(p);
  if (!latestActivity) return null;

  if (latestActivity.source === 'attempt' && latestActivity.totalScore >= 60) {
    return getNextUncompletedTarget(p, latestActivity) || latestActivity;
  }
  return latestActivity;
}

function getLatestActivityTarget(p) {
  const activities = [
    ...getDraftTargets(p),
    ...getAttemptTargets(p)
  ];
  return activities
    .filter(item => item.moduleId && item.activityAt)
    .sort((a, b) => new Date(b.activityAt) - new Date(a.activityAt))[0] || null;
}

function getDraftTargets(p) {
  const drafts = p && p.drafts ? p.drafts : {};
  return Object.entries(drafts)
    .map(([questionId, draft]) => ({
      ...findQuestionTarget(questionId),
      source: 'draft',
      activityAt: draft && draft.savedAt
    }));
}

function getAttemptTargets(p) {
  const attempts = p && Array.isArray(p.attempts) ? p.attempts : [];
  return attempts
    .map(attempt => ({
      ...findQuestionTarget(attempt.questionId),
      source: 'attempt',
      activityAt: attempt.submittedAt,
      totalScore: attempt.totalScore || 0
    }));
}

function getNextUncompletedTarget(p, fromTarget) {
  const completed = new Set(getRiclpmProgress(p).completedQuestions || []);
  const ordered = getModuleIds().flatMap(moduleId =>
    MODULE_DATA[moduleId].questions.map((q, qIndex) => ({ moduleId, qIndex, questionId: q.id }))
  );
  const startIndex = ordered.findIndex(item =>
    item.moduleId === fromTarget.moduleId && item.qIndex === fromTarget.qIndex
  );
  const rotated = startIndex >= 0
    ? [...ordered.slice(startIndex + 1), ...ordered.slice(0, startIndex + 1)]
    : ordered;
  return rotated.find(item => !completed.has(item.questionId)) || null;
}

function findQuestionTarget(questionId) {
  for (const moduleId of getModuleIds()) {
    const qIndex = MODULE_DATA[moduleId].questions.findIndex(q => q.id === questionId);
    if (qIndex >= 0) return { moduleId, qIndex, questionId };
  }
  return {};
}

/* ============================================================
   专题地图
============================================================ */
function refreshTopicMapPage() {
  const p = loadProfile();
  const allTopics = getAllTopics();
  const done = p ? (getRiclpmProgress(p).completedQuestions || []).length : 0;
  $('stat-done').textContent = done;
  $('stat-pct').textContent  = Math.round(done / 16 * 100) + '%';

  const topicStats = document.querySelectorAll('.topicmap-stats .stat-item__num');
  if (topicStats[0]) topicStats[0].textContent = allTopics.length;
  if (topicStats[1]) topicStats[1].textContent = LONGITUDINAL_TOPICS.length;

  const container = $('topic-catalog-grid');
  if (container) {
    container.innerHTML = `
      ${SITE_ARCHITECTURE.map(group => `
        <section class="architecture-group">
          <div class="architecture-group__header">
            <div>
              <div class="architecture-group__eyebrow">${group.order} · ${group.key}</div>
              <h3 class="architecture-group__title">${group.name}</h3>
              <p class="architecture-group__desc">${group.description}</p>
            </div>
            <span class="architecture-group__count">${group.topics.length} 个专题</span>
          </div>
          <div class="architecture-group__grid">
            ${group.topics.map(topic => {
              const progress = topic.key === 'longitudinal' ? Math.round(done / 16 * 100) : null;
              return `
              <button class="architecture-card ${topic.key === 'longitudinal' ? 'architecture-card--active' : ''}" type="button" onclick="openTopic('${topic.key}')">
                <div class="architecture-card__top">
                  <span class="architecture-card__badge ${topic.status.includes('已') ? 'architecture-card__badge--live' : ''}">${topic.status}</span>
                  <span class="architecture-card__chip">${topic.badge}</span>
                </div>
                <div class="architecture-card__name">${topic.name}</div>
                <p class="architecture-card__desc">${topic.desc}</p>
                <div class="architecture-card__modules">
                  ${topic.modules.slice(0, 4).map(module => `<span>${module}</span>`).join('')}
                </div>
                <div class="architecture-card__foot">
                  <span>${topic.modules.length} 个训练模块</span>
                  <span>${progress !== null ? progress + '% 已完成' : '专题概览'}</span>
                </div>
              </button>
            `;
            }).join('')}
          </div>
        </section>
      `).join('')}
      <section class="longitudinal-panel" id="longitudinal-subtopics">
        <div class="longitudinal-panel__header">
          <div>
            <div class="architecture-group__eyebrow">纵向模型专题 · 二级路径</div>
            <h3 class="architecture-group__title">从 CLPM 到 RI-CLPM，再到 LGM 与纵向中介</h3>
            <p class="architecture-group__desc">这一组专题聚焦多波追踪数据中的稳定差异、个体内变化、发展轨迹和跨时间机制解释。</p>
          </div>
          <button class="btn btn--primary btn--sm" type="button" onclick="openLongitudinalSubtopic('riclpm')">进入 RI-CLPM</button>
        </div>
        <div class="longitudinal-subgrid">
          ${LONGITUDINAL_TOPICS.map(topic => `
            <button class="longitudinal-card ${topic.key === 'riclpm' ? 'longitudinal-card--live' : ''}" type="button" onclick="openLongitudinalSubtopic('${topic.key}')">
              <span class="longitudinal-card__status">${topic.status}</span>
              <strong>${topic.title}</strong>
              <small>${topic.fullName}</small>
              <p>${topic.desc}</p>
            </button>
          `).join('')}
        </div>
      </section>
    `;
  }

  for (let i = 1; i <= 8; i++) {
    const modDone = p ? getModuleDoneCount(p, i) : 0;
    const pct = Math.round(modDone / 2 * 100);
    const pctEl  = document.querySelector(`.module-progress-pct[data-mod="${i}"]`);
    const barEl  = document.querySelector(`.module-progress-bar[data-mod="${i}"]`);
    if (pctEl) pctEl.textContent = pct + '%';
    if (barEl) barEl.style.width = pct + '%';
  }
}

function getModuleDoneCount(p, modId) {
  const done = getRiclpmProgress(p).completedQuestions || [];
  return done.filter(q => q.startsWith(`m${modId}_`)).length;
}

function openTopic(key) {
  if (key === 'longitudinal') {
    const panel = $('longitudinal-subtopics');
    if (panel) panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }
  showToast(`${getTopicLabel(key)}：当前展示专题概览`, 'default');
}

function openLongitudinalSubtopic(key) {
  if (key === 'riclpm') {
    showToast('进入 RI-CLPM 模块选择', 'success');
    renderModuleOverview();
    goPage('module');
    return;
  }
  const topic = LONGITUDINAL_TOPICS.find(item => item.key === key);
  showToast(`${topic ? topic.fullName : key}：当前展示专题概览`, 'default');
}

function goModule(id) {
  currentModuleId = id;
  renderModuleDetail(id);
  goPage('module');
}

function getModuleIds() {
  return Object.keys(MODULE_DATA).map(Number).sort((a, b) => a - b);
}

function getModuleQuestionCount(mod) {
  return mod.questions ? mod.questions.length : 0;
}

function getRiclpmDoneCount(p) {
  return p ? (getRiclpmProgress(p).completedQuestions || []).length : 0;
}

function renderModuleOverview() {
  currentModuleId = null;

  const p = loadProfile();
  const moduleIds = getModuleIds();
  const totalQuestions = moduleIds.reduce((sum, id) => sum + getModuleQuestionCount(MODULE_DATA[id]), 0);
  const done = getRiclpmDoneCount(p);
  const pct = totalQuestions ? Math.round(done / totalQuestions * 100) : 0;

  $('module-back-btn').textContent = '← 返回专题地图';
  $('module-back-btn').onclick = () => goPage('topicmap');
  $('mod-eyebrow').textContent = 'RI-CLPM 专题';
  $('mod-title').textContent = '选择训练模块';
  $('mod-badges').innerHTML = `
    <span class="badge badge--green">自由选择</span>
    <span class="badge badge--purple">${moduleIds.length} 个模块</span>
    <span class="badge badge--orange">${totalQuestions} 道题</span>
  `;
  $('mod-score-display').textContent = pct + '%';
  $('mod-objectives').innerHTML = [
    '不需要按顺序解锁，可以直接进入当前最需要的模块',
    '每个模块仍会保留独立完成度，方便回头补练',
    '适合按研究问题、代码、输出解读或写作需求跳转学习'
  ].map(o => `<div class="objective-item">${o}</div>`).join('');

  $('module-content-title').textContent = '模块选择';
  $('question-list-container').innerHTML = `
    <div class="modules-grid modules-grid--selector">
      ${moduleIds.map(id => {
        const mod = MODULE_DATA[id];
        const modDone = p ? getModuleDoneCount(p, id) : 0;
        const questionCount = getModuleQuestionCount(mod);
        const modPct = questionCount ? Math.round(modDone / questionCount * 100) : 0;
        const levelClass = { '入门':'badge--green', '标准':'badge--orange', '进阶':'badge--red' }[mod.level] || 'badge--blue';
        return `
          <button class="module-card" type="button" onclick="goModule(${id})">
            <div class="module-card__top">
              <div class="module-card__num">MODULE ${String(id).padStart(2, '0')}</div>
              <span class="badge ${levelClass}">${mod.level}</span>
            </div>
            <div class="module-card__title">${mod.title}</div>
            <div class="module-card__desc">${mod.objectives[0]}</div>
            <div class="module-card__meta">
              ${mod.types.map(t => `<span class="tag">${t}</span>`).join('')}
            </div>
            <div class="module-card__footer">
              <div style="min-width:0;flex:1;">
                <div class="module-card__progress-label">${modDone}/${questionCount} 已完成</div>
                <div class="progress-bar" style="height:5px;">
                  <div class="progress-bar__fill" style="width:${modPct}%;"></div>
                </div>
              </div>
              <span class="btn btn--secondary btn--sm">进入</span>
            </div>
          </button>
        `;
      }).join('')}
    </div>
  `;
}

function renderModuleDetail(id) {
  const mod = MODULE_DATA[id];
  if (!mod) return;
  currentModuleId = id;

  $('module-back-btn').textContent = '← 返回模块选择';
  $('module-back-btn').onclick = () => {
    renderModuleOverview();
    goPage('module');
  };
  $('mod-eyebrow').textContent  = `MODULE 0${id}`;
  $('mod-title').textContent    = mod.title;

  const badgesEl = $('mod-badges');
  badgesEl.innerHTML = '';
  const levelClass = { '入门':'badge--green', '标准':'badge--orange', '进阶':'badge--red' }[mod.level] || 'badge--blue';
  badgesEl.innerHTML = `<span class="badge ${levelClass}">${mod.level}</span>` +
    mod.types.map(t => `<span class="badge badge--purple">${t}</span>`).join('');

  const objEl = $('mod-objectives');
  objEl.innerHTML = mod.objectives.map(o => `<div class="objective-item">${o}</div>`).join('');

  const p = loadProfile();
  const done = p ? getModuleDoneCount(p, id) : 0;
  const pct = Math.round(done / mod.questions.length * 100);
  $('mod-score-display').textContent = pct + '%';
  $('module-content-title').textContent = '题目列表';

  const container = $('question-list-container');
  container.innerHTML = mod.questions.map((q, idx) => {
    const isDone = p && (getRiclpmProgress(p).completedQuestions || []).includes(q.id);
    const attempt = p ? p.attempts.filter(a => a.questionId === q.id) : [];
    const bestScore = attempt.length ? Math.max(...attempt.map(a => a.totalScore)) : null;

    const statusClass = isDone ? 'question-row__status--done' :
      (attempt.length ? 'question-row__status--partial' : 'question-row__status--todo');
    const statusIcon  = isDone ? '✓' : (attempt.length ? '⋯' : String(idx+1));

    const levelClass = { '入门':'badge--green', '标准':'badge--orange', '进阶':'badge--red' }[q.level] || 'badge--blue';

    return `
      <div class="question-row" onclick="goQuestion(${id}, ${idx})">
        <div class="question-row__status ${statusClass}">${statusIcon}</div>
        <div class="question-row__info">
          <div class="question-row__title">${q.title}</div>
          <div class="question-row__meta">
            <span class="badge ${levelClass}" style="font-size:10px;">${q.level}</span>
            <span class="tag" style="font-size:10px;">${q.type}</span>
          </div>
        </div>
        <div class="question-row__score">
          ${bestScore !== null ? `<span class="text-accent font-bold">${bestScore}</span><span class="text-secondary"> / 100</span>` : '<span class="text-muted">未作答</span>'}
        </div>
        <button class="btn btn--secondary btn--sm">进入</button>
      </div>
    `;
  }).join('');
}

/* ============================================================
   做题页
============================================================ */
let wsState = {
  moduleId: 1, qIndex: 0, questionId: 'm1_q1',
  hintsShown: 0, savedAt: null
};

function goQuestion(moduleId, qIndex) {
  wsState.moduleId   = moduleId;
  wsState.qIndex     = qIndex;
  const mod = MODULE_DATA[moduleId];
  wsState.questionId = mod.questions[qIndex].id;
  wsState.hintsShown = 0;
  currentModuleId = moduleId;

  loadQuestionIntoWorkspace(wsState.questionId);
  goPage('workspace');
}

function returnToCurrentModule() {
  if (wsState && wsState.moduleId && MODULE_DATA[wsState.moduleId]) {
    renderModuleDetail(wsState.moduleId);
  } else if (currentModuleId && MODULE_DATA[currentModuleId]) {
    renderModuleDetail(currentModuleId);
  } else {
    renderModuleOverview();
  }
  goPage('module');
}

function returnToCurrentQuestion() {
  if (wsState && wsState.questionId && QUESTION_DATA[wsState.questionId]) {
    goPage('workspace');
    return;
  }
  returnToCurrentModule();
}

function loadQuestionIntoWorkspace(qid) {
  const q = QUESTION_DATA[qid];
  if (!q) {
    $('ws-q-title').textContent = MODULE_DATA[wsState.moduleId].questions[wsState.qIndex].title;
    $('ws-topbar-title').textContent = '题目加载中...';
    return;
  }

  $('ws-topbar-title').textContent = q.title;
  $('ws-q-title').textContent      = q.title;
  $('ws-qtype').textContent        = getQuestionTypeLabel(q);
  $('ws-qlevel').textContent       = q.level;

  $('ws-scenario').innerHTML = q.scenario;
  const taskList = $('ws-tasks');
  taskList.innerHTML = q.tasks.map((t,i) => `<li><span class="num">${i+1}</span>${t}</li>`).join('');

  if (q.simOutput) {
    $('ws-simoutput-section').style.display = 'block';
    $('ws-simoutput-label').textContent = q.simOutputLabel || '模拟输出';
    $('ws-simoutput').textContent = q.simOutput;
  } else {
    $('ws-simoutput-section').style.display = 'none';
  }

  if (q.dataName) {
    $('ws-data-name').textContent = q.dataName;
    $('ws-data-section').style.display = 'block';
  } else {
    $('ws-data-section').style.display = 'none';
  }

  if (q.judgeQ) {
    $('ws-section-judge').style.display = 'block';
    $('ws-judge-question').textContent = q.judgeQ;
    document.querySelectorAll('[name="judge"]').forEach(r => r.checked = false);
  } else {
    $('ws-section-judge').style.display = 'none';
  }

  if (q.type === 'multi' && q.options && q.options.length) {
    $('ws-section-multi').style.display = 'block';
    $('ws-multi-options').innerHTML = q.options.map(opt => `
      <label class="checkbox-option">
        <input type="checkbox" name="multi" value="${opt.id}">
        <span>${opt.text}</span>
      </label>
    `).join('');
  } else {
    $('ws-section-multi').style.display = 'none';
    $('ws-multi-options').innerHTML = '';
  }

  const isSlotFill = q.answer && q.answer.graderType === 'slot_fill';
  if (isSlotFill) {
    $('ws-section-slots').style.display = 'block';
    $('ws-slot-num').textContent = q.judgeQ ? 'B' : 'A';
    $('ws-slot-label').textContent = q.slotLabel || '代码补全';
    $('ws-slot-hint').textContent = q.slotHint || '每个空位单独选择，不需要删除或保留任何下划线。';
    renderSlotFill(q);
  } else {
    $('ws-section-slots').style.display = 'none';
    $('ws-slot-code').innerHTML = '';
  }

  $('ws-section-code').style.display = (q.type === 'code' && !isSlotFill) ? 'block' : 'none';

  const valueGrid = $('ws-value-grid');
  if (q.values && q.values.length) {
    $('ws-section-values').style.display = 'block';
    valueGrid.innerHTML = q.values.map(v => `
      <div class="value-item">
        <div class="value-item__label">${v.label}</div>
        <input class="value-item__input" type="number" step="0.001" id="val-${v.key}" placeholder="0.000" />
      </div>
    `).join('');
    let num = 'B';
    if (q.type === 'code' && q.judgeQ) num = 'C';
    else if (q.type === 'code') num = 'B';
    else if (q.judgeQ) num = 'B';
    else num = 'A';
    $('ws-val-num').textContent = num;
  } else {
    $('ws-section-values').style.display = 'none';
  }

  if (q.textPrompt) {
    $('ws-section-text').style.display = 'block';
    $('ws-text-label').textContent = q.textLabel || ((q.type === 'judge' || q.type === 'multi') ? '判断理由' : '结论与表述');
    $('ws-text-num').textContent = getTextSectionNum(q);
    $('ws-text-prompt').textContent = q.textPrompt;
    $('ws-text-input').value = '';
    $('ws-char-count').textContent = '0';
  } else {
    $('ws-section-text').style.display = 'none';
  }

  for (let i = 1; i <= 4; i++) {
    $(`hint-content-${i}`).classList.remove('show');
  }
  if (q.hints) {
    q.hints.forEach((h, i) => {
      const el = $(`hint-content-${i+1}`);
      if (el) el.innerHTML = h.replace(/\n/g, '<br>');
    });
  }
  $('hint-used-count').textContent = '0 / 4 已使用';
  wsState.hintsShown = 0;

  const p = loadProfile();
  const draft = p && p.drafts[qid];
  if (draft) {
    if (draft.code) $('ws-code-input').value = draft.code;
    if (draft.text) $('ws-text-input').value = draft.text;
    if (draft.values && q.values) {
      q.values.forEach(v => {
        const el = $(`val-${v.key}`);
        if (el && draft.values[v.key] != null) el.value = draft.values[v.key];
      });
    }
    if (draft.multi && q.type === 'multi') {
      document.querySelectorAll('[name="multi"]').forEach(el => {
        el.checked = draft.multi.includes(el.value);
      });
    }
    if (draft.slots && isSlotFill) {
      document.querySelectorAll('[data-slot-key]').forEach(el => {
        if (draft.slots[el.dataset.slotKey] != null) el.value = draft.slots[el.dataset.slotKey];
      });
    }
    $('ws-save-status').textContent = '已恢复草稿';
  } else {
    $('ws-code-input').value = q.starterCode || '';
    $('ws-text-input').value = '';
    $('ws-save-status').textContent = '未保存草稿';
  }
}

function renderSlotFill(q) {
  const options = q.slotOptions || ['~', '=~', '~~', ':='];
  const rows = q.slotRows || [];
  $('ws-slot-code').innerHTML = rows.map(row => {
    const parts = (row.parts || []).map(part => {
      if (part.slot) {
        const slot = (q.answer.slots || []).find(item => item.key === part.slot);
        const label = slot ? slot.label : part.slot;
        return `<select class="slot-select" data-slot-key="${part.slot}" aria-label="${label}">
          <option value="">选择</option>
          ${options.map(op => `<option value="${op}">${op}</option>`).join('')}
        </select>`;
      }
      return escapeHtml(part.text || '');
    }).join('');
    return `<div class="slot-code-line">${parts}</div>`;
  }).join('');
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, ch => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
  }[ch]));
}

function getQuestionTypeLabel(q) {
  return q.typeLabel || { judge:'判断题', multi:'多选题', values:'数值填写', code:'完整代码' }[q.type] || '练习题';
}

function getTextSectionNum(q) {
  if (q.type === 'judge' || q.type === 'multi') return 'B';
  if (q.answer && q.answer.graderType === 'slot_fill') return q.judgeQ ? 'C' : 'B';
  if (q.type === 'code' && q.values && q.values.length) return 'C';
  if (q.type === 'values') return q.judgeQ ? 'C' : 'B';
  return 'D';
}

$('ws-text-input') && $('ws-text-input').addEventListener('input', function() {
  $('ws-char-count').textContent = this.value.length;
});

function showHint(num) {
  const el = $(`hint-content-${num}`);
  if (!el) return;
  const isShow = el.classList.contains('show');
  if (!isShow) {
    el.classList.add('show');
    wsState.hintsShown = Math.max(wsState.hintsShown, num);
    $('hint-used-count').textContent = `${wsState.hintsShown} / 4 已使用`;
  } else {
    el.classList.remove('show');
  }
}

function saveDraft() {
  const p = loadProfile();
  if (!p) { showToast('请先创建学习档案', 'warning'); return; }
  const qid = wsState.questionId;
  const q   = QUESTION_DATA[qid];

  const draft = {
    savedAt: now(),
    code:    $('ws-code-input').value,
    text:    $('ws-text-input').value,
    values:  {},
    multi:   [],
    slots:   {}
  };
  if (q && q.values) {
    q.values.forEach(v => {
      const el = $(`val-${v.key}`);
      if (el) draft.values[v.key] = el.value;
    });
  }
  if (q && q.type === 'multi') {
    draft.multi = Array.from(document.querySelectorAll('[name="multi"]:checked')).map(el => el.value);
  }
  if (q && q.answer && q.answer.graderType === 'slot_fill') {
    document.querySelectorAll('[data-slot-key]').forEach(el => {
      draft.slots[el.dataset.slotKey] = el.value;
    });
  }
  p.drafts[qid] = draft;
  p.profile.lastUsedAt = now();
  saveProfile(p);
  $('ws-save-status').textContent = '草稿已保存 ' + new Date().toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit'});
  showToast('草稿已保存', 'success');
}

function downloadData() {
  const q = QUESTION_DATA[wsState.questionId];
  const dataName = q && q.dataName ? q.dataName : 'sim_data.csv';
  const isThreeVariableMediation = q && q.dataName === 'stress_rumination_depression_3wave.csv';

  let csv = isThreeVariableMediation
    ? 'id,x1,x2,x3,m1,m2,m3,y1,y2,y3\n'
    : 'id,x1,x2,x3,y1,y2,y3\n';
  for (let i = 1; i <= 300; i++) {
    const x1 = +(Math.random()*2 - 1 + Math.random()).toFixed(3);
    const x2 = +(x1 * 0.4 + Math.random()*0.8 - 0.4).toFixed(3);
    const x3 = +(x2 * 0.4 + Math.random()*0.8 - 0.4).toFixed(3);
    if (isThreeVariableMediation) {
      const m1 = +(0.22*x1 + Math.random()*1.2 - 0.6).toFixed(3);
      const m2 = +(0.42*m1 + 0.33*x1 + Math.random()*0.8 - 0.4).toFixed(3);
      const m3 = +(0.42*m2 + 0.18*x2 + Math.random()*0.8 - 0.4).toFixed(3);
      const y1 = +(0.18*m1 + Math.random()*1.2 - 0.6).toFixed(3);
      const y2 = +(0.38*y1 + 0.18*m1 + 0.10*x1 + Math.random()*0.8 - 0.4).toFixed(3);
      const y3 = +(0.38*y2 + 0.26*m2 + 0.09*x1 + Math.random()*0.8 - 0.4).toFixed(3);
      csv += `${i},${x1},${x2},${x3},${m1},${m2},${m3},${y1},${y2},${y3}\n`;
    } else {
      const y1 = +(Math.random()*2 - 1 + Math.random()).toFixed(3);
      const y2 = +(y1 * 0.38 + x1 * 0.23 + Math.random()*0.8 - 0.4).toFixed(3);
      const y3 = +(y2 * 0.38 + x2 * 0.23 + Math.random()*0.8 - 0.4).toFixed(3);
      csv += `${i},${x1},${x2},${x3},${y1},${y2},${y3}\n`;
    }
  }
  const blob = new Blob([csv], { type:'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = dataName; a.click();
  URL.revokeObjectURL(url);
  showToast('模拟数据已下载', 'success');
}

function downloadStarter() {
  const q = QUESTION_DATA[wsState.questionId];
  const code = q && q.starterCode ? q.starterCode : `# RI-CLPM Starter Code\nlibrary(lavaan)\n\n# 读取数据\ndata <- read.csv("sim_data.csv")\n\n# 在此搭建你的 RI-CLPM 模型\nmodel <- '\n  # 随机截距\n  RI_x =~ 1*x1 + 1*x2 + 1*x3\n  RI_y =~ 1*y1 + 1*y2 + 1*y3\n\n  # 个体内残差 (within-person components)\n  wx1 =~ 1*x1\n  wx2 =~ 1*x2\n  wx3 =~ 1*x3\n  wy1 =~ 1*y1\n  wy2 =~ 1*y2\n  wy3 =~ 1*y3\n\n  # 固定测量误差为0\n  x1 ~~ 0*x1; x2 ~~ 0*x2; x3 ~~ 0*x3\n  y1 ~~ 0*y1; y2 ~~ 0*y2; y3 ~~ 0*y3\n\n  # 自回归路径 (等同约束)\n  wx2 ~ a*wx1; wx3 ~ a*wx2\n  wy2 ~ b*wy1; wy3 ~ b*wy2\n\n  # 交叉滞后路径 (等同约束)\n  wx2 ~ c*wy1; wx3 ~ c*wy2\n  wy2 ~ d*wx1; wy3 ~ d*wx2\n'\n\n# 运行模型\nfit <- lavaan(model, data = data, estimator = "ML",\n              missing = "listwise", std.lv = FALSE)\n\n# 查看结果\nsummary(fit, fit.measures = TRUE, standardized = TRUE)\nfitmeasures(fit, c("cfi","tli","rmsea","srmr"))\n`;
  const blob = new Blob([code], { type:'text/plain' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = (q && q.starterName) || 'starter_code.R'; a.click();
  URL.revokeObjectURL(url);
  showToast('Starter Code 已下载', 'success');
}

function clearCode() { $('ws-code-input').value = ''; }
function copyCode() {
  navigator.clipboard.writeText($('ws-code-input').value)
    .then(() => showToast('代码已复制', 'success'))
    .catch(() => showToast('复制失败，请手动复制', 'error'));
}

function submitAnswer() {
  const p = loadProfile();
  if (!p) { showToast('请先创建学习档案', 'warning'); return; }

  const qid = wsState.questionId;
  const q   = QUESTION_DATA[qid];
  const mod = MODULE_DATA[wsState.moduleId];
  if (!q) {
    showToast('这道题正在完善中，请先选择本模块中已开放的题目', 'warning');
    return;
  }

  const submission = {
    questionId:  qid,
    moduleId:    wsState.moduleId,
    topic:       'riclpm',
    submittedAt: now(),
    hintsUsed:   wsState.hintsShown,
    answers: {
      judge:  null,
      multi:  [],
      slots:  {},
      code:   $('ws-code-input').value,
      values: {},
      text:   $('ws-text-input').value
    }
  };

  const judgeEl = document.querySelector('[name="judge"]:checked');
  if (judgeEl) submission.answers.judge = judgeEl.value;
  submission.answers.multi = Array.from(document.querySelectorAll('[name="multi"]:checked')).map(el => el.value);
  document.querySelectorAll('[data-slot-key]').forEach(el => {
    submission.answers.slots[el.dataset.slotKey] = el.value;
  });

  if (q && q.values) {
    q.values.forEach(v => {
      const el = $(`val-${v.key}`);
      if (el) {
        const parsed = parseFloat(el.value);
        submission.answers.values[v.key] = Number.isNaN(parsed) ? null : parsed;
      }
    });
  }

  const validationMsg = validateAnswer(q, submission.answers);
  if (validationMsg) {
    showToast(validationMsg, 'warning');
    return;
  }

  const scores = autoScore(q, submission.answers);
  submission.totalScore = scores.total;
  submission.scores     = scores;

  p.attempts.push(submission);

  const doneList = getRiclpmProgress(p).completedQuestions;
  if (!doneList.includes(qid) && isSubmissionComplete(q, scores)) {
    doneList.push(qid);
  }
  p.profile.lastUsedAt = now();
  saveProfile(p);

  renderFeedbackPage(q, mod, submission, scores);
  goPage('feedback');
}

function validateAnswer(q, answers) {
  if (q.judgeQ && !answers.judge) return '请先完成判断选择';
  if (q.type === 'multi' && (!answers.multi || !answers.multi.length)) return '请至少选择一个选项';
  if (q.answer && q.answer.graderType === 'slot_fill') {
    const missing = (q.answer.slots || []).some(slot => !answers.slots || !answers.slots[slot.key]);
    if (missing) return '请完成所有代码空位';
  }
  if (q.type === 'code' && q.answer && q.answer.code_keywords && !(answers.code || '').trim()) {
    return '请先填写或粘贴你的 R 代码';
  }
  if (q.values && q.values.length) {
    const missing = q.values.some(v => answers.values[v.key] === null || Number.isNaN(answers.values[v.key]));
    if (missing) return '请填写所有关键数值';
  }
  if (q.textPrompt && (answers.text || '').trim().length < 12) {
    return '请补充 1-3 句话说明你的判断理由';
  }
  return '';
}

function isSubmissionComplete(q, scores) {
  if (q && q.feedbackMode === 'module4_check_report') {
    return !!(scores.module4Report && scores.module4Report.isComplete);
  }
  if (q && (q.feedbackMode === 'module5_structure_check' || q.feedbackMode === 'module5_bootstrap_check')) {
    return !!(scores.module5Report && scores.module5Report.isComplete);
  }
  return scores.total >= 60;
}

function autoScore(q, answers) {
  if (!q) return { total:0, code:0, values:0, stat:0, text:0 };
  if (q.feedbackMode === 'module4_check_report') {
    return gradeModule4CheckReport(q, answers);
  }
  if (q.feedbackMode === 'module5_structure_check' || q.feedbackMode === 'module5_bootstrap_check') {
    return gradeModule5CheckReport(q, answers);
  }
  if (q.answer && q.answer.graderType === 'slot_fill') {
    return gradeSlotFill(q, answers);
  }

  let code = 0, values = 0, stat = 0, text = 0;
  const active = { code:false, values:false, stat:false, text:false };

  if (q.answer && q.answer.judge) {
    active.stat = true;
    stat = answers.judge === q.answer.judge ? 25 : 0;
  }

  if (q.answer && q.answer.multi && q.options && q.options.length) {
    active.stat = true;
    const correct = new Set(q.answer.multi);
    const selected = new Set(answers.multi || []);
    let optionScore = 0;
    q.options.forEach(opt => {
      const shouldSelect = correct.has(opt.id);
      const didSelect = selected.has(opt.id);
      if (shouldSelect === didSelect) optionScore++;
    });
    stat = Math.round(optionScore / q.options.length * 25);
  }

  if (q.type === 'code' && q.answer && q.answer.code_keywords) {
    active.code = true;
    const codeStr = answers.code || '';
    let hit = 0;
    q.answer.code_keywords.forEach(kw => { if (codeStr.includes(kw)) hit++; });
    const patternList = q.answer.code_patterns || [];
    patternList.forEach(pattern => {
      try {
        if (new RegExp(pattern, 'm').test(codeStr)) hit++;
      } catch(e) {}
    });
    const requiredCount = q.answer.code_keywords.length + patternList.length;
    code = Math.round(hit / requiredCount * 25);
  }

  if (q.answer && q.answer.values && q.values && q.values.length) {
    active.values = true;
    let hit = 0;
    q.values.forEach(v => {
      const range = q.answer.values[v.key];
      const val   = answers.values[v.key];
      if (Array.isArray(range) && val !== null && val >= range[0] && val <= range[1]) hit++;
    });
    values = Math.round(hit / q.values.length * 25);
  }

  const textStr = (answers.text || '').trim();
  if (q.textPrompt) {
    active.text = true;
  }
  if (active.text && textStr.length > 30) {
    const keywords = (q.answer && q.answer.text_keywords) ||
      ['个体内','within','RI-CLPM','路径','显著','拟合'];
    let kwHit = 0;
    keywords.forEach(kw => { if (textStr.includes(kw)) kwHit++; });
    text = Math.min(25, 10 + kwHit * 3);
  } else if (active.text && textStr.length > 0) {
    text = 8;
  }

  let total;
  if (q.scoring) {
    total = Math.round(
      (code / 25) * (q.scoring.code || 0) +
      (values / 25) * (q.scoring.values || 0) +
      (stat / 25) * (q.scoring.stat || 0) +
      (text / 25) * (q.scoring.text || 0)
    );
  } else {
    const activeCount = Object.values(active).filter(Boolean).length || 1;
    const raw = code + values + stat + text;
    total = Math.round(raw / (activeCount * 25) * 100);
  }
  total = Math.min(100, total);
  return { total, code, values, stat, text, active };
}

function gradeModule4CheckReport(q, answers) {
  const codeChecks = buildModule4CodeChecks(q, answers.code || '');
  const valueChecks = buildModule4ValueChecks(q, answers.values || {});
  const textChecks = buildModule4TextChecks(q, answers.text || '');

  const codeOk = codeChecks.every(item => item.level !== 'missing' && item.level !== 'error');
  const valuesOk = valueChecks.every(item => item.level === 'ok' || item.level === 'near');
  const textOk = textChecks.quality !== 'needs';

  const code = Math.round(codeChecks.filter(item => item.level === 'ok').length / codeChecks.length * 25);
  const values = valueChecks.length
    ? Math.round(valueChecks.filter(item => item.level === 'ok' || item.level === 'near').length / valueChecks.length * 25)
    : 0;
  const text = textChecks.score;
  const total = Math.round((code / 25) * 45 + (values / 25) * 35 + (text / 25) * 20);

  return {
    total,
    code,
    values,
    stat: 0,
    text,
    active: { code:true, values:true, stat:false, text:true },
    module4Report: {
      codeChecks,
      valueChecks,
      textChecks,
      isComplete: codeOk && valuesOk && textOk,
      checklist: buildModule4RevisionChecklist(codeChecks, valueChecks, textChecks)
    }
  };
}

function buildModule4CodeChecks(q, code) {
  const checks = [
    makeCodeCheck('随机截距 RI_x', hasMeasurement(code, 'RI_x', ['x1','x2','x3']),
      '已检测到 RI_x 指向 x1-x3。', '未检测到 `RI_x =~ 1*x1 + 1*x2 + 1*x3` 或等价写法。'),
    makeCodeCheck('随机截距 RI_y', hasMeasurement(code, 'RI_y', ['y1','y2','y3']),
      '已检测到 RI_y 指向 y1-y3。', '未检测到 `RI_y =~ 1*y1 + 1*y2 + 1*y3` 或等价写法。'),
    makeCodeCheck('within 成分 wx1-wx3', ['wx1','wx2','wx3'].every((lhs, i) => hasMeasurement(code, lhs, [`x${i+1}`])),
      'wx1-wx3 定义完整。', '检测到 wx 相关语句不完整，请确认 wx1、wx2、wx3 都已定义。'),
    makeCodeCheck('within 成分 wy1-wy3', ['wy1','wy2','wy3'].every((lhs, i) => hasMeasurement(code, lhs, [`y${i+1}`])),
      'wy1-wy3 定义完整。', '检测到 wy 相关语句不完整，请确认 wy1、wy2、wy3 都已定义。'),
    makeCodeCheck('固定观测变量方差为 0', ['x1','x2','x3','y1','y2','y3'].every(v => hasZeroVariance(code, v)),
      '已固定 x/y 六个观测变量的残差方差。', '请补齐 `x1 ~~ 0*x1` 到 `y3 ~~ 0*y3` 这组固定方差语句。'),
    makeCodeCheck('自回归路径', [
      ['wx2','wx1'], ['wx3','wx2'], ['wy2','wy1'], ['wy3','wy2']
    ].every(([lhs, rhs]) => hasRegression(code, lhs, rhs)),
      '自回归路径已覆盖两个变量的相邻时间点。', '自回归路径不完整，请检查 wx2~wx1、wx3~wx2、wy2~wy1、wy3~wy2。'),
    makeCodeCheck('交叉滞后路径', [
      ['wx2','wy1'], ['wx3','wy2'], ['wy2','wx1'], ['wy3','wx2']
    ].every(([lhs, rhs]) => hasRegression(code, lhs, rhs)),
      '交叉滞后路径已覆盖两个方向和两个滞后间隔。', '交叉滞后路径不完整，请检查 wx2~wy1、wx3~wy2、wy2~wx1、wy3~wx2。')
  ];

  if (q && q.title && q.title.includes('残差协方差')) {
    checks.push(
      makeCodeCheck('随机截距协方差 RI_x ~~ RI_y', hasCovariance(code, 'RI_x', 'RI_y'),
        '已写出 RI_x ~~ RI_y。', '请补上随机截距协方差 `RI_x ~~ RI_y`。'),
      makeCodeCheck('同波协方差 wx1 ~~ wy1', hasCovariance(code, 'wx1', 'wy1'),
        '已写出 wx1 ~~ wy1。', '请补上第一波同波 within 协方差 `wx1 ~~ wy1`。'),
      makeCodeCheck('同波协方差 wx2 ~~ wy2', hasCovariance(code, 'wx2', 'wy2'),
        '已写出 wx2 ~~ wy2。', '请补上第二波同波 within 协方差 `wx2 ~~ wy2`。'),
      makeCodeCheck('同波协方差 wx3 ~~ wy3', hasCovariance(code, 'wx3', 'wy3'),
        '已写出 wx3 ~~ wy3。', '请补上第三波同波 within 协方差 `wx3 ~~ wy3`。'),
      makeCodeCheck('协方差位置放在同波', !hasOffWaveWithinCovariance(code),
        '未检测到跨波 within 协方差误写。', '检测到类似 `wx1 ~~ wy2` 的跨波协方差；跨时间关系应写成回归路径。', 'error')
    );
  }

  return checks;
}

function makeCodeCheck(label, ok, okMessage, missingMessage, failLevel = 'missing') {
  return {
    label,
    status: ok ? '已完成' : (failLevel === 'error' ? '需修正' : '缺失'),
    level: ok ? 'ok' : failLevel,
    message: ok ? okMessage : missingMessage
  };
}

function buildModule4ValueChecks(q, values) {
  const refs = q.answer && q.answer.referenceValues ? q.answer.referenceValues : {};
  return (q.values || []).map(v => {
    const ref = refs[v.key];
    const user = values[v.key];
    if (!ref) return null;
    if (user === null || user === undefined || Number.isNaN(user)) {
      return { label: v.label, user: '未填写', reference: ref.value, diff: null, status: '未填写', level: 'missing', message: '请回到输出中重新提取该指标。' };
    }
    const diff = user - ref.value;
    const abs = Math.abs(diff);
    if (abs <= ref.tolerance) {
      return { label: v.label, user, reference: ref.value, diff, status: '正确', level: 'ok', message: '与你的参考答案一致。' };
    }
    if (abs <= ref.closeTolerance) {
      return { label: v.label, user, reference: ref.value, diff, status: '接近', level: 'near', message: `${diff > 0 ? '偏高' : '偏低'} ${formatMetric(Math.abs(diff))}，方向基本正确，请核对小数位或输出行。` };
    }
    return { label: v.label, user, reference: ref.value, diff, status: '有偏差', level: 'error', message: `${diff > 0 ? '偏高' : '偏低'} ${formatMetric(Math.abs(diff))}，建议回到 fitMeasures 或参数表重新定位。` };
  }).filter(Boolean);
}

function buildModule4TextChecks(q, textValue) {
  const text = (textValue || '').trim();
  const hasWithin = /个体内|within|within-person/i.test(text);
  const hasDirection = /焦虑|抑郁|x|y|wx|wy|预测|正向|负向|路径|β|beta/i.test(text);
  const hasFit = /拟合|CFI|RMSEA|SRMR|TLI/i.test(text);
  const overCausal = /导致|证明因果|证明.*因果|决定/.test(text);
  const items = [
    { label:'个体内层面', ok:hasWithin, okText:'明确指出该效应属于个体内层面。', fixText:'结果句里还需要写出“个体内层面”或 within-person。' },
    { label:'路径方向与符号', ok:hasDirection, okText:'提到了路径方向或焦虑/抑郁的跨时预测。', fixText:'请补充路径方向，例如“焦虑正向预测后一时间点抑郁”。' },
    { label:'拟合指标', ok:hasFit, okText:'交代了 CFI / RMSEA 或整体拟合。', fixText:'建议先交代模型拟合，再解释主要路径。' },
    { label:'避免过强因果', ok:!overCausal, okText:'没有把路径写成过强因果结论。', fixText:'“导致/证明因果”表述过强，建议改成“预测”或“关联”。' }
  ];
  const passed = items.filter(item => item.ok).length;
  const quality = passed >= 4 ? 'good' : (passed >= 2 ? 'basic' : 'needs');
  return {
    quality,
    label: quality === 'good' ? '较好' : (quality === 'basic' ? '基本到位' : '需加强'),
    score: quality === 'good' ? 25 : (quality === 'basic' ? 16 : 8),
    done: items.filter(item => item.ok).map(item => item.okText),
    fixes: items.filter(item => !item.ok).map(item => item.fixText)
  };
}

function buildModule4RevisionChecklist(codeChecks, valueChecks, textChecks) {
  const items = [];
  codeChecks.filter(item => item.level !== 'ok').slice(0, 3).forEach(item => items.push(item.message));
  valueChecks.filter(item => item.level === 'missing' || item.level === 'error').slice(0, 2)
    .forEach(item => items.push(`${item.label}：${item.message}`));
  textChecks.fixes.slice(0, 2).forEach(item => items.push(item));
  return items.length ? items.slice(0, 4) : ['核对无明显缺口，可以进入下一题或尝试用自己的数据重跑模型。'];
}

function gradeModule5CheckReport(q, answers) {
  const codeChecks = buildModule5CodeChecks(q, answers.code || '');
  const valueChecks = buildModule4ValueChecks(q, answers.values || {});
  const textChecks = buildModule5TextChecks(q, answers.text || '');
  const judgeChecks = buildModule5JudgeChecks(q, answers.judge);

  const codeOk = codeChecks.every(item => item.level !== 'missing' && item.level !== 'error');
  const valuesOk = valueChecks.every(item => item.level === 'ok' || item.level === 'near');
  const textOk = textChecks.quality !== 'needs';
  const judgeOk = judgeChecks.every(item => item.level === 'ok');

  const code = codeChecks.length
    ? Math.round(codeChecks.filter(item => item.level === 'ok').length / codeChecks.length * 25)
    : 0;
  const values = valueChecks.length
    ? Math.round(valueChecks.filter(item => item.level === 'ok' || item.level === 'near').length / valueChecks.length * 25)
    : 0;
  const stat = judgeChecks.length && judgeOk ? 25 : 0;
  const text = textChecks.score;
  const total = Math.round((code / 25) * 45 + (values / 25) * 30 + (stat / 25) * 10 + (text / 25) * 15);

  return {
    total,
    code,
    values,
    stat,
    text,
    active: { code:true, values:true, stat:!!judgeChecks.length, text:true },
    module5Report: {
      codeChecks,
      valueChecks,
      judgeChecks,
      textChecks,
      isComplete: codeOk && valuesOk && judgeOk && textOk,
      checklist: buildModule5RevisionChecklist(codeChecks, valueChecks, judgeChecks, textChecks)
    }
  };
}

function buildModule5CodeChecks(q, code) {
  const checkedCode = stripRComments(code);
  if (q.feedbackMode === 'module5_bootstrap_check') {
    return [
      makeCodeCheck('保留间接效应定义 ind_xmy := a*b', hasDefinedProduct(checkedCode, 'ind_xmy', 'a', 'b'),
        '已检测到 ind_xmy 定义参数。', '请确认模型中保留 `ind_xmy := a*b`。'),
      makeCodeCheck('使用 bootstrap 标准误', codeContainsPattern(checkedCode, 'se\\s*=\\s*["\']bootstrap["\']'),
        '已检测到 `se = "bootstrap"`。', '请在 lavaan() 中加入 `se = "bootstrap"`。'),
      makeCodeCheck('设置 bootstrap 次数', codeContainsPattern(checkedCode, 'bootstrap\\s*=\\s*(5000|[1-9][0-9]{3,})'),
        '已检测到 bootstrap 次数设置。', '请加入 `bootstrap = 5000` 或至少 1000 次以上的 bootstrap 设置。'),
      makeCodeCheck('提取 bootstrap 置信区间', codeContainsPattern(checkedCode, 'parameterEstimates') && codeContainsPattern(checkedCode, 'boot\\.ci\\.type'),
        '已检测到 parameterEstimates() 与 boot.ci.type。', '请使用 `parameterEstimates(..., ci = TRUE, boot.ci.type = "perc")` 或等价代码提取区间。'),
      makeCodeCheck('定位 ind_xmy 结果行', codeContainsPattern(checkedCode, 'ind_xmy'),
        '提取代码中包含 ind_xmy。', '提取参数表时请明确定位 ind_xmy 的估计值与 CI。')
    ];
  }

  return [
    makeCodeCheck('三组随机截距 RI_x / RI_m / RI_y',
      hasMeasurement(checkedCode, 'RI_x', ['x1','x2','x3']) &&
      hasMeasurement(checkedCode, 'RI_m', ['m1','m2','m3']) &&
      hasMeasurement(checkedCode, 'RI_y', ['y1','y2','y3']),
      '三组随机截距定义完整。', '请补齐 `RI_x`、`RI_m`、`RI_y` 对三个波次的定义。'),
    makeCodeCheck('三组 within 成分 wx / wm / wy',
      ['wx1','wx2','wx3'].every((lhs, i) => hasMeasurement(checkedCode, lhs, [`x${i+1}`])) &&
      ['wm1','wm2','wm3'].every((lhs, i) => hasMeasurement(checkedCode, lhs, [`m${i+1}`])) &&
      ['wy1','wy2','wy3'].every((lhs, i) => hasMeasurement(checkedCode, lhs, [`y${i+1}`])),
      'wx、wm、wy 三组 within 成分已覆盖 1-3 波。', '请确认 wx1-wx3、wm1-wm3、wy1-wy3 都已定义。'),
    makeCodeCheck('固定九个观测变量残差方差为 0',
      ['x1','x2','x3','m1','m2','m3','y1','y2','y3'].every(v => hasZeroVariance(checkedCode, v)),
      '九个观测变量的残差方差已固定。', '请补齐 x、m、y 三组变量的 `变量 ~~ 0*变量` 语句。'),
    makeCodeCheck('三变量自回归路径',
      [
        ['wx2','wx1'], ['wx3','wx2'],
        ['wm2','wm1'], ['wm3','wm2'],
        ['wy2','wy1'], ['wy3','wy2']
      ].every(([lhs, rhs]) => hasRegression(checkedCode, lhs, rhs)),
      'x、m、y 三个变量的相邻波次自回归路径已覆盖。', '请补齐 wx、wm、wy 三组相邻时间点自回归路径。'),
    makeCodeCheck('a 路径：wm2 ~ a*wx1', hasLabeledRegression(checkedCode, 'wm2', 'a', 'wx1'),
      '已检测到 `wm2 ~ a*wx1`。', '请把 a 路径明确写成 `wm2 ~ a*wx1`。'),
    makeCodeCheck('b 路径：wy3 ~ b*wm2', hasLabeledRegression(checkedCode, 'wy3', 'b', 'wm2'),
      '已检测到 `wy3 ~ b*wm2`。', '请把 b 路径明确写成 `wy3 ~ b*wm2`。'),
    makeCodeCheck('c 直接路径：wy3 ~ c*wx1', hasLabeledRegression(checkedCode, 'wy3', 'c', 'wx1'),
      '已检测到 `wy3 ~ c*wx1`。', '请加入直接路径 `wy3 ~ c*wx1`，用于和间接链区分。'),
    makeCodeCheck('间接效应：ind_xmy := a*b', hasDefinedProduct(checkedCode, 'ind_xmy', 'a', 'b'),
      '已检测到 `ind_xmy := a*b`。', '请用定义参数写出 `ind_xmy := a*b`，不要写成回归路径。')
  ];
}

function buildModule5JudgeChecks(q, judgeValue) {
  if (!q.judgeQ || !q.answer || !q.answer.judge) return [];
  const ok = judgeValue === q.answer.judge;
  return [
    makeCodeCheck('CI 显著性判断', ok,
      '判断正确：bootstrap CI 不包含 0。', '本题参考 CI 为 [0.041, 0.132]，不包含 0，因此应判断为显著。', 'error')
  ];
}

function buildModule5TextChecks(q, textValue) {
  const text = (textValue || '').trim();
  const isBootstrap = q.feedbackMode === 'module5_bootstrap_check';
  const hasWithin = /个体内|within|within-person/i.test(text);
  const hasIndirect = /间接效应|中介|indirect|ind_xmy|a\s*\*\s*b/i.test(text);
  const hasChain = /X1|x1|wx1|M2|m2|wm2|Y3|y3|wy3|跨时|链/i.test(text);
  const hasCi = /CI|置信区间|不包含\s*0|不跨\s*0|包含\s*0|跨\s*0/i.test(text);
  const overCausal = /导致|证明因果|证明.*因果|决定/.test(text);
  const items = [
    { label:'within-person 限定', ok:hasWithin, okText:'明确把结论限定在 within-person 层面。', fixText:'结论里需要出现“个体内”或 within-person。' },
    { label:'间接效应', ok:hasIndirect, okText:'提到了中介或间接效应。', fixText:'请明确说明这里检验的是间接效应 / 中介链。' },
    { label:'跨时链条', ok:isBootstrap ? true : hasChain, okText:'说明了 X1 -> M2 -> Y3 的跨时间链条。', fixText:'建议写清楚 X1 -> M2 -> Y3 的时间顺序。' },
    { label:'CI 解读', ok:isBootstrap ? hasCi : true, okText:'正确使用 CI 是否包含 0 来解释显著性。', fixText:'bootstrap 题需要说明 CI 是否包含 0。' },
    { label:'避免过强因果', ok:!overCausal, okText:'没有把结果写成过强因果证明。', fixText:'“导致/证明因果”过强，建议改成“预测”“统计支持”或“机制线索”。' }
  ];
  const passed = items.filter(item => item.ok).length;
  const quality = passed >= 5 ? 'good' : (passed >= 3 ? 'basic' : 'needs');
  return {
    quality,
    label: quality === 'good' ? '较好' : (quality === 'basic' ? '基本到位' : '需加强'),
    score: quality === 'good' ? 25 : (quality === 'basic' ? 16 : 8),
    done: items.filter(item => item.ok).map(item => item.okText),
    fixes: items.filter(item => !item.ok).map(item => item.fixText)
  };
}

function buildModule5RevisionChecklist(codeChecks, valueChecks, judgeChecks, textChecks) {
  const items = [];
  codeChecks.filter(item => item.level !== 'ok').slice(0, 3).forEach(item => items.push(item.message));
  valueChecks.filter(item => item.level === 'missing' || item.level === 'error').slice(0, 2)
    .forEach(item => items.push(`${item.label}：${item.message}`));
  judgeChecks.filter(item => item.level !== 'ok').forEach(item => items.push(item.message));
  textChecks.fixes.slice(0, 2).forEach(item => items.push(item));
  return items.length ? items.slice(0, 5) : ['本题核对无明显缺口，可以进入下一题或尝试用自己的研究变量替换 x/m/y。'];
}

function codeContainsPattern(code, pattern) {
  return new RegExp(pattern, 'i').test(code || '');
}

function stripRComments(code) {
  return String(code || '').split('\n').map(line => line.replace(/#.*/, '')).join('\n');
}

function hasMeasurement(code, lhs, vars) {
  return vars.every(v => codeContainsPattern(code, `${lhs}\\s*=~[\\s\\S]{0,180}${v}`));
}

function hasZeroVariance(code, variable) {
  return codeContainsPattern(code, `${variable}\\s*~~\\s*0\\s*\\*\\s*${variable}`) ||
    codeContainsPattern(code, `${variable}\\s*~~\\s*${variable}\\s*\\*\\s*0`);
}

function hasRegression(code, lhs, rhs) {
  return codeContainsPattern(code, `${lhs}\\s*~[^\\n;]*${rhs}`);
}

function hasLabeledRegression(code, lhs, label, rhs) {
  return codeContainsPattern(code, `${lhs}\\s*~[^\\n;]*${label}\\s*\\*\\s*${rhs}`);
}

function hasDefinedProduct(code, lhs, left, right) {
  return codeContainsPattern(code, `${lhs}\\s*:=\\s*${left}\\s*\\*\\s*${right}`) ||
    codeContainsPattern(code, `${lhs}\\s*:=\\s*${right}\\s*\\*\\s*${left}`);
}

function hasCovariance(code, left, right) {
  return codeContainsPattern(code, `${left}\\s*~~[^\\n;]*${right}`) ||
    codeContainsPattern(code, `${right}\\s*~~[^\\n;]*${left}`);
}

function hasOffWaveWithinCovariance(code) {
  for (let i = 1; i <= 3; i++) {
    for (let j = 1; j <= 3; j++) {
      if (i !== j && hasCovariance(code, `wx${i}`, `wy${j}`)) return true;
    }
  }
  return false;
}

function formatMetric(value) {
  if (typeof value !== 'number' || Number.isNaN(value)) return '——';
  return Number.isInteger(value) ? String(value) : value.toFixed(3).replace(/0+$/, '').replace(/\.$/, '');
}

function gradeSlotFill(q, answers) {
  const active = { code:true, values:false, stat:false, text:!!q.textPrompt };
  let stat = 0;
  if (q.answer && q.answer.judge) {
    active.stat = true;
    stat = answers.judge === q.answer.judge ? 25 : 0;
  }

  const slots = q.answer.slots || [];
  const details = slots.map(slot => {
    const userRaw = answers.slots ? answers.slots[slot.key] : '';
    const user = normalizeSlotAnswer(userRaw);
    const expected = (slot.expected || []).map(normalizeSlotAnswer);
    const correct = expected.includes(user);
    return {
      key: slot.key,
      label: slot.label,
      user: userRaw || '未填写',
      expected: slot.expected && slot.expected.length ? slot.expected[0] : '',
      correct,
      explanation: slot.explanation || ''
    };
  });
  const correctCount = details.filter(item => item.correct).length;
  const code = slots.length ? Math.round(correctCount / slots.length * 25) : 0;

  const text = gradeTextAnswer(q, answers.text || '');
  const total = Math.min(100, Math.round(
    (code / 25) * (q.scoring.code || 0) +
    (stat / 25) * (q.scoring.stat || 0) +
    (text / 25) * (q.scoring.text || 0)
  ));

  return { total, code, values:0, stat, text, active, details };
}

function normalizeSlotAnswer(value) {
  return String(value || '').replace(/\s+/g, '').trim();
}

function gradeTextAnswer(q, textValue) {
  const textStr = (textValue || '').trim();
  if (!q.textPrompt || !textStr) return 0;
  if (textStr.length <= 30) return 8;
  const keywords = (q.answer && q.answer.text_keywords) ||
    ['个体内','within','RI-CLPM','路径','显著','拟合'];
  let kwHit = 0;
  keywords.forEach(kw => { if (textStr.includes(kw)) kwHit++; });
  return Math.min(25, 10 + kwHit * 3);
}

function renderFeedbackPage(q, mod, submission, scores) {
  const qData = q || {};
  const fb = qData.feedback || {};

  if (qData.feedbackMode === 'module4_check_report') {
    renderModule4FeedbackPage(qData, mod, submission, scores);
    updateFeedbackNextButton(mod);
    return;
  }
  if (qData.feedbackMode === 'module5_structure_check' || qData.feedbackMode === 'module5_bootstrap_check') {
    renderModule5FeedbackPage(qData, mod, submission, scores);
    updateFeedbackNextButton(mod);
    return;
  }

  renderDefaultFeedbackBody();
  const scoreHeader = document.querySelector('#page-feedback .feedback-header__score');
  if (scoreHeader) scoreHeader.style.display = '';

  $('fb-title').textContent = `本题反馈：${qData.title || '反馈报告'}`;
  $('fb-meta').textContent  = `${mod.title} · 第 ${wsState.qIndex + 1} / ${mod.questions.length} 题 · ${(mod.questions[wsState.qIndex]||{}).type||''} · ${(mod.questions[wsState.qIndex]||{}).level||''}`;

  $('fb-total-score').textContent = scores.total;
  $('fb-score-label').textContent = '本题 / 100';
  $('fb-score-code').textContent  = scores.code;
  $('fb-score-values').textContent= scores.values;
  $('fb-score-stat').textContent  = scores.stat;
  $('fb-score-text').textContent  = scores.text;

  const scoreDims = document.querySelectorAll('.score-breakdown .score-dim');
  const active = scores.active || { code:true, values:true, stat:true, text:true };
  ['code','values','stat','text'].forEach((key, idx) => {
    if (scoreDims[idx]) scoreDims[idx].style.display = active[key] ? '' : 'none';
  });

  const badgesEl = $('fb-badges');
  badgesEl.innerHTML = '';
  const levelClass = { '入门':'badge--green', '标准':'badge--orange', '进阶':'badge--red' }[qData.level] || 'badge--blue';
  badgesEl.innerHTML = `<span class="badge ${levelClass}">${qData.level||''}</span>`;
  if (scores.total >= 90) badgesEl.innerHTML += `<span class="badge badge--green">🏆 优秀</span>`;
  else if (scores.total >= 70) badgesEl.innerHTML += `<span class="badge badge--blue">👍 良好</span>`;
  else if (scores.total >= 50) badgesEl.innerHTML += `<span class="badge badge--orange">📖 继续练习</span>`;
  else badgesEl.innerHTML += `<span class="badge badge--red">🔄 需要复习</span>`;

  const judgeWrong = qData.answer && qData.answer.judge &&
    submission.answers.judge && submission.answers.judge !== qData.answer.judge;
  const multiWrong = qData.answer && qData.answer.multi &&
    normalizeChoiceList(submission.answers.multi).join('|') !== normalizeChoiceList(qData.answer.multi).join('|');
  const standardJudge = qData.answer && qData.answer.judge === 'true' ? '正确' : '错误';
  const userJudge = submission.answers.judge === 'true' ? '正确' : '错误';
  const standardMulti = qData.answer && qData.answer.multi ? formatChoiceList(qData.answer.multi) : '';
  const userMulti = submission.answers.multi && submission.answers.multi.length ? formatChoiceList(submission.answers.multi) : '未选择';
  const slotDetails = scores.details || [];
  const slotCorrects = slotDetails
    .filter(item => item.correct)
    .map(item => `${item.label}：填写 "${item.user}" 正确。${item.explanation}`);
  const slotIssues = slotDetails
    .filter(item => !item.correct)
    .map(item => `${item.label}：你填写的是 "${item.user}"，这里应为 "${item.expected}"。${item.explanation}`);

  const corrects = slotDetails.length
    ? (slotCorrects.length ? slotCorrects : ['本题代码空位暂未答对。先看下面逐空反馈，再回到题目重试。'])
    : judgeWrong
      ? [`这题的标准判断是"${standardJudge}"。先把判断方向校正，再看下面的方法学原因。`]
      : multiWrong
        ? [`这题的标准选项是 ${standardMulti}。先校正选项组合，再看下面的方法学原因。`]
        : (fb.correct || ['代码结构包含了必要的模型组件。','判断方向正确。'].slice(0, scores.total > 60 ? 2 : 1));
  $('fb-correct-list').innerHTML = corrects.map(c => `
    <div class="feedback-item"><span class="feedback-item__icon">✅</span>${c}</div>
  `).join('');

  const issues = slotDetails.length
    ? (slotIssues.length ? slotIssues : [])
    : judgeWrong
      ? [`你当前选择了"${userJudge}"，但题干中的关键信息支持"${standardJudge}"。`, ...(fb.issues || [])]
      : multiWrong
        ? [`你当前选择了 ${userMulti}，标准选项是 ${standardMulti}。`, ...(fb.issues || [])]
        : (fb.issues || (scores.total < 80 ? ['部分作答尚需完善，建议查看提示后重新尝试。'] : []));
  $('fb-issues-list').innerHTML = issues.length
    ? issues.map(i => `<div class="feedback-item"><span class="feedback-item__icon">⚠️</span>${i}</div>`).join('')
    : '<div class="feedback-item"><span class="feedback-item__icon">🎉</span>没有发现明显问题，继续保持！</div>';

  const why = fb.why || ['掌握正确的统计思路有助于避免在论文写作中出现概念性错误。'];
  $('fb-why-list').innerHTML = why.map(w => `
    <div class="feedback-item"><span class="feedback-item__icon">💡</span>${w}</div>
  `).join('');

  const next = fb.next || ['继续完成本模块的下一道题目。','查看提示系统中的最终解析。'];
  $('fb-suggestion-list').innerHTML = next.map(n => `
    <div class="suggestion-item"><span class="suggestion-item__icon">🎯</span>${n}</div>
  `).join('');

  updateFeedbackNextButton(mod);
}

function updateFeedbackNextButton(mod) {
  const nextBtn = $('fb-next-btn');
  if (wsState.qIndex < mod.questions.length - 1) {
    const nextQuestionMeta = mod.questions[wsState.qIndex + 1];
    nextBtn.textContent = `下一题：${nextQuestionMeta.title}`;
  } else {
    nextBtn.textContent = '完成模块，返回模块选择';
  }
}

function renderDefaultFeedbackBody() {
  const body = document.querySelector('#page-feedback .feedback-body');
  if (!body) return;
  body.innerHTML = `
    <div class="feedback-section">
      <div class="feedback-section__title">📊 分项得分</div>
      <div class="score-breakdown">
        <div class="score-dim">
          <div class="score-dim__name">代码结构</div>
          <div class="score-dim__num text-accent" id="fb-score-code">0</div>
          <div class="score-dim__total">/ 25</div>
        </div>
        <div class="score-dim">
          <div class="score-dim__name">数值结果</div>
          <div class="score-dim__num text-green" id="fb-score-values">0</div>
          <div class="score-dim__total">/ 25</div>
        </div>
        <div class="score-dim">
          <div class="score-dim__name">统计理解</div>
          <div class="score-dim__num text-orange" id="fb-score-stat">0</div>
          <div class="score-dim__total">/ 25</div>
        </div>
        <div class="score-dim">
          <div class="score-dim__name">表述质量</div>
          <div class="score-dim__num text-purple" id="fb-score-text">0</div>
          <div class="score-dim__total">/ 25</div>
        </div>
      </div>
    </div>
    <div class="feedback-section">
      <div class="feedback-section__title">✅ 你已经做对了</div>
      <div class="feedback-list" id="fb-correct-list"></div>
    </div>
    <div class="feedback-section">
      <div class="feedback-section__title">⚠️ 仍有问题的地方</div>
      <div class="feedback-list" id="fb-issues-list"></div>
    </div>
    <div class="feedback-section">
      <div class="feedback-section__title">💡 为什么这会影响结论</div>
      <div class="feedback-list" id="fb-why-list"></div>
    </div>
    <div class="feedback-section feedback-section--full">
      <div class="feedback-section__title">🎯 下一步建议</div>
      <div class="suggestion-list" id="fb-suggestion-list"></div>
    </div>
  `;
}

function renderModule4FeedbackPage(q, mod, submission, scores) {
  const report = scores.module4Report || {};
  const answer = q.answer || {};
  const body = document.querySelector('#page-feedback .feedback-body');
  const scoreHeader = document.querySelector('#page-feedback .feedback-header__score');
  if (scoreHeader) scoreHeader.style.display = 'none';

  $('fb-title').textContent = '本题核对报告';
  $('fb-meta').textContent  = `${q.title} · 代码结构 / 关键数值 / 结果表述`;
  const badgesEl = $('fb-badges');
  badgesEl.innerHTML = `
    <span class="badge badge--orange">${q.level}</span>
    <span class="badge badge--purple">Module 4</span>
    <span class="badge ${report.isComplete ? 'badge--green' : 'badge--red'}">${report.isComplete ? '可进入下一步' : '需要修正'}</span>
  `;

  if (!body) return;
  body.innerHTML = `
    <div class="feedback-section feedback-section--full">
      <div class="feedback-section__title">代码结构核对</div>
      <div class="check-grid">
        ${(report.codeChecks || []).map(renderModule4CheckRow).join('')}
      </div>
    </div>

    <div class="feedback-section feedback-section--full">
      <div class="feedback-section__title">关键数值核对</div>
      <div class="value-check-table">
        <div class="value-check-table__head">
          <span>指标</span><span>你的填写</span><span>标准答案 / 目标值</span><span>核对结果</span>
        </div>
        ${(report.valueChecks || []).map(renderModule4ValueRow).join('')}
      </div>
    </div>

    <div class="feedback-section">
      <div class="feedback-section__title">一句结果表述核对</div>
      <div class="expression-quality">
        <span class="check-pill check-pill--${report.textChecks.quality}">表述质量：${report.textChecks.label}</span>
      </div>
      <div class="module4-subtitle">已做到</div>
      <div class="feedback-list">
        ${renderModule4TextList(report.textChecks.done, 'ok', '目前还没有检测到明确到位的表述点。')}
      </div>
      <div class="module4-subtitle">需要修正</div>
      <div class="feedback-list">
        ${renderModule4TextList(report.textChecks.fixes, 'warn', '表述没有明显问题，可以尝试写得更完整。')}
      </div>
    </div>

    <div class="feedback-section">
      <div class="feedback-section__title">重新作答前的修改清单</div>
      <div class="suggestion-list">
        ${(report.checklist || []).map(item => `
          <div class="suggestion-item"><span class="suggestion-item__icon">→</span>${escapeHtml(item)}</div>
        `).join('')}
      </div>
    </div>

    <div class="feedback-section feedback-section--full">
      <div class="feedback-section__title">标准答案 / 参考作答</div>
      <div class="reference-answer">
        <div class="module4-subtitle">参考代码骨架</div>
        <pre class="reference-code"><code>${escapeHtml(answer.referenceCode || '')}</code></pre>
        <div class="module4-subtitle">参考数值答案</div>
        <div class="reference-values">
          ${(q.values || []).map(v => {
            const ref = answer.referenceValues && answer.referenceValues[v.key];
            return `<span>${escapeHtml(v.label)} = ${ref ? formatMetric(ref.value) : '——'}</span>`;
          }).join('')}
        </div>
        <div class="module4-subtitle">参考结果表述</div>
        <p class="reference-text">${escapeHtml(answer.referenceText || '')}</p>
      </div>
    </div>
  `;
}

function renderModule5FeedbackPage(q, mod, submission, scores) {
  const report = scores.module5Report || {};
  const answer = q.answer || {};
  const body = document.querySelector('#page-feedback .feedback-body');
  const scoreHeader = document.querySelector('#page-feedback .feedback-header__score');
  if (scoreHeader) scoreHeader.style.display = 'none';

  const isBootstrap = q.feedbackMode === 'module5_bootstrap_check';
  $('fb-title').textContent = isBootstrap ? 'bootstrap 结果核对' : '中介链组件核对';
  $('fb-meta').textContent = `${q.title} · ${isBootstrap ? '间接效应 / Bootstrap CI / 结果表述' : '三变量结构 / 中介路径 / 间接效应定义'}`;
  const badgesEl = $('fb-badges');
  badgesEl.innerHTML = `
    <span class="badge badge--red">${q.level}</span>
    <span class="badge badge--purple">Module 5</span>
    <span class="badge ${report.isComplete ? 'badge--green' : 'badge--red'}">${report.isComplete ? '可进入下一步' : '需要修正'}</span>
  `;

  if (!body) return;
  body.innerHTML = `
    <div class="feedback-section feedback-section--full">
      <div class="feedback-section__title">${isBootstrap ? 'bootstrap 代码核对' : '中介链组件核对'}</div>
      <div class="check-grid">
        ${(report.codeChecks || []).map(renderModule4CheckRow).join('')}
      </div>
    </div>

    <div class="feedback-section feedback-section--full">
      <div class="feedback-section__title">${isBootstrap ? '间接效应与 CI 核对' : '关键路径与间接效应核对'}</div>
      <div class="value-check-table">
        <div class="value-check-table__head">
          <span>项目</span><span>你的填写</span><span>参考值</span><span>核对结果</span>
        </div>
        ${(report.valueChecks || []).map(renderModule4ValueRow).join('')}
      </div>
    </div>

    ${isBootstrap ? `
      <div class="feedback-section feedback-section--full">
        <div class="feedback-section__title">显著性判断核对</div>
        <div class="check-grid">
          ${(report.judgeChecks || []).map(renderModule4CheckRow).join('')}
        </div>
      </div>
    ` : ''}

    <div class="feedback-section">
      <div class="feedback-section__title">表述核对</div>
      <div class="expression-quality">
        <span class="check-pill check-pill--${report.textChecks.quality}">表述质量：${report.textChecks.label}</span>
      </div>
      <div class="module4-subtitle">已做到</div>
      <div class="feedback-list">
        ${renderModule4TextList(report.textChecks.done, 'ok', '目前还没有检测到明确到位的表述点。')}
      </div>
      <div class="module4-subtitle">需要修正</div>
      <div class="feedback-list">
        ${renderModule4TextList(report.textChecks.fixes, 'warn', '表述没有明显问题，可以尝试写得更完整。')}
      </div>
    </div>

    <div class="feedback-section">
      <div class="feedback-section__title">重新作答前的修改清单</div>
      <div class="suggestion-list">
        ${(report.checklist || []).map(item => `
          <div class="suggestion-item"><span class="suggestion-item__icon">→</span>${escapeHtml(item)}</div>
        `).join('')}
      </div>
    </div>

    <div class="feedback-section feedback-section--full">
      <div class="feedback-section__title">标准答案 / 参考作答</div>
      <div class="reference-answer">
        <div class="module4-subtitle">${isBootstrap ? '参考 bootstrap 代码' : '参考三变量代码骨架'}</div>
        <pre class="reference-code"><code>${escapeHtml(answer.referenceCode || '')}</code></pre>
        <div class="module4-subtitle">参考结果</div>
        <div class="reference-values">
          ${(q.values || []).map(v => {
            const ref = answer.referenceValues && answer.referenceValues[v.key];
            return `<span>${escapeHtml(v.label)} = ${ref ? formatMetric(ref.value) : '——'}</span>`;
          }).join('')}
        </div>
        <div class="module4-subtitle">参考表述</div>
        <p class="reference-text">${escapeHtml(answer.referenceText || '')}</p>
      </div>
    </div>
  `;
}

function renderModule4CheckRow(item) {
  return `
    <div class="check-row check-row--${item.level}">
      <div class="check-row__status">${escapeHtml(item.status)}</div>
      <div>
        <div class="check-row__label">${escapeHtml(item.label)}</div>
        <div class="check-row__message">${escapeHtml(item.message)}</div>
      </div>
    </div>
  `;
}

function renderModule4ValueRow(item) {
  return `
    <div class="value-check-table__row value-check-table__row--${item.level}">
      <span>${escapeHtml(item.label)}</span>
      <span>${typeof item.user === 'number' ? formatMetric(item.user) : escapeHtml(item.user)}</span>
      <span>${formatMetric(item.reference)}</span>
      <span><strong>${escapeHtml(item.status)}</strong><small>${escapeHtml(item.message)}</small></span>
    </div>
  `;
}

function renderModule4TextList(items, type, fallback) {
  const list = items && items.length ? items : [fallback];
  const icon = type === 'ok' ? '✓' : '!';
  return list.map(item => `
    <div class="feedback-item"><span class="feedback-item__icon">${icon}</span>${escapeHtml(item)}</div>
  `).join('');
}

function normalizeChoiceList(list) {
  return [...(list || [])].sort();
}

function formatChoiceList(list) {
  const normalized = normalizeChoiceList(list);
  return normalized.length ? normalized.map(item => item.toUpperCase()).join('、') : '无';
}

function retryQuestion() {
  if (wsState && wsState.questionId && QUESTION_DATA[wsState.questionId]) {
    loadQuestionIntoWorkspace(wsState.questionId);
    goPage('workspace');
    return;
  }
  returnToCurrentModule();
}

function nextQuestion() {
  const mod = MODULE_DATA[wsState.moduleId];
  if (wsState.qIndex < mod.questions.length - 1) {
    wsState.qIndex++;
    wsState.questionId = mod.questions[wsState.qIndex].id;
    loadQuestionIntoWorkspace(wsState.questionId);
    goPage('workspace');
  } else {
    showToast('本模块已完成，返回模块列表选择下一模块', 'success');
    renderModuleOverview();
    goPage('module');
  }
}

function refreshProgressPage() {
  const p = loadProfile();
  if (!p) {
    $('prog-username').textContent = '未创建档案';
    $('prog-id').textContent       = 'ID: ——';
    $('prog-created').textContent  = '创建于 ——';
    $('prog-last').textContent     = '上次使用 ——';
    $('prog-avatar').textContent   = '?';
    return;
  }

  const name = p.profile.username;
  $('prog-username').textContent = name;
  $('prog-avatar').textContent   = name.charAt(0).toUpperCase();
  $('prog-id').textContent       = 'ID: ' + p.profile.profileId.slice(0,8) + '...';
  $('prog-created').textContent  = '创建于 ' + formatDate(p.profile.createdAt);
  $('prog-last').textContent     = '上次使用 ' + formatDate(p.profile.lastUsedAt);

  const done = (getRiclpmProgress(p).completedQuestions || []).length;
  const pct  = Math.round(done/16*100);
  $('prog-overall-pct').textContent = pct + '%';
  $('prog-overall-bar').style.width = pct + '%';

  const grid = $('prog-module-grid');
  grid.innerHTML = '';
  for (let i = 1; i <= 8; i++) {
    const modDone = getModuleDoneCount(p, i);
    const modPct  = Math.round(modDone/2*100);
    const el = document.createElement('div');
    el.style.cssText = 'background:rgba(255,255,255,0.58);border:1px solid var(--border);border-radius:8px;padding:10px 12px;';
    el.innerHTML = `
      <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px;">M${i} ${MODULE_DATA[i].title.slice(0,8)}...</div>
      <div class="progress-bar" style="height:4px;">
        <div class="progress-bar__fill" style="width:${modPct}%;"></div>
      </div>
      <div style="font-size:10px;color:var(--accent);margin-top:4px;">${modPct}%</div>
    `;
    grid.appendChild(el);
  }

  const attempts = p.attempts || [];
  const codeScores = attempts.map(a => a.scores && a.scores.code || 0);
  const statScores = attempts.map(a => a.scores && a.scores.stat || 0);
  const valScores  = attempts.map(a => a.scores && a.scores.values || 0);
  const txtScores  = attempts.map(a => a.scores && a.scores.text || 0);

  const avg = arr => arr.length ? Math.round(arr.reduce((a,b)=>a+b,0)/arr.length/25*100) : 0;
  const conceptVal = avg(statScores);
  const codeVal    = avg(codeScores);
  const outputVal  = avg(valScores);
  const writingVal = avg(txtScores);

  $('prog-m-concept').textContent = conceptVal + '%';
  $('prog-m-code').textContent    = codeVal + '%';
  $('prog-m-output').textContent  = outputVal + '%';
  $('prog-m-writing').textContent = writingVal + '%';
  $('prog-m-concept-bar').style.width = conceptVal + '%';
  $('prog-m-code-bar').style.width    = codeVal + '%';
  $('prog-m-output-bar').style.width  = outputVal + '%';
  $('prog-m-writing-bar').style.width = writingVal + '%';

  const recentEl = $('prog-recent-list');
  if (!attempts.length) {
    recentEl.innerHTML = `<div style="text-align:center;padding:32px;color:var(--text-muted);font-size:13px;">暂无练习记录。完成第一道题后将在此显示。</div>`;
  } else {
    const recent = [...attempts].reverse().slice(0, 6);
    recentEl.innerHTML = recent.map(a => {
      const qdata = QUESTION_DATA[a.questionId];
      const title = qdata ? qdata.title : a.questionId;
      return `
        <div class="recent-row">
          <div class="recent-row__title">${title}</div>
          <div class="recent-row__time">${formatDate(a.submittedAt)}</div>
          <div class="recent-row__score">${a.totalScore} / 100</div>
        </div>
      `;
    }).join('');
  }
}

(function init() {
  const p = loadProfile();
  if (p) { updateNavProfile(p); }
  refreshHomePage();
})();
