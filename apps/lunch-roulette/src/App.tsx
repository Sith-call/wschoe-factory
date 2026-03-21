import { useState, useCallback, useMemo } from 'react';
import { MenuItem, Category, HistoryEntry } from './types';
import { DEFAULT_MENUS, CATEGORIES } from './data';
import SpinWheel from './components/SpinWheel';
import MenuManager from './components/MenuManager';
import CategoryFilter from './components/CategoryFilter';
import HistoryList from './components/HistoryList';

function App() {
  const [menus, setMenus] = useState<MenuItem[]>(DEFAULT_MENUS);
  const [activeCategories, setActiveCategories] = useState<Set<Category>>(
    new Set(CATEGORIES)
  );
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showManager, setShowManager] = useState(false);

  const filteredMenus = useMemo(
    () => menus.filter((m) => activeCategories.has(m.category)),
    [menus, activeCategories]
  );

  const toggleCategory = useCallback((cat: Category) => {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) {
        if (next.size > 1) next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  }, []);

  const addToHistory = useCallback((item: MenuItem) => {
    setHistory((prev) => {
      const entry: HistoryEntry = {
        ...item,
        timestamp: Date.now(),
      };
      return [entry, ...prev].slice(0, 5);
    });
  }, []);

  const addMenu = useCallback((name: string, category: Category) => {
    setMenus((prev) => [
      ...prev,
      { id: `item-${Date.now()}-${Math.random()}`, name, category },
    ]);
  }, []);

  const removeMenu = useCallback((id: string) => {
    setMenus((prev) => prev.filter((m) => m.id !== id));
  }, []);

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Header */}
        <header className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            점심 룰렛
          </h1>
          <p className="text-sm text-gray-500 font-normal">
            오늘 뭐 먹지? 돌려서 정하자
          </p>
        </header>

        {/* Category Filter */}
        <CategoryFilter
          categories={CATEGORIES}
          active={activeCategories}
          onToggle={toggleCategory}
        />

        {/* Spin Wheel */}
        {menus.length === 0 ? (
          <SpinWheel items={[]} onResult={addToHistory} />
        ) : filteredMenus.length >= 2 ? (
          <SpinWheel items={filteredMenus} onResult={addToHistory} />
        ) : (
          <div className="text-center py-16 text-gray-400 text-sm">
            메뉴를 2개 이상 선택해 주세요
          </div>
        )}

        {/* Menu Manager Toggle */}
        <div className="mt-6">
          <button
            onClick={() => setShowManager((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:border-primary transition-colors"
          >
            <span>메뉴 관리</span>
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform ${showManager ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showManager && (
            <MenuManager
              menus={menus}
              categories={CATEGORIES}
              onAdd={addMenu}
              onRemove={removeMenu}
            />
          )}
        </div>

        {/* History */}
        {history.length > 0 && <HistoryList entries={history} />}
      </div>
    </div>
  );
}

export default App;
