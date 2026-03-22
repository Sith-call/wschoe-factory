import React, { useState } from 'react';
import type { SkinRecord, Product } from '../types';
import { VARIABLE_LABELS, KEYWORD_LABELS } from '../types';
import type { Variable, SkinKeyword } from '../types';
import { getCustomVariables } from '../utils/storage';
import { useInsights } from '../hooks/useInsights';
import { InsightCard } from '../components/InsightCard';
import { ProductCombo } from '../components/ProductCombo';
import { KeywordTrend } from '../components/KeywordTrend';

interface Props {
  records: Record<string, SkinRecord>;
  products: Product[];
}

type InsightTab = 'product' | 'variable' | 'trend';

export function InsightPage({ records, products }: Props) {
  const [activeTab, setActiveTab] = useState<InsightTab>('product');
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [showAllVariables, setShowAllVariables] = useState(false);
  const [showCombos, setShowCombos] = useState(false);
  const {
    totalRecordDays,
    hasEnoughData,
    hasMinimumData,
    productInsights,
    variableInsights,
    comboInsights,
    keywordTrends,
    miniInsight,
  } = useInsights(records, products);

  const tabs: { key: InsightTab; label: string }[] = [
    { key: 'product', label: '제품 분석' },
    { key: 'variable', label: '습관 분석' },
    { key: 'trend', label: '트렌드' },
  ];

  // Build top 3 key insights for the summary section
  const buildKeyInsights = () => {
    const insights: { icon: string; text: string; detail: string }[] = [];

    // Best product
    if (productInsights.length > 0 && productInsights[0].impact > 0) {
      insights.push({
        icon: 'thumb_up',
        text: `${productInsights[0].productName}`,
        detail: `사용 시 점수 +${productInsights[0].impact.toFixed(1)}점`,
      });
    }

    // Worst variable
    const worstVar = variableInsights.find(v => v.impact < 0);
    if (worstVar) {
      const label = VARIABLE_LABELS[worstVar.variable as Variable] || worstVar.variable;
      insights.push({
        icon: 'warning',
        text: label,
        detail: `있는 날 점수 ${worstVar.impact.toFixed(1)}점`,
      });
    }

    // Top correlation
    if (miniInsight && miniInsight.correlations.length > 0) {
      const c = miniInsight.correlations[0];
      const customVars = getCustomVariables();
      const varLabel = VARIABLE_LABELS[c.variable as Variable]
        || customVars.find(cv => cv.id === c.variable)?.label
        || c.variable;
      insights.push({
        icon: 'link',
        text: `${varLabel} + ${KEYWORD_LABELS[c.keyword as SkinKeyword]}`,
        detail: `등장 확률 ${c.probability}%`,
      });
    }

    // Best combo
    if (comboInsights.length > 0 && comboInsights[0].synergyScore > 0) {
      insights.push({
        icon: 'join',
        text: `${comboInsights[0].productA} + ${comboInsights[0].productB}`,
        detail: `시너지 +${comboInsights[0].synergyScore.toFixed(1)}점`,
      });
    }

    return insights.slice(0, 3);
  };

  const keyInsights = hasEnoughData ? buildKeyInsights() : [];

  return (
    <div className="pb-24">
      {/* Header */}
      <header className="pt-8 pb-4 space-y-4">
        <div className="flex items-center justify-center">
          <h1 className="font-headline text-xl font-medium text-primary">인사이트</h1>
        </div>

        {/* Tabs */}
        <nav className="flex gap-8 mt-4 overflow-x-auto no-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-2 font-headline font-light tracking-tight whitespace-nowrap transition-colors ${
                activeTab === tab.key
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-on-surface-variant hover:bg-surface-container-highest/30'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="bg-surface-container-low h-px w-full opacity-50" />
      </header>

      <main className="space-y-12 mt-8">
        {/* Key Insights Summary (top 3) -- shown above all tabs when enough data */}
        {hasEnoughData && keyInsights.length > 0 && (
          <section className="space-y-4">
            <h2 className="font-headline text-lg font-medium text-on-surface">이번 주 핵심 발견</h2>
            <div className="space-y-3">
              {keyInsights.map((insight, i) => (
                <div
                  key={i}
                  className="bg-surface-container-lowest rounded-xl p-4 flex items-center gap-4 border border-outline-variant/5"
                >
                  <div className="bg-primary/10 p-2 rounded-xl">
                    <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {insight.icon}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-on-surface truncate">{insight.text}</p>
                    <p className="text-xs text-on-surface-variant">{insight.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 3-Day Mini Insight */}
        {miniInsight && !hasEnoughData && (
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                auto_awesome
              </span>
              <h2 className="font-headline text-lg font-light text-on-surface">3일 미니인사이트</h2>
            </div>
            <div className="bg-surface-container-highest/40 rounded-xl p-6 space-y-5">
              <div className="flex justify-between items-center">
                <p className="font-body text-sm text-on-surface font-medium">
                  {miniInsight.totalDays}일차 -- {miniInsight.totalDays >= 3 ? '첫 번째 인사이트가 준비되었어요!' : '조금만 더 기록해봐요'}
                </p>
                <span className="serif-numbers text-xs text-on-surface-variant">{miniInsight.totalDays}/7 days</span>
              </div>

              {/* Progress bar */}
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5, 6, 7].map(day => (
                  <div
                    key={day}
                    className={`h-1.5 flex-1 rounded-full ${
                      day <= miniInsight.totalDays
                        ? day === miniInsight.totalDays
                          ? 'bg-primary-container shadow-[0_0_8px_rgba(133,80,72,0.4)]'
                          : 'bg-primary'
                        : 'bg-surface-container-highest'
                    }`}
                  />
                ))}
              </div>

              {miniInsight.topKeywords.length > 0 && (
                <p className="font-body text-xs text-on-surface-variant italic">
                  가장 많이 기록한 키워드:{' '}
                  {miniInsight.topKeywords.map((k, i) => (
                    <span key={k.keyword}>
                      {i > 0 && ', '}
                      <span className={i === 0 ? 'text-primary font-semibold' : ''}>
                        {KEYWORD_LABELS[k.keyword]} ({k.count}회)
                      </span>
                    </span>
                  ))}
                </p>
              )}

              {/* Variable-keyword correlations (causal insight) */}
              {miniInsight.correlations.length > 0 && (
                <div className="mt-4 pt-4 border-t border-outline-variant/10 space-y-3">
                  <p className="font-body text-xs font-semibold text-on-surface flex items-center gap-1">
                    <span className="material-symbols-outlined text-primary text-sm">link</span>
                    발견된 패턴
                  </p>
                  {miniInsight.correlations.map((c, i) => {
                    const customVars = getCustomVariables();
                    const varLabel = VARIABLE_LABELS[c.variable as Variable]
                      || customVars.find(cv => cv.id === c.variable)?.label
                      || c.variable;
                    return (
                      <p key={i} className="font-body text-[13px] text-on-surface-variant leading-relaxed">
                        <span className="text-primary font-semibold">{varLabel}</span>
                        {' '}다음날{' '}
                        <span className="text-on-surface font-medium">{KEYWORD_LABELS[c.keyword as SkinKeyword]}</span>
                        {' '}등장 확률{' '}
                        <span className="serif-numbers text-primary font-bold text-base">{c.probability}%</span>
                      </p>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Not enough data message -- better empty state */}
        {!hasMinimumData && (
          <div className="bg-surface-container-low rounded-xl p-8 text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-primary-fixed/40 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-3xl">spa</span>
            </div>
            <h3 className="font-headline text-lg text-on-surface">피부의 비밀을 알아가는 중이에요</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              3일 이상 기록하면 첫 인사이트가 나타나요.
              <br />매일 조금씩 기록하면 놀라운 패턴을 발견할 수 있어요.
            </p>
            <div className="flex justify-center gap-2 mt-2">
              {[1, 2, 3].map(day => (
                <div
                  key={day}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    day <= totalRecordDays
                      ? 'bg-primary text-white'
                      : 'bg-surface-container-highest text-on-surface-variant/40'
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>
            <p className="text-[11px] text-on-surface-variant/50">
              {totalRecordDays}일 기록 완료 -- {Math.max(0, 3 - totalRecordDays)}일 남았어요
            </p>
          </div>
        )}

        {/* Product analysis tab */}
        {activeTab === 'product' && hasEnoughData && (
          <>
            {/* Top insight */}
            {productInsights.length > 0 && (
              <section className="space-y-6">
                <h2 className="font-headline text-2xl font-light text-on-surface">이번 주 발견</h2>
                <div className="bg-surface-container-low rounded-xl p-6 space-y-6">
                  <p className="font-body text-on-surface-variant leading-relaxed">
                    {productInsights[0].productName}를 사용한 날, 피부 점수가 평균{' '}
                    <span className="serif-numbers text-lg text-primary font-medium">
                      {Math.abs(productInsights[0].impact).toFixed(1)}
                    </span>
                    점 {productInsights[0].impact > 0 ? '높았' : '낮았'}어요.
                  </p>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-end">
                        <span className="font-label text-xs uppercase tracking-widest text-on-surface-variant">사용 시</span>
                        <span className="serif-numbers text-sm text-primary">{productInsights[0].avgScoreWhenUsed}</span>
                      </div>
                      <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full"
                          style={{ width: `${(productInsights[0].avgScoreWhenUsed / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-end">
                        <span className="font-label text-xs uppercase tracking-widest text-on-surface-variant">미사용 시</span>
                        <span className="serif-numbers text-sm text-on-surface-variant">{productInsights[0].avgScoreWhenNotUsed}</span>
                      </div>
                      <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                        <div
                          className="h-full bg-surface-container-highest rounded-full"
                          style={{ width: `${(productInsights[0].avgScoreWhenNotUsed / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* All product insights (collapsible) */}
            {productInsights.length > 1 && (
              <section className="space-y-4">
                <button
                  onClick={() => setShowAllProducts(!showAllProducts)}
                  className="w-full flex items-center justify-between"
                >
                  <h2 className="font-headline text-2xl font-light text-on-surface">제품별 영향</h2>
                  <div className="flex items-center gap-1 text-primary text-sm">
                    <span>{showAllProducts ? '접기' : '더 보기'}</span>
                    <span className="material-symbols-outlined text-sm">
                      {showAllProducts ? 'expand_less' : 'expand_more'}
                    </span>
                  </div>
                </button>
                {showAllProducts && (
                  <div className="flex flex-col gap-4">
                    {productInsights.map(pi => {
                      const isPositive = pi.impact > 0;
                      const impactPercent = pi.avgScoreWhenNotUsed > 0
                        ? Math.round(((pi.avgScoreWhenUsed - pi.avgScoreWhenNotUsed) / pi.avgScoreWhenNotUsed) * 100)
                        : 0;

                      return (
                        <div
                          key={pi.productName}
                          className="bg-surface-container-lowest rounded-xl p-6 flex flex-col gap-4"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-headline font-medium text-on-surface">{pi.productName}</h3>
                              <p className="font-label text-[10px] uppercase tracking-wider text-on-surface-variant opacity-60">
                                {pi.usedDays}회 사용
                              </p>
                            </div>
                            <span className={`text-[11px] font-bold px-2 py-1 rounded-full ${
                              isPositive
                                ? 'text-emerald-700/70 bg-emerald-50'
                                : 'text-orange-700/70 bg-orange-50'
                            }`}>
                              {isPositive ? '계속 사용하세요' : '주의가 필요해요'}
                            </span>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex-1 space-y-1">
                              <div
                                className="h-1 bg-primary-container rounded-full"
                                style={{ width: `${(pi.avgScoreWhenUsed / 5) * 100}%` }}
                              />
                              <div
                                className="h-1 bg-surface-container-highest rounded-full"
                                style={{ width: `${(pi.avgScoreWhenNotUsed / 5) * 100}%` }}
                              />
                            </div>
                            <span className={`serif-numbers text-xs ${isPositive ? 'text-primary' : 'text-on-surface-variant'}`}>
                              {impactPercent > 0 ? '+' : ''}{impactPercent}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            )}

            {/* Combo Analysis (collapsible) */}
            {comboInsights.length > 0 && (
              <section className="space-y-4">
                <button
                  onClick={() => setShowCombos(!showCombos)}
                  className="w-full flex items-center justify-between"
                >
                  <h2 className="font-headline text-2xl font-light text-on-surface">콤보 분석</h2>
                  <div className="flex items-center gap-1 text-primary text-sm">
                    <span>{showCombos ? '접기' : '더 보기'}</span>
                    <span className="material-symbols-outlined text-sm">
                      {showCombos ? 'expand_less' : 'expand_more'}
                    </span>
                  </div>
                </button>
                {showCombos && comboInsights.map((combo, i) => (
                  <ProductCombo key={i} combo={combo} />
                ))}
              </section>
            )}
          </>
        )}

        {/* Variable analysis tab */}
        {activeTab === 'variable' && hasEnoughData && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-headline text-2xl font-light text-on-surface">생활 습관별 영향</h2>
              {variableInsights.length > 3 && (
                <button
                  onClick={() => setShowAllVariables(!showAllVariables)}
                  className="flex items-center gap-1 text-primary text-sm"
                >
                  <span>{showAllVariables ? '접기' : '더 보기'}</span>
                  <span className="material-symbols-outlined text-sm">
                    {showAllVariables ? 'expand_less' : 'expand_more'}
                  </span>
                </button>
              )}
            </div>
            {variableInsights.length > 0 ? (
              <div className="flex flex-col gap-4">
                {(showAllVariables ? variableInsights : variableInsights.slice(0, 3)).map(vi => {
                  const label = VARIABLE_LABELS[vi.variable as Variable] || vi.variable;
                  const isNegative = vi.impact < 0;

                  return (
                    <div
                      key={vi.variable}
                      className="bg-surface-container-lowest rounded-xl p-6 flex flex-col gap-3"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-headline font-medium text-on-surface">{label}</h3>
                          <p className="font-label text-[10px] uppercase tracking-wider text-on-surface-variant opacity-60">
                            {vi.activeDays}회 활성
                          </p>
                        </div>
                        <span className={`serif-numbers text-sm font-bold ${
                          isNegative ? 'text-error' : 'text-primary'
                        }`}>
                          {vi.impact > 0 ? '+' : ''}{vi.impact.toFixed(1)}점
                        </span>
                      </div>
                      <div className="flex gap-2 items-center">
                        <span className="text-[10px] text-on-surface-variant w-12">활성</span>
                        <div className="flex-1 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${isNegative ? 'bg-error/40' : 'bg-primary-container'}`}
                            style={{ width: `${(vi.avgScoreWhenActive / 5) * 100}%` }}
                          />
                        </div>
                        <span className="serif-numbers text-[11px] text-on-surface-variant w-8 text-right">
                          {vi.avgScoreWhenActive}
                        </span>
                      </div>
                      <div className="flex gap-2 items-center">
                        <span className="text-[10px] text-on-surface-variant w-12">비활성</span>
                        <div className="flex-1 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-surface-container-high"
                            style={{ width: `${(vi.avgScoreWhenInactive / 5) * 100}%` }}
                          />
                        </div>
                        <span className="serif-numbers text-[11px] text-on-surface-variant w-8 text-right">
                          {vi.avgScoreWhenInactive}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-surface-container-low rounded-xl p-6 text-center">
                <p className="text-sm text-on-surface-variant">
                  생활 습관 데이터가 충분하지 않아요. 더 기록해보세요.
                </p>
              </div>
            )}
          </section>
        )}

        {/* Trend tab */}
        {activeTab === 'trend' && (
          <>
            {/* Mini insight (shown here too if >= 7 days) */}
            {miniInsight && hasEnoughData && (
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                    auto_awesome
                  </span>
                  <h2 className="font-headline text-lg font-light text-on-surface">요약</h2>
                </div>
                <div className="bg-surface-container-highest/40 rounded-xl p-6">
                  <p className="font-body text-sm text-on-surface">
                    최근 {miniInsight.totalDays}일간 평균 점수{' '}
                    <span className="serif-numbers text-lg text-primary font-medium">{miniInsight.avgScore}</span>점,{' '}
                    추세는{' '}
                    <span className="font-semibold">
                      {miniInsight.scoreTrend === 'up' ? '상승' : miniInsight.scoreTrend === 'down' ? '하락' : '유지'}
                    </span>
                  </p>
                </div>
              </section>
            )}

            {/* Keyword 2-week trend */}
            {keywordTrends.length > 0 && (
              <section className="space-y-6">
                <h2 className="font-headline text-2xl font-light text-on-surface">키워드 2주 트렌드</h2>
                <KeywordTrend trends={keywordTrends} />
              </section>
            )}

            {keywordTrends.length === 0 && (
              <div className="bg-surface-container-low rounded-xl p-6 text-center">
                <p className="text-sm text-on-surface-variant">
                  3일 이상 기록하면 키워드 트렌드를 볼 수 있어요.
                </p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
