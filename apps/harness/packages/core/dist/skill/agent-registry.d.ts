import type { AgentMeta } from "../types.js";
export declare class AgentRegistry {
    private agents;
    discover(): Promise<void>;
    search(query: string): AgentMeta[];
    getAll(): AgentMeta[];
}
//# sourceMappingURL=agent-registry.d.ts.map