import { useState } from "react";
import type { ProjectConfig } from "../api";

interface Props {
  projects: ProjectConfig[];
  active: ProjectConfig | null;
  onSelect: (p: ProjectConfig) => void;
  onCreate: (name: string, dir: string) => Promise<void>;
}

export default function ProjectPanel({ projects, active, onSelect, onCreate }: Props) {
  const [showNew, setShowNew] = useState(false);
  const [name, setName] = useState("");
  const [dir, setDir] = useState("");

  const handleCreate = async () => {
    if (!name.trim() || !dir.trim()) return;
    await onCreate(name.trim(), dir.trim());
    setName("");
    setDir("");
    setShowNew(false);
  };

  return (
    <div className="flex flex-col h-[calc(100%-2rem)]">
      <div className="px-3 py-2 flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
          Projects
        </span>
        <button
          onClick={() => setShowNew(!showNew)}
          className="w-5 h-5 rounded flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface-2 transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 2v8M2 6h8" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {showNew && (
        <div className="px-3 pb-2 space-y-1.5">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Project name"
            className="w-full px-2 py-1 text-xs bg-surface-2 border border-border-subtle rounded focus:outline-none focus:border-accent"
          />
          <input
            value={dir}
            onChange={(e) => setDir(e.target.value)}
            placeholder="/path/to/project"
            className="w-full px-2 py-1 text-xs bg-surface-2 border border-border-subtle rounded font-mono focus:outline-none focus:border-accent"
          />
          <button
            onClick={handleCreate}
            className="w-full text-xs py-1 bg-accent text-white rounded hover:bg-accent-hover transition-colors"
          >
            Create
          </button>
        </div>
      )}

      <div className="flex-1 overflow-auto px-1.5">
        {projects.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelect(p)}
            className={`w-full text-left px-2.5 py-2 rounded-md text-xs transition-colors mb-0.5 ${
              active?.id === p.id
                ? "bg-accent-subtle text-accent font-medium"
                : "text-text-secondary hover:bg-surface-2"
            }`}
          >
            <div className="truncate">{p.name}</div>
            <div className="text-[10px] text-text-muted font-mono truncate mt-0.5">
              {p.targetDir}
            </div>
          </button>
        ))}
        {projects.length === 0 && (
          <p className="text-[10px] text-text-muted text-center py-4">
            No projects yet
          </p>
        )}
      </div>
    </div>
  );
}
