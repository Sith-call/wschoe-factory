export type EmotionType = 'happy' | 'calm' | 'grateful' | 'tired' | 'anxious' | 'sad';

export type HighlightCategory = 'work' | 'people' | 'growth' | 'hobby' | 'health';

export interface DailyReflection {
  date: string; // YYYY-MM-DD
  emotion: EmotionType;
  emotionIntensity: number; // 1-5
  energy: number; // 1-5
  highlightCategory: HighlightCategory;
  highlightText: string;
  gratitude: string;
  createdAt: string;
}

export const EMOTIONS: { type: EmotionType; label: string; desc: string; icon: string; color: string }[] = [
  { type: 'happy', label: '행복', desc: '기분이 좋을 때', icon: 'sentiment_very_satisfied', color: '#FFD93D' },
  { type: 'calm', label: '평온', desc: '마음이 편할 때', icon: 'spa', color: '#6BCB77' },
  { type: 'grateful', label: '감사', desc: '고마운 마음일 때', icon: 'favorite', color: '#FF8E71' },
  { type: 'tired', label: '피곤', desc: '몸이 지칠 때', icon: 'bedtime', color: '#9B9ECE' },
  { type: 'anxious', label: '불안', desc: '마음이 불안할 때', icon: 'thunderstorm', color: '#FF6B6B' },
  { type: 'sad', label: '우울', desc: '기분이 가라앉을 때', icon: 'water_drop', color: '#4D96FF' },
];

export const HIGHLIGHT_CATEGORIES: { type: HighlightCategory; label: string; icon: string }[] = [
  { type: 'work', label: '업무', icon: 'work' },
  { type: 'people', label: '사람', icon: 'group' },
  { type: 'growth', label: '자기계발', icon: 'school' },
  { type: 'hobby', label: '취미', icon: 'palette' },
  { type: 'health', label: '건강', icon: 'fitness_center' },
];
