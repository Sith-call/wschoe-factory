import { EventEmitter } from "events";
import { StreamExecutor, type ExecuteOptions, type ExecuteResult } from "../executor/stream-executor.js";
import { runAutoGate } from "../executor/gate.js";
import { SessionStore } from "../executor/session-store.js";
import type {
  WorkflowStep,
  StepProgress,
  WsEvent,
  TerminationReason,
} from "../types.js";

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
export class WorkflowEngine extends EventEmitter {
  private sessionStore = new SessionStore();
  private executors = new Map<string, StreamExecutor>();
  private aborted = false;

  async run(opts: WorkflowRunOptions): Promise<StepProgress[]> {
    this.aborted = false;
    const results: StepProgress[] = [];
    const completedIds = new Set(opts.completedStepIds || []);

    for (const step of opts.steps) {
      if (this.aborted) break;
      if (completedIds.has(step.id)) {
        results.push({
          stepId: step.id,
          status: "skipped",
          startedAt: new Date().toISOString(),
        });
        continue;
      }

      const progress = await this.executeStep(step, opts);
      results.push(progress);

      if (progress.status === "failed") {
        this.emit("ws", { type: "workflow:error", error: progress.error || "Step failed" } as WsEvent);
        break;
      }
    }

    if (!this.aborted) {
      this.emit("ws", { type: "workflow:complete", steps: results } as WsEvent);
    }

    return results;
  }

  abort(): void {
    this.aborted = true;
    for (const exec of this.executors.values()) {
      exec.kill();
    }
  }

  private async executeStep(
    step: WorkflowStep,
    opts: WorkflowRunOptions
  ): Promise<StepProgress> {
    this.emit("ws", { type: "step:start", stepId: step.id } as WsEvent);

    const progress: StepProgress = {
      stepId: step.id,
      status: "running",
      startedAt: new Date().toISOString(),
    };

    try {
      let result: StepProgress;

      if (step.type === "pattern") {
        result = await this.executePattern(step, opts);
      } else {
        result = await this.executeLeaf(step, opts);
      }

      // Gate check
      if (result.status === "completed" && step.gate !== "none" && step.gateConfig) {
        if (step.gate === "auto") {
          const gateResult = runAutoGate(result.output || "", step.gateConfig);
          if (!gateResult.passed) {
            result.status = "failed";
            result.error = `Gate failed: ${gateResult.reason}`;
            result.terminationReason = "error";
          }
        } else if (step.gate === "manual") {
          this.emit("ws", { type: "step:gate", stepId: step.id, output: result.output || "" } as WsEvent);
          // Manual gate pauses here — will be resumed externally
        }
      }

      this.emit("ws", { type: "step:complete", stepId: step.id, progress: result } as WsEvent);
      return result;
    } catch (err) {
      progress.status = "failed";
      progress.error = err instanceof Error ? err.message : String(err);
      progress.terminationReason = "error";
      progress.completedAt = new Date().toISOString();
      this.emit("ws", { type: "step:complete", stepId: step.id, progress } as WsEvent);
      return progress;
    }
  }

  private async executeLeaf(
    step: WorkflowStep,
    opts: WorkflowRunOptions
  ): Promise<StepProgress> {
    const prompt = buildStepPrompt(step, opts.initialPrompt);
    const executor = new StreamExecutor();
    this.executors.set(step.id, executor);

    // Relay events
    executor.on("text", (text: string) => {
      this.emit("ws", { type: "step:output", stepId: step.id, chunk: text } as WsEvent);
    });
    executor.on("agents", (agents: unknown[]) => {
      this.emit("ws", { type: "step:agents", stepId: step.id, agents } as WsEvent);
    });

    const execOpts: ExecuteOptions = {
      prompt,
      cwd: opts.cwd,
      resumeSessionId: this.sessionStore.getLatest(),
      plugins: opts.plugins,
      contextFiles: opts.contextFiles,
      systemPrompt: opts.systemPrompt,
      model: opts.model,
    };

    const result = await executor.execute(execOpts);
    this.executors.delete(step.id);

    // Store session
    if (result.sessionId) {
      this.sessionStore.set(step.id, result.sessionId);
    }

    return {
      stepId: step.id,
      status: result.exitCode === 0 ? "completed" : "failed",
      output: result.output,
      usage: result.usage,
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      terminationReason: result.exitCode === 0 ? "all_completed" : "error",
    };
  }

