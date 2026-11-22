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
