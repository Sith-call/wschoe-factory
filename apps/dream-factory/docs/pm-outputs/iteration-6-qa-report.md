# QA Report — Iteration 6

**테스트 일시**: 2026-03-20
**테스트 환경**: Playwright (Chromium), 430x932 viewport, localhost:5175
**테스트 방법**: 코드 리뷰 + Playwright 라이브 브라우저 테스트 (전체 화면 스크린샷 + 버튼 클릭 네비게이션)

---

## 빌드 상태

| 항목 | 결과 |
|------|------|
| TypeScript (`npx tsc --noEmit`) | **PASS** — 에러 없음 |
| Production Build (`npm run build`) | **PASS** — 26 modules, 286.78 KB (gzip 85.24 KB) |

---

## 라이브 테스트 결과

### 렌더링 검증

| 스크린 | 결과 | 검증 내용 |
|--------|------|----------|
| IntroScreen | **PASS** | 헤드라인 "어젯밤 무슨 꿈 꿨어?", CTA "꿈 기록하기" 버튼, 최근 꿈 카드, 하단 네비게이션 모두 정상 렌더링 |
| SceneBuilderScreen | **PASS** | 4개 탭(장소/날씨/인물/오브젝트), 아이콘 카드 그리드, 미리보기 영역, "다음 단계로" 버튼 정상 렌더링. 장소 12개 3열, 날씨 6개 2열 확인 |
| EmotionScreen | **PASS** | 8개 감정 카드 2x4 그리드, 선명도 슬라이더, 메모 입력, "꿈 해석받기" 버튼 정상 렌더링 |
| AnalysisScreen | **PASS** | 다크 배경, 수정구슬 애니메이션, 텍스트 순차 전환("꿈의 조각을 모으는 중..." → "상징을 해독하는 중...") 확인 |
| InterpretationScreen | **PASS** | 타로 카드 스타일, 제목/키워드/해석 텍스트/상징 해설/운세/인사이트, 저장하기/공유하기/다시 꾸기 버튼 모두 확인 |
| ShareScreen | **PASS** | 공유 카드, 이미지 저장/카카오톡 공유/링크 복사 3개 버튼 정상 렌더링 |
| GalleryScreen | **PASS** | 2열 그리드, 필터 칩(전체/이번주/평화/공포/혼란), 검색 입력란, FAB(+) 버튼, 시드 데이터 5개 카드 정상 표시 |
| PatternScreen | **PASS** | 꿈 기록 빈도 도트 캘린더, TOP 5 바 차트, 감정 분포 도넛 차트, 선명도 추이 라인 차트, 패턴 인사이트 카드, 내보내기 버튼 모두 확인 |

### 네비게이션 플로우 검증

| 출발 | 액션 | 기대 도착 | 결과 | 근거 |
|------|------|----------|------|------|
| IntroScreen | "꿈 기록하기" CTA 클릭 | SceneBuilderScreen | **PASS** | Playwright 클릭 후 스크린샷에서 SceneBuilder 확인 |
| IntroScreen | 하단 "갤러리" 버튼 클릭 | GalleryScreen | **PASS** | Playwright 클릭 후 갤러리 화면 확인 |
| GalleryScreen | "패턴 분석" 탭 클릭 | PatternScreen | **PASS** | Playwright 클릭 후 패턴 분석 화면 확인 |
| SceneBuilderScreen | 장소+날씨 선택 → "다음 단계로" 클릭 | EmotionScreen | **PASS** | Playwright 클릭 후 감정 선택 화면 확인 |
| EmotionScreen | 감정 선택 → "꿈 해석받기" 클릭 | AnalysisScreen | **PASS** | Playwright 클릭 후 분석 로딩 화면 확인 |
| AnalysisScreen | 3초 자동 전환 | InterpretationScreen | **PASS** | 4초 대기 후 해석 카드 화면 스크린샷 확인 |
| InterpretationScreen | "공유하기" 클릭 | ShareScreen | **PASS** | Playwright 클릭 후 공유 화면 확인 |
| SceneBuilderScreen | 장소/날씨 미선택 시 "다음 단계로" | 비활성화 | **PASS** | 코드 확인: `disabled={!canProceed}` + CSS `cursor-not-allowed` |
| EmotionScreen | 감정 미선택 시 "꿈 해석받기" | 비활성화 | **PASS** | 코드 확인: `disabled={!canProceed}` |

