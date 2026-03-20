---
name: ralph-persona-loop
description: |
  gstack 기반 유저 페르소나 앱 개선 루프. gstack /qa, /design-review, /investigate, /browse 스킬을 활용하여 체계적으로 앱 품질을 개선한다. PM이 타겟 세그먼트 내 페르소나를 만들고, gstack이 정량적으로 앱을 테스트한 뒤, 유저 만족도 80%가 될 때까지 반복 개선한다.

  Use when: "유저 테스트 루프", "페르소나 피드백 루프", "ralph persona loop", "앱 개선 이터레이션", "유저 만족도 올려", "사용자 관점에서 개선", or after an app is built and needs iterative quality improvement through simulated user testing.
---

# Ralph Persona Loop (gstack-integrated)

gstack의 검증된 워크플로우와 유저 페르소나 평가를 결합하여, **정량적 품질 게이트 + 정성적 유저 평가**로 앱을 반복 개선하는 프로세스.

## 핵심 철학: Boil the Lake

gstack의 "Boil the Lake" 원칙을 따른다 — AI가 한계비용을 0에 가깝게 만드는 시대에, 80%에서 타협하지 않고 완성도를 끝까지 올린다. Health Score A등급, Design Score A등급, 유저 만족도 90%를 목표로 한다.

## gstack 스킬 매핑

| Ralph Loop Phase | gstack 스킬 | 역할 |
|-----------------|-------------|------|
| Phase 1.5 QA | `/qa` (Standard tier) | Health Score 계산, 자동 버그 수정, 이슈 분류 |
| Phase 1.7 워크스루 | `/browse` | 주석 스크린샷, 저니 캡처, 반응형 테스트 |
| Phase 2.5 디자인 | `/design-review` | 80항목 체크리스트, AI Slop Detection, A-F 등급 |
| Phase 4 디버깅 | `/investigate` | Root cause 기반 체계적 버그 수정 |
| 전 Phase | `/browse` ($B 명령) | 100ms/command 브라우저 자동화 |

## 전체 플로우

```
Phase 0: 플로우 그래프 검증 (flow-graph-validator)
    ├─ PASS → Phase 1로
    └─ FAIL → Dev가 누락된 네비게이션/플로우 수정 → Phase 0 재검증
    ↓
Phase 1: 페르소나 생성 (PM)
    ↓
Phase 1.5: gstack /qa 실행 (Standard tier)
    ├─ Health Score 계산 (Console/Links/Visual/Functional/UX/Performance/Content/Accessibility)
    ├─ 이슈 자동 분류 (Critical/High/Medium/Low)
    ├─ Fix Loop: 각 이슈를 원자적 커밋으로 수정 + 재검증
    ├─ Health Score 70+ → Phase 1.7로
    └─ Health Score < 70 → /investigate로 root cause 분석 → 수정 → /qa 재실행
    ↓
Phase 1.7: gstack /browse 워크스루
    └─ 모든 화면 주석 스크린샷 + 저니 캡처
    └─ 평가자용 증거 패키지 생성
    ↓
Phase 2: 유저 페르소나 평가 (워크스루 스크린샷 + gstack /browse 직접 체험)
    ↓
Phase 2.5: gstack /design-review 실행
    ├─ 10개 카테고리 80항목 체크리스트 (Visual Hierarchy, Typography, Color, Spacing, Interaction States, Responsive, Motion, Content, AI Slop Detection, Performance)
    ├─ Design Score A-F + AI Slop Score A-F 산출
    ├─ Fix Loop: 각 finding을 원자적 커밋으로 수정 + before/after 스크린샷
    └─ 산출물: .gstack/design-reports/ + design-baseline.json
    ↓
Phase 2.6: UX 전문가 평가 (gstack /browse 정량 측정 기반)
    ↓
Phase 2.7: 비저너리 평가 (gstack /browse 실제 화면 기반)
    ↓
Phase 3: 분기 판단 (정량 + 정성 통합)
    ├─ 유저 80%+ AND Health Score 70+ AND Design Score B+ AND UX 75%+ AND 비저너리 70%+ → Phase 5
    └─ 그 외 → Phase 4
                ├─ PM: 가설 수립 (gstack 리포트 + 유저 피드백 + 비저너리 종합)
                ├─ Design팀: Stitch 수정 → HTML 재다운로드
                ├─ Dev팀: /investigate로 root cause 기반 수정 (fix 없이는 수정 금지)
                └─ /qa 재실행으로 regression 확인
                    ↓
                Phase 1.5로 복귀
Phase 5: 커밋
    ↓
Phase 6: 새 페르소나 → Phase 1로
```

