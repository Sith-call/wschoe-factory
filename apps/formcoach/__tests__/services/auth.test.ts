import {
  hashPassword,
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  getAuthUser,
} from '@/lib/auth';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

// Set up env vars for tests
beforeAll(() => {
  process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing';
  process.env.JWT_REFRESH_SECRET = 'test-jwt-refresh-secret-key-for-testing';
});

describe('Auth Service', () => {
  describe('Password Hashing', () => {
    it('should hash a password with bcrypt', async () => {
      const password = 'TestPassword123';
      const hash = await hashPassword(password);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.startsWith('$2b$')).toBe(true); // bcrypt prefix
    });

    it('should produce different hashes for the same password', async () => {
      const password = 'TestPassword123';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      expect(hash1).not.toBe(hash2); // Different salts
    });

    it('should verify a correct password against its hash', async () => {
      const password = 'TestPassword123';
      const hash = await hashPassword(password);

      const isValid = await comparePassword(password, hash);
      expect(isValid).toBe(true);
    });

    it('should reject an incorrect password', async () => {
      const password = 'TestPassword123';
      const hash = await hashPassword(password);

      const isValid = await comparePassword('WrongPassword123', hash);
      expect(isValid).toBe(false);
    });
  });

  describe('JWT Access Token', () => {
    const mockUser = {
      id: 'test-user-id-123',
      email: 'test@example.com',
      subscriptionTier: 'FREE',
    };

    it('should generate a valid access token', () => {
      const token = generateAccessToken(mockUser);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    it('should include correct payload in access token', () => {
      const token = generateAccessToken(mockUser);
      const payload = verifyAccessToken(token);

      expect(payload.sub).toBe(mockUser.id);
      expect(payload.email).toBe(mockUser.email);
      expect(payload.tier).toBe(mockUser.subscriptionTier);
    });

    it('should set 15 minute expiration on access token', () => {
      const token = generateAccessToken(mockUser);
      const decoded = jwt.decode(token) as jwt.JwtPayload;

      expect(decoded.exp).toBeDefined();
      expect(decoded.iat).toBeDefined();
      // 15 minutes = 900 seconds
      expect(decoded.exp! - decoded.iat!).toBe(900);
    });

    it('should reject an expired access token', () => {
      const secret = process.env.JWT_SECRET!;
      const expiredToken = jwt.sign(
        { sub: 'test', email: 'test@test.com', tier: 'FREE' },
        secret,
        { expiresIn: '-1s' },
      );

      expect(() => verifyAccessToken(expiredToken)).toThrow();
    });

    it('should reject a token signed with wrong secret', () => {
      const badToken = jwt.sign(
        { sub: 'test', email: 'test@test.com', tier: 'FREE' },
        'wrong-secret',
        { expiresIn: '15m' },
      );

      expect(() => verifyAccessToken(badToken)).toThrow();
    });

    it('should throw if JWT_SECRET is not defined', () => {
      const original = process.env.JWT_SECRET;
      delete process.env.JWT_SECRET;

      expect(() => generateAccessToken(mockUser)).toThrow('JWT_SECRET is not defined');

      process.env.JWT_SECRET = original;
    });
  });

  describe('JWT Refresh Token', () => {
    it('should generate a valid refresh token', () => {
      const token = generateRefreshToken('test-user-id');

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });

    it('should include sub and tokenId in payload', () => {
      const token = generateRefreshToken('test-user-id');
      const payload = verifyRefreshToken(token);

      expect(payload.sub).toBe('test-user-id');
      expect(payload.tokenId).toBeDefined();
      expect(typeof payload.tokenId).toBe('string');
    });

    it('should set 7 day expiration on refresh token', () => {
      const token = generateRefreshToken('test-user-id');
      const decoded = jwt.decode(token) as jwt.JwtPayload;

      // 7 days = 604800 seconds
      expect(decoded.exp! - decoded.iat!).toBe(604800);
    });

    it('should generate unique tokenIds', () => {
      const token1 = generateRefreshToken('test-user-id');
      const token2 = generateRefreshToken('test-user-id');

      const payload1 = verifyRefreshToken(token1);
      const payload2 = verifyRefreshToken(token2);

      expect(payload1.tokenId).not.toBe(payload2.tokenId);
    });

    it('should throw if JWT_REFRESH_SECRET is not defined', () => {
      const original = process.env.JWT_REFRESH_SECRET;
      delete process.env.JWT_REFRESH_SECRET;

      expect(() => generateRefreshToken('test-id')).toThrow('JWT_REFRESH_SECRET is not defined');

      process.env.JWT_REFRESH_SECRET = original;
    });
  });

  describe('getAuthUser', () => {
    const mockUser = {
      id: 'test-user-id',
      email: 'test@example.com',
      subscriptionTier: 'FREE',
    };

    it('should extract user from valid Authorization header', () => {
      const token = generateAccessToken(mockUser);
      const request = new NextRequest('http://localhost:3000/api/test', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const user = getAuthUser(request);

      expect(user.sub).toBe(mockUser.id);
      expect(user.email).toBe(mockUser.email);
    });

    it('should throw on missing Authorization header', () => {
      const request = new NextRequest('http://localhost:3000/api/test');

      expect(() => getAuthUser(request)).toThrow('Missing or invalid Authorization header');
    });

    it('should throw on Authorization header without Bearer prefix', () => {
      const request = new NextRequest('http://localhost:3000/api/test', {
        headers: {
          Authorization: 'Basic sometoken',
        },
      });

      expect(() => getAuthUser(request)).toThrow('Missing or invalid Authorization header');
    });

    it('should throw on invalid token', () => {
      const request = new NextRequest('http://localhost:3000/api/test', {
        headers: {
          Authorization: 'Bearer invalid-token',
        },
      });

      expect(() => getAuthUser(request)).toThrow();
    });
  });
});
