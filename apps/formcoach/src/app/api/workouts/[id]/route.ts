import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { workoutLogUpdateSchema } from '@/lib/validators';
import { ZodError } from 'zod';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
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

    const { id } = await context.params;

    const workoutLog = await prisma.workoutLog.findUnique({
      where: { id },
      include: {
        entries: {
          include: {
            exercise: true,
          },
          orderBy: { setNumber: 'asc' },
        },
      },
    });

    if (!workoutLog) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Workout log not found' } },
        { status: 404 },
      );
    }

    if (workoutLog.userId !== user.sub) {
      return NextResponse.json(
        { error: { code: 'FORBIDDEN', message: 'Access denied' } },
        { status: 403 },
      );
    }

    return NextResponse.json({ workoutLog });
  } catch (error) {
    console.error('Get workout log error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
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

    const { id } = await context.params;
    const body = await request.json();
    const data = workoutLogUpdateSchema.parse(body);

    const workoutLog = await prisma.workoutLog.findUnique({
      where: { id },
    });

    if (!workoutLog) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Workout log not found' } },
        { status: 404 },
      );
    }

    if (workoutLog.userId !== user.sub) {
      return NextResponse.json(
        { error: { code: 'FORBIDDEN', message: 'Access denied' } },
        { status: 403 },
      );
    }

    const updateData: Record<string, unknown> = {};

    if (data.feeling !== undefined) {
      updateData.feeling = data.feeling;
    }
    if (data.memo !== undefined) {
      updateData.memo = data.memo;
    }

    if (data.completedAt) {
      const completedAt = new Date(data.completedAt);
      updateData.completedAt = completedAt;

      // Calculate duration in minutes
      const startedAt = workoutLog.startedAt;
      const durationMs = completedAt.getTime() - startedAt.getTime();
      updateData.durationMinutes = Math.round(durationMs / 60000);
    }

    const updatedLog = await prisma.workoutLog.update({
      where: { id },
      data: updateData,
    });

    // Update streak if workout is completed
    if (data.completedAt) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayStr = today.toISOString().split('T')[0];

      const streak = await prisma.streak.findUnique({
        where: { userId: user.sub },
      });

      if (streak) {
        const lastWorkoutDate = streak.lastWorkoutDate
          ? new Date(streak.lastWorkoutDate).toISOString().split('T')[0]
          : null;

        if (lastWorkoutDate !== todayStr) {
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];

          let newCurrentStreak: number;

          if (lastWorkoutDate === yesterdayStr) {
            // Consecutive day
            newCurrentStreak = streak.currentStreak + 1;
          } else if (lastWorkoutDate === todayStr) {
            // Already recorded today
            newCurrentStreak = streak.currentStreak;
          } else {
            // Streak broken, start new
            newCurrentStreak = 1;
          }

          const newLongestStreak = Math.max(streak.longestStreak, newCurrentStreak);

          await prisma.streak.update({
            where: { userId: user.sub },
            data: {
              currentStreak: newCurrentStreak,
              longestStreak: newLongestStreak,
              lastWorkoutDate: today,
            },
          });
        }
      } else {
        // Create first streak record
        await prisma.streak.create({
          data: {
            userId: user.sub,
            currentStreak: 1,
            longestStreak: 1,
            lastWorkoutDate: today,
          },
        });
      }
    }

    return NextResponse.json({ workoutLog: updatedLog });
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

    console.error('Update workout log error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 },
    );
  }
}
