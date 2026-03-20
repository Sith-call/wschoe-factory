import { EMOTIONS } from '../types';
import { getReflections, getStreak } from '../store';

export default function ProfileScreen() {
  const reflections = getReflections();
  const streak = getStreak();

  const emotionCounts: Record<string, number> = {};
  reflections.forEach(r => { emotionCounts[r.emotion] = (emotionCounts[r.emotion] || 0) + 1; });
  const topEmotion = Object.entries(emotionCounts).sort((a, b) => b[1] - a[1])[0];
  const topEmotionData = topEmotion ? EMOTIONS.find(e => e.type === topEmotion[0]) : null;

  const avgEnergy = reflections.length > 0
    ? (reflections.reduce((sum, r) => sum + r.energy, 0) / reflections.length).toFixed(1)
    : '0';

  const handleReset = () => {
    if (confirm('모든 데이터를 삭제하시겠어요?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen px-6 pt-12 pb-24">
      <h2 className="text-2xl font-bold mb-8">프로필</h2>

      <div className="flex items-center gap-4 bg-night-800 rounded-2xl p-5 mb-6">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-warm-amber to-warm-orange flex items-center justify-center">
          <span className="material-symbols-outlined text-3xl text-night-900">person</span>
        </div>
        <div>
          <div className="font-semibold text-lg">나의 회고</div>
          <div className="text-sm text-night-400">매일 3분, 나를 돌아보는 시간</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-night-800 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-warm-amber">{reflections.length}</div>
          <div className="text-xs text-night-400 mt-1">총 회고</div>
        </div>
        <div className="bg-night-800 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-warm-amber">{streak}</div>
          <div className="text-xs text-night-400 mt-1">연속 기록</div>
        </div>
        <div className="bg-night-800 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-warm-amber">{avgEnergy}</div>
          <div className="text-xs text-night-400 mt-1">평균 에너지</div>
        </div>
      </div>

      {topEmotionData && (
        <div className="bg-night-800 rounded-xl p-4 mb-6 flex items-center gap-3">
          <span className="material-symbols-outlined text-2xl" style={{ color: topEmotionData.color }}>
            {topEmotionData.icon}
          </span>
          <div>
            <div className="text-sm font-medium">가장 많이 느낀 감정</div>
            <div className="text-xs text-night-400">{topEmotionData.label} ({topEmotion[1]}회)</div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <div className="bg-night-800 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-night-300">notifications</span>
            <span className="text-sm">알림 시간</span>
          </div>
          <span className="text-sm text-night-400">19:00</span>
        </div>

        <button
          onClick={handleReset}
          className="w-full bg-night-800 rounded-xl p-4 flex items-center gap-3 text-red-400 hover:bg-night-700 transition-colors"
        >
          <span className="material-symbols-outlined">delete_forever</span>
          <span className="text-sm">데이터 초기화</span>
        </button>
      </div>
    </div>
  );
}
