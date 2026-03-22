import { CurvePoint, ModelOutput, SummaryItem } from '../types';

// Elasticity Model
// Ed = (%deltaQd) / (%deltaP)
// We show demand curves with varying slopes
// Elastic (|Ed| > 1): flat curve
// Inelastic (|Ed| < 1): steep curve

interface ElasticityVars {
  priceChangeRate: number;  // 가격 변화율 0-50%
  substitutes: number;      // 대체재 수 0-10
}

export function computeElasticity(vars: Record<string, number>): ModelOutput {
  const priceChangeRate = vars['priceChangeRate'] ?? 10;
  const substitutes = vars['substitutes'] ?? 3;

  // Elasticity increases with more substitutes
  const elasticity = 0.2 + substitutes * 0.3;
  const demandChange = priceChangeRate * elasticity;

  // Generate two demand curves: elastic vs current
  const basePrice = 50;
  const baseQuantity = 100;

  // Current demand curve based on elasticity
  const demandPoints: CurvePoint[] = [];
  for (let p = 10; p <= 90; p += 2) {
    const pctChange = ((p - basePrice) / basePrice) * 100;
    const qChange = -pctChange * elasticity;
    const q = baseQuantity + (baseQuantity * qChange / 100);
    if (q > 0 && q < 250) {
      demandPoints.push({ x: q, y: p });
    }
  }

  // Reference inelastic curve (elasticity = 0.3)
  const refPoints: CurvePoint[] = [];
  const refElasticity = 0.3;
  for (let p = 10; p <= 90; p += 2) {
    const pctChange = ((p - basePrice) / basePrice) * 100;
    const qChange = -pctChange * refElasticity;
    const q = baseQuantity + (baseQuantity * qChange / 100);
    if (q > 0 && q < 250) {
      refPoints.push({ x: q, y: p });
    }
  }

  const elasticityType = elasticity > 1 ? '탄력적' : elasticity < 1 ? '비탄력적' : '단위탄력적';

  const summary: SummaryItem[] = [
    {
      label: '탄력성 계수',
      valueBefore: '1.0',
      valueAfter: elasticity.toFixed(1),
      changePercent: Math.round((elasticity - 1) * 100),
      direction: elasticity > 1 ? 'up' : elasticity < 1 ? 'down' : 'neutral',
    },
    {
      label: '수요 변화량',
      valueBefore: `${priceChangeRate}%`,
      valueAfter: `${demandChange.toFixed(1)}%`,
      changePercent: Math.round(demandChange),
      direction: demandChange > 0 ? 'up' : 'down',
    },
  ];

  return {
    curves: [
      { id: 'demand-current', label: `D (${elasticityType})`, color: '#ba1a1a', points: demandPoints },
      { id: 'demand-ref', label: 'D (기준)', color: '#c5c6cc', points: refPoints },
    ],
    equilibrium: {
      price: basePrice,
      quantity: baseQuantity,
      label: `|Ed| = ${elasticity.toFixed(1)}`,
    },
    summary,
  };
}
