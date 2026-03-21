import { getBelt } from '../scoring'

interface BeltBadgeProps {
  wpm: number
  animate?: boolean
}

export default function BeltBadge({ wpm, animate = false }: BeltBadgeProps) {
  const belt = getBelt(wpm)
  const isWhite = belt.color === '#ffffff'

  return (
    <div className={`flex items-center gap-3 ${animate ? 'belt-bounce' : ''}`}>
      <div
        className="w-16 h-5 rounded"
        style={{
          backgroundColor: belt.color,
          border: isWhite ? '2px solid #d1d5db' : 'none',
        }}
      />
      <span className="font-sans font-medium text-ink text-sm">
        {belt.name}
      </span>
    </div>
  )
}