## 왜 이 프로세스가 중요한가

개발자/디자이너의 관점과 실제 유저의 관점은 다르다. "잘 만들었다"와 "쓰고 싶다"는 전혀 다른 기준이다. 페르소나 기반 테스트는 출시 전에 이 간극을 줄여주고, 다양한 유저 유형의 시각을 미리 반영할 수 있게 한다. 커밋 단위로 기록하면 어떤 개선이 어떤 유저 유형을 만족시켰는지 추적할 수 있다.

gstack 통합으로 "느낌"이 아닌 **측정 가능한 지표**가 추가되어, 정량적 품질 게이트를 통과해야만 정성적 평가로 넘어갈 수 있다.

## 전제 조건

- 앱이 빌드 완료되어 데모 가능한 상태
- Stitch 디자인 레퍼런스 또는 스크린샷이 존재
- PM 산출물 (user-stories.md, prd.md, **screen-flow-graph.md**) 존재
- gstack browse 바이너리 설치됨 (`~/.claude/skills/gstack/browse/dist/browse`)

### gstack browse 셋업 (모든 에이전트 공통)

```bash
_ROOT=$(git rev-parse --show-toplevel 2>/dev/null)
B=""
[ -n "$_ROOT" ] && [ -x "$_ROOT/.claude/skills/gstack/browse/dist/browse" ] && B="$_ROOT/.claude/skills/gstack/browse/dist/browse"
[ -z "$B" ] && B=~/.claude/skills/gstack/browse/dist/browse
if [ -x "$B" ]; then
  echo "READY: $B"
else
  echo "NEEDS_SETUP: cd ~/.claude/skills/gstack/browse && ./setup"
fi
```

## Phase 0: 플로우 그래프 검증

앱의 네비게이션이 "닫힌 그래프"인지 검증한다. QA보다 먼저 실행 — 그래프가 열려있으면 QA 테스트 자체가 무의미하기 때문.

**에이전트**: `dev-team:flow-graph-validator`

**프로세스**:
1. PM의 `screen-flow-graph.md`에서 기대 그래프 추출
2. 실제 코드(App.tsx + 각 컴포넌트)에서 구현 그래프 추출
3. 5가지 검증 수행:
   - 닫힘 (모든 화면에 진입/이탈 경로)
   - 도달 가능성 (entry에서 모든 화면 접근 가능)
   - 탈출 가능성 (모든 화면에서 홈으로 복귀 가능)
   - 양방향 (one-way door 검출)
   - 기대-구현 일치 (missing edge 검출)
4. E2E 저니 4개 이상 추적
5. 상태별 접근성 매트릭스 검증

**산출물**: `docs/pm-outputs/iteration-N-flow-validation.md`

**분기**:
- Dead-end, Orphan, Trap state 1개라도 있으면 → **FAIL** → Dev 수정 필수
- Missing edge (핵심 저니) → **FAIL**
- 모든 검증 통과 → **PASS** → Phase 1로

**왜 QA보다 먼저인가**: QA는 "버튼이 작동하는가"를 테스트하지만, 플로우 검증은 "그 버튼이 존재해야 하는가"를 확인한다. 존재하지 않는 버튼은 테스트할 수 없다.

## Phase 1: 페르소나 생성

PM이 타겟 세그먼트 내에서 유저 페르소나를 정의한다.

**산출물**: `docs/pm-outputs/persona.md` (또는 `persona-N.md`)

포함 항목:
- 이름, 나이, 직업, 성격 (MBTI 등)
- 기술 친숙도 (1-5)
- 일상적으로 사용하는 앱 목록
- 이 앱을 시도하게 된 동기
- 삭제 트리거 (어떤 상황에서 삭제할지)
- 공유 트리거 (어떤 상황에서 공유할지)

**규칙**:
- 타겟 세그먼트 밖의 유저는 만들지 않는다
- 이전 페르소나와 다른 관점/성격/니즈를 가져야 한다
- 실제로 이 앱을 다운로드할 법한 사람이어야 한다

## Phase 1.5: gstack /qa 실행

유저 피드백을 받기 전에, gstack의 체계적 QA 워크플로우로 앱 품질을 정량 측정한다.

### /qa 스킬 호출 방식

