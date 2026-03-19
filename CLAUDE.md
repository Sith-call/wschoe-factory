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

## 새 앱 만들기 워크플로우

### 1단계: PM 팀으로 기획
```
"[앱 아이디어]를 기획해줘"
→ pm-agent 팀 실행 (전략/디스커버리/실행/GTM)
→ 산출물: apps/{app-name}/docs/pm-outputs/
```

### 1.5단계: 디자인 팀으로 UI 생성
```
"유저 스토리 기반으로 디자인 만들어줘"
→ design-team 실행 (Stitch MCP → 스크린 이미지 생성)
→ 산출물: Stitch 프로젝트 (스크린 이미지 + HTML) + docs/pm-outputs/design-spec.md
```

### 2단계: 개발 팀으로 구현
```
"PRD 기반으로 개발해줘"
→ dev-team 팀 실행 (TRD→아키텍처→백엔드+프론트엔드→QA)
→ 산출물: apps/{app-name}/src/, __tests__/
```

### 3단계: (앱인토스인 경우) AIT 팀으로 토스 통합
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

## 컨벤션
- 앱 이름은 kebab-case (예: `form-coach`, `toss-fortune`)
- PM 산출물은 항상 `docs/pm-outputs/`에 저장
- 기술 문서는 `docs/`에 저장 (TRD.md, ARCHITECTURE.md)
- 각 앱은 독립적으로 빌드/배포 가능해야 함
