/* 하이루티 HiRouti — app logic */
(function () {
  'use strict';

  /* ── 오늘의 쿠키 문구 ───────────────────────────────── */
  const FORTUNES = [
    '어 오늘 밖에서 뜻하지 않는 인연을 만나는 날이군요!',
    '오늘 고민의 답은 yes입니다. 직진!',
    '하루정도의 일탈은 오히려 미래를 바꾸는 큰 힘이 되기도 하죠',
    '연락이 뜸했던 친구에게 연락해보세요. 뭔가 좋은 일이 생길지도?',
    '아침에 창문 한 번 열어보세요 반가운 소식이 바람 타고 들어와요',
    '오늘 마신 첫 커피 한 잔 값은 어디선가 두 배로 돌아와요',
    '동네에서 마주친 웃는 얼굴 하나가 오늘 하루를 풀어줄 거예요',
    '안 가봤던 골목으로 한 번만 꺾어보세요 좋은 걸 발견할지도요',
    '오후에 뜬금없이 온 메시지 하나가 기분 좋은 하루를 만들어요',
    '오늘은 웃을 일이 세 번 있어요 두 번째는 혼자 있을 때 와요',
    '지금 고민하는 그 일 오늘 손대면 생각보다 술술 풀려요',
    '누군가 오늘 당신 얘기를 하는데 좋은 쪽으로 하고 있어요',
    '냉장고 구석에 잊고 있던 걸 꺼내보세요 보물이 되어 있을지도요',
    '오랜만에 만난 사람에게 먼저 손 흔들어보세요 반가운 소식이 따라와요',
    '오늘 산 물건 하나는 오래오래 기분 좋게 해줄 거예요',
    '하던 일 잠깐 멈추고 창밖을 보세요 딱 그때 좋은 게 지나가요',
    '마음에 걸리던 그 일 오늘 전화 한 통이면 가볍게 풀려요',
    '좋아하는 노래 한 곡 크게 틀어보세요 그게 오늘의 행운 신호예요',
    '누가 칭찬하면 오늘은 그냥 다 받아두세요 전부 사실이니까요',
    '오늘 쓴 돈 중 하나는 기분 좋은 일로 두 배가 되어 돌아와요',
    '먼저 안부를 물어보세요 오늘 그쪽이 하루의 주인공이 돼요',
    '작은 칭찬 한마디 건네보세요 그 사람 하루가 조용히 바뀌어요',
    '오래된 사진첩 한 번 열어보세요 웃음 하나쯤 숨어 있어요',
    '당신을 떠올리는 사람이 오늘 셋쯤 돼요 한 명은 의외일 거예요',
    '답장이 늦어도 괜찮아요 기다리는 쪽도 그 마음을 알고 있어요',
    '미안했던 사람이 떠오르면 연락해보세요 오늘은 잘 받아줘요',
    '좋아하는 사람 목소리 오늘 두 번 듣게 돼요 영상에서라도요',
    '먼저 웃어보세요 돌아오는 웃음이 생각보다 커서 놀랄 거예요',
    '그 사람 짧은 말에도 마음이 담겨 있어요 오늘은 그게 크게 들려요',
    '오늘 뭐 먹어도 맛있어요 꽤 희귀한 운이 걸려 있는 날이에요',
    '메뉴 고민될 땐 두 번째 눈에 들어온 걸 고르세요 오늘은 정답이에요',
    '디저트 하나는 꼭 드세요 이 문구가 오늘 몫으로 허락했어요',
    '누가 간식 나눠주면 받으세요 다음엔 당신이 주면 좋은 일이 와요',
    '첫 모금이 유난히 시원할 거예요 작은 행복이 크게 느껴지는 날이에요',
    '궁금했던 거 오늘 검색해보세요 알고 나면 좀 웃기고 기분 좋아져요',
    '우연히 듣게 되는 노래가 있어요 그게 오늘 하루 배경음악이 돼요',
    '누가 한 말이 며칠 뒤 떠오르는데 그때 뜻이 확 보여요',
    '이름 몰랐던 그 가게 오늘 한 번 들어가보세요 문 열고 웃을지도요',
    '평소 안 보던 페이지 한 번 열어보세요 재미있는 게 기다리고 있어요',
    '자꾸 눈에 밟히는 숫자 하나 오늘 따라가보면 신기한 일이 생겨요',
    '스쳐 지나간 문구 하나가 오늘 좋은 힌트가 되어줘요',
    '오늘 나눈 대화 속에 힌트가 숨어 있어요 나중에 알아채게 돼요',
    '거울을 두 번 보게 돼요 두 번째엔 한 번 더 웃어보세요',
    '누가 놀려도 웃어넘기세요 오늘은 당신이 이기는 날이에요',
    '셀카 세 장만 찍어보세요 오늘 유난히 잘 나와요 더 찍으면 아까워요',
    '옷 색 하나만 바꿔보세요 별거 아닌데 하루가 확 달라져요',
    '밤에 별이 보이면 소원 적어두세요 안 보여도 적으면 이뤄져요',
    '문 나설 때 왼발이 먼저 나가면 좋은 일이 하나 더 붙어와요',
    '동전 하나 주워보세요 오늘은 그게 작은 행운의 시작이 돼요',
    '오후에 창가에 빛이 머무는 순간이 와요 그때 잠깐 멈춰보세요',
    '기지개 크게 한 번 켜보세요 굳어 있던 하루가 풀려요',
    '오늘 발끝이 괜히 가벼워요 그 기분 따라 걸으면 좋은 일이 와요',
    '택배 하나가 오늘 도착해요 뜯는 순간이 오늘의 하이라이트예요',
    '일이 술술 풀리는 순간이 한 번 와요 그때 몰아서 해두세요',
    '누가 도와주겠다 하면 사양하지 마세요 둘 다 기분 좋아지는 일이에요',
    '메일 하나가 반가운 내용으로 와요 스팸함은 안 뒤져도 괜찮아요',
    '오늘 당신 말이 예상보다 잘 먹혀요 한 번 꺼내보세요',
    '오늘 바람이 좋아요 한 번 크게 들이마시면 기분이 한 칸 올라가요',
    '해 지는 거 한 번 보세요 오늘은 유난히 예뻐서 하루가 정리돼요',
    '작은 친절 하나 건네보세요 누군가 오래오래 기억하고 있어요',
    '오늘 웃는 얼굴이 유난히 잘 어울려요 한 번 더 웃어보세요',
    '좋은 일이 두 개 있어요 하나는 이미 지나갔고 하나는 아직이에요',
    '누군가 당신을 조용히 기다리고 있어요 곧 연락이 올 거예요',
    '손 닿는 곳에 행운이 있어요 오늘 한 번 손 뻗어보세요',
    '오늘은 이상하게 다들 당신 편이에요 부탁 하나 해봐도 좋아요',
    '크게 한 번 웃으면 그 웃음이 오늘 하루를 마무리해줘요',
    '이유 없이 기분 좋은 날이에요 그 기분으로 한 번 나가보세요',
    '누군가 당신 덕분에 하루를 잘 마무리해요 오늘 그런 날이에요',
    '사소한 게 오늘 유난히 반짝여 보여요 마음에 드는 걸 하나 집어보세요',
    '마음이 놓이는 순간이 문득 와요 그때 숨 크게 쉬어보세요',
    '루티가 가방 속에 뭔가 하나 넣어뒀어요 찾아보면 기분 좋아져요',
    '오늘 하늘에 구름 세 덩이 지나가요 한 덩이는 당신 거예요',
    '퇴근길에 한 정거장 먼저 내려보세요 걷는 동안 좋은 게 보여요',
    '오늘 오후 세 시쯤 이유 없이 기분이 좋아져요 그게 운이에요',
    '지금 마시는 그 물 한 모금이 오늘의 행운을 데리고 왔어요',
    '오늘 새로 알게 되는 사실이 하나 있어요 별것 아니어도 뿌듯해요',
    '타이밍이 절묘하게 맞는 순간이 한 번 와요 놓쳐도 다음이 있어요',
    '잠들기 전 좋아하는 생각 하나 떠올려보세요 밤새 좋은 꿈이 와요',
    '책장에서 한 권 꺼내 첫 장만 펼쳐보세요 문장 하나가 오늘 답이 돼요',
    '폰은 조금 일찍 내려놓아도 좋아요 대신 아침이 훨씬 상쾌해요',
    '손끝이 유난히 따뜻한 날이에요 그 온도로 누군가 안아줘도 좋아요',
    '막혀 있던 게 오늘 스르륵 풀려요 웃음이 터질지도 몰라요',
    '누가 당신을 부러워하는 날이에요 그냥 웃어주면 돼요',
    '일정이 조금 밀려도 괜찮아요 밀린 자리에 좋은 게 들어와요',
    '지금 떠오른 그 간식 드세요 오늘은 칼로리도 당신 편이에요',
    '좋아하는 사람과 눈이 마주치는 순간이 오늘 한 번 와요',
    '불쑥 떠오른 그 생각 한 번 해보세요 오늘은 운이 따라와요',
    '오늘따라 예쁘다는 말을 들을 확률이 꽤 높아요 한 번 나가보세요',
    '커피 한 잔이 오늘의 운을 열어줘요 누가 사든 좋은 일이 와요',
    '길에서 주운 것처럼 좋은 소식이 굴러와요 한 번 고개 돌려보세요',
    '푹 자고 나면 고민이 절반은 사라져 있어요 내일 아침이 기대돼요',
    '하루 한 번 멍하니 하늘을 보세요 그 한 번이 하루를 바꿔요',
    '좋은 소식이 들어와요 알림 한 번만 켜두세요',
    '오늘 당신은 어제보다 훨씬 귀여워요 하루 종일 기분 좋을 거예요',
    '작은 행운이 쿠키 안에 숨어 있었어요 오늘 꺼낸 날이네요',
    '용기가 생기는 순간이 오늘 한 번 와요 그때 한 발만 내디뎌보세요',
    '누군가에게 먼저 연락해보세요 오늘은 답이 유난히 빨리 와요',
    '마음에 드는 걸 하나 발견해요 그걸로 하루가 반짝여요',
    '오늘 본 것 중 제일 예쁜 거 하나 정해보세요 그게 밤까지 남아요',
    '쿠키가 오늘 당신을 골랐어요 이유는 몰라도 좋은 날이에요'
  ];

  const STORE_KEY = 'hirouti.state.v1';
  const SEEDED_KEY = 'hirouti.seeded.v1';
  const DAY_MS = 86400000;

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel, root) => Array.prototype.slice.call((root || document).querySelectorAll(sel));

  /* ── 시간대(떡메모지 3덩이) ─────────────────────────── */
  const SLOTS = [
    { id: 'morning',   label: '오전', time: '7–11시',  icon: '🌅' },
    { id: 'afternoon', label: '오후', time: '12–5시',  icon: '☀️' },
    { id: 'evening',   label: '저녁', time: '6–11시',  icon: '🌙' }
  ];
  const SLOT = {};
  SLOTS.forEach((s) => { SLOT[s.id] = s; });
  const slotOf = (t) => (t && SLOT[t.slot] ? t.slot : 'morning');

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
  TODAY.setHours(0, 0, 0, 0);
  const TODAY_KEY = ymd(TODAY);

  function newId(prefix) {
    return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  /* ── 저장소 ────────────────────────────────────────── */
  function loadState() {
    const empty = {
      cookies: {}, tasks: {}, routines: [], stamps: {},
      quests: {}, rewards: {}, badges: [], goldCookies: 0
    };
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return empty;
      const p = JSON.parse(raw) || {};
      return {
        cookies: p.cookies || {},
        tasks: p.tasks || {},
        routines: Array.isArray(p.routines) ? p.routines : [],
        stamps: p.stamps || {},
        quests: p.quests || {},
        rewards: p.rewards || {},
        badges: Array.isArray(p.badges) ? p.badges : [],
        goldCookies: p.goldCookies || 0
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

  /* 첫 방문에만 가벼운 예시 — 고정 일상 1 + 메모 2 */
  if (!state.tasks[TODAY_KEY] && !localStorage.getItem(SEEDED_KEY)) {
    if (!state.routines.length) {
      state.routines = [{ id: 'rtseed1', text: '물 한 잔 마시기', slot: 'morning' }];
    }
    state.tasks[TODAY_KEY] = [
      { id: 'seed2', text: '5분 스트레칭', done: false, slot: 'afternoon' },
      { id: 'seed3', text: '좋아하는 노래 한 곡', done: false, slot: 'evening' }
    ];
    try { localStorage.setItem(SEEDED_KEY, '1'); } catch (e) {}
    saveState();
  }
  if (!state.tasks[TODAY_KEY]) state.tasks[TODAY_KEY] = [];

  const tasks = () => state.tasks[TODAY_KEY];
  const findTask = (id) => tasks().filter((t) => t.id === id)[0];
  const doneCount = (list) => list.filter((t) => t.done).length;

  /* 고정 일상은 달성률 계산에서 조용히 빠진다 */
  function countable(list) {
    const memo = (list || []).filter((t) => !t.routineId);
    return memo.length ? memo : (list || []);
  }

  /* ── 고정 일상: 새 날 메모지에 자동으로 ─────────────── */
  function ensureTodayRoutines() {
    if (!state.routines.length) return;
    const list = tasks();
    let changed = false;
    state.routines.forEach((r) => {
      if (!list.some((t) => t.routineId === r.id)) {
        list.push({
          id: newId('t'),
          text: r.text,
          done: false,
          slot: SLOT[r.slot] ? r.slot : 'morning',
          routineId: r.id
        });
        changed = true;
      }
    });
    if (changed) saveState();
  }

  /* ── 할 일 그리기 ──────────────────────────────────── */
  function makeItem(item) {
    const li = document.createElement('li');
    li.className = 'item'
      + (item.done ? ' done' : '')
      + (item.core ? ' core' : '')
      + (item.routineId ? ' routine' : '');
    li.dataset.id = item.id;
    li.draggable = false;

    const grip = document.createElement('button');
    grip.type = 'button';
    grip.className = 'grip';
    grip.setAttribute('aria-label', item.text + ' 옮기기');
    grip.title = '끌어서 옮기기 · 눌러서 시간대 고르기';
    grip.innerHTML = '<svg viewBox="0 0 10 16" width="10" height="16" aria-hidden="true"><g fill="currentColor">'
      + '<circle cx="3" cy="3.6" r="1.15"/><circle cx="7" cy="3.6" r="1.15"/>'
      + '<circle cx="3" cy="8" r="1.15"/><circle cx="7" cy="8" r="1.15"/>'
      + '<circle cx="3" cy="12.4" r="1.15"/><circle cx="7" cy="12.4" r="1.15"/></g></svg>';
    grip.addEventListener('pointerdown', onGripDown);
    grip.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openSlotMenu(li);
      }
    });

    const box = document.createElement('button');
    box.type = 'button';
    box.className = 'box';
    box.setAttribute('role', 'checkbox');
    box.setAttribute('aria-checked', item.done ? 'true' : 'false');
    box.setAttribute('aria-label', item.text + ' 완료 표시');

    const text = document.createElement('span');
    text.className = 'item-text';
    text.textContent = item.text;

    const tools = document.createElement('span');
    tools.className = 'item-tools';

    const star = document.createElement('button');
    star.type = 'button';
    star.className = 'item-star' + (item.core ? ' on' : '');
    star.setAttribute('aria-pressed', item.core ? 'true' : 'false');
    star.setAttribute('aria-label', item.text + ' 오늘의 핵심으로 표시');
    star.title = '오늘의 핵심 ⭐';
    star.textContent = item.core ? '★' : '☆';

    const del = document.createElement('button');
    del.type = 'button';
    del.className = 'item-del';
    del.setAttribute('aria-label', item.text + ' 지우기');
    del.textContent = '×';

    box.addEventListener('click', () => toggleItem(item.id, li));
    star.addEventListener('click', () => toggleCore(item.id));
    del.addEventListener('click', () => removeItem(item.id, li));

    if (item.routineId) li.title = '고정 일상 · 매일 올라와요';

    /* 데스크톱에서는 글자를 잡고 끌어도 옮겨진다 */
    li.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      if (e.target.closest('button')) return;
      onGripDown(e);
    });

    tools.append(star, del);
    li.append(grip, box, text, tools);
    return li;
  }

  function renderMemos(enterId) {
    SLOTS.forEach((s) => {
      const ul = document.querySelector('[data-list="' + s.id + '"]');
      const list = tasks()
        .filter((t) => slotOf(t) === s.id)
        .sort((a, b) => (b.core ? 1 : 0) - (a.core ? 1 : 0));
      ul.innerHTML = '';
      list.forEach((t) => {
        const li = makeItem(t);
        if (enterId && t.id === enterId) li.classList.add('enter');
        ul.appendChild(li);
      });
    });
    updateCounts();
  }

  function updateCounts() {
    let total = 0;
    let done = 0;
    SLOTS.forEach((s) => {
      const list = tasks().filter((t) => slotOf(t) === s.id);
      const d = doneCount(list);
      total += list.length;
      done += d;
      document.querySelector('[data-count="' + s.id + '"]').textContent = d + ' / ' + list.length;
      document.querySelector('[data-empty="' + s.id + '"]').hidden = list.length > 0;
      document.querySelector('.memo[data-slot="' + s.id + '"]')
        .classList.toggle('all-done', list.length > 0 && d === list.length);
    });
    $('#memoTotal').textContent = done + ' / ' + total;
  }

  function toggleItem(id, li) {
    const item = findTask(id);
    if (!item) return;
    item.done = !item.done;
    saveState();

    if (li) {
      li.classList.toggle('done', item.done);
      const box = li.querySelector('.box');
      if (box) box.setAttribute('aria-checked', item.done ? 'true' : 'false');
    }

    updateCounts();
    renderRecord();
    if (item.done) afterCheck();
    else renderQuest();
  }

  function toggleCore(id) {
    const item = findTask(id);
    if (!item) return;
    item.core = !item.core;
    saveState();
    renderMemos(item.id);
    if (item.core) toast('오늘의 핵심으로 표시했어요 ⭐');
  }

  function removeItem(id, li) {
    if (!li) return;
    li.classList.add('leaving');
    let gone = false;
    const finish = () => {
      if (gone) return;
      gone = true;
      state.tasks[TODAY_KEY] = tasks().filter((t) => t.id !== id);
      saveState();
      renderMemos();
      renderQuest();
      renderRecord();
    };
    li.addEventListener('animationend', finish, { once: true });
    setTimeout(finish, 400);
  }

  function addTask(text, slot) {
    const value = (text || '').trim();
    if (!value) return;
    const item = {
      id: newId('t'),
      text: value,
      done: false,
      slot: SLOT[slot] ? slot : 'morning'
    };
    tasks().unshift(item);
    saveState();
    renderMemos(item.id);
    renderQuest();
    renderRecord();
  }

  $$('.add').forEach((form) => {
    const slot = form.dataset.add;
    const input = form.querySelector('input');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      addTask(input.value, slot);
      input.value = '';
      input.focus();
    });
  });

  /* ── 옮기기: 포인터 드래그 + 시간대 메뉴 ───────────── */
  let drag = null;
  const EDGE = 96;

  function scroller() {
    const app = document.querySelector('.app');
    const cs = getComputedStyle(app);
    if ((cs.overflowY === 'auto' || cs.overflowY === 'scroll')) return app;
    return null;
  }

  function onGripDown(e) {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    const li = e.currentTarget.closest ? e.currentTarget.closest('.item') : null;
    if (!li) return;
    if (drag) endDrag();
    e.preventDefault();

    drag = {
      li: li,
      id: li.dataset.id,
      startX: e.clientX,
      startY: e.clientY,
      lastX: e.clientX,
      lastY: e.clientY,
      active: false,
      target: null,
      ghost: null,
      loop: 0,
      offsetX: 0,
      offsetY: 0
    };
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) {}
    window.addEventListener('pointermove', onDragMove, { passive: false });
    window.addEventListener('pointerup', onDragEnd);
    window.addEventListener('pointercancel', onDragCancel);
  }

  function activateDrag() {
    const li = drag.li;
    const r = li.getBoundingClientRect();
    const ghost = li.cloneNode(true);
    ghost.classList.add('ghost');
    ghost.classList.remove('enter');
    ghost.style.width = r.width + 'px';
    ghost.style.left = '0px';
    ghost.style.top = '0px';
    document.body.appendChild(ghost);

    drag.ghost = ghost;
    drag.offsetX = drag.startX - r.left;
    drag.offsetY = drag.startY - r.top;
    drag.active = true;

    li.classList.add('dragging');
    document.body.classList.add('dragging-mode');
    placeGhost();
    drag.loop = requestAnimationFrame(dragScroll);
  }

  function placeGhost() {
    if (!drag || !drag.ghost) return;
    const x = drag.lastX - drag.offsetX;
    const y = drag.lastY - drag.offsetY;
    drag.ghost.style.transform = 'translate(' + x + 'px,' + y + 'px) rotate(-1.1deg)';
  }

  function memoAt(x, y) {
    const el = document.elementFromPoint(x, y);
    return el ? el.closest('.memo') : null;
  }

  function updateTarget() {
    if (!drag) return;
    const m = memoAt(drag.lastX, drag.lastY);
    if (m === drag.target) return;
    if (drag.target) drag.target.classList.remove('drop');
    drag.target = m;
    if (m) m.classList.add('drop');
  }

  function dragScroll() {
    if (!drag || !drag.active) return;
    const h = window.innerHeight;
    let dy = 0;
    if (drag.lastY < EDGE) dy = -Math.min(16, (EDGE - drag.lastY) / 3 + 5);
    else if (drag.lastY > h - EDGE) dy = Math.min(16, (drag.lastY - (h - EDGE)) / 3 + 5);
    if (dy) {
      const box = scroller();
      if (box) box.scrollTop += dy;
      else window.scrollBy(0, dy);
      placeGhost();
      updateTarget();
    }
    drag.loop = requestAnimationFrame(dragScroll);
  }

  function onDragMove(e) {
    if (!drag) return;
    drag.lastX = e.clientX;
    drag.lastY = e.clientY;
    if (!drag.active) {
      const dist = Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY);
      if (dist < 5) return;
      activateDrag();
    }
    e.preventDefault();
    placeGhost();
    updateTarget();
  }

  function onDragEnd() {
    if (!drag) return;
    const d = drag;
    const target = d.target;
    const wasActive = d.active;
    endDrag();
    if (!wasActive) {
      openSlotMenu(d.li);
      return;
    }
    if (target) moveToSlot(d.id, target.dataset.slot, true);
  }

  function onDragCancel() {
    if (!drag) return;
    endDrag();
  }

  function endDrag() {
    if (!drag) return;
    if (drag.loop) cancelAnimationFrame(drag.loop);
    if (drag.ghost && drag.ghost.parentNode) drag.ghost.parentNode.removeChild(drag.ghost);
    if (drag.li) drag.li.classList.remove('dragging');
    $$('.memo.drop').forEach((m) => m.classList.remove('drop'));
    document.body.classList.remove('dragging-mode');
    window.removeEventListener('pointermove', onDragMove);
    window.removeEventListener('pointerup', onDragEnd);
    window.removeEventListener('pointercancel', onDragCancel);
    drag = null;
  }

  let menu = null;
  function closeSlotMenu() {
    if (!menu) return;
    if (menu.parentNode) menu.parentNode.removeChild(menu);
    menu = null;
    document.removeEventListener('pointerdown', onDocDownForMenu, true);
    document.removeEventListener('keydown', onEscForMenu);
  }
  function onDocDownForMenu(e) {
    if (menu && !menu.contains(e.target)) closeSlotMenu();
  }
  function onEscForMenu(e) {
    if (e.key === 'Escape') closeSlotMenu();
  }

  function openSlotMenu(li) {
    closeSlotMenu();
    const item = findTask(li.dataset.id);
    if (!item) return;

    const box = document.createElement('div');
    box.className = 'slotmenu';
    box.setAttribute('role', 'menu');
    box.setAttribute('aria-label', '시간대 옮기기');

    SLOTS.forEach((s) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'slotmenu-item' + (slotOf(item) === s.id ? ' now' : '');
      b.setAttribute('role', 'menuitem');
      b.innerHTML = '<span class="sm-icon" aria-hidden="true">' + s.icon + '</span>'
        + '<span class="sm-label">' + s.label + '</span>'
        + '<span class="sm-time">' + s.time + '</span>';
      b.addEventListener('click', () => {
        closeSlotMenu();
        moveToSlot(item.id, s.id, false);
      });
      box.appendChild(b);
    });

    document.body.appendChild(box);
    menu = box;

    const r = li.getBoundingClientRect();
    const w = box.offsetWidth;
    const h = box.offsetHeight;
    let left = Math.min(Math.max(10, r.left + 26), window.innerWidth - w - 10);
    let top = r.bottom + 6;
    if (top + h > window.innerHeight - 10) top = Math.max(10, r.top - h - 6);
    box.style.left = left + 'px';
    box.style.top = top + 'px';
    box.classList.add('in');

    setTimeout(() => {
      document.addEventListener('pointerdown', onDocDownForMenu, true);
      document.addEventListener('keydown', onEscForMenu);
    }, 0);
  }

  function moveToSlot(id, slot, fromDrag) {
    const item = findTask(id);
    if (!item || !SLOT[slot]) return;
    if (slotOf(item) === slot) {
      if (!fromDrag) toast('이미 ' + SLOT[slot].label + ' 메모에 있어요');
      return;
    }
    item.slot = slot;
    saveState();
    renderMemos(item.id);
    toast(SLOT[slot].label + ' 메모로 옮겼어요');
  }

  /* ── 퀘스트 · 루티 도장깨기 ────────────────────────── */
  const REWARDS = [
    { days: 1, icon: '🐣', label: '작은 거인', kind: 'badge' },
    { days: 3, icon: '🥠', label: '황금 쿠키', kind: 'gold', amount: 1 },
    { days: 5, icon: '🏅', label: '이불 탈출가', kind: 'badge' },
    { days: 7, icon: '👑', label: '루티 마스터', kind: 'badge', gold: 2 }
  ];
  const PAW = '<svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">'
    + '<ellipse cx="7.2" cy="8.6" rx="2.5" ry="3.1"/>'
    + '<ellipse cx="12" cy="6.6" rx="2.4" ry="3.1"/>'
    + '<ellipse cx="16.8" cy="8.6" rx="2.5" ry="3.1"/>'
    + '<path d="M12 11.2c3.1 0 5.4 2.1 5.4 4.4 0 1.9-1.7 3-3.5 2.6-.9-.2-1.7-.2-2.6 0-1.8.4-3.5-.7-3.5-2.6 0-2.3 2.3-4.4 4.2-4.4z"/></svg>';

  function questToday() {
    if (!state.quests[TODAY_KEY]) state.quests[TODAY_KEY] = {};
    return state.quests[TODAY_KEY];
  }
  function stampNeed() {
    return Math.min(2, Math.max(tasks().length, 1));
  }

  function weekStamps() {
    const start = new Date(TODAY.getTime());
    start.setDate(start.getDate() - start.getDay());
    const cells = [];
    let n = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date(start.getTime() + i * DAY_MS);
      const key = ymd(d);
      const on = !!state.stamps[key];
      if (on) n += 1;
      cells.push({ d: d, key: key, on: on, today: key === TODAY_KEY, future: d.getTime() > TODAY.getTime() });
    }
    return { cells: cells, n: n, key: ymd(start) };
  }

  function grantRewards() {
    const ws = weekStamps();
    if (!state.rewards[ws.key]) state.rewards[ws.key] = {};
    const rec = state.rewards[ws.key];
    const got = [];
    REWARDS.forEach((r) => {
      if (ws.n < r.days || rec[r.days]) return;
      rec[r.days] = true;
      if (r.kind === 'gold') {
        state.goldCookies = (state.goldCookies || 0) + (r.amount || 1);
      } else if (r.label && state.badges.indexOf(r.label) < 0) {
        state.badges.push(r.label);
      }
      if (r.gold) state.goldCookies = (state.goldCookies || 0) + r.gold;
      got.push(r);
    });
    return got;
  }

  function afterCheck() {
    const q = questToday();
    const n = doneCount(tasks());
    let level = 0;
    if (n >= 1 && !q.first) { q.first = true; level = 1; }
    if (n >= stampNeed() && !q.stamp) {
      q.stamp = true;
      state.stamps[TODAY_KEY] = true;
      level = 2;
    }
    const got = level === 2 ? grantRewards() : [];
    saveState();
    renderQuest();
    if (level === 2) celebrate('stamp', got);
    else if (level === 1) celebrate('gate');
  }

  function renderQuest() {
    const q = state.quests[TODAY_KEY] || {};
    const need = stampNeed();

    $$('.gate').forEach((g) => {
      const key = g.dataset.gate === '1' ? 'first' : 'stamp';
      g.classList.toggle('on', !!q[key]);
      if (g.dataset.gate === '2') {
        const sub = g.querySelector('.gate-sub');
        if (sub) sub.textContent = need <= 1 ? '하나만 체크해도 오늘 도장' : '두 개 체크하면 오늘 도장';
      }
    });

    const ws = weekStamps();
    $('#stampCount').textContent = ws.n;

    const board = $('#stampBoard');
    board.innerHTML = '';
    ws.cells.forEach((c) => {
      const el = document.createElement('div');
      el.className = 'stamp' + (c.on ? ' on' : '') + (c.today ? ' today' : '') + (c.future ? ' future' : '');
      el.title = (c.d.getMonth() + 1) + '월 ' + c.d.getDate() + '일' + (c.on ? ' · 도장 완료' : '');

      const day = document.createElement('span');
      day.className = 'stamp-day';
      day.textContent = WEEK_KO[c.d.getDay()];

      const mark = document.createElement('span');
      mark.className = 'stamp-mark';
      if (c.on) mark.innerHTML = PAW;
      else mark.textContent = String(c.d.getDate());

      el.append(day, mark);
      board.appendChild(el);
    });

    const row = $('#rewardRow');
    row.innerHTML = '';
    REWARDS.forEach((r) => {
      const chip = document.createElement('span');
      chip.className = 'rw' + (ws.n >= r.days ? ' on' : '');
      chip.innerHTML = '<span class="rw-icon" aria-hidden="true">' + r.icon + '</span>'
        + '<span class="rw-body"><b>' + r.days + '일</b>' + r.label + '</span>';
      row.appendChild(chip);
    });

    renderGold();
    renderBadges();
  }

  function renderGold() {
    const btn = $('#goldBtn');
    const n = state.goldCookies || 0;
    btn.hidden = n <= 0;
    $('#goldCount').textContent = n;
  }

  function renderBadges() {
    const ws = weekStamps();
    const week = $('#badgeWeek');
    if (week) week.textContent = '이번 주 도장 ' + ws.n + ' / 7';

    const list = $('#badgeList');
    if (list) {
      list.innerHTML = '';
      if (!state.badges.length) {
        const s = document.createElement('span');
        s.className = 'badge-empty';
        s.textContent = '아직 칭호가 없어요';
        list.appendChild(s);
      } else {
        state.badges.forEach((b) => {
          const chip = document.createElement('span');
          chip.className = 'badge';
          chip.textContent = b;
          list.appendChild(chip);
        });
      }
    }

    const note = $('#badgeNote');
    if (note) {
      const next = REWARDS.filter((r) => ws.n < r.days)[0];
      if (!next) note.textContent = '이번 주 도장을 다 모았어요. 루티가 꼬리를 흔드는 중!';
      else if (next.kind === 'gold') note.textContent = '이번 주 ' + next.days + '일 도장이면 황금 포춘쿠키가 열려요.';
      else note.textContent = '이번 주 ' + next.days + '일 도장이면 ‘' + next.label + '’ 칭호가 열려요.';
    }
  }

  /* 도장 축하 */
  let popTimer = null;
  function celebrate(kind, got) {
    const pop = $('#pop');
    const seal = $('#popSeal');
    const text = $('#popText');
    const sub = $('#popSub');

    pop.classList.toggle('big', kind === 'stamp');
    seal.innerHTML = '<span>' + (kind === 'stamp' ? '쾅!' : '✧') + '</span>';
    text.textContent = kind === 'stamp' ? '루티 도장 쾅!' : '1차 관문 돌파!';

    if (kind === 'stamp') {
      const ws = weekStamps();
      const extra = got && got.length
        ? ' · ' + got.map((r) => (r.kind === 'gold' ? '황금 쿠키 +' + (r.amount || 1) : r.label)).join(' · ')
        : '';
      sub.textContent = '이번 주 ' + ws.n + '번째 도장' + extra;
    } else {
      sub.textContent = '하나만 해도 오늘은 이긴 거예요';
    }

    confetti(kind === 'stamp' ? 26 : 12);

    const todayCell = document.querySelector('.stamp.today');
    if (kind === 'stamp' && todayCell) {
      todayCell.classList.remove('just');
      void todayCell.offsetWidth;
      todayCell.classList.add('just');
    }

    pop.hidden = false;
    pop.classList.remove('show');
    void pop.offsetWidth;
    pop.classList.add('show');

    clearTimeout(popTimer);
    popTimer = setTimeout(() => {
      pop.classList.remove('show');
      popTimer = setTimeout(() => { pop.hidden = true; }, 320);
    }, kind === 'stamp' ? 1750 : 1200);

    if (got && got.length) {
      toast(got.map((r) => (r.kind === 'gold' ? '황금 쿠키 +' + (r.amount || 1) : '‘' + r.label + '’ 획득')).join(' · '));
    }
  }

  function confetti(n) {
    const layer = $('#confetti');
    layer.innerHTML = '';
    const colors = ['#D9B678', '#C79A52', '#E3B49E', '#AEB9A5', '#B6C5CF', '#E9CFA0'];
    for (let i = 0; i < n; i++) {
      const sp = document.createElement('span');
      sp.className = 'cf';
      sp.style.left = 50 + (Math.random() * 62 - 31) + '%';
      sp.style.background = colors[i % colors.length];
      sp.style.animationDelay = (Math.random() * 0.22).toFixed(2) + 's';
      sp.style.animationDuration = (0.9 + Math.random() * 0.6).toFixed(2) + 's';
      sp.style.setProperty('--dx', (Math.random() * 120 - 60).toFixed(0) + 'px');
      sp.style.setProperty('--rot', (Math.random() * 540 - 270).toFixed(0) + 'deg');
      if (i % 3 === 0) sp.style.borderRadius = '50%';
      layer.appendChild(sp);
    }
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

  /* 황금 쿠키 — 광고 없이 한 번 더 */
  $('#goldBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    if (!state.goldCookies) return;
    state.goldCookies -= 1;
    saveState();
    renderGold();
    fortuneEl.classList.add('gold');
    setTimeout(() => fortuneEl.classList.remove('gold'), 900);
    reroll();
    toast('황금 쿠키로 새 쿠키를 열었어요 🥠');
  });

  /* ── 나의 기록 ─────────────────────────────────────── */
  const RING_C = 2 * Math.PI * 52;

  function pctOf(items) {
    if (!items || !items.length) return 0;
    return Math.round((doneCount(items) / items.length) * 100);
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
      const list = state.tasks[key];
      let pct;
      let sample = false;
      if (list && list.length) {
        pct = pctOf(countable(list));
      } else if (isToday) {
        pct = 0;
      } else {
        pct = samplePct(key);
        sample = true;
      }
      out.push({ date: d, key: key, pct: pct, isToday: isToday, sample: sample, label: WEEK_KO[d.getDay()] });
    }
    return out;
  }

  function renderRecord() {
    const items = countable(tasks());
    const done = doneCount(items);
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

  /* ── 고정 일상 관리 ────────────────────────────────── */
  function renderRoutines() {
    const ul = $('#rtList');
    ul.innerHTML = '';

    if (!state.routines.length) {
      const li = document.createElement('li');
      li.className = 'rt-empty';
      li.textContent = '아직 등록한 고정 일상이 없어요';
      ul.appendChild(li);
    }

    state.routines.forEach((r) => {
      const li = document.createElement('li');
      li.className = 'rt';

      const txt = document.createElement('span');
      txt.className = 'rt-text';
      txt.textContent = r.text;

      const sl = document.createElement('span');
      sl.className = 'rt-slot';
      sl.textContent = SLOT[r.slot] ? SLOT[r.slot].label : '오전';

      const del = document.createElement('button');
      del.type = 'button';
      del.className = 'rt-del';
      del.setAttribute('aria-label', r.text + ' 고정 일상에서 지우기');
      del.textContent = '×';
      del.addEventListener('click', () => removeRoutine(r.id));

      li.append(txt, sl, del);
      ul.appendChild(li);
    });
  }

  function addRoutine(text, slot) {
    const value = (text || '').trim();
    if (!value) return;
    if (state.routines.some((r) => r.text === value)) {
      toast('이미 고정 일상에 있어요');
      return;
    }
    const r = { id: newId('rt'), text: value, slot: SLOT[slot] ? slot : 'morning' };
    state.routines.push(r);
    tasks().push({
      id: newId('t'),
      text: value,
      done: false,
      slot: r.slot,
      routineId: r.id
    });
    saveState();
    renderRoutines();
    renderMemos();
    renderQuest();
    renderRecord();
    toast('고정 일상에 등록했어요 · 내일도 조용히 올라와요');
  }

  function removeRoutine(id) {
    const r = state.routines.filter((x) => x.id === id)[0];
    if (!r) return;
    state.routines = state.routines.filter((x) => x.id !== id);
    state.tasks[TODAY_KEY] = tasks().filter((t) => !(t.routineId === id && !t.done));
    saveState();
    renderRoutines();
    renderMemos();
    renderQuest();
    renderRecord();
    toast('고정 일상에서 지웠어요');
  }

  $('#rtForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = $('#rtInput');
    addRoutine(input.value, $('#rtSlot').value);
    input.value = '';
    input.focus();
  });

  $('#rtToggle').addEventListener('click', () => {
    const body = $('#rtBody');
    const btn = $('#rtToggle');
    const open = body.hidden;
    body.hidden = !open;
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.textContent = open ? '접기' : '펼치기';
  });

  /* ── 탭 전환 ───────────────────────────────────────── */
  const views = {
    today: $('#viewToday'),
    record: $('#viewRecord')
  };
  $$('.tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      $$('.tab').forEach((t) => t.classList.toggle('active', t === tab));
      Object.keys(views).forEach((k) => {
        views[k].classList.toggle('active', k === tab.dataset.view);
        views[k].hidden = k !== tab.dataset.view;
      });
      if (tab.dataset.view === 'record') renderRecord();
      const sc = scroller();
      if (sc) sc.scrollTo({ top: 0, behavior: 'smooth' });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
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
  $('#memoDate').textContent = shortDate(TODAY);

  ensureTodayRoutines();
  renderMemos();
  renderRoutines();
  renderQuest();
  renderRecord();

  // 고정 일상 기본 시간대는 지금 시간에 맞춰
  const hour = new Date().getHours();
  $('#rtSlot').value = hour < 12 ? 'morning' : (hour < 18 ? 'afternoon' : 'evening');

  if (todayCookie() !== undefined) {
    showFortune(todayCookie(), false);
  }

  /* 날짜가 바뀌면 새 메모지로 (고정 일상은 새 날 자동 반영) */
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
