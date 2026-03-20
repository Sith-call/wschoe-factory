import { EMOTIONS, HIGHLIGHT_CATEGORIES } from '../types';
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

  // 카테고리별 에너지
  const catEnergy: Record<string, number[]> = {};
  reflections.forEach(r => {
    if (!catEnergy[r.highlightCategory]) catEnergy[r.highlightCategory] = [];
    catEnergy[r.highlightCategory].push(r.energy);
  });

  // 첫 기록일
  const sorted = [...reflections].sort((a, b) => a.date.localeCompare(b.date));
  const firstDate = sorted[0]?.date;
  const daysSinceFirst = firstDate
    ? Math.ceil((Date.now() - new Date(firstDate).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

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
          <div className="text-sm text-night-400">
            {daysSinceFirst > 0 ? `${daysSinceFirst}일째 기록 중` : '매일 3분, 나를 돌아보는 시간'}
          </div>
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

      {/* 감정 분포 시각화 */}
      {Object.keys(emotionCounts).length > 0 && (
        <div className="bg-night-800 rounded-xl p-4 mb-4">
          <h3 className="text-sm font-medium text-night-300 mb-3">감정 분포</h3>
          <div className="flex gap-1 h-3 rounded-full overflow-hidden mb-3">
            {EMOTIONS.filter(e => emotionCounts[e.type]).map(e => (
              <div
                key={e.type}
                className="h-full rounded-full"
                style={{
                  flex: emotionCounts[e.type],
                  backgroundColor: e.color,
                }}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {EMOTIONS.filter(e => emotionCounts[e.type]).map(e => (
              <div key={e.type} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: e.color }} />
                <span className="text-[10px] text-night-400">
                  {e.label} {Math.round((emotionCounts[e.type] / reflections.length) * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {topEmotionData && (
        <div className="bg-night-800 rounded-xl p-4 mb-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${topEmotionData.color}20` }}>
            <span className="material-symbols-outlined text-xl" style={{ color: topEmotionData.color }}>
              {topEmotionData.icon}
            </span>
          </div>
          <div>
            <div className="text-sm font-medium">가장 많이 느낀 감정</div>
            <div className="text-xs text-night-400">{topEmotionData.label} ({topEmotion[1]}회, {Math.round((topEmotion[1] as unknown as number / reflections.length) * 100)}%)</div>
          </div>
        </div>
      )}

      {/* 카테고리별 평균 에너지 */}
      {Object.keys(catEnergy).length > 1 && (
        <div className="bg-night-800 rounded-xl p-4 mb-4">
          <h3 className="text-sm font-medium text-night-300 mb-3">활동별 평균 에너지</h3>
          <div className="space-y-2">
            {HIGHLIGHT_CATEGORIES.map(c => {
              const energies = catEnergy[c.type];
              if (!energies || energies.length === 0) return null;
              const avg = energies.reduce((a, b) => a + b, 0) / energies.length;
              return (
                <div key={c.type} className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-night-400">{c.icon}</span>
                  <span className="text-xs text-night-300 w-12">{c.label}</span>
                  <div className="flex-1 h-4 bg-night-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(avg / 5) * 100}%`,
                        backgroundColor: `rgba(245,193,108,${0.3 + (avg / 5) * 0.7})`,
                      }}
                    />
                  </div>
                  <span className="text-xs text-warm-amber w-8 text-right">{avg.toFixed(1)}</span>
                </div>
              );
            }).filter(Boolean)}
          </div>
        </div>
      )}

      <div className="space-y-3 mt-6">
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
