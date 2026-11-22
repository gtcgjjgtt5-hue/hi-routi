/* 하이루티 HiRouti — app logic */
(function () {
  'use strict';

  /* ── 오늘의 쿠키 문구 ───────────────────────────────── */
  const FORTUNES = [
    '어 오늘 밖에서 뜻하지 않는 인연을 만나는 날이군요!',
    '오늘 고민의 답은 yes입니다. 직진!',
    '하루정도의 일탈은 오히려 미래를 바꾸는 큰 힘이 되기도 하죠',
    '연락이 뜸했던 친구에게 연락해보세요. 뭔가 좋은 일이 생길지도?',
    '오늘은 웃을 일이 세 번 생깁니다. 두 번째 웃음은 아마 혼자 있을 때일지도요',
    '지금 고민하는 그 일 생각보다 쉽게 풀립니다. 손만 대면 돼요',
    '오늘따라 예쁘다는 말을 들을 확률 87퍼센트',
    '커피 한 잔이 오늘의 운을 열어 줍니다. 누가 사든 상관없어요',
    '미뤄 둔 그 일 오늘 하면 내일의 내가 박수를 칩니다',
    '오늘은 길에서 주운 것처럼 좋은 소식이 굴러옵니다',
    '당신이 좋아하는 사람도 오늘 당신을 떠올립니다. 아마 점심쯤',
    '고민의 90퍼센트는 푹 자면 사라집니다. 나머지는 내일의 당신이 해결해요',
    '불쑥 떠오른 그 생각 한 번 시도해 보세요. 오늘은 운이 당신 편이에요',
    '오늘 하루에 한 번은 멍하니 하늘을 보세요. 딱 한 번이면 충분해요',
    '좋은 소식이 들어옵니다. 알림을 켜 두세요',
    '오늘의 당신은 어제보다 조금 더 귀엽습니다. 반박 불가',
    '누군가 당신 얘기를 합니다. 좋은 쪽으로요',
    '지금 떠오른 그 간식 드세요. 오늘은 칼로리도 당신 편입니다',
    '작은 행운이 쿠키 안에 숨어 있었어요. 오늘 꺼내 먹은 날이네요',
    '계획이 틀어져도 기분 좋은 날입니다. 틀어진 길에 좋은 게 있거든요'
  ];

  const STORE_KEY = 'hirouti.state.v1';
  const SEEDED_KEY = 'hirouti.seeded.v1';
  const DAY_MS = 86400000;

  const $ = (sel) => document.querySelector(sel);

  /* ── 날짜 ──────────────────────────────────────────── */
  function ymd(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + day;
  }
  function shortDate(d) {
    return String(d.getMonth() + 1).padStart(2, '0') + '.' + String(d.getDate()).padStart(2, '0');
  }
  const WEEK_EN = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const WEEK_KO = ['일', '월', '화', '수', '목', '금', '토'];

  const TODAY = new Date();
  const TODAY_KEY = ymd(TODAY);

  /* ── 저장소 ────────────────────────────────────────── */
  function loadState() {
    const empty = { cookies: {}, tasks: {} };
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return empty;
      const parsed = JSON.parse(raw);
      return {
        cookies: parsed.cookies || {},
        tasks: parsed.tasks || {}
      };
    } catch (e) {
      return empty;
    }
  }
  function saveState() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(state));
    } catch (e) { /* 저장 공간이 막혀 있어도 화면은 그대로 동작 */ }
  }

  const state = loadState();

  /* 첫 방문에만 가벼운 예시 세 줄 */
  if (!state.tasks[TODAY_KEY] && !localStorage.getItem(SEEDED_KEY)) {
    state.tasks[TODAY_KEY] = [
      { id: 'seed1', text: '물 한 잔 마시기', done: false },
      { id: 'seed2', text: '5분 스트레칭', done: false },
      { id: 'seed3', text: '좋아하는 노래 한 곡', done: false }
    ];
    try { localStorage.setItem(SEEDED_KEY, '1'); } catch (e) {}
    saveState();
  }
  if (!state.tasks[TODAY_KEY]) state.tasks[TODAY_KEY] = [];

  const tasks = () => state.tasks[TODAY_KEY];

  /* ── 할 일 그리기 ──────────────────────────────────── */
  const listEl = $('#list');
  const padEmpty = $('#padEmpty');

  function renderList() {
    const items = tasks();
    listEl.innerHTML = '';

    items.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'item' + (item.done ? ' done' : '');
      li.dataset.id = item.id;

      const box = document.createElement('button');
      box.type = 'button';
      box.className = 'box';
      box.setAttribute('role', 'checkbox');
      box.setAttribute('aria-checked', item.done ? 'true' : 'false');
      box.setAttribute('aria-label', item.text + ' 완료 표시');

      const text = document.createElement('span');
      text.className = 'item-text';
      text.textContent = item.text;

      const del = document.createElement('button');
      del.type = 'button';
      del.className = 'item-del';
      del.setAttribute('aria-label', item.text + ' 지우기');
      del.textContent = '×';

      box.addEventListener('click', () => toggleItem(item.id, li));
      del.addEventListener('click', () => removeItem(item.id, li));

      li.append(box, text, del);
      listEl.appendChild(li);
    });

    padEmpty.hidden = items.length > 0;
    updateSummary();
    renderRecord();
  }

  function toggleItem(id, li) {
    const item = tasks().find((t) => t.id === id);
    if (!item) return;
    item.done = !item.done;
    saveState();

    if (li) {
      li.classList.toggle('done', item.done);
      const box = li.querySelector('.box');
      if (box) box.setAttribute('aria-checked', item.done ? 'true' : 'false');
    }

    updateSummary();
    renderRecord();

    const all = tasks();
    if (all.length && all.every((t) => t.done)) {
      toast('오늘 체크리스트 완료! 루티가 박수 치는 중 👏');
    }
  }

  function removeItem(id, li) {
    const idx = tasks().findIndex((t) => t.id === id);
    if (idx < 0) return;
    li.classList.add('leaving');
    li.addEventListener('animationend', () => {
      state.tasks[TODAY_KEY] = tasks().filter((t) => t.id !== id);
      saveState();
      renderList();
    }, { once: true });
  }

  function addTask(text) {
    const value = text.trim();
    if (!value) return;
    tasks().unshift({
      id: 't' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      text: value,
      done: false
    });
    saveState();
    renderList();
    const first = listEl.firstElementChild;
    if (first) first.classList.add('enter');
  }

  const addForm = $('#addForm');
  const addInput = $('#addInput');
  addForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addTask(addInput.value);
    addInput.value = '';
    addInput.focus();
  });

  function updateSummary() {
    const items = tasks();
    const done = items.filter((t) => t.done).length;
    $('#padCount').textContent = done + ' / ' + items.length;
  }

  /* ── 포춘쿠키 ──────────────────────────────────────── */
  const fortuneEl = $('#fortune');
  const fortuneTextEl = $('#fortuneText');
  let cracking = false;

  function todayCookie() {
    return state.cookies[TODAY_KEY];
  }

  function pickFortune(exclude) {
    let i;
    do {
      i = Math.floor(Math.random() * FORTUNES.length);
    } while (FORTUNES.length > 1 && i === exclude);
    return i;
  }

  function showFortune(index, animate) {
    fortuneTextEl.textContent = FORTUNES[index];
    $('#fortuneDate').textContent = shortDate(TODAY);

    if (!animate) {
      fortuneEl.classList.add('opened', 'cracked');
      return;
    }
    if (cracking) return;
    cracking = true;
    fortuneEl.classList.remove('opened', 'cracked', 'cracking');
    // 애니메이션을 처음부터 다시 재생
    void fortuneEl.offsetWidth;
    fortuneEl.classList.add('cracking');
    setTimeout(() => {
      fortuneEl.classList.remove('cracking');
      fortuneEl.classList.add('cracked', 'opened');
      cracking = false;
    }, 620);
  }

  function openToday() {
    if (cracking) return;
    let index = todayCookie();
    if (index === undefined) {
      index = pickFortune(-1);
      state.cookies[TODAY_KEY] = index;
      saveState();
    }
    showFortune(index, true);
  }

  function reroll() {
    const index = pickFortune(todayCookie());
    state.cookies[TODAY_KEY] = index;
    saveState();
    showFortune(index, true);
  }

  fortuneEl.addEventListener('click', () => {
    if (fortuneEl.classList.contains('opened')) return;
    openToday();
  });
  fortuneEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!fortuneEl.classList.contains('opened')) openToday();
    }
  });

  /* ── 광고 모달 (2초 시뮬) ──────────────────────────── */
  const adder = $('#adder');
  const adderBar = $('#adderBar');
  const adderCount = $('#adderCount');
  let adTimer = null;

  function runAd() {
    if (cracking) return;
    adder.hidden = false;
    adderBar.style.width = '0%';
    adderCount.textContent = '2';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        adderBar.style.width = '100%';
      });
    });

    let n = 2;
    const tick = setInterval(() => {
      n -= 1;
      adderCount.textContent = String(Math.max(n, 0));
    }, 1000);

    adTimer = setTimeout(() => {
      clearInterval(tick);
      closeAd();
      reroll();
    }, 2050);
  }

  function closeAd() {
    if (adTimer) { clearTimeout(adTimer); adTimer = null; }
    adder.hidden = true;
  }

  $('#adBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    runAd();
  });
  $('#adderSkip').addEventListener('click', closeAd);
  adder.addEventListener('click', (e) => {
    if (e.target === adder) closeAd();
  });

  /* ── 나의 기록 ─────────────────────────────────────── */
  const RING_C = 2 * Math.PI * 52;

  function pctOf(items) {
    if (!items || !items.length) return 0;
    return Math.round((items.filter((t) => t.done).length / items.length) * 100);
  }

  // 지난날 샘플 기록 (날짜 기반 고정값 — 새로고침해도 그대로)
  function samplePct(dateKey) {
    let h = 0;
    for (let i = 0; i < dateKey.length; i++) h = (h * 31 + dateKey.charCodeAt(i)) % 9973;
    const steps = [45, 55, 60, 65, 70, 75, 80, 85, 90, 95];
    return steps[h % steps.length];
  }

  function weekData() {
    const out = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(TODAY.getTime() - i * DAY_MS);
      const key = ymd(d);
      const isToday = i === 0;
      let pct;
      let sample = false;
      if (state.tasks[key] && state.tasks[key].length) {
        pct = pctOf(state.tasks[key]);
      } else if (isToday) {
        pct = 0;
      } else {
        pct = samplePct(key);
        sample = true;
      }
      out.push({ date: d, key, pct, isToday, sample, label: WEEK_KO[d.getDay()] });
    }
    return out;
  }

  function renderRecord() {
    const items = tasks();
    const done = items.filter((t) => t.done).length;
    const total = items.length;
    const pct = pctOf(items);

    $('#ringPct').textContent = pct + '%';
    $('#ringFill').style.strokeDashoffset = String(RING_C * (1 - pct / 100));

    let desc;
    if (!total) desc = '오늘의 체크리스트는 아직 비어 있어요';
    else if (done === total) desc = total + '개 전부 완료! 오늘 하루 아주 잘했어요';
    else desc = total + '개 중 ' + done + '개 완료 · 남은 ' + (total - done) + '개만 하면 돼요';
    $('#ringDesc').textContent = desc;

    $('#statDone').textContent = done;
    $('#statLeft').textContent = Math.max(total - done, 0);

    // 주간 막대
    const bars = $('#bars');
    const data = weekData();
    bars.innerHTML = '';
    data.forEach((d) => {
      const wrap = document.createElement('div');
      wrap.className = 'bar' + (d.isToday ? ' today' : '') + (d.sample ? ' sample' : '');

      const track = document.createElement('div');
      track.className = 'bar-track';

      const stack = document.createElement('div');
      stack.className = 'bar-stack';

      const val = document.createElement('span');
      val.className = 'bar-val';
      val.textContent = d.pct + '%';

      const fill = document.createElement('div');
      fill.className = 'bar-fill';

      stack.append(val, fill);
      track.appendChild(stack);

      const day = document.createElement('span');
      day.className = 'bar-day';
      day.textContent = d.label;

      wrap.append(track, day);
      bars.appendChild(wrap);

      requestAnimationFrame(() => {
        stack.style.height = Math.max(d.pct, d.pct > 0 ? 3 : 1.5) + '%';
      });
    });

    const avg = Math.round(data.reduce((s, d) => s + d.pct, 0) / data.length);
    $('#chartAvg').textContent = '평균 ' + avg + '%';
    $('#statBest').textContent = Math.max.apply(null, data.map((d) => d.pct)) + '%';
  }

  /* ── 탭 전환 ───────────────────────────────────────── */
  const views = {
    today: $('#viewToday'),
    record: $('#viewRecord')
  };
  document.querySelectorAll('.tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach((t) => t.classList.toggle('active', t === tab));
      Object.keys(views).forEach((k) => {
        views[k].classList.toggle('active', k === tab.dataset.view);
        views[k].hidden = k !== tab.dataset.view;
      });
      if (tab.dataset.view === 'record') renderRecord();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  /* ── 토스트 ────────────────────────────────────────── */
  let toastTimer = null;
  function toast(message) {
    const el = $('#toast');
    el.textContent = message;
    el.hidden = false;
    requestAnimationFrame(() => el.classList.add('show'));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      el.classList.remove('show');
      setTimeout(() => { el.hidden = true; }, 300);
    }, 2600);
  }

  /* ── 시작 ──────────────────────────────────────────── */
  $('#topDate').textContent = shortDate(TODAY) + ' ' + WEEK_EN[TODAY.getDay()];
  $('#padDate').textContent = shortDate(TODAY);

  renderList();

  if (todayCookie() !== undefined) {
    showFortune(todayCookie(), false);
  }

  /* 날짜가 바뀌면 새 메모지로 */
  setInterval(() => {
    if (ymd(new Date()) !== TODAY_KEY) location.reload();
  }, 60000);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && ymd(new Date()) !== TODAY_KEY) location.reload();
  });

  /* PWA */
  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    });
  }
})();
