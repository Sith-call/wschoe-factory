import { useState, useRef, useCallback, useEffect } from 'react';
import { MenuItem, Category } from '../types';

interface Props {
  menus: MenuItem[];
  categories: Category[];
  onAdd: (name: string, category: Category) => void;
  onRemove: (id: string) => void;
}

export default function MenuManager({ menus, categories, onAdd, onRemove }: Props) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>(categories[0]);
  const [pendingDeletes, setPendingDeletes] = useState<Set<string>>(new Set());
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  // Cleanup timers on unmount
  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  const handleAdd = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onAdd(trimmed, category);
    setName('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAdd();
  };

  const startDelete = useCallback((id: string) => {
    setPendingDeletes((prev) => new Set(prev).add(id));

    const timer = setTimeout(() => {
      onRemove(id);
      setPendingDeletes((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      timersRef.current.delete(id);
    }, 3000);

    timersRef.current.set(id, timer);
  }, [onRemove]);

  const cancelDelete = useCallback((id: string) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
    setPendingDeletes((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  return (
    <div className="mt-3 bg-white rounded-lg border border-gray-200 p-4">
      {/* Add form */}
      <div className="flex gap-2 mb-4">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
          className="px-2 py-2 text-sm border border-gray-200 rounded-md bg-white text-gray-700 focus:outline-none focus:border-primary"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="메뉴 이름"
          className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-primary"
        />
        <button
          onClick={handleAdd}
          disabled={!name.trim()}
          className="px-3 py-2 bg-primary text-white text-sm font-semibold rounded-md hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          추가
        </button>
      </div>

      {/* Menu list */}
      <div className="space-y-1 max-h-48 overflow-y-auto">
        {menus.map((item) => {
          const isPending = pendingDeletes.has(item.id);
          return (
            <div
              key={item.id}
              className={`flex items-center justify-between px-3 py-2 rounded-md group ${
                isPending ? 'bg-red-50' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-semibold w-10 flex-shrink-0">
                  {item.category}
                </span>
                <span
                  className={`text-sm ${
                    isPending
                      ? 'text-gray-400 line-through'
                      : 'text-gray-700'
                  }`}
                >
                  {item.name}
                </span>
              </div>
              {isPending ? (
                <button
                  onClick={() => cancelDelete(item.id)}
                  className="px-2 py-0.5 text-xs font-semibold text-primary hover:text-orange-600 transition-colors"
                >
                  되돌리기
                </button>
              ) : (
                <button
                  onClick={() => startDelete(item.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
                  aria-label={`${item.name} 삭제`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
