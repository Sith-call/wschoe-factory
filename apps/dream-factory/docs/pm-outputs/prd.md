# 꿈 공장 (Dream Factory) -- PRD

## 앱 개요

꿈의 핵심 요소(장소, 날씨, 인물, 오브젝트)를 시각적으로 조합하면 타로 카드 스타일의 "꿈 해석 카드"를 생성해주는 꿈 일기 앱. 기록이 쌓이면 반복 상징과 감정 패턴을 분석해주는 대시보드를 제공하며, 몽환적인 밤하늘 UI와 공유 가능한 카드 디자인으로 바이럴 잠재력을 확보한다.

## 타깃 유저

- 20~30대, 꿈에 관심 있는 한국어 사용자
- 타로/심리 테스트 등 자기 탐색 콘텐츠를 즐기는 사람
- "어젯밤 꿈 얘기" 를 친구와 나누는 것을 좋아하는 사람
- 모바일 우선 사용 환경

## 핵심 가치

1. **시각적 꿈 기록**: 텍스트 대신 아이콘 조합으로 빠르게 꿈을 기록
2. **의미 있는 해석**: 상징 해설 기반의 재미있는 꿈 해석 카드 생성
3. **패턴 발견**: 반복되는 상징과 감정을 시각화해 무의식 탐색
4. **공유와 바이럴**: 타로 카드 스타일의 해석 카드 -> SNS 공유

## MVP 기능 범위

### In-scope
- 4단계 꿈 기록 플로우 (장면 구성 -> 감정/선명도 -> 분석 -> 해석 카드)
- Scene Builder: 장소(8), 날씨(6), 인물(7, 멀티셀렉트), 오브젝트(8, 멀티셀렉트)
- 감정 멀티셀렉트 (1~2개) + 선명도 슬라이더 (5단계)
- 조합 기반 해석 카드 생성 (제목, 키워드, 해석 텍스트, 상징 해설)
- 감정별 그라디언트 배경의 공유 카드
- 꿈 갤러리 (2열 그리드, 필터)
- 패턴 대시보드 (빈도 캘린더, 상징 TOP 5, 감정 도넛, 선명도 추이)
- 꿈별 추가 메모 기능
- 데모 모드 (시드 데이터 5일치)

### Out-of-scope (v2)
- 서버/DB 연동
- 사용자 인증
- AI 기반 꿈 해석
- 푸시 알림 ("꿈 기록 리마인더")
- 다른 사용자 꿈과 비교
- 꿈 태그 검색
- 반복 꿈 알림

## 스크린 인벤토리

| # | 화면 | 목적 | 주요 인터랙션 |
|---|------|------|---------------|
| 1 | IntroScreen | 앱 소개 + 진입점 | CTA 버튼, 갤러리 링크, 최근 꿈 프리뷰 |
| 2 | SceneBuilderScreen | 꿈 장면 시각적 조합 | 4단계 탭 (장소/날씨/인물/오브젝트), 멀티셀렉트, 실시간 미리보기 |
| 3 | EmotionScreen | 감정+선명도 입력 | 멀티셀렉트 (1~2개), 슬라이더, 텍스트 입력 |
| 4 | AnalysisScreen | 분석 로딩 연출 | 별 파티클 + 수정구슬 애니메이션, 자동 전환 3초 |
| 5 | InterpretationScreen | 꿈 해석 카드 결과 | 타로 카드 UI, 상징 해설, 저장/공유/다시 꾸기 |
| 6 | ShareScreen | 공유용 카드 뷰 | 이미지 저장, 카카오 공유, 링크 복사 |
| 7 | GalleryScreen | 꿈 카드 갤러리 | 2열 그리드, 필터 칩, 카드 탭 |
| 8 | PatternScreen | 꿈 패턴 대시보드 | 도트 캘린더, 바 차트, 도넛 차트, 라인 차트 |

## 기술 제약

| 항목 | 사양 |
|------|------|
| 프레임워크 | React 18 + TypeScript |
| 빌드 | Vite |
| 스타일링 | Tailwind CSS (CDN) |
| 상태 관리 | React Context 또는 zustand |
| 데이터 저장 | localStorage only (서버 없음) |
| 뷰포트 | 430px 모바일 고정 폭 |
| 폰트 | Noto Serif KR (헤드라인/해석), Noto Sans KR (본문), Cormorant Garamond (영문 장식) |
| 아이콘 | Material Symbols Outlined |
| 차트 | 직접 구현 (SVG) 또는 경량 라이브러리 (recharts) |
| 데모 모드 | 필수 -- DB 없이 전체 플로우 체험 가능 |

