import type { SkillMeta } from "../types.js";
export declare class SkillRegistry {
    private skills;
    discover(): Promise<void>;
    search(query: string): SkillMeta[];
    getAll(): SkillMeta[];
}
//# sourceMappingURL=registry.d.ts.map