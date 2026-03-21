import { Category } from '../types';

interface Props {
  categories: Category[];
  active: Set<Category>;
  onToggle: (cat: Category) => void;
}

export default function CategoryFilter({ categories, active, onToggle }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-hide">
      {categories.map((cat) => {
        const isActive = active.has(cat);
        return (
          <button
            key={cat}
            onClick={() => onToggle(cat)}
            className={`flex-shrink-0 px-3 py-1.5 text-sm font-semibold transition-colors ${
              isActive
                ? 'bg-primary text-white'
                : 'bg-white text-gray-500 border border-gray-200'
            }`}
            style={{ borderRadius: '2px' }}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
