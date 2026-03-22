import { ProgressData } from '../types';

const STORAGE_KEY = 'econ-lab-progress';

const defaultProgress: ProgressData = {
  conceptsViewed: [],
  experimentsCompleted: [],
  totalLearningSeconds: 0,
  lastVisit: new Date().toISOString(),
  sessionStartTime: null,
};

export function loadProgress(): ProgressData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultProgress };
    return JSON.parse(raw) as ProgressData;
  } catch {
    return { ...defaultProgress };
  }
}

export function saveProgress(data: ProgressData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage full or unavailable — silently fail
  }
}

export function markConceptViewed(conceptId: string): void {
  const data = loadProgress();
  if (!data.conceptsViewed.includes(conceptId)) {
    data.conceptsViewed.push(conceptId);
    saveProgress(data);
  }
}

export function markExperimentCompleted(conceptId: string): void {
  const data = loadProgress();
  if (!data.experimentsCompleted.includes(conceptId)) {
    data.experimentsCompleted.push(conceptId);
    saveProgress(data);
  }
}

export function updateLearningTime(seconds: number): void {
  const data = loadProgress();
  data.totalLearningSeconds += seconds;
  data.lastVisit = new Date().toISOString();
  saveProgress(data);
}
