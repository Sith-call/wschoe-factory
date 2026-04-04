import { execFile as execFileCb } from "child_process";
import { promisify } from "util";
import type { MultiplexerAdapter, SessionRef, TerminalRef } from "../types.js";

const execFileAsync = promisify(execFileCb);

export class TmuxAdapter implements MultiplexerAdapter {
  readonly name = "tmux" as const;

  async ping(): Promise<boolean> {
    try {
      await execFileAsync("tmux", ["info"]);
      return true;
    } catch {
      return false;
    }
  }

  async createSession(name: string, cwd: string): Promise<SessionRef> {
    const sessionName = `harness-${name}`;
    await execFileAsync("tmux", ["new-session", "-d", "-s", sessionName, "-c", cwd]);
    return { sessionId: sessionName, raw: { cwd } };
  }

  async createTerminal(session: SessionRef): Promise<TerminalRef> {
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

  async closeSession(session: SessionRef): Promise<void> {
    try {
      await execFileAsync("tmux", ["kill-session", "-t", session.sessionId]);
    } catch {
      // Session might already be closed
    }
  }

  async send(ref: TerminalRef, text: string): Promise<void> {
    await execFileAsync("tmux", ["send-keys", "-t", ref.terminalId, text, ""]);
  }

  async sendKey(ref: TerminalRef, key: "Enter"): Promise<void> {
    await execFileAsync("tmux", ["send-keys", "-t", ref.terminalId, key]);
  }

  async readScreen(ref: TerminalRef, lines: number): Promise<string> {
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

  async focus(ref: SessionRef): Promise<void> {
    await execFileAsync("tmux", ["select-window", "-t", ref.sessionId]);
  }

  async renameTerminal(ref: TerminalRef, name: string): Promise<void> {
    await execFileAsync("tmux", ["rename-window", "-t", ref.terminalId, name]);
  }
}
