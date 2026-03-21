import React, { useState, useCallback } from 'react';
import type { Challenge } from '../types';
import { getCurrentDay } from '../store';
import { encourageMessagesSuccess, encourageMessagesFail, failTips } from '../data/challenges';
import { BackIcon, CheckIcon, XMarkIcon } from '../icons';

interface CheckInScreenProps {
  challenge: Challenge;
  onCheckIn: (day: number, success: boolean) => void;
  onBack: () => void;
}

export default function CheckInScreen({ challenge, onCheckIn, onBack }: CheckInScreenProps) {
  const currentDay = getCurrentDay(challenge);
  const [submitted, setSubmitted] = useState<'success' | 'fail' | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const randomSuccessMsg = encourageMessagesSuccess[Math.floor(Math.random() * encourageMessagesSuccess.length)];
  const randomFailMsg = encourageMessagesFail[Math.floor(Math.random() * encourageMessagesFail.length)];

  const typeTips = failTips[challenge.type] || failTips['cafe'];
  const randomFailTip = typeTips[Math.floor(Math.random() * typeTips.length)];

  const handleCheckIn = useCallback((success: boolean) => {
    setSubmitted(success ? 'success' : 'fail');
    onCheckIn(currentDay, success);

    setTimeout(() => {
      setShowFeedback(true);
    }, 100);

    setTimeout(() => {
      onBack();
    }, success ? 1500 : 2500);
  }, [currentDay, onCheckIn, onBack]);

  // Feedback overlay
  if (showFeedback && submitted) {
    const isSuccess = submitted === 'success';

    return (
      <div className="min-h-[100dvh] bg-surface flex flex-col items-center justify-center px-6">
        <div className="animate-scale-in flex flex-col items-center">
          {/* Icon */}
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isSuccess ? 'bg-primary/10' : 'bg-surface-alt'}`}>
            {isSuccess ? (
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" strokeDasharray="24" strokeDashoffset="0" className="animate-check-draw" />
              </svg>
            ) : (
              <XMarkIcon size={28} color="#94a3b8" />
            )}
          </div>

          <h2 className="text-[20px] font-semibold text-txt-primary mb-2">
            {isSuccess ? '잘했어요!' : '괜찮아요, 내일 다시!'}
          </h2>

          {isSuccess && (
            <p className="text-[24px] font-bold font-num text-primary mb-3 animate-count-up">
              +{'\u20A9'}{challenge.dailySaving.toLocaleString()}
            </p>
          )}

          <p className="text-[14px] text-txt-secondary text-center leading-relaxed mb-3">
            {isSuccess ? randomSuccessMsg : randomFailMsg}
          </p>

          {!isSuccess && (
            <div className="bg-surface-alt rounded-lg px-4 py-3 mt-1 max-w-[280px]">
              <p className="text-[13px] font-medium text-txt-primary text-center leading-relaxed">
                {randomFailTip}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-surface flex flex-col">
      {/* Header */}
      <div className="px-6 pt-4 pb-2">
        <button onClick={onBack} className="text-txt-secondary">
          <BackIcon size={24} />
        </button>
      </div>

      <div className="flex-1 flex flex-col px-6 pb-8">
        {/* Top context */}
        <div className="mt-4 mb-auto">
          <p className="text-[13px] font-semibold font-num text-primary mb-1">
            Day {currentDay + 1} of 7
          </p>
          <p className="text-[14px] text-txt-secondary">
            {challenge.rule}
          </p>
        </div>

        {/* Center question */}
        <div className="flex flex-col items-center my-auto py-12">
          <h1 className="text-[24px] font-bold text-txt-primary text-center leading-[1.35] mb-2">
            오늘{' '}
            {challenge.rule.includes('카페') ? '카페 규칙을' :
              challenge.rule.includes('배달') ? '배달 규칙을' :
              challenge.rule.includes('구매') || challenge.rule.includes('장바구니') ? '쇼핑 규칙을' :
              challenge.rule.includes('구독') ? '구독 규칙을' :
              challenge.rule.includes('대중교통') ? '교통 규칙을' :
              '오늘의 규칙을'}
          </h1>
          <h1 className="text-[24px] font-bold text-txt-primary text-center leading-[1.35]">
            지켰나요?
          </h1>
        </div>

        {/* Buttons - stacked vertically for better hierarchy */}
        <div className="space-y-3 mt-auto">
          <button
            onClick={() => handleCheckIn(true)}
            className="w-full bg-txt-primary text-white rounded-xl py-4 font-semibold text-[16px] active:scale-[0.98] transition-transform duration-100 flex items-center justify-center gap-2"
          >
            <CheckIcon size={18} color="white" />
            지켰어요
          </button>
          <button
            onClick={() => handleCheckIn(false)}
            className="w-full bg-white border border-[#e2e8f0] text-txt-primary rounded-xl py-4 font-medium text-[16px] active:scale-[0.98] transition-transform duration-100"
          >
            못 지켰어요
          </button>
        </div>
      </div>
    </div>
  );
}
