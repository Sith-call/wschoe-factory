import deck from "../data/rebuttals.json";
import type { Category, RebuttalCard, ArgumentType } from "./types";

const DECK = deck as RebuttalCard[];

const ORDER: ArgumentType[] = ["DATA", "EMOTION", "PRINCIPLE", "CASE"];

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/["'".!?·,]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 2);
}

function scoreCard(card: RebuttalCard, tokens: string[]): number {
  let score = 0;
  // Pass A: explicit keyword hits (highest weight)
  for (const k of card.keywords) {
    const kl = k.toLowerCase();
    for (const t of tokens) {
      if (t === kl) score += 4;
      else if (t.includes(kl) || kl.includes(t)) score += 2;
    }
  }
  // Pass B: substring match against card title + body (prevents topic drift
  // when the deck's hand-picked keywords miss the claim's vocabulary, e.g.
  // "마케팅 ROI" would never match keyword "재택" but may match "ROI" in the
  // body of a marketing card). Lower weight so keywords still win when present.
  const haystack = (card.title + " " + card.body).toLowerCase();
  for (const t of tokens) {
    if (t.length < 2) continue;
    if (haystack.includes(t)) score += 1;
  }
  return score;
}

/**
 * Pick 3 cards for the claim:
 * - Restrict to category (fall back to all if empty).
 * - Score by keyword match.
 * - Guarantee 3 different argument types.
 */
export function pickRebuttals(
  claim: string,
  category: Category,
  excludeIds: string[] = []
): RebuttalCard[] {
  const tokens = tokenize(claim);
  const pool = DECK.filter(
    (c) => c.category === category && !excludeIds.includes(c.id)
  );

  const scored = pool
    .map((c) => ({ card: c, score: scoreCard(c, tokens) + Math.random() * 0.5 }))
    .sort((a, b) => b.score - a.score);

  const picked: RebuttalCard[] = [];
  const usedTypes = new Set<ArgumentType>();

  // Pass 1: pick highest-scoring card per distinct type, in canonical order.
  for (const type of ORDER) {
    const match = scored.find((s) => s.card.type === type);
    if (match) {
      picked.push(match.card);
      usedTypes.add(type);
    }
    if (picked.length === 3) break;
  }

  // Pass 2: fill remaining from remaining cards.
  for (const s of scored) {
    if (picked.length >= 3) break;
    if (picked.find((p) => p.id === s.card.id)) continue;
    picked.push(s.card);
  }

  return picked.slice(0, 3);
}

export function getDeckSize(): number {
  return DECK.length;
}
