/* ============================================================
   사랑의 스튜디오 2기 — 참가 신청 페이지
   ------------------------------------------------------------
   · 저장: Firebase RTDB studio/applications/s2/{id}
   · Firebase 설정이 없거나 ?demo=1 이면 이 기기(localStorage)
   · 1기 데이터(lounge·votes·dm·status·results·announcements)는 건드리지 않음
   ============================================================ */

import { createStore } from '../js/store.js?v=4';
import {
  APPLY_PATH,
  MAX_YEAR,
  MARITAL_OPTIONS,
  SMOKE_OPTIONS,
  LONG_DISTANCE_OPTIONS,
  isValidHandle,
  normalizeHandle,
  normalizeApplication,
  makePin,
  findSameHandle,
  sideLabel,
} from '../js/applications.js?v=1';

const esc = (v) =>
  String(v == null ? '' : v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const $ = (sel, root = document) => root.querySelector(sel);

const MAIN = $('#applyMain');

let store = null;
let submitting = false;
let doneRecord = null;

boot();

async function boot() {
  try {
    store = await createStore();
  } catch (err) {
    console.error(err);
    MAIN.innerHTML = `<div class="apply-error">신청서를 열지 못했어요. 잠시 뒤 다시 열어 주세요.</div>`;
    return;
  }

  if (doneRecord) {
    renderDone(doneRecord);
    return;
  }
  renderForm();
}

/* ---------------- 폼 ---------------- */

function choices(name, options, opts = {}) {
  return `<div class="choice-row ${opts.cols || 'two'}">
    ${options
      .map(
        (o) =>
          `<label class="choice${opts.small ? ' sm' : ''}">
            <input type="radio" name="${name}" value="${esc(o.value)}"${opts.checked === o.value ? ' checked' : ''}>
            <span class="${esc(o.cls || '')}">${esc(o.label)}</span>
          </label>`
      )
      .join('')}
  </div>`;
}

function renderForm(prefill = {}) {
  const demoNote =
    store && store.mode === 'demo'
      ? `<div class="apply-error" style="background:#fff8e8;border-color:#f0d49a;color:#8a6100">⚠️ 지금은 체험 모드예요 · 신청 내용이 이 기기에만 저장돼요<br><span style="font-size:11px">${esc(store.note || '')}</span></div>`
      : '';

  MAIN.innerHTML = `
  <form id="applyForm" novalidate>
    ${demoNote}
    <div id="formError" class="apply-error" hidden></div>

    <section class="apply-card">
      <div class="apply-card-head"><span class="num">1</span><h2>기본 정보</h2><span class="opt">필수 항목</span></div>

      <div class="field">
        <label for="f-handle">스레드 아이디 <span class="req">필수</span></label>
        <input class="apply-input" id="f-handle" name="handle" type="text" inputmode="text" autocomplete="off"
          autocapitalize="off" spellcheck="false" maxlength="31" placeholder="kimmalgug (앞에 @는 빼도 돼요)" value="${esc(prefill.handle || '')}">
        <div class="field-msg" id="msg-handle">신청서 확인과 안내를 스레드 DM으로 보내요</div>
      </div>

      <div class="field">
        <div class="field-label">성별 <span class="req">필수</span></div>
        ${choices('side', [
          { value: 'm', label: '🩵 남자', cls: 'blue' },
          { value: 'w', label: '🤍 여자' },
        ], { checked: prefill.side })}
        <div class="field-msg" id="msg-side"></div>
      </div>

      <div class="field">
        <label for="f-year">출생연도 <span class="req">필수</span></label>
        <input class="apply-input" id="f-year" name="year" type="number" inputmode="numeric" min="1940" max="1989"
          step="1" placeholder="예: 1988" value="${esc(prefill.year || '')}">
        <div class="year-preview" id="yearPreview">1989년생 이하 · 2026년 연나이 38세 이상</div>
        <div class="field-msg" id="msg-year"></div>
      </div>

      <div class="field">
        <label for="f-region">거주 지역 <span class="req">필수</span></label>
        <input class="apply-input" id="f-region" name="region" type="text" maxlength="20"
          placeholder="예: 대구 북구" value="${esc(prefill.region || '')}">
        <div class="field-msg" id="msg-region"></div>
      </div>

      <div class="field">
        <label for="f-height">키 (cm) <span class="req">필수</span></label>
        <input class="apply-input" id="f-height" name="height" type="number" inputmode="numeric" min="130" max="210"
          step="1" placeholder="예: 175" value="${esc(prefill.height || '')}">
        <div class="field-msg" id="msg-height"></div>
      </div>

      <div class="field">
        <label for="f-job">직업</label>
        <input class="apply-input" id="f-job" name="job" type="text" maxlength="30" placeholder="예: 회사원 / 자영업 / 간호사"
          value="${esc(prefill.job || '')}">
      </div>

      <div class="field">
        <label for="f-team">좋아하는 구단</label>
        <input class="apply-input" id="f-team" name="team" type="text" maxlength="20" placeholder="예: 삼성 라이온즈"
          value="${esc(prefill.team || '')}">
        <div class="hint">야구 팬이 아니면 비워도 괜찮아요</div>
      </div>
    </section>

    <section class="apply-card">
      <div class="apply-card-head"><span class="num">2</span><h2>프로필</h2><span class="opt">선택 항목</span></div>

      <div class="field">
        <div class="field-label">결혼 여부</div>
        ${choices('marital', MARITAL_OPTIONS.map((v) => ({ value: v, label: v })), { checked: prefill.marital })}
      </div>

      <div class="field">
        <div class="field-label">흡연 여부</div>
        ${choices('smoke', SMOKE_OPTIONS.map((v) => ({ value: v, label: v })), { cols: 'three', small: true, checked: prefill.smoke })}
      </div>

      <div class="field">
        <label for="f-drink">음주</label>
        <input class="apply-input" id="f-drink" name="drink" type="text" maxlength="20" placeholder="예: 안 마셔요 / 가끔 / 주 1회"
          value="${esc(prefill.drink || '')}">
      </div>

      <div class="field">
        <label for="f-religion">종교</label>
        <input class="apply-input" id="f-religion" name="religion" type="text" maxlength="20" placeholder="예: 무교 / 기독교 / 천주교 / 불교"
          value="${esc(prefill.religion || '')}">
      </div>

      <div class="field">
        <label for="f-hobby">취미</label>
        <input class="apply-input" id="f-hobby" name="hobby" type="text" maxlength="40" placeholder="예: 야구 직관 / 등산 / 영화"
          value="${esc(prefill.hobby || '')}">
      </div>

      <div class="field">
        <label for="f-mbti">MBTI</label>
        <input class="apply-input" id="f-mbti" name="mbti" type="text" maxlength="4" autocapitalize="characters"
          spellcheck="false" placeholder="예: INFJ" value="${esc(prefill.mbti || '')}">
      </div>
    </section>

    <section class="apply-card">
      <div class="apply-card-head"><span class="num">3</span><h2>이상형</h2><span class="opt">선택 항목</span></div>

      <div class="field">
        <label for="f-important">상대방에게 중요하게 생각하는 점</label>
        <textarea class="apply-textarea" id="f-important" name="important" maxlength="200"
          placeholder="예: 대화가 잘 통하는 사람 / 성실한 사람">${esc(prefill.important || '')}</textarea>
      </div>

      <div class="field">
        <label for="f-agegap">선호하는 나이 차이</label>
        <input class="apply-input" id="f-agegap" name="ageGap" type="text" maxlength="20" placeholder="예: 동갑~3살 위 / 나이 무관"
          value="${esc(prefill.ageGap || '')}">
      </div>

      <div class="field">
        <div class="field-label">장거리 연애</div>
        ${choices('longDistance', LONG_DISTANCE_OPTIONS.map((v) => ({ value: v, label: v })), { cols: 'three', small: true, checked: prefill.longDistance })}
      </div>
    </section>

    <div class="apply-actions">
      <button class="apply-submit" id="applySubmit" type="submit">⏳ 2기 신청서 보내기</button>
      <p class="apply-notice">보낸 뒤에는 사회자가 스레드 DM으로 확인 안내를 드려요</p>
    </div>
  </form>`;

  bindForm();
}

function bindForm() {
  const form = $('#applyForm');
  if (!form) return;
  form.addEventListener('submit', onSubmit);

  const year = $('#f-year');
  year.addEventListener('input', updateYearPreview);
  $('#f-handle').addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/^\s*@+/, '');
    setMsg('handle', '신청서 확인과 안내를 스레드 DM으로 보내요');
    e.target.classList.remove('invalid');
  });
  ['region', 'height'].forEach((k) => {
    $(`#f-${k}`).addEventListener('input', (e) => {
      e.target.classList.remove('invalid');
      setMsg(k, '');
    });
  });
  $('#f-mbti').addEventListener('input', (e) => {
    e.target.value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4);
  });
  form.querySelectorAll('input[name="side"]').forEach((el) => {
    el.addEventListener('change', () => setMsg('side', ''));
  });
  ['marital', 'smoke', 'longDistance'].forEach((name) => {
    form.querySelectorAll(`input[name="${name}"]`).forEach((el) => {
      el.addEventListener('change', () => {
        form.querySelectorAll(`input[name="${name}"]`).forEach((x) => x.closest('.choice').classList.remove('invalid'));
      });
    });
  });
  updateYearPreview();
}

