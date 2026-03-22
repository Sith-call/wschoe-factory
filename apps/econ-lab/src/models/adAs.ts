import { CurvePoint, ModelOutput, SummaryItem } from '../types';

// AD-AS Model (Aggregate Demand - Aggregate Supply)
// AD curve: downward sloping (P↑ → real spending↓)
//   Y_AD = A + G + Ms/P  (simplified)
// SRAS curve: upward sloping (P↑ → short-run supply↑)
//   Y_SRAS = Y* + α(P - P_e) - oilShock
// LRAS: vertical at potential GDP (Y*)

const Y_STAR = 200; // Potential GDP (LRAS)
const DEFAULT_G = 50;
const DEFAULT_MS = 50;
const DEFAULT_OIL = 0; // oil price shock (0 = normal)

// AD: P = (A + G + Ms) / (β * Y)  → Y = (A + G + Ms) / (β * P)
const A = 100; // autonomous spending
const BETA = 1.5;

// SRAS: P = P_e + (1/α)(Y - Y* + oilEffect)
const P_E = 3; // expected price level
const ALPHA = 40; // supply responsiveness

function adAtPrice(p: number, g: number, ms: number): number {
  if (p <= 0) return 500;
  return (A + g * 2 + ms * 2) / (BETA * p);
}

function srasAtY(y: number, oil: number): number {
  return P_E + (y - Y_STAR + oil * 15) / ALPHA;
}

function solveEquilibrium(g: number, ms: number, oil: number): { price: number; gdp: number } {
  // Numerical solver: find Y where AD(P) = Y and SRAS(Y) = P
  // i.e., AD price at Y equals SRAS price at Y
  let yLow = 50, yHigh = 400;
  for (let i = 0; i < 50; i++) {
    const yMid = (yLow + yHigh) / 2;
    const pSras = srasAtY(yMid, oil);
    const yAd = adAtPrice(pSras, g, ms);
    if (yAd > yMid) {
      yLow = yMid;
    } else {
      yHigh = yMid;
    }
  }
  const gdp = Math.round((yLow + yHigh) / 2 * 10) / 10;
  const price = Math.round(srasAtY(gdp, oil) * 100) / 100;
  return { price, gdp };
}

export function computeAdAs(vars: Record<string, number>): ModelOutput {
  const g = vars['govSpending'] ?? DEFAULT_G;
  const ms = vars['moneySupply'] ?? DEFAULT_MS;
  const oil = vars['oilShock'] ?? DEFAULT_OIL;

  const defaultEq = solveEquilibrium(DEFAULT_G, DEFAULT_MS, DEFAULT_OIL);
  const currentEq = solveEquilibrium(g, ms, oil);

  // Generate AD curve points (Y on x-axis, P on y-axis)
  const adPoints: CurvePoint[] = [];
  for (let p = 0.5; p <= 8; p += 0.2) {
    const y = adAtPrice(p, g, ms);
    if (y >= 50 && y <= 400) {
      adPoints.push({ x: y, y: p });
    }
  }

  // Generate SRAS curve points
  const srasPoints: CurvePoint[] = [];
  for (let y = 50; y <= 400; y += 5) {
    const p = srasAtY(y, oil);
    if (p >= 0 && p <= 8) {
      srasPoints.push({ x: y, y: p });
    }
  }

  // LRAS (vertical line at Y*)
  const lrasPoints: CurvePoint[] = [
    { x: Y_STAR, y: 0 },
    { x: Y_STAR, y: 8 },
  ];

  // Default curves for comparison
  const adDefaultPoints: CurvePoint[] = [];
  const srasDefaultPoints: CurvePoint[] = [];
  if (g !== DEFAULT_G || ms !== DEFAULT_MS) {
    for (let p = 0.5; p <= 8; p += 0.2) {
      const y = adAtPrice(p, DEFAULT_G, DEFAULT_MS);
      if (y >= 50 && y <= 400) {
        adDefaultPoints.push({ x: y, y: p });
      }
    }
  }
  if (oil !== DEFAULT_OIL) {
    for (let y = 50; y <= 400; y += 5) {
      const p = srasAtY(y, DEFAULT_OIL);
      if (p >= 0 && p <= 8) {
        srasDefaultPoints.push({ x: y, y: p });
      }
    }
  }

  const gdpChange = defaultEq.gdp > 0
    ? Math.round(((currentEq.gdp - defaultEq.gdp) / defaultEq.gdp) * 100)
    : 0;
  const priceChange = defaultEq.price > 0
    ? Math.round(((currentEq.price - defaultEq.price) / defaultEq.price) * 100)
    : 0;

  const summary: SummaryItem[] = [
    {
      label: '실질 GDP',
      valueBefore: `${Math.round(defaultEq.gdp)}`,
      valueAfter: `${Math.round(currentEq.gdp)}`,
      changePercent: gdpChange,
      direction: gdpChange > 0 ? 'up' : gdpChange < 0 ? 'down' : 'neutral',
    },
    {
      label: '물가 수준 (P)',
      valueBefore: `${defaultEq.price.toFixed(1)}`,
      valueAfter: `${currentEq.price.toFixed(1)}`,
      changePercent: priceChange,
      direction: priceChange > 0 ? 'up' : priceChange < 0 ? 'down' : 'neutral',
    },
  ];

  const curves = [
    { id: 'ad', label: 'AD', color: '#ba1a1a', points: adPoints },
    { id: 'sras', label: 'SRAS', color: '#1a6b50', points: srasPoints },
    { id: 'lras', label: 'LRAS', color: '#6b5b1a', points: lrasPoints },
  ];

  if (adDefaultPoints.length > 0) {
    curves.push({ id: 'ad-default', label: 'AD (기준)', color: '#c5c6cc', points: adDefaultPoints });
  }
  if (srasDefaultPoints.length > 0) {
    curves.push({ id: 'sras-default', label: 'SRAS (기준)', color: '#c5c6cc', points: srasDefaultPoints });
  }

  return {
    curves,
    equilibrium: {
      price: currentEq.price,
      quantity: currentEq.gdp,
      label: `GDP=${Math.round(currentEq.gdp)}, P=${currentEq.price.toFixed(1)}`,
    },
    summary,
  };
}
