/* ============================================================
   사랑의 스튜디오 2기 — 참가 신청 페이지 (모집 마감)
   ------------------------------------------------------------
   · 2026-11-28 모집 마감: 신청 폼과 제출·저장 로직을 모두 내렸습니다.
   · Firebase(studio/applications/s2)는 읽지도 쓰지도 않습니다.
     1기 데이터도 건드리지 않습니다.
   · 예전 화면이 캐시에 남아 있어도 마감 안내로 바꿔 끼웁니다.
   ============================================================ */

const MAIN = document.querySelector('#applyMain');

const CLOSED = `
<section class="apply-closed">
  <div class="closed-tape">
    <span class="closed-dot" aria-hidden="true"></span>
    <span>2기 모집 마감 · CLOSED</span>
  </div>
  <div class="closed-body">
    <div class="closed-hourglass" aria-hidden="true">⏳</div>
    <p class="closed-eyebrow">사랑의 스튜디오 2기 · 모래시계 프로젝트</p>
    <h2 class="closed-title">사랑의 스튜디오 2기 <span>'모래시계'</span><br>모집이 마감되었습니다</h2>
    <p class="closed-msg">많은 관심 감사드립니다.<br>곧 2기 안내로 찾아뵙겠습니다.</p>
    <div class="closed-divider" aria-hidden="true"></div>
    <div class="closed-stamp" aria-hidden="true">마감</div>
    <div class="closed-actions">
      <a class="btn ghost" href="../">💘 사랑의 스튜디오 보러 가기</a>
    </div>
    <p class="closed-foot">보내 주신 신청서는 사회자가 2기 매칭 진행에만 사용해요</p>
  </div>
</section>`;

if (MAIN && !MAIN.querySelector('.apply-closed')) {
  MAIN.innerHTML = CLOSED;
}
