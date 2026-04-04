import type { MultiplexerAdapter, SessionRef, TerminalRef } from "../types.js";
export declare class TmuxAdapter implements MultiplexerAdapter {
    readonly name: "tmux";
    ping(): Promise<boolean>;
    createSession(name: string, cwd: string): Promise<SessionRef>;
    createTerminal(session: SessionRef): Promise<TerminalRef>;
    closeSession(session: SessionRef): Promise<void>;
    send(ref: TerminalRef, text: string): Promise<void>;
    sendKey(ref: TerminalRef, key: "Enter"): Promise<void>;
    readScreen(ref: TerminalRef, lines: number): Promise<string>;
    focus(ref: SessionRef): Promise<void>;
    renameTerminal(ref: TerminalRef, name: string): Promise<void>;
}
//# sourceMappingURL=tmux-adapter.d.ts.map