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
export declare function parseAgentStatus(screen: string): SubAgentInfo[];
//# sourceMappingURL=screen-parser.d.ts.map