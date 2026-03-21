import React, { useState } from 'react';
import type { Product, ProductCategory, SkinRecord } from '../types';
import { CATEGORY_LABELS, CATEGORY_ORDER } from '../types';
import { ChevronLeftIcon, PlusIcon, TrashIcon } from '../components/Icons';

interface ProductListPageProps {
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
}: ProductListPageProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<ProductCategory>('serum');
  const [showArchived, setShowArchived] = useState(false);

  const activeProducts = products.filter(p => !p.archived);

  // Count usage per product
  const usageCounts: Record<string, number> = {};
  for (const r of Object.values(records)) {
    if (r.nightLog) {
      for (const p of r.nightLog.products) {
        usageCounts[p] = (usageCounts[p] || 0) + 1;
      }
    }
  }

  const grouped = CATEGORY_ORDER.reduce<Record<string, Product[]>>((acc, cat) => {
    const items = activeProducts.filter(p => p.category === cat);
    if (items.length > 0) acc[cat] = items;
    return acc;
  }, {});

  const handleAdd = () => {
    if (newName.trim()) {
      onAddProduct(newName.trim(), newCategory);
      setNewName('');
      setShowAdd(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-sd-bg overflow-y-auto">
      <div className="max-w-[430px] mx-auto min-h-screen">
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-sd-border">
          <button onClick={onBack} aria-label="뒤로" className="text-sd-text min-w-[44px] min-h-[44px] flex items-center justify-center">
            <ChevronLeftIcon size={22} />
          </button>
          <span className="font-heading text-lg text-sd-text">내 제품</span>
          <div className="w-[22px]" />
        </div>

        <div className="px-5 py-6 space-y-6">
          {/* Add button */}
          {!showAdd ? (
            <button
              onClick={() => setShowAdd(true)}
              className="w-full border border-sd-primary text-sd-primary rounded-xl px-5 py-2.5 font-body font-medium text-sm flex items-center justify-center gap-1"
            >
              <PlusIcon size={16} />
              새 제품 추가
            </button>
          ) : (
            <div className="bg-sd-primary-light rounded-xl p-4 space-y-3">
              <div className="flex flex-wrap gap-1.5">
                {CATEGORY_ORDER.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setNewCategory(cat)}
                    className={`rounded-full px-3 py-1 text-[0.8125rem] font-body ${
                      newCategory === cat
                        ? 'bg-sd-primary text-white'
                        : 'bg-white text-sd-text-secondary border border-sd-border'
                    }`}
                  >
                    {CATEGORY_LABELS[cat]}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="제품명을 입력하세요"
                className="w-full rounded-lg border border-sd-border px-3 py-2 text-sm font-body text-sd-text bg-white focus:outline-none focus:border-sd-primary"
                onKeyDown={e => e.key === 'Enter' && handleAdd()}
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => { setShowAdd(false); setNewName(''); }}
                  className="border border-sd-primary text-sd-primary rounded-xl px-4 py-1.5 text-sm font-body font-medium"
                >
                  취소
                </button>
                <button
                  onClick={handleAdd}
                  disabled={!newName.trim()}
                  className="bg-sd-primary text-white rounded-xl px-4 py-1.5 text-sm font-body font-medium disabled:opacity-50"
                >
                  추가하기
                </button>
              </div>
            </div>
          )}

          {/* Product list by category */}
          {Object.entries(grouped).map(([cat, items]) => (
            <div key={cat}>
              <p className="font-body text-[0.8125rem] text-sd-text-secondary mb-2">
                {CATEGORY_LABELS[cat as ProductCategory]}
              </p>
              <div className="space-y-1">
                {items.map(product => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between bg-white border border-sd-border rounded-lg px-4 py-3"
                  >
                    <div>
                      <p className="font-body text-sm text-sd-text">{product.name}</p>
                      <p className="font-body text-[0.8125rem] text-sd-text-secondary">
                        사용 {usageCounts[product.name] || 0}회
                      </p>
                    </div>
                    <button
                      onClick={() => onArchive(product.id)}
                      className="text-sd-text-tertiary text-[0.8125rem] font-body"
                    >
                      보관
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Archived section */}
          {archivedProducts.length > 0 && (
            <div>
              <button
                onClick={() => setShowArchived(!showArchived)}
                className="font-body text-sm text-sd-text-secondary flex items-center gap-1"
              >
                보관된 제품 ({archivedProducts.length})
                <span className="text-[0.8125rem]">{showArchived ? '접기' : '펼치기'}</span>
              </button>

              {showArchived && (
                <div className="mt-2 space-y-1">
                  {archivedProducts.map(product => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between bg-white border border-sd-border rounded-lg px-4 py-3 opacity-60"
                    >
                      <p className="font-body text-sm text-sd-text">{product.name}</p>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => onUnarchive(product.id)}
                          className="text-sd-primary text-[0.8125rem] font-body"
                        >
                          복원
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`"${product.name}"을 영구 삭제할까요?`)) {
                              onDelete(product.id);
                            }
                          }}
                          className="text-sd-danger"
                        >
                          <TrashIcon size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
