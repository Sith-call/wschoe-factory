import { glob } from "glob";
import matter from "gray-matter";
import { readFile } from "fs/promises";
const PRESET_AGENTS = [
    { name: "code-reviewer", description: "Reviews code for quality and best practices", source: "preset" },
    { name: "security-sentinel", description: "Scans for security vulnerabilities", source: "preset" },
    { name: "test-writer", description: "Generates test cases", source: "preset" },
    { name: "refactorer", description: "Refactors code for clarity and performance", source: "preset" },
    { name: "doc-writer", description: "Generates documentation", source: "preset" },
    { name: "architect", description: "Designs system architecture", source: "preset" },
];
export class AgentRegistry {
    agents = [...PRESET_AGENTS];
    async discover() {
        const homeDir = process.env.HOME || process.env.USERPROFILE || "";
        const patterns = [
            `${homeDir}/.claude/plugins/**/agents/*/AGENT.md`,
            `${homeDir}/.claude/plugins/**/agents/*.md`,
        ];
        const files = [];
        for (const p of patterns) {
            const matches = await glob(p, { absolute: true });
            files.push(...matches);
        }
        const discovered = [];
        for (const filePath of files) {
            try {
                const content = await readFile(filePath, "utf-8");
                const { data } = matter(content);
                const pluginName = extractPluginName(filePath);
                discovered.push({
                    name: data.name || "",
                    description: data.description || "",
                    source: "discovered",
                    path: filePath,
                    pluginName,
                    model: data.model,
                });
            }
            catch {
                // Skip
            }
        }
        this.agents = [...PRESET_AGENTS, ...discovered];
    }
    search(query) {
        const q = query.toLowerCase();
        return this.agents.filter((a) => a.name.toLowerCase().includes(q) ||
            a.description.toLowerCase().includes(q));
    }
    getAll() {
        return this.agents;
    }
}
function extractPluginName(path) {
    const match = path.match(/plugins\/([^/]+)/);
    return match?.[1] || "unknown";
}
//# sourceMappingURL=agent-registry.js.map