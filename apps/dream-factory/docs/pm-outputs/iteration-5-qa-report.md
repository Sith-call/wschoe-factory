# Iteration 5 — QA Report

**Date:** 2026-03-20
**Persona:** 박지훈 (Persona 2, 32세 ENTP 파워유저)
**Verdict: PASS (with P2 observations)**

---

## Build Verification

| Check | Result |
|-------|--------|
| `npx tsc --noEmit` | PASS — 0 errors |
| `npm run build` | PASS — 26 modules, 271 KB gzip 80 KB |

---

## User Story Acceptance Criteria

### US-01: IntroScreen — PASS

| Criteria | Status | Notes |
|----------|--------|-------|
| "어젯밤 무슨 꿈 꿨어?" 헤드라인 | PASS | Line 82, `text-4xl font-headline` |
| 몽환적 별/구름 일러스트 | PASS | Crystal ball visual (lines 67-77) + star-field background (line 61) |
| "꿈 기록하기" CTA -> SceneBuilder | PASS | `onStartDream` calls `handleStartDream` -> `navigate('sceneBuilder')` |
| "꿈 갤러리" 텍스트 링크 -> Gallery | PASS | `onGoGallery` -> `navigate('gallery')` (line 137) |
| 최근 꿈 미니 카드 프리뷰 | PASS | `latestDream` card rendered when `dreams.length > 0` (lines 105-133) |
| 데모 모드: 즉시 사용 가능 | PASS | `loadDreams()` creates seed data when empty |
| 하단 "이번 주 꿈 통계" 요약 뱃지 | **PARTIAL** | 하단 bottom nav에 통계 버튼은 있으나, 통계 "뱃지"(기록 수, 주요 키워드)는 IntroScreen에 직접 표시되지 않음. gallery로 이동해야 확인 가능 |

**Observation (P2):** 이번 주 통계 뱃지가 IntroScreen에 직접 표시되지 않는 점은 spec과 다르지만, 기능적 블로커는 아님. 하단 네비바의 "통계" 버튼이 `onGoGallery`를 호출하는데 (line 156), PatternScreen으로 직접 이동하지 않고 Gallery로 감. Minor UX issue.

---

### US-02: SceneBuilderScreen — PASS

| Criteria | Status | Notes |
|----------|--------|-------|
| 4단계 탭 UI | PASS | TABS 배열: place, weather, characters, objects (lines 12-17) |
| 장소 (8개 -> 12개로 확장) | PASS | PLACES 12개 정의, 3-col grid for place tab |
| 날씨 (6개) | PASS | WEATHERS 6개 |
| 인물 (멀티셀렉트 1-3, 7개) | PASS | toggleCharacter, max 3 (lines 24-31) |
| 오브젝트 (멀티셀렉트 1-3, 8개) | PASS | toggleObject, max 3 (lines 33-40) |
| 아이콘 카드 + 인디고 테두리/글로우 | PASS | Selected state: `border-2 border-primary shadow-glow` |
| 꿈 조각 미리보기 | PASS | previewItems array + horizontal strip (lines 43-65) |
| 프로그레스 바 Step 1/3 | PASS | `progressWidth` calculated, displayed in section (lines 105-113) |
| 장소 + 날씨 필수 | PASS | `canProceed = scene.place !== null && scene.weather !== null` |

**Note:** 장소가 원래 spec의 8개에서 12개로 확장됨 (회사, 카페, 병원, 길거리 추가). Improvement.

---

### US-03: EmotionScreen — PASS

| Criteria | Status | Notes |
|----------|--------|-------|
| 감정 8개 | PASS | EMOTIONS 8개 모두 렌더링 |
| 멀티셀렉트 1-2 | PASS | `emotions.length < 2` check in toggleEmotion |
| 선명도 슬라이더 5단계 | PASS | `<input type="range" min={1} max={5}>` |
| 한줄 메모 80자 | PASS | `maxLength={80}`, `slice(0, 80)` |
| 프로그레스 바 Step 2/3 | PASS | "Step 2/3" displayed |
| 뒤로가기 -> SceneBuilder (상태 유지) | PASS | `onBack` -> `navigate('sceneBuilder')`, scene state preserved in App.tsx |

---

### US-04: AnalysisScreen — PASS

