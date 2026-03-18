import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { workoutPlanGenerateSchema, paginationSchema } from '@/lib/validators';
import { generateWorkoutPlan } from '@/lib/ai';
import { ZodError } from 'zod';

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

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const paginationResult = paginationSchema.safeParse({
      page: searchParams.get('page') ?? undefined,
      limit: searchParams.get('limit') ?? undefined,
    });

    const { page, limit } = paginationResult.success
      ? paginationResult.data
      : { page: 1, limit: 10 };

    const where: Record<string, unknown> = { userId: user.sub };
    if (status) {
      where.status = status;
    }

    const [plans, total] = await Promise.all([
      prisma.workoutPlan.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.workoutPlan.count({ where }),
    ]);

    return NextResponse.json({
      plans,
      pagination: { page, limit, total },
    });
  } catch (error) {
    console.error('Get workout plans error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
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

    const dbUser = await prisma.user.findUnique({
      where: { id: user.sub },
      include: { profile: true },
    });

    if (!dbUser || !dbUser.isOnboarded || !dbUser.profile) {
      return NextResponse.json(
        {
          error: {
            code: 'NOT_ONBOARDED',
            message: 'Please complete your profile before generating a workout plan',
          },
        },
        { status: 400 },
      );
    }

    const body = await request.json().catch(() => ({}));
    const data = workoutPlanGenerateSchema.parse(body);

    const now = new Date();
    let startDate: Date;

    if (data.weekStartDate) {
      startDate = new Date(data.weekStartDate);
    } else {
      // Default to this Monday
      const dayOfWeek = now.getDay();
      const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Monday = 0
      startDate = new Date(now);
      startDate.setDate(now.getDate() - diff);
    }
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    endDate.setHours(23, 59, 59, 999);

    // Calculate week number (approximate)
    const startOfYear = new Date(startDate.getFullYear(), 0, 1);
    const weekNumber = Math.ceil(
      ((startDate.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7,
    );

    // Fetch exercises from DB
    const exercises = await prisma.exercise.findMany();

    const exerciseList = exercises.map((e) => ({
      id: e.id,
      name: e.name,
      nameKo: e.nameKo,
      category: e.category,
      difficulty: e.difficulty,
    }));

    const profile = dbUser.profile;
    const aiPlan = generateWorkoutPlan(
      {
        goal: profile.goal,
        fitnessLevel: profile.fitnessLevel,
        availableDaysPerWeek: profile.availableDaysPerWeek,
        minutesPerSession: profile.minutesPerSession,
      },
      exerciseList,
    );

    // Create the plan with nested days and exercises in a transaction
    const plan = await prisma.workoutPlan.create({
      data: {
        userId: user.sub,
        weekNumber,
        startDate,
        endDate,
        status: 'ACTIVE',
        aiPrompt: `Generated for goal: ${profile.goal}, level: ${profile.fitnessLevel}, days: ${profile.availableDaysPerWeek}, minutes: ${profile.minutesPerSession}`,
        planDays: {
          create: aiPlan.days.map((day) => ({
            dayOfWeek: day.dayOfWeek,
            theme: day.theme,
            estimatedMinutes: day.estimatedMinutes,
            sortOrder: day.sortOrder,
            planExercises: {
              create: day.exercises.map((ex) => ({
                exerciseId: ex.exerciseId,
                sets: ex.sets,
                reps: ex.reps,
                restSeconds: ex.restSeconds,
                notes: ex.notes,
                sortOrder: ex.sortOrder,
              })),
            },
          })),
        },
      },
      include: {
        planDays: {
          include: {
            planExercises: {
              include: {
                exercise: true,
              },
              orderBy: { sortOrder: 'asc' },
            },
          },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    return NextResponse.json({ plan }, { status: 201 });
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

    console.error('Create workout plan error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 },
    );
  }
}
