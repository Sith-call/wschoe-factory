export type TreeType = 'sapling' | 'pine' | 'cherry' | 'maple' | 'oak'

export interface PlantedTree {
  id: string
  type: TreeType
  plantedAt: string // ISO date string
}

export interface DayStats {
  date: string // YYYY-MM-DD
  sessions: number
  focusMinutes: number
}

export type TimerPhase = 'focus' | 'break' | 'idle'

export const TREE_NAMES: Record<TreeType, string> = {
  sapling: '묘목',
  pine: '소나무',
  cherry: '벚나무',
  maple: '단풍나무',
  oak: '참나무',
}

export const FOCUS_DURATION = 25 * 60 // 25 min in seconds
export const BREAK_DURATION = 5 * 60 // 5 min in seconds
