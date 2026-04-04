import type { WorkflowStep, PatternType, StepProgress } from "../api";

interface Props {
  steps: WorkflowStep[];
  onChange: (steps: WorkflowStep[]) => void;
  stepProgress: Map<string, StepProgress>;
  isRunning: boolean;
}

export default function FlowChart({ steps, onChange, stepProgress, isRunning }: Props) {
  const moveStep = (idx: number, dir: -1 | 1) => {
    const next = [...steps];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    onChange(next);
  };

  const removeStep = (idx: number) => {
    onChange(steps.filter((_, i) => i !== idx));
  };

  const updateStep = (idx: number, updated: WorkflowStep) => {
    onChange(steps.map((s, i) => (i === idx ? updated : s)));
  };

  if (steps.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-text-muted">
        <div className="w-48 h-48 rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-3">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-muted">
            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
          </svg>
          <p className="text-xs">Drop skills from the palette</p>
          <p className="text-[10px]">or select a template</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {steps.map((step, idx) => (
        <div key={step.id}>
          {idx > 0 && <Connector />}
          <StepCard
            step={step}
            index={idx}
            total={steps.length}
            progress={stepProgress.get(step.id)}
            isRunning={isRunning}
            onMove={(dir) => moveStep(idx, dir)}
            onRemove={() => removeStep(idx)}
            onUpdate={(s) => updateStep(idx, s)}
          />
        </div>
      ))}
    </div>
  );
}

// ─── Connector Line ─────────────────────────

function Connector() {
  return (
    <div className="flex justify-center py-0.5">
      <div className="w-0.5 h-6 bg-border rounded-full" />
    </div>
  );
}

// ─── Step Card ──────────────────────────────

interface StepCardProps {
  step: WorkflowStep;
  index: number;
  total: number;
  progress?: StepProgress;
  isRunning: boolean;
  onMove: (dir: -1 | 1) => void;
  onRemove: () => void;
  onUpdate: (step: WorkflowStep) => void;
}

