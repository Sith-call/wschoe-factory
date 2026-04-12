# App Factory — 앱 공장

아이디어 → PM 기획 → 개발 → 출시까지 에이전트 팀으로 자동화하는 프로젝트.

## 디렉토리 구조

```
plz-survive-jay/
├── plugins/                    # 재사용 가능한 에이전트 플러그인
│   ├── pm-agent/               # PM 팀 — 기획/전략/GTM
│   │   ├── skills/             # pm-orchestrate, app-factory, ralph-persona-loop, release-prep
│   │   ├── agents/             # pm-analyst, pm-discovery, pm-strategist 등 (worker)
│   │   └── agents-legacy/      # 레거시 오케스트레이터 (비활성, 롤백용 보존)
│   ├── dev-team/               # 개발 팀 — 설계/구현/테스트/리뷰
│   │   ├── skills/             # dev-orchestrate
│   │   ├── agents/             # dev-architect, dev-frontend, dev-backend 등 (worker)
│   │   └── agents-legacy/      # 레거시 (비활성)
│   ├── design-team/            # 디자인 팀 — Stitch + HTML fallback
│   │   ├── skills/             # stitch-generate, design-sync
│   │   ├── agents/             # design-screen-generator, design-visionary 등 (worker)
│   │   └── agents-legacy/      # 레거시 (비활성)
│   ├── agent-maker/            # 메타 팀 — 에이전트 생성/검증
│   └── ait-team/               # 앱인토스 전용 — 토스 미니앱
│
├── apps/                       # 생산된 앱들 (앱별 독립 디렉토리)
│   └── {app-name}/             # 각 앱
│       ├── docs/               # 기술 문서
│       │   ├── pm-outputs/     # PM 산출물 (PRD, 전략, GTM, Ralph 리포트 등)
│       │   ├── design/         # 디자인 산출물 (story-screen-map, sync-criteria 등)
│       │   └── ground-truth/   # Ground-truth PNG/HTML (Stitch 또는 HTML fallback)
│       ├── src/                # 소스 코드
│       └── dist/               # 빌드 산출물
│
└── CLAUDE.md                   # 이 파일
```

## 새 앱 만들기 — 완전 자동화

### 원커맨드 실행
```
"[앱 아이디어] 만들어줘"
→ /app-factory 스킬이 전체 5-stage 파이프라인 자동 실행
```

### 파이프라인 (Skill 체인, 파일시스템 핸드오프)
```
Stage 0: 초기화 (app-factory)
  → mkdir + TodoWrite 시드
     │ 파일시스템 게이트
Stage 1: PM 기획 (pm-orchestrate)
  → PRD + 유저스토리 + 스크린 플로우 + 페르소나
  → Gate 1: 4개 필수 파일 존재 + 내용 검증
     │
Stage 2a: 디자인 생성 (stitch-generate)
  → Stitch MCP → ground-truth PNG (실패 시 HTML/CSS fallback)
  → Gate 2a: ≥3 PNG + stitch-project-id + story-screen-map
     │
Stage 2b: 디자인 싱크 (design-sync)
  → React scaffold + 디자인 시스템 적용
  → Gate 2b: sync-criteria + App.tsx
     │
Stage 3: 개발 (dev-orchestrate)
  → 기능 구현 + 데모 모드 + npm run build
  → Gate 3: 빌드 성공 + gstack browse 검증
     │
Stage 4: 품질 루프 (ralph-persona-loop)
  → 6-evaluator 병렬 평가 (3 페르소나 + 디자인 + UX + PRD)
  → 만족도 80%+ 달성까지 반복 (최대 5 iteration)
  → Gate 4: 전원 threshold 충족
     │
Stage 5: 출시 준비 (release-prep)
  → RELEASE.md + 최종 빌드 + DESIGN_RULES 학습
```

**핸드오프 방식**: 텍스트 신호(`*_STAGE_COMPLETE`) 없음. 모든 스테이지 전환은 파일시스템 게이트 (파일 존재 + 내용 검증) + TodoWrite로 처리.

