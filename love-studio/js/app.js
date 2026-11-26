/* ============================================================
   사랑의 스튜디오 — 앱
   ============================================================ */

import {
  HOST_PIN,
  ROSTER,
  ROUNDS,
  MAX_MSG,
  byId,
  labelOf,
  nameOf,
  sideOf,
  rosterOf,
  otherSide,
  shortYear,
  roundById,
  inviteCode,
  inviteUrl,
  parseInviteCode,
  checkPin,
  pageBaseUrl,
} from './data.js';
import { createStore, demoTemplate } from './store.js';
import {
  computeMatches,
  tallyVotes,
  arrowChartSVG,
  normalizeVote,
  picksOf,
  chosenRank,
  pairKey,
} from './matching.js';

/* ---------------- 작은 도구들 ---------------- */

const $ = (sel, root = document) => root.querySelector(sel);

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = (v) => String(v == null ? '' : v).replace(/[&<>"']/g, (c) => ESC[c]);

const fmtTime = (ts) => {
  if (!ts) return '';
  const d = new Date(ts);
  return d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
};

const fmtDateTime = (ts) => {
  if (!ts) return '';
  const d = new Date(ts);
  return `${d.getMonth() + 1}/${d.getDate()} ${fmtTime(ts)}`;
};

const agoLabel = (ts) => {
  const diff = Date.now() - (ts || 0);
  if (diff < 60000) return '방금';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}분 전`;
  return fmtTime(ts);
};

/* ---------------- 상태 ---------------- */

const S = {
  ready: false,
  store: null,
  mode: 'demo',
  note: '',
  me: null,
  data: {
    status: { round: 'waiting' },
    announcements: {},
    lounge: {},
    votes: {},
    presence: {},
    rooms: {},
    results: null,
    myVote: null,
    dmMine: {},
    dmAll: {},
    roomChat: {},
  },
  tab: 'lounge',
  hostTab: 'control',
  chat: null,
  entry: { step: 'start', side: 'm', num: null, pin: '', code: '', hostPin: '', error: '' },
  drafts: { lounge: '', chat: '', ann: '' },
  handles: {},
  editingHandles: false,
  scrollTo: null,
  nearBottom: true,
  subs: [],
  presenceTimer: null,
  uiTimer: null,
  renderQueued: false,
  presenceSig: '',
};

/* ---------------- 시작 ---------------- */

boot();

async function boot() {
  window.addEventListener('error', (e) => {
    console.error(e.error || e.message);
  });

  S.handles = loadHandles();
  S.store = await createStore();
  S.mode = S.store.mode;
  S.note = S.store.note || '';

  if (S.mode === 'demo' && !S.store.hasData()) {
    await S.store.set('', demoTemplate());
  }

  wireEvents();

  const params = new URLSearchParams(location.search);
  const hash = (location.hash || '').replace('#', '');
  const code = params.get('code') || params.get('c');
  const hostParam = params.get('host');
  const saved = loadMe();

  S.ready = true;

  if (code) {
    const id = parseInviteCode(code);
    if (id) {
      login({ role: 'participant', pid: id });
      toast(`${labelOf(id)}로 입장했어요 💘`);
      return;
    }
    S.entry.step = 'code';
    S.entry.code = code;
    S.entry.error = '초대 코드가 올바르지 않아요. 사회자에게 다시 받아 주세요.';
    render();
    return;
  }

  if (hostParam !== null) {
    if (hostParam === '' || hostParam === '1' || hostParam === 'true') {
      S.entry.step = 'host';
      render();
      return;
    }
    if (hostParam === HOST_PIN) {
      login({ role: 'host' });
      toast('사회자로 입장했어요 🎤');
      return;
    }
    S.entry.step = 'host';
    S.entry.error = '사회자 비밀번호가 달라요';
    render();
    return;
  }

  if (hash === 'host') {
    S.entry.step = 'host';
    render();
    return;
  }

  if (saved && validMe(saved)) {
    login(saved, { silent: true });
    return;
  }

  render();
}

function validMe(me) {
  if (!me || !me.role) return false;
  if (me.role === 'host') return true;
  return me.role === 'participant' && !!byId(me.pid);
}

function loadMe() {
  try {
    return JSON.parse(localStorage.getItem('ls.me') || 'null');
  } catch (_) {
    return null;
  }
}

function loadHandles() {
  try {
    return JSON.parse(localStorage.getItem('ls.handles') || '{}');
  } catch (_) {
    return {};
  }
}

function saveHandles() {
  try {
    localStorage.setItem('ls.handles', JSON.stringify(S.handles));
  } catch (_) {}
}

function login(me, opts = {}) {
  S.me = me;
  S.chat = null;
  // 초대 링크/파라미터로 들어온 흔적은 주소창에서 지워요(새로고침 때 재입장 방지)
  try {
    if (/[?&](code|c|host)=/.test(location.search)) {
      history.replaceState(null, '', location.pathname + location.hash.replace('#host', ''));
    }
  } catch (_) {}
  S.scrollTo = 0;
  try {
    localStorage.setItem('ls.me', JSON.stringify(me));
  } catch (_) {}
  S.tab = me.role === 'host' ? 'control' : 'lounge';
  S.hostTab = 'control';
  S.nearBottom = isBottomView();
  subscribeFor(me);
  if (me.role === 'participant') startPresence(me.pid);
  else startPresence('host');
  render();
}

function logout() {
  stopPresence();
  unsubAll();
  S.me = null;
  S.chat = null;
  S.entry = { step: 'start', side: 'm', num: null, pin: '', code: '', hostPin: '', error: '' };
  try {
    localStorage.removeItem('ls.me');
  } catch (_) {}
  closeModal();
  render();
}

function startPresence(pid) {
  stopPresence();
  if (S.store.setupDisconnect) S.store.setupDisconnect(pid);
  S.store.markPresence(pid);
  if (S.me && S.me.role === 'host') {
    // 접속 표시가 시간이 지나며 바뀌는 것만 조용히 반영
    S.uiTimer = setInterval(() => {
      const sig = onlineSignature();
      if (sig !== S.presenceSig) {
        S.presenceSig = sig;
        scheduleRender();
      }
    }, 20000);
    return;
  }
  S.presenceTimer = setInterval(() => {
    if (S.me) S.store.markPresence(pid);
  }, 25000);
}

function stopPresence() {
  if (S.presenceTimer) clearInterval(S.presenceTimer);
  if (S.uiTimer) clearInterval(S.uiTimer);
  S.presenceTimer = null;
  S.uiTimer = null;
}

/* ---------------- 구독 ---------------- */

function sub(path, apply, opts = {}) {
  const un = S.store.subscribe(path, (value) => {
    apply(value);
    if (!opts.silent) {
      if (window.__lsDebug) window.__lsPath = path;
      scheduleRender();
    }
  });
  S.subs.push(un);
}

function unsubAll() {
  S.subs.forEach((un) => {
    try {
      un();
    } catch (_) {}
  });
  S.subs = [];
  S.data.status = { round: 'waiting' };
  S.data.announcements = {};
  S.data.lounge = {};
  S.data.votes = {};
  S.data.presence = {};
  S.data.rooms = {};
  S.data.results = null;
  S.data.myVote = null;
  S.data.dmMine = {};
  S.data.dmAll = {};
  S.data.roomChat = {};
}

function subscribeFor(me) {
  unsubAll();
  sub('status', (v) => {
    S.data.status = v && v.round ? v : { round: 'waiting' };
  });
  sub('announcements', (v) => {
    S.data.announcements = v || {};
  });
  sub('lounge', (v) => {
    S.data.lounge = v || {};
  });
  sub(
    'presence',
    (v) => {
      S.data.presence = v || {};
      const sig = onlineSignature();
      if (sig === S.presenceSig) return;
      S.presenceSig = sig;
      scheduleRender();
    },
    { silent: true }
  );
  sub('rooms', (v) => {
    S.data.rooms = v || {};
  });
  sub('results', (v) => {
    S.data.results = v || null;
  });

  if (me.role === 'host') {
    sub('votes', (v) => {
      S.data.votes = v || {};
    });
    sub('dm', (v) => {
      S.data.dmAll = v || {};
    });
  } else {
    sub(`votes/${me.pid}`, (v) => {
      S.data.myVote = v || null;
    });
    sub(`dm/${me.pid}`, (v) => {
      S.data.dmMine = v || {};
    });
  }

  if (S.chat && S.chat.kind === 'room') {
    const roomId = S.chat.roomId;
    roomSub = S.store.subscribe(`roomChat/${roomId}`, (v) => {
      S.data.roomChat = v || {};
      scheduleRender();
    });
  }
}

let roomSub = null;

function openRoomChat(roomId) {
  S.chat = { kind: 'room', roomId };
  S.data.roomChat = {};
  if (roomSub) {
    try {
      roomSub();
    } catch (_) {}
    roomSub = null;
  }
  roomSub = S.store.subscribe(`roomChat/${roomId}`, (v) => {
    S.data.roomChat = v || {};
    scheduleRender();
  });
  S.scrollTo = 'bottom';
  S.nearBottom = true;
  render();
}

/* ---------------- 렌더 ---------------- */

function isBottomView() {
  if (!S.me) return false;
  if (S.chat) return true;
  return S.me.role === 'participant' && S.tab === 'lounge';
}

function scheduleRender() {
  if (window.__lsDebug) window.__lsWhy = `${window.__lsPath || '?'} :: ${new Error().stack.split('\n').slice(2, 4).join(' | ')}`;
  if (S.renderQueued) return;
  S.renderQueued = true;
  requestAnimationFrame(() => {
    S.renderQueued = false;
    render();
  });
}

function render() {
  const screen = $('#screen');
  if (!screen) return;
  if (!S.ready) {
    screen.innerHTML = loadingScreen();
    return;
  }
  if (!S.me) {
    screen.innerHTML = entryScreen();
    return;
  }

  const active = document.activeElement;
  const activeId = active && active.id ? active.id : null;
  let selStart = null;
  if (activeId) {
    try {
      selStart = active.selectionStart;
    } catch (_) {}
  }
  const oldScroll = $('#scroll');
  const oldTop = oldScroll ? oldScroll.scrollTop : 0;
  const stick = S.scrollTo === 'bottom' || (S.scrollTo == null && S.nearBottom && isBottomView());

  screen.innerHTML = S.chat ? chatScreen() : mainScreen();
  bindChart();

  const nextScroll = $('#scroll');
  if (nextScroll) {
    if (S.scrollTo === 'bottom' || stick) nextScroll.scrollTop = nextScroll.scrollHeight;
    else if (typeof S.scrollTo === 'number') nextScroll.scrollTop = S.scrollTo;
    else nextScroll.scrollTop = oldTop;
  }
  S.scrollTo = null;

  if (activeId) {
    const el = document.getElementById(activeId);
    if (el) {
      el.focus({ preventScroll: true });
      if (selStart != null && typeof el.setSelectionRange === 'function') {
        try {
          el.setSelectionRange(selStart, selStart);
        } catch (_) {}
      }
    }
  }
}

function loadingScreen() {
  return `<div class="loading">
    <div class="loading-heart">💘</div>
    <p>사랑의 스튜디오 준비 중...</p>
  </div>`;
}

/* ---------------- 입장 화면 ---------------- */

function entryScreen() {
  const e = S.entry;
  const modeBadge =
    S.mode === 'demo'
      ? `<span class="badge demo">체험 모드</span>`
      : `<span class="badge live">실시간 연결</span>`;
  if (e.step === 'start') {
    return `<div class="entry">
      <div class="hero-photo"><img src="assets/hero.jpg" alt="사랑의 스튜디오 무대"></div>
      <p class="entry-kicker">1990년대 감성 소개팅 쇼</p>
      <h1 class="logo">사랑의<br><em>스튜디오</em></h1>
      <p class="entry-sub">남자 10명 · 여자 10명<br>번호로만 만나는 익명 소개팅</p>
      <div class="entry-card ticket">
        <button class="btn primary block" data-act="entry-go-participant">💌 참가자로 입장</button>
        <button class="btn ghost block" data-act="entry-go-host">🎤 사회자로 입장</button>
        <button class="link-btn" data-act="entry-go-code">초대 코드가 있어요</button>
      </div>
      <p class="entry-foot">${modeBadge} <span>실제 스레드 아이디는 사회자만 볼 수 있어요</span></p>
    </div>`;
  }

  if (e.step === 'side') {
    const side = e.side;
    const list = rosterOf(side);
    return `<div class="entry">
      <div class="entry-bar">
        <button class="icon-btn" data-act="entry-back">←</button>
        <h2>몇 호세요?</h2>
        <span class="spacer"></span>
      </div>
      <div class="seg">
        <button class="seg-btn ${side === 'm' ? 'on m' : ''}" data-act="entry-side" data-side="m">👨 남자</button>
        <button class="seg-btn ${side === 'w' ? 'on w' : ''}" data-act="entry-side" data-side="w">👩 여자</button>
      </div>
      <div class="num-grid">
        ${list
          .map(
            (p) => `<button class="num-card ${p.side}" data-act="entry-num" data-id="${p.id}">
              <b>${p.num}호</b><span>${shortYear(p.id)}</span>
            </button>`
          )
          .join('')}
      </div>
      <p class="entry-foot"><span>번호를 고르면 개인 비밀번호 4자리를 물어봐요</span></p>
    </div>`;
  }

  if (e.step === 'pin' || e.step === 'host') {
    const isHost = e.step === 'host';
    const target = isHost ? '사회자' : labelOf(e.num);
    const value = isHost ? e.hostPin : e.pin;
    return `<div class="entry">
      <div class="entry-bar">
        <button class="icon-btn" data-act="entry-back">←</button>
        <h2>${esc(target)}</h2>
        <span class="spacer"></span>
      </div>
      <p class="pin-guide">${isHost ? '사회자 비밀번호를 입력해 주세요' : '개인 비밀번호 4자리를 입력해 주세요'}</p>
      <div class="pin-dots ${e.error ? 'shake' : ''}">
        ${[0, 1, 2, 3].map((i) => `<span class="dot ${value.length > i ? 'on' : ''}"></span>`).join('')}
      </div>
      ${e.error ? `<p class="pin-error">${esc(e.error)}</p>` : '<p class="pin-error"></p>'}
      <div class="pinpad">
        ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(
          (n) => `<button class="key" data-act="pin-key" data-key="${n}">${n}</button>`
        ).join('')}
        <button class="key fn" data-act="pin-key" data-key="del">⌫</button>
        <button class="key" data-act="pin-key" data-key="0">0</button>
        <button class="key fn" data-act="pin-key" data-key="ok">✓</button>
      </div>
      <p class="entry-foot"><span>${isHost ? '비밀번호는 README에서 바꿀 수 있어요' : '비밀번호를 잊었다면 사회자에게 알려 주세요'}</span></p>
    </div>`;
  }

  // 초대 코드 직접 입력
  return `<div class="entry">
    <div class="entry-bar">
      <button class="icon-btn" data-act="entry-back">←</button>
      <h2>초대 코드</h2>
      <span class="spacer"></span>
    </div>
    <p class="pin-guide">사회자에게 받은 코드를 넣어 주세요<br><small>예: m3-9157</small></p>
    <form class="code-form" data-form="code">
      <input id="codeInput" name="code" class="text-input" placeholder="m3-9157" autocomplete="off" autocapitalize="off" value="${esc(e.code)}">
      <button class="btn primary block" type="submit">입장하기</button>
    </form>
    ${e.error ? `<p class="pin-error">${esc(e.error)}</p>` : ''}
    <p class="entry-foot"><span>${modeBadge}</span></p>
  </div>`;
}

/* ---------------- 메인 화면 ---------------- */

function mainScreen() {
  const isHost = S.me.role === 'host';
  const r = roundById(S.data.status.round);
  return `
    <header class="topbar">
      <div class="brand"><span class="brand-mark">💘</span><span class="brand-name">사랑의 스튜디오</span></div>
      ${isHost ? `<span class="badge host">🎤 사회자</span>` : `<span class="badge ${sideOf(S.me.pid)}">${esc(labelOf(S.me.pid))}</span>`}
    </header>
    <div class="stage">
      <div class="stage-row">
        <span class="stage-step">${r.step ? `STEP ${r.step}` : 'READY'}</span>
        <span class="stage-label">${esc(r.label)}</span>
        <span class="stage-live"><i></i>${S.mode === 'demo' ? '체험' : 'LIVE'}</span>
      </div>
      ${tickerHTML()}
    </div>
    <main class="scroll" id="scroll">${isHost ? hostView() : participantView()}</main>
    ${tabbar()}
  `;
}

function tickerHTML() {
  const anns = sortedAnnouncements();
  if (!anns.length) return '';
  return `<div class="ticker"><span class="ticker-badge">📢</span><span class="ticker-track"><span class="ticker-text">${esc(
    anns[0].text
  )}</span></span></div>`;
}

function tabbar() {
  const isHost = S.me.role === 'host';
  const items = isHost
    ? [
        ['control', '🎬', '진행'],
        ['roster', '🧑‍🤝‍🧑', '명단'],
        ['vote', '💘', '투표'],
        ['ann', '📢', '방송'],
      ]
    : [
        ['lounge', '💬', '라운지'],
        ['vote', '💘', '작대기'],
        ['dm', '💌', '1:1'],
        ['my', '👤', 'MY'],
      ];
  const current = isHost ? S.hostTab : S.tab;
  return `<nav class="tabs">
    ${items
      .map(
        ([id, icon, label]) =>
          `<button class="tab ${current === id ? 'on' : ''}" data-act="${isHost ? 'host-tab' : 'tab'}" data-tab="${id}">
            <span class="tab-icon">${icon}</span><span class="tab-label">${label}</span>
          </button>`
      )
      .join('')}
  </nav>`;
}

/* ---------------- 정렬 도우미 ---------------- */

function sortedLounge() {
  return Object.entries(S.data.lounge || {})
    .map(([id, m]) => ({ ...m, id }))
    .sort((a, b) => (a.at || 0) - (b.at || 0))
    .slice(-200);
}

function sortedAnnouncements() {
  return Object.entries(S.data.announcements || {})
    .map(([id, a]) => ({ ...a, id }))
    .sort((a, b) => (b.at || 0) - (a.at || 0));
}

function onlineCount() {
  const now = Date.now();
  return Object.entries(S.data.presence || {}).filter(
    ([pid, p]) => pid !== 'host' && byId(pid) && p && now - (p.at || 0) < 90000
  ).length;
}

function isOnline(pid) {
  const p = S.data.presence && S.data.presence[pid];
  return !!(p && Date.now() - (p.at || 0) < 90000);
}

function onlineSignature() {
  return Object.entries(S.data.presence || {})
    .filter(([pid, p]) => pid !== 'host' && byId(pid) && p && Date.now() - (p.at || 0) < 90000)
    .map(([pid]) => pid)
    .sort()
    .join(',');
}

function threadList(pid) {
  return Object.entries(pid ? S.data.dmAll[pid] || {} : {})
    .map(([id, m]) => ({ ...m, id }))
    .sort((a, b) => (a.at || 0) - (b.at || 0));
}

function myThread() {
  return Object.entries(S.data.dmMine || {})
    .map(([id, m]) => ({ ...m, id }))
    .sort((a, b) => (a.at || 0) - (b.at || 0));
}

function myRoom() {
  if (!S.me || S.me.role !== 'participant') return null;
  const rooms = S.data.rooms || {};
  const found = Object.entries(rooms).find(([, v]) => v && (v.a === S.me.pid || v.b === S.me.pid));
  if (!found) return null;
  const [roomId, v] = found;
  return { roomId, ...v, partner: v.a === S.me.pid ? v.b : v.a };
}

/* ---------------- 참가자 화면 ---------------- */

function participantView() {
  if (S.tab === 'vote') return voteView();
  if (S.tab === 'dm') return dmView();
  if (S.tab === 'my') return myView();
  return loungeView();
}

function loungeView() {
  const msgs = sortedLounge();
  const anns = sortedAnnouncements();
  return `
  <section class="pad">
    <div class="section-head">
      <h2>전체 익명 라운지</h2>
      <span class="muted">${onlineCount()}/${ROSTER.length} 접속</span>
    </div>
    <p class="section-note">🔒 실명·스레드 아이디는 아무에게도 보이지 않아요. 사회자만 확인합니다.</p>
    ${anns.length ? annStack(anns) : ''}
  </section>
  <section class="msgs">
    ${msgs.length ? msgs.map((m) => msgBubble(m)).join('') : emptyState('아직 인사가 없어요', '첫 번째 인사를 남겨 보세요 🙋')}
  </section>
  ${composer('lounge', '익명으로 인사해 보세요', 'loungeInput')}
  `;
}

function annStack(anns) {
  return `<div class="ann-stack">
    ${anns
      .slice(0, 2)
      .map(
        (a) => `<div class="ann">
          <span class="ann-badge">📢 사회자 공지</span>
          <p>${esc(a.text)}</p>
          <span class="ann-time">${fmtDateTime(a.at)}</span>
        </div>`
      )
      .join('')}
  </div>`;
}

function msgBubble(m) {
  if (m.type === 'system') {
    return `<div class="sysmsg"><span>${esc(m.text)}</span></div>`;
  }
  const mine = S.me.role === 'host' ? m.pid === 'host' : m.pid === S.me.pid;
  const isHost = m.pid === 'host';
  return `<div class="msg ${mine ? 'mine' : ''} ${isHost ? 'from-host' : ''}">
    <div class="msg-head">${
      isHost ? '<span class="badge host sm">🎤 사회자</span>' : `<span class="badge ${sideOf(m.pid)} sm">${esc(labelOf(m.pid))}</span>`
    }</div>
    <div class="msg-body">${esc(m.text)}</div>
    <div class="msg-time">${fmtTime(m.at)}</div>
  </div>`;
}

function composer(kind, placeholder, inputId) {
  return `<form class="composer" data-form="${kind}">
    <input id="${inputId}" name="text" class="chat-input" type="text" maxlength="${MAX_MSG}"
      placeholder="${esc(placeholder)}" autocomplete="off" value="${esc(S.drafts[kind] || '')}">
    <button class="send" type="submit" aria-label="보내기">↑</button>
  </form>`;
}

function emptyState(title, sub) {
  return `<div class="empty"><div class="empty-emoji">💭</div><b>${esc(title)}</b><span>${esc(sub)}</span></div>`;
}

/* ----- 작대기(투표) ----- */

function voteView() {
  const r = roundById(S.data.status.round);
  if (r.revealed) return resultView();

  if (!r.votingOpen) {
    return `<section class="pad">
      <div class="locked card">
        <div class="lock-emoji">🔒</div>
        <h3>사랑의 작대기는 2부부터</h3>
        <p>지금은 <b>${esc(r.label)}</b> 단계예요.<br>사회자가 2부를 열면 마음에 든 사람을 몰래 고를 수 있어요.</p>
        <div class="round-dots">
          ${ROUNDS.map((x) => `<span class="rd ${x.step <= r.step ? 'on' : ''}"></span>`).join('')}
        </div>
      </div>
      ${tipCard('💡', '선택은 사회자만 볼 수 있어요', '결과는 사회자가 발표할 때 모두에게 공개됩니다.')}
    </section>`;
  }

  const mySide = sideOf(S.me.pid);
  const list = rosterOf(otherSide(mySide));
  const v = normalizeVote(S.data.myVote);
  return `<section class="pad">
    <div class="section-head">
      <h2>💘 사랑의 작대기</h2>
      <span class="muted">${esc(r.short)}</span>
    </div>
    <p class="section-note">${esc(r.hint)}</p>

    <div class="my-picks card">
      <span class="mini-label">내 선택</span>
      <div class="pick-chips">
        ${pickChip('1지망', v.first)}
        ${pickChip('2지망', v.second)}
        ${r.final ? pickChip('최종', v.final) : ''}
      </div>
      <span class="save-state">${S.data.myVote && S.data.myVote.at ? `저장됨 ${fmtTime(S.data.myVote.at)}` : '아직 저장 전'}</span>
    </div>

    <p class="section-note"><b>${mySide === 'm' ? '여자' : '남자'} ${list.length}명</b> 중에서 고르세요. 번호를 한 번 더 누르면 취소돼요.</p>
    ${pickSection('first', '1지망', '꼭 한 명을 골라 주세요', list, v.first)}
    ${pickSection('second', '2지망', '있으면 골라 주세요 (선택)', list, v.second)}
    ${r.final ? pickSection('final', '최종 선택', '3부 최종 선택 · 1지망보다 우선해요', list, v.final) : ''}
    ${tipCard('🤫', '마음은 나만 알고 있어요', '결과 발표 전까지 다른 참가자에게는 보이지 않아요.')}
  </section>`;
}

function pickChip(label, id) {
  return `<span class="pick-chip ${id ? 'on' : ''}">
    <em>${label}</em>${id ? `<b>${esc(nameOf(id))}</b><small>${shortYear(id)}</small>` : '<b>—</b>'}
  </span>`;
}

function pickSection(kind, title, sub, list, selected) {
  return `<div class="pick-section">
    <div class="pick-head"><b>${title}</b><span>${esc(sub)}</span></div>
    <div class="pickgrid">
      ${list
        .map(
          (p) => `<button class="pick ${p.side} ${selected === p.id ? 'on' : ''}" data-act="pick" data-kind="${kind}" data-id="${p.id}">
            <b>${p.num}</b><span>${shortYear(p.id).slice(0, 2)}</span>
          </button>`
        )
        .join('')}
    </div>
  </div>`;
}

function tipCard(icon, title, body) {
  return `<div class="tip card"><span class="tip-icon">${icon}</span><div><b>${esc(title)}</b><p>${esc(body)}</p></div></div>`;
}

async function saveVote(kind, target) {
  if (S.me.role !== 'participant') return;
  const pid = S.me.pid;
  const r = roundById(S.data.status.round);
  if (!r.votingOpen) {
    toast('지금은 투표 시간이 아니에요');
    return;
  }
  const cur = normalizeVote(S.data.myVote);
  const next = { first: cur.first, second: cur.second, final: cur.final };

  if (next[kind] === target) {
    if (kind === 'first') {
      toast('1지망은 비울 수 없어요');
      return;
    }
    next[kind] = null;
  } else {
    if (kind === 'second' && target === next.first) {
      toast('1지만과 같은 사람이어요');
      return;
    }
    next[kind] = target;
    // 같은 사람이 여러 칸에 중복되지 않도록 (1지망과 최종은 같이 둘 수 있어요)
    if (next.second === next.first) next.second = null;
    if (next.final === next.second) next.second = null;
  }

  if (!next.first) {
    toast('1지망을 먼저 골라 주세요');
    return;
  }

  await S.store.set(`votes/${pid}`, { ...next, at: Date.now() });
  toast('저장했어요 💾');
}

/* ----- 결과 ----- */

function resultView() {
  const results = S.data.results || {};
  const pairs = results.pairs || [];
  const picks = results.picks || {};
  const me = S.me;
  const myPair = pairs.find((p) => p.a === me.pid || p.b === me.pid);
  const partner = myPair ? (myPair.a === me.pid ? myPair.b : myPair.a) : null;
  const myPick = normalizeVote((S.data.myVote || picks[me.pid]) || {});

  return `<section class="pad">
    ${partner ? matchedCard(partner) : noMatchCard()}

    <div class="section-head"><h2>사랑의 작대기</h2><span class="muted">${pairs.length}쌍 매칭</span></div>
    ${arrowChartSVG({ votes: picks, meId: me.pid, showAll: true })}

    <div class="section-head"><h2>서로의 선택</h2></div>
    <div class="pick-list card">
      ${ROSTER.map((p) => {
        const v = normalizeVote(picks[p.id]);
        const mine = p.id === me.pid;
        return `<div class="pick-row ${mine ? 'me' : ''}">
          <span class="badge ${p.side} sm">${esc(nameOf(p.id))}</span>
          <span class="pick-row-body">${pickSummary(v)}</span>
        </div>`;
      }).join('')}
    </div>
    ${myPick.first ? `<p class="section-note center">내 선택 · ${esc(pickSummary(myPick, true))}</p>` : ''}
  </section>`;
}

function pickSummary(v, plain) {
  const parts = [];
  if (v.final) parts.push(plain ? `최종 ${nameOf(v.final)}` : `최종 <b>${esc(nameOf(v.final))}</b>`);
  if (v.first) parts.push(plain ? `1지망 ${nameOf(v.first)}` : `1지망 <b>${esc(nameOf(v.first))}</b>`);
  if (v.second) parts.push(`2지망 ${esc(nameOf(v.second))}`);
  if (!parts.length) return '<span class="muted">선택 없음</span>';
  if (plain) return parts.join(' · ').replace(/<[^>]+>/g, '');
  return parts.join(' · ');
}

function matchedCard(partner) {
  const room = myRoom();
  return `<div class="result-card matched">
    <span class="result-kicker">💘 매칭 성사</span>
    <h3>${esc(nameOf(partner))}</h3>
    <p class="result-sub">${shortYear(partner)} · 서로를 선택했어요</p>
    ${room ? `<button class="btn primary block" data-act="open-room" data-room="${room.roomId}">1:1 비밀방 들어가기 💌</button>` : ''}
  </div>`;
}

function noMatchCard() {
  return `<div class="result-card">
    <span class="result-kicker">이번엔 인연이 닿지 않았어요</span>
    <p class="result-sub">괜찮아요, 마음은 이미 충분히 멋졌어요.<br>마음에 남는 사람이 있다면 사회자에게 살짝 알려 주세요.</p>
    <button class="btn ghost block" data-act="open-host-chat">사회자에게 문의하기</button>
  </div>`;
}

/* ----- 1:1 ----- */

function dmView() {
  const room = myRoom();
  const thread = myThread();
  const last = thread[thread.length - 1];
  return `<section class="pad">
    <div class="section-head"><h2>1:1 비밀방</h2><span class="muted">나만 볼 수 있어요</span></div>
    <div class="room-list">
      <button class="room-row" data-act="open-host-chat">
        <span class="avatar host">🎤</span>
        <span class="room-main"><b>사회자</b><small>${last ? esc(last.text).slice(0, 28) : '궁금한 걸 물어보세요'}</small></span>
        <span class="room-time">${last ? fmtTime(last.at) : ''}</span>
      </button>
      ${
        room
          ? `<button class="room-row" data-act="open-room" data-room="${room.roomId}">
              <span class="avatar ${sideOf(room.partner)}">💘</span>
              <span class="room-main"><b>${esc(nameOf(room.partner))} · 매칭방</b><small>${shortYear(room.partner)} · 비밀 대화</small></span>
              <span class="room-time">NEW</span>
            </button>`
          : `<div class="room-row locked-row">
              <span class="avatar lock">🔒</span>
              <span class="room-main"><b>매칭 1:1 방</b><small>서로 선택하면 열려요</small></span>
            </div>`
      }
    </div>
    ${tipCard('🔒', '비밀 대화는 두 사람만', '사회자도 대화 내용은 볼 수 없어요.')}
  </section>`;
}

/* ----- MY ----- */

function myView() {
  const pid = S.me.pid;
  return `<section class="pad">
    <div class="my-card card">
      <span class="badge ${sideOf(pid)} big">${esc(nameOf(pid))}</span>
      <h3>${shortYear(pid)}</h3>
      <p>다른 참가자에게 보이는 정보는 이 번호와 출생연도가 전부예요.</p>
    </div>
    <div class="card">
      <span class="mini-label">내 초대 링크</span>
      <code class="link-box">${esc(inviteUrl(pid))}</code>
      <div class="btn-row">
        <button class="btn small" data-act="copy-my-link">링크 복사</button>
        <button class="btn small ghost" data-act="copy-my-pin">PIN ${esc(inviteCode(pid).split('-')[1])}</button>
      </div>
    </div>
    <div class="card">
      <span class="mini-label">연결 상태</span>
      <p class="muted">${
        S.mode === 'demo'
          ? '체험 모드예요. 이 기기에서만 저장되고, 탭을 여러 개 열면 서로 대화가 보여요.'
          : '실시간 연결됨 · 참가자들과 바로 대화할 수 있어요.'
      }</p>
      ${S.note ? `<p class="warn">${esc(S.note)}</p>` : ''}
    </div>
    <button class="btn ghost block" data-act="logout">나가기</button>
  </section>`;
}

/* ---------------- 사회자 화면 ---------------- */

function hostView() {
  if (S.hostTab === 'roster') return rosterView();
  if (S.hostTab === 'vote') return hostVoteView();
  if (S.hostTab === 'ann') return annView();
  return controlView();
}

function controlView() {
  const r = roundById(S.data.status.round);
  const voteCnt = Object.keys(S.data.votes || {}).length;
  const paired = (S.data.results && S.data.results.pairs ? S.data.results.pairs.length : 0);
  return `<section class="pad">
    <div class="card hero-card">
      <div class="hero-top"><span class="mini-label">지금 진행</span><span class="stage-live"><i></i>${S.mode === 'demo' ? '체험' : 'LIVE'}</span></div>
      <h2>${esc(r.label)}</h2>
      <p>${esc(r.desc)}</p>
      <div class="stat-row">
        <div class="stat"><b>${onlineCount()}</b><span>접속</span></div>
        <div class="stat"><b>${ROSTER.length}</b><span>전체</span></div>
        <div class="stat"><b>${voteCnt}</b><span>투표</span></div>
        <div class="stat"><b>${paired}</b><span>매칭</span></div>
      </div>
    </div>

    <div class="stepper">
      ${ROUNDS.map(
        (x) => `<button class="step ${x.id === r.id ? 'on' : ''} ${x.step < r.step ? 'done' : ''}" data-act="set-round" data-round="${x.id}">
          <span class="step-dot">${x.step || '·'}</span><span class="step-name">${esc(x.short)}</span>
        </button>`
      ).join('')}
    </div>

    <div class="btn-row">
      <button class="btn ghost" data-act="round-prev" ${r.step === 0 ? 'disabled' : ''}>← 이전</button>
      <button class="btn primary" data-act="round-next" ${r.step >= 4 ? 'disabled' : ''}>다음 단계 →</button>
    </div>

    <button class="btn reveal block" data-act="reveal">💘 결과 공개 &amp; 매칭방 열기</button>
    <p class="section-note center">공개하면 모든 참가자에게 서로의 선택이 보이고, 서로 고른 두 사람의 1:1 방이 열려요.</p>

    <div class="card">
      <span class="mini-label">바로 보내기</span>
      <div class="quick-row">
        ${['1부 곧 시작합니다 🎬', '잠시 후 2부 · 첫인상 선택 시작!', '3부 · 최종 선택 시간이에요 💘', '결과 발표합니다! 두근두근 ✨']
          .map((t) => `<button class="chip" data-act="quick-ann" data-text="${esc(t)}">${esc(t)}</button>`)
          .join('')}
      </div>
    </div>

    ${
      S.mode === 'demo'
        ? `<div class="card demo-card">
            <span class="mini-label">체험 모드</span>
            <p>지금은 이 기기에서만 저장돼요. 휴대폰에서 <b>명단</b> 탭의 초대 링크를 열면 참가자 화면을 바로 확인할 수 있어요.</p>
            <button class="btn small ghost" data-act="demo-reset">체험 데이터 초기화</button>
          </div>`
        : ''
    }

    <button class="btn ghost block danger-text" data-act="reset-session">전체 대화·투표 초기화</button>
    <button class="btn ghost block" data-act="logout">사회자 화면 나가기</button>
  </section>`;
}

function rosterView() {
  const now = Date.now();
  const votes = S.data.votes || {};
  const dmAll = S.data.dmAll || {};
  return `<section class="pad">
    <div class="section-head">
      <h2>참가자 명단</h2>
      <span class="muted">${onlineCount()}명 접속 · ${Object.keys(votes).length}명 투표</span>
    </div>
    <p class="section-note">아이디는 이 화면에만 보여요. 초대 링크를 눌러 각자에게 보내 주세요.</p>

    <div class="btn-row">
      <button class="btn small ${S.editingHandles ? 'primary' : ''}" data-act="toggle-handles">${S.editingHandles ? '아이디 입력 닫기' : '아이디 일괄 입력'}</button>
      <button class="btn small ghost" data-act="copy-all-links">링크 전체 복사</button>
    </div>

    ${
      S.editingHandles
        ? `<div class="card">
            <span class="mini-label">한 줄에 한 명 · 형식 <code>남자 1호 @아이디</code></span>
            <textarea id="handleInput" class="text-area" rows="10">${esc(handleTemplate())}</textarea>
            <div class="btn-row">
              <button class="btn small primary" data-act="save-handles">저장</button>
              <button class="btn small ghost" data-act="toggle-handles">취소</button>
            </div>
            <p class="section-note">아이디는 공개 저장소에 올라가지 않고, 이 기기에만 저장돼요.</p>
          </div>`
        : ''
    }

    <div class="roster-list">
      ${ROSTER.map((p) => {
        const handle = S.handles[p.id];
        const voted = !!votes[p.id];
        const lastDm = dmAll[p.id] ? Object.values(dmAll[p.id]).sort((a, b) => (b.at || 0) - (a.at || 0))[0] : null;
        const online = isOnline(p.id);
        return `<div class="roster-row">
          <span class="badge ${p.side} num">${p.num}</span>
          <div class="roster-main">
            <b>${esc(nameOf(p.id))} <small>${shortYear(p.id)}</small></b>
            <span class="handle">${handle ? '@' + esc(handle) : '<span class="missing">아이디 미입력</span>'}</span>
          </div>
          <div class="roster-meta">
            <span class="dot ${online ? 'on' : ''}" title="${online ? '접속 중' : '오프라인'}"></span>
            <span class="vote-mark ${voted ? 'on' : ''}">${voted ? '투표' : '–'}</span>
          </div>
          <div class="roster-btns">
            <button class="mini-btn" data-act="copy-link" data-id="${p.id}">링크</button>
            <button class="mini-btn ${lastDm && lastDm.from === p.id ? 'alert' : ''}" data-act="open-dm" data-id="${p.id}">1:1</button>
          </div>
        </div>`;
      }).join('')}
    </div>
    <p class="section-note center">${fmtDateTime(now)} 기준</p>
  </section>`;
}

function handleTemplate() {
  return ROSTER.map((p) => `${nameOf(p.id)} @${S.handles[p.id] || ''}`).join('\n');
}

function hostVoteView() {
  const votes = S.data.votes || {};
  const tally = tallyVotes(votes);
  const { pairs } = computeMatches(votes);
  const votedCount = Object.keys(votes).length;

  const tallyRows = ROSTER.filter((p) => tally[p.id])
    .sort((a, b) => (tally[b.id] ? tally[b.id].total : 0) - (tally[a.id] ? tally[a.id].total : 0))
    .map((p) => {
      const t = tally[p.id];
      return `<div class="tally-row">
        <span class="badge ${p.side} sm">${esc(nameOf(p.id))}</span>
        <span class="tally-bars">
          ${t.final ? `<i class="tb final" style="width:${Math.min(100, t.final * 22)}%"></i>` : ''}
          <i class="tb first" style="width:${Math.min(100, t.first * 22)}%"></i>
          <i class="tb second" style="width:${Math.min(100, t.second * 18)}%"></i>
        </span>
        <span class="tally-num">1지망 ${t.first} · 2지망 ${t.second}${t.final ? ` · 최종 ${t.final}` : ''}</span>
      </div>`;
    })
    .join('');

  const pickRows = ROSTER.map((p) => {
    const v = normalizeVote(votes[p.id]);
    const submitted = !!votes[p.id];
    return `<div class="pick-row ${submitted ? '' : 'pending'}">
      <span class="badge ${p.side} sm">${esc(nameOf(p.id))}</span>
      <span class="pick-row-body">${submitted ? pickSummary(v) : '<span class="muted">아직 안 골랐어요</span>'}</span>
    </div>`;
  }).join('');

  return `<section class="pad">
    <div class="section-head"><h2>투표 현황</h2><span class="muted">${votedCount}/${ROSTER.length}</span></div>
    <div class="card">
      <span class="mini-label">받은 표</span>
      ${tallyRows || '<p class="muted">아직 표가 없어요.</p>'}
    </div>

    <div class="card">
      <span class="mini-label">예상 매칭 ${pairs.length}쌍</span>
      ${
        pairs.length
          ? pairs
              .map(
                (p) => `<div class="pair-row">
                  <span class="badge ${sideOf(p.a)} sm">${esc(nameOf(p.a))}</span>
                  <span class="heart-line">💘</span>
                  <span class="badge ${sideOf(p.b)} sm">${esc(nameOf(p.b))}</span>
                  ${S.data.rooms && S.data.rooms[p.key] ? '<span class="open-mark">방 열림</span>' : ''}
                </div>`
              )
              .join('')
          : '<p class="muted">서로 선택한 커플이 아직 없어요.</p>'
      }
    </div>

    <button class="btn reveal block" data-act="reveal">💘 결과 공개 &amp; 매칭방 열기</button>

    <div class="section-head"><h2>관계도</h2></div>
    ${arrowChartSVG({ votes, showAll: true })}

    <div class="section-head"><h2>개별 선택</h2></div>
    <div class="pick-list card">${pickRows}</div>
  </section>`;
}

function annView() {
  const anns = sortedAnnouncements();
  return `<section class="pad">
    <div class="section-head"><h2>방송하기</h2></div>
    <form class="ann-form" data-form="ann">
      <textarea id="annInput" name="text" class="text-area" rows="3" maxlength="200" placeholder="전체 공지를 입력하세요">${esc(S.drafts.ann || '')}</textarea>
      <button class="btn primary block" type="submit">📢 전체에게 보내기</button>
    </form>
    <div class="quick-row">
      ${['잠시 후 시작합니다 ⏰', '질문은 사회자 1:1로 주세요 💌', '1지망·2지망 골라 주세요 💘', '결과 곧 발표합니다 ✨']
        .map((t) => `<button class="chip" data-act="quick-ann" data-text="${esc(t)}">${esc(t)}</button>`)
        .join('')}
    </div>

    <div class="section-head"><h2>보낸 공지</h2><span class="muted">${anns.length}개</span></div>
    <div class="ann-list">
      ${
        anns.length
          ? anns
              .map(
                (a) => `<div class="ann">
                  <p>${esc(a.text)}</p>
                  <span class="ann-time">${fmtDateTime(a.at)}</span>
                  <button class="mini-btn" data-act="del-ann" data-id="${a.id}">삭제</button>
                </div>`
              )
              .join('')
          : '<p class="muted">아직 보낸 공지가 없어요.</p>'
      }
    </div>
  </section>`;
}

/* ---------------- 채팅 화면 ---------------- */

function chatScreen() {
  const c = S.chat;
  if (!c) return mainScreen();
  let title = '';
  let sub = '';
  let msgs = [];
  let partnerId = null;
  let isHostThread = true;

  if (c.kind === 'host') {
    isHostThread = true;
    const pid = c.pid;
    if (S.me.role === 'host') {
      title = nameOf(pid);
      const h = S.handles[pid];
      sub = `${shortYear(pid)}${h ? ` · @${h}` : ''}`;
      msgs = threadList(pid);
    } else {
      title = '사회자';
      sub = '무엇이든 물어보세요';
      msgs = myThread();
    }
  } else {
    isHostThread = false;
    const room = (S.data.rooms || {})[c.roomId] || {};
    partnerId = room.a === S.me.pid ? room.b : room.a;
    title = partnerId ? nameOf(partnerId) : '매칭 1:1';
    sub = `${partnerId ? shortYear(partnerId) : ''} · 비밀 대화`;
    msgs = Object.entries(S.data.roomChat || {})
      .map(([id, m]) => ({ ...m, id }))
      .sort((a, b) => (a.at || 0) - (b.at || 0));
  }

  const myId = S.me.role === 'host' ? 'host' : S.me.pid;
  return `
    <header class="chat-head">
      <button class="icon-btn" data-act="close-chat">←</button>
      <div class="chat-title"><b>${esc(title)}</b><span>${esc(sub)}</span></div>
      ${isHostThread && S.me.role === 'host' ? '' : '<span class="badge lock-badge">🔒</span>'}
    </header>
    <main class="scroll chat-scroll" id="scroll">
      <div class="chat-intro">
        ${isHostThread ? '🎤 사회자와의 1:1 대화예요. 다른 참가자에게는 보이지 않아요.' : '💘 매칭된 두 사람만 볼 수 있는 비밀방이에요.'}
      </div>
      ${msgs.length ? msgs.map((m) => chatBubble(m, myId)).join('') : emptyState('아직 대화가 없어요', '먼저 인사를 건네 보세요')}
    </main>
    ${composer('chat', '메시지를 입력하세요', 'chatInput')}
  `;
}

function chatBubble(m, myId) {
  if (m.type === 'system') return `<div class="sysmsg"><span>${esc(m.text)}</span></div>`;
  const mine = m.from === myId;
  return `<div class="msg chat ${mine ? 'mine' : ''}">
    <div class="msg-body">${esc(m.text)}</div>
    <div class="msg-time">${fmtTime(m.at)}</div>
  </div>`;
}

/* ---------------- 이벤트 ---------------- */

function wireEvents() {
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-act]');
    if (!el) return;
    const act = el.dataset.act;
    handleAction(act, el, e);
  });

  document.addEventListener('submit', (e) => {
    const form = e.target.closest('form[data-form]');
    if (!form) return;
    e.preventDefault();
    handleSubmit(form.dataset.form, form);
  });

  document.addEventListener('input', (e) => {
    const el = e.target;
    if (el.id === 'loungeInput') S.drafts.lounge = el.value;
    else if (el.id === 'chatInput') S.drafts.chat = el.value;
    else if (el.id === 'annInput') S.drafts.ann = el.value;
  });

  document.addEventListener(
    'scroll',
    (e) => {
      if (e.target && e.target.id === 'scroll') {
        const el = e.target;
        S.nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
      }
    },
    true
  );

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (S.chat) {
        closeChat();
      }
    }
  });
}

function handleAction(act, el, e) {
  switch (act) {
    /* 입장 */
    case 'entry-go-participant':
      S.entry.step = 'side';
      S.entry.error = '';
      render();
      break;
    case 'entry-go-host':
      S.entry.step = 'host';
      S.entry.pin = '';
      S.entry.hostPin = '';
      S.entry.error = '';
      render();
      break;
    case 'entry-go-code':
      S.entry.step = 'code';
      S.entry.error = '';
      render();
      break;
    case 'entry-back':
      if (S.entry.step === 'pin') S.entry.step = 'side';
      else S.entry.step = 'start';
      S.entry.error = '';
      S.entry.pin = '';
      S.entry.hostPin = '';
      render();
      break;
    case 'entry-side':
      S.entry.side = el.dataset.side;
      render();
      break;
    case 'entry-num':
      S.entry.num = el.dataset.id;
      S.entry.pin = '';
      S.entry.error = '';
      S.entry.step = 'pin';
      render();
      break;
    case 'pin-key':
      pressPin(el.dataset.key);
      break;

    /* 화면 이동 */
    case 'tab':
      S.tab = el.dataset.tab;
      S.chat = null;
      S.nearBottom = S.tab === 'lounge';
      S.scrollTo = 0;
      render();
      break;
    case 'host-tab':
      S.hostTab = el.dataset.tab;
      S.chat = null;
      S.nearBottom = false;
      S.scrollTo = 0;
      render();
      break;
    case 'close-chat':
      closeChat();
      break;
    case 'logout':
      logout();
      break;

    /* 작대기 */
    case 'pick':
      saveVote(el.dataset.kind, el.dataset.id);
      break;

    /* 1:1 */
    case 'open-host-chat':
      if (S.me.role === 'host') {
        toast('참가자를 명단에서 골라 주세요');
        S.hostTab = 'roster';
        render();
      } else {
        S.chat = { kind: 'host', pid: S.me.pid };
        S.scrollTo = 'bottom';
        S.nearBottom = true;
        render();
      }
      break;
    case 'open-dm':
      S.chat = { kind: 'host', pid: el.dataset.id };
      S.scrollTo = 'bottom';
      S.nearBottom = true;
      render();
      break;
    case 'open-room':
      openRoomChat(el.dataset.room);
      break;

    /* 사회자 */
    case 'set-round':
      setRound(el.dataset.round);
      break;
    case 'round-next':
      stepRound(1);
      break;
    case 'round-prev':
      stepRound(-1);
      break;
    case 'reveal':
      confirmReveal();
      break;
    case 'reset-session':
      confirmReset();
      break;
    case 'demo-reset':
      confirmDemoReset();
      break;
    case 'quick-ann':
      sendAnnouncement(el.dataset.text);
      break;
    case 'del-ann':
      S.store.remove(`announcements/${el.dataset.id}`);
      toast('공지를 지웠어요');
      break;
    case 'copy-link':
      copyText(inviteUrl(el.dataset.id), `${nameOf(el.dataset.id)} 초대 링크 복사 완료`);
      break;
    case 'copy-pin':
      copyText(inviteCode(el.dataset.id).split('-')[1], `${nameOf(el.dataset.id)} PIN 복사 완료`);
      break;
    case 'copy-my-link':
      copyText(inviteUrl(S.me.pid), '내 초대 링크 복사 완료');
      break;
    case 'copy-my-pin':
      copyText(inviteCode(S.me.pid).split('-')[1], '내 PIN 복사 완료');
      break;
    case 'copy-all-links':
      copyText(
        ROSTER.map((p) => `${nameOf(p.id)}\t${inviteUrl(p.id)}`).join('\n'),
        '20명 링크 전체 복사 완료'
      );
      break;
    case 'toggle-handles':
      S.editingHandles = !S.editingHandles;
      render();
      break;
    case 'save-handles':
      saveHandlesFromInput();
      break;

    /* 모달 */
    case 'modal-ok':
      resolveModal(true);
      break;
    case 'modal-cancel':
      resolveModal(false);
      break;
    default:
      break;
  }
}

function pressPin(key) {
  const step = S.entry.step;
  const isHost = step === 'host';
  const field = isHost ? 'hostPin' : 'pin';
  let value = S.entry[field] || '';
  if (key === 'del') {
    S.entry[field] = value.slice(0, -1);
    S.entry.error = '';
    render();
    return;
  }
  if (key === 'ok') {
    submitPin();
    return;
  }
  if (!/^\d$/.test(key)) return;
  if (value.length >= 4) return;
  S.entry[field] = value + key;
  S.entry.error = '';
  if (S.entry[field].length === 4) {
    render();
    setTimeout(submitPin, 120);
    return;
  }
  render();
}

function submitPin() {
  const step = S.entry.step;
  if (step === 'host') {
    if (S.entry.hostPin === HOST_PIN) {
      login({ role: 'host' });
      toast('사회자로 입장했어요 🎤');
    } else {
      S.entry.error = '비밀번호가 달라요';
      S.entry.hostPin = '';
      render();
    }
    return;
  }
  const id = S.entry.num;
  if (!id) return;
  if (checkPin(id, S.entry.pin)) {
    login({ role: 'participant', pid: id });
    toast(`${labelOf(id)}로 입장했어요 💘`);
  } else {
    S.entry.error = '비밀번호가 달라요';
    S.entry.pin = '';
    render();
  }
}

function closeChat() {
  S.chat = null;
  S.nearBottom = true;
  S.scrollTo = 0;
  S.drafts.chat = '';
  render();
}

/* ---------------- 보내기 ---------------- */

async function handleSubmit(kind, form) {
  const input = form.querySelector('input, textarea');
  const text = (input ? input.value : '').trim();
  if (!text) return;

  if (kind === 'lounge') {
    if (text.length > MAX_MSG) return;
    S.drafts.lounge = '';
    await sendLounge({ pid: S.me.role === 'host' ? 'host' : S.me.pid, text, at: Date.now() });
    return;
  }

  if (kind === 'chat') {
    S.drafts.chat = '';
    const c = S.chat;
    if (!c) return;
    if (c.kind === 'host') {
      const pid = c.pid;
      const from = S.me.role === 'host' ? 'host' : S.me.pid;
      await S.store.push(`dm/${pid}`, { from, text, at: Date.now() });
    } else {
      await S.store.push(`roomChat/${c.roomId}`, { from: S.me.pid, text, at: Date.now() });
    }
    return;
  }

  if (kind === 'ann') {
    if (S.me.role !== 'host') return;
    S.drafts.ann = '';
    await sendAnnouncement(text);
    return;
  }

  if (kind === 'code') {
    const id = parseInviteCode(text);
    if (id) {
      login({ role: 'participant', pid: id });
      toast(`${labelOf(id)}로 입장했어요 💘`);
    } else {
      S.entry.code = text;
      S.entry.error = '코드가 맞지 않아요. 사회자에게 다시 확인해 주세요.';
      render();
    }
  }
}

async function sendLounge(msg) {
  await S.store.push('lounge', msg);
}

async function sendAnnouncement(text) {
  const clean = String(text || '').trim();
  if (!clean) return;
  await S.store.push('announcements', { text: clean, at: Date.now() });
  await S.store.push('lounge', { pid: 'host', type: 'system', text: `📢 ${clean}`, at: Date.now() });
  toast('전체에게 방송했어요 📢');
}

/* ---------------- 진행 / 결과 ---------------- */

async function setRound(id) {
  const target = roundById(id);
  if (S.data.status.round === target.id) return;
  await S.store.update('status', { round: target.id, updatedAt: Date.now() });
  await S.store.push('lounge', {
    pid: 'host',
    type: 'system',
    text: `📢 ${target.label}${target.id === 'waiting' ? ' 상태로 돌아갔습니다' : '이 시작되었습니다'}`,
    at: Date.now(),
  });
  toast(target.label);
}

async function stepRound(dir) {
  const cur = roundById(S.data.status.round);
  const next = ROUNDS[Math.min(ROUNDS.length - 1, Math.max(0, cur.step + dir))];
  if (!next || next.id === cur.id) return;
  if (next.id === 'reveal') {
    confirmReveal();
    return;
  }
  await setRound(next.id);
}

function confirmReveal() {
  const votes = S.data.votes || {};
  const { pairs } = computeMatches(votes);
  const already = S.data.results && S.data.results.pairs;
  openModal({
    title: '💘 결과를 공개할까요?',
    body: `지금까지 ${Object.keys(votes).length}명이 투표했어요.<br>상호 선택 <b>${pairs.length}쌍</b>의 1:1 방이 열리고, 모든 참가자에게 서로의 선택이 공개됩니다.${
      already ? '<br><br><b>이미 공개된 결과가 있어요. 다시 공개하면 새로 계산해 덮어씁니다.</b>' : ''
    }`,
    okText: '공개하기',
    danger: false,
    onOk: doReveal,
  });
}

async function doReveal() {
  const votes = S.data.votes || {};
  const { pairs } = computeMatches(votes);
  const rooms = {};
  pairs.forEach((p) => {
    rooms[p.key] = { a: p.a, b: p.b, at: Date.now(), via: p.via };
  });
  const picks = {};
  Object.entries(votes).forEach(([pid, raw]) => {
    const v = normalizeVote(raw);
    picks[pid] = { first: v.first, second: v.second, final: v.final };
  });

  await S.store.update('rooms', rooms);
  await S.store.set('results', { at: Date.now(), pairs, picks, count: pairs.length });
  await S.store.update('status', { round: 'reveal', updatedAt: Date.now() });
  await S.store.push('lounge', {
    pid: 'host',
    type: 'system',
    text: `🎉 사랑의 작대기 결과 발표! ${pairs.length}쌍의 매칭이 성사되었습니다`,
    at: Date.now(),
  });
  toast(`결과 공개 완료 · ${pairs.length}쌍 매칭`);
}

function confirmReset() {
  openModal({
    title: '전체 초기화할까요?',
    body: '라운지 대화, 공지, 1:1 대화, 투표, 매칭방이 모두 사라집니다.<br>되돌릴 수 없어요.',
    okText: '초기화',
    danger: true,
    onOk: doReset,
  });
}

async function doReset() {
  const paths = ['lounge', 'announcements', 'votes', 'rooms', 'results', 'dm', 'roomChat', 'presence'];
  for (const p of paths) await S.store.set(p, null);
  await S.store.update('status', { round: 'waiting', updatedAt: Date.now() });
  toast('초기화했어요');
}

function confirmDemoReset() {
  openModal({
    title: '체험 데이터를 처음으로?',
    body: '이 기기에 저장된 체험용 대화·투표를 지우고 샘플 화면으로 돌아갑니다.',
    okText: '되돌리기',
    danger: true,
    onOk: async () => {
      await S.store.remove('');
      await S.store.set('', demoTemplate());
      toast('체험 데이터를 초기화했어요');
    },
  });
}

/* ---------------- 명단 아이디 ---------------- */

function saveHandlesFromInput() {
  const el = document.getElementById('handleInput');
  if (!el) return;
  const map = {};
  el.value.split('\n').forEach((line) => {
    const m = line.match(/(남|여)자\s*(\d{1,2})\s*호?\s*@?\s*([A-Za-z0-9._]+)?/);
    if (!m) return;
    const side = m[1] === '남' ? 'm' : 'w';
    const id = `${side}${Number(m[2])}`;
    if (!byId(id)) return;
    const handle = (m[3] || '').replace(/^@/, '');
    if (handle) map[id] = handle;
  });
  S.handles = map;
  saveHandles();
  S.editingHandles = false;
  render();
  toast('아이디를 저장했어요');
}

/* ---------------- 모달 ---------------- */

let modalResolver = null;

function openModal({ title, body, okText = '확인', cancelText = '취소', danger = false, onOk }) {
  const el = $('#modal');
  if (!el) return;
  modalResolver = onOk || null;
  el.hidden = false;
  el.innerHTML = `<div class="modal-backdrop" data-act="modal-cancel"></div>
    <div class="modal-card">
      <h3>${esc(title)}</h3>
      <p>${body}</p>
      <div class="btn-row">
        <button class="btn ghost" data-act="modal-cancel">${esc(cancelText)}</button>
        <button class="btn ${danger ? 'danger' : 'primary'}" data-act="modal-ok">${esc(okText)}</button>
      </div>
    </div>`;
}

function resolveModal(ok) {
  const fn = modalResolver;
  modalResolver = null;
  closeModal();
  if (ok && fn) fn();
}

function closeModal() {
  const el = $('#modal');
  if (!el) return;
  el.hidden = true;
  el.innerHTML = '';
}

/* ---------------- 토스트 / 복사 ---------------- */

let toastTimer = null;

function toast(message) {
  const el = $('#toast');
  if (!el) return;
  el.textContent = message;
  el.classList.add('show');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    el.classList.remove('show');
    el.textContent = '';
  }, 2200);
}

async function copyText(text, message) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      legacyCopy(text);
    }
  } catch (_) {
    legacyCopy(text);
  }
  toast(message || '복사했어요');
}

function legacyCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.setAttribute('readonly', '');
  ta.style.position = 'fixed';
  ta.style.top = '-1000px';
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand('copy');
  } catch (_) {}
  document.body.removeChild(ta);
}

/* ---------------- 관계도 상호작용 ---------------- */

function bindChart() {
  const chart = $('.chart');
  if (!chart) return;
  const nodes = chart.querySelectorAll('.node');
  nodes.forEach((node) => {
    node.addEventListener('click', () => {
      const id = node.dataset.id;
      const same = chart.dataset.focus === id;
      chart.dataset.focus = same ? '' : id;
      const paths = chart.querySelectorAll('.arrow');
      paths.forEach((p) => {
        const hit = !same && (p.dataset.from === id || p.dataset.to === id);
        p.classList.toggle('hl', hit);
        p.classList.toggle('dim', !same && !hit && chart.dataset.focus !== '');
      });
      nodes.forEach((n) => n.classList.toggle('focus', !same && n.dataset.id === id));
    });
  });
}
