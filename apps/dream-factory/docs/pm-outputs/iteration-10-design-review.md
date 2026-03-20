# 꿈 공장 — Iteration 10 디자인 퀵 체크

**평가일**: 2026-03-20
**이전 점수**: 84/100 (Iteration 8 이후 유지)
**검토 범위**: 전체 컴포넌트 코드 리뷰 + 스크린샷 확인

---

## 변경 감지 (Iteration 9 → 10)

코드 변경 없음 (Iteration 10은 신규 페르소나 평가 전용).

---

## 전체 디자인 일관성 확인

### 디자인 토큰 사용

| 항목 | 상태 |
|------|------|
| 시맨틱 컬러 토큰 (bg-surface, text-on-surface 등) | 일관 사용 |
| 글래스모피즘 (`glass-card`, `glass-card-subtle`) | 2종 유지, 용도 규칙 미문서화 |
| 카드 radius (`card-radius`, `rounded-xl`, `rounded-2xl`) | 혼용 잔존 -- rounded-xl(PatternScreen 섹션), rounded-2xl(삭제 다이얼로그), card-radius(갤러리 카드, InterpretationScreen) |
| 타이포그래피 (`font-headline`, `font-body`, `font-label`) | 3종 일관 사용 |
| 그라디언트 (`gradient-{emotion}`) | CSS 클래스 기반 일관 사용 |
| 바텀 네비게이션 | 3탭 (기록/갤러리/통계) 전 화면 일관 |

### 잔존 hex 하드코딩

| 위치 | hex 값 | 사유 |
|------|--------|------|
| PatternScreen donut chart | `#a88cfb`, `#0d082c`, `#ff6e84`, `#4f46e5`, `#1c00a0` | SVG 차트용 -- CSS 변수 미지원 영역 |
| DreamIconComposition gradient | `#7C3AED`, `#3B82F6` | fallback gradient (emotionData 미발견 시) |
| InterpretationScreen card bg | `#1a1739`, `#120e31` | 카드 내부 배경 -- 디자인 토큰에 없는 특수 색상 |

### 신규 Persona 4 관점 디자인 이슈

- **가독성**: `text-[10px]`이 GalleryScreen (날짜, 감정 태그), PatternScreen (캘린더 요일, 팔레트 카운트), IntroScreen (최근 기록 라벨) 등 곳곳에 사용됨. 40대 사용자 접근성 관점에서 최소 12px 권장.
- **명암비**: 어두운 배경(`bg-surface-dim`) 위 `text-on-surface-variant/60`이나 `/40` 투명도 텍스트는 WCAG AA 기준 미달 가능성. 특히 `text-indigo-300/60`, `text-indigo-400/40` 같은 낮은 불투명도 텍스트.

---

## 잔존 감점 항목

| 항목 | 감점 | 비고 |
|------|------|------|
| glassmorphism 변형 2종 용도 규칙 미문서화 | -3 | 유지 |
| 섹션 컨테이너 radius 미통일 (xl vs 2xl vs card-radius) | -4 | 유지 |
| IntroScreen/AnalysisScreen 예외 배경 | -3 | 유지 |
| 잔존 inline gradient hex | -4 | 유지 |
| PatternScreen 차트 hex | -2 | 유지 |

---

## 판정

**84/100 유지** -- 코드 변경 없으므로 디자인 점수 변동 없음. 다만 Persona 4(41세, 상담교사)의 관점에서 가독성/명암비 이슈가 새롭게 부각됨. 이는 기존 디자인 시스템의 구조적 한계로, 접근성 개선 시 전체 토큰 체계 재검토가 필요한 사항.
