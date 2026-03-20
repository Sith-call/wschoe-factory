import { useState } from 'react';
import { MOOD_MAP } from '../data';
import type { Prescription } from '../types';

interface Props {
  prescription: Prescription;
  onToggleFavorite: (id: string) => void;
  onDone: () => void;
  onBack: () => void;
}

export default function PrescriptionScreen({ prescription, onToggleFavorite, onDone, onBack }: Props) {
  const [showBreathing, setShowBreathing] = useState(false);
  const moodData = MOOD_MAP[prescription.mood];

  return (
    <div className="min-h-[100dvh] flex flex-col px-5 pt-8 pb-24 animate-fadeIn">
      {/* Back */}
      <button onClick={onBack} className="flex items-center gap-1 text-on-surface-dim text-sm mb-4">
        <span>{'\u2190'}</span> 돌아가기
      </button>

      {/* Prescription Header — styled as medical card */}
      <div className="bg-surface-card rounded-2xl border border-white/10 overflow-hidden mb-5">
        {/* Top bar */}
        <div className="bg-teal/60 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">{'\uD83C\uDFFA'}</span>
            <span className="text-on-surface font-bold text-sm">감정 약국 처방전</span>
          </div>
          <span className="text-on-surface-muted text-xs">{prescription.date}</span>
        </div>

        {/* Patient info */}
        <div className="px-5 py-4 border-b border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full ${moodData.softBg} flex items-center justify-center`}>
                <span className="text-2xl">{moodData.emoji}</span>
              </div>
              <div>
                <p className="text-on-surface font-semibold">{moodData.label}</p>
                <p className="text-on-surface-muted text-xs">강도 {prescription.intensity}/5</p>
              </div>
            </div>
            <button
              onClick={() => onToggleFavorite(prescription.id)}
              className="text-2xl transition-transform active:scale-125"
            >
              {prescription.isFavorite ? '\u2B50' : '\u2606'}
            </button>
          </div>
          {prescription.memo && (
            <p className="text-on-surface-dim text-sm mt-3 pl-1 italic">"{prescription.memo}"</p>
          )}
        </div>

        {/* Rx items */}
        <div className="px-5 py-4 space-y-4">
          {/* Activity */}
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-bright/10 flex items-center justify-center shrink-0">
              <span className="text-lg">{prescription.activity.emoji}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-amber-light text-[10px] font-bold bg-amber-soft px-2 py-0.5 rounded">Rx.1 활동</span>
                <span className="text-on-surface-muted text-[10px]">{prescription.activity.duration}</span>
              </div>
              <p className="text-on-surface text-sm font-medium">{prescription.activity.title}</p>
              <p className="text-on-surface-dim text-xs mt-0.5">{prescription.activity.description}</p>
            </div>
          </div>

          {/* Affirmation */}
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-soft flex items-center justify-center shrink-0">
              <span className="text-lg">{'\uD83D\uDCAC'}</span>
            </div>
            <div className="flex-1">
              <span className="text-purple-calm text-[10px] font-bold bg-purple-soft px-2 py-0.5 rounded">Rx.2 확언</span>
              <p className="text-on-surface text-sm mt-1.5 font-serif-ko leading-relaxed italic">
                "{prescription.affirmation}"
              </p>
            </div>
          </div>

          {/* Breathing */}
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-bright/10 flex items-center justify-center shrink-0">
              <span className="text-lg">{'\uD83C\uDF2C\uFE0F'}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-teal-bright text-[10px] font-bold bg-teal-bright/10 px-2 py-0.5 rounded">Rx.3 호흡</span>
              </div>
              <p className="text-on-surface text-sm font-medium">{prescription.breathing.name}</p>
              <p className="text-on-surface-dim text-xs mt-0.5">{prescription.breathing.description}</p>
              <button
                onClick={() => setShowBreathing(!showBreathing)}
                className="text-teal-bright text-xs mt-2 underline underline-offset-2"
              >
                {showBreathing ? '닫기' : `${prescription.breathing.pattern} 패턴 보기`}
              </button>
              {showBreathing && (
                <div className="mt-2 p-3 bg-surface-deep rounded-lg border border-white/5 animate-slideDown">
                  <p className="text-on-surface-dim text-xs">
                    패턴: <span className="text-teal-bright font-mono font-bold">{prescription.breathing.pattern}</span>
                  </p>
                  <p className="text-on-surface-dim text-xs mt-1">
                    반복: {prescription.breathing.rounds}회
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Music */}
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-soft flex items-center justify-center shrink-0">
              <span className="text-lg">{prescription.musicGenre.emoji}</span>
            </div>
            <div className="flex-1">
              <span className="text-amber text-[10px] font-bold bg-amber-soft px-2 py-0.5 rounded">Rx.4 음악</span>
              <p className="text-on-surface text-sm font-medium mt-1">{prescription.musicGenre.genre}</p>
              <p className="text-on-surface-dim text-xs mt-0.5">{prescription.musicGenre.description}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {prescription.musicGenre.examples.map((ex, i) => (
                  <span key={i} className="text-[10px] text-on-surface-muted bg-white/5 px-2 py-0.5 rounded-full">
                    {ex}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/5 bg-surface-deep/50">
          <p className="text-on-surface-muted text-[10px] text-center italic">
            {'\u26A0\uFE0F'} 주의: 과다 복용 시 기분이 너무 좋아질 수 있습니다
          </p>
        </div>
      </div>

      {/* Done button */}
      <button
        onClick={onDone}
        className="w-full py-4 bg-teal-bright/20 hover:bg-teal-bright/30 text-teal-bright font-semibold rounded-xl border border-teal-bright/30 transition-all active:scale-[0.98]"
      >
        처방전 저장 완료
      </button>
    </div>
  );
}
