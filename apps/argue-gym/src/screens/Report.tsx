import { ArrowLeft, Bookmark, RefreshCw } from "lucide-react";
import type { RebuttalCard, SessionCardState, ArgumentType } from "../lib/types";
import { computeReport } from "../lib/report";

interface Props {
  claim: string;
  cards: RebuttalCard[];
  states: SessionCardState[];
  readonly: boolean;
  createdAt: number;
  onBack: () => void;
  onRetry: () => void;
  onNewClaim: () => void;
  onSave: () => void;
}

const TYPES: ArgumentType[] = ["DATA", "EMOTION", "PRINCIPLE", "CASE"];
const TYPE_CLASS: Record<ArgumentType, string> = {
  DATA: "data",
  EMOTION: "emotion",
  PRINCIPLE: "principle",
  CASE: "case",
};

function formatDate(ts: number): string {
  const d = new Date(ts);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

export function Report({
  claim,
  cards,
  states,
  readonly,
  createdAt,
  onBack,
  onRetry,
  onNewClaim,
  onSave,
}: Props) {
  const stats = computeReport(cards, states);
  const maxN = Math.max(1, ...TYPES.map((t) => stats.distribution[t]));
  const usedCount = TYPES.filter((t) => stats.distribution[t] > 0).length;

  return (
    <>
      <div className="header">
        <button className="icon-btn" aria-label="뒤로" onClick={onBack}>
          <ArrowLeft size={20} strokeWidth={1.75} />
        </button>
        <span className="title">세션 리포트</span>
        <div className="header-spacer" />
        {!readonly && (
          <button className="icon-btn" aria-label="저장" onClick={onSave}>
            <Bookmark size={20} strokeWidth={1.75} />
          </button>
        )}
      </div>
      <div className="content">
        <div className="report-hero">
          <span className="eyebrow" style={{ color: "var(--ink)" }}>
            SESSION · {formatDate(createdAt)}
          </span>
          <p className="report-claim" style={{ marginTop: 10 }}>
            "{claim}"
          </p>
          <div className="report-stats">
            <div className="stat">
              <span className="stat-num">{stats.totalChars}</span>
              <span className="stat-unit">자</span>
              <div className="stat-label">총 재반박</div>
            </div>
            <div className="stat">
              <span className="stat-num">
                {stats.completed} / {cards.length}
              </span>
              <div className="stat-label">완주</div>
            </div>
            <div className="stat">
              <span className="stat-num">{stats.skipped}</span>
              <div className="stat-label">회피 스킵</div>
            </div>
          </div>
        </div>

        <div className="type-dist">
          <div className="type-dist-title">
            <span className="eyebrow" style={{ color: "var(--ink)" }}>
              논거 유형 분포
            </span>
            <span
              className="counter mono"
              style={{ color: "var(--text-muted)", fontSize: 11 }}
            >
              {usedCount} types used
            </span>
          </div>
          <div className="type-bars">
            {TYPES.map((t) => {
              const n = stats.distribution[t];
              const pct = (n / maxN) * 100;
              return (
                <div key={t} className={`type-bar-row ${TYPE_CLASS[t]}`}>
                  <span className="lbl">{t}</span>
                  <div className="type-bar-track">
                    <div className="type-bar-fill" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="n">{n}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="report-comment">
          <span className="eyebrow">코멘트</span>
          {stats.comments.map((c, i) => (
            <p key={i}>{c}</p>
          ))}
        </div>

        {readonly && (
          <div className="report-replay">
            <span className="eyebrow" style={{ color: "var(--ink)" }}>
              복기
            </span>
            {cards.map((card, i) => {
              const state = states[i];
              const rebuttal = state?.rebuttal?.trim() ?? "";
              const skipped = !!state?.skipped;
              return (
                <div
                  key={card.id}
                  className={`rebuttal-card ${TYPE_CLASS[card.type]}`}
                  style={{ marginTop: i === 0 ? 12 : 16 }}
                >
                  <div className="card-meta">
                    <span className="tag">
                      {
                        {
                          DATA: "데이터 · DATA",
                          EMOTION: "감정 · EMOTION",
                          PRINCIPLE: "원칙 · PRINCIPLE",
                          CASE: "사례 · CASE",
                        }[card.type]
                      }
                    </span>
                    <span className="deck-id mono">덱 {card.id}</span>
                  </div>
                  <h2 className="card-title" style={{ fontSize: 17, lineHeight: 1.4 }}>
                    "{card.title}"
                  </h2>
                  <p className="card-body" style={{ marginTop: 6 }}>
                    {card.body}
                  </p>
                  <div
                    style={{
                      marginTop: 12,
                      paddingTop: 10,
                      borderTop: "1px dashed var(--rule)",
                    }}
                  >
                    <span
                      className="eyebrow"
                      style={{ color: "var(--text-muted)", fontSize: 10 }}
                    >
                      내가 쓴 재반박
                    </span>
                    {skipped ? (
                      <p
                        style={{
                          marginTop: 6,
                          color: "var(--text-muted)",
                          fontStyle: "italic",
                        }}
                      >
                        (건너뛴 카드)
                      </p>
                    ) : rebuttal ? (
                      <p style={{ marginTop: 6, whiteSpace: "pre-wrap" }}>{rebuttal}</p>
                    ) : (
                      <p
                        style={{
                          marginTop: 6,
                          color: "var(--text-muted)",
                          fontStyle: "italic",
                        }}
                      >
                        (작성하지 않음)
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!readonly && (
          <div className="report-actions">
            <button className="btn btn-primary btn-block" onClick={onRetry}>
              <RefreshCw size={18} strokeWidth={1.75} />
              같은 주장으로 다시
            </button>
            <button className="btn btn-secondary btn-block" onClick={onNewClaim}>
              새 주장 쓰기
            </button>
            <button
              className="btn btn-text"
              style={{ marginTop: 4, alignSelf: "flex-start" }}
              onClick={onSave}
            >
              기록 저장하고 닫기
            </button>
          </div>
        )}
      </div>
    </>
  );
}
