/**
 * Workouts API Tests
 * Tests: workout log CRUD, entries
 * Covers TRD acceptance criteria: AC-5.1 ~ AC-5.5
 */

import { NextRequest } from 'next/server';

const mockPrisma = {
  workoutLog: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
  },
  workoutLogEntry: {
    create: jest.fn(),
  },
  streak: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
};

jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: mockPrisma,
  prisma: mockPrisma,
}));

beforeAll(() => {
  process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing';
  process.env.JWT_REFRESH_SECRET = 'test-jwt-refresh-secret-key-for-testing';
});

let listHandler: { GET: (req: NextRequest) => Promise<Response>; POST: (req: NextRequest) => Promise<Response> };
let detailHandler: { GET: (req: NextRequest, ctx: unknown) => Promise<Response>; PATCH: (req: NextRequest, ctx: unknown) => Promise<Response> };
let entriesHandler: { POST: (req: NextRequest, ctx: unknown) => Promise<Response> };

beforeAll(async () => {
  listHandler = await import('@/app/api/workouts/route');
  detailHandler = await import('@/app/api/workouts/[id]/route');
  entriesHandler = await import('@/app/api/workouts/[id]/entries/route');
});

beforeEach(() => {
  jest.clearAllMocks();
});

function createAuthRequest(url: string, method: string, body?: unknown): NextRequest {
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
  if (body) init.body = JSON.stringify(body);
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

describe('POST /api/v1/workouts', () => {
  // AC-5.1: 운동 시작 시 WorkoutLog가 생성되고 startedAt이 기록된다
  it('should create workout log with startedAt', async () => {
    const now = new Date();
    mockPrisma.workoutLog.create.mockResolvedValue({
      id: 'log-id',
      userId: 'test-user-id',
      planDayId: null,
      startedAt: now,
    });

    const req = createAuthRequest('http://localhost:3000/api/v1/workouts', 'POST', {});
    const res = await listHandler.POST(req);
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.workoutLog).toBeDefined();
    expect(data.workoutLog.startedAt).toBeDefined();
  });

  it('should create workout log with planDayId', async () => {
    mockPrisma.workoutLog.create.mockResolvedValue({
      id: 'log-id',
      userId: 'test-user-id',
      planDayId: 'plan-day-id',
      startedAt: new Date(),
    });

    const req = createAuthRequest('http://localhost:3000/api/v1/workouts', 'POST', {
      planDayId: '550e8400-e29b-41d4-a716-446655440000',
    });
    const res = await listHandler.POST(req);

    expect(res.status).toBe(201);
  });

  it('should return 401 without authentication', async () => {
    const req = createUnauthRequest('http://localhost:3000/api/v1/workouts', 'POST', {});
    const res = await listHandler.POST(req);
    expect(res.status).toBe(401);
  });
});

describe('GET /api/v1/workouts', () => {
  it('should return paginated workout logs', async () => {
    mockPrisma.workoutLog.findMany.mockResolvedValue([
      { id: 'log-1', startedAt: new Date(), entries: [] },
      { id: 'log-2', startedAt: new Date(), entries: [] },
    ]);
    mockPrisma.workoutLog.count.mockResolvedValue(2);

    const req = createAuthRequest('http://localhost:3000/api/v1/workouts', 'GET');
    const res = await listHandler.GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.logs).toHaveLength(2);
    expect(data.pagination.total).toBe(2);
  });

  it('should filter by date range', async () => {
    mockPrisma.workoutLog.findMany.mockResolvedValue([]);
    mockPrisma.workoutLog.count.mockResolvedValue(0);

    const req = createAuthRequest(
      'http://localhost:3000/api/v1/workouts?from=2026-03-01&to=2026-03-18',
      'GET',
    );
    const res = await listHandler.GET(req);

    expect(res.status).toBe(200);
    expect(mockPrisma.workoutLog.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          startedAt: expect.objectContaining({
            gte: expect.any(Date),
            lte: expect.any(Date),
          }),
        }),
      }),
    );
  });

  it('should return 401 without authentication', async () => {
    const req = createUnauthRequest('http://localhost:3000/api/v1/workouts', 'GET');
    const res = await listHandler.GET(req);
    expect(res.status).toBe(401);
  });
});

describe('GET /api/v1/workouts/:logId', () => {
  const context = { params: Promise.resolve({ id: 'log-id' }) };

  it('should return workout log with entries', async () => {
    mockPrisma.workoutLog.findUnique.mockResolvedValue({
      id: 'log-id',
      userId: 'test-user-id',
      startedAt: new Date(),
      entries: [
        { id: 'entry-1', setNumber: 1, reps: 10, exercise: { name: 'Push Up' } },
      ],
    });

    const req = createAuthRequest('http://localhost:3000/api/v1/workouts/log-id', 'GET');
    const res = await detailHandler.GET(req, context);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.workoutLog.entries).toHaveLength(1);
  });

  it('should return 404 when log not found', async () => {
    mockPrisma.workoutLog.findUnique.mockResolvedValue(null);

    const req = createAuthRequest('http://localhost:3000/api/v1/workouts/nonexistent', 'GET');
    const res = await detailHandler.GET(req, context);

    expect(res.status).toBe(404);
  });

  // AC-5.5: 다른 사용자의 WorkoutLog 접근 시 403이 반환된다
  it('should return 403 when accessing another user log', async () => {
    mockPrisma.workoutLog.findUnique.mockResolvedValue({
      id: 'log-id',
      userId: 'other-user-id',
    });

    const req = createAuthRequest('http://localhost:3000/api/v1/workouts/log-id', 'GET');
    const res = await detailHandler.GET(req, context);

    expect(res.status).toBe(403);
  });
});

describe('PATCH /api/v1/workouts/:logId', () => {
  const context = { params: Promise.resolve({ id: 'log-id' }) };

  // AC-5.3: 운동 완료 시 completedAt이 기록되고 durationMinutes가 계산된다
  it('should complete workout and calculate duration', async () => {
    const startedAt = new Date('2026-03-18T10:00:00Z');
    const completedAt = '2026-03-18T10:45:00Z';

    mockPrisma.workoutLog.findUnique.mockResolvedValue({
      id: 'log-id',
      userId: 'test-user-id',
      startedAt,
    });

    mockPrisma.workoutLog.update.mockResolvedValue({
      id: 'log-id',
      userId: 'test-user-id',
      startedAt,
      completedAt: new Date(completedAt),
      durationMinutes: 45,
      feeling: null,
    });

    // AC-5.4: 운동 완료 시 Streak이 자동 갱신된다
    mockPrisma.streak.findUnique.mockResolvedValue({
      userId: 'test-user-id',
      currentStreak: 2,
      longestStreak: 5,
      lastWorkoutDate: new Date('2026-03-17'),
    });
    mockPrisma.streak.update.mockResolvedValue({});

    const req = createAuthRequest('http://localhost:3000/api/v1/workouts/log-id', 'PATCH', {
      completedAt,
    });
    const res = await detailHandler.PATCH(req, context);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.workoutLog).toBeDefined();
  });

  it('should update feeling and memo', async () => {
    mockPrisma.workoutLog.findUnique.mockResolvedValue({
      id: 'log-id',
      userId: 'test-user-id',
      startedAt: new Date(),
    });

    mockPrisma.workoutLog.update.mockResolvedValue({
      id: 'log-id',
      feeling: 'MODERATE',
      memo: 'Good workout today',
    });

    const req = createAuthRequest('http://localhost:3000/api/v1/workouts/log-id', 'PATCH', {
      feeling: 'MODERATE',
      memo: 'Good workout today',
    });
    const res = await detailHandler.PATCH(req, context);

    expect(res.status).toBe(200);
  });

  it('should return 422 for invalid feeling value', async () => {
    const req = createAuthRequest('http://localhost:3000/api/v1/workouts/log-id', 'PATCH', {
      feeling: 'INVALID_FEELING',
    });
    const res = await detailHandler.PATCH(req, context);

    expect(res.status).toBe(422);
  });

  // AC-5.4: Streak 자동 갱신 - 첫 운동 시 streak 생성
  it('should create streak record on first completed workout', async () => {
    mockPrisma.workoutLog.findUnique.mockResolvedValue({
      id: 'log-id',
      userId: 'test-user-id',
      startedAt: new Date(),
    });
    mockPrisma.workoutLog.update.mockResolvedValue({
      id: 'log-id',
      completedAt: new Date(),
    });
    mockPrisma.streak.findUnique.mockResolvedValue(null); // No existing streak
    mockPrisma.streak.create.mockResolvedValue({
      userId: 'test-user-id',
      currentStreak: 1,
      longestStreak: 1,
    });

    const req = createAuthRequest('http://localhost:3000/api/v1/workouts/log-id', 'PATCH', {
      completedAt: new Date().toISOString(),
    });
    const res = await detailHandler.PATCH(req, context);

    expect(res.status).toBe(200);
    expect(mockPrisma.streak.create).toHaveBeenCalled();
  });
});

describe('POST /api/v1/workouts/:logId/entries', () => {
  const context = { params: Promise.resolve({ id: 'log-id' }) };

  // AC-5.2: 세트별 기록(reps, weight)이 WorkoutLogEntry로 저장된다
  it('should create workout log entry', async () => {
    mockPrisma.workoutLog.findUnique.mockResolvedValue({
      id: 'log-id',
      userId: 'test-user-id',
    });

    mockPrisma.workoutLogEntry.create.mockResolvedValue({
      id: 'entry-id',
      workoutLogId: 'log-id',
      exerciseId: '550e8400-e29b-41d4-a716-446655440000',
      setNumber: 1,
      reps: 12,
      weight: 60,
      completed: true,
      exercise: { name: 'Bench Press' },
    });

    const req = createAuthRequest('http://localhost:3000/api/v1/workouts/log-id/entries', 'POST', {
      exerciseId: '550e8400-e29b-41d4-a716-446655440000',
      setNumber: 1,
      reps: 12,
      weight: 60,
    });
    const res = await entriesHandler.POST(req, context);
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.entry).toBeDefined();
    expect(data.entry.reps).toBe(12);
    expect(data.entry.weight).toBe(60);
  });

  it('should create entry with duration for timed exercises', async () => {
    mockPrisma.workoutLog.findUnique.mockResolvedValue({
      id: 'log-id',
      userId: 'test-user-id',
    });

    mockPrisma.workoutLogEntry.create.mockResolvedValue({
      id: 'entry-id',
      exerciseId: '550e8400-e29b-41d4-a716-446655440000',
      setNumber: 1,
      durationSeconds: 60,
      completed: true,
      exercise: { name: 'Plank' },
    });

    const req = createAuthRequest('http://localhost:3000/api/v1/workouts/log-id/entries', 'POST', {
      exerciseId: '550e8400-e29b-41d4-a716-446655440000',
      setNumber: 1,
      durationSeconds: 60,
    });
    const res = await entriesHandler.POST(req, context);

    expect(res.status).toBe(201);
  });

  it('should return 404 when workout log not found', async () => {
    mockPrisma.workoutLog.findUnique.mockResolvedValue(null);

    const req = createAuthRequest('http://localhost:3000/api/v1/workouts/nonexistent/entries', 'POST', {
      exerciseId: '550e8400-e29b-41d4-a716-446655440000',
      setNumber: 1,
      reps: 10,
    });
    const res = await entriesHandler.POST(req, context);

    expect(res.status).toBe(404);
  });

  it('should return 403 when log belongs to another user', async () => {
    mockPrisma.workoutLog.findUnique.mockResolvedValue({
      id: 'log-id',
      userId: 'other-user-id',
    });

    const req = createAuthRequest('http://localhost:3000/api/v1/workouts/log-id/entries', 'POST', {
      exerciseId: '550e8400-e29b-41d4-a716-446655440000',
      setNumber: 1,
      reps: 10,
    });
    const res = await entriesHandler.POST(req, context);

    expect(res.status).toBe(403);
  });

  it('should return 422 for invalid exerciseId format', async () => {
    const req = createAuthRequest('http://localhost:3000/api/v1/workouts/log-id/entries', 'POST', {
      exerciseId: 'not-a-uuid',
      setNumber: 1,
      reps: 10,
    });
    const res = await entriesHandler.POST(req, context);

    expect(res.status).toBe(422);
  });

  it('should return 422 for missing setNumber', async () => {
    const req = createAuthRequest('http://localhost:3000/api/v1/workouts/log-id/entries', 'POST', {
      exerciseId: '550e8400-e29b-41d4-a716-446655440000',
      reps: 10,
    });
    const res = await entriesHandler.POST(req, context);

    expect(res.status).toBe(422);
  });

  it('should return 401 without authentication', async () => {
    const req = createUnauthRequest('http://localhost:3000/api/v1/workouts/log-id/entries', 'POST', {
      exerciseId: '550e8400-e29b-41d4-a716-446655440000',
      setNumber: 1,
    });
    const res = await entriesHandler.POST(req, context);

    expect(res.status).toBe(401);
  });
});
