import { ModelOutput, SummaryItem } from '../types';

// GDP = C + I + G + (X - M)
// Each component is a slider (0-100 units)

const DEFAULT_C = 55;
const DEFAULT_I = 20;
const DEFAULT_G = 20;
const DEFAULT_NX = 5; // X - M

export function computeGDP(vars: Record<string, number>): ModelOutput {
  const c = vars['consumption'] ?? DEFAULT_C;
  const i = vars['investment'] ?? DEFAULT_I;
  const g = vars['government'] ?? DEFAULT_G;
  const nx = vars['netExports'] ?? DEFAULT_NX;

  const currentGDP = c + i + g + nx;
  const defaultGDP = DEFAULT_C + DEFAULT_I + DEFAULT_G + DEFAULT_NX;
  const gdpChange = defaultGDP > 0
    ? Math.round(((currentGDP - defaultGDP) / defaultGDP) * 100)
    : 0;

  // For GDP we show stacked bar data as curves (bars represented as horizontal lines)
  const components = [
    { id: 'consumption', label: 'C (소비)', color: '#ba1a1a', value: c },
    { id: 'investment', label: 'I (투자)', color: '#dae3f7', value: i },
    { id: 'government', label: 'G (정부지출)', color: '#7e5703', value: g },
    { id: 'netExports', label: 'NX (순수출)', color: '#ffc971', value: nx },
  ];

  // Create "curves" as horizontal bars for the stacked chart
  let cumulative = 0;
  const curves = components.map(comp => {
    const start = cumulative;
    cumulative += Math.max(0, comp.value);
    return {
      id: comp.id,
      label: comp.label,
      color: comp.color,
      points: [
        { x: start, y: 0 },
        { x: start + Math.max(0, comp.value), y: 0 },
      ],
    };
  });

  const summary: SummaryItem[] = [
    {
      label: 'GDP 총합',
      valueBefore: `${defaultGDP}`,
      valueAfter: `${currentGDP}`,
      changePercent: gdpChange,
      direction: gdpChange > 0 ? 'up' : gdpChange < 0 ? 'down' : 'neutral',
    },
    {
      label: 'C 비중',
      valueBefore: `${Math.round(DEFAULT_C / defaultGDP * 100)}%`,
      valueAfter: `${currentGDP > 0 ? Math.round(c / currentGDP * 100) : 0}%`,
      changePercent: 0,
      direction: 'neutral',
    },
  ];

  return {
    curves,
    equilibrium: {
      price: currentGDP,
      quantity: 0,
      label: `GDP = ${currentGDP}`,
    },
    summary,
  };
}
