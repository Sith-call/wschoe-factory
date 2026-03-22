import React, { useMemo } from 'react';
import { ModelOutput } from '../types';

interface EconGraphProps {
  output: ModelOutput;
  modelId: string;
}

// Convert data coordinates to SVG coordinates within the graph area
function toSVG(
  point: { x: number; y: number },
  xRange: [number, number],
  yRange: [number, number],
  width: number,
  height: number,
  padding: number
): { sx: number; sy: number } {
  const graphW = width - padding * 2;
  const graphH = height - padding * 2;
  const sx = padding + ((point.x - xRange[0]) / (xRange[1] - xRange[0])) * graphW;
  const sy = padding + graphH - ((point.y - yRange[0]) / (yRange[1] - yRange[0])) * graphH;
  return { sx, sy };
}

const GDPBarChart: React.FC<{ output: ModelOutput }> = ({ output }) => {
  const total = output.curves.reduce((sum, c) => sum + Math.max(0, c.points[1]?.x ?? 0), 0);
  const barHeight = 40;
  const chartWidth = 360;
  const chartPadding = 20;

  return (
    <svg viewBox={`0 0 400 350`} className="w-full h-full">
      {/* Background label */}
      <text x="200" y="30" textAnchor="middle" className="font-headline text-sm font-bold" fill="#818a9d">
        GDP 구성요소
      </text>

      {/* Stacked horizontal bars */}
      {(() => {
        let cumX = chartPadding;
        return output.curves.map((curve, i) => {
          const value = Math.max(0, (curve.points[1]?.x ?? 0) - (curve.points[0]?.x ?? 0));
          const barW = total > 0 ? (value / total) * chartWidth : 0;
          const x = cumX;
          cumX += barW;
          const yPos = 80 + i * (barHeight + 30);

          return (
            <g key={curve.id}>
              {/* Label */}
              <text x={chartPadding} y={yPos - 8} fill="#45474c" className="font-body" fontSize="12" fontWeight="600">
                {curve.label}
              </text>
              {/* Bar background */}
              <rect x={chartPadding} y={yPos} width={chartWidth} height={barHeight} rx="4" fill="#e4e2df" opacity="0.3" />
              {/* Bar fill */}
              <rect x={chartPadding} y={yPos} width={barW > 0 ? (value / (total || 1)) * chartWidth : 0} height={barHeight} rx="4" fill={curve.color}>
                <animate attributeName="width" from="0" to={(value / (total || 1)) * chartWidth} dur="0.5s" fill="freeze" />
              </rect>
              {/* Value */}
              <text x={chartPadding + (value / (total || 1)) * chartWidth + 8} y={yPos + barHeight / 2 + 4} fill="#45474c" className="font-label" fontSize="11" fontWeight="700">
                {value.toFixed(0)}
              </text>
            </g>
          );
        });
      })()}

      {/* Total */}
      <text x="200" y="340" textAnchor="middle" fill="#040d1b" className="font-headline text-lg font-bold" fontSize="16">
        GDP = {total.toFixed(0)}
      </text>
    </svg>
  );
};

