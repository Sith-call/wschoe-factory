# Design Review Report -- Dad Joke Machine

**Date:** 2026-04-02
**Reviewer:** Claude Opus 4.6 (design-review workflow)
**URL:** http://localhost:5190
**Viewport:** 375x812 (iPhone 모바일)

---

## Phase 1: First Impression

| 항목 | Before | After |
|------|--------|-------|
| 전체 톤 | 오렌지가 강하고 눈이 피로함 | 차분하고 편안한 크림 톤 |
| AI 느낌 | 있음 (colored left-border, 과한 3D 버튼) | 제거됨 |
| 타겟 적합성 | 퇴근 후 편하게 보기엔 자극적 | 적합 |

---

## Phase 2: Design System Extraction

실제 렌더링 값과 design-system.md 일치 확인:

| Token | design-system.md | 실제 CSS | 일치 |
|-------|------------------|----------|------|
| primary | #C85A1A | #C85A1A | O |
| background | #F7F4EF | #F7F4EF | O |
| text-primary | #33302B | #33302B | O |
| border | #E8E2DA | #E8E2DA | O |
| font-title | Black Han Sans | Black Han Sans | O |
| font-body | Nanum Gothic | Nanum Gothic | O |

---

## Phase 3: Page-by-Page Visual Audit

### 3.1 Home (Idle)
- 타이틀 좌측 정렬, 즐겨찾기 아이콘 우측 (OK)
- 서브카피 중앙 정렬 (인트로 예외, OK)
- 버튼 중앙 정렬 (인트로 예외, OK)
- 카운터 하단 표시 (OK)

### 3.2 Joke Setup
- 카드: 화이트 배경 + 얇은 보더 (colored left-border 제거됨)
- 텍스트 좌측 정렬 (OK)
- 탭 힌트 표시 (OK)
- 건너뛰기 버튼: 얇은 보더, 차분한 색상 (OK)

### 3.3 Joke Punchline
- 펀치라인: 다크 컬러 (기존 오렌지에서 변경)
- 웃음 리액션: 좌측 정렬, 본문 크기 (기존 우측 정렬 + 강조 텍스트에서 변경)
- 액션 버튼: 좌측 정렬, border-top으로 구분 (OK)
- 다음 버튼: 부드러운 그림자 (OK)

### 3.4 Favorites (Empty)
- 좌측 정렬 (OK)
- CTA 버튼 있음 (OK)
- 빈 상태 안내 텍스트 (OK)

### AI Slop Detection (10 Antipatterns)

| # | 안티패턴 | Before | After |
|---|---------|--------|-------|
| 1 | fadeInUp 만능 | 미사용 (OK) | OK |
| 2 | 그라디언트 텍스트 | 미사용 (OK) | OK |
| 3 | 135deg 그라디언트 | 미사용 (OK) | OK |
| 4 | 전부 중앙 정렬 | 인트로만 중앙 (OK) | OK |
| 5 | 장식 파티클 | 미사용 (OK) | OK |
| 6 | backdrop-blur 남발 | 미사용 (OK) | OK |
| 7 | 이모지 아이콘 | 미사용 (OK) | OK |
| 8 | Colored left-border | **있음** | **제거됨** |
| 9 | 균일 border-radius | 의도적 혼합 (OK) | OK |
| 10 | font-extrabold 도배 | 미사용 (OK) | OK |

---

## Phase 4-5: Interaction + Consistency

- 버튼 hover/active 상태 전환 부드러움 (OK)
- 즐겨찾기 토글 시 토스트 피드백 (OK)
- 복사 시 토스트 피드백 (OK)
- 화면 전환 즉시 (OK)
- reduced-motion 미디어 쿼리 지원 (OK)
- 모든 인터랙티브 요소 focus-visible 지원 (OK)
- 터치 타겟 44px 이상 (OK)

---

## Phase 6: Grades

| 카테고리 | 점수 | 비고 |
|---------|------|------|
| 색상/팔레트 | A | 채도 낮춘 오렌지+크림, 눈에 편안 |
| 타이포그래피 | A | 3종 폰트 조합, 위계 명확 |
| 레이아웃/정렬 | A | 좌측 정렬 기본, 인트로만 중앙 |
| 컴포넌트 일관성 | A | 버튼 위계 3단계 명확 |
| AI 안티패턴 | A | colored left-border 제거 후 전항목 통과 |
| 인터랙션 피드백 | A | 토스트, 애니메이션 적절 |
| 접근성 | A- | focus-visible, reduced-motion 지원 |
| 전체 | **A** | |

