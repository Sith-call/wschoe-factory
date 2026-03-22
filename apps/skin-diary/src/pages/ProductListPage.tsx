import React, { useState } from 'react';
import type { Product, ProductCategory, SkinRecord } from '../types';
import { CATEGORY_LABELS, CATEGORY_ORDER } from '../types';

interface Props {
  products: Product[];
  archivedProducts: Product[];
  records: Record<string, SkinRecord>;
  onAddProduct: (name: string, category: ProductCategory) => void;
  onArchive: (id: string) => void;
  onUnarchive: (id: string) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
}

export function ProductListPage({
  products,
  archivedProducts,
  records,
  onAddProduct,
  onArchive,
  onUnarchive,
  onDelete,
  onBack,
}: Props) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<ProductCategory>('serum');
  const [showArchived, setShowArchived] = useState(false);

  const handleAdd = () => {
    if (newName.trim()) {
      onAddProduct(newName.trim(), newCategory);
      setNewName('');
      setShowAddForm(false);
    }
  };

  // Count usage for each product
  const usageCounts: Record<string, number> = {};
  for (const r of Object.values(records)) {
    if (r.nightLog) {
      for (const p of r.nightLog.products) {
        usageCounts[p] = (usageCounts[p] || 0) + 1;
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-surface flex justify-center">
      <div className="w-full max-w-[430px] bg-surface min-h-screen">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 sticky top-0 bg-background z-10">
          <button onClick={onBack} className="active:scale-95 transition-transform text-primary">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="font-headline text-lg font-semibold text-primary">제품 관리</h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="text-primary active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined">add</span>
          </button>
        </header>

        <main className="px-6 pb-10 space-y-6">
          {/* Add form */}
          {showAddForm && (
            <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm space-y-3">
              <input
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAdd()}
                placeholder="제품 이름"
                className="w-full px-3 py-2 rounded-lg border border-outline-variant/30 text-sm font-body focus:ring-1 focus:ring-primary-container/30 focus:outline-none"
                autoFocus
              />
              <div className="flex gap-2 flex-wrap">
                {CATEGORY_ORDER.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setNewCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs transition-colors ${
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
                <button onClick={handleAdd} className="flex-1 py-2 rounded-full bg-primary text-white text-sm font-semibold">
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

          {/* Active products */}
          <div className="space-y-2">
            {products.map(product => (
              <div
                key={product.id}
                className="flex items-center justify-between bg-surface-container-lowest rounded-xl p-4"
              >
                <div className="flex-1">
                  <p className="font-body text-sm font-medium text-on-surface">{product.name}</p>
                  <p className="text-[10px] text-on-surface-variant/60 uppercase tracking-wider">
                    {CATEGORY_LABELS[product.category]}
                    {usageCounts[product.name] && ` · ${usageCounts[product.name]}회 사용`}
                  </p>
                </div>
                <button
                  onClick={() => onArchive(product.id)}
                  className="text-on-surface-variant/40 hover:text-on-surface-variant transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">archive</span>
                </button>
              </div>
            ))}
          </div>

          {products.length === 0 && !showAddForm && (
            <div className="bg-surface-container-low rounded-xl p-8 text-center space-y-3">
              <span className="material-symbols-outlined text-primary-container text-3xl">inventory_2</span>
              <p className="text-sm text-on-surface-variant">등록된 제품이 없어요</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="text-sm font-semibold text-primary"
              >
                제품 추가하기
              </button>
            </div>
          )}

          {/* Archived products */}
          {archivedProducts.length > 0 && (
            <div>
              <button
                onClick={() => setShowArchived(!showArchived)}
                className="flex items-center gap-1 text-sm text-on-surface-variant mb-3"
              >
                <span className="material-symbols-outlined text-sm">
                  {showArchived ? 'expand_less' : 'expand_more'}
                </span>
                보관된 제품 ({archivedProducts.length})
              </button>
              {showArchived && (
                <div className="space-y-2">
                  {archivedProducts.map(product => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between bg-surface-container-low rounded-xl p-4 opacity-60"
                    >
                      <div className="flex-1">
                        <p className="font-body text-sm text-on-surface">{product.name}</p>
                        <p className="text-[10px] text-on-surface-variant/60 uppercase tracking-wider">
                          {CATEGORY_LABELS[product.category]}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => onUnarchive(product.id)}
                          className="text-primary text-xs font-medium"
                        >
                          복원
                        </button>
                        <button
                          onClick={() => onDelete(product.id)}
                          className="text-error text-xs"
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
