import type { MultiplexerAdapter } from "../types.js";
/**
 * Auto-detect available multiplexer.
 * Priority: HARNESS_MULTIPLEXER env > cmux > tmux
 */
export declare function detectMultiplexer(): Promise<MultiplexerAdapter | null>;
//# sourceMappingURL=detect.d.ts.map