import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
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

    // Get streak data
    const streak = await prisma.streak.findUnique({
      where: { userId: user.sub },
    });

    const currentStreak = streak?.currentStreak ?? 0;
    const longestStreak = streak?.longestStreak ?? 0;

    // Get total completed workouts
    const totalWorkouts = await prisma.workoutLog.count({
      where: {
        userId: user.sub,
        completedAt: { not: null },
      },
    });

    // Get this week's workouts (Monday to Sunday)
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - diffToMonday);
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const thisWeekWorkouts = await prisma.workoutLog.count({
      where: {
        userId: user.sub,
        completedAt: { not: null },
        startedAt: {
          gte: weekStart,
          lte: weekEnd,
        },
      },
    });

    // Get user profile for weekly goal
    const profile = await prisma.userProfile.findUnique({
      where: { userId: user.sub },
    });

    const thisWeekGoal = profile?.availableDaysPerWeek ?? 0;
    const completionRate =
      thisWeekGoal > 0
        ? Math.round((thisWeekWorkouts / thisWeekGoal) * 100) / 100
        : 0;

    // Get total minutes
    const totalMinutesResult = await prisma.workoutLog.aggregate({
      where: {
        userId: user.sub,
        completedAt: { not: null },
        durationMinutes: { not: null },
      },
      _sum: {
        durationMinutes: true,
      },
    });

    const totalMinutes = totalMinutesResult._sum.durationMinutes ?? 0;

    // Get this month's minutes
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const thisMonthMinutesResult = await prisma.workoutLog.aggregate({
      where: {
        userId: user.sub,
        completedAt: { not: null },
        durationMinutes: { not: null },
        startedAt: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
      _sum: {
        durationMinutes: true,
      },
    });

    const thisMonthMinutes = thisMonthMinutesResult._sum.durationMinutes ?? 0;

    return NextResponse.json({
      summary: {
        currentStreak,
        longestStreak,
        totalWorkouts,
        thisWeekWorkouts,
        thisWeekGoal,
        completionRate,
        totalMinutes,
        thisMonthMinutes,
      },
    });
  } catch (error) {
    console.error('Get progress error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 },
    );
  }
}
