# Argue Gym — 혼자 하는 토론 연습장

주장 한 문장을 던지면 앱이 반대 입장 3장을 건네고, 재반박을 써내려가며 내 논리의 약점을 확인하는 훈련 도구.

데이터·감정·원칙·사례 4종 근거 유형으로 반론이 분류되어 있어, 세션이 끝나면 어떤 유형의 논거가 비었는지 리포트로 돌려준다.

## 스택

- Vite 5 + React 18 + TypeScript (strict)
- 라우팅 없는 단일 상태 머신 (`src/App.tsx`)
- 스타일: 디자인 시스템을 CSS 변수로 이식 (`src/styles/global.css`)
- 데이터: 64장 정적 반론 덱 (`src/data/rebuttals.json`)
- 저장: `localStorage`, 가입·서버 없음

## 실행

```bash
npm install
npm run dev          # http://localhost:5191/
npm run build        # tsc + vite build
```

## 구조

```
src/
├── main.tsx / App.tsx       # 엔트리 + 상태 머신
├── styles/global.css        # 디자인 시스템 (paper-cream + ink-indigo)
├── data/rebuttals.json      # 64장 반론 덱
├── lib/
│   ├── types.ts             # Category / ArgumentType / RebuttalCard / Session
│   ├── matcher.ts           # 키워드 + title/body 하이브리드 스코어링
│   ├── report.ts            # 세션 리포트 + 근거 유형 기반 코멘트
│   └── storage.ts           # localStorage 세션 영속
└── screens/
    ├── Landing.tsx          # 홈 (최근 훈련, 샘플 모드)
    ├── ClaimInput.tsx       # 주장 입력 + 카테고리
    ├── Session.tsx          # 카드 3장 + 재반박 작성
    ├── Report.tsx           # 리포트 + 복기 (readonly 모드)
    └── LogArchive.tsx       # 훈련 일지
```

## 디자인 시그니처

- **잉크 인디고 + 페이퍼 크림**: `#2E2A5A` 텍스트, `#F7F2E8` 배경
- **IBM Plex Sans KR + Serif + Mono** 3종 혼성. Serif는 숫자 지표와 주장 인용구에만.
- **근거 유형 4색 border-left 액센트**: DATA 블루, EMOTION 핑크, PRINCIPLE 브라운, CASE 그린
- 라이트 모드, 바텀 탭바 없음, 중앙 정렬 없음 (리포트 숫자만 예외), 이모지 없음

## 데모 모드

- DB/서버 없음. 반론 덱은 빌드에 번들링됨.
- 샘플 주장으로 "체험하기" → 1회 플로우 완주 가능.
- 세션은 localStorage에만 저장, 브라우저 전환 시 초기화.

## Ralph 루프 검증

`docs/ralph-loop/` 아래에 iteration별 페르소나 평가 기록이 있다. 최종 수렴 결과:

| 페르소나 | 관점 | 총점 |
|---|---|---|
| P1 송지우 (마케터) | 실용 · 속도 | 86.0 |
| P2 이태훈 (로스쿨) | 구조 · 깊이 | 86.6 |
| P3 박수연 (에세이 작가) | 감성 · 선택권 | 85.0 |

Iteration 2에서 매칭 로직 + readonly 복기 섹션 + 코멘트 톤 교체로 전원 80%+ 달성.

## 알려진 제약

- iOS Safari 100vh 미검증
- 자동 임시저장 없음 (뒤로가기 시 현재 textarea 휘발)
- 반론 덱이 64장으로 제한 — 완전히 새로운 주제는 키워드 점수 0으로 떨어져 일반 카드가 제시될 수 있음
