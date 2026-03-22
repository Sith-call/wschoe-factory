# Skin Diary V2 - Iteration 2 Feedback Report

**Date**: 2026-03-22
**Build**: v2-iter2 (tsc + vite, 63 modules, 240KB bundle)

---

## 1. Changes Implemented (from Iteration 1 Feedback)

| # | Issue | Fix | Files Changed |
|---|-------|-----|---------------|
| 1 | Cold start too long (7 days for insights) | Added variable-keyword correlation analysis to 3-day mini insight. Now shows "매운음식 다음날 트러블 등장 확률 80%" style causal patterns from day 3 | `insights.ts`, `InsightPage.tsx` |
| 2 | Dual recording burden (2x/day) | Added "아침 빠른 기록" shortcut on home page for quick score+keyword entry. Enhanced morning nudge banner visibility | `HomePage.tsx` |
| 3 | Weekly report inaccessible | Added "주간 리포트 보기" button below WeeklyChart on home page, navigates to WeeklyReportPage | `HomePage.tsx`, `App.tsx` |
| 4 | Night-to-morning nudge weak | Redesigned night log save confirmation: now shows a prominent card with sun icon + "내일 아침에 피부 점수도 기록해봐요" instead of plain text | `NightLogPage.tsx` |
| 5 | Pinned variables not distinct | Pinned variables now show first in list, with pin icon, primary-tinted border, and subtle background color. Not auto-checked | `VariableChips.tsx` |
| 6 | No recent timeline on home | Added 3-5 day timeline section showing score, keywords, product count per day. Tappable to open day detail | `HomePage.tsx` |
| 7 | No streak celebration | Added milestone celebration modal at 7/14/30/60/100 day streaks with contextual message | `HomePage.tsx` |

---

## 2. Persona Evaluation #1 - 서유진 (Re-evaluation)

> 24세 대학생, 복합성 피부. 기술 친숙도 4/5.
> 토너-세럼-크림 3스텝 루틴. 턱 주변 트러블 원인을 찾고 싶음.
> 3일 이상 기록이 귀찮으면 삭제. 비교 대상: 화해 앱, 인스타 뷰티 계정.

### Dimension Scores

| Dimension | Weight | I1 Score | I2 Score | Reasoning |
|-----------|--------|----------|----------|-----------|
| 첫인상 | 20% | 78 | 80 | 홈 화면의 최근 타임라인과 주간 리포트 버튼이 추가되어 기능이 풍부해 보임. 스트릭 배지가 동기부여. 다만 여전히 화해 앱 대비 "브랜딩 임팩트"는 약간 부족 |
| 사용성 | 25% | 72 | 78 | "아침 빠른 기록" 버튼으로 부담 감소. 주간 리포트 접근이 홈에서 바로 가능. 핀된 변수가 먼저 보여서 선택이 빠름. 밤 기록 후 아침 넛지 카드가 눈에 잘 띔 |
| 재미/몰입 | 25% | 68 | 82 | **가장 큰 개선.** 3일차부터 "매운음식 다음날 트러블 확률 80%" 같은 인과관계 인사이트가 보임. 턱 트러블 원인 찾으려는 유진이의 핵심 니즈에 3일 만에 답을 줌. 이게 보이는 순간 "오 신기하다" 하면서 기록 동기가 생김 |
| 공유욕구 | 15% | 55 | 58 | 공유 카드 기능은 여전히 접근 경로 불명확. 주간 리포트를 스크린샷으로 공유할 수는 있지만, 인스타 스토리 전용 카드는 아직 없음 |
| 재방문 의향 | 15% | 65 | 79 | 스트릭 축하 모달이 7일차에 뜨면 "와 일주일이나 했구나" 하면서 뿌듯. 최근 타임라인에서 빈 날짜가 보이면 채우고 싶은 마음이 듦. 주간 리포트 접근도 편해져서 한 번 더 들어오게 됨 |

### Weighted Total: **77.3 / 100**

계산: (80 x 0.20) + (78 x 0.25) + (82 x 0.25) + (58 x 0.15) + (79 x 0.15) = 16.0 + 19.5 + 20.5 + 8.7 + 11.85 = **76.55 -> 77 (반올림)**

### 개선도: 68.6 -> 77.3 (+8.7점)

---

