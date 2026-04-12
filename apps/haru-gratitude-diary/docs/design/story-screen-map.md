# Story-Screen Map -- haru-gratitude-diary

**Version:** 1.0 (MVP)
**Date:** 2026-04-10
**Source:** prd.md, user-stories.md, screen-flows.md

---

## Screen-Story Mapping Table

| screen-name | purpose | key-elements | user-story-ids | navigation-in | navigation-out |
|---|---|---|---|---|---|
| onboarding | 첫 방문 사용자에게 앱 핵심 가치를 전달하고 가입 없이 바로 기록으로 유도한다 | 앱 로고, 핵심 가치 슬라이드 2장, 페이지 인디케이터(도트 2개), "시작하기" CTA 버튼, "건너뛰기" 텍스트 링크 | US-09 | 앱 첫 실행 (첫 방문 시에만) | entry ("시작하기"), home ("건너뛰기") |
| home | 오늘의 기록 상태를 보여주고 핵심 액션(기록하기/주간 회고)으로 안내하는 메인 허브 | 오늘 날짜 헤더, 설정 아이콘, 오늘의 감사 CTA 또는 오늘 기록 요약, 이번 주 기록 현황 (7일 중 N일), 주간 회고 카드(활성/비활성), 하단 2탭 내비게이션(홈/캘린더) | US-03, US-10, US-11, US-12 | onboarding ("건너뛰기"), entry (저장 완료 후 자동 이동), detail (뒤로가기), weekly-reflection (뒤로가기), settings (뒤로가기), calendar (하단 탭) | entry (CTA 버튼), calendar (하단 탭), detail (오늘 기록 요약 탭), weekly-reflection (주간 회고 버튼), settings (설정 아이콘) |
| entry | 오늘의 감사 3가지를 30초 이내에 입력하는 핵심 인터랙션 화면 | 뒤로가기 화살표, 오늘 날짜, 3개 텍스트 입력 필드(번호 1/2/3 + 플레이스홀더), "저장" 버튼(하단 고정, 1개 이상 입력 시 활성) | US-01, US-02, US-10 | home (CTA 버튼), onboarding ("시작하기"), calendar (미기록 과거 날짜 탭) | home (저장 완료 후 자동 이동, 뒤로가기) |
| calendar | 월별 기록 현황을 캘린더 그리드로 시각화하고 과거 기록 탐색을 지원한다 | "캘린더" 타이틀, 월 표시(예: 2026년 4월), 좌/우 월 이동 화살표, 7열 캘린더 그리드(기록일 도트/오늘 테두리/미래 비활성), 이번 달 통계("N일 기록"), 하단 2탭 내비게이션(홈/캘린더) | US-04, US-10, US-12 | home (하단 탭), detail (뒤로가기 -- 캘린더에서 진입한 경우) | detail (기록된 날짜 탭), entry (미기록 과거 날짜 탭 -- 소급 기록), home (하단 탭) |
| detail | 특정 날짜의 감사 기록을 확인하고 인라인으로 수정 또는 삭제한다 | 뒤로가기 화살표, 해당 날짜 표시, 감사 3가지 목록(번호 1/2/3), "수정" 텍스트 버튼, 편집 모드 시 인라인 텍스트 필드 + "저장"/"취소" 버튼, "삭제" 텍스트 버튼(빨간색 + 확인 다이얼로그) | US-05, US-07, US-08 | home (오늘 기록 요약 탭), calendar (기록된 날짜 탭), weekly-reflection (일별 감사 항목 탭) | home (뒤로가기 -- 홈에서 진입), calendar (뒤로가기 -- 캘린더에서 진입) |
| weekly-reflection | 일주일 치 감사를 모아 반복 패턴과 인사이트를 제공하는 핵심 차별화 화면 | 뒤로가기 화살표, 주차 범위(예: 4/4 - 4/10), 주간 요약 카드(기록 날수/총 감사 수), 반복 키워드 태그(빈도별 크기 차별화), "이번 주 인사이트" 한 줄 요약(배경 구분 영역), 일별 감사 목록(날짜별 그룹), 좌/우 주차 이동 화살표 | US-06, US-10 | home (주간 회고 버튼) | home (뒤로가기), detail (일별 감사 항목 탭) |
| settings | 데모 데이터 생성 및 데이터 관리 등 부가 기능을 제공한다 | 뒤로가기 화살표, "설정" 타이틀, "데모 데이터 생성" 버튼, "모든 데이터 삭제" 버튼(위험 색상 + 확인 다이얼로그), 앱 버전 정보, 앱 소개 한 줄 | US-11 | home (설정 아이콘) | home (뒤로가기) |

---

## Navigation Summary

### 메인 내비게이션 (하단 2탭)
- **home** <-> **calendar** (탭바로 상호 전환, 크로스페이드 200ms)

### 모달/푸시 스크린 (뒤로가기로 복귀)
- **entry**: 슬라이드 업/다운 (250ms/200ms)
- **detail**: 좌우 슬라이드 push/pop (250ms/200ms)
- **weekly-reflection**: 좌우 슬라이드 push/pop (250ms/200ms)
- **settings**: 좌우 슬라이드 push/pop (250ms/200ms)
- **onboarding**: 첫 방문 시에만 표시, 이후 미노출

### 스크린 수 총계
| 구분 | 스크린 | 수 |
|------|--------|---|
| MVP 핵심 | home, entry, calendar, detail, weekly-reflection | 5 |
| MVP 보조 | onboarding, settings | 2 |
| **합계** | | **7** |

---

## User Story Coverage

| user-story-id | 관련 스크린 | 비고 |
|---|---|---|
| US-01 | entry | 감사 3가지 기록 핵심 인터랙션 |
| US-02 | entry | localStorage 저장 (전 스크린 공통이나 entry에서 트리거) |
| US-03 | home | 오늘 기록 상태 확인 + CTA |
| US-04 | calendar | 월별 캘린더 기록 조회 |
| US-05 | detail | 특정 날짜 상세 보기 |
| US-06 | weekly-reflection | 주간 회고 + 키워드 + 인사이트 |
| US-07 | detail | 감사 기록 인라인 수정 |
| US-08 | detail | 감사 기록 삭제 + 확인 다이얼로그 |
| US-09 | onboarding | 첫 사용 온보딩 (1-2 슬라이드) |
| US-10 | home, calendar, weekly-reflection | 빈 상태 CTA (각 화면별 빈 상태 처리) |
| US-11 | settings | 데모 데이터 생성/초기화 |
| US-12 | home, calendar | 하단 2탭 내비게이션 |
