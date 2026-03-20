import { useMemo, useCallback, useState } from 'react';
import type { DreamEntry, DreamEmotionKey } from '../types';
import { EMOTIONS, PLACES, OBJECTS, PERSONS, getPatternInsights } from '../data';

interface Props {
  dreams: DreamEntry[];
  onGoGallery: () => void;
  onBack: () => void;
}

// Emotion gradient map for story cards
const STORY_GRADIENTS: Record<DreamEmotionKey, string> = {
  peace: 'from-indigo-900 via-blue-900 to-indigo-950',
  fear: 'from-slate-900 via-gray-900 to-indigo-950',
  confusion: 'from-purple-900 via-pink-900 to-indigo-950',
  joy: 'from-pink-900 via-amber-900 to-indigo-950',
  sorrow: 'from-indigo-900 via-violet-900 to-indigo-950',
  anger: 'from-red-950 via-purple-900 to-indigo-950',
  surprise: 'from-amber-900 via-pink-900 to-indigo-950',
  longing: 'from-indigo-900 via-cyan-900 to-indigo-950',
};

export default function PatternScreen({ dreams, onGoGallery, onBack }: Props) {
  const insights = useMemo(() => getPatternInsights(dreams), [dreams]);
  const [showDreamStory, setShowDreamStory] = useState(false);
  const [storyCardIndex, setStoryCardIndex] = useState(0);

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

  // Dream Color Palette — extract emotion gradients with frequency
  const dreamColorPalette = useMemo(() => {
    const emotionCounts: Record<string, number> = {};
    dreams.forEach(d => d.emotions.forEach(e => { emotionCounts[e] = (emotionCounts[e] || 0) + 1; }));
    return EMOTIONS
      .filter(e => emotionCounts[e.key])
      .map(e => ({ ...e, count: emotionCounts[e.key] || 0 }))
      .sort((a, b) => b.count - a.count);
  }, [dreams]);

  const maxPaletteCount = dreamColorPalette.length > 0 ? dreamColorPalette[0].count : 1;

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

  // Dream Story cards — Spotify Wrapped style narrative
  const storyCards = useMemo(() => {
    if (dreams.length < 3) return [];

    const dreamCount = dreams.length;

    // Top place
    const placeCounts: Record<string, number> = {};
    dreams.forEach(d => { placeCounts[d.scene.place] = (placeCounts[d.scene.place] || 0) + 1; });
    const topPlaceKey = Object.entries(placeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '';
    const topPlace = PLACES.find(p => p.key === topPlaceKey)?.label || '미지의 장소';
    const topPlaceCount = placeCounts[topPlaceKey] || 0;
    const placeInsight = topPlaceCount >= 3
      ? `${dreamCount}개의 꿈 중 ${topPlaceCount}번이나 이곳을 찾았어요. 무의식이 이곳에서 전하고 싶은 이야기가 있는 것 같아요.`
      : `이 장소가 가장 자주 당신의 꿈에 나타났어요.`;

    // Emotion arc (first recorded vs most recent)
    const oldestDream = dreams[dreams.length - 1];
    const newestDream = dreams[0];
    const emotionStart = EMOTIONS.find(e => e.key === oldestDream.emotions[0])?.label || '알 수 없음';
    const emotionEnd = EMOTIONS.find(e => e.key === newestDream.emotions[0])?.label || '알 수 없음';
    const emotionArcInsight = emotionStart === emotionEnd
      ? `'${emotionStart}'이라는 감정이 꾸준히 당신의 꿈을 관통하고 있어요.`
      : `감정의 흐름이 변화하고 있어요. 당신의 내면이 움직이고 있다는 신호예요.`;

    // Deep insight from pattern analysis
    const patternInsights = getPatternInsights(dreams);
    const deepInsight = patternInsights.length > 0
      ? patternInsights[0]
      : '당신의 무의식은 매일 밤 작은 이야기를 만들고 있어요. 계속 기록해보세요.';

    // Dominant emotion for gradients
    const emotionCounts: Record<string, number> = {};
    dreams.forEach(d => d.emotions.forEach(e => { emotionCounts[e] = (emotionCounts[e] || 0) + 1; }));
    const dominantEmotion = Object.entries(emotionCounts).sort((a, b) => b[1] - a[1])[0]?.[0] as DreamEmotionKey || 'peace';

    return [
      {
        text: `이번 달, 당신은 ${dreamCount}번의 꿈을 기록했어요.`,
        subtext: streak > 0 ? `${streak}일 연속으로 꿈을 기록하고 있어요.` : '꾸준히 기록할수록 더 깊은 이야기가 펼쳐져요.',
        gradient: 'from-indigo-900 via-purple-900 to-indigo-950',
      },
      {
        text: `가장 자주 찾아온 장소는\n'${topPlace}'였어요.`,
        subtext: placeInsight,
        gradient: STORY_GRADIENTS[dominantEmotion] || 'from-indigo-900 via-purple-900 to-indigo-950',
      },
      {
        text: `당신의 감정은\n'${emotionStart}'에서 '${emotionEnd}'으로\n이동했어요.`,
        subtext: emotionArcInsight,
        gradient: 'from-violet-900 via-blue-900 to-indigo-950',
      },
      {
        text: '당신의 무의식이\n전하는 메시지',
        subtext: deepInsight,
        gradient: 'from-indigo-950 via-slate-900 to-indigo-950',
      },
    ];
  }, [dreams, streak]);

  const handleStoryNext = useCallback(() => {
    if (storyCardIndex < storyCards.length - 1) {
      setStoryCardIndex(prev => prev + 1);
    }
  }, [storyCardIndex, storyCards.length]);

  const handleStoryPrev = useCallback(() => {
    if (storyCardIndex > 0) {
      setStoryCardIndex(prev => prev - 1);
    }
  }, [storyCardIndex]);

  const handleOpenStory = useCallback(() => {
    setStoryCardIndex(0);
    setShowDreamStory(true);
  }, []);

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
    <div className="min-h-screen pb-32 bg-surface text-on-surface font-body pattern-dot-bg screen-enter">
      {/* Dream Story Overlay */}
      {showDreamStory && storyCards.length > 0 && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Background */}
          <div className={`absolute inset-0 bg-gradient-to-b ${storyCards[storyCardIndex].gradient} transition-all duration-700`} />

          {/* Card content */}
          <div
            className="relative z-10 w-full max-w-[430px] h-full flex flex-col items-center justify-center px-10 text-center"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              if (clickX > rect.width / 2) handleStoryNext();
              else handleStoryPrev();
            }}
          >
            {/* Close button */}
            <button
              onClick={(e) => { e.stopPropagation(); setShowDreamStory(false); }}
              className="absolute top-6 right-6 text-white/40 hover:text-white/80 transition-colors z-20"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            {/* Main text */}
            <div key={storyCardIndex} className="screen-enter">
              <h2 className="font-headline text-3xl leading-relaxed text-white/90 mb-6 whitespace-pre-line font-bold tracking-tight drop-shadow-[0_0_20px_rgba(195,192,255,0.3)]">
                {storyCards[storyCardIndex].text}
              </h2>
              <p className="text-white/60 text-sm leading-relaxed max-w-[320px] mx-auto font-light tracking-wide">
                {storyCards[storyCardIndex].subtext}
              </p>
            </div>

            {/* Share button on last card */}
            {storyCardIndex === storyCards.length - 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); setShowDreamStory(false); }}
                className="mt-12 px-8 py-3 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm font-medium tracking-wider backdrop-blur-sm hover:bg-white/20 transition-all screen-enter"
              >
                돌아가기
              </button>
            )}

            {/* Dot indicators */}
            <div className="absolute bottom-16 flex gap-2">
              {storyCards.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === storyCardIndex
                      ? 'w-6 bg-white/80'
                      : 'w-1.5 bg-white/30'
                  }`}
                />
              ))}
            </div>

            {/* Navigation hint */}
            {storyCardIndex < storyCards.length - 1 && (
              <p className="absolute bottom-8 text-white/20 text-[10px] tracking-widest uppercase">탭하여 다음</p>
            )}
          </div>
        </div>
      )}

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
        {/* Dream Story CTA */}
        {storyCards.length > 0 && (
          <button
            onClick={handleOpenStory}
            className="w-full p-5 rounded-xl bg-gradient-to-r from-indigo-900/80 via-purple-900/60 to-indigo-900/80 border border-white/10 flex items-center justify-between group hover:border-white/20 transition-all duration-300 living-canvas"
            style={{ backgroundSize: '200% 200%' }}
          >
            <div className="text-left">
              <p className="font-headline text-lg text-white/90 mb-1">이번 달의 꿈 이야기 보기</p>
              <p className="text-[11px] text-white/50 tracking-wide">당신의 무의식이 만든 내러티브</p>
            </div>
            <span className="material-symbols-outlined text-white/40 group-hover:text-white/70 group-hover:translate-x-1 transition-all">arrow_forward</span>
          </button>
        )}
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

        {/* Section 5: Dream Color Palette — "나의 꿈 컬러 팔레트" */}
        {dreamColorPalette.length > 0 && (
          <section className="bg-surface-container-low p-6 rounded-xl space-y-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <span className="material-symbols-outlined text-6xl">palette</span>
            </div>
            <h2 className="serif-title text-lg tracking-tight">나의 꿈 컬러 팔레트</h2>
            <p className="text-xs text-on-surface-variant -mt-3">이번 달 꿈에서 추출한 감정 색상</p>
            <div className="flex gap-2 items-end">
              {dreamColorPalette.map(e => {
                // Scale width proportional to frequency: min 36px, max ~80px
                const ratio = e.count / maxPaletteCount;
                const width = Math.round(36 + ratio * 44);
                const height = Math.round(48 + ratio * 32);
                return (
                  <div key={e.key} className="flex flex-col items-center gap-2">
                    <div
                      className="rounded-xl shadow-lg transition-all"
                      style={{
                        width: `${width}px`,
                        height: `${height}px`,
                        background: `linear-gradient(135deg, ${e.gradient[0]} 0%, ${e.gradient[1]} 100%)`,
                        boxShadow: `0 4px 16px ${e.gradient[0]}40`,
                      }}
                    />
                    <span className="text-[10px] text-on-surface-variant font-medium">{e.label}</span>
                    <span className="text-[9px] text-on-surface-variant/50">{e.count}회</span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Section 6: Dream Word Cloud — "꿈의 키워드 맵" */}
        {topSymbols.length > 0 && (
          <section className="bg-surface-container-low p-6 rounded-xl space-y-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <span className="material-symbols-outlined text-6xl">cloud</span>
            </div>
            <h2 className="serif-title text-lg tracking-tight">꿈의 키워드 맵</h2>
            <p className="text-xs text-on-surface-variant -mt-3">자주 등장하는 상징과 키워드</p>
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 py-4 min-h-[80px]">
              {topSymbols.map((sym, i) => {
                // Font size proportional to frequency: min 14px, max 32px
                const ratio = sym.count / maxSymbolCount;
                const fontSize = Math.round(14 + ratio * 18);
                // Varying opacity: most frequent = full, decreasing
                const opacity = 0.5 + ratio * 0.5;
                // Semi-random padding for cloud effect
                const paddingTop = [2, 8, 0, 12, 4][i % 5];
                const paddingLeft = [4, 0, 8, 2, 6][i % 5];
                return (
                  <span
                    key={i}
                    className="font-headline text-primary inline-block transition-all"
                    style={{
                      fontSize: `${fontSize}px`,
                      opacity,
                      paddingTop: `${paddingTop}px`,
                      paddingLeft: `${paddingLeft}px`,
                    }}
                  >
                    {sym.label}
                  </span>
                );
              })}
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