오케스트레이터가 `/qa` 스킬의 워크플로우를 **직접** 실행한다 (스킬 호출이 아닌, 방법론을 따라 실행):

**Step 1: 빌드 검증**
```bash
cd {app-dir}
npx tsc --noEmit     # TypeScript 타입 검증
npm run build        # 프로덕션 빌드
```

**Step 2: 브라우저 QA (gstack /qa 워크플로우)**

```bash
# 브라우저 셋업
$B viewport 430x932
$B goto http://localhost:{port}

# Phase 3: Orient — 앱 구조 파악
$B snapshot -i -a -o ".gstack/qa-reports/screenshots/initial.png"
$B links                          # 네비게이션 구조
$B console --errors               # 랜딩 에러 체크

# Phase 4: Explore — 페이지별 체계적 검증
# 각 페이지에서:
$B goto {page-url}
$B snapshot -i -a -o ".gstack/qa-reports/screenshots/{page}.png"
$B console --errors

# Per-page 체크리스트:
# 1. Visual scan — 주석 스크린샷으로 레이아웃 이슈 확인
# 2. Interactive elements — 버튼, 링크, 컨트롤 클릭 검증
# 3. Forms — 입력, 제출, 빈 값/잘못된 값 테스트
# 4. Navigation — 모든 진입/이탈 경로 확인
# 5. States — 빈 상태, 로딩, 에러, 오버플로우
# 6. Console — 인터랙션 후 새 JS 에러?
# 7. Responsiveness:
$B viewport 375x812
$B screenshot ".gstack/qa-reports/screenshots/{page}-mobile.png"
$B viewport 430x932  # 원복

# Phase 5: Document — 이슈 발견 즉시 기록
# Interactive bug → 스크린샷 before/after + snapshot -D + repro steps
# Static bug → 주석 스크린샷 1장 + 설명
```

**Step 3: Health Score 계산**

gstack /qa의 Health Score Rubric을 적용:

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

**Step 4: Fix Loop** (gstack /qa Phase 8 방식)

발견된 이슈를 심각도 순으로 수정:
1. **8a. Locate source** — Grep/Glob으로 소스 파일 탐색
2. **8b. Fix** — 최소한의 수정만. 관련 없는 리팩토링 금지.
3. **8c. Commit** — `git commit -m "fix(qa): ISSUE-NNN — short description"` (이슈당 1커밋)
4. **8d. Re-test** — 해당 페이지로 돌아가 before/after 스크린샷 + console 체크
5. **8e. Classify** — 🟢 fixed / 🟡 partial / 🔴 not fixed

**산출물**:
- `.gstack/qa-reports/qa-report-{domain}-{date}.md` (gstack 표준 리포트)
- `.gstack/qa-reports/baseline.json` (회귀 비교용)
- `docs/pm-outputs/iteration-N-qa-report.md` (PM용 요약)

**분기**:
- Health Score < 70 → **FAIL** → `/investigate`로 root cause 분석 → 수정 → /qa 재실행
- Health Score 70+ → **PASS** → Phase 1.7로 진행

### /investigate 연계 (Health Score < 70일 때)

gstack /investigate의 Iron Law를 따른다: **root cause 없이 수정 금지.**

```
Phase 1: Investigate — 증거 수집 (console, network, screenshot, 코드)
Phase 2: Analyze — 패턴 분석, 원인 좁히기
Phase 3: Hypothesize — root cause 가설 + 검증 방법
Phase 4: Implement — 가설 검증 후에만 수정
```

이 게이트가 있어야 페르소나가 "버튼이 안 눌려요" 대신 "이 흐름이 좀 답답해요" 같은 진짜 UX 피드백에 집중할 수 있다.

## Phase 1.7: gstack /browse 워크스루

QA 통과 후, 평가자들이 사용할 "라이브 화면 증거 패키지"를 생성한다.

**에이전트**: `pm-agent:live-app-walkthrough`

**왜 별도 단계인가**: QA는 "작동하는가"를 테스트하고 수치를 매기고, 워크스루는 "어떻게 보이는가"를 기록한다. 평가자들이 코드가 아닌 실제 화면을 보고 판단할 수 있게 한다.

