import { EMOTIONS } from '../types';
import { getReflections } from '../store';

export default function InsightScreen() {
  const reflections = getReflections();
  const hasEnoughData = reflections.length >= 5;

  if (!hasEnoughData) {
    return (
      <div className="min-h-screen px-6 pt-12 pb-24 flex flex-col items-center justify-center">
        <span className="material-symbols-outlined text-6xl text-night-600 mb-4">lock</span>
        <h2 className="text-xl font-bold mb-2">인사이트 잠금</h2>
        <p className="text-night-400 text-sm text-center">
          {5 - reflections.length}일 더 기록하면<br/>나만의 패턴을 발견할 수 있어요
        </p>
        <div className="flex gap-1 mt-6">
          {Array.from({ length: 5 }, (_, i) => (
            <div
              key={i}
              className={`w-8 h-2 rounded-full ${i < reflections.length ? 'bg-warm-amber' : 'bg-night-700'}`}
            />
          ))}
        </div>
      </div>
    );
  }

  const sorted = [...reflections].sort((a, b) => a.date.localeCompare(b.date));
  const recent14 = sorted.slice(-14);

  // 요일별 평균 에너지
  const dayEnergy: Record<number, number[]> = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
  recent14.forEach(r => {
    const day = new Date(r.date).getDay();
    dayEnergy[day].push(r.energy);
  });
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const dayAvgs = dayNames.map((name, i) => ({
    name,
    avg: dayEnergy[i].length > 0 ? dayEnergy[i].reduce((a, b) => a + b, 0) / dayEnergy[i].length : 0,
    count: dayEnergy[i].length,
  }));

  // 가장 많은 감정
  const emotionCounts: Record<string, number> = {};
  reflections.forEach(r => { emotionCounts[r.emotion] = (emotionCounts[r.emotion] || 0) + 1; });
  const topEmotion = Object.entries(emotionCounts).sort((a, b) => b[1] - a[1])[0];
  const topEmotionData = EMOTIONS.find(e => e.type === topEmotion[0]);

  // 인사이트 생성
  const insights: string[] = [];
  const bestDay = dayAvgs.filter(d => d.count > 0).sort((a, b) => b.avg - a.avg)[0];
  const worstDay = dayAvgs.filter(d => d.count > 0).sort((a, b) => a.avg - b.avg)[0];
  if (bestDay && worstDay && bestDay.name !== worstDay.name) {
    insights.push(`${bestDay.name}요일에 에너지가 가장 높아요 (평균 ${bestDay.avg.toFixed(1)})`);
    insights.push(`${worstDay.name}요일에 에너지가 가장 낮아요 (평균 ${worstDay.avg.toFixed(1)})`);
  }
  if (topEmotionData) {
    insights.push(`가장 자주 느끼는 감정은 '${topEmotionData.label}'이에요`);
  }

  const maxAvg = Math.max(...dayAvgs.map(d => d.avg), 1);

  const handleShare = async () => {
    const shareText = [
      `🌙 이번 주 하루 회고`,
      topEmotionData ? `가장 많이 느낀 감정: ${topEmotionData.label}` : '',
      bestDay ? `에너지 최고: ${bestDay.name}요일 (${bestDay.avg.toFixed(1)})` : '',
      `총 ${reflections.length}일 기록 중`,
      '',
      '#하루회고 #DailyReflect',
    ].filter(Boolean).join('\n');

    if (navigator.share) {
      await navigator.share({ text: shareText });
    } else {
      await navigator.clipboard.writeText(shareText);
      alert('클립보드에 복사되었어요!');
    }
  };

  return (
    <div className="min-h-screen px-6 pt-12 pb-24">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">인사이트</h2>
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 bg-warm-amber/10 border border-warm-amber/20 px-3 py-1.5 rounded-full text-warm-amber text-xs font-medium hover:bg-warm-amber/20 transition-colors"
        >
          <span className="material-symbols-outlined text-sm">share</span>
          공유
        </button>
      </div>

      {/* 주간 요약 공유 카드 */}
      {topEmotionData && (
        <div className="bg-gradient-to-br from-night-800 via-night-800 to-night-700 rounded-2xl p-5 mb-6 border border-night-600/50">
          <div className="text-xs text-night-400 mb-3">이번 주 나의 감정</div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${topEmotionData.color}20` }}>
              <span className="material-symbols-outlined text-2xl" style={{ color: topEmotionData.color }}>
                {topEmotionData.icon}
              </span>
            </div>
            <div>
              <div className="font-semibold" style={{ color: topEmotionData.color }}>{topEmotionData.label}</div>
              <div className="text-xs text-night-400">{topEmotion[1]}회 기록</div>
            </div>
          </div>
          <div className="flex gap-1">
            {EMOTIONS.filter(e => emotionCounts[e.type]).map(e => (
              <div key={e.type} className="flex-1 h-2 rounded-full" style={{
                backgroundColor: `${e.color}60`,
                flex: emotionCounts[e.type],
              }} />
            ))}
          </div>
        </div>
      )}

      {/* 인사이트 카드 */}
      <div className="space-y-3 mb-8">
        {insights.map((text, i) => (
          <div key={i} className="flex items-start gap-3 bg-night-800 rounded-xl p-4">
            <span className="material-symbols-outlined text-warm-amber text-lg mt-0.5">lightbulb</span>
            <p className="text-sm text-night-100">{text}</p>
          </div>
        ))}
      </div>

      {/* 요일별 에너지 차트 */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-night-300 mb-4">요일별 평균 에너지</h3>
        <div className="flex items-end justify-between gap-2 h-32">
          {dayAvgs.map((d, i) => (
            <div key={i} className="flex flex-col items-center gap-1 flex-1">
              <span className="text-xs text-night-400">{d.avg > 0 ? d.avg.toFixed(1) : ''}</span>
              <div
                className="w-full rounded-t-lg transition-all"
                style={{
                  height: d.avg > 0 ? `${(d.avg / maxAvg) * 80}px` : '4px',
                  backgroundColor: d.avg > 0 ? `rgba(245, 193, 108, ${0.3 + (d.avg / 5) * 0.7})` : '#1a1a45',
                }}
              />
              <span className="text-xs text-night-400">{d.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 감정 트렌드 */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-night-300 mb-4">최근 감정 흐름</h3>
        <div className="flex gap-1.5 overflow-x-auto pb-2">
          {recent14.map((r, i) => {
            const emotion = EMOTIONS.find(e => e.type === r.emotion);
            return (
              <div key={i} className="flex flex-col items-center gap-1 min-w-[32px]">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${emotion?.color}20` }}
                >
                  <span className="material-symbols-outlined text-sm" style={{ color: emotion?.color }}>
                    {emotion?.icon}
                  </span>
                </div>
                <span className="text-[9px] text-night-500">{r.date.slice(8)}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 감정-에너지 상관관계 (SVG 스캐터) */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-night-300 mb-4">감정별 평균 에너지</h3>
        <div className="bg-night-800 rounded-xl p-4">
          <div className="space-y-3">
            {EMOTIONS.map(e => {
              const emotionRefs = reflections.filter(r => r.emotion === e.type);
              if (emotionRefs.length === 0) return null;
              const avgEnergy = emotionRefs.reduce((s, r) => s + r.energy, 0) / emotionRefs.length;
              const avgIntensity = emotionRefs.reduce((s, r) => s + r.emotionIntensity, 0) / emotionRefs.length;
              return (
                <div key={e.type} className="flex items-center gap-3">
                  <div className="w-8 flex justify-center">
                    <span className="material-symbols-outlined text-sm" style={{ color: e.color }}>{e.icon}</span>
                  </div>
                  <span className="text-xs text-night-300 w-8">{e.label}</span>
                  <div className="flex-1 h-6 bg-night-700 rounded-full overflow-hidden relative">
                    <div
                      className="h-full rounded-full flex items-center justify-end pr-2"
                      style={{
                        width: `${(avgEnergy / 5) * 100}%`,
                        backgroundColor: `${e.color}40`,
                      }}
                    >
                      <span className="text-[10px] font-medium" style={{ color: e.color }}>
                        {avgEnergy.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-night-500 w-10 text-right">
                    강도 {avgIntensity.toFixed(1)}
                  </span>
                </div>
              );
            }).filter(Boolean)}
          </div>
          <p className="text-[10px] text-night-500 mt-3 text-center">
            감정별 평균 에너지 레벨 · 데이터 {reflections.length}일 기준
          </p>
        </div>
      </div>

      {/* 에너지 추세 (최근 14일 라인) */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-night-300 mb-4">에너지 추세 (최근 14일)</h3>
        <div className="bg-night-800 rounded-xl p-4">
          <svg viewBox="0 0 300 80" className="w-full">
            {/* 가이드 라인 */}
            {[1, 2, 3, 4, 5].map(n => (
              <line key={n} x1="0" y1={80 - (n / 5) * 70} x2="300" y2={80 - (n / 5) * 70}
                stroke="#1a1a45" strokeWidth="1" />
            ))}
            {/* 에너지 라인 */}
            {recent14.length > 1 && (
              <polyline
                fill="none"
                stroke="#f5c16c"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={recent14.map((r, i) => {
                  const x = (i / (recent14.length - 1)) * 280 + 10;
                  const y = 80 - (r.energy / 5) * 70;
                  return `${x},${y}`;
                }).join(' ')}
              />
            )}
            {/* 데이터 포인트 */}
            {recent14.map((r, i) => {
              const emotion = EMOTIONS.find(e => e.type === r.emotion);
              const x = recent14.length > 1 ? (i / (recent14.length - 1)) * 280 + 10 : 150;
              const y = 80 - (r.energy / 5) * 70;
              return (
                <circle key={i} cx={x} cy={y} r="4"
                  fill={emotion?.color || '#f5c16c'} stroke="#121233" strokeWidth="1.5" />
              );
            })}
          </svg>
          <div className="flex justify-between mt-1">
            <span className="text-[9px] text-night-500">{recent14[0]?.date.slice(5)}</span>
            <span className="text-[9px] text-night-500">{recent14[recent14.length - 1]?.date.slice(5)}</span>
          </div>
        </div>
      </div>

      {/* 깊은 인사이트 */}
      {reflections.length >= 7 && (() => {
        const thisWeek = sorted.slice(0, 7);
        const lastWeek = sorted.slice(7, 14);
        if (lastWeek.length < 5) return null;
        const thisAvg = thisWeek.reduce((s, r) => s + r.energy, 0) / thisWeek.length;
        const lastAvg = lastWeek.reduce((s, r) => s + r.energy, 0) / lastWeek.length;
        const diff = thisAvg - lastAvg;
        const trend = diff > 0.3 ? '상승' : diff < -0.3 ? '하락' : '유지';
        const trendColor = diff > 0.3 ? '#6BCB77' : diff < -0.3 ? '#FF6B6B' : '#f5c16c';
        const trendIcon = diff > 0.3 ? 'trending_up' : diff < -0.3 ? 'trending_down' : 'trending_flat';
        return (
          <div className="bg-night-800/60 rounded-xl p-4 mb-6 border border-night-700/50">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-lg" style={{ color: trendColor }}>{trendIcon}</span>
              <span className="text-sm font-medium">에너지 추세: <span style={{ color: trendColor }}>{trend}</span></span>
            </div>
            <p className="text-xs text-night-400">
              이번 주 평균 {thisAvg.toFixed(1)} vs 지난 주 {lastAvg.toFixed(1)} ({diff > 0 ? '+' : ''}{diff.toFixed(1)})
            </p>
          </div>
        );
      })()}
    </div>
  );
}
