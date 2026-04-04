/** 개그 카테고리 */
export type JokeCategory =
  | "pun"
  | "wordplay"
  | "question"
  | "situation"
  | "misc";

/** 개그 데이터 */
export interface Joke {
  id: number;
  setup: string;
  punchline: string;
  category: JokeCategory;
}

/** 최근 본 개그 추적 (localStorage) */
export interface ViewHistory {
  recentIds: number[];
  lastUpdated: string;
}

/** 앱 상태 */
export type AppPhase =
  | "idle"
  | "loading"
  | "showing-joke"
  | "showing-setup"
  | "showing-punchline"
  | "favorites"
  | "clear";
