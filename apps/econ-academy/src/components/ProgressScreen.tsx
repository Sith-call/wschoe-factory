import React from 'react';
import { Flame } from 'lucide-react';
import { AppState, Category, Term, Screen } from '../types';
import { catProgress } from '../store';
import { CategoryIcon } from './CategoryIcon';

interface ProgressScreenProps {
  state: AppState;
  categories: Category[];
  terms: Term[];
  navigate: (s: Screen) => void;
}

export function ProgressScreen({ state, categories, terms, navigate }: ProgressScreenProps) {
  const allIds = terms.map((t) => t.id);
  const overall = catProgress(state, allIds);
  const total = terms.length;
  const unlearned = total - overall.read;
  const readOnly = overall.read - overall.quiz;
  const quizOnly = overall.quiz - overall.master;
  const masterCount = overall.master;
  const overallPct = total > 0 ? Math.round((masterCount / total) * 100) : 0;

  function barWidth(count: number) {
    return total > 0 ? `${Math.round((count / total) * 100)}%` : '0%';
  }

  return (
    <div className="pb-24 px-4 max-w-screen-md mx-auto">
      {/* Header */}
      <div className="pt-6 pb-4">
        <h1 className="font-display text-2xl font-bold text-ink">학습 진도</h1>
      </div>

      {/* Overall Progress Card */}
      <div className="bg-surface-card border border-border rounded-lg p-5 mb-4">
        <div className="flex items-end gap-3 mb-3">
          <span className="font-display text-4xl font-bold text-primary">{overallPct}%</span>
          <span className="text-base text-ink-secondary pb-1">마스터 완료</span>
        </div>
        <div className="w-full h-2 bg-stone-100 rounded-full mb-3">
          <div
            className="h-2 bg-primary rounded-full transition-all duration-300 ease-out"
            style={{ width: `${overallPct}%` }}
          />
        </div>
        <div className="flex gap-4 text-sm text-ink-secondary">
          <span>마스터 {masterCount}</span>
          <span>퀴즈 {overall.quiz}</span>
          <span>읽기 {overall.read}</span>
          <span>전체 {total}</span>
        </div>
      </div>

      {/* Stage Distribution */}
      <div className="bg-surface-card border border-border rounded-lg p-5 mb-4">
        <h2 className="font-display text-lg font-semibold text-ink mb-4">단계별 분포</h2>
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-ink">마스터</span>
              <span className="text-ink-secondary">{masterCount}</span>
            </div>
            <div className="w-full h-3 bg-stone-100 rounded-full">
              <div className="h-3 bg-primary rounded-full transition-all duration-300" style={{ width: barWidth(masterCount) }} />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-ink">퀴즈 통과</span>
              <span className="text-ink-secondary">{quizOnly}</span>
            </div>
            <div className="w-full h-3 bg-stone-100 rounded-full">
              <div className="h-3 rounded-full transition-all duration-300" style={{ width: barWidth(quizOnly), backgroundColor: '#2DD4BF' }} />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-ink">읽기 완료</span>
              <span className="text-ink-secondary">{readOnly}</span>
            </div>
            <div className="w-full h-3 bg-stone-100 rounded-full">
              <div className="h-3 rounded-full transition-all duration-300" style={{ width: barWidth(readOnly), backgroundColor: '#99F6E4' }} />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-ink">미학습</span>
              <span className="text-ink-secondary">{unlearned}</span>
            </div>
            <div className="w-full h-3 bg-stone-100 rounded-full">
              <div className="h-3 bg-stone-300 rounded-full transition-all duration-300" style={{ width: barWidth(unlearned) }} />
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-surface-card border border-border rounded-lg p-5 mb-4">
        <h2 className="font-display text-lg font-semibold text-ink mb-4">카테고리별 진도</h2>
        <div className="space-y-3">
          {categories
            .sort((a, b) => a.order - b.order)
            .map((cat) => {
              const catTerms = terms.filter((t) => t.category === cat.id);
              const cp = catProgress(state, catTerms.map((t) => t.id));
              const pct = catTerms.length > 0 ? Math.round((cp.read / catTerms.length) * 100) : 0;

              return (
                <div key={cat.id}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <div className="flex items-center gap-2">
                      <CategoryIcon name={cat.icon} size={16} className="text-ink-secondary" />
                      <span className="text-ink">{cat.name}</span>
                    </div>
                    <span className="text-ink-secondary">{cp.read}/{catTerms.length}</span>
                  </div>
                  <div className="w-full h-1.5 bg-stone-100 rounded-full">
                    <div
                      className="h-1.5 bg-primary rounded-full transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-surface-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <Flame size={18} strokeWidth={1.5} className="text-secondary" />
            <span className="text-sm text-ink-secondary">연속 학습</span>
          </div>
          <p className="font-display text-2xl font-bold text-ink">{state.streak}일</p>
        </div>
        <div className="bg-surface-card border border-border rounded-lg p-4">
          <span className="text-sm text-ink-secondary">퀴즈 시도</span>
          <p className="font-display text-2xl font-bold text-ink mt-1">{state.quizAttempts}회</p>
        </div>
      </div>

      {/* Settings link */}
      <button
        onClick={() => navigate({ type: 'settings' })}
        className="w-full text-sm text-ink-secondary text-center py-3 hover:text-ink"
      >
        설정 (데이터 초기화)
      </button>
    </div>
  );
}
