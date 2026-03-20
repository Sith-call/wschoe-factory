import { useState } from 'react';
import type { CharacterClass } from '../types';
import { CLASS_INFO } from '../data';
import { ClassAvatar } from './ClassAvatar';

interface Props {
  onComplete: (name: string, selectedClass: CharacterClass) => void;
}

export default function OnboardingScreen({ onComplete }: Props) {
  const [step, setStep] = useState<'class' | 'name'>('class');
  const [selectedClass, setSelectedClass] = useState<CharacterClass | null>(null);
  const [name, setName] = useState('');

  const handleSubmit = () => {
    if (selectedClass && name.trim()) {
      onComplete(name.trim(), selectedClass);
    }
  };

  if (step === 'class') {
    return (
      <div className="min-h-[100dvh] flex flex-col p-6 animate-fadeIn">
        {/* Title */}
        <div className="text-center mt-12 mb-8">
          <div className="text-5xl mb-4">⚔️</div>
          <h1 className="text-2xl font-bold text-white mb-2">당신의 클래스를 선택하세요</h1>
          <p className="text-sm text-on-surface-variant">각 클래스마다 다른 스탯 보너스와 특성이 있습니다</p>
        </div>

        {/* Class Cards */}
        <div className="flex-1 space-y-3">
          {(Object.entries(CLASS_INFO) as [CharacterClass, typeof CLASS_INFO[CharacterClass]][]).map(([key, info]) => {
            const isSelected = selectedClass === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedClass(key)}
                className={`w-full p-4 rounded-2xl border transition-all duration-300 text-left ${
                  isSelected
                    ? `bg-gradient-to-r ${info.gradient} border-2`
                    : 'bg-surface-container-highest/40 border-white/8 hover:border-white/20'
                }`}
                style={isSelected ? { borderColor: info.color } : undefined}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center bg-black/30 border border-white/10 overflow-hidden ${
                    isSelected ? 'ring-2 ring-offset-2 ring-offset-surface' : ''
                  }`}>
                    <ClassAvatar characterClass={key} size={52} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg font-bold text-white">{info.name}</span>
                      <span className="text-lg">{info.emoji}</span>
                    </div>
                    <p className="text-xs text-on-surface-variant">{info.description}</p>
                    <div className="flex gap-3 mt-2 text-[10px] text-on-surface-variant">
                      <span>체력 {info.baseStats.stamina}</span>
                      <span>지력 {info.baseStats.intellect}</span>
                      <span>정신 {info.baseStats.spirit}</span>
                      <span>민첩 {info.baseStats.agility}</span>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="text-2xl animate-bounce-slow">✓</div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={() => selectedClass && setStep('name')}
          disabled={!selectedClass}
          className={`w-full py-4 rounded-xl font-bold text-sm mt-6 transition-all ${
            selectedClass
              ? 'bg-amber-500 text-black hover:bg-amber-400 active:scale-[0.98]'
              : 'bg-white/5 text-white/30'
          }`}
        >
          다음 →
        </button>
      </div>
    );
  }

  // Name step
  const classInfo = selectedClass ? CLASS_INFO[selectedClass] : null;

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center p-6 animate-fadeIn">
      {classInfo && selectedClass && (
        <>
          <div className="w-24 h-24 rounded-2xl flex items-center justify-center bg-black/30 border border-white/10 mb-6 overflow-hidden">
            <ClassAvatar characterClass={selectedClass} size={80} />
          </div>
          <div className="text-sm text-on-surface-variant mb-1">{classInfo.name} 클래스</div>
        </>
      )}

      <h2 className="text-xl font-bold text-white mb-6">모험가의 이름을 입력하세요</h2>

      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="이름을 입력하세요"
        maxLength={10}
        className="w-full max-w-xs bg-surface-container-highest/60 border border-white/15 rounded-xl px-4 py-3 text-center text-white text-lg placeholder:text-white/20 focus:outline-none focus:border-amber-500/50 mb-8"
        autoFocus
      />

      <button
        onClick={handleSubmit}
        disabled={!name.trim()}
        className={`w-full max-w-xs py-4 rounded-xl font-bold text-sm transition-all ${
          name.trim()
            ? 'bg-amber-500 text-black hover:bg-amber-400 active:scale-[0.98]'
            : 'bg-white/5 text-white/30'
        }`}
      >
        모험 시작! ⚔️
      </button>

      <button
        onClick={() => setStep('class')}
        className="mt-3 text-xs text-on-surface-variant hover:text-white"
      >
        ← 클래스 다시 선택
      </button>
    </div>
  );
}