**프로세스** (gstack /browse 명령어 사용):
```bash
# 1. 전체 스크린 캡처
$B viewport 430x932
$B goto http://localhost:{port}
$B snapshot -i -a -o /tmp/walkthrough-{screen-name}.png  # 주석 스크린샷
$B snapshot -i     # 인터랙티브 요소 텍스트 목록
$B snapshot -C     # 숨겨진 클릭 가능 요소
$B text            # 전체 텍스트 (한국어 확인)
$B console --errors

# 2. 유저 플로우 워크스루 (스냅샷→클릭→디프 패턴)
$B snapshot -i -a -o /tmp/journey-{N}-start.png
$B click @e{N}
$B snapshot -D     # diff로 전환 확인
$B snapshot -i -a -o /tmp/journey-{N}-step{M}.png

# 3. 상태별 화면
$B js "localStorage.clear()"
$B reload
$B snapshot -i -a -o /tmp/state-empty.png  # 빈 상태

# 4. 반응형 확인
$B responsive /tmp/responsive-{screen}
# → mobile (375x812), tablet (768x1024), desktop (1280x720)
```

**산출물**: `docs/pm-outputs/iteration-N-walkthrough.md`

포함 항목:
- 모든 스크린의 주석 스크린샷 (인터랙티브 요소 하이라이트)
- 유저 저니별 전환 기록
- 상태별 화면 (빈 상태, 활성 상태)
- 반응형 스크린샷 (모바일/태블릿/데스크탑)

**이 산출물은 Phase 2~2.7의 모든 평가자가 참조한다.**

## Phase 2: 페르소나 평가

페르소나가 되어 앱을 스크린별로 워크스루하고 평가한다.

**평가 방법**:
1. Phase 1.7에서 생성된 **라이브 워크스루 스크린샷**을 순서대로 확인 (주석 달린 실제 화면)
2. 필요시 gstack /browse로 직접 앱을 조작하여 체험
3. 워크스루의 유저 저니 기록을 따라가며, 각 화면에서 페르소나 시점의 솔직한 반응을 기록 (한국어, 자연스러운 말투)
4. 5개 차원 점수 매기기
5. 종합 만족도 산출

**중요**: 코드가 아닌 **실제 렌더링된 화면**을 기준으로 평가한다. 워크스루 스크린샷이 없으면 Phase 1.7을 먼저 실행해야 한다.

**gstack /browse 직접 체험 (선택)**:
```bash
$B viewport 430x932
$B goto http://localhost:{port}
$B snapshot -i           # 첫 화면 — 뭐가 보이는지
$B click @e{CTA}         # CTA 클릭
$B snapshot -D           # 뭐가 바뀌었는지
# → 페르소나의 시선으로 "이게 뭐지?", "오 이거 좋다", "좀 답답하네" 반응
```

**평가 차원**:

| 차원 | 설명 | 가중치 |
|------|------|--------|
| 첫인상 | 앱이 신뢰감 있고 매력적으로 보이는가? | 20% |
| 사용성 | 설명 없이 사용할 수 있는가? | 25% |
| 재미/몰입 | 재미있는가? 계속 쓰고 싶은가? | 25% |
| 공유욕구 | 친구에게 보여주고 싶은가? | 15% |
| 재방문 의향 | 내일 다시 올 것인가? | 15% |

**종합 만족도** = 각 차원 점수 x 가중치의 합

**산출물**: `docs/pm-outputs/iteration-N-feedback.md`

포함 항목:
- 페르소나 요약 (1문단)
- 스크린별 반응 (페르소나 말투로, 한국어)
- 5개 차원 점수 + 종합 만족도
- Top 3 페인포인트
- Top 3 딜라이트
- PM 가설 (다음 Phase에서 사용)

**솔직함 원칙**: 페르소나는 개발자가 아닌 실제 유저다. "이게 뭐지?", "좀 답답하네", "오 이거 좋다" 같은 자연스러운 반응을 사용한다. 기술적 용어를 쓰지 않는다.

## Phase 2.5: gstack /design-review 실행

유저 페르소나가 "뭔가 이상해"라고 느끼는 것의 정확한 원인을 gstack의 80항목 체크리스트로 진단한다.

### /design-review 워크플로우

에이전트가 gstack /design-review의 방법론을 **직접** 실행한다:

**Phase 1: First Impression**
```bash
$B goto http://localhost:{port}
$B screenshot ".gstack/design-reports/screenshots/first-impression.png"
```
구조적 비평: "이 사이트는 **[무엇]**을 전달한다." → "내 눈이 가장 먼저 가는 3곳은: **[1]**, **[2]**, **[3]**."

