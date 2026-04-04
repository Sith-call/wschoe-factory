import { z } from "zod";

// ─── Project ──────────────────────────────────

export const ProjectConfigSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  targetDir: z.string(),
  createdAt: z.string().datetime(),
});

export type ProjectConfig = z.infer<typeof ProjectConfigSchema>;

// ─── Task ─────────────────────────────────────

export const TaskStatusSchema = z.enum([
  "created",
  "running",
  "completed",
  "failed",
]);
export type TaskStatus = z.infer<typeof TaskStatusSchema>;

export const TaskConfigSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  name: z.string().min(1),
  status: TaskStatusSchema,
  workflowId: z.string().optional(),
  worktreePath: z.string().optional(),
  branch: z.string().optional(),
  createdAt: z.string().datetime(),
  completedAt: z.string().datetime().optional(),
  initialPrompt: z.string().optional(),
  workflowSteps: z.array(z.lazy(() => WorkflowStepSchema)).optional(),
  lastSessionId: z.string().optional(),
});

export type TaskConfig = z.infer<typeof TaskConfigSchema>;

// ─── Gate ─────────────────────────────────────

export const GateModeSchema = z.enum(["auto", "manual", "none"]);
export type GateMode = z.infer<typeof GateModeSchema>;

export const GateConfigSchema = z.object({
  mode: GateModeSchema,
  autoChecks: z
    .object({
      minLength: z.number().optional(),
      maxLength: z.number().optional(),
      mustContain: z.array(z.string()).optional(),
      mustNotContain: z.array(z.string()).optional(),
      jsonSchema: z.record(z.unknown()).optional(),
      regex: z.string().optional(),
    })
    .optional(),
  reviewPrompt: z.string().optional(),
  maxRetries: z.number().default(1).optional(),
});

export type GateConfig = z.infer<typeof GateConfigSchema>;

// ─── Agent ────────────────────────────────────

export const AgentSourceSchema = z.enum(["discovered", "preset", "adhoc"]);
export type AgentSource = z.infer<typeof AgentSourceSchema>;

export const AgentToolPermissionSchema = z.enum([
  "read",
  "edit",
  "bash",
  "web",
  "agent",
  "all",
]);
export type AgentToolPermission = z.infer<typeof AgentToolPermissionSchema>;

export const AgentConfigSchema = z.object({
  name: z.string(),
  description: z.string(),
  source: AgentSourceSchema,
  path: z.string().optional(),
  systemPrompt: z.string().optional(),
  model: z.enum(["sonnet", "opus", "haiku"]).optional(),
  tools: z.array(AgentToolPermissionSchema).optional(),
  maxTurns: z.number().optional(),
});

export type AgentConfig = z.infer<typeof AgentConfigSchema>;

export interface AgentMeta {
  name: string;
  description: string;
  source: AgentSource;
  path?: string;
  pluginName?: string;
  model?: string;
}

// ─── Skill ────────────────────────────────────

export interface SkillMeta {
  name: string;
  description: string;
  source: "builtin" | "plugin" | "project";
  path: string;
  pluginName?: string;
}

// ─── Workflow Steps ───────────────────────────

export const PatternTypeSchema = z.enum([
  "chain",
  "parallel",
  "voting",
  "router",
  "gen-judge",
  "ralph",
  "orchestrator",
  "autonomous",
]);
export type PatternType = z.infer<typeof PatternTypeSchema>;

export const SkillStepSchema = z.object({
  type: z.literal("skill"),
  id: z.string(),
  skillName: z.string(),
  prompt: z.string().optional(),
  gate: GateModeSchema,
  gateConfig: GateConfigSchema.optional(),
  pluginName: z.string().optional(),
});

export const AgentStepSchema = z.object({
  type: z.literal("agent"),
  id: z.string(),
  agent: AgentConfigSchema,
  prompt: z.string().optional(),
  gate: GateModeSchema,
  gateConfig: GateConfigSchema.optional(),
});

export const PatternStepSchema: z.ZodType<PatternStep> = z.object({
  type: z.literal("pattern"),
  id: z.string(),
  pattern: PatternTypeSchema,
  prompt: z.string().optional(),
  gate: GateModeSchema,
  gateConfig: GateConfigSchema.optional(),
  children: z.array(z.lazy(() => WorkflowStepSchema)),
  config: z
    .object({
      conditions: z.array(z.string()).optional(),
      judgeIndex: z.number().optional(),
      maxIterations: z.number().optional(),
      reviewAgent: z.string().optional(),
      teamSize: z.number().optional(),
      votingCount: z.number().optional(),
      decompositionSchema: z.record(z.unknown()).optional(),
    })
    .optional(),
});

export type SkillStep = z.infer<typeof SkillStepSchema>;
export type AgentStep = z.infer<typeof AgentStepSchema>;

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
    reviewAgent?: string;
    teamSize?: number;
    votingCount?: number;
    decompositionSchema?: Record<string, unknown>;
  };
}

export const WorkflowStepSchema: z.ZodType<WorkflowStep> = z.discriminatedUnion("type", [
  SkillStepSchema,
  AgentStepSchema,
  z.object({
    type: z.literal("pattern"),
    id: z.string(),
    pattern: PatternTypeSchema,
    prompt: z.string().optional(),
    gate: GateModeSchema,
    gateConfig: GateConfigSchema.optional(),
    children: z.array(z.lazy(() => WorkflowStepSchema)),
    config: z
      .object({
        conditions: z.array(z.string()).optional(),
        judgeIndex: z.number().optional(),
        maxIterations: z.number().optional(),
        reviewAgent: z.string().optional(),
        teamSize: z.number().optional(),
        votingCount: z.number().optional(),
        decompositionSchema: z.record(z.unknown()).optional(),
      })
      .optional(),
  }),
]);

