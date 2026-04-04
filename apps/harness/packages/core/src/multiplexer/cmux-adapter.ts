import { execFile as execFileCb } from "child_process";
import { promisify } from "util";
import type { MultiplexerAdapter, SessionRef, TerminalRef } from "../types.js";

const execFileAsync = promisify(execFileCb);

export class CmuxAdapter implements MultiplexerAdapter {
  readonly name = "cmux" as const;

  async ping(): Promise<boolean> {
    try {
      await execFileAsync("cmux", ["ping"]);
      return true;
    } catch {
      return false;
    }
  }

  async createSession(name: string, cwd: string): Promise<SessionRef> {
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

  async createTerminal(session: SessionRef): Promise<TerminalRef> {
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

  async closeSession(session: SessionRef): Promise<void> {
    try {
      await execFileAsync("cmux", ["close-workspace", "--workspace", session.sessionId]);
    } catch {
      // Workspace might already be closed
    }
  }

  async send(ref: TerminalRef, text: string): Promise<void> {
    await execFileAsync("cmux", [
      "send",
      "--workspace",
      ref.session.sessionId,
      "--surface",
      ref.terminalId,
      text,
    ]);
  }

  async sendKey(ref: TerminalRef, key: "Enter"): Promise<void> {
    await execFileAsync("cmux", [
      "send-key",
      "--workspace",
      ref.session.sessionId,
      "--surface",
      ref.terminalId,
      key,
    ]);
  }

  async readScreen(ref: TerminalRef, lines: number): Promise<string> {
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

  async focus(ref: SessionRef): Promise<void> {
    await execFileAsync("cmux", [
      "focus-pane",
      "--workspace",
      ref.sessionId,
    ]);
  }
}
