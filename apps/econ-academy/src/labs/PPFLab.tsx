import React, { useState, useCallback } from 'react';

interface Props {
  onComplete: () => void;
  completed: boolean;
}

// Interactive PPF with draggable production point
export function PPFLab({ onComplete, completed }: Props) {
  const [pointX, setPointX] = useState(50);
  const [pointY, setPointY] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [visited, setVisited] = useState<Set<string>>(new Set());

  const W = 320, H = 280, PAD = 45;
  const plotW = W - PAD * 2, plotH = H - PAD * 2;

  const MAX = 100;
  // PPF: x^2 + y^2 = MAX^2 (quarter circle)
  const ppfY = (x: number) => Math.sqrt(Math.max(0, MAX * MAX - x * x));

  const toSvgX = (x: number) => PAD + (x / MAX) * plotW;
  const toSvgY = (y: number) => PAD + ((MAX - y) / MAX) * plotH;

  const fromSvgX = (sx: number) => Math.max(0, Math.min(MAX, ((sx - PAD) / plotW) * MAX));
  const fromSvgY = (sy: number) => Math.max(0, Math.min(MAX, MAX - ((sy - PAD) / plotH) * MAX));

  const onPPF = Math.abs(pointX * pointX + pointY * pointY - MAX * MAX) < 500;
  const inside = pointX * pointX + pointY * pointY < MAX * MAX - 500;
  const outside = pointX * pointX + pointY * pointY > MAX * MAX + 500;

  const classify = () => {
    if (onPPF) return { label: '효율적 생산', color: 'text-success', desc: '자원을 최대한 활용하고 있습니다. PPF 위의 모든 점은 효율적입니다.' };
    if (inside) return { label: '비효율적 생산', color: 'text-warning', desc: '자원이 낭비되고 있습니다. 두 재화 모두 더 생산할 여지가 있습니다.' };
    return { label: '달성 불가능', color: 'text-error', desc: '현재 기술과 자원으로는 불가능한 생산 조합입니다.' };
  };

  const status = classify();

  const handleMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const svgX = (e.clientX - rect.left) / rect.width * W;
    const svgY = (e.clientY - rect.top) / rect.height * H;
    const x = Math.round(fromSvgX(svgX));
    const y = Math.round(fromSvgY(svgY));
    setPointX(x);
    setPointY(y);
  }, [isDragging]);

  const handleUp = () => {
    if (isDragging) {
      setIsDragging(false);
      const zone = onPPF ? 'on' : inside ? 'inside' : 'outside';
      setVisited(prev => new Set(prev).add(zone));
    }
  };

  const canComplete = visited.size >= 3;

  // PPF curve points
  const curvePoints = Array.from({ length: 50 }, (_, i) => {
    const x = (i / 49) * MAX;
    const y = ppfY(x);
    return `${toSvgX(x)},${toSvgY(y)}`;
  }).join(' ');

  return (
    <div>
      <h3 className="font-display text-base font-semibold text-ink mb-2">
        생산가능곡선(PPF) 시뮬레이션
      </h3>
      <p className="text-sm text-ink-secondary mb-4">
        초록색 점을 드래그하여 식량과 공산품의 생산 조합을 바꿔보세요.
        곡선 위, 안쪽, 바깥쪽에서 어떤 의미인지 확인하세요.
      </p>

      <div className="bg-stone-50 rounded-lg p-2 mb-4 select-none">
        <svg
          width="100%" viewBox={`0 0 ${W} ${H}`}
          onMouseMove={handleMove}
          onMouseUp={handleUp}
          onMouseLeave={handleUp}
          style={{ cursor: isDragging ? 'grabbing' : 'default' }}
        >
          {/* Axes */}
          <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke="#A8A29E" strokeWidth={1} />
          <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="#A8A29E" strokeWidth={1} />
          <text x={W / 2} y={H - 8} fontSize={11} fill="#78716C" textAnchor="middle">식량</text>
          <text x={12} y={H / 2} fontSize={11} fill="#78716C" textAnchor="middle" transform={`rotate(-90, 12, ${H / 2})`}>공산품</text>

          {/* PPF curve */}
          <polyline points={curvePoints} fill="none" stroke="#0D9488" strokeWidth={2.5} />

          {/* Shaded feasible region */}
          <path
            d={`M ${toSvgX(0)} ${toSvgY(0)} L ${curvePoints.split(' ').join(' L ')} L ${toSvgX(0)} ${toSvgY(0)} Z`}
            fill="#0D9488" fillOpacity={0.05}
          />

          {/* Draggable point */}
          <circle
            cx={toSvgX(pointX)} cy={toSvgY(pointY)} r={10}
            fill={onPPF ? '#16A34A' : inside ? '#CA8A04' : '#DC2626'}
            fillOpacity={0.8}
            stroke="white" strokeWidth={2}
            style={{ cursor: 'grab' }}
            onMouseDown={(e) => { e.preventDefault(); setIsDragging(true); }}
          />

          {/* Point label */}
          <text
            x={toSvgX(pointX) + 14} y={toSvgY(pointY) - 8}
            fontSize={10} fill="#1C1917" fontWeight={500}
          >
            ({pointX}, {pointY})
          </text>

          {/* Opportunity cost arrow */}
          {onPPF && pointX > 20 && pointX < 80 && (
            <text x={toSvgX(pointX) + 14} y={toSvgY(pointY) + 16} fontSize={9} fill="#78716C">
              MRT(한계전환율): 식량 1단위 = 공산품 {(pointX / Math.sqrt(MAX * MAX - pointX * pointX)).toFixed(1)}단위
            </text>
          )}
        </svg>
      </div>

      {/* Status */}
      <div className={`rounded-lg p-3 mb-4 ${onPPF ? 'bg-green-50' : inside ? 'bg-amber-50' : 'bg-red-50'}`}>
        <p className={`text-sm font-semibold mb-1 ${status.color}`}>{status.label}</p>
        <p className="text-sm text-ink">{status.desc}</p>
      </div>

      {/* Zone progress */}
      <div className="flex gap-2 mb-4">
        {[
          { key: 'on', label: '곡선 위', done: visited.has('on') },
          { key: 'inside', label: '곡선 안쪽', done: visited.has('inside') },
          { key: 'outside', label: '곡선 바깥', done: visited.has('outside') },
        ].map(z => (
          <div key={z.key} className={`flex-1 text-center text-xs py-1.5 rounded-md border ${z.done ? 'bg-primary-light border-primary text-primary' : 'bg-stone-50 border-border text-ink-secondary'}`}>
            {z.done ? '✓ ' : ''}{z.label}
          </div>
        ))}
      </div>

      {completed ? (
        <p className="text-sm text-success font-medium">실험 완료! 마스터 달성</p>
      ) : (
        <button
          onClick={onComplete}
          disabled={!canComplete}
          className={`w-full rounded-md px-5 py-3 font-medium transition-colors ${
            canComplete ? 'bg-primary text-white hover:bg-primary-dark' : 'bg-stone-200 text-ink-disabled cursor-not-allowed'
          }`}
        >
          {canComplete ? '실험 완료' : '3개 영역 모두 방문하세요'}
        </button>
      )}
    </div>
  );
}