export type WorkflowStep = SkillStep | AgentStep | PatternStep;

// ─── Workflow Definition ──────────────────────

export const WorkflowDefinitionSchema = z.object({
  id: z.string(),
  name: z.string(),
  initialPrompt: z.string(),
  steps: z.array(WorkflowStepSchema),
  plugins: z.array(z.string()).optional(),
  contextFiles: z.array(z.string()).optional(),
  systemPrompt: z.string().optional(),
});

export type WorkflowDefinition = z.infer<typeof WorkflowDefinitionSchema>;

// ─── Step Progress ────────────────────────────

export const StepStatusSchema = z.enum([
  "pending",
  "running",
  "completed",
  "failed",
  "skipped",
]);
export type StepStatus = z.infer<typeof StepStatusSchema>;

export const TerminationReasonSchema = z.enum([
  "all_completed",
  "child_failed",
  "task_complete",
  "approved",
  "max_iterations",
  "route_matched",
  "route_default",
  "timeout",
  "error",
]);
export type TerminationReason = z.infer<typeof TerminationReasonSchema>;

export interface StepUsage {
  inputTokens: number;
  outputTokens: number;
  cacheReadTokens: number;
  cacheCreationTokens: number;
  totalCostUsd: number;
  durationMs: number;
  model: string;
}

export interface SubAgentInfo {
  name: string;
  status: string;
  detail?: string;
  toolUses?: number;
  tokens?: string;
  activity?: string;
}

export interface StepProgress {
  stepId: string;
  status: StepStatus;
  output?: string;
  error?: string;
  iteration?: number;
  maxIterations?: number;
  terminationReason?: TerminationReason;
  startedAt: string;
  completedAt?: string;
  durationMs?: number;
  children?: StepProgress[];
  activeAgents?: SubAgentInfo[];
  usage?: StepUsage;
}

// ─── Agent Events (stream-json) ───────────────

export interface AgentEvent {
  taskId: string;
  description: string;
  status: "started" | "in_progress" | "completed";
  toolUseId?: string;
  lastToolName?: string;
  usage?: {
    totalTokens: number;
    toolUses: number;
    durationMs: number;
  };
  summary?: string;
}

// ─── Workflow Session ─────────────────────────

export interface WorkflowSession {
  id: string;
  claudeSessionId: string;
  mode: "stream" | "interactive";
  workflowId: string;
  steps: StepProgress[];
  forks?: {
    baseSessionId: string;
    forkSessionIds: string[];
  };
}

// ─── WebSocket Events ─────────────────────────

export type WsEvent =
  | { type: "step:start"; stepId: string; iteration?: number }
  | { type: "step:output"; stepId: string; chunk: string }
  | { type: "step:complete"; stepId: string; progress: StepProgress }
  | { type: "step:gate"; stepId: string; output: string }
  | {
      type: "step:iteration";
      stepId: string;
      iteration: number;
      maxIterations: number;
      feedback?: string;
    }
  | { type: "step:agents"; stepId: string; agents: SubAgentInfo[] }
  | { type: "workflow:progress"; steps: StepProgress[] }
  | { type: "workflow:complete"; steps: StepProgress[] }
  | { type: "workflow:error"; error: string };

// ─── Multiplexer ──────────────────────────────

export interface SessionRef {
  sessionId: string;
  raw: Record<string, string>;
}

export interface TerminalRef {
  session: SessionRef;
  terminalId: string;
  raw: Record<string, string>;
}

export interface MultiplexerAdapter {
  readonly name: "cmux" | "tmux";
  ping(): Promise<boolean>;
  createSession(name: string, cwd: string): Promise<SessionRef>;
  createTerminal(session: SessionRef): Promise<TerminalRef>;
  closeSession(session: SessionRef): Promise<void>;
  send(ref: TerminalRef, text: string): Promise<void>;
  sendKey(ref: TerminalRef, key: "Enter"): Promise<void>;
  readScreen(ref: TerminalRef, lines: number): Promise<string>;
  focus?(ref: SessionRef): Promise<void>;
  renameTerminal?(ref: TerminalRef, name: string): Promise<void>;
}

// ─── Usage ────────────────────────────────────

export interface ProjectUsage {
  totalTokens: number;
  totalCostUsd: number;
  sessionCount: number;
  tasks: {
    taskId: string;
    taskName: string;
    totalTokens: number;
    totalCostUsd: number;
    sessionCount: number;
  }[];
}

export interface TaskUsage {
  taskId: string;
  totalTokens: number;
  totalCostUsd: number;
  sessions: {
    sessionId: string;
    claudeSessionId: string;
    startedAt: string;
    completedAt?: string;
    durationMs: number;
    totalTokens: number;
    totalCostUsd: number;
    steps: {
      stepId: string;
      usage: StepUsage;
    }[];
  }[];
}

// ─── Plugin Info ──────────────────────────────

export interface PluginInfo {
  name: string;
  path: string;
  skillCount: number;
  agentCount: number;
}
