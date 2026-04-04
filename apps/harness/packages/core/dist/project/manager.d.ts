import type { ProjectConfig } from "../types.js";
export declare class ProjectManager {
    private projects;
    load(): Promise<void>;
    private save;
    getAll(): ProjectConfig[];
    get(id: string): ProjectConfig | undefined;
    create(name: string, targetDir: string): Promise<ProjectConfig>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=manager.d.ts.map