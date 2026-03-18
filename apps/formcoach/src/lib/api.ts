const API_BASE = "/api/v1";

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
  // Auth
  signup: (data: { email: string; password: string; name: string }) =>
    fetchApi<{
      user: any;
      tokens: { accessToken: string; refreshToken: string };
    }>("/auth/signup", { method: "POST", body: JSON.stringify(data) }).then(
      (res) => {
        setTokens(res.tokens.accessToken, res.tokens.refreshToken);
        return res;
      }
    ),

  login: (data: { email: string; password: string }) =>
    fetchApi<{
      user: any;
      tokens: { accessToken: string; refreshToken: string };
    }>("/auth/login", { method: "POST", body: JSON.stringify(data) }).then(
      (res) => {
        setTokens(res.tokens.accessToken, res.tokens.refreshToken);
        return res;
      }
    ),

  logout: () => {
    const refreshToken = localStorage.getItem("refreshToken");
    clearTokens();
    return fetchApi("/auth/logout", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
  },

  // User
  getMe: () => fetchApi<{ user: any }>("/users/me"),

  getProfile: () => fetchApi<{ profile: any }>("/users/me/profile"),

  updateProfile: (data: any) =>
    fetchApi<{ profile: any }>("/users/me/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Workout Plans
  generatePlan: (data?: { weekStartDate?: string }) =>
    fetchApi<{ plan: any }>("/workout-plans/generate", {
      method: "POST",
      body: JSON.stringify(data || {}),
    }),

  getPlans: (params?: { status?: string; page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.status) query.set("status", params.status);
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    const qs = query.toString();
    return fetchApi<{ plans: any[]; pagination: any }>(
      `/workout-plans${qs ? `?${qs}` : ""}`
    );
  },

  getPlan: (planId: string) =>
    fetchApi<{ plan: any }>(`/workout-plans/${planId}`),

  updatePlan: (planId: string, data: { status: string }) =>
    fetchApi<{ plan: any }>(`/workout-plans/${planId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  // Workouts
  startWorkout: (data?: { planDayId?: string }) =>
    fetchApi<{ workoutLog: any }>("/workouts", {
      method: "POST",
      body: JSON.stringify(data || {}),
    }),

  completeWorkout: (
    logId: string,
    data: { completedAt?: string; feeling?: string; memo?: string }
  ) =>
    fetchApi<{ workoutLog: any }>(`/workouts/${logId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  addEntry: (
    logId: string,
    data: {
      exerciseId: string;
      setNumber: number;
      reps?: number;
      weight?: number;
      durationSeconds?: number;
      completed?: boolean;
    }
  ) =>
    fetchApi<{ entry: any }>(`/workouts/${logId}/entries`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getWorkouts: (params?: {
    from?: string;
    to?: string;
    page?: number;
    limit?: number;
  }) => {
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

  getWorkout: (logId: string) =>
    fetchApi<{ workoutLog: any }>(`/workouts/${logId}`),

  // Progress
  getProgressSummary: () => fetchApi<{ summary: any }>("/progress/summary"),

  getProgressChart: (params: {
    period: string;
    metric: string;
    from?: string;
    to?: string;
  }) => {
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
  getAchievements: () => fetchApi<{ achievements: any[] }>("/achievements"),

  // Auth helpers
  isLoggedIn: () => !!localStorage.getItem("accessToken"),
  clearTokens,
  setTokens,
};

export { ApiError };
export default api;
