import { TmuxAdapter } from "./tmux-adapter.js";
import { CmuxAdapter } from "./cmux-adapter.js";
import type { MultiplexerAdapter } from "../types.js";

/**
 * Auto-detect available multiplexer.
 * Priority: HARNESS_MULTIPLEXER env > cmux > tmux
 */
export async function detectMultiplexer(): Promise<MultiplexerAdapter | null> {
  const forced = process.env.HARNESS_MULTIPLEXER;

  if (forced === "cmux") {
    const adapter = new CmuxAdapter();
    if (await adapter.ping()) return adapter;
    return null;
  }

  if (forced === "tmux") {
    const adapter = new TmuxAdapter();
    if (await adapter.ping()) return adapter;
    return null;
  }

  // Auto-detect: cmux first, then tmux
  const cmux = new CmuxAdapter();
  if (await cmux.ping()) return cmux;

  const tmux = new TmuxAdapter();
  if (await tmux.ping()) return tmux;

  return null;
}
