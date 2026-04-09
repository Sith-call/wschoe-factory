import { useState } from "react";
import { ArrowLeft, SkipForward } from "lucide-react";
import type { RebuttalCard, SessionCardState, ArgumentType } from "../lib/types";

interface Props {
  claim: string;
  cards: RebuttalCard[];
  states: SessionCardState[];
  onChange: (next: SessionCardState[]) => void;
  onBack: () => void;
  onFinish: () => void;
}

const TYPE_LABEL: Record<ArgumentType, string> = {
  DATA: "데이터",
  EMOTION: "감정",
  PRINCIPLE: "원칙",
  CASE: "사례",
};
const TYPE_CLASS: Record<ArgumentType, string> = {
  DATA: "data",
  EMOTION: "emotion",
  PRINCIPLE: "principle",
  CASE: "case",
};

export function SessionScreen({ claim, cards, states, onChange, onBack, onFinish }: Props) {
  const [idx, setIdx] = useState(0);
  const total = cards.length;
  const card = cards[idx];
  const state = states[idx];

  if (!card || !state) return null;

  function update(patch: Partial<SessionCardState>) {
    const next = states.slice();
    next[idx] = { ...next[idx], ...patch };
    onChange(next);
  }

  function next() {
    if (idx < total - 1) setIdx(idx + 1);
    else onFinish();
  }

  function skip() {
    update({ skipped: true, rebuttal: "" });
    next();
  }

  const progressLabel = `${String(idx + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;

  return (
    <>
      <div className="s3-header">
        <button className="icon-btn" aria-label="뒤로" onClick={onBack}>
          <ArrowLeft size={20} strokeWidth={1.75} />
        </button>
        <span className="progress-label">{progressLabel}</span>
        <div className="progress-bars">
          {cards.map((_, i) => (
            <span
              key={i}
              className={`bar ${i < idx ? "done" : i === idx ? "cur" : ""}`}
            />
          ))}
        </div>
      </div>

      <div className="claim-strip">
        <span className="eyebrow">내 주장</span>
        <p className="claim-text">"{claim}"</p>
      </div>

      <div className="content">
        <div className={`arg-card type-${TYPE_CLASS[card.type]}`} key={card.id}>
          <div className="arg-card-head">
            <span className={`badge ${TYPE_CLASS[card.type]}`}>
              {TYPE_LABEL[card.type]} · {card.type}
            </span>
            <span className="arg-card-meta">덱 {card.id}</span>
          </div>
          <h2 className="arg-card-title">"{card.title}"</h2>
          <p className="arg-card-body">{card.body}</p>
        </div>

        <div className="rebuttal-label">
          <span className="eyebrow">나의 재반박</span>
          <span
            className="counter mono"
            style={{ color: "var(--text-muted)", fontSize: 11 }}
          >
            {state.rebuttal.length}자{state.rebuttal.length > 0 && " · 자동 저장됨"}
          </span>
        </div>
        <textarea
          className="rebuttal-textarea"
          rows={6}
          placeholder="이 반론에 어떻게 맞설 것인가?"
          value={state.rebuttal}
          onChange={(e) => update({ rebuttal: e.target.value, skipped: false })}
        />
      </div>

      <div className="s3-actions">
        <button className="btn btn-secondary" onClick={skip}>
          <SkipForward size={18} strokeWidth={1.75} />
          스킵
        </button>
        <button
          className="btn btn-primary"
          disabled={state.rebuttal.trim().length === 0}
          onClick={next}
        >
          {idx === total - 1 ? "리포트 보기 →" : "다음 카드 →"}
        </button>
      </div>
    </>
  );
}
