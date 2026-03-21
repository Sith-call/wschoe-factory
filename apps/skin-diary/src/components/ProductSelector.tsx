import React, { useState } from 'react';
import type { Product, ProductCategory } from '../types';
import { CATEGORY_LABELS, CATEGORY_ORDER } from '../types';
import { PlusIcon } from './Icons';

interface ProductSelectorProps {
  products: Product[];
  selected: string[];
  onChange: (products: string[]) => void;
  onAddProduct: (name: string, category: ProductCategory) => void;
}

export function ProductSelector({ products, selected, onChange, onAddProduct }: ProductSelectorProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<ProductCategory>('serum');

  const toggle = (productName: string) => {
    if (selected.includes(productName)) {
      onChange(selected.filter(n => n !== productName));
    } else {
      onChange([...selected, productName]);
    }
  };

  const grouped = CATEGORY_ORDER.reduce<Record<string, Product[]>>((acc, cat) => {
    const items = products.filter(p => p.category === cat && !p.archived);
    if (items.length > 0) {
      acc[cat] = items;
    }
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
    <div className="space-y-4">
      {Object.entries(grouped).map(([cat, items]) => (
        <div key={cat}>
          <p className="font-body text-[0.8125rem] text-sd-text-secondary mb-2">
            {CATEGORY_LABELS[cat as ProductCategory]}
          </p>
          <div className="flex flex-wrap gap-2">
            {items.map(product => {
              const isSelected = selected.includes(product.name);
              return (
                <button
                  key={product.id}
                  onClick={() => toggle(product.name)}
                  className={`rounded-full px-3.5 py-1.5 text-sm font-body ${
                    isSelected
                      ? 'border border-sd-primary text-white bg-sd-primary'
                      : 'border border-sd-border text-sd-text-secondary bg-white'
                  }`}
                  aria-pressed={isSelected}
                >
                  {product.name}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {!showAdd ? (
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1 text-sd-primary text-sm font-body"
        >
          <PlusIcon size={16} />
          <span>제품 추가</span>
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
    </div>
  );
}