function setMsg(key, text, kind = '') {
  const el = $(`#msg-${key}`);
  if (!el) return;
  el.textContent = text || '';
  el.className = `field-msg${kind ? ' ' + kind : ''}`;
}

function updateYearPreview() {
  const input = $('#f-year');
  const el = $('#yearPreview');
  if (!input || !el) return;
  const raw = input.value.trim();
  const year = Number(raw);
  if (!raw) {
    el.innerHTML = '1989년생 이하 · 2026년 연나이 38세 이상';
    setMsg('year', '');
    input.classList.remove('invalid');
    return;
  }
  if (!Number.isInteger(year) || year < 1940) {
    el.innerHTML = '출생연도를 다시 확인해 주세요';
    setMsg('year', '1940년생부터 신청할 수 있어요');
    input.classList.add('invalid');
    return;
  }
  if (year > MAX_YEAR) {
    const age = 2026 - year + 1;
    el.innerHTML = `<b>${year}년생</b> · 2026년 연나이 ${age}세`;
    setMsg('year', `1989년생 이하만 신청할 수 있어요 (38세 이상)`, 'warn');
    input.classList.add('invalid');
    return;
  }
  const age = 2026 - year + 1;
  el.innerHTML = `<b>${year}년생</b> · 2026년 연나이 ${age}세`;
  setMsg('year', '');
  input.classList.remove('invalid');
}

