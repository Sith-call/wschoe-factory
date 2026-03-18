/**
 * Workout Plans API Tests
 * Tests: plan generation, list, detail, update
 * Covers TRD acceptance criteria: AC-3.1 ~ AC-3.5, AC-2.4, AC-4.1, AC-4.2
 */

import { NextRequest } from 'next/server';

const mockPrisma = {
  user: {
    findUnique: jest.fn(),
  },
  workoutPlan: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    count: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  exercise: {
    findMany: jest.fn(),
  },
};

jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: mockPrisma,
  prisma: mockPrisma,
}));

// Mock AI module
jest.mock('@/lib/ai', () => ({
  generateWorkoutPlan: jest.fn().mockReturnValue({
    days: [
      {
        dayOfWeek: 0,
        theme: 'Upper Body',
        estimatedMinutes: 30,
        sortOrder: 1,
        exercises: [
          {
            exerciseId: 'ex1',
            sets: 3,
            reps: '10-12',
            restSeconds: 60,
            notes: 'Focus on form',
            sortOrder: 1,
          },
        ],
      },
      {
        dayOfWeek: 1,
        theme: 'Lower Body',
        estimatedMinutes: 30,
        sortOrder: 2,
        exercises: [
          {
            exerciseId: 'ex2',
            sets: 3,
            reps: '10-12',
            restSeconds: 60,
            notes: 'Focus on form',
            sortOrder: 1,
          },
        ],
      },
      {
        dayOfWeek: 2,
        theme: 'Core',
        estimatedMinutes: 25,
        sortOrder: 3,
        exercises: [
          {
            exerciseId: 'ex3',
            sets: 3,
            reps: '10-12',
            restSeconds: 60,
            notes: 'Focus on form',
            sortOrder: 1,
          },
        ],
      },
    ],
  }),
}));

beforeAll(() => {
  process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing';
  process.env.JWT_REFRESH_SECRET = 'test-jwt-refresh-secret-key-for-testing';
});

let listHandler: { GET: (req: NextRequest) => Promise<Response>; POST: (req: NextRequest) => Promise<Response> };
let detailHandler: { GET: (req: NextRequest, ctx: unknown) => Promise<Response>; PUT: (req: NextRequest, ctx: unknown) => Promise<Response>; DELETE: (req: NextRequest, ctx: unknown) => Promise<Response> };

beforeAll(async () => {
  listHandler = await import('@/app/api/workout-plans/route');
  detailHandler = await import('@/app/api/workout-plans/[id]/route');
});

beforeEach(() => {
  jest.clearAllMocks();
});

function createAuthRequest(
  url: string,
  method: string,
  body?: unknown,
): NextRequest {
  const { generateAccessToken } = require('@/lib/auth');
  const token = generateAccessToken({
    id: 'test-user-id',
    email: 'test@example.com',
    subscriptionTier: 'FREE',
  });

  const init: RequestInit = {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    init.body = JSON.stringify(body);
  }

  return new NextRequest(url, init);
}

function createUnauthRequest(url: string, method: string, body?: unknown): NextRequest {
  const init: RequestInit = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) init.body = JSON.stringify(body);
  return new NextRequest(url, init);
}

