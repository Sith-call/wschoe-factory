// ─── Types (mirrored from @harness/core) ─────

export interface ProjectConfig {
  id: string;
  name: string;
  targetDir: string;
  createdAt: string;
}

export interface TaskConfig {
  id: string;
  projectId: string;
  name: string;
  status: "created" | "running" | "completed" | "failed";
  workflowId?: string;
  worktreePath?: string;
  branch?: string;
  createdAt: string;
  completedAt?: string;
  initialPrompt?: string;
  workflowSteps?: WorkflowStep[];
  lastSessionId?: string;
}

export type GateMode = "auto" | "manual" | "none";

export interface GateConfig {
  mode: GateMode;
  autoChecks?: {
    minLength?: number;
    maxLength?: number;
    mustContain?: string[];
    mustNotContain?: string[];
    regex?: string;
  };
  reviewPrompt?: string;
  maxRetries?: number;
}

export interface SkillStep {
  type: "skill";
  id: string;
  skillName: string;
  prompt?: string;
  gate: GateMode;
  gateConfig?: GateConfig;
  pluginName?: string;
}

export interface AgentStep {
  type: "agent";
  id: string;
  agent: {
    name: string;
    description: string;
    source: string;
    model?: string;
  };
  prompt?: string;
  gate: GateMode;
  gateConfig?: GateConfig;
}

export type PatternType =
  | "chain"
  | "parallel"
  | "voting"
  | "router"
  | "gen-judge"
  | "ralph"
  | "orchestrator"
  | "autonomous";

export interface PatternStep {
  type: "pattern";
  id: string;
  pattern: PatternType;
  prompt?: string;
  gate: GateMode;
  gateConfig?: GateConfig;
  children: WorkflowStep[];
  config?: {
    conditions?: string[];
    judgeIndex?: number;
    maxIterations?: number;
    votingCount?: number;
  };
}

export type WorkflowStep = SkillStep | AgentStep | PatternStep;

export interface SkillMeta {
  name: string;
  description: string;
  source: string;
  path: string;
  pluginName?: string;
}

export interface AgentMeta {
  name: string;
  description: string;
  source: string;
  path?: string;
  pluginName?: string;
  model?: string;
}

export interface StepProgress {
  stepId: string;
  status: "pending" | "running" | "completed" | "failed" | "skipped";
  output?: string;
  error?: string;
  iteration?: number;
  maxIterations?: number;
  terminationReason?: string;
  startedAt: string;
  completedAt?: string;
  durationMs?: number;
  children?: StepProgress[];
  activeAgents?: SubAgentInfo[];
  usage?: StepUsage;
}

export interface SubAgentInfo {
  name: string;
  status: string;
  detail?: string;
  toolUses?: number;
  tokens?: string;
  activity?: string;
}

export interface StepUsage {
  inputTokens: number;
  outputTokens: number;
  totalCostUsd: number;
  durationMs: number;
  model: string;
}

export type WsEvent =
  | { type: "step:start"; stepId: string; iteration?: number }
  | { type: "step:output"; stepId: string; chunk: string }
  | { type: "step:complete"; stepId: string; progress: StepProgress }
  | { type: "step:gate"; stepId: string; output: string }
  | { type: "step:iteration"; stepId: string; iteration: number; maxIterations: number; feedback?: string }
  | { type: "step:agents"; stepId: string; agents: SubAgentInfo[] }
  | { type: "workflow:progress"; steps: StepProgress[] }
  | { type: "workflow:complete"; steps: StepProgress[] }
  | { type: "workflow:error"; error: string };

// ─── API Client ───────────────────────────────

const BASE = "/api";

async function api<T>(path: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...opts,
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`);
  return res.json();
}

export const projects = {
  list: () => api<ProjectConfig[]>("/projects"),
  create: (name: string, targetDir: string) =>
    api<ProjectConfig>("/projects", {
      method: "POST",
      body: JSON.stringify({ name, targetDir }),
    }),
  delete: (id: string) =>
    api<{ ok: boolean }>(`/projects/${id}`, { method: "DELETE" }),
};

export const tasks = {
  list: (pid: string) => api<TaskConfig[]>(`/projects/${pid}/tasks`),
  create: (pid: string, name: string) =>
    api<TaskConfig>(`/projects/${pid}/tasks`, {
      method: "POST",
      body: JSON.stringify({ name }),
    }),
  update: (pid: string, tid: string, data: Partial<TaskConfig>) =>
    api<TaskConfig>(`/projects/${pid}/tasks/${tid}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  saveWorkflow: (
    pid: string,
    tid: string,
    data: {
      initialPrompt?: string;
      workflowSteps?: WorkflowStep[];
      lastSessionId?: string;
    }
  ) =>
    api<TaskConfig>(`/projects/${pid}/tasks/${tid}/workflow`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  delete: (pid: string, tid: string) =>
    api<{ ok: boolean }>(`/projects/${pid}/tasks/${tid}`, { method: "DELETE" }),
};

export const skills = {
  list: () => api<SkillMeta[]>("/skills"),
  search: (q: string) => api<SkillMeta[]>(`/skills/search?q=${encodeURIComponent(q)}`),
  refresh: () => api<SkillMeta[]>("/skills/refresh", { method: "POST" }),
};

export const agents = {
  list: () => api<AgentMeta[]>("/agents"),
  search: (q: string) => api<AgentMeta[]>(`/agents/search?q=${encodeURIComponent(q)}`),
  refresh: () => api<AgentMeta[]>("/agents/refresh", { method: "POST" }),
};

export const execution = {
  run: (data: {
    cwd: string;
    steps: WorkflowStep[];
    initialPrompt: string;
    plugins?: string[];
    contextFiles?: string[];
    systemPrompt?: string;
  }) => api<{ sessionId: string }>("/terminal", { method: "POST", body: JSON.stringify(data) }),
  resume: (data: {
    cwd: string;
    steps: WorkflowStep[];
    initialPrompt: string;
    completedStepIds: string[];
  }) => api<{ sessionId: string }>("/terminal/resume", { method: "POST", body: JSON.stringify(data) }),
  sessions: () => api<unknown[]>("/terminal/sessions"),
  stop: (sid: string) => api<{ ok: boolean }>(`/terminal/${sid}`, { method: "DELETE" }),
};

// ─── WebSocket ────────────────────────────────

export function connectWs(onEvent: (ev: WsEvent) => void): WebSocket {
  const protocol = location.protocol === "https:" ? "wss:" : "ws:";
  const ws = new WebSocket(`${protocol}//${location.host}/ws`);
  ws.onmessage = (e) => {
    try {
      onEvent(JSON.parse(e.data));
    } catch { /* ignore parse errors */ }
  };
  return ws;
}
