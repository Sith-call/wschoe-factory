---
name: ralph-persona-loop
description: |
  gstack 기반 유저 페르소나 앱 개선 루프. gstack /qa, /design-review, /investigate, /browse 스킬을 활용하여 체계적으로 앱 품질을 개선한다. PM이 타겟 세그먼트 내 페르소나를 만들고, gstack이 정량적으로 앱을 테스트한 뒤, 유저 만족도 80%가 될 때까지 반복 개선한다.

  Use when: "유저 테스트 루프", "페르소나 피드백 루프", "ralph persona loop", "ralph loop", "앱 개선 이터레이션", "유저 만족도 올려", "사용자 관점에서 개선", "품질 루프", "앱 QA 루프", or after an app is built and needs iterative quality improvement through simulated user testing. Also use when the user says "이거 좀 다듬어", "유저 테스트 돌려", "피드백 받아보자", or wants to polish an app before launch.
---

# Ralph Persona Loop (gstack-integrated)

gstack의 검증된 워크플로우와 유저 페르소나 평가를 결합하여, **정량적 품질 게이트 + 정성적 유저 평가**로 앱을 반복 개선하는 프로세스.

## 핵심 철학: Boil the Lake

80%에서 타협하지 않고 완성도를 끝까지 올린다. Health Score A등급, Design Score A등급, 유저 만족도 90%를 목표.

## 절대 규칙: 스크린샷 없는 점수는 무효

**모든 평가 Phase(1.5, 1.7, 2, 2.5, 2.6, 2.7)에서 gstack browse로 실제 화면을 열고, 스크린샷을 찍고, Read 도구로 확인한 후에만 점수를 매길 수 있다.**

위반 시 해당 이터레이션 전체가 무효. 처음부터 다시 실행해야 한다.

이 규칙이 존재하는 이유: 2026-03-22에 Ralph Loop 4회 이터레이션(12번의 평가)을 코드 리뷰만으로 수행했다가, 실제 브라우저로 확인하니 디자인이 미적용 상태였음. 코드에 올바른 클래스가 있어도 Tailwind config 불일치, CDN 로딩 실패, CSS 우선순위 문제 등으로 실제 렌더링은 다를 수 있다.

### 필수 증거 체크리스트 (이터레이션당)

```
□ Phase 1.5: gstack /qa 실행 — $B goto + $B console --errors + Health Score 스크린샷
□ Phase 1.7: 모든 화면 $B screenshot + Read로 확인
□ Phase 2: 페르소나 평가 — 스크린샷 기반으로만 점수 기록
□ Phase 2.5: /design-review — $B snapshot -i -a + Design Score 스크린샷
□ Phase 2.6: UX 평가 — $B js로 정량 측정 + 스크린샷
□ Phase 2.7: 비저너리 — $B screenshot + Read로 3초 인상 확인
```

**"코드를 읽어보니 잘 구현됨" 같은 평가는 금지.** 반드시 "스크린샷에서 확인한 결과"로만 평가한다.

### 에이전트에게 위임 시 필수 지시문

Ralph Loop을 에이전트에게 위임할 때 반드시 다음을 포함:
```
"gstack browse ($B)로 실제 브라우저에서 앱을 열고 테스트하세요.
모든 평가에 $B screenshot으로 스크린샷을 찍고 Read 도구로 확인 후 점수를 매기세요.
코드만 읽고 점수를 매기면 안 됩니다. 스크린샷 없는 피드백 리포트는 무효입니다."
```

## 전체 플로우

```
Phase 0: 플로우 그래프 검증 (flow-graph-validator)
    ├─ PASS → Phase 1
    └─ FAIL → Dev 수정 → Phase 0 재검증
    ↓
Phase 1: 페르소나 생성 (PM)
    ↓
Phase 1.5: gstack /qa 실행 (Standard tier)
    ├─ Health Score 70+ → Phase 1.7
    └─ Health Score < 70 → /investigate → 수정 → /qa 재실행
    ↓
Phase 1.7: gstack /browse 워크스루 (증거 패키지 생성)
    ↓
Phase 2: 유저 페르소나 평가 (워크스루 + /browse 체험)
    ↓
Phase 2.5: gstack /design-review (80항목 체크리스트)
    ↓
Phase 2.6: UX 전문가 평가 (정량 측정 기반)
    ↓
Phase 2.7: 비저너리 평가 (실제 화면 기반)
    ↓
Phase 3: 분기 판단 (정량 + 정성 통합)
    ├─ 전원 통과 → Phase 5 (커밋)
    └─ 미충족 → Phase 4 (가설 기반 개선) → Phase 1.5 복귀
    ↓
Phase 5: 커밋
    ↓
Phase 6: 새 페르소나 → Phase 1로
```

