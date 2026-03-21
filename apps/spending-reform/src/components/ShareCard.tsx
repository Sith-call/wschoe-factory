import React, { useState } from 'react';
import type { DiagnosisResult, Challenge } from '../types';
import { spendingTypes } from '../data/types';
import { getSuccessCount, getSavedAmount } from '../store';
import { ShareIcon, CopyIcon } from '../icons';
import RadarChart from './RadarChart';

interface ShareCardProps {
  diagnosis: DiagnosisResult;
  challenge?: Challenge | null;
  onClose: () => void;
}

export default function ShareCard({ diagnosis, challenge, onClose }: ShareCardProps) {
  const [toast, setToast] = useState(false);
  const typeInfo = spendingTypes[diagnosis.type];
  const successCount = challenge ? getSuccessCount(challenge) : 0;
  const savedAmount = challenge ? getSavedAmount(challenge) : 0;

  const shareText = challenge
    ? `나는 '소비 체질 개선'으로 7일 챌린지를 완료했다!\n${getEmojiForType(diagnosis.type)} ${typeInfo.label} | ${'\u20A9'}${savedAmount.toLocaleString()} 절약\n너도 도전해봐 #소비체질개선`
    : `나의 소비 유형은 '${typeInfo.label}'!\n${getEmojiForType(diagnosis.type)} 월 예상 낭비 금액: ${'\u20A9'}${diagnosis.estimatedWaste}만원\n너도 진단받아봐 #소비체질개선`;

  function getEmojiForType(type: string): string {
    const map: Record<string, string> = {
      cafe: '\u2615', delivery: '\uD83D\uDEF5', impulse: '\uD83D\uDECD\uFE0F',
      subscription: '\uD83D\uDCF1', taxi: '\uD83D\uDE95', nightlife: '\uD83C\uDF7B',
    };
    return map[type] || '\uD83D\uDCB0';
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ text: shareText });
      } else {
        await navigator.clipboard.writeText(shareText);
        setToast(true);
        setTimeout(() => setToast(false), 2000);
      }
    } catch {
      // User cancelled or share failed — try clipboard
      try {
        await navigator.clipboard.writeText(shareText);
        setToast(true);
        setTimeout(() => setToast(false), 2000);
      } catch {
        // Ignore
      }
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setToast(true);
      setTimeout(() => setToast(false), 2000);
    } catch {
      // Ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Card */}
      <div className="relative w-full max-w-[480px] animate-slide-up">
        <div className="mx-4 mb-4 bg-white rounded-2xl shadow-lg p-6">
          {/* App branding */}
          <p className="text-[14px] font-semibold text-primary mb-4">소비 체질 개선</p>

          {/* Type */}
          <h2 className="text-[20px] font-bold text-txt-primary mb-3">
            나는 {typeInfo.label}!
          </h2>

          {/* Mini radar chart */}
          <div className="flex justify-center mb-3">
            <RadarChart scores={diagnosis.scores} size={180} animate={false} />
          </div>

          {/* Challenge result if available */}
          {challenge && (
            <div className="mb-3">
              <p className="text-[13px] font-medium text-txt-secondary">
                7일 챌린지 결과
              </p>
              <p className="text-[13px] font-medium text-txt-secondary">
                {successCount}/7일 성공
              </p>
              <p className="text-[24px] font-bold font-num text-primary mt-1">
                {'\u20A9'}{savedAmount.toLocaleString()} 절약
              </p>
            </div>
          )}

          {/* If no challenge, show waste */}
          {!challenge && (
            <div className="mb-3">
              <p className="text-[13px] font-medium text-txt-secondary">
                월 예상 낭비 금액
              </p>
              <p className="text-[24px] font-bold font-num text-primary mt-1">
                {'\u20A9'}{diagnosis.estimatedWaste}만원
              </p>
            </div>
          )}

          {/* Improvement if afterScore exists */}
          {challenge?.afterScore !== undefined && challenge.beforeScore > 0 && (
            <p className="text-[16px] font-semibold text-primary mb-2">
              {typeInfo.label.replace('형', '')} 소비 {Math.round(((challenge.beforeScore - (challenge.afterScore || 0)) / challenge.beforeScore) * 100)}% 감소
            </p>
          )}

          {/* Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleShare}
              className="flex-1 bg-primary text-white rounded-lg py-3 font-semibold text-[14px] flex items-center justify-center gap-2 active:scale-[0.97] transition-transform duration-100"
            >
              <ShareIcon size={16} color="white" />
              공유하기
            </button>
            <button
              onClick={handleCopy}
              className="flex-[0.6] bg-surface-alt text-[#475569] rounded-lg py-3 font-medium text-[14px] flex items-center justify-center gap-2 active:scale-[0.97] transition-transform duration-100"
            >
              <CopyIcon size={16} />
              복사
            </button>
          </div>

          {/* Close */}
          <button
            onClick={onClose}
            className="w-full text-txt-tertiary font-medium text-[14px] mt-4 py-2"
          >
            닫기
          </button>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-txt-primary text-white text-[14px] px-4 py-2.5 rounded-lg shadow-lg z-[60] animate-scale-in">
          복사되었습니다
        </div>
      )}
    </div>
  );
}
