import { HighlightCategory, HIGHLIGHT_CATEGORIES } from '../types';

interface Props {
  category: HighlightCategory | null;
  text: string;
  gratitude: string;
  onCategory: (c: HighlightCategory) => void;
  onText: (t: string) => void;
  onGratitude: (g: string) => void;
  onComplete: () => void;
  onBack: () => void;
}

export default function HighlightScreen({ category, text, gratitude, onCategory, onText, onGratitude, onComplete, onBack }: Props) {
  const canComplete = category !== null && text.trim().length > 0;

  return (
    <div className="min-h-screen px-6 pt-12 pb-8 flex flex-col">
      <button onClick={onBack} className="self-start mb-4 text-night-400 hover:text-night-200 transition-colors">
        <span className="material-symbols-outlined">arrow_back</span>
      </button>

      <div className="mb-2">
        <div className="flex gap-1 mb-6">
          <div className="h-1 flex-1 rounded-full bg-warm-amber" />
          <div className="h-1 flex-1 rounded-full bg-warm-amber" />
          <div className="h-1 flex-1 rounded-full bg-warm-amber" />
        </div>
        <h2 className="text-2xl font-bold mb-2">오늘의 하이라이트</h2>
        <p className="text-night-300 text-sm">오늘 가장 기억에 남는 순간은?</p>
      </div>

      <div className="flex gap-2 my-4 overflow-x-auto pb-2">
        {HIGHLIGHT_CATEGORIES.map(c => (
          <button
            key={c.type}
            onClick={() => onCategory(c.type)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all text-sm ${
              category === c.type
                ? 'bg-warm-amber text-night-900 font-medium'
                : 'bg-night-700 text-night-200 hover:bg-night-600'
            }`}
          >
            <span className="material-symbols-outlined text-lg">{c.icon}</span>
            {c.label}
          </button>
        ))}
      </div>

      <textarea
        value={text}
        onChange={e => onText(e.target.value.slice(0, 50))}
        placeholder="한줄로 적어주세요 (최대 50자)"
        className="w-full bg-night-800 border border-night-600 rounded-2xl p-4 text-white placeholder-night-500 resize-none h-24 focus:outline-none focus:border-warm-amber/50 transition-colors"
      />
      <div className="text-right text-xs text-night-500 mt-1">{text.length}/50</div>

      <div className="mt-6">
        <p className="text-sm text-night-300 mb-2">
          <span className="material-symbols-outlined text-warm-orange text-sm align-middle mr-1">favorite</span>
          감사한 것 하나 (선택)
        </p>
        <input
          value={gratitude}
          onChange={e => onGratitude(e.target.value.slice(0, 30))}
          placeholder="오늘 감사한 것이 있다면..."
          className="w-full bg-night-800 border border-night-600 rounded-xl p-3 text-white placeholder-night-500 text-sm focus:outline-none focus:border-warm-amber/50 transition-colors"
        />
      </div>

      <div className="mt-auto pt-6">
        <button
          onClick={onComplete}
          disabled={!canComplete}
          className="w-full py-4 rounded-2xl font-semibold text-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-gradient-to-r from-warm-amber to-warm-orange text-night-900 active:scale-95"
        >
          회고 완료
        </button>
      </div>
    </div>
  );
}
