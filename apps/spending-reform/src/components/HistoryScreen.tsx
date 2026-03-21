import React from 'react';
import type { Challenge } from '../types';
import { getSuccessCount, getSavedAmount, getTotalSaved, getChallenges } from '../store';
import { spendingTypes } from '../data/types';
import { getTypeIcon, BackIcon } from '../icons';

interface HistoryScreenProps {
  onBack: () => void;
  onNewDiagnosis: () => void;
}

export default function HistoryScreen({ onBack, onNewDiagnosis }: HistoryScreenProps) {
  const challenges = getChallenges().filter((c) => c.status === 'completed');
  const totalSaved = getTotalSaved();

  return (
    <div className="min-h-[100dvh] bg-surface">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 pt-4 pb-4">
        <button onClick={onBack} className="text-txt-secondary">
          <BackIcon size={24} />
        </button>
        <h1 className="text-[18px] font-semibold text-txt-primary">챌린지 기록</h1>
      </div>

      <div className="px-6 pb-8">
        {challenges.length > 0 ? (
          <>
            {/* Total summary */}
            <div className="bg-primary-light rounded-xl p-5 mb-4">
              <p className="text-[14px] font-medium text-txt-secondary mb-1">
                총 누적 절약 금액
              </p>
              <p className="text-[28px] font-bold font-num text-primary">
                {'\u20A9'}{totalSaved.toLocaleString()}
              </p>
              <p className="text-[14px] font-medium text-txt-secondary mt-1">
                {challenges.length}개 챌린지 완료
              </p>
            </div>

            {/* Aggregate stats */}
            <div className="bg-white border border-border rounded-xl p-5 mb-6">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-[12px] text-txt-tertiary mb-0.5">평균 성공률</p>
                  <p className="text-[18px] font-bold font-num text-txt-primary">
                    {Math.round(
                      (challenges.reduce((sum, c) => sum + getSuccessCount(c), 0) /
                        (challenges.length * 7)) *
                        100
                    )}%
                  </p>
                </div>
                <div>
                  <p className="text-[12px] text-txt-tertiary mb-0.5">월 환산</p>
                  <p className="text-[16px] font-bold font-num text-primary">
                    {'\u20A9'}{Math.round(
                      (totalSaved / (challenges.length * 7)) * 30
                    ).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-[12px] text-txt-tertiary mb-0.5">총 성공일</p>
                  <p className="text-[18px] font-bold font-num text-txt-primary">
                    {challenges.reduce((sum, c) => sum + getSuccessCount(c), 0)}일
                  </p>
                </div>
              </div>
            </div>

            {/* Challenge list */}
            <div className="space-y-3">
              {challenges.map((challenge, idx) => {
                const typeInfo = spendingTypes[challenge.type];
                const successCount = getSuccessCount(challenge);
                const saved = getSavedAmount(challenge);
                const startDate = new Date(challenge.startDate);
                const endDate = new Date(startDate);
                endDate.setDate(endDate.getDate() + 6);

                const formatDate = (d: Date) =>
                  `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;

                return (
                  <div
                    key={challenge.id}
                    className="bg-white border border-border rounded-lg p-4"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      {getTypeIcon(challenge.type, 24, '#0d9488')}
                      <span className="text-[15px] font-semibold text-txt-primary">
                        {typeInfo?.challengeTitle.replace('7일 ', '').replace(' 챌린지', '') || challenge.title}
                      </span>
                    </div>
                    <p className="text-[13px] font-num text-txt-tertiary mb-1">
                      {formatDate(startDate)} - {formatDate(endDate)}
                    </p>
                    <div className="flex justify-between items-center">
                      <p className="text-[14px] font-medium text-[#475569]">
                        {successCount}/7일 성공 ({Math.round((successCount / 7) * 100)}%)
                      </p>
                      <p className="text-[14px] font-semibold font-num text-primary">
                        {'\u20A9'}{saved.toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center pt-32">
            <p className="text-[16px] text-txt-tertiary text-center leading-relaxed mb-6">
              아직 완료한 챌린지가<br />
              없어요.
            </p>
            <p className="text-[16px] text-txt-tertiary text-center leading-relaxed">
              첫 번째 챌린지를<br />
              시작해보세요!
            </p>
          </div>
        )}

        {/* New diagnosis button */}
        <button
          onClick={onNewDiagnosis}
          className="w-full mt-8 bg-primary text-white rounded-lg py-3.5 font-semibold text-[16px] active:scale-[0.97] transition-transform duration-100"
        >
          새 진단 시작
        </button>
      </div>
    </div>
  );
}
