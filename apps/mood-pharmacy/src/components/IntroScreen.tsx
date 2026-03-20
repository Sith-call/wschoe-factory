import { MOODS, MOOD_MAP } from '../data';
import type { MoodLog } from '../types';

interface Props {
  recentLog: MoodLog | null;
  streak: number;
  onStartCheck: () => void;
  onNavigate: (screen: 'history' | 'shelf' | 'profile') => void;
}

export default function IntroScreen({ recentLog, streak, onStartCheck, onNavigate }: Props) {
  return (
    <div className="min-h-[100dvh] flex flex-col px-5 pt-12 pb-24 animate-fadeIn">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-4xl mb-3 animate-float">{'\uD83C\uDFFA'}</div>
        <h1 className="text-2xl font-bold text-on-surface mb-1 font-serif-ko">
          감정 약국
        </h1>
        <p className="text-on-surface-dim text-sm">
          당신의 감정을 처방합니다
        </p>
      </div>

      {/* Streak badge */}
      {streak > 0 && (
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-soft border border-amber/20">
            <span>{'\uD83D\uDD25'}</span>
            <span className="text-amber-light text-sm font-medium">{streak}일 연속 기록 중</span>
          </div>
        </div>
      )}

      {/* Main CTA Card */}
      <button
        onClick={onStartCheck}
        className="w-full bg-teal/60 hover:bg-teal-light/60 border border-teal-bright/20 rounded-2xl p-6 mb-6 transition-all active:scale-[0.98] text-left"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-semibold text-on-surface">오늘의 감정 처방받기</span>
          <span className="text-2xl">{'\uD83D\uDC8A'}</span>
        </div>
        <p className="text-on-surface-dim text-sm">
          지금 느끼는 감정을 선택하고, 맞춤 처방전을 받아보세요
        </p>
        <div className="mt-4 flex justify-center">
          <div className="px-5 py-2 bg-teal-bright/20 rounded-full text-teal-bright text-sm font-medium">
            진료 시작하기
          </div>
        </div>
      </button>

      {/* Recent mood */}
      {recentLog && (
        <div className="bg-surface-card rounded-xl p-4 mb-4 border border-white/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-on-surface-muted text-xs mb-1">최근 기록</p>
              <div className="flex items-center gap-2">
                <span className="text-xl">{MOOD_MAP[recentLog.mood].emoji}</span>
                <span className="text-on-surface font-medium">{MOOD_MAP[recentLog.mood].label}</span>
                <span className="text-on-surface-muted text-xs">Lv.{recentLog.intensity}</span>
              </div>
            </div>
            <span className="text-on-surface-muted text-xs">{recentLog.date}</span>
          </div>
        </div>
      )}

      {/* Quick mood bar */}
      <div className="bg-surface-card rounded-xl p-4 mb-6 border border-white/5">
        <p className="text-on-surface-muted text-xs mb-3">지금 기분은?</p>
        <div className="grid grid-cols-4 gap-2">
          {MOODS.slice(0, 8).map((m) => (
            <button
              key={m.key}
              onClick={onStartCheck}
              className={`flex flex-col items-center gap-1 py-2 px-1 rounded-lg ${m.softBg} hover:opacity-80 transition-opacity`}
            >
              <span className="text-lg">{m.emoji}</span>
              <span className="text-[10px] text-on-surface-dim">{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          onClick={() => onNavigate('history')}
          className="bg-surface-card rounded-xl p-4 border border-white/5 text-left hover:bg-surface-card-hover transition-colors"
        >
          <span className="text-xl mb-2 block">{'\uD83D\uDCC5'}</span>
          <p className="text-sm font-medium text-on-surface">기록 보기</p>
          <p className="text-xs text-on-surface-muted mt-1">감정 달력 & 추이</p>
        </button>
        <button
          onClick={() => onNavigate('shelf')}
          className="bg-surface-card rounded-xl p-4 border border-white/5 text-left hover:bg-surface-card-hover transition-colors"
        >
          <span className="text-xl mb-2 block">{'\uD83D\uDCDA'}</span>
          <p className="text-sm font-medium text-on-surface">처방전 모음</p>
          <p className="text-xs text-on-surface-muted mt-1">지난 처방전 보기</p>
        </button>
      </div>

      {/* Bottom tagline */}
      <div className="text-center mt-auto">
        <p className="text-on-surface-muted text-xs italic font-serif-ko">
          "감정에도 처방이 필요합니다"
        </p>
      </div>
    </div>
  );
}
