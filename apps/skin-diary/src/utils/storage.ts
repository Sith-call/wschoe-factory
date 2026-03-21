import type { SkinRecord, Product, UserProfile } from '../types';

const RECORDS_KEY = 'skin-diary-records';
const PRODUCTS_KEY = 'skin-diary-products';
const ONBOARDED_KEY = 'skin-diary-onboarded';
const PROFILE_KEY = 'skin-diary-profile';
const DEMO_KEY = 'skin-diary-demo';

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

export function isOnboarded(): boolean {
  return localStorage.getItem(ONBOARDED_KEY) === 'true';
}

export function setOnboarded(val: boolean): void {
  localStorage.setItem(ONBOARDED_KEY, String(val));
}

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

export function isDemoMode(): boolean {
  return localStorage.getItem(DEMO_KEY) === 'true';
}

export function setDemoMode(val: boolean): void {
  localStorage.setItem(DEMO_KEY, String(val));
}

export function clearAllData(): void {
  localStorage.removeItem(RECORDS_KEY);
  localStorage.removeItem(PRODUCTS_KEY);
  localStorage.removeItem(ONBOARDED_KEY);
  localStorage.removeItem(PROFILE_KEY);
  localStorage.removeItem(DEMO_KEY);
}
