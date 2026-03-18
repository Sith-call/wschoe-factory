/**
 * Auth API Tests
 * Tests: signup, login, token refresh, logout
 * Covers TRD acceptance criteria: AC-1.1 ~ AC-1.6
 */

import { NextRequest } from 'next/server';

// Mock Prisma
const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
};

jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: mockPrisma,
  prisma: mockPrisma,
}));

// Set up env vars
beforeAll(() => {
  process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing';
  process.env.JWT_REFRESH_SECRET = 'test-jwt-refresh-secret-key-for-testing';
});

// Dynamic imports after mocking
let signupHandler: (req: NextRequest) => Promise<Response>;
let loginHandler: (req: NextRequest) => Promise<Response>;
let refreshHandler: (req: NextRequest) => Promise<Response>;
let logoutHandler: (req: NextRequest) => Promise<Response>;

beforeAll(async () => {
  const signup = await import('@/app/api/auth/signup/route');
  signupHandler = signup.POST;

  const login = await import('@/app/api/auth/login/route');
  loginHandler = login.POST;

  const refresh = await import('@/app/api/auth/refresh/route');
  refreshHandler = refresh.POST;

  const logout = await import('@/app/api/auth/logout/route');
  logoutHandler = logout.POST;
});

beforeEach(() => {
  jest.clearAllMocks();
});

function createRequest(body: unknown, headers?: Record<string, string>): NextRequest {
  return new NextRequest('http://localhost:3000/api/v1/auth/test', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });
}

describe('POST /api/v1/auth/signup', () => {
  // AC-1.1: 유효한 이메일/비밀번호로 가입 시 JWT 토큰 쌍이 반환된다
  it('should return 201 with user and tokens on valid signup', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    mockPrisma.user.create.mockResolvedValue({
      id: 'new-user-id',
      email: 'new@example.com',
      name: 'Test User',
      subscriptionTier: 'FREE',
      isOnboarded: false,
      passwordHash: 'hashed',
    });

    const req = createRequest({
      email: 'new@example.com',
      password: 'TestPass123',
      name: 'Test User',
    });

    const res = await signupHandler(req);
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.user).toBeDefined();
    expect(data.user.id).toBe('new-user-id');
    expect(data.user.email).toBe('new@example.com');
    expect(data.user.subscriptionTier).toBe('FREE');
    expect(data.user.isOnboarded).toBe(false);
    expect(data.tokens).toBeDefined();
    expect(data.tokens.accessToken).toBeDefined();
    expect(data.tokens.refreshToken).toBeDefined();
  });

  // AC-1.2: 중복 이메일 가입 시 409 에러가 반환된다
  it('should return 409 when email already exists', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'existing-user',
      email: 'existing@example.com',
    });

    const req = createRequest({
      email: 'existing@example.com',
      password: 'TestPass123',
      name: 'Test User',
    });

    const res = await signupHandler(req);
    const data = await res.json();

    expect(res.status).toBe(409);
    expect(data.error.code).toBe('EMAIL_DUPLICATE');
  });

  // AC-1.3: 비밀번호 규칙 미충족 시 422 에러와 구체적 메시지가 반환된다
  it('should return 422 when password is too short', async () => {
    const req = createRequest({
      email: 'test@example.com',
      password: 'Short1',
      name: 'Test User',
    });

    const res = await signupHandler(req);
    const data = await res.json();

    expect(res.status).toBe(422);
    expect(data.error.code).toBe('VALIDATION_ERROR');
    expect(data.error.message).toContain('at least 8 characters');
  });

  it('should return 422 when password lacks uppercase', async () => {
    const req = createRequest({
      email: 'test@example.com',
      password: 'lowercase123',
      name: 'Test User',
    });

    const res = await signupHandler(req);
    const data = await res.json();

    expect(res.status).toBe(422);
    expect(data.error.code).toBe('VALIDATION_ERROR');
    expect(data.error.message).toContain('uppercase');
  });

  it('should return 422 when password lacks lowercase', async () => {
    const req = createRequest({
      email: 'test@example.com',
      password: 'UPPERCASE123',
      name: 'Test User',
    });

    const res = await signupHandler(req);
    const data = await res.json();

    expect(res.status).toBe(422);
    expect(data.error.code).toBe('VALIDATION_ERROR');
    expect(data.error.message).toContain('lowercase');
  });

  it('should return 422 when password lacks numbers', async () => {
    const req = createRequest({
      email: 'test@example.com',
      password: 'NoNumbers',
      name: 'Test User',
    });

    const res = await signupHandler(req);
    const data = await res.json();

    expect(res.status).toBe(422);
    expect(data.error.code).toBe('VALIDATION_ERROR');
    expect(data.error.message).toContain('number');
  });

  it('should return 422 for invalid email format', async () => {
    const req = createRequest({
      email: 'not-an-email',
      password: 'TestPass123',
      name: 'Test User',
    });

    const res = await signupHandler(req);
    expect(res.status).toBe(422);
  });

  it('should return 422 when name is too short', async () => {
    const req = createRequest({
      email: 'test@example.com',
      password: 'TestPass123',
      name: 'A',
    });

    const res = await signupHandler(req);
    expect(res.status).toBe(422);
  });

  it('should return 422 when name exceeds 50 characters', async () => {
    const req = createRequest({
      email: 'test@example.com',
      password: 'TestPass123',
      name: 'A'.repeat(51),
    });

    const res = await signupHandler(req);
    expect(res.status).toBe(422);
  });

  it('should not include passwordHash in response', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    mockPrisma.user.create.mockResolvedValue({
      id: 'new-user-id',
      email: 'new@example.com',
      name: 'Test',
      subscriptionTier: 'FREE',
      isOnboarded: false,
      passwordHash: 'hashed',
    });

    const req = createRequest({
      email: 'new@example.com',
      password: 'TestPass123',
      name: 'Test',
    });

    const res = await signupHandler(req);
    const data = await res.json();

    expect(data.user.passwordHash).toBeUndefined();
  });
});

describe('POST /api/v1/auth/login', () => {
  it('should return 200 with user and tokens on valid login', async () => {
    // bcrypt hash of 'TestPass123'
    const bcrypt = await import('bcrypt');
    const hash = await bcrypt.hash('TestPass123', 12);

    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'user-id',
      email: 'user@example.com',
      name: 'Test User',
      subscriptionTier: 'FREE',
      isOnboarded: true,
      passwordHash: hash,
    });

    const req = createRequest({
      email: 'user@example.com',
      password: 'TestPass123',
    });

    const res = await loginHandler(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.user.email).toBe('user@example.com');
    expect(data.tokens.accessToken).toBeDefined();
    expect(data.tokens.refreshToken).toBeDefined();
  });

  it('should return 401 when user not found', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);

    const req = createRequest({
      email: 'nonexistent@example.com',
      password: 'TestPass123',
    });

    const res = await loginHandler(req);
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.error.code).toBe('AUTH_FAILED');
  });

  it('should return 401 when password is wrong', async () => {
    const bcrypt = await import('bcrypt');
    const hash = await bcrypt.hash('CorrectPass123', 12);

    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'user-id',
      email: 'user@example.com',
      passwordHash: hash,
    });

    const req = createRequest({
      email: 'user@example.com',
      password: 'WrongPass123',
    });

    const res = await loginHandler(req);
    expect(res.status).toBe(401);
  });

  it('should return same error message for wrong email and wrong password (security)', async () => {
    // Wrong email
    mockPrisma.user.findUnique.mockResolvedValue(null);
    const res1 = await loginHandler(
      createRequest({ email: 'wrong@example.com', password: 'TestPass123' }),
    );
    const data1 = await res1.json();

    // Wrong password
    const bcrypt = await import('bcrypt');
    const hash = await bcrypt.hash('CorrectPass123', 12);
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'user-id',
      email: 'user@example.com',
      passwordHash: hash,
    });
    const res2 = await loginHandler(
      createRequest({ email: 'user@example.com', password: 'WrongPass123' }),
    );
    const data2 = await res2.json();

    // Both should have the same generic error message
    expect(data1.error.message).toBe(data2.error.message);
  });

  it('should return 422 for missing email', async () => {
    const req = createRequest({ password: 'TestPass123' });
    const res = await loginHandler(req);
    expect(res.status).toBe(422);
  });
});

describe('POST /api/v1/auth/refresh', () => {
  // AC-1.5: Access Token 만료 시 Refresh Token으로 갱신된다
  it('should return new token pair with valid refresh token', async () => {
    const { generateRefreshToken } = await import('@/lib/auth');
    const token = generateRefreshToken('user-id');

    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'user-id',
      email: 'user@example.com',
      subscriptionTier: 'FREE',
    });

    const req = createRequest({ refreshToken: token });
    const res = await refreshHandler(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.tokens.accessToken).toBeDefined();
    expect(data.tokens.refreshToken).toBeDefined();
    // New refresh token should be different
    expect(data.tokens.refreshToken).not.toBe(token);
  });

  it('should return 401 for invalid refresh token', async () => {
    const req = createRequest({ refreshToken: 'invalid-token' });
    const res = await refreshHandler(req);

    expect(res.status).toBe(401);
  });

  it('should return 401 when user no longer exists', async () => {
    const { generateRefreshToken } = await import('@/lib/auth');
    const token = generateRefreshToken('deleted-user-id');

    mockPrisma.user.findUnique.mockResolvedValue(null);

    const req = createRequest({ refreshToken: token });
    const res = await refreshHandler(req);

    expect(res.status).toBe(401);
  });
});

describe('POST /api/v1/auth/logout', () => {
  // AC-1.6: 로그아웃
  it('should return 200 on successful logout', async () => {
    const { generateAccessToken } = await import('@/lib/auth');
    const token = generateAccessToken({
      id: 'user-id',
      email: 'user@example.com',
      subscriptionTier: 'FREE',
    });

    const req = new NextRequest('http://localhost:3000/api/v1/auth/logout', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken: 'some-refresh-token' }),
    });

    const res = await logoutHandler(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.message).toBeDefined();
  });

  it('should return 401 without auth token', async () => {
    const req = new NextRequest('http://localhost:3000/api/v1/auth/logout', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const res = await logoutHandler(req);
    expect(res.status).toBe(401);
  });
});
