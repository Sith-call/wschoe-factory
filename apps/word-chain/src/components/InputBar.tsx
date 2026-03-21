import { useState, useRef, useEffect } from 'react'

interface InputBarProps {
  onSubmit: (word: string) => void
  disabled: boolean
  timeLeft: number
  maxTime: number
  hint?: string
}

export default function InputBar({ onSubmit, disabled, timeLeft, maxTime, hint }: InputBarProps) {
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus()
    }
  }, [disabled])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = value.trim()
    if (trimmed && !disabled) {
      onSubmit(trimmed)
      setValue('')
    }
  }

  const ratio = timeLeft / maxTime
  const isUrgent = timeLeft <= 3

  return (
    <div className="bg-white border-t border-slate-100">
      {/* Timer bar */}
      <div className="h-1 bg-slate-100">
        <div
          className="h-full transition-all duration-1000 ease-linear"
          style={{
            width: `${ratio * 100}%`,
            backgroundColor: isUrgent ? '#ef4444' : '#14b8a6',
          }}
        />
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2 px-4 py-3">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={disabled}
          placeholder={disabled ? '잠시 기다려주세요...' : '단어를 입력하세요'}
          className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-base placeholder:text-slate-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-50"
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className="bg-primary text-white p-2.5 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-30 shrink-0"
          aria-label="제출"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m5 12 7-7 7 7" />
            <path d="M12 19V5" />
          </svg>
        </button>
      </form>

      {/* Time display + hint */}
      <div className="flex justify-center items-center gap-3 pb-2">
        <span className={`text-xs font-en font-semibold ${isUrgent ? 'text-red-500' : 'text-slate-400'}`}>
          {timeLeft}s
        </span>
        {hint && (
          <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
            힌트: {hint}...
          </span>
        )}
      </div>
    </div>
  )
}
