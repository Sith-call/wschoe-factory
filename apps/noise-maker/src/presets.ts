import { Preset } from './types';

const STORAGE_KEY = 'noise-maker-presets';
const MAX_PRESETS = 5;

export function loadPresets(): Preset[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Preset[];
  } catch {
    return [];
  }
}

export function savePreset(preset: Preset): Preset[] {
  const presets = loadPresets();

  // Check if name already exists — overwrite
  const existingIndex = presets.findIndex((p) => p.name === preset.name);
  if (existingIndex >= 0) {
    presets[existingIndex] = preset;
  } else {
    if (presets.length >= MAX_PRESETS) {
      presets.shift(); // remove oldest
    }
    presets.push(preset);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
  return presets;
}

export function deletePreset(name: string): Preset[] {
  const presets = loadPresets().filter((p) => p.name !== name);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
  return presets;
}
