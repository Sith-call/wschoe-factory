import { useMemo, useCallback } from 'react';
import type { DreamEntry } from '../types';
import { EMOTIONS, PLACES, OBJECTS, PERSONS, getPatternInsights } from '../data';

interface Props {
  dreams: DreamEntry[];
  onGoGallery: () => void;
  onBack: () => void;
}

export default function PatternScreen({ dreams, onGoGallery, onBack }: Props) {
  const insights = useMemo(() => getPatternInsights(dreams), [dreams]);

  // Monthly calendar for current month
  const monthCalendar = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-indexed
    const today = now.getDate();

    // First day of month (0=Sun, adjust to Mon-based: Mon=0 ... Sun=6)
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const mondayOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const dreamDates = new Set(dreams.map(d => d.date.split('T')[0]));

    const cells: { day: number | null; hasRecord: boolean; isFuture: boolean }[] = [];

    // Empty cells before 1st
    for (let i = 0; i < mondayOffset; i++) {
      cells.push({ day: null, hasRecord: false, isFuture: false });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const isFuture = d > today;
      cells.push({ day: d, hasRecord: dreamDates.has(dateStr), isFuture });
    }

    const monthName = `${year}년 ${month + 1}월`;
    return { cells, monthName };
  }, [dreams]);

  // Streak counter — consecutive days with at least one dream record ending at today or yesterday
  const streak = useMemo(() => {
    const dreamDates = new Set(dreams.map(d => d.date.split('T')[0]));
    const now = new Date();
    let count = 0;
    // Start from today and go backwards
    for (let i = 0; i < 365; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      if (dreamDates.has(dateStr)) {
        count++;
      } else {
        // Allow streak to start from yesterday if today has no record yet
        if (i === 0) continue;
        break;
      }
    }
    return count;
  }, [dreams]);

  const dayLabels = ['월', '화', '수', '목', '금', '토', '일'];

  // Top 5 symbols — count places, objects, AND persons
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
      d.scene.characters.forEach(c => {
        const per = PERSONS.find(p => p.key === c);
        if (per) {
          counts[c] = counts[c] || { label: per.label, count: 0 };
          counts[c].count++;
        }
      });
    });
    return Object.values(counts).sort((a, b) => b.count - a.count).slice(0, 5);
  }, [dreams]);

  const maxSymbolCount = topSymbols.length > 0 ? topSymbols[0].count : 1;

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

  // Vividness trend — use actual data, map 1-5 range to 20-80px
  const vividnessTrend = useMemo(() => {
    return dreams.slice(0, 7).reverse().map(d => d.vividness);
  }, [dreams]);

  const dotHeights = useMemo(() => {
    return vividnessTrend.map(v => 20 + (v - 1) * 15);
  }, [vividnessTrend]);

  // Generate SVG path from actual data points
  const vividnessSvgPath = useMemo(() => {
    if (vividnessTrend.length < 2) return '';
    const chartHeight = 96; // h-24 = 96px
    const points = vividnessTrend.map((_v, i) => {
      const x = 24 + i * (336 / Math.max(vividnessTrend.length - 1, 1));
      const y = chartHeight - dotHeights[i] - 4; // offset for dot radius
      return { x, y };
    });
    return 'M ' + points.map(p => `${p.x} ${p.y}`).join(' L ');
  }, [vividnessTrend, dotHeights]);

  // Export handler
  const handleExport = useCallback(() => {
    const blob = new Blob([JSON.stringify(dreams, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dream-factory-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [dreams]);

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
        {/* Section 1: Monthly Dream Recording Calendar */}
        <section className="bg-surface-container-low p-6 rounded-xl shadow-[0_8px_32px_rgba(79,70,229,0.04)] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <span className="material-symbols-outlined text-6xl">calendar_month</span>
          </div>
          <h2 className="serif-title text-lg mb-2 tracking-tight flex items-center gap-2">
            꿈 기록 달력
          </h2>
          <p className="text-xs text-on-surface-variant mb-5">{monthCalendar.monthName}</p>
          <div className="grid grid-cols-7 gap-y-3 text-center">
            {dayLabels.map(day => (
              <div key={day} className="text-[10px] text-on-surface-variant uppercase tracking-widest">{day}</div>
            ))}
            {monthCalendar.cells.map((cell, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                {cell.day !== null ? (
                  <>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      cell.isFuture
                        ? ''
                        : cell.hasRecord
                          ? 'bg-primary shadow-[0_0_10px_rgba(167,165,255,0.4)]'
                          : 'border border-outline-variant/30'
                    }`}>
                      {cell.isFuture ? null : null}
                    </div>
                    <span className={`text-[9px] ${cell.isFuture ? 'text-on-surface-variant/30' : 'text-on-surface-variant/60'}`}>{cell.day}</span>
                  </>
                ) : (
                  <div className="w-5 h-5"></div>
                )}
              </div>
            ))}
          </div>

          {/* Streak Counter */}
          <div className="mt-6 pt-4 border-t border-outline-variant/10 flex items-center gap-3">
            <span className="material-symbols-outlined text-2xl text-amber-400">local_fire_department</span>
            {streak > 0 ? (
              <div>
                <p className="text-sm font-bold text-on-surface">연속 {streak}일 기록 중</p>
                <p className="text-[10px] text-on-surface-variant">꾸준한 기록이 더 깊은 자기 이해로 이어져요</p>
              </div>
            ) : (
              <div>
                <p className="text-sm font-medium text-on-surface-variant">오늘 첫 기록을 시작해보세요</p>
                <p className="text-[10px] text-on-surface-variant/60">매일 기록하면 연속 기록이 쌓여요</p>
              </div>
            )}
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
                      width: `${Math.max((sym.count / maxSymbolCount) * 100, 8)}%`,
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
              <span className="text-lg font-bold font-body">{emotionDist.length > 0 ? emotionDist[0].label : '—'}</span>
              <span className="text-[10px] text-on-surface-variant uppercase tracking-widest">가장 많은 감정</span>
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
              {/* SVG Line — data-driven path */}
              {vividnessSvgPath && (
                <svg className="absolute bottom-0 left-0 w-full h-full pointer-events-none overflow-visible" preserveAspectRatio="none">
                  <path className="opacity-50" d={vividnessSvgPath} fill="none" stroke="#4f46e5" strokeWidth="2" />
                </svg>
              )}
            </div>
          </section>
        )}

        {/* Insights Cards — show all insights */}
        {insights.length > 0 && (
          <div className="space-y-4">
            {insights.map((insight, i) => (
              <div key={i} className="bg-surface-container-high border border-primary/10 p-6 rounded-lg relative overflow-hidden">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/20 p-2 rounded-full">
                    <span className="material-symbols-outlined text-primary icon-fill">auto_awesome</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-primary mb-1">패턴 인사이트</h3>
                    <p className="text-sm text-on-surface-variant leading-relaxed">
                      {insight}
                    </p>
                  </div>
                </div>
                <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-primary/5 rounded-full blur-2xl"></div>
              </div>
            ))}
          </div>
        )}

        {/* Export Button */}
        <button
          onClick={handleExport}
          className="w-full py-3 rounded-xl border border-primary/20 text-primary text-sm font-medium flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors"
        >
          <span className="material-symbols-outlined text-lg">download</span>
          꿈 기록 내보내기 (JSON)
        </button>
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
