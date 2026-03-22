# App Factory — 앱 공장

아이디어 → PM 기획 → 개발 → 출시까지 에이전트 팀으로 자동화하는 프로젝트.

## 디렉토리 구조

```
plz-survive-jay/
├── plugins/                    # 재사용 가능한 에이전트 플러그인
│   ├── pm-agent/               # PM 팀 (7 agents) — 기획/전략/GTM
│   ├── dev-team/               # 개발 팀 (12 agents) — 설계/구현/테스트/리뷰
│   ├── design-team/            # 디자인 팀 (5 agents) — Stitch 기반 이미지 디자인
│   ├── agent-maker/            # 메타 팀 (5 agents) — 에이전트 생성/검증
│   └── ait-team/               # 앱인토스 전용 (5 agents) — 토스 미니앱
│
├── apps/                       # 생산된 앱들 (앱별 독립 디렉토리)
│   └── {app-name}/             # 각 앱
│       ├── docs/               # 기술 문서 (TRD, ARCHITECTURE.md)
│       │   └── pm-outputs/     # PM 산출물 (PRD, 전략, GTM 등)
│       ├── src/                # 소스 코드
│       └── __tests__/          # 테스트
│
└── CLAUDE.md                   # 이 파일
```

## 새 앱 만들기 — 완전 자동화

### 원커맨드 실행
```
"[앱 아이디어] 만들어줘"
→ app-factory 마스터 오케스트레이터가 전체 파이프라인 자동 실행
```

### 파이프라인 (자동 연결)
```
Stage 1: PM 기획 (pm-orchestrator)
  → PRD + 유저스토리 + 스크린 플로우
  → 완료 신호: PM_STAGE_COMPLETE
     │ 자동 전환
Stage 2: 디자인 (stitch-workflow → design-sync-lead)
  → Stitch 스크린 → React 앱 시각 동기화
  → 완료 신호: DESIGN_STAGE_COMPLETE
     │ 자동 전환
Stage 3: 개발 (dev-orchestrator)
  → 기능 구현 + 데모 모드
  → 완료 신호: DEV_STAGE_COMPLETE
     │ 자동 전환
Stage 4: 품질 루프 (ralph-persona-loop)
  → 유저 만족도 80%+ 달성까지 반복
  → 완료 신호: QUALITY_STAGE_COMPLETE
     │ 자동 전환
Stage 5: 출시 준비
```

### 수동 실행 (개별 Stage)
각 Stage를 독립적으로 실행할 수도 있다:
- `pm-orchestrator`: PM 기획만
- `design-sync-lead`: 디자인 싱크만
- `dev-orchestrator`: 개발만
- `ralph-persona-loop`: 품질 루프만

### 앱인토스 배포 (선택)
```
"앱인토스로 배포해줘"
→ ait-team 실행 (scaffold→모듈 통합→granite 빌드→배포)
```

## 플러그인 설치
```bash
claude plugins add ./plugins/pm-agent
claude plugins add ./plugins/dev-team
claude plugins add ./plugins/design-team
claude plugins add ./plugins/agent-maker
claude plugins add ./plugins/ait-team
```

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
- 8단계 파이프라인: 시장 조사 → 기획 → 디자인 시스템 → 개발 → PM 검증 → QA → **Ralph 반복 루프** → 룰 업데이트
- **Ralph 루프 = 핵심**: 페르소나 3명 + Design Visionary가 병렬 피드백 → 통합 구현 → 재피드백, **전원 80%+ 달성까지 반복**
- 핵심 원칙: 디자인 먼저, 피드백-구현 분리, 학습 축적, 반복 수렴
