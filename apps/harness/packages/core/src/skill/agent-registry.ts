import { glob } from "glob";
import matter from "gray-matter";
import { readFile } from "fs/promises";
import type { AgentMeta, AgentSource } from "../types.js";

const PRESET_AGENTS: AgentMeta[] = [
  { name: "code-reviewer", description: "Reviews code for quality and best practices", source: "preset" },
  { name: "security-sentinel", description: "Scans for security vulnerabilities", source: "preset" },
  { name: "test-writer", description: "Generates test cases", source: "preset" },
  { name: "refactorer", description: "Refactors code for clarity and performance", source: "preset" },
  { name: "doc-writer", description: "Generates documentation", source: "preset" },
  { name: "architect", description: "Designs system architecture", source: "preset" },
];

export class AgentRegistry {
  private agents: AgentMeta[] = [...PRESET_AGENTS];

  async discover(): Promise<void> {
    const homeDir = process.env.HOME || process.env.USERPROFILE || "";
    const patterns = [
      `${homeDir}/.claude/plugins/**/agents/*/AGENT.md`,
      `${homeDir}/.claude/plugins/**/agents/*.md`,
    ];

    const files: string[] = [];
    for (const p of patterns) {
      const matches = await glob(p, { absolute: true });
      files.push(...matches);
    }

    const discovered: AgentMeta[] = [];
    for (const filePath of files) {
      try {
        const content = await readFile(filePath, "utf-8");
        const { data } = matter(content);
        const pluginName = extractPluginName(filePath);

        discovered.push({
          name: (data.name as string) || "",
          description: (data.description as string) || "",
          source: "discovered" as AgentSource,
          path: filePath,
          pluginName,
          model: data.model as string | undefined,
        });
      } catch {
        // Skip
      }
    }

    this.agents = [...PRESET_AGENTS, ...discovered];
  }

  search(query: string): AgentMeta[] {
    const q = query.toLowerCase();
    return this.agents.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q)
    );
  }

  getAll(): AgentMeta[] {
    return this.agents;
  }
}

function extractPluginName(path: string): string {
  const match = path.match(/plugins\/([^/]+)/);
  return match?.[1] || "unknown";
}
