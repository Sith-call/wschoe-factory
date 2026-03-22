import { CurvePoint, ModelOutput, SummaryItem } from '../types';

// Comparative Advantage & Trade
// Two countries with different PPFs
// Country A: can produce maxA_goods1 of Good1, maxA_goods2 of Good2
// Country B: can produce maxB_goods1 of Good1, maxB_goods2 of Good2
// Trade allows both to consume beyond their individual PPFs

const DEFAULT_PROD_A = 5; // Country A productivity
const DEFAULT_PROD_B = 5; // Country B productivity
const DEFAULT_TRADE_RATIO = 50; // Terms of trade

export function computeComparativeAdvantage(vars: Record<string, number>): ModelOutput {
  const prodA = vars['productivityA'] ?? DEFAULT_PROD_A;
  const prodB = vars['productivityB'] ?? DEFAULT_PROD_B;
  const tradeRatio = vars['tradeRatio'] ?? DEFAULT_TRADE_RATIO;

  // Country A: good at Good1 (electronics), Country B: good at Good2 (agriculture)
  const aMax1 = 60 + prodA * 12; // A's max Good1
  const aMax2 = 30 + prodA * 4;  // A's max Good2
  const bMax1 = 30 + prodB * 4;  // B's max Good1
  const bMax2 = 60 + prodB * 12; // B's max Good2

  // PPF curves (linear for simplicity)
  const ppfA: CurvePoint[] = [
    { x: 0, y: aMax2 },
    { x: aMax1, y: 0 },
  ];
  const ppfB: CurvePoint[] = [
    { x: 0, y: bMax2 },
    { x: bMax1, y: 0 },
  ];

  // With trade: combined consumption possibilities
  // Each country specializes in comparative advantage good
  const opCostA1 = aMax2 / aMax1; // opportunity cost of Good1 for A
  const opCostB1 = bMax2 / bMax1; // opportunity cost of Good1 for B

  // A has comparative advantage in Good1 if opCostA1 < opCostB1
  const aAdvantageIn1 = opCostA1 < opCostB1;

  // Trade terms: how many Good2 per Good1
  const tradePrice = (tradeRatio / 100) * (opCostB1 - opCostA1) + opCostA1;

  // After specialization and trade
  const totalG1 = aAdvantageIn1 ? aMax1 : bMax1;
  const totalG2 = aAdvantageIn1 ? bMax2 : aMax2;

  // Trade consumption possibility (beyond individual PPFs)
  const tradeLine: CurvePoint[] = [
    { x: 0, y: totalG2 },
    { x: totalG1, y: 0 },
  ];

  // Autarky point (50/50 production)
  const autarkyA1 = aMax1 * 0.5;
  const autarkyA2 = aMax2 * 0.5;
  const autarkyB1 = bMax1 * 0.5;
  const autarkyB2 = bMax2 * 0.5;
  const totalAutarky1 = autarkyA1 + autarkyB1;
  const totalAutarky2 = autarkyA2 + autarkyB2;

  // Default values
  const defAMax1 = 60 + DEFAULT_PROD_A * 12;
  const defAMax2 = 30 + DEFAULT_PROD_A * 4;
  const defBMax1 = 30 + DEFAULT_PROD_B * 4;
  const defBMax2 = 60 + DEFAULT_PROD_B * 12;
  const defTotal1 = defAMax1 * 0.5 + defBMax1 * 0.5;
  const defTotal2 = defAMax2 * 0.5 + defBMax2 * 0.5;

  const gainG1 = totalG1 - totalAutarky1;
  const gainG2 = totalG2 - totalAutarky2;

  const summary: SummaryItem[] = [
    {
      label: '무역 이득 (재화1)',
      valueBefore: `${Math.round(totalAutarky1)}`,
      valueAfter: `${Math.round(totalG1)}`,
      changePercent: totalAutarky1 > 0 ? Math.round((gainG1 / totalAutarky1) * 100) : 0,
      direction: gainG1 > 0 ? 'up' : gainG1 < 0 ? 'down' : 'neutral',
    },
    {
      label: '무역 이득 (재화2)',
      valueBefore: `${Math.round(totalAutarky2)}`,
      valueAfter: `${Math.round(totalG2)}`,
      changePercent: totalAutarky2 > 0 ? Math.round((gainG2 / totalAutarky2) * 100) : 0,
      direction: gainG2 > 0 ? 'up' : gainG2 < 0 ? 'down' : 'neutral',
    },
  ];

  return {
    curves: [
      { id: 'ppf-a', label: 'A국 PPF', color: '#ba1a1a', points: ppfA },
      { id: 'ppf-b', label: 'B국 PPF', color: '#1a6b50', points: ppfB },
      { id: 'trade-line', label: '무역 후', color: '#d4a24e', points: tradeLine },
    ],
    equilibrium: {
      price: totalAutarky2,
      quantity: totalAutarky1,
      label: `무역 이득: +${Math.round(gainG1 + gainG2)}`,
    },
    summary,
  };
}
