import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { CATEGORIES, type Category } from "../lib/types";

interface Props {
  initialClaim: string;
  initialCategory: Category;
  onBack: () => void;
  onSubmit: (claim: string, category: Category) => void;
}

const MAX = 120;

export function ClaimInput({ initialClaim, initialCategory, onBack, onSubmit }: Props) {
  const [claim, setClaim] = useState(initialClaim);
  const [cat, setCat] = useState<Category>(initialCategory);

  const valid = claim.trim().length >= 5;

  return (
    <>
      <div className="header">
        <button className="icon-btn" aria-label="뒤로" onClick={onBack}>
          <ArrowLeft size={20} strokeWidth={1.75} />
        </button>
        <span className="title">주장 입력</span>
        <div className="header-spacer" />
        <span className="header-right mono">01 / 02</span>
      </div>
      <div className="content">
        <div className="section" style={{ marginTop: 12 }}>
          <div className="section-label">
            <span className="eyebrow">당신의 주장</span>
            <span className="counter">{claim.length} / {MAX}</span>
          </div>
          <textarea
            className="textarea"
            rows={3}
            maxLength={MAX}
            placeholder="한 문장 주장을 적어보세요"
            value={claim}
            onChange={(e) => setClaim(e.target.value)}
          />
          <p className="textarea-hint">한 문장으로 또렷하게. 쉼표보다 마침표를.</p>
        </div>

        <div className="section">
          <div className="section-label">
            <span className="eyebrow">카테고리</span>
            <span className="counter">택 1</span>
          </div>
          <div className="chips">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                className={`chip ${cat === c.id ? "is-selected" : ""}`}
                onClick={() => setCat(c.id)}
              >
                <span className="dot" />
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div className="section">
          <div className="section-label">
            <span className="eyebrow">훈련 강도</span>
            <span className="counter">기본</span>
          </div>
          <p className="small">
            카테고리{" "}
            <b style={{ color: "var(--ink)", fontWeight: 500 }}>
              {CATEGORIES.find((c) => c.id === cat)?.label}
            </b>{" "}
            덱에서 근거 유형이 겹치지 않도록 반론 카드 3장을 선별합니다.
          </p>
        </div>
      </div>
      <div className="sticky-bottom">
        <button
          className="btn btn-primary btn-block"
          disabled={!valid}
          onClick={() => onSubmit(claim.trim(), cat)}
        >
          반론 받기 →
        </button>
      </div>
    </>
  );
}
