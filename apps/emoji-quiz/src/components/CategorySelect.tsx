import { Category, BestScores } from '../types';
import { categoryInfos } from '../quiz-data';

interface CategorySelectProps {
  onSelect: (category: Category) => void;
  onBack: () => void;
  bestScores: BestScores;
}

const categoryIcons: Record<Category, JSX.Element> = {
  movies: (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
      <line x1="7" y1="2" x2="7" y2="22" />
      <line x1="17" y1="2" x2="17" y2="22" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <line x1="2" y1="7" x2="7" y2="7" />
      <line x1="2" y1="17" x2="7" y2="17" />
      <line x1="17" y1="7" x2="22" y2="7" />
      <line x1="17" y1="17" x2="22" y2="17" />
    </svg>
  ),
  proverbs: (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  ),
  food: (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
      <line x1="6" y1="1" x2="6" y2="4" />
      <line x1="10" y1="1" x2="10" y2="4" />
      <line x1="14" y1="1" x2="14" y2="4" />
    </svg>
  ),
};

function CategorySelect({ onSelect, onBack, bestScores }: CategorySelectProps) {
  return (
    <div className="flex-1 flex flex-col px-6 py-8">
      {/* Back button */}
      <button
        onClick={onBack}
        className="self-start flex items-center gap-1 text-rose-500 font-medium text-sm mb-6"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
        돌아가기
      </button>

      <h2 className="text-2xl font-bold text-rose-900 mb-1">
        카테고리 선택
      </h2>
      <p className="text-sm text-rose-400 mb-8">
        도전할 카테고리를 골라주세요
      </p>

      <div className="flex flex-col gap-4">
        {categoryInfos.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className="bg-white rounded-xl p-5 flex items-center gap-4 text-left border-2 border-transparent hover:border-rose-300 active:scale-[0.98] transition-all shadow-sm"
          >
            <div className="w-14 h-14 bg-rose-50 rounded-lg flex items-center justify-center text-rose-600 flex-shrink-0">
              {categoryIcons[cat.id]}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-rose-900">
                {cat.label}
              </h3>
              <p className="text-sm text-rose-400 mt-0.5">
                {cat.description}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="text-xs text-rose-300 font-medium bg-rose-50 px-2 py-1 rounded-md">
                {cat.itemCount}문제
              </div>
              {bestScores[cat.id] != null && (
                <div className="text-xs text-emerald-500 font-medium">
                  최고 {bestScores[cat.id]}점
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default CategorySelect;
