import { SavedGroup } from './types';

const STORAGE_KEY = 'random-seat-groups';

export function loadGroups(): SavedGroup[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SavedGroup[];
  } catch {
    return [];
  }
}

export function saveGroups(groups: SavedGroup[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
}

export function addGroup(name: string, members: string[]): SavedGroup[] {
  const groups = loadGroups();
  const newGroup: SavedGroup = {
    id: crypto.randomUUID(),
    name,
    members,
    createdAt: Date.now(),
  };
  groups.push(newGroup);
  saveGroups(groups);
  return groups;
}

export function deleteGroup(id: string): SavedGroup[] {
  const groups = loadGroups().filter((g) => g.id !== id);
  saveGroups(groups);
  return groups;
}