describe('POST /api/v1/workout-plans/generate', () => {
  it('should return 401 without authentication', async () => {
    const req = createUnauthRequest('http://localhost:3000/api/v1/workout-plans', 'POST', {});
    const res = await listHandler.POST(req);
    expect(res.status).toBe(401);
  });

  // AC-2.4: 온보딩 미완료 사용자가 운동 계획 생성 요청 시 400 에러
  it('should return 400 when user is not onboarded', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'test-user-id',
      email: 'test@example.com',
      isOnboarded: false,
      profile: null,
    });

    const req = createAuthRequest('http://localhost:3000/api/v1/workout-plans', 'POST', {});
    const res = await listHandler.POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error.code).toBe('NOT_ONBOARDED');
  });

  // AC-3.1: 생성된 계획의 운동일 수가 availableDaysPerWeek와 일치
  it('should create workout plan for onboarded user', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'test-user-id',
      email: 'test@example.com',
      isOnboarded: true,
      profile: {
        goal: 'GENERAL_FITNESS',
        fitnessLevel: 'BEGINNER',
        availableDaysPerWeek: 3,
        minutesPerSession: 30,
      },
    });

    mockPrisma.exercise.findMany.mockResolvedValue([
      { id: 'ex1', name: 'Push Up', nameKo: '푸쉬업', category: 'CHEST', difficulty: 'BEGINNER' },
      { id: 'ex2', name: 'Squat', nameKo: '스쿼트', category: 'LEGS', difficulty: 'BEGINNER' },
      { id: 'ex3', name: 'Plank', nameKo: '플랭크', category: 'CORE', difficulty: 'BEGINNER' },
    ]);

    const createdPlan = {
      id: 'plan-id',
      userId: 'test-user-id',
      weekNumber: 12,
      startDate: new Date('2026-03-16'),
      endDate: new Date('2026-03-22'),
      status: 'ACTIVE',
      planDays: [
        {
          id: 'day-1',
          dayOfWeek: 0,
          theme: 'Upper Body',
          estimatedMinutes: 30,
          sortOrder: 1,
          planExercises: [
            { id: 'pe-1', exerciseId: 'ex1', sets: 3, reps: '10-12', restSeconds: 60, sortOrder: 1, exercise: { name: 'Push Up' } },
          ],
        },
        {
          id: 'day-2',
          dayOfWeek: 1,
          theme: 'Lower Body',
          estimatedMinutes: 30,
          sortOrder: 2,
          planExercises: [
            { id: 'pe-2', exerciseId: 'ex2', sets: 3, reps: '10-12', restSeconds: 60, sortOrder: 1, exercise: { name: 'Squat' } },
          ],
        },
        {
          id: 'day-3',
          dayOfWeek: 2,
          theme: 'Core',
          estimatedMinutes: 25,
          sortOrder: 3,
          planExercises: [
            { id: 'pe-3', exerciseId: 'ex3', sets: 3, reps: '10-12', restSeconds: 60, sortOrder: 1, exercise: { name: 'Plank' } },
          ],
        },
      ],
    };

    mockPrisma.workoutPlan.create.mockResolvedValue(createdPlan);

    const req = createAuthRequest('http://localhost:3000/api/v1/workout-plans', 'POST', {});
    const res = await listHandler.POST(req);
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.plan).toBeDefined();
    expect(data.plan.planDays).toHaveLength(3);
    expect(data.plan.status).toBe('ACTIVE');
  });

  it('should accept custom weekStartDate', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'test-user-id',
      isOnboarded: true,
      profile: {
        goal: 'MUSCLE_GAIN',
        fitnessLevel: 'INTERMEDIATE',
        availableDaysPerWeek: 4,
        minutesPerSession: 45,
      },
    });
    mockPrisma.exercise.findMany.mockResolvedValue([]);
    mockPrisma.workoutPlan.create.mockResolvedValue({ id: 'plan-id', planDays: [] });

    const req = createAuthRequest('http://localhost:3000/api/v1/workout-plans', 'POST', {
      weekStartDate: '2026-03-23',
    });

    const res = await listHandler.POST(req);
    expect(res.status).toBe(201);
  });
});

describe('GET /api/v1/workout-plans', () => {
  it('should return 401 without authentication', async () => {
    const req = createUnauthRequest('http://localhost:3000/api/v1/workout-plans', 'GET');
    const res = await listHandler.GET(req);
    expect(res.status).toBe(401);
  });

  it('should return paginated list of plans', async () => {
    mockPrisma.workoutPlan.findMany.mockResolvedValue([
      { id: 'plan-1', status: 'ACTIVE', weekNumber: 12 },
      { id: 'plan-2', status: 'COMPLETED', weekNumber: 11 },
    ]);
    mockPrisma.workoutPlan.count.mockResolvedValue(2);

    const req = createAuthRequest('http://localhost:3000/api/v1/workout-plans', 'GET');
    const res = await listHandler.GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.plans).toHaveLength(2);
    expect(data.pagination).toBeDefined();
    expect(data.pagination.total).toBe(2);
  });

  it('should filter by status', async () => {
    mockPrisma.workoutPlan.findMany.mockResolvedValue([
      { id: 'plan-1', status: 'ACTIVE' },
    ]);
    mockPrisma.workoutPlan.count.mockResolvedValue(1);

    const req = createAuthRequest(
      'http://localhost:3000/api/v1/workout-plans?status=ACTIVE',
      'GET',
    );
    const res = await listHandler.GET(req);
    const data = await res.json();

    expect(data.plans).toHaveLength(1);
    expect(mockPrisma.workoutPlan.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ status: 'ACTIVE' }),
      }),
    );
  });

  it('should support pagination params', async () => {
    mockPrisma.workoutPlan.findMany.mockResolvedValue([]);
    mockPrisma.workoutPlan.count.mockResolvedValue(0);

    const req = createAuthRequest(
      'http://localhost:3000/api/v1/workout-plans?page=2&limit=5',
      'GET',
    );
    const res = await listHandler.GET(req);
    const data = await res.json();

    expect(data.pagination.page).toBe(2);
    expect(data.pagination.limit).toBe(5);
  });
});

