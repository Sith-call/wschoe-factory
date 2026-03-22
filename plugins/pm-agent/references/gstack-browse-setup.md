# gstack browse Setup (공통)

모든 에이전트가 gstack browse 바이너리를 사용할 때 이 셋업을 먼저 실행한다.

## 바이너리 탐색

```bash
_ROOT=$(git rev-parse --show-toplevel 2>/dev/null)
B=""
[ -n "$_ROOT" ] && [ -x "$_ROOT/.claude/skills/gstack/browse/dist/browse" ] && B="$_ROOT/.claude/skills/gstack/browse/dist/browse"
[ -z "$B" ] && B=~/.claude/skills/gstack/browse/dist/browse
if [ -x "$B" ]; then
  echo "READY: $B"
else
  echo "NEEDS_SETUP: cd ~/.claude/skills/gstack/browse && ./setup"
fi
```

## 왜 gstack browse인가

| 방식 | 속도 | 상태 유지 |
|------|------|----------|
| Playwright CLI (`npx -p playwright ...`) | 3-5초/스크린 | 매번 초기화 |
| gstack browse (`$B`) | 100ms/명령 | 쿠키/localStorage 유지 |

10스크린 기준: Playwright 30-50초 vs gstack 1-2초.

## 빠른 명령어 참조

| 목적 | 명령어 |
|------|--------|
| 페이지 접속 | `$B goto {url}` |
| 뷰포트 설정 | `$B viewport 430x932` |
| 주석 스크린샷 | `$B snapshot -i -a -o {path}` |
| 인터랙티브 요소 확인 | `$B snapshot -i` |
| 숨겨진 클릭 요소 | `$B snapshot -C` |
| 요소 클릭 | `$B click @e{N}` |
| 변화 diff | `$B snapshot -D` |
| 요소 보임 확인 | `$B is visible ".selector"` |
| CSS 속성 측정 | `$B css @e{N} "width"` |
| 폼 입력 | `$B fill @e{N} "text"` |
| JS 실행 | `$B js "expression"` |
| 콘솔 에러 | `$B console --errors` |
| 네트워크 요청 | `$B network` |
| 성능 측정 | `$B perf` |
| 반응형 3장 | `$B responsive {path-prefix}` |
| 텍스트 추출 | `$B text` |
| 링크 목록 | `$B links` |
| 스크린샷 | `$B screenshot {path}` |
| 체인 실행 | `echo '[["cmd","arg"],...]' \| $B chain` |
| 스크롤 | `$B scroll ".selector"` |
| 쿠키 임포트 | `$B cookie-import {file}` |
| 리로드 | `$B reload` |
| 스토리지 설정 | `$B storage set {key} {value}` |
