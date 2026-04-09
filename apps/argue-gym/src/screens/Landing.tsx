import type { Session } from "../lib/types";
import { CATEGORY_LABEL } from "../lib/types";

interface Props {
  recent: Session[];
  onSample: () => void;
  onStart: () => void;
  onOpenLog: () => void;
  onOpenSession: (s: Session) => void;
}

export function Landing({ recent, onSample, onStart, onOpenLog, onOpenSession }: Props) {
  return (
    <>
      <div className="header">
        <div style={{ width: 44 }} />
        <div className="header-spacer" />
        <button className="header-right" onClick={onOpenLog}>LOG</button>
      </div>
      <div className="content content-tight">
        <div className="landing-hero">
          <span className="landing-eyebrow">ARGUE GYM · NO.01</span>
          <h1 className="landing-title">
            혼자 하는
            <br />
            <em>토론 연습장.</em>
          </h1>
          <p className="landing-desc">
            주장을 적으면 앱이 반대 입장 세 가지를 던집니다. 재반박을 써내려가며 당신의 논리 근육을 단련하세요.
          </p>
        </div>

        <div className="landing-ruled" />

        <div className="landing-howto">
          <div className="howto-row">
            <span className="howto-num">01</span>
            <p className="howto-text"><b>주장 한 문장</b>을 적는다.</p>
          </div>
          <div className="howto-row">
            <span className="howto-num">02</span>
            <p className="howto-text">앱이 <b>반론 카드 3장</b>을 뽑는다 — 데이터·감정·원칙·사례.</p>
          </div>
          <div className="howto-row">
            <span className="howto-num">03</span>
            <p className="howto-text">각 카드에 <b>재반박</b>을 메모처럼 써내려간다.</p>
          </div>
          <div className="howto-row">
            <span className="howto-num">04</span>
            <p className="howto-text">세션 리포트로 <b>내 논리의 약점</b>을 확인한다.</p>
          </div>
        </div>

        <div className="landing-cta">
          <button className="btn btn-primary btn-block" onClick={onSample}>
            샘플로 체험하기
          </button>
          <button className="btn btn-secondary btn-block" onClick={onStart}>
            내 주장으로 시작
          </button>
        </div>

        {recent.length > 0 && (
          <div className="landing-recent">
            <span className="eyebrow">최근 훈련</span>
            {recent.map((s) => (
              <button
                key={s.id}
                className="recent-item"
                onClick={() => onOpenSession(s)}
              >
                <div className="recent-meta">
                  {new Date(s.createdAt).toLocaleDateString("ko-KR", {
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  · {CATEGORY_LABEL[s.category]}
                </div>
                <div className="recent-text">"{s.claim}"</div>
              </button>
            ))}
          </div>
        )}

        <div className="landing-links">
          <button onClick={onOpenLog}>지난 기록 →</button>
          <button onClick={onSample}>사용법</button>
        </div>
      </div>
    </>
  );
}
