export type ConceptCategory = '미시경제' | '거시경제' | '국제경제' | '재정/통화정책';

export interface Variable {
  id: string;
  name: string;
  unit: string;
  min: number;
  max: number;
  defaultValue: number;
  step: number;
  description: string;
}

export interface ModelConfig {
  id: string;
  variables: Variable[];
}

export interface RealWorldExample {
  icon: string;
  title: string;
  description: string;
}

export interface Concept {
  id: string;
  title: string;
  titleEn: string;
  category: ConceptCategory;
  icon: string;
  description: string;
  coreExplanation: string;
  keyTerms: KeyTerm[];
  realWorldExamples: RealWorldExample[];
  relatedConceptIds: string[];
  modelConfig: ModelConfig;
}

export interface KeyTerm {
  term: string;
  definition: string;
}

export interface CurvePoint {
  x: number;
  y: number;
}

export interface EquilibriumResult {
  price: number;
  quantity: number;
  label: string;
}

export interface CurveData {
  id: string;
  label: string;
  color: string;
  points: CurvePoint[];
}

export interface ModelOutput {
  curves: CurveData[];
  equilibrium: EquilibriumResult | null;
  summary: SummaryItem[];
}

export interface SummaryItem {
  label: string;
  valueBefore: string;
  valueAfter: string;
  changePercent: number;
  direction: 'up' | 'down' | 'neutral';
}

export interface ProgressData {
  conceptsViewed: string[];
  experimentsCompleted: string[];
  totalLearningSeconds: number;
  lastVisit: string;
  sessionStartTime: number | null;
}

export type TabId = 'home' | 'concepts' | 'lab' | 'progress';