  private async executePattern(
    step: WorkflowStep & { type: "pattern" },
    opts: WorkflowRunOptions
  ): Promise<StepProgress> {
    switch (step.pattern) {
      case "chain":
        return this.executeChain(step, opts);
      case "parallel":
        return this.executeParallel(step, opts);
      case "gen-judge":
        return this.executeGenJudge(step, opts);
      case "ralph":
      case "autonomous":
        return this.executeRalph(step, opts);
      case "router":
        return this.executeRouter(step, opts);
      case "voting":
        return this.executeVoting(step, opts);
      case "orchestrator":
        return this.executeOrchestrator(step, opts);
      default:
        return this.executeChain(step, opts);
    }
  }

  private async executeChain(
    step: WorkflowStep & { type: "pattern" },
    opts: WorkflowRunOptions
  ): Promise<StepProgress> {
    const children: StepProgress[] = [];
    for (const child of step.children) {
      if (this.aborted) break;
      const childProgress = await this.executeStep(child, opts);
      children.push(childProgress);
      if (childProgress.status === "failed") {
        return {
          stepId: step.id,
          status: "failed",
          startedAt: new Date().toISOString(),
          completedAt: new Date().toISOString(),
          children,
          terminationReason: "child_failed",
        };
      }
    }
    return {
      stepId: step.id,
      status: "completed",
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      children,
      terminationReason: "all_completed",
    };
  }

  private async executeParallel(
    step: WorkflowStep & { type: "pattern" },
    opts: WorkflowRunOptions
  ): Promise<StepProgress> {
    // Build a single prompt that instructs Claude to use Agent tool for all children
    const childDescriptions = step.children
      .map((c, i) => `${i + 1}. ${getStepLabel(c)}: ${c.prompt || "Execute this step"}`)
      .join("\n");

    const prompt = `You have ${step.children.length} independent tasks. Launch all agents simultaneously using the Agent tool:\n\n${childDescriptions}\n\n${step.prompt || ""}`;

    const leaf: WorkflowStep = {
      type: "skill",
      id: step.id,
      skillName: "parallel-dispatch",
      prompt,
      gate: "none",
    };

    return this.executeLeaf(leaf, { ...opts, initialPrompt: prompt });
  }

  private async executeGenJudge(
    step: WorkflowStep & { type: "pattern" },
    opts: WorkflowRunOptions
  ): Promise<StepProgress> {
    const maxIter = step.config?.maxIterations || 5;
    const judgeIdx = step.config?.judgeIndex ?? 1;
    const generator = step.children[0];
    const judge = step.children[judgeIdx] || step.children[1];

    if (!generator || !judge) {
      return {
        stepId: step.id,
        status: "failed",
        error: "Gen-judge requires at least 2 children (generator + judge)",
        startedAt: new Date().toISOString(),
        terminationReason: "error",
      };
    }

    for (let i = 1; i <= maxIter; i++) {
      if (this.aborted) break;
      this.emit("ws", {
        type: "step:iteration",
        stepId: step.id,
        iteration: i,
        maxIterations: maxIter,
      } as WsEvent);

      // Generate
      const genResult = await this.executeStep(generator, opts);
      if (genResult.status === "failed") {
        return { ...genResult, stepId: step.id, terminationReason: "child_failed" };
      }

      // Judge
      const judgeResult = await this.executeStep(judge, opts);
      if (judgeResult.status === "failed") {
        return { ...judgeResult, stepId: step.id, terminationReason: "child_failed" };
      }

      // Check for APPROVED
      if (judgeResult.output?.includes("APPROVED")) {
        return {
          stepId: step.id,
          status: "completed",
          output: genResult.output,
          startedAt: new Date().toISOString(),
          completedAt: new Date().toISOString(),
          iteration: i,
          maxIterations: maxIter,
          terminationReason: "approved",
        };
      }
    }

    return {
      stepId: step.id,
      status: "completed",
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      iteration: maxIter,
      maxIterations: maxIter,
      terminationReason: "max_iterations",
    };
  }

  private async executeRalph(
    step: WorkflowStep & { type: "pattern" },
    opts: WorkflowRunOptions
  ): Promise<StepProgress> {
    const maxIter = step.config?.maxIterations || 5;
    const worker = step.children[0];

    if (!worker) {
      return {
        stepId: step.id,
        status: "failed",
        error: "Ralph requires at least 1 child (worker)",
        startedAt: new Date().toISOString(),
        terminationReason: "error",
      };
    }

    for (let i = 1; i <= maxIter; i++) {
      if (this.aborted) break;
      this.emit("ws", {
        type: "step:iteration",
        stepId: step.id,
        iteration: i,
        maxIterations: maxIter,
      } as WsEvent);

      const result = await this.executeStep(worker, opts);

      if (result.output?.includes("TASK_COMPLETE")) {
        return {
          stepId: step.id,
          status: "completed",
          output: result.output,
          startedAt: new Date().toISOString(),
          completedAt: new Date().toISOString(),
          iteration: i,
          maxIterations: maxIter,
          terminationReason: "task_complete",
        };
      }

      if (result.status === "failed") {
        return { ...result, stepId: step.id, terminationReason: "child_failed" };
      }
    }

    return {
      stepId: step.id,
      status: "completed",
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      iteration: maxIter,
      maxIterations: maxIter,
      terminationReason: "max_iterations",
    };
  }