**Phase 2: Design System Extraction**
```bash
# 사용 중인 폰트 추출
$B js "JSON.stringify([...new Set([...document.querySelectorAll('*')].slice(0,500).map(e => getComputedStyle(e).fontFamily))])"

# 색상 팔레트 추출
$B js "JSON.stringify([...new Set([...document.querySelectorAll('*')].slice(0,500).flatMap(e => [getComputedStyle(e).color, getComputedStyle(e).backgroundColor]).filter(c => c !== 'rgba(0, 0, 0, 0)'))])"

# 터치 타깃 오디트 (44px 미만 요소 찾기)
$B js "JSON.stringify([...document.querySelectorAll('a,button,input,[role=button]')].filter(e => {const r=e.getBoundingClientRect(); return r.width>0 && (r.width<44||r.height<44)}).map(e => ({tag:e.tagName, text:(e.textContent||'').trim().slice(0,30), w:Math.round(e.getBoundingClientRect().width), h:Math.round(e.getBoundingClientRect().height)})).slice(0,20))"

# 성능 베이스라인
$B perf
```

**Phase 3: Page-by-Page Visual Audit (10개 카테고리, ~80항목)**

각 페이지에서:
```bash
$B goto {url}
$B snapshot -i -a -o ".gstack/design-reports/screenshots/{page}-annotated.png"
$B responsive ".gstack/design-reports/screenshots/{page}"
$B console --errors
$B perf
```

**10개 카테고리 체크리스트** (gstack 원본):

1. **Visual Hierarchy & Composition** (8항목) — 포컬 포인트, 시선 흐름, 비주얼 노이즈, 정보 밀도, z-index, above-the-fold, squint test, 여백
2. **Typography** (15항목) — 폰트 수 ≤3, 스케일 비율, line-height, measure(45-75자), heading 계층, weight 대비, 블랙리스트 폰트(Papyrus/Comic Sans), 제네릭 폰트 감지(Inter/Roboto)
3. **Color & Contrast** (10항목) — 팔레트 ≤12색, WCAG AA 4.5:1 대비, 시맨틱 색상, 색상만 인코딩 금지, 다크모드
4. **Spacing & Layout** (12항목) — 그리드, 4/8px 스케일, 정렬, 리듬, border-radius 계층, safe-area-inset
5. **Interaction States** (10항목) — hover, focus-visible, active, disabled, 스켈레톤, 빈 상태, 에러 메시지, 터치타깃 ≥44px
6. **Responsive Design** (8항목) — 모바일 레이아웃이 디자인적으로 의미 있는지, 터치타깃, 스크롤, 이미지 반응형
7. **Motion & Animation** (6항목) — easing, duration 50-700ms, prefers-reduced-motion, transform/opacity만 애니메이션
8. **Content & Microcopy** (8항목) — 빈 상태, 에러 메시지, 버튼 라벨 구체성, truncation, 능동태
9. **AI Slop Detection** (10항목 블랙리스트) — 보라/인디고 그래디언트, 3-column feature grid, 아이콘 in 색상 원, 모든 것 center, 균일 border-radius, 장식용 blob, 이모지, 좌측 border 카드, 제네릭 hero 문구, 쿠키커터 섹션 리듬
10. **Performance as Design** (6항목) — LCP < 2.0s, CLS < 0.1, 스켈레톤 품질, lazy loading, font-display: swap

**Scoring System**:
- **Design Score: A-F** (10개 카테고리 가중 평균)
- **AI Slop Score: A-F** (독립 등급)
- 카테고리별 A(의도적/세련됨) → B(기본 갖춤) → C(기능적이나 제네릭) → D(눈에 띄는 문제) → F(리워크 필요)
- High finding → 1등급 하락, Medium → 0.5등급 하락, Polish → 메모만

**Phase 4: Interaction Flow Review**
```bash
$B snapshot -i
$B click @e3           # 액션 수행
$B snapshot -D          # diff로 변화 확인
```
응답성, 전환 품질, 피드백 명확성, 폼 polish 평가

**Phase 5: Cross-Page Consistency** — 네비게이션바, 푸터, 컴포넌트 재사용, 톤, 스페이싱 리듬

**Fix Loop** (gstack /design-review Phase 8 방식):
1. 영향도 순으로 정렬
2. 소스 파일 탐색 → 최소 수정 (CSS 우선) → 원자적 커밋
3. before/after 스크린샷 증거
4. `git commit -m "fix(design): FINDING-NNN — short description"`

