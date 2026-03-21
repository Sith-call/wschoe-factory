import React from 'react'

interface TimerRingProps {
  progress: number // 0 to 1
  phase: 'focus' | 'break' | 'idle'
  timeLeft: number // seconds
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function TimerRing({ progress, phase, timeLeft }: TimerRingProps) {
  const size = 220
  const strokeWidth = 10
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - progress)

  const strokeColor =
    phase === 'focus' ? '#15803d' : phase === 'break' ? '#86efac' : '#d1d5db'

  const label = phase === 'focus' ? '집중 시간' : phase === 'break' ? '쉬는 시간' : '준비'

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s linear' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm font-medium text-gray-500 font-sans">{label}</span>
        <span className="text-5xl font-bold text-gray-800 font-mono tracking-tight">
          {formatTime(timeLeft)}
        </span>
      </div>
    </div>
  )
}
