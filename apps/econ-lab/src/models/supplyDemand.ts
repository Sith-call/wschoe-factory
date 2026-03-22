import { CurvePoint, ModelOutput, SummaryItem } from '../types';

// Supply & Demand Model
// Demand: Qd = a - b*P + income_shift
// Supply: Qs = c + d*P - cost_shift - tax_shift
// Equilibrium: Qd = Qs

const A = 200; // demand intercept
const B = 2;   // demand slope
const C = 20;  // supply intercept
const D = 1.5; // supply slope

interface SDVariables {
  income: number;     // 소득 수준 0-10
  cost: number;       // 생산 비용 0-10
  tax: number;        // 세금 0-20
}

function demandAtPrice(p: number, incomeShift: number): number {
  return A - B * p + incomeShift * 10;
}

function supplyAtPrice(p: number, costShift: number, taxShift: number): number {
  return C + D * p - costShift * 8 - taxShift * 2;
}

function solveEquilibrium(incomeShift: number, costShift: number, taxShift: number): { price: number; quantity: number } {
  // Qd = Qs
  // A - B*P + income*10 = C + D*P - cost*8 - tax*2
  // (A - C + income*10 + cost*8 + tax*2) = (B + D) * P
  const numerator = A - C + incomeShift * 10 + costShift * 8 + taxShift * 2;
  const denominator = B + D;
  const price = Math.max(0, numerator / denominator);
  const quantity = Math.max(0, demandAtPrice(price, incomeShift));
  return { price: Math.round(price * 10) / 10, quantity: Math.round(quantity * 10) / 10 };
}

export function computeSupplyDemand(vars: Record<string, number>): ModelOutput {
  const income = vars['income'] ?? 5;
  const cost = vars['cost'] ?? 3;
  const tax = vars['tax'] ?? 5;

  // Default equilibrium (for comparison)
  const defaultEq = solveEquilibrium(5, 3, 5);
  const currentEq = solveEquilibrium(income, cost, tax);

  // Generate curve points (P on Y-axis, Q on X-axis)
  const demandPoints: CurvePoint[] = [];
  const supplyPoints: CurvePoint[] = [];

  for (let p = 0; p <= 100; p += 2) {
    const qd = demandAtPrice(p, income);
    const qs = supplyAtPrice(p, cost, tax);
    if (qd >= 0 && qd <= 300) {
      demandPoints.push({ x: qd, y: p });
    }
    if (qs >= 0 && qs <= 300) {
      supplyPoints.push({ x: qs, y: p });
    }
  }

  const priceChange = defaultEq.price > 0
    ? Math.round(((currentEq.price - defaultEq.price) / defaultEq.price) * 100)
    : 0;
  const qtyChange = defaultEq.quantity > 0
    ? Math.round(((currentEq.quantity - defaultEq.quantity) / defaultEq.quantity) * 100)
    : 0;

  const summary: SummaryItem[] = [
    {
      label: '균형가격',
      valueBefore: `${Math.round(defaultEq.price * 100)}`,
      valueAfter: `${Math.round(currentEq.price * 100)}`,
      changePercent: priceChange,
      direction: priceChange > 0 ? 'up' : priceChange < 0 ? 'down' : 'neutral',
    },
    {
      label: '균형수량',
      valueBefore: `${Math.round(defaultEq.quantity)}`,
      valueAfter: `${Math.round(currentEq.quantity)}`,
      changePercent: qtyChange,
      direction: qtyChange > 0 ? 'up' : qtyChange < 0 ? 'down' : 'neutral',
    },
  ];

  return {
    curves: [
      { id: 'demand', label: 'D', color: '#ba1a1a', points: demandPoints },
      { id: 'supply', label: 'S', color: '#dae3f7', points: supplyPoints },
    ],
    equilibrium: {
      price: currentEq.price,
      quantity: currentEq.quantity,
      label: '균형점(E)',
    },
    summary,
  };
}
