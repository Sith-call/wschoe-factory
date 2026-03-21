/**
 * Determine grid size from level.
 * Level 1-4: 2x2, 5-8: 3x3, 9-12: 4x4, 13-16: 5x5, 17-20: 6x6
 */
export function getGridSize(level: number): number {
  if (level <= 4) return 2;
  if (level <= 8) return 3;
  if (level <= 12) return 4;
  if (level <= 16) return 5;
  return 6;
}

export function getGridClass(size: number): string {
  return `grid-${size}x${size}`;
}

export function getTileCount(size: number): number {
  return size * size;
}
