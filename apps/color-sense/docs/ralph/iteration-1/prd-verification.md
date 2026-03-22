# PRD Verification Report — 컬러 감각 테스트 (Color Sense Test)

> **Iteration**: 1
> **Date**: 2026-03-21
> **Verifier**: PRD Verifier Agent
> **Test URL**: http://localhost:5185
> **Viewport**: 375x812 (iPhone SE)

---

## PRD 반영도 점수: **72 / 100**

---

## 1. 유저 스토리별 구현 체크 (P0)

### US-1.1: 앱 가치 즉시 이해

| 수용 기준 | 상태 | 비고 |
|-----------|------|------|
| 핵심 메시지 1줄 "당신의 눈은 몇 등급인가요?" | **FAIL** | "컬러 감각 테스트"로 구현됨. PRD/screen-flows에 명시된 카피와 다름 |
| 부제 "다른 색 타일을 찾아보세요. 20라운드 도전!" | **PARTIAL** | "다른 색 하나를 찾아보세요"로 구현. "20라운드 도전!" 누락 |
| 500ms 이내 텍스트 표시 완료 | **PASS** | screen-fade-in 150ms ease-in-out으로 즉시 표시 |
| CTA "시작하기" 하단 즉시 표시 | **PASS** | 하단 고정, 즉시 표시 |

### US-1.2: 한 번 탭으로 게임 시작

| 수용 기준 | 상태 | 비고 |
|-----------|------|------|
| "시작하기" 탭 → 200ms 이내 첫 라운드(2x2) 표시 | **PASS** | 즉시 전환, fade 150ms |
| 로그인/닉네임/약관 사전 단계 0개 | **PASS** | 없음 |
| 재방문 시에도 즉시 시작 | **PASS** | localStorage 기반, 재방문 시 동일 흐름 |

### US-1.3: 첫 라운드 규칙 직관적 이해

| 수용 기준 | 상태 | 비고 |
|-----------|------|------|
| 첫 라운드(2x2) 색 차이 매우 큼 (deltaE 30) | **PASS** | level 1 → diff 38 (hue shift), 충분히 큰 차이 |
| "다른 색 타일을 찾으세요" 1줄 표시 | **PASS** | `currentLevel === 1 && phase === 'playing'`일 때 표시 |
| 정답 탭 시 시각 피드백 (scale + 하이라이트) | **PARTIAL** | green border flash(100ms) 구현, scale 확대는 미구현 (PRD: scale 확대 + 색상 하이라이트) |
| 자동 다음 라운드 전환 (별도 버튼 없음) | **PASS** | 100ms 후 자동 전환 |

### US-2.1: 다른 색 타일 찾기

| 수용 기준 | 상태 | 비고 |
|-----------|------|------|
| NxN 그리드, 1개 다른 색 | **PASS** | 정상 구현 |
| 정답 → 150ms scale + 100ms 후 다음 라운드 | **PARTIAL** | 100ms 후 전환은 구현, scale 피드백 미구현 |
| 라운드 전환 시 색상/그리드 새로 생성 | **PASS** | generateRoundColors로 매 라운드 새 색상 |
| 타일 터치 영역 = 시각적 크기 | **PASS** | padding 없는 button, aspect-ratio: 1 |

### US-2.2: 오답 시 재시도

| 수용 기준 | 상태 | 비고 |
|-----------|------|------|
| 오답 → shake 애니메이션(200ms) | **PASS** | wrong-shake 200ms ease-out 구현 |
| 게임 끝나지 않음, 타이머 계속 | **PASS** | 오답 시 phase='wrong' → 200ms 후 phase='playing', 타이머 유지 |
| 오답 횟수 내부 기록 | **FAIL** | 오답 횟수를 별도 기록하지 않음 |

### US-2.3: 점진적 난이도 증가

| 수용 기준 | 상태 | 비고 |
|-----------|------|------|
| 그리드 크기 변화 (2x2→3x3→4x4→5x5→6x6) | **PASS** | getGridSize()에서 정확히 구현 |
| 그리드 변화 시 라운드 번호 강조 | **FAIL** | 라운드 번호 강조 없음 (크기 변화 없이 동일 스타일 유지) |
| 후반부 색 차이 어려움 | **PASS** | level 20 → diff 0 → Math.max(3, 0) = 3, 충분히 어려움 |

### US-2.4: 진행 상황 실시간 확인

