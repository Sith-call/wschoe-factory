import { useEffect, useState } from 'react';
import type { Character } from '../types';
import { getTitleForLevel, CLASS_INFO } from '../data';
import { ClassAvatar } from './ClassAvatar';

interface Props {
  character: Character;
  newLevel: number;
  onClose: () => void;
}

export default function LevelUpModal({ character, newLevel, onClose }: Props) {
  const [show, setShow] = useState(false);
  const classInfo = CLASS_INFO[character.class];
  const newTitle = getTitleForLevel(newLevel);

  useEffect(() => {
    requestAnimationFrame(() => setShow(true));
  }, []);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-500 ${show ? 'opacity-100' : 'opacity-0'}`}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full animate-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: ['#fbbf24', '#f59e0b', '#d97706', '#eab308', '#facc15'][i % 5],
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className={`relative z-10 text-center p-8 max-w-xs mx-4 rounded-2xl bg-gradient-to-b from-amber-900/40 to-surface border border-amber-500/30 transition-all duration-700 ${show ? 'scale-100 translate-y-0' : 'scale-75 translate-y-8'}`}>
        {/* Crown */}
        <div className="text-5xl mb-2 animate-bounce-slow">👑</div>

        <h1 className="text-2xl font-bold text-amber-400 mb-1">레벨 업!</h1>
        <div className="text-4xl font-black text-white mb-4">
          Lv.{newLevel}
        </div>

        {/* Avatar */}
        <div className="w-20 h-20 mx-auto rounded-2xl bg-black/30 border border-amber-500/30 flex items-center justify-center mb-4 overflow-hidden">
          <ClassAvatar characterClass={character.class} size={64} glow />
        </div>

        <div className="text-sm text-amber-400/80 mb-1">{classInfo.name}</div>
        <div className="text-lg font-semibold text-white mb-6">"{newTitle}"</div>

        {/* Stats gained */}
        <div className="bg-black/20 rounded-xl p-3 mb-6">
          <div className="text-[10px] text-on-surface-variant mb-2">레벨업 보너스</div>
          <div className="flex justify-center gap-4 text-xs">
            <span className="text-red-400">체력 +1</span>
            <span className="text-purple-400">지력 +1</span>
            <span className="text-emerald-400">정신 +1</span>
            <span className="text-amber-400">민첩 +1</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-amber-500 text-black font-bold text-sm hover:bg-amber-400 transition-colors active:scale-95"
        >
          계속하기 →
        </button>
      </div>
    </div>
  );
}
