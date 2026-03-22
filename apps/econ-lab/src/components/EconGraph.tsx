import React, { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import { ModelOutput } from '../types';

interface EconGraphProps {
  output: ModelOutput;
  modelId: string;
  large?: boolean;
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

// Inverse: SVG coords back to data coords
function fromSVG(
  sx: number,
  sy: number,
  xRange: [number, number],
  yRange: [number, number],
  width: number,
  height: number,
  padding: number
): { x: number; y: number } {
  const graphW = width - padding * 2;
  const graphH = height - padding * 2;
  const x = xRange[0] + ((sx - padding) / graphW) * (xRange[1] - xRange[0]);
  const y = yRange[0] + ((padding + graphH - sy) / graphH) * (yRange[1] - yRange[0]);
  return { x, y };
}

const GDPBarChart: React.FC<{ output: ModelOutput }> = ({ output }) => {
  // Calculate actual component values (end - start of each curve's points)
  const values = output.curves.map(c => Math.max(0, (c.points[1]?.x ?? 0) - (c.points[0]?.x ?? 0)));
  const total = values.reduce((sum, v) => sum + v, 0);
  const maxVal = Math.max(...values, 1);
  const barHeight = 36;
  const chartWidth = 320;
  const chartPadding = 30;

  return (
    <svg viewBox="0 0 400 360" className="w-full h-full">
      {/* Title */}
      <text x="200" y="28" textAnchor="middle" className="font-headline" fontSize="14" fontWeight="700" fill="#9ca3af">
        GDP 구성요소
      </text>

      {/* Individual horizontal bars — absolute value, not ratio */}
      {output.curves.map((curve, i) => {
        const value = values[i];
        const barW = maxVal > 0 ? (value / maxVal) * chartWidth : 0;
        const yPos = 60 + i * (barHeight + 24);

        return (
          <g key={curve.id}>
            {/* Label */}
            <text x={chartPadding} y={yPos - 6} fill="#d1d5db" className="font-body" fontSize="12" fontWeight="600">
              {curve.label}
            </text>
            {/* Bar background */}
            <rect x={chartPadding} y={yPos} width={chartWidth} height={barHeight} rx="6" fill="#374151" opacity="0.4" />
            {/* Bar fill */}
            <rect x={chartPadding} y={yPos} width={barW} height={barHeight} rx="6" fill={curve.color} opacity="0.9">
              <animate attributeName="width" from="0" to={barW} dur="0.5s" fill="freeze" />
            </rect>
            {/* Value inside bar */}
            <text x={chartPadding + Math.max(barW - 8, 30)} y={yPos + barHeight / 2 + 5} textAnchor="end" fill="#ffffff" className="font-label" fontSize="13" fontWeight="700">
              {value.toFixed(0)}
            </text>
          </g>
        );
      })}

      {/* Total GDP */}
      <text x="200" y="340" textAnchor="middle" fill="#ffc971" className="font-headline" fontSize="18" fontWeight="800">
        GDP = {total.toFixed(0)}
      </text>
    </svg>
  );
};

const MultiplierBarChart: React.FC<{ output: ModelOutput }> = ({ output }) => {
  const maxVal = Math.max(...output.curves.map(c => c.points[1]?.y ?? 0));
  const chartW = 360;
  const chartH = 280;
  const chartPadding = 30;
  const barWidth = (chartW - chartPadding * 2) / output.curves.length - 4;

  return (
    <svg viewBox="0 0 400 350" className="w-full h-full">
      <text x="200" y="24" textAnchor="middle" className="font-headline text-sm font-bold" fill="#818a9d">
        연쇄 소비 라운드
      </text>

      {/* Y-axis label */}
      <text x="12" y="170" textAnchor="middle" className="font-label" fontSize="10" fill="#818a9d" transform="rotate(-90, 12, 170)">
        지출액 (조원)
      </text>

      {/* Bars */}
      {output.curves.map((curve, i) => {
        const value = curve.points[1]?.y ?? 0;
        const barH = maxVal > 0 ? (value / maxVal) * (chartH - 40) : 0;
        const x = chartPadding + i * (barWidth + 4);
        const y = chartH - barH + 20;

        return (
          <g key={curve.id}>
            <rect x={x} y={y} width={barWidth} height={barH} rx="3" fill={curve.color} opacity="0.85">
              <animate attributeName="height" from="0" to={barH} dur="0.4s" fill="freeze" />
              <animate attributeName="y" from={chartH + 20} to={y} dur="0.4s" fill="freeze" />
            </rect>
            <text x={x + barWidth / 2} y={chartH + 36} textAnchor="middle" fill="#45474c" className="font-label" fontSize="10" fontWeight="600">
              {curve.label}
            </text>
            <text x={x + barWidth / 2} y={y - 6} textAnchor="middle" fill="#45474c" className="font-label" fontSize="9" fontWeight="700">
              {value.toFixed(1)}
            </text>
          </g>
        );
      })}

      {/* Baseline */}
      <line x1={chartPadding} y1={chartH + 20} x2={chartW - 10} y2={chartH + 20} stroke="#c5c6cc" strokeWidth="1" />

      {/* Total */}
      {output.equilibrium && (
        <text x="200" y="340" textAnchor="middle" fill="#040d1b" className="font-headline font-bold" fontSize="14">
          {output.equilibrium.label}
        </text>
      )}
    </svg>
  );
};

export const EconGraph: React.FC<EconGraphProps> = ({ output, modelId, large }) => {
  const heightClass = large ? 'h-[60vh]' : 'h-[420px]';
  const [tooltip, setTooltip] = useState<{ x: number; y: number; dataX: number; dataY: number; curveLabel: string } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Track previous equilibrium for ghost dot
  const prevEqRef = useRef<{ price: number; quantity: number } | null>(null);
  const [ghostEq, setGhostEq] = useState<{ price: number; quantity: number } | null>(null);

  useEffect(() => {
    if (output.equilibrium) {
      const prev = prevEqRef.current;
      if (prev && (prev.price !== output.equilibrium.price || prev.quantity !== output.equilibrium.quantity)) {
        setGhostEq({ ...prev });
        const timer = setTimeout(() => setGhostEq(null), 2000);
        return () => clearTimeout(timer);
      }
      prevEqRef.current = { price: output.equilibrium.price, quantity: output.equilibrium.quantity };
    }
  }, [output.equilibrium?.price, output.equilibrium?.quantity]);

  // For GDP, render a bar chart
  if (modelId === 'gdp') {
    return (
      <section className={`relative bg-primary-container ${heightClass} w-full p-8 overflow-hidden`}>
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

  // For multiplier, render vertical bar chart
  if (modelId === 'multiplier') {
    return (
      <section className={`relative bg-primary-container ${heightClass} w-full p-8 overflow-hidden`}>
        <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 opacity-10 pointer-events-none">
          {Array.from({ length: 64 }).map((_, i) => (
            <div key={i} className="border-r border-b border-surface-variant" />
          ))}
        </div>
        <div className="relative w-full h-full">
          <MultiplierBarChart output={output} />
        </div>
      </section>
    );
  }

  // For all other models (line/curve graphs)
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

  const axisLabels = getAxisLabels(modelId);

  // Convert equilibrium point
  const eqSVG = output.equilibrium
    ? toSVG({ x: output.equilibrium.quantity, y: output.equilibrium.price }, xRange, yRange, svgW, svgH, pad)
    : null;

  // Ghost equilibrium
  const ghostSVG = ghostEq
    ? toSVG({ x: ghostEq.quantity, y: ghostEq.price }, xRange, yRange, svgW, svgH, pad)
    : null;

  // Handle mouse/touch move on SVG for tooltip
  const handlePointerMove = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const svgX = ((e.clientX - rect.left) / rect.width) * svgW;
    const svgY = ((e.clientY - rect.top) / rect.height) * svgH;

    // Find the nearest curve point
    let nearestDist = Infinity;
    let nearestPoint: { x: number; y: number; curveLabel: string; sx: number; sy: number } | null = null;

    output.curves.forEach(curve => {
      curve.points.forEach(p => {
        const { sx, sy } = toSVG(p, xRange, yRange, svgW, svgH, pad);
        const dist = Math.sqrt((sx - svgX) ** 2 + (sy - svgY) ** 2);
        if (dist < nearestDist && dist < 40) {
          nearestDist = dist;
          nearestPoint = { x: p.x, y: p.y, curveLabel: curve.label, sx, sy };
        }
      });
    });

    if (nearestPoint) {
      setTooltip({
        x: (nearestPoint as any).sx,
        y: (nearestPoint as any).sy,
        dataX: (nearestPoint as any).x,
        dataY: (nearestPoint as any).y,
        curveLabel: (nearestPoint as any).curveLabel,
      });
    } else {
      setTooltip(null);
    }
  }, [output.curves, xRange, yRange]);

  const handlePointerLeave = useCallback(() => {
    setTooltip(null);
  }, []);

  return (
    <section className={`relative bg-primary-container ${heightClass} w-full p-8 overflow-hidden`}>
      {/* Grid Lines */}
      <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 opacity-10 pointer-events-none">
        {Array.from({ length: 64 }).map((_, i) => (
          <div key={i} className="border-r border-b border-surface-variant" />
        ))}
      </div>

      <div className="relative w-full h-full border-l-2 border-b-2 border-primary-fixed-dim/30 flex items-end">
        {/* Axis Labels */}
        <span className="absolute -left-6 -top-4 font-label text-[10px] text-on-primary-container uppercase tracking-widest">
          {axisLabels.y}
        </span>
        <span className="absolute -right-2 -bottom-6 font-label text-[10px] text-on-primary-container uppercase tracking-widest">
          {axisLabels.x}
        </span>

        {/* Graph Curves SVG */}
        <svg
          ref={svgRef}
          className="absolute inset-0 w-full h-full"
          fill="none"
          viewBox={`0 0 ${svgW} ${svgH}`}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          style={{ touchAction: 'none' }}
        >
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

            const labelX = lastSVG.sx + 8;
            const isNearRightEdge = labelX > svgW - 80;
            const adjustedX = isNearRightEdge ? lastSVG.sx - 8 : labelX;
            const textAnchor = isNearRightEdge ? 'end' as const : 'start' as const;
            const adjustedY = Math.max(pad + 14, Math.min(lastSVG.sy, svgH - pad - 4));

            return (
              <g key={curve.id}>
                <path
                  d={pathData}
                  stroke={curve.color}
                  strokeLinecap="round"
                  strokeWidth="3"
                  style={{ transition: 'all 300ms ease-out' }}
                />
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

          {/* Ghost equilibrium dot (previous position) */}
          {ghostSVG && (
            <circle
              cx={ghostSVG.sx}
              cy={ghostSVG.sy}
              r="5"
              fill="#ffc971"
              opacity="0.25"
              style={{ transition: 'opacity 1.5s ease-out' }}
            />
          )}

          {/* Equilibrium point with pulse */}
          {eqSVG && (
            <>
              {/* Outer pulse ring */}
              <circle
                cx={eqSVG.sx}
                cy={eqSVG.sy}
                r="12"
                fill="none"
                stroke="#ffc971"
                strokeWidth="1"
                opacity="0.3"
                className="eq-pulse"
              />
              <circle
                cx={eqSVG.sx}
                cy={eqSVG.sy}
                r="6"
                fill="#ffc971"
                className="drop-shadow-[0_0_8px_rgba(255,201,113,0.8)]"
                style={{ transition: 'cx 300ms ease-out, cy 300ms ease-out' }}
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
                style={{ transition: 'all 300ms ease-out' }}
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
                style={{ transition: 'all 300ms ease-out' }}
              />
              {/* Axis value labels */}
              <text
                x={eqSVG.sx}
                y={svgH - pad + 14}
                textAnchor="middle"
                fill="#ffc971"
                fontSize="10"
                fontWeight="700"
                className="font-label"
                style={{ transition: 'all 300ms ease-out' }}
              >
                Q={output.equilibrium!.quantity.toFixed(1)}
              </text>
              <text
                x={pad - 4}
                y={eqSVG.sy + 4}
                textAnchor="end"
                fill="#ffc971"
                fontSize="10"
                fontWeight="700"
                className="font-label"
                style={{ transition: 'all 300ms ease-out' }}
              >
                P={output.equilibrium!.price.toFixed(1)}
              </text>
            </>
          )}

          {/* Tooltip */}
          {tooltip && (
            <g className="graph-tooltip">
              <rect
                x={tooltip.x - 40}
                y={tooltip.y - 36}
                width="80"
                height="28"
                rx="4"
                fill="#040d1b"
                opacity="0.85"
              />
              <text
                x={tooltip.x}
                y={tooltip.y - 18}
                textAnchor="middle"
                fill="#ffc971"
                fontSize="11"
                fontWeight="700"
                className="font-label"
              >
                ({tooltip.dataX.toFixed(1)}, {tooltip.dataY.toFixed(1)})
              </text>
              {/* Crosshair */}
              <circle cx={tooltip.x} cy={tooltip.y} r="4" fill="white" opacity="0.8" />
            </g>
          )}
        </svg>

        {/* Equilibrium Label Toast -- only in non-large mode */}
        {!large && output.equilibrium && (
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

function getAxisLabels(modelId: string): { x: string; y: string } {
  switch (modelId) {
    case 'supply-demand':
    case 'elasticity':
      return { x: '수량 (Q)', y: '가격 (P)' };
    case 'ppf':
      return { x: '재화A', y: '재화B' };
    case 'comparative-advantage':
      return { x: '재화1 (전자제품)', y: '재화2 (농산물)' };
    case 'is-lm':
      return { x: '국민소득 (Y)', y: '이자율 (r)' };
    case 'inflation':
      return { x: '통화량 (M)', y: '물가 (P)' };
    default:
      return { x: 'X', y: 'Y' };
  }
}
