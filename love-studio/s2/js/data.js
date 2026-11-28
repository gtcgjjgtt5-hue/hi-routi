/* ============================================================
   사랑의 스튜디오 2기 '모래시계' — 명단 / 단계 / 초대 코드
   ------------------------------------------------------------
   1기(love-studio/js/data.js)와 완전히 분리된 2기 전용 명단입니다.

   · 원본: Firebase studio/applications/s2 (2026-11-28 19:15 기준 21건)
   · 번호: 성별별 출생연도 오름차순, 같은 해는 신청 시각 순
   · PIN : 각자 신청할 때 저장한 4자리를 그대로 사용
   · 사용자 요청(2026-11-28 19:16)으로 @j_yj1224(1989년생 남자)는 제외
     → 최종 남자 11명 · 여자 9명 = 20명
   · 실제 스레드 아이디(@handle)는 이 파일에 넣지 않습니다.
     공개 저장소에 올라가면 참가자 신상이 그대로 노출되기 때문입니다.
     아이디는 사회자 화면 '명단 → 아이디 불러오기'로만 이 기기에 저장됩니다.
   ============================================================ */

export const APP_TITLE = '사랑의 스튜디오';
export const SEASON_NO = 2;
export const SEASON_NAME = '모래시계';
export const SEASON_LABEL = '2기 · 모래시계';
export const SEASON_HINT = '1990년대 감성 소개팅 쇼';

export const HOST_PIN = '1990'; // 사회자 입장 비밀번호
export const MAX_MSG = 300;
export const LOUNGE_MAX = 2000; // 라운지 입력 — 긴 프로필 목록도 붙여넣을 수 있게
export const ANN_MAX = 3000; // 전체 공지(방송)

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

/* ---------------- 2기 신청서 (정리본) ----------------
   at 은 신청 시각(동년 같은 해 정렬용)입니다.
   신청서에 적힌 명백한 오타만 다듬었습니다:
   179 8→179 · 대부 동구→대구 동구 · 화사원→회사원 · 영북 포항→경북 포항
    롯데자리→롯데 자이언츠 · 삼성(라이온즈)→삼성 라이온즈 · 엘지트윈스→LG 트윈스
    엔씨다이노스→NC 다이노스 · 기아타이거즈(타이거지)→KIA 타이거즈 · 나이무곤→나이 무관
------------------------------------------------------- */

