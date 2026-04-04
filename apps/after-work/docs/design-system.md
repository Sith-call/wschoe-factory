# 퇴근하면 뭐하지? -- 디자인 시스템

> 적막한 따뜻함. 밤에 혼자 카페에서 노트 펴놓은 느낌.
> 앱은 말이 적다. 사용자의 한 줄이 주인공이다.

---

## 1. 색상 팔레트

앱의 핵심 감정은 "조용한 저녁 시간"이다. 차가운 미니멀이 아니라 따뜻한 적막함.
크림색 종이 위에 연필로 쓴 한 줄 같은 톤.

| 토큰 | Hex | 용도 |
|---|---|---|
| `--color-primary` | `#5C4B3C` | 주요 액션, 강조 텍스트. 진한 웜 브라운 |
| `--color-secondary` | `#8B7E6A` | 보조 버튼 테두리, 서브 액션 |
| `--color-surface` | `#F5F0E8` | 카드 배경. 오래된 종이 |
| `--color-background` | `#FAF7F2` | 전체 배경. 따뜻한 화이트 |
| `--color-text` | `#2E2A25` | 본문 텍스트. 거의 검정이지만 순수 블랙 아님 |
| `--color-text-secondary` | `#9E9589` | 날짜, 캡션, 비활성 텍스트 |
| `--color-accent` | `#C4724E` | 저장 완료 피드백, 이번 주 하이라이트. 테라코타 |
| `--color-danger` | `#B44D4D` | 삭제 확인 |

### 사용 원칙
- 배경은 항상 `background` 또는 `surface` 둘 중 하나. 둘을 겹치지 않는다.
- `accent`는 화면당 1~2곳만. 시선을 잡아끄는 용도.
- 그라디언트 사용하지 않는다. 단색만.

---

## 2. 폰트 조합

건조하고 또렷하되 차갑지 않은 조합.

### 한국어: Pretendard
```
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css');
```
- Regular (400): 본문, 기록 텍스트
- Medium (500): 레이블, 날짜
- SemiBold (600): 소제목
- Bold (700): H1 프롬프트 텍스트만

### 영문/숫자: Sora
```
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&display=swap');
```
- Light (300): 숫자 강조 (기록 횟수 등)
- Regular (400): 본문 내 영문
- Medium (500): 레이블
- SemiBold (600): 앱 이름

### 적용
```css
font-family: 'Pretendard Variable', 'Sora', system-ui, sans-serif;
```

---

## 3. 타이포그래피 스케일

| 용도 | 크기 | 무게 | line-height | letter-spacing | 정렬 |
|---|---|---|---|---|---|
| 프롬프트 (오늘의 질문) | 22px | Bold 700 | 1.5 | -0.01em | 중앙 |
| 기록 텍스트 (사용자 입력) | 18px | Regular 400 | 1.6 | 0 | 좌측 |
| 소제목 (이번 주, 지난 기록) | 15px | SemiBold 600 | 1.4 | 0.02em | 좌측 |
| 본문/설명 | 14px | Regular 400 | 1.5 | 0 | 좌측 |
| 캡션/날짜 | 12px | Medium 500 | 1.4 | 0.04em | 좌측 |
| 레이블 | 11px | Medium 500 | 1.3 | 0.06em | 좌측 |

### 원칙
- 프롬프트만 중앙 정렬. 나머지 전부 좌측 정렬.
- 텍스트 색상은 단색. 그라디언트 텍스트 사용 안 함.
- H1(프롬프트)만 Bold. 나머지 제목은 SemiBold 이하.

---

## 4. Border-Radius 전략

이 앱은 "노트"의 느낌이다. 날카로움과 부드러움을 의도적으로 섞는다.

| 요소 | radius | 이유 |
|---|---|---|
| 입력 필드 | `2px` | 종이 위의 줄. 거의 직각 |
| 카드 (기록, 이번 주) | `8px` | 약간의 부드러움만 |
| 버튼 (Primary) | `6px` | 카드보다 살짝 작게 |
| 버튼 (Secondary) | `6px` | Primary와 동일 |
| 토스트/피드백 | `4px` | 작고 날카롭게 |
| 모달 | `12px` | 유일하게 둥근 요소 |

### 원칙
- `rounded-full`(pill) 사용하지 않는다.
- `rounded-2xl`(16px+) 사용하지 않는다.
- 전체적으로 직각에 가까운 톤. 모달만 예외.

---

## 5. 버튼 스타일

