import { useEffect, useRef } from 'react'
import type { ChatMessage } from '../types'

interface ChatAreaProps {
  messages: ChatMessage[]
  aiTyping?: boolean
}

function PlayerBubble({ message }: { message: ChatMessage }) {
  return (
    <div className="flex justify-end animate-slide-right">
      <div className="max-w-[75%]">
        <div className="bg-primary text-white px-4 py-2.5 rounded-2xl rounded-br-sm">
          <p className="text-base">{message.text}</p>
        </div>
        <p className="text-xs text-slate-400 text-right mt-1 font-en">
          Turn {message.turn}
        </p>
      </div>
    </div>
  )
}

function AiBubble({ message }: { message: ChatMessage }) {
  return (
    <div className="flex justify-start animate-slide-left">
      <div className="max-w-[75%]">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-6 rounded-full bg-fuchsia-100 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d946ef" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 8V4H8" />
              <rect width="16" height="12" x="4" y="8" rx="2" />
              <path d="M2 14h2" />
              <path d="M20 14h2" />
              <path d="M15 13v2" />
              <path d="M9 13v2" />
            </svg>
          </div>
          <span className="text-xs text-slate-400 font-medium">AI</span>
        </div>
        <div className="bg-fuchsia-50 text-slate-800 px-4 py-2.5 rounded-2xl rounded-bl-sm">
          <p className="text-base">{message.text}</p>
        </div>
        <p className="text-xs text-slate-400 mt-1 font-en">
          Turn {message.turn}
        </p>
      </div>
    </div>
  )
}

function SystemBubble({ message }: { message: ChatMessage }) {
  return (
    <div className="flex justify-center">
      <p className="text-xs text-slate-400 bg-white px-3 py-1.5 rounded-full">
        {message.text}
      </p>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex justify-start animate-slide-left">
      <div className="max-w-[75%]">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-6 rounded-full bg-fuchsia-100 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d946ef" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 8V4H8" />
              <rect width="16" height="12" x="4" y="8" rx="2" />
              <path d="M2 14h2" />
              <path d="M20 14h2" />
              <path d="M15 13v2" />
              <path d="M9 13v2" />
            </svg>
          </div>
          <span className="text-xs text-slate-400 font-medium">AI</span>
        </div>
        <div className="bg-fuchsia-50 text-slate-800 px-4 py-2.5 rounded-2xl rounded-bl-sm">
          <div className="flex gap-1 items-center h-6">
            <span className="w-2 h-2 bg-fuchsia-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 bg-fuchsia-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 bg-fuchsia-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ChatArea({ messages, aiTyping }: ChatAreaProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
      {messages.map((msg) => {
        if (msg.sender === 'player') return <PlayerBubble key={msg.id} message={msg} />
        if (msg.sender === 'ai') return <AiBubble key={msg.id} message={msg} />
        return <SystemBubble key={msg.id} message={msg} />
      })}
      {aiTyping && <TypingIndicator />}
      <div ref={bottomRef} />
    </div>
  )
}
