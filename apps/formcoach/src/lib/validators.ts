import { z } from 'zod';

export const signupSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be at most 50 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const profileSchema = z.object({
  goal: z.enum(['WEIGHT_LOSS', 'MUSCLE_GAIN', 'ENDURANCE', 'GENERAL_FITNESS']),
  fitnessLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
  availableDaysPerWeek: z.number().int().min(1).max(7),
  minutesPerSession: z.number().int().min(15).max(120),
  height: z.number().positive().optional(),
  weight: z.number().positive().optional(),
  birthYear: z.number().int().min(1900).max(2026).optional(),
  gender: z
    .enum(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'])
    .optional(),
  injuries: z.string().optional(),
});

export const workoutPlanGenerateSchema = z.object({
  weekStartDate: z.string().datetime({ offset: true }).optional().or(
    z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be an ISO date string (YYYY-MM-DD)').optional()
  ),
});

export const workoutPlanUpdateSchema = z.object({
  status: z.enum(['COMPLETED', 'CANCELLED']),
});

export const workoutLogCreateSchema = z.object({
  planDayId: z.string().uuid().optional(),
});

export const workoutLogUpdateSchema = z.object({
  completedAt: z.string().datetime({ offset: true }).optional(),
  feeling: z
    .enum(['VERY_EASY', 'EASY', 'MODERATE', 'HARD', 'VERY_HARD'])
    .optional(),
  memo: z.string().max(1000).optional(),
});

export const workoutLogEntrySchema = z.object({
  exerciseId: z.string().uuid(),
  setNumber: z.number().int().positive(),
  reps: z.number().int().positive().optional(),
  weight: z.number().nonnegative().optional(),
  durationSeconds: z.number().int().positive().optional(),
  completed: z.boolean().optional().default(true),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
});
