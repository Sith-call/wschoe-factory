#!/bin/bash
# save-state.sh — Claude Code 세션 안에서 호출하여 작업 상태를 저장
#
# Claude가 직접 호출:
#   bash scripts/save-state.sh "작업 설명" "완료 항목" "남은 항목" "참고 파일" "추가 컨텍스트"
#
# 예시:
#   bash scripts/save-state.sh \
#     "경제 실험실 전문가 Ralph Loop" \
#     "즉시 수정 4건 완료, AD-AS 모델 추가" \
#     "GDP갭 모델, 구축효과 모델, 유동성 함정, 매몰비용, NotebookLM 재검증" \
#     "apps/econ-lab/src/data/concepts.ts, apps/econ-lab/docs/pm-outputs/expert-review.md" \
#     "NotebookLM notebook_id: 11a5ba69-31bd-47e1-8899-678a107be601"

STATE_DIR=".claude/session-state"
STATE_FILE="$STATE_DIR/current-task.md"
HISTORY_DIR="$STATE_DIR/history"

mkdir -p "$STATE_DIR" "$HISTORY_DIR"

# 기존 상태가 있으면 히스토리에 백업
[ -f "$STATE_FILE" ] && cp "$STATE_FILE" "$HISTORY_DIR/$(date +%Y%m%d-%H%M%S).md"

TASK_DESC="${1:-작업 설명 없음}"
DONE_ITEMS="${2:-}"
TODO_ITEMS="${3:-}"
REF_FILES="${4:-}"
EXTRA_CTX="${5:-}"

TIMESTAMP=$(date -u +%Y-%m-%dT%H:%M:%SZ)
BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")

cat > "$STATE_FILE" << EOF
---
saved_at: $TIMESTAMP
branch: $BRANCH
cwd: $(pwd)
---

# 이어갈 작업

## 작업 설명
$TASK_DESC

## 완료된 항목
$(echo "$DONE_ITEMS" | tr ',' '\n' | sed 's/^ */- /')

## 남은 항목
$(echo "$TODO_ITEMS" | tr ',' '\n' | sed 's/^ */- /')

## 참고 파일
$(echo "$REF_FILES" | tr ',' '\n' | sed 's/^ */- /')

## 추가 컨텍스트
$EXTRA_CTX
EOF

echo "✅ 상태 저장: $STATE_FILE"
