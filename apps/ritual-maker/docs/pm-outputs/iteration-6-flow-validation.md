# Flow Graph Validation — Iteration 6

**앱:** Ritual Maker
**검증일:** 2026-03-20
**검증 대상:** `src/App.tsx` + 9개 화면 컴포넌트

---

## 화면 목록 (노드)

### ScreenName 타입 정의 (types.ts:98-107)

| # | Screen | in-degree | out-degree | 상태 |
|---|--------|-----------|------------|------|
| 1 | worldIntro | 1 (앱 첫 진입) | 1 (onboarding) | ✅ OK |
| 2 | onboarding | 1 (worldIntro) | 1 (ritualSelect) | ✅ OK |
| 3 | ritualSelect | 2 (onboarding, profile) | 1 (home) | ✅ OK |
| 4 | home | 5 (ritualSelect, quest, skillTree, bossBattle, guild, profile + 탭바) | 6 (quest, skillTree, bossBattle, guild, profile + 퀘스트 체크인) | ✅ OK |
| 5 | quest | 2 (home, 탭바) | 1 (home) | ✅ OK |
| 6 | skillTree | 2 (home, 탭바) | 1 (home) | ✅ OK |
| 7 | bossBattle | 2 (home, 탭바*) | 1 (home) | ⚠️ 탭바에 없음 (home 퀵액션으로만 접근) |
| 8 | guild | 2 (home, 탭바) | 1 (home) | ✅ OK |
| 9 | profile | 1 (탭바) | 3 (home, ritualSelect, shareModal) | ✅ OK |

*bossBattle은 탭바에 포함되지 않음 — home 화면의 퀵 액션 버튼으로만 접근 가능.

---

## 네비게이션 맵 (엣지)

### 온보딩 플로우 (선형, 단방향 — 의도적)

| # | From | Action | To | 코드 위치 | 검증 |
|---|------|--------|----|----------|------|
| 1 | worldIntro | "모험 시작!" / "건너뛰기" 클릭 | onboarding | App.tsx:282 `onComplete={() => setScreen('onboarding')}` | ✅ |
| 2 | onboarding | 이름 입력 후 "모험 시작!" 클릭 | ritualSelect | App.tsx:101-105 `handleOnboardingComplete` → `setScreen('ritualSelect')` | ✅ |
| 3 | onboarding (내부) | "클래스 다시 선택" 클릭 | onboarding (class step) | OnboardingScreen.tsx:129 `setStep('class')` | ✅ (내부 전환) |
| 4 | ritualSelect | 4개+ 루틴 선택 후 완료 | home | App.tsx:108-124 `handleRitualSelectComplete` → `setScreen('home')` | ✅ |

### 메인 화면 간 전환

| # | From | Action | To | 코드 위치 | 검증 |
|---|------|--------|----|----------|------|
| 5 | home | "체크인 →" 버튼 클릭 | quest | HomeScreen.tsx:118 `onNavigate('quest')` | ✅ |
| 6 | home | 아침/오후/저녁 시간대 버튼 클릭 | quest | HomeScreen.tsx:133 `onNavigate('quest')` | ✅ |
| 7 | home | 스킬트리 퀵 액션 버튼 | skillTree | HomeScreen.tsx:160 `onNavigate('skillTree')` | ✅ |
| 8 | home | 보스배틀 퀵 액션 버튼 | bossBattle | HomeScreen.tsx:161 `onNavigate('bossBattle')` | ✅ |
| 9 | home | 길드 퀵 액션 버튼 | guild | HomeScreen.tsx:162 `onNavigate('guild')` | ✅ |
| 10 | quest | ← 뒤로 버튼 | home | App.tsx:312 `onBack={() => navigate('home')}` | ✅ |
| 11 | skillTree | ← 뒤로 버튼 | home | App.tsx:320 `onBack={() => navigate('home')}` | ✅ |
| 12 | bossBattle | ← 뒤로 버튼 (intro phase) | home | App.tsx:334 `onBack={() => navigate('home')}` | ✅ |
| 13 | bossBattle | ← 뒤로 버튼 (battle phase) | home | BossBattleScreen.tsx:148 `onBack` | ✅ |
| 14 | bossBattle | "돌아가기" 버튼 (victory phase) | home | BossBattleScreen.tsx:134 `onBack` | ✅ |
| 15 | guild | ← 뒤로 버튼 | home | App.tsx:338 `onBack={() => navigate('home')}` | ✅ |
| 16 | profile | ← 뒤로 버튼 | home | App.tsx:350 `onBack={() => navigate('home')}` | ✅ |
| 17 | profile | "루틴 편집" 버튼 | ritualSelect | App.tsx:351 `onEditRituals={() => navigate('ritualSelect')}` | ✅ |

