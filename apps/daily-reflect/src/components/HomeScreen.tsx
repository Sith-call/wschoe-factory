import { EMOTIONS } from '../types';
import { getReflections, getReflectionByDate, getTodayStr, getStreak } from '../store';

interface Props {
  onStartReflection: () => void;
}

const QUOTES = [
  '"하루를 돌아보는 사람만이 내일을 디자인할 수 있다."',
  '"기록되지 않은 감정은 흘러가 버린다."',
  '"3분의 회고가 30분의 고민을 줄여준다."',
  '"나를 아는 것이 모든 성장의 시작이다."',
  '"오늘의 감정은 내일의 나침반이다."',
];

export default function HomeScreen({ onStartReflection }: Props) {
  const today = getTodayStr();
  const todayReflection = getReflectionByDate(today);
  const streak = getStreak();
  const reflections = getReflections();
  const sorted = [...reflections].sort((a, b) => b.date.localeCompare(a.date));

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
  const yesterdayStr = (() => { const d = new Date(); d.setDate(d.getDate() - 1); return d.toISOString().split('T')[0]; })();
  const yesterdayReflection = getReflectionByDate(yesterdayStr);
  const yesterdayEmotion = yesterdayReflection ? EMOTIONS.find(e => e.type === yesterdayReflection.emotion) : null;

  // 주간 감정 요약
  const weekEmotions: Record<string, number> = {};
  last7Days.forEach(d => {
    if (d.emotion) weekEmotions[d.emotion] = (weekEmotions[d.emotion] || 0) + 1;
  });
  const topWeekEmotion = Object.entries(weekEmotions).sort((a, b) => b[1] - a[1])[0];
  const topWeekEmotionData = topWeekEmotion ? EMOTIONS.find(e => e.type === topWeekEmotion[0]) : null;

  const quoteOfDay = QUOTES[new Date().getDate() % QUOTES.length];

  const EMOTION_ENCOURAGEMENTS: Record<string, string> = {
    happy: '행복한 오늘이었네요! 이 에너지를 내일도 가져가세요 ✨',
    calm: '평온한 하루, 이런 날이 쌓이면 큰 힘이 됩니다 🌿',
    grateful: '감사함을 느끼는 당신은 이미 풍요로운 사람이에요 🧡',
    tired: '오늘 수고 많았어요. 충분히 쉬는 것도 실력이에요 🌙',
    anxious: '불안한 마음도 기록한 당신, 내일은 더 나을 거예요 💫',
    sad: '힘든 날도 지나가요. 기록한 것만으로도 충분해요 💙',
  };

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
        <div className="bg-night-800 rounded-2xl p-5 mb-6 border border-night-700">
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
            <p className="text-sm text-night-300 mt-3 border-t border-night-700 pt-3 italic">
              "{todayReflection.highlightText}"
            </p>
          )}
          <p className="text-xs mt-3 pt-2" style={{ color: todayEmotion?.color, opacity: 0.8 }}>
            {EMOTION_ENCOURAGEMENTS[todayReflection.emotion]}
          </p>
        </div>
      ) : (
        <button
          onClick={onStartReflection}
          className="w-full bg-gradient-to-r from-warm-amber to-warm-orange text-night-900 font-bold text-lg py-5 rounded-2xl mb-6 active:scale-95 transition-transform shadow-lg shadow-warm-amber/25"
        >
          <span className="material-symbols-outlined align-middle mr-2 text-xl">edit_note</span>
          오늘의 회고 시작하기
        </button>
      )}

      {/* 최근 7일 */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-night-300 mb-3">최근 7일</h3>
        <div className="flex gap-2 justify-between">
          {last7Days.map((d, i) => {
            const emotionData = d.emotion ? EMOTIONS.find(e => e.type === d.emotion) : null;
            return (
              <div key={i} className={`flex flex-col items-center gap-1.5 flex-1 py-2.5 rounded-xl transition-colors ${d.isToday ? 'bg-night-800 border border-night-700' : ''}`}>
                <span className="text-xs text-on-surface-variant">{d.day}</span>
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs"
                  style={{
                    backgroundColor: emotionData ? `${emotionData.color}20` : '#1a1a4520',
                  }}
                >
                  {emotionData ? (
                    <span className="material-symbols-outlined text-base" style={{ color: emotionData.color }}>
                      {emotionData.icon}
                    </span>
                  ) : (
                    <span className="text-night-600 text-[11px]">{d.date}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 어제의 회고 */}
      {yesterdayReflection && yesterdayEmotion && (
        <div className="bg-night-800/60 rounded-2xl p-4 mb-5 border border-night-700/50">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-sm text-night-400">history</span>
            <span className="text-xs text-night-400 font-medium">어제의 회고</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-lg" style={{ color: yesterdayEmotion.color }}>
              {yesterdayEmotion.icon}
            </span>
            <div className="flex-1">
              <span className="text-sm text-night-200">{yesterdayEmotion.label}</span>
              <span className="text-night-500 mx-2">·</span>
              <span className="text-xs text-night-400">에너지 {yesterdayReflection.energy}/5</span>
            </div>
          </div>
          {yesterdayReflection.highlightText && (
            <p className="text-xs text-night-400 mt-2 italic">"{yesterdayReflection.highlightText}"</p>
          )}
        </div>
      )}

      {/* 이번 주 감정 요약 */}
      {topWeekEmotionData && Object.keys(weekEmotions).length >= 2 && (
        <div className="bg-gradient-to-r from-night-800 to-night-800/50 rounded-2xl p-4 mb-5 border border-night-700/50">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-sm text-night-400">analytics</span>
            <span className="text-xs text-night-400 font-medium">이번 주 요약</span>
          </div>
          <p className="text-sm text-night-200">
            이번 주 가장 많이 느낀 감정은{' '}
            <span className="font-semibold" style={{ color: topWeekEmotionData.color }}>
              {topWeekEmotionData.label}
            </span>
            이에요 ({topWeekEmotion[1]}일)
          </p>
        </div>
      )}

      {/* 오늘의 한마디 */}
      <div className="bg-night-800/40 rounded-xl p-4 border border-night-800">
        <p className="text-xs text-night-400 text-center italic leading-relaxed">{quoteOfDay}</p>
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
