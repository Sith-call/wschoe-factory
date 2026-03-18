import { generateWorkoutPlan } from '@/lib/ai';

const mockExercises = [
  { id: 'ex1', name: 'Squat', nameKo: '스쿼트', category: 'LEGS', difficulty: 'BEGINNER' },
  { id: 'ex2', name: 'Bench Press', nameKo: '벤치프레스', category: 'CHEST', difficulty: 'INTERMEDIATE' },
  { id: 'ex3', name: 'Deadlift', nameKo: '데드리프트', category: 'BACK', difficulty: 'ADVANCED' },
  { id: 'ex4', name: 'Push Up', nameKo: '푸쉬업', category: 'CHEST', difficulty: 'BEGINNER' },
  { id: 'ex5', name: 'Pull Up', nameKo: '풀업', category: 'BACK', difficulty: 'INTERMEDIATE' },
  { id: 'ex6', name: 'Plank', nameKo: '플랭크', category: 'CORE', difficulty: 'BEGINNER' },
  { id: 'ex7', name: 'Lunge', nameKo: '런지', category: 'LEGS', difficulty: 'BEGINNER' },
  { id: 'ex8', name: 'Shoulder Press', nameKo: '숄더프레스', category: 'SHOULDERS', difficulty: 'INTERMEDIATE' },
  { id: 'ex9', name: 'Burpee', nameKo: '버피', category: 'FULL_BODY', difficulty: 'INTERMEDIATE' },
  { id: 'ex10', name: 'Running', nameKo: '달리기', category: 'CARDIO', difficulty: 'BEGINNER' },
  { id: 'ex11', name: 'Jump Rope', nameKo: '줄넘기', category: 'CARDIO', difficulty: 'BEGINNER' },
  { id: 'ex12', name: 'Mountain Climber', nameKo: '마운틴 클라이머', category: 'FULL_BODY', difficulty: 'BEGINNER' },
  { id: 'ex13', name: 'Bicep Curl', nameKo: '바이셉 컬', category: 'ARMS', difficulty: 'BEGINNER' },
  { id: 'ex14', name: 'Tricep Dip', nameKo: '트라이셉 딥', category: 'ARMS', difficulty: 'INTERMEDIATE' },
  { id: 'ex15', name: 'Yoga Stretch', nameKo: '요가 스트레칭', category: 'STRETCHING', difficulty: 'BEGINNER' },
];

