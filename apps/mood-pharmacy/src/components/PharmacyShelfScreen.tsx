import { useState, useMemo } from 'react';
import { MOODS, MOOD_MAP } from '../data';
import type { Prescription, MoodKey } from '../types';

interface Props {
  prescriptions: Prescription[];
  onToggleFavorite: (id: string) => void;
  onBack: () => void;
}

export default function PharmacyShelfScreen({ prescriptions, onToggleFavorite, onBack }: Props) {
  const [filter, setFilter] = useState<MoodKey | 'all' | 'favorites'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (filter === 'all') return prescriptions;
    if (filter === 'favorites') return prescriptions.filter(p => p.isFavorite);
    return prescriptions.filter(p => p.mood === filter);
  }, [prescriptions, filter]);

  const moodCounts = useMemo(() => {
    const counts: Partial<Record<MoodKey, number>> = {};
    for (const p of prescriptions) {
      counts[p.mood] = (counts[p.mood] || 0) + 1;
    }
    return counts;
  }, [prescriptions]);

  const favCount = prescriptions.filter(p => p.isFavorite).length;

  return (
    <div className="min-h-[100dvh] flex flex-col px-5 pt-8 pb-24 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="text-on-surface-dim text-sm">{'\u2190'} 돌아가기</button>
        <h2 className="text-lg font-bold text-on-surface">처방전 모아보기</h2>
        <div className="w-16" />
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
        <button
          onClick={() => setFilter('all')}
          className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            filter === 'all' ? 'bg-teal-bright/20 text-teal-bright border border-teal-bright/30' : 'bg-surface-card text-on-surface-muted border border-white/5'
          }`}
        >
          전체 ({prescriptions.length})
        </button>
        <button
          onClick={() => setFilter('favorites')}
          className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            filter === 'favorites' ? 'bg-amber-soft text-amber-light border border-amber/30' : 'bg-surface-card text-on-surface-muted border border-white/5'
          }`}
        >
          {'\u2B50'} 즐겨찾기 ({favCount})
        </button>
        {MOODS.filter(m => moodCounts[m.key]).map(m => (
          <button
            key={m.key}
            onClick={() => setFilter(m.key)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filter === m.key ? `${m.softBg} ${m.color} border border-white/20` : 'bg-surface-card text-on-surface-muted border border-white/5'
            }`}
          >
            {m.emoji} {m.label} ({moodCounts[m.key]})
          </button>
        ))}
      </div>

      {/* Prescription list */}
      {filtered.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <span className="text-4xl mb-3">{'\uD83C\uDFFA'}</span>
          <p className="text-on-surface-dim text-sm">아직 처방전이 없어요</p>
          <p className="text-on-surface-muted text-xs mt-1">감정을 기록하면 처방전이 쌓여요</p>
        </div>
      ) : (
        <div className="space-y-3">
          {[...filtered].reverse().map(rx => {
            const moodData = MOOD_MAP[rx.mood];
            const isExpanded = expandedId === rx.id;

            return (
              <div key={rx.id} className="bg-surface-card rounded-xl border border-white/5 overflow-hidden">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : rx.id)}
                  className="w-full p-4 flex items-center gap-3 text-left"
                >
                  <div className={`w-10 h-10 rounded-lg ${moodData.softBg} flex items-center justify-center shrink-0`}>
                    <span className="text-lg">{moodData.emoji}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-on-surface text-sm font-medium">{moodData.label}</span>
                      <span className="text-on-surface-muted text-[10px]">Lv.{rx.intensity}</span>
                      {rx.isFavorite && <span className="text-xs">{'\u2B50'}</span>}
                    </div>
                    <p className="text-on-surface-dim text-xs mt-0.5 truncate">{rx.activity.title}</p>
                  </div>
                  <span className="text-on-surface-muted text-xs shrink-0">{rx.date.slice(5)}</span>
                  <span className="text-on-surface-muted text-xs">{isExpanded ? '\u25B2' : '\u25BC'}</span>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 space-y-3 animate-slideDown border-t border-white/5 pt-3">
                    {/* Activity */}
                    <div className="flex gap-2 items-start">
                      <span className="text-sm">{rx.activity.emoji}</span>
                      <div>
                        <p className="text-on-surface text-xs font-medium">{rx.activity.title}</p>
                        <p className="text-on-surface-dim text-[10px]">{rx.activity.description}</p>
                      </div>
                    </div>
                    {/* Affirmation */}
                    <div className="flex gap-2 items-start">
                      <span className="text-sm">{'\uD83D\uDCAC'}</span>
                      <p className="text-on-surface-dim text-xs italic font-serif-ko">"{rx.affirmation}"</p>
                    </div>
                    {/* Breathing */}
                    <div className="flex gap-2 items-start">
                      <span className="text-sm">{'\uD83C\uDF2C\uFE0F'}</span>
                      <p className="text-on-surface-dim text-xs">{rx.breathing.name} ({rx.breathing.pattern})</p>
                    </div>
                    {/* Music */}
                    <div className="flex gap-2 items-start">
                      <span className="text-sm">{rx.musicGenre.emoji}</span>
                      <p className="text-on-surface-dim text-xs">{rx.musicGenre.genre}: {rx.musicGenre.examples.join(', ')}</p>
                    </div>
                    {/* Memo */}
                    {rx.memo && (
                      <div className="bg-surface-deep rounded-lg p-2">
                        <p className="text-on-surface-muted text-[10px]">메모: {rx.memo}</p>
                      </div>
                    )}
                    {/* Favorite toggle */}
                    <button
                      onClick={() => onToggleFavorite(rx.id)}
                      className="text-xs text-amber-light hover:text-amber transition-colors"
                    >
                      {rx.isFavorite ? '\u2B50 즐겨찾기 해제' : '\u2606 즐겨찾기 추가'}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
