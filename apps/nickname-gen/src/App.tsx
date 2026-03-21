import React, { useState, useEffect, useCallback } from 'react'
import { Style, Nickname } from './types'
import { styleData } from './data'
import { HeartIcon, CopyIcon, RefreshIcon, SparkleIcon, CheckIcon } from './icons'

const STYLES: Style[] = ['귀여운', '멋진', '웃긴', '판타지']

const FAVORITES_KEY = 'nickname-gen-favorites'

function loadFavorites(): string[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveFavorites(favs: string[]) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs))
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

const MAX_FAVORITES = 20

function generateNicknames(style: Style, keyword: string): Nickname[] {
  const data = styleData[style]
  const results: Nickname[] = []
  const seen = new Set<string>()
  let attempts = 0

  while (results.length < 5 && attempts < 200) {
    attempts++
    const prefix = pickRandom(data.prefixes)
    const core = keyword.trim() || pickRandom(data.cores)
    const suffix = pickRandom(data.suffixes)
    const text = `${prefix}${core}${suffix}`

    if (!seen.has(text)) {
      seen.add(text)
      results.push({
        id: `${Date.now()}-${results.length}`,
        text,
        style,
      })
    }
  }

  return results
}

export default function App() {
  const [selectedStyle, setSelectedStyle] = useState<Style>('귀여운')
  const [keyword, setKeyword] = useState('')
  const [nicknames, setNicknames] = useState<Nickname[]>([])
  const [favorites, setFavorites] = useState<string[]>(loadFavorites)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [generationKey, setGenerationKey] = useState(0)
  const [bouncingHeart, setBouncingHeart] = useState<string | null>(null)

  useEffect(() => {
    saveFavorites(favorites)
  }, [favorites])

  const handleGenerate = useCallback(() => {
    const results = generateNicknames(selectedStyle, keyword)
    setNicknames(results)
    setGenerationKey((k) => k + 1)
    setCopiedId(null)
  }, [selectedStyle, keyword])

  const handleCopy = useCallback(async (nickname: Nickname) => {
    try {
      await navigator.clipboard.writeText(nickname.text)
      setCopiedId(nickname.id)
      setTimeout(() => setCopiedId(null), 1500)
    } catch {
      // fallback
      const textarea = document.createElement('textarea')
      textarea.value = nickname.text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopiedId(nickname.id)
      setTimeout(() => setCopiedId(null), 1500)
    }
  }, [])

  const handleCopyAll = useCallback(async () => {
    if (nicknames.length === 0) return
    const text = nicknames.map((n) => n.text).join('\n')
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }
    setCopiedId('__all__')
    setTimeout(() => setCopiedId(null), 1500)
  }, [nicknames])

  const toggleFavorite = useCallback((text: string) => {
    setBouncingHeart(text)
    setTimeout(() => setBouncingHeart(null), 300)
    setFavorites((prev) => {
      if (prev.includes(text)) {
        return prev.filter((f) => f !== text)
      }
      if (prev.length >= MAX_FAVORITES) return prev
      return [...prev, text]
    })
  }, [])

  const removeFavorite = useCallback((text: string) => {
    setFavorites((prev) => prev.filter((f) => f !== text))
  }, [])

  const isFavorite = (text: string) => favorites.includes(text)

  return (
    <div className="min-h-screen bg-bg pb-12">
      {/* Header */}
      <header className="pt-10 pb-6 px-5 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <SparkleIcon className="text-primary" />
          <h1 className="text-2xl font-bold text-on-surface">닉네임 생성기</h1>
          <SparkleIcon className="text-primary" />
        </div>
        <p className="text-sm text-on-surface-muted font-normal">
          나만의 닉네임을 만들어보세요
        </p>
      </header>

      <main className="max-w-md mx-auto px-5 space-y-6">
        {/* Style Selector */}
        <section>
          <label className="text-xs font-semibold text-on-surface-muted uppercase tracking-wider mb-3 block">
            스타일 선택
          </label>
          <div className="flex gap-2">
            {STYLES.map((style) => (
              <button
                key={style}
                onClick={() => setSelectedStyle(style)}
                className={`flex-1 py-2.5 rounded-full text-sm font-medium transition-colors duration-150 ${
                  selectedStyle === style
                    ? 'bg-primary text-white'
                    : 'bg-surface text-on-surface-muted border border-secondary/40 hover:border-primary/50'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </section>

        {/* Keyword Input */}
        <section>
          <label
            htmlFor="keyword-input"
            className="text-xs font-semibold text-on-surface-muted uppercase tracking-wider mb-3 block"
          >
            키워드 (선택)
          </label>
          <input
            id="keyword-input"
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="예: 고양이, 피자, 용사..."
            className="w-full px-4 py-3 rounded-xl border border-secondary/40 bg-surface text-on-surface placeholder:text-on-surface-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm"
          />
        </section>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          className="w-full py-3.5 bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl transition-colors duration-150 flex items-center justify-center gap-2 text-base"
        >
          <SparkleIcon className="text-white" />
          닉네임 생성하기
        </button>

        {/* Results */}
        {nicknames.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-on-surface-muted uppercase tracking-wider">
                생성된 닉네임
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCopyAll}
                  className="flex items-center gap-1 text-xs text-on-surface-muted hover:text-primary font-medium transition-colors"
                >
                  {copiedId === '__all__' ? (
                    <>
                      <CheckIcon className="text-green-500" />
                      복사됨
                    </>
                  ) : (
                    <>
                      <CopyIcon />
                      전체 복사
                    </>
                  )}
                </button>
                <button
                  onClick={handleGenerate}
                  className="flex items-center gap-1 text-xs text-primary hover:text-primary-hover font-medium transition-colors"
                >
                  <RefreshIcon className="text-primary w-4 h-4" />
                  다시 생성
                </button>
              </div>
            </div>
            <div className="space-y-2.5" key={generationKey}>
              {nicknames.map((nickname, index) => (
                <div
                  key={nickname.id}
                  className="animate-stagger-fade flex items-center justify-between bg-surface rounded-xl px-4 py-3.5 border border-secondary/20"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className="font-medium text-on-surface text-base">
                    {nickname.text}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => toggleFavorite(nickname.text)}
                      className={`p-1.5 rounded-md transition-colors ${
                        isFavorite(nickname.text)
                          ? 'text-red-500'
                          : 'text-on-surface-muted/40 hover:text-red-400'
                      } ${bouncingHeart === nickname.text ? 'animate-heart-bounce' : ''}`}
                      aria-label={isFavorite(nickname.text) ? '즐겨찾기 제거' : '즐겨찾기 추가'}
                    >
                      <HeartIcon filled={isFavorite(nickname.text)} />
                    </button>
                    <button
                      onClick={() => handleCopy(nickname)}
                      className="p-1.5 rounded-md text-on-surface-muted/40 hover:text-primary transition-colors"
                      aria-label="복사"
                    >
                      {copiedId === nickname.id ? (
                        <CheckIcon className="text-green-500" />
                      ) : (
                        <CopyIcon />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Favorites */}
        {favorites.length > 0 && (
          <section className="pt-2">
            <div className="flex items-center gap-2 mb-3">
              <HeartIcon filled className="text-red-500 w-4 h-4" />
              <span className="text-xs font-semibold text-on-surface-muted uppercase tracking-wider">
                즐겨찾기 ({favorites.length}/{MAX_FAVORITES})
              </span>
            </div>
            <div className="space-y-2">
              {favorites.map((fav) => (
                <div
                  key={fav}
                  className="flex items-center justify-between bg-surface rounded-xl px-4 py-3 border border-red-200/40"
                >
                  <span className="font-medium text-on-surface text-sm">
                    {fav}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => removeFavorite(fav)}
                      className="p-1.5 rounded-md text-red-500 hover:text-red-600 transition-colors"
                      aria-label="즐겨찾기 제거"
                    >
                      <HeartIcon filled />
                    </button>
                    <button
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(fav)
                        } catch {
                          const t = document.createElement('textarea')
                          t.value = fav
                          document.body.appendChild(t)
                          t.select()
                          document.execCommand('copy')
                          document.body.removeChild(t)
                        }
                      }}
                      className="p-1.5 rounded-md text-on-surface-muted/40 hover:text-primary transition-colors"
                      aria-label="복사"
                    >
                      <CopyIcon />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