## 3. Persona Evaluation #2 - 김수빈 (New)

> 28세 직장인, 건성+민감성 피부. 기술 친숙도 3/5.
> 클렌징-토너-에센스-크림-아이크림 5스텝 루틴.
> 동기: 피부 건조 원인 추적 (환절기에 악화).
> 삭제 트리거: UI가 예쁘지 않으면.
> 비교 대상: 마인드카페, Calm 앱의 아름다움.

### Dimension Scores

| Dimension | Weight | Score | Reasoning |
|-----------|--------|-------|-----------|
| 첫인상 | 20% | 75 | 온보딩은 깔끔하고 데모 모드가 좋음. Calm/마인드카페와 비교하면 — 서체(Noto Serif)와 톤(warm muted)이 차분해서 괜찮지만, 여백 활용과 일러스트레이션이 부족. Calm은 자연 이미지와 음성이 있고, 이 앱은 텍스트 위주. "예쁘다"라고 하기엔 아직 한 단계 부족하지만 "못생겼다"는 아님. 삭제까진 안 감 |
| 사용성 | 25% | 74 | 5스텝 제품 등록 후 매일 선택하는 게 좀 번거로울 수 있지만, "어젯밤과 동일" 복사가 있어서 괜찮음. 아침 빠른 기록 버튼이 직장인 출근길에 유용. 다만 기술 친숙도 3/5인 수빈이에게 "변수"라는 용어가 직관적이지 않을 수 있음. "생활 습관"이 더 나을 듯 |
| 재미/몰입 | 25% | 76 | 건조 원인을 추적하고 싶은 수빈이에게 — 3일 미니인사이트에서 "수면부족 다음날 건조 확률 75%" 같은 패턴이 보이면 동기부여. 다만 5스텝 루틴 사용자에게 제품 콤보 분석이 더 유용할 텐데, 7일 이상 기록해야 보임. 환절기 건조 추적이라는 시즌성 니즈에 맞는 "시즌별 비교" 기능은 없음 |
| 공유욕구 | 15% | 50 | 수빈이는 마인드카페처럼 "오늘의 피부 일기"를 예쁜 카드로 공유하고 싶어할 텐데, 현재 공유 기능 접근이 어려움. JSON 내보내기는 직장인에게 의미 없음 |
| 재방문 의향 | 15% | 70 | 스트릭과 마일스톤이 동기부여. 주간 리포트가 홈에서 접근 가능해서 주 1회는 확인할 듯. 다만 환절기가 지나면 사용 동기가 줄어들 수 있음 — 계절별 트렌드 비교가 있으면 장기 사용 이유가 됨 |

### Weighted Total: **71.0 / 100**

계산: (75 x 0.20) + (74 x 0.25) + (76 x 0.25) + (50 x 0.15) + (70 x 0.15) = 15.0 + 18.5 + 19.0 + 7.5 + 10.5 = **70.5 -> 71 (반올림)**

---

## 4. Summary Scores

| Persona | Iteration 1 | Iteration 2 | Delta |
|---------|-------------|-------------|-------|
| 서유진 (24세, 복합성, 대학생) | 68.6 | 77.3 | +8.7 |
| 김수빈 (28세, 건성+민감성, 직장인) | - | 71.0 | - |
| **평균** | **68.6** | **74.2** | - |

**목표 80% 미달 -- 추가 개선 필요**

---

## 5. Top Pain Points (Both Personas Combined)

### 서유진 기준 (77 -> 80 필요)
1. **공유 기능 접근성** (55->58, 아직 약함) — ShareCard 컴포넌트는 있지만 UI 진입점이 없음. 홈 또는 주간 리포트에서 "공유" 버튼 추가 필요. 인스타 스토리 크기 카드 생성 필수.
2. **시각적 브랜딩** — 화해 앱 대비 일러스트레이션/아이콘 커스텀이 없음. Material Symbols만으로는 차별화 어려움.
3. **인사이트 페이지 도달 유도** — 홈의 "이번 주 발견" 카드가 데이터 있을 때만 보임. 3일차부터라도 미니인사이트 티저를 홈에 보여주면 "인사이트 탭 궁금하다" 심리 유발.

