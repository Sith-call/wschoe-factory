import express from "express";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { SkillRegistry } from "../skill/registry.js";
import { AgentRegistry } from "../skill/agent-registry.js";
import { ProjectManager } from "../project/manager.js";
import { TaskManager } from "../task/manager.js";
import { WorkflowEngine } from "../workflow/engine.js";
import { discoverPlugins } from "./plugins.js";
const PORT = Number(process.env.PORT) || 3777;
// ─── Registries ─────────────────────────────
const skillRegistry = new SkillRegistry();
const agentRegistry = new AgentRegistry();
const projectManager = new ProjectManager();
const taskManager = new TaskManager();
// ─── Express App ────────────────────────────
const app = express();
app.use(express.json());
// ─── HTTP Server + WebSocket ────────────────
const server = createServer(app);
const wss = new WebSocketServer({ server, path: "/ws" });
const wsClients = new Set();
wss.on("connection", (ws) => {
    wsClients.add(ws);
    ws.on("close", () => wsClients.delete(ws));
});
function broadcast(event) {
    const data = JSON.stringify(event);
    for (const ws of wsClients) {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(data);
        }
    }
}
// ─── Workflow Engine ────────────────────────
const engine = new WorkflowEngine();
engine.on("ws", (ev) => broadcast(ev));
// ─── Skills API ─────────────────────────────
app.get("/api/skills", (_req, res) => {
    res.json(skillRegistry.getAll());
});
app.get("/api/skills/search", (req, res) => {
    const q = req.query.q || "";
    res.json(skillRegistry.search(q));
});
app.post("/api/skills/refresh", async (_req, res) => {
    await skillRegistry.discover();
    res.json(skillRegistry.getAll());
});
// ─── Agents API ─────────────────────────────
app.get("/api/agents", (_req, res) => {
    res.json(agentRegistry.getAll());
});
app.get("/api/agents/search", (req, res) => {
    const q = req.query.q || "";
    res.json(agentRegistry.search(q));
});
app.post("/api/agents/refresh", async (_req, res) => {
    await agentRegistry.discover();
    res.json(agentRegistry.getAll());
});
// ─── Plugins API ────────────────────────────
app.get("/api/plugins", async (_req, res) => {
    const plugins = await discoverPlugins();
    res.json(plugins);
});
// ─── Projects API ───────────────────────────
app.get("/api/projects", (_req, res) => {
    res.json(projectManager.getAll());
});
app.post("/api/projects", async (req, res) => {
    try {
        const { name, targetDir } = req.body;
        const project = await projectManager.create(name, targetDir);
        res.json(project);
    }
    catch (err) {
        res.status(400).json({ error: String(err) });
    }
});
app.delete("/api/projects/:id", async (req, res) => {
    await projectManager.delete(req.params.id);
    res.json({ ok: true });
});
// ─── Tasks API ──────────────────────────────
app.get("/api/projects/:pid/tasks", async (req, res) => {
    const project = projectManager.get(req.params.pid);
    if (!project)
        return res.status(404).json({ error: "Project not found" });
    const tasks = await taskManager.loadForProject(project.id, project.targetDir);
    res.json(tasks);
});
app.post("/api/projects/:pid/tasks", async (req, res) => {
    const project = projectManager.get(req.params.pid);
    if (!project)
        return res.status(404).json({ error: "Project not found" });
    try {
        const task = await taskManager.create(project.id, project.targetDir, req.body.name);
        res.json(task);
    }
    catch (err) {
        res.status(400).json({ error: String(err) });
    }
});
app.put("/api/projects/:pid/tasks/:tid", async (req, res) => {
    const project = projectManager.get(req.params.pid);
    if (!project)
        return res.status(404).json({ error: "Project not found" });
    try {
        const task = await taskManager.update(project.id, project.targetDir, req.params.tid, req.body);
        res.json(task);
    }
    catch (err) {
        res.status(400).json({ error: String(err) });
    }
});
app.patch("/api/projects/:pid/tasks/:tid/workflow", async (req, res) => {
    const project = projectManager.get(req.params.pid);
    if (!project)
        return res.status(404).json({ error: "Project not found" });
    try {
        const task = await taskManager.saveWorkflow(project.id, project.targetDir, req.params.tid, req.body);
        res.json(task);
    }
    catch (err) {
        res.status(400).json({ error: String(err) });
    }
});
app.delete("/api/projects/:pid/tasks/:tid", async (req, res) => {
    const project = projectManager.get(req.params.pid);
    if (!project)
        return res.status(404).json({ error: "Project not found" });
    await taskManager.delete(project.id, project.targetDir, req.params.tid);
    res.json({ ok: true });
});
// ─── Workflow Execution API ─────────────────
const activeExecutions = new Map();
app.post("/api/terminal", async (req, res) => {
    const { cwd, steps, initialPrompt, plugins, contextFiles, systemPrompt, model } = req.body;
    const sessionId = crypto.randomUUID().slice(0, 8);
    const workflowEngine = new WorkflowEngine();
    workflowEngine.on("ws", (ev) => broadcast(ev));
    activeExecutions.set(sessionId, workflowEngine);
    // Run async — don't await
    workflowEngine
        .run({ steps, initialPrompt, cwd, plugins, contextFiles, systemPrompt, model })
        .finally(() => activeExecutions.delete(sessionId));
    res.json({ sessionId });
});
app.post("/api/terminal/resume", async (req, res) => {
    const { cwd, steps, initialPrompt, completedStepIds, plugins, contextFiles, systemPrompt } = req.body;
    const sessionId = crypto.randomUUID().slice(0, 8);
    const workflowEngine = new WorkflowEngine();
    workflowEngine.on("ws", (ev) => broadcast(ev));
    activeExecutions.set(sessionId, workflowEngine);
    workflowEngine
        .run({ steps, initialPrompt, cwd, plugins, contextFiles, systemPrompt, completedStepIds })
        .finally(() => activeExecutions.delete(sessionId));
    res.json({ sessionId });
});
app.get("/api/terminal/sessions", (_req, res) => {
    const sessions = Array.from(activeExecutions.keys()).map((id) => ({ id }));
    res.json(sessions);
});
app.delete("/api/terminal/:sid", (req, res) => {
    const engine = activeExecutions.get(req.params.sid);
    if (engine) {
        engine.abort();
        activeExecutions.delete(req.params.sid);
    }
    res.json({ ok: true });
});
// ─── Startup ────────────────────────────────
async function start() {
    await projectManager.load();
    await skillRegistry.discover();
    await agentRegistry.discover();
    const skills = skillRegistry.getAll();
    const agents = agentRegistry.getAll();
    server.listen(PORT, () => {
        console.log(`\n  Harness API server`);
        console.log(`  ─────────────────`);
        console.log(`  Port:    ${PORT}`);
        console.log(`  Skills:  ${skills.length} discovered`);
        console.log(`  Agents:  ${agents.length} (${agents.filter((a) => a.source === "preset").length} preset + ${agents.filter((a) => a.source === "discovered").length} discovered)`);
        console.log(`  Projects: ${projectManager.getAll().length}`);
        console.log();
    });
}
start().catch(console.error);
//# sourceMappingURL=index.js.map