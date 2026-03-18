"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import Button from "@/components/ui/Button";
import api from "@/lib/api";

interface Summary {
  currentStreak: number;
  longestStreak: number;
  totalWorkouts: number;
  thisWeekWorkouts: number;
  thisWeekGoal: number;
  completionRate: number;
  totalMinutes: number;
  thisMonthMinutes: number;
}

function useCountUp(target: number, duration = 800, enabled = true) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>();

  useEffect(() => {
    if (!enabled || target === 0) {
      setValue(target);
      return;
    }
    setValue(0);
    const start = performance.now();
    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration, enabled]);

  return value;
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [activePlan, setActivePlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [summaryRes, plansRes] = await Promise.all([
          api.getProgressSummary().catch(() => ({ summary: null })),
          api.getPlans({ status: "ACTIVE", limit: 1 }).catch(() => ({ plans: [] })),
        ]);
        setSummary(
          summaryRes.summary || {
            currentStreak: 0,
            longestStreak: 0,
            totalWorkouts: 0,
            thisWeekWorkouts: 0,
            thisWeekGoal: 4,
            completionRate: 0,
            totalMinutes: 0,
            thisMonthMinutes: 0,
          }
        );
        setActivePlan(plansRes.plans[0] || null);
      } catch {
        setError("데이터를 불러올 수 없습니다.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const s = summary;
  const animStreak = useCountUp(s?.currentStreak ?? 0, 1000, !loading);
  const animTotal = useCountUp(s?.totalWorkouts ?? 0, 1000, !loading);
  const animMinutes = useCountUp(s?.thisMonthMinutes ?? 0, 1000, !loading);

  if (loading) {
    return (
      <>
        <Header title="FormCoach" />
        <div className="page-container">
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header title="FormCoach" />
        <div className="page-container">
          <div className="py-20 text-center text-gray-500">{error}</div>
        </div>
      </>
    );
  }

  const days = ["월", "화", "수", "목", "금", "토", "일"];

  return (
    <>
      <Header title="FormCoach" />
      <div className="page-container space-y-4">
        {/* Greeting */}
        <div className="mb-2">
          <h2 className="text-xl font-bold">오늘도 화이팅!</h2>
          <p className="text-sm text-gray-500">꾸준한 운동이 최고의 결과를 만듭니다</p>
        </div>

        {/* Streak */}
        <Card className="bg-gradient-to-r from-brand-500 to-brand-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-brand-100">연속 출석</p>
              <p className="text-3xl font-extrabold">{animStreak}일</p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-2xl">
              {s!.currentStreak >= 7 ? "🔥" : s!.currentStreak >= 3 ? "💪" : "🌱"}
            </div>
          </div>
          <p className="mt-2 text-xs text-brand-100">
            최장 기록: {s!.longestStreak}일
          </p>
        </Card>

        {/* Weekly progress */}
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-bold">이번 주 운동</h3>
            <Badge variant="success">
              {s!.thisWeekWorkouts}/{s!.thisWeekGoal}회
            </Badge>
          </div>
          <ProgressBar
            value={s!.thisWeekWorkouts}
            max={s!.thisWeekGoal}
            showPercent
          />
          <div className="mt-3 flex justify-between">
            {days.map((d, i) => (
              <div
                key={d}
                className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-medium ${
                  i < s!.thisWeekWorkouts
                    ? "bg-brand-500 text-white"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {i < s!.thisWeekWorkouts ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  d
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Today's workout */}
        <Card>
          <h3 className="mb-3 font-bold">오늘의 운동</h3>
          {activePlan ? (
            <div>
              <p className="mb-3 text-sm text-gray-500">
                {activePlan.planDays?.[0]?.theme || "운동 계획이 있습니다"}
              </p>
              <Link href={`/workouts/${activePlan.id}`}>
                <Button className="w-full">운동 시작하기</Button>
              </Link>
            </div>
          ) : (
            <div className="text-center">
              <p className="mb-3 text-sm text-gray-500">
                아직 운동 계획이 없습니다
              </p>
              <Link href="/workout-plans/new">
                <Button className="w-full">운동 계획 만들기</Button>
              </Link>
            </div>
          )}
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <p className="text-xs text-gray-500">총 운동 횟수</p>
            <p className="text-2xl font-bold text-brand-700">
              {animTotal}
              <span className="text-sm font-normal text-gray-400">회</span>
            </p>
          </Card>
          <Card>
            <p className="text-xs text-gray-500">이번 달 운동 시간</p>
            <p className="text-2xl font-bold text-brand-700">
              {animMinutes}
              <span className="text-sm font-normal text-gray-400">분</span>
            </p>
          </Card>
        </div>

        {/* Completion rate */}
        <Card>
          <div className="flex items-center justify-between">
            <h3 className="font-bold">달성률</h3>
            <span className="text-2xl font-bold text-brand-600">
              {Math.round(s!.completionRate * 100)}%
            </span>
          </div>
          <ProgressBar value={s!.completionRate * 100} className="mt-2" />
        </Card>
      </div>
    </>
  );
}
