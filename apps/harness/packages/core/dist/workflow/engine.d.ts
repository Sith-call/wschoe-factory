import { EventEmitter } from "events";
import type { WorkflowStep, StepProgress } from "../types.js";
export interface WorkflowRunOptions {
    steps: WorkflowStep[];
    initialPrompt: string;
    cwd: string;
    plugins?: string[];
    contextFiles?: string[];
    systemPrompt?: string;
    model?: string;
    completedStepIds?: string[];
}
/**
 * Orchestrates workflow execution across all pattern types.
 */
export declare class WorkflowEngine extends EventEmitter {
    private sessionStore;
    private executors;
    private aborted;
    run(opts: WorkflowRunOptions): Promise<StepProgress[]>;
    abort(): void;
    private executeStep;
    private executeLeaf;
    private executePattern;
    private executeChain;
    private executeParallel;
    private executeGenJudge;
    private executeRalph;
    private executeRouter;
    private executeVoting;
    private executeOrchestrator;
}
//# sourceMappingURL=engine.d.ts.map