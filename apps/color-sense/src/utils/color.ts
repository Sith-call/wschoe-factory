/**
 * Color generation algorithm for the Color Sense Test.
 * Uses HSL color space for intuitive hue manipulation.
 */

export function randomHue(): number {
  return Math.random() * 360;
}

export function randomInRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

/**
 * Generate base color with constrained saturation/lightness.
 */
export function generateBaseHSL(): { h: number; s: number; l: number } {
  return {
    h: randomHue(),
    s: randomInRange(60, 80),
    l: randomInRange(45, 65),
  };
}

/**
 * Calculate the hue difference for a given level.
 * Higher levels = smaller difference = harder.
 * diff = max(3, 40 - level * 2)
 */
export function getDiffForLevel(level: number): number {
  return Math.max(3, 40 - level * 2);
}

/**
 * Generate the different tile color by shifting hue.
 */
export function generateDiffHSL(
  base: { h: number; s: number; l: number },
  level: number
): { h: number; s: number; l: number } {
  const diff = getDiffForLevel(level);
  const direction = Math.random() > 0.5 ? 1 : -1;
  const newH = (base.h + diff * direction + 360) % 360;
  return { h: newH, s: base.s, l: base.l };
}

/**
 * Convert HSL to hex string.
 */
export function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

/**
 * Generate round colors: base hex + diff hex + diff index.
 */
export function generateRoundColors(
  level: number,
  tileCount: number
): {
  baseColor: string;
  diffColor: string;
  diffIndex: number;
  colorDiff: number;
} {
  const base = generateBaseHSL();
  const diff = generateDiffHSL(base, level);
  const diffIndex = Math.floor(Math.random() * tileCount);

  return {
    baseColor: hslToHex(base.h, base.s, base.l),
    diffColor: hslToHex(diff.h, diff.s, diff.l),
    diffIndex,
    colorDiff: getDiffForLevel(level),
  };
}
