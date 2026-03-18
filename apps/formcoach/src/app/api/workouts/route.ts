import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { workoutLogCreateSchema, paginationSchema } from '@/lib/validators';
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
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    const paginationResult = paginationSchema.safeParse({
      page: searchParams.get('page') ?? undefined,
      limit: searchParams.get('limit') ?? undefined,
    });

    const { page, limit } = paginationResult.success
      ? paginationResult.data
      : { page: 1, limit: 10 };

    const where: Record<string, unknown> = { userId: user.sub };

    if (from || to) {
      const startedAt: Record<string, Date> = {};
      if (from) startedAt.gte = new Date(from);
      if (to) startedAt.lte = new Date(to);
      where.startedAt = startedAt;
    }

    const [logs, total] = await Promise.all([
      prisma.workoutLog.findMany({
        where,
        orderBy: { startedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          entries: {
            include: {
              exercise: true,
            },
          },
        },
      }),
      prisma.workoutLog.count({ where }),
    ]);

    return NextResponse.json({
      logs,
      pagination: { page, limit, total },
    });
  } catch (error) {
    console.error('Get workout logs error:', error);
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

    const body = await request.json().catch(() => ({}));
    const data = workoutLogCreateSchema.parse(body);

    const workoutLog = await prisma.workoutLog.create({
      data: {
        userId: user.sub,
        planDayId: data.planDayId ?? null,
        startedAt: new Date(),
      },
    });

    return NextResponse.json({ workoutLog }, { status: 201 });
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

    console.error('Create workout log error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 },
    );
  }
}