const APPLICANTS = [
  /* ---- 남자 ---- */
  {
    side: 'm', year: 1981, at: 1795711719887, pin: '1460',
    region: '대구 달성군 테크노폴리스', height: '179', job: '공무원', team: '삼성 라이온즈',
    marital: '돌싱', smoke: '비흡연', drink: '어쩔 수 없을 때만', religion: '무교',
    hobby: '직관 러닝 수영 등산', mbti: 'ENTP', ageGap: '나이 무관 숫자에 불과함',
    longDistance: '불가능', important: '티키타카가 잘 되고 상대방을 배려할 줄 아는 사람',
  },
  {
    side: 'm', year: 1981, at: 1795730153093, pin: '2364',
    region: '대구 시지', height: '182', job: '관리직', team: '삼성 라이온즈',
    marital: '미혼', smoke: '비흡연', drink: '주 1~2회', religion: '천주교',
    hobby: '야구직관 운동 넷플 영화', mbti: 'ESFJ', ageGap: '3~10살 차이',
    longDistance: '불가능', important: '대화가 잘 통하는, 뭐든 잘 드시고 날카롭지 않으신 분',
  },
  {
    side: 'm', year: 1983, at: 1795852213474, pin: '7654',
    region: '인천 검단구', height: '175', job: '개인사업자', team: '롯데 자이언츠',
    marital: '미혼', smoke: '비흡연', drink: '거의 안 마심', religion: '무교',
    hobby: '야구직관 드라이브', mbti: 'ISFP', ageGap: '연하만',
    longDistance: '호감 시 가능', important: '고집 없고 같은 취미를 가진 사람',
  },
  {
    side: 'm', year: 1985, at: 1795858078139, pin: '9804',
    region: '경북 포항', height: '171', job: '연구원', team: '삼성 라이온즈',
    marital: '미혼', smoke: '비흡연', drink: '주 2회', religion: '무교',
    hobby: '야구 직관 여행', mbti: 'ESFP', ageGap: '나이 무관',
    longDistance: '가능', important: '존경할 수 있는 분 / 대화가 잘 통하는 분',
  },
  {
    side: 'm', year: 1987, at: 1795791914866, pin: '8119',
    region: '대구 동구', height: '175', job: '일식 셰프', team: '삼성 라이온즈',
    marital: '돌싱', smoke: '비흡연', drink: '즐기는 편', religion: '불교',
    hobby: '야구직관 야구시청 캠핑', mbti: 'ESFJ', ageGap: '나이 무관',
    longDistance: '호감 시 가능',
    important: '이해와 공감 능력이 있고 화해하는 방식의 차이를 존중하며 표현에 인색하지 않은 것',
  },
  {
    side: 'm', year: 1988, at: 1795721058832, pin: '7045',
    region: '독일', height: '182', job: '회사원', team: '삼성 라이온즈',
    marital: '돌싱', smoke: '비흡연', drink: '가끔', religion: '기독교',
    hobby: '운동(크로스핏 러닝)', mbti: 'ISTP', ageGap: '2살 위 ~ 8살 아래',
    longDistance: '호감 시 가능',
    important: '대화가 잘 통하는 사람, 문신·담배 안 하시는 분, 정치 성향이 비슷하신 분(우)',
  },
  {
    side: 'm', year: 1988, at: 1795853890399, pin: '4174',
    region: '충남 천안시', height: '168', job: '회사원(품질팀)', team: 'KIA 타이거즈',
    marital: '미혼', smoke: '전자담배', drink: '2주에 1번 정도', religion: '무교',
    hobby: '야구직관', mbti: 'ESTP', ageGap: '나이 무관',
    longDistance: '가능',
    important: '야구, 대화, 재밌는 것, 밝은 것, 피곤하다 힘들다는 말 조금만 하는 사람',
  },
  {
    side: 'm', year: 1988, at: 1795858282674, pin: '6223',
    region: '울산', height: '172', job: '회사원', team: '삼성 라이온즈',
    marital: '미혼', smoke: '비흡연', drink: '안 마셔요', religion: '불교',
    hobby: '캠핑 러닝 등산 여행', mbti: 'ENFP', ageGap: '아래로 5살 위로 2살',
    longDistance: '호감 시 가능', important: '활발하고 부지런한 사람',
  },
  {
    side: 'm', year: 1989, at: 1795731856880, pin: '9680',
    region: '부산 남구', height: '178', job: '회사원', team: '롯데 자이언츠',
    marital: '', smoke: '', drink: '', religion: '',
    hobby: '', mbti: '', ageGap: '',
    longDistance: '', important: '',
  },
  {
    side: 'm', year: 1991, at: 1795854142501, pin: '2267',
    region: '경기 평택시', height: '173', job: '이커머스', team: '삼성 라이온즈',
    marital: '미혼', smoke: '비흡연', drink: '가끔', religion: '무교',
    hobby: '여행 드라이브 캠핑', mbti: 'ISFJ', ageGap: '위아래 5살',
    longDistance: '가능', important: '대화가 잘 통하는 사람',
  },
  {
    side: 'm', year: 1992, at: 1795859056497, pin: '5995',
    region: '서울 강북', height: '169', job: '의류영업', team: '삼성 라이온즈',
    marital: '미혼', smoke: '비흡연', drink: '강', religion: '',
    hobby: '', mbti: '', ageGap: '',
    longDistance: '', important: '',
  },

  /* ---- 여자 ---- */
  {
    side: 'w', year: 1985, at: 1795713917351, pin: '3349',
    region: '대구 달서구', height: '170', job: '간호사', team: '삼성 라이온즈',
    marital: '돌싱', smoke: '비흡연', drink: '안 마셔요', religion: '천주교',
    hobby: '야구보기', mbti: 'INFJ', ageGap: '아래위 네 살 정도까지 가능',
    longDistance: '불가능',
    important: '선하고 반듯하고 따뜻하고 공감 잘하고 취미가 비슷한 사람, 말이 먼저가 아니라 행동으로 보여주는 사람',
  },
  {
    side: 'w', year: 1985, at: 1795761426637, pin: '8657',
    region: '인천', height: '162', job: '회사원', team: 'KIA 타이거즈',
    marital: '미혼', smoke: '비흡연', drink: '주 1회', religion: '천주교',
    hobby: '야구 직관', mbti: 'INFJ', ageGap: '동갑 또는 아래',
    longDistance: '호감 시 가능', important: '책임감과 의리가 있는 사람',
  },
  {
    side: 'w', year: 1987, at: 1795799805445, pin: '8223',
    region: '포항', height: '157', job: '', team: '삼성 라이온즈',
    marital: '돌싱', smoke: '', drink: '가끔', religion: '무교',
    hobby: '야구 여행 콘서트', mbti: 'ESFP', ageGap: '나이 무관',
    longDistance: '호감 시 가능', important: '티키타카가 잘 되고 다정하신 분',
  },
  {
    side: 'w', year: 1988, at: 1795797612643, pin: '6293',
    region: '충남 천안시', height: '162', job: '회사원', team: '한화 이글스',
    marital: '미혼', smoke: '비흡연', drink: '안 마셔요', religion: '무교',
    hobby: '야구 여행', mbti: 'INTP', ageGap: '나이 무관',
    longDistance: '호감 시 가능', important: '도덕적 기준이 비슷한 사람',
  },
  {
    side: 'w', year: 1989, at: 1795732355580, pin: '5224',
    region: '인천 서해구', height: '163', job: '회사원', team: 'LG 트윈스',
    marital: '돌싱', smoke: '전자담배', drink: '가끔', religion: '무교',
    hobby: '야구관람', mbti: 'INFJ', ageGap: '5살 위아래까지',
    longDistance: '불가능',
    important: '야구 좋아하는 사람, 연락이 잘 되고 티키타카가 좋은 사람, 나를 귀여워할 수 있는 사람',
  },
  {
    side: 'w', year: 1989, at: 1795782960072, pin: '2038',
    region: '경산 중방동', height: '160', job: '어린이집 교사', team: '삼성 라이온즈',
    marital: '미혼', smoke: '비흡연', drink: '가끔', religion: '무교',
    hobby: '야구직관 등산', mbti: 'ISFJ', ageGap: '동갑·연하·연상 3살 이하',
    longDistance: '호감 시 가능', important: '안정형 대화',
  },
  {
    side: 'w', year: 1991, at: 1795787470368, pin: '3562',
    region: '인천 검단구', height: '168', job: '영유아 교사', team: 'NC 다이노스',
    marital: '미혼', smoke: '비흡연', drink: '사회적 음주', religion: '무교',
    hobby: '야구 직관', mbti: 'ESFJ', ageGap: '동갑',
    longDistance: '호감 시 가능',
    important: '배려심과 책임감이 있고 자신의 감정과 생각을 솔직하게 표현하는 사람',
  },
  {
    side: 'w', year: 1992, at: 1795829739110, pin: '2292',
    region: '서울 광진구', height: '162', job: '회사원', team: '삼성 라이온즈',
    marital: '미혼', smoke: '비흡연', drink: '주 1회', religion: '기독교',
    hobby: '야구직관 전시회 연극 뮤지컬 관람', mbti: 'INTP', ageGap: '동갑 ~ 88년생까지',
    longDistance: '가능',
    important: '센스 있는 사람, 대화 코드가 잘 통하고 웃음 포인트가 같은 사람',
  },
  {
    side: 'w', year: 1992, at: 1795858964558, pin: '1141',
    region: '서울 용산구', height: '166', job: '회사원', team: 'LG 트윈스',
    marital: '미혼', smoke: '비흡연', drink: '가끔', religion: '불교',
    hobby: '야구 직관 헬스 골프', mbti: 'ENFP', ageGap: '아래는 상관없음, 위는 4살',
    longDistance: '호감 시 가능',
    important: '다정한 사람, 연락 잘 되는 사람, 활동적인 사람, 본인 일 열심히 하는 사람',
  },

  /* ---- 제외 ----
     사용자 요청(2026-11-28 19:16)으로 명단에서 뺀 참가자입니다.
     다시 넣으려면 아래 주석을 풀면 1989년 남자 맨 앞 번호로 자동 편입됩니다.
     Firebase 원본 studio/applications/s2 에는 그대로 남아 있습니다.
  {
    side: 'm', year: 1989, at: 1795708283960, pin: '7317', handle: 'j_yj1224',
    region: '서울 서초구', height: '178', job: '사회적', team: '',
    marital: '', smoke: '', drink: '', religion: '',
    hobby: '', mbti: '', ageGap: '',
    longDistance: '', important: '',
  },
  */
];

