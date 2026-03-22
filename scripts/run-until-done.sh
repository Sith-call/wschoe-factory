#!/bin/bash
# run-until-done.sh — 토큰 소모 시 자동 대기 후 재개
#
# 사용법:
#   ./scripts/run-until-done.sh "경제 실험실 v4 만들어줘. 100개 용어 기반으로."
#   ./scripts/run-until-done.sh --wait 300 "작업 내용"
#
# 동작:
#   1. claude -p로 작업 실행
#   2. 토큰 소모로 종료되면 대기 (기본 5분)
#   3. 토큰 리프레시 후 자동 재개 (최근 커밋 + 상태 기반)
#   4. 작업 완료될 때까지 반복

set -e

WAIT_SECONDS=300  # 기본 5분 대기
MAX_RETRIES=20     # 최대 20번 재시도

# 인자 파싱
if [ "$1" = "--wait" ]; then
  WAIT_SECONDS="$2"
  shift 2
fi

INITIAL_PROMPT="$*"

if [ -z "$INITIAL_PROMPT" ]; then
  echo "사용법: ./scripts/run-until-done.sh [--wait 초] \"작업 내용\""
  exit 1
fi

STATE_FILE=".claude/session-state/current-task.md"
mkdir -p .claude/session-state

echo "═══════════════════════════════════════"
echo "  run-until-done: 토큰 소모 시 자동 재개"
echo "  대기 시간: ${WAIT_SECONDS}초"
echo "  최대 재시도: ${MAX_RETRIES}회"
echo "═══════════════════════════════════════"
echo ""

ATTEMPT=0

while [ "$ATTEMPT" -lt "$MAX_RETRIES" ]; do
  ATTEMPT=$((ATTEMPT + 1))

  if [ "$ATTEMPT" -eq 1 ]; then
    # 첫 실행: 원래 프롬프트
    PROMPT="$INITIAL_PROMPT

## 자동 재개 모드
이 작업은 토큰 소모 시 자동으로 재개됩니다.
- 작업 도중 토큰이 부족해지면, 현재까지의 진행 상황을 마지막 메시지로 요약해주세요.
- 각 의미 있는 단위 완료 시 git commit 하세요.
- 큰 작업은 작은 단계로 나눠서 각 단계마다 커밋하세요."
  else
    # 재시도: 최근 커밋 기반으로 이어가기
    RECENT_COMMITS=$(git log --oneline -10 2>/dev/null)
    DIRTY_FILES=$(git diff --name-only 2>/dev/null | head -20)
    LAST_MSG=$(git log --format="%s" -1 2>/dev/null)

    PROMPT="이전 세션에서 작업하던 것을 이어서 해줘.

## 원래 작업
$INITIAL_PROMPT

## 현재 상태 (자동 재개 ${ATTEMPT}번째)
마지막 커밋: $LAST_MSG

최근 커밋:
$RECENT_COMMITS

커밋 안 된 변경:
$DIRTY_FILES

## 지시사항
- 위 커밋 이력을 보고 어디까지 했는지 파악
- 남은 작업부터 이어서 진행
- 이미 완료된 작업은 다시 하지 않기
- 각 단계 완료 시 커밋
- 토큰이 부족해지면 진행 상황을 마지막 메시지로 요약"
  fi

  echo "──────────────────────────────────────"
  echo "  시도 $ATTEMPT/$MAX_RETRIES 시작 ($(date '+%H:%M:%S'))"
  echo "──────────────────────────────────────"

  # claude 실행 (종료 코드 무시)
  claude -p "$PROMPT" --verbose 2>&1 || true

  EXIT_CODE=$?

  echo ""
  echo "  세션 종료 (exit: $EXIT_CODE, $(date '+%H:%M:%S'))"

  # 커밋 안 된 변경이 있으면 자동 커밋
  if [ -n "$(git status --porcelain 2>/dev/null | grep -v '^\?')" ]; then
    echo "  커밋 안 된 변경 발견 — 자동 커밋..."
    git add -A 2>/dev/null
    git commit -m "wip: 자동 저장 (run-until-done 시도 $ATTEMPT)" 2>/dev/null || true
  fi

  # 마지막 커밋이 "완료" 관련이면 종료
  LAST=$(git log --format="%s" -1 2>/dev/null)
  if echo "$LAST" | grep -qiE "완료|complete|done|finish|v[0-9]+\.[0-9]+"; then
    echo ""
    echo "✅ 작업 완료 감지! (마지막 커밋: $LAST)"
    break
  fi

  if [ "$ATTEMPT" -lt "$MAX_RETRIES" ]; then
    echo "  ⏳ ${WAIT_SECONDS}초 대기 후 재개..."
    echo "     (Ctrl+C로 중단 가능)"
    sleep "$WAIT_SECONDS"
  fi
done

echo ""
echo "═══════════════════════════════════════"
echo "  총 ${ATTEMPT}번 시도, 최종 커밋:"
git log --oneline -3 2>/dev/null
echo "═══════════════════════════════════════"
