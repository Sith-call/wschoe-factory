import { useState } from 'react';
import { MOODS, INTENSITY_LABELS } from '../data';
import type { MoodKey } from '../types';

interface Props {
  onSubmit: (mood: MoodKey, intensity: number, memo: string) => void;
  onBack: () => void;
}

export default function MoodCheckScreen({ onSubmit, onBack }: Props) {
  const [selectedMood, setSelectedMood] = useState<MoodKey | null>(null);
  const [intensity, setIntensity] = useState(3);
  const [memo, setMemo] = useState('');
  const [step, setStep] = useState<'mood' | 'detail'>('mood');

  const selectedMoodData = selectedMood ? MOODS.find(m => m.key === selectedMood) : null;

  if (step === 'detail' && selectedMood && selectedMoodData) {
    return (
      <div className="min-h-[100dvh] flex flex-col px-5 pt-8 pb-24 animate-fadeIn">
        {/* Back */}
        <button onClick={() => setStep('mood')} className="flex items-center gap-1 text-on-surface-dim text-sm mb-6">
          <span>{'\u2190'}</span> 감정 다시 선택
        </button>

        {/* Selected mood display */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full ${selectedMoodData.softBg} border border-white/10`}>
            <span className="text-3xl">{selectedMoodData.emoji}</span>
            <span className="text-xl font-semibold text-on-surface">{selectedMoodData.label}</span>
          </div>
          <p className="text-on-surface-dim text-sm mt-2">{selectedMoodData.description}</p>
        </div>

        {/* Intensity slider */}
        <div className="bg-surface-card rounded-xl p-5 mb-5 border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <label className="text-on-surface font-medium text-sm">감정 강도</label>
            <span className={`text-sm font-bold ${selectedMoodData.color}`}>
              {INTENSITY_LABELS[intensity - 1]}
            </span>
          </div>

          <input
            type="range"
            min={1}
            max={5}
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
            className="w-full mb-3"
          />

          <div className="flex justify-between text-[10px] text-on-surface-muted px-1">
            {INTENSITY_LABELS.map((label, i) => (
              <span key={i} className={intensity === i + 1 ? 'text-teal-bright font-medium' : ''}>
                {label}
              </span>
            ))}
          </div>

          {/* Visual intensity bar */}
          <div className="flex gap-1.5 mt-4">
            {[1, 2, 3, 4, 5].map(level => (
              <div
                key={level}
                className={`h-2 flex-1 rounded-full transition-all ${
                  level <= intensity ? selectedMoodData.bgColor : 'bg-white/10'
                } ${level <= intensity ? 'opacity-100' : 'opacity-30'}`}
              />
            ))}
          </div>
        </div>

        {/* Memo */}
        <div className="bg-surface-card rounded-xl p-5 mb-8 border border-white/5">
          <label className="text-on-surface font-medium text-sm block mb-3">
            메모 <span className="text-on-surface-muted font-normal">(선택)</span>
          </label>
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="오늘 어떤 일이 있었나요?"
            className="w-full bg-surface-deep rounded-lg p-3 text-on-surface text-sm placeholder:text-on-surface-muted/50 border border-white/5 focus:border-teal-bright/30 focus:outline-none resize-none"
            rows={3}
            maxLength={200}
          />
          <div className="text-right mt-1">
            <span className="text-on-surface-muted text-xs">{memo.length}/200</span>
          </div>
        </div>

        {/* Submit button */}
        <button
          onClick={() => onSubmit(selectedMood, intensity, memo)}
          className="w-full py-4 bg-teal-bright/20 hover:bg-teal-bright/30 text-teal-bright font-semibold rounded-xl border border-teal-bright/30 transition-all active:scale-[0.98]"
        >
          처방전 받기 {'\uD83D\uDC8A'}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex flex-col px-5 pt-8 pb-24 animate-fadeIn">
      {/* Back */}
      <button onClick={onBack} className="flex items-center gap-1 text-on-surface-dim text-sm mb-6">
        <span>{'\u2190'}</span> 약국으로 돌아가기
      </button>

      {/* Title */}
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold text-on-surface mb-2">
          지금 어떤 감정이 느껴지나요?
        </h2>
        <p className="text-on-surface-dim text-sm">
          가장 가까운 감정을 선택해주세요
        </p>
      </div>

      {/* Mood cards */}
      <div className="grid grid-cols-2 gap-3">
        {MOODS.map((mood, i) => (
          <button
            key={mood.key}
            onClick={() => {
              setSelectedMood(mood.key);
              setStep('detail');
            }}
            className={`flex flex-col items-center gap-2 p-5 rounded-xl border transition-all active:scale-[0.97] animate-slideUp ${mood.softBg} border-white/10 hover:border-white/20`}
            style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'both' }}
          >
            <span className="text-3xl">{mood.emoji}</span>
            <span className="text-on-surface font-medium">{mood.label}</span>
            <span className="text-on-surface-muted text-xs text-center leading-tight">{mood.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