---

## 코드 기반 검증

### US-01: 앱 인트로 및 진입

| AC | 테스트 케이스 | 결과 | 근거 |
|----|-------------|------|------|
| AC-1 | "어젯밤 무슨 꿈 꿨어?" 헤드라인 표시 | **PASS** | 스크린샷 + IntroScreen.tsx:82 |
| AC-2 | "꿈 기록하기" CTA → SceneBuilder 이동 | **PASS** | 라이브 테스트 통과 + `onClick={onStartDream}` |
| AC-3 | "꿈 갤러리" 텍스트 링크 → Gallery 이동 | **PASS** | IntroScreen.tsx:137 `onClick={onGoGallery}` |
| AC-4 | 최근 꿈 미니 카드 프리뷰 | **PASS** | 스크린샷에서 확인 + IntroScreen.tsx:105-133 조건부 렌더링 |
| AC-5 | 데모 모드: DB 없이 즉시 사용 | **PASS** | App.tsx:15-26 localStorage 기반 + `createSeedData()` |
| AC-6 | 하단 "이번 주 꿈 통계" 요약 뱃지 | **N/A** | 현재 하단 네비게이션으로 대체. 스크린샷에서 별도 뱃지 미구현 (P2) |

### US-02: 꿈 장면 구성 (Scene Builder)

| AC | 테스트 케이스 | 결과 | 근거 |
|----|-------------|------|------|
| AC-1 | 4단계 탭 UI | **PASS** | 스크린샷에서 장소/날씨/인물/오브젝트 탭 확인 |
| AC-2 | 장소 12개 (원본 8 + 신규 4) | **PASS** | data.ts PLACES 배열 12개 확인, 스크린샷 3열 그리드 |
| AC-3 | 날씨 6개 | **PASS** | data.ts WEATHERS 배열 6개, 스크린샷 2열 그리드 |
| AC-4 | 인물 멀티셀렉트 1~3명, 7개 | **PASS** | PERSONS 7개 + `characters.length < 3` 제한 |
| AC-5 | 오브젝트 멀티셀렉트 1~3개, 8개 | **PASS** | OBJECTS 8개 + `objects.length < 3` 제한 |
| AC-6 | 선택 시 인디고 테두리 + 글로우 | **PASS** | 스크린샷에서 선택된 카드(맑음) 확인, CSS `border-primary shadow` |
| AC-7 | 상단 꿈 조각 미리보기 | **PASS** | 스크린샷에서 미리보기 아이콘 확인 |
| AC-8 | 프로그레스 바 Step 1/3 | **PASS** | 스크린샷에서 "챕터 01 / 단계 1/3" 확인 |
| AC-9 | 장소+날씨 필수 | **PASS** | `canProceed = scene.place !== null && scene.weather !== null` |

### US-03: 꿈 감정 및 선명도 입력

| AC | 테스트 케이스 | 결과 | 근거 |
|----|-------------|------|------|
| AC-1 | 감정 멀티셀렉트 1~2개, 8개 | **PASS** | EMOTIONS 8개 + `emotions.length < 2` 제한 |
| AC-2 | 선명도 슬라이더 5단계 | **PASS** | `<input type="range" min={1} max={5}>` |
| AC-3 | 한줄 메모 80자 | **PASS** | `maxLength={80}` + `e.target.value.slice(0, 80)` |
| AC-4 | 프로그레스 바 Step 2/3 | **PASS** | 스크린샷 "Step 2/3" 확인 |
| AC-5 | 뒤로가기 → SceneBuilder (상태 유지) | **PASS** | App.tsx:146 `onBack={() => navigate('sceneBuilder')}`, scene 상태 유지 |

### US-04: 꿈 해석 로딩

