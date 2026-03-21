export type TagColor = 'blue' | 'green' | 'pink' | 'amber' | 'gray';

export interface TagOption {
  id: TagColor;
  label: string;
}

export const TAG_OPTIONS: TagOption[] = [
  { id: 'blue', label: '업무' },
  { id: 'green', label: '개인' },
  { id: 'pink', label: '기념일' },
  { id: 'amber', label: '여행' },
  { id: 'gray', label: '기타' },
];

export const TAG_COLORS: Record<TagColor, { bg: string; text: string }> = {
  blue: { bg: 'bg-blue-100', text: 'text-blue-700' },
  green: { bg: 'bg-green-100', text: 'text-green-700' },
  pink: { bg: 'bg-pink-100', text: 'text-pink-700' },
  amber: { bg: 'bg-amber-100', text: 'text-amber-700' },
  gray: { bg: 'bg-gray-100', text: 'text-gray-600' },
};

export interface DdayEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  tag: TagColor;
  pinned: boolean;
  createdAt: number;
}

export interface EditPayload {
  id: string;
  title: string;
  date: string;
  tag: TagColor;
}