/* ---------------- 제출 ---------------- */

function readForm() {
  const form = $('#applyForm');
  const data = new FormData(form);
  const get = (k) => String(data.get(k) == null ? '' : data.get(k)).trim();
  return {
    handle: normalizeHandle(get('handle')),
    side: get('side'),
    year: get('year'),
    region: get('region'),
    height: get('height'),
    job: get('job'),
    team: get('team'),
    marital: get('marital'),
    smoke: get('smoke'),
    drink: get('drink'),
    religion: get('religion'),
    hobby: get('hobby'),
    mbti: get('mbti'),
    important: get('important'),
    ageGap: get('ageGap'),
    longDistance: get('longDistance'),
  };
}

function validate(v) {
  const errors = [];
  const mark = (key, msg) => {
    errors.push(msg);
    const input = $(`#f-${key}`);
    if (input) input.classList.add('invalid');
    setMsg(key, msg);
  };

  if (!v.handle) mark('handle', '스레드 아이디를 적어 주세요');
  else if (!isValidHandle(v.handle)) mark('handle', '아이디는 영문·숫자·밑줄(_)·마침표(.)만 쓸 수 있어요');

  if (!v.side) mark('side', '성별을 골라 주세요');

  const year = Number(v.year);
  if (!v.year) mark('year', '출생연도를 적어 주세요');
  else if (!Number.isInteger(year) || year < 1940) mark('year', '출생연도를 다시 확인해 주세요 (1940년생부터)');
  else if (year > MAX_YEAR) mark('year', '1989년생 이하만 신청할 수 있어요 (38세 이상)');

  if (!v.region) mark('region', '거주 지역을 적어 주세요');

  const height = Number(v.height);
  if (!v.height) mark('height', '키를 적어 주세요');
  else if (!Number.isFinite(height) || height < 130 || height > 210) mark('height', '키는 130~210cm 사이로 적어 주세요');

  return errors;
}

