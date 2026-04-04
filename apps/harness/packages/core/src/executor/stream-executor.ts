import { spawn, type ChildProcess } from "child_process";
import { EventEmitter } from "events";
import { parseStreamLine, AgentTracker, type StreamEvent } from "./stream-parser.js";
import type { StepProgress, StepUsage, SubAgentInfo } from "../types.js";

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
  timeout?: number; // ms, default 3600000 (60min)
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
export class StreamExecutor extends EventEmitter {
  private process: ChildProcess | null = null;
  private agentTracker = new AgentTracker();

  async execute(opts: ExecuteOptions): Promise<ExecuteResult> {
    const args = ["-p", opts.prompt, "--output-format", "stream-json", "--verbose"];

    // Isolation
    args.push("--setting-sources", "");
    args.push("--permission-mode", "bypassPermissions");

    // Resume
    if (opts.resumeSessionId) {
      args.push("--resume", opts.resumeSessionId);
    }

    // Fork
    if (opts.forkSession) {
      args.push("--fork-session");
    }

    // Model
    if (opts.model) {
      args.push("--model", opts.model);
    }

    // JSON schema
    if (opts.jsonSchema) {
      args.push("--json-schema", opts.jsonSchema);
    }

    // Plugins
    if (opts.plugins) {
      for (const p of opts.plugins) {
        args.push("--plugin-dir", p);
      }
    }

    // Context files
    if (opts.contextFiles) {
      for (const f of opts.contextFiles) {
        args.push("--append-system-prompt-file", f);
      }
    }

    // System prompt
    if (opts.systemPrompt) {
      args.push("--append-system-prompt", opts.systemPrompt);
    }

    return new Promise((resolve, reject) => {
      const timeout = opts.timeout || 3600000;
      let output = "";
      let sessionId = "";
      let usage: StepUsage | undefined;
      let buffer = "";

      this.process = spawn("claude", args, {
        cwd: opts.cwd,
        env: { ...process.env },
        stdio: ["ignore", "pipe", "pipe"],
      });

      const timer = setTimeout(() => {
        this.process?.kill("SIGTERM");
        reject(new Error("Step timeout (60 minutes)"));
      }, timeout);

      this.process.stdout?.on("data", (chunk: Buffer) => {
        buffer += chunk.toString();
        const lines = buffer.split("\n");
        buffer = lines.pop() || ""; // Keep incomplete last line

        for (const line of lines) {
          const ev = parseStreamLine(line);
          if (!ev) continue;

          if (ev.type === "system:init") {
            sessionId = ev.sessionId;
          }

          if (ev.type === "assistant:text") {
            output += ev.text;
            this.emit("text", ev.text);
          }

          if (ev.type === "result") {
            sessionId = ev.sessionId;
            usage = ev.usage;
          }

          // Agent tracking
          const agentUpdate = this.agentTracker.handleEvent(ev);
          if (agentUpdate) {
            this.emit("agents", this.agentTracker.getActive().map(toSubAgentInfo));
          }

          this.emit("event", ev);
        }
      });

      this.process.stderr?.on("data", (chunk: Buffer) => {
        // stderr from claude CLI is usually progress/debug info
        this.emit("stderr", chunk.toString());
      });

      this.process.on("close", (code) => {
        clearTimeout(timer);
        this.process = null;

        // Process remaining buffer
        if (buffer.trim()) {
          const ev = parseStreamLine(buffer);
          if (ev?.type === "result") {
            sessionId = ev.sessionId;
            usage = ev.usage;
          }
        }

        resolve({
          sessionId,
          output,
          usage,
          exitCode: code || 0,
        });
      });

      this.process.on("error", (err) => {
        clearTimeout(timer);
        this.process = null;
        reject(err);
      });
    });
  }

  kill(): void {
    this.process?.kill("SIGTERM");
  }
}

function toSubAgentInfo(agent: { taskId: string; description: string; status: string; lastToolName?: string; usage?: { totalTokens: number; toolUses: number } }): SubAgentInfo {
  return {
    name: agent.description,
    status: agent.status,
    activity: agent.lastToolName ? `Using ${agent.lastToolName}` : undefined,
    toolUses: agent.usage?.toolUses,
    tokens: agent.usage?.totalTokens
      ? `${(agent.usage.totalTokens / 1000).toFixed(1)}k`
      : undefined,
  };
}
