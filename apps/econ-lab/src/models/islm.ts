import { CurvePoint, ModelOutput, SummaryItem } from '../types';

// IS-LM Model
// IS curve (downward sloping): r = (a + G - c*Y) / b
//   r↑ → I↓ → Y↓ (investment falls, output falls)
// LM curve (upward sloping): r = (k*Y - Ms) / h
//   Y↑ → Md↑ → r↑ (money demand rises, interest rate rises)
// Equilibrium where IS = LM

const DEFAULT_GOV = 50; // Government spending
const DEFAULT_MS = 50;  // Money supply

// IS parameters
const a = 100;  // autonomous spending
const c = 0.6;  // marginal propensity to consume
const b = 50;   // investment sensitivity to interest rate

// LM parameters
const k = 0.5;  // money demand sensitivity to income
const h = 40;   // money demand sensitivity to interest rate

function isRate(y: number, gov: number): number {
  return (a + gov - c * y) / b;
}

function lmRate(y: number, ms: number): number {
  return (k * y - ms) / h;
}

function solveEquilibrium(gov: number, ms: number): { y: number; r: number } {
  // IS = LM: (a + G - c*Y) / b = (k*Y - Ms) / h
  // h*(a + G - c*Y) = b*(k*Y - Ms)
  // h*a + h*G - h*c*Y = b*k*Y - b*Ms
  // h*a + h*G + b*Ms = (b*k + h*c)*Y
  const numerator = h * a + h * gov + b * ms;
  const denominator = b * k + h * c;
  const y = numerator / denominator;
  const r = isRate(y, gov);
  return { y: Math.round(y * 10) / 10, r: Math.round(r * 100) / 100 };
}

export function computeISLM(vars: Record<string, number>): ModelOutput {
  const gov = vars['govSpending'] ?? DEFAULT_GOV;
  const ms = vars['moneySupply'] ?? DEFAULT_MS;

  const defaultEq = solveEquilibrium(DEFAULT_GOV, DEFAULT_MS);
  const currentEq = solveEquilibrium(gov, ms);

  // Generate IS curve points (Y on x-axis, r on y-axis)
  const isPoints: CurvePoint[] = [];
  for (let y = 50; y <= 350; y += 5) {
    const r = isRate(y, gov);
    if (r >= -2 && r <= 15) {
      isPoints.push({ x: y, y: r });
    }
  }

  // Generate LM curve points
  const lmPoints: CurvePoint[] = [];
  for (let y = 50; y <= 350; y += 5) {
    const r = lmRate(y, ms);
    if (r >= -2 && r <= 15) {
      lmPoints.push({ x: y, y: r });
    }
  }

  // Default IS/LM for comparison when shifted
  const isDefaultPoints: CurvePoint[] = [];
  const lmDefaultPoints: CurvePoint[] = [];
  if (gov !== DEFAULT_GOV) {
    for (let y = 50; y <= 350; y += 5) {
      const r = isRate(y, DEFAULT_GOV);
      if (r >= -2 && r <= 15) isDefaultPoints.push({ x: y, y: r });
    }
  }
  if (ms !== DEFAULT_MS) {
    for (let y = 50; y <= 350; y += 5) {
      const r = lmRate(y, DEFAULT_MS);
      if (r >= -2 && r <= 15) lmDefaultPoints.push({ x: y, y: r });
    }
  }

  const yChange = defaultEq.y > 0
    ? Math.round(((currentEq.y - defaultEq.y) / defaultEq.y) * 100)
    : 0;
  const rChange = defaultEq.r > 0
    ? Math.round(((currentEq.r - defaultEq.r) / defaultEq.r) * 100)
    : 0;

  const summary: SummaryItem[] = [
    {
      label: '균형 국민소득 (Y)',
      valueBefore: `${Math.round(defaultEq.y)}`,
      valueAfter: `${Math.round(currentEq.y)}`,
      changePercent: yChange,
      direction: yChange > 0 ? 'up' : yChange < 0 ? 'down' : 'neutral',
    },
    {
      label: '균형 이자율 (r)',
      valueBefore: `${defaultEq.r.toFixed(1)}%`,
      valueAfter: `${currentEq.r.toFixed(1)}%`,
      changePercent: rChange,
      direction: rChange > 0 ? 'up' : rChange < 0 ? 'down' : 'neutral',
    },
  ];

  const curves = [
    { id: 'is', label: 'IS', color: '#ba1a1a', points: isPoints },
    { id: 'lm', label: 'LM', color: '#1a6b50', points: lmPoints },
  ];

  if (isDefaultPoints.length > 0) {
    curves.push({ id: 'is-default', label: 'IS (기준)', color: '#c5c6cc', points: isDefaultPoints });
  }
  if (lmDefaultPoints.length > 0) {
    curves.push({ id: 'lm-default', label: 'LM (기준)', color: '#c5c6cc', points: lmDefaultPoints });
  }

  return {
    curves,
    equilibrium: {
      price: currentEq.r,
      quantity: currentEq.y,
      label: `Y=${Math.round(currentEq.y)}, r=${currentEq.r.toFixed(1)}%`,
    },
    summary,
  };
}
