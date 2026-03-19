# 소비유형 테스트 앱 — User Stories

## Epic: 소비 심리 테스트 체험

### US-001: 테스트 시작
**As a** 앱인토스 사용자
**I want to** 소비유형 테스트가 무엇인지 한눈에 파악하고 시작할 수 있게
**So that** 재미있는 심리 테스트를 통해 나의 소비 성향을 알 수 있다

**Acceptance Criteria:**
- [ ] 앱 타이틀 "당신의 소비 DNA는?" 표시
- [ ] 8가지 소비 유형 이모지 프리뷰 표시
- [ ] "테스트 시작하기" CTA 버튼으로 즉시 시작 가능
- [ ] 소요 시간 (1분), 문항 수 (10개) 안내

**Screen:** IntroScreen
**Stitch Screen ID:** ebad1ef9f1714824bdc19c7c36e64daa

---

### US-002: 질문 응답
**As a** 테스트 참여자
**I want to** 10개의 일상 소비 상황 질문에 답할 수 있게
**So that** 나의 소비 패턴을 반영한 정확한 결과를 받을 수 있다

**Acceptance Criteria:**
- [ ] 현재 진행 상황 (n/10) 프로그레스 바 표시
- [ ] 질문 번호 뱃지 (Q1~Q10)
- [ ] 4개 선택지 카드 — 탭하면 다음 질문으로 전환
- [ ] 부드러운 페이드 전환 애니메이션

**Screen:** QuestionScreen
**Stitch Screen ID:** 499a79fc77ea478d9f87f699afdabcae

---

### US-003: 결과 분석 대기
**As a** 테스트 완료자
**I want to** AI가 결과를 분석하는 과정을 시각적으로 볼 수 있게
**So that** 결과에 대한 기대감이 높아진다

**Acceptance Criteria:**
- [ ] 로딩 스피너 + 분석 이모지
- [ ] 3단계 텍스트 전환 ("분석 중..." → "해독 중..." → "거의 다 됐어요!")
- [ ] 프로그레스 도트 3개
- [ ] 약 2.4초 후 자동 결과 화면 전환

**Screen:** LoadingScreen

---

### US-004: 결과 확인 및 공유
**As a** 테스트 완료자
**I want to** 나의 소비 유형 결과를 확인하고 친구에게 공유할 수 있게
**So that** 재미있는 결과를 공유하며 바이럴 효과를 만들 수 있다

**Acceptance Criteria:**
- [ ] 유형 이모지 + 타이틀 (예: "플렉스 대장") 강조 카드
- [ ] 유형별 고유 컬러 그라디언트 배경
- [ ] 3가지 소비 특성 리스트
- [ ] 상위 4개 유형 점수 차트
- [ ] 카카오톡 공유 버튼
- [ ] 다시 테스트하기 버튼

**Screen:** ResultScreen

---

## Screen Flow
```
US-001 (IntroScreen)
  ↓ [테스트 시작하기]
US-002 (QuestionScreen × 10)
  ↓ [마지막 질문 응답]
US-003 (LoadingScreen)
  ↓ [2.4초 자동 전환]
US-004 (ResultScreen)
  ↓ [다시 테스트하기]
US-001 (IntroScreen)
```

## Stitch Project Reference
- **Project**: `projects/3938468870591541410`
- **Title**: 소비유형 테스트 앱 — Spend Type Quiz
