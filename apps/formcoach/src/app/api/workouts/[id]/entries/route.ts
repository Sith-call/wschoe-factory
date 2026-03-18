import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { workoutLogEntrySchema } from '@/lib/validators';
import { ZodError } from 'zod';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, context: RouteContext) {
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
    const data = workoutLogEntrySchema.parse(body);

    // Verify workout log exists and belongs to user
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

    const entry = await prisma.workoutLogEntry.create({
      data: {
        workoutLogId: id,
        exerciseId: data.exerciseId,
        setNumber: data.setNumber,
        reps: data.reps ?? null,
        weight: data.weight ?? null,
        durationSeconds: data.durationSeconds ?? null,
        completed: data.completed,
      },
      include: {
        exercise: true,
      },
    });

    return NextResponse.json({ entry }, { status: 201 });
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

    console.error('Create workout log entry error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 },
    );
  }
}
