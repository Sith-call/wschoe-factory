import { ModelOutput, SummaryItem, BarDataItem } from '../types';

// Sunk Cost Model
// Decision simulation (scenario-based, not curve-based)
// Bar chart: "Already invested cost" vs "Additional cost" vs "Additional benefit"
// Rational decision: ignore sunk cost, continue if additional benefit > additional cost

const DEFAULT_SUNK = 50;
const DEFAULT_ADDITIONAL_COST = 30;
const DEFAULT_ADDITIONAL_BENEFIT = 40;

export function computeSunkCost(vars: Record<string, number>): ModelOutput {
  const sunkCost = vars['sunkCost'] ?? DEFAULT_SUNK;
  const additionalCost = vars['additionalCost'] ?? DEFAULT_ADDITIONAL_COST;
  const additionalBenefit = vars['additionalBenefit'] ?? DEFAULT_ADDITIONAL_BENEFIT;

  // Rational decision: ignore sunk cost
  const netBenefit = additionalBenefit - additionalCost;
  const shouldContinue = netBenefit > 0;

  // Irrational thinking: "I already invested so much, I should continue"
  const totalInvested = sunkCost + additionalCost;
  const totalReturn = additionalBenefit; // only additional benefit matters
  const irrationalView = totalReturn > totalInvested; // wrong framing

  // Default comparison
  const defaultNet = DEFAULT_ADDITIONAL_BENEFIT - DEFAULT_ADDITIONAL_COST;

  const barData: BarDataItem[] = [
    {
      id: 'sunk',
      label: '매몰비용 (무시!)',
      color: '#6b7280', // gray - to emphasize "ignore this"
      value: sunkCost,
    },
    {
      id: 'additional-cost',
      label: '추가 비용',
      color: '#e74c3c', // red
      value: additionalCost,
    },
    {
      id: 'additional-benefit',
      label: '추가 이득',
      color: '#2ecc71', // green
      value: additionalBenefit,
    },
  ];

  const summary: SummaryItem[] = [
    {
      label: '합리적 판단',
      valueBefore: '',
      valueAfter: shouldContinue ? '계속 투자 (추가이득 > 추가비용)' : '중단 (추가이득 < 추가비용)',
      changePercent: 0,
      direction: shouldContinue ? 'up' : 'down',
    },
    {
      label: '순 추가 이득',
      valueBefore: `${defaultNet}`,
      valueAfter: `${netBenefit > 0 ? '+' : ''}${netBenefit}`,
      changePercent: netBenefit > 0 ? Math.round((netBenefit / additionalCost) * 100) : -Math.round((-netBenefit / additionalCost) * 100),
      direction: netBenefit > 0 ? 'up' : netBenefit < 0 ? 'down' : 'neutral',
    },
    {
      label: '매몰비용 오류',
      valueBefore: '',
      valueAfter: sunkCost > 0 && !shouldContinue
        ? `${sunkCost} 투입했지만 중단이 합리적`
        : sunkCost > 0 && shouldContinue
          ? `${sunkCost} 무관하게 계속이 합리적`
          : '매몰비용 없음',
      changePercent: 0,
      direction: 'neutral',
    },
  ];

  return {
    curves: [], // No curves for this model - bar chart only
    equilibrium: null,
    summary,
    barData,
  };
}
