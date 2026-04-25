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
  if (!p) {
    openModal('请先创建学习档案', '开始训练前，需要创建一个本地学习档案来保存你的练习记录。', () => {
      goPage('profile');
    });
  } else {
    goPage('topicmap');
  }
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

  loadQuestionIntoWorkspace(wsState.questionId);
  goPage('workspace');
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
  $('ws-qtype').textContent        = q.type === 'judge' ? '判断题' : q.type === 'values' ? '数值填写' : '完整代码';
  $('ws-qlevel').textContent       = q.level;

  $('ws-scenario').innerHTML = q.scenario;
  const taskList = $('ws-tasks');
  taskList.innerHTML = q.tasks.map((t,i) => `<li><span class="num">${i+1}</span>${t}</li>`).join('');

  if (q.simOutput) {
    $('ws-simoutput-section').style.display = 'block';
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

  $('ws-section-code').style.display = (q.type === 'code') ? 'block' : 'none';

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
    $('ws-text-label').textContent = q.type === 'judge' ? '判断理由' : '结论与表述';
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
    $('ws-save-status').textContent = '已恢复草稿';
  } else {
    $('ws-code-input').value = '';
    $('ws-text-input').value = '';
    $('ws-save-status').textContent = '未保存草稿';
  }
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
    values:  {}
  };
  if (q && q.values) {
    q.values.forEach(v => {
      const el = $(`val-${v.key}`);
      if (el) draft.values[v.key] = el.value;
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

  let csv = 'id,x1,x2,x3,y1,y2,y3\n';
  for (let i = 1; i <= 300; i++) {
    const x1 = +(Math.random()*2 - 1 + Math.random()).toFixed(3);
    const x2 = +(x1 * 0.4 + Math.random()*0.8 - 0.4).toFixed(3);
    const x3 = +(x2 * 0.4 + Math.random()*0.8 - 0.4).toFixed(3);
    const y1 = +(Math.random()*2 - 1 + Math.random()).toFixed(3);
    const y2 = +(y1 * 0.38 + x1 * 0.23 + Math.random()*0.8 - 0.4).toFixed(3);
    const y3 = +(y2 * 0.38 + x2 * 0.23 + Math.random()*0.8 - 0.4).toFixed(3);
    csv += `${i},${x1},${x2},${x3},${y1},${y2},${y3}\n`;
  }
  const blob = new Blob([csv], { type:'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = dataName; a.click();
  URL.revokeObjectURL(url);
  showToast('模拟数据已下载', 'success');
}

function downloadStarter() {
  const code = `# RI-CLPM Starter Code\nlibrary(lavaan)\n\n# 读取数据\ndata <- read.csv("sim_data.csv")\n\n# 在此搭建你的 RI-CLPM 模型\nmodel <- '\n  # 随机截距\n  RI_x =~ 1*x1 + 1*x2 + 1*x3\n  RI_y =~ 1*y1 + 1*y2 + 1*y3\n\n  # 个体内残差 (within-person components)\n  wx1 =~ 1*x1\n  wx2 =~ 1*x2\n  wx3 =~ 1*x3\n  wy1 =~ 1*y1\n  wy2 =~ 1*y2\n  wy3 =~ 1*y3\n\n  # 固定测量误差为0\n  x1 ~~ 0*x1; x2 ~~ 0*x2; x3 ~~ 0*x3\n  y1 ~~ 0*y1; y2 ~~ 0*y2; y3 ~~ 0*y3\n\n  # 自回归路径 (等同约束)\n  wx2 ~ a*wx1; wx3 ~ a*wx2\n  wy2 ~ b*wy1; wy3 ~ b*wy2\n\n  # 交叉滞后路径 (等同约束)\n  wx2 ~ c*wy1; wx3 ~ c*wy2\n  wy2 ~ d*wx1; wy3 ~ d*wx2\n'\n\n# 运行模型\nfit <- lavaan(model, data = data, estimator = "ML",\n              missing = "listwise", std.lv = FALSE)\n\n# 查看结果\nsummary(fit, fit.measures = TRUE, standardized = TRUE)\nfitmeasures(fit, c("cfi","tli","rmsea","srmr"))\n`;
  const blob = new Blob([code], { type:'text/plain' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = 'starter_code.R'; a.click();
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
      code:   $('ws-code-input').value,
      values: {},
      text:   $('ws-text-input').value
    }
  };

  const judgeEl = document.querySelector('[name="judge"]:checked');
  if (judgeEl) submission.answers.judge = judgeEl.value;

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
  if (!doneList.includes(qid) && scores.total >= 60) {
    doneList.push(qid);
  }
  p.profile.lastUsedAt = now();
  saveProfile(p);

  renderFeedbackPage(q, mod, submission, scores);
  goPage('feedback');
}

function validateAnswer(q, answers) {
  if (q.judgeQ && !answers.judge) return '请先完成判断选择';
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

function autoScore(q, answers) {
  if (!q) return { total:0, code:0, values:0, stat:0, text:0 };

  let code = 0, values = 0, stat = 0, text = 0;
  const active = { code:false, values:false, stat:false, text:false };

  if (q.answer && q.answer.judge) {
    active.stat = true;
    stat = answers.judge === q.answer.judge ? 25 : 0;
  }

  if (q.type === 'code' && q.answer && q.answer.code_keywords) {
    active.code = true;
    const codeStr = answers.code || '';
    let hit = 0;
    q.answer.code_keywords.forEach(kw => { if (codeStr.includes(kw)) hit++; });
    code = Math.round(hit / q.answer.code_keywords.length * 25);
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

  const activeCount = Object.values(active).filter(Boolean).length || 1;
  const raw = code + values + stat + text;
  const total = Math.min(100, Math.round(raw / (activeCount * 25) * 100));
  return { total, code, values, stat, text, active };
}

function renderFeedbackPage(q, mod, submission, scores) {
  const qData = q || {};
  const fb = qData.feedback || {};

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
  const standardJudge = qData.answer && qData.answer.judge === 'true' ? '正确' : '错误';
  const userJudge = submission.answers.judge === 'true' ? '正确' : '错误';

  const corrects = judgeWrong
    ? [`这题的标准判断是"${standardJudge}"。先把判断方向校正，再看下面的方法学原因。`]
    : (fb.correct || ['代码结构包含了必要的模型组件。','判断方向正确。'].slice(0, scores.total > 60 ? 2 : 1));
  $('fb-correct-list').innerHTML = corrects.map(c => `
    <div class="feedback-item"><span class="feedback-item__icon">✅</span>${c}</div>
  `).join('');

  const issues = judgeWrong
    ? [`你当前选择了"${userJudge}"，但题干中的关键信息支持"${standardJudge}"。`, ...(fb.issues || [])]
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

  const nextBtn = $('fb-next-btn');
  if (wsState.qIndex < mod.questions.length - 1) {
    const nextQuestionMeta = mod.questions[wsState.qIndex + 1];
    nextBtn.textContent = `下一题：${nextQuestionMeta.title}`;
  } else {
    nextBtn.textContent = '完成模块，返回模块选择';
  }
}

function retryQuestion() {
  goPage('workspace');
  loadQuestionIntoWorkspace(wsState.questionId);
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
