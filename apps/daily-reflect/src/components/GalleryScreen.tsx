import { useState } from 'react';
import { EMOTIONS } from '../types';
import { getReflections } from '../store';

export default function GalleryScreen() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const reflections = getReflections();

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = Array.from({ length: 42 }, (_, i) => {
    const dayNum = i - firstDay + 1;
    if (dayNum < 1 || dayNum > daysInMonth) return null;
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    const reflection = reflections.find(r => r.date === dateStr);
    return { dayNum, dateStr, reflection };
  });

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1));

  const selectedReflection = selectedDate ? reflections.find(r => r.date === selectedDate) : null;
  const selectedEmotion = selectedReflection ? EMOTIONS.find(e => e.type === selectedReflection.emotion) : null;

  const monthEmotions = reflections.filter(r => r.date.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`));
  const emotionCounts: Record<string, number> = {};
  monthEmotions.forEach(r => { emotionCounts[r.emotion] = (emotionCounts[r.emotion] || 0) + 1; });

  return (
    <div className="min-h-screen px-6 pt-12 pb-24">
      <h2 className="text-2xl font-bold mb-6">회고 갤러리</h2>

      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="text-night-400 hover:text-white p-1">
          <span className="material-symbols-outlined">chevron_left</span>
        </button>
        <span className="font-semibold">{year}년 {month + 1}월</span>
        <button onClick={nextMonth} className="text-night-400 hover:text-white p-1">
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['일', '월', '화', '수', '목', '금', '토'].map(d => (
          <div key={d} className="text-center text-xs text-night-500 py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 mb-6">
        {days.map((d, i) => {
          if (!d) return <div key={i} />;
          const emotion = d.reflection ? EMOTIONS.find(e => e.type === d.reflection!.emotion) : null;
          const isSelected = d.dateStr === selectedDate;
          return (
            <button
              key={i}
              onClick={() => d.reflection && setSelectedDate(d.dateStr)}
              className={`aspect-square rounded-xl flex items-center justify-center text-sm transition-all duration-200 ${
                isSelected ? 'ring-2 ring-warm-amber scale-110' : ''
              } ${d.reflection ? 'cursor-pointer hover:scale-105' : 'cursor-default'}`}
              style={emotion ? {
                backgroundColor: `${emotion.color}20`,
                boxShadow: isSelected ? `0 0 12px ${emotion.color}30` : undefined,
              } : {}}
            >
              {emotion ? (
                <span className="material-symbols-outlined text-lg" style={{ color: emotion.color }}>
                  {emotion.icon}
                </span>
              ) : (
                <span className="text-night-700 text-xs">{d.dayNum}</span>
              )}
            </button>
          );
        })}
      </div>

      {selectedReflection && selectedEmotion && (
        <div
          className="rounded-2xl p-5 mb-6 animate-fade-in-up border"
          style={{
            backgroundColor: `${selectedEmotion.color}08`,
            borderColor: `${selectedEmotion.color}20`,
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${selectedEmotion.color}20` }}>
              <span className="material-symbols-outlined text-xl" style={{ color: selectedEmotion.color }}>
                {selectedEmotion.icon}
              </span>
            </div>
            <div>
              <span className="font-semibold" style={{ color: selectedEmotion.color }}>{selectedEmotion.label}</span>
              <div className="text-xs text-night-400">에너지 {selectedReflection.energy}/5</div>
            </div>
            <span className="text-xs text-night-500 ml-auto">{selectedDate}</span>
          </div>
          <p className="text-sm text-night-200 italic">"{selectedReflection.highlightText}"</p>
          {selectedReflection.gratitude && (
            <div className="flex items-center gap-1.5 mt-3 pt-3 border-t" style={{ borderColor: `${selectedEmotion.color}15` }}>
              <span className="material-symbols-outlined text-warm-orange text-sm">favorite</span>
              <p className="text-xs text-night-400">{selectedReflection.gratitude}</p>
            </div>
          )}
        </div>
      )}

      {/* 이번 달 하이라이트 모아보기 */}
      {monthEmotions.length > 0 && !selectedDate && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-night-300 mb-3">이번 달 하이라이트</h3>
          <div className="space-y-2">
            {monthEmotions.slice(0, 5).map((r, i) => {
              const em = EMOTIONS.find(e => e.type === r.emotion);
              return (
                <div key={i} className="flex items-center gap-2.5 bg-night-800/50 rounded-xl px-3 py-2.5">
                  <span className="material-symbols-outlined text-sm" style={{ color: em?.color }}>{em?.icon}</span>
                  <p className="text-xs text-night-300 flex-1 truncate">{r.highlightText || '기록 없음'}</p>
                  <span className="text-[10px] text-night-500">{r.date.slice(5)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {Object.keys(emotionCounts).length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-night-300 mb-3">이번 달 감정 분포</h3>
          <div className="space-y-2">
            {EMOTIONS.filter(e => emotionCounts[e.type]).map(e => (
              <div key={e.type} className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm" style={{ color: e.color }}>{e.icon}</span>
                <span className="text-xs text-night-300 w-10">{e.label}</span>
                <div className="flex-1 h-3 bg-night-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(emotionCounts[e.type] / monthEmotions.length) * 100}%`,
                      backgroundColor: e.color,
                    }}
                  />
                </div>
                <span className="text-xs text-night-400 w-6 text-right">{emotionCounts[e.type]}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