## 데이터 모델

```typescript
// 꿈 장면 요소
type PlaceType = 'forest' | 'ocean' | 'city' | 'school' | 'home' | 'sky' | 'underground' | 'unknown';
type WeatherType = 'clear' | 'cloudy' | 'rain' | 'snow' | 'fog' | 'storm';
type CharacterType = 'self' | 'family' | 'lover' | 'friend' | 'stranger' | 'celebrity' | 'animal';
type ObjectType = 'water' | 'fire' | 'mirror' | 'key' | 'stairs' | 'clock' | 'flower' | 'door';
type DreamEmotionType = 'peace' | 'fear' | 'confusion' | 'joy' | 'sorrow' | 'anger' | 'surprise' | 'longing';

// 꿈 기록
interface DreamRecord {
  id: string;
  date: string;                          // ISO date
  scene: {
    place: PlaceType;
    weather: WeatherType;
    characters: CharacterType[];         // 1~3명
    objects: ObjectType[];               // 1~3개
  };
  emotions: DreamEmotionType[];          // 1~2개
  vividness: 1 | 2 | 3 | 4 | 5;        // 선명도
  memo?: string;                         // 초기 한줄 메모 (80자)
  journalMemo?: string;                  // 추가 일기 메모 (200자)
  interpretation: {
    title: string;                       // 꿈 유형명 (예: "안개 속 열쇠의 꿈")
    keywords: string[];                  // 키워드 3개
    text: string;                        // 해석 텍스트 (3~4문장)
    symbolReadings: SymbolReading[];     // 오브젝트별 상징 해설
    fortune: string;                     // 운세 한마디
  };
  gradientType: string;                  // 감정 기반 그라디언트 키
}

interface SymbolReading {
  symbol: ObjectType | PlaceType;
  meaning: string;                       // 1줄 상징 의미
}

// localStorage 최상위 구조
interface DreamFactoryState {
  dreams: DreamRecord[];                 // 전체 꿈 기록
  lastVisit: string;                     // ISO date
  demoSeeded: boolean;                   // 시드 데이터 주입 여부
}
```

## 해석 로직 개요

### 카드 제목 생성
```
[날씨 수식어] + [장소 명사] + "에서" + [오브젝트/인물 기반 서술]
예: "비 내리는 숲에서 찾은 열쇠"
    "맑은 하늘 위 낯선 사람과의 만남"
    "안개 낀 도시의 거울 속 나"
```

### 키워드 매핑
- 장소별 키워드 1개 (예: 숲=#성장, 바다=#무의식)
- 오브젝트별 키워드 1개 (예: 열쇠=#기회, 거울=#자아)
- 감정별 키워드 1개 (예: 평화=#안정, 공포=#경고)

### 해석 텍스트 생성
- `장소 x 날씨 x 주요감정` 조합으로 기본 해석 프레임 선택 (8x6x8 = 384 조합, 축약 매핑 약 50개)
- 오브젝트와 인물에 따른 세부 문장 삽입
- 선명도에 따른 강조 수준 조정

### 패턴 인사이트 규칙
- 특정 오브젝트 3회 이상 -> "자주 등장하는 상징" 인사이트
- 동일 감정 5회 이상 -> "반복 감정 패턴" 인사이트
- 선명도 평균 4 이상 -> "선명한 꿈꾸는 사람" 인사이트
- 장소 편중 -> "무의식이 자주 가는 장소" 인사이트

## 성공 지표 (데모 기준)

| 지표 | 목표 |
|------|------|
| 플로우 완주율 | Intro -> Interpretation 까지 85% 이상 |
| 갤러리 재방문율 | 해석 후 갤러리 탐색 50% 이상 |
| 공유 시도율 | ShareScreen 진입 30% 이상 |
| 해석 다양성 체감 | 요소 조합 변경 시 다른 해석 확인 가능 |
| 패턴 탐색 흥미 | 데모 시드 데이터로 대시보드 기능 확인 가능 |
| 로딩 시간 | 첫 화면 표시 < 2초 (Vite dev 기준) |
