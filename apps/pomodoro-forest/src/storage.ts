import { PlantedTree, DayStats, TreeType } from './types'

const TREES_KEY = 'pomodoro-forest-trees'
const STATS_KEY = 'pomodoro-forest-stats'

const TREE_TYPES: TreeType[] = ['sapling', 'pine', 'cherry', 'maple', 'oak']

export function getRandomTreeType(): TreeType {
  return TREE_TYPES[Math.floor(Math.random() * TREE_TYPES.length)]
}

export function getTrees(): PlantedTree[] {
  try {
    const raw = localStorage.getItem(TREES_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveTrees(trees: PlantedTree[]): void {
  localStorage.setItem(TREES_KEY, JSON.stringify(trees))
}

export function addTree(tree: PlantedTree): PlantedTree[] {
  const trees = getTrees()
  trees.push(tree)
  saveTrees(trees)
  return trees
}

export function clearForest(): void {
  localStorage.removeItem(TREES_KEY)
  localStorage.removeItem(STATS_KEY)
}

function getTodayKey(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function getAllStats(): DayStats[] {
  try {
    const raw = localStorage.getItem(STATS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveAllStats(stats: DayStats[]): void {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats))
}

export function recordSession(): DayStats[] {
  const stats = getAllStats()
  const todayKey = getTodayKey()
  const idx = stats.findIndex((s) => s.date === todayKey)
  if (idx >= 0) {
    stats[idx].sessions += 1
    stats[idx].focusMinutes += 25
  } else {
    stats.push({ date: todayKey, sessions: 1, focusMinutes: 25 })
  }
  saveAllStats(stats)
  return stats
}

export function getTodayStats(): DayStats {
  const stats = getAllStats()
  const todayKey = getTodayKey()
  return stats.find((s) => s.date === todayKey) ?? { date: todayKey, sessions: 0, focusMinutes: 0 }
}

export function getWeeklyStats(): DayStats[] {
  const stats = getAllStats()
  const result: DayStats[] = []
  const now = new Date()
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    const found = stats.find((s) => s.date === key)
    result.push(found ?? { date: key, sessions: 0, focusMinutes: 0 })
  }
  return result
}