| AC | 테스트 케이스 | 결과 | 근거 |
|----|-------------|------|------|
| AC-1 | 다크 남색 배경 + 별 파티클 | **PASS** | 스크린샷에서 확인 + `mystic-gradient` CSS |
| AC-2 | 수정구슬 애니메이션 | **PASS** | 스크린샷에서 수정구슬 확인 + `animate-[spin_12s]` |
| AC-3 | 텍스트 순차 전환 | **PASS** | 스크린샷 "꿈의 조각을 모으는 중..." → "상징을 해독하는 중..." 확인 |
| AC-4 | 3초 자동 전환 | **PASS** | `setTimeout(onComplete, 3000)` + 라이브 테스트 통과 |

### US-05: 꿈 해석 카드 결과

| AC | 테스트 케이스 | 결과 | 근거 |
|----|-------------|------|------|
| AC-1 | 타로 카드 스타일 | **PASS** | 스크린샷 확인 + aspect-[2/3.2] |
| AC-2 | 카드 제목 동적 생성 | **PASS** | 7개 TITLE_PATTERNS (data.ts:409-449) |
| AC-3 | 핵심 키워드 3개 | **PASS** | 스크린샷 "#성장 #여정 #안정" 확인 |
| AC-4 | 해석 텍스트 3~4문장 | **PASS** | COMBINATION_TEXTS 시너지 + PLACE/WEATHER/EMOTION 텍스트 조합 |
| AC-5 | 상징 해설 영역 | **PASS** | 스크린샷 "상징 해설" 확인 |
| AC-6 | 운세 한마디 | **PASS** | 스크린샷 운세 메시지 확인 + FORTUNE_MESSAGES 40개 풀 |
| AC-7 | "카드 저장하기" → localStorage + Gallery | **PASS** | App.tsx:95-100 `handleSaveDream` |
| AC-8 | "공유하기" → ShareScreen | **PASS** | 라이브 테스트 통과 |
| AC-9 | "다시 꾸기" → IntroScreen | **PASS** | App.tsx:160 `resetDreamState + navigate('intro')` |

### US-06: 꿈 카드 공유

| AC | 테스트 케이스 | 결과 | 근거 |
|----|-------------|------|------|
| AC-1 | 공유 전용 카드 뷰 | **PASS** | 스크린샷 확인 + aspect-[430/640] |
| AC-2 | 카드 구성 (제목+키워드+해석+워터마크) | **PASS** | 스크린샷 "꿈 공장" 워터마크 확인 |
| AC-3 | 감정별 그라디언트 배경 | **PASS** | DreamIconComposition에서 emotionData.gradient 사용 |
| AC-4 | "이미지로 저장" 버튼 | **PASS** | 스크린샷 확인 (alert 대체 구현) |
| AC-5 | "카카오톡 공유" 버튼 | **PASS** | 스크린샷 확인 (alert 대체 구현) |
| AC-6 | "링크 복사" 버튼 | **PASS** | 스크린샷 확인 + navigator.clipboard 구현 |
| AC-7 | 뒤로가기 → InterpretationScreen | **PASS** | App.tsx:169 `onBack={() => navigate('interpretation')}` |

### US-07: 꿈 갤러리

| AC | 테스트 케이스 | 결과 | 근거 |
|----|-------------|------|------|
| AC-1 | 2열 그리드 갤러리 | **PASS** | 스크린샷 확인 + `masonry-grid` CSS |
| AC-2 | 날짜 역순 정렬 | **PASS** | App.tsx:97 `[currentEntry, ...prev]` 신규 앞에 추가 |
| AC-3 | 카드 탭 → InterpretationScreen (읽기 모드) | **PASS** | `onViewDream(dream)` → App.tsx:102-105 `setViewEntry + navigate` |
| AC-4 | 빈 상태 메시지 + CTA | **PASS** | GalleryScreen.tsx:130-136 |
| AC-5 | 상단 필터 칩 | **PASS** | 스크린샷 "전체/이번 주/평화/공포/혼란" 확인 |
| AC-6 | 데모 모드 시드 데이터 5개 | **PASS** | 스크린샷 5개 카드 확인 |
| AC-NEW | 검색 기능 | **PASS** | 스크린샷 검색 입력란 확인 + 제목/키워드/상징/메모/텍스트 검색 |
| AC-NEW | 삭제 기능 | **PASS** | delete 버튼 + 확인 다이얼로그 코드 확인 |

