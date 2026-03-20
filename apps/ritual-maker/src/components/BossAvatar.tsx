import type { BossType } from '../types';

interface Props {
  type: BossType;
  size?: number;
  damaged?: boolean;
}

export function BossAvatar({ type, size = 120, damaged = false }: Props) {
  const s = size;
  const cx = s / 2;
  const cy = s / 2;

  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} className={`select-none ${damaged ? 'animate-shake' : ''}`}>
      <defs>
        <radialGradient id={`boss-glow-${type}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={type === 'slime' ? '#22c55e' : type === 'goblin' ? '#a855f7' : type === 'dragon' ? '#ef4444' : '#f59e0b'} stopOpacity="0.3" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
        <filter id="boss-shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000" floodOpacity="0.5" />
        </filter>
      </defs>

      {/* Ambient glow */}
      <circle cx={cx} cy={cy} r={cx * 0.9} fill={`url(#boss-glow-${type})`}>
        <animate attributeName="r" values={`${cx * 0.8};${cx * 0.95};${cx * 0.8}`} dur="3s" repeatCount="indefinite" />
      </circle>

      {type === 'slime' && (
        <g filter="url(#boss-shadow)">
          {/* Body */}
          <ellipse cx={cx} cy={cy + 8} rx={32} ry={24} fill="#22c55e" opacity="0.3" />
          <ellipse cx={cx} cy={cy + 4} rx={28} ry={28} fill="#4ade80">
            <animate attributeName="ry" values="28;30;28" dur="2s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx={cx} cy={cy + 4} rx={22} ry={22} fill="#86efac" opacity="0.5" />
          {/* Highlight */}
          <ellipse cx={cx - 8} cy={cy - 8} rx={6} ry={8} fill="white" opacity="0.3" transform="rotate(-20)" />
          {/* Eyes */}
          <ellipse cx={cx - 8} cy={cy - 2} rx={4} ry={5} fill="white" />
          <ellipse cx={cx + 8} cy={cy - 2} rx={4} ry={5} fill="white" />
          <circle cx={cx - 7} cy={cy - 1} r={2.5} fill="#1a1a2e" />
          <circle cx={cx + 9} cy={cy - 1} r={2.5} fill="#1a1a2e" />
          {/* Mouth */}
          <path d={`M${cx - 6} ${cy + 8} Q${cx} ${cy + 14} ${cx + 6} ${cy + 8}`} fill="none" stroke="#166534" strokeWidth="2" />
          {/* Drip */}
          <ellipse cx={cx + 16} cy={cy + 20} rx={4} ry={6} fill="#4ade80" opacity="0.6">
            <animate attributeName="cy" values={`${cy + 20};${cy + 28};${cy + 20}`} dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0.2;0.6" dur="3s" repeatCount="indefinite" />
          </ellipse>
        </g>
      )}

      {type === 'goblin' && (
        <g filter="url(#boss-shadow)">
          {/* Body */}
          <ellipse cx={cx} cy={cy + 10} rx={20} ry={18} fill="#7c3aed" />
          {/* Head */}
          <circle cx={cx} cy={cy - 6} r={18} fill="#a855f7" />
          <circle cx={cx} cy={cy - 6} r={14} fill="#c084fc" opacity="0.3" />
          {/* Ears */}
          <path d={`M${cx - 18} ${cy - 10} L${cx - 30} ${cy - 22} L${cx - 14} ${cy - 16}Z`} fill="#a855f7" />
          <path d={`M${cx + 18} ${cy - 10} L${cx + 30} ${cy - 22} L${cx + 14} ${cy - 16}Z`} fill="#a855f7" />
          {/* Eyes - angry */}
          <path d={`M${cx - 14} ${cy - 12} L${cx - 6} ${cy - 8}`} stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
          <path d={`M${cx + 14} ${cy - 12} L${cx + 6} ${cy - 8}`} stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx={cx - 8} cy={cy - 6} r={3} fill="#fbbf24">
            <animate attributeName="r" values="3;2.5;3" dur="1.5s" repeatCount="indefinite" />
          </circle>
          <circle cx={cx + 8} cy={cy - 6} r={3} fill="#fbbf24">
            <animate attributeName="r" values="2.5;3;2.5" dur="1.5s" repeatCount="indefinite" />
          </circle>
          {/* Fangs */}
          <path d={`M${cx - 4} ${cy + 2} L${cx - 6} ${cy + 8}`} stroke="white" strokeWidth="2" strokeLinecap="round" />
          <path d={`M${cx + 4} ${cy + 2} L${cx + 6} ${cy + 8}`} stroke="white" strokeWidth="2" strokeLinecap="round" />
          {/* Nose */}
          <circle cx={cx} cy={cy - 2} r={2} fill="#7c3aed" />
          {/* Arms */}
          <path d={`M${cx - 20} ${cy + 6} Q${cx - 28} ${cy + 16} ${cx - 24} ${cy + 24}`} fill="none" stroke="#a855f7" strokeWidth="4" strokeLinecap="round" />
          <path d={`M${cx + 20} ${cy + 6} Q${cx + 28} ${cy + 16} ${cx + 24} ${cy + 24}`} fill="none" stroke="#a855f7" strokeWidth="4" strokeLinecap="round" />
        </g>
      )}

      {type === 'dragon' && (
        <g filter="url(#boss-shadow)">
          {/* Wings */}
          <path d={`M${cx - 10} ${cy - 4} Q${cx - 40} ${cy - 30} ${cx - 35} ${cy - 5} Q${cx - 30} ${cy + 5} ${cx - 10} ${cy + 4}`} fill="#dc2626" opacity="0.4" />
          <path d={`M${cx + 10} ${cy - 4} Q${cx + 40} ${cy - 30} ${cx + 35} ${cy - 5} Q${cx + 30} ${cy + 5} ${cx + 10} ${cy + 4}`} fill="#dc2626" opacity="0.4" />
          {/* Body */}
          <ellipse cx={cx} cy={cy + 6} rx={18} ry={20} fill="#ef4444" />
          <ellipse cx={cx} cy={cy + 6} rx={12} ry={16} fill="#f87171" opacity="0.4" />
          {/* Head */}
          <ellipse cx={cx} cy={cy - 14} rx={14} ry={12} fill="#ef4444" />
          {/* Horns */}
          <path d={`M${cx - 10} ${cy - 22} L${cx - 14} ${cy - 36} L${cx - 6} ${cy - 22}`} fill="#f59e0b" />
          <path d={`M${cx + 10} ${cy - 22} L${cx + 14} ${cy - 36} L${cx + 6} ${cy - 22}`} fill="#f59e0b" />
          {/* Eyes */}
          <ellipse cx={cx - 6} cy={cy - 16} rx={3} ry={4} fill="#fbbf24" />
          <ellipse cx={cx + 6} cy={cy - 16} rx={3} ry={4} fill="#fbbf24" />
          <ellipse cx={cx - 6} cy={cy - 15} rx={1.5} ry={3} fill="#1a1a2e" />
          <ellipse cx={cx + 6} cy={cy - 15} rx={1.5} ry={3} fill="#1a1a2e" />
          {/* Snout */}
          <ellipse cx={cx} cy={cy - 8} rx={6} ry={4} fill="#dc2626" />
          <circle cx={cx - 2} cy={cy - 9} r={1} fill="#1a1a2e" />
          <circle cx={cx + 2} cy={cy - 9} r={1} fill="#1a1a2e" />
          {/* Fire breath */}
          <ellipse cx={cx} cy={cy - 2} rx={4} ry={2} fill="#f59e0b" opacity="0.6">
            <animate attributeName="rx" values="3;6;3" dur="1s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;0.8;0.3" dur="1s" repeatCount="indefinite" />
          </ellipse>
          {/* Tail */}
          <path d={`M${cx + 14} ${cy + 16} Q${cx + 30} ${cy + 24} ${cx + 26} ${cy + 32}`} fill="none" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
        </g>
      )}

      {type === 'phoenix' && (
        <g filter="url(#boss-shadow)">
          {/* Flame aura */}
          <ellipse cx={cx} cy={cy} rx={36} ry={40} fill="#f59e0b" opacity="0.1">
            <animate attributeName="opacity" values="0.05;0.15;0.05" dur="2s" repeatCount="indefinite" />
          </ellipse>
          {/* Wings - flame */}
          <path d={`M${cx - 6} ${cy} Q${cx - 36} ${cy - 20} ${cx - 30} ${cy - 36} Q${cx - 20} ${cy - 20} ${cx - 6} ${cy - 10}`} fill="#f59e0b" opacity="0.6" />
          <path d={`M${cx + 6} ${cy} Q${cx + 36} ${cy - 20} ${cx + 30} ${cy - 36} Q${cx + 20} ${cy - 20} ${cx + 6} ${cy - 10}`} fill="#f59e0b" opacity="0.6" />
          <path d={`M${cx - 6} ${cy} Q${cx - 28} ${cy - 14} ${cx - 22} ${cy - 28}`} fill="#fbbf24" opacity="0.4" />
          <path d={`M${cx + 6} ${cy} Q${cx + 28} ${cy - 14} ${cx + 22} ${cy - 28}`} fill="#fbbf24" opacity="0.4" />
          {/* Body */}
          <ellipse cx={cx} cy={cy + 2} rx={12} ry={16} fill="#f59e0b" />
          <ellipse cx={cx} cy={cy + 2} rx={8} ry={12} fill="#fbbf24" opacity="0.5" />
          {/* Head */}
          <circle cx={cx} cy={cy - 16} r={10} fill="#f59e0b" />
          <circle cx={cx} cy={cy - 16} r={7} fill="#fbbf24" opacity="0.4" />
          {/* Crown */}
          <path d={`M${cx - 6} ${cy - 24} L${cx - 4} ${cy - 32} L${cx} ${cy - 26} L${cx + 4} ${cy - 32} L${cx + 6} ${cy - 24}`} fill="#ef4444" />
          {/* Eyes */}
          <circle cx={cx - 4} cy={cy - 17} r={2} fill="white" />
          <circle cx={cx + 4} cy={cy - 17} r={2} fill="white" />
          <circle cx={cx - 4} cy={cy - 17} r={1} fill="#7c2d12" />
          <circle cx={cx + 4} cy={cy - 17} r={1} fill="#7c2d12" />
          {/* Beak */}
          <path d={`M${cx - 2} ${cy - 12} L${cx} ${cy - 8} L${cx + 2} ${cy - 12}`} fill="#ea580c" />
          {/* Tail feathers */}
          <path d={`M${cx - 4} ${cy + 16} Q${cx - 10} ${cy + 30} ${cx - 6} ${cy + 38}`} fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round">
            <animate attributeName="d" values={`M${cx - 4} ${cy + 16} Q${cx - 10} ${cy + 30} ${cx - 6} ${cy + 38};M${cx - 4} ${cy + 16} Q${cx - 14} ${cy + 28} ${cx - 10} ${cy + 36};M${cx - 4} ${cy + 16} Q${cx - 10} ${cy + 30} ${cx - 6} ${cy + 38}`} dur="3s" repeatCount="indefinite" />
          </path>
          <path d={`M${cx} ${cy + 16} Q${cx} ${cy + 32} ${cx} ${cy + 40}`} fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
          <path d={`M${cx + 4} ${cy + 16} Q${cx + 10} ${cy + 30} ${cx + 6} ${cy + 38}`} fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
          {/* Sparks */}
          <circle cx={cx - 20} cy={cy - 10} r={1.5} fill="#fbbf24">
            <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx={cx + 22} cy={cy - 14} r={1} fill="#f59e0b">
            <animate attributeName="opacity" values="1;0;1" dur="1.5s" repeatCount="indefinite" />
          </circle>
        </g>
      )}
    </svg>
  );
}
