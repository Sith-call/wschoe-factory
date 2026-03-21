export type Style = '귀여운' | '멋진' | '웃긴' | '판타지'

export interface StyleData {
  prefixes: string[]
  cores: string[]
  suffixes: string[]
}

export interface Nickname {
  id: string
  text: string
  style: Style
}
