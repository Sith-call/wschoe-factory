import React, { useState } from 'react';
import type { ProductCategory } from '../types';
import { CATEGORY_LABELS, CATEGORY_ORDER } from '../types';
import { PlusIcon } from '../components/Icons';

interface OnboardingPageProps {
  onComplete: (profile: { name: string; skinTypes: string[] }, products: { name: string; category: ProductCategory }[]) => void;
  onLoadDemo: () => void;
}

const SKIN_TYPES = ['건성', '복합성', '지성', '민감성'];

export function OnboardingPage({ onComplete, onLoadDemo }: OnboardingPageProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [skinTypes, setSkinTypes] = useState<string[]>([]);
  const [products, setProducts] = useState<{ name: string; category: ProductCategory }[]>([]);
  const [newName, setNewName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('toner');

  const toggleSkinType = (t: string) => {
    setSkinTypes(prev =>
      prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]
    );
  };

  const addProduct = () => {
    if (newName.trim()) {
      setProducts([...products, { name: newName.trim(), category: selectedCategory }]);
      setNewName('');
    }
  };

  const removeProduct = (idx: number) => {
    setProducts(products.filter((_, i) => i !== idx));
  };

  return (
    <div className="min-h-screen bg-sd-bg flex flex-col">
      {/* Progress */}
      <div className="px-5 pt-6 pb-2">
        <p className="font-body text-sm text-sd-text-secondary mb-2">{step}단계 / 3단계</p>
        <div className="h-1 bg-sd-border rounded-full overflow-hidden">
          <div
            className="h-full bg-sd-primary rounded-full transition-all duration-200"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex-1 px-5 pt-8">
        {step === 1 && (
          <div>
            <h1 className="font-heading text-2xl text-sd-text font-bold mb-4">
              피부는 어제의 결과예요
            </h1>
            <div className="space-y-3 font-body text-[0.9375rem] text-sd-text-secondary leading-relaxed">
              <p>어젯밤 바른 것 + 오늘 한 것</p>
              <p>그 결과가 내일 아침 피부 상태.</p>
              <p className="pt-2">매일 30초씩 기록하면<br/>나에게 맞는 루틴을<br/>데이터로 찾을 수 있어요.</p>
            </div>

            <div className="mt-8">
              <label className="font-body text-sm text-sd-text-secondary block mb-2">이름</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="이름을 알려주세요"
                className="w-full rounded-lg border border-sd-border px-4 py-3 font-body text-sm text-sd-text bg-white focus:outline-none focus:border-sd-primary"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h1 className="font-heading text-2xl text-sd-text font-bold mb-2">
              피부 타입을 알려주세요
            </h1>
            <p className="font-body text-sm text-sd-text-secondary mb-6">복수 선택 가능</p>

            <div className="grid grid-cols-2 gap-3">
              {SKIN_TYPES.map(t => (
                <button
                  key={t}
                  onClick={() => toggleSkinType(t)}
                  className={`rounded-xl px-4 py-3 font-body text-sm text-center ${
                    skinTypes.includes(t)
                      ? 'bg-sd-primary text-white'
                      : 'bg-white border border-sd-border text-sd-text'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h1 className="font-heading text-2xl text-sd-text font-bold mb-2">
              지금 쓰고 있는 제품을<br/>등록해볼까요?
            </h1>
            <p className="font-body text-sm text-sd-text-secondary mb-6">나중에 추가할 수도 있어요</p>

            <div className="mb-4">
              <div className="flex flex-wrap gap-1.5 mb-3">
                {CATEGORY_ORDER.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-full px-3 py-1 text-[0.8125rem] font-body ${
                      selectedCategory === cat
                        ? 'bg-sd-primary text-white'
                        : 'bg-white text-sd-text-secondary border border-sd-border'
                    }`}
                  >
                    {CATEGORY_LABELS[cat]}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="제품명을 입력하세요"
                  className="flex-1 rounded-lg border border-sd-border px-3 py-2 text-sm font-body text-sd-text bg-white focus:outline-none focus:border-sd-primary"
                  onKeyDown={e => e.key === 'Enter' && addProduct()}
                />
                <button
                  onClick={addProduct}
                  disabled={!newName.trim()}
                  className="border border-sd-primary text-sd-primary rounded-xl px-3 py-2 disabled:opacity-50 flex items-center gap-1"
                >
                  <PlusIcon size={16} />
                  <span className="font-body text-sm">추가</span>
                </button>
              </div>
            </div>

            {products.length > 0 && (
              <div className="space-y-2">
                <p className="font-body text-sm text-sd-text-secondary">등록된 제품:</p>
                {products.map((p, i) => (
                  <div key={i} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-sd-border">
                    <span className="font-body text-sm text-sd-text">
                      <span className="text-sd-text-secondary">{CATEGORY_LABELS[p.category]}</span> — {p.name}
                    </span>
                    <button
                      onClick={() => removeProduct(i)}
                      className="text-sd-danger text-sm font-body"
                    >
                      삭제
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="px-5 pb-8 pt-4 space-y-2">
        {step < 3 ? (
          <>
            <button
              onClick={() => setStep(step + 1)}
              disabled={step === 1 && !name.trim()}
              className="w-full bg-sd-primary text-white rounded-xl px-5 py-3 font-body font-medium disabled:opacity-50"
            >
              다음
            </button>
            {step === 2 && (
              <button
                onClick={() => setStep(3)}
                className="w-full text-sd-primary underline text-sm font-body"
              >
                건너뛰기
              </button>
            )}
          </>
        ) : (
          <>
            <button
              onClick={() => onComplete({ name, skinTypes }, products)}
              className="w-full bg-sd-primary text-white rounded-xl px-5 py-3 font-body font-medium"
            >
              시작하기
            </button>
            <button
              onClick={onLoadDemo}
              className="w-full text-sd-primary underline text-sm font-body"
            >
              데모 데이터로 체험하기
            </button>
          </>
        )}
      </div>
    </div>
  );
}
