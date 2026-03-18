import {
  DEMO_USER,
  DEMO_PROFILE,
  DEMO_SUMMARY,
  DEMO_CHART_WEEKLY,
  DEMO_CHART_MONTHLY,
  DEMO_PLAN,
  DEMO_WORKOUT_LOG,
  DEMO_TOKENS,
} from "./demo-data";

const API_BASE = "/api";

function isDemo(): boolean {
  if (typeof window === "undefined") return true;
  return (
    new URLSearchParams(window.location.search).has("demo") ||
    localStorage.getItem("demo") === "true"
  );
}

function enableDemo() {
  if (typeof window !== "undefined") {
    localStorage.setItem("demo", "true");
    localStorage.setItem("accessToken", DEMO_TOKENS.accessToken);
    localStorage.setItem("refreshToken", DEMO_TOKENS.refreshToken);
  }
}

class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function getAccessToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
}

function setTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
}

function clearTokens() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("demo");
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getAccessToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const error = body.error || {};
    throw new ApiError(
      res.status,
      error.code || "UNKNOWN",
      error.message || "요청에 실패했습니다."
    );
  }

  return res.json();
}

export const api = {
  // Demo
  isDemo,
  enableDemo,

  // Auth
  signup: (data: { email: string; password: string; name: string }) => {
    if (isDemo()) {
      enableDemo();
      return Promise.resolve({ user: { ...DEMO_USER, name: data.name, email: data.email }, tokens: DEMO_TOKENS });
    }
    return fetchApi<{ user: any; tokens: { accessToken: string; refreshToken: string } }>(
      "/auth/signup",
      { method: "POST", body: JSON.stringify(data) }
    ).then((res) => {
      setTokens(res.tokens.accessToken, res.tokens.refreshToken);
      return res;
    });
  },

  login: (data: { email: string; password: string }) => {
    if (isDemo()) {
      enableDemo();
      return Promise.resolve({ user: DEMO_USER, tokens: DEMO_TOKENS });
    }
    return fetchApi<{ user: any; tokens: { accessToken: string; refreshToken: string } }>(
      "/auth/login",
      { method: "POST", body: JSON.stringify(data) }
    ).then((res) => {
      setTokens(res.tokens.accessToken, res.tokens.refreshToken);
      return res;
    });
  },

  logout: () => {
    if (isDemo()) {
      clearTokens();
      return Promise.resolve({});
    }
    const refreshToken = localStorage.getItem("refreshToken");
    clearTokens();
    return fetchApi("/auth/logout", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
  },

  // User
  getMe: () => {
    if (isDemo()) return Promise.resolve({ user: DEMO_USER });
    return fetchApi<{ user: any }>("/users/profile");
  },

  getProfile: () => {
    if (isDemo()) return Promise.resolve({ profile: DEMO_PROFILE });
    return fetchApi<{ profile: any }>("/users/profile");
  },

  updateProfile: (data: any) => {
    if (isDemo()) return Promise.resolve({ profile: { ...DEMO_PROFILE, ...data } });
    return fetchApi<{ profile: any }>("/users/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // Workout Plans
  generatePlan: (data?: { weekStartDate?: string }) => {
    if (isDemo()) return Promise.resolve({ plan: DEMO_PLAN });
    return fetchApi<{ plan: any }>("/workout-plans", {
      method: "POST",
      body: JSON.stringify(data || {}),
    });
  },

  getPlans: (params?: { status?: string; page?: number; limit?: number }) => {
    if (isDemo()) return Promise.resolve({ plans: [DEMO_PLAN], pagination: { page: 1, limit: 10, total: 1 } });
    const query = new URLSearchParams();
    if (params?.status) query.set("status", params.status);
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    const qs = query.toString();
    return fetchApi<{ plans: any[]; pagination: any }>(
      `/workout-plans${qs ? `?${qs}` : ""}`
    );
  },

  getPlan: (planId: string) => {
    if (isDemo()) return Promise.resolve({ plan: DEMO_PLAN });
    return fetchApi<{ plan: any }>(`/workout-plans/${planId}`);
  },

  updatePlan: (planId: string, data: { status: string }) => {
    if (isDemo()) return Promise.resolve({ plan: { ...DEMO_PLAN, ...data } });
    return fetchApi<{ plan: any }>(`/workout-plans/${planId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  // Workouts
  startWorkout: (data?: { planDayId?: string }) => {
    if (isDemo()) return Promise.resolve({ workoutLog: DEMO_WORKOUT_LOG });
    return fetchApi<{ workoutLog: any }>("/workouts", {
      method: "POST",
      body: JSON.stringify(data || {}),
    });
  },

  completeWorkout: (logId: string, data: { completedAt?: string; feeling?: string; memo?: string }) => {
    if (isDemo()) return Promise.resolve({ workoutLog: { ...DEMO_WORKOUT_LOG, status: "COMPLETED", ...data } });
    return fetchApi<{ workoutLog: any }>(`/workouts/${logId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  addEntry: (logId: string, data: any) => {
    if (isDemo()) return Promise.resolve({ entry: { id: `entry-${Date.now()}`, ...data } });
    return fetchApi<{ entry: any }>(`/workouts/${logId}/entries`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getWorkouts: (params?: { from?: string; to?: string; page?: number; limit?: number }) => {
    if (isDemo()) return Promise.resolve({ logs: [DEMO_WORKOUT_LOG], pagination: { page: 1, limit: 10, total: 1 } });
    const query = new URLSearchParams();
    if (params?.from) query.set("from", params.from);
    if (params?.to) query.set("to", params.to);
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    const qs = query.toString();
    return fetchApi<{ logs: any[]; pagination: any }>(
      `/workouts${qs ? `?${qs}` : ""}`
    );
  },

  getWorkout: (logId: string) => {
    if (isDemo()) return Promise.resolve({ workoutLog: DEMO_WORKOUT_LOG });
    return fetchApi<{ workoutLog: any }>(`/workouts/${logId}`);
  },

  // Progress
  getProgressSummary: () => {
    if (isDemo()) return Promise.resolve({ summary: DEMO_SUMMARY });
    return fetchApi<{ summary: any }>("/progress");
  },

  getProgressChart: (params: { period: string; metric: string; from?: string; to?: string }) => {
    if (isDemo()) {
      const chart = params.period === "monthly" ? DEMO_CHART_MONTHLY : DEMO_CHART_WEEKLY;
      return Promise.resolve({ chart });
    }
    const query = new URLSearchParams();
    query.set("period", params.period);
    query.set("metric", params.metric);
    if (params.from) query.set("from", params.from);
    if (params.to) query.set("to", params.to);
    return fetchApi<{ chart: { labels: string[]; data: number[] } }>(
      `/progress/chart?${query.toString()}`
    );
  },

  // Achievements
  getAchievements: () => {
    if (isDemo()) {
      return Promise.resolve({
        achievements: [
          { id: "a1", name: "첫 운동", description: "첫 번째 운동을 완료했어요!", icon: "🎯", earned: true },
          { id: "a2", name: "3일 연속", description: "3일 연속 출석!", icon: "🔥", earned: true },
          { id: "a3", name: "7일 연속", description: "일주일 연속 출석!", icon: "💪", earned: false },
          { id: "a4", name: "100회 달성", description: "총 100회 운동 완료!", icon: "🏆", earned: false },
        ],
      });
    }
    return fetchApi<{ achievements: any[] }>("/achievements");
  },

  // Auth helpers
  isLoggedIn: () => {
    if (typeof window === "undefined") return false;
    return isDemo() || !!localStorage.getItem("accessToken");
  },
  clearTokens,
  setTokens,
};

export { ApiError };
export default api;
