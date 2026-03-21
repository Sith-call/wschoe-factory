import React, { useState } from 'react';
import type { SkinRecord, Product } from '../types';
import { VARIABLE_LABELS } from '../types';
import type { Variable } from '../types';
import { useInsights } from '../hooks/useInsights';
import { InsightCard } from '../components/InsightCard';

function getProductVerdict(impact: number, usedDays: number): string {
  if (usedDays < 3) return '더 지켜봐야 해요';
  if (impact > 0.3) return '계속 사용하세요';
  if (impact < -0.3) return '주의가 필요해요';
  return '더 지켜봐야 해요';
}

interface InsightPageProps {
  records: Record<string, SkinRecord>;
  products: Product[];
}

export function InsightPage({ records, products }: InsightPageProps) {
  const [activeTab, setActiveTab] = useState<'products' | 'variables'>('products');
  const { totalRecordDays, hasEnoughData, productInsights, variableInsights } = useInsights(records, products);

  if (!hasEnoughData) {
    const needed = 7 - totalRecordDays;
    const progress = (totalRecordDays / 7) * 100;
    return (
      <div className="pb-20">
        <h1 className="font-heading text-2xl text-sd-text font-bold mb-8">나의 피부 인사이트</h1>

        <div className="flex flex-col items-center text-center py-12">
          <p className="font-body text-[0.9375rem] text-sd-text mb-4">
            아직 데이터를 모으고 있어요
          </p>

          <div className="w-48 h-2 bg-sd-border rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-sd-primary rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="font-number text-sm text-sd-text-secondary">
            {totalRecordDays} / 7일 기록 완료
          </p>

          <p className="font-body text-sm text-sd-text-secondary mt-4 leading-relaxed">
            {needed}일 더 기록하면<br/>
            제품별, 변수별 분석을<br/>
            볼 수 있어요
          </p>
        </div>
      </div>
    );
  }

  const tooEarlyProducts = productInsights.filter(p => p.usedDays < 3);
  const enoughDataProducts = productInsights.filter(p => p.usedDays >= 3);
  const positiveProducts = enoughDataProducts.filter(p => p.impact > 0);
  const negativeProducts = enoughDataProducts.filter(p => p.impact < 0);

  const negativeVars = variableInsights.filter(v => v.impact < -0.1);
  const positiveVars = variableInsights.filter(v => v.impact > 0.1);

  return (
    <div className="pb-20">
      <h1 className="font-heading text-2xl text-sd-text font-bold mb-6">나의 피부 인사이트</h1>

      {/* Segment control */}
      <div className="flex border border-sd-border rounded-xl overflow-hidden mb-6">
        <button
          onClick={() => setActiveTab('products')}
          className={`flex-1 py-2.5 font-body text-sm text-center ${
            activeTab === 'products'
              ? 'bg-sd-primary text-white font-medium'
              : 'bg-white text-sd-text-secondary'
          }`}
        >
          제품 분석
        </button>
        <button
          onClick={() => setActiveTab('variables')}
          className={`flex-1 py-2.5 font-body text-sm text-center ${
            activeTab === 'variables'
              ? 'bg-sd-primary text-white font-medium'
              : 'bg-white text-sd-text-secondary'
          }`}
        >
          변수 분석
        </button>
      </div>

      {activeTab === 'products' && (
        <div className="space-y-6">
          {positiveProducts.length > 0 && (
            <div>
              <h2 className="font-heading text-lg text-sd-text mb-3">피부에 좋은 제품</h2>
              <div className="space-y-3">
                {positiveProducts.map(p => (
                  <InsightCard
                    key={p.productName}
                    name={p.productName}
                    usedLabel="사용"
                    usedDays={p.usedDays}
                    avgWhenUsed={p.avgScoreWhenUsed}
                    avgWhenNotUsed={p.avgScoreWhenNotUsed}
                    impact={p.impact}
                    verdict={getProductVerdict(p.impact, p.usedDays)}
                  />
                ))}
              </div>
            </div>
          )}

          {negativeProducts.length > 0 && (
            <div>
              <h2 className="font-heading text-lg text-sd-text mb-3">주의가 필요한 제품</h2>
              <div className="space-y-3">
                {negativeProducts.map(p => (
                  <InsightCard
                    key={p.productName}
                    name={p.productName}
                    usedLabel="사용"
                    usedDays={p.usedDays}
                    avgWhenUsed={p.avgScoreWhenUsed}
                    avgWhenNotUsed={p.avgScoreWhenNotUsed}
                    impact={p.impact}
                    verdict={getProductVerdict(p.impact, p.usedDays)}
                  />
                ))}
              </div>
            </div>
          )}

          {tooEarlyProducts.length > 0 && (
            <div>
              <h2 className="font-heading text-lg text-sd-text mb-3">아직 판단하기 이른 제품</h2>
              <div className="space-y-3">
                {tooEarlyProducts.map(p => (
                  <InsightCard
                    key={p.productName}
                    name={p.productName}
                    usedLabel="사용"
                    usedDays={p.usedDays}
                    avgWhenUsed={p.avgScoreWhenUsed}
                    avgWhenNotUsed={p.avgScoreWhenNotUsed}
                    impact={p.impact}
                    verdict={getProductVerdict(p.impact, p.usedDays)}
                  />
                ))}
              </div>
            </div>
          )}

          {productInsights.length === 0 && (
            <p className="font-body text-sm text-sd-text-secondary text-center py-8">
              제품별 데이터가 더 필요해요 (최소 3회 사용)
            </p>
          )}
        </div>
      )}

      {activeTab === 'variables' && (
        <div className="space-y-6">
          {negativeVars.length > 0 && (
            <div>
              <h2 className="font-heading text-lg text-sd-text mb-3">피부에 안 좋은 변수</h2>
              <div className="space-y-3">
                {negativeVars.map(v => (
                  <InsightCard
                    key={v.variable}
                    name={VARIABLE_LABELS[v.variable as Variable]}
                    usedLabel="해당"
                    usedDays={v.activeDays}
                    avgWhenUsed={v.avgScoreWhenActive}
                    avgWhenNotUsed={v.avgScoreWhenInactive}
                    impact={v.impact}
                    sentenceTemplate={`${VARIABLE_LABELS[v.variable as Variable]} 다음날, 피부 점수가 평균 ${Math.abs(v.impact).toFixed(1)}점 낮아져요`}
                  />
                ))}
              </div>
            </div>
          )}

          {positiveVars.length > 0 && (
            <div>
              <h2 className="font-heading text-lg text-sd-text mb-3">피부에 좋은 변수</h2>
              <div className="space-y-3">
                {positiveVars.map(v => (
                  <InsightCard
                    key={v.variable}
                    name={VARIABLE_LABELS[v.variable as Variable]}
                    usedLabel="해당"
                    usedDays={v.activeDays}
                    avgWhenUsed={v.avgScoreWhenActive}
                    avgWhenNotUsed={v.avgScoreWhenInactive}
                    impact={v.impact}
                    sentenceTemplate={`${VARIABLE_LABELS[v.variable as Variable]} 다음날, 피부 점수가 평균 ${v.impact.toFixed(1)}점 높아져요`}
                  />
                ))}
              </div>
            </div>
          )}

          {variableInsights.length === 0 && (
            <p className="font-body text-sm text-sd-text-secondary text-center py-8">
              생활 변수 데이터가 더 필요해요 (최소 3회 기록)
            </p>
          )}
        </div>
      )}
    </div>
  );
}
