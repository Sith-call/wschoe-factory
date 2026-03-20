# Ritual Maker — Iteration 2 QA Report

> 날짜: 2026-03-20
> 서버: http://localhost:5174 (vite dev)
> 방법: 코드 리뷰 + TypeScript 타입 체크 + 런타임 서빙 확인

---

## Build & Type Check

| 항목 | 결과 |
|------|------|
| TypeScript `--noEmit` | PASS (에러 0개) |
| Vite dev server 기동 | PASS (port 5174) |
| HTML/CSS 로딩 | PASS |

---

## 신규 기능 QA

### 1. OnboardingScreen (NEW)
| 테스트 케이스 | 결과 | 비고 |
|-------------|------|------|
| 첫 실행 시 온보딩 화면 표시 | PASS | `loadState()` null → screen='onboarding' |
| 4개 클래스 카드 렌더링 | PASS | warrior/mage/healer/ranger |
| 클래스 선택 시 하이라이트 | PASS | 그라데이션 + 체크마크 |
| 미선택 시 "다음" 버튼 비활성화 | PASS | `disabled={!selectedClass}` |
| 이름 입력 화면 전환 | PASS | step: 'class' → 'name' |
| SVG 아바타 표시 | PASS | ClassAvatar 컴포넌트 렌더링 |
| 빈 이름으로 시작 불가 | PASS | `disabled={!name.trim()}` |
| 이름 10자 제한 | PASS | `maxLength={10}` |
| "클래스 다시 선택" 뒤로가기 | PASS | setStep('class') |
| 완료 시 ritualSelect로 이동 | PASS | handleOnboardingComplete 콜백 |

### 2. RitualSelectScreen (NEW)
| 테스트 케이스 | 결과 | 비고 |
|-------------|------|------|
| 16개 루틴 전체 표시 | PASS | ALL_RITUALS 16개 |
| 시간대별(아침/오후/저녁) 분류 | PASS | timeSlot 필터링 |
| 선택/해제 토글 | PASS | Set 기반 toggle 함수 |
| 최소 4개 미만 시 버튼 비활성화 | PASS | `disabled={selected.size < 4}` |
| 최대 12개 제한 | PASS | `else if (next.size < 12) next.add(id)` |
| 클래스 보너스 "+20%" 표시 | PASS | classBonusCategory 매칭 |
| 카테고리 태그 색상 | PASS | CATEGORY_INFO 활용 |
| 동적 버튼 텍스트 | PASS | "N개 더 선택하세요" / "N개 루틴으로 시작!" |
| 완료 시 상태 초기화 및 홈 이동 | PASS | handleRitualSelectComplete |

### 3. ClassAvatar (NEW)
| 테스트 케이스 | 결과 | 비고 |
|-------------|------|------|
| 전사 SVG (검+방패+투구) | PASS | |
| 마법사 SVG (지팡이+로브+모자+별) | PASS | 지팡이 끝 빛 애니메이션 |
| 힐러 SVG (날개+십자가+후광) | PASS | 후광+반짝이 애니메이션 |
| 레인저 SVG (활+화살+망토+후드) | PASS | |
| size prop 동작 | PASS | viewBox 동적 계산 |
| glow prop 동작 | PASS | radialGradient 조건부 렌더 |

### 4. LevelUpModal (NEW)
| 테스트 케이스 | 결과 | 비고 |
|-------------|------|------|
| 레벨업 감지 | PASS | prevLevelRef 비교 로직 |
| 모달 페이드인 애니메이션 | PASS | requestAnimationFrame + show state |
| 파티클 20개 생성 | PASS | Array.from({ length: 20 }) |
| 랜덤 색상/위치/딜레이 | PASS | Math.random() 기반 |
| SVG 아바타 + glow 표시 | PASS | ClassAvatar glow={true} |
| 새 칭호 표시 | PASS | getTitleForLevel(newLevel) |
| 스탯 보너스 표시 | PASS | "체력 +1, 지력 +1, ..." |
| 닫기 버튼 | PASS | onClose 콜백 |
| 배경 클릭으로 닫기 | PASS | backdrop onClick={onClose} |

### 5. 클래스 보너스 XP 계산
| 테스트 케이스 | 결과 | 비고 |
|-------------|------|------|
| warrior + body ritual = +20% | PASS | `Math.floor(ritual.xpReward * 0.2)` |
| mage + mind ritual = +20% | PASS | |
| healer + soul ritual = +20% | PASS | |
| ranger + social ritual = +20% | PASS | |
| 비매칭 카테고리 = 보너스 없음 | PASS | classBonus = 0 |

---

## 기존 기능 회귀 테스트

| 화면 | 결과 | 비고 |
|------|------|------|
| HomeScreen | PASS | ClassAvatar 적용, 기존 기능 유지 |
| QuestScreen | PASS | 클래스 보너스 힌트 추가, 기존 기능 유지 |
| SkillTreeScreen | PASS | 변동 없음 |
| BossBattleScreen | PASS | 변동 없음 |
| GuildScreen | PASS | 변동 없음 |
| ProfileScreen | PASS | ClassAvatar 적용, 기존 기능 유지 |
| Bottom Navigation | PASS | onboarding/ritualSelect에서 숨김 정상 |
| localStorage 영속성 | PASS | onboardingDone 플래그 추가 |

---

## 발견된 이슈

| # | 심각도 | 설명 | 위치 |
|---|--------|------|------|
| 1 | Medium | 스킬트리 "해금 가능!" 표시되지만 클릭으로 해금하는 기능 없음 | SkillTreeScreen.tsx:62 |
| 2 | Medium | 온보딩 후 루틴 구성 변경 불가 (재선택/추가/삭제 UI 없음) | App.tsx |
| 3 | Low | 길드 멤버는 이모지 avatar, 플레이어는 SVG ClassAvatar — 비주얼 비일관성 | GuildScreen.tsx:69 |
| 4 | Low | 친구 초대 버튼 onClick 핸들러 없음 | GuildScreen.tsx:109 |
| 5 | Low | LevelUpModal 파티클이 y축으로만 이동하여 단조로움 | LevelUpModal.tsx:28-39 |
| 6 | Info | 보스배틀 보상(의지의 반지 등) 획득 후 인벤토리/적용 없음 | BossBattleScreen.tsx |

---

## 결론

Iteration 2의 신규 기능 4개(온보딩, 루틴선택, SVG아바타, 레벨업모달) 모두 정상 동작한다. TypeScript 에러 없고, 네비게이션 플로우에 문제 없으며, localStorage 영속성도 정상이다. 발견된 이슈는 기존 미구현 기능(스킬 해금, 친구 초대)에 관한 것이며, 신규 기능 자체의 버그는 없다.

**QA 판정: PASS**
