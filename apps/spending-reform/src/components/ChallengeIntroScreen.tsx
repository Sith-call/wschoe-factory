import React from 'react';
import type { DiagnosisResult } from '../types';
import { spendingTypes } from '../data/types';
import { getTypeIcon, BackIcon } from '../icons';

interface ChallengeIntroScreenProps {
  diagnosis: DiagnosisResult;
  onStartChallenge: () => void;
  onBack: () => void;
}

export default function ChallengeIntroScreen({ diagnosis, onStartChallenge, onBack }: ChallengeIntroScreenProps) {
  const typeInfo = spendingTypes[diagnosis.type];

  return (
    <div className="min-h-[100dvh] bg-surface flex flex-col">
      {/* Header */}
      <div className="px-6 pt-4 pb-2">
        <button onClick={onBack} className="text-txt-secondary">
          <BackIcon size={24} />
        </button>
      </div>

      <div className="flex-1 px-6 pb-8">
        <h1 className="text-[24px] font-bold text-txt-primary mb-6">맞춤 챌린지</h1>

        {/* Challenge card */}
        <div className="bg-white border border-border rounded-xl p-6 mb-6">
          <div className="flex justify-center mb-4">
            {getTypeIcon(diagnosis.type, 48, '#0d9488')}
          </div>
          <h2 className="text-[18px] font-semibold text-txt-primary text-center mb-3">
            {typeInfo.challengeTitle}
          </h2>
          <p className="text-[15px] text-[#475569] text-center leading-relaxed">
            {typeInfo.challengeRule}
          </p>
        </div>

        {/* Saving estimate */}
        <div className="bg-primary-light rounded-lg p-5 mb-6">
          <p className="text-[14px] text-txt-secondary mb-1">예상 절약 금액</p>
          <p className="text-[14px] font-num text-txt-secondary mb-2">
            7일 x {'\u20A9'}{typeInfo.dailySaving.toLocaleString()}
          </p>
          <p className="text-[28px] font-bold font-num text-primary">
            = {'\u20A9'}{typeInfo.targetSaving.toLocaleString()}
          </p>
        </div>

        {/* How it works */}
        <h3 className="text-[16px] font-semibold text-txt-primary mb-3">이렇게 진행돼요</h3>
        <ul className="space-y-2.5 mb-8">
          {[
            '매일 앱을 열고 체크인',
            '"지켰어요" 또는 "못 지켰어요" 선택',
            '7일 후 결과 확인',
          ].map((text, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#cbd5e1] mt-2 flex-shrink-0" />
              <span className="text-[14px] text-[#475569]">{text}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <button
          onClick={onStartChallenge}
          className="w-full bg-txt-primary text-white rounded-xl py-4 font-semibold text-[16px] active:scale-[0.98] transition-transform duration-100"
        >
          도전 시작!
        </button>
      </div>
    </div>
  );
}
