# Apps in Toss 플랫폼 지식 베이스

## 기술 스택
- **Frontend**: Vite + React + TypeScript
- **UI**: TDS (Toss Design System, `@toss/tds-mobile-ait`) 또는 일반 HTML/CSS
- **SDK**: `@apps-in-toss/web-framework`
- **빌드 도구**: `granite` (토스 전용, `.ait` 번들 생성)
- **배포**: Toss Console → 2-3일 심사

## 핵심 제약사항
1. `granite`은 반드시 `npx`로 실행 (bun 불가)
2. TDS 컴포넌트는 로컬 브라우저에서 렌더링 불가 (샌드박스 앱에서만)
3. `brand.icon`은 빈 문자열 `''` (null 아님)
4. USE_TDS=false일 때 TDS import 금지 (빌드 에러)
5. 영문 앱 이름: 이모지 불가, 특수문자 `:∙?`만 허용, Title Case

## 12개 네이티브 모듈 및 의존성

| 모듈 | 기능 | 의존성 | 권한 |
|------|------|--------|------|
| toss-login | OAuth 인증 | mTLS 인증서 + 백엔드 서버 필요 | 없음 |
| promotion | 토스 포인트 적립 | **toss-login 필수** (비게임만) | 없음 |
| in-app-purchase | 인앱 결제 | 콘솔 상품 등록 | 없음 |
| in-app-ad | 배너/전면/리워드 광고 | 콘솔 등록 | 없음 |
| share-reward | 바이럴 공유 리워드 | 콘솔 등록 | 없음 |
| analytics | 사용자 행동 추적 | SDK 0.0.26+ | 없음 |
| haptic | 햅틱 피드백 | 없음 | 없음 |
| location | GPS 좌표 | 없음 | location |
| camera-photos | 카메라/갤러리 | 없음 | camera |
| clipboard | 텍스트 복사/붙여넣기 | 없음 | 없음 |
| share | 카카오톡/링크 공유 | 없음 | 없음 |
| storage | 로컬 저장소 | 없음 | 없음 |

## 프로젝트 구조 (생성되는 앱)
```
my-app/
├── granite.config.ts    # 앱 설정 (appName, brand, permissions)
├── package.json         # npm scripts (dev/build/deploy)
├── vite.config.ts
├── src/
│   ├── App.tsx          # 메인 컴포넌트
│   ├── App.css
│   ├── main.tsx         # React 엔트리 (TDS 래퍼)
│   └── [components/]
└── .ait                 # 빌드 결과물
```

## 공유 변수 (워크플로우 간 전달)
- `APP_NAME`: kebab-case (예: `mbti-love-type`)
- `DISPLAY_NAME_KO`: 한국어 이름
- `DISPLAY_NAME_EN`: 영문 이름 (Title Case, 특수문자 `:∙?`만)
- `USE_TDS`: boolean (TDS 사용 여부)
- `APP_DIR`: 프로젝트 절대 경로
- `HAS_CONSOLE`: 토스 콘솔 계정 여부

## 외부 레퍼런스 URL
- TDS 컴포넌트 문서: `https://tossmini-docs.toss.im/tds-mobile/llms-full.txt`
- 앱인토스 API 문서: `https://developers-apps-in-toss.toss.im/llms.txt`
- 토스 콘솔: `https://console-apps-in-toss.toss.im`

## 기존 스킬 위치
- `/Users/wschoe/project/claude-app-in-toss-playbook/SKILL.md`
- Phase 파일: `phases/phase-init.md`, `phase-scaffold.md`, `phase-develop.md`, `phase-verify.md`
- 모듈 파일: `modules/*.md` (12개)
