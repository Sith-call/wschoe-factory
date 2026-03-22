import { CurvePoint, ModelOutput, SummaryItem } from '../types';

// Liquidity Trap Model (IS-LM Extension)
// When interest rate approaches 0%, LM becomes horizontal
// Monetary policy: increasing money supply cannot push r below 0% -> GDP unchanged
// Fiscal policy: government spending shifts IS right -> GDP increases (only escape)

// IS parameters (same as IS-LM)
const a = 100;
const c = 0.6;
const b = 50;

// LM parameters
const k = 0.5;
const h = 40;

const DEFAULT_INTEREST_RATE = 2; // current interest rate (low)
const DEFAULT_MONEY_CHANGE = 0;
const DEFAULT_GOV_CHANGE = 0;
const ZERO_LOWER_BOUND = 0.0; // ZLB

function isRate(y: number, gov: number): number {
  const baseGov = 50;
  return (a + baseGov + gov - c * y) / b;
}

function lmRate(y: number, baseRate: number, moneyChange: number): number {
  // LM with zero lower bound
  // More money supply pushes LM down, but can't go below 0
  const normalRate = baseRate + (k * y - 100) / h - moneyChange * 0.03;
  return Math.max(ZERO_LOWER_BOUND, normalRate);
}

function solveEquilibrium(
  baseRate: number,
  moneyChange: number,
  govChange: number
): { y: number; r: number; isTrapped: boolean } {
  // Numerical solver
  let yLow = 50, yHigh = 400;
  for (let i = 0; i < 50; i++) {
    const yMid = (yLow + yHigh) / 2;
    const rIS = isRate(yMid, govChange);
    const rLM = lmRate(yMid, baseRate, moneyChange);
    if (rIS > rLM) {
      yLow = yMid;
    } else {
      yHigh = yMid;
    }
  }
  const y = Math.round((yLow + yHigh) / 2 * 10) / 10;
  const r = Math.round(Math.max(ZERO_LOWER_BOUND, isRate(y, govChange)) * 100) / 100;
  const isTrapped = r <= 0.3 && moneyChange > 20;
  return { y, r, isTrapped };
}

export function computeLiquidityTrap(vars: Record<string, number>): ModelOutput {
  const baseRate = vars['interestRate'] ?? DEFAULT_INTEREST_RATE;
  const moneyChange = vars['moneyChange'] ?? DEFAULT_MONEY_CHANGE;
  const govChange = vars['govChange'] ?? DEFAULT_GOV_CHANGE;

  const defaultEq = solveEquilibrium(DEFAULT_INTEREST_RATE, DEFAULT_MONEY_CHANGE, DEFAULT_GOV_CHANGE);
  const currentEq = solveEquilibrium(baseRate, moneyChange, govChange);

  // Generate IS curve
  const isPoints: CurvePoint[] = [];
  for (let y = 50; y <= 400; y += 5) {
    const r = isRate(y, govChange);
    if (r >= -1 && r <= 12) {
      isPoints.push({ x: y, y: r });
    }
  }

  // Generate LM curve (with ZLB — becomes horizontal at 0%)
  const lmPoints: CurvePoint[] = [];
  for (let y = 50; y <= 400; y += 3) {
    const r = lmRate(y, baseRate, moneyChange);
    if (r >= -0.5 && r <= 12) {
      lmPoints.push({ x: y, y: r });
    }
  }

  // Zero Lower Bound line
  const zlbPoints: CurvePoint[] = [
    { x: 50, y: ZERO_LOWER_BOUND },
    { x: 400, y: ZERO_LOWER_BOUND },
  ];

  // Default IS for comparison
  const isDefaultPoints: CurvePoint[] = [];
  if (govChange !== DEFAULT_GOV_CHANGE) {
    for (let y = 50; y <= 400; y += 5) {
      const r = isRate(y, DEFAULT_GOV_CHANGE);
      if (r >= -1 && r <= 12) {
        isDefaultPoints.push({ x: y, y: r });
      }
    }
  }

  // Default LM for comparison
  const lmDefaultPoints: CurvePoint[] = [];
  if (moneyChange !== DEFAULT_MONEY_CHANGE || baseRate !== DEFAULT_INTEREST_RATE) {
    for (let y = 50; y <= 400; y += 3) {
      const r = lmRate(y, DEFAULT_INTEREST_RATE, DEFAULT_MONEY_CHANGE);
      if (r >= -0.5 && r <= 12) {
        lmDefaultPoints.push({ x: y, y: r });
      }
    }
  }

  const yChange = defaultEq.y > 0
    ? Math.round(((currentEq.y - defaultEq.y) / defaultEq.y) * 100)
    : 0;
  const rChange = Math.round((currentEq.r - defaultEq.r) * 100) / 100;

  const isTrapped = currentEq.r <= 0.5 && moneyChange > 20;
  const monetaryEffective = !isTrapped || currentEq.r > 0.5;

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
      changePercent: Math.round(rChange * 10),
      direction: rChange > 0 ? 'up' : rChange < 0 ? 'down' : 'neutral',
    },
    {
      label: '통화정책 효과',
      valueBefore: '',
      valueAfter: isTrapped ? '무력화 (유동성 함정)' : '유효',
      changePercent: 0,
      direction: isTrapped ? 'down' : 'neutral',
    },
  ];

  const curves = [
    { id: 'is', label: 'IS', color: '#ba1a1a', points: isPoints },
    { id: 'lm', label: 'LM', color: '#1a6b50', points: lmPoints },
    { id: 'zlb', label: 'ZLB (0%)', color: '#e74c3c', points: zlbPoints },
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
      label: isTrapped
        ? `Y=${Math.round(currentEq.y)}, r=${currentEq.r.toFixed(1)}% (유동성 함정!)`
        : `Y=${Math.round(currentEq.y)}, r=${currentEq.r.toFixed(1)}%`,
    },
    summary,
  };
}
