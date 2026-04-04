import { TEMPLATES, type WorkflowTemplate } from "../templates";
import type { WorkflowStep } from "../api";

interface Props {
  onSelect: (template: WorkflowTemplate) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  build: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  review: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  ops: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
};

export default function TemplateGallery({ onSelect }: Props) {
  return (
    <div className="p-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
        Workflow Templates
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {TEMPLATES.map((t) => (
          <button
            key={t.id}
            onClick={() => onSelect(t)}
            className="text-left bg-surface-1 border border-border-subtle rounded-lg p-3 hover:border-accent/40 transition-all group"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium uppercase ${CATEGORY_COLORS[t.category] || ""}`}>
                {t.category}
              </span>
              <span className="text-xs font-medium group-hover:text-accent transition-colors">
                {t.name}
              </span>
            </div>
            <p className="text-[10px] text-text-muted line-clamp-2">{t.description}</p>
            <div className="flex items-center gap-1.5 mt-2">
              {countStepTypes(t.steps).map(([type, count]) => (
                <span key={type} className="text-[9px] text-text-muted">
                  {count} {type}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function countStepTypes(steps: WorkflowStep[]): [string, number][] {
  const counts: Record<string, number> = {};
  function walk(s: WorkflowStep) {
    counts[s.type] = (counts[s.type] || 0) + 1;
    if (s.type === "pattern") {
      for (const c of s.children) walk(c);
    }
  }
  for (const s of steps) walk(s);
  return Object.entries(counts);
}
