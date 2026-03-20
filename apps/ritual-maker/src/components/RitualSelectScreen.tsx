import { useState } from 'react';
import type { Ritual, CharacterClass } from '../types';
import { ALL_RITUALS, CATEGORY_INFO, TIME_SLOT_INFO } from '../data';

interface Props {
  characterClass: CharacterClass;
  onComplete: (selectedRituals: Ritual[]) => void;
  onBack?: () => void;
  initialRitualIds?: string[];
}

export default function RitualSelectScreen({ characterClass, onComplete, onBack, initialRitualIds }: Props) {
  const [selected, setSelected] = useState<Set<string>>(() => new Set(initialRitualIds || []));

  const toggle = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else if (next.size < 12) next.add(id);
      return next;
    });
  };

  const handleComplete = () => {
    const rituals = ALL_RITUALS.filter(r => selected.has(r.id));
    onComplete(rituals);
  };

  const classBonusCategory = characterClass === 'warrior' ? 'body' : characterClass === 'mage' ? 'mind' : characterClass === 'healer' ? 'soul' : 'social';

  return (
    <div className="min-h-[100dvh] p-4 pb-24 animate-fadeIn">
      {/* Back button for edit mode */}
      {onBack && (
        <div className="flex items-center gap-3 mb-2">
          <button onClick={onBack} className="text-on-surface-variant hover:text-white transition-colors text-lg">←</button>
          <span className="text-sm text-on-surface-variant">루틴 편집 취소</span>
        </div>
      )}

      <div className="text-center mt-2 mb-6">
        <h1 className="text-xl font-bold text-white mb-1">{onBack ? '루틴 편집' : '나의 루틴을 선택하세요'}</h1>
        <p className="text-sm text-on-surface-variant">4~12개의 루틴을 골라 일일 퀘스트를 구성하세요</p>
        <div className="mt-2 text-xs text-amber-400">
          선택: {selected.size}/12 (최소 4개)
        </div>
      </div>

      {/* Time slots */}
      {(['morning', 'afternoon', 'evening'] as const).map(slot => {
        const info = TIME_SLOT_INFO[slot];
        const slotRituals = ALL_RITUALS.filter(r => r.timeSlot === slot);
        return (
          <div key={slot} className="mb-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{info.emoji}</span>
              <span className="text-sm font-semibold text-white">{info.label}</span>
              <span className="text-[10px] text-on-surface-variant">{info.hours}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {slotRituals.map(ritual => {
                const isSelected = selected.has(ritual.id);
                const catInfo = CATEGORY_INFO[ritual.category];
                const isBonus = ritual.category === classBonusCategory;
                return (
                  <button
                    key={ritual.id}
                    onClick={() => toggle(ritual.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500/40'
                        : 'bg-surface-container-highest/40 border-white/8 hover:border-white/15'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-xl">{ritual.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-white truncate">{ritual.name}</div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="text-[9px] px-1 py-0.5 rounded" style={{ backgroundColor: catInfo.color + '20', color: catInfo.color }}>
                            {catInfo.label}
                          </span>
                          {isBonus && (
                            <span className="text-[9px] text-amber-400">+20%</span>
                          )}
                        </div>
                        <div className="text-[10px] text-on-surface-variant mt-0.5">{ritual.description}</div>
                      </div>
                      {isSelected && <span className="text-amber-400 text-sm">✓</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Submit */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-surface-container-lowest/95 backdrop-blur-sm border-t border-white/5 safe-area-bottom">
        <button
          onClick={handleComplete}
          disabled={selected.size < 4}
          className={`w-full py-4 rounded-xl font-bold text-sm transition-all ${
            selected.size >= 4
              ? 'bg-amber-500 text-black hover:bg-amber-400 active:scale-[0.98]'
              : 'bg-white/5 text-white/30'
          }`}
        >
          {selected.size >= 4 ? `${selected.size}개 루틴으로 시작! →` : `${4 - selected.size}개 더 선택하세요`}
        </button>
      </div>
    </div>
  );
}
