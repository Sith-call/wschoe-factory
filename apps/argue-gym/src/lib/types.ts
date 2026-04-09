export type ArgumentType = "DATA" | "EMOTION" | "PRINCIPLE" | "CASE";

export type Category = "work" | "relationship" | "money" | "lifestyle" | "self";

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: "work", label: "일" },
  { id: "relationship", label: "관계" },
  { id: "money", label: "돈" },
  { id: "lifestyle", label: "라이프스타일" },
  { id: "self", label: "자기계발" },
];

export interface RebuttalCard {
  id: string;
  category: Category;
  type: ArgumentType;
  keywords: string[];
  title: string;
  body: string;
}

export interface SessionCardState {
  cardId: string;
  rebuttal: string;
  skipped: boolean;
}

export interface Session {
  id: string;
  createdAt: number;
  claim: string;
  category: Category;
  cards: SessionCardState[];
  completed: boolean;
}

export const CATEGORY_LABEL: Record<Category, string> = {
  work: "일",
  relationship: "관계",
  money: "돈",
  lifestyle: "라이프스타일",
  self: "자기계발",
};
