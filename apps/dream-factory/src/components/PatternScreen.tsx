import { useMemo } from 'react';
import type { DreamEntry } from '../types';
import { EMOTIONS, PLACES, OBJECTS, getPatternInsights } from '../data';

interface Props {
  dreams: DreamEntry[];
  onGoGallery: () => void;
  onBack: () => void;
}

export default function PatternScreen({ dreams, onGoGallery, onBack }: Props) {
  const insights = useMemo(() => getPatternInsights(dreams), [dreams]);

  // Dot calendar: last 14 days
  const dotCalendar = useMemo(() => {
    const dots: { date: string; hasRecord: boolean }[] = [];
    const now = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const hasRecord = dreams.some(dr => dr.date.split('T')[0] === dateStr);
      dots.push({ date: dateStr, hasRecord });
    }
    return dots;
  }, [dreams]);

  const dayLabels = ['월', '화', '수', '목', '금', '토', '일'];

  // Top 5 symbols
  const topSymbols = useMemo(() => {
    const counts: Record<string, { label: string; count: number }> = {};
    dreams.forEach(d => {
      const pl = PLACES.find(p => p.key === d.scene.place);
      if (pl) {
        counts[d.scene.place] = counts[d.scene.place] || { label: pl.label, count: 0 };
        counts[d.scene.place].count++;
      }
      d.scene.objects.forEach(o => {
        const obj = OBJECTS.find(x => x.key === o);
        if (obj) {
          counts[o] = counts[o] || { label: obj.label, count: 0 };
          counts[o].count++;
        }
      });
    });
    return Object.values(counts).sort((a, b) => b.count - a.count).slice(0, 5);
  }, [dreams]);

  const maxSymbolCount = topSymbols.length > 0 ? topSymbols[0].count : 1;
  const barWidths = [90, 65, 55, 40, 25];

  // Emotion distribution
  const emotionDist = useMemo(() => {
    const counts: Record<string, number> = {};
    dreams.forEach(d => d.emotions.forEach(e => { counts[e] = (counts[e] || 0) + 1; }));
    const total = Object.values(counts).reduce((s, c) => s + c, 0) || 1;
    return EMOTIONS
      .filter(e => counts[e.key])
      .map(e => ({ ...e, count: counts[e.key] || 0, pct: ((counts[e.key] || 0) / total) * 100 }));
  }, [dreams]);

  // SVG donut
  const donutSegments = useMemo(() => {
    let offset = 0;
    const circumference = 2 * Math.PI * 40;
    const colors = ['#a88cfb', '#0d082c', '#ff6e84', '#4f46e5', '#1c00a0'];
    return emotionDist.map((e, i) => {
      const len = (e.pct / 100) * circumference;
      const seg = { ...e, dashArray: `${len} ${circumference - len}`, dashOffset: -offset, color: colors[i % colors.length] };
      offset += len;
      return seg;
    });
  }, [emotionDist]);

  // Vividness trend
  const vividnessTrend = useMemo(() => {
    return dreams.slice(0, 7).reverse().map(d => d.vividness);
  }, [dreams]);

  const dotHeights = [20, 45, 30, 60, 50, 80, 70];

  if (dreams.length < 3) {
    return (
      <div className="min-h-screen flex flex-col bg-surface text-on-surface pb-32 pattern-dot-bg">
        <header className="bg-surface/80 backdrop-blur-xl flex justify-between items-center px-8 h-16 w-full fixed top-0 z-50 max-w-[430px]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">flare</span>
            <h1 className="text-lg font-headline italic text-primary">패턴 분석</h1>
          </div>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant/30 mb-3">query_stats</span>
          <p className="text-on-surface-variant text-sm">5개 이상 기록하면<br />패턴을 분석해드려요</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32 bg-surface text-on-surface font-body pattern-dot-bg">
      {/* TopAppBar */}
      <header className="bg-surface/80 backdrop-blur-xl flex justify-between items-center px-8 h-16 w-full fixed top-0 z-50 max-w-[430px]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">flare</span>
          <h1 className="text-lg font-headline italic text-primary">패턴 분석</h1>
        </div>
        <nav className="flex gap-6">
          <button onClick={onGoGallery} className="text-secondary/60 font-body transition-colors hover:text-primary">갤러리</button>
          <button className="text-primary border-b-2 border-primary pb-1 font-body">패턴 분석</button>
        </nav>
      </header>

      <main className="px-6 pt-20 space-y-6">
        {/* Section 1: Dream Recording Frequency */}
        <section className="bg-surface-container-low p-6 rounded-xl shadow-[0_8px_32px_rgba(79,70,229,0.04)] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <span className="material-symbols-outlined text-6xl">calendar_month</span>
          </div>
          <h2 className="serif-title text-lg mb-6 tracking-tight flex items-center gap-2">
            꿈 기록 빈도
            <span className="text-xs font-body text-on-surface-variant font-normal">최근 14일</span>
          </h2>
          <div className="grid grid-cols-7 gap-y-4 text-center">
            {dayLabels.map(day => (
              <div key={day} className="text-[10px] text-on-surface-variant uppercase tracking-widest">{day}</div>
            ))}
            {dotCalendar.map((dot, i) => (
              <div key={i} className="flex justify-center">
                <div className={`w-4 h-4 rounded-full ${
                  dot.hasRecord
                    ? 'bg-primary shadow-[0_0_10px_rgba(167,165,255,0.4)]'
                    : 'border border-outline-variant/30'
                }`}></div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Top 5 Symbols */}
        <section className="bg-surface-container-low p-6 rounded-xl space-y-5">
          <h2 className="serif-title text-lg tracking-tight">자주 나오는 상징 TOP 5</h2>
          <div className="space-y-4">
            {topSymbols.map((sym, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-on-surface">{sym.label}</span>
                  <span className="text-on-surface-variant">{sym.count}</span>
                </div>
                <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary-container to-[#A78BFA] rounded-full shadow-[0_0_8px_rgba(79,70,229,0.3)]"
                    style={{
                      width: `${barWidths[i] || (sym.count / maxSymbolCount) * 90}%`,
                      opacity: 1 - i * 0.1,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Emotion Distribution */}
        <section className="bg-surface-container-low p-6 rounded-xl text-center relative">
          <h2 className="serif-title text-lg mb-8 tracking-tight text-left">감정 분포</h2>
          <div className="relative w-40 h-40 mx-auto mb-8">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {donutSegments.map((seg, i) => (
                <circle
                  key={i}
                  cx="50" cy="50" r="40"
                  fill="transparent"
                  stroke={seg.color}
                  strokeWidth="12"
                  strokeDasharray={seg.dashArray}
                  strokeDashoffset={seg.dashOffset}
                />
              ))}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-2xl font-bold font-body">{Math.round(emotionDist.reduce((s, e) => s + e.pct, 0))}%</span>
              <span className="text-[10px] text-on-surface-variant uppercase tracking-widest">분석 완료</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-left px-2">
            {emotionDist.slice(0, 4).map((e, i) => {
              const colors = ['#a88cfb', '#0d082c', '#ff6e84', '#4f46e5'];
              return (
                <div key={e.key} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors[i % colors.length] }}></div>
                  <span className="text-xs text-on-surface-variant">{e.label}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 4: Vividness Trend */}
        {vividnessTrend.length > 1 && (
          <section className="bg-surface-container-low p-6 rounded-xl h-48 flex flex-col justify-between">
            <h2 className="serif-title text-lg tracking-tight">꿈 선명도 추이</h2>
            <div className="relative h-24 w-full flex items-end justify-between px-2 group">
              {/* Y-axis lines */}
              <div className="absolute inset-0 flex flex-col justify-between opacity-10">
                {[0, 1, 2, 3, 4].map(i => (
                  <div key={i} className="border-t border-on-surface w-full"></div>
                ))}
              </div>
              {/* Dot markers */}
              {vividnessTrend.map((_, i) => (
                <div key={i} className="flex flex-col items-center justify-end h-full w-4">
                  <div
                    className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(167,165,255,0.6)] z-10"
                    style={{ marginBottom: `${dotHeights[i] || 30}px` }}
                  ></div>
                </div>
              ))}
              {/* SVG Line */}
              <svg className="absolute bottom-0 left-0 w-full h-full pointer-events-none overflow-visible" preserveAspectRatio="none">
                <path className="opacity-50" d="M 24 74 L 80 49 L 136 64 L 192 34 L 248 44 L 304 14 L 360 24" fill="none" stroke="#4f46e5" strokeWidth="2" />
              </svg>
            </div>
          </section>
        )}

        {/* Insights Card */}
        {insights.length > 0 && (
          <div className="bg-surface-container-high border border-primary/10 p-6 rounded-lg relative overflow-hidden">
            <div className="flex items-start gap-4">
              <div className="bg-primary/20 p-2 rounded-full">
                <span className="material-symbols-outlined text-primary icon-fill">auto_awesome</span>
              </div>
              <div>
                <h3 className="font-bold text-primary mb-1">패턴 인사이트</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  {insights[0]}
                </p>
              </div>
            </div>
            <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-primary/5 rounded-full blur-2xl"></div>
          </div>
        )}
      </main>

      {/* BottomNavBar — consistent 기록/갤러리/통계 */}
      <nav className="fixed bottom-0 w-full z-50 flex justify-around items-center px-8 pb-8 pt-4 bg-indigo-950/60 backdrop-blur-xl rounded-t-[40px] border-t border-white/10 shadow-[0_-8px_32px_rgba(79,70,229,0.15)] max-w-[430px]">
        <button onClick={onBack} className="flex flex-col items-center justify-center text-indigo-400/50 transition-all active:scale-90">
          <span className="material-symbols-outlined mb-1">edit_note</span>
          <span className="font-label text-[10px] tracking-wider">기록</span>
        </button>
        <button onClick={onGoGallery} className="flex flex-col items-center justify-center text-indigo-400/50 transition-all active:scale-90">
          <span className="material-symbols-outlined mb-1">auto_stories</span>
          <span className="font-label text-[10px] tracking-wider">갤러리</span>
        </button>
        <button className="flex flex-col items-center justify-center bg-indigo-500/20 text-indigo-100 rounded-full px-6 py-2 transition-all active:scale-90">
          <span className="material-symbols-outlined mb-1 icon-fill">insights</span>
          <span className="font-label text-[10px] tracking-wider">통계</span>
        </button>
      </nav>
    </div>
  );
}