| 수용 기준 | 상태 | 비고 |
|-----------|------|------|
| "Round 5/20" + 프로그레스 바 | **PARTIAL** | "5 / 20" 텍스트 + 프로그레스 바 구현. 그러나 "Round" 프리픽스 없이 숫자만 표시 |
| 타이머 바 (10초, 색상 변화) | **PARTIAL** | 타이머 바 구현되었으나 색상 기준 불일치. PRD: 10-4초 그레이/블루, 3-1초 옐로우(#ffd166), 1초 레드(#e63946). 코드: 10-3초 #a1a1aa, 3-1초 #f59e0b, <1초 #ef4444 |
| 프로그레스 바와 타이머 바 동시 표시 | **PASS** | 프로그레스 상단, 타이머 하단으로 분리 배치 |

### US-2.5: 시간 초과 시 정답 확인

| 수용 기준 | 상태 | 비고 |
|-----------|------|------|
| 정답 타일 깜빡임/테두리 하이라이트 | **PARTIAL** | ring-2 ring-[#ef4444] 테두리만 표시, blink 애니메이션 미구현 |
| 정답 표시 1.5초 → 게임 오버 화면 | **PARTIAL** | 300ms 후 GameOver 전환 (PRD: 1.5초). 너무 빠름 |
| "라운드 X에서 탈락" 메시지 | **PASS** | "Round X에서 탈락" 표시 |

### US-3.1: 점수와 등급 확인

| 수용 기준 | 상태 | 비고 |
|-----------|------|------|
| 점수 카운트업 애니메이션 (0→최종, 1.5초) | **PARTIAL** | 카운트업 구현, 800ms (PRD: 1.5초) |
| 등급 뱃지 색상 구분 | **PARTIAL** | S+/S: #7c3aed(violet), PRD: #e63946(red). A: #2563eb(맞음). B+/B: #22c55e(green, PRD: #06d6a0). C: #71717a(맞음). D: #a1a1aa(맞음) |
| 등급 타이틀 텍스트 | **PASS** | "초인의 눈", "프로 디자이너급" 등 구현 |
| 뱃지 scale(0.8→1) 등장 | **PASS** | badge-pop 애니메이션 (scale 0.8→1, 200ms) |

### US-3.2: 퍼센타일 표시

| 수용 기준 | 상태 | 비고 |
|-----------|------|------|
| "상위 X%" 등급 아래 표시 | **PASS** | 구현됨 |
| 5% 이하 특별 강조 | **FAIL** | 특별 강조 없음, 동일 스타일 |
| "의학적 진단이 아닙니다" 고지 | **PASS** | 하단에 13px 텍스트로 표시 |

### US-3.3: 라운드별 세부 성적

| 수용 기준 | 상태 | 비고 |
|-----------|------|------|
| 라운드별 소요 시간 바 차트 | **FAIL** | 바 차트 미구현. 대신 "클리어 레벨", "평균 반응", "총 라운드" 요약 통계만 표시 |
| 빠른/느린 라운드 색상 구분 | **FAIL** | 바 차트 자체가 없음 |
| 게임 오버 라운드 X 표시 | **FAIL** | 바 차트 자체가 없음 |
| 그리드 크기 표시 | **FAIL** | 바 차트 자체가 없음 |

### US-4.1: 카카오톡 공유

| 수용 기준 | 상태 | 비고 |
|-----------|------|------|
| "공유하기" → 공유 카드 모달 | **PASS** | ShareCard 모달 slide-up 구현 |
| 카카오톡 공유 버튼 | **FAIL** | 카카오톡 전용 공유 버튼 미구현. "이미지 저장"과 "링크 복사"만 존재 |
| 카카오톡 미설치 시 링크 복사 폴백 | **PARTIAL** | 링크 복사는 있으나 카카오톡 연동 자체가 없음 |

### US-4.2: 결과 이미지 저장

| 수용 기준 | 상태 | 비고 |
|-----------|------|------|
| "이미지 저장" → PNG 저장 | **PASS** | Canvas API 기반 이미지 생성 + 다운로드 |
| 카드 비율 4:5 | **PASS** | aspectRatio: '4/5' |
| 저장 완료 토스트 | **PASS** | "저장되었습니다" 토스트 구현 |

### US-4.3: 공유 링크 유입 시 즉시 시작

| 수용 기준 | 상태 | 비고 |
|-----------|------|------|
| 공유 URL → 인트로 직행 | **FAIL** | URL 쿼리 파라미터 기반 "친구의 기록" 표시 미구현 |
| "친구의 기록: X점" 표시 | **FAIL** | 쿼리 파라미터 파싱 로직 없음 |

### US-4.4: 텍스트 결과 공유

| 수용 기준 | 상태 | 비고 |
|-----------|------|------|
| "링크 복사" → 텍스트 + URL 클립보드 | **PASS** | 텍스트 포맷 구현 |
| 텍스트 포맷 일치 | **PARTIAL** | 전체 구조 유사하나 마지막 줄 URL이 "https://color-sense.app" (하드코딩) |
| "복사되었습니다" 토스트 | **PASS** | 구현됨 |

### US-5.1: 최고 기록 확인

| 수용 기준 | 상태 | 비고 |
|-----------|------|------|
| 인트로에 "내 최고 기록" 표시 | **PASS** | bestScore > 0일 때 표시 |
| 기록 없으면 영역 미표시 | **PASS** | 조건부 렌더링 |

### US-5.2: 플레이 기록 목록

| 수용 기준 | 상태 | 비고 |
|-----------|------|------|
| 최근 20회 기록 목록 | **PASS** | maxHeight 320px 스크롤 영역, 최대 20개 |
| 각 항목: 점수, 등급, 라운드, 날짜 | **PASS** | 구현됨 |
| BEST 라벨 | **PASS** | isBest일 때 BEST 뱃지 표시 |
| 통계: 총 플레이, 평균 점수, 최고 라운드 | **PASS** | grid-cols-3으로 표시 |

### US-5.3: 최고 기록 갱신 피드백

| 수용 기준 | 상태 | 비고 |
|-----------|------|------|
| "NEW BEST!" 뱃지 | **PASS** | 구현됨 |
| 이전 기록 차이 표시 | **PASS** | "+X점" 표시 |
| scale 애니메이션 | **PASS** | badge-enter (badge-pop 0.8→1) |

### US-5.4: 인트로에서 기록 접근

| 수용 기준 | 상태 | 비고 |
|-----------|------|------|
| "내 기록 보기" 텍스트 링크 (기록 있을 때만) | **PASS** | hasHistory 조건부 렌더링 |
| 히스토리에서 "뒤로" → 인트로 | **PASS** | BackIcon + onBack → 'intro' |

### US-5.5: 재도전 빠른 루프

| 수용 기준 | 상태 | 비고 |
|-----------|------|------|
| "다시 도전" → 200ms 이내 라운드 1 | **PASS** | 인트로 거치지 않고 바로 GameScreen |
| 새 게임 새 색상 세트 | **PASS** | startGame()에서 완전 초기화 |

---

## 2. 디자인 토큰 준수 여부

### 2.1 Color Palette

| 토큰 | 명세값 | 실제값 | 상태 |
|------|--------|--------|------|
| background | #fafafa | #fafafa | **PASS** |
| surface | #ffffff | #ffffff (카드 bg) | **PASS** |
| text-primary | #18181b | #18181b | **PASS** |
| text-secondary | #71717a | #71717a | **PASS** |
| text-tertiary | #a1a1aa | #a1a1aa | **PASS** |
| primary | #7c3aed | #7c3aed | **PASS** |
| primary-light | #ede9fe | #ede9fe (NEW BEST 배경) | **PASS** |
| border | #e4e4e7 | #e4e4e7 | **PASS** |
| success | #22c55e | rgba(34,197,94,0.6) (correct-flash) | **PASS** |
| danger | #ef4444 | #ef4444 (wrong, timeout) | **PASS** |
| game-bg | #1e1b2e | #1e1b2e (rgb(30,27,46) 확인) | **PASS** |

### 2.2 등급 뱃지 색상 (design-system vs 구현)

| 등급 | PRD 명세 | 구현값 | 상태 |
|------|----------|--------|------|
| S+/S | #e63946 (red) | #7c3aed (violet) | **FAIL** — design-system은 violet이지만 user-stories/screen-flows는 #e63946 |
| A | #2563eb | #2563eb | **PASS** |
| B+/B | #06d6a0 | #22c55e | **FAIL** — 비슷한 green이나 다른 shade |
| C | #6b7280 | #71717a | **PARTIAL** — 유사하지만 정확히 다름 |
| D | #9ca3af | #a1a1aa | **PARTIAL** — 유사하지만 정확히 다름 |
| F | #d1d5db text:#374151 | #e4e4e7 text:#71717a | **FAIL** |

### 2.3 Typography

| 항목 | 명세 | 실제 | 상태 |
|------|------|------|------|
| 한국어 폰트 | Wanted Sans Variable | Wanted Sans Variable | **PASS** |
| 영문/숫자 폰트 | Archivo | Archivo | **PASS** |
| H1 weight | bold (700) | font-bold (700) | **PASS** |
| Tabular nums | Archivo tnum | font-feature-settings: 'tnum' | **PASS** |
| 금지 폰트 사용 여부 | Pretendard 등 금지 | 미사용 | **PASS** |

> **참고**: screen-flows.md에서는 "Pretendard"를 반복 언급하지만, design-system.md에서 Pretendard는 금지 폰트로 명시. 구현은 design-system.md를 따름 (올바름).

### 2.4 Layout

| 항목 | 명세 | 실제 | 상태 |
|------|------|------|------|
| max-width: 480px | max-w-[480px] | **PASS** |
| padding-x: 20px | px-5 (20px) | **PASS** |
| 인트로: 중앙 정렬 | items-center text-center | **PASS** |
| 결과: 좌측 정렬 (점수만 중앙) | 통계 좌측 정렬, 점수 좌측 정렬 | **PARTIAL** — 점수도 좌측 정렬 (design-system은 점수 중앙 허용, 좌측도 가능) |
| 히스토리: 좌측 정렬 리스트 | 좌측 정렬 | **PASS** |

### 2.5 Border Radius

| 요소 | 명세 | 실제 | 상태 |
|------|------|------|------|
| 게임 타일 | 8px (lg) | 8px | **PASS** |
| 버튼 | 6px (md) | 6px (rounded-md) | **PASS** |
| 결과 카드 | 12px (xl) | rounded-xl (12px) | **PASS** |
| 점수 뱃지 | 0px (none) | rounded-lg (8px) | **FAIL** — 뱃지에 8px radius 사용 |

### 2.6 Buttons (3단계 위계)

| 등급 | 명세 | 실제 | 상태 |
|------|------|------|------|
| Primary | bg-[#7c3aed] text-white rounded-md | bg-[#7c3aed] text-white rounded-md | **PASS** |
| Secondary | border border-zinc-300 text-zinc-700 | border border-[#e4e4e7] text-[#18181b] | **PASS** |
| Tertiary | text-[#7c3aed] underline | text-[#7c3aed] underline | **PASS** |
| Primary/Secondary 차이 명확 | solid vs outlined | 명확 | **PASS** |

### 2.7 Animations

| 항목 | 명세 | 실제 | 상태 |
|------|------|------|------|
| fadeInUp 금지 | 사용하지 않을 것 | 미사용 | **PASS** |
| 파티클/오브/별 금지 | 없을 것 | 없음 | **PASS** |
| 정답: green border flash 100ms | correct-flash 100ms | **PASS** |
| 오답: red horizontal shake 200ms | wrong-shake 200ms | **PASS** |
| 레벨 전환: opacity crossfade 200ms | screen-enter 150ms | **PARTIAL** — 200ms가 아닌 150ms |
| 결과 점수: counter 800ms | 800ms ease-out | **PASS** (PRD design-system은 800ms, user-stories는 1.5초) |
| 화면 전환: opacity fade 150ms | screen-fade-in 150ms | **PASS** |

### 2.8 Icons

| 항목 | 명세 | 실제 | 상태 |
|------|------|------|------|
| 커스텀 inline SVG | Icons.tsx | **PASS** |
| stroke-only (fill 금지) | stroke 사용 | **PASS** |
| 이모지 아이콘/장식 없음 | 없음 | **PASS** |

### 2.9 Navigation

| 항목 | 명세 | 실제 | 상태 |
|------|------|------|------|
| 선형 플로우 | intro→game→result→(history) | **PASS** |
| 바텀 탭바 없음 | 없음 | **PASS** |
| 히스토리 뒤로가기 | BackIcon 구현 | **PASS** |
| 게임 중 뒤로가기 없음 | 없음 | **PASS** |

### 2.10 기타 디자인 규칙

| 항목 | 명세 | 실제 | 상태 |
|------|------|------|------|
| 그라디언트 사용 금지 | 미사용 | **PASS** |
| backdrop-blur 금지 | 미사용 | **PASS** |
| 장식 파티클 없음 | 없음 | **PASS** |
| 카드 네스팅 금지 | 1단계만 | **PASS** |
| 다크/라이트: 게임만 dark | game-bg #1e1b2e | **PASS** |

---

## 3. 누락 리스트 (중요도순)

### Critical (기능 누락)

1. **US-3.3: 라운드별 바 차트 완전 누락** — 결과 화면에 라운드별 소요 시간 바 차트가 없음. 요약 통계(클리어 레벨, 평균 반응, 총 라운드)만 표시. PRD 핵심 기능.
2. **US-4.1: 카카오톡 공유 미구현** — 카카오톡 SDK/URL scheme 연동 없음. MVP 공유 기능의 핵심 채널.
3. **US-4.3: 공유 링크 유입 처리 미구현** — URL 쿼리 파라미터 기반 "친구의 기록" 표시 로직 없음.

### Major (UX 차이)

4. **US-1.1: 인트로 카피 불일치** — "당신의 눈은 몇 등급인가요?" 대신 "컬러 감각 테스트" 표시. 부제에서 "20라운드 도전!" 누락.
5. **US-2.5: 시간 초과 정답 표시 시간 부족** — 300ms 후 GameOver 전환. PRD: 1.5초 동안 정답 표시 후 전환.
6. **US-2.5: 정답 blink 애니메이션 미구현** — 테두리만 표시, blink 효과 없음.
7. **US-3.1: 등급 뱃지 색상 불일치** — S+/S가 violet(#7c3aed)로 구현. screen-flows PRD는 #e63946(red). design-system은 violet 사용하므로 문서 간 충돌.
8. **US-3.2: 상위 5% 이하 특별 강조 미구현** — 모든 퍼센타일이 동일 스타일.
9. **US-2.3: 그리드 크기 변화 시 라운드 번호 강조 미구현** — 스테이지 전환 강조 없음.

### Minor (미세 차이)

10. **점수 뱃지 border-radius 불일치** — 명세: 0px (sharp), 구현: 8px (rounded-lg).
11. **타이머 바 경고 색상** — PRD: #ffd166, 구현: #f59e0b (amber-500). 유사하지만 정확히 다름.
12. **카운트업 시간** — user-stories: 1.5초, design-system: 800ms, 구현: 800ms.
13. **GameOverScreen "틀렸습니다!" 텍스트** — 현재 오답으로 게임이 끝나지 않으므로 이 분기가 사실상 사용되지 않지만, 코드에 잔재 존재.
14. **US-2.2: 오답 횟수 기록 미구현** — 오답 카운트를 GameRound에 저장하지 않음.
15. **screen-flows의 프로그레스/타이머 바 색상** — 프로그레스 fill이 #1a1a2e(screen-flows) vs #7c3aed(구현). design-system은 violet이므로 구현이 맞음.

---

## 4. 문서 간 충돌 메모

- **screen-flows.md**: Pretendard 폰트 반복 언급, CTA 색상 #e63946(red), 등급 뱃지 S+ #e63946
- **design-system.md**: Pretendard 금지, primary #7c3aed(violet), 등급 뱃지 미명시 (user-stories 참조)
- **user-stories.md**: S+/S #e63946, B+/B #06d6a0
- **구현**: design-system 기준으로 primary violet 통일 (S+/S: #7c3aed, B+/B: #22c55e)

screen-flows.md와 design-system.md 간 명백한 충돌이 있어, 구현 시 design-system.md를 우선 적용한 것으로 보임. 이 부분은 PM 문서 정리가 필요.

---

## 5. 점수 산출 근거

| 카테고리 | 배점 | 획득 | 비고 |
|----------|------|------|------|
| US-1 (첫 방문) 3개 | 15 | 12 | 카피 불일치(-3) |
| US-2 (게임 플레이) 5개 | 25 | 18 | 바 차트(-3), 정답 표시(-2), 라운드 강조(-1), 오답 기록(-1) |
| US-3 (결과) 3개 | 15 | 8 | 바 차트 완전 누락(-5), 퍼센타일 강조(-1), 등급 색상(-1) |
| US-4 (공유) 4개 | 20 | 11 | 카카오톡(-5), 공유 링크 유입(-3), 텍스트 포맷(-1) |
| US-5 (재방문) 5개 | 10 | 10 | 모두 통과 |
| 디자인 토큰 준수 | 15 | 13 | 뱃지 radius(-1), 등급 색상(-1) |
| **합계** | **100** | **72** | |
