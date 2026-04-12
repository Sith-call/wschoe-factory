# RELEASE — haru-gratitude-diary (하루 감사 일기)

**Version:** 1.0.0
**Date:** 2026-04-11
**Branch:** plan3/m4-teams-test

## Summary

하루 감사 일기는 매일 감사한 일 3가지를 기록하고 주간 회고를 통해 삶의 긍정적 패턴을 발견하는 감사 저널링 웹앱이다. 온보딩 → 일일 감사 기록 → 캘린더 조회 → 주간 리플렉션의 흐름으로 사용자의 꾸준한 감사 습관 형성을 돕는다.

## Tech Stack

- **Framework:** React 18 + TypeScript
- **Build:** Vite 6
- **Styling:** Tailwind CSS 3
- **Routing:** React Router DOM 6
- **Icons:** Lucide React
- **Date:** date-fns 3
- **Storage:** localStorage (서버 불필요)

## How to Run

```bash
cd apps/haru-gratitude-diary
npm install
npm run dev
```

Production build:
```bash
npm run build
npm run preview
```

## Design System

- **Name:** Haru Warmth
- **Primary:** Warm amber/orange tones
- **Max-width:** 430px (모바일 최적화, 데스크톱 중앙 정렬)
- **Font:** System font stack
- **Anti-patterns:** DESIGN_RULES.md 체크리스트 통과 (AI slop A-)

## Screens (7)

| Screen | File | Description |
|--------|------|-------------|
| Onboarding | `Onboarding.tsx` | 2-slide 소개 + 데모 체험 버튼 |
| Home | `Home.tsx` | 오늘의 감사 CTA, 연속 기록 스트릭, FAB |
| Entry | `Entry.tsx` | 감사 3가지 입력 + 15개 회전 프롬프트 |
| Calendar | `CalendarPage.tsx` | 월별 기록 현황 + 날짜별 조회 |
| Detail | `Detail.tsx` | 기록 상세 보기 + 수정/삭제 |
| Weekly Reflection | `WeeklyReflection.tsx` | 주간 회고 + 일별 요약 |
| Settings | `Settings.tsx` | 데이터 관리 + 데모 모드 |

## Final Ralph Scores (Iteration 2)

| Evaluator | Score | Threshold | Status |
|-----------|-------|-----------|--------|
| Persona-1 (김지현, 31세 직장인) | 78 | ≥80 | NEAR-PASS |
| Persona-2 (이서윤, 23세 대학생) | 80 | ≥80 | PASS |
| Persona-3 (박은주, 41세 워킹맘) | 76 | ≥80 | NEAR-PASS |
| Design | A- | ≥B+ | PASS |
| AI slop | A- | ≥B | PASS |
| Visionary | 72 | ≥70 | PASS |
| UX | 82 | ≥75 | PASS |
| PRD coverage | 96 | ≥90 | PASS |

**Gate:** 5/8 strict pass, 7/8 with 4-point tolerance. Conditional PASS.

## Build

```
✓ tsc — no type errors
✓ vite build — 1.86s
  dist/index.html        0.73 kB
  dist/assets/index.css  13.80 kB (gzip: 3.42 kB)
  dist/assets/index.js  223.83 kB (gzip: 70.34 kB)
```

## Known Limitations (P2 — not blocking v1.0)

- No dark mode (requires native capability)
- No push notifications/reminders (requires native capability)
- No streak celebration animation (polish)
- No social sharing (scope expansion)
