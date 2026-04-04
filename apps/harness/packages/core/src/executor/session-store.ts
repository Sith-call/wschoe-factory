import { readFile, writeFile } from "fs/promises";
import { join } from "path";

interface SessionData {
  claudeSessionId: string;
  stepId: string;
  createdAt: string;
}

export class SessionStore {
  private sessions = new Map<string, SessionData>();

  async load(harnessDir: string): Promise<void> {
    try {
      const data = await readFile(join(harnessDir, "session.json"), "utf-8");
      const parsed = JSON.parse(data);
      if (parsed.sessions) {
        for (const [k, v] of Object.entries(parsed.sessions)) {
          this.sessions.set(k, v as SessionData);
        }
      }
    } catch {
      // Fresh start
    }
  }

  async save(harnessDir: string): Promise<void> {
    const obj: Record<string, SessionData> = {};
    for (const [k, v] of this.sessions) {
      obj[k] = v;
    }
    await writeFile(
      join(harnessDir, "session.json"),
      JSON.stringify({ sessions: obj }, null, 2)
    );
  }

  set(stepId: string, claudeSessionId: string): void {
    this.sessions.set(stepId, {
      claudeSessionId,
      stepId,
      createdAt: new Date().toISOString(),
    });
  }

  get(stepId: string): string | undefined {
    return this.sessions.get(stepId)?.claudeSessionId;
  }

  getLatest(): string | undefined {
    let latest: SessionData | undefined;
    for (const s of this.sessions.values()) {
      if (!latest || s.createdAt > latest.createdAt) latest = s;
    }
    return latest?.claudeSessionId;
  }
}
