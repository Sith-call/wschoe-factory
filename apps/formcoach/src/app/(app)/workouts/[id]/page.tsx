"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import api from "@/lib/api";
import { DEMO_PLAN } from "@/lib/demo-data";

interface DemoExercise {
  id: string;
  exercise: { id: string; name: string; category: string; equipment: string };
  sets: number;
  reps: number;
  restSeconds: number;
}

type Phase = "ready" | "working" | "resting" | "complete";

export default function WorkoutSessionPage() {
  const params = useParams();
  const router = useRouter();
  const planId = params.id as string;

  // Core state
  const [loading, setLoading] = useState(true);
  const [exercises, setExercises] = useState<DemoExercise[]>([]);
  const [dayTheme, setDayTheme] = useState("운동 수행");

  // Workout session state
  const [phase, setPhase] = useState<Phase>("ready");
  const [currentExIdx, setCurrentExIdx] = useState(0);
  const [currentSetIdx, setCurrentSetIdx] = useState(0);
  const [completedSets, setCompletedSets] = useState<Set<string>>(new Set());

  // Rest timer
  const [restTime, setRestTime] = useState(0);
  const [restTotal, setRestTotal] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Completion
  const [selectedFeeling, setSelectedFeeling] = useState<string | null>(null);

  // Non-demo state
  const [plan, setPlan] = useState<any>(null);
  const [workoutLogId, setWorkoutLogId] = useState<string | null>(null);
  const [completing, setCompleting] = useState(false);

  const isDemo = api.isDemo();

  // Load data
  useEffect(() => {
    async function load() {
      try {
        if (isDemo) {
          // Use Day 1 from DEMO_PLAN
          const day1 = DEMO_PLAN.planDays[0];
          setDayTheme(day1.theme);
          setExercises(day1.exercises);
        } else {
          const { plan: p } = await api.getPlan(planId);
          setPlan(p);
          const today = new Date().getDay();
          const dayIndex = today === 0 ? 6 : today - 1;
          const todayPlanDay =
            p?.planDays?.find((d: any) => d.dayOfWeek === dayIndex) ||
            p?.planDays?.[0];
          setDayTheme(todayPlanDay?.theme || "운동 수행");
          setExercises(todayPlanDay?.planExercises || []);
        }
      } catch {
        // fallback
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [planId, isDemo]);

  // Timer cleanup
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const totalSets = exercises.reduce((sum, ex) => sum + ex.sets, 0);
  const completedCount = completedSets.size;
  const currentEx = exercises[currentExIdx];

  const startRest = useCallback(
    (seconds: number) => {
      setRestTime(seconds);
      setRestTotal(seconds);
      setPhase("resting");
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setRestTime((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            setPhase("working");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    },
    []
  );

  function handleStartWorkout() {
    if (isDemo) {
      setPhase("working");
    } else {
      startNonDemoWorkout();
    }
  }

  async function startNonDemoWorkout() {
    try {
      const todayPlanDay =
        plan?.planDays?.find(
          (d: any) => d.dayOfWeek === (new Date().getDay() === 0 ? 6 : new Date().getDay() - 1)
        ) || plan?.planDays?.[0];
      const { workoutLog } = await api.startWorkout({
        planDayId: todayPlanDay?.id,
      });
      setWorkoutLogId(workoutLog.id);
      setPhase("working");
    } catch {
      // handle error
    }
  }

  function handleCompleteSet() {
    if (!currentEx) return;

    const key = `${currentEx.id}-${currentSetIdx}`;
    setCompletedSets((prev) => new Set(prev).add(key));

    const isLastSet = currentSetIdx >= currentEx.sets - 1;
    const isLastExercise = currentExIdx >= exercises.length - 1;

    if (isLastSet && isLastExercise) {
      // All done
      if (timerRef.current) clearInterval(timerRef.current);
      setPhase("complete");
    } else if (isLastSet) {
      // Move to next exercise
      setCurrentExIdx((prev) => prev + 1);
      setCurrentSetIdx(0);
      startRest(currentEx.restSeconds);
    } else {
      // Next set, start rest
      setCurrentSetIdx((prev) => prev + 1);
      startRest(currentEx.restSeconds);
    }
  }

  function skipRest() {
    if (timerRef.current) clearInterval(timerRef.current);
    setRestTime(0);
    setPhase("working");
  }

  async function handleFinish() {
    if (isDemo) {
      router.push("/dashboard");
    } else {
      if (!workoutLogId) return;
      setCompleting(true);
      try {
        await api.completeWorkout(workoutLogId, {
          completedAt: new Date().toISOString(),
          feeling: selectedFeeling || undefined,
        });
        router.push("/dashboard");
      } catch {
        setCompleting(false);
      }
    }
  }

  // --- RENDER ---

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

  // COMPLETE PHASE
  if (phase === "complete") {
    const feelings = [
      { value: "EASY", label: "쉬움", emoji: "😊" },
      { value: "MODERATE", label: "적당", emoji: "💪" },
      { value: "HARD", label: "힘듦", emoji: "🔥" },
    ];

    return (
      <>
        <Header title="운동 완료!" />
        <div className="page-container space-y-6 py-8">
          {/* Congrats */}
          <div className="text-center">
            <div className="mb-3 text-7xl animate-bounce">🎉</div>
            <h2 className="mb-2 text-2xl font-bold text-gray-900">
              수고하셨습니다!
            </h2>
            <p className="text-gray-500">
              {exercises.length}개 운동, {totalSets}세트를 모두 완료했어요
            </p>
          </div>

          {/* Stats summary */}
          <Card className="bg-brand-50 border-brand-200">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-brand-700">
                  {exercises.length}
                </p>
                <p className="text-xs text-brand-600">운동</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-brand-700">
                  {totalSets}
                </p>
                <p className="text-xs text-brand-600">세트</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-brand-700">
                  {dayTheme.includes("상체") ? "상체" : dayTheme.includes("하체") ? "하체" : "전신"}
                </p>
                <p className="text-xs text-brand-600">부위</p>
              </div>
            </div>
          </Card>

          {/* Feeling selector */}
          <Card>
            <h3 className="mb-4 text-center font-bold text-gray-900">
              오늘 운동 체감 강도는?
            </h3>
            <div className="flex justify-center gap-4">
              {feelings.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setSelectedFeeling(f.value)}
                  className={`flex flex-col items-center gap-2 rounded-2xl p-4 transition-all ${
                    selectedFeeling === f.value
                      ? "bg-brand-100 ring-2 ring-brand-500 scale-105"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <span className="text-4xl">{f.emoji}</span>
                  <span
                    className={`text-sm font-medium ${
                      selectedFeeling === f.value
                        ? "text-brand-700"
                        : "text-gray-600"
                    }`}
                  >
                    {f.label}
                  </span>
                </button>
              ))}
            </div>
          </Card>

          {/* Finish button */}
          <Button
            onClick={handleFinish}
            loading={completing}
            className="w-full"
            size="lg"
          >
            대시보드로 돌아가기
          </Button>
        </div>
      </>
    );
  }

  // READY PHASE
  if (phase === "ready") {
    return (
      <>
        <Header title={dayTheme} showBack />
        <div className="page-container space-y-4 py-4">
          {/* Today's overview */}
          <Card className="bg-brand-50 border-brand-200">
            <div className="text-center">
              <p className="text-sm font-medium text-brand-600">오늘의 운동</p>
              <p className="mt-1 text-2xl font-bold text-brand-800">
                {dayTheme}
              </p>
              <p className="mt-1 text-sm text-brand-600">
                {exercises.length}개 운동 &middot; {totalSets}세트
              </p>
            </div>
          </Card>

          {/* Exercise preview list */}
          {exercises.map((ex, idx) => (
            <Card key={ex.id}>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-sm font-bold text-brand-700">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 truncate">
                    {ex.exercise.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {ex.sets}세트 &times; {ex.reps}회 &middot; 휴식{" "}
                    {ex.restSeconds}초
                  </p>
                </div>
                <Badge>{ex.exercise.category}</Badge>
              </div>
            </Card>
          ))}

          {/* Start button */}
          <div className="pt-2">
            <Button onClick={handleStartWorkout} className="w-full" size="lg">
              운동 시작하기
            </Button>
          </div>
        </div>
      </>
    );
  }

  // WORKING / RESTING PHASE
  return (
    <>
      <Header
        title={dayTheme}
        showBack
        rightAction={<Badge variant="success">운동 중</Badge>}
      />
      <div className="page-container space-y-4 py-4">
        {/* Overall progress */}
        <ProgressBar
          value={completedCount}
          max={totalSets}
          label={`진행률 ${completedCount}/${totalSets} 세트`}
          showPercent
        />

        {/* Rest timer overlay */}
        {phase === "resting" && (
          <Card className="bg-brand-50 border-brand-200">
            <div className="flex flex-col items-center py-4">
              <p className="mb-2 text-sm font-medium text-brand-600">
                휴식 시간
              </p>
              {/* Circular countdown */}
              <div className="relative flex h-32 w-32 items-center justify-center">
                <svg className="absolute h-full w-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="44"
                    fill="none"
                    stroke="#d1fae5"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="44"
                    fill="none"
                    stroke="#059669"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 44}`}
                    strokeDashoffset={`${2 * Math.PI * 44 * (1 - (restTotal > 0 ? restTime / restTotal : 0))}`}
                    className="transition-all duration-1000 ease-linear"
                  />
                </svg>
                <span className="text-4xl font-bold text-brand-700">
                  {restTime}
                </span>
              </div>
              <p className="mt-2 text-xs text-brand-500">
                다음: {currentEx?.exercise.name} - {currentSetIdx + 1}세트
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={skipRest}
                className="mt-3"
              >
                건너뛰기
              </Button>
            </div>
          </Card>
        )}

        {/* Current exercise card (big) */}
        {currentEx && phase === "working" && (
          <Card className="border-2 border-brand-300 bg-white">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-brand-600">
                  운동 {currentExIdx + 1}/{exercises.length}
                </p>
                <h2 className="mt-1 text-xl font-bold text-gray-900">
                  {currentEx.exercise.name}
                </h2>
                <p className="mt-0.5 text-sm text-gray-500">
                  {currentEx.exercise.equipment} &middot;{" "}
                  {currentEx.exercise.category}
                </p>
              </div>
              <Badge variant="success">
                {currentSetIdx + 1}/{currentEx.sets} 세트
              </Badge>
            </div>

            {/* Set target */}
            <div className="mb-4 rounded-xl bg-gray-50 p-4 text-center">
              <p className="text-sm text-gray-500">목표</p>
              <p className="text-3xl font-bold text-gray-900">
                {currentEx.reps}
                <span className="ml-1 text-base font-normal text-gray-500">
                  회
                </span>
              </p>
            </div>

            {/* Sets visualization */}
            <div className="mb-4 flex justify-center gap-2">
              {Array.from({ length: currentEx.sets }).map((_, setIdx) => {
                const key = `${currentEx.id}-${setIdx}`;
                const done = completedSets.has(key);
                const isCurrent = setIdx === currentSetIdx;
                return (
                  <div
                    key={setIdx}
                    className={`flex h-12 w-12 items-center justify-center rounded-xl border-2 text-sm font-bold transition-all ${
                      done
                        ? "border-brand-500 bg-brand-500 text-white scale-95"
                        : isCurrent
                          ? "border-brand-500 bg-brand-50 text-brand-700 scale-110 shadow-md"
                          : "border-gray-200 text-gray-400"
                    }`}
                  >
                    {done ? (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      setIdx + 1
                    )}
                  </div>
                );
              })}
            </div>

            {/* Complete set button */}
            <Button onClick={handleCompleteSet} className="w-full" size="lg">
              {currentSetIdx + 1}세트 완료 ✓
            </Button>
          </Card>
        )}

        {/* Upcoming exercises */}
        {exercises.map((ex, idx) => {
          if (idx <= currentExIdx) return null;
          return (
            <Card key={ex.id} className="opacity-60">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-sm font-bold text-gray-400">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-600 truncate">
                    {ex.exercise.name}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {ex.sets}세트 &times; {ex.reps}회
                  </p>
                </div>
              </div>
            </Card>
          );
        })}

        {/* Completed exercises */}
        {currentExIdx > 0 && (
          <div className="pt-2">
            <p className="mb-2 text-xs font-medium text-gray-400">완료한 운동</p>
            {exercises.map((ex, idx) => {
              if (idx >= currentExIdx) return null;
              return (
                <div
                  key={ex.id}
                  className="mb-2 flex items-center gap-3 rounded-xl bg-brand-50 p-3"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-200 text-sm font-bold text-brand-700">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-brand-700 truncate">
                      {ex.exercise.name}
                    </p>
                    <p className="text-xs text-brand-500">
                      {ex.sets}세트 완료
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
