import { useState } from "react";
import type { SkillMeta, AgentMeta, PatternType } from "../api";

interface Props {
  skills: SkillMeta[];
  agents: AgentMeta[];
  onAddSkill: (s: SkillMeta) => void;
  onAddAgent: (a: AgentMeta) => void;
  onAddPattern: (p: PatternType) => void;
}

type Tab = "skills" | "agents" | "patterns";

const PATTERNS: { type: PatternType; label: string; desc: string }[] = [
  { type: "chain", label: "Chain", desc: "Sequential steps with gates" },
  { type: "parallel", label: "Parallel", desc: "Concurrent sub-agents" },
  { type: "voting", label: "Voting", desc: "N forks, consensus" },
  { type: "router", label: "Router", desc: "Classify then dispatch" },
  { type: "gen-judge", label: "Gen-Judge", desc: "Generate + evaluate loop" },
  { type: "ralph", label: "Ralph", desc: "Repeat until TASK_COMPLETE" },
  { type: "orchestrator", label: "Orchestrator", desc: "Dynamic decomposition" },
  { type: "autonomous", label: "Autonomous", desc: "Self-directed agent" },
];

export default function SkillPalette({ skills, agents, onAddSkill, onAddAgent, onAddPattern }: Props) {
  const [tab, setTab] = useState<Tab>("skills");
  const [query, setQuery] = useState("");

  const filteredSkills = skills.filter(
    (s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.description.toLowerCase().includes(query.toLowerCase())
  );

  const filteredAgents = agents.filter(
    (a) =>
      a.name.toLowerCase().includes(query.toLowerCase()) ||
      a.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex flex-col h-[calc(100%-2rem)]">
      {/* Tabs */}
      <div className="flex border-b border-border-subtle px-2">
        {(["skills", "agents", "patterns"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setQuery(""); }}
            className={`flex-1 text-[10px] py-2 font-medium uppercase tracking-wider transition-colors border-b-2 ${
              tab === t
                ? "text-accent border-accent"
                : "text-text-muted border-transparent hover:text-text-secondary"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Search */}
      {tab !== "patterns" && (
        <div className="px-3 py-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${tab}...`}
            className="w-full px-2 py-1 text-xs bg-surface-2 border border-border-subtle rounded focus:outline-none focus:border-accent"
          />
        </div>
      )}

      {/* List */}
      <div className="flex-1 overflow-auto px-2 pb-2">
        {tab === "skills" &&
          filteredSkills.map((s) => (
            <button
              key={s.path}
              onClick={() => onAddSkill(s)}
              className="w-full text-left p-2 rounded-md hover:bg-surface-2 transition-colors group mb-0.5"
            >
              <div className="flex items-center gap-1.5">
                <span className="badge-skill text-[9px] px-1 py-0.5 rounded border font-medium">
                  SKILL
                </span>
                <span className="text-xs font-medium group-hover:text-accent transition-colors truncate">
                  {s.name}
                </span>
              </div>
              <p className="text-[10px] text-text-muted mt-0.5 line-clamp-2 pl-1">
                {s.description}
              </p>
              {s.pluginName && (
                <span className="text-[9px] text-text-muted font-mono pl-1">
                  {s.pluginName}
                </span>
              )}
            </button>
          ))}

        {tab === "agents" &&
          filteredAgents.map((a) => (
            <button
              key={a.name + a.source}
              onClick={() => onAddAgent(a)}
              className="w-full text-left p-2 rounded-md hover:bg-surface-2 transition-colors group mb-0.5"
            >
              <div className="flex items-center gap-1.5">
                <span className="badge-agent text-[9px] px-1 py-0.5 rounded border font-medium">
                  AGENT
                </span>
                <span className="text-xs font-medium group-hover:text-accent transition-colors truncate">
                  {a.name}
                </span>
                {a.model && (
                  <span className="text-[9px] text-text-muted ml-auto">{a.model}</span>
                )}
              </div>
              <p className="text-[10px] text-text-muted mt-0.5 line-clamp-2 pl-1">
                {a.description}
              </p>
            </button>
          ))}

        {tab === "patterns" &&
          PATTERNS.map((p) => (
            <button
              key={p.type}
              onClick={() => onAddPattern(p.type)}
              className="w-full text-left p-2.5 rounded-md hover:bg-surface-2 transition-colors group mb-0.5"
            >
              <div className="flex items-center gap-1.5">
                <span className="badge-pattern text-[9px] px-1 py-0.5 rounded border font-medium">
                  {p.type.toUpperCase()}
                </span>
                <span className="text-xs font-medium group-hover:text-accent transition-colors">
                  {p.label}
                </span>
              </div>
              <p className="text-[10px] text-text-muted mt-0.5 pl-1">{p.desc}</p>
            </button>
          ))}
      </div>
    </div>
  );
}
