import type { AgentEvent, StepUsage } from "../types.js";

/**
 * Parse a single line of stream-json output from `claude -p --output-format stream-json`.
 * Returns a typed event or null for non-event lines.
 */
export type StreamEvent =
  | { type: "system:init"; sessionId: string; model: string }
  | { type: "assistant:text"; text: string }
  | { type: "system:task_started"; taskId: string; description: string }
  | { type: "system:task_progress"; taskId: string; lastToolName?: string; usage?: { totalTokens: number; toolUses: number; durationMs: number } }
  | { type: "system:task_notification"; taskId: string; status: string; summary?: string }
  | { type: "result"; sessionId: string; result: string; usage: StepUsage; durationMs: number; totalCostUsd: number };

export function parseStreamLine(line: string): StreamEvent | null {
  if (!line.trim()) return null;

  try {
    const obj = JSON.parse(line);

    // System init
    if (obj.type === "system" && obj.subtype === "init") {
      return {
        type: "system:init",
        sessionId: obj.session_id || "",
        model: obj.model || "",
      };
    }

    // Assistant text
    if (obj.type === "assistant" && obj.subtype === "text") {
      return { type: "assistant:text", text: obj.text || "" };
    }

    // Task started (sub-agent spawned)
    if (obj.type === "system" && obj.subtype === "task_started") {
      return {
        type: "system:task_started",
        taskId: obj.task_id || "",
        description: obj.description || "",
      };
    }

    // Task progress
    if (obj.type === "system" && obj.subtype === "task_progress") {
      return {
        type: "system:task_progress",
        taskId: obj.task_id || "",
        lastToolName: obj.last_tool_name,
        usage: obj.usage
          ? {
              totalTokens: obj.usage.total_tokens || 0,
              toolUses: obj.usage.tool_uses || 0,
              durationMs: obj.usage.duration_ms || 0,
            }
          : undefined,
      };
    }

    // Task notification (sub-agent completed)
    if (obj.type === "system" && obj.subtype === "task_notification") {
      return {
        type: "system:task_notification",
        taskId: obj.task_id || "",
        status: obj.status || "",
        summary: obj.summary,
      };
    }

    // Result
    if (obj.type === "result") {
      return {
        type: "result",
        sessionId: obj.session_id || "",
        result: obj.result || "",
        durationMs: obj.duration_ms || 0,
        totalCostUsd: obj.total_cost_usd || 0,
        usage: {
          inputTokens: obj.usage?.input_tokens || 0,
          outputTokens: obj.usage?.output_tokens || 0,
          cacheReadTokens: obj.usage?.cache_read_tokens || 0,
          cacheCreationTokens: obj.usage?.cache_creation_tokens || 0,
          totalCostUsd: obj.total_cost_usd || 0,
          durationMs: obj.duration_ms || 0,
          model: obj.model || "",
        },
      };
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Track agent lifecycle from stream events.
 */
export class AgentTracker {
  private agents = new Map<string, AgentEvent>();

  handleEvent(ev: StreamEvent): AgentEvent | null {
    if (ev.type === "system:task_started") {
      const agent: AgentEvent = {
        taskId: ev.taskId,
        description: ev.description,
        status: "started",
      };
      this.agents.set(ev.taskId, agent);
      return agent;
    }

    if (ev.type === "system:task_progress") {
      const agent = this.agents.get(ev.taskId);
      if (agent) {
        agent.status = "in_progress";
        agent.lastToolName = ev.lastToolName;
        if (ev.usage) agent.usage = ev.usage;
        return agent;
      }
    }

    if (ev.type === "system:task_notification") {
      const agent = this.agents.get(ev.taskId);
      if (agent) {
        agent.status = "completed";
        agent.summary = ev.summary;
        return agent;
      }
    }

    return null;
  }

  getActive(): AgentEvent[] {
    return Array.from(this.agents.values()).filter((a) => a.status !== "completed");
  }

  getAll(): AgentEvent[] {
    return Array.from(this.agents.values());
  }
}