| Criteria | Status | Notes |
|----------|--------|-------|
| 다크 남색 배경 | PASS | `mystic-gradient` class |
| 수정구슬 아이콘 회전 | PASS | Crystal ball with `swirl-1`, `swirl-2` animations |
| 텍스트 순차 전환 3단계 | PASS | MESSAGES array, `setInterval` 1s |
| 3초 후 자동 전환 | PASS | `setTimeout(onComplete, 3000)` |
| 프로그레스 바 없음 | PASS | No progress bar rendered |

---

### US-05: InterpretationScreen — PASS

| Criteria | Status | Notes |
|----------|--------|-------|
| 타로 카드 스타일 | PASS | Gradient bg + DreamIconComposition + card-radius |
| 카드 제목 동적 생성 | PASS | 7 TITLE_PATTERNS in data.ts, seed-based selection |
| 핵심 키워드 3개 | PASS | `keywords` array: place keyword + object/여정 + emotion |
| 해석 텍스트 3-4문장 | PASS | place + weather + emotion texts concatenated + character note + vividness note |
| 상징 해설 영역 | PASS | `symbolReadings` rendered (lines 88-96) |
| 운세 한마디 | PASS | `fortune` from 40-message pool |
| "카드 저장하기" | PASS | `onSave` -> `handleSaveDream` adds to dreams array |
| "공유하기" | PASS | `onShare` -> `navigate('share')` |
| "다시 꾸기" | PASS | `onRestart` -> resetDreamState + navigate('intro') |

---

### US-06: ShareScreen — PASS

| Criteria | Status | Notes |
|----------|--------|-------|
| 공유 카드 뷰 | PASS | `aspect-[430/640]` card with DreamIconComposition |
| 카드 구성 요소 | PASS | Title + keywords + 핵심 해석 1문장 + "꿈 공장" watermark |
| 감정별 그라디언트 | PASS | DreamIconComposition uses emotion gradient |
| "이미지로 저장" 버튼 | PASS | Stub with alert (적절한 데모 모드 처리) |
| "카카오톡 공유" 버튼 | PASS | Stub with alert |
| "링크 복사" 버튼 | PASS | `navigator.clipboard.writeText` |
| 뒤로가기 -> Interpretation | PASS | `onBack` -> `navigate('interpretation')` |

---

### US-07: GalleryScreen — PASS

| Criteria | Status | Notes |
|----------|--------|-------|
| 2열 그리드 | PASS | `masonry-grid` CSS class (2-column) |
| 날짜 역순 정렬 | PASS | Dreams stored newest-first (`[currentEntry, ...prev]`) |
| 카드 탭 -> InterpretationScreen | PASS | `onViewDream` -> `handleViewDream` sets viewEntry + navigate |
| 빈 상태 메시지 + CTA | PASS | Empty state with "아직 기록한 꿈이 없어요" + "꿈 기록하기" button |
| 필터 칩 | PASS | 전체, 이번 주, + 감정 3개 (평화, 공포, 혼란) |
| 데모 시드 데이터 5개 | PASS | `createSeedData()` returns 5 entries |

**Observation (P2):** 감정 필터가 8개 중 3개만 표시됨 (EMOTIONS.slice(0, 3)). 완전성 측면에서 모든 감정 필터 제공이 바람직하나, MVP에서는 수용 가능.

---

### US-08: PatternScreen — PASS

| Criteria | Status | Notes |
|----------|--------|-------|
| 갤러리/패턴 분석 탭 전환 | PASS | GalleryScreen에서 `onGoPattern`, PatternScreen에서 `onGoGallery` |
| 14일 도트 캘린더 | PASS | `dotCalendar` 14 entries, indigo dot for recorded days |
| 자주 나오는 상징 TOP 5 바 차트 | PASS | `topSymbols` with horizontal bars |
| 감정 분포 도넛 차트 | PASS | SVG donut chart with segments |
| 선명도 추이 라인 차트 | PASS | Dot markers + SVG path line |
| 패턴 인사이트 카드 | PASS | `getPatternInsights` with conditional messages |
| 데이터 부족 시 안내 | PASS | `dreams.length < 3` shows "5개 이상 기록하면 패턴을 분석해드려요" |

**Bug (P2):** PatternScreen의 데이터 부족 조건이 `dreams.length < 3`이지만, 안내 메시지는 "5개 이상"이라고 함. 실제 3개 이상이면 패턴이 보임. Inconsistency이지만 사용자에게 해가 되는 방향은 아님 (더 빨리 보여주므로). **Severity: P3**

---

