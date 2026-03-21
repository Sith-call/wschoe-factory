export interface ChatMessage {
  id: number
  text: string
  sender: 'player' | 'ai' | 'system'
  turn: number
  isTyping?: boolean
}

export type GameState = 'start' | 'playing' | 'gameover'
