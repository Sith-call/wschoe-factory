import type { SkinRecord, Product, UserProfile, CustomVariable, Milestone, WeeklyReport, UserSettings } from '../types';

const RECORDS_KEY = 'skin-diary-records';
const PRODUCTS_KEY = 'skin-diary-products';
const ONBOARDED_KEY = 'skin-diary-onboarded';
const PROFILE_KEY = 'skin-diary-profile';
const DEMO_KEY = 'skin-diary-demo';
const CUSTOM_VARIABLES_KEY = 'skin-diary-custom-variables';
const PINNED_VARIABLES_KEY = 'skin-diary-pinned-variables';
const MILESTONES_KEY = 'skin-diary-milestones';
const WEEKLY_REPORTS_KEY = 'skin-diary-weekly-reports';
const MIGRATED_KEY = 'skin-diary-v2-migrated';

// === Records ===

export function getRecords(): Record<string, SkinRecord> {
  try {
    const raw = localStorage.getItem(RECORDS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveRecords(records: Record<string, SkinRecord>): void {
  localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
}

// === Products ===

export function getProducts(): Product[] {
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveProducts(products: Product[]): void {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

// === Profile ===

export function getProfile(): UserProfile | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveProfile(profile: UserProfile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

// === Onboarding ===

export function isOnboarded(): boolean {
  return localStorage.getItem(ONBOARDED_KEY) === 'true';
}

export function setOnboarded(val: boolean): void {
  localStorage.setItem(ONBOARDED_KEY, String(val));
}

// === Demo Mode ===

export function isDemoMode(): boolean {
  return localStorage.getItem(DEMO_KEY) === 'true';
}

export function setDemoMode(val: boolean): void {
  localStorage.setItem(DEMO_KEY, String(val));
}

// === Custom Variables (V2) ===

export function getCustomVariables(): CustomVariable[] {
  try {
    const raw = localStorage.getItem(CUSTOM_VARIABLES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCustomVariables(vars: CustomVariable[]): void {
  localStorage.setItem(CUSTOM_VARIABLES_KEY, JSON.stringify(vars));
}

// === Pinned Variables (V2) ===

export function getPinnedVariables(): string[] {
  try {
    const raw = localStorage.getItem(PINNED_VARIABLES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function savePinnedVariables(vars: string[]): void {
  localStorage.setItem(PINNED_VARIABLES_KEY, JSON.stringify(vars));
}

// === Milestones (V2) ===

export function getMilestones(): Milestone[] {
  try {
    const raw = localStorage.getItem(MILESTONES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveMilestones(milestones: Milestone[]): void {
  localStorage.setItem(MILESTONES_KEY, JSON.stringify(milestones));
}

// === Weekly Reports (V2) ===

export function getWeeklyReports(): WeeklyReport[] {
  try {
    const raw = localStorage.getItem(WEEKLY_REPORTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveWeeklyReports(reports: WeeklyReport[]): void {
  localStorage.setItem(WEEKLY_REPORTS_KEY, JSON.stringify(reports));
}

// === V1 to V2 Migration ===

export function migrateV1ToV2(): void {
  if (localStorage.getItem(MIGRATED_KEY) === 'true') return;

  // Ensure new V2 keys exist
  if (!localStorage.getItem(CUSTOM_VARIABLES_KEY)) {
    saveCustomVariables([]);
  }
  if (!localStorage.getItem(PINNED_VARIABLES_KEY)) {
    savePinnedVariables([]);
  }
  if (!localStorage.getItem(MILESTONES_KEY)) {
    saveMilestones([]);
  }
  if (!localStorage.getItem(WEEKLY_REPORTS_KEY)) {
    saveWeeklyReports([]);
  }

  // V1 records are compatible — MorningLog without troubleAreas is fine (undefined)
  // V1 NightLog.variables as Variable[] is subset of (Variable | string)[]
  // No data transformation needed

  localStorage.setItem(MIGRATED_KEY, 'true');
}

// === Settings Convenience ===

export function getUserSettings(): UserSettings {
  return {
    pinnedVariables: getPinnedVariables(),
    customVariables: getCustomVariables(),
  };
}

// === Clear All ===

export function clearAllData(): void {
  localStorage.removeItem(RECORDS_KEY);
  localStorage.removeItem(PRODUCTS_KEY);
  localStorage.removeItem(ONBOARDED_KEY);
  localStorage.removeItem(PROFILE_KEY);
  localStorage.removeItem(DEMO_KEY);
  localStorage.removeItem(CUSTOM_VARIABLES_KEY);
  localStorage.removeItem(PINNED_VARIABLES_KEY);
  localStorage.removeItem(MILESTONES_KEY);
  localStorage.removeItem(WEEKLY_REPORTS_KEY);
  localStorage.removeItem(MIGRATED_KEY);
}
