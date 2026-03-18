"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import api, { ApiError } from "@/lib/api";
import { DEMO_PLAN } from "@/lib/demo-data";

const goals = [
  { value: "WEIGHT_LOSS", label: "체중 감량", emoji: "🏃" },
  { value: "MUSCLE_GAIN", label: "근육 증가", emoji: "💪" },
  { value: "ENDURANCE", label: "지구력 향상", emoji: "🚴" },
  { value: "GENERAL_FITNESS", label: "전반적 건강", emoji: "🧘" },
];

const levels = [
  { value: "BEGINNER", label: "초급", desc: "운동을 이제 시작해요" },
  { value: "INTERMEDIATE", label: "중급", desc: "규칙적으로 운동해요" },
  { value: "ADVANCED", label: "고급", desc: "고강도 훈련도 가능해요" },
];

const dayOptions = [2, 3, 4, 5, 6];
const timeOptions = [
  { value: 30, label: "30분" },
  { value: 45, label: "45분" },
  { value: 60, label: "60분" },
  { value: 90, label: "90분" },
];

const dayOfWeekLabels: Record<number, string> = {
  1: "월요일",
  2: "화요일",
  3: "수요일",
  4: "목요일",
  5: "금요일",
  6: "토요일",
  0: "일요일",
};

const dayColors: Record<number, string> = {
  1: "border-l-blue-500 bg-blue-50/50",
  3: "border-l-emerald-500 bg-emerald-50/50",
  5: "border-l-violet-500 bg-violet-50/50",
  6: "border-l-amber-500 bg-amber-50/50",
};

const categoryEmojis: Record<string, string> = {
  CHEST: "🫁",
  TRICEPS: "💪",
  LEGS: "🦵",
  BACK: "🔙",
  BICEPS: "💪",
  SHOULDERS: "🏋️",
  CORE: "🧘",
};

