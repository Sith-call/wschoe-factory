# Ralph Persona Loop — Phase Details

SKILL.md에서 참조되는 각 Phase의 상세 워크플로우.

## Table of Contents

1. [Phase 0: 플로우 그래프 검증](#phase-0)
2. [Phase 1.5: gstack /qa 실행](#phase-15)
3. [Phase 1.7: gstack /browse 워크스루](#phase-17)
4. [Phase 2: 페르소나 평가](#phase-2)
5. [Phase 2.5: gstack /design-review](#phase-25)
6. [Phase 2.6: UX 전문가 평가](#phase-26)
7. [Phase 2.7: 디자인 비저너리 평가](#phase-27)
8. [Phase 4: 가설 기반 개선](#phase-4)

---

<a id="phase-0"></a>
## Phase 0: 플로우 그래프 검증

**에이전트**: `dev-team:flow-graph-validator`

**프로세스**:
1. PM의 `screen-flows.md`에서 기대 그래프 추출
2. 실제 코드(App.tsx + 각 컴포넌트)에서 구현 그래프 추출
3. 5가지 검증:
   - 닫힘 (모든 화면에 진입/이탈 경로)
   - 도달 가능성 (entry에서 모든 화면 접근 가능)
   - 탈출 가능성 (모든 화면에서 홈으로 복귀 가능)
   - 양방향 (one-way door 검출)
   - 기대-구현 일치 (missing edge 검출)
4. E2E 저니 4개 이상 추적
5. 상태별 접근성 매트릭스 검증

**산출물**: `docs/pm-outputs/iteration-N-flow-validation.md`

**분기**:
- Dead-end, Orphan, Trap state 1개라도 → **FAIL** → Dev 수정 필수
- Missing edge (핵심 저니) → **FAIL**
- 모든 검증 통과 → **PASS** → Phase 1로

---

<a id="phase-15"></a>
## Phase 1.5: gstack /qa 실행

gstack browse 셋업: `references/gstack-browse-setup.md` 참조.

### Step 1: 빌드 검증
```bash
cd {app-dir}
npx tsc --noEmit     # TypeScript 타입 검증
npm run build        # 프로덕션 빌드
```

### Step 2: 브라우저 QA
```bash
$B viewport 430x932
$B goto http://localhost:{port}

# Orient — 앱 구조 파악
$B snapshot -i -a -o ".gstack/qa-reports/screenshots/initial.png"
$B links
$B console --errors

# Explore — 페이지별 체계적 검증
# 각 페이지에서:
$B goto {page-url}
$B snapshot -i -a -o ".gstack/qa-reports/screenshots/{page}.png"
$B console --errors
```

Per-page 체크리스트:
1. Visual scan — 주석 스크린샷으로 레이아웃 이슈
2. Interactive elements — 버튼, 링크, 컨트롤 클릭 검증
3. Forms — 입력, 제출, 빈 값/잘못된 값
4. Navigation — 모든 진입/이탈 경로
5. States — 빈 상태, 로딩, 에러, 오버플로우
6. Console — 인터랙션 후 새 JS 에러
7. Responsiveness: `$B viewport 375x812` → 스크린샷 → `$B viewport 430x932`

### Step 3: Health Score 계산

| 카테고리 | 가중치 | 채점 |
|---------|--------|------|
| Console | 15% | 0 errors → 100, 1-3 → 70, 4-10 → 40, 10+ → 10 |
| Links | 10% | 0 broken → 100, 각 -15 |
| Visual | 10% | 100에서 Critical -25, High -15, Medium -8, Low -3 |
| Functional | 20% | 동일 |
| UX | 15% | 동일 |
| Performance | 10% | 동일 |
| Content | 5% | 동일 |
| Accessibility | 15% | 동일 |

`Health Score = Σ (category_score × weight)`

### Step 4: Fix Loop
1. **Locate source** — Grep/Glob으로 소스 파일 탐색
2. **Fix** — 최소한의 수정만. 관련 없는 리팩토링 금지.
3. **Commit** — `git commit -m "fix(qa): ISSUE-NNN — short description"` (이슈당 1커밋)
4. **Re-test** — before/after 스크린샷 + console 체크
5. **Classify** — 🟢 fixed / 🟡 partial / 🔴 not fixed

**산출물**:
- `.gstack/qa-reports/qa-report-{domain}-{date}.md`
- `.gstack/qa-reports/baseline.json`
- `docs/pm-outputs/iteration-N-qa-report.md`

**분기**:
- Health Score < 70 → `/investigate`로 root cause 분석 → 수정 → /qa 재실행
- Health Score 70+ → Phase 1.7로

### /investigate 연계 (Health Score < 70)

gstack /investigate의 Iron Law: **root cause 없이 수정 금지.**

```
Phase 1: Investigate — 증거 수집 (console, network, screenshot, 코드)
Phase 2: Analyze — 패턴 분석, 원인 좁히기
Phase 3: Hypothesize — root cause 가설 + 검증 방법
Phase 4: Implement — 가설 검증 후에만 수정
```

---

<a id="phase-17"></a>
## Phase 1.7: gstack /browse 워크스루

**에이전트**: `pm-agent:live-app-walkthrough`

```bash
# 전체 스크린 캡처
$B viewport 430x932
$B goto http://localhost:{port}
$B snapshot -i -a -o /tmp/walkthrough-{screen-name}.png
$B snapshot -i     # 인터랙티브 요소 텍스트 목록
$B snapshot -C     # 숨겨진 클릭 가능 요소
$B text            # 전체 텍스트 (한국어 확인)
$B console --errors

# 유저 플로우 워크스루
$B snapshot -i -a -o /tmp/journey-{N}-start.png
$B click @e{N}
$B snapshot -D     # diff로 전환 확인
$B snapshot -i -a -o /tmp/journey-{N}-step{M}.png

# 상태별 화면
$B js "localStorage.clear()"
$B reload
$B snapshot -i -a -o /tmp/state-empty.png

# 반응형 확인
$B responsive /tmp/responsive-{screen}
```

**산출물**: `docs/pm-outputs/iteration-N-walkthrough.md`

포함 항목:
- 모든 스크린의 주석 스크린샷
- 유저 저니별 전환 기록
- 상태별 화면 (빈 상태, 활성 상태)
- 반응형 스크린샷

---

<a id="phase-2"></a>
## Phase 2: 페르소나 평가

**평가 방법**:
1. Phase 1.7의 라이브 워크스루 스크린샷을 순서대로 확인
2. 필요시 gstack /browse로 직접 앱 조작
3. 각 화면에서 페르소나 시점의 솔직한 반응 기록 (한국어)
4. 5개 차원 점수
5. 종합 만족도

**gstack /browse 직접 체험**:
```bash
$B viewport 430x932
$B goto http://localhost:{port}
$B snapshot -i           # 첫 화면
$B click @e{CTA}         # CTA 클릭
$B snapshot -D           # 변화 확인
```

**평가 차원**:

| 차원 | 설명 | 가중치 |
|------|------|--------|
| 첫인상 | 앱이 신뢰감 있고 매력적으로 보이는가? | 20% |
| 사용성 | 설명 없이 사용할 수 있는가? | 25% |
| 재미/몰입 | 재미있는가? 계속 쓰고 싶은가? | 25% |
| 공유욕구 | 친구에게 보여주고 싶은가? | 15% |
| 재방문 의향 | 내일 다시 올 것인가? | 15% |

**솔직함 원칙**: 페르소나는 개발자가 아닌 실제 유저. "이게 뭐지?", "좀 답답하네", "오 이거 좋다" 같은 자연스러운 반응.

---

<a id="phase-25"></a>
## Phase 2.5: gstack /design-review

유저 페르소나가 "뭔가 이상해"라고 느끼는 것의 정확한 원인을 80항목 체크리스트로 진단.

### Design System Extraction
```bash
$B js "JSON.stringify([...new Set([...document.querySelectorAll('*')].slice(0,500).map(e => getComputedStyle(e).fontFamily))])"
$B js "JSON.stringify([...new Set([...document.querySelectorAll('*')].slice(0,500).flatMap(e => [getComputedStyle(e).color, getComputedStyle(e).backgroundColor]).filter(c => c !== 'rgba(0, 0, 0, 0)'))])"
$B js "JSON.stringify([...document.querySelectorAll('a,button,input,[role=button]')].filter(e => {const r=e.getBoundingClientRect(); return r.width>0 && (r.width<44||r.height<44)}).map(e => ({tag:e.tagName, text:(e.textContent||'').trim().slice(0,30), w:Math.round(e.getBoundingClientRect().width), h:Math.round(e.getBoundingClientRect().height)})).slice(0,20))"
$B perf
```

### Page-by-Page Audit
```bash
$B goto {url}
$B snapshot -i -a -o ".gstack/design-reports/screenshots/{page}-annotated.png"
$B responsive ".gstack/design-reports/screenshots/{page}"
$B console --errors
$B perf
```

### 10개 카테고리 체크리스트 (~80항목)

1. **Visual Hierarchy & Composition** (8) — 포컬 포인트, 시선 흐름, 비주얼 노이즈, 정보 밀도
2. **Typography** (15) — 폰트 수 ≤3, line-height, 45-75자, 블랙리스트 폰트
3. **Color & Contrast** (10) — 팔레트 ≤12색, WCAG AA 4.5:1, 시맨틱 색상
4. **Spacing & Layout** (12) — 4/8px 스케일, 정렬, border-radius 계층
5. **Interaction States** (10) — hover, focus-visible, disabled, 터치타깃 ≥44px
6. **Responsive Design** (8) — 모바일 레이아웃, 터치타깃, 이미지
7. **Motion & Animation** (6) — easing, 50-700ms, prefers-reduced-motion
8. **Content & Microcopy** (8) — 빈 상태, 에러 메시지, 능동태
9. **AI Slop Detection** (10) — 보라 그래디언트, 3-column grid, 이모지, 제네릭 hero
10. **Performance as Design** (6) — LCP < 2.0s, CLS < 0.1, font-display: swap

### Scoring
- **Design Score: A-F** (10개 카테고리 가중 평균)
- **AI Slop Score: A-F** (독립 등급)
- High finding → 1등급 하락, Medium → 0.5등급 하락

### Fix Loop
1. 영향도 순 정렬
2. 소스 탐색 → 최소 수정 (CSS 우선) → 원자적 커밋
3. before/after 스크린샷 증거
4. `git commit -m "fix(design): FINDING-NNN — short description"`

---

<a id="phase-26"></a>
## Phase 2.6: UX 전문가 평가

**에이전트**: `pm-agent:ux-specialist`

### gstack 정량 측정
```bash
# Time to First Value
$B viewport 430x932
$B goto http://localhost:{port}
$B snapshot -i              # 앱 오픈 — 뭘 해야 하는지 명확한가?
$B click @e{CTA}
$B snapshot -D
# → "Time to First Value: N steps, ~N seconds"

# 터치 타깃 분석
$B snapshot -i -a -o /tmp/ux-touch-targets.png
$B css @e{N} "width"
$B css @e{N} "height"       # 44px 미만이면 문제

# 인지 부하 (화면당 인터랙티브 요소 수)
$B snapshot -i              # @e ref 수 → 7±2 초과 시 경고

# 상태 전환 명확성
$B click @e{OPTION}
$B snapshot -D              # 선택 전/후 차이 명확한가?
```

**평가 차원**: 정보 설계(20%), 인터랙션 디자인(25%), 유저 플로우(25%), 인지 부하(20%), 접근성(10%)

**핵심 지표**:
- Time to First Value (단계/시간)
- 마찰 포인트 맵
- 터치 타깃 사이즈 (px)
- 인지 부하 (@e ref 수)
- 색상 대비 / 폰트 크기 접근성

---

<a id="phase-27"></a>
## Phase 2.7: 디자인 비저너리 평가

**에이전트**: `design-team:design-visionary`

```bash
# 3초 인상 테스트
$B viewport 430x932
$B goto http://localhost:{port}
$B screenshot /tmp/visionary-first-impression.png

# 디테일 헌팅
$B snapshot -i -a -o /tmp/visionary-annotated.png
```

**평가 기준**:
- Steve Jobs/Jony Ive/Dieter Rams 수준의 감각
- 비교 대상: Calm, Headspace, Spotify Wrapped
- 점진적 제안 금지 — "이 화면의 존재 이유를 다시 생각해"
- AI Slop Score C 이하면 비저너리도 감점

---

<a id="phase-4"></a>
## Phase 4: 가설 기반 개선

### PM 가설 수립
```
### H{N}: {가설 제목}
> **If** {변경 사항}을 적용하면,
> **Then** {차원} 점수가 {현재} → {목표}로 상승할 것이다.
> **Because** {유저 심리/행동 근거}.
> **Evidence** gstack {리포트}: {구체적 finding}
```

### 팀 배분

| 가설 유형 | 담당 팀 | gstack 도구 |
|----------|---------|------------|
| 디자인 통일성/스크린 수정 | Design 팀: Stitch 수정 | - |
| 비주얼/UX 코드 개선 | Dev 팀 | `/design-review` findings |
| 기능 버그 | Dev 팀 | `/investigate` (root cause 필수) |
| 기능/로직/데이터/텍스트 | Dev 팀 | `/qa` regression |

### Dev 팀 워크플로우 (/investigate 기반)
1. **Investigate** — `$B console --errors`, `$B network`, 스크린샷 증거
2. **Analyze** — 패턴 분석, 원인 좁히기
3. **Hypothesize** — root cause 가설 + 검증 방법
4. **Implement** — 검증 후에만 수정, `fix(investigate): ROOT-CAUSE — description` 커밋

### Regression 검증
이전 baseline.json 활용 → Health Score 델타, Design Score 비교.