function StepCard({ step, index, total, progress, isRunning, onMove, onRemove, onUpdate }: StepCardProps) {
  const borderColor = {
    skill: "border-l-sky-400",
    agent: "border-l-emerald-400",
    pattern: "border-l-purple-400",
  }[step.type];

  const statusColor = progress
    ? {
        pending: "bg-zinc-400",
        running: "bg-amber-400 status-pulse",
        completed: "bg-emerald-400",
        failed: "bg-red-400",
        skipped: "bg-zinc-300",
      }[progress.status]
    : "bg-zinc-300";

  const label = getStepLabel(step);

  return (
    <div
      className={`relative bg-surface-1 border border-border-subtle ${borderColor} border-l-[3px] rounded-lg p-3 group hover:border-border transition-colors max-w-lg mx-auto`}
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full shrink-0 ${statusColor}`} />
        <TypeBadge type={step.type} pattern={step.type === "pattern" ? step.pattern : undefined} />
        <span className="text-xs font-medium truncate flex-1">{label}</span>
        <span className="text-[10px] text-text-muted">
          {index + 1}/{total}
        </span>
      </div>

      {/* Progress info */}
      {progress && progress.status === "running" && progress.activeAgents && (
        <div className="mt-2 space-y-1">
          {progress.activeAgents.map((a, i) => (
            <div key={i} className="flex items-center gap-2 text-[10px] text-text-secondary pl-4">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 status-pulse" />
              <span className="font-medium">{a.name}</span>
              {a.tokens && <span className="text-text-muted">{a.tokens}</span>}
              {a.activity && <span className="text-text-muted truncate">{a.activity}</span>}
            </div>
          ))}
        </div>
      )}

      {/* Usage */}
      {progress?.usage && (
        <div className="mt-2 flex items-center gap-3 text-[10px] text-text-muted pl-4">
          <span>${progress.usage.totalCostUsd.toFixed(4)}</span>
          <span>{Math.round(progress.usage.durationMs / 1000)}s</span>
          <span>{progress.usage.model}</span>
        </div>
      )}

      {/* Output preview */}
      {progress?.output && (
        <div className="mt-2 bg-surface-2 rounded p-2 max-h-20 overflow-auto">
          <pre className="text-[10px] text-text-secondary font-mono whitespace-pre-wrap">
            {progress.output.slice(0, 500)}
          </pre>
        </div>
      )}

      {/* Error */}
      {progress?.error && (
        <div className="mt-2 bg-red-500/10 rounded p-2">
          <pre className="text-[10px] text-red-600 dark:text-red-400 font-mono whitespace-pre-wrap">
            {progress.error}
          </pre>
        </div>
      )}

      {/* Pattern children */}
      {step.type === "pattern" && step.children.length > 0 && (
        <div className="mt-3 pl-3 border-l border-border-subtle">
          <PatternChildren step={step} progress={progress} />
        </div>
      )}

      {/* Gate badge */}
      {step.gate !== "none" && (
        <div className="mt-2 flex items-center gap-1.5">
          <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
            step.gate === "auto" ? "border-sky-500/20 text-sky-600 dark:text-sky-400 bg-sky-500/5" : "border-amber-500/20 text-amber-600 dark:text-amber-400 bg-amber-500/5"
          }`}>
            {step.gate === "auto" ? "Auto Gate" : "Manual Gate"}
          </span>
        </div>
      )}

      {/* Hover controls */}
      {!isRunning && (
        <div className="absolute -right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-0.5">
          <button
            onClick={() => onMove(-1)}
            disabled={index === 0}
            className="w-5 h-5 rounded bg-surface-2 border border-border-subtle flex items-center justify-center text-text-muted hover:text-text-primary disabled:opacity-30 text-[10px]"
          >
            ▲
          </button>
          <button
            onClick={onRemove}
            className="w-5 h-5 rounded bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 hover:bg-red-500/20 text-[10px]"
          >
            ×
          </button>
          <button
            onClick={() => onMove(1)}
            disabled={index === total - 1}
            className="w-5 h-5 rounded bg-surface-2 border border-border-subtle flex items-center justify-center text-text-muted hover:text-text-primary disabled:opacity-30 text-[10px]"
          >
            ▼
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Pattern Children ───────────────────────

function PatternChildren({ step, progress }: { step: WorkflowStep & { type: "pattern" }; progress?: StepProgress }) {
  if (step.pattern === "parallel" || step.pattern === "voting") {
    return (
      <div className="flex gap-2 flex-wrap">
        {step.children.map((child) => (
          <div key={child.id} className="bg-surface-2 rounded px-2 py-1.5">
            <TypeBadge type={child.type} pattern={child.type === "pattern" ? child.pattern : undefined} />
            <span className="text-[10px] ml-1.5">{getStepLabel(child)}</span>
          </div>
        ))}
      </div>
    );
  }

  if (step.pattern === "gen-judge" || step.pattern === "ralph") {
    const maxIter = step.config?.maxIterations || 5;
    const currentIter = progress?.iteration || 0;
    return (
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-[10px]">
          <span className="text-text-muted">Iteration</span>
          <span className="font-mono font-medium">{currentIter}/{maxIter}</span>
          <div className="flex-1 h-1 bg-surface-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all"
              style={{ width: `${(currentIter / maxIter) * 100}%` }}
            />
          </div>
        </div>
        {step.children.map((child) => (
          <div key={child.id} className="flex items-center gap-2 text-[10px] text-text-secondary">
            <TypeBadge type={child.type} pattern={child.type === "pattern" ? child.pattern : undefined} />
            <span>{getStepLabel(child)}</span>
          </div>
        ))}
      </div>
    );
  }

  // Chain, router, orchestrator — vertical list
  return (
    <div className="space-y-1">
      {step.children.map((child, i) => (
        <div key={child.id} className="flex items-center gap-2 text-[10px] text-text-secondary">
          <span className="text-text-muted w-3 text-right">{i + 1}.</span>
          <TypeBadge type={child.type} pattern={child.type === "pattern" ? child.pattern : undefined} />
          <span>{getStepLabel(child)}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Helpers ────────────────────────────────

function TypeBadge({ type, pattern }: { type: string; pattern?: PatternType }) {
  const cls = {
    skill: "badge-skill",
    agent: "badge-agent",
    pattern: "badge-pattern",
  }[type] || "badge-skill";

  const text = pattern || type;

  return (
    <span className={`inline-block text-[9px] px-1.5 py-0.5 rounded border font-medium uppercase tracking-wider ${cls}`}>
      {text}
    </span>
  );
}

function getStepLabel(step: WorkflowStep): string {
  switch (step.type) {
    case "skill":
      return step.skillName;
    case "agent":
      return step.agent.name;
    case "pattern":
      return step.prompt?.slice(0, 40) || step.pattern;
  }
}
