import { z } from "zod";
export declare const ProjectConfigSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    targetDir: z.ZodString;
    createdAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    targetDir: string;
    createdAt: string;
}, {
    id: string;
    name: string;
    targetDir: string;
    createdAt: string;
}>;
export type ProjectConfig = z.infer<typeof ProjectConfigSchema>;
export declare const TaskStatusSchema: z.ZodEnum<["created", "running", "completed", "failed"]>;
export type TaskStatus = z.infer<typeof TaskStatusSchema>;
export declare const TaskConfigSchema: z.ZodObject<{
    id: z.ZodString;
    projectId: z.ZodString;
    name: z.ZodString;
    status: z.ZodEnum<["created", "running", "completed", "failed"]>;
    workflowId: z.ZodOptional<z.ZodString>;
    worktreePath: z.ZodOptional<z.ZodString>;
    branch: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodString;
    completedAt: z.ZodOptional<z.ZodString>;
    initialPrompt: z.ZodOptional<z.ZodString>;
    workflowSteps: z.ZodOptional<z.ZodArray<z.ZodLazy<z.ZodType<WorkflowStep, z.ZodTypeDef, WorkflowStep>>, "many">>;
    lastSessionId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    createdAt: string;
    status: "created" | "running" | "completed" | "failed";
    projectId: string;
    workflowId?: string | undefined;
    worktreePath?: string | undefined;
    branch?: string | undefined;
    completedAt?: string | undefined;
    initialPrompt?: string | undefined;
    workflowSteps?: WorkflowStep[] | undefined;
    lastSessionId?: string | undefined;
}, {
    id: string;
    name: string;
    createdAt: string;
    status: "created" | "running" | "completed" | "failed";
    projectId: string;
    workflowId?: string | undefined;
    worktreePath?: string | undefined;
    branch?: string | undefined;
    completedAt?: string | undefined;
    initialPrompt?: string | undefined;
    workflowSteps?: WorkflowStep[] | undefined;
    lastSessionId?: string | undefined;
}>;
export type TaskConfig = z.infer<typeof TaskConfigSchema>;
export declare const GateModeSchema: z.ZodEnum<["auto", "manual", "none"]>;
export type GateMode = z.infer<typeof GateModeSchema>;
export declare const GateConfigSchema: z.ZodObject<{
    mode: z.ZodEnum<["auto", "manual", "none"]>;
    autoChecks: z.ZodOptional<z.ZodObject<{
        minLength: z.ZodOptional<z.ZodNumber>;
        maxLength: z.ZodOptional<z.ZodNumber>;
        mustContain: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        mustNotContain: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        jsonSchema: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        regex: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        minLength?: number | undefined;
        maxLength?: number | undefined;
        mustContain?: string[] | undefined;
        mustNotContain?: string[] | undefined;
        jsonSchema?: Record<string, unknown> | undefined;
        regex?: string | undefined;
    }, {
        minLength?: number | undefined;
        maxLength?: number | undefined;
        mustContain?: string[] | undefined;
        mustNotContain?: string[] | undefined;
        jsonSchema?: Record<string, unknown> | undefined;
        regex?: string | undefined;
    }>>;
    reviewPrompt: z.ZodOptional<z.ZodString>;
    maxRetries: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    mode: "auto" | "manual" | "none";
    autoChecks?: {
        minLength?: number | undefined;
        maxLength?: number | undefined;
        mustContain?: string[] | undefined;
        mustNotContain?: string[] | undefined;
        jsonSchema?: Record<string, unknown> | undefined;
        regex?: string | undefined;
    } | undefined;
    reviewPrompt?: string | undefined;
    maxRetries?: number | undefined;
}, {
    mode: "auto" | "manual" | "none";
    autoChecks?: {
        minLength?: number | undefined;
        maxLength?: number | undefined;
        mustContain?: string[] | undefined;
        mustNotContain?: string[] | undefined;
        jsonSchema?: Record<string, unknown> | undefined;
        regex?: string | undefined;
    } | undefined;
    reviewPrompt?: string | undefined;
    maxRetries?: number | undefined;
}>;
export type GateConfig = z.infer<typeof GateConfigSchema>;
export declare const AgentSourceSchema: z.ZodEnum<["discovered", "preset", "adhoc"]>;
export type AgentSource = z.infer<typeof AgentSourceSchema>;
export declare const AgentToolPermissionSchema: z.ZodEnum<["read", "edit", "bash", "web", "agent", "all"]>;
export type AgentToolPermission = z.infer<typeof AgentToolPermissionSchema>;
export declare const AgentConfigSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    source: z.ZodEnum<["discovered", "preset", "adhoc"]>;
    path: z.ZodOptional<z.ZodString>;
    systemPrompt: z.ZodOptional<z.ZodString>;
    model: z.ZodOptional<z.ZodEnum<["sonnet", "opus", "haiku"]>>;
    tools: z.ZodOptional<z.ZodArray<z.ZodEnum<["read", "edit", "bash", "web", "agent", "all"]>, "many">>;
    maxTurns: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    name: string;
    description: string;
    source: "discovered" | "preset" | "adhoc";
    path?: string | undefined;
    systemPrompt?: string | undefined;
    model?: "sonnet" | "opus" | "haiku" | undefined;
    tools?: ("agent" | "read" | "edit" | "bash" | "web" | "all")[] | undefined;
    maxTurns?: number | undefined;
}, {
    name: string;
    description: string;
    source: "discovered" | "preset" | "adhoc";
    path?: string | undefined;
    systemPrompt?: string | undefined;
    model?: "sonnet" | "opus" | "haiku" | undefined;
    tools?: ("agent" | "read" | "edit" | "bash" | "web" | "all")[] | undefined;
    maxTurns?: number | undefined;
}>;
export type AgentConfig = z.infer<typeof AgentConfigSchema>;
export interface AgentMeta {
    name: string;
    description: string;
    source: AgentSource;
    path?: string;
    pluginName?: string;
    model?: string;
}
export interface SkillMeta {
    name: string;
    description: string;
    source: "builtin" | "plugin" | "project";
    path: string;
    pluginName?: string;
}
export declare const PatternTypeSchema: z.ZodEnum<["chain", "parallel", "voting", "router", "gen-judge", "ralph", "orchestrator", "autonomous"]>;
export type PatternType = z.infer<typeof PatternTypeSchema>;
export declare const SkillStepSchema: z.ZodObject<{
    type: z.ZodLiteral<"skill">;
    id: z.ZodString;
    skillName: z.ZodString;
    prompt: z.ZodOptional<z.ZodString>;
    gate: z.ZodEnum<["auto", "manual", "none"]>;
    gateConfig: z.ZodOptional<z.ZodObject<{
        mode: z.ZodEnum<["auto", "manual", "none"]>;
        autoChecks: z.ZodOptional<z.ZodObject<{
            minLength: z.ZodOptional<z.ZodNumber>;
            maxLength: z.ZodOptional<z.ZodNumber>;
            mustContain: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            mustNotContain: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            jsonSchema: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            regex: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            minLength?: number | undefined;
            maxLength?: number | undefined;
            mustContain?: string[] | undefined;
            mustNotContain?: string[] | undefined;
            jsonSchema?: Record<string, unknown> | undefined;
            regex?: string | undefined;
        }, {
            minLength?: number | undefined;
            maxLength?: number | undefined;
            mustContain?: string[] | undefined;
            mustNotContain?: string[] | undefined;
            jsonSchema?: Record<string, unknown> | undefined;
            regex?: string | undefined;
        }>>;
        reviewPrompt: z.ZodOptional<z.ZodString>;
        maxRetries: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    }, "strip", z.ZodTypeAny, {
        mode: "auto" | "manual" | "none";
        autoChecks?: {
            minLength?: number | undefined;
            maxLength?: number | undefined;
            mustContain?: string[] | undefined;
            mustNotContain?: string[] | undefined;
            jsonSchema?: Record<string, unknown> | undefined;
            regex?: string | undefined;
        } | undefined;
        reviewPrompt?: string | undefined;
        maxRetries?: number | undefined;
    }, {
        mode: "auto" | "manual" | "none";
        autoChecks?: {
            minLength?: number | undefined;
            maxLength?: number | undefined;
            mustContain?: string[] | undefined;
            mustNotContain?: string[] | undefined;
            jsonSchema?: Record<string, unknown> | undefined;
            regex?: string | undefined;
        } | undefined;
        reviewPrompt?: string | undefined;
        maxRetries?: number | undefined;
    }>>;
    pluginName: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    type: "skill";
    skillName: string;
    gate: "auto" | "manual" | "none";
    prompt?: string | undefined;
    gateConfig?: {
        mode: "auto" | "manual" | "none";
        autoChecks?: {
            minLength?: number | undefined;
            maxLength?: number | undefined;
            mustContain?: string[] | undefined;
            mustNotContain?: string[] | undefined;
            jsonSchema?: Record<string, unknown> | undefined;
            regex?: string | undefined;
        } | undefined;
        reviewPrompt?: string | undefined;
        maxRetries?: number | undefined;
    } | undefined;
    pluginName?: string | undefined;
}, {
    id: string;
    type: "skill";
    skillName: string;
    gate: "auto" | "manual" | "none";
    prompt?: string | undefined;
    gateConfig?: {
        mode: "auto" | "manual" | "none";
        autoChecks?: {
            minLength?: number | undefined;
            maxLength?: number | undefined;
            mustContain?: string[] | undefined;
            mustNotContain?: string[] | undefined;
            jsonSchema?: Record<string, unknown> | undefined;
            regex?: string | undefined;
        } | undefined;
        reviewPrompt?: string | undefined;
        maxRetries?: number | undefined;
    } | undefined;
    pluginName?: string | undefined;
}>;
export declare const AgentStepSchema: z.ZodObject<{
    type: z.ZodLiteral<"agent">;
    id: z.ZodString;
    agent: z.ZodObject<{
        name: z.ZodString;
        description: z.ZodString;
        source: z.ZodEnum<["discovered", "preset", "adhoc"]>;
        path: z.ZodOptional<z.ZodString>;
        systemPrompt: z.ZodOptional<z.ZodString>;
        model: z.ZodOptional<z.ZodEnum<["sonnet", "opus", "haiku"]>>;
        tools: z.ZodOptional<z.ZodArray<z.ZodEnum<["read", "edit", "bash", "web", "agent", "all"]>, "many">>;
        maxTurns: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        description: string;
        source: "discovered" | "preset" | "adhoc";
        path?: string | undefined;
        systemPrompt?: string | undefined;
        model?: "sonnet" | "opus" | "haiku" | undefined;
        tools?: ("agent" | "read" | "edit" | "bash" | "web" | "all")[] | undefined;
        maxTurns?: number | undefined;
    }, {
        name: string;
        description: string;
        source: "discovered" | "preset" | "adhoc";
        path?: string | undefined;
        systemPrompt?: string | undefined;
        model?: "sonnet" | "opus" | "haiku" | undefined;
        tools?: ("agent" | "read" | "edit" | "bash" | "web" | "all")[] | undefined;
        maxTurns?: number | undefined;
    }>;
    prompt: z.ZodOptional<z.ZodString>;
    gate: z.ZodEnum<["auto", "manual", "none"]>;
    gateConfig: z.ZodOptional<z.ZodObject<{
        mode: z.ZodEnum<["auto", "manual", "none"]>;
        autoChecks: z.ZodOptional<z.ZodObject<{
            minLength: z.ZodOptional<z.ZodNumber>;
            maxLength: z.ZodOptional<z.ZodNumber>;
            mustContain: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            mustNotContain: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            jsonSchema: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            regex: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            minLength?: number | undefined;
            maxLength?: number | undefined;
            mustContain?: string[] | undefined;
            mustNotContain?: string[] | undefined;
            jsonSchema?: Record<string, unknown> | undefined;
            regex?: string | undefined;
        }, {
            minLength?: number | undefined;
            maxLength?: number | undefined;
            mustContain?: string[] | undefined;
            mustNotContain?: string[] | undefined;
            jsonSchema?: Record<string, unknown> | undefined;
            regex?: string | undefined;
        }>>;
        reviewPrompt: z.ZodOptional<z.ZodString>;
        maxRetries: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    }, "strip", z.ZodTypeAny, {
        mode: "auto" | "manual" | "none";
        autoChecks?: {
            minLength?: number | undefined;
            maxLength?: number | undefined;
            mustContain?: string[] | undefined;
            mustNotContain?: string[] | undefined;
            jsonSchema?: Record<string, unknown> | undefined;
            regex?: string | undefined;
        } | undefined;
        reviewPrompt?: string | undefined;
        maxRetries?: number | undefined;
    }, {
        mode: "auto" | "manual" | "none";
        autoChecks?: {
            minLength?: number | undefined;
            maxLength?: number | undefined;
            mustContain?: string[] | undefined;
            mustNotContain?: string[] | undefined;
            jsonSchema?: Record<string, unknown> | undefined;
            regex?: string | undefined;
        } | undefined;
        reviewPrompt?: string | undefined;
        maxRetries?: number | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    type: "agent";
    gate: "auto" | "manual" | "none";
    agent: {
        name: string;
        description: string;
        source: "discovered" | "preset" | "adhoc";
        path?: string | undefined;
        systemPrompt?: string | undefined;
        model?: "sonnet" | "opus" | "haiku" | undefined;
        tools?: ("agent" | "read" | "edit" | "bash" | "web" | "all")[] | undefined;
        maxTurns?: number | undefined;
    };
    prompt?: string | undefined;
    gateConfig?: {
        mode: "auto" | "manual" | "none";
        autoChecks?: {
            minLength?: number | undefined;
            maxLength?: number | undefined;
            mustContain?: string[] | undefined;
            mustNotContain?: string[] | undefined;
            jsonSchema?: Record<string, unknown> | undefined;
            regex?: string | undefined;
        } | undefined;
        reviewPrompt?: string | undefined;
        maxRetries?: number | undefined;
    } | undefined;
}, {
    id: string;
    type: "agent";
    gate: "auto" | "manual" | "none";
    agent: {
        name: string;
        description: string;
        source: "discovered" | "preset" | "adhoc";
        path?: string | undefined;
        systemPrompt?: string | undefined;
        model?: "sonnet" | "opus" | "haiku" | undefined;
        tools?: ("agent" | "read" | "edit" | "bash" | "web" | "all")[] | undefined;
        maxTurns?: number | undefined;
    };
    prompt?: string | undefined;
    gateConfig?: {
        mode: "auto" | "manual" | "none";
        autoChecks?: {
            minLength?: number | undefined;
            maxLength?: number | undefined;
            mustContain?: string[] | undefined;
            mustNotContain?: string[] | undefined;
            jsonSchema?: Record<string, unknown> | undefined;
            regex?: string | undefined;
        } | undefined;
        reviewPrompt?: string | undefined;
        maxRetries?: number | undefined;
    } | undefined;
}>;
export declare const PatternStepSchema: z.ZodType<PatternStep>;
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
export declare const WorkflowStepSchema: z.ZodType<WorkflowStep>;
export type WorkflowStep = SkillStep | AgentStep | PatternStep;
export declare const WorkflowDefinitionSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    initialPrompt: z.ZodString;
    steps: z.ZodArray<z.ZodType<WorkflowStep, z.ZodTypeDef, WorkflowStep>, "many">;
    plugins: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    contextFiles: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    systemPrompt: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    initialPrompt: string;
    steps: WorkflowStep[];
    systemPrompt?: string | undefined;
    plugins?: string[] | undefined;
    contextFiles?: string[] | undefined;
}, {
    id: string;
    name: string;
    initialPrompt: string;
    steps: WorkflowStep[];
    systemPrompt?: string | undefined;
    plugins?: string[] | undefined;
    contextFiles?: string[] | undefined;
}>;
export type WorkflowDefinition = z.infer<typeof WorkflowDefinitionSchema>;
export declare const StepStatusSchema: z.ZodEnum<["pending", "running", "completed", "failed", "skipped"]>;
export type StepStatus = z.infer<typeof StepStatusSchema>;
export declare const TerminationReasonSchema: z.ZodEnum<["all_completed", "child_failed", "task_complete", "approved", "max_iterations", "route_matched", "route_default", "timeout", "error"]>;
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
export type WsEvent = {
    type: "step:start";
    stepId: string;
    iteration?: number;
} | {
    type: "step:output";
    stepId: string;
    chunk: string;
} | {
    type: "step:complete";
    stepId: string;
    progress: StepProgress;
} | {
    type: "step:gate";
    stepId: string;
    output: string;
} | {
    type: "step:iteration";
    stepId: string;
    iteration: number;
    maxIterations: number;
    feedback?: string;
} | {
    type: "step:agents";
    stepId: string;
    agents: SubAgentInfo[];
} | {
    type: "workflow:progress";
    steps: StepProgress[];
} | {
    type: "workflow:complete";
    steps: StepProgress[];
} | {
    type: "workflow:error";
    error: string;
};
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
export interface PluginInfo {
    name: string;
    path: string;
    skillCount: number;
    agentCount: number;
}
//# sourceMappingURL=types.d.ts.map