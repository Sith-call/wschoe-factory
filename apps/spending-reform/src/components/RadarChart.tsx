import React from 'react';
import type { Category } from '../types';

interface RadarChartProps {
  scores: Record<Category, number>;
  size?: number;
  animate?: boolean;
}

const categories: { key: Category; label: string; color: string }[] = [
  { key: 'cafe', label: '카페', color: '#b45309' },
  { key: 'delivery', label: '배달', color: '#dc2626' },
  { key: 'shopping', label: '쇼핑', color: '#7c3aed' },
  { key: 'subscription', label: '구독', color: '#2563eb' },
  { key: 'transport', label: '교통', color: '#0d9488' },
  { key: 'nightlife', label: '유흥', color: '#db2777' },
];

const MAX_SCORE = 8; // max per category (2 questions, each 1-4)

function polarToCartesian(cx: number, cy: number, r: number, angleIndex: number, total: number) {
  const angle = (Math.PI * 2 * angleIndex) / total - Math.PI / 2;
  return {
    x: cx + r * Math.cos(angle),
    y: cy + r * Math.sin(angle),
  };
}

export default function RadarChart({ scores, size = 280, animate = true }: RadarChartProps) {
  const cx = size / 2;
  const cy = size / 2;
  const maxRadius = size / 2 - 40;
  const rings = [0.25, 0.5, 0.75, 1];

  // Grid lines
  const gridPaths = rings.map((scale) => {
    const points = categories.map((_, i) =>
      polarToCartesian(cx, cy, maxRadius * scale, i, categories.length)
    );
    return points.map((p) => `${p.x},${p.y}`).join(' ');
  });

  // Axis lines
  const axisLines = categories.map((_, i) =>
    polarToCartesian(cx, cy, maxRadius, i, categories.length)
  );

  // Data polygon
  const dataPoints = categories.map((cat, i) => {
    const score = scores[cat.key] || 0;
    const ratio = Math.min(score / MAX_SCORE, 1);
    return polarToCartesian(cx, cy, maxRadius * ratio, i, categories.length);
  });
  const dataPath = dataPoints.map((p) => `${p.x},${p.y}`).join(' ');

  // Labels
  const labelPositions = categories.map((cat, i) => {
    const pos = polarToCartesian(cx, cy, maxRadius + 24, i, categories.length);
    return { ...pos, ...cat, score: scores[cat.key] || 0, color: cat.color };
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={animate ? 'animate-radar-draw' : ''}
      style={{ transformOrigin: 'center' }}
    >
      {/* Grid rings */}
      {gridPaths.map((points, i) => (
        <polygon
          key={i}
          points={points}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="1"
        />
      ))}

      {/* Axis lines */}
      {axisLines.map((pos, i) => (
        <line
          key={i}
          x1={cx}
          y1={cy}
          x2={pos.x}
          y2={pos.y}
          stroke="#e2e8f0"
          strokeWidth="1"
        />
      ))}

      {/* Data fill */}
      <polygon
        points={dataPath}
        fill="rgba(13, 148, 136, 0.1)"
        stroke="#0d9488"
        strokeWidth="1.5"
      />

      {/* Category-colored segments (lines from center to each data point) */}
      {dataPoints.map((p, i) => (
        <line
          key={`seg-${i}`}
          x1={cx}
          y1={cy}
          x2={p.x}
          y2={p.y}
          stroke={categories[i].color}
          strokeWidth="1.5"
          opacity="0.3"
        />
      ))}

      {/* Data points with category colors */}
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="5" fill={categories[i].color} />
      ))}

      {/* Labels */}
      {labelPositions.map((item, i) => (
        <g key={i}>
          <text
            x={item.x}
            y={item.y - 6}
            textAnchor="middle"
            dominantBaseline="central"
            fill="#64748b"
            fontSize="12"
            fontWeight="500"
            fontFamily="'SUIT Variable', sans-serif"
          >
            {item.label}
          </text>
          <text
            x={item.x}
            y={item.y + 10}
            textAnchor="middle"
            dominantBaseline="central"
            fill={item.color}
            fontSize="11"
            fontWeight="600"
            fontFamily="'Inter', sans-serif"
          >
            {item.score}
          </text>
        </g>
      ))}
    </svg>
  );
}
