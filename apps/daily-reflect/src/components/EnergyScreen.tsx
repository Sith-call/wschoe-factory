interface Props {
  selected: number;
  onSelect: (n: number) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function EnergyScreen({ selected, onSelect, onNext, onBack }: Props) {
  const levels = [
    { level: 1, label: '바닥', desc: '완전 지침' },
    { level: 2, label: '낮음', desc: '좀 피곤' },
    { level: 3, label: '보통', desc: '그럭저럭' },
    { level: 4, label: '좋음', desc: '괜찮은 하루' },
    { level: 5, label: '충만', desc: '에너지 넘침' },
  ];

  return (
    <div className="min-h-screen px-6 pt-12 pb-8 flex flex-col">
      <button onClick={onBack} className="self-start mb-4 text-night-400 hover:text-night-200 transition-colors">
        <span className="material-symbols-outlined">arrow_back</span>
      </button>

      <div className="mb-2">
        <div className="flex gap-1 mb-6">
          <div className="h-1 flex-1 rounded-full bg-warm-amber" />
          <div className="h-1 flex-1 rounded-full bg-warm-amber" />
          <div className="h-1 flex-1 rounded-full bg-night-700" />
        </div>
        <h2 className="text-2xl font-bold mb-2">오늘의 에너지는?</h2>
        <p className="text-night-300 text-sm">배터리를 채워주세요</p>
      </div>

      <div className="flex flex-col items-center my-8 gap-3">
        {levels.map(({ level, label, desc }) => (
          <button
            key={level}
            onClick={() => onSelect(level)}
            className={`w-full max-w-xs flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
              selected === level
                ? 'border-warm-amber bg-warm-amber/10'
                : selected >= level && selected > 0
                  ? 'border-warm-amber/30 bg-warm-amber/5'
                  : 'border-night-700'
            }`}
          >
            <div className="w-10 h-10 flex items-center justify-center">
              <div
                className={`w-8 rounded-sm transition-all ${
                  selected >= level && selected > 0 ? 'bg-warm-amber' : 'bg-night-600'
                }`}
                style={{ height: `${level * 6 + 8}px` }}
              />
            </div>
            <div className="text-left">
              <div className={`font-semibold ${selected === level ? 'text-warm-amber' : 'text-night-100'}`}>
                {label}
              </div>
              <div className="text-xs text-night-400">{desc}</div>
            </div>
            {selected === level && (
              <span className="material-symbols-outlined ml-auto text-warm-amber">check_circle</span>
            )}
          </button>
        ))}
      </div>

      <div className="mt-auto pt-6">
        <button
          onClick={onNext}
          disabled={!selected}
          className="w-full py-4 rounded-2xl font-semibold text-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-gradient-to-r from-warm-amber to-warm-orange text-night-900 active:scale-95"
        >
          다음
        </button>
      </div>
    </div>
  );
}
