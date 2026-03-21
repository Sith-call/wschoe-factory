import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChannelState, SoundType, Preset, TimerOption, QuickPreset } from './types';
import { startChannel, stopChannel, setChannelVolume, setMasterVolume, stopAll, fadeOutAndStop, initAudio } from './audio-engine';
import { loadPresets, savePreset, deletePreset } from './presets';
import MasterControls from './components/MasterControls';
import ChannelGrid from './components/ChannelGrid';
import PresetManager from './components/PresetManager';

const LAST_STATE_KEY = 'noise-maker-last-state';

const DEFAULT_CHANNELS: ChannelState[] = [
  { type: 'white', label: 'White Noise', labelKo: '화이트 노이즈', active: false, volume: 50 },
  { type: 'brown', label: 'Brown Noise', labelKo: '브라운 노이즈', active: false, volume: 50 },
  { type: 'pink', label: 'Pink Noise', labelKo: '핑크 노이즈', active: false, volume: 50 },
  { type: 'rain', label: 'Rain', labelKo: '빗소리', active: false, volume: 50 },
  { type: 'wind', label: 'Wind', labelKo: '바람', active: false, volume: 50 },
  { type: 'ocean', label: 'Ocean Waves', labelKo: '파도', active: false, volume: 50 },
];

const QUICK_PRESETS: QuickPreset[] = [
  {
    name: '집중 모드',
    masterVolume: 70,
    channels: [
      { type: 'white', active: true, volume: 50 },
      { type: 'brown', active: true, volume: 50 },
      { type: 'pink', active: false, volume: 50 },
      { type: 'rain', active: false, volume: 50 },
      { type: 'wind', active: false, volume: 50 },
      { type: 'ocean', active: false, volume: 50 },
    ],
  },
  {
    name: '수면 모드',
    masterVolume: 70,
    channels: [
      { type: 'white', active: false, volume: 50 },
      { type: 'brown', active: false, volume: 50 },
      { type: 'pink', active: false, volume: 50 },
      { type: 'rain', active: true, volume: 40 },
      { type: 'wind', active: false, volume: 50 },
      { type: 'ocean', active: true, volume: 40 },
    ],
  },
  {
    name: '자연 속',
    masterVolume: 70,
    channels: [
      { type: 'white', active: false, volume: 50 },
      { type: 'brown', active: false, volume: 50 },
      { type: 'pink', active: false, volume: 50 },
      { type: 'rain', active: true, volume: 30 },
      { type: 'wind', active: true, volume: 30 },
      { type: 'ocean', active: true, volume: 30 },
    ],
  },
];

function loadLastState(): { channels: ChannelState[]; masterVol: number } | null {
  try {
    const raw = localStorage.getItem(LAST_STATE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveLastState(channels: ChannelState[], masterVol: number): void {
  try {
    localStorage.setItem(
      LAST_STATE_KEY,
      JSON.stringify({ channels, masterVol })
    );
  } catch {
    // localStorage full or unavailable
  }
}

export default function App() {
  const [channels, setChannels] = useState<ChannelState[]>(() => {
    const saved = loadLastState();
    if (saved?.channels) {
      // Restore volumes but start with all channels inactive (audio needs gesture)
      return DEFAULT_CHANNELS.map((ch) => {
        const s = saved.channels.find((c) => c.type === ch.type);
        return s ? { ...ch, volume: s.volume, active: false } : ch;
      });
    }
    return DEFAULT_CHANNELS;
  });
  const [masterVol, setMasterVol] = useState(() => {
    const saved = loadLastState();
    return saved?.masterVol ?? 70;
  });
  const [timerOption, setTimerOption] = useState<TimerOption>(0);
  const [timerRemaining, setTimerRemaining] = useState<number | null>(null);
  const [presets, setPresets] = useState<Preset[]>([]);
  const [audioInited, setAudioInited] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const masterVolRef = useRef(masterVol);

  // Keep masterVolRef in sync
  useEffect(() => {
    masterVolRef.current = masterVol;
  }, [masterVol]);

  // Save state to localStorage whenever channels or masterVol change
  useEffect(() => {
    saveLastState(channels, masterVol);
  }, [channels, masterVol]);

  // Load presets on mount
  useEffect(() => {
    setPresets(loadPresets());
  }, []);

  // Init audio on first interaction
  const ensureAudio = useCallback(() => {
    if (!audioInited) {
      initAudio();
      setAudioInited(true);
    }
  }, [audioInited]);

  // Timer logic
  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (timerOption === 0) {
      setTimerRemaining(null);
      return;
    }

    const totalSeconds = timerOption * 60;
    setTimerRemaining(totalSeconds);

    timerRef.current = setInterval(() => {
      setTimerRemaining((prev) => {
        if (prev === null || prev <= 1) {
          // Timer done -- fade out then stop
          if (timerRef.current) clearInterval(timerRef.current);
          timerRef.current = null;
          setIsFadingOut(true);
          fadeOutAndStop(5).then(() => {
            setIsFadingOut(false);
            setChannels((ch) => ch.map((c) => ({ ...c, active: false })));
            setTimerOption(0);
            // Restore master gain to saved level
            setMasterVolume(masterVolRef.current);
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerOption]);

  const handleToggle = useCallback(
    (type: SoundType) => {
      ensureAudio();
      setChannels((prev) =>
        prev.map((ch) => {
          if (ch.type !== type) return ch;
          const newActive = !ch.active;
          if (newActive) {
            startChannel(type, ch.volume);
          } else {
            stopChannel(type);
          }
          return { ...ch, active: newActive };
        })
      );
    },
    [ensureAudio]
  );

  const handleVolumeChange = useCallback(
    (type: SoundType, volume: number) => {
      ensureAudio();
      setChannels((prev) =>
        prev.map((ch) => {
          if (ch.type !== type) return ch;
          if (ch.active) {
            setChannelVolume(type, volume);
          }
          return { ...ch, volume };
        })
      );
    },
    [ensureAudio]
  );

  const handleMasterVolumeChange = useCallback(
    (v: number) => {
      ensureAudio();
      setMasterVol(v);
      setMasterVolume(v);
    },
    [ensureAudio]
  );

  const handleStopAll = useCallback(() => {
    stopAll();
    setChannels((prev) => prev.map((ch) => ({ ...ch, active: false })));
  }, []);

  const handleSavePreset = useCallback(
    (name: string) => {
      const preset: Preset = {
        name,
        channels: channels.map((ch) => ({
          type: ch.type,
          active: ch.active,
          volume: ch.volume,
        })),
        masterVolume: masterVol,
      };
      setPresets(savePreset(preset));
    },
    [channels, masterVol]
  );

  const handleLoadPreset = useCallback(
    (preset: Preset | QuickPreset) => {
      ensureAudio();
      // Stop all current
      stopAll();

      setMasterVol(preset.masterVolume);
      setMasterVolume(preset.masterVolume);

      setChannels((prev) =>
        prev.map((ch) => {
          const saved = preset.channels.find((c) => c.type === ch.type);
          if (!saved) return { ...ch, active: false };
          if (saved.active) {
            startChannel(saved.type, saved.volume);
          }
          return { ...ch, active: saved.active, volume: saved.volume };
        })
      );
    },
    [ensureAudio]
  );

  const handleDeletePreset = useCallback((name: string) => {
    setPresets(deletePreset(name));
  }, []);

  const isAnyActive = channels.some((ch) => ch.active);

  return (
    <div className="max-w-md mx-auto px-4 py-6 pb-12">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-forest font-outfit">Noise Maker</h1>
        <p className="text-sm text-gray-500 font-nanum mt-0.5">소리 공방</p>
      </div>

      {/* Master Controls */}
      <MasterControls
        masterVolume={masterVol}
        onMasterVolumeChange={handleMasterVolumeChange}
        timerOption={timerOption}
        onTimerChange={setTimerOption}
        timerRemaining={timerRemaining}
        isAnyActive={isAnyActive}
        onStopAll={handleStopAll}
        isFadingOut={isFadingOut}
      />

      {/* Quick Presets */}
      <div className="flex gap-2 mb-4">
        {QUICK_PRESETS.map((qp) => (
          <button
            key={qp.name}
            onClick={() => handleLoadPreset(qp)}
            className="flex-1 px-3 py-2 text-xs font-medium rounded-lg bg-white border border-gray-100 text-forest hover:border-lime-400 hover:bg-surface transition-colors font-nanum"
          >
            {qp.name}
          </button>
        ))}
      </div>

      {/* Channel Grid */}
      <ChannelGrid
        channels={channels}
        onToggle={handleToggle}
        onVolumeChange={handleVolumeChange}
      />

      {/* Presets */}
      <PresetManager
        presets={presets}
        onSave={handleSavePreset}
        onLoad={handleLoadPreset}
        onDelete={handleDeletePreset}
      />
    </div>
  );
}
