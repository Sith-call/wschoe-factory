# FormCoach 기술 요구사항 문서 (TRD)

> **버전**: 1.0
> **작성일**: 2026-03-18
> **기반 문서**: FormCoach PRD v1.0
> **기술 스택**: Next.js 14 (App Router) + TypeScript + Tailwind CSS + PostgreSQL + Prisma ORM

---

## 목차

1. [데이터 모델](#1-데이터-모델)
2. [API 스펙](#2-api-스펙)
3. [비기능 요구사항](#3-비기능-요구사항)
4. [기술적 수용 기준](#4-기술적-수용-기준)

---

## 1. 데이터 모델

### 1.1 ERD 개요

```
User 1──1 UserProfile
User 1──* WorkoutPlan
WorkoutPlan 1──* PlanDay
PlanDay 1──* PlanExercise
PlanExercise *──1 Exercise
User 1──* WorkoutLog
WorkoutLog 1──* WorkoutLogEntry
WorkoutLogEntry *──1 Exercise
User 1──* UserAchievement
UserAchievement *──1 Achievement
User 1──* Streak
```

### 1.2 엔티티 상세

#### User

| 필드 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | UUID | PK, default: uuid_generate_v4() | 사용자 고유 ID |
| email | VARCHAR(255) | UNIQUE, NOT NULL | 이메일 (로그인 ID) |
| passwordHash | VARCHAR(255) | NOT NULL | bcrypt 해시된 비밀번호 |
| name | VARCHAR(100) | NOT NULL | 사용자 이름 |
| subscriptionTier | ENUM('FREE','PRO','PRO_PLUS') | NOT NULL, default: 'FREE' | 구독 등급 |
| isOnboarded | BOOLEAN | NOT NULL, default: false | 온보딩 완료 여부 |
| createdAt | TIMESTAMP | NOT NULL, default: now() | 가입일시 |
| updatedAt | TIMESTAMP | NOT NULL, auto-update | 수정일시 |

**인덱스**: `idx_user_email` (email) UNIQUE

#### UserProfile

| 필드 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | UUID | PK | |
| userId | UUID | FK → User.id, UNIQUE, NOT NULL | |
| goal | ENUM('WEIGHT_LOSS','MUSCLE_GAIN','ENDURANCE','GENERAL_FITNESS') | NOT NULL | 운동 목표 |
| fitnessLevel | ENUM('BEGINNER','INTERMEDIATE','ADVANCED') | NOT NULL | 체력 수준 |
| availableDaysPerWeek | INT | NOT NULL, CHECK(1-7) | 주당 가용 운동일 |
| minutesPerSession | INT | NOT NULL, CHECK(15-120) | 세션당 운동 시간(분) |
| height | DECIMAL(5,1) | NULLABLE | 키(cm) |
| weight | DECIMAL(5,1) | NULLABLE | 몸무게(kg) |
| birthYear | INT | NULLABLE | 출생년도 |
| gender | ENUM('MALE','FEMALE','OTHER','PREFER_NOT_TO_SAY') | NULLABLE | 성별 |
| injuries | TEXT | NULLABLE | 부상/제한사항 메모 |
| createdAt | TIMESTAMP | NOT NULL | |
| updatedAt | TIMESTAMP | NOT NULL | |

**인덱스**: `idx_userprofile_userid` (userId) UNIQUE

#### Exercise

| 필드 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | UUID | PK | |
| name | VARCHAR(200) | NOT NULL | 운동명 |
| nameKo | VARCHAR(200) | NOT NULL | 운동명(한국어) |
| category | ENUM('CHEST','BACK','SHOULDERS','ARMS','LEGS','CORE','CARDIO','FULL_BODY','STRETCHING') | NOT NULL | 운동 부위 |
| difficulty | ENUM('BEGINNER','INTERMEDIATE','ADVANCED') | NOT NULL | 난이도 |
| equipment | VARCHAR(100)[] | NOT NULL, default: '{}' | 필요 장비 |
| description | TEXT | NOT NULL | 운동 설명 |
| instructions | TEXT | NOT NULL | 수행 방법 (단계별) |
| imageUrl | VARCHAR(500) | NULLABLE | 운동 이미지 URL |
| videoUrl | VARCHAR(500) | NULLABLE | 운동 영상 URL |
| createdAt | TIMESTAMP | NOT NULL | |

**인덱스**: `idx_exercise_category` (category), `idx_exercise_difficulty` (difficulty)

#### WorkoutPlan

| 필드 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | UUID | PK | |
| userId | UUID | FK → User.id, NOT NULL | |
| weekNumber | INT | NOT NULL | 주차 번호 |
| startDate | DATE | NOT NULL | 주간 시작일 |
| endDate | DATE | NOT NULL | 주간 종료일 |
| status | ENUM('ACTIVE','COMPLETED','CANCELLED') | NOT NULL, default: 'ACTIVE' | |
| aiPrompt | TEXT | NULLABLE | AI 생성에 사용된 프롬프트 |
| createdAt | TIMESTAMP | NOT NULL | |
| updatedAt | TIMESTAMP | NOT NULL | |

**인덱스**: `idx_workoutplan_user_status` (userId, status), `idx_workoutplan_user_week` (userId, weekNumber)

#### PlanDay

| 필드 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | UUID | PK | |
| workoutPlanId | UUID | FK → WorkoutPlan.id, NOT NULL | |
| dayOfWeek | INT | NOT NULL, CHECK(0-6) | 요일 (0=월요일) |
| theme | VARCHAR(100) | NOT NULL | 오늘의 테마 (예: "상체 근력") |
| estimatedMinutes | INT | NOT NULL | 예상 소요 시간 |
| sortOrder | INT | NOT NULL | 정렬 순서 |
| createdAt | TIMESTAMP | NOT NULL | |

**인덱스**: `idx_planday_plan` (workoutPlanId)

#### PlanExercise

| 필드 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | UUID | PK | |
| planDayId | UUID | FK → PlanDay.id, NOT NULL | |
| exerciseId | UUID | FK → Exercise.id, NOT NULL | |
| sets | INT | NOT NULL | 세트 수 |
| reps | VARCHAR(50) | NOT NULL | 반복 횟수 (예: "12", "8-10", "30초") |
| restSeconds | INT | NOT NULL, default: 60 | 세트 간 휴식(초) |
| notes | TEXT | NULLABLE | AI 코칭 노트 |
| sortOrder | INT | NOT NULL | 정렬 순서 |
| createdAt | TIMESTAMP | NOT NULL | |

**인덱스**: `idx_planexercise_planday` (planDayId)

#### WorkoutLog

| 필드 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | UUID | PK | |
| userId | UUID | FK → User.id, NOT NULL | |
| planDayId | UUID | FK → PlanDay.id, NULLABLE | 계획 기반 운동시 참조 |
| startedAt | TIMESTAMP | NOT NULL | 운동 시작 시간 |
| completedAt | TIMESTAMP | NULLABLE | 운동 완료 시간 |
| durationMinutes | INT | NULLABLE | 실제 운동 시간 |
| feeling | ENUM('VERY_EASY','EASY','MODERATE','HARD','VERY_HARD') | NULLABLE | 운동 체감 강도 |
| memo | TEXT | NULLABLE | 메모 |
| createdAt | TIMESTAMP | NOT NULL | |

**인덱스**: `idx_workoutlog_user_date` (userId, startedAt DESC), `idx_workoutlog_planday` (planDayId)

#### WorkoutLogEntry

| 필드 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | UUID | PK | |
| workoutLogId | UUID | FK → WorkoutLog.id, NOT NULL | |
| exerciseId | UUID | FK → Exercise.id, NOT NULL | |
| setNumber | INT | NOT NULL | 세트 번호 |
| reps | INT | NULLABLE | 실제 수행 횟수 |
| weight | DECIMAL(5,1) | NULLABLE | 사용 중량(kg) |
| durationSeconds | INT | NULLABLE | 시간 기반 운동의 수행 시간 |
| completed | BOOLEAN | NOT NULL, default: true | 완료 여부 |
| createdAt | TIMESTAMP | NOT NULL | |

**인덱스**: `idx_workoutlogentry_log` (workoutLogId)

#### Achievement

| 필드 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | UUID | PK | |
| code | VARCHAR(50) | UNIQUE, NOT NULL | 고유 코드 (예: 'FIRST_WORKOUT') |
| name | VARCHAR(100) | NOT NULL | 배지 이름 |
| nameKo | VARCHAR(100) | NOT NULL | 배지 이름(한국어) |
| description | TEXT | NOT NULL | 달성 조건 설명 |
| iconUrl | VARCHAR(500) | NOT NULL | 배지 아이콘 URL |
| category | ENUM('STREAK','MILESTONE','CHALLENGE') | NOT NULL | 배지 카테고리 |
| condition | JSONB | NOT NULL | 달성 조건 (프로그래밍적 평가용) |
| createdAt | TIMESTAMP | NOT NULL | |

**인덱스**: `idx_achievement_code` (code) UNIQUE, `idx_achievement_category` (category)

#### UserAchievement

| 필드 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | UUID | PK | |
| userId | UUID | FK → User.id, NOT NULL | |
| achievementId | UUID | FK → Achievement.id, NOT NULL | |
| achievedAt | TIMESTAMP | NOT NULL | 달성 일시 |
| createdAt | TIMESTAMP | NOT NULL | |

**인덱스**: `idx_userachievement_user` (userId), UNIQUE(userId, achievementId)

#### Streak

| 필드 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | UUID | PK | |
| userId | UUID | FK → User.id, NOT NULL | |
| currentStreak | INT | NOT NULL, default: 0 | 현재 연속 일수 |
| longestStreak | INT | NOT NULL, default: 0 | 최장 연속 일수 |
| lastWorkoutDate | DATE | NULLABLE | 마지막 운동일 |
| updatedAt | TIMESTAMP | NOT NULL | |

**인덱스**: `idx_streak_user` (userId) UNIQUE

---

## 2. API 스펙

**기본 URL**: `/api/v1`
**인증 방식**: Bearer JWT (Access Token + Refresh Token)
**응답 형식**: JSON
**공통 에러 형식**:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "사람이 읽을 수 있는 에러 메시지"
  }
}
```

### 2.1 Auth (인증)

#### POST /api/v1/auth/signup

회원가입

| 구분 | 내용 |
|------|------|
| 인증 | 불필요 |
| Request Body | `{ email: string, password: string, name: string }` |
| 성공 응답 (201) | `{ user: { id, email, name, subscriptionTier, isOnboarded }, tokens: { accessToken, refreshToken } }` |
| 에러 | 409 이메일 중복, 422 유효성 검증 실패 |

**유효성 검증**:
- email: 이메일 형식
- password: 최소 8자, 대소문자+숫자 포함
- name: 2-50자

#### POST /api/v1/auth/login

로그인

| 구분 | 내용 |
|------|------|
| 인증 | 불필요 |
| Request Body | `{ email: string, password: string }` |
| 성공 응답 (200) | `{ user: { id, email, name, subscriptionTier, isOnboarded }, tokens: { accessToken, refreshToken } }` |
| 에러 | 401 인증 실패 |

#### POST /api/v1/auth/refresh

토큰 갱신

| 구분 | 내용 |
|------|------|
| 인증 | 불필요 (refreshToken 사용) |
| Request Body | `{ refreshToken: string }` |
| 성공 응답 (200) | `{ tokens: { accessToken, refreshToken } }` |
| 에러 | 401 유효하지 않은 토큰 |

#### POST /api/v1/auth/logout

로그아웃 (리프레시 토큰 무효화)

| 구분 | 내용 |
|------|------|
| 인증 | 필요 |
| Request Body | `{ refreshToken: string }` |
| 성공 응답 (200) | `{ message: "로그아웃 완료" }` |

### 2.2 Users (사용자)

#### GET /api/v1/users/me

현재 사용자 정보 조회

| 구분 | 내용 |
|------|------|
| 인증 | 필요 |
| 성공 응답 (200) | `{ user: { id, email, name, subscriptionTier, isOnboarded, createdAt } }` |

#### GET /api/v1/users/me/profile

프로필 조회

| 구분 | 내용 |
|------|------|
| 인증 | 필요 |
| 성공 응답 (200) | `{ profile: UserProfile }` |
| 에러 | 404 프로필 미생성 |

#### PUT /api/v1/users/me/profile

프로필 생성/수정 (온보딩 포함)

| 구분 | 내용 |
|------|------|
| 인증 | 필요 |
| Request Body | `{ goal, fitnessLevel, availableDaysPerWeek, minutesPerSession, height?, weight?, birthYear?, gender?, injuries? }` |
| 성공 응답 (200) | `{ profile: UserProfile }` |
| 에러 | 422 유효성 검증 실패 |
| 부수 효과 | 최초 생성 시 `User.isOnboarded = true` 설정 |

### 2.3 WorkoutPlans (운동 계획)

#### POST /api/v1/workout-plans/generate

AI 기반 주간 운동 계획 생성

| 구분 | 내용 |
|------|------|
| 인증 | 필요 |
| Request Body | `{ weekStartDate?: string (ISO 8601) }` |
| 성공 응답 (201) | `{ plan: WorkoutPlan (with PlanDays and PlanExercises) }` |
| 에러 | 400 프로필 미완성, 429 요청 제한 초과 |
| 비고 | FREE 사용자: 주 1회 생성 / PRO 이상: 무제한 |

#### GET /api/v1/workout-plans

운동 계획 목록 조회

| 구분 | 내용 |
|------|------|
| 인증 | 필요 |
| Query Params | `status?: 'ACTIVE' \| 'COMPLETED' \| 'CANCELLED'`, `page?: number`, `limit?: number (default: 10)` |
| 성공 응답 (200) | `{ plans: WorkoutPlan[], pagination: { page, limit, total } }` |

#### GET /api/v1/workout-plans/:planId

운동 계획 상세 조회 (일별 운동 포함)

| 구분 | 내용 |
|------|------|
| 인증 | 필요 |
| 성공 응답 (200) | `{ plan: WorkoutPlan (with PlanDays → PlanExercises → Exercise) }` |
| 에러 | 404 계획 없음, 403 다른 사용자의 계획 |

#### PATCH /api/v1/workout-plans/:planId

운동 계획 상태 변경

| 구분 | 내용 |
|------|------|
| 인증 | 필요 |
| Request Body | `{ status: 'COMPLETED' \| 'CANCELLED' }` |
| 성공 응답 (200) | `{ plan: WorkoutPlan }` |

### 2.4 Workouts (운동 기록)

#### POST /api/v1/workouts

운동 시작 (로그 생성)

| 구분 | 내용 |
|------|------|
| 인증 | 필요 |
| Request Body | `{ planDayId?: string }` |
| 성공 응답 (201) | `{ workoutLog: WorkoutLog }` |

#### PATCH /api/v1/workouts/:logId

운동 완료/업데이트

| 구분 | 내용 |
|------|------|
| 인증 | 필요 |
| Request Body | `{ completedAt?: string, feeling?: Feeling, memo?: string }` |
| 성공 응답 (200) | `{ workoutLog: WorkoutLog }` |
| 부수 효과 | 완료 시 Streak 업데이트, Achievement 체크 |

#### POST /api/v1/workouts/:logId/entries

운동 세트 기록 추가

| 구분 | 내용 |
|------|------|
| 인증 | 필요 |
| Request Body | `{ exerciseId: string, setNumber: number, reps?: number, weight?: number, durationSeconds?: number, completed?: boolean }` |
| 성공 응답 (201) | `{ entry: WorkoutLogEntry }` |

#### GET /api/v1/workouts

운동 기록 목록 조회

| 구분 | 내용 |
|------|------|
| 인증 | 필요 |
| Query Params | `from?: string (ISO date)`, `to?: string (ISO date)`, `page?: number`, `limit?: number` |
| 성공 응답 (200) | `{ logs: WorkoutLog[], pagination: { page, limit, total } }` |

#### GET /api/v1/workouts/:logId

운동 기록 상세 조회

| 구분 | 내용 |
|------|------|
| 인증 | 필요 |
| 성공 응답 (200) | `{ workoutLog: WorkoutLog (with entries → Exercise) }` |

### 2.5 Progress (진행 현황)

#### GET /api/v1/progress/summary

대시보드 요약 데이터

| 구분 | 내용 |
|------|------|
| 인증 | 필요 |
| 성공 응답 (200) | 아래 참조 |

```json
{
  "summary": {
    "currentStreak": 5,
    "longestStreak": 12,
    "totalWorkouts": 28,
    "thisWeekWorkouts": 3,
    "thisWeekGoal": 4,
    "completionRate": 0.75,
    "totalMinutes": 1260,
    "thisMonthMinutes": 180
  }
}
```

#### GET /api/v1/progress/chart

차트 데이터 (주간/월간)

| 구분 | 내용 |
|------|------|
| 인증 | 필요 |
| Query Params | `period: 'weekly' \| 'monthly'`, `metric: 'workouts' \| 'duration' \| 'volume'`, `from?: string`, `to?: string` |
| 성공 응답 (200) | `{ chart: { labels: string[], data: number[] } }` |

#### GET /api/v1/progress/exercise-stats

운동별 통계

| 구분 | 내용 |
|------|------|
| 인증 | 필요 |
| Query Params | `exerciseId: string` |
| 성공 응답 (200) | `{ stats: { maxWeight: number, totalSets: number, avgReps: number, history: { date, weight, reps }[] } }` |

### 2.6 Achievements (동기부여)

#### GET /api/v1/achievements

전체 배지 목록 + 사용자 달성 여부

| 구분 | 내용 |
|------|------|
| 인증 | 필요 |
| 성공 응답 (200) | `{ achievements: { ...Achievement, achieved: boolean, achievedAt?: string }[] }` |

#### GET /api/v1/achievements/recent

최근 획득 배지

| 구분 | 내용 |
|------|------|
| 인증 | 필요 |
| Query Params | `limit?: number (default: 5)` |
| 성공 응답 (200) | `{ achievements: UserAchievement[] }` |

### 2.7 Exercises (운동 정보)

#### GET /api/v1/exercises

운동 목록 조회

| 구분 | 내용 |
|------|------|
| 인증 | 필요 |
| Query Params | `category?: ExerciseCategory`, `difficulty?: Difficulty`, `search?: string`, `page?: number`, `limit?: number` |
| 성공 응답 (200) | `{ exercises: Exercise[], pagination: { page, limit, total } }` |

#### GET /api/v1/exercises/:exerciseId

운동 상세 정보

| 구분 | 내용 |
|------|------|
| 인증 | 필요 |
| 성공 응답 (200) | `{ exercise: Exercise }` |

---

## 3. 비기능 요구사항

### 3.1 성능

| 항목 | 기준 |
|------|------|
| 일반 API 응답 시간 | p95 < 500ms |
| AI 운동 계획 생성 | < 5초 (스트리밍 응답으로 UX 보완) |
| 페이지 초기 로드 (LCP) | < 2.5초 |
| First Input Delay (FID) | < 100ms |
| Cumulative Layout Shift (CLS) | < 0.1 |
| 데이터베이스 쿼리 | p95 < 100ms |
| 동시 사용자 | 초기 1,000명 지원 |

### 3.2 보안

| 항목 | 구현 방식 |
|------|-----------|
| 인증 | JWT (Access: 15분, Refresh: 7일) |
| 비밀번호 | bcrypt (salt rounds: 12) |
| 전송 | HTTPS 필수 (TLS 1.2+) |
| 입력 검증 | Zod 스키마 기반 서버사이드 검증 |
| SQL Injection | Prisma ORM 파라미터화 쿼리 |
| XSS | React 자동 이스케이핑 + CSP 헤더 |
| CORS | 허용 오리진 화이트리스트 |
| Rate Limiting | IP 기반 (일반: 100req/min, 인증: 10req/min) |
| 데이터 접근 | Row-level 소유권 검증 (userId 매칭) |

### 3.3 접근성

| 항목 | 기준 |
|------|------|
| 표준 | WCAG 2.1 Level AA 준수 |
| 시맨틱 HTML | 적절한 heading 계층, landmark, ARIA 속성 |
| 키보드 네비게이션 | 모든 인터랙티브 요소 키보드 접근 가능 |
| 색상 대비 | 최소 4.5:1 (일반 텍스트), 3:1 (대형 텍스트) |
| 스크린 리더 | 이미지 alt 텍스트, 폼 라벨링 |
| 포커스 관리 | visible focus indicator, 논리적 탭 순서 |

### 3.4 모바일 & 반응형

| 항목 | 기준 |
|------|------|
| 설계 방식 | 모바일 퍼스트 |
| 브레이크포인트 | sm: 640px, md: 768px, lg: 1024px, xl: 1280px |
| 최소 지원 뷰포트 | 320px (iPhone SE) |
| 터치 타겟 | 최소 44x44px |
| PWA | Service Worker 캐싱, 오프라인 기본 페이지 |
| 지원 브라우저 | Chrome 90+, Safari 15+, Firefox 90+, Edge 90+ |

### 3.5 인프라 & 배포

| 항목 | 구현 방식 |
|------|-----------|
| 호스팅 | Vercel (Next.js) |
| 데이터베이스 | Vercel Postgres 또는 Supabase |
| AI | OpenAI API (GPT-4o) |
| 이미지 저장 | Vercel Blob 또는 Cloudinary |
| 모니터링 | Vercel Analytics + Sentry |
| CI/CD | GitHub Actions → Vercel 자동 배포 |
| 환경 분리 | development / staging / production |

---

## 4. 기술적 수용 기준

### 4.1 회원가입/로그인

| # | 기준 | 검증 방법 |
|---|------|-----------|
| AC-1.1 | 유효한 이메일/비밀번호로 가입 시 JWT 토큰 쌍이 반환된다 | API 테스트 |
| AC-1.2 | 중복 이메일 가입 시 409 에러가 반환된다 | API 테스트 |
| AC-1.3 | 비밀번호 규칙 미충족 시 422 에러와 구체적 메시지가 반환된다 | API 테스트 |
| AC-1.4 | 로그인 시 bcrypt로 비밀번호가 검증된다 | 단위 테스트 |
| AC-1.5 | Access Token 만료 시 Refresh Token으로 갱신된다 | API 테스트 |
| AC-1.6 | 로그아웃 시 Refresh Token이 무효화된다 | API 테스트 |
| AC-1.7 | 10회 로그인 실패 시 계정이 15분간 잠긴다 | API 테스트 |

### 4.2 온보딩

| # | 기준 | 검증 방법 |
|---|------|-----------|
| AC-2.1 | 필수 필드(goal, fitnessLevel, availableDaysPerWeek, minutesPerSession)가 모두 입력되어야 프로필이 저장된다 | API 테스트 |
| AC-2.2 | 프로필 저장 시 User.isOnboarded가 true로 변경된다 | 통합 테스트 |
| AC-2.3 | availableDaysPerWeek 범위(1-7) 외 값에 대해 422 에러가 반환된다 | API 테스트 |
| AC-2.4 | 온보딩 미완료 사용자가 운동 계획 생성 요청 시 400 에러가 반환된다 | API 테스트 |

### 4.3 AI 운동 계획 생성

| # | 기준 | 검증 방법 |
|---|------|-----------|
| AC-3.1 | 생성된 계획의 운동일 수가 사용자의 availableDaysPerWeek와 일치한다 | 통합 테스트 |
| AC-3.2 | 각 운동일의 예상 시간이 minutesPerSession ±10% 이내이다 | 통합 테스트 |
| AC-3.3 | 운동 난이도가 사용자의 fitnessLevel에 맞게 배정된다 | 통합 테스트 |
| AC-3.4 | 계획 생성이 5초 이내에 완료된다 | 성능 테스트 |
| AC-3.5 | FREE 사용자는 주 1회만 생성 가능하며, 초과 시 429 에러가 반환된다 | API 테스트 |
| AC-3.6 | 이전 운동 기록이 있는 경우 AI가 이를 참조한다 | 통합 테스트 |

### 4.4 운동 수행 가이드

| # | 기준 | 검증 방법 |
|---|------|-----------|
| AC-4.1 | PlanDay 조회 시 모든 PlanExercise가 sortOrder 순으로 반환된다 | API 테스트 |
| AC-4.2 | 각 운동에 세트 수, 반복 횟수, 휴식 시간이 포함된다 | API 테스트 |
| AC-4.3 | 운동 상세에 수행 방법(instructions)이 단계별로 제공된다 | API 테스트 |

### 4.5 운동 완료 기록

| # | 기준 | 검증 방법 |
|---|------|-----------|
| AC-5.1 | 운동 시작 시 WorkoutLog가 생성되고 startedAt이 기록된다 | API 테스트 |
| AC-5.2 | 세트별 기록(reps, weight)이 WorkoutLogEntry로 저장된다 | API 테스트 |
| AC-5.3 | 운동 완료 시 completedAt이 기록되고 durationMinutes가 계산된다 | 통합 테스트 |
| AC-5.4 | 운동 완료 시 Streak이 자동 갱신된다 | 통합 테스트 |
| AC-5.5 | 다른 사용자의 WorkoutLog 접근 시 403이 반환된다 | API 테스트 |

### 4.6 진행 현황 대시보드

| # | 기준 | 검증 방법 |
|---|------|-----------|
| AC-6.1 | summary API가 현재 스트릭, 이번 주 운동 횟수, 완료율을 정확히 반환한다 | 통합 테스트 |
| AC-6.2 | chart API가 요청된 기간의 데이터를 labels/data 쌍으로 반환한다 | API 테스트 |
| AC-6.3 | 운동 기록이 없는 새 사용자에게 기본값(0)이 반환된다 | API 테스트 |
| AC-6.4 | summary API 응답 시간이 500ms 이내이다 | 성능 테스트 |

### 4.7 동기부여 시스템

| # | 기준 | 검증 방법 |
|---|------|-----------|
| AC-7.1 | 연속 출석이 자정(KST) 기준으로 계산된다 | 단위 테스트 |
| AC-7.2 | 하루 미운동 시 currentStreak이 0으로 리셋된다 | 통합 테스트 |
| AC-7.3 | 조건 충족 시 Achievement가 자동 부여되고 UserAchievement에 기록된다 | 통합 테스트 |
| AC-7.4 | 이미 획득한 Achievement는 중복 부여되지 않는다 | 통합 테스트 |
| AC-7.5 | achievements API에서 사용자별 달성 여부가 정확히 표시된다 | API 테스트 |

---

## 부록: JWT 토큰 페이로드

### Access Token

```json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "tier": "FREE",
  "iat": 1234567890,
  "exp": 1234568790
}
```

### Refresh Token

```json
{
  "sub": "user-uuid",
  "tokenId": "random-uuid",
  "iat": 1234567890,
  "exp": 1235172690
}
```

## 부록: 초기 Achievement 시드 데이터

| 코드 | 이름 | 카테고리 | 조건 |
|------|------|----------|------|
| FIRST_WORKOUT | 첫 발걸음 | MILESTONE | 첫 운동 완료 |
| STREAK_3 | 3일 연속 | STREAK | 3일 연속 운동 |
| STREAK_7 | 일주일 전사 | STREAK | 7일 연속 운동 |
| STREAK_30 | 한 달의 기적 | STREAK | 30일 연속 운동 |
| WORKOUTS_10 | 10회 달성 | MILESTONE | 누적 운동 10회 |
| WORKOUTS_50 | 50회 달성 | MILESTONE | 누적 운동 50회 |
| WORKOUTS_100 | 백전백승 | MILESTONE | 누적 운동 100회 |
| PERFECT_WEEK | 완벽한 한 주 | CHALLENGE | 주간 계획 100% 완료 |
| EARLY_BIRD | 얼리버드 | CHALLENGE | 오전 6시 이전 운동 5회 |
