import React, { useState } from 'react';
import type { DiagnosisResult, Category } from '../types';
import { spendingTypes, wasteMultipliers } from '../data/types';
import { getTypeIcon, BackIcon } from '../icons';
import RadarChart from './RadarChart';

interface ResultScreenProps {
  diagnosis: DiagnosisResult;
  onStartChallenge: () => void;
  onShare: () => void;
  onBack: () => void;
}

const categoryLabels: Record<Category, string> = {
  cafe: '카페',
  delivery: '배달',
  shopping: '쇼핑',
  subscription: '구독',
  transport: '교통',
  nightlife: '유흥',
};

export default function ResultScreen({ diagnosis, onStartChallenge, onShare, onBack }: ResultScreenProps) {
  const [showDetail, setShowDetail] = useState(true);
  const typeInfo = spendingTypes[diagnosis.type];

  const categoryWaste = Object.entries(diagnosis.scores)
    .map(([cat, score]) => ({
      category: cat as Category,
      label: categoryLabels[cat as Category],
      score,
      waste: Math.round(score * (wasteMultipliers[cat] || 1)),
    }))
    .sort((a, b) => b.waste - a.waste);

  const typeToCategoryMap: Record<string, Category> = {
    cafe: 'cafe', delivery: 'delivery', impulse: 'shopping',
    subscription: 'subscription', taxi: 'transport', nightlife: 'nightlife',
  };
  const mainCategory = typeToCategoryMap[diagnosis.type] || 'cafe';
  const mainCategoryWaste = categoryWaste.find(c => c.category === mainCategory);
  const mainWaste = mainCategoryWaste?.waste || 0;

  return (
    <div className="min-h-[100dvh] bg-surface pb-10">
      {/* Header */}
      <div className="px-6 pt-4 pb-2">
        <button onClick={onBack} className="text-txt-secondary">
          <BackIcon size={24} />
        </button>
      </div>

      {/* Hero type reveal - colored background slab */}
      <div className="bg-txt-primary mx-0 px-6 pt-8 pb-10 mb-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-lg bg-white/15 flex items-center justify-center">
            {getTypeIcon(diagnosis.type, 28, 'white')}
          </div>
          <div>
            <p className="text-[13px] text-white/60">당신의 소비 유형</p>
            <h1 className="text-[24px] font-bold text-white">{typeInfo.label}</h1>
          </div>
        </div>
        <p className="text-[15px] text-white/80 leading-relaxed">
          {typeInfo.description}
        </p>
      </div>

      <div className="px-6">
        {/* Waste amount - big number, left aligned */}
        <div className="mb-6">
          <p className="text-[13px] font-medium text-txt-secondary mb-1">
            월 예상 낭비 금액
          </p>
          <p className="text-[36px] font-bold font-num text-txt-primary leading-none mb-1">
            {'\u20A9'}{diagnosis.estimatedWaste}<span className="text-[20px] font-semibold text-txt-secondary">만원</span>
          </p>
          <p className="text-[13px] text-txt-tertiary">
            {categoryLabels[mainCategory]}에서 월 약 {mainWaste}만원 지출
          </p>
        </div>

        {/* Radar chart */}
        <div className="flex justify-center mb-6">
          <RadarChart scores={diagnosis.scores} size={260} />
        </div>

        {/* Category breakdown */}
        <div className="mb-6">
          <button
            onClick={() => setShowDetail(!showDetail)}
            className="flex items-center gap-1.5 mb-3"
          >
            <span className="text-[14px] font-semibold text-txt-primary">카테고리별 분석</span>
            <svg
              width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className={`transition-transform duration-200 ${showDetail ? 'rotate-180' : ''}`}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {showDetail && (
            <div className="space-y-3">
              {categoryWaste.map((item, idx) => {
                const exactAmount = item.waste * 10000;
                const maxWaste = categoryWaste[0]?.waste || 1;
                const barPercent = Math.max((item.waste / maxWaste) * 100, 8);
                const barColor = idx === 0 ? '#dc2626' : idx === 1 ? '#f59e0b' : '#0d9488';
                return (
                  <div key={item.category}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[13px] font-medium text-txt-primary">{item.label}</span>
                      <span className="text-[13px] font-semibold font-num text-txt-primary">
                        {'\u20A9'}{exactAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-[#e2e8f0] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${barPercent}%`, backgroundColor: barColor }}
                      />
                    </div>
                  </div>
                );
              })}
              <div className="mt-2 pt-3 border-t border-[#e2e8f0] flex justify-between items-center">
                <span className="text-[13px] text-txt-secondary">월 총 낭비</span>
                <span className="text-[15px] font-bold font-num text-txt-primary">
                  {'\u20A9'}{(diagnosis.estimatedWaste * 10000).toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Quick win - simpler, no nested card */}
        <div className="border-l-[3px] border-primary pl-4 mb-8">
          <p className="text-[14px] font-semibold text-txt-primary mb-1">
            지금 바로 줄일 수 있는 것
          </p>
          <p className="text-[14px] text-txt-secondary leading-relaxed">
            {categoryWaste[0] && (
              <>
                <span className="font-semibold text-txt-primary">{categoryWaste[0].label}</span> 지출이 가장 높아요.{' '}
                {categoryWaste[0].category === 'cafe' && '내일부터 텀블러에 커피를 내려 가면 하루 5,000원씩 절약돼요.'}
                {categoryWaste[0].category === 'delivery' && '이번 주부터 배달 대신 간단한 자취 요리 1끼만 도전해보세요.'}
                {categoryWaste[0].category === 'shopping' && '장바구니에 넣고 24시간 기다리면 절반은 안 사게 돼요.'}
                {categoryWaste[0].category === 'subscription' && '지금 바로 구독 목록을 열어서 안 쓰는 것 1개만 해지하세요.'}
                {categoryWaste[0].category === 'transport' && '가까운 거리는 걸어보세요. 10분 거리면 택시비 5,000원 절약!'}
                {categoryWaste[0].category === 'nightlife' && '이번 주 술 약속 1개만 카페 약속으로 바꿔보세요.'}
              </>
            )}
          </p>
        </div>

        {/* Disclaimer */}
        <p className="text-[12px] text-txt-tertiary mb-6">
          * 자가 진단 기반이며, 실제 지출과 다를 수 있습니다.
        </p>

        {/* CTAs */}
        <button
          onClick={onStartChallenge}
          className="w-full bg-txt-primary text-white rounded-xl py-4 font-semibold text-[16px] mb-3 active:scale-[0.98] transition-transform duration-100"
        >
          7일 챌린지 시작하기
        </button>
        <button
          onClick={onShare}
          className="w-full text-txt-secondary font-medium text-[14px] py-2.5 active:opacity-70 transition-opacity"
        >
          결과 공유하기
        </button>
      </div>
    </div>
  );
}