describe('AI Workout Plan Generation', () => {
  describe('Plan Structure', () => {
    it('should generate plan with correct number of days matching availableDaysPerWeek', () => {
      const profile = {
        goal: 'MUSCLE_GAIN',
        fitnessLevel: 'INTERMEDIATE',
        availableDaysPerWeek: 4,
        minutesPerSession: 45,
      };

      const plan = generateWorkoutPlan(profile, mockExercises);

      expect(plan.days).toHaveLength(4);
    });

    it('should generate 3 days for 3 days/week', () => {
      const profile = {
        goal: 'GENERAL_FITNESS',
        fitnessLevel: 'BEGINNER',
        availableDaysPerWeek: 3,
        minutesPerSession: 30,
      };

      const plan = generateWorkoutPlan(profile, mockExercises);
      expect(plan.days).toHaveLength(3);
    });

    it('should generate 6 days for 6 days/week', () => {
      const profile = {
        goal: 'WEIGHT_LOSS',
        fitnessLevel: 'ADVANCED',
        availableDaysPerWeek: 6,
        minutesPerSession: 60,
      };

      const plan = generateWorkoutPlan(profile, mockExercises);
      expect(plan.days).toHaveLength(6);
    });

    it('should assign correct dayOfWeek starting from 0', () => {
      const profile = {
        goal: 'MUSCLE_GAIN',
        fitnessLevel: 'BEGINNER',
        availableDaysPerWeek: 5,
        minutesPerSession: 45,
      };

      const plan = generateWorkoutPlan(profile, mockExercises);

      plan.days.forEach((day, index) => {
        expect(day.dayOfWeek).toBe(index);
      });
    });

    it('should assign ascending sortOrder to days', () => {
      const profile = {
        goal: 'ENDURANCE',
        fitnessLevel: 'INTERMEDIATE',
        availableDaysPerWeek: 4,
        minutesPerSession: 30,
      };

      const plan = generateWorkoutPlan(profile, mockExercises);

      plan.days.forEach((day, index) => {
        expect(day.sortOrder).toBe(index + 1);
      });
    });
  });

  describe('Exercise Selection', () => {
    it('should include exercises in each day', () => {
      const profile = {
        goal: 'MUSCLE_GAIN',
        fitnessLevel: 'INTERMEDIATE',
        availableDaysPerWeek: 3,
        minutesPerSession: 45,
      };

      const plan = generateWorkoutPlan(profile, mockExercises);

      plan.days.forEach((day) => {
        expect(day.exercises.length).toBeGreaterThanOrEqual(3);
      });
    });

    it('should assign sortOrder to exercises within each day', () => {
      const profile = {
        goal: 'GENERAL_FITNESS',
        fitnessLevel: 'BEGINNER',
        availableDaysPerWeek: 3,
        minutesPerSession: 30,
      };

      const plan = generateWorkoutPlan(profile, mockExercises);

      plan.days.forEach((day) => {
        day.exercises.forEach((exercise, index) => {
          expect(exercise.sortOrder).toBe(index + 1);
        });
      });
    });

    it('should only include exercises at or below user fitness level for beginners', () => {
      const profile = {
        goal: 'GENERAL_FITNESS',
        fitnessLevel: 'BEGINNER',
        availableDaysPerWeek: 3,
        minutesPerSession: 30,
      };

      const plan = generateWorkoutPlan(profile, mockExercises);

      const beginnerExerciseIds = mockExercises
        .filter((e) => e.difficulty === 'BEGINNER')
        .map((e) => e.id);

      plan.days.forEach((day) => {
        day.exercises.forEach((exercise) => {
          expect(beginnerExerciseIds).toContain(exercise.exerciseId);
        });
      });
    });

    it('should allow beginner and intermediate exercises for intermediate users', () => {
      const profile = {
        goal: 'MUSCLE_GAIN',
        fitnessLevel: 'INTERMEDIATE',
        availableDaysPerWeek: 3,
        minutesPerSession: 45,
      };

      const plan = generateWorkoutPlan(profile, mockExercises);

      const allowedIds = mockExercises
        .filter((e) => ['BEGINNER', 'INTERMEDIATE'].includes(e.difficulty))
        .map((e) => e.id);

      plan.days.forEach((day) => {
        day.exercises.forEach((exercise) => {
          expect(allowedIds).toContain(exercise.exerciseId);
        });
      });
    });
  });

  describe('Sets, Reps, and Rest', () => {
    it('should assign 3 sets for beginner level', () => {
      const profile = {
        goal: 'GENERAL_FITNESS',
        fitnessLevel: 'BEGINNER',
        availableDaysPerWeek: 3,
        minutesPerSession: 30,
      };

      const plan = generateWorkoutPlan(profile, mockExercises);

      plan.days.forEach((day) => {
        day.exercises.forEach((exercise) => {
          expect(exercise.sets).toBe(3);
        });
      });
    });

    it('should assign 4 sets for intermediate level', () => {
      const profile = {
        goal: 'GENERAL_FITNESS',
        fitnessLevel: 'INTERMEDIATE',
        availableDaysPerWeek: 3,
        minutesPerSession: 30,
      };

      const plan = generateWorkoutPlan(profile, mockExercises);

      plan.days.forEach((day) => {
        day.exercises.forEach((exercise) => {
          expect(exercise.sets).toBe(4);
        });
      });
    });

    it('should assign 5 sets for advanced level', () => {
      const profile = {
        goal: 'GENERAL_FITNESS',
        fitnessLevel: 'ADVANCED',
        availableDaysPerWeek: 3,
        minutesPerSession: 30,
      };

      const plan = generateWorkoutPlan(profile, mockExercises);

      plan.days.forEach((day) => {
        day.exercises.forEach((exercise) => {
          expect(exercise.sets).toBe(5);
        });
      });
    });

    it('should assign 15-20 reps for weight loss goal', () => {
      const profile = {
        goal: 'WEIGHT_LOSS',
        fitnessLevel: 'BEGINNER',
        availableDaysPerWeek: 3,
        minutesPerSession: 30,
      };

      const plan = generateWorkoutPlan(profile, mockExercises);

      plan.days.forEach((day) => {
        day.exercises.forEach((exercise) => {
          expect(exercise.reps).toBe('15-20');
        });
      });
    });

    it('should assign 8-12 reps for muscle gain goal', () => {
      const profile = {
        goal: 'MUSCLE_GAIN',
        fitnessLevel: 'INTERMEDIATE',
        availableDaysPerWeek: 3,
        minutesPerSession: 45,
      };

      const plan = generateWorkoutPlan(profile, mockExercises);

      plan.days.forEach((day) => {
        day.exercises.forEach((exercise) => {
          expect(exercise.reps).toBe('8-12');
        });
      });
    });

    it('should assign 30s rest for weight loss goal', () => {
      const profile = {
        goal: 'WEIGHT_LOSS',
        fitnessLevel: 'BEGINNER',
        availableDaysPerWeek: 3,
        minutesPerSession: 30,
      };

      const plan = generateWorkoutPlan(profile, mockExercises);

      plan.days.forEach((day) => {
        day.exercises.forEach((exercise) => {
          expect(exercise.restSeconds).toBe(30);
        });
      });
    });

    it('should assign 90s rest for muscle gain goal', () => {
      const profile = {
        goal: 'MUSCLE_GAIN',
        fitnessLevel: 'INTERMEDIATE',
        availableDaysPerWeek: 3,
        minutesPerSession: 45,
      };

      const plan = generateWorkoutPlan(profile, mockExercises);

      plan.days.forEach((day) => {
        day.exercises.forEach((exercise) => {
          expect(exercise.restSeconds).toBe(90);
        });
      });
    });
  });

  describe('Day Themes', () => {
    it('should assign themes based on goal', () => {
      const profile = {
        goal: 'MUSCLE_GAIN',
        fitnessLevel: 'INTERMEDIATE',
        availableDaysPerWeek: 3,
        minutesPerSession: 45,
      };

      const plan = generateWorkoutPlan(profile, mockExercises);

      plan.days.forEach((day) => {
        expect(day.theme).toBeDefined();
        expect(typeof day.theme).toBe('string');
        expect(day.theme.length).toBeGreaterThan(0);
      });
    });

    it('should include coaching notes in exercises', () => {
      const profile = {
        goal: 'GENERAL_FITNESS',
        fitnessLevel: 'BEGINNER',
        availableDaysPerWeek: 3,
        minutesPerSession: 30,
      };

      const plan = generateWorkoutPlan(profile, mockExercises);

      plan.days.forEach((day) => {
        day.exercises.forEach((exercise) => {
          expect(exercise.notes).toBeDefined();
          expect(exercise.notes).toContain('Focus on proper form');
        });
      });
    });

    it('should include beginner-specific note for beginner level', () => {
      const profile = {
        goal: 'GENERAL_FITNESS',
        fitnessLevel: 'BEGINNER',
        availableDaysPerWeek: 3,
        minutesPerSession: 30,
      };

      const plan = generateWorkoutPlan(profile, mockExercises);

      const firstExercise = plan.days[0].exercises[0];
      expect(firstExercise.notes).toContain('Start with lighter weights');
    });
  });

  describe('Estimated Minutes', () => {
    it('should not exceed minutesPerSession', () => {
      const profile = {
        goal: 'GENERAL_FITNESS',
        fitnessLevel: 'BEGINNER',
        availableDaysPerWeek: 5,
        minutesPerSession: 30,
      };

      const plan = generateWorkoutPlan(profile, mockExercises);

      plan.days.forEach((day) => {
        expect(day.estimatedMinutes).toBeLessThanOrEqual(30);
      });
    });

    it('should provide a positive estimated duration', () => {
      const profile = {
        goal: 'MUSCLE_GAIN',
        fitnessLevel: 'ADVANCED',
        availableDaysPerWeek: 4,
        minutesPerSession: 60,
      };

      const plan = generateWorkoutPlan(profile, mockExercises);

      plan.days.forEach((day) => {
        expect(day.estimatedMinutes).toBeGreaterThan(0);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle 1 day per week', () => {
      const profile = {
        goal: 'GENERAL_FITNESS',
        fitnessLevel: 'BEGINNER',
        availableDaysPerWeek: 1,
        minutesPerSession: 20,
      };

      const plan = generateWorkoutPlan(profile, mockExercises);
      expect(plan.days).toHaveLength(1);
    });

    it('should handle 7 days per week', () => {
      const profile = {
        goal: 'WEIGHT_LOSS',
        fitnessLevel: 'ADVANCED',
        availableDaysPerWeek: 7,
        minutesPerSession: 60,
      };

      const plan = generateWorkoutPlan(profile, mockExercises);
      expect(plan.days).toHaveLength(7);
    });

    it('should handle minimum session time (15 min)', () => {
      const profile = {
        goal: 'GENERAL_FITNESS',
        fitnessLevel: 'BEGINNER',
        availableDaysPerWeek: 3,
        minutesPerSession: 15,
      };

      const plan = generateWorkoutPlan(profile, mockExercises);

      plan.days.forEach((day) => {
        expect(day.exercises.length).toBeGreaterThanOrEqual(3); // minimum 3
      });
    });

    it('should handle empty exercise list gracefully', () => {
      const profile = {
        goal: 'GENERAL_FITNESS',
        fitnessLevel: 'BEGINNER',
        availableDaysPerWeek: 3,
        minutesPerSession: 30,
      };

      const plan = generateWorkoutPlan(profile, []);
      expect(plan.days).toHaveLength(3);
      // With empty exercises, each day should have 0 exercises
      plan.days.forEach((day) => {
        expect(day.exercises).toHaveLength(0);
      });
    });

    it('should use GENERAL_FITNESS themes for unknown goal', () => {
      const profile = {
        goal: 'UNKNOWN_GOAL',
        fitnessLevel: 'BEGINNER',
        availableDaysPerWeek: 3,
        minutesPerSession: 30,
      };

      const plan = generateWorkoutPlan(profile, mockExercises);
      expect(plan.days).toHaveLength(3);
    });
  });
});