**산출물**:
- `.gstack/design-reports/design-audit-{domain}-{date}.md`
- `.gstack/design-reports/design-baseline.json` (regression용)
- `docs/pm-outputs/iteration-N-design-review.md` (PM용 요약)

포함 항목:
- First Impression (구조적 비평)
- Inferred Design System (폰트, 색상, 스페이싱)
- 스크린별 디자인 이슈 + AI Slop 감지 결과
- Design Score + AI Slop Score (A-F)
- Quick Wins (최고 임팩트 5개 수정)
- Stitch 수정이 필요한 스크린 목록
- 긴급도 분류: 🔴 통일성 파괴 / 🟡 개선 권장 / 🟢 양호

**PM과의 합의**: 디자이너 리뷰가 완료되면 PM과 디자이너가 다음을 결정한다:
1. 유저 피드백과 디자인 이슈 중 겹치는 문제 (최우선 해결)
2. 유저는 못 느꼈지만 디자인적으로 문제인 것 (이번에 같이 해결할지 다음으로 미룰지)
3. Stitch에서 스크린 재생성/수정이 필요한 범위

## Phase 2.6: UX 전문가 평가 (gstack 정량 측정 기반)

유저 페르소나는 감정적으로 반응하고, 디자이너는 시각적 통일성을 보지만, 구조적 사용성 문제는 둘 다 놓칠 수 있다. UX 전문가는 gstack /browse의 정량 측정으로 "왜 유저가 불편해하는지"의 정확한 원인을 진단한다.

**에이전트**: `pm-agent:ux-specialist`

### gstack 정량 측정 워크플로우

```bash
# Time to First Value 측정
$B viewport 430x932
$B goto http://localhost:{port}
$B snapshot -i              # Step 0: 앱 오픈 — 뭘 해야 하는지 명확한가?
$B click @e{CTA}            # Step 1: CTA 클릭
$B snapshot -D              # 전환 확인
# ... 핵심 가치 도달까지 반복, 단계 수 카운트
# → "Time to First Value: N steps, ~N seconds"

# 터치 타깃 분석
$B snapshot -i -a -o /tmp/ux-touch-targets.png
$B css @e{N} "width"        # 버튼 크기 측정
$B css @e{N} "height"       # 44px 미만이면 문제

# 인지 부하 분석 (화면당 인터랙티브 요소 수)
$B snapshot -i              # @e ref 수 카운트 → 7±2 초과 시 경고

# 상태 전환 명확성
$B click @e{OPTION}
$B snapshot -D              # 선택 전/후 차이가 명확한가?
```

**평가 차원**: 정보 설계(20%), 인터랙션 디자인(25%), 유저 플로우(25%), 인지 부하(20%), 접근성(10%)

**산출물**: `docs/pm-outputs/iteration-N-ux-review.md`

**핵심 지표**:
- Time to First Value (핵심 가치 도달까지 단계/시간) — gstack으로 직접 측정
- 마찰 포인트 맵 — snapshot -D로 전환 실패 지점 탐지
- 터치 타깃 사이즈 — css 명령으로 정확한 px 측정
- 인지 부하 — snapshot -i의 @e ref 수로 정량화
- 색상 대비 / 폰트 크기 접근성 — js 명령으로 computed style 추출

## Phase 2.7: 디자인 비저너리 평가 (혹독한 비전 리뷰)

유저 페르소나와 디자이너가 "괜찮다"고 해도, 그건 "보통"일 수 있다. 디자인 비저너리는 앱이 **위대해질 수 있는 가능성**을 기준으로 평가한다. 점진적 개선이 아니라 드라마틱한 도약을 위한 피드백.

**에이전트**: `design-team:design-visionary`

**gstack 활용**:
```bash
# 3초 인상 테스트
$B viewport 430x932
$B goto http://localhost:{port}
$B screenshot /tmp/visionary-first-impression.png
# → "이 화면을 3초 봤을 때의 즉각적 반응은?"

# 디테일 헌팅
$B snapshot -i -a -o /tmp/visionary-annotated.png
# → 0.5px 수준의 정밀함이 있는지 확인

# AI Slop 체크 (gstack /design-review의 블랙리스트 참조)
# → 보라 그래디언트? 3-column feature grid? 이모지? 제네릭 hero copy?
```

