"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import api from "@/lib/api";

interface ExerciseItem {
  id: string;
  exerciseId: string;
  exercise: {
    id: string;
    name: string;
    nameKo: string;
    category: string;
    instructions: string;
  };
  sets: number;
  reps: string;
  restSeconds: number;
  notes?: string;
}

export default function WorkoutSessionPage() {
  const params = useParams();
  const router = useRouter();
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [workoutLogId, setWorkoutLogId] = useState<string | null>(null);
  const [completedSets, setCompletedSets] = useState<Set<string>>(new Set());
  const [completing, setCompleting] = useState(false);
  const [feeling, setFeeling] = useState<string>("");
  const [showComplete, setShowComplete] = useState(false);

  const planId = params.id as string;

  useEffect(() => {
    async function load() {
      try {
        const { plan } = await api.getPlan(planId);
        setPlan(plan);
      } catch {
        // fallback
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [planId]);

  async function startWorkout(planDayId?: string) {
    try {
      const { workoutLog } = await api.startWorkout({ planDayId });
      setWorkoutLogId(workoutLog.id);
    } catch {
      // handle error
    }
  }

  function toggleSet(exerciseId: string, setNum: number) {
    const key = `${exerciseId}-${setNum}`;
    setCompletedSets((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  async function completeWorkout() {
    if (!workoutLogId) return;
    setCompleting(true);
    try {
      await api.completeWorkout(workoutLogId, {
        completedAt: new Date().toISOString(),
        feeling: feeling || undefined,
      });
      router.push("/dashboard");
    } catch {
      setCompleting(false);
    }
  }

  if (loading) {
    return (
      <>
        <Header title="운동" showBack />
        <div className="page-container flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
        </div>
      </>
    );
  }

  const today = new Date().getDay();
  const dayIndex = today === 0 ? 6 : today - 1;
  const todayPlanDay = plan?.planDays?.find(
    (d: any) => d.dayOfWeek === dayIndex
  ) || plan?.planDays?.[0];

  const exercises: ExerciseItem[] =
    todayPlanDay?.planExercises || [];
  const totalSets = exercises.reduce((sum, ex) => sum + ex.sets, 0);
  const completedCount = completedSets.size;

  const feelings = [
    { value: "VERY_EASY", label: "매우 쉬움", emoji: "😊" },
    { value: "EASY", label: "쉬움", emoji: "🙂" },
    { value: "MODERATE", label: "보통", emoji: "😐" },
    { value: "HARD", label: "힘듦", emoji: "😤" },
    { value: "VERY_HARD", label: "매우 힘듦", emoji: "🥵" },
  ];

  if (showComplete) {
    return (
      <>
        <Header title="운동 완료" showBack />
        <div className="page-container space-y-6 py-8">
          <div className="text-center">
            <div className="mb-4 text-6xl">🎉</div>
            <h2 className="mb-2 text-xl font-bold">수고하셨습니다!</h2>
            <p className="text-sm text-gray-500">
              오늘의 운동을 잘 마무리했어요
            </p>
          </div>

          <Card>
            <h3 className="mb-3 font-bold">운동은 어땠나요?</h3>
            <div className="flex justify-between">
              {feelings.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFeeling(f.value)}
                  className={`flex flex-col items-center gap-1 rounded-xl p-2 transition ${
                    feeling === f.value
                      ? "bg-brand-50 ring-2 ring-brand-500"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <span className="text-2xl">{f.emoji}</span>
                  <span className="text-xs text-gray-600">{f.label}</span>
                </button>
              ))}
            </div>
          </Card>

          <Button
            onClick={completeWorkout}
            loading={completing}
            className="w-full"
            size="lg"
          >
            완료하기
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <Header
        title={todayPlanDay?.theme || "운동 수행"}
        showBack
        rightAction={
          workoutLogId ? (
            <Badge variant="success">운동 중</Badge>
          ) : null
        }
      />
      <div className="page-container space-y-4">
        {/* Summary bar */}
        {workoutLogId && (
          <Card className="bg-brand-50">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-brand-700">
                진행: {completedCount}/{totalSets} 세트
              </span>
              <span className="text-brand-600">
                {totalSets > 0
                  ? Math.round((completedCount / totalSets) * 100)
                  : 0}
                %
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-brand-100">
              <div
                className="h-full rounded-full bg-brand-500 transition-all"
                style={{
                  width: `${totalSets > 0 ? (completedCount / totalSets) * 100 : 0}%`,
                }}
              />
            </div>
          </Card>
        )}

        {/* Start button */}
        {!workoutLogId && (
          <Button
            onClick={() => startWorkout(todayPlanDay?.id)}
            className="w-full"
            size="lg"
          >
            운동 시작하기
          </Button>
        )}

        {/* Exercise list */}
        {exercises.map((ex, idx) => (
          <Card key={ex.id}>
            <div className="mb-3 flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-400">#{idx + 1}</p>
                <h3 className="font-bold">
                  {ex.exercise.nameKo || ex.exercise.name}
                </h3>
                <p className="mt-0.5 text-xs text-gray-500">
                  {ex.sets}세트 x {ex.reps} | 휴식 {ex.restSeconds}초
                </p>
              </div>
              <Badge>{ex.exercise.category}</Badge>
            </div>

            {ex.notes && (
              <p className="mb-3 rounded-lg bg-brand-50 p-2 text-xs text-brand-700">
                💡 {ex.notes}
              </p>
            )}

            {/* Sets */}
            {workoutLogId && (
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: ex.sets }).map((_, setIdx) => {
                  const key = `${ex.exerciseId}-${setIdx + 1}`;
                  const done = completedSets.has(key);
                  return (
                    <button
                      key={setIdx}
                      onClick={() => toggleSet(ex.exerciseId, setIdx + 1)}
                      className={`flex h-11 w-11 items-center justify-center rounded-xl border-2 text-sm font-bold transition ${
                        done
                          ? "border-brand-500 bg-brand-500 text-white"
                          : "border-gray-200 text-gray-400 hover:border-brand-300"
                      }`}
                    >
                      {done ? "✓" : setIdx + 1}
                    </button>
                  );
                })}
              </div>
            )}
          </Card>
        ))}

        {/* Complete button */}
        {workoutLogId && completedCount > 0 && (
          <Button
            onClick={() => setShowComplete(true)}
            className="w-full"
            size="lg"
          >
            운동 완료
          </Button>
        )}

        {exercises.length === 0 && (
          <div className="py-12 text-center text-gray-400">
            <p>오늘 예정된 운동이 없습니다.</p>
          </div>
        )}
      </div>
    </>
  );
}
