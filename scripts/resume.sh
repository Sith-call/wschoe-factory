#!/bin/bash
# resume.sh — 토큰 소모 후 새 세션에서 작업을 이어가는 범용 스크립트
#
# 사용법:
#   ./scripts/resume.sh              # 저장된 상태에서 이어가기
#   ./scripts/resume.sh --save       # 현재 작업 상태 저장 (세션 끝나기 전에)
#   ./scripts/resume.sh --status     # 현재 저장된 상태 확인
#   ./scripts/resume.sh --clear      # 상태 초기화
#   ./scripts/resume.sh --auto       # 자동 실행 (claude -p로 바로 전달)
#
# Claude Code 세션 안에서 사용:
#   ! ./scripts/resume.sh --save     # 작업 상태 저장
#   토큰 소모 후 새 세션에서:
#   ! ./scripts/resume.sh            # 이어가기 프롬프트 확인
#   ! ./scripts/resume.sh --auto     # 자동으로 claude 실행

STATE_DIR=".claude/session-state"
STATE_FILE="$STATE_DIR/current-task.md"
HISTORY_DIR="$STATE_DIR/history"

mkdir -p "$STATE_DIR" "$HISTORY_DIR"

case "${1:-resume}" in
  --save)
    # 대화형으로 상태 저장
    echo "📝 현재 작업 상태를 저장합니다."
    echo ""
    echo "작업 설명 (한 줄):"
    read -r TASK_DESC
    echo ""
    echo "완료된 항목 (쉼표로 구분, 없으면 Enter):"
    read -r DONE_ITEMS
    echo ""
    echo "남은 항목 (쉼표로 구분):"
    read -r TODO_ITEMS
    echo ""
    echo "참고할 파일 경로 (쉼표로 구분, 없으면 Enter):"
    read -r REF_FILES
    echo ""
    echo "추가 컨텍스트 (없으면 Enter):"
    read -r EXTRA_CTX

    TIMESTAMP=$(date -u +%Y-%m-%dT%H:%M:%SZ)
    BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")

    cat > "$STATE_FILE" << STATEEOF
---
saved_at: $TIMESTAMP
branch: $BRANCH
cwd: $(pwd)
---

# 이어갈 작업

## 작업 설명
$TASK_DESC

## 완료된 항목
$(echo "$DONE_ITEMS" | tr ',' '\n' | sed 's/^ */- /' | grep -v '^- $')

## 남은 항목
$(echo "$TODO_ITEMS" | tr ',' '\n' | sed 's/^ */- /' | grep -v '^- $')

## 참고 파일
$(echo "$REF_FILES" | tr ',' '\n' | sed 's/^ */- /' | grep -v '^- $')

## 추가 컨텍스트
$EXTRA_CTX
STATEEOF

    echo "✅ 상태 저장됨: $STATE_FILE"
    echo "   새 세션에서 ./scripts/resume.sh 로 이어가세요."
    ;;

  --status)
    if [ -f "$STATE_FILE" ]; then
      echo "📋 저장된 작업 상태:"
      echo "─────────────────────"
      cat "$STATE_FILE"
      echo "─────────────────────"
    else
      echo "❌ 저장된 상태가 없습니다."
    fi
    ;;

  --clear)
    if [ -f "$STATE_FILE" ]; then
      # 히스토리에 백업
      mv "$STATE_FILE" "$HISTORY_DIR/$(date +%Y%m%d-%H%M%S).md"
      echo "🗑️  상태 초기화됨 (히스토리에 백업됨)"
    else
      echo "❌ 초기화할 상태가 없습니다."
    fi
    ;;

  resume|--auto)
    if [ ! -f "$STATE_FILE" ]; then
      echo "❌ 저장된 상태가 없습니다."
      echo "   먼저 ./scripts/resume.sh --save 로 상태를 저장하세요."
      exit 1
    fi

    TASK_CONTENT=$(cat "$STATE_FILE")
    RECENT_COMMITS=$(git log --oneline -5 2>/dev/null)
    DIRTY_FILES=$(git diff --name-only 2>/dev/null | head -10)

    PROMPT="이전 세션에서 작업하던 것을 이어서 해줘.

## 이전 세션 상태
$TASK_CONTENT

## 최근 커밋 (참고용)
$RECENT_COMMITS

## 변경된 파일 (커밋 안 된 것)
$DIRTY_FILES

## 지시사항
1. 위 상태를 읽고 남은 항목부터 이어서 진행
2. 참고 파일이 있으면 먼저 읽어서 컨텍스트 파악
3. 완료된 항목은 다시 하지 않기
4. 각 항목 완료 시 커밋
5. 토큰이 부족해지면 .claude/session-state/current-task.md를 업데이트해서 다음 세션에서 이어갈 수 있게 해"

    echo "🚀 이어가기 프롬프트:"
    echo "═════════════════════"
    echo "$PROMPT"
    echo "═════════════════════"

    if [ "$1" = "--auto" ]; then
      echo ""
      echo "⚡ 자동 실행..."
      claude -p "$PROMPT"
    else
      echo ""
      echo "실행하려면:"
      echo "  ./scripts/resume.sh --auto"
      echo "  또는 claude를 열고 위 내용을 붙여넣기"
    fi
    ;;

  *)
    echo "사용법:"
    echo "  ./scripts/resume.sh              이어가기 프롬프트 확인"
    echo "  ./scripts/resume.sh --save       현재 작업 상태 저장"
    echo "  ./scripts/resume.sh --status     저장된 상태 확인"
    echo "  ./scripts/resume.sh --clear      상태 초기화"
    echo "  ./scripts/resume.sh --auto       자동 실행 (claude -p)"
    ;;
esac
