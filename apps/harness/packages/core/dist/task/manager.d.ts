import type { TaskConfig, WorkflowStep } from "../types.js";
export declare class TaskManager {
    private tasks;
    loadForProject(projectId: string, targetDir: string): Promise<TaskConfig[]>;
    private saveForProject;
    getAll(projectId: string): TaskConfig[];
    get(projectId: string, taskId: string): TaskConfig | undefined;
    create(projectId: string, targetDir: string, name: string): Promise<TaskConfig>;
    update(projectId: string, targetDir: string, taskId: string, data: Partial<TaskConfig>): Promise<TaskConfig>;
    saveWorkflow(projectId: string, targetDir: string, taskId: string, data: {
        initialPrompt?: string;
        workflowSteps?: WorkflowStep[];
        lastSessionId?: string;
    }): Promise<TaskConfig>;
    delete(projectId: string, targetDir: string, taskId: string): Promise<void>;
}
//# sourceMappingURL=manager.d.ts.map