### 하단 탭바 전환 (App.tsx:362-379)

탭바 표시 조건: `state && !['worldIntro', 'onboarding', 'ritualSelect'].includes(screen)` (App.tsx:276)

| # | From | Action | To | 검증 |
|---|------|--------|----|------|
| 18 | any (탭바 표시 시) | 🏠 홈 탭 | home | ✅ |
| 19 | any (탭바 표시 시) | ⚔️ 퀘스트 탭 | quest | ✅ |
| 20 | any (탭바 표시 시) | 🌳 스킬 탭 | skillTree | ✅ |
| 21 | any (탭바 표시 시) | 🏰 길드 탭 | guild | ✅ |
| 22 | any (탭바 표시 시) | 👤 프로필 탭 | profile | ✅ |

### 모달 (오버레이, 화면 전환 아님)

| # | Trigger | Modal | 닫기 방법 | 검증 |
|---|---------|-------|----------|------|
| M1 | 레벨업 시 자동 | LevelUpModal | "닫기" 클릭 → ShareCardModal 열림 | ✅ |
| M2 | 레벨업 모달 닫기 후 / 보스 처치 후 / 프로필 공유 버튼 | ShareCardModal | "닫기" 클릭 | ✅ |

---

## 검증 A: 닫힘 검증 (Closedness)

### 모든 노드의 in-degree / out-degree 분석

| Screen | in-degree (진입 경로) | out-degree (이탈 경로) | 판정 |
|--------|---------------------|----------------------|------|
| worldIntro | 1 (앱 최초 진입, savedState 없을 때) | 1 (onboarding) | ✅ OK |
| onboarding | 1 (worldIntro) | 1 (ritualSelect) | ✅ OK |
| ritualSelect | 2 (onboarding, profile→루틴편집) | 1 (home) | ✅ OK |
| home | 6+ (ritualSelect, quest, skillTree, bossBattle, guild, profile, 탭바) | 5 (quest, skillTree, bossBattle, guild — 탭바로 profile) | ✅ OK |
| quest | 2 (home 직접, 탭바) | 1 (home — 뒤로) + 탭바 5개 | ✅ OK |
| skillTree | 2 (home 직접, 탭바) | 1 (home — 뒤로) + 탭바 5개 | ✅ OK |
| bossBattle | 1 (home 퀵 액션) | 1 (home — 뒤로) + 탭바 5개 | ✅ OK |
| guild | 2 (home 직접, 탭바) | 1 (home — 뒤로) + 탭바 5개 | ✅ OK |
| profile | 1 (탭바) | 2 (home — 뒤로, ritualSelect — 루틴편집) + 탭바 5개 | ✅ OK |

**결과: Dead-end 0개, Orphan 0개** ✅ PASS

---

## 검증 B: 도달 가능성 검증 (Reachability)

### BFS from entry point

**Entry point 1: 첫 방문 (savedState 없음) → `worldIntro`**

```
worldIntro → onboarding → ritualSelect → home
home → quest, skillTree, bossBattle, guild (직접)
home → profile (탭바)
```

도달 가능 노드: **9/9** ✅

**Entry point 2: 재방문 (savedState 있음) → `home`**

```
home → quest, skillTree, bossBattle, guild (직접)
home → profile (탭바)
profile → ritualSelect (루틴 편집)
```

도달 가능 노드: home, quest, skillTree, bossBattle, guild, profile, ritualSelect = **7/9**
도달 불가: worldIntro, onboarding (의도적 — 재온보딩 불필요)

**결과: Orphan screen 0개** ✅ PASS

---

## 검증 C: 탈출 가능성 검증 (Escapability)

모든 화면에서 home 도달 가능 여부:

| Screen | home 도달 경로 | 판정 |
|--------|--------------|------|
| worldIntro | worldIntro → onboarding → ritualSelect → home | ✅ (온보딩 완료 필요) |
| onboarding | onboarding → ritualSelect → home | ✅ (온보딩 완료 필요) |
| ritualSelect | ritualSelect → home (루틴 선택 완료 시) | ⚠️ 조건부 — 아래 참조 |
| quest | ← 뒤로 → home / 탭바 → home | ✅ |
| skillTree | ← 뒤로 → home / 탭바 → home | ✅ |
| bossBattle | ← 뒤로 → home / 탭바 → home | ✅ |
| guild | ← 뒤로 → home / 탭바 → home | ✅ |
| profile | ← 뒤로 → home / 탭바 → home | ✅ |

### ⚠️ ritualSelect 탈출 조건 분석

**초기 온보딩 경로 (pendingClass 있음, state 없음):**
- RitualSelectScreen은 4개 이상 루틴 선택 후 완료 버튼으로만 탈출 가능
- 뒤로가기 버튼 없음
- 탭바 없음 (ritualSelect은 탭바 제외 목록에 포함)
- **하지만** 4개 미선택 시에도 브라우저 뒤로가기나 앱 리프레시로 처음부터 다시 시작 가능 (localStorage에 state 저장 안 됨)
- **판정:** 의도적 설계 (온보딩 흐름이므로 완료해야 진행) — OK

**프로필에서 루틴 편집 경로 (state 있음):**
- App.tsx:323-328에서 `state && screen === 'ritualSelect'`일 때 RitualSelectScreen 렌더링
- `onComplete={handleUpdateRituals}` → 루틴 업데이트 후 `setScreen('home')` (App.tsx:241-247)
- **뒤로가기 버튼 없음** — 루틴을 반드시 선택해야만 돌아갈 수 있음
- 탭바 없음 (ritualSelect은 탭바 제외 목록)
- **판정:** ⚠️ WARNING — 루틴 편집 취소 기능 없음. 유저가 루틴 편집 화면에 진입했으나 변경을 원하지 않을 때 돌아갈 방법이 4개 이상 선택 후 완료뿐. 기존 선택이 유지되지 않으므로 반드시 다시 선택해야 함.

**결과:** ⚠️ WARNING 1건 — ritualSelect 편집 모드에서 취소/뒤로가기 없음

---

## 검증 D: 양방향 검증 (Bidirectionality)

| Edge (A → B) | 역방향 (B → A) | 대안 경로 (B → home) | 판정 |
|--------------|---------------|--------------------|----- |
| worldIntro → onboarding | 없음 | onboarding → ritualSelect → home | ✅ 의도적 단방향 |
| onboarding → ritualSelect | 없음 | ritualSelect → home | ✅ 의도적 단방향 |
| ritualSelect → home | 없음 (home → ritualSelect 직접 경로 없음, profile 경유) | N/A | ✅ OK |
| home → quest | quest → home (뒤로) | ✅ | ✅ |
| home → skillTree | skillTree → home (뒤로) | ✅ | ✅ |
| home → bossBattle | bossBattle → home (뒤로) | ✅ | ✅ |
| home → guild | guild → home (뒤로) | ✅ | ✅ |
| home → profile (탭바) | profile → home (뒤로) | ✅ | ✅ |
| profile → ritualSelect | ritualSelect → home (완료 후) | ✅ (단, profile로 직접 돌아가지는 않음) | ⚠️ 약한 양방향 |

### One-way door 목록

1. **worldIntro → onboarding** — 의도적 (온보딩 진행)
2. **onboarding → ritualSelect** — 의도적 (온보딩 진행)
3. **profile → ritualSelect → home** — 루틴 편집 후 home으로 이동, profile로 돌아가지 않음 (⚠️ 사소한 UX 이슈)

**결과:** 비의도적 One-way door 0개 ✅ PASS (1건 WARNING: profile→ritualSelect→home 경로에서 profile로 복귀 안됨)

---

## 검증 E: 기대-구현 일치 검증 (Conformance)

### PRD 기대 화면 vs 구현 화면

| PRD 기대 | 구현 | 일치 | 비고 |
|---------|------|------|------|
| 스플래시 | worldIntro | ✅ | 세계관 소개로 대체 |
| 데모/시작 선택 | 없음 | ⚠️ | 앱 자체가 데모 모드 (localStorage 기반) |
| 성향 테스트 (5문항) | 없음 | ⚠️ | 직접 클래스 선택으로 대체 |
| 캐릭터 생성 (클래스+이름) | onboarding | ✅ | 클래스 선택 + 이름 입력 |
| 루틴 선택 | ritualSelect | ✅ | PRD에는 없으나 추가된 화면 |
| 메인 홈 | home | ✅ | |
| 퀘스트 화면 | quest | ✅ | |
| 스킬트리 화면 | skillTree | ✅ | |
| 보스 배틀 화면 | bossBattle | ✅ | 3 phase (intro/battle/victory) |
| 길드 화면 | guild | ✅ | |
| 프로필/설정 | profile | ✅ | |

### PRD 기대 엣지 vs 구현 엣지

| PRD 기대 전환 | 구현 여부 | 비고 |
|-------------|----------|------|
| 스플래시 → 온보딩 | ✅ | worldIntro → onboarding |
| 온보딩 → 홈 | ✅ | onboarding → ritualSelect → home |
| 홈 → 퀘스트 | ✅ | 다수 경로 (CTA, 시간대 버튼, 탭바) |
| 홈 → 스킬트리 | ✅ | 퀵 액션 + 탭바 |
| 홈 → 보스배틀 | ✅ | 퀵 액션 (탭바에는 없음) |
| 홈 → 길드 | ✅ | 퀵 액션 + 탭바 |
| 홈 → 프로필 | ✅ | 탭바 |
| 프로필 → 설정 (루틴 편집) | ✅ | profile → ritualSelect |
| 하단 탭바 5개 화면 전환 | ✅ | home, quest, skillTree, guild, profile |

### Missing edges (PRD에 있지만 구현 안 됨)

1. **성향 테스트 화면** — PRD US-01에 5문항 테스트 명시, 구현에서는 직접 클래스 선택으로 대체 (P0, WARNING)
2. **커스텀 퀘스트 추가 버튼** — PRD US-07에 명시, quest 화면에 추가 버튼 없음 (P1, WARNING)
3. **데모/시작 선택 화면** — PRD 5.1에 명시, 앱 자체가 데모 모드로 동작하므로 불필요 (OK)

### Unexpected edges (구현에 있지만 PRD에 없는 것)

1. **ritualSelect 화면** — PRD에 별도 루틴 선택 화면 없음, 구현에서 추가 (의도적 개선)
2. **worldIntro 화면** — PRD의 스플래시보다 풍부한 세계관 소개 (의도적 개선)
3. **ShareCardModal** — PRD에 없는 공유 기능 (의도적 추가 기능)
4. **LevelUpModal** — PRD에 없는 레벨업 축하 모달 (의도적 추가 기능)

**결과:** Missing edge 2건 (WARNING), Unexpected edge 4건 (의도적 개선) — ✅ PASS (핵심 저니 누락 없음)

---

## E2E 저니 검증

### Journey 1: 첫 방문 유저 (온보딩 → 첫 퀘스트)

```
앱 오픈 (savedState=null)
  → worldIntro [App.tsx:46 screen='worldIntro']
  → "모험 시작!" 클릭 [WorldIntroScreen.tsx:29 onComplete()]
  → onboarding [App.tsx:282]
  → 클래스 선택 → 이름 입력 → "모험 시작!" [OnboardingScreen.tsx:16 onComplete()]
  → ritualSelect [App.tsx:104]
  → 4개+ 루틴 선택 → 완료 [RitualSelectScreen.tsx:22 onComplete()]
  → home [App.tsx:123]
  → "체크인 →" 클릭 [HomeScreen.tsx:118]
  → quest
  → 루틴 완료 클릭 [QuestScreen.tsx:26 onComplete()]
  → ← 뒤로 [QuestScreen.tsx:41]
  → home
```

| 단계 수 | 완주 가능 | 끊기는 지점 |
|--------|----------|------------|
| 10 | ✅ | - |

### Journey 2: 재방문 유저 (퀘스트 + 스킬 해금)

