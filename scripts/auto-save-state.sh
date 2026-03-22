#!/bin/bash
# auto-save-state.sh — Stop/PreCompact hook에서 자동 호출됨
# stdin으로 hook JSON을 받지만, 범용 상태 저장이므로 무시
#
# git diff와 최근 커밋에서 현재 작업 상태를 자동 추론

STATE_DIR=".claude/session-state"
STATE_FILE="$STATE_DIR/current-task.md"
HISTORY_DIR="$STATE_DIR/history"

mkdir -p "$STATE_DIR" "$HISTORY_DIR" 2>/dev/null

# 기존 상태가 있으면 히스토리에 백업
[ -f "$STATE_FILE" ] && cp "$STATE_FILE" "$HISTORY_DIR/$(date +%Y%m%d-%H%M%S).md" 2>/dev/null

TIMESTAMP=$(date -u +%Y-%m-%dT%H:%M:%SZ)
BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")

# 최근 커밋 5개에서 작업 컨텍스트 추출
RECENT_COMMITS=$(git log --oneline -5 2>/dev/null || echo "none")

# 변경된 파일 (커밋 안 된 것)
DIRTY_FILES=$(git diff --name-only 2>/dev/null | head -20)
STAGED_FILES=$(git diff --cached --name-only 2>/dev/null | head -20)

# 마지막 커밋 메시지에서 작업 설명 추출
LAST_MSG=$(git log --format="%s" -1 2>/dev/null || echo "unknown")

cat > "$STATE_FILE" << EOF
---
saved_at: $TIMESTAMP
branch: $BRANCH
trigger: auto (Stop/PreCompact hook)
---

# 이어갈 작업

## 마지막 커밋
$LAST_MSG

## 최근 커밋 이력
$RECENT_COMMITS

## 커밋 안 된 변경 파일
$DIRTY_FILES

## 스테이징된 파일
$STAGED_FILES

## 추가 컨텍스트
이 상태는 세션 종료/컨텍스트 압축 시 자동 저장되었습니다.
더 자세한 컨텍스트가 필요하면 최근 커밋을 확인하세요.
EOF

echo '{"systemMessage":"📝 작업 상태 자동 저장됨. 새 세션: ./scripts/resume.sh --auto"}'
