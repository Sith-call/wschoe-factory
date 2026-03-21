export type LayoutType = 'rectangle' | 'circle' | 'grid';

export interface SavedGroup {
  id: string;
  name: string;
  members: string[];
  createdAt: number;
}

export interface SeatAssignment {
  index: number;
  name: string;
}