```
앱 오픈 (savedState 존재)
  → home [App.tsx:46 screen='home']
  → ⚔️ 퀘스트 탭 [탭바]
  → quest
  → 루틴 완료 [QuestScreen.tsx:26]
  → 🌳 스킬 탭 [탭바]
  → skillTree
  → 스킬 해금 클릭 [SkillTreeScreen.tsx:18 onUnlock()]
  → 🏠 홈 탭 [탭바]
  → home
```

| 단계 수 | 완주 가능 | 끊기는 지점 |
|--------|----------|------------|
| 8 | ✅ | - |

### Journey 3: 보스 배틀 (홈 → 보스전 → 승리 → 홈)

```
home
  → 보스배틀 퀵 액션 버튼 [HomeScreen.tsx:161]
  → bossBattle (intro phase) [BossBattleScreen.tsx:57]
  → "⚔️ 전투 시작" 클릭 [BossBattleScreen.tsx:90]
  → bossBattle (battle phase) [BossBattleScreen.tsx:19 setPhase('battle')]
  → 회고 답변 입력 [BossBattleScreen.tsx:31]
  → "⚔️ 공격!" 클릭 [BossBattleScreen.tsx:35 handleAttack()]
  → (HP 0 도달 시) bossBattle (victory phase) [BossBattleScreen.tsx:47]
  → "돌아가기" 클릭 [BossBattleScreen.tsx:134 onBack()]
  → home
```

| 단계 수 | 완주 가능 | 끊기는 지점 |
|--------|----------|------------|
| 8 | ✅ | - |

**주의사항:** bossBattle 화면은 `state.currentBoss && screen === 'bossBattle'` 조건 (App.tsx:329)으로 렌더링됨. `currentBoss`가 null이면 화면이 비어보임 (빈 화면). 하지만 handleDefeatBoss에서 항상 다음 보스를 순환 배정하므로 (App.tsx:255) currentBoss가 null이 되는 경우는 일반 플로우에서 발생하지 않음.

### Journey 4: 탐색형 유저 (프로필 → 루틴 편집 → 길드)

```
home
  → 👤 프로필 탭 [탭바]
  → profile
  → "루틴 편집" 클릭 [ProfileScreen.tsx:247 onEditRituals()]
  → ritualSelect [App.tsx:351]
  → 루틴 재선택 → 완료 [handleUpdateRituals → App.tsx:246 setScreen('home')]
  → home
  → 🏰 길드 탭 [탭바]
  → guild
  → ← 뒤로 [GuildScreen.tsx:26]
  → home
```

| 단계 수 | 완주 가능 | 끊기는 지점 |
|--------|----------|------------|
| 9 | ✅ | - |

### 저니 검증 요약

| Journey | 설명 | 단계 수 | 완주 가능 | 끊기는 지점 |
|---------|------|--------|----------|------------|
| 1 | 첫 방문 유저 | 10 | ✅ | - |
| 2 | 재방문 유저 | 8 | ✅ | - |
| 3 | 보스 배틀 | 8 | ✅ | - |
| 4 | 탐색형 유저 | 9 | ✅ | - |

---

## 상태별 접근성 매트릭스

| 상태 | 조건 | 접근 가능한 화면 | 불가능한 화면 | 유의미한 액션 | 판정 |
|------|------|----------------|-------------|-------------|------|
| 첫 방문 | savedState=null | worldIntro, onboarding, ritualSelect | home, quest, skillTree, bossBattle, guild, profile | 온보딩 시작, 클래스 선택, 루틴 선택 | ✅ |
| 온보딩 완료 | onboardingDone=true | home, quest, skillTree, bossBattle, guild, profile, ritualSelect | worldIntro, onboarding | 모든 핵심 기능 이용 가능 | ✅ |
| 오늘 첫 접속 | todayLog=null | home (달성률 0%), quest | - | 퀘스트 체크인 가능 | ✅ |
| 모든 루틴 완료 | completionPct=100% | home (완료 표시), quest (모두 체크됨) | - | 스킬트리, 보스배틀, 길드 탐색 | ✅ |
| 보스 없음 | currentBoss=null | home에서 보스배틀 버튼 클릭 시 | bossBattle (빈 화면) | **빈 화면 표시** | ⚠️ WARNING |
| 스킬 전부 잠김 | level < requiredLevel | skillTree (모든 스킬 잠김 표시) | - | 잠김 조건 확인 가능 | ✅ |
| 루틴 0개 선택 | rituals=[] | 발생 불가 (최소 4개 필수) | - | N/A | ✅ |

