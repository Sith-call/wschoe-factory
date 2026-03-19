# 소비유형 테스트 앱 — Design Specification

## Stitch Project
- **Project ID**: 3938468870591541410
- **Project Title**: 소비유형 테스트 앱 — Spend Type Quiz

## Design System

### Colors
| Token | Hex | Usage |
|-------|-----|-------|
| Primary | #6366F1 | Indigo — 메인 CTA, 프로그레스 |
| Secondary | #A855F7 | Purple — 그라디언트 보조 |
| Background | #F5F3FF → #FDF2F8 | Indigo-50 → Pink-50 그라디언트 |
| Surface | #FFFFFF | 카드 배경 |
| Text Primary | #111827 | 제목, 본문 |
| Text Secondary | #9CA3AF | 보조 텍스트 |
| Flex | #FF6B6B | 플렉스 대장 |
| Value | #4ECDC4 | 가성비 전사 |
| Aesthetic | #A88BEB | 감성 소비러 |
| Analyst | #45B7D1 | 데이터 분석가 |
| Giver | #FF8A65 | 관계 투자자 |
| Planner | #66BB6A | 미래 설계자 |
| Explorer | #FFD93D | 경험 수집가 |
| Stress | #FF7EB3 | 스트레스 해소러 |

### Typography
- **Font**: Apple SD Gothic Neo, Pretendard
- **Title**: 24-30px, Bold (700)
- **Body**: 15-16px, Medium (500)
- **Caption**: 11-12px, Regular (400)

### Components
- **Border Radius**: 16px (카드), 24px (버튼)
- **Shadow**: 0 4px 6px rgba(0,0,0,0.07)
- **Spacing**: 16px 기본 단위
- **Touch Target**: 최소 44px

## Screen Inventory

### 1. IntroScreen (랜딩)
- **Stitch Screen ID**: ebad1ef9f1714824bdc19c7c36e64daa
- **Purpose**: 앱 소개, 테스트 시작 유도
- **Key Elements**: 타이틀, 유형 이모지 프리뷰, CTA 버튼
- **Interaction**: CTA 탭 → QuestionScreen 전환

### 2. QuestionScreen (질문)
- **Purpose**: 10개 질문 순차 제시, 답변 수집
- **Key Elements**: 프로그레스 바, 질문 번호 뱃지, 질문 텍스트, 4개 선택지
- **Interaction**: 선택지 탭 → 페이드 전환 → 다음 질문
- **State**: currentIndex, scores 누적

### 3. LoadingScreen (분석 중)
- **Purpose**: 결과 계산 대기, 기대감 조성
- **Key Elements**: 스피너, 분석 중 텍스트 (3단계), 프로그레스 도트
- **Interaction**: 2.4초 후 자동 전환

### 4. ResultScreen (결과)
- **Purpose**: 소비 유형 결과 표시, 공유 유도
- **Key Elements**: 유형 카드 (그라디언트 배경), 특성 리스트, 점수 차트, 공유/재시작 버튼
- **Interaction**: 카카오 공유, 다시하기

## Screen Flow
```
IntroScreen → QuestionScreen (×10) → LoadingScreen → ResultScreen
                                                          ↓
                                                     IntroScreen (retry)
```