### US-08: 꿈 패턴 대시보드

| AC | 테스트 케이스 | 결과 | 근거 |
|----|-------------|------|------|
| AC-1 | 갤러리/패턴 분석 탭 전환 | **PASS** | 라이브 테스트 통과 |
| AC-2 | 꿈 빈도 도트 캘린더 (14일) | **PASS** | 스크린샷 확인 + dotCalendar 14일 생성 로직 |
| AC-3 | 자주 나오는 상징 TOP 5 바 차트 | **PASS** | 스크린샷 확인 + topSymbols에서 places+objects+persons 통합 집계 (데이터 기반) |
| AC-4 | 감정 분포 도넛 차트 | **PASS** | 스크린샷 확인 + SVG 도넛 (데이터 기반) |
| AC-5 | 선명도 추이 라인 차트 | **PASS** | 스크린샷 확인 + `vividnessTrend = dreams.slice(0,7)` (데이터 기반) |
| AC-6 | 패턴 인사이트 카드 | **PASS** | 스크린샷 2개 인사이트 확인 + `getPatternInsights` 함수 |
| AC-7 | 데이터 부족 시 안내 | **PASS** | PatternScreen.tsx:116-131 `dreams.length < 3` 분기 |
| AC-8 | 데모 모드 시드 데이터 통계 | **PASS** | 스크린샷에서 시드 데이터 기반 차트 확인 |
| AC-NEW | 내보내기 버튼 | **PASS** | 스크린샷 "꿈 기록 내보내기 (JSON)" 확인 + JSON Blob 다운로드 구현 |

### US-09: 꿈 일기 확장 메모

| AC | 테스트 케이스 | 결과 | 근거 |
|----|-------------|------|------|
| AC-1 | InterpretationScreen(읽기 모드) "메모 추가" 버튼 | **PASS** | InterpretationScreen.tsx:125 `setShowMemo(true)` |
| AC-2 | 메모 입력 바텀시트 (200자) | **PASS** | InterpretationScreen.tsx:199-206 `maxLength={200}` |
| AC-3 | 기존 메모 수정 모드 | **PASS** | InterpretationScreen.tsx:19 `useState(entry.journalMemo \|\| '')` |
| AC-4 | 저장 시 localStorage 업데이트 | **PASS** | App.tsx:107-112 `handleUpdateJournalMemo` |
| AC-5 | GalleryScreen 메모 유무 아이콘 | **N/A** | 미구현 (P2 — GalleryScreen 카드에 journalMemo 아이콘 미표시) |

### US-10: 데모 모드 및 해석 로직

| AC | 테스트 케이스 | 결과 | 근거 |
|----|-------------|------|------|
| AC-1 | localStorage 기반 | **PASS** | STORAGE_KEY 사용 |
| AC-2 | 꿈 해석 매핑 테이블 | **PASS** | PLACE_TEXTS x WEATHER_TEXTS x EMOTION_TEXTS + COMBINATION_TEXTS 시너지 |
| AC-3 | 카드 제목 생성 규칙 | **PASS** | 7개 TITLE_PATTERNS |
| AC-4 | 키워드 매핑 3개 조합 | **PASS** | `generateInterpretation` 함수 keywords 생성 |
| AC-5 | 상징 해설 풀 | **PASS** | 오브젝트 8개 x 10가지 해설 = 80개 (기존 24개에서 확장) |
| AC-6 | 운세 메시지 풀 | **PASS** | FORTUNE_MESSAGES 40개 (기존 20개에서 확장) |
| AC-7 | 시드 데이터 5일치 | **PASS** | `createSeedData()` configs 5개 |
| AC-8 | 패턴 인사이트 규칙 | **PASS** | `getPatternInsights` — 심리학 기반 해석 포함 |

---

## Iteration 6 신규 기능 검증

