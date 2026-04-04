import { EventEmitter } from "events";
import type { StepUsage } from "../types.js";
export interface ExecuteOptions {
    prompt: string;
    cwd: string;
    resumeSessionId?: string;
    forkSession?: boolean;
    plugins?: string[];
    contextFiles?: string[];
    systemPrompt?: string;
    model?: string;
    jsonSchema?: string;
    timeout?: number;
}
export interface ExecuteResult {
    sessionId: string;
    output: string;
    usage?: StepUsage;
    exitCode: number;
}
/**
 * Executes a Claude CLI step using `claude -p --output-format stream-json`.
 * Emits events for real-time monitoring.
 */
export declare class StreamExecutor extends EventEmitter {
    private process;
    private agentTracker;
    execute(opts: ExecuteOptions): Promise<ExecuteResult>;
    kill(): void;
}
//# sourceMappingURL=stream-executor.d.ts.map