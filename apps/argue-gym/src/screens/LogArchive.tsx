import { ArrowLeft } from "lucide-react";
import type { Session } from "../lib/types";
import { CATEGORY_LABEL } from "../lib/types";

interface Props {
  sessions: Session[];
  onBack: () => void;
  onOpen: (s: Session) => void;
}

function fmt(ts: number) {
  const d = new Date(ts);
  const mo = d.toLocaleString("en-US", { month: "short" }).toUpperCase();
  return `${mo} ${String(d.getDate()).padStart(2, "0")} · ${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes()
  ).padStart(2, "0")}`;
}

export function LogArchive({ sessions, onBack, onOpen }: Props) {
  return (
    <>
      <div className="header">
        <button className="icon-btn" aria-label="뒤로" onClick={onBack}>
          <ArrowLeft size={20} strokeWidth={1.75} />
        </button>
        <span className="title">훈련 일지</span>
        <div className="header-spacer" />
        <span className="header-right">{String(sessions.length).padStart(2, "0")} TOTAL</span>
      </div>
      <div className="content">
        {sessions.length === 0 ? (
          <div style={{ padding: "48px 0", textAlign: "left" }}>
            <p
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontSize: 18,
                color: "var(--text-muted)",
                lineHeight: 1.55,
                marginBottom: 20,
              }}
            >
              아직 훈련 기록이 없어요.
              <br />
              첫 주장을 써볼까요?
            </p>
            <button className="btn btn-primary" onClick={onBack}>
              첫 세션 시작하기
            </button>
          </div>
        ) : (
          <div style={{ borderTop: "1px solid var(--rule)", marginTop: 8 }}>
            {sessions.map((s) => {
              const chars = s.cards.reduce((n, c) => n + c.rebuttal.trim().length, 0);
              const skipped = s.cards.filter((c) => c.skipped).length;
              return (
                <button
                  key={s.id}
                  onClick={() => onOpen(s)}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    background: "transparent",
                    border: 0,
                    borderBottom: "1px solid var(--rule)",
                    padding: "16px 0",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      marginBottom: 6,
                    }}
                  >
                    <span
                      className="mono"
                      style={{
                        fontSize: 11,
                        color: "var(--text-muted)",
                        letterSpacing: "0.06em",
                      }}
                    >
                      {fmt(s.createdAt)} · {CATEGORY_LABEL[s.category]}
                    </span>
                    <span
                      className="mono"
                      style={{
                        fontSize: 11,
                        color: skipped > 0 ? "var(--text-faint)" : "var(--ink)",
                      }}
                    >
                      {chars}자{skipped > 0 ? " · 미완주" : ""}
                    </span>
                  </div>
                  <p
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: 15,
                      fontStyle: "italic",
                      lineHeight: 1.45,
                      color: skipped > 0 ? "var(--text-muted)" : "var(--text)",
                    }}
                  >
                    "{s.claim}"
                  </p>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