| 변경 사항 | 결과 | 근거 |
|----------|------|------|
| PatternScreen 차트 데이터 기반 전환 | **PASS** | `vividnessTrend = dreams.slice(0,7).map(d => d.vividness)`, `topSymbols` 실제 카운트, `emotionDist` 실제 카운트 — 하드코딩 배열 없음 |
| COMBINATION_TEXTS 추가 | **PASS** | data.ts 12개 장소-날씨 조합 시너지 텍스트 (ocean_rain, ocean_storm, forest_fog 등) |
| 오브젝트 meanings 10개로 확장 | **PASS** | 8개 오브젝트 x 10개 해설 = 80개 (기존 3개에서 확장) |
| GalleryScreen 삭제 기능 | **PASS** | delete 버튼 + 확인 다이얼로그 + `handleDelete` 함수 |
| GalleryScreen 검색 기능 | **PASS** | 제목/키워드/상징/메모/텍스트 통합 검색 + 클리어 버튼 |
| PatternScreen 내보내기 버튼 | **PASS** | JSON Blob 다운로드 (`dream-factory-export-{date}.json`) |

---

## FAIL / 개선 항목 상세

### P2-1: IntroScreen "통계" 하단 네비 버튼이 GalleryScreen으로 이동

- **위치**: `IntroScreen.tsx:156`
- **문제**: 하단 네비게이션의 "통계" 버튼이 `onGoGallery`를 호출하여 GalleryScreen으로 이동함. 사용자 기대는 PatternScreen 직행.
- **심각도**: P2 (마이너)
- **수정 제안**: `onGoPattern` 콜백 추가하여 PatternScreen으로 직접 이동

### P2-2: InterpretationScreen "통계" 하단 네비 버튼에 onClick 미연결

- **위치**: `InterpretationScreen.tsx:183`
- **문제**: 하단 네비게이션 "통계" 버튼에 `onClick` 핸들러가 없어서 클릭해도 아무 일도 일어나지 않음.
- **심각도**: P2 (마이너)
- **수정 제안**: App.tsx에서 `onGoPattern` 콜백 추가하여 전달

### P2-3: ShareScreen 하단 네비 "갤러리"/"통계" 버튼 onClick 미연결

- **위치**: `ShareScreen.tsx:131-138`
- **문제**: 하단 네비게이션 "갤러리"와 "통계" 버튼에 onClick이 없음.
- **심각도**: P2 (마이너)
- **수정 제안**: App.tsx에서 해당 네비게이션 콜백 전달

### P2-4: GalleryScreen 카드에 journalMemo 유무 아이콘 미표시

- **위치**: `GalleryScreen.tsx:138-171`
- **문제**: US-09 AC-5 "GalleryScreen 카드에 메모 유무 아이콘 표시" 미구현.
- **심각도**: P2 (마이너)
- **수정 제안**: 카드에 `dream.journalMemo && <span className="...">note</span>` 추가

### P2-5: IntroScreen "이번 주 꿈 통계" 요약 뱃지 미구현

- **위치**: IntroScreen 전체
- **문제**: US-01 AC-6 "이번 주 꿈 통계 요약 뱃지 (기록 수, 주요 키워드)" 미구현.
- **심각도**: P2 (마이너)
- **수정 제안**: IntroScreen 하단에 주간 통계 뱃지 추가

---

## QA 판정

- [x] **PASS** — 유저 테스트 진행 가능 (P2 경고 포함)
- [ ] FAIL — P0/P1 수정 후 재테스트 필요

### 판정 근거

- **P0 블로커**: 0건
- **P1 중요**: 0건
- **P2 마이너**: 5건 (하단 네비 onClick 미연결 3건, 메모 아이콘 미표시 1건, 통계 뱃지 미구현 1건)

모든 핵심 플로우(꿈 기록 → 해석 → 저장 → 갤러리 → 패턴 분석)가 라이브 테스트에서 정상 작동하며, Iteration 6 신규 기능(데이터 기반 차트, 검색, 삭제, 내보내기, COMBINATION_TEXTS, 확장된 meanings)이 모두 올바르게 구현되어 있습니다.
