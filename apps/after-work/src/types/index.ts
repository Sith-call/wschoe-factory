/** 하루 한 줄 기록 */
export interface Entry {
  date: string;           // "2026-04-02" (YYYY-MM-DD, 기본키)
  text: string;           // 사용자가 적은 한 줄 (최대 100자)
  promptText: string;     // 그날 보여준 프롬프트 텍스트
  curationIds: number[];  // 그날 노출된 마중물 카드 ID들 (3~4개)
  createdAt: string;      // ISO 8601 (최초 작성 시각)
  updatedAt: string;      // ISO 8601 (마지막 수정 시각)
}

/** 앱 설정 */
export interface Settings {
  notificationEnabled: boolean;
  notificationTime: string;  // "HH:mm"
}

/** 프롬프트 */
export interface Prompt {
  id: number;
  text: string;
}

/** 큐레이션 카테고리 */
export type CurationCategory =
  | 'eat'
  | 'move'
  | 'rest'
  | 'meet'
  | 'learn'
  | 'make'
  | 'watch';

/** 마중물 큐레이션 카드 */
export interface CurationCard {
  id: number;
  category: CurationCategory;
  activity: string;
  subtext: string;
}

/** 앱 전역 상태 */
export interface AppState {
  settings: Settings;
  todayEntry: Entry | null;
  entries: Entry[];
  toastMessage: string | null;
  initialized: boolean;
}

export type AppAction =
  | { type: 'SET_SETTINGS'; payload: Settings }
  | { type: 'SET_TODAY_ENTRY'; payload: Entry | null }
  | { type: 'SET_ENTRIES'; payload: Entry[] }
  | { type: 'ADD_ENTRY'; payload: Entry }
  | { type: 'UPDATE_ENTRY'; payload: Entry }
  | { type: 'DELETE_ENTRY'; payload: string }
  | { type: 'SHOW_TOAST'; payload: string }
  | { type: 'HIDE_TOAST' }
  | { type: 'CLEAR_ALL' }
  | { type: 'SET_INITIALIZED' };

export const CATEGORY_LABELS: Record<CurationCategory, string> = {
  eat: '먹기',
  move: '움직이기',
  rest: '쉬기',
  meet: '만나기',
  learn: '배우기',
  make: '만들기',
  watch: '보기듣기',
};
