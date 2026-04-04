import { execFile as execFileCb } from "child_process";
import { promisify } from "util";
const execFileAsync = promisify(execFileCb);
export class TmuxAdapter {
    name = "tmux";
    async ping() {
        try {
            await execFileAsync("tmux", ["info"]);
            return true;
        }
        catch {
            return false;
        }
    }
    async createSession(name, cwd) {
        const sessionName = `harness-${name}`;
        await execFileAsync("tmux", ["new-session", "-d", "-s", sessionName, "-c", cwd]);
        return { sessionId: sessionName, raw: { cwd } };
    }
    async createTerminal(session) {
        const { stdout } = await execFileAsync("tmux", [
            "new-window",
            "-t",
            session.sessionId,
            "-P",
            "-F",
            "#{window_index}",
        ]);
        const windowIdx = stdout.trim();
        return {
            session,
            terminalId: `${session.sessionId}:${windowIdx}`,
            raw: { windowIndex: windowIdx },
        };
    }
    async closeSession(session) {
        try {
            await execFileAsync("tmux", ["kill-session", "-t", session.sessionId]);
        }
        catch {
            // Session might already be closed
        }
    }
    async send(ref, text) {
        await execFileAsync("tmux", ["send-keys", "-t", ref.terminalId, text, ""]);
    }
    async sendKey(ref, key) {
        await execFileAsync("tmux", ["send-keys", "-t", ref.terminalId, key]);
    }
    async readScreen(ref, lines) {
        const { stdout } = await execFileAsync("tmux", [
            "capture-pane",
            "-t",
            ref.terminalId,
            "-p",
            "-S",
            `-${lines}`,
        ]);
        return stdout;
    }
    async focus(ref) {
        await execFileAsync("tmux", ["select-window", "-t", ref.sessionId]);
    }
    async renameTerminal(ref, name) {
        await execFileAsync("tmux", ["rename-window", "-t", ref.terminalId, name]);
    }
}
//# sourceMappingURL=tmux-adapter.js.map