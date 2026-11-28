# 사랑의 스튜디오 2기 '모래시계' — 전용 방

1기(`/love-studio/`)와 파일·데이터가 완전히 분리된 2기 전용 앱입니다.
1기 종료 화면과 1기 데이터는 이 폴더에서 건드리지 않습니다.

## 주소

| 누구 | 링크 |
| --- | --- |
| 사회자 | `https://gtcgjjgtt5-hue.github.io/hi-routi/love-studio/s2/?live=1&host=1990` (비밀번호 `1990`) |
| 참가자(공통) | `https://gtcgjjgtt5-hue.github.io/hi-routi/love-studio/s2/?live=1` |
| 참가자(개인) | `https://gtcgjjgtt5-hue.github.io/hi-routi/love-studio/s2/?live=1&code=m1-1460` |
| 신청서(마감) | `https://gtcgjjgtt5-hue.github.io/hi-routi/love-studio/apply/` |

개인 초대 코드는 `번호-PIN` 형식입니다 (`m1-1460` = 남자 1호, PIN 1460).
사회자 화면 **명단** 탭에서 참가자별로 `링크+프로필`을 한 번에 복사할 수 있습니다.

## 명단 (`js/data.js`)

- 원본: Firebase `studio/applications/s2` (2026-11-28 19:15 기준 21건)
- 사용자 요청으로 `@j_yj1224`(1989년생 남자) 제외 → **남자 11명 · 여자 9명 = 20명**
- 번호는 성별별 출생연도 오름차순, 같은 해는 신청 시각 순
- PIN은 각자 신청할 때 저장한 4자리를 그대로 사용
- 한 줄 프로필·자기소개 카드도 `data.js` 안에 정리되어 있습니다
- 스레드 아이디는 공개 저장소에 올리지 않습니다. 사회자 화면 `명단 → ⏳ 신청서에서 아이디 불러오기`를 누르면 신청서의 PIN과 맞춰 이 기기에만 저장됩니다

## Firebase 경로 (1기와 분리)

```
studio_s2/status
studio_s2/announcements
studio_s2/lounge
studio_s2/votes
studio_s2/rooms
studio_s2/results
studio_s2/dm
studio_s2/roomChat
studio_s2/presence
```

1기 경로(`studio/...`)와 2기 신청서 원본(`studio/applications/s2`)은 읽기만 합니다.

## 사회자 기능

하단 탭 5개: **진행 · 라운지 · 명단 · 투표 · 방송**

- 진행: 대기 → 1부 → 2부 → 3부 → 발표(결과 공개·매칭방 오픈)
- 라운지: 사진 첨부(자동 압축), 참가자 댓글에 `↩ 답장`
- 명단: 참가자별 초대 링크·PIN·한 줄 프로필·1:1 방
- 투표: 받은 표·예상 매칭·관계도
- 방송: 전체 공지(3,000자)

## 초기화

사회자 화면 **진행** 탭 아래 `전체 대화·투표 초기화`는 `studio_s2/...`만 지웁니다.
1기 데이터와 신청서 원본은 지우지 않습니다.

## 배포

`main` 브랜치에 커밋·푸시하면 GitHub Pages에 바로 반영됩니다.
파일을 고치면 `index.html`의 `?v=` 값을 함께 올려 주세요(캐시 방지).
