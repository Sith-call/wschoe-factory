import type { WorkflowStep } from "./api";

export interface WorkflowTemplate {
  id: string;
  name: string;
  category: "build" | "review" | "ops";
  description: string;
  initialPrompt: string;
  steps: WorkflowStep[];
}

let _id = 0;
const sid = () => `tmpl-${++_id}`;

export const TEMPLATES: WorkflowTemplate[] = [
  {
    id: "standard-build",
    name: "Standard Build",
    category: "build",
    description: "Plan → Implement + Review → Test/Lint/Security → Ship",
    initialPrompt: "Build the feature described above with full test coverage.",
    steps: [
      { type: "agent", id: sid(), agent: { name: "architect", description: "Design architecture", source: "preset" }, gate: "none" },
      {
        type: "pattern", id: sid(), pattern: "gen-judge", gate: "none",
        children: [
          { type: "agent", id: sid(), agent: { name: "dev-frontend", description: "Implement", source: "preset" }, gate: "none" },
          { type: "agent", id: sid(), agent: { name: "code-reviewer", description: "Review code", source: "preset" }, gate: "none" },
        ],
        config: { maxIterations: 3 },
      },
      {
        type: "pattern", id: sid(), pattern: "parallel", gate: "none",
        children: [
          { type: "agent", id: sid(), agent: { name: "test-writer", description: "Write tests", source: "preset" }, gate: "none" },
          { type: "agent", id: sid(), agent: { name: "security-sentinel", description: "Security scan", source: "preset" }, gate: "none" },
        ],
      },
      { type: "skill", id: sid(), skillName: "ship", gate: "manual" },
    ],
  },
  {
    id: "quick-build",
    name: "Quick Build",
    category: "build",
    description: "Implement + Review loop → Ship",
    initialPrompt: "Build this quickly with a review pass.",
    steps: [
      {
        type: "pattern", id: sid(), pattern: "gen-judge", gate: "none",
        children: [
          { type: "agent", id: sid(), agent: { name: "dev-frontend", description: "Implement", source: "preset" }, gate: "none" },
          { type: "agent", id: sid(), agent: { name: "code-reviewer", description: "Review", source: "preset" }, gate: "none" },
        ],
        config: { maxIterations: 3 },
      },
      { type: "skill", id: sid(), skillName: "ship", gate: "manual" },
    ],
  },
  {
    id: "tdd-pipeline",
    name: "TDD Pipeline",
    category: "build",
    description: "Tests first → Implement until passing → Review → Ship",
    initialPrompt: "Follow TDD: write tests first, then implement.",
    steps: [
      { type: "agent", id: sid(), agent: { name: "test-writer", description: "Write failing tests", source: "preset" }, gate: "auto", gateConfig: { mode: "auto", autoChecks: { mustContain: ["test"] } } },
      {
        type: "pattern", id: sid(), pattern: "ralph", gate: "none",
        children: [
          { type: "agent", id: sid(), agent: { name: "dev-frontend", description: "Implement until tests pass", source: "preset" }, gate: "none" },
        ],
        config: { maxIterations: 5 },
      },
      { type: "agent", id: sid(), agent: { name: "code-reviewer", description: "Final review", source: "preset" }, gate: "none" },
      { type: "skill", id: sid(), skillName: "ship", gate: "manual" },
    ],
  },
  {
    id: "full-review",
    name: "Full Code Review",
    category: "review",
    description: "Parallel review: code + security + architecture",
    initialPrompt: "Review the current codebase thoroughly.",
    steps: [
      {
        type: "pattern", id: sid(), pattern: "parallel", gate: "none",
        children: [
          { type: "agent", id: sid(), agent: { name: "code-reviewer", description: "Code quality review", source: "preset" }, gate: "none" },
          { type: "agent", id: sid(), agent: { name: "security-sentinel", description: "Security review", source: "preset" }, gate: "none" },
          { type: "agent", id: sid(), agent: { name: "architect", description: "Architecture review", source: "preset" }, gate: "none" },
        ],
      },
      { type: "skill", id: sid(), skillName: "review", gate: "manual" },
    ],
  },
  {
    id: "qa-fix-deploy",
    name: "QA Fix Deploy",
    category: "ops",
    description: "QA → Fix loop → QA again → Ship",
    initialPrompt: "Find and fix all issues, then deploy.",
    steps: [
      { type: "skill", id: sid(), skillName: "qa", gate: "none" },
      {
        type: "pattern", id: sid(), pattern: "ralph", gate: "none",
        children: [
          { type: "agent", id: sid(), agent: { name: "dev-frontend", description: "Fix issues", source: "preset" }, gate: "none" },
        ],
        config: { maxIterations: 5 },
      },
      { type: "skill", id: sid(), skillName: "qa", gate: "auto", gateConfig: { mode: "auto", autoChecks: { mustNotContain: ["FAIL", "ERROR"] } } },
      { type: "skill", id: sid(), skillName: "ship", gate: "manual" },
    ],
  },
  {
    id: "hotfix",
    name: "Hotfix Pipeline",
    category: "ops",
    description: "Investigate → Fix + Review → Ship",
    initialPrompt: "Investigate and fix the issue urgently.",
    steps: [
      { type: "skill", id: sid(), skillName: "investigate", gate: "none" },
      {
        type: "pattern", id: sid(), pattern: "gen-judge", gate: "none",
        children: [
          { type: "agent", id: sid(), agent: { name: "dev-frontend", description: "Apply fix", source: "preset" }, gate: "none" },
          { type: "agent", id: sid(), agent: { name: "code-reviewer", description: "Verify fix", source: "preset" }, gate: "none" },
        ],
        config: { maxIterations: 2 },
      },
      { type: "skill", id: sid(), skillName: "ship", gate: "manual" },
    ],
  },
];
