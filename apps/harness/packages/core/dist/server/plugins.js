import { glob } from "glob";
import { readFile } from "fs/promises";
import { join } from "path";
export async function discoverPlugins() {
    const homeDir = process.env.HOME || process.env.USERPROFILE || "";
    const pluginRoot = join(homeDir, ".claude", "plugins");
    const pluginJsons = await glob(`${pluginRoot}/*/plugin.json`, {
        absolute: true,
    });
    const plugins = [];
    for (const pj of pluginJsons) {
        try {
            const data = JSON.parse(await readFile(pj, "utf-8"));
            const pluginDir = join(pj, "..");
            const name = data.name || pluginDir.split("/").pop() || "unknown";
            // Count skills
            const skillFiles = await glob(join(pluginDir, "skills", "*", "SKILL.md"));
            // Count agents
            const agentFiles = await glob(join(pluginDir, "agents", "*.md"));
            plugins.push({
                name,
                path: pluginDir,
                skillCount: skillFiles.length,
                agentCount: agentFiles.length,
            });
        }
        catch {
            // Skip
        }
    }
    return plugins;
}
//# sourceMappingURL=plugins.js.map