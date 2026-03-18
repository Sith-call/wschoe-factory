import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { profileSchema } from '@/lib/validators';
import { ZodError } from 'zod';

export async function GET(request: NextRequest) {
  try {
    const user = getAuthUser(request);

    const profile = await prisma.userProfile.findUnique({
      where: { userId: user.sub },
    });

    if (!profile) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Profile not found' } },
        { status: 404 },
      );
    }

    return NextResponse.json({ profile });
  } catch {
    return NextResponse.json(
      { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
      { status: 401 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    let user;
    try {
      user = getAuthUser(request);
    } catch {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 },
      );
    }

    const body = await request.json();
    const data = profileSchema.parse(body);

    const profile = await prisma.userProfile.upsert({
      where: { userId: user.sub },
      create: {
        userId: user.sub,
        goal: data.goal,
        fitnessLevel: data.fitnessLevel,
        availableDaysPerWeek: data.availableDaysPerWeek,
        minutesPerSession: data.minutesPerSession,
        height: data.height ?? null,
        weight: data.weight ?? null,
        birthYear: data.birthYear ?? null,
        gender: data.gender ?? null,
        injuries: data.injuries ?? null,
      },
      update: {
        goal: data.goal,
        fitnessLevel: data.fitnessLevel,
        availableDaysPerWeek: data.availableDaysPerWeek,
        minutesPerSession: data.minutesPerSession,
        height: data.height ?? null,
        weight: data.weight ?? null,
        birthYear: data.birthYear ?? null,
        gender: data.gender ?? null,
        injuries: data.injuries ?? null,
      },
    });

    // Set isOnboarded to true
    await prisma.user.update({
      where: { id: user.sub },
      data: { isOnboarded: true },
    });

    return NextResponse.json({ profile });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: error.errors.map((e) => e.message).join(', '),
          },
        },
        { status: 422 },
      );
    }

    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 },
    );
  }
}
