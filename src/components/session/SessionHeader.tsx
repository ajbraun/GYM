interface SessionHeaderProps {
  emoji: string
  name: string
  elapsed: number
  onBack: () => void
  onFinish: () => void
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function SessionHeader({ emoji, name, elapsed, onBack, onFinish }: SessionHeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-gray-950/95 backdrop-blur-sm border-b border-white/5 safe-top">
      <div className="max-w-lg mx-auto px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <button onClick={onBack} className="text-gray-400 hover:text-white transition-colors p-1 -ml-1">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-xl">{emoji}</span>
          <h1 className="text-lg font-bold text-white truncate">{name}</h1>
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
          <span className="text-sm text-gray-400 font-mono tabular-nums">{formatTime(elapsed)}</span>
          <button
            onClick={onFinish}
            className="bg-accent hover:bg-accent-dark text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors active:scale-[0.97]"
          >
            Finish
          </button>
        </div>
      </div>
    </header>
  )
}
