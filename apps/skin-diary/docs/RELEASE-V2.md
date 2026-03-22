# Skin Diary V2 — Release Summary

## Overview
피부 일지 V2: "깊이 있는 분석 + 습관 형성 + 공유"

## V2 New Features

### Pillar A: 깊이 있는 분석
- 부위별 트러블 추적 (턱선/이마/볼/코/전체)
- 3일 미니인사이트 (7일 대기 불필요)
- 키워드 2주 트렌드 시각화
- 제품 콤보 분석 (세럼A + 크림B 시너지)
- 주간 리포트 자동 생성
- 월간 캘린더 요약

### Pillar B: 습관 형성
- 생활 습관 프리셋 (고정 변수 — 매일 자동 표시)
- 커스텀 생활 습관 추가/삭제
- 밤→아침 기록 연결 메시지
- 마일스톤 배지 (7/14/30/60/100일)
- 기록률 시각화
- 축하 모달

### Pillar C: 소셜/공유
- 인사이트 카드 이미지 공유 (Canvas 기반)
- 주간 리포트 공유
- 아침 점수 공유 카드
- 앱 브랜딩 워터마크

### 기타 개선
- V1→V2 데이터 자동 마이그레이션
- CSV 내보내기 (Excel 호환)
- "변수" → "생활 습관" 용어 통일
- 시간대별 인사 메시지
- 제품 카테고리 아코디언 (최근 사용순 정렬)
- 인사이트 페이지 간소화 ("이번 주 핵심 발견" 우선)

## Design System
- **Paper & Petals** (Stitch MCP 생성)
- Primary: #855048 / #c2847a
- Background: #fdf8f4
- Fonts: Noto Serif KR (headings) + Manrope (body)

## Tech Stack
- React 18 + TypeScript + Vite
- Tailwind CDN
- localStorage (서버 없음)
- 256KB (gzip 72KB)

## Quality Metrics
- Ralph Loop: 4 iterations
- 3 personas satisfied (83.0% / 80.4% / 82.0%)
- 18 bugs fixed across iterations
- Build: 0 TypeScript errors

## Demo
```bash
cd apps/skin-diary && npm run dev
# → http://localhost:5186
# Settings → "데모 데이터 불러오기" toggle
```

## Stitch Project
- ID: 8132416417615825415
- Screens: Home, Night Log, Morning Log, Insights V2