### 수동 실행 (개별 Stage)
각 Stage의 스킬을 독립적으로 실행할 수 있다:
- `/pm-orchestrate`: PM 기획만
- `/stitch-generate`: Stitch 스크린 생성만
- `/design-sync`: 디자인 싱크만
- `/dev-orchestrate`: 개발만
- `/ralph-persona-loop`: 품질 루프만
- `/release-prep`: 출시 준비만

### 자동화 실행 (headless)
`claude -p` 모드로 전체 파이프라인을 비대화식 실행:
```bash
./docs/superpowers/m4/dispatch.sh              # foreground
./docs/superpowers/m4/dispatch.sh --background  # background (로그 파일 생성)
```
dispatch.sh는 `--plugin-dir`로 5개 플러그인을 로드하고, `--dangerously-skip-permissions`로 네트워크 sandbox를 해제한다.

### 앱인토스 배포 (선택)
```
"앱인토스로 배포해줘"
→ ait-team 실행 (scaffold→모듈 통합→granite 빌드→배포)
```

## 플러그인 로딩

플러그인은 `--plugin-dir` 플래그로 세션 시작 시 로드한다. `claude plugins install`로 mid-session 설치하면 Skill catalogue에 반영되지 않는다 (session start 시 freeze).

### 대화형 세션
```bash
claude --plugin-dir ./plugins/pm-agent \
       --plugin-dir ./plugins/dev-team \
       --plugin-dir ./plugins/design-team \
       --plugin-dir ./plugins/agent-maker \
       --plugin-dir ./plugins/ait-team
```

### headless 실행
dispatch.sh가 자동으로 `--plugin-dir` 플래그를 포함한다.

## 절대 규칙: 스크린샷 없는 QA/평가는 무효
**QA, Ralph Loop, 페르소나 평가, 디자인 리뷰 등 앱 품질을 판단하는 모든 작업에서 반드시 gstack browse로 실제 브라우저 테스트를 수행하고, 스크린샷을 첨부해야 한다. 코드만 읽고 점수를 매기는 것은 금지.**
- 에이전트에게 QA를 위임할 때 "gstack browse로 실제 테스트하고 스크린샷 첨부"를 명시적으로 지시할 것
- 스크린샷 없는 피드백 리포트는 거부할 것

## 컨벤션
- 앱 이름은 kebab-case (예: `form-coach`, `toss-fortune`)
- PM 산출물은 항상 `docs/pm-outputs/`에 저장
- 기술 문서는 `docs/`에 저장 (TRD.md, ARCHITECTURE.md)
- 각 앱은 독립적으로 빌드/배포 가능해야 함

## 디자인 룰 (필독)
**새 앱을 만들 때 반드시 `DESIGN_RULES.md`를 읽고 따를 것.**
- AI 안티패턴 방지 17개 규칙 (색상 복붙, 그라디언트 텍스트, fadeInUp, 중앙 정렬, 카드 네스팅 등)
- 앱마다 고유한 색상/폰트/네비게이션/애니메이션 필수
- 체크리스트 13항목으로 출시 전 검증

## 세션 이어가기
토큰 소모 후 새 세션에서 작업을 이어가는 방법:
- **상태 저장**: `bash scripts/save-state.sh "작업 설명" "완료 항목" "남은 항목" "참고 파일" "추가 컨텍스트"`
- **이어가기**: `./scripts/resume.sh --auto` (자동) 또는 `./scripts/resume.sh` (프롬프트 확인)
- **상태 확인**: `./scripts/resume.sh --status`
- 토큰이 부족해지면 Claude에게 "상태 저장해" 라고 말하면 save-state.sh로 현재 진행 상황을 저장함

## 프로덕트 루프 (필독)
**앱을 만들 때 `PRODUCT_LOOP.md`의 v2 루프를 따를 것.**
- 5-stage 파이프라인: PM → 디자인 → 개발 → **Ralph 반복 루프** → 출시
- **Ralph 루프 = 핵심**: 6-evaluator 병렬 평가 (페르소나 3명 + Design Visionary + UX + PRD Coverage) → P0/P1 수정 → 재평가, **전원 threshold 달성까지 반복** (최대 5회)
- 핵심 원칙: 디자인 먼저, 피드백-구현 분리, 학습 축적, 반복 수렴
- **gstack browse 필수**: 모든 평가에 실제 브라우저 스크린샷 첨부 (아래 절대 규칙 참조)
