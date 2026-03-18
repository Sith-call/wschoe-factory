interface ProfileInput {
  goal: string;
  fitnessLevel: string;
  availableDaysPerWeek: number;
  minutesPerSession: number;
}

interface ExerciseInput {
  id: string;
  name: string;
  nameKo: string;
  category: string;
  difficulty: string;
}

interface PlanExerciseOutput {
  exerciseId: string;
  sets: number;
  reps: string;
  restSeconds: number;
  notes: string | null;
  sortOrder: number;
}

interface PlanDayOutput {
  dayOfWeek: number;
  theme: string;
  estimatedMinutes: number;
  sortOrder: number;
  exercises: PlanExerciseOutput[];
}

interface WorkoutPlanOutput {
  days: PlanDayOutput[];
}

const DAY_THEMES: Record<string, string[]> = {
  WEIGHT_LOSS: [
    'Full Body HIIT',
    'Lower Body + Cardio',
    'Upper Body + Core',
    'Cardio & Conditioning',
    'Total Body Circuit',
    'Active Recovery',
    'Endurance Training',
  ],
  MUSCLE_GAIN: [
    'Chest & Triceps',
    'Back & Biceps',
    'Legs & Glutes',
    'Shoulders & Arms',
    'Upper Body Power',
    'Lower Body Power',
    'Full Body Strength',
  ],
  ENDURANCE: [
    'Cardio Intervals',
    'Endurance Circuit',
    'Tempo Training',
    'Long Duration Cardio',
    'Recovery & Stretching',
    'Cross Training',
    'Hill & Speed Work',
  ],
  GENERAL_FITNESS: [
    'Upper Body Strength',
    'Lower Body Strength',
    'Core & Flexibility',
    'Cardio Mix',
    'Full Body Workout',
    'Active Recovery',
    'Functional Training',
  ],
};

function getSetsForLevel(level: string): number {
  switch (level) {
    case 'BEGINNER':
      return 3;
    case 'INTERMEDIATE':
      return 4;
    case 'ADVANCED':
      return 5;
    default:
      return 3;
  }
}

function getRepsForGoal(goal: string): string {
  switch (goal) {
    case 'WEIGHT_LOSS':
      return '15-20';
    case 'MUSCLE_GAIN':
      return '8-12';
    case 'ENDURANCE':
      return '20-25';
    case 'GENERAL_FITNESS':
      return '10-15';
    default:
      return '10-12';
  }
}

function getRestSecondsForGoal(goal: string): number {
  switch (goal) {
    case 'WEIGHT_LOSS':
      return 30;
    case 'MUSCLE_GAIN':
      return 90;
    case 'ENDURANCE':
      return 20;
    case 'GENERAL_FITNESS':
      return 60;
    default:
      return 60;
  }
}

function filterExercisesByDifficulty(
  exercises: ExerciseInput[],
  level: string,
): ExerciseInput[] {
  const levelOrder = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];
  const maxIdx = levelOrder.indexOf(level);
  const allowedLevels = levelOrder.slice(0, maxIdx + 1);
  const filtered = exercises.filter((e) => allowedLevels.includes(e.difficulty));
  return filtered.length > 0 ? filtered : exercises;
}

function pickExercises(
  exercises: ExerciseInput[],
  count: number,
): ExerciseInput[] {
  const shuffled = [...exercises].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

const CATEGORY_MAP: Record<string, string[]> = {
  'Chest & Triceps': ['CHEST', 'ARMS'],
  'Back & Biceps': ['BACK', 'ARMS'],
  'Legs & Glutes': ['LEGS'],
  'Shoulders & Arms': ['SHOULDERS', 'ARMS'],
  'Upper Body Power': ['CHEST', 'BACK', 'SHOULDERS'],
  'Lower Body Power': ['LEGS'],
  'Full Body Strength': ['FULL_BODY', 'CHEST', 'BACK', 'LEGS'],
  'Full Body HIIT': ['FULL_BODY', 'CARDIO'],
  'Lower Body + Cardio': ['LEGS', 'CARDIO'],
  'Upper Body + Core': ['CHEST', 'BACK', 'SHOULDERS', 'CORE'],
  'Cardio & Conditioning': ['CARDIO', 'FULL_BODY'],
  'Total Body Circuit': ['FULL_BODY', 'CHEST', 'LEGS'],
  'Active Recovery': ['STRETCHING', 'CORE'],
  'Endurance Training': ['CARDIO', 'FULL_BODY'],
  'Cardio Intervals': ['CARDIO'],
  'Endurance Circuit': ['CARDIO', 'FULL_BODY'],
  'Tempo Training': ['CARDIO', 'LEGS'],
  'Long Duration Cardio': ['CARDIO'],
  'Recovery & Stretching': ['STRETCHING'],
  'Cross Training': ['FULL_BODY', 'CARDIO'],
  'Hill & Speed Work': ['CARDIO', 'LEGS'],
  'Upper Body Strength': ['CHEST', 'BACK', 'SHOULDERS', 'ARMS'],
  'Lower Body Strength': ['LEGS'],
  'Core & Flexibility': ['CORE', 'STRETCHING'],
  'Cardio Mix': ['CARDIO'],
  'Full Body Workout': ['FULL_BODY', 'CHEST', 'BACK', 'LEGS'],
  'Functional Training': ['FULL_BODY', 'CORE'],
};

export function generateWorkoutPlan(
  profile: ProfileInput,
  exerciseList: ExerciseInput[],
): WorkoutPlanOutput {
  const { goal, fitnessLevel, availableDaysPerWeek, minutesPerSession } =
    profile;

  const themes = DAY_THEMES[goal] || DAY_THEMES.GENERAL_FITNESS;
  const sets = getSetsForLevel(fitnessLevel);
  const reps = getRepsForGoal(goal);
  const restSeconds = getRestSecondsForGoal(goal);

  const appropriateExercises = filterExercisesByDifficulty(
    exerciseList,
    fitnessLevel,
  );

  const exercisesPerDay = Math.max(
    3,
    Math.min(8, Math.floor(minutesPerSession / 10)),
  );

  const days: PlanDayOutput[] = [];

  for (let i = 0; i < availableDaysPerWeek; i++) {
    const theme = themes[i % themes.length];
    const relevantCategories = CATEGORY_MAP[theme] || ['FULL_BODY'];

    let categoryExercises = appropriateExercises.filter((e) =>
      relevantCategories.includes(e.category),
    );

    if (categoryExercises.length < exercisesPerDay) {
      categoryExercises = appropriateExercises;
    }

    const selectedExercises = pickExercises(categoryExercises, exercisesPerDay);

    const exercises: PlanExerciseOutput[] = selectedExercises.map(
      (exercise, idx) => ({
        exerciseId: exercise.id,
        sets,
        reps,
        restSeconds,
        notes: `Focus on proper form. ${fitnessLevel === 'BEGINNER' ? 'Start with lighter weights.' : 'Maintain controlled movements.'}`,
        sortOrder: idx + 1,
      }),
    );

    const estimatedMinutes = Math.round(
      exercises.reduce(
        (total, ex) =>
          total + ex.sets * (1.0 + ex.restSeconds / 60),
        0,
      ) + 5, // warm-up buffer
    );

    days.push({
      dayOfWeek: i,
      theme,
      estimatedMinutes: Math.min(estimatedMinutes, minutesPerSession),
      sortOrder: i + 1,
      exercises,
    });
  }

  return { days };
}