---

## Phase 7: Triage (수정 이력)

### 수정된 이슈

| 우선순위 | 이슈 | 수정 내용 |
|---------|------|----------|
| P0 | Colored left-border on joke card | 화이트 카드 + 얇은 보더로 교체 |
| P0 | 색상 채도 과다 (눈 피로) | 전체 팔레트 채도 낮춤 |
| P1 | 3D 버튼 과한 장식 | 부드러운 그림자 버튼으로 교체 |
| P1 | 펀치라인 오렌지 텍스트 (시각 자극) | 다크 톤 텍스트로 변경 |
| P1 | 웃음 리액션 우측 정렬 + 과한 강조 | 좌측 정렬, 본문 스타일로 완화 |
| P2 | 건너뛰기 버튼 과하게 강조 | 얇은 보더 + 뮤트 색상 |
| P2 | 카운터 가독성 낮음 | 색상/패딩 개선 |
| P2 | 액션 버튼 우측 정렬 | 좌측 정렬 + border-top 구분선 |

### 잔여 이슈 (선택적)

| 우선순위 | 이슈 | 비고 |
|---------|------|------|
| P3 | 즐겨찾기 목록에 개그가 있을 때의 상태 미확인 | 기능 테스트 시 함께 확인 필요 |
| P3 | 50개 클리어 화면 미확인 | 전체 플레이 필요 |

---

## Phase 8: Fix Loop

### Commit 1: `df667f9`
- Colored left-border 제거
- `border-left: 4px solid` -> `border: 1px solid var(--border)`
- `border-radius: 0 12px 12px 0` -> `border-radius: 16px`
- `background: var(--primary-light)` -> `background: var(--surface)`

### Commit 2: `40fe1f2`
- 색상 팔레트 채도 낮춤 (#E8651A -> #C85A1A 등)
- 버튼 3D 효과 제거, 소프트 그림자로 교체
- 펀치라인 색상 primary -> text-primary
- 웃음 리액션 좌측 정렬 + 본문 스타일
- 건너뛰기 버튼 경량화
- 액션 버튼 좌측 정렬 + 구분선
- 카운터 가독성 개선

### Commit 3: `698eb72`
- design-system.md 문서 동기화

---

## Phase 9: Final Audit

수정 후 모든 화면 재스크린샷 완료.

| 화면 | 상태 | Before 스크린샷 | After 스크린샷 |
|------|------|----------------|---------------|
| Home (Idle) | PASS | /tmp/djm-home-idle.png | /tmp/djm-final-idle.png |
| Joke Setup | PASS | /tmp/djm-setup.png | /tmp/djm-final-setup.png |
| Joke Punchline | PASS | /tmp/djm-punchline.png | /tmp/djm-final-punchline.png |
| Favorites (Empty) | PASS | /tmp/djm-favorites.png | /tmp/djm-final-favorites.png |

**DESIGN_RULES.md 체크리스트 재검증:**

```
[x] R1  — 기존 앱과 다른 색상 팔레트
[x] R2  — 그라디언트 텍스트 미사용
[x] R3  — 135deg 그라디언트 미사용
[x] R4  — fadeInUp 미사용
[x] R5  — 단일 화면, 바텀 탭바 없음
[x] R6  — backdrop-blur 미사용
[x] R7  — 장식 파티클 없음
[x] R8  — 고유 폰트 조합
[x] R9  — 라이트 모드
[x] R10 — border-radius 의도적 혼합 (16px 카드, 12px 버튼, 0px 리스트)
[x] R11 — Phosphor Icons 통일
[x] R12 — font-weight 위계 유지
[x] R13 — 이모지 아이콘 미사용
[x] R14 — 좌측 정렬 기본
[x] R15 — 카드 네스팅 없음, colored left-border 제거됨
[x] R16 — Primary/Secondary/Tertiary 3단계 버튼 위계
[x] R17 — 스피너 대신 점 3개 순차 등장
[x] R18 — 인터랙션 피드백 (토스트, 애니메이션)
[x] R19 — 인라인 액션 네비게이션 없음
[x] R20 — Secondary 버튼 secondary 색상 사용
[x] R21 — 빈 상태 CTA 포함
```

---

**STATUS: DONE**

전체 21개 규칙 통과. AI 안티패턴 8번(colored left-border) 제거 완료.
퇴근 후 직장인 타겟에 맞게 채도와 시각 자극을 전반적으로 낮춤.
