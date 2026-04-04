import type { MultiplexerAdapter, SessionRef, TerminalRef } from "../types.js";
export declare class CmuxAdapter implements MultiplexerAdapter {
    readonly name: "cmux";
    ping(): Promise<boolean>;
    createSession(name: string, cwd: string): Promise<SessionRef>;
    createTerminal(session: SessionRef): Promise<TerminalRef>;
    closeSession(session: SessionRef): Promise<void>;
    send(ref: TerminalRef, text: string): Promise<void>;
    sendKey(ref: TerminalRef, key: "Enter"): Promise<void>;
    readScreen(ref: TerminalRef, lines: number): Promise<string>;
    focus(ref: SessionRef): Promise<void>;
}
//# sourceMappingURL=cmux-adapter.d.ts.map