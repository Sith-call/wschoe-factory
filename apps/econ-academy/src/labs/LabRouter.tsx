import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { AppState, Screen, Term } from '../types';
import { markLabDone, getProgress } from '../store';

import { OpportunityCostLab } from './OpportunityCostLab';
import { PPFLab } from './PPFLab';
import { SupplyDemandLab } from './SupplyDemandLab';
import { EquilibriumLab } from './EquilibriumLab';
import { ElasticityLab } from './ElasticityLab';
import { ConsumerSurplusLab } from './ConsumerSurplusLab';
import { MonopolyLab } from './MonopolyLab';
import { ExternalityLab } from './ExternalityLab';
import { GDPLab } from './GDPLab';
import { RealGDPLab } from './RealGDPLab';
import { MoneySupplyLab } from './MoneySupplyLab';
import { BaseRateLab } from './BaseRateLab';
import { CreditCreationLab } from './CreditCreationLab';
import { InflationLab } from './InflationLab';
import { MultiplierLab } from './MultiplierLab';
import { QELab } from './QELab';
import { ComparativeAdvantageLab } from './ComparativeAdvantageLab';
import { ExchangeRateLab } from './ExchangeRateLab';
import { CurrentAccountLab } from './CurrentAccountLab';

// ConceptLabs — grouped labs for remaining terms
import { ScarcityLab, TradeoffLab, RationalDecisionLab, MarginalChangeLab, IncentiveLab, SunkCostLab, MicroeconomicsLab, MacroeconomicsLab, MarketLab, PriceLab, ComplementsLab, SubstitutesLab, NormalInferiorGoodsLab, SupplyElasticityLab } from './ConceptLabs1';
import { MarginalUtilityLab, DiminishingReturnsLab, MarginalCostLab, ProducerSurplusLab, TotalSurplusLab, PerfectCompetitionLab, OligopolyLab, EconomiesOfScaleLab, MarketFailureLab, PublicGoodsLab, FreeRiderLab, InformationAsymmetryLab, MoralHazardLab, AdverseSelectionLab, GovernmentFailureLab, TaxBurdenRatioLab, EconomicWelfareLab } from './ConceptLabs2';
import { NationalIncomeLab, NominalGDPLab, GNILab, PotentialGDPLab, GDPGapLab, EconomicGrowthRateLab, PriceIndexLab, CPILab, ProductivityLab, LaborProductivityLab, CapitalProductivityLab, HumanCapitalLab, LaborIncomeShareLab, EconomicallyActiveLab, UnemploymentRateLab, UnemploymentGapLab, NaturalUnemploymentLab, GrowthContributionLab } from './ConceptLabs3';
import { MoneyLab, VelocityOfMoneyLab, BankRunLab, BusinessCycleLab, StagflationLab, FiscalPolicyLab, TariffLab, PPPLab } from './ConceptLabs4';

const labMap: Record<string, React.ComponentType<{ onComplete: () => void; completed: boolean }>> = {
  'opportunity-cost': OpportunityCostLab,
  'ppf': PPFLab,
  'demand': SupplyDemandLab,
  'supply': SupplyDemandLab,
  'equilibrium': SupplyDemandLab,
  'demand-elasticity': ElasticityLab,
  'consumer-surplus': ConsumerSurplusLab,
  'monopoly': MonopolyLab,
  'externality': ExternalityLab,
  'gdp': GDPLab,
  'real-gdp': RealGDPLab,
  'money-supply': MoneySupplyLab,
  'base-rate': BaseRateLab,
  'credit-creation': CreditCreationLab,
  'inflation': InflationLab,
  'multiplier-effect': MultiplierLab,
  'quantitative-easing': QELab,
  'comparative-advantage': ComparativeAdvantageLab,
  'exchange-rate': ExchangeRateLab,
  'current-account': CurrentAccountLab,
  // ConceptLabs1 — fundamentals
  'scarcity': ScarcityLab,
  'tradeoff': TradeoffLab,
  'rational-decision': RationalDecisionLab,
  'marginal-change': MarginalChangeLab,
  'incentive': IncentiveLab,
  'sunk-cost': SunkCostLab,
  'microeconomics': MicroeconomicsLab,
  'macroeconomics': MacroeconomicsLab,
  // ConceptLabs2 — market-price + consumer-producer + market-failure
  'market': MarketLab,
  'complements': ComplementsLab,
  'substitutes': SubstitutesLab,
  'normal-inferior-goods': NormalInferiorGoodsLab,
  'supply-elasticity': SupplyElasticityLab,
  'price': PriceLab,
  'marginal-utility': MarginalUtilityLab,
  'diminishing-returns': DiminishingReturnsLab,
  'marginal-cost': MarginalCostLab,
  'producer-surplus': ProducerSurplusLab,
  'total-surplus': TotalSurplusLab,
  'perfect-competition': PerfectCompetitionLab,
  'oligopoly': OligopolyLab,
  'economies-of-scale': EconomiesOfScaleLab,
  'market-failure': MarketFailureLab,
  'public-goods': PublicGoodsLab,
  'free-rider': FreeRiderLab,
  'information-asymmetry': InformationAsymmetryLab,
  'moral-hazard': MoralHazardLab,
  'adverse-selection': AdverseSelectionLab,
  'government-failure': GovernmentFailureLab,
  'tax-burden-ratio': TaxBurdenRatioLab,
  'economic-welfare': EconomicWelfareLab,
  // ConceptLabs3 — national-economy + growth-productivity
  'national-income': NationalIncomeLab,
  'nominal-gdp': NominalGDPLab,
  'gni': GNILab,
  'potential-gdp': PotentialGDPLab,
  'gdp-gap': GDPGapLab,
  'economic-growth-rate': EconomicGrowthRateLab,
  'price-index': PriceIndexLab,
  'cpi': CPILab,
  'productivity': ProductivityLab,
  'labor-productivity': LaborProductivityLab,
  'capital-productivity': CapitalProductivityLab,
  'human-capital': HumanCapitalLab,
  'labor-income-share': LaborIncomeShareLab,
  'economically-active': EconomicallyActiveLab,
  'unemployment-rate': UnemploymentRateLab,
  'unemployment-gap': UnemploymentGapLab,
  'natural-unemployment': NaturalUnemploymentLab,
  'growth-contribution': GrowthContributionLab,
  // ConceptLabs4 — money-finance + macro + international
  'money': MoneyLab,
  'velocity-of-money': VelocityOfMoneyLab,
  'bank-run': BankRunLab,
  'business-cycle': BusinessCycleLab,
  'stagflation': StagflationLab,
  'fiscal-policy': FiscalPolicyLab,
  'tariff': TariffLab,
  'ppp': PPPLab,
};

interface Props {
  state: AppState;
  termId: string;
  terms: Term[];
  onStateChange: (s: AppState) => void;
  navigate: (s: Screen) => void;
  goBack?: () => void;
}

export function LabRouter({ state, termId, terms, onStateChange, navigate, goBack }: Props) {
  const term = terms.find(t => t.id === termId);
  if (!term) return null;

  const progress = getProgress(state, termId);
  const completed = progress.labCompleted;
  const LabComponent = labMap[termId];

  function handleComplete() {
    onStateChange(markLabDone(state, termId));
  }

  return (
    <div className="px-4 pt-4 pb-24 max-w-2xl mx-auto">
      <button
        onClick={() => goBack ? goBack() : navigate({ type: 'labList' })}
        className="flex items-center gap-1 text-sm text-ink-secondary hover:text-ink mb-4 transition-colors"
      >
        <ArrowLeft size={16} strokeWidth={1.5} />
        <span>뒤로</span>
      </button>

      <h1 className="font-display text-2xl font-bold text-ink mb-1">{term.korean} 실험실</h1>
      <p className="text-sm text-ink-secondary mb-6">{term.english} Lab</p>

      {LabComponent ? (
        <LabComponent onComplete={handleComplete} completed={completed} />
      ) : (
        <div className="text-center py-12">
          <p className="text-ink-secondary mb-4">이 실험실은 준비 중입니다.</p>
          <button
            onClick={() => navigate({ type: 'termCard', termId })}
            className="text-primary font-medium"
          >
            카드로 돌아가기
          </button>
        </div>
      )}
    </div>
  );
}
