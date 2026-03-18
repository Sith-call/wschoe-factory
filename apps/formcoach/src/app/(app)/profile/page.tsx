"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import api from "@/lib/api";

const goalLabels: Record<string, string> = {
  WEIGHT_LOSS: "체중 감량",
  MUSCLE_GAIN: "근육 증가",
  ENDURANCE: "지구력 향상",
  GENERAL_FITNESS: "전반적 건강",
};

const levelLabels: Record<string, string> = {
  BEGINNER: "초급",
  INTERMEDIATE: "중급",
  ADVANCED: "고급",
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Editable fields
  const [name, setName] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [userRes, profileRes] = await Promise.all([
          api.getMe().catch(() => ({ user: null })),
          api.getProfile().catch(() => ({ profile: null })),
        ]);
        setUser(userRes.user);
        setProfile(profileRes.profile);
        if (userRes.user) setName(userRes.user.name);
        if (profileRes.profile) {
          setHeight(profileRes.profile.height?.toString() || "");
          setWeight(profileRes.profile.weight?.toString() || "");
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateProfile({
        ...profile,
        height: height ? parseFloat(height) : undefined,
        weight: weight ? parseFloat(weight) : undefined,
      });
      setEditing(false);
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    try {
      await api.logout();
    } catch {
      api.clearTokens();
    }
    router.push("/login");
  }

  if (loading) {
    return (
      <>
        <Header title="프로필" />
        <div className="page-container flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
        </div>
      </>
    );
  }

  return (
    <>
      <Header
        title="프로필"
        rightAction={
          !editing ? (
            <button
              onClick={() => setEditing(true)}
              className="text-sm font-semibold text-brand-600"
            >
              수정
            </button>
          ) : null
        }
      />
      <div className="page-container space-y-4">
        {/* User info */}
        <Card padding="lg">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-2xl font-bold text-brand-700">
              {user?.name?.[0] || "?"}
            </div>
            <div>
              <h2 className="text-lg font-bold">{user?.name || "사용자"}</h2>
              <p className="text-sm text-gray-500">{user?.email}</p>
              <Badge variant="success" className="mt-1">
                {user?.subscriptionTier || "FREE"}
              </Badge>
            </div>
          </div>
        </Card>

        {/* Profile details */}
        <Card>
          <h3 className="mb-3 font-bold">운동 프로필</h3>
          {editing ? (
            <form onSubmit={handleSave} className="space-y-3">
              <Input
                label="키 (cm)"
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="175"
              />
              <Input
                label="몸무게 (kg)"
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="70"
              />
              <div className="flex gap-2 pt-2">
                <Button type="submit" loading={saving} className="flex-1">
                  저장
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setEditing(false)}
                  className="flex-1"
                >
                  취소
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-sm text-gray-500">운동 목표</span>
                <span className="text-sm font-medium">
                  {goalLabels[profile?.goal] || "-"}
                </span>
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-sm text-gray-500">체력 수준</span>
                <span className="text-sm font-medium">
                  {levelLabels[profile?.fitnessLevel] || "-"}
                </span>
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-sm text-gray-500">주간 운동 일수</span>
                <span className="text-sm font-medium">
                  {profile?.availableDaysPerWeek || "-"}일
                </span>
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-sm text-gray-500">세션 시간</span>
                <span className="text-sm font-medium">
                  {profile?.minutesPerSession || "-"}분
                </span>
              </div>
              {profile?.height && (
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-sm text-gray-500">키</span>
                  <span className="text-sm font-medium">{profile.height}cm</span>
                </div>
              )}
              {profile?.weight && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">몸무게</span>
                  <span className="text-sm font-medium">{profile.weight}kg</span>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Settings */}
        <Card>
          <h3 className="mb-3 font-bold">설정</h3>
          <div className="space-y-1">
            <button className="flex w-full items-center justify-between rounded-lg px-2 py-3 text-left hover:bg-gray-50">
              <span className="text-sm">알림 설정</span>
              <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button className="flex w-full items-center justify-between rounded-lg px-2 py-3 text-left hover:bg-gray-50">
              <span className="text-sm">개인정보 처리방침</span>
              <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button className="flex w-full items-center justify-between rounded-lg px-2 py-3 text-left hover:bg-gray-50">
              <span className="text-sm">이용약관</span>
              <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </Card>

        {/* Logout */}
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full text-red-500 hover:bg-red-50 hover:text-red-600"
        >
          로그아웃
        </Button>

        <p className="pb-4 text-center text-xs text-gray-300">
          FormCoach v0.1.0
        </p>
      </div>
    </>
  );
}
