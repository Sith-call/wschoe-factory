import type { AgentEvent, StepUsage } from "../types.js";
/**
 * Parse a single line of stream-json output from `claude -p --output-format stream-json`.
 * Returns a typed event or null for non-event lines.
 */
export type StreamEvent = {
    type: "system:init";
    sessionId: string;
    model: string;
} | {
    type: "assistant:text";
    text: string;
} | {
    type: "system:task_started";
    taskId: string;
    description: string;
} | {
    type: "system:task_progress";
    taskId: string;
    lastToolName?: string;
    usage?: {
        totalTokens: number;
        toolUses: number;
        durationMs: number;
    };
} | {
    type: "system:task_notification";
    taskId: string;
    status: string;
    summary?: string;
} | {
    type: "result";
    sessionId: string;
    result: string;
    usage: StepUsage;
    durationMs: number;
    totalCostUsd: number;
};
export declare function parseStreamLine(line: string): StreamEvent | null;
/**
 * Track agent lifecycle from stream events.
 */
export declare class AgentTracker {
    private agents;
    handleEvent(ev: StreamEvent): AgentEvent | null;
    getActive(): AgentEvent[];
    getAll(): AgentEvent[];
}
//# sourceMappingURL=stream-parser.d.ts.map