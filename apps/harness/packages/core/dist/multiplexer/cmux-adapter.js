import { execFile as execFileCb } from "child_process";
import { promisify } from "util";
const execFileAsync = promisify(execFileCb);
export class CmuxAdapter {
    name = "cmux";
    async ping() {
        try {
            await execFileAsync("cmux", ["ping"]);
            return true;
        }
        catch {
            return false;
        }
    }
    async createSession(name, cwd) {
        const { stdout } = await execFileAsync("cmux", [
            "new-workspace",
            "--name",
            name,
            "--cwd",
            cwd,
        ]);
        const workspaceId = stdout.trim();
        return { sessionId: workspaceId, raw: { cwd, name } };
    }
    async createTerminal(session) {
        const { stdout } = await execFileAsync("cmux", [
            "new-surface",
            "--type",
            "terminal",
            "--workspace",
            session.sessionId,
        ]);
        const surfaceId = stdout.trim();
        return {
            session,
            terminalId: surfaceId,
            raw: { surfaceId },
        };
    }
    async closeSession(session) {
        try {
            await execFileAsync("cmux", ["close-workspace", "--workspace", session.sessionId]);
        }
        catch {
            // Workspace might already be closed
        }
    }
    async send(ref, text) {
        await execFileAsync("cmux", [
            "send",
            "--workspace",
            ref.session.sessionId,
            "--surface",
            ref.terminalId,
            text,
        ]);
    }
    async sendKey(ref, key) {
        await execFileAsync("cmux", [
            "send-key",
            "--workspace",
            ref.session.sessionId,
            "--surface",
            ref.terminalId,
            key,
        ]);
    }
    async readScreen(ref, lines) {
        const { stdout } = await execFileAsync("cmux", [
            "read-screen",
            "--workspace",
            ref.session.sessionId,
            "--surface",
            ref.terminalId,
            "--lines",
            String(lines),
        ]);
        return stdout;
    }
    async focus(ref) {
        await execFileAsync("cmux", [
            "focus-pane",
            "--workspace",
            ref.sessionId,
        ]);
    }
}
//# sourceMappingURL=cmux-adapter.js.map