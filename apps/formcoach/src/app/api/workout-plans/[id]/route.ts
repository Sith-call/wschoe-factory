import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { workoutPlanUpdateSchema } from '@/lib/validators';
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

    const plan = await prisma.workoutPlan.findUnique({
      where: { id },
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

    if (!plan) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Workout plan not found' } },
        { status: 404 },
      );
    }

    if (plan.userId !== user.sub) {
      return NextResponse.json(
        { error: { code: 'FORBIDDEN', message: 'Access denied' } },
        { status: 403 },
      );
    }

    return NextResponse.json({ plan });
  } catch (error) {
    console.error('Get workout plan error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
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
    const data = workoutPlanUpdateSchema.parse(body);

    const plan = await prisma.workoutPlan.findUnique({
      where: { id },
    });

    if (!plan) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Workout plan not found' } },
        { status: 404 },
      );
    }

    if (plan.userId !== user.sub) {
      return NextResponse.json(
        { error: { code: 'FORBIDDEN', message: 'Access denied' } },
        { status: 403 },
      );
    }

    const updatedPlan = await prisma.workoutPlan.update({
      where: { id },
      data: { status: data.status },
    });

    return NextResponse.json({ plan: updatedPlan });
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

    console.error('Update workout plan error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
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

    const plan = await prisma.workoutPlan.findUnique({
      where: { id },
    });

    if (!plan) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Workout plan not found' } },
        { status: 404 },
      );
    }

    if (plan.userId !== user.sub) {
      return NextResponse.json(
        { error: { code: 'FORBIDDEN', message: 'Access denied' } },
        { status: 403 },
      );
    }

    await prisma.workoutPlan.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Workout plan deleted successfully' });
  } catch (error) {
    console.error('Delete workout plan error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 },
    );
  }
}
