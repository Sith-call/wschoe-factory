import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { NextRequest } from 'next/server';

const SALT_ROUNDS = 12;

interface AccessTokenPayload {
  sub: string;
  email: string;
  tier: string;
}

interface RefreshTokenPayload {
  sub: string;
  tokenId: string;
}

interface UserForToken {
  id: string;
  email: string;
  subscriptionTier: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateAccessToken(user: UserForToken): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not defined');

  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      tier: user.subscriptionTier,
    },
    secret,
    { expiresIn: '15m' },
  );
}

export function generateRefreshToken(userId: string): string {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) throw new Error('JWT_REFRESH_SECRET is not defined');

  return jwt.sign(
    {
      sub: userId,
      tokenId: randomUUID(),
    },
    secret,
    { expiresIn: '7d' },
  );
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not defined');

  return jwt.verify(token, secret) as AccessTokenPayload;
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) throw new Error('JWT_REFRESH_SECRET is not defined');

  return jwt.verify(token, secret) as RefreshTokenPayload;
}

export function getAuthUser(request: NextRequest): AccessTokenPayload {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Missing or invalid Authorization header');
  }

  const token = authHeader.slice(7);
  return verifyAccessToken(token);
}
