import { ModelOutput, SummaryItem } from '../types';

// Crowding-Out Effect Model
// G↑ → GDP 1차 증가 → 이자율 자동 상승 → I 자동 감소
// Net GDP change = Multiplier * ΔG - Crowding out reduction
//
// Simple model:
//   Gross GDP increase = ΔG × multiplier
//   Interest rate rise = f(ΔG)
//   Investment decrease = g(interest rate rise)
//   Net GDP increase = Gross - Investment decrease

const DEFAULT_G = 10; // government spending increase (trillion won)
const DEFAULT_MPC = 0.7;
const BASE_INTEREST_RATE = 3; // percent
const BASE_INVESTMENT = 50; // trillion won
const INTEREST_SENSITIVITY = 0.04; // how much interest rate rises per unit of G
const INVESTMENT_SENSITIVITY = 1.5; // how much I falls per 1%p interest rate rise

export function computeCrowdingOut(vars: Record<string, number>): ModelOutput {
  const deltaG = vars['deltaG'] ?? DEFAULT_G;
  const mpc = (vars['mpc'] ?? 70) / 100;

  const multiplier = 1 / (1 - mpc);

  // Gross GDP increase from multiplier effect
  const grossGdpIncrease = deltaG * multiplier;

  // Interest rate increase due to government borrowing
  const interestRateRise = deltaG * INTEREST_SENSITIVITY;
  const newInterestRate = BASE_INTEREST_RATE + interestRateRise;

  // Investment decrease due to higher interest rates (crowding out)
  const investmentDecrease = interestRateRise * INVESTMENT_SENSITIVITY * multiplier;
  const newInvestment = Math.max(0, BASE_INVESTMENT - interestRateRise * INVESTMENT_SENSITIVITY);

  // Net GDP increase
  const netGdpIncrease = Math.max(0, grossGdpIncrease - investmentDecrease);
  const crowdingOutRatio = grossGdpIncrease > 0
    ? Math.round((investmentDecrease / grossGdpIncrease) * 100)
    : 0;

  // Default values for comparison
  const defaultMultiplier = 1 / (1 - DEFAULT_MPC);
  const defaultGross = DEFAULT_G * defaultMultiplier;
  const defaultIRise = DEFAULT_G * INTEREST_SENSITIVITY;
  const defaultIDecrease = defaultIRise * INVESTMENT_SENSITIVITY * defaultMultiplier;
  const defaultNet = Math.max(0, defaultGross - defaultIDecrease);

  // Bar data for visualization: GDP components
  const barData = [
    {
      id: 'gross',
      label: '승수효과 (총)',
      color: '#3498db',
      value: Math.round(grossGdpIncrease * 10) / 10,
    },
    {
      id: 'crowding',
      label: '구축효과 (감소)',
      color: '#e74c3c',
      value: -Math.round(investmentDecrease * 10) / 10,
    },
    {
      id: 'net',
      label: '순 GDP 증가',
      color: '#2ecc71',
      value: Math.round(netGdpIncrease * 10) / 10,
    },
  ];

  // Curves: show interest rate gauge and investment as connected points
  // Interest rate curve (G on x-axis, r on y-axis)
  const interestCurve = [];
  for (let g = 0; g <= 100; g += 2) {
    const r = BASE_INTEREST_RATE + g * INTEREST_SENSITIVITY;
    interestCurve.push({ x: g, y: r });
  }

  // Investment curve (G on x-axis, I on y-axis)
  const investmentCurve = [];
  for (let g = 0; g <= 100; g += 2) {
    const ir = g * INTEREST_SENSITIVITY;
    const inv = Math.max(0, BASE_INVESTMENT - ir * INVESTMENT_SENSITIVITY);
    investmentCurve.push({ x: g, y: inv });
  }

  const netChange = defaultNet > 0
    ? Math.round(((netGdpIncrease - defaultNet) / defaultNet) * 100)
    : 0;

  const summary: SummaryItem[] = [
    {
      label: '순 GDP 증가',
      valueBefore: `${Math.round(defaultNet)}조`,
      valueAfter: `${Math.round(netGdpIncrease)}조`,
      changePercent: netChange,
      direction: netChange > 0 ? 'up' : netChange < 0 ? 'down' : 'neutral',
    },
    {
      label: '이자율',
      valueBefore: `${(BASE_INTEREST_RATE + DEFAULT_G * INTEREST_SENSITIVITY).toFixed(1)}%`,
      valueAfter: `${newInterestRate.toFixed(1)}%`,
      changePercent: Math.round(interestRateRise / BASE_INTEREST_RATE * 100),
      direction: interestRateRise > 0 ? 'up' : 'neutral',
    },
    {
      label: '구축 비율',
      valueBefore: '',
      valueAfter: `${crowdingOutRatio}%`,
      changePercent: 0,
      direction: crowdingOutRatio > 30 ? 'up' : 'neutral',
    },
  ];

  return {
    curves: [
      { id: 'interest', label: '이자율 (r)', color: '#e74c3c', points: interestCurve },
      { id: 'investment', label: '투자 (I)', color: '#3498db', points: investmentCurve },
    ],
    equilibrium: {
      price: newInterestRate,
      quantity: netGdpIncrease,
      label: `순 GDP +${Math.round(netGdpIncrease)}조, r=${newInterestRate.toFixed(1)}%`,
    },
    summary,
    barData,
  };
}