export const EconGraph: React.FC<EconGraphProps> = ({ output, modelId }) => {
  // For GDP, render a bar chart instead
  if (modelId === 'gdp') {
    return (
      <section className="relative bg-primary-container h-[420px] w-full p-8 overflow-hidden">
        {/* Grid Lines */}
        <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 opacity-10 pointer-events-none">
          {Array.from({ length: 64 }).map((_, i) => (
            <div key={i} className="border-r border-b border-surface-variant" />
          ))}
        </div>
        <div className="relative w-full h-full">
          <GDPBarChart output={output} />
        </div>
      </section>
    );
  }

  // Calculate ranges from all curve points
  const { xRange, yRange } = useMemo(() => {
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    output.curves.forEach(curve => {
      curve.points.forEach(p => {
        if (p.x < minX) minX = p.x;
        if (p.x > maxX) maxX = p.x;
        if (p.y < minY) minY = p.y;
        if (p.y > maxY) maxY = p.y;
      });
    });
    // Add some padding
    const xPad = (maxX - minX) * 0.1 || 10;
    const yPad = (maxY - minY) * 0.1 || 10;
    return {
      xRange: [minX - xPad, maxX + xPad] as [number, number],
      yRange: [minY - yPad, maxY + yPad] as [number, number],
    };
  }, [output.curves]);

  const svgW = 400;
  const svgH = 350;
  const pad = 40;

  // Convert equilibrium point
  const eqSVG = output.equilibrium
    ? toSVG({ x: output.equilibrium.quantity, y: output.equilibrium.price }, xRange, yRange, svgW, svgH, pad)
    : null;

  return (
    <section className="relative bg-primary-container h-[420px] w-full p-8 overflow-hidden">
      {/* Grid Lines */}
      <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 opacity-10 pointer-events-none">
        {Array.from({ length: 64 }).map((_, i) => (
          <div key={i} className="border-r border-b border-surface-variant" />
        ))}
      </div>

      <div className="relative w-full h-full border-l-2 border-b-2 border-primary-fixed-dim/30 flex items-end">
        {/* Axis Labels */}
        <span className="absolute -left-6 -top-4 font-label text-[10px] text-on-primary-container uppercase tracking-widest">
          가격 (P)
        </span>
        <span className="absolute -right-2 -bottom-6 font-label text-[10px] text-on-primary-container uppercase tracking-widest">
          수량 (Q)
        </span>

        {/* Graph Curves SVG */}
        <svg className="absolute inset-0 w-full h-full" fill="none" viewBox={`0 0 ${svgW} ${svgH}`}>
          {output.curves.map(curve => {
            if (curve.points.length < 2) return null;
            const pathData = curve.points
              .map((p, i) => {
                const { sx, sy } = toSVG(p, xRange, yRange, svgW, svgH, pad);
                return `${i === 0 ? 'M' : 'L'} ${sx} ${sy}`;
              })
              .join(' ');

            const lastPoint = curve.points[curve.points.length - 1];
            const lastSVG = toSVG(lastPoint, xRange, yRange, svgW, svgH, pad);

            // If label would overflow right edge, place it to the left of the curve end
            const labelX = lastSVG.sx + 8;
            const isNearRightEdge = labelX > svgW - 80;
            const adjustedX = isNearRightEdge ? lastSVG.sx - 8 : labelX;
            const textAnchor = isNearRightEdge ? 'end' as const : 'start' as const;

            // If label would overflow top/bottom, adjust Y
            const adjustedY = Math.max(pad + 14, Math.min(lastSVG.sy, svgH - pad - 4));

            return (
              <g key={curve.id}>
                <path d={pathData} stroke={curve.color} strokeLinecap="round" strokeWidth="3" />
                <text
                  className="font-headline text-xl font-black"
                  fill={curve.color}
                  x={adjustedX}
                  y={adjustedY}
                  fontSize="14"
                  fontWeight="800"
                  textAnchor={textAnchor}
                >
                  {curve.label}
                </text>
              </g>
            );
          })}

          {/* Equilibrium point */}
          {eqSVG && (
            <>
              <circle
                cx={eqSVG.sx}
                cy={eqSVG.sy}
                r="6"
                fill="#ffc971"
                className="drop-shadow-[0_0_8px_rgba(255,201,113,0.8)]"
              />
              {/* Guidelines to axes */}
              <line
                x1={eqSVG.sx}
                y1={eqSVG.sy}
                x2={eqSVG.sx}
                y2={svgH - pad}
                stroke="#ffc971"
                strokeDasharray="4 4"
                strokeWidth="1"
                opacity="0.5"
              />
              <line
                x1={pad}
                y1={eqSVG.sy}
                x2={eqSVG.sx}
                y2={eqSVG.sy}
                stroke="#ffc971"
                strokeDasharray="4 4"
                strokeWidth="1"
                opacity="0.5"
              />
            </>
          )}
        </svg>

        {/* Equilibrium Label Toast */}
        {output.equilibrium && (
          <div className="absolute top-4 right-4 bg-primary/40 backdrop-blur-md px-4 py-2 border border-outline-variant/10 rounded-lg z-20">
            <p className="font-label text-secondary-fixed-dim text-xs font-bold">
              {output.equilibrium.label}
            </p>
            {output.summary.length > 0 && (
              <p className="font-label text-secondary-fixed-dim text-[10px]">
                {output.summary[0].label}: {output.summary[0].valueAfter}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
