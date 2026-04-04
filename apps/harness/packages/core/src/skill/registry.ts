import { glob } from "glob";
import matter from "gray-matter";
import { readFile } from "fs/promises";
import type { SkillMeta } from "../types.js";

export class SkillRegistry {
  private skills: SkillMeta[] = [];

  async discover(): Promise<void> {
    const homeDir = process.env.HOME || process.env.USERPROFILE || "";
    const patterns = [
      `${homeDir}/.claude/skills/*/SKILL.md`,
      `${homeDir}/.claude/plugins/**/skills/*/SKILL.md`,
    ];

    const files: string[] = [];
    for (const p of patterns) {
      const matches = await glob(p, { absolute: true });
      files.push(...matches);
    }

    this.skills = [];
    for (const filePath of files) {
      try {
        const content = await readFile(filePath, "utf-8");
        const { data } = matter(content);
        const source = filePath.includes("/plugins/") ? "plugin" : "builtin";
        const pluginName = source === "plugin" ? extractPluginName(filePath) : undefined;

        this.skills.push({
          name: (data.name as string) || "",
          description: (data.description as string) || "",
          source,
          path: filePath,
          pluginName,
        });
      } catch {
        // Skip unparseable files
      }
    }
  }

  search(query: string): SkillMeta[] {
    const q = query.toLowerCase();
    return this.skills.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
    );
  }

  getAll(): SkillMeta[] {
    return this.skills;
  }
}

function extractPluginName(path: string): string {
  const match = path.match(/plugins\/([^/]+)/);
  return match?.[1] || "unknown";
}
