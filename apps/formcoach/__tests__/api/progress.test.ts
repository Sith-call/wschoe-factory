/**
 * Progress API Tests
 * Tests: summary data, dashboard statistics
 * Covers TRD acceptance criteria: AC-6.1 ~ AC-6.3
 */

import { NextRequest } from 'next/server';

const mockPrisma = {
  streak: {
    findUnique: jest.fn(),
  },
  workoutLog: {
    count: jest.fn(),
    aggregate: jest.fn(),
  },
  userProfile: {
    findUnique: jest.fn(),
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

let progressHandler: { GET: (req: NextRequest) => Promise<Response> };

beforeAll(async () => {
  progressHandler = await import('@/app/api/progress/route');
});

beforeEach(() => {
  jest.clearAllMocks();
});

function createAuthRequest(url: string): NextRequest {
  const { generateAccessToken } = require('@/lib/auth');
  const token = generateAccessToken({
    id: 'test-user-id',
    email: 'test@example.com',
    subscriptionTier: 'FREE',
  });

  return new NextRequest(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

describe('GET /api/v1/progress/summary', () => {
  it('should return 401 without authentication', async () => {
    const req = new NextRequest('http://localhost:3000/api/v1/progress');
    const res = await progressHandler.GET(req);
    expect(res.status).toBe(401);
  });

  // AC-6.1: summary API가 현재 스트릭, 이번 주 운동 횟수, 완료율을 정확히 반환한다
  it('should return correct summary data for active user', async () => {
    mockPrisma.streak.findUnique.mockResolvedValue({
      currentStreak: 5,
      longestStreak: 12,
    });

    // Total completed workouts
    mockPrisma.workoutLog.count
      .mockResolvedValueOnce(28) // total
      .mockResolvedValueOnce(3);  // this week

    mockPrisma.userProfile.findUnique.mockResolvedValue({
      availableDaysPerWeek: 4,
    });

    // Total minutes
    mockPrisma.workoutLog.aggregate
      .mockResolvedValueOnce({
        _sum: { durationMinutes: 1260 },
      })
      .mockResolvedValueOnce({
        _sum: { durationMinutes: 180 },
      });

    const req = createAuthRequest('http://localhost:3000/api/v1/progress');
    const res = await progressHandler.GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.summary).toBeDefined();
    expect(data.summary.currentStreak).toBe(5);
    expect(data.summary.longestStreak).toBe(12);
    expect(data.summary.totalWorkouts).toBe(28);
    expect(data.summary.thisWeekWorkouts).toBe(3);
    expect(data.summary.thisWeekGoal).toBe(4);
    expect(data.summary.completionRate).toBe(0.75);
    expect(data.summary.totalMinutes).toBe(1260);
    expect(data.summary.thisMonthMinutes).toBe(180);
  });

  // AC-6.3: 운동 기록이 없는 새 사용자에게 기본값(0)이 반환된다
  it('should return default zeros for new user', async () => {
    mockPrisma.streak.findUnique.mockResolvedValue(null);
    mockPrisma.workoutLog.count
      .mockResolvedValueOnce(0) // total
      .mockResolvedValueOnce(0); // this week
    mockPrisma.userProfile.findUnique.mockResolvedValue(null);
    mockPrisma.workoutLog.aggregate
      .mockResolvedValueOnce({ _sum: { durationMinutes: null } })
      .mockResolvedValueOnce({ _sum: { durationMinutes: null } });

    const req = createAuthRequest('http://localhost:3000/api/v1/progress');
    const res = await progressHandler.GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.summary.currentStreak).toBe(0);
    expect(data.summary.longestStreak).toBe(0);
    expect(data.summary.totalWorkouts).toBe(0);
    expect(data.summary.thisWeekWorkouts).toBe(0);
    expect(data.summary.thisWeekGoal).toBe(0);
    expect(data.summary.completionRate).toBe(0);
    expect(data.summary.totalMinutes).toBe(0);
    expect(data.summary.thisMonthMinutes).toBe(0);
  });

  it('should calculate completion rate correctly', async () => {
    mockPrisma.streak.findUnique.mockResolvedValue({ currentStreak: 0, longestStreak: 0 });
    mockPrisma.workoutLog.count
      .mockResolvedValueOnce(10) // total
      .mockResolvedValueOnce(2);  // this week
    mockPrisma.userProfile.findUnique.mockResolvedValue({
      availableDaysPerWeek: 5,
    });
    mockPrisma.workoutLog.aggregate
      .mockResolvedValueOnce({ _sum: { durationMinutes: 300 } })
      .mockResolvedValueOnce({ _sum: { durationMinutes: 60 } });

    const req = createAuthRequest('http://localhost:3000/api/v1/progress');
    const res = await progressHandler.GET(req);
    const data = await res.json();

    // 2 workouts / 5 goal = 0.4
    expect(data.summary.completionRate).toBe(0.4);
  });

  it('should handle zero weekly goal without division by zero', async () => {
    mockPrisma.streak.findUnique.mockResolvedValue({ currentStreak: 0, longestStreak: 0 });
    mockPrisma.workoutLog.count
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce(0);
    mockPrisma.userProfile.findUnique.mockResolvedValue({
      availableDaysPerWeek: 0,
    });
    mockPrisma.workoutLog.aggregate
      .mockResolvedValueOnce({ _sum: { durationMinutes: null } })
      .mockResolvedValueOnce({ _sum: { durationMinutes: null } });

    const req = createAuthRequest('http://localhost:3000/api/v1/progress');
    const res = await progressHandler.GET(req);
    const data = await res.json();

    expect(data.summary.completionRate).toBe(0);
  });
});
