/* ============================================================
   사랑의 스튜디오 2기 — 신청서 공통 도우미
   ------------------------------------------------------------
   신청 페이지(apply/app.js)와 사회자 화면(js/app.js)이 같이 씁니다.
   · 저장 위치: studio/applications/s2/{id}   (1기 데이터와 완전히 분리)
   · 번호: 성별별 출생연도 오름차순으로 1호부터 자동 부여
   · PIN: 신청 때 저장한 4자리, 없으면 아이디 기반 고정 계산값
   ============================================================ */

export const APPLY_PATH = 'applications/s2';
export const APPLY_URL = new URL('../apply/', import.meta.url).href;

export const SIDE_LABEL = { m: '남자', w: '여자' };
export const SIDE_HEART = { m: '🩵', w: '🤍' };

export const MARITAL_OPTIONS = ['미혼', '돌싱'];
export const SMOKE_OPTIONS = ['비흡연', '전자담배', '흡연'];
export const LONG_DISTANCE_OPTIONS = ['가능', '불가능', '호감 시 가능'];

const MIN_YEAR = 1940;
export const MAX_YEAR = 1989; // 2026년 기준 만 37세 이상 · 1989년생 이하

/* ---------------- 입력값 다듬기 ---------------- */

export function normalizeHandle(raw) {
  return String(raw == null ? '' : raw)
    .trim()
    .replace(/\s+/g, '')
    .replace(/^@+/, '');
}

export function isValidHandle(handle) {
  return /^[A-Za-z0-9._]{2,30}$/.test(String(handle || ''));
}

/** 한 줄 프로필에 넣을 때 쉼표·마침표·슬래시를 지워 구분자가 섞이지 않게 */
export function cleanField(value) {
  return String(value == null ? '' : value)
    .replace(/[.,/]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function validYear(year) {
  const n = Number(year);
  return Number.isInteger(n) && n >= MIN_YEAR && n <= MAX_YEAR;
}

export function yearLabel(year) {
  const n = Number(year);
  if (!n) return '';
  return `${String(n).slice(-2)}년생`;
}

export function sideLabel(side) {
  return SIDE_LABEL[side] || '';
}

/* ---------------- 목록 · 번호 · PIN ---------------- */

export function listApplications(apps, side) {
  return Object.entries(apps || {})
    .filter(([, a]) => a && typeof a === 'object' && (side ? a.side === side : true))
    .map(([id, a]) => ({ ...a, id }))
    .sort((a, b) => {
      const ay = Number(a.year) || 9999;
      const by = Number(b.year) || 9999;
      if (ay !== by) return ay - by;
      return (a.at || 0) - (b.at || 0) || String(a.id).localeCompare(String(b.id));
    });
}

/** 성별별 출생연도순으로 1호부터 번호를 붙인 목록 */
export function numberedApplications(apps, side) {
  return listApplications(apps, side).map((a, i) => ({
    ...a,
    no: i + 1,
    label: `${sideLabel(side)} ${i + 1}호`,
  }));
}

export function countApplications(apps) {
  return {
    m: listApplications(apps, 'm').length,
    w: listApplications(apps, 'w').length,
  };
}

/** 신청 때 저장한 PIN, 예전 데이터처럼 없으면 아이디 기반 고정값 */
export function pinOf(app) {
  const stored = String((app && app.pin) || '');
  if (/^\d{4}$/.test(stored)) return stored;
  const base = `${(app && app.id) || ''}|${(app && app.handle) || ''}`;
  let h = 2166136261;
  for (let i = 0; i < base.length; i += 1) {
    h ^= base.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return String(1000 + (Math.abs(h) % 9000));
}

/** 같은 성별 안에서 겹치지 않는 새 PIN */
export function makePin(apps, side) {
  const used = new Set(listApplications(apps, side).map((a) => pinOf(a)));
  for (let i = 0; i < 80; i += 1) {
    const pin = String(1000 + Math.floor(Math.random() * 9000));
    if (!used.has(pin)) return pin;
  }
  return String(1000 + Math.floor(Math.random() * 9000));
}

/* ---------------- 한 줄 프로필 ---------------- */

function longDistanceLabel(value) {
  if (value === '가능') return '장거리 가능';
  if (value === '불가능') return '장거리 X';
  if (value === '호감 시 가능') return '호감시 장거리 가능';
  return '';
}

/** 한 줄 프로필 마지막 칸 — 돌싱·MBTI·장거리 등 짧은 특징 */
export function featureOf(app) {
  const parts = [];
  if (app && app.marital === '돌싱') parts.push('돌싱');
  const mbti = cleanField(app && app.mbti).toUpperCase();
  if (mbti) parts.push(mbti);
  const ld = longDistanceLabel(app && app.longDistance);
  if (ld) parts.push(ld);
  if (parts.length < 2) {
    const hobby = cleanField(app && app.hobby);
    if (hobby) parts.push(hobby.split(' ').slice(0, 2).join(' '));
  }
  return parts.join(' ') || '–';
}

/** 🩵 남자 1호 ➡️ 88년생 / 대구 / 178 / 회사원 / 삼성 라이온즈 / 비흡연 / INFJ 장거리 가능 */
export function oneLineProfile(app) {
  const heart = SIDE_HEART[app.side] || '';
  const label = app.label || `${sideLabel(app.side)} ${app.no || ''}호`.trim();
  const slots = [
    yearLabel(app.year) || '–',
    cleanField(app.region) || '–',
    cleanField(app.height) || '–',
    cleanField(app.job) || '–',
    cleanField(app.team) || '–',
    cleanField(app.smoke) || '–',
    featureOf(app),
  ];
  return `${heart} ${label} ➡️ ${slots.join(' / ')}`;
}

/** 한 성별 전체를 번호순 한 줄씩 */
export function profileText(apps, side) {
  return numberedApplications(apps, side)
    .map((a) => oneLineProfile(a))
    .join('\n');
}

/** 남자 먼저 · 여자 다음, `남자 1호 @아이디` 목록 */
export function handleText(apps) {
  const block = (side) =>
    numberedApplications(apps, side)
      .map((a) => `${a.label} @${normalizeHandle(a.handle) || '아이디없음'}`)
      .join('\n');
  return [block('m'), block('w')].filter(Boolean).join('\n\n');
}

/* ---------------- 신청서 한 건 정리 ---------------- */

export function normalizeApplication(raw) {
  const src = raw || {};
  const side = src.side === 'w' ? 'w' : 'm';
  const year = Number(src.year) || 0;
  return {
    handle: normalizeHandle(src.handle),
    side,
    year,
    region: cleanField(src.region),
    height: cleanField(src.height),
    job: cleanField(src.job),
    team: cleanField(src.team),
    marital: cleanField(src.marital),
    smoke: cleanField(src.smoke),
    drink: cleanField(src.drink),
    religion: cleanField(src.religion),
    hobby: cleanField(src.hobby),
    mbti: cleanField(src.mbti).toUpperCase(),
    important: String(src.important == null ? '' : src.important).trim(),
    ageGap: cleanField(src.ageGap),
    longDistance: cleanField(src.longDistance),
    pin: /^\d{4}$/.test(String(src.pin == null ? '' : src.pin)) ? String(src.pin) : '',
    at: Number(src.at) || Date.now(),
  };
}

export function findSameHandle(apps, handle) {
  const h = normalizeHandle(handle).toLowerCase();
  if (!h) return null;
  return listApplications(apps).find((a) => normalizeHandle(a.handle).toLowerCase() === h) || null;
}