각 Phase의 상세 워크플로우는 `references/ralph-phase-details.md`를 참조.
gstack browse 셋업은 `references/gstack-browse-setup.md`를 참조.

## gstack 스킬 매핑

| Ralph Loop Phase | gstack 스킬 | 역할 |
|-----------------|-------------|------|
| Phase 1.5 QA | `/qa` (Standard tier) | Health Score 계산, 자동 버그 수정 |
| Phase 1.7 워크스루 | `/browse` | 주석 스크린샷, 저니 캡처 |
| Phase 2.5 디자인 | `/design-review` | 80항목 체크리스트, AI Slop Detection |
| Phase 4 디버깅 | `/investigate` | Root cause 기반 수정 |

## 전제 조건

- 앱이 빌드 완료되어 데모 가능한 상태
- Stitch 디자인 레퍼런스 또는 스크린샷이 존재
- PM 산출물 (user-stories.md, prd.md, **screen-flows.md**) 존재
- gstack browse 바이너리 설치됨

## Phase 1: 페르소나 생성

PM이 타겟 세그먼트 내에서 유저 페르소나를 정의한다.

**산출물**: `docs/pm-outputs/persona.md` (또는 `persona-N.md`)

포함 항목:
- 이름, 나이, 직업, 성격 (MBTI 등)
- 기술 친숙도 (1-5)
- 일상적으로 사용하는 앱 목록
- 이 앱을 시도하게 된 동기
- 삭제 트리거 / 공유 트리거

**규칙**:
- 타겟 세그먼트 밖의 유저는 만들지 않는다
- 이전 페르소나와 다른 관점/성격/니즈
- 실제로 이 앱을 다운로드할 법한 사람

## Phase 3: 분기 판단

```
통과 조건 (모두 충족):
├─ Health Score ≥ 70 (gstack /qa)
├─ Design Score ≥ B (gstack /design-review)
├─ AI Slop Score ≥ B (gstack /design-review)
├─ 유저 만족도 ≥ 80% (페르소나 평가)
├─ UX 점수 ≥ 75% (UX 전문가)
└─ 비저너리 점수 ≥ 70% (디자인 비저너리)
→ Phase 5 (커밋)

미충족 → Phase 4 (개선) → Phase 1.5 복귀
```

## Phase 5: 커밋

```
Persona "{이름}" satisfied ({점수}%)

- {주요 변경사항 1}
- {주요 변경사항 2}
- {주요 변경사항 3}

Iteration: {이터레이션 수}
Dimensions: 첫인상 {n}/사용성 {n}/몰입 {n}/공유 {n}/재방문 {n}
Health Score: {score} | Design: {grade} | AI Slop: {grade}
```

## Phase 6: 새 페르소나로 전환

**다양성 축**:
- 나이대 (20대 vs 30대 vs 40대)
- 기술 친숙도 (파워유저 vs 캐주얼)
- 동기 (재미 vs 자기탐색 vs 공유)
- 성격 (꼼꼼한 vs 성급한 vs 탐색적)

이전 페르소나의 만족을 깨뜨리지 않으면서 새로운 관점 테스트. gstack /qa regression 모드로 점수 하락 방지.

## 왜 이 프로세스가 중요한가

개발자/디자이너의 관점과 실제 유저의 관점은 다르다. "잘 만들었다"와 "쓰고 싶다"는 전혀 다른 기준. gstack 통합으로 "느낌"이 아닌 **측정 가능한 지표**가 추가되어, 정량적 품질 게이트를 통과해야만 정성적 평가로 넘어간다.

## Pipeline Handoff — 완료 신호

모든 게이트를 통과하고 최종 커밋이 완료되면:

```
## QUALITY_STAGE_COMPLETE
- app_name: {app-name}
- app_dir: apps/{app-name}/
- total_iterations: {N}
- personas_satisfied: [{이름1} ({점수1}%), {이름2} ({점수2}%)]
- health_score: {score}
- design_score: {grade}
- ai_slop_score: {grade}
- ux_score: {score}%
- visionary_score: {score}%
→ NEXT: 출시 준비 (커밋, CHANGELOG, 배포)
```

## Pipeline Context — 상위 Stage에서 받는 입력

app-factory가 이 스킬을 호출할 때 전달하는 정보:
- `app_name`: 앱 이름
- `dev_server`: 개발 서버 URL (localhost:{port})
- `app_dir`: 앱 디렉토리 경로

이 정보가 없으면 현재 작업 디렉토리에서 `apps/` 하위를 탐색하여 가장 최근 앱을 찾는다.