**평가 방식**:
- Steve Jobs/Jony Ive/Dieter Rams 수준의 감각으로 판단
- "이 앱 괜찮네" (70점대) vs "이 앱 숨이 멎는다" (90점대)의 차이를 구분
- 비교 대상은 최고 수준의 앱 (Calm, Headspace, Spotify Wrapped)
- 점진적 제안 금지 — "필터 추가" 대신 "이 화면의 존재 이유를 다시 생각해"
- gstack /design-review의 AI Slop Score와 교차 검증 — Slop Score C 이하면 비저너리도 감점

**산출물**: `docs/pm-outputs/iteration-N-visionary-review.md`

**PM과의 합의**: 비저너리 리뷰가 "드라마틱 개선 제안"을 주면, PM은 이를 유저 피드백/디자이너 리뷰와 종합하여 우선순위를 정한다. 비저너리의 제안은 대담하지만, 구현 가능성과 유저 임팩트를 PM이 판단한다.

**왜 필요한가**: 이전 루프에서 9번 이터레이션을 돌았지만, 디자인 점수는 84에서 정체했고 앱의 시각적 수준은 "깔끔하지만 기억에 남지 않는" 수준에 머물렀다. 유저 페르소나는 기능에 집중하고, 디자이너는 통일성에 집중했기 때문에, 아무도 "이 앱이 진짜 아름다운가?"를 묻지 않았다. gstack의 AI Slop Detection이 "이 앱이 AI가 만든 것처럼 보이는가?"를 최초로 정량 측정한다.

## Phase 3: 분기 판단 (정량 + 정성 통합)

**gstack 정량 지표**와 **평가자 정성 점수**를 모두 확인:

```
통과 조건 (모두 충족):
├─ Health Score ≥ 70 (gstack /qa)
├─ Design Score ≥ B (gstack /design-review)
├─ AI Slop Score ≥ B (gstack /design-review)
├─ 유저 만족도 ≥ 80% (페르소나 평가)
├─ UX 점수 ≥ 75% (UX 전문가)
└─ 비저너리 점수 ≥ 70% (디자인 비저너리)
→ Phase 5 (커밋)

미충족 → Phase 4 (개선)
```

**이전과의 차이**: 이전에는 정성적 점수만으로 판단했다. 이제 gstack의 정량 지표(Health Score, Design Score, AI Slop Score)가 추가되어 "느낌"이 아닌 "측정"으로 게이트를 통과한다.

비저너리 점수는 70%부터 통과 — 90+는 세계적 수준이므로 70 이상이면 "기억에 남는 앱" 수준. 하지만 비저너리의 "드라마틱 개선 제안"은 점수와 관계없이 PM이 검토한다.

## Phase 4: 가설 기반 개선

PM이 **gstack 리포트 + 유저 피드백 + 비저너리 리뷰**에서 개선 가설을 도출하고, Design+Dev 팀이 병렬로 구현한다.

### PM 가설 수립 (gstack 데이터 기반)

gstack 리포트에서 구체적 데이터를 추출하여 가설에 반영:

```
### H{N}: {가설 제목}
> **If** {구체적 변경 사항}을 적용하면,
> **Then** {차원} 점수가 {현재} → {목표}로 상승할 것이다.
> **Because** {유저 심리/행동 근거}.
> **Evidence** gstack {리포트}: {구체적 finding} (e.g., "Health Score: Functional -15 from ISSUE-003")
```

가설을 impact 순으로 정렬하고, 상위 3-5개만 이번 이터레이션에서 실행한다.

### 팀 배분

| 가설 유형 | 담당 팀 | gstack 도구 | 실행 순서 |
|----------|---------|------------|----------|
| 디자인 통일성/스크린 수정 | Design 팀: Stitch 수정 → HTML 재다운로드 | - | 1단계 |
| 비주얼/UX 코드 개선 + 디자인 싱크 | Dev 팀 | `/design-review` findings 참조 | 2단계 |
| 기능 버그 수정 | Dev 팀 | `/investigate` (root cause 필수) | 1단계 |
| 기능/로직/데이터/텍스트 개선 | Dev 팀 | `/qa` regression 모드 | 1단계 |

### Dev 팀 워크플로우 (gstack /investigate 기반)

기능 버그가 있을 때, 무작정 수정하지 않고 gstack /investigate의 4단계를 따른다:

1. **Investigate** — `$B console --errors`, `$B network`, 스크린샷으로 증거 수집
2. **Analyze** — 패턴 분석, 원인 좁히기
3. **Hypothesize** — root cause 가설 수립 + 검증 방법 설계
4. **Implement** — 가설 검증 후에만 수정, `fix(investigate): ROOT-CAUSE — description` 커밋

