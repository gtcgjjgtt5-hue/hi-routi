/* ============================================================
   사랑의 스튜디오 — 명단 / 단계 / 초대 코드
   ※ 실제 스레드 아이디(@handle)는 이 파일에 넣지 않습니다.
     공개 저장소에 올라가면 참가자 신상이 그대로 노출되기 때문입니다.
     아이디는 사회자 화면에서만 입력·보관됩니다(이 기기 localStorage).
   ============================================================ */

export const APP_TITLE = '사랑의 스튜디오';
export const HOST_PIN = '1990'; // 사회자 입장 비밀번호 (README에 바꾸는 법 있음)
export const MAX_MSG = 300;

export const ROUNDS = [
  {
    id: 'waiting',
    step: 0,
    short: '대기중',
    label: '대기중',
    desc: '참가자들이 입장하고 있어요',
    hint: '입장이 끝나면 1부가 시작됩니다',
  },
  {
    id: 'r1',
    step: 1,
    short: '1부',
    label: '1부 · 자기소개 & 단체톡',
    desc: '익명 라운지에서 자기소개를 나눠 주세요',
    hint: '이름 대신 번호와 출생연도로만 이야기해요',
  },
  {
    id: 'r2',
    step: 2,
    short: '2부',
    label: '2부 · 첫인상 선택',
    desc: '마음에 든 사람을 1지망·2지망으로 몰래 골라 주세요',
    hint: '선택은 사회자만 볼 수 있어요',
    votingOpen: true,
  },
  {
    id: 'r3',
    step: 3,
    short: '3부',
    label: '3부 · 최종 사랑의 작대기',
    desc: '최종 선택을 남겨 주세요. 결과는 사회자가 공개합니다',
    hint: '최종 선택을 하면 1지망보다 우선해요',
    votingOpen: true,
    final: true,
  },
  {
    id: 'reveal',
    step: 4,
    short: '발표',
    label: '결과 발표 & 매칭방 오픈',
    desc: '사랑의 작대기가 공개되었습니다',
    hint: '서로 선택한 두 사람의 1:1 비밀방이 열렸어요',
    revealed: true,
  },
];

export const ROSTER = [
  // 남자 1~10호 (출생연도 순)
  { id: 'm1', side: 'm', num: 1, year: 1985, pin: '4821' },
  { id: 'm2', side: 'm', num: 2, year: 1988, pin: '7364' },
  { id: 'm3', side: 'm', num: 3, year: 1991, pin: '9157' },
  { id: 'm4', side: 'm', num: 4, year: 1994, pin: '2608' },
  { id: 'm5', side: 'm', num: 5, year: 1994, pin: '5439' },
  { id: 'm6', side: 'm', num: 6, year: 1997, pin: '8172' },
  { id: 'm7', side: 'm', num: 7, year: 1997, pin: '3495' },
  { id: 'm8', side: 'm', num: 8, year: 1999, pin: '6720' },
  { id: 'm9', side: 'm', num: 9, year: 1999, pin: '1846' },
  { id: 'm10', side: 'm', num: 10, year: 2000, pin: '9573' },
  // 남자 11~13호 (막차 추가 · 2026-11-26)
  { id: 'm11', side: 'm', num: 11, year: 1981, pin: '3819' },
  { id: 'm12', side: 'm', num: 12, year: 1981, pin: '2513' },
  { id: 'm13', side: 'm', num: 13, year: 1992, pin: '7140' },
  // 여자 1~10호 (출생연도 순)
  { id: 'w1', side: 'w', num: 1, year: 1983, pin: '6072' },
  { id: 'w2', side: 'w', num: 2, year: 1987, pin: '2941' },
  { id: 'w3', side: 'w', num: 3, year: 1990, pin: '8356' },
  { id: 'w4', side: 'w', num: 4, year: 1995, pin: '4109' },
  { id: 'w5', side: 'w', num: 5, year: 1996, pin: '7285' },
  { id: 'w6', side: 'w', num: 6, year: 1996, pin: '3614' },
  { id: 'w7', side: 'w', num: 7, year: 1996, pin: '9860' },
  { id: 'w8', side: 'w', num: 8, year: 1996, pin: '5273' },
  { id: 'w9', side: 'w', num: 9, year: 1998, pin: '1498' },
  { id: 'w10', side: 'w', num: 10, year: 1998, pin: '8026' },
  // 여자 11~12호 (막차 추가 · 2026-11-26)
  { id: 'w11', side: 'w', num: 11, year: 1985, pin: '3728' },
  { id: 'w12', side: 'w', num: 12, year: 1992, pin: '7342' },
];

export const MEN = ROSTER.filter((p) => p.side === 'm');
export const WOMEN = ROSTER.filter((p) => p.side === 'w');

const BY_ID = new Map(ROSTER.map((p) => [p.id, p]));

export function byId(id) {
  return BY_ID.get(id) || null;
}
export function rosterOf(side) {
  return side === 'm' ? MEN : WOMEN;
}
export function otherSide(side) {
  return side === 'm' ? 'w' : 'm';
}
export function sideOf(id) {
  const p = byId(id);
  return p ? p.side : 'm';
}
export function numOf(id) {
  const p = byId(id);
  return p ? p.num : 0;
}
export function yearOf(id) {
  const p = byId(id);
  return p ? p.year : '';
}
export function shortYear(id) {
  const y = yearOf(id);
  return y ? String(y).slice(2) + '년생' : '';
}
export function nameOf(id) {
  if (id === 'host') return '사회자';
  const p = byId(id);
  return p ? `${p.side === 'm' ? '남자' : '여자'} ${p.num}호` : '알 수 없음';
}
export function labelOf(id) {
  if (id === 'host') return '사회자';
  const p = byId(id);
  return p ? `${p.side === 'm' ? '남자' : '여자'} ${p.num}호 (${shortYear(id)})` : '알 수 없음';
}

export function roundById(id) {
  return ROUNDS.find((r) => r.id === id) || ROUNDS[0];
}
export function roundIndex(id) {
  return ROUNDS.findIndex((r) => r.id === id);
}

/** 초대 코드: m3-9157 처럼 번호 + 개인 PIN */
export function inviteCode(id) {
  const p = byId(id);
  return p ? `${p.id}-${p.pin}` : '';
}

/** 코드 문자열 → 참가자 id (PIN이 맞을 때만) */
export function parseInviteCode(raw) {
  if (!raw) return null;
  const value = String(raw).trim().toLowerCase().replace(/\s+/g, '');
  const m = value.match(/^([mw])(\d{1,2})-(\d{4})$/);
  if (m) {
    const id = `${m[1]}${Number(m[2])}`;
    const p = byId(id);
    if (p && p.pin === m[3]) return p.id;
    return null;
  }
  // 숫자만 4자리 + 번호 형태 보조: "3-9157" → 남자 3호로는 해석하지 않음(성별 모호)
  return null;
}

export function checkPin(id, pin) {
  const p = byId(id);
  return !!p && p.pin === String(pin);
}

export function pageBaseUrl() {
  const { origin, pathname } = window.location;
  return origin + pathname.replace(/index\.html?$/, '');
}

export function inviteUrl(id) {
  return `${pageBaseUrl()}?code=${encodeURIComponent(inviteCode(id))}`;
}
