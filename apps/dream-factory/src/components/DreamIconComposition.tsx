import { PLACES, WEATHERS, OBJECTS, EMOTIONS } from '../data';
import type { PlaceKey, WeatherKey, ObjectKey, DreamEmotionKey } from '../types';

interface Props {
  place: PlaceKey;
  weather: WeatherKey;
  objects: ObjectKey[];
  emotion: DreamEmotionKey;
  /** 'large' for share card, 'medium' for interpretation card */
  size?: 'large' | 'medium';
}

/**
 * Composes Material Symbols icons into a layered "illustration" for dream cards.
 * Place icon is the hero, weather overlays, objects scatter as decorations.
 * Uses the emotion gradient as background.
 */
export default function DreamIconComposition({ place, weather, objects, emotion, size = 'large' }: Props) {
  const placeData = PLACES.find(p => p.key === place);
  const weatherData = WEATHERS.find(w => w.key === weather);
  const emotionData = EMOTIONS.find(e => e.key === emotion);
  const objectItems = objects.slice(0, 3).map(key => OBJECTS.find(o => o.key === key)!);

  const [gradFrom, gradTo] = emotionData?.gradient ?? ['#7C3AED', '#3B82F6'];

  const isLarge = size === 'large';
  const containerHeight = isLarge ? 'h-48' : 'h-36';
  const placeIconSize = isLarge ? 'text-[56px]' : 'text-[44px]';
  const weatherIconSize = isLarge ? 'text-[32px]' : 'text-[26px]';
  const objectIconSize = isLarge ? 'text-[22px]' : 'text-[18px]';

  // Fixed decorative positions for objects (up to 3)
  const objectPositions = [
    { top: '18%', left: '12%', rotate: '-15deg', delay: '0s' },
    { top: '25%', right: '10%', rotate: '20deg', delay: '0.2s' },
    { bottom: '20%', left: '18%', rotate: '10deg', delay: '0.4s' },
  ];

  return (
    <div
      className={`relative w-full ${containerHeight} rounded-2xl overflow-hidden`}
      style={{
        background: `linear-gradient(135deg, ${gradFrom} 0%, ${gradTo} 60%, ${gradFrom}88 100%)`,
      }}
    >
      {/* Subtle star dots overlay */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Decorative rings */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 pointer-events-none"
        style={{ width: isLarge ? '160px' : '120px', height: isLarge ? '160px' : '120px' }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5 pointer-events-none"
        style={{ width: isLarge ? '220px' : '170px', height: isLarge ? '220px' : '170px' }}
      />

      {/* Diagonal decorative line */}
      <div
        className="absolute pointer-events-none opacity-10"
        style={{
          top: '10%',
          right: '20%',
          width: '1px',
          height: '40%',
          background: 'white',
          transform: 'rotate(30deg)',
        }}
      />
      <div
        className="absolute pointer-events-none opacity-10"
        style={{
          bottom: '15%',
          left: '15%',
          width: '1px',
          height: '30%',
          background: 'white',
          transform: 'rotate(-20deg)',
        }}
      />

      {/* Sparkle decorations */}
      <span
        className="material-symbols-outlined absolute text-white/15 pointer-events-none"
        style={{ top: '8%', right: '8%', fontSize: isLarge ? '16px' : '12px' }}
      >
        star
      </span>
      <span
        className="material-symbols-outlined absolute text-white/10 pointer-events-none"
        style={{ bottom: '12%', right: '25%', fontSize: isLarge ? '12px' : '10px' }}
      >
        star
      </span>
      <span
        className="material-symbols-outlined absolute text-white/10 pointer-events-none"
        style={{ top: '15%', left: '22%', fontSize: isLarge ? '10px' : '8px' }}
      >
        auto_awesome
      </span>

      {/* Center: Place icon (hero) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
        <div className="relative">
          {/* Glow behind place icon */}
          <div
            className="absolute inset-0 blur-xl rounded-full opacity-40"
            style={{ background: `radial-gradient(circle, white 0%, transparent 70%)`, transform: 'scale(2)' }}
          />
          <span
            className={`material-symbols-outlined icon-fill ${placeIconSize} text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] relative z-10`}
          >
            {placeData?.icon ?? 'explore'}
          </span>
        </div>
      </div>

      {/* Weather icon — top right of center */}
      <div
        className="absolute z-20"
        style={{
          top: isLarge ? '15%' : '12%',
          right: isLarge ? '25%' : '22%',
        }}
      >
        <span
          className={`material-symbols-outlined icon-fill ${weatherIconSize} text-white/70 drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]`}
        >
          {weatherData?.icon ?? 'wb_cloudy'}
        </span>
      </div>

      {/* Object icons — scattered decorative elements */}
      {objectItems.map((obj, i) => {
        const pos = objectPositions[i];
        return (
          <div
            key={obj.key}
            className="absolute z-20 animate-pulse"
            style={{
              ...pos,
              animationDelay: pos.delay,
              animationDuration: '3s',
              transform: `rotate(${pos.rotate})`,
            }}
          >
            <span
              className={`material-symbols-outlined ${objectIconSize} text-white/50 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]`}
            >
              {obj.icon}
            </span>
          </div>
        );
      })}

      {/* Bottom gradient fade for text readability */}
      <div
        className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none"
        style={{
          background: `linear-gradient(to top, ${gradFrom}cc 0%, transparent 100%)`,
        }}
      />
    </div>
  );
}