### Primary (저장, 완료 등 주요 액션)
```css
.btn-primary {
  background: var(--color-primary);    /* #5C4B3C */
  color: #FFFFFF;
  font-weight: 500;
  font-size: 15px;
  padding: 12px 24px;
  border-radius: 6px;
  border: none;
  min-height: 44px;                    /* 터치 타겟 */
}
```

### Secondary (취소, 부가 액션)
```css
.btn-secondary {
  background: transparent;
  color: var(--color-secondary);       /* #8B7E6A */
  font-weight: 500;
  font-size: 14px;
  padding: 10px 20px;
  border-radius: 6px;
  border: 1.5px solid var(--color-secondary);
  min-height: 44px;
}
```

### Text Button (공유, 더보기 등)
```css
.btn-text {
  background: none;
  color: var(--color-secondary);
  font-weight: 500;
  font-size: 14px;
  padding: 8px 4px;
  border: none;
  min-height: 44px;
  text-decoration: underline;
  text-underline-offset: 3px;
}
```

### 원칙
- Primary와 Secondary는 시각적으로 확연히 다르다. Primary는 채워져 있고, Secondary는 비어 있다.
- 모든 버튼의 최소 터치 영역은 44px.
- hover 시: Primary는 `opacity: 0.9`, Secondary는 `background: var(--color-surface)`.
- 비활성 상태: `opacity: 0.4`, 커서 `not-allowed`.

---

## 6. 카드 스타일

카드는 네스팅하지 않는다. 배경 위에 카드 하나, 끝.

### 기록 카드 (지난 기록 목록)
```css
.card-record {
  background: var(--color-surface);    /* #F5F0E8 */
  border: none;
  border-left: 3px solid var(--color-text-secondary);  /* 좌측 액센트 라인 */
  border-radius: 0;                    /* 직각. 노트 느낌 */
  padding: 16px 20px;
}
```
- 날짜는 상단 좌측, `캡션` 스타일, `text-secondary` 색상.
- 기록 텍스트는 아래에 `기록 텍스트` 스타일.
- 카드 간 간격: 8px.

### 이번 주 카드 (주간 요약)
```css
.card-weekly {
  background: var(--color-surface);
  border: 1px solid rgba(94, 75, 60, 0.1);
  border-radius: 8px;
  padding: 20px;
}
```
- 이번 주 기록 횟수, 가장 많이 나온 키워드 등.
- 내부에 카드를 넣지 않는다. 구분은 `border-bottom: 1px solid` 또는 여백으로.

### 프롬프트 영역 (오늘의 질문)
```css
.prompt-area {
  background: transparent;             /* 카드 아님. 배경과 동일 */
  padding: 40px 24px;
  text-align: center;                  /* 프롬프트만 중앙 */
}
```
- 카드가 아니다. 배경 위에 텍스트만 놓는다.
- 여백이 곧 디자인이다.

### 원칙
- 카드 안에 카드 금지.
- 카드 배경색은 `surface` 하나만. 배경과의 명도 차이로 구분.
- 기록 카드는 직각(radius 0) + 좌측 라인으로 "메모장" 느낌.

---

## 7. 레이아웃 규칙

### 여백 시스템 (4px 단위)
```
4px   -- 인라인 요소 간격
8px   -- 카드 내부 요소 간격, 카드 간 간격
12px  -- 섹션 내부 여백
16px  -- 카드 내부 패딩
20px  -- 섹션 간 간격
24px  -- 화면 좌우 패딩
32px  -- 대섹션 간 간격
48px  -- 프롬프트 영역 상하 여백
```

### 화면 패딩
```css
.screen {
  padding: 0 24px;
  max-width: 480px;
  margin: 0 auto;
}
```

### 정렬
- 좌측 정렬이 기본. 모든 텍스트, 카드, 버튼.
- 예외: 프롬프트 영역만 중앙 정렬.
- 예외: 저장 완료 피드백 텍스트만 중앙.

### 네비게이션
- 하단 탭바 없음.
- 상단에 아이콘 2개만: 설정(좌측), 기록 보기(우측).
- 높이 48px, 좌우 24px 패딩.
- 아이콘 터치 영역 44x44px.

---

## 8. 애니메이션 전략

이 앱은 거의 움직이지 않는다. 조용함이 핵심이다.

### 즉시 표시 (기본)
- 화면 전환: 즉시. 트랜지션 없음.
- 카드 목록: 즉시 렌더링. fadeInUp 금지.
- 프롬프트 텍스트: 즉시 표시.
- 입력 필드: 즉시 표시.

