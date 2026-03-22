import { CurvePoint, ModelOutput, SummaryItem } from '../types';

// GDP Gap Model
// Potential GDP (Y*): vertical line, adjustable
// Actual GDP = Y* + consumption change + investment change
// GDP Gap = Actual GDP - Potential GDP
//   Positive gap: inflationary pressure (overheating)
//   Negative gap: recession (deflationary pressure)

const DEFAULT_POTENTIAL = 150;
const DEFAULT_CONSUMPTION_CHANGE = 0;
const DEFAULT_INVESTMENT_CHANGE = 0;

export function computeGdpGap(vars: Record<string, number>): ModelOutput {
  const potentialGdp = vars['potentialGdp'] ?? DEFAULT_POTENTIAL;
  const consumptionChange = vars['consumptionChange'] ?? DEFAULT_CONSUMPTION_CHANGE;
  const investmentChange = vars['investmentChange'] ?? DEFAULT_INVESTMENT_CHANGE;

  const actualGdp = potentialGdp + consumptionChange + investmentChange;
  const gdpGap = actualGdp - potentialGdp;
  const gapPercent = potentialGdp > 0 ? Math.round((gdpGap / potentialGdp) * 100) : 0;

  // Default values for comparison
  const defaultActual = DEFAULT_POTENTIAL + DEFAULT_CONSUMPTION_CHANGE + DEFAULT_INVESTMENT_CHANGE;
  const defaultGap = defaultActual - DEFAULT_POTENTIAL;

  // Potential GDP vertical line (price level on Y axis, GDP on X axis)
  const potentialLine: CurvePoint[] = [
    { x: potentialGdp, y: 0 },
    { x: potentialGdp, y: 10 },
  ];

  // AD-like curve showing actual GDP position
  // Downward sloping AD curve centered around actual GDP
  const adPoints: CurvePoint[] = [];
  for (let p = 0.5; p <= 10; p += 0.3) {
    const y = actualGdp + (5 - p) * 15;
    if (y > 50 && y < 300) {
      adPoints.push({ x: y, y: p });
    }
  }

  // SRAS curve (upward sloping through equilibrium)
  const srasPoints: CurvePoint[] = [];
  for (let y = 50; y <= 300; y += 5) {
    const p = 2 + (y - potentialGdp) / 40;
    if (p >= 0 && p <= 10) {
      srasPoints.push({ x: y, y: p });
    }
  }

  // Determine gap status
  let gapStatus: string;
  let gapDirection: 'up' | 'down' | 'neutral';
  if (gdpGap > 5) {
    gapStatus = '인플레이션 갭 (과열)';
    gapDirection = 'up';
  } else if (gdpGap < -5) {
    gapStatus = '디플레이션 갭 (침체)';
    gapDirection = 'down';
  } else {
    gapStatus = '균형 (잠재 GDP 근접)';
    gapDirection = 'neutral';
  }

  const summary: SummaryItem[] = [
    {
      label: '실제 GDP',
      valueBefore: `${Math.round(defaultActual)}`,
      valueAfter: `${Math.round(actualGdp)}`,
      changePercent: defaultActual > 0 ? Math.round(((actualGdp - defaultActual) / defaultActual) * 100) : 0,
      direction: actualGdp > defaultActual ? 'up' : actualGdp < defaultActual ? 'down' : 'neutral',
    },
    {
      label: 'GDP 갭',
      valueBefore: `${defaultGap}`,
      valueAfter: `${gdpGap > 0 ? '+' : ''}${gdpGap}`,
      changePercent: gapPercent,
      direction: gapDirection,
    },
    {
      label: '경제 상태',
      valueBefore: '',
      valueAfter: gapStatus,
      changePercent: 0,
      direction: gapDirection,
    },
  ];

  const curves = [
    { id: 'potential', label: '잠재 GDP (Y*)', color: '#6b5b1a', points: potentialLine },
    { id: 'ad', label: 'AD', color: '#ba1a1a', points: adPoints },
    { id: 'sras', label: 'SRAS', color: '#1a6b50', points: srasPoints },
  ];

  // Equilibrium point: where AD meets SRAS (approximately at actual GDP)
  const eqPrice = 2 + (actualGdp - potentialGdp) / 40;

  return {
    curves,
    equilibrium: {
      price: Math.round(eqPrice * 100) / 100,
      quantity: Math.round(actualGdp),
      label: `실제GDP=${Math.round(actualGdp)}, 갭=${gdpGap > 0 ? '+' : ''}${gdpGap} (${gapPercent}%)`,
    },
    summary,
  };
}