export default function NewWorkoutPlanPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState("");
  const [level, setLevel] = useState("");
  const [daysPerWeek, setDaysPerWeek] = useState(3);
  const [minutesPerSession, setMinutesPerSession] = useState(45);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate(e: FormEvent) {
    e.preventDefault();
    setError("");
    setGenerating(true);

    if (api.isDemo()) {
      // Demo mode: simulate AI generation with delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setGenerating(false);
      setStep(3);
      return;
    }

    try {
      await api.updateProfile({
        goal,
        fitnessLevel: level,
        availableDaysPerWeek: daysPerWeek,
        minutesPerSession,
      });
      const { plan } = await api.generatePlan();
      router.push(`/workouts/${plan.id}`);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("계획 생성에 실패했습니다. 다시 시도해주세요.");
      }
      setGenerating(false);
    }
  }

  const totalExercises = DEMO_PLAN.planDays.reduce(
    (sum, day) => sum + day.exercises.length,
    0
  );

  // Step 3: AI-generated result view
  const resultView = (
    <div className="space-y-4">
      <div className="text-center">
        <div className="mb-2 text-4xl">🎉</div>
        <h2 className="text-xl font-bold text-gray-900">
          맞춤 운동 계획이 완성됐어요!
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          주 {DEMO_PLAN.planDays.length}일 · {totalExercises}개 운동 · 세션당 약{" "}
          {minutesPerSession}분
        </p>
      </div>

      <div className="space-y-3">
        {DEMO_PLAN.planDays.map((day) => (
          <div
            key={day.id}
            className={`rounded-xl border-l-4 border border-gray-100 p-4 ${dayColors[day.dayOfWeek] || "border-l-gray-400 bg-gray-50/50"}`}
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="info">
                  {dayOfWeekLabels[day.dayOfWeek]}
                </Badge>
                <span className="text-sm font-bold text-gray-800">
                  {day.theme}
                </span>
              </div>
              <span className="text-xs text-gray-400">
                {day.exercises.length}종목
              </span>
            </div>
            <div className="space-y-1">
              {day.exercises.map((ex) => (
                <div
                  key={ex.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="flex items-center gap-1.5 text-gray-700">
                    <span className="text-xs">
                      {categoryEmojis[ex.exercise.category] || "🏋️"}
                    </span>
                    {ex.exercise.name}
                  </span>
                  <span className="text-xs font-medium text-gray-500">
                    {ex.sets}세트 × {ex.reps}
                    {ex.exercise.category === "CORE" ? "초" : "회"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Button
        onClick={() => router.push(`/workouts/${DEMO_PLAN.id}`)}
        className="w-full"
        size="lg"
      >
        운동 시작하기
      </Button>
      <button
        onClick={() => setStep(0)}
        className="w-full text-center text-sm font-medium text-gray-500 hover:text-gray-700"
      >
        다시 만들기
      </button>
    </div>
  );

  // Loading view
  const loadingView = (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative mb-6">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl">🤖</span>
        </div>
      </div>
      <p className="animate-pulse text-lg font-semibold text-brand-700">
        AI가 당신에 맞는 계획을 만들고 있어요...
      </p>
      <p className="mt-2 text-sm text-gray-400">
        목표와 체력 수준에 맞게 최적화 중
      </p>
    </div>
  );

  const steps = [
    // Step 0: Goal
    <div key="goal" className="space-y-3">
      <h2 className="text-lg font-bold">운동 목표를 선택하세요</h2>
      <div className="grid grid-cols-2 gap-3">
        {goals.map((g) => (
          <button
            key={g.value}
            onClick={() => {
              setGoal(g.value);
              setStep(1);
            }}
            className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-5 transition ${
              goal === g.value
                ? "border-brand-500 bg-brand-50"
                : "border-gray-100 hover:border-gray-200"
            }`}
          >
            <span className="text-3xl">{g.emoji}</span>
            <span className="text-sm font-semibold">{g.label}</span>
          </button>
        ))}
      </div>
    </div>,

    // Step 1: Level
    <div key="level" className="space-y-3">
      <h2 className="text-lg font-bold">체력 수준을 선택하세요</h2>
      <div className="space-y-3">
        {levels.map((l) => (
          <button
            key={l.value}
            onClick={() => {
              setLevel(l.value);
              setStep(2);
            }}
            className={`flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition ${
              level === l.value
                ? "border-brand-500 bg-brand-50"
                : "border-gray-100 hover:border-gray-200"
            }`}
          >
            <div>
              <p className="font-semibold">{l.label}</p>
              <p className="text-sm text-gray-500">{l.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>,

    // Step 2: Days & Time
    <div key="schedule" className="space-y-6">
      <div>
        <h2 className="mb-3 text-lg font-bold">주간 운동 일수</h2>
        <div className="flex gap-2">
          {dayOptions.map((d) => (
            <button
              key={d}
              onClick={() => setDaysPerWeek(d)}
              className={`flex h-12 w-12 items-center justify-center rounded-xl border-2 font-bold transition ${
                daysPerWeek === d
                  ? "border-brand-500 bg-brand-50 text-brand-700"
                  : "border-gray-100 text-gray-500 hover:border-gray-200"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
        <p className="mt-1 text-xs text-gray-400">주 {daysPerWeek}일 운동</p>
      </div>
      <div>
        <h2 className="mb-3 text-lg font-bold">세션당 운동 시간</h2>
        <div className="grid grid-cols-2 gap-3">
          {timeOptions.map((t) => (
            <button
              key={t.value}
              onClick={() => setMinutesPerSession(t.value)}
              className={`rounded-xl border-2 p-3 font-semibold transition ${
                minutesPerSession === t.value
                  ? "border-brand-500 bg-brand-50 text-brand-700"
                  : "border-gray-100 text-gray-500 hover:border-gray-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <Button
        onClick={handleGenerate}
        loading={generating}
        className="w-full"
        size="lg"
      >
        {generating ? "AI가 계획을 만들고 있어요..." : "운동 계획 생성하기"}
      </Button>
    </div>,
  ];

  // Determine what to render
  const isLoading = generating && api.isDemo();
  const isResult = step === 3;

  return (
    <>
      <Header title="운동 계획 만들기" showBack />
      <div className="page-container">
        {/* Progress dots */}
        {!isResult && !isLoading && (
          <div className="mb-6 flex items-center justify-center gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all ${
                  i === step ? "w-8 bg-brand-500" : "w-2 bg-gray-200"
                }`}
              />
            ))}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 p-3 text-center text-sm text-red-600">
            {error}
          </div>
        )}

        {isLoading ? (
          <Card padding="lg">{loadingView}</Card>
        ) : isResult ? (
          <Card padding="lg">{resultView}</Card>
        ) : (
          <Card padding="lg">{steps[step]}</Card>
        )}

        {!isResult && !isLoading && step > 0 && step < 3 && (
          <button
            onClick={() => setStep(step - 1)}
            className="mt-4 w-full text-center text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            이전 단계로
          </button>
        )}
      </div>
    </>
  );
}
