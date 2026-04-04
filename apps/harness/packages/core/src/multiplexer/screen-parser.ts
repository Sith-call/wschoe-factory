import type { SubAgentInfo } from "../types.js";

/**
 * Parse agent status from multiplexer screen output.
 * Works with both cmux and tmux (verified identical Unicode output).
 *
 * Expected format:
 *   Running 2 Explore agents...
 *    ├─ Find all .ts files · 2 tool uses · 13.8k tokens
 *    │  ⎿  Bash: ls -la /tmp/claude
 *    └─ Find all .json files · 3 tool uses · 19.9k tokens
 *       ⎿  Done
 */
export function parseAgentStatus(screen: string): SubAgentInfo[] {
  const agents: SubAgentInfo[] = [];
  const lines = screen.split("\n");
  const seen = new Set<string>();

  for (const line of lines) {
    // Match: ├─ or └─ followed by agent name · N tool uses · Nk tokens
    const match = line.match(/[├└]─\s+(.+?)(?:\s+·\s+(\d+)\s+tool uses?)?(?:\s+·\s+([\d.]+k?)\s+tokens?)?/);
    if (!match) continue;

    const name = match[1].trim();
    const key = name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);

    const toolUses = match[2] ? parseInt(match[2]) : undefined;
    const tokens = match[3] || undefined;

    // Look for activity line (⎿)
    const lineIdx = lines.indexOf(line);
    let activity: string | undefined;
    if (lineIdx + 1 < lines.length) {
      const nextLine = lines[lineIdx + 1];
      const activityMatch = nextLine.match(/⎿\s+(.+)/);
      if (activityMatch) {
        activity = activityMatch[1].trim().slice(0, 120);
      }
    }

    const isDone = activity === "Done" || activity?.startsWith("Done");

    agents.push({
      name,
      status: isDone ? "completed" : "running",
      toolUses,
      tokens,
      activity: isDone ? undefined : activity,
    });
  }

  return agents;
}
