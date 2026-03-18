// Demo mode mock data — DB 없이 전체 서비스 체험 가능

export const DEMO_USER = {
  id: "demo-user-1",
  email: "demo@formcoach.app",
  name: "김폼코치",
  subscriptionTier: "PRO",
  createdAt: "2026-02-01T00:00:00Z",
};

export const DEMO_PROFILE = {
  id: "demo-profile-1",
  userId: "demo-user-1",
  goal: "MUSCLE_GAIN",
  fitnessLevel: "BEGINNER",
  availableDaysPerWeek: 4,
  minutesPerSession: 45,
  height: 175,
  weight: 72,
};

export const DEMO_SUMMARY = {
  currentStreak: 5,
  longestStreak: 12,
  totalWorkouts: 47,
  thisWeekWorkouts: 3,
  thisWeekGoal: 4,
  completionRate: 0.78,
  totalMinutes: 2115,
  thisMonthMinutes: 540,
};

export const DEMO_CHART_WEEKLY = {
  labels: ["월", "화", "수", "목", "금", "토", "일"],
  data: [1, 0, 1, 1, 0, 0, 0],
};

export const DEMO_CHART_MONTHLY = {
  labels: ["1주", "2주", "3주", "4주"],
  data: [4, 3, 4, 3],
};

export const DEMO_PLAN = {
  id: "demo-plan-1",
  userId: "demo-user-1",
  status: "ACTIVE",
  weekStartDate: "2026-03-17",
  createdAt: "2026-03-17T00:00:00Z",
  planDays: [
    {
      id: "day-1",
      dayOfWeek: 1,
      theme: "상체 (가슴 + 삼두)",
      exercises: [
        { id: "e1", exercise: { id: "ex1", name: "벤치프레스", category: "CHEST", equipment: "BARBELL" }, sets: 4, reps: 10, restSeconds: 90 },
        { id: "e2", exercise: { id: "ex2", name: "인클라인 덤벨 프레스", category: "CHEST", equipment: "DUMBBELL" }, sets: 3, reps: 12, restSeconds: 60 },
        { id: "e3", exercise: { id: "ex3", name: "케이블 플라이", category: "CHEST", equipment: "CABLE" }, sets: 3, reps: 15, restSeconds: 60 },
        { id: "e4", exercise: { id: "ex4", name: "트라이셉스 푸시다운", category: "TRICEPS", equipment: "CABLE" }, sets: 3, reps: 12, restSeconds: 60 },
        { id: "e5", exercise: { id: "ex5", name: "오버헤드 트라이셉스 익스텐션", category: "TRICEPS", equipment: "DUMBBELL" }, sets: 3, reps: 12, restSeconds: 60 },
      ],
    },
    {
      id: "day-2",
      dayOfWeek: 3,
      theme: "하체 (쿼드 + 햄스트링)",
      exercises: [
        { id: "e6", exercise: { id: "ex6", name: "바벨 스쿼트", category: "LEGS", equipment: "BARBELL" }, sets: 4, reps: 8, restSeconds: 120 },
        { id: "e7", exercise: { id: "ex7", name: "레그 프레스", category: "LEGS", equipment: "MACHINE" }, sets: 3, reps: 12, restSeconds: 90 },
        { id: "e8", exercise: { id: "ex8", name: "루마니안 데드리프트", category: "LEGS", equipment: "BARBELL" }, sets: 3, reps: 10, restSeconds: 90 },
        { id: "e9", exercise: { id: "ex9", name: "레그 컬", category: "LEGS", equipment: "MACHINE" }, sets: 3, reps: 12, restSeconds: 60 },
      ],
    },
    {
      id: "day-3",
      dayOfWeek: 5,
      theme: "등 + 이두",
      exercises: [
        { id: "e10", exercise: { id: "ex10", name: "랫 풀다운", category: "BACK", equipment: "CABLE" }, sets: 4, reps: 10, restSeconds: 90 },
        { id: "e11", exercise: { id: "ex11", name: "바벨 로우", category: "BACK", equipment: "BARBELL" }, sets: 3, reps: 10, restSeconds: 90 },
        { id: "e12", exercise: { id: "ex12", name: "시티드 케이블 로우", category: "BACK", equipment: "CABLE" }, sets: 3, reps: 12, restSeconds: 60 },
        { id: "e13", exercise: { id: "ex13", name: "바이셉스 컬", category: "BICEPS", equipment: "DUMBBELL" }, sets: 3, reps: 12, restSeconds: 60 },
      ],
    },
    {
      id: "day-4",
      dayOfWeek: 6,
      theme: "어깨 + 코어",
      exercises: [
        { id: "e14", exercise: { id: "ex14", name: "오버헤드 프레스", category: "SHOULDERS", equipment: "BARBELL" }, sets: 4, reps: 8, restSeconds: 90 },
        { id: "e15", exercise: { id: "ex15", name: "사이드 레터럴 레이즈", category: "SHOULDERS", equipment: "DUMBBELL" }, sets: 3, reps: 15, restSeconds: 60 },
        { id: "e16", exercise: { id: "ex16", name: "페이스 풀", category: "SHOULDERS", equipment: "CABLE" }, sets: 3, reps: 15, restSeconds: 60 },
        { id: "e17", exercise: { id: "ex17", name: "플랭크", category: "CORE", equipment: "BODYWEIGHT" }, sets: 3, reps: 60, restSeconds: 60 },
      ],
    },
  ],
};

export const DEMO_WORKOUT_LOG = {
  id: "demo-log-1",
  userId: "demo-user-1",
  planDayId: "day-1",
  status: "IN_PROGRESS",
  startedAt: new Date().toISOString(),
  entries: [],
};

export const DEMO_TOKENS = {
  accessToken: "demo-access-token",
  refreshToken: "demo-refresh-token",
};