### ⚠️ bossBattle 빈 화면 이슈 상세

`App.tsx:329`: `{screen === 'bossBattle' && state.currentBoss && ( <BossBattleScreen ... /> )}`

만약 `currentBoss`가 null인 상태에서 유저가 home의 보스배틀 퀵 액션을 누르면:
- `navigate('bossBattle')` 호출됨 → screen='bossBattle'로 변경
- 하지만 `state.currentBoss`가 null이므로 BossBattleScreen이 렌더링되지 않음
- 탭바만 하단에 표시됨 (showNav 조건에 bossBattle은 제외 목록에 없음)
- **빈 화면 + 탭바만 보이는 상태** → 탭바로 탈출 가능하므로 Trap은 아니지만 UX 이슈

**현실적 발생 가능성:** 낮음 — `handleDefeatBoss`에서 보스 순환 배정하므로 null이 되지 않지만, 엣지 케이스로 방어 코드가 없음.

---

## 구현 그래프 (Adjacency List)

```
worldIntro:   → [onboarding]
onboarding:   → [ritualSelect]
ritualSelect: → [home]
home:         → [quest, skillTree, bossBattle, guild, profile]  (퀵액션 + 탭바)
quest:        → [home, quest, skillTree, guild, profile]        (뒤로 + 탭바)
skillTree:    → [home, quest, skillTree, guild, profile]        (뒤로 + 탭바)
bossBattle:   → [home, quest, skillTree, guild, profile]        (뒤로 + 탭바)
guild:        → [home, quest, skillTree, guild, profile]        (뒤로 + 탭바)
profile:      → [home, quest, skillTree, guild, profile, ritualSelect]  (뒤로 + 탭바 + 루틴편집)
```

---

## 이슈 요약

### BLOCKER (0건)
없음

### WARNING (3건)

| # | 유형 | 화면 | 이슈 | 심각도 | 권장 조치 |
|---|------|------|------|--------|----------|
| W1 | Escapability | ritualSelect (편집 모드) | 프로필에서 루틴 편집 진입 시 취소/뒤로가기 버튼 없음. 유저가 변경을 원하지 않아도 4개 이상 선택 후 완료해야만 돌아갈 수 있음. | Medium | RitualSelectScreen에 optional `onBack` prop 추가, 편집 모드에서 "취소" 버튼 표시 |
| W2 | State Guard | bossBattle | currentBoss=null일 때 빈 화면 표시 가능. 탭바로 탈출 가능하나 UX 불량. | Low | home에서 bossBattle 버튼에 `currentBoss` 존재 여부 체크 추가, 또는 bossBattle 화면에 "보스 없음" fallback UI 추가 |
| W3 | Conformance | profile → ritualSelect | 루틴 편집 완료 후 profile이 아닌 home으로 이동. 유저 입장에서 프로필 설정에서 루틴을 변경했는데 홈으로 이동하는 것이 비직관적. | Low | `handleUpdateRituals`에서 이전 화면 기억 또는 profile로 복귀 옵션 |

### INFO (2건)

| # | 유형 | 내용 |
|---|------|------|
| I1 | Missing Feature | PRD US-01의 성향 테스트(5문항) 미구현 — 직접 클래스 선택으로 대체 |
| I2 | Missing Feature | PRD US-07의 커스텀 퀘스트 추가 미구현 (P1 기능) |

---

## 판정

- [x] **PASS** — 모든 핵심 플로우 닫힘, dead-end/orphan/trap 없음
- [ ] FAIL

**조건부 PASS:** 3건의 WARNING이 있으나 모두 탈출 경로가 존재하며(탭바 또는 완료 버튼), 유저가 완전히 갇히는 경우는 없음. UX 개선 권장 사항으로 분류.

**핵심 판단 근거:**
1. 9개 화면 모두 in-degree >= 1, out-degree >= 1 ✅
2. 엔트리 포인트에서 BFS로 모든 화면 도달 가능 ✅
3. 모든 화면에서 home 복귀 가능 (온보딩 흐름은 의도적 단방향) ✅
4. 비의도적 one-way door 없음 ✅
5. 4개 E2E 저니 모두 완주 가능 ✅
