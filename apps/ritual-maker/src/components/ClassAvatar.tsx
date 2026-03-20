import type { CharacterClass } from '../types';
import { CLASS_INFO } from '../data';

interface Props {
  characterClass: CharacterClass;
  size?: number;
  glow?: boolean;
}

export function ClassAvatar({ characterClass, size = 64, glow = false }: Props) {
  const info = CLASS_INFO[characterClass];
  const s = size;
  const center = s / 2;

  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} className="select-none">
      <defs>
        <radialGradient id={`glow-${characterClass}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={info.color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={info.color} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`body-${characterClass}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={info.color} />
          <stop offset="100%" stopColor={info.color} stopOpacity="0.6" />
        </linearGradient>
      </defs>

      {/* Glow */}
      {glow && <circle cx={center} cy={center} r={center * 0.9} fill={`url(#glow-${characterClass})`} />}

      {characterClass === 'warrior' && (
        <g transform={`translate(${center - 20}, ${center - 22})`}>
          {/* Shield */}
          <path d="M12 4 L4 10 L4 24 L12 30 L12 4Z" fill={info.color} opacity="0.3" />
          <path d="M12 4 L20 10 L20 24 L12 30 L12 4Z" fill={info.color} opacity="0.5" />
          <path d="M12 8 L8 12 L8 22 L12 26 L16 22 L16 12Z" fill={info.color} opacity="0.7" />
          {/* Sword */}
          <rect x="24" y="2" width="3" height="28" rx="1" fill="#e2e8f0" />
          <rect x="20" y="26" width="11" height="3" rx="1" fill="#94a3b8" />
          <rect x="23" y="30" width="5" height="6" rx="1" fill={info.color} />
          {/* Helmet */}
          <ellipse cx="12" cy="0" rx="10" ry="6" fill={info.color} opacity="0.6" />
          <rect x="6" y="-2" width="12" height="4" rx="2" fill={info.color} />
        </g>
      )}

      {characterClass === 'mage' && (
        <g transform={`translate(${center - 18}, ${center - 22})`}>
          {/* Staff */}
          <rect x="30" y="4" width="2.5" height="36" rx="1" fill="#a78bfa" />
          <circle cx="31" cy="4" r="5" fill="none" stroke="#c4b5fd" strokeWidth="1.5" />
          <circle cx="31" cy="4" r="2" fill="#ddd6fe">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
          </circle>
          {/* Robe */}
          <path d="M8 12 L0 40 L24 40 L16 12Z" fill={info.color} opacity="0.5" />
          <path d="M8 12 L12 12 L20 40 L4 40Z" fill={info.color} opacity="0.7" />
          {/* Hat */}
          <path d="M12 -4 L4 14 L20 14Z" fill={info.color} />
          <path d="M12 -4 L8 14" stroke="#ddd6fe" strokeWidth="0.5" opacity="0.5" />
          {/* Stars */}
          <circle cx="6" cy="28" r="1" fill="#ddd6fe" opacity="0.6">
            <animate attributeName="opacity" values="0.2;0.8;0.2" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="18" cy="22" r="0.8" fill="#ddd6fe" opacity="0.4">
            <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2.5s" repeatCount="indefinite" />
          </circle>
        </g>
      )}

      {characterClass === 'healer' && (
        <g transform={`translate(${center - 18}, ${center - 20})`}>
          {/* Wings */}
          <path d="M6 16 Q-4 8 2 2 Q8 -2 14 8Z" fill={info.color} opacity="0.3" />
          <path d="M30 16 Q40 8 34 2 Q28 -2 22 8Z" fill={info.color} opacity="0.3" />
          {/* Body */}
          <ellipse cx="18" cy="22" rx="10" ry="14" fill={info.color} opacity="0.4" />
          <ellipse cx="18" cy="22" rx="7" ry="10" fill={info.color} opacity="0.6" />
          {/* Cross */}
          <rect x="16" y="14" width="4" height="16" rx="1" fill="#6ee7b7" />
          <rect x="12" y="20" width="12" height="4" rx="1" fill="#6ee7b7" />
          {/* Halo */}
          <ellipse cx="18" cy="4" rx="8" ry="3" fill="none" stroke="#6ee7b7" strokeWidth="1.5" opacity="0.6">
            <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3s" repeatCount="indefinite" />
          </ellipse>
          {/* Sparkles */}
          <circle cx="4" cy="12" r="1.2" fill="#6ee7b7" opacity="0.5">
            <animate attributeName="r" values="0.8;1.5;0.8" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="32" cy="10" r="1" fill="#6ee7b7" opacity="0.4">
            <animate attributeName="r" values="1;0.5;1" dur="2.5s" repeatCount="indefinite" />
          </circle>
        </g>
      )}

      {characterClass === 'ranger' && (
        <g transform={`translate(${center - 18}, ${center - 22})`}>
          {/* Bow */}
          <path d="M6 4 Q0 22 6 40" fill="none" stroke={info.color} strokeWidth="2.5" />
          <line x1="6" y1="4" x2="6" y2="40" stroke="#fbbf24" strokeWidth="0.8" />
          {/* Arrow */}
          <line x1="6" y1="22" x2="34" y2="22" stroke="#e2e8f0" strokeWidth="1.5" />
          <polygon points="34,19 40,22 34,25" fill="#e2e8f0" />
          <polygon points="6,20 2,22 6,24" fill="#fbbf24" />
          {/* Cape */}
          <path d="M16 10 L12 38 L26 38 L22 10Z" fill={info.color} opacity="0.4" />
          <path d="M16 10 L14 38 L24 38 L22 10Z" fill={info.color} opacity="0.6" />
          {/* Hood */}
          <path d="M14 4 Q19 -2 24 4 Q26 10 19 12 Q12 10 14 4Z" fill={info.color} opacity="0.8" />
          {/* Eye */}
          <circle cx="19" cy="6" r="1.2" fill="#fbbf24" />
          {/* Leaf accents */}
          <path d="M28 8 Q32 4 30 0" fill="none" stroke="#4ade80" strokeWidth="1" opacity="0.5" />
          <path d="M30 32 Q34 28 32 24" fill="none" stroke="#4ade80" strokeWidth="1" opacity="0.4" />
        </g>
      )}
    </svg>
  );
}