const FIELDS = [
  'side', 'year', 'pin', 'region', 'height', 'job', 'team',
  'marital', 'smoke', 'drink', 'religion', 'hobby', 'mbti',
  'ageGap', 'longDistance', 'important',
];

function buildRoster() {
  const counters = { m: 0, w: 0 };
  const sorted = APPLICANTS.slice().sort((a, b) => {
    const ay = Number(a.year) || 9999;
    const by = Number(b.year) || 9999;
    if (ay !== by) return ay - by;
    return (a.at || 0) - (b.at || 0);
  });
  // 성별별로 다시 정렬해 번호를 1호부터 붙입니다
  return ['m', 'w'].flatMap((side) =>
    sorted
      .filter((p) => p.side === side)
      .map((p) => {
        counters[side] += 1;
        const person = { id: `${side}${counters[side]}`, side, num: counters[side] };
        FIELDS.forEach((key) => {
          person[key] = p[key] == null ? '' : p[key];
        });
        return person;
      })
  );
}

export const ROSTER = buildRoster();

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

/* ---------------- 한 줄 프로필 ----------------
   🩵 남자 1호 ➡️ 81년생 / 대구 달성군 테크노폴리스 / 179 / 공무원 / 삼성 라이온즈 / 비흡연 / 돌싱 ENTP 장거리 X
------------------------------------------------- */