기능 개선과 디자인 싱크를 함께 수행:

1. **기능 개선**: PM 가설에 따른 로직/데이터/텍스트 변경
2. **디자인 싱크**: Design 팀이 갱신한 Stitch HTML을 React 컴포넌트에 반영 — Tailwind 클래스 복사, 커스텀 CSS 업데이트
3. **빌드 검증**:
```bash
npx tsc --noEmit  # TypeScript 검증
npm run build     # 프로덕션 빌드
```

### Regression 검증 (Phase 1.5 복귀 시)

이전 이터레이션의 baseline.json을 활용하여 회귀 확인:

```bash
# /qa --regression .gstack/qa-reports/baseline.json 방식
# → Health Score 델타, 수정된 이슈, 새 이슈 비교
# → Design Score 이전 등급 vs 현재 등급 비교
```

동일 페르소나로 재평가 + gstack 재실행. 모든 점수가 올랐는지 확인.

## Phase 5: 커밋 (통과 조건 달성 시)

모든 정량+정성 게이트를 통과하면 현재 상태를 커밋한다.

**커밋 메시지 형식**:
```
Persona "{이름}" satisfied ({점수}%)

- {주요 변경사항 1}
- {주요 변경사항 2}
- {주요 변경사항 3}

Iteration: {이터레이션 수}
Dimensions: 첫인상 {n}/사용성 {n}/몰입 {n}/공유 {n}/재방문 {n}
Health Score: {score} | Design: {grade} | AI Slop: {grade}
```

**이터레이션 기록 업데이트**: `docs/pm-outputs/ralph-persona-loop-process.md`의 기록 테이블에 행 추가.

## Phase 6: 새 페르소나로 전환

커밋 후 PM이 새 페르소나를 생성한다.

**새 페르소나 설계 원칙**:
- 같은 타겟 세그먼트 내에서 선택
- 이전 페르소나와 다른 관점 (나이, 성격, 동기, 기술 수준 등)
- 이전 페르소나의 만족을 깨뜨리지 않으면서 새로운 관점을 테스트

**예시 다양성 축**:
- 나이대 (20대 vs 30대 vs 40대)
- 기술 친숙도 (파워유저 vs 캐주얼)
- 동기 (재미 vs 자기탐색 vs 공유)
- 성격 (꼼꼼한 vs 성급한 vs 탐색적)

Phase 1로 돌아가서 반복.

## 누적 개선 원칙

여러 페르소나를 거치면서 앱이 발전할 때, 이전 페르소나의 만족을 깨뜨리지 않아야 한다. 새 페르소나를 위한 변경이 기존 강점을 훼손하는지 항상 확인한다. gstack /qa의 regression 모드로 이전 baseline과 비교하여 점수 하락을 방지한다. 트레이드오프가 발생하면 PM이 판단하여 가중치를 조정한다.

## gstack 명령어 빠른 참조 (에이전트용)

| 목적 | 명령어 |
|------|--------|
| 페이지 접속 | `$B goto {url}` |
| 뷰포트 설정 | `$B viewport 430x932` |
| 주석 스크린샷 | `$B snapshot -i -a -o {path}` |
| 인터랙티브 요소 확인 | `$B snapshot -i` |
| 숨겨진 클릭 요소 | `$B snapshot -C` |
| 요소 클릭 | `$B click @e{N}` |
| 변화 diff | `$B snapshot -D` |
| 요소 보임 확인 | `$B is visible ".selector"` |
| 요소 활성/비활성 | `$B is enabled/disabled ".selector"` |
| CSS 속성 측정 | `$B css @e{N} "width"` |
| 폼 입력 | `$B fill @e{N} "text"` |
| JS 실행 | `$B js "expression"` |
| 콘솔 에러 | `$B console --errors` |
| 네트워크 요청 | `$B network` |
| 성능 측정 | `$B perf` |
| 반응형 3장 | `$B responsive {path-prefix}` |
| 텍스트 추출 | `$B text` |
| 링크 목록 | `$B links` |
| 스크린샷 | `$B screenshot {path}` |
| 체인 실행 | `echo '[["cmd","arg"],...]' \| $B chain` |
| 스크롤 | `$B scroll ".selector"` |
| 쿠키 임포트 | `$B cookie-import {file}` |
| 리로드 | `$B reload` |
| 스토리지 설정 | `$B storage set {key} {value}` |