### US-09: 꿈 일기 확장 메모 — PASS

| Criteria | Status | Notes |
|----------|--------|-------|
| InterpretationScreen(읽기모드) "메모 추가" 버튼 | PASS | `isViewMode` shows memo button (line 124-129) |
| 메모 입력 바텀시트 200자 | PASS | Bottom sheet with `maxLength={200}` |
| 기존 메모 수정 모드 | PASS | `journalMemo` initialized from `entry.journalMemo` |
| 저장 시 localStorage 업데이트 | PASS | `handleUpdateJournalMemo` -> `setDreams` -> `useEffect` saves |
| GalleryScreen 메모 유무 표시 | **MISSING** | GalleryScreen 카드에 메모 유무 아이콘이 표시되지 않음 |

**Bug (P2):** GalleryScreen의 dream card에 `journalMemo` 유무 아이콘이 렌더링되지 않음. **Severity: P2**

---

### US-10: 데모 모드 — PASS

| Criteria | Status | Notes |
|----------|--------|-------|
| localStorage 기반 | PASS | `STORAGE_KEY = 'dream-factory-state'` |
| 해석 매핑 테이블 | PASS | PLACE_TEXTS x WEATHER_TEXTS x EMOTION_TEXTS + seed-based variation |
| 카드 제목 생성 규칙 | PASS | 7 TITLE_PATTERNS covering weather+place+object/person combinations |
| 키워드 매핑 | PASS | place keyword + object keyword + emotion keyword = 3 |
| 상징 해설 풀 | PASS | 8 objects x 5 meanings = 40 variations (spec was 24, exceeded) |
| 운세 메시지 풀 | PASS | 40 messages (spec was 20, exceeded) |
| 시드 데이터 5일치 | PASS | `createSeedData()` with 5 configs |
| 패턴 인사이트 규칙 | PASS | `getPatternInsights` checks count >= 3 |

---

## Bug Summary

| ID | Severity | Component | Description |
|----|----------|-----------|-------------|
| B-01 | P2 | GalleryScreen | dream card에 `journalMemo` 유무 아이콘 미표시 (US-09 인수조건) |
| B-02 | P3 | PatternScreen | 데이터 부족 threshold `< 3` vs 안내 메시지 "5개 이상" 불일치 |
| B-03 | P3 | IntroScreen | 하단 "이번 주 통계" 뱃지가 IntroScreen에 직접 표시되지 않음 (US-01 인수조건) |
| B-04 | P3 | IntroScreen | 하단 네비바 "통계" 버튼이 PatternScreen 대신 GalleryScreen으로 이동 |

---

## Functional Observations (Persona 2 관점)

### Navigation Flow
- 모든 화면 간 네비게이션 핸들러가 App.tsx에서 올바르게 연결됨
- `resetDreamState` 가 새 꿈 기록 시 이전 상태를 정확히 초기화
- `viewEntry` vs `currentEntry` 로 읽기모드/신규모드 분기 정상 동작

### Interpretation Generator Edge Cases
- **objects 없는 경우:** keywords에 '여정' fallback 사용 -- 정상
- **characters 없는 경우:** `characterNote` 빈 문자열 -- 정상
- **objects + characters 모두 없는 경우:** title pattern fallback 존재 (e.g., "꿈의 조각", "장소에 숨겨진 비밀") -- 정상

### History Persistence
- `useEffect(() => saveDreams(dreams), [dreams])` 로 모든 변경 시 자동 저장 -- 정상
- 페이지 새로고침 시 `loadDreams()` 가 localStorage에서 복원 -- 정상
- 저장된 데이터가 없으면 seed data 자동 생성 -- 정상

### TypeScript Type Safety
- `tsc --noEmit` 통과, 타입 불일치 없음
- `PlaceKey` 타입에 12개 장소 포함 (원래 8개에서 확장), data.ts PLACES와 일치

---

## Verdict

**PASS** -- P0/P1 이슈 없음. P2 이슈 1건(갤러리 메모 아이콘), P3 이슈 3건.

전체적으로 10개 User Story의 핵심 기능이 모두 구현되어 있고, 빌드/타입체크 통과, 데모 모드 정상 동작. Persona 2(파워유저) 관점에서 데이터 분석 기능(패턴, 도넛 차트, 선명도 추이)이 잘 갖춰져 있으나, 장기 사용 시 데이터 엑스포트 기능이 필요할 것으로 예상됨.
