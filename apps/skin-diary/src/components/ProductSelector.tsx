import React, { useState, useMemo } from 'react';
import type { Product, ProductCategory, SkinRecord } from '../types';
import { CATEGORY_LABELS, CATEGORY_ORDER } from '../types';

interface Props {
  products: Product[];
  selected: string[];
  onChange: (productNames: string[]) => void;
  onAddProduct?: (name: string, category: ProductCategory) => void;
  lastNightProducts?: string[];
  onCopyLastNight?: () => void;
  records?: Record<string, SkinRecord>;
}

export function ProductSelector({
  products,
  selected,
  onChange,
  onAddProduct,
  lastNightProducts,
  onCopyLastNight,
  records,
}: Props) {
  const [expandedCategories, setExpandedCategories] = useState<Set<ProductCategory>>(() => {
    // Auto-expand categories that have selected products
    const cats = new Set<ProductCategory>();
    for (const p of products) {
      if (selected.includes(p.name)) {
        cats.add(p.category);
      }
    }
    // If nothing selected, expand first category with products
    if (cats.size === 0) {
      for (const cat of CATEGORY_ORDER) {
        if (products.some(p => p.category === cat)) {
          cats.add(cat);
          break;
        }
      }
    }
    return cats;
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<ProductCategory>('serum');

  // Compute recent-use order: products used more recently appear first within each category
  const recentUseOrder = useMemo(() => {
    if (!records) return new Map<string, number>();
    const order = new Map<string, number>();
    const sortedDates = Object.keys(records).sort().reverse();
    for (const date of sortedDates) {
      const nightLog = records[date]?.nightLog;
      if (nightLog) {
        for (const pName of nightLog.products) {
          if (!order.has(pName)) {
            order.set(pName, order.size);
          }
        }
      }
    }
    return order;
  }, [records]);

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      const aOrder = recentUseOrder.get(a.name) ?? 9999;
      const bOrder = recentUseOrder.get(b.name) ?? 9999;
      return aOrder - bOrder;
    });
  }, [products, recentUseOrder]);

  const toggle = (name: string) => {
    if (selected.includes(name)) {
      onChange(selected.filter(n => n !== name));
    } else {
      onChange([...selected, name]);
    }
  };

  const toggleCategory = (cat: ProductCategory) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(cat)) {
        next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  };

  const handleAdd = () => {
    if (newName.trim() && onAddProduct) {
      onAddProduct(newName.trim(), newCategory);
      // Auto-select the new product
      onChange([...selected, newName.trim()]);
      setNewName('');
      setShowAddForm(false);
      // Auto-expand the category of the new product
      setExpandedCategories(prev => new Set(prev).add(newCategory));
    }
  };

  // Group products by category
  const groupedProducts = useMemo(() => {
    const groups: Record<ProductCategory, Product[]> = {} as any;
    for (const cat of CATEGORY_ORDER) {
      const catProducts = sortedProducts.filter(p => p.category === cat);
      if (catProducts.length > 0) {
        groups[cat] = catProducts;
      }
    }
    return groups;
  }, [sortedProducts]);

  const categoriesWithProducts = CATEGORY_ORDER.filter(cat => groupedProducts[cat]?.length > 0);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <h2 className="font-noto-serif text-xl font-medium text-on-surface">오늘 바른 제품</h2>
        {lastNightProducts && lastNightProducts.length > 0 && onCopyLastNight && (
          <button
            onClick={onCopyLastNight}
            className="flex items-center gap-1 text-primary text-sm font-semibold hover:opacity-70 transition-opacity"
          >
            <span className="material-symbols-outlined text-sm">history</span>
            어젯밤과 동일
          </button>
        )}
      </div>

      {/* Selected count summary */}
      {selected.length > 0 && (
        <p className="text-xs text-primary font-medium">
          {selected.length}개 제품 선택됨
        </p>
      )}

      {/* Category accordion */}
      <div className="space-y-2">
        {categoriesWithProducts.map(cat => {
          const catProducts = groupedProducts[cat];
          const isExpanded = expandedCategories.has(cat);
          const selectedInCat = catProducts.filter(p => selected.includes(p.name)).length;

          return (
            <div key={cat} className="rounded-xl overflow-hidden border border-outline-variant/8">
              {/* Category header (accordion toggle) */}
              <button
                onClick={() => toggleCategory(cat)}
                className="w-full flex items-center justify-between px-4 py-3 bg-surface-container-lowest hover:bg-surface-container-low transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-on-surface">{CATEGORY_LABELS[cat]}</span>
                  <span className="text-[10px] text-on-surface-variant/50">{catProducts.length}개</span>
                  {selectedInCat > 0 && (
                    <span className="bg-primary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {selectedInCat}
                    </span>
                  )}
                </div>
                <span className={`material-symbols-outlined text-on-surface-variant/50 text-lg transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </button>

              {/* Expanded product grid */}
              {isExpanded && (
                <div className="px-3 pb-3 pt-1 bg-surface-container-lowest">
                  <div className="grid grid-cols-2 gap-2">
                    {catProducts.map(product => {
                      const isSelected = selected.includes(product.name);
                      const isRecentlyUsed = recentUseOrder.has(product.name);
                      return (
                        <button
                          key={product.id}
                          onClick={() => toggle(product.name)}
                          className={`p-3 rounded-lg flex flex-col justify-between min-h-[80px] text-left transition-all ${
                            isSelected
                              ? 'bg-white shadow-sm border border-primary/15'
                              : 'bg-surface-container-low hover:bg-surface-container'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            {isRecentlyUsed && !isSelected && (
                              <span className="text-[9px] text-primary/50 font-medium">최근 사용</span>
                            )}
                            {isSelected && (
                              <span
                                className="material-symbols-outlined text-primary text-sm"
                                style={{ fontVariationSettings: "'FILL' 1" }}
                              >
                                check_circle
                              </span>
                            )}
                            {!isRecentlyUsed && !isSelected && <span />}
                          </div>
                          <p className="font-noto-serif text-on-surface text-sm leading-snug">
                            {product.name}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add product button */}
      {onAddProduct && !showAddForm && (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full py-3 rounded-xl bg-surface-container-low border border-dashed border-outline-variant/30 flex items-center justify-center gap-2 hover:bg-surface-container transition-colors"
        >
          <span className="material-symbols-outlined text-on-surface-variant/40 text-lg">add</span>
          <span className="text-sm text-on-surface-variant/60">제품 추가</span>
        </button>
      )}

      {/* Add product form */}
      {showAddForm && (
        <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
          <input
            type="text"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="제품 이름"
            className="w-full px-3 py-2 rounded-lg border border-outline-variant/30 text-sm font-body focus:ring-1 focus:ring-primary-container/30 focus:outline-none"
            autoFocus
          />
          <div className="flex gap-2 flex-wrap">
            {CATEGORY_ORDER.map(cat => (
              <button
                key={cat}
                onClick={() => setNewCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs ${
                  newCategory === cat
                    ? 'bg-primary text-white'
                    : 'bg-surface-container-highest text-on-surface-variant'
                }`}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              className="flex-1 py-2 rounded-full bg-primary text-white text-sm font-semibold"
            >
              추가
            </button>
            <button
              onClick={() => { setShowAddForm(false); setNewName(''); }}
              className="px-4 py-2 rounded-full bg-surface-container-highest text-on-surface-variant text-sm"
            >
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