async function onSubmit(e) {
  e.preventDefault();
  if (submitting) return;
  hideFormError();

  const raw = readForm();
  const errors = validate(raw);
  if (errors.length) {
    showFormError(errors[0]);
    const first = $('.apply-input.invalid, input[name="side"].invalid');
    if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  submitting = true;
  const btn = $('#applySubmit');
  if (btn) {
    btn.disabled = true;
    btn.textContent = '보내는 중...';
  }

  try {
    const apps = (await store.get(APPLY_PATH)) || {};
    const dup = findSameHandle(apps, raw.handle);
    if (dup) {
      showFormError('이미 신청된 스레드 아이디예요 · 내용을 고치려면 사회자에게 스레드 DM을 주세요');
      if (btn) {
        btn.disabled = false;
        btn.textContent = '⏳ 2기 신청서 보내기';
      }
      submitting = false;
      return;
    }

    const record = normalizeApplication({
      ...raw,
      year: Number(raw.year),
      height: Number(raw.height),
      pin: makePin(apps, raw.side),
      at: Date.now(),
    });

    const id = await store.push(APPLY_PATH, record);
    doneRecord = { ...record, id };
    renderDone(doneRecord);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (err) {
    console.error('[사랑의 스튜디오] 신청 저장 실패', err);
    showFormError('신청서를 보내지 못했어요 · 잠시 뒤 다시 시도해 주세요');
    if (btn) {
      btn.disabled = false;
      btn.textContent = '⏳ 2기 신청서 보내기';
    }
  } finally {
    submitting = false;
  }
}

function showFormError(msg) {
  const el = $('#formError');
  if (!el) return;
  el.textContent = msg;
  el.hidden = false;
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function hideFormError() {
  const el = $('#formError');
  if (el) el.hidden = true;
}

/* ---------------- 완료 ---------------- */

function renderDone(rec) {
  const when = new Date(rec.at || Date.now());
  const stamp = `${when.getMonth() + 1}월 ${when.getDate()}일 ${String(when.getHours()).padStart(2, '0')}:${String(
    when.getMinutes()
  ).padStart(2, '0')}`;

  MAIN.innerHTML = `
  <section class="apply-done">
    <div class="done-mark">💘</div>
    <h2>신청 완료!</h2>
    <p class="done-msg">사회자가 확인 후 <b>스레드 DM으로 안내드릴게요</b></p>

    <div class="done-summary">
      <div class="done-row"><span>스레드 아이디</span><b>@${esc(rec.handle)}</b></div>
      <div class="done-row"><span>성별 · 출생연도</span><b>${esc(sideLabel(rec.side))} · ${esc(String(rec.year).slice(-2))}년생</b></div>
      <div class="done-row"><span>지역 · 키</span><b>${esc(rec.region)} · ${esc(rec.height)}cm</b></div>
      <div class="done-row"><span>접수 시각</span><b>${esc(stamp)}</b></div>
    </div>

    <div class="done-actions">
      <a class="btn ghost" href="../">💘 사랑의 스튜디오 보러 가기</a>
    </div>

    <p class="done-foot">번호와 개인 PIN은 사회자가 확인한 뒤 초대 링크와 함께 보내 드려요<br>내용을 고치고 싶으면 사회자에게 스레드 DM을 주세요</p>
  </section>`;
}