  private async executeRouter(
    step: WorkflowStep & { type: "pattern" },
    opts: WorkflowRunOptions
  ): Promise<StepProgress> {
    // First child classifies, routes to matching handler
    const classifier = step.children[0];
    if (!classifier) {
      return {
        stepId: step.id,
        status: "failed",
        error: "Router requires at least 1 child (classifier)",
        startedAt: new Date().toISOString(),
        terminationReason: "error",
      };
    }

    const classResult = await this.executeStep(classifier, opts);
    if (classResult.status === "failed") {
      return { ...classResult, stepId: step.id };
    }

    // Find matching handler based on conditions
    const conditions = step.config?.conditions || [];
    let handlerIdx = -1;
    for (let i = 0; i < conditions.length; i++) {
      if (classResult.output?.toLowerCase().includes(conditions[i].toLowerCase())) {
        handlerIdx = i + 1; // Skip classifier (index 0)
        break;
      }
    }

    // Default to last handler
    if (handlerIdx === -1) handlerIdx = step.children.length - 1;
    const handler = step.children[handlerIdx];

    if (handler) {
      const handlerResult = await this.executeStep(handler, opts);
      return {
        ...handlerResult,
        stepId: step.id,
        terminationReason: handlerIdx === step.children.length - 1 ? "route_default" : "route_matched",
      };
    }

    return {
      stepId: step.id,
      status: "completed",
      output: classResult.output,
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      terminationReason: "route_default",
    };
  }

  private async executeVoting(
    step: WorkflowStep & { type: "pattern" },
    opts: WorkflowRunOptions
  ): Promise<StepProgress> {
    const count = step.config?.votingCount || 3;
    const worker = step.children[0];
    if (!worker) {
      return {
        stepId: step.id,
        status: "failed",
        error: "Voting requires at least 1 child",
        startedAt: new Date().toISOString(),
        terminationReason: "error",
      };
    }

    // Execute N forks concurrently
    const forkPromises: Promise<StepProgress>[] = [];
    for (let i = 0; i < count; i++) {
      forkPromises.push(this.executeStep(
        { ...worker, id: `${worker.id}-fork-${i}` },
        opts
      ));
    }

    const forkResults = await Promise.all(forkPromises);

    return {
      stepId: step.id,
      status: "completed",
      output: forkResults.map((r) => r.output).join("\n---\n"),
      children: forkResults,
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      terminationReason: "all_completed",
    };
  }

  private async executeOrchestrator(
    step: WorkflowStep & { type: "pattern" },
    opts: WorkflowRunOptions
  ): Promise<StepProgress> {
    // Phase 1: Decompose
    const decomposer = step.children[0];
    if (!decomposer) {
      return {
        stepId: step.id,
        status: "failed",
        error: "Orchestrator requires at least 1 child (decomposer)",
        startedAt: new Date().toISOString(),
        terminationReason: "error",
      };
    }

    const decompResult = await this.executeStep(decomposer, opts);
    if (decompResult.status === "failed") {
      return { ...decompResult, stepId: step.id };
    }

    // Phase 2: Dispatch workers (remaining children)
    const workers = step.children.slice(1);
    if (workers.length > 0) {
      const workerPromises = workers.map((w) => this.executeStep(w, opts));
      const workerResults = await Promise.all(workerPromises);

      return {
        stepId: step.id,
        status: workerResults.every((r) => r.status === "completed") ? "completed" : "failed",
        children: [decompResult, ...workerResults],
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        terminationReason: "all_completed",
      };
    }

    return {
      stepId: step.id,
      status: "completed",
      output: decompResult.output,
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      terminationReason: "all_completed",
    };
  }
}

function buildStepPrompt(step: WorkflowStep, initialPrompt: string): string {
  const parts: string[] = [];
  if (initialPrompt) parts.push(initialPrompt);
  if (step.prompt) parts.push(step.prompt);

  if (step.type === "skill") {
    parts.push(`Use the "${step.skillName}" skill to complete this task.`);
  } else if (step.type === "agent") {
    parts.push(`You are acting as "${step.agent.name}": ${step.agent.description}`);
  }

  return parts.join("\n\n");
}

function getStepLabel(step: WorkflowStep): string {
  switch (step.type) {
    case "skill": return step.skillName;
    case "agent": return step.agent.name;
    case "pattern": return step.pattern;
  }
}
