import React from 'react';
import type { Challenge } from '../types';
import { getCurrentDay, getSuccessCount, getSavedAmount, hasCheckedInToday, getStreak } from '../store';
import { BackIcon, CheckIcon, XMarkIcon, FlameIcon } from '../icons';

const dailyTips: Record<string, string[]> = {
  cafe: [
    '집에서 내린 커피를 텀블러에 담아가세요',
    '카페 대신 공원 산책이 기분 전환에 더 좋아요',
    '아메리카노 대신 물 한 잔, 몸도 지갑도 건강해져요',
    '카페 갈 돈으로 좋은 원두를 사면 한 달은 마셔요',
    '오후 3시 카페 충동? 5분만 참으면 사라져요',
    '텀블러 커피 = 하루 5,000원 절약, 한 달이면 15만원',
    '오늘 하루만 더! 내일의 나에게 선물하는 거예요',
  ],
  delivery: [
    '냉장고에 있는 재료로 간단 볶음밥 어때요?',
    '배달비만 3,000원, 그 돈이면 내일 점심 재료비!',
    '라면 + 계란 + 치즈 = 배달보다 맛있는 한 끼',
    '주말에 밑반찬 3개만 만들어두면 평일이 편해요',
    '배달 앱 알림을 꺼두면 유혹이 줄어요',
    '편의점 도시락도 배달보다 5,000원 저렴해요',
    '오늘 자취 요리 성공하면 진짜 대단한 거예요!',
  ],
  impulse: [
    '장바구니에 넣고 24시간 후에 다시 보세요',
    '"정말 필요한가?" 3번 물어보고 결정하세요',
    '위시리스트에 옮기고 한 달 후에 확인하세요',
    '충동구매 대신 산책을 하면 기분이 나아져요',
    '올해 산 것 중 안 쓰는 물건을 세어보세요',
    '세일이라 사는 건 절약이 아니라 지출이에요',
    '오늘 안 사면 내일 잊어버리는 게 대부분이에요',
  ],
  subscription: [
    '구독 목록을 열어서 마지막 사용일을 확인하세요',
    '한 달 안 쓴 구독은 해지해도 후회 없어요',
    '무료 대안이 있는 서비스인지 검색해보세요',
    '가족이나 친구와 공유 요금제가 가능한지 확인!',
    '연간 결제로 바꾸면 월 비용이 줄어들어요',
    '같은 종류 구독이 겹치지 않는지 확인하세요',
    '해지하고 진짜 필요하면 다시 가입하면 돼요',
  ],
  taxi: [
    '10분 거리는 걸어보세요, 운동도 되고 절약도!',
    '지하철 + 버스 환승이면 택시비의 1/5이에요',
    '약속 10분 일찍 나서면 택시 탈 일이 없어요',
    '걸으면서 팟캐스트 듣기, 시간도 알차게!',
    '비 올 때만 택시 = 한 달 교통비 절반 절약',
    '가까운 거리 택시비 모으면 한 달에 여행 간다!',
    '출퇴근 루트 대중교통 검색, 의외로 빨라요',
  ],
  nightlife: [
    '술 약속을 카페 약속으로 바꿔보세요',
    '2차 없이 1차만! 이것만으로 5만원 절약',
    '집에서 맥주 한 캔이 바에서 한 잔보다 1/3 가격',
    '운동 약속으로 바꾸면 몸도 지갑도 건강해져요',
    '무알콜 맥주도 의외로 맛있어요, 한번 도전!',
    '음주 모임 대신 영화나 보드게임 어때요?',
    '오늘 절약한 돈으로 주말에 맛집 가세요!',
  ],
};

interface ChallengeScreenProps {
  challenge: Challenge;
  onCheckIn: () => void;
  onHistory: () => void;
  onBack: () => void;
}

const dayLabels = ['월', '화', '수', '목', '금', '토', '일'];

