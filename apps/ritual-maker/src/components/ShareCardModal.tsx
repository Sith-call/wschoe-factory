import { useRef, useState, useCallback } from 'react';
import type { Character, SkillNode } from '../types';
import { CLASS_INFO, getTitleForLevel } from '../data';
import { ClassAvatar } from './ClassAvatar';

interface Props {
  character: Character;
  skills: SkillNode[];
  type: 'profile' | 'levelUp' | 'bossDefeat';
  bossName?: string;
  onClose: () => void;
}

async function cardToImage(el: HTMLElement): Promise<Blob | null> {
  // Use canvas to capture the card
  const canvas = document.createElement('canvas');
  const rect = el.getBoundingClientRect();
  const scale = 2; // Retina
  canvas.width = rect.width * scale;
  canvas.height = rect.height * scale;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.scale(scale, scale);

  // Draw background
  const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
  gradient.addColorStop(0, '#1a0a3e');
  gradient.addColorStop(1, '#0a0615');
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.roundRect(0, 0, rect.width, rect.height, 16);
  ctx.fill();

  // Use foreignObject via SVG to render HTML to canvas
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${rect.width}" height="${rect.height}">
      <foreignObject width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width:${rect.width}px;height:${rect.height}px">
          ${el.outerHTML}
        </div>
      </foreignObject>
    </svg>`;

  const img = new Image();
  const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  return new Promise((resolve) => {
    img.onload = () => {
      ctx.drawImage(img, 0, 0, rect.width, rect.height);
      URL.revokeObjectURL(url);
      canvas.toBlob(blob => resolve(blob), 'image/png');
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    img.src = url;
  });
}

export default function ShareCardModal({ character, skills, type, bossName, onClose }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [sharing, setSharing] = useState(false);
  const [copied, setCopied] = useState(false);
  const classInfo = CLASS_INFO[character.class];
  const unlockedSkills = skills.filter(s => s.unlocked).length;

  const shareText = type === 'bossDefeat'
    ? `⚔️ ${bossName}을(를) 처치했다!\n${character.name} | ${classInfo.name} Lv.${character.level}\n🔥 ${character.streak}일 연속 | ⭐ ${unlockedSkills} 스킬\n#RitualMaker #루틴메이커`
    : type === 'levelUp'
      ? `🎉 Lv.${character.level} 달성!\n${character.name} | ${classInfo.name}\n"${getTitleForLevel(character.level)}"\n#RitualMaker #루틴메이커`
      : `⚔️ ${character.name} | ${classInfo.name} Lv.${character.level}\n🔥 ${character.streak}일 | ⭐ ${unlockedSkills} 스킬\n"${getTitleForLevel(character.level)}"\n#RitualMaker #루틴메이커`;

  const handleShareImage = useCallback(async () => {
    if (!cardRef.current) return;
    setSharing(true);

    try {
      const blob = await cardToImage(cardRef.current);
      if (blob && navigator.share && navigator.canShare?.({ files: [new File([blob], 'ritual-maker.png', { type: 'image/png' })] })) {
        const file = new File([blob], 'ritual-maker.png', { type: 'image/png' });
        await navigator.share({ text: shareText, files: [file] });
      } else {
        // Fallback: download image
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `ritual-maker-${type}.png`;
          a.click();
          URL.revokeObjectURL(url);
        }
      }
    } catch { /* cancelled */ }
    setSharing(false);
  }, [shareText, type]);

  const handleShareText = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Ritual Maker', text: shareText });
      } catch { /* cancelled */ }
    } else {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [shareText]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fadeIn">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-xs mx-4">
        {/* Share Card */}
        <div
          ref={cardRef}
          className={`p-6 rounded-2xl bg-gradient-to-br ${classInfo.gradient} border border-white/15 text-center mb-4 overflow-hidden`}
          style={{ aspectRatio: '9/16', maxHeight: '420px', background: `linear-gradient(135deg, ${classInfo.color}30, #0a0615)` }}
        >
          {/* App Logo */}
          <div className="text-[10px] text-white/40 tracking-widest mb-4">RITUAL MAKER</div>

          {/* Type Badge */}
          <div className="inline-block px-3 py-1 rounded-full text-xs text-amber-400 mb-4" style={{ backgroundColor: 'rgba(245,158,11,0.15)' }}>
            {type === 'bossDefeat' ? '🏆 보스 처치' : type === 'levelUp' ? '🎉 레벨 업' : '⚔️ 모험가 카드'}
          </div>

          {/* Avatar */}
          <div className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-3 overflow-hidden" style={{ backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.15)' }}>
            <ClassAvatar characterClass={character.class} size={68} glow />
          </div>

          {/* Name & Class */}
          <h2 className="text-xl font-bold text-white">{character.name}</h2>
          <p className="text-xs text-white/50 mb-1">{classInfo.name} · Lv.{character.level}</p>
          <p className="text-sm text-amber-400 font-medium mb-4">"{getTitleForLevel(character.level)}"</p>

          {type === 'bossDefeat' && bossName && (
            <div className="text-xs text-white/60 mb-3">{bossName}을(를) 처치!</div>
          )}

          {/* Stats row */}
          <div className="flex justify-center gap-3 text-[10px] text-white/50 mb-3">
            <span>🔥 {character.streak}일</span>
            <span>⭐ {unlockedSkills} 스킬</span>
          </div>

          {/* Stat bars mini */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: '체력', value: character.stats.stamina, color: '#ef4444' },
              { label: '지력', value: character.stats.intellect, color: '#8b5cf6' },
              { label: '정신', value: character.stats.spirit, color: '#10b981' },
              { label: '민첩', value: character.stats.agility, color: '#f59e0b' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <div className="text-xs font-mono" style={{ color: stat.color }}>{stat.value}</div>
                <div className="text-[8px] text-white/30">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Watermark */}
          <div className="mt-4 text-[8px] text-white/20">#RitualMaker #루틴메이커</div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={handleShareImage}
            disabled={sharing}
            className="w-full py-3 rounded-xl bg-amber-500 text-black font-bold text-sm hover:bg-amber-400 transition-colors active:scale-95 disabled:opacity-50"
          >
            {sharing ? '준비 중...' : '📸 이미지로 저장/공유'}
          </button>
          <button
            onClick={handleShareText}
            className="w-full py-2.5 rounded-xl bg-white/10 text-white text-sm hover:bg-white/15 transition-colors active:scale-95"
          >
            {copied ? '✓ 복사됨!' : '📋 텍스트로 공유'}
          </button>
          <button
            onClick={onClose}
            className="w-full py-2 text-xs text-on-surface-variant hover:text-white transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
