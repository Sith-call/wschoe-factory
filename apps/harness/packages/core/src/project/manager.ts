import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";
import { randomUUID } from "crypto";
import { execFileSync } from "child_process";
import type { ProjectConfig } from "../types.js";

const GLOBAL_REGISTRY = join(
  process.env.HOME || process.env.USERPROFILE || "",
  ".harness",
  "projects.json"
);

export class ProjectManager {
  private projects: ProjectConfig[] = [];

  async load(): Promise<void> {
    try {
      const data = await readFile(GLOBAL_REGISTRY, "utf-8");
      this.projects = JSON.parse(data);
    } catch {
      this.projects = [];
    }
  }

  private async save(): Promise<void> {
    const dir = join(
      process.env.HOME || process.env.USERPROFILE || "",
      ".harness"
    );
    if (!existsSync(dir)) await mkdir(dir, { recursive: true });
    await writeFile(GLOBAL_REGISTRY, JSON.stringify(this.projects, null, 2));
  }

  getAll(): ProjectConfig[] {
    return this.projects;
  }

  get(id: string): ProjectConfig | undefined {
    return this.projects.find((p) => p.id === id);
  }

  async create(name: string, targetDir: string): Promise<ProjectConfig> {
    const project: ProjectConfig = {
      id: randomUUID(),
      name,
      targetDir,
      createdAt: new Date().toISOString(),
    };

    // Init git if needed
    const gitDir = join(targetDir, ".git");
    if (!existsSync(gitDir)) {
      if (!existsSync(targetDir)) {
        await mkdir(targetDir, { recursive: true });
      }
      try {
        execFileSync("git", ["init"], { cwd: targetDir, stdio: "ignore" });
      } catch {
        // git init failed, continue anyway
      }
    }

    // Create .harness directory
    const harnessDir = join(targetDir, ".harness");
    await mkdir(harnessDir, { recursive: true });
    await writeFile(
      join(harnessDir, "project.json"),
      JSON.stringify(project, null, 2)
    );
    await writeFile(join(harnessDir, "tasks.json"), "[]");
    await writeFile(join(harnessDir, "session.json"), "{}");

    this.projects.push(project);
    await this.save();
    return project;
  }

  async delete(id: string): Promise<void> {
    this.projects = this.projects.filter((p) => p.id !== id);
    await this.save();
    // .harness/ in project dir is NOT deleted (data preservation)
  }
}