export default function ChallengeScreen({ challenge, onCheckIn, onHistory, onBack }: ChallengeScreenProps) {
  const currentDay = getCurrentDay(challenge);
  const successCount = getSuccessCount(challenge);
  const savedAmount = getSavedAmount(challenge);
  const checkedInToday = hasCheckedInToday(challenge);
  const streak = getStreak(challenge);
  const checkedDays = challenge.checkIns.length;
  const progressPercent = Math.round((checkedDays / 7) * 100);

  const tips = dailyTips[challenge.type] || dailyTips['cafe'];
  const todayTip = tips[currentDay % tips.length];

  const streakMessage = streak >= 5 ? `${streak}일 연속 성공! 이대로면 완벽해요!`
    : streak >= 3 ? `${streak}일째 성공 중! 대단해요!`
    : streak >= 2 ? `${streak}일 연속 성공! 페이스 유지!`
    : streak === 1 ? '어제 성공! 오늘도 이어가세요'
    : null;

  return (
    <div className="min-h-[100dvh] bg-surface flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-4 pb-2">
        <button onClick={onBack} className="text-txt-secondary">
          <BackIcon size={24} />
        </button>
        <button onClick={onHistory} className="text-[14px] font-medium text-primary">
          기록 &gt;
        </button>
      </div>

      <div className="flex-1 px-6 pb-8">
        {/* Day + title */}
        <div className="mb-5">
          <p className="text-[13px] font-semibold font-num text-primary mb-0.5">
            Day {currentDay + 1} / 7
          </p>
          <h1 className="text-[20px] font-bold text-txt-primary">
            {challenge.title}
          </h1>
        </div>

        {/* 7-day calendar */}
        <div className="flex justify-between gap-1 mb-5">
          {dayLabels.map((label, dayIdx) => {
            const checkIn = challenge.checkIns.find((ci) => ci.day === dayIdx);
            const isToday = dayIdx === currentDay;
            const isFuture = dayIdx > currentDay;
            const isSuccess = checkIn?.success === true;
            const isFail = checkIn?.success === false;

            return (
              <div key={dayIdx} className="flex flex-col items-center gap-1 flex-1">
                <span className="text-[11px] text-txt-tertiary mb-0.5">{label}</span>
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    ${isSuccess ? 'bg-primary' : ''}
                    ${isFail ? 'bg-[#fee2e2]' : ''}
                    ${isToday && !checkIn ? 'border-2 border-primary animate-pulse-border' : ''}
                    ${isFuture ? 'border border-dashed border-[#d1d5db]' : ''}
                    ${!isSuccess && !isFail && !isToday && !isFuture ? 'border border-dashed border-[#d1d5db]' : ''}
                  `}
                >
                  {isSuccess && <CheckIcon size={16} color="white" />}
                  {isFail && <XMarkIcon size={14} color="#ef4444" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress */}
        <div className="mb-5">
          <div className="w-full h-1.5 bg-[#e2e8f0] rounded-full overflow-hidden mb-1.5">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[12px] font-num text-txt-tertiary">
            <span>{checkedDays}/7일 ({progressPercent}%)</span>
            <span>목표 {'\u20A9'}{challenge.targetSaving.toLocaleString()}</span>
          </div>
        </div>

        {/* Streak */}
        {streakMessage && (
          <div className="flex items-center gap-2 mb-5">
            <FlameIcon size={16} color="#0d9488" />
            <span className="text-[13px] font-semibold text-primary">{streakMessage}</span>
          </div>
        )}

        {/* Savings - full width, no card wrapper */}
        <div className="bg-txt-primary rounded-xl p-5 mb-5">
          <div className="flex justify-between items-end mb-2">
            <div>
              <p className="text-[12px] text-white/50 mb-0.5">누적 절약</p>
              <p className="text-[28px] font-bold font-num text-white leading-none">
                {'\u20A9'}{savedAmount.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[12px] text-white/50 mb-0.5">일 절약</p>
              <p className="text-[16px] font-bold font-num text-white/90">
                {'\u20A9'}{challenge.dailySaving.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[12px] font-num text-white/40">
            <span>{successCount}일 성공</span>
            <span>·</span>
            <span>{challenge.checkIns.length - successCount}일 실패</span>
            <span>·</span>
            <span>{7 - challenge.checkIns.length}일 남음</span>
          </div>
        </div>

        {/* Today's tip - border left accent, no card */}
        <div className="border-l-[3px] border-primary/30 pl-3 mb-6">
          <p className="text-[13px] font-semibold text-txt-primary mb-0.5">오늘의 팁</p>
          <p className="text-[13px] text-txt-secondary leading-relaxed">{todayTip}</p>
        </div>

        {/* Check-in button or completed message */}
        {checkedInToday ? (
          <div className="text-center py-3">
            <p className="text-[14px] font-medium text-primary flex items-center justify-center gap-1.5">
              <CheckIcon size={16} color="#0d9488" />
              오늘 체크인 완료
            </p>
          </div>
        ) : (
          <button
            onClick={onCheckIn}
            className="w-full bg-txt-primary text-white rounded-xl py-4 font-semibold text-[16px] active:scale-[0.98] transition-transform duration-100"
          >
            오늘 체크인하기
          </button>
        )}
      </div>
    </div>
  );
}
