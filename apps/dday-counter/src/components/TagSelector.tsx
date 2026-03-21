import { TagColor, TAG_OPTIONS, TAG_COLORS } from '../types';

interface TagSelectorProps {
  selected: TagColor;
  onChange: (tag: TagColor) => void;
}

export default function TagSelector({ selected, onChange }: TagSelectorProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {TAG_OPTIONS.map((opt) => {
        const colors = TAG_COLORS[opt.id];
        const isActive = selected === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`
              px-3 py-1 rounded-full text-sm font-medium transition-colors
              ${colors.bg} ${colors.text}
              ${isActive ? 'ring-2 ring-offset-1 ring-current' : 'opacity-60 hover:opacity-80'}
            `}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
