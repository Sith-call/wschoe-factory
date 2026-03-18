"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import api from "@/lib/api";

interface ChartData {
  labels: string[];
  data: number[];
}

export default function ProgressPage() {
  const [summary, setSummary] = useState<any>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [period, setPeriod] = useState<"weekly" | "monthly">("weekly");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [summaryRes, chartRes] = await Promise.all([
          api.getProgressSummary().catch(() => ({ summary: null })),
          api
            .getProgressChart({ period, metric: "workouts" })
            .catch(() => ({ chart: null })),
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
        setChartData(chartRes.chart || { labels: [], data: [] });
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [period]);

  if (loading) {
    return (
      <>
        <Header title="진행 현황" />
        <div className="page-container flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
        </div>
      </>
    );
  }

  const s = summary || {};
  const chart = chartData || { labels: [], data: [] };
  const maxVal = Math.max(...chart.data, 1);

  return (
    <>
      <Header title="진행 현황" />
      <div className="page-container space-y-4">
        {/* Stats cards */}
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <p className="text-xs text-gray-500">연속 출석</p>
            <p className="text-2xl font-bold text-brand-700">{s.currentStreak}일</p>
          </Card>
          <Card>
            <p className="text-xs text-gray-500">총 운동 횟수</p>
            <p className="text-2xl font-bold text-brand-700">{s.totalWorkouts}회</p>
          </Card>
          <Card>
            <p className="text-xs text-gray-500">이번 주</p>
            <p className="text-2xl font-bold text-brand-700">
              {s.thisWeekWorkouts}/{s.thisWeekGoal}
            </p>
          </Card>
          <Card>
            <p className="text-xs text-gray-500">총 운동 시간</p>
            <p className="text-2xl font-bold text-brand-700">
              {Math.round(s.totalMinutes / 60)}시간
            </p>
          </Card>
        </div>

        {/* Chart */}
        <Card padding="lg">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-bold">운동 현황</h3>
            <div className="flex rounded-lg bg-gray-100 p-0.5">
              <button
                onClick={() => setPeriod("weekly")}
                className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                  period === "weekly"
                    ? "bg-white text-brand-700 shadow-sm"
                    : "text-gray-500"
                }`}
              >
                주간
              </button>
              <button
                onClick={() => setPeriod("monthly")}
                className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                  period === "monthly"
                    ? "bg-white text-brand-700 shadow-sm"
                    : "text-gray-500"
                }`}
              >
                월간
              </button>
            </div>
          </div>

          {/* Simple bar chart */}
          <div className="flex items-end gap-1" style={{ height: 120 }}>
            {chart.labels.map((label, i) => (
              <div key={label} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-xs font-medium text-gray-600">
                  {chart.data[i]}
                </span>
                <div
                  className="w-full rounded-t-md bg-brand-400 transition-all"
                  style={{
                    height: `${(chart.data[i] / maxVal) * 100}%`,
                    minHeight: chart.data[i] > 0 ? 4 : 0,
                  }}
                />
                <span className="text-[10px] text-gray-400">{label}</span>
              </div>
            ))}
          </div>

          {chart.labels.length === 0 && (
            <div className="flex h-[120px] items-center justify-center text-sm text-gray-400">
              아직 데이터가 없습니다
            </div>
          )}
        </Card>

        {/* Achievement hint */}
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-2xl">
              🏆
            </div>
            <div>
              <h3 className="font-bold">달성률</h3>
              <p className="text-sm text-gray-500">
                목표 달성률{" "}
                <Badge variant="success">
                  {Math.round(s.completionRate * 100)}%
                </Badge>
              </p>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
