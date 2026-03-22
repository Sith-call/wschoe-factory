#!/bin/bash
# auto-resume.sh — SessionStart hook에서 자동 호출
# 저장된 작업 상태가 있으면 Claude에게 자동으로 전달

STATE_FILE=".claude/session-state/current-task.md"

if [ ! -f "$STATE_FILE" ]; then
  exit 0
fi

# 24시간 이내 상태만 복원
if [ "$(uname)" = "Darwin" ]; then
  FILE_AGE=$(( $(date +%s) - $(stat -f %m "$STATE_FILE") ))
else
  FILE_AGE=$(( $(date +%s) - $(stat -c %Y "$STATE_FILE") ))
fi

if [ "$FILE_AGE" -gt 86400 ]; then
  exit 0
fi

# 상태 내용을 JSON-safe 문자열로 변환
TASK_CONTENT=$(cat "$STATE_FILE" | python3 -c "import sys,json; print(json.dumps(sys.stdin.read()))" | sed 's/^"//;s/"$//')
RECENT_COMMITS=$(git log --oneline -5 2>/dev/null | python3 -c "import sys,json; print(json.dumps(sys.stdin.read()))" | sed 's/^"//;s/"$//')

echo "{\"hookSpecificOutput\":{\"hookEventName\":\"SessionStart\",\"additionalContext\":\"[AUTO-RESUME] 이전 세션에서 이어갈 작업이 있습니다.\\n\\n${TASK_CONTENT}\\n\\n최근 커밋:\\n${RECENT_COMMITS}\\n\\n남은 항목부터 이어서 진행하세요. 완료된 항목은 다시 하지 마세요. 유저에게 이어갈 작업 요약을 먼저 보여주세요.\"}}"
