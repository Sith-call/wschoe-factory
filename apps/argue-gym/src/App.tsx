import { useEffect, useMemo, useState } from "react";
import { Check } from "lucide-react";
import type { Category, RebuttalCard, Session, SessionCardState } from "./lib/types";
import { loadSessions, newSessionId, saveSession } from "./lib/storage";
import { pickRebuttals } from "./lib/matcher";
import deckData from "./data/rebuttals.json";
import { Landing } from "./screens/Landing";
import { ClaimInput } from "./screens/ClaimInput";
import { SessionScreen } from "./screens/Session";
import { Report } from "./screens/Report";
import { LogArchive } from "./screens/LogArchive";

type Route =
  | { name: "landing" }
  | { name: "claim" }
  | { name: "session" }
  | { name: "report"; readonly?: boolean }
  | { name: "log" };

const SAMPLE_CLAIM = "재택근무가 사무실 출근보다 생산성을 올린다.";
const SAMPLE_CATEGORY: Category = "work";

export function App() {
  const [route, setRoute] = useState<Route>({ name: "landing" });
  const [sessions, setSessions] = useState<Session[]>(() => loadSessions());

  // Active session draft
  const [claim, setClaim] = useState("");
  const [category, setCategory] = useState<Category>("work");
  const [activeCards, setActiveCards] = useState<RebuttalCard[]>([]);
  const [activeStates, setActiveStates] = useState<SessionCardState[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>("");
  const [viewingSession, setViewingSession] = useState<Session | null>(null);

  const [toast, setToast] = useState<string | null>(null);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 1800);
    return () => clearTimeout(t);
  }, [toast]);

  function startSession(claimText: string, cat: Category, excludeIds: string[] = []) {
    const cards = pickRebuttals(claimText, cat, excludeIds);
    setClaim(claimText);
    setCategory(cat);
    setActiveCards(cards);
    setActiveStates(
      cards.map((c) => ({ cardId: c.id, rebuttal: "", skipped: false }))
    );
    setActiveSessionId(newSessionId());
    setRoute({ name: "session" });
  }

  function handleSampleStart() {
    startSession(SAMPLE_CLAIM, SAMPLE_CATEGORY);
  }

  function handleFinishSession() {
    const session: Session = {
      id: activeSessionId,
      createdAt: Date.now(),
      claim,
      category,
      cards: activeStates,
      completed: activeStates.every((s) => s.skipped || s.rebuttal.trim().length > 0),
    };
    saveSession(session);
    setSessions(loadSessions());
    setViewingSession(null);
    setRoute({ name: "report" });
  }

  function handleRetrySameClaim() {
    const excludeIds = activeCards.map((c) => c.id);
    startSession(claim, category, excludeIds);
  }

  function handleSaveAndClose() {
    setToast("세션을 기록했습니다");
    setTimeout(() => setRoute({ name: "landing" }), 300);
  }

  function handleOpenSession(s: Session) {
    setViewingSession(s);
    setClaim(s.claim);
    setCategory(s.category);
    const all = deckData as RebuttalCard[];
    const cards = s.cards
      .map((cs) => all.find((c) => c.id === cs.cardId))
      .filter((c): c is RebuttalCard => !!c);
    setActiveCards(cards);
    setActiveStates(s.cards);
    setRoute({ name: "report", readonly: true });
  }

  const recent = useMemo(() => sessions.slice(0, 3), [sessions]);

  return (
    <div className="app-shell">
      <div className="phone">
        {route.name === "landing" && (
          <Landing
            recent={recent}
            onSample={handleSampleStart}
            onStart={() => {
              setClaim("");
              setCategory("work");
              setRoute({ name: "claim" });
            }}
            onOpenLog={() => setRoute({ name: "log" })}
            onOpenSession={handleOpenSession}
          />
        )}

        {route.name === "claim" && (
          <ClaimInput
            initialClaim={claim}
            initialCategory={category}
            onBack={() => setRoute({ name: "landing" })}
            onSubmit={(c, cat) => startSession(c, cat)}
          />
        )}

        {route.name === "session" && (
          <SessionScreen
            claim={claim}
            cards={activeCards}
            states={activeStates}
            onChange={setActiveStates}
            onBack={() => setRoute({ name: "claim" })}
            onFinish={handleFinishSession}
          />
        )}

        {route.name === "report" && (
          <Report
            claim={claim}
            cards={activeCards}
            states={activeStates}
            readonly={!!route.readonly}
            createdAt={viewingSession?.createdAt ?? Date.now()}
            onBack={() =>
              setRoute(viewingSession ? { name: "log" } : { name: "landing" })
            }
            onRetry={handleRetrySameClaim}
            onNewClaim={() => setRoute({ name: "claim" })}
            onSave={handleSaveAndClose}
          />
        )}

        {route.name === "log" && (
          <LogArchive
            sessions={sessions}
            onBack={() => setRoute({ name: "landing" })}
            onOpen={handleOpenSession}
          />
        )}
      </div>
      {toast && (
        <div className="toast">
          <Check size={14} strokeWidth={2.5} />
          {toast}
        </div>
      )}
    </div>
  );
}
