import { useRef, useEffect } from "react";
import type { StepProgress } from "../api";

interface Props {
  prompt: string;
  onPromptChange: (v: string) => void;
  stepProgress: Map<string, StepProgress>;
  outputLog: string[];
  isRunning: boolean;
  onRun: () => void;
  onStop: () => void;
}

export default function MonitorPanel({
  prompt,
  onPromptChange,
  stepProgress,
  outputLog,
  isRunning,
  onRun,
  onStop,
}: Props) {
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [outputLog]);

  const allProgress = Array.from(stepProgress.values());
  const completed = allProgress.filter((p) => p.status === "completed").length;
  const running = allProgress.filter((p) => p.status === "running").length;
  const failed = allProgress.filter((p) => p.status === "failed").length;
  const totalCost = allProgress.reduce((sum, p) => sum + (p.usage?.totalCostUsd || 0), 0);
  const totalDuration = allProgress.reduce((sum, p) => sum + (p.usage?.durationMs || 0), 0);

  return (
    <div className="w-80 border-l border-border bg-surface-1 flex flex-col shrink-0">
      {/* Prompt */}
      <div className="p-3 border-b border-border-subtle">
        <label className="text-[10px] font-semibold uppercase tracking-wider text-text-muted block mb-1.5">
          Initial Prompt
        </label>
        <textarea
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder="Describe the task..."
          rows={4}
          className="w-full px-2.5 py-2 text-xs bg-surface-2 border border-border-subtle rounded-md resize-none focus:outline-none focus:border-accent font-mono"
        />
        <div className="flex gap-2 mt-2">
          {!isRunning ? (
            <button
              onClick={onRun}
              disabled={!prompt.trim()}
              className="flex-1 text-xs py-2 bg-accent text-white rounded-md hover:bg-accent-hover transition-colors disabled:opacity-40 font-medium"
            >
              Run Workflow
            </button>
          ) : (
            <button
              onClick={onStop}
              className="flex-1 text-xs py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors font-medium"
            >
              Stop
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      {allProgress.length > 0 && (
        <div className="grid grid-cols-2 gap-2 p-3 border-b border-border-subtle">
          <Stat label="Completed" value={`${completed}/${allProgress.length}`} color="text-emerald-500" />
          <Stat label="Running" value={String(running)} color="text-amber-500" />
          <Stat label="Cost" value={`$${totalCost.toFixed(4)}`} color="text-text-secondary" />
          <Stat label="Time" value={formatDuration(totalDuration)} color="text-text-secondary" />
          {failed > 0 && <Stat label="Failed" value={String(failed)} color="text-red-500" />}
        </div>
      )}

      {/* Output Log */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="px-3 py-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            Output
          </span>
        </div>
        <div
          ref={logRef}
          className="flex-1 overflow-auto px-3 pb-3"
        >
          {outputLog.length === 0 ? (
            <p className="text-[10px] text-text-muted">No output yet</p>
          ) : (
            <pre className="text-[10px] font-mono text-text-secondary whitespace-pre-wrap leading-relaxed">
              {outputLog.join("")}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div>
      <div className="text-[9px] text-text-muted uppercase tracking-wider">{label}</div>
      <div className={`text-sm font-semibold font-mono ${color}`}>{value}</div>
    </div>
  );
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  return `${Math.floor(s / 60)}m ${s % 60}s`;
}
