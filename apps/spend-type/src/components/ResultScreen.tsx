import { useEffect, useState } from 'react';
import { resultTypes, type SpendType } from '../data';

function lightenColor(hex: string, amount: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `#${Math.min(255, r + Math.round((255 - r) * amount)).toString(16).padStart(2, '0')}${Math.min(255, g + Math.round((255 - g) * amount)).toString(16).padStart(2, '0')}${Math.min(255, b + Math.round((255 - b) * amount)).toString(16).padStart(2, '0')}`;
}

interface ResultScreenProps {
  topType: SpendType;
  scores: Record<SpendType, number>;
  onRetry: () => void;
}

export default function ResultScreen({ topType, scores, onRetry }: ResultScreenProps) {
  const result = resultTypes[topType];
  const [animatedWidths, setAnimatedWidths] = useState<Record<string, number>>({});

  const sortedScores = Object.entries(scores).sort(([, a], [, b]) => b - a).slice(0, 4);
  const maxScore = Math.max(...Object.values(scores), 1);

  useEffect(() => {
    const timer = setTimeout(() => {
      const w: Record<string, number> = {};
      for (const [type, score] of sortedScores) w[type] = (score / maxScore) * 100;
      setAnimatedWidths(w);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleShare = async () => {
    const text = `나의 소비 유형은 "${result.title}" ${result.emoji}\n${result.description}\n\n나도 테스트 해보기 →`;
    if (navigator.share) { try { await navigator.share({ title: '소비유형 테스트 결과', text }); } catch {} }
    else { await navigator.clipboard.writeText(text); alert('결과가 클립보드에 복사되었습니다!'); }
  };

  const heroEnd = lightenColor(result.color, 0.15);

  // All styles use inline to guarantee exact Stitch match regardless of Tailwind version
  return (
    <div style={{
      position: 'relative', display: 'flex', minHeight: '100vh', flexDirection: 'column',
      background: 'linear-gradient(to bottom, #fdf2f8, #f5f3ff)', overflowX: 'hidden',
      fontFamily: "'Plus Jakarta Sans', 'Pretendard', sans-serif",
    }}>
      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 32, paddingBottom: 16 }}>
        <span style={{ color: 'rgba(147,13,242,0.7)', fontSize: 14, fontWeight: 600, letterSpacing: '0.025em' }}>
          당신의 소비 유형은
        </span>
      </div>

      {/* Hero Card */}
      <div style={{ padding: '0 20px 24px' }}>
        <div style={{
          position: 'relative', overflow: 'hidden', borderRadius: 16,
          padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
          background: `linear-gradient(135deg, ${result.color}, ${heroEnd})`,
          boxShadow: `0 20px 40px ${result.color}33`,
        }}>
          <div style={{ marginBottom: 24, padding: 16, borderRadius: 9999, backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)' }}>
            <span style={{ fontSize: 60 }}>{result.emoji}</span>
          </div>
          <h1 style={{ color: '#fff', fontSize: 30, fontWeight: 700, marginBottom: 16, letterSpacing: '-0.01em' }}>{result.title}</h1>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16, lineHeight: 1.6, fontWeight: 500 }}>{result.description}</p>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 128, height: 128, borderRadius: 9999, background: 'rgba(255,255,255,0.1)', filter: 'blur(40px)' }} />
          <div style={{ position: 'absolute', bottom: -40, left: -40, width: 128, height: 128, borderRadius: 9999, background: 'rgba(0,0,0,0.1)', filter: 'blur(40px)' }} />
        </div>
      </div>

      {/* Traits Card */}
      <div style={{ padding: '0 20px', marginBottom: 24 }}>
        <div style={{
          backgroundColor: '#ffffff', borderRadius: 16, padding: 24,
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)', border: '1px solid rgba(147,13,242,0.05)',
        }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8, color: '#0f172a' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#930df2">
              <path d="M23 12l-2.44-2.79.34-3.69-3.61-.82-1.89-3.2L12 2.96 8.6 1.5 6.71 4.69 3.1 5.5l.34 3.7L1 12l2.44 2.79-.34 3.7 3.61.82L8.6 22.5 12 21.04l3.4 1.46 1.89-3.19 3.61-.82-.34-3.69L23 12zm-12.91 4.72l-3.8-3.81 1.48-1.48 2.32 2.33 5.85-5.87 1.48 1.48-7.33 7.35z"/>
            </svg>
            나의 소비 특성
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {result.traits.map((trait, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <div style={{
                  flexShrink: 0, width: 24, height: 24, borderRadius: 9999,
                  backgroundColor: 'rgba(147,13,242,0.1)', color: '#930df2',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700,
                }}>
                  {i + 1}
                </div>
                <p style={{ fontSize: 15, lineHeight: 1.4, color: '#334155' }}>{trait}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Card */}
      <div style={{ padding: '0 20px', marginBottom: 40 }}>
        <div style={{
          backgroundColor: '#ffffff', borderRadius: 16, padding: 24,
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)', border: '1px solid rgba(147,13,242,0.05)',
        }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8, color: '#0f172a' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#930df2">
              <path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z"/>
            </svg>
            소비 유형 분석
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {sortedScores.map(([type, score], i) => {
              const info = resultTypes[type as SpendType];
              const width = animatedWidths[type] ?? 0;
              const pct = Math.round((score / maxScore) * 100);
              const barColor = i === 0 ? info.color : i === 1 ? '#930df2' : '#cbd5e1';
              const pctColor = i === 0 ? info.color : i === 1 ? '#930df2' : '#94a3b8';
              return (
                <div key={type}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#334155' }}>{info.name}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: pctColor }}>{pct}%</span>
                  </div>
                  <div style={{ width: '100%', height: 12, backgroundColor: '#f1f5f9', borderRadius: 9999, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: 9999, backgroundColor: barColor,
                      width: `${width}%`, transition: 'width 1s ease-out',
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div style={{ padding: '0 20px 48px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button onClick={handleShare} style={{
          width: '100%', padding: '16px 0', borderRadius: 16, border: 'none', cursor: 'pointer',
          backgroundColor: '#FEE500', color: '#3C1E1E', fontWeight: 700, fontSize: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
          </svg>
          카카오톡으로 공유하기
        </button>
        <button onClick={onRetry} style={{
          width: '100%', padding: '16px 0', borderRadius: 16, cursor: 'pointer',
          backgroundColor: 'transparent', border: '2px solid rgba(147,13,242,0.2)',
          color: '#930df2', fontWeight: 700, fontSize: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#930df2">
            <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
          </svg>
          다시 테스트하기
        </button>
      </div>

      {/* Bottom Nav — Stitch exact */}
      <div style={{
        marginTop: 'auto', borderTop: '1px solid #e2e8f0',
        backgroundColor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(12px)',
        padding: '12px 16px', display: 'flex', justifyContent: 'space-around',
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="#930df2"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="#94a3b8"><path d="M11 2v20c-5.07-.5-9-4.79-9-10s3.93-9.5 9-10zm2.03 0v8.99H22c-.47-4.68-4.3-8.49-8.97-8.99zM13.03 13.01V22c4.67-.5 8.5-4.31 8.97-8.99h-8.97z"/></svg>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="#94a3b8"><path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="#94a3b8"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
      </div>
    </div>
  );
}
