import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, HelpCircle, FlaskConical, ChevronRight, ArrowRight } from 'lucide-react';
import { AppState, Term, Screen } from '../types';
import { getProgress, getMastery, markRead, saveState, updateStreak, isTermUnlocked } from '../store';

interface TermCardScreenProps {
  state: AppState;
  termId: string;
  terms: Term[];
  onStateChange: (s: AppState) => void;
  navigate: (s: Screen) => void;
  goBack?: () => void;
}

export function TermCardScreen({ state, termId, terms, onStateChange, navigate, goBack }: TermCardScreenProps) {
  const [toast, setToast] = useState<string | null>(null);
  const term = terms.find((t) => t.id === termId);
  if (!term) return null;

  const p = getProgress(state, termId);
  const mastery = getMastery(p, term.hasLab);
  const unlocked = isTermUnlocked(state, term.prerequisites);
  const isReadOnly = !unlocked;

  const prereqTerms = term.prerequisites
    .map((pid) => terms.find((t) => t.id === pid))
    .filter(Boolean) as Term[];

  const dependentTerms = terms.filter((t) => t.prerequisites.includes(termId));

  const catTerms = terms.filter((t) => t.category === term.category);
  const currentIndex = catTerms.findIndex((t) => t.id === termId);
  const nextTerm = catTerms[currentIndex + 1];

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  }

  function handleMarkRead() {
    let next = markRead(state, termId);
    next = updateStreak(next);
    saveState(next);
    onStateChange(next);
    showToast('읽기 완료로 기록되었습니다');
  }

  return (
    <div className="pb-24 px-4 max-w-screen-md mx-auto">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-ink text-white text-sm px-4 py-2 rounded-lg z-50 shadow-md">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="pt-6 pb-4">
        <button
          onClick={() => goBack ? goBack() : navigate({ type: 'termList', categoryId: term.category })}
          className="flex items-center gap-1 text-sm text-primary font-medium mb-3"
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
          목록으로
        </button>
      </div>

      {/* Term Header Card */}
      <div className="bg-surface-card border border-border rounded-lg p-5 mb-4">
        <p className="text-sm text-ink-secondary font-display">{term.english}</p>
        <h1 className="font-display text-2xl font-bold text-ink mt-1">{term.korean}</h1>
        <p className="text-base text-ink-secondary mt-3 leading-relaxed">{term.definition}</p>
      </div>

      {/* Explanation */}
      <div className="mb-4">
        <h2 className="font-display text-lg font-semibold text-ink mb-2">상세 설명</h2>
        <div className="bg-surface-card border border-border rounded-lg p-5">
          {term.explanation.split('\n\n').map((para, i) => (
            <p key={i} className="text-base text-ink leading-relaxed mb-3 last:mb-0">
              {para}
            </p>
          ))}
        </div>
      </div>

      {/* Key Points */}
      <div className="mb-4">
        <h2 className="font-display text-lg font-semibold text-ink mb-2">핵심 포인트</h2>
        <div className="bg-surface-card border border-border rounded-lg p-5">
          <ol className="space-y-2">
            {term.keyPoints.map((point, i) => (
              <li key={i} className="flex gap-3 text-base text-ink leading-relaxed">
                <span className="font-display font-semibold text-primary shrink-0">{i + 1}.</span>
                <span>{point}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Real World Example */}
      <div className="mb-4">
        <h2 className="font-display text-lg font-semibold text-ink mb-2">실생활 예시</h2>
        <div className="bg-surface-card border border-border rounded-lg p-5 border-l-2 border-l-primary">
          <p className="text-base text-ink leading-relaxed">{term.realWorldExample}</p>
        </div>
      </div>

      {/* News Connection */}
      <div className="mb-4">
        <h2 className="font-display text-lg font-semibold text-ink mb-2">뉴스에서 보면</h2>
        <div className="bg-surface-card border border-border rounded-lg p-5 border-l-2 border-l-secondary">
          <p className="text-base text-ink leading-relaxed">{term.newsConnection}</p>
        </div>
      </div>

      {/* Related Terms */}
      {(prereqTerms.length > 0 || dependentTerms.length > 0) && (
        <div className="mb-4">
          <h2 className="font-display text-lg font-semibold text-ink mb-2">관련 용어</h2>
          <div className="bg-surface-card border border-border rounded-lg divide-y divide-border">
            {prereqTerms.length > 0 && (
              <div className="p-4">
                <p className="text-sm text-ink-secondary mb-2">선행 용어</p>
                <div className="space-y-1">
                  {prereqTerms.map((pt) => (
                    <button
                      key={pt.id}
                      onClick={() => navigate({ type: 'termCard', termId: pt.id })}
                      className="flex items-center gap-2 text-base text-primary font-medium"
                    >
                      <ArrowLeft size={14} strokeWidth={1.5} />
                      {pt.korean}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {dependentTerms.length > 0 && (
              <div className="p-4">
                <p className="text-sm text-ink-secondary mb-2">후행 용어</p>
                <div className="space-y-1">
                  {dependentTerms.map((dt) => (
                    <button
                      key={dt.id}
                      onClick={() => navigate({ type: 'termCard', termId: dt.id })}
                      className="flex items-center gap-2 text-base text-primary font-medium"
                    >
                      {dt.korean}
                      <ArrowRight size={14} strokeWidth={1.5} />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
        <div className="space-y-3 mb-4">
          {!p.readAt && (
            <button
              onClick={handleMarkRead}
              className="w-full flex items-center justify-center gap-2 bg-primary text-white font-medium px-5 py-3 rounded-lg hover:bg-primary-dark"
            >
              <CheckCircle2 size={18} strokeWidth={1.5} />
              읽기 완료
            </button>
          )}
          {p.readAt && !p.quizPassed && (
            <button
              onClick={() => navigate({ type: 'quiz', termId })}
              className="w-full flex items-center justify-center gap-2 bg-primary text-white font-medium px-5 py-3 rounded-lg hover:bg-primary-dark"
            >
              <HelpCircle size={18} strokeWidth={1.5} />
              퀴즈 풀기
            </button>
          )}
          {term.hasLab && !p.labCompleted && (
              <button
                onClick={() => navigate({ type: 'lab', termId })}
                className="w-full flex items-center justify-center gap-2 bg-primary text-white font-medium px-5 py-3 rounded-lg hover:bg-primary-dark"
              >
                <FlaskConical size={18} strokeWidth={1.5} />
                실험하기
              </button>
          )}
          {term.hasLab && p.labCompleted && (
            <button
              onClick={() => navigate({ type: 'lab', termId })}
              className="w-full flex items-center justify-center gap-2 border border-primary text-primary font-medium px-5 py-3 rounded-lg hover:bg-primary-light"
            >
              <FlaskConical size={18} strokeWidth={1.5} />
              실험실 다시 하기
            </button>
          )}
          {nextTerm && (
            <button
              onClick={() => navigate({ type: 'termCard', termId: nextTerm.id })}
              className="w-full flex items-center justify-center gap-2 border border-border text-ink-secondary font-medium px-5 py-3 rounded-lg hover:bg-surface"
            >
              다음
              <ChevronRight size={18} strokeWidth={1.5} />
            </button>
          )}
        </div>
    </div>
  );
}
