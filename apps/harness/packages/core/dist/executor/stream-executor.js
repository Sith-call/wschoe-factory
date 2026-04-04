import { spawn } from "child_process";
import { EventEmitter } from "events";
import { parseStreamLine, AgentTracker } from "./stream-parser.js";
/**
 * Executes a Claude CLI step using `claude -p --output-format stream-json`.
 * Emits events for real-time monitoring.
 */
export class StreamExecutor extends EventEmitter {
    process = null;
    agentTracker = new AgentTracker();
    async execute(opts) {
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
            let usage;
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
            this.process.stdout?.on("data", (chunk) => {
                buffer += chunk.toString();
                const lines = buffer.split("\n");
                buffer = lines.pop() || ""; // Keep incomplete last line
                for (const line of lines) {
                    const ev = parseStreamLine(line);
                    if (!ev)
                        continue;
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
            this.process.stderr?.on("data", (chunk) => {
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
    kill() {
        this.process?.kill("SIGTERM");
    }
}
function toSubAgentInfo(agent) {
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
//# sourceMappingURL=stream-executor.js.map