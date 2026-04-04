import { useState } from "react";
import type { TaskConfig } from "../api";

interface Props {
  tasks: TaskConfig[];
  projectId: string;
  onSelectTask: (t: TaskConfig) => void;
  onCreateTask: (name: string) => Promise<void>;
  onUpdateTask: (tid: string, data: Partial<TaskConfig>) => Promise<void>;
}

const COLUMNS: { key: TaskConfig["status"]; label: string; color: string }[] = [
  { key: "created", label: "Ready", color: "bg-zinc-400" },
  { key: "running", label: "In Progress", color: "bg-amber-400" },
  { key: "completed", label: "Done", color: "bg-emerald-400" },
  { key: "failed", label: "Failed", color: "bg-red-400" },
];

export default function KanbanBoard({
  tasks,
  projectId,
  onSelectTask,
  onCreateTask,
  onUpdateTask,
}: Props) {
  const [newTaskName, setNewTaskName] = useState("");
  const [showInput, setShowInput] = useState(false);

  const handleCreate = async () => {
    if (!newTaskName.trim()) return;
    await onCreateTask(newTaskName.trim());
    setNewTaskName("");
    setShowInput(false);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Tasks</h2>
        <button
          onClick={() => setShowInput(true)}
          className="text-xs px-3 py-1.5 bg-accent text-white rounded-md hover:bg-accent-hover transition-colors"
        >
          + New Task
        </button>
      </div>

      {showInput && (
        <div className="flex gap-2 mb-4">
          <input
            autoFocus
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            placeholder="Task name..."
            className="flex-1 px-3 py-1.5 text-sm bg-surface-1 border border-border rounded-md focus:outline-none focus:border-accent"
          />
          <button
            onClick={handleCreate}
            className="text-xs px-3 py-1.5 bg-accent text-white rounded-md"
          >
            Add
          </button>
          <button
            onClick={() => setShowInput(false)}
            className="text-xs px-3 py-1.5 text-text-muted hover:text-text-primary"
          >
            Cancel
          </button>
        </div>
      )}

      <div className="grid grid-cols-4 gap-4">
        {COLUMNS.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.key);
          return (
            <div key={col.key} className="min-h-[200px]">
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-2 h-2 rounded-full ${col.color}`} />
                <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">
                  {col.label}
                </span>
                <span className="text-[10px] text-text-muted ml-auto">
                  {colTasks.length}
                </span>
              </div>
              <div className="space-y-2">
                {colTasks.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => onSelectTask(task)}
                    className="w-full text-left bg-surface-1 border border-border-subtle rounded-lg p-3 hover:border-accent/40 transition-all group"
                  >
                    <div className="text-sm font-medium truncate group-hover:text-accent transition-colors">
                      {task.name}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] text-text-muted font-mono">
                        {task.id}
                      </span>
                      {task.workflowSteps && task.workflowSteps.length > 0 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent-subtle text-accent">
                          {task.workflowSteps.length} steps
                        </span>
                      )}
                    </div>
                    {task.branch && (
                      <div className="text-[10px] text-text-muted font-mono mt-1 truncate">
                        {task.branch}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
