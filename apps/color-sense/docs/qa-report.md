# QA Report: Color Sense Test (컬러 감각 테스트)

- **Date**: 2026-03-21
- **App URL**: http://localhost:5185
- **Viewport**: 375x812 (iPhone 14 Pro equivalent)
- **Tester**: QA Agent (automated + visual inspection)

---

## 1. Screen-by-Screen Test Results

### 1-1. Intro Screen (첫 방문, 기록 없음)
- **Status**: PASS
- Eye icon + title "컬러 감각 테스트" + subtitle "다른 색 하나를 찾아보세요" 정상 렌더링
- "시작하기" 버튼 정상 표시 (335x48px)
- 기록 없을 때 "기록 보기" 버튼 미표시 -- 정상
- 기록 없을 때 "내 최고 기록" 섹션 미표시 -- 정상

### 1-2. Intro Screen (기록 있음)
- **Status**: PASS
- "내 최고 기록" 섹션 표시 (점수 + 등급 + 상위 %)
- "기록 보기" 버튼 표시
- 최고 점수 0점일 때 "내 최고 기록" 미표시 -- 정상 (bestScore > 0 체크)

### 1-3. Game Screen (Lv.1, 2x2 grid)
- **Status**: PASS
- HUD: Lv.1 표시, 타이머 카운트다운 (10초), "1/20" 라운드 표시
- 가이드 텍스트 "다른 색 타일을 찾으세요" 첫 라운드에만 표시 -- 정상
- 2x2 그리드, 타일 크기 170x170px -- 충분
- 다른 색 타일 육안 식별 가능 (Lv.1은 hue diff 38)
- 타이머 색상 변경: 회색(>3s) -> 노란(<=3s) -> 빨간(<=1s) -- 정상
- 프로그레스 바 정상 작동

### 1-4. Game Screen (Lv.5+, 3x3 ~ 6x6 grids)
- **Status**: PASS
- 그리드 사이즈 증가 확인: 2x2(Lv1-4) -> 3x3(Lv5-8) -> 4x4(Lv9-12) -> 5x5(Lv13-16) -> 6x6(Lv17-20)
- 6x6 타일 크기: 54x54px -- 44px 최소 기준 충족
- 레벨 증가에 따라 색상 차이 감소 확인 (difficulty scaling 정상)

### 1-5. Game Over Screen (틀렸을 때)
- **Status**: PASS (조건부)
- "틀렸습니다!" 텍스트 + "Round N에서 탈락" 표시
- "결과 보기" 버튼 정상
- 2초 후 자동 전환 -- 정상
- **주의**: 간헐적으로 게임 화면에서 멈추는 버그 발생 (Bug #1 참조)

### 1-6. Game Over Screen (시간 초과)
- **Status**: PASS (조건부)
- "시간 초과!" 텍스트 + "Round N에서 탈락" 표시
- 타임아웃된 타일에 빨간 ring 표시 -- 정상
- **주의**: 간헐적으로 게임 화면에서 멈추는 버그 발생 (Bug #1 참조)

### 1-7. Result Screen
- **Status**: PASS (Bug #2 제외)
- 점수 카운트업 애니메이션 정상
- 등급 배지 + 등급 타이틀 표시 정상
- 통계 (클리어 레벨, 평균 반응, 총 라운드) 정상
- "NEW BEST" 배너 -- 새 기록 시 표시 (미확인, 로직상 정상)
- 하단 버튼: "다시 도전", "결과 공유", "기록 보기" 정상
- 의학적 면책 조항 표시

### 1-8. Share Card (결과 공유)
- **Status**: PASS
- 다크 테마 카드 프리뷰 정상 렌더링
- 등급 배지 + 상위 % + 점수 + CTA 텍스트 표시
- "이미지 저장", "링크 복사" 버튼 정상
- "닫기" 버튼으로 모달 닫기 정상
- 오버레이 클릭으로 닫기 정상

### 1-9. History Screen (기록 있음)
- **Status**: PASS
- 최고 기록 카드 정상 표시
- 통계 (총 플레이, 평균 점수, 최고 라운드) 정상 계산
- 최근 기록 리스트: 최신순 정렬, BEST 태그 표시
- 스크롤 가능 (maxHeight: 320px)

### 1-10. History Screen (기록 없음)
- **Status**: PASS (코드 리뷰)
- "아직 기록이 없어요" 안내 + "도전하기" 버튼 표시

---

## 2. Bug List

### Bug #1: 게임 종료 후 화면 전환 실패 (CRITICAL)
- **심각도**: CRITICAL
- **재현 조건**: 게임 결과 화면에서 "다시 도전" 클릭 후, 새 게임에서 틀리거나 타임아웃될 때 간헐적으로 발생
- **증상**: 게임 화면에서 멈춤. 타이머 정지, 타일 비활성화, wrong-shake 빨간 box-shadow 유지. 어떤 버튼도 없어 사용자가 진행 불가 -- 페이지 새로고침 필수
- **추정 원인**: `App.tsx`의 screen transition `useEffect`와 `useGame.ts`의 finalization `useEffect` 간 race condition. `transitionedRef`와 `lastResult` 상태 업데이트 타이밍 불일치. `setupRound`의 `useCallback` 의존성 배열에 `handleTimeout`이 누락되어 stale closure 발생 가능성
- **영향**: 사용자가 게임을 반복 플레이할 수 없음. 앱의 핵심 루프 파괴

### Bug #2: 퍼센타일 표시 오류 (HIGH)
- **심각도**: HIGH
- **증상**: 낮은 점수(0점, 970점 등 F등급)에서 "상위 2%", "상위 9%" 등으로 표시됨. 사용자가 상위 몇 %에 해당한다고 오해
- **원인**: `calculatePercentile()`은 정규분포 CDF 기반으로 "하위로부터 몇 번째 %인지"를 계산하지만, UI에서는 항상 "상위 X%"로 표시. 예: 0점 -> percentile=2 -> "상위 2%" (실제로는 하위 2%)
- **수정 제안**:
  - percentile < 50이면 "하위 X%", percentile >= 50이면 "상위 (100-X)%" 로 표시
  - 또는 percentile을 100에서 뺀 값으로 항상 "상위"로 표시 (예: score=0 -> "상위 98%")

### Bug #3: Tailwind CDN 사용 (MEDIUM)
- **심각도**: MEDIUM
- **증상**: 콘솔에 "cdn.tailwindcss.com should not be used in production" 경고 반복 출력
- **영향**: 프로덕션 성능 이슈 (CDN 의존성, 렌더링 지연 가능), CDN 장애 시 스타일 미적용
- **수정 제안**: PostCSS 플러그인 또는 Tailwind CLI 빌드로 전환

### Bug #4: `setupRound`의 stale closure (MEDIUM)
- **심각도**: MEDIUM
- **위치**: `useGame.ts` line 63-87
- **증상**: `setupRound`의 `useCallback` 의존성 배열이 `[startTimerAnimation]`이지만, 내부에서 `handleTimeout`을 참조. `handleTimeout`이 의존성에 포함되지 않아 stale 버전이 캡처될 수 있음
- **영향**: Bug #1의 근본 원인일 가능성. 타이머 정리 실패 -> 상태 불일치

---

## 3. Accessibility Check Results

### Font Size (>= 13px)
| 화면 | 요소 | 크기 | 판정 |
|------|------|------|------|
| Result | "이 테스트는 의학적 진단이 아닙니다." | 11px | FAIL |
| Game | "1 / 20" 라운드 표시 | 12px | FAIL |
| History | "최고 기록" 라벨 | 12px | FAIL |
| History | "총 플레이" / "평균 점수" / "최고 라운드" 라벨 | 12px | FAIL |
| History | 등급 배지 텍스트 (F, S+ 등) | 12px | FAIL |
| History | "BEST" 태그 | 10px | FAIL |

### Touch Target (>= 44px)
| 화면 | 요소 | 크기 | 판정 |
|------|------|------|------|
| Intro | "시작하기" 버튼 | 335x48px | PASS |
| Intro | "기록 보기" 버튼 | 335x36px | FAIL |
| Result | "다시 도전" 버튼 | 335x48px | PASS |
| Result | "결과 공유" 버튼 | 335x50px | PASS |
| Result | "기록 보기" 버튼 | 335x36px | FAIL |
| History | 뒤로가기 (< 아이콘) | 28x28px | FAIL |
| History | "다시 도전" 버튼 | 335x48px | PASS |
| Game | 6x6 타일 (최소) | 54x54px | PASS |
| GameOver | "결과 보기" 버튼 | ~335x48px | PASS |

### Color Contrast
| 요소 | 전경 | 배경 | 비율 (추정) | 판정 |
|------|------|------|-------------|------|
| "내 최고 기록" 라벨 | #a1a1aa | #fafafa | ~2.6:1 | FAIL (AA 4.5:1 필요) |
| 부제목 텍스트 | #71717a | #fafafa | ~4.6:1 | PASS |
| 본문 텍스트 | #18181b | #fafafa | ~15:1 | PASS |
| CTA 버튼 | #ffffff | #7c3aed | ~4.9:1 | PASS |
| 게임 HUD 텍스트 | #a1a1aa | #1e1b2e | ~5.8:1 | PASS |

### 기타 접근성
- `aria-label` 타일에 적용됨 ("타일 1", "타일 2" 등) -- PASS
- `lang="ko"` 설정됨 -- PASS
- `user-scalable=no` 설정 -- 접근성 관점에서 비권장 (줌 불가)

---

## 4. Console Errors
- **JS 에러**: 없음
- **경고**: Tailwind CDN production 사용 경고 (모든 페이지 전환 시 반복)

---

## 5. Performance
- **DOM Ready**: 135ms
- **Full Load**: 135ms
- **게임 반응성**: 타일 클릭 -> 다음 라운드 전환 ~100ms (체감 즉시)
- **타이머 애니메이션**: requestAnimationFrame 기반, 부드러움
- **판정**: PASS -- 성능 이슈 없음

---

## 6. Edge Case Test Results

| 테스트 | 결과 | 비고 |
|--------|------|------|
| 첫 방문 (기록 없음) | PASS | 인트로 정상, 기록 관련 UI 숨김 |
| Round 1 틀림 | PASS | 0점 결과 정상 표시 |
| Round 1 타임아웃 | PASS | 시간 초과 화면 정상 |
| 20라운드 완주 | PASS | gameOver phase로 결과 화면 직행 |
| 여러 게임 후 히스토리 | PASS | 최근순 정렬, BEST 태그, 통계 계산 정상 |
| 페이지 새로고침 (게임 중) | PASS | 인트로로 복귀, localStorage 기록 유지 |
| "다시 도전" 후 틀림 | FAIL (간헐적) | Bug #1 -- 화면 전환 실패로 게임 멈춤 |
| "다시 도전" 후 타임아웃 | FAIL (간헐적) | Bug #1 -- 동일 증상 |

---

## 7. Go/No-Go for Ralph Loop

### **판정: NO-GO**

### 근거:
1. **CRITICAL Bug #1**: "다시 도전" 후 게임이 간헐적으로 멈추는 치명적 버그. 사용자가 반복 플레이(핵심 루프)를 할 수 없음. 페이지 새로고침 필수
2. **HIGH Bug #2**: 퍼센타일 표시가 반대로 되어 F등급인데 "상위 2%"로 표시. 사용자 혼란 유발 및 결과의 신뢰성 훼손

### Ralph Loop 진입 전 필수 수정:
- [ ] Bug #1: useGame/App 간 상태 전환 race condition 수정
- [ ] Bug #2: 퍼센타일 표시 로직 수정 (상위/하위 구분 또는 100-percentile 적용)

### 권장 수정 (Ralph Loop 중 처리 가능):
- [ ] 접근성: "기록 보기" 버튼 터치 타겟 44px 이상으로 확대
- [ ] 접근성: 히스토리 뒤로가기 버튼 44x44px 이상으로 확대
- [ ] 접근성: 12px 이하 텍스트를 13px 이상으로 상향
- [ ] 접근성: "내 최고 기록" 라벨 색상 대비 개선
- [ ] Bug #3: Tailwind CDN을 빌드 기반으로 전환
