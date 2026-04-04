# 아재개그 자판기 — 앱인토스 배포 가이드

## 1단계: 토스 콘솔 계정 준비

1. **토스 콘솔 접속**: https://console-apps-in-toss.toss.im
2. 토스 사업자 계정으로 로그인 (개인 계정 X)
3. "앱 등록" 클릭

### 앱 등록 정보 입력

| 항목 | 값 |
|------|------|
| 앱 이름 (한국어) | 아재개그 자판기 |
| 앱 이름 (영문) | Dad Joke Machine |
| 카테고리 | 엔터테인먼트 / 유틸리티 |
| 앱 설명 | 매일 아재개그 한 잔! 50개의 엄선된 아재개그를 랜덤으로 뽑아보세요. |
| 브랜드 컬러 | #E8651A |
| 아이콘 | 1024x1024 PNG (별도 준비 필요) |

## 2단계: 빌드

```bash
cd apps/dad-joke-machine-toss

# 1. 의존성 설치
npm install

# 2. TypeScript 타입 체크
npx tsc -b --noEmit

# 3. granite 빌드 (.ait 파일 생성)
npx granite build
```

### 빌드 전 체크리스트

- [ ] `granite.config.ts`의 `appName`이 콘솔 등록 이름과 일치
- [ ] `brand.icon`이 빈 문자열 `''`
- [ ] `permissions` 배열이 비어있음 (이 앱은 네이티브 권한 불필요)
- [ ] `console.log` 디버그 코드 제거
- [ ] 하드코딩된 테스트 데이터 없음

### 빌드 에러 대응

| 에러 | 해결 |
|------|------|
| `TDS import with USE_TDS=false` | TDS import 제거 (현재 앱은 TDS 미사용) |
| `granite not found` | `npx granite build` 사용 (bun 아님) |
| `.ait > 100MB` | 이미지/폰트 최적화 필요 |

## 3단계: 배포

```bash
# .ait 파일이 생성되었는지 확인
ls -la .ait/

# 배포 (콘솔 계정 연결 후)
npx ait deploy
```

또는 **수동 업로드**:
1. 토스 콘솔 → 앱 선택 → "빌드 업로드"
2. `.ait` 파일 드래그 앤 드롭
3. "심사 제출" 클릭

## 4단계: 심사

- 심사 기간: **2-3 영업일**
- 심사 기준:
  - 앱이 정상 실행되는지
  - 크래시/에러 없는지
  - 부적절한 콘텐츠 없는지
  - TDS 가이드라인 준수 (비게임 앱)

### TDS 전환 (심사 전 필요할 수 있음)

현재 앱은 `USE_TDS=false` (HTML/CSS)로 개발되었습니다.
토스 심사에서 비게임 앱은 TDS 사용이 권장됩니다.

TDS 전환 시:
```bash
# TDS 설치
npm install @toss/tds-mobile-ait @emotion/react

# main.tsx에서 TDSMobileAITProvider 래핑
# granite.config.ts 업데이트
# package.json scripts를 granite dev/build로 변경
```

## 5단계: 출시 후

### 선택 모듈 추가 (수익화)

| 모듈 | 용도 | 전제조건 |
|------|------|----------|
| `in-app-ad` | 배너/전면/리워드 광고 | 콘솔 광고 슬롯 등록 |
| `promotion` | 토스 포인트 적립 | 토스 로그인 + 지갑 30만원+ |
| `share-reward` | 공유 리워드 | 콘솔 등록 |
| `analytics` | 사용자 행동 추적 | SDK 0.0.26+ |

### 공유 기능 (이미 구현됨)

앱 내 "공유" 버튼이 토스 네이티브 `share()` API를 사용합니다.
토스 앱 안에서는 카카오톡/링크 공유 시트가 열립니다.

## 현재 앱 정보

| 항목 | 값 |
|------|------|
| APP_NAME | `dad-joke-machine` |
| DISPLAY_NAME_KO | 아재개그 자판기 |
| DISPLAY_NAME_EN | Dad Joke Machine |
| USE_TDS | false |
| 네이티브 모듈 | haptic, share, clipboard, storage |
| 콘텐츠 | 50개 아재개그 (하드코딩) |
| 빌드 크기 | ~210KB (gzip 66KB) |
