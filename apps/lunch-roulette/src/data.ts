import { MenuItem, Category } from './types';

let idCounter = 0;
export function makeId(): string {
  return `item-${++idCounter}-${Date.now()}`;
}

export const CATEGORIES: Category[] = ['한식', '중식', '일식', '양식', '분식'];

export const DEFAULT_MENUS: MenuItem[] = [
  { id: makeId(), name: '김치찌개', category: '한식' },
  { id: makeId(), name: '된장찌개', category: '한식' },
  { id: makeId(), name: '비빔밥', category: '한식' },
  { id: makeId(), name: '불고기', category: '한식' },
  { id: makeId(), name: '짜장면', category: '중식' },
  { id: makeId(), name: '짬뽕', category: '중식' },
  { id: makeId(), name: '탕수육', category: '중식' },
  { id: makeId(), name: '초밥', category: '일식' },
  { id: makeId(), name: '라멘', category: '일식' },
  { id: makeId(), name: '돈카츠', category: '일식' },
  { id: makeId(), name: '파스타', category: '양식' },
  { id: makeId(), name: '피자', category: '양식' },
  { id: makeId(), name: '햄버거', category: '양식' },
  { id: makeId(), name: '떡볶이', category: '분식' },
  { id: makeId(), name: '김밥', category: '분식' },
  { id: makeId(), name: '라면', category: '분식' },
];

export const RESULT_MESSAGES = [
  '오늘은 이거다!',
  '운명이 정했다!',
  '고민 끝!',
  '맛있겠다~',
  '이걸로 결정!',
  '바로 이거야!',
];

export const SEGMENT_COLORS = [
  '#f97316', // orange-500
  '#84cc16', // lime-500
  '#f59e0b', // amber-500
  '#06b6d4', // cyan-500
  '#ef4444', // red-500
  '#8b5cf6', // violet-500
];
