# 🚨 현재 진행 중인 플랜 — 먼저 읽을 것

> **새 Claude Code 세션이 이 레포를 열면 `CLAUDE.md`보다 이 파일을 먼저 확인하세요.**
> `CLAUDE.md`의 "새 앱 만들기" 섹션은 **레거시 파이프라인**을 가리키며, Plan 4(M7)에서 재작성 예정입니다.

## 지금 진행 중

**Plan 3 / M4 — Agent Teams 테스트 앱 검증** (`plan3/m4-teams-test` 브랜치)

신규 skill 체인 (`pm-orchestrate → stitch-generate → design-sync → dev-orchestrate → ralph-persona-loop → release-prep`)이 실제로 작동하는지 테스트 앱 `하루 감사 일기`로 검증 중입니다.

## 유저가 "앱 만들어줘" 라고 요청하면

**STOP.** 먼저 아래를 확인하세요:

1. 그 요청이 **M4 테스트 앱 (`하루 감사 일기`) 검증과 관련 있는가?**
   - **예** → `docs/superpowers/m4/dispatch-prompt.md`를 따를 것
   - **아니오 / 새 프로덕션 앱** → 유저에게 명시적으로 확인: "지금 Plan 3/M4 검증이 진행 중입니다. 이 앱은 M4와 무관한 사이드트랙인가요, 아니면 M4 테스트 앱(`하루 감사 일기`)으로 진행할까요?"

2. **절대 하지 말 것**:
   - general-purpose subagent로 오케스트레이션 skill 체인을 **우회**하지 말 것
   - 신규 skill 체인이 있는데 레거시 경로 (`app-factory` 구버전, 3-persona Ralph)로 돌리지 말 것
   - `plan3/m4-teams-test` 브랜치에 M4와 무관한 앱을 커밋하지 말 것 (과거 오염 사례: `4b9c6fb feat(argue-gym)`)

## 읽어야 할 파일 (순서)

1. 이 파일 (지금 읽는 중)
2. `docs/superpowers/HANDOFF-2026-04-10-session-restart.md` — 직전 세션 오염 경위와 복구 플랜
3. `docs/superpowers/RESUME-2026-04-10.md` — Plan 0~4 전체 맥락
4. `docs/superpowers/plans/2026-04-10-orchestration-m4-teams-test.md` — Plan 3 본문
5. `docs/superpowers/m4/dispatch-prompt.md` — M4 Executor 진입점
6. `docs/superpowers/specs/2026-04-09-app-factory-orchestration-redesign.md` — 전체 재설계 스펙

## 토큰 무거운 검증은 worktree에서

M4/M5처럼 대량 컨텍스트가 필요한 검증은 **격리된 worktree**에서 새 세션으로 실행하세요:

```bash
git worktree add ../plz-survive-jay-<task> plan3/m4-teams-test
cd ../plz-survive-jay-<task>
claude
# 새 세션 첫 프롬프트로 dispatch-prompt.md 내용을 verbatim 입력
```

메인 세션의 누적 컨텍스트 / 레거시 `CLAUDE.md` 안내로부터 격리됩니다. dispatch-prompt의 "fallback worktree path"를 **기본 경로**로 쓰세요.

## 상태 대시보드

```
Plan 0 (brainstorming + spec)      ✅ DONE
Plan 1 (M1 + M2)                   ✅ DONE
Plan 2 (M3 — 12 skills + 8 cmds)   ✅ DONE
Plan 3 (M4 — Teams test app)       ⚠️  IN PROGRESS (재실행 예정)
Plan 4 (M5+M6+M7)                  ⏳ NOT STARTED
```

파이프라인 마이그레이션 전체 완성도: **~50%**. 신규 skill 체인은 **아직 프로덕션 경로가 아닙니다.**

---
*마지막 업데이트: 2026-04-10. Plan 3 M4가 GO 판정을 받으면 이 파일을 Plan 4 상태로 갱신할 것. M7 완료 시 이 파일을 삭제하고 `CLAUDE.md`를 정식 재작성할 것.*
