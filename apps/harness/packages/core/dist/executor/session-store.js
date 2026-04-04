import { readFile, writeFile } from "fs/promises";
import { join } from "path";
export class SessionStore {
    sessions = new Map();
    async load(harnessDir) {
        try {
            const data = await readFile(join(harnessDir, "session.json"), "utf-8");
            const parsed = JSON.parse(data);
            if (parsed.sessions) {
                for (const [k, v] of Object.entries(parsed.sessions)) {
                    this.sessions.set(k, v);
                }
            }
        }
        catch {
            // Fresh start
        }
    }
    async save(harnessDir) {
        const obj = {};
        for (const [k, v] of this.sessions) {
            obj[k] = v;
        }
        await writeFile(join(harnessDir, "session.json"), JSON.stringify({ sessions: obj }, null, 2));
    }
    set(stepId, claudeSessionId) {
        this.sessions.set(stepId, {
            claudeSessionId,
            stepId,
            createdAt: new Date().toISOString(),
        });
    }
    get(stepId) {
        return this.sessions.get(stepId)?.claudeSessionId;
    }
    getLatest() {
        let latest;
        for (const s of this.sessions.values()) {
            if (!latest || s.createdAt > latest.createdAt)
                latest = s;
        }
        return latest?.claudeSessionId;
    }
}
//# sourceMappingURL=session-store.js.map