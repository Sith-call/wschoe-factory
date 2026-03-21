import React from 'react'
import { DayStats } from './types'
import { TreeIcon } from './Icons'

interface StatsProps {
  todayStats: DayStats
  weeklyStats: DayStats[]
}

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토']

function getDayLabel(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return DAY_LABELS[d.getDay()]
}

export default function Stats({ todayStats, weeklyStats }: StatsProps) {
  const maxSessions = Math.max(...weeklyStats.map((d) => d.sessions), 1)

  return (
    <div className="space-y-4">
      {/* Today */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-surface border border-forest-200 p-4 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <TreeIcon size={18} />
            <span className="text-sm font-medium text-gray-500 font-sans">오늘 세션</span>
          </div>
          <p className="text-3xl font-bold text-forest-700 font-mono">{todayStats.sessions}</p>
        </div>
        <div className="rounded-xl bg-surface border border-forest-200 p-4 text-center">
          <p className="text-sm font-medium text-gray-500 font-sans mb-1">집중 시간</p>
          <p className="text-3xl font-bold text-forest-700 font-mono">{todayStats.focusMinutes}<span className="text-lg font-semibold">분</span></p>
        </div>
      </div>

      {/* Weekly chart */}
      <div className="rounded-xl bg-surface border border-forest-200 p-4">
        <p className="text-sm font-semibold text-gray-600 font-sans mb-3">주간 기록</p>
        <div className="flex items-end justify-between gap-1" style={{ height: 100 }}>
          {weeklyStats.map((day) => {
            const h = day.sessions > 0 ? Math.max((day.sessions / maxSessions) * 80, 8) : 4
            const isToday = day.date === todayStats.date
            return (
              <div key={day.date} className="flex flex-col items-center flex-1 gap-1">
                <span className="text-xs font-mono font-semibold text-forest-700">
                  {day.sessions > 0 ? day.sessions : ''}
                </span>
                <div
                  className={`w-full max-w-[28px] rounded-t-md ${isToday ? 'bg-forest-700' : 'bg-forest-300'}`}
                  style={{ height: h, transition: 'height 0.3s ease' }}
                />
                <span className={`text-xs font-sans ${isToday ? 'font-bold text-forest-700' : 'text-gray-400'}`}>
                  {getDayLabel(day.date)}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
