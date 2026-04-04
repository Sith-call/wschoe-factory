import { useEffect, useState, useCallback } from "react";
import {
  ProjectConfig,
  TaskConfig,
  SkillMeta,
  AgentMeta,
  WorkflowStep,
  StepProgress,
  WsEvent,
  connectWs,
  projects as projectsApi,
  tasks as tasksApi,
  skills as skillsApi,
  agents as agentsApi,
  execution,
} from "./api";
import ProjectPanel from "./components/ProjectPanel";
import KanbanBoard from "./components/KanbanBoard";
import FlowChart from "./components/FlowChart";
import SkillPalette from "./components/SkillPalette";
import MonitorPanel from "./components/MonitorPanel";

type View = "kanban" | "workflow";

export default function App() {
  // ─── State ────────────────────────────────
  const [projectList, setProjectList] = useState<ProjectConfig[]>([]);
  const [activeProject, setActiveProject] = useState<ProjectConfig | null>(null);
  const [taskList, setTaskList] = useState<TaskConfig[]>([]);
  const [activeTask, setActiveTask] = useState<TaskConfig | null>(null);
  const [view, setView] = useState<View>("kanban");
  const [skillList, setSkillList] = useState<SkillMeta[]>([]);
  const [agentList, setAgentList] = useState<AgentMeta[]>([]);

  // Workflow editor state
  const [steps, setSteps] = useState<WorkflowStep[]>([]);
  const [prompt, setPrompt] = useState("");

  // Execution state
  const [stepProgress, setStepProgress] = useState<Map<string, StepProgress>>(new Map());
  const [isRunning, setIsRunning] = useState(false);
  const [outputLog, setOutputLog] = useState<string[]>([]);

  // Sidebar
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);

  // ─── Data loading ─────────────────────────
  useEffect(() => {
    projectsApi.list().then(setProjectList).catch(() => {});
    skillsApi.list().then(setSkillList).catch(() => {});
    agentsApi.list().then(setAgentList).catch(() => {});
  }, []);

  useEffect(() => {
    if (!activeProject) return;
    tasksApi.list(activeProject.id).then(setTaskList).catch(() => {});
  }, [activeProject]);

  // ─── WebSocket ────────────────────────────
  useEffect(() => {
    const ws = connectWs(handleWsEvent);
    return () => ws.close();
  }, []);

  const handleWsEvent = useCallback((ev: WsEvent) => {
    switch (ev.type) {
      case "step:start":
        setStepProgress((prev) => {
          const next = new Map(prev);
          next.set(ev.stepId, {
            stepId: ev.stepId,
            status: "running",
            startedAt: new Date().toISOString(),
            iteration: ev.iteration,
          });
          return next;
        });
        break;
      case "step:output":
        setOutputLog((prev) => [...prev, ev.chunk]);
        break;
      case "step:complete":
        setStepProgress((prev) => {
          const next = new Map(prev);
          next.set(ev.stepId, ev.progress);
          return next;
        });
        break;
      case "step:agents":
        setStepProgress((prev) => {
          const next = new Map(prev);
          const existing = next.get(ev.stepId);
          if (existing) {
            next.set(ev.stepId, { ...existing, activeAgents: ev.agents });
          }
          return next;
        });
        break;
      case "workflow:complete":
        setIsRunning(false);
        break;
      case "workflow:error":
        setIsRunning(false);
        setOutputLog((prev) => [...prev, `ERROR: ${ev.error}`]);
        break;
    }
  }, []);

  // ─── Actions ──────────────────────────────
  const selectTask = (task: TaskConfig) => {
    setActiveTask(task);
    setSteps(task.workflowSteps || []);
    setPrompt(task.initialPrompt || "");
    setView("workflow");
    setStepProgress(new Map());
    setOutputLog([]);
  };

  const runWorkflow = async () => {
    if (!activeProject || !activeTask) return;
    setIsRunning(true);
    setOutputLog([]);
    setStepProgress(new Map());
    try {
      await tasksApi.saveWorkflow(activeProject.id, activeTask.id, {
        initialPrompt: prompt,
        workflowSteps: steps,
      });
      await execution.run({
        cwd: activeTask.worktreePath || activeProject.targetDir,
        steps,
        initialPrompt: prompt,
      });
    } catch (err) {
      setIsRunning(false);
      setOutputLog((prev) => [...prev, `Failed: ${err}`]);
    }
  };

  // ─── Layout ───────────────────────────────
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Top bar */}
      <header className="h-12 bg-surface-1 border-b border-border flex items-center px-4 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-accent flex items-center justify-center">
            <span className="text-white text-xs font-bold">H</span>
          </div>
          <h1 className="text-sm font-semibold tracking-tight">Harness</h1>
        </div>
        <div className="flex-1" />
        {activeProject && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setView("kanban"); setActiveTask(null); }}
              className={`text-xs px-3 py-1.5 rounded-md transition-colors ${
                view === "kanban"
                  ? "bg-accent text-white"
                  : "text-text-secondary hover:bg-surface-2"
              }`}
            >
              Board
            </button>
            <button
              onClick={() => view === "kanban" && activeTask && setView("workflow")}
              className={`text-xs px-3 py-1.5 rounded-md transition-colors ${
                view === "workflow"
                  ? "bg-accent text-white"
                  : "text-text-secondary hover:bg-surface-2"
              }`}
            >
              Workflow
            </button>
          </div>
        )}
      </header>

      {/* Main */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left sidebar — Projects */}
        <aside
          className={`border-r border-border bg-surface-1 transition-all duration-200 shrink-0 ${
            leftOpen ? "w-56" : "w-10"
          }`}
        >
          <button
            onClick={() => setLeftOpen(!leftOpen)}
            className="w-full h-8 flex items-center justify-center text-text-muted hover:text-text-primary text-xs"
          >
            {leftOpen ? "\u25C0" : "\u25B6"}
          </button>
          {leftOpen && (
            <ProjectPanel
              projects={projectList}
              active={activeProject}
              onSelect={(p) => {
                setActiveProject(p);
                setActiveTask(null);
                setView("kanban");
              }}
              onCreate={async (name, dir) => {
                const p = await projectsApi.create(name, dir);
                setProjectList((prev) => [...prev, p]);
                setActiveProject(p);
              }}
            />
          )}
        </aside>

        {/* Center */}
        <main className="flex-1 overflow-auto bg-surface-0">
          {!activeProject ? (
            <EmptyState
              title="Select a project"
              subtitle="Choose a project from the sidebar or create a new one"
            />
          ) : view === "kanban" ? (
            <KanbanBoard
              tasks={taskList}
              projectId={activeProject.id}
              onSelectTask={selectTask}
              onCreateTask={async (name) => {
                const t = await tasksApi.create(activeProject.id, name);
                setTaskList((prev) => [...prev, t]);
              }}
              onUpdateTask={async (tid, data) => {
                const t = await tasksApi.update(activeProject.id, tid, data);
                setTaskList((prev) => prev.map((x) => (x.id === tid ? t : x)));
              }}
            />
          ) : activeTask ? (
            <div className="flex h-full">
              {/* FlowChart */}
              <div className="flex-1 overflow-auto p-6">
                <FlowChart
                  steps={steps}
                  onChange={setSteps}
                  stepProgress={stepProgress}
                  isRunning={isRunning}
                />
              </div>
              {/* Monitor */}
              <MonitorPanel
                prompt={prompt}
                onPromptChange={setPrompt}
                stepProgress={stepProgress}
                outputLog={outputLog}
                isRunning={isRunning}
                onRun={runWorkflow}
                onStop={async () => {
                  setIsRunning(false);
                }}
              />
            </div>
          ) : (
            <EmptyState title="Select a task" subtitle="Click a task card to edit its workflow" />
          )}
        </main>

        {/* Right sidebar — Skill Palette */}
        {view === "workflow" && (
          <aside
            className={`border-l border-border bg-surface-1 transition-all duration-200 shrink-0 ${
              rightOpen ? "w-64" : "w-10"
            }`}
          >
            <button
              onClick={() => setRightOpen(!rightOpen)}
              className="w-full h-8 flex items-center justify-center text-text-muted hover:text-text-primary text-xs"
            >
              {rightOpen ? "\u25B6" : "\u25C0"}
            </button>
            {rightOpen && (
              <SkillPalette
                skills={skillList}
                agents={agentList}
                onAddSkill={(skill) => {
                  const step: WorkflowStep = {
                    type: "skill",
                    id: crypto.randomUUID().slice(0, 8),
                    skillName: skill.name,
                    gate: "none",
                    pluginName: skill.pluginName,
                  };
                  setSteps((prev) => [...prev, step]);
                }}
                onAddAgent={(agent) => {
                  const step: WorkflowStep = {
                    type: "agent",
                    id: crypto.randomUUID().slice(0, 8),
                    agent: {
                      name: agent.name,
                      description: agent.description,
                      source: agent.source,
                      model: agent.model,
                    },
                    gate: "none",
                  };
                  setSteps((prev) => [...prev, step]);
                }}
                onAddPattern={(pattern) => {
                  const step: WorkflowStep = {
                    type: "pattern",
                    id: crypto.randomUUID().slice(0, 8),
                    pattern,
                    gate: "none",
                    children: [],
                  };
                  setSteps((prev) => [...prev, step]);
                }}
              />
            )}
          </aside>
        )}
      </div>
    </div>
  );
}

function EmptyState({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-text-muted">
      <div className="w-16 h-16 rounded-2xl bg-surface-2 flex items-center justify-center mb-4">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 5v14M5 12h14" strokeLinecap="round" />
        </svg>
      </div>
      <p className="text-sm font-medium text-text-secondary">{title}</p>
      <p className="text-xs mt-1">{subtitle}</p>
    </div>
  );
}
