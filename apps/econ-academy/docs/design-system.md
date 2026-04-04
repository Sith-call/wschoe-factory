# Design System — 경제 아카데미 (Econ Academy)

## Product Context
- **What this is:** 100개 경제 용어를 의존성 그래프 기반으로 체계적으로 학습하는 교육 앱
- **Who it's for:** 경제학원론 수강 대학생 (1차), 직장인/공시생 (2차)
- **Space/industry:** 교육/경제학
- **Project type:** 학습 웹앱 (모바일 우선)

## Aesthetic Direction
- **Direction:** Industrial/Utilitarian — 학술적 권위감 + 기능 우선
- **Decoration level:** Minimal — 타이포그래피와 여백이 디자인을 이끈다
- **Mood:** 대학 도서관의 경제학 교과서를 펼친 느낌. 깨끗하고 체계적이며, 학습에 집중할 수 있는 환경.
- **Theme:** 라이트 모드 전용 (R9 준수)

## Typography
- **Display/Hero:** Space Grotesk (700) — 기하학적 구조가 경제학의 논리적 성격과 맞음
- **Body:** Pretendard (400, 500) — 한국어 가독성 최고, 시스템 폰트 느낌의 깔끔함
- **UI/Labels:** Pretendard (500, 600)
- **Data/Tables:** Space Grotesk (tabular-nums) — 숫자 정렬 지원
- **Code:** JetBrains Mono
- **Loading:**
  - Space Grotesk: `https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap`
  - Pretendard: `https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css`
- **Scale:**
  - xs: 12px / 0.75rem
  - sm: 14px / 0.875rem
  - base: 16px / 1rem
  - lg: 18px / 1.125rem
  - xl: 20px / 1.25rem
  - 2xl: 24px / 1.5rem
  - 3xl: 30px / 1.875rem
  - 4xl: 36px / 2.25rem
- **Weight hierarchy:** H1=bold(700), H2=semibold(600), H3=medium(500), body=regular(400)

## Color
- **Approach:** Restrained — 1 primary accent + 따뜻한 중성색. 색상은 희소하게, 의미 있게.
- **Primary:** `#0D9488` (teal-600) — 성장, 안정, 학술적 신뢰감. 금융의 녹색 계열이되 더 현대적.
- **Primary Dark:** `#0F766E` (teal-700) — hover/active 상태
- **Primary Light:** `#CCFBF1` (teal-50) — 배경 하이라이트
- **Secondary:** `#D97706` (amber-600) — 진행도, 성취, 강조 포인트. 따뜻한 에너지.
- **Secondary Light:** `#FEF3C7` (amber-100) — 알림, 복습 배경
- **Surface:** `#FAFAF9` (stone-50) — 메인 배경. 순백이 아닌 따뜻한 크림.
- **Surface Card:** `#FFFFFF` — 카드/컨테이너 배경
- **Border:** `#E7E5E4` (stone-200) — 구분선, 카드 테두리
- **Ink (text):**
  - Default: `#1C1917` (stone-900) — 본문 텍스트
  - Secondary: `#78716C` (stone-500) — 보조 텍스트, 설명
  - Disabled: `#D6D3D1` (stone-300) — 비활성 텍스트
- **Semantic:**
  - Success: `#16A34A` (green-600) — 정답, 마스터 완료
  - Warning: `#CA8A04` (yellow-600) — 복습 필요
  - Error: `#DC2626` (red-600) — 오답
  - Info: `#2563EB` (blue-600) — 정보, 힌트
- **Locked:** `#A8A29E` (stone-400) — 잠긴 카테고리/용어

## Spacing
- **Base unit:** 4px
- **Density:** Comfortable — 학습 앱은 넉넉한 여백이 집중력을 높임
- **Scale:**
  - 2xs: 2px
  - xs: 4px
  - sm: 8px
  - md: 16px
  - lg: 24px
  - xl: 32px
  - 2xl: 48px
  - 3xl: 64px

## Layout
- **Approach:** Grid-disciplined — 예측 가능한 정렬, 일관된 여백
- **Grid:** 모바일 1col / 태블릿 2col / 데스크톱 3col (sidebar+main+detail)
- **Max content width:** 1280px (데스크톱), 모바일은 전체 너비 - padding 16px
- **Content alignment:** 좌측 정렬 기본 (R14). 중앙 정렬은 퀴즈 결과 숫자, 빈 상태 아이콘에만.
- **Border radius:**
  - sm: 4px — 버튼 내부 요소, 태그
  - md: 8px — 버튼, 입력 필드
  - lg: 12px — 카드, 컨테이너
  - full: 9999px — 진행도 바, 배지
- **Card style:** 1px solid border (#E7E5E4) + white background. 그림자 없음. 카드 안에 카드 금지 (R15).

## Navigation
- **Bottom tab bar:** 4탭 (홈, 카테고리, 진도, 설정)
- **Tab bar style:** border-top 1px, 아이콘 + 라벨, 선택된 탭은 primary 색상
- **상단 바:** 좌측 뒤로가기 + 중앙 타이틀 + 우측 액션 (검색 등)
- **Tab bar 디자인:** 아이콘 위에 2px 활성 인디케이터 라인 (dot이 아닌 line)

## Icons
- **Library:** Lucide React — 일관된 스트로크 아이콘 (R11, R13 준수)
- **Stroke width:** 1.5px (기본보다 약간 가늘게 — 학술적 느낌)
- **Size scale:** sm=16px, md=20px, lg=24px, xl=32px
- **이모지 사용 금지** (R13). 카테고리 구분은 Lucide 아이콘으로.

## Category Icons (Lucide)
| 카테고리 | 아이콘 |
|---------|--------|
| 경제학 기초 원리 | Blocks |
| 시장과 가격 | BarChart3 |
| 소비자와 생산자 | Handshake |
| 시장 실패와 정부 | Scale |
| 국민경제 측정 | Ruler |
| 경제 성장과 생산성 | TrendingUp |
| 화폐와 금융 | Landmark |
| 거시경제 변동 | Waves |
| 거시경제 정책 | Building2 |
| 국제경제 | Globe |

## Motion
- **Approach:** Minimal-functional — 학습에 방해되는 애니메이션 배제
- **Easing:** enter=ease-out, exit=ease-in, move=ease-in-out
- **Duration:** micro=100ms, short=200ms, medium=300ms
- **Allowed animations:**
  - 화면 전환: 즉시 (애니메이션 없음). 라우트 변경은 빠르게.
  - 퀴즈 정답/오답: scale(0.95→1) + 배경색 변화 (200ms)
  - 진행도 바: width transition (300ms ease-out)
  - 토스트 알림: 위에서 슬라이드 (200ms)
  - 모달: opacity 0→1 + scale 0.95→1 (200ms)
- **금지:** fadeInUp 반복 (R4), 장식적 파티클 (R7), backdrop-blur 남발 (R6)

## Button Styles
- **Primary:** bg-teal-600 text-white rounded-lg px-5 py-2.5 font-medium. Hover: bg-teal-700.
- **Secondary:** border border-stone-300 text-stone-700 rounded-lg px-5 py-2.5 font-medium. Hover: bg-stone-50.
- **Ghost/Tertiary:** text-teal-600 font-medium. 텍스트만. Hover: underline.
- **Danger:** bg-red-600 text-white rounded-lg. 데이터 초기화 등.
- **Disabled:** bg-stone-200 text-stone-400 cursor-not-allowed.

## Mastery Status Indicators
이모지 대신 SVG/아이콘+색상 조합:
| 상태 | 시각 표현 |
|------|---------|
| 미학습 | 빈 원 (stroke-stone-300) |
| 읽기 완료 | 반 채운 원 (fill-teal-200, stroke-teal-500) |
| 퀴즈 통과 | 거의 채운 원 (fill-teal-400, stroke-teal-600) |
| 마스터 | 체크마크 원 (fill-teal-600, stroke-white check) |
| 잠금 | 자물쇠 아이콘 (stroke-stone-400) |

## DESIGN_RULES.md Checklist
```
[x] R1  — 기존 앱과 다른 색상 팔레트 (teal + amber + stone)
[x] R2  — 그라디언트 텍스트 없음. 텍스트는 단색.
[x] R3  — 135deg 그라디언트 미사용. 그라디언트 자체를 거의 쓰지 않음.
[x] R4  — fadeInUp 미사용. 즉시 표시 기본 + scale/slide 제한적 사용.
[x] R5  — 4탭 구조에 맞게 바텀 탭바 사용, 고유한 인디케이터 디자인.
[x] R6  — backdrop-blur 미사용 (라이트 모드에서 불필요).
[x] R7  — 장식 파티클/오브 없음. 여백이 디자인.
[x] R8  — Space Grotesk + Pretendard 고유 조합.
[x] R9  — 라이트 모드 전용.
[x] R10 — border-radius 위계: 4px/8px/12px/9999px.
[x] R11 — Lucide React 아이콘 통일.
[x] R12 — font-weight 위계: H1=700, H2=600, H3=500, body=400.
[x] R13 — 이모지 아이콘 미사용. 모두 Lucide SVG.
[x] R14 — 좌측 정렬 기본. 중앙 정렬은 결과 숫자/빈 상태만.
[x] R15 — 카드 네스팅 금지. 1단계 카드만.
[x] R16 — Primary(솔리드)/Secondary(아웃라인)/Ghost(텍스트) 버튼 위계.
[x] R17 — 로딩 시 프로그레스 바 사용 (스피너+텍스트 X).
[x] R18 — 카테고리 카드별 좌측 border accent로 시각 구분.
[x] R19 — 저장/완료 시 토스트 피드백.
[x] R20 — 선행 용어→현재 용어→후행 용어 순서 (인과 순서).
[x] R21 — 빈 상태에 "첫 용어 학습하기" CTA 제공.
```

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-03-23 | Teal + Amber + Stone 팔레트 | 금융/경제 = 녹색 계열 + 학술적 따뜻함. #fbbc00 복붙 회피. |
| 2026-03-23 | Space Grotesk + Pretendard | 기하학적 영문 + 깔끔한 한글. 기존 앱 폰트와 겹치지 않음. |
| 2026-03-23 | 라이트 모드 전용 | R9 다크모드 탈피 + 교육 앱은 밝은 환경이 가독성 우수. |
| 2026-03-23 | Lucide 아이콘 | R13 이모지 금지 + R11 아이콘 다양화. 가벼운 스트로크 스타일. |
| 2026-03-23 | 그림자 없는 border 카드 | Flat + border 스타일이 Industrial/Utilitarian 방향과 일치. |
| 2026-03-23 | Minimal-functional 모션 | 학습 앱에서 애니메이션은 방해. 즉시 표시 기본. |
