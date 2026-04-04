import { readFile, writeFile, mkdir, rm } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";
import { randomUUID } from "crypto";
import { execFileSync } from "child_process";
import type { TaskConfig, WorkflowStep } from "../types.js";

export class TaskManager {
  private tasks: Map<string, TaskConfig[]> = new Map();

  async loadForProject(projectId: string, targetDir: string): Promise<TaskConfig[]> {
    const tasksPath = join(targetDir, ".harness", "tasks.json");
    try {
      const data = await readFile(tasksPath, "utf-8");
      const tasks: TaskConfig[] = JSON.parse(data);
      this.tasks.set(projectId, tasks);
      return tasks;
    } catch {
      this.tasks.set(projectId, []);
      return [];
    }
  }

  private async saveForProject(projectId: string, targetDir: string): Promise<void> {
    const tasks = this.tasks.get(projectId) || [];
    const tasksPath = join(targetDir, ".harness", "tasks.json");
    await writeFile(tasksPath, JSON.stringify(tasks, null, 2));
  }

  getAll(projectId: string): TaskConfig[] {
    return this.tasks.get(projectId) || [];
  }

  get(projectId: string, taskId: string): TaskConfig | undefined {
    return this.getAll(projectId).find((t) => t.id === taskId);
  }

  async create(
    projectId: string,
    targetDir: string,
    name: string
  ): Promise<TaskConfig> {
    const id = randomUUID().slice(0, 8);
    const worktreePath = join(targetDir, ".harness", "worktrees", id);
    const branch = `harness/task-${id}`;

    // Create worktree
    await mkdir(join(targetDir, ".harness", "worktrees"), { recursive: true });
    try {
      execFileSync("git", ["worktree", "add", worktreePath, "-b", branch], {
        cwd: targetDir,
        stdio: "ignore",
      });
    } catch {
      // Worktree creation might fail; fallback to plain dir
      await mkdir(worktreePath, { recursive: true });
    }

    const task: TaskConfig = {
      id,
      projectId,
      name,
      status: "created",
      worktreePath,
      branch,
      createdAt: new Date().toISOString(),
    };

    const tasks = this.tasks.get(projectId) || [];
    tasks.push(task);
    this.tasks.set(projectId, tasks);
    await this.saveForProject(projectId, targetDir);
    return task;
  }

  async update(
    projectId: string,
    targetDir: string,
    taskId: string,
    data: Partial<TaskConfig>
  ): Promise<TaskConfig> {
    const tasks = this.tasks.get(projectId) || [];
    const idx = tasks.findIndex((t) => t.id === taskId);
    if (idx === -1) throw new Error(`Task ${taskId} not found`);

    tasks[idx] = { ...tasks[idx], ...data };
    this.tasks.set(projectId, tasks);
    await this.saveForProject(projectId, targetDir);
    return tasks[idx];
  }

  async saveWorkflow(
    projectId: string,
    targetDir: string,
    taskId: string,
    data: {
      initialPrompt?: string;
      workflowSteps?: WorkflowStep[];
      lastSessionId?: string;
    }
  ): Promise<TaskConfig> {
    return this.update(projectId, targetDir, taskId, data);
  }

  async delete(
    projectId: string,
    targetDir: string,
    taskId: string
  ): Promise<void> {
    const task = this.get(projectId, taskId);
    if (!task) return;

    // Remove worktree
    if (task.worktreePath && existsSync(task.worktreePath)) {
      try {
        execFileSync("git", ["worktree", "remove", task.worktreePath, "--force"], {
          cwd: targetDir,
          stdio: "ignore",
        });
      } catch {
        await rm(task.worktreePath, { recursive: true, force: true });
      }
    }

    // Remove branch
    if (task.branch) {
      try {
        execFileSync("git", ["branch", "-D", task.branch], {
          cwd: targetDir,
          stdio: "ignore",
        });
      } catch {
        // Branch might not exist
      }
    }

    const tasks = (this.tasks.get(projectId) || []).filter(
      (t) => t.id !== taskId
    );
    this.tasks.set(projectId, tasks);
    await this.saveForProject(projectId, targetDir);
  }
}
