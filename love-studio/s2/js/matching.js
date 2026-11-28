/* ============================================================
   사랑의 스튜디오 — 사랑의 작대기 (투표 · 매칭 · 관계도)
   ============================================================ */

import { MEN, WOMEN, byId, nameOf, shortYear } from './data.js?v=1';

/** 투표 원본을 안전한 형태로 */
export function normalizeVote(raw) {
  const v = raw && typeof raw === 'object' ? raw : {};
  return {
    first: v.first || null,
    second: v.second || null,
    final: v.final || null,
    at: v.at || 0,
  };
}

/** 우선순위 순 선택 목록 (최종 > 1지망 > 2지망), 중복 제거 */
export function picksOf(raw) {
  const v = normalizeVote(raw);
  const out = [];
  [v.final, v.first, v.second].forEach((id) => {
    if (id && !out.includes(id)) out.push(id);
  });
  return out;
}

/** 상대가 나를 몇 순위로 골랐는지 */
export function chosenRank(raw, targetId) {
  const v = normalizeVote(raw);
  if (v.final && v.final === targetId) return 'final';
  if (v.first && v.first === targetId) return 'first';
  if (v.second && v.second === targetId) return 'second';
  return null;
}

export function pairKey(a, b) {
  return [a, b].sort().join('__');
}

/**
 * 상호 선택된 커플 계산
 * @param {Object} votes  { [pid]: {first, second, final} }
 * @returns {{pairs: Array<{a:string,b:string,via:string,key:string}>, mutual: Object}}
 */
export function computeMatches(votes) {
  const list = votes || {};
  const pairs = [];
  const mutual = {};
  const ids = Object.keys(list);
  ids.forEach((a) => {
    picksOf(list[a]).forEach((b) => {
      if (!byId(b) || !list[b]) return;
      const back = chosenRank(list[b], a);
      if (!back) return;
      const key = pairKey(a, b);
      if (pairs.some((p) => p.key === key)) return;
      const mine = chosenRank(list[a], b);
      let via = 'first';
      if (mine === 'final' || back === 'final') via = 'final';
      else if (mine === 'second' && back === 'second') via = 'second';
      else if (back === 'second') via = 'second';
      pairs.push({ a, b, via, key });
      mutual[a] = mutual[a] || [];
      mutual[a].push(b);
      mutual[b] = mutual[b] || [];
      mutual[b].push(a);
    });
  });
  return { pairs, mutual };
}

/** 받은 표 집계 */
export function tallyVotes(votes) {
  const out = {};
  Object.entries(votes || {}).forEach(([pid, raw]) => {
    const v = normalizeVote(raw);
    [v.first, v.second, v.final].forEach((target, i) => {
      if (!target) return;
      out[target] = out[target] || { first: 0, second: 0, final: 0, total: 0, from: [] };
      const rank = i === 0 ? 'first' : i === 1 ? 'second' : 'final';
      out[target][rank] += 1;
      out[target].total += 1;
      out[target].from.push({ pid, rank });
    });
  });
  return out;
}

/* ---------------- 관계도(SVG) ---------------- */

const COL_LEFT = 46;
const COL_RIGHT = 314;
const ROW_H = 42;
const TOP_PAD = 54;
const BOTTOM_PAD = 22;

const SIDE_COLOR = { m: '#4E8FD8', w: '#E0648F' };

/**
 * @param {{votes:Object, meId?:string, showAll?:boolean}} opts
 *   showAll=false 이면 내가 고른 선만 그립니다(공개 전 참가자 화면).
 */
export function arrowChartSVG(opts = {}) {
  const votes = opts.votes || {};
  const meId = opts.meId || null;
  const showAll = opts.showAll !== false;
  // 명단 인원이 늘어나도(막차 추가 등) 줄 수에 맞춰 높이가 늘어나도록 계산
  const rows = Math.max(MEN.length, WOMEN.length, 10);
  const height = TOP_PAD + ROW_H * rows + BOTTOM_PAD;
  const { pairs } = computeMatches(votes);
  const pairMap = new Map(pairs.map((p) => [p.key, p]));
  const rowsY = (i) => TOP_PAD + i * ROW_H + ROW_H / 2;

  const lines = [];
  Object.entries(votes).forEach(([pid, raw]) => {
    if (!showAll && pid !== meId) return;
    const person = byId(pid);
    if (!person) return;
    const v = normalizeVote(raw);
    [['first', v.first], ['second', v.second], ['final', v.final]].forEach(([rank, target]) => {
      const other = byId(target);
      if (!other || other.side === person.side) return;
      const y1 = rowsY(person.num - 1);
      const y2 = rowsY(other.num - 1);
      const x1 = person.side === 'm' ? COL_LEFT + 15 : COL_RIGHT - 15;
      const x2 = person.side === 'm' ? COL_RIGHT - 15 : COL_LEFT + 15;
      const mid = (x1 + x2) / 2;
      const key = pairKey(pid, target);
      const isPair = pairMap.has(key);
      const stroke = SIDE_COLOR[person.side];
      const dash = rank === 'second' ? 'stroke-dasharray="4 5"' : rank === 'final' ? 'stroke-dasharray="9 4"' : '';
      const width = isPair ? 2.6 : rank === 'second' ? 1.3 : 1.9;
      const opacity = rank === 'second' ? 0.38 : 0.72;
      lines.push(
        `<path class="arrow" data-from="${pid}" data-to="${target}" data-rank="${rank}" data-pair="${isPair ? 1 : 0}" ` +
          `d="M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}" ` +
          `fill="none" stroke="${isPair ? '#E4386B' : stroke}" stroke-width="${width}" stroke-linecap="round" ` +
          `opacity="${opacity}" ${dash}></path>`
      );
    });
  });

  const hearts = pairs
    .map((p) => {
      const a = byId(p.a);
      const b = byId(p.b);
      if (!a || !b) return '';
      const y1 = rowsY(a.num - 1);
      const y2 = rowsY(b.num - 1);
      const y = (y1 + y2) / 2;
      return `<g class="heart" data-pair="${p.key}"><text x="${(COL_LEFT + COL_RIGHT) / 2}" y="${y + 5}" text-anchor="middle" font-size="15">💘</text></g>`;
    })
    .join('');

  const node = (p, side) => {
    const x = side === 'm' ? COL_LEFT : COL_RIGHT;
    const y = rowsY(p.num - 1);
    const fill = side === 'm' ? '#5B9BE8' : '#F2729F';
    const ring = side === 'm' ? '#DCEBFC' : '#FCE1EB';
    const yearX = side === 'm' ? x + 24 : x - 24;
    const anchor = side === 'm' ? 'start' : 'end';
    return (
      `<g class="node" data-id="${p.id}" data-side="${side}">` +
      `<circle cx="${x}" cy="${y}" r="16" fill="${ring}"></circle>` +
      `<circle cx="${x}" cy="${y}" r="13.5" fill="${fill}"></circle>` +
      `<text x="${x}" y="${y + 4.5}" text-anchor="middle" font-size="12" font-weight="700" fill="#fff">${p.num}</text>` +
      `<text x="${yearX}" y="${y + 3.5}" text-anchor="${anchor}" font-size="9.5" fill="#9A8B80">${shortYear(p.id).slice(0, 2)}</text>` +
      `</g>`
    );
  };

  return `
  <div class="chart-wrap">
    <svg class="chart" viewBox="0 0 360 ${height}" role="img" aria-label="사랑의 작대기 관계도">
      <text x="${COL_LEFT}" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#4E8FD8">남자</text>
      <text x="${COL_RIGHT}" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#E0648F">여자</text>
      <line x1="20" y1="34" x2="340" y2="34" stroke="#EADFD2" stroke-width="1"></line>
      <g class="lines">${lines.join('')}</g>
      <g class="hearts">${hearts}</g>
      <g class="nodes">
        ${MEN.map((p) => node(p, 'm')).join('')}
        ${WOMEN.map((p) => node(p, 'w')).join('')}
      </g>
    </svg>
    <p class="chart-legend">
      <span><i class="ln m"></i>남자 선택</span>
      <span><i class="ln w"></i>여자 선택</span>
      <span><i class="ln pair"></i>매칭</span>
    </p>
    <p class="chart-tip">번호를 눌러 그 사람의 작대기만 볼 수 있어요</p>
  </div>`;
}

export function personName(id) {
  return `${nameOf(id)}`;
}
