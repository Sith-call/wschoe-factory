import React, { useState } from 'react';
import type { ProductCategory } from '../types';
import { CATEGORY_LABELS, CATEGORY_ORDER } from '../types';

interface Props {
  onComplete: (profile: { name: string; skinTypes: string[] }, products: { name: string; category: ProductCategory }[]) => void;
  onLoadDemo: () => void;
}

const SKIN_TYPES = ['건성', '복합성', '지성', '민감성', '중성'];

export function OnboardingPage({ onComplete, onLoadDemo }: Props) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [skinTypes, setSkinTypes] = useState<string[]>([]);
  const [products, setProducts] = useState<{ name: string; category: ProductCategory }[]>([]);
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState<ProductCategory>('serum');

  const toggleSkinType = (type: string) => {
    setSkinTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const addProduct = () => {
    if (newProductName.trim()) {
      setProducts(prev => [...prev, { name: newProductName.trim(), category: newProductCategory }]);
      setNewProductName('');
    }
  };

  const removeProduct = (idx: number) => {
    setProducts(prev => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Content */}
      <div className="flex-1 px-6 pt-16 pb-10">
        {step === 0 && (
          <div className="space-y-10">
            <div className="space-y-4">
              <span className="material-symbols-outlined text-primary text-4xl">spa</span>
              <h1 className="font-headline text-3xl font-light text-on-surface leading-tight">
                피부 일지에<br />오신 것을 환영해요
              </h1>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                매일 스킨케어 루틴과 피부 상태를 기록하고,<br />
                나에게 맞는 제품과 습관을 데이터로 발견하세요.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setStep(1)}
                className="w-full py-4 rounded-full bg-gradient-to-r from-primary to-primary-container text-white font-body font-semibold text-base shadow-lg active:scale-[0.98] transition-transform"
              >
                시작하기
              </button>
              <button
                onClick={onLoadDemo}
                className="w-full py-3 rounded-full border border-outline-variant/30 text-on-surface-variant font-body text-sm active:scale-[0.98] transition-transform"
              >
                데모로 먼저 살펴보기
              </button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-8">
            <div className="space-y-2">
              <span className="font-body text-xs text-primary font-medium tracking-widest">STEP 01</span>
              <h2 className="font-headline text-2xl text-on-surface">이름을 알려주세요</h2>
            </div>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="예: 지은"
              className="w-full px-0 py-3 border-0 border-b-2 border-outline-variant/30 bg-transparent font-headline text-xl text-on-surface focus:ring-0 focus:border-primary placeholder:text-on-surface-variant/30"
              autoFocus
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8">
            <div className="space-y-2">
              <span className="font-body text-xs text-primary font-medium tracking-widest">STEP 02</span>
              <h2 className="font-headline text-2xl text-on-surface">피부 타입은요?</h2>
              <p className="text-xs text-on-surface-variant/60">복수 선택 가능</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {SKIN_TYPES.map(type => (
                <button
                  key={type}
                  onClick={() => toggleSkinType(type)}
                  className={`px-6 py-3 rounded-full text-sm font-medium transition-colors ${
                    skinTypes.includes(type)
                      ? 'bg-primary text-white'
                      : 'bg-surface-container-low text-on-surface-variant border border-outline-variant/20'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="font-body text-xs text-primary font-medium tracking-widest">STEP 03</span>
              <h2 className="font-headline text-2xl text-on-surface">사용 중인 제품</h2>
              <p className="text-xs text-on-surface-variant/60">나중에 추가할 수도 있어요</p>
            </div>

            {/* Added products */}
            {products.length > 0 && (
              <div className="space-y-2">
                {products.map((p, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-surface-container-lowest rounded-xl p-4"
                  >
                    <div>
                      <p className="text-sm font-medium text-on-surface">{p.name}</p>
                      <p className="text-[10px] text-on-surface-variant/60 uppercase">{CATEGORY_LABELS[p.category]}</p>
                    </div>
                    <button
                      onClick={() => removeProduct(i)}
                      className="text-on-surface-variant/40"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add form */}
            <div className="space-y-3">
              <input
                type="text"
                value={newProductName}
                onChange={e => setNewProductName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addProduct()}
                placeholder="제품 이름"
                className="w-full px-4 py-3 rounded-xl border border-outline-variant/30 bg-white text-sm font-body focus:ring-1 focus:ring-primary-container/30 focus:outline-none"
              />
              <div className="flex gap-2 flex-wrap">
                {CATEGORY_ORDER.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setNewProductCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs transition-colors ${
                      newProductCategory === cat
                        ? 'bg-primary text-white'
                        : 'bg-surface-container-highest text-on-surface-variant'
                    }`}
                  >
                    {CATEGORY_LABELS[cat]}
                  </button>
                ))}
              </div>
              {newProductName.trim() && (
                <button
                  onClick={addProduct}
                  className="text-sm font-semibold text-primary"
                >
                  + 추가
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom navigation */}
      {step > 0 && (
        <div className="px-6 pb-10 pt-4 bg-gradient-to-t from-background to-transparent">
          <div className="flex gap-3">
            <button
              onClick={() => setStep(s => s - 1)}
              className="px-6 py-3 rounded-full border border-outline-variant/30 text-on-surface-variant font-body text-sm"
            >
              이전
            </button>
            <button
              onClick={() => {
                if (step === 3) {
                  onComplete({ name: name || '사용자', skinTypes }, products);
                } else {
                  setStep(s => s + 1);
                }
              }}
              disabled={step === 1 && !name.trim()}
              className={`flex-1 py-3 rounded-full font-body font-semibold text-sm transition-all ${
                (step === 1 && !name.trim())
                  ? 'bg-surface-container-highest text-on-surface-variant/40'
                  : 'bg-primary text-white active:scale-[0.98]'
              }`}
            >
              {step === 3 ? '완료' : '다음'}
            </button>
          </div>

          {/* Progress dots */}
          <div className="flex justify-center gap-2 mt-4">
            {[1, 2, 3].map(s => (
              <div
                key={s}
                className={`w-2 h-2 rounded-full ${
                  s === step ? 'bg-primary' : 'bg-outline-variant/30'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