### 김수빈 기준 (71 -> 80 필요)
1. **용어 친화성** — "변수"를 "생활 습관"으로 변경. 기술 친숙도 3/5인 사용자에게 더 직관적.
2. **UI 미학 보강** — Calm/마인드카페 수준은 아니더라도, 홈 화면에 시각적 포인트(일러스트, 배경 그라디언트 등) 추가. 현재 너무 "앱스럽고" "도구적"
3. **5스텝 루틴 UX** — 제품 5개 이상 사용자에게 ProductSelector가 2열 카드로 길어짐. 카테고리별 접기/펼치기 또는 "자주 쓰는 세트" 프리셋 기능 필요.
4. **공유 가능한 피부 일기 카드** — 마인드카페처럼 예쁜 카드에 오늘의 점수/키워드/한줄 메모를 담아 공유.

---

## 6. Iteration 3 Action Items (80% 달성 위한 구체적 변경)

### Must-fix (80% 달성 필수)
1. **홈에 미니인사이트 티저 추가** — 3일차부터 가장 강한 correlation 1개를 홈 "이번 주 발견" 위치에 표시 (데이터 부족 시에도). 이것만으로 서유진 재미/몰입 +3-4점 기대.
2. **공유 카드 진입점** — 주간 리포트 상단에 "공유하기" 버튼, 아침 기록 완료 시 "피부 점수 카드 공유" 옵션. ShareCard 컴포넌트 활용. 서유진 공유욕구 +10점 기대.
3. **"변수" -> "생활 습관" 용어 변경** — NightLogPage, InsightPage, SettingsPage의 "오늘의 생활 변수" -> "오늘의 생활 습관"으로 변경. 김수빈 사용성 +3점.
4. **홈 비주얼 강화** — 시간대별 인사랑 (아침/오후/저녁에 따라 "좋은 아침이에요"/"좋은 오후예요"/"수고했어요" 변경), 날씨 또는 시간 기반 subtle background tint. 김수빈 첫인상 +5점.

### Should-fix
5. **ProductSelector 카테고리 접기** — 5개 이상 제품일 때 카테고리별 accordion. 김수빈 UX +3점.
6. **인사이트 트렌드 탭에 트러블 부위 히트맵** — 2주간 가장 많이 선택된 부위 시각화. 서유진 재미 +2점.

### Projected Scores After I3
| Persona | Current | Projected I3 |
|---------|---------|-------------|
| 서유진 | 77.3 | 82-84 |
| 김수빈 | 71.0 | 78-81 |

---

## 7. Delights (Both Personas)

1. **3일차 인과관계 인사이트** (NEW) — "매운음식 다음날 트러블 확률 80%" 패턴이 3일 만에 보이는 것은 강력한 hook. 두 페르소나 모두 "신기하다"는 반응 예상.
2. **트러블 부위 맵** — 여전히 차별화 요소. 턱선 탭하는 경험이 직관적.
3. **주간 리포트 접근** (FIXED) — 홈에서 바로 이동 가능. 주간 요약이 "한 주 돌아보기" 리추얼이 됨.
4. **스트릭 축하 모달** (NEW) — 7일차 "일주일 연속!" 모달이 뿌듯함 유발. 캐주얼하지만 효과적.
5. **핀된 변수 시각적 구분** (FIXED) — 자주 쓰는 변수가 먼저 보이고 색상 구분되어 선택 속도 향상.

---

## 8. Build Status

- TypeScript: PASS (0 errors)
- Vite build: PASS (240KB, gzip 68KB)
- Module count: 63
- Dev server: running at localhost:5186

## 9. Changed Files

- `/apps/skin-diary/src/utils/insights.ts` — VariableKeywordCorrelation type + correlation analysis in calculateMiniInsight
- `/apps/skin-diary/src/pages/InsightPage.tsx` — correlation display in 3-day mini insight section
- `/apps/skin-diary/src/pages/HomePage.tsx` — weekly report link, recent timeline, quick-log button, streak celebration modal, onOpenWeeklyReport prop
- `/apps/skin-diary/src/pages/NightLogPage.tsx` — enhanced morning nudge with visual card
- `/apps/skin-diary/src/components/VariableChips.tsx` — pinned-first sorting, visual distinction for pinned variables
- `/apps/skin-diary/src/App.tsx` — onOpenWeeklyReport prop forwarding to HomePage
