interface SessionHeaderProps {
  emoji: string
  name: string
  elapsed: number
  onFinish: () => void
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function SessionHeader({ emoji, name, elapsed, onFinish }: SessionHeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-gray-950/95 backdrop-blur-sm border-b border-gray-800/50">
      <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xl">{emoji}</span>
          <h1 className="text-lg font-bold text-white truncate">{name}</h1>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-sm text-gray-400 font-mono tabular-nums">{formatTime(elapsed)}</span>
          <button
            onClick={onFinish}
            className="bg-accent hover:bg-accent-dark text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition-colors"
          >
            Finish
          </button>
        </div>
      </div>
    </header>
  )
}
