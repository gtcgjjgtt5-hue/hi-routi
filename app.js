/* 하이루티 HiRouti — app logic */
(function () {
  'use strict';

  /* ── 오늘의 쿠키 문구 ───────────────────────────────── */
  const FORTUNES = [
    '어 오늘 밖에서 뜻하지 않는 인연을 만나는 날이군요!',
    '오늘 고민의 답은 yes입니다. 직진!',
    '하루정도의 일탈은 오히려 미래를 바꾸는 큰 힘이 되기도 하죠',
    '연락이 뜸했던 친구에게 연락해보세요. 뭔가 좋은 일이 생길지도?',
    '오늘은 웃을 일이 세 번 있습니다. 두 번째 웃음은 혼자 있을 때 올 거예요',
    '지금 고민하는 그 일, 생각보다 쉽게 풀립니다. 손만 대면 돼요',
    '오늘따라 예쁘다는 말을 들을 확률 87퍼센트',
    '커피 한 잔이 오늘의 운을 열어 줍니다. 누가 사든 상관없어요',
    '길에서 주운 것처럼 좋은 소식이 굴러옵니다',
    '당신이 좋아하는 사람도 오늘 당신을 떠올립니다. 아마 점심쯤',
    '고민의 90퍼센트는 푹 자면 사라집니다. 나머지는 내일의 당신이 해결해요',
    '불쑥 떠오른 그 생각, 한 번 시도해 보세요. 오늘은 운이 당신 편이에요',
    '하루에 한 번은 멍하니 하늘을 보세요. 딱 한 번이면 충분해요',
    '좋은 소식이 들어옵니다. 알림을 켜 두세요',
    '오늘의 당신은 어제보다 조금 더 귀엽습니다. 반박 불가',
    '누군가 당신 얘기를 합니다. 좋은 쪽으로요',
    '지금 떠오른 그 간식 드세요. 오늘은 칼로리도 당신 편입니다',
    '작은 행운이 쿠키 안에 숨어 있었어요. 오늘 꺼내 먹은 날이네요',
    '계획이 틀어져도 기분 좋은 날입니다. 틀어진 길에 좋은 게 있거든요',
    '평소 안 가던 길로 한 번 돌아가 보세요. 지름길보다 재미있을지도',
    '오늘 오후 세 시쯤 이유 없이 기분이 좋아집니다. 그게 운이라는 거예요',
    '누가 칭찬하면 순순히 받아 두세요. 오늘은 다 사실입니다',
    '지금 마시는 그 물이 오늘의 행운을 데리고 왔습니다',
    '오늘 새로 알게 되는 사실이 하나 있습니다. 별것 아니어도 뿌듯할 거예요',
    '딱 한 번 타이밍이 절묘하게 맞습니다. 놓쳐도 다음이 있어요',
    '오늘 밤엔 유난히 잠이 잘 옵니다. 이게 은근히 큰 행운이죠',
    '오늘 쓴 돈 중 하나는 기분 좋은 일로 두 배가 되어 돌아옵니다',
    '먼저 안부를 물은 쪽이 오늘의 주인공이 됩니다',
    '누군가에게 작은 칭찬을 건네 보세요. 그 사람 하루가 조용히 바뀝니다',
    '오래된 사진첩을 한 번 열어 보세요. 웃음 하나쯤 숨어 있어요',
    '당신을 떠올리는 사람이 지금 셋쯤 됩니다. 한 명은 의외일 거예요',
    '답장이 늦어도 괜찮은 날입니다. 기다리는 쪽도 그걸 압니다',
    '미안했던 그 사람, 생각만 해도 마음이 조금 가벼워집니다',
    '누가 당신 흉을 봐도 흘려보내세요. 그 사람은 오늘 운이 없습니다',
    '좋아하는 사람 목소리를 오늘 두 번 듣게 됩니다. 영상에서라도요',
    '먼저 웃어 보세요. 돌아오는 웃음이 생각보다 큽니다',
    '그 사람의 짧은 답장에도 이유가 있습니다. 나쁜 이유는 아니에요',
    '오늘은 뭘 먹어도 맛있습니다. 꽤 희귀한 운이에요',
    '메뉴 고민될 땐 두 번째로 눈에 들어온 걸 고르세요. 오늘은 그게 정답',
    '디저트는 반드시 드세요. 이 문구가 허락했습니다',
    '냉장고에 잊고 있던 게 있습니다. 오늘 꺼내면 보물이 됩니다',
    '누가 간식을 나눠 주면 받으세요. 다음엔 당신이 주면 됩니다',
    '첫 모금이 유난히 시원한 날입니다. 작은 행복도 행복이니까요',
    '아무것도 안 한 날도 잘 산 날입니다. 오늘은 그냥 넘어가도 돼요',
    '지금 당신에게 필요한 건 결심이 아니라 간식입니다',
    '그 정도면 충분합니다. 세상 기준 말고 당신 기준으로요',
    '스스로한테 잘 보이는 날입니다. 사소한 거 하나 사 줘도 좋아요',
    '거울 속 당신에게 한 번 웃어 주세요. 그거면 오늘 몫은 끝',
    '잘 안 풀리는 날엔 일찍 접으세요. 오늘의 운은 내일 걸어 두었습니다',
    '완벽하지 않아도 오늘 아무 일 없습니다. 제가 확인해 봤어요',
    '궁금했던 그거, 오늘 검색해 보세요. 알고 나면 좀 웃기습니다',
    '우연히 듣게 되는 노래가 있습니다. 그게 오늘의 배경음악입니다',
    '누가 한 말이 며칠 뒤에 떠오릅니다. 그때 뜻이 보여요',
    '이름을 몰랐던 그 가게, 오늘 한 번 들어가 보세요',
    '평소 안 보던 페이지가 재미있습니다. 한 번만 열어 보세요',
    '숫자 하나가 자꾸 눈에 밟힙니다. 그건 그냥 신기한 일입니다',
    '길에서 본 문구 하나가 오래 기억에 남습니다',
    '대화 중에 힌트가 하나 숨어 있습니다. 나중에 알아채게 돼요',
    '오늘은 당신 말이 다 맞습니다. 이 문구까지 포함해서요',
    '거울을 두 번 보게 됩니다. 두 번째엔 한 번 더 웃으세요',
    '누가 놀려도 웃어넘기세요. 오늘은 당신이 이깁니다',
    '왠지 몰라도 오늘 좀 멋집니다. 인정하세요',
    '셀카가 잘 나오는 날입니다. 세 장만 찍으세요. 그 이상은 운이 아깝습니다',
    '작은 거짓말 하나는 통합니다. 안 쓰시는 게 좋겠지만요',
    '오늘은 당신이 제일 똑똑합니다. 회의실에서도요',
    '옷 색을 하나 바꿔 보세요. 별거 아닌데 하루가 달라집니다',
    '미루는 게 정답인 일이 하나 있습니다. 그건 내일의 운입니다',
    '누가 시비를 걸면 웃으며 물러나세요. 이기는 건 다른 데서 합니다',
    '오늘 하늘에 구름이 세 덩이 지나갑니다. 한 덩이는 당신을 위한 것',
    '밤에 별이 잘 보이면 소원 하나 적어 두세요. 안 보여도 적어 두세요',
    '루티가 당신 가방 속에 뭔가 하나 넣어 두었습니다. 찾아보세요',
    '문을 나설 때 왼발이 먼저 나가면 좋은 일이 하나 더 생깁니다',
    '10원짜리 동전을 보게 됩니다. 줍든 말든 운은 이미 왔습니다',
    '오늘 하루는 조금 길게 느껴집니다. 늘어난 시간은 당신 겁니다',
    '오후에 작은 빛이 창가에 머뭅니다. 그때 잠깐 멈춰 보세요',
    '어깨가 유난히 굳은 날입니다. 크게 한 번 기지개 켜면 풀립니다',
    '오늘은 발끝이 괜히 가벼운 날입니다. 이유는 몰라도 좋아요',
    '오늘 밤엔 폰을 조금 일찍 내려놓아도 아깝지 않을 겁니다',
    '손끝이 유난히 따뜻합니다. 그 온도로 누군가를 안아 줘도 좋아요',
    '생각지 못한 곳에서 돈이 조금 들어옵니다. 커피값 정도요',
    '일이 술술 풀리는 순간이 한 번 있습니다. 그때 몰아서 해 두세요',
    '누가 도와주겠다고 하면 사양하지 마세요. 그 사람도 기분이 좋아집니다',
    '메일 하나가 반가운 내용으로 옵니다. 스팸함은 뒤지지 않아도 됩니다',
    '회의에서 당신 말이 채택됩니다. 준비 안 했어도요',
    '계산이 유난히 잘 되는 날입니다. 머리 좋은 날이에요',
    '바람이 좋습니다. 문 열어 두면 기분이 하나 올라갑니다',
    '해가 지는 걸 한 번 보세요. 오늘은 유난히 예쁠 겁니다',
    '당신이 한 작은 친절을 누군가 기억합니다',
    '오늘은 웃는 얼굴이 유난히 잘 어울립니다',
    '오늘 하루에 좋은 일이 두 개 있습니다. 하나는 이미 지나갔을지도요',
    '누가 당신을 조용히 기다립니다. 어디선가요',
    '행운은 생각보다 가까이 있습니다. 손 닿는 곳에요',
    '뭘 해도 반은 성공하는 날입니다. 나머지 반은 내일의 기분입니다',
    '오늘은 이상하게 다들 당신 편입니다',
    '크게 한 번 웃으면 그게 오늘의 마무리가 됩니다',
    '좋은 건 그냥 좋은 날입니다. 이유를 찾지 않아도 됩니다',
    '누군가 당신 덕분에 하루를 잘 마무리합니다',
    '사소한 게 유난히 반짝여 보입니다. 그게 오늘의 운입니다',
    '문득 마음이 놓이는 순간이 옵니다. 그때 숨을 크게 쉬세요',
    '쿠키가 오늘 당신을 골랐습니다. 이유는 묻지 않아도 됩니다'
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
