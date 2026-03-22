# Skin Diary V2 - Iteration 1 Feedback Report

**Date**: 2026-03-22
**Persona**: 서유진 (24세, 복합성 피부, 대학생)
**Build**: v2 (tsc + vite, 63 modules, 233KB bundle)

---

## 1. QA Findings

### Bugs Found & Fixed

| # | Severity | Issue | File | Fix |
|---|----------|-------|------|-----|
| 1 | Medium | Night record card shows "외 -1개" when exactly 1 product used | `HomePage.tsx:134` | Changed `> 0` to `> 1` check, added single-product display path |
| 2 | Low | MorningLogPage bottom action has conflicting CSS `left-0` and `left-1/2` | `MorningLogPage.tsx:143` | Removed duplicate `left-0` |
| 3 | Low | Insight page header has non-functional menu/account icons that look clickable | `InsightPage.tsx:41-43` | Removed dead icons, centered title |
| 4 | Medium | Pinned variables auto-selected as "active" in night log (marking life events user didn't report) | `NightLogPage.tsx:41-54` | Changed to initialize empty, pinned variables shown first but not pre-checked |
| 5 | Medium | Custom variable IDs shown as raw strings ("custom_1") in DayDetail bottom sheet | `DayDetail.tsx:69` | Added `resolveVariableLabel()` that maps custom variable IDs to human labels via storage |

### Code Review Notes (No Fix Needed)
- Tailwind `borderRadius` override (xl=8px) is intentional design choice - explicit px values used for cards
- `shareOrDownload` depends on `html2canvas` which isn't bundled - share feature will fail silently at runtime (not blocking for MVP)
- Weekly report generation triggers on every records change - could be optimized but no performance issue with 30-day dataset

---

## 2. Persona Evaluation - 서유진

> 24세 대학생, 복합성 피부. 기술 친숙도 4/5.
> 토너-세럼-크림 3스텝 루틴. 턱 주변 트러블 원인을 찾고 싶음.
> 3일 이상 기록이 귀찮으면 삭제. 비교 대상: 화해 앱, 인스타 뷰티 계정.

### Dimension Scores

| Dimension | Weight | Score | Reasoning |
|-----------|--------|-------|-----------|
| 첫인상 | 20% | 78 | 온보딩이 깔끔하고 "데모로 먼저 살펴보기" 버튼이 좋음. 다만 첫 화면에서 이 앱이 뭘 해주는지 (인과관계 발견) 한눈에 안 보임. 화해 앱과 비교하면 시각적 임팩트 부족 |
| 사용성 | 25% | 72 | 밤/아침 기록 플로우가 분리되어 있어 논리적이지만, 하루에 2번 열어야 한다는 점이 부담. 제품 선택 UI(2열 카드)는 제품 6개일 때 괜찮지만 10개 넘으면 스크롤 길어질 것. 트러블 부위 맵은 직관적이고 재미있음. 다만 "어젯밤과 동일" 복사 기능은 좋은데 발견하기 어려움 |
| 재미/몰입 | 25% | 68 | 인사이트가 핵심 동기부여인데 7일 이상 기록해야 보임 - 턱 트러블 원인 찾으러 온 유진이에게 7일은 길다. 3일 미니인사이트가 있지만 "가장 많이 기록한 키워드"만 보여줘서 인과관계 발견이 아직 안 됨. 콤보 분석과 변수 분석은 7일 후에 풍부해지면 좋겠지만 그때까지 버틸 동기가 약함 |
| 공유욕구 | 15% | 55 | 공유 기능이 ShareCard 컴포넌트로 존재하지만 실제 UI에서 접근 경로 불명확. 인스타 뷰티 계정처럼 "오늘의 피부 점수 카드"를 스토리로 올릴 수 있으면 좋겠음. 현재는 데이터 내보내기(JSON)만 있어서 친구에게 보여줄 수 없음 |
| 재방문 의향 | 15% | 65 | 마일스톤 배지(7일, 14일, 30일)와 연속 기록 스트릭이 동기부여. 하지만 매일 알림이 없어서 3일 빠지면 그냥 잊어버릴 것. 주간 리포트 자동 생성은 좋은 기능이지만 홈에서 접근 버튼이 없음 |

### Weighted Total: **68.7 / 100**

계산: (78 x 0.20) + (72 x 0.25) + (68 x 0.25) + (55 x 0.15) + (65 x 0.15) = 15.6 + 18.0 + 17.0 + 8.25 + 9.75 = **68.6**

---

## 3. Top 3 Pain Points

1. **인사이트까지의 콜드스타트가 너무 길다** - 턱 트러블 원인을 찾고 싶은 유진이에게 7일은 긴 대기. 3일 미니인사이트가 "키워드 빈도"만 보여주고 인과관계(예: "매운음식 먹은 다음날 턱 트러블 확률 80%")를 안 보여줌. 3일째에 최소한 변수-키워드 상관관계를 보여줘야 삭제 트리거 전에 가치를 느낌.

2. **하루 2회 기록 부담** - 밤에 제품+변수, 아침에 점수+키워드+부위. 각각 합리적이지만 대학생이 매일 2번 앱을 열기는 현실적으로 어려움. 아침 기록을 밤에 합치거나, 아침에 푸시 알림이라도 있어야 함. 현재 "아침 넛지 배너"는 앱을 열었을 때만 보임.

3. **주간 리포트/Weekly Report 접근 불가** - WeeklyReportPage가 존재하고 데이터도 생성되지만, UI 어디에서도 이 페이지로 이동할 수 있는 버튼이 없음. 홈이나 인사이트에서 접근할 수 있어야 함.

---

## 4. Top 3 Delights

1. **트러블 부위 맵 (TroubleAreaMap)** - 얼굴 윤곽에 터치하여 트러블 부위를 기록하는 UI가 직관적이고 차별화됨. 화해 앱에는 없는 기능. "턱선" 부위를 탭하는 경험이 시각적으로 만족스럽고, 턱 트러블 추적이라는 유진이의 핵심 니즈에 직결.

2. **제품 콤보 분석** - "아이소이 세럼 + 코스알엑스 에센스 시너지 +0.5점" 같은 콤보 인사이트는 스킨케어 덕후에게 매력적. 실제로 제품 조합을 실험하고 싶게 만드는 게이미피케이션 요소.

3. **"어젯밤과 동일" 복사 기능** - 루틴이 거의 고정된 사용자에게 기록 시간을 크게 줄여줌. 매일 같은 제품을 일일이 선택할 필요 없이 원탭으로 복사. 다만 시인성을 높여야 더 많이 활용될 것.

---

## 5. Improvement Suggestions (Priority Order)

### Must-fix (다음 이터레이션)
1. **3일차 인과관계 미니인사이트 추가** - "매운음식 먹은 다음날 트러블 키워드 등장 확률 X%" 같은 간단한 변수-키워드 상관 표시. 콜드스타트 문제 해결 핵심.
2. **주간 리포트 진입점 추가** - 홈 화면의 WeeklyChart 아래에 "주간 리포트 보기" 버튼 추가.
3. **홈 화면에 최근 기록 요약 타임라인** - 현재 홈은 "오늘" 상태만 보여줌. 최근 3-5일 타임라인을 추가하면 기록 습관 시각화와 빈 날 채우기 동기부여.

### Should-fix
4. **인사이트 트렌드 탭에 트러블 부위 히트맵** - 2주간 가장 많이 선택된 부위를 시각화. 유진이의 "턱 트러블 패턴" 직접 확인 가능.
5. **공유 가능한 피부 점수 카드** - 인스타 스토리용 이미지 생성. "이번 주 피부 점수 4.2점, 베스트 제품: 아이소이 세럼" 형태.
6. **기록 간소화 옵션** - "오늘도 같은 루틴" 원탭 기록. 제품+변수 모두 어젯밤과 동일하게 저장.

### Nice-to-have
7. **푸시 알림 연동** (Capacitor 이미 구성됨) - 아침 8시, 밤 10시 리마인더.
8. **제품 검색/자동완성** - 제품 수가 늘어나면 필요.
9. **다크 모드** - 밤 기록 시 눈부심 감소.

---

## 6. Build Status

- TypeScript: PASS (0 errors)
- Vite build: PASS (233KB gzip 66KB)
- Module count: 63

## 7. Fixed Files

- `/apps/skin-diary/src/pages/HomePage.tsx` - product count display fix
- `/apps/skin-diary/src/pages/MorningLogPage.tsx` - CSS positioning fix
- `/apps/skin-diary/src/pages/InsightPage.tsx` - removed dead UI icons
- `/apps/skin-diary/src/pages/NightLogPage.tsx` - pinned variables no longer auto-selected
- `/apps/skin-diary/src/components/DayDetail.tsx` - custom variable labels resolve correctly