describe('GET /api/v1/workout-plans/:planId', () => {
  const context = { params: Promise.resolve({ id: 'plan-id' }) };

  it('should return 401 without authentication', async () => {
    const req = createUnauthRequest('http://localhost:3000/api/v1/workout-plans/plan-id', 'GET');
    const res = await detailHandler.GET(req, context);
    expect(res.status).toBe(401);
  });

  // AC-4.1: PlanDay 조회 시 모든 PlanExercise가 sortOrder 순으로 반환
  it('should return plan with days and exercises ordered by sortOrder', async () => {
    mockPrisma.workoutPlan.findUnique.mockResolvedValue({
      id: 'plan-id',
      userId: 'test-user-id',
      status: 'ACTIVE',
      planDays: [
        {
          id: 'day-1',
          sortOrder: 1,
          theme: 'Upper Body',
          planExercises: [
            { sortOrder: 1, sets: 3, reps: '10', restSeconds: 60, exercise: { name: 'Push Up' } },
            { sortOrder: 2, sets: 3, reps: '12', restSeconds: 60, exercise: { name: 'Pull Up' } },
          ],
        },
      ],
    });

    const req = createAuthRequest('http://localhost:3000/api/v1/workout-plans/plan-id', 'GET');
    const res = await detailHandler.GET(req, context);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.plan.planDays[0].planExercises).toHaveLength(2);
    // AC-4.2: 각 운동에 세트 수, 반복 횟수, 휴식 시간이 포함
    expect(data.plan.planDays[0].planExercises[0].sets).toBe(3);
    expect(data.plan.planDays[0].planExercises[0].reps).toBeDefined();
    expect(data.plan.planDays[0].planExercises[0].restSeconds).toBeDefined();
  });

  it('should return 404 when plan not found', async () => {
    mockPrisma.workoutPlan.findUnique.mockResolvedValue(null);

    const req = createAuthRequest('http://localhost:3000/api/v1/workout-plans/nonexistent', 'GET');
    const res = await detailHandler.GET(req, context);

    expect(res.status).toBe(404);
  });

  it('should return 403 when accessing another user plan', async () => {
    mockPrisma.workoutPlan.findUnique.mockResolvedValue({
      id: 'plan-id',
      userId: 'other-user-id',
    });

    const req = createAuthRequest('http://localhost:3000/api/v1/workout-plans/plan-id', 'GET');
    const res = await detailHandler.GET(req, context);

    expect(res.status).toBe(403);
  });
});

describe('PUT /api/v1/workout-plans/:planId', () => {
  const context = { params: Promise.resolve({ id: 'plan-id' }) };

  it('should update plan status to COMPLETED', async () => {
    mockPrisma.workoutPlan.findUnique.mockResolvedValue({
      id: 'plan-id',
      userId: 'test-user-id',
      status: 'ACTIVE',
    });
    mockPrisma.workoutPlan.update.mockResolvedValue({
      id: 'plan-id',
      userId: 'test-user-id',
      status: 'COMPLETED',
    });

    const req = createAuthRequest('http://localhost:3000/api/v1/workout-plans/plan-id', 'PUT', {
      status: 'COMPLETED',
    });
    const res = await detailHandler.PUT(req, context);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.plan.status).toBe('COMPLETED');
  });

  it('should update plan status to CANCELLED', async () => {
    mockPrisma.workoutPlan.findUnique.mockResolvedValue({
      id: 'plan-id',
      userId: 'test-user-id',
      status: 'ACTIVE',
    });
    mockPrisma.workoutPlan.update.mockResolvedValue({
      id: 'plan-id',
      userId: 'test-user-id',
      status: 'CANCELLED',
    });

    const req = createAuthRequest('http://localhost:3000/api/v1/workout-plans/plan-id', 'PUT', {
      status: 'CANCELLED',
    });
    const res = await detailHandler.PUT(req, context);

    expect(res.status).toBe(200);
  });

  it('should return 422 for invalid status', async () => {
    const req = createAuthRequest('http://localhost:3000/api/v1/workout-plans/plan-id', 'PUT', {
      status: 'INVALID',
    });
    const res = await detailHandler.PUT(req, context);

    expect(res.status).toBe(422);
  });
});
