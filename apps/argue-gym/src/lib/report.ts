import type { ArgumentType, RebuttalCard, SessionCardState } from "./types";

export interface ReportStats {
  totalChars: number;
  completed: number;
  skipped: number;
  distribution: Record<ArgumentType, number>;
  comments: string[];
}

const TYPES: ArgumentType[] = ["DATA", "EMOTION", "PRINCIPLE", "CASE"];
const TYPE_LABEL: Record<ArgumentType, string> = {
  DATA: "데이터",
  EMOTION: "감정",
  PRINCIPLE: "원칙",
  CASE: "사례",
};

export function computeReport(
  cards: RebuttalCard[],
  states: SessionCardState[]
): ReportStats {
  const dist: Record<ArgumentType, number> = {
    DATA: 0,
    EMOTION: 0,
    PRINCIPLE: 0,
    CASE: 0,
  };
  let totalChars = 0;
  let completed = 0;
  let skipped = 0;

  states.forEach((s, i) => {
    const card = cards[i];
    if (!card) return;
    if (s.skipped) {
      skipped++;
      return;
    }
    const n = s.rebuttal.trim().length;
    if (n > 0) {
      totalChars += n;
      completed++;
      dist[card.type] += 1;
    }
  });

  const comments: string[] = [];
  if (completed === cards.length && skipped === 0) {
    comments.push("회피 없이 3장을 모두 마주한 점이 좋았습니다.");
  } else if (skipped > 0) {
    // Neutral tone — no moralizing. P3 (essayist) flagged the prior copy
    // "피하지 말고 정면으로 마주해 봅시다" as pressure language.
    comments.push(`${skipped}장을 건너뛰었습니다. 원할 때 같은 주장으로 다시 돌아올 수 있습니다.`);
  }

  const avg = completed > 0 ? Math.round(totalChars / completed) : 0;
  if (avg >= 120) {
    comments.push(`평균 ${avg}자의 단단한 재반박. 방어 논리의 두께가 느껴집니다.`);
  } else if (avg >= 60) {
    comments.push(`평균 ${avg}자 — 핵심은 짚었지만 근거를 한 층 더 쌓을 여지가 있습니다.`);
  } else if (avg > 0) {
    comments.push(`평균 ${avg}자 — 반박이 짧은 편입니다. 한 문장 더 밀어붙여 보면 달라집니다.`);
  }

  // Type-coverage based actionable hint — P1 (실용) success criterion requires
  // the comment to suggest concrete next moves like "데이터 논거를 추가해 보세요".
  const usedTypes = TYPES.filter((t) => dist[t] > 0);
  const missingTypes = TYPES.filter((t) => dist[t] === 0 && completed >= 1);
  if (missingTypes.length > 0 && completed >= 1) {
    const label = missingTypes.map((t) => TYPE_LABEL[t]).join("·");
    comments.push(
      `${label} 논거로 반박한 카드가 없습니다. 다음 세션에서는 ${TYPE_LABEL[missingTypes[0]]} 관점의 반론을 한 번 시도해 보세요.`
    );
  }

  const missingOnCards = cards
    .map((c, i) => ({ c, s: states[i] }))
    .filter(({ s }) => s && !s.skipped && s.rebuttal.trim().length === 0)
    .map(({ c }) => c.type);
  if (missingOnCards.length > 0) {
    const miss = Array.from(new Set(missingOnCards)).map((t) => TYPE_LABEL[t]).join("·");
    comments.push(`${miss} 반론에 대한 응답이 비어 있습니다.`);
  }

  if (usedTypes.length === 1 && completed >= 2) {
    comments.push(`${TYPE_LABEL[usedTypes[0]]} 논거에 치우쳐 있습니다. 다른 유형을 섞어 보세요.`);
  }

  return {
    totalChars,
    completed,
    skipped,
    distribution: dist,
    comments: comments.length ? comments : ["데이터가 부족합니다. 한 장이라도 재반박을 작성해 보세요."],
  };
}