const LONG_DISTANCE_LABEL = {
  가능: '장거리 가능',
  불가능: '장거리 X',
  '호감 시 가능': '호감시 장거리 가능',
};

function featureOf(p) {
  if (!p) return '–';
  const parts = [];
  if (p.marital === '돌싱') parts.push('돌싱');
  if (p.mbti) parts.push(p.mbti);
  const ld = LONG_DISTANCE_LABEL[p.longDistance];
  if (ld) parts.push(ld);
  if (parts.length < 2 && p.hobby) parts.push(p.hobby.split(' ').slice(0, 2).join(' '));
  return parts.join(' ') || '–';
}

/** 한 줄 프로필 (성별 이모지 + 번호 + 항목들) */
export function oneLineProfile(id) {
  const p = byId(id);
  if (!p) return '';
  const heart = p.side === 'm' ? '🩵' : '🤍';
  const slots = [
    shortYear(id) || '–',
    p.region || '–',
    p.height || '–',
    p.job || '–',
    p.team || '–',
    p.smoke || '–',
    featureOf(p),
  ];
  return `${heart} ${nameOf(id)} ➡️ ${slots.join(' / ')}`;
}

/** 프로필 한 줄만 (남자 먼저, 여자 다음) */
export function profileText(side) {
  return rosterOf(side).map((p) => oneLineProfile(p.id)).join('\n');
}

/** 자기소개 카드에 그릴 항목 */
export function cardRows(id) {
  const p = byId(id);
  if (!p) return [];
  return [
    ['결혼', p.marital],
    ['흡연', p.smoke],
    ['음주', p.drink],
    ['종교', p.religion],
    ['취미', p.hobby],
    ['MBTI', p.mbti],
    ['선호 나이차', p.ageGap],
    ['장거리', p.longDistance],
    ['좋아하는 구단', p.team],
    ['직업', p.job],
    ['키', p.height ? `${p.height}cm` : ''],
  ].filter(([, value]) => value);
}

/** 사회자 화면 '아이디 일괄 입력'에 붙여넣는 형식 */
export function handleTemplate(handles) {
  return ROSTER.map((p) => `${nameOf(p.id)} @${(handles && handles[p.id]) || ''}`).join('\n');
}
export function handleText(handles) {
  return ROSTER.map((p) => `${nameOf(p.id)} @${(handles && handles[p.id]) || '아이디없음'}`).join('\n');
}

/* ---------------- 초대 코드 ---------------- */

/** 초대 코드: m1-1460 처럼 번호 + 개인 PIN */
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

/** 참가자 개인 링크 — ?live=1&code=m1-1460 */
export function inviteUrl(id) {
  return `${pageBaseUrl()}?live=1&code=${encodeURIComponent(inviteCode(id))}`;
}

/** 링크 + 한 줄 프로필 (스레드 DM으로 바로 붙여넣는 형태) */
export function inviteText(id) {
  return `${oneLineProfile(id)}\n${inviteUrl(id)}`;
}
