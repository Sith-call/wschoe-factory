import { z } from "zod";
// ─── Project ──────────────────────────────────
export const ProjectConfigSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1),
    targetDir: z.string(),
    createdAt: z.string().datetime(),
});
// ─── Task ─────────────────────────────────────
export const TaskStatusSchema = z.enum([
    "created",
    "running",
    "completed",
    "failed",
]);
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
// ─── Gate ─────────────────────────────────────
export const GateModeSchema = z.enum(["auto", "manual", "none"]);
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
// ─── Agent ────────────────────────────────────
export const AgentSourceSchema = z.enum(["discovered", "preset", "adhoc"]);
export const AgentToolPermissionSchema = z.enum([
    "read",
    "edit",
    "bash",
    "web",
    "agent",
    "all",
]);
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
export const PatternStepSchema = z.object({
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
export const WorkflowStepSchema = z.discriminatedUnion("type", [
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
// ─── Step Progress ────────────────────────────
export const StepStatusSchema = z.enum([
    "pending",
    "running",
    "completed",
    "failed",
    "skipped",
]);
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
//# sourceMappingURL=types.js.map