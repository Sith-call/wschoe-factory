import { EMOTIONS } from '../types';
import { getReflections, getReflectionByDate, getTodayStr, getStreak } from '../store';

interface Props {
  onStartReflection: () => void;
}

export default function HomeScreen({ onStartReflection }: Props) {
  const today = getTodayStr();
  const todayReflection = getReflectionByDate(today);
  const streak = getStreak();
  const reflections = getReflections();

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const r = reflections.find(ref => ref.date === dateStr);
    return {
      day: ['일', '월', '화', '수', '목', '금', '토'][d.getDay()],
      date: d.getDate(),
      emotion: r?.emotion,
      isToday: dateStr === today,
    };
  });

  const todayEmotion = todayReflection ? EMOTIONS.find(e => e.type === todayReflection.emotion) : null;

  return (
    <div className="min-h-screen px-6 pt-12 pb-24">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">하루 회고</h1>
          <p className="text-night-400 text-sm mt-1">
            {new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' })}
          </p>
        </div>
        {streak > 0 && (
          <div className="flex items-center gap-1.5 bg-warm-amber/10 border border-warm-amber/20 px-3 py-1.5 rounded-full">
            <span className="material-symbols-outlined text-warm-amber text-sm">local_fire_department</span>
            <span className="text-warm-amber text-sm font-medium">{streak}일</span>
          </div>
        )}
      </div>

      {todayReflection ? (
        <div className="bg-night-800 rounded-2xl p-5 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${todayEmotion?.color}20` }}>
              <span className="material-symbols-outlined text-2xl" style={{ color: todayEmotion?.color }}>
                {todayEmotion?.icon}
              </span>
            </div>
            <div className="flex-1">
              <div className="font-semibold text-sm">오늘의 감정: {todayEmotion?.label}</div>
              <div className="text-xs text-night-400 mt-0.5">에너지 {todayReflection.energy}/5</div>
            </div>
            <span className="material-symbols-outlined text-green-400">check_circle</span>
          </div>
          {todayReflection.highlightText && (
            <p className="text-sm text-night-300 mt-3 border-t border-night-700 pt-3">
              "{todayReflection.highlightText}"
            </p>
          )}
        </div>
      ) : (
        <button
          onClick={onStartReflection}
          className="w-full bg-gradient-to-r from-warm-amber to-warm-orange text-night-900 font-semibold text-lg py-5 rounded-2xl mb-6 active:scale-95 transition-transform shadow-lg shadow-warm-amber/20"
        >
          <span className="material-symbols-outlined align-middle mr-2">edit_note</span>
          오늘의 회고 시작하기
        </button>
      )}

      <div className="mb-6">
        <h3 className="text-sm font-medium text-night-300 mb-3">최근 7일</h3>
        <div className="flex gap-2 justify-between">
          {last7Days.map((d, i) => {
            const emotionData = d.emotion ? EMOTIONS.find(e => e.type === d.emotion) : null;
            return (
              <div key={i} className={`flex flex-col items-center gap-1.5 flex-1 py-2 rounded-xl ${d.isToday ? 'bg-night-800' : ''}`}>
                <span className="text-[10px] text-night-400">{d.day}</span>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs"
                  style={{
                    backgroundColor: emotionData ? `${emotionData.color}20` : '#1a1a4520',
                  }}
                >
                  {emotionData ? (
                    <span className="material-symbols-outlined text-base" style={{ color: emotionData.color }}>
                      {emotionData.icon}
                    </span>
                  ) : (
                    <span className="text-night-600">{d.date}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {reflections.length === 0 && (
        <div className="text-center py-8">
          <span className="material-symbols-outlined text-5xl text-night-600 mb-3">auto_stories</span>
          <p className="text-night-400 text-sm">아직 기록이 없어요</p>
          <p className="text-night-500 text-xs mt-1">첫 회고를 시작해보세요</p>
        </div>
      )}
    </div>
  );
}