### 유일한 전환: 저장 피드백
```css
.save-feedback {
  opacity: 0;
  transition: opacity 200ms ease-in;
}
.save-feedback.visible {
  opacity: 1;
}
```
- 저장 시 "적었다" 같은 짧은 텍스트가 200ms 페이드로 나타남.
- 1.5초 후 200ms 페이드로 사라짐.
- 이것만이 유일한 애니메이션.

### 삭제 피드백
```css
.card-deleting {
  opacity: 0;
  transition: opacity 150ms ease-out;
}
```
- 카드 삭제 시 150ms 페이드아웃만.

### 금지 목록
- fadeInUp, slideIn, bounce, scale 전환 전부 사용 안 함.
- 파티클, 떠다니는 요소, 배경 애니메이션 없음.
- 로딩 스피너 없음 (이 앱은 로딩 자체가 없음. 로컬 데이터).

---

## 9. 아이콘

### 라이브러리: Lucide
```
https://unpkg.com/lucide@latest
```
- Material Symbols 사용하지 않음.
- 이모지를 아이콘으로 사용하지 않음.

### 사용하는 아이콘 (최소한)
| 용도 | 아이콘 | 크기 |
|---|---|---|
| 설정 | `settings` (기어) | 20px |
| 기록 보기 | `book-open` | 20px |
| 뒤로가기 | `arrow-left` | 20px |
| 삭제 | `trash-2` | 18px |

- stroke-width: 1.5 (기본 2보다 가늘게. 조용한 느낌).
- 색상: `text-secondary` 기본. 활성 시 `text`.

---

## 10. DESIGN_RULES.md 체크리스트

```
[x] 기존 앱과 다른 색상 팔레트인가?
    → 웜 브라운(#5C4B3C) + 크림(#FAF7F2) + 테라코타(#C4724E). 기존에 없는 조합.

[x] 기존 앱과 다른 폰트 조합인가?
    → Pretendard + Sora. 기존의 Plus Jakarta Sans, Manrope, Noto Sans KR과 다름.

[x] 그라디언트 텍스트를 안 쓰는가?
    → 모든 텍스트 단색.

[x] 네비게이션 패턴이 앱 구조에 맞는가?
    → 하단 탭바 없음. 상단 아이콘 2개만. 한 줄 기록 앱에 맞는 최소 구조.

[x] fadeInUp 외에 다른 (또는 없는) 애니메이션을 쓰는가?
    → 애니메이션 거의 없음. 저장 피드백 opacity 전환만.

[x] 불필요한 장식 요소(파티클, 오브)가 없는가?
    → 장식 요소 0개. 여백이 디자인.

[x] backdrop-blur를 의미 있는 곳에만 쓰는가?
    → backdrop-blur 사용 안 함.

[x] 다크/라이트 테마 비율이 균형 잡혀 있는가?
    → 라이트 모드. 따뜻한 크림 배경.

[x] 이모지를 아이콘/장식으로 쓰지 않았는가?
    → Lucide 아이콘만 사용.

[x] 콘텐츠가 좌측 정렬 기본인가?
    → 좌측 정렬 기본. 프롬프트만 중앙.

[x] 카드 안에 카드를 넣지 않았는가?
    → 카드 네스팅 없음.

[x] Primary/Secondary 버튼 스타일이 구분되는가?
    → Primary 솔리드 브라운 / Secondary 아웃라인.

[x] 로딩 화면이 목적감 있는가?
    → 로딩 화면 자체가 없음. 로컬 데이터 앱.

[x] 빈 상태에 행동 유도(CTA)가 있는가?
    → 빈 상태 시 "오늘 첫 기록을 남겨보세요" CTA 포함.

[x] 유저 액션에 시각적 피드백이 있는가?
    → 저장 시 "적었다" 피드백, 삭제 시 페이드아웃.

[x] Secondary 버튼이 디자인 시스템 secondary 색상을 사용하는가?
    → border와 text 모두 --color-secondary(#8B7E6A) 사용.

[x] 작은 아이콘 버튼의 터치 타겟이 44px 이상인가?
    → 모든 버튼/아이콘 최소 44x44px.
```

---

## 디자인 철학 요약

이 앱은 **빈 공간이 곧 디자인**이다.

- 색상: 3개면 충분하다 (배경, 텍스트, 액센트 하나).
- 폰트: 크기와 무게로만 위계를 만든다.
- 애니메이션: 없는 것이 기본이다.
- 장식: 없다.
- 카드: 종이 한 장. 그 위에 글씨 한 줄.

사용자가 퇴근길에 이 앱을 열었을 때, 앱이 아니라 빈 노트가 열린 것 같아야 한다.
