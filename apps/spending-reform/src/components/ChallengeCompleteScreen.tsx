import React, { useState, useEffect } from 'react';
import type { Challenge } from '../types';
import { getSuccessCount, getSavedAmount } from '../store';
import { getCompletionMessage } from '../data/challenges';
import { CheckIcon, XMarkIcon, TrophyIcon } from '../icons';

interface ChallengeCompleteScreenProps {
  challenge: Challenge;
  onRediagnose: () => void;
  onShare: () => void;
  onNewChallenge: () => void;
}

const dayLabels = ['월', '화', '수', '목', '금', '토', '일'];

export default function ChallengeCompleteScreen({
  challenge,
  onRediagnose,
  onShare,
  onNewChallenge,
}: ChallengeCompleteScreenProps) {
  const successCount = getSuccessCount(challenge);
  const savedAmount = getSavedAmount(challenge);
  const completionMsg = getCompletionMessage(successCount);
  const [displayAmount, setDisplayAmount] = useState(0);

  // Relatable savings comparison
  const getSavingsComparison = (amount: number): string => {
    if (amount >= 100000) return `이거면 괜찮은 식당에서 풀코스!`;
    if (amount >= 70000) return `이거면 넷플릭스 5개월치!`;
    if (amount >= 50000) return `이거면 맛있는 외식 2번!`;
    if (amount >= 35000) return `이거면 치킨 2마리!`;
    if (amount >= 20000) return `이거면 영화 2편 관람!`;
    if (amount >= 10000) return `이거면 맛있는 점심 한 끼!`;
    if (amount >= 5000) return `작은 시작이 큰 변화를 만들어요!`;
    return '도전 자체가 대단해요!';
  };

  const monthlySaved = Math.round((savedAmount / 7) * 30);
  const getMonthlyComparison = (amount: number): string => {
    if (amount >= 300000) return `한 달이면 제주도 여행!`;
    if (amount >= 200000) return `한 달이면 새 신발 + 옷!`;
    if (amount >= 150000) return `한 달이면 좋은 운동화 하나!`;
    if (amount >= 100000) return `한 달이면 치킨 6마리!`;
    if (amount >= 50000) return `한 달이면 넷플릭스 3개월!`;
    return `한 달이면 맛있는 외식 한 번!`;
  };

  // Count-up animation
  useEffect(() => {
    const duration = 1000;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplayAmount(Math.round(savedAmount * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [savedAmount]);

  return (
    <div className="min-h-[100dvh] bg-surface px-6 py-8">
      {/* Trophy */}
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center">
          <TrophyIcon size={32} color="#0d9488" />
        </div>
      </div>

      <h1 className="text-[28px] font-bold text-txt-primary text-center mb-6">
        챌린지 완료!
      </h1>

      {/* 7-day result calendar */}
      <div className="flex justify-between gap-1.5 mb-6">
        {dayLabels.map((label, dayIdx) => {
          const checkIn = challenge.checkIns.find((ci) => ci.day === dayIdx);
          const isSuccess = checkIn?.success === true;
          const isFail = checkIn?.success === false;

          return (
            <div key={dayIdx} className="flex flex-col items-center gap-1.5 flex-1">
              <div
                className={`
                  w-11 h-11 rounded-full flex items-center justify-center
                  ${isSuccess ? 'bg-primary' : ''}
                  ${isFail ? 'bg-surface-alt' : ''}
                  ${!isSuccess && !isFail ? 'border-[1.5px] border-dashed border-[#cbd5e1]' : ''}
                `}
              >
                {isSuccess && <CheckIcon size={18} color="white" />}
                {isFail && <XMarkIcon size={16} color="#94a3b8" />}
              </div>
              <span className="text-[12px] text-txt-tertiary">{label}</span>
            </div>
          );
        })}
      </div>

      {/* Result card */}
      <div className="bg-[#f8fafc] rounded-xl p-6 mb-4">
        <h2 className="text-[18px] font-semibold text-txt-primary mb-4">
          7일 중 {successCount}일 성공
        </h2>

        <p className="text-[14px] text-txt-secondary mb-1">총 절약 금액</p>
        <p className="text-[36px] font-bold font-num text-primary mb-2">
          {'\u20A9'}{displayAmount.toLocaleString()}
        </p>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-[13px] font-num text-txt-tertiary">
            목표 대비 {Math.round((savedAmount / challenge.targetSaving) * 100)}% 달성
          </span>
          <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full"
              style={{ width: `${Math.min((savedAmount / challenge.targetSaving) * 100, 100)}%` }}
            />
          </div>
        </div>

        <p className="text-[15px] text-[#475569] leading-relaxed">
          {completionMsg.rating}<br />
          {completionMsg.message}
        </p>
      </div>

      {/* Savings celebration */}
      {savedAmount > 0 && (
        <div className="bg-primary-light rounded-xl p-5 mb-4">
          <p className="text-[15px] font-semibold text-primary mb-2">
            {getSavingsComparison(savedAmount)}
          </p>
          <p className="text-[14px] text-txt-secondary leading-relaxed">
            이 페이스 유지하면 {getMonthlyComparison(monthlySaved)}{' '}
            <span className="font-semibold font-num text-primary">
              월 {'\u20A9'}{monthlySaved.toLocaleString()} 절약
            </span>
          </p>
        </div>
      )}

      {/* Detailed stats */}
      <div className="bg-[#f8fafc] rounded-xl p-6 mb-6">
        <h3 className="text-[15px] font-semibold text-txt-primary mb-3">상세 통계</h3>
        <div className="space-y-2.5">
          <div className="flex justify-between items-center">
            <span className="text-[13px] text-txt-secondary">성공률</span>
            <span className="text-[14px] font-semibold font-num text-txt-primary">
              {Math.round((successCount / 7) * 100)}%
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[13px] text-txt-secondary">일 평균 절약</span>
            <span className="text-[14px] font-semibold font-num text-txt-primary">
              {'\u20A9'}{Math.round(savedAmount / 7).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[13px] text-txt-secondary">월 환산 절약 예상</span>
            <span className="text-[14px] font-semibold font-num text-primary">
              {'\u20A9'}{Math.round((savedAmount / 7) * 30).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[13px] text-txt-secondary">연 환산 절약 예상</span>
            <span className="text-[14px] font-semibold font-num text-primary">
              {'\u20A9'}{Math.round((savedAmount / 7) * 365).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Re-diagnosis motivator */}
      <div className="bg-white border border-border rounded-xl p-5 mb-6">
        <p className="text-[15px] font-semibold text-txt-primary mb-1">
          챌린지 후 변화를 확인해보세요
        </p>
        <p className="text-[13px] text-txt-secondary mb-3 leading-relaxed">
          7일 전과 비교해서 소비 체질이 얼마나 바뀌었는지 확인하고, 다음 목표를 세워보세요
        </p>
        <button
          onClick={onRediagnose}
          className="w-full bg-primary text-white rounded-lg py-3.5 font-semibold text-[16px] active:scale-[0.97] transition-transform duration-100"
        >
          재진단하고 변화 확인
        </button>
      </div>

      {/* Secondary CTAs */}
      <button
        onClick={onNewChallenge}
        className="w-full border-[1.5px] border-primary text-primary rounded-lg py-3.5 font-semibold text-[16px] mb-3 active:scale-[0.97] transition-transform duration-100"
      >
        다음 챌린지 시작
      </button>
      <button
        onClick={onShare}
        className="w-full text-txt-secondary font-medium text-[14px] py-2.5"
      >
        결과 공유하기
      </button>
    </div>
  );
}
