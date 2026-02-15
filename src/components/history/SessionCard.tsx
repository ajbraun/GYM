import type { SessionWithMeta } from '../../hooks/useSessionHistory'

interface SessionCardProps {
  session: SessionWithMeta
  onClick: () => void
}

export function SessionCard({ session, onClick }: SessionCardProps) {
  const date = new Date(session.startedAt)
  const formatted = date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
  const pct = Math.round(session.completionRatio * 100)

  return (
    <button
      onClick={onClick}
      className="w-full bg-surface-card rounded-xl p-4 flex items-center gap-4 text-left hover:bg-surface-hover transition-colors"
    >
      <div className="text-2xl flex-shrink-0">{session.templateEmoji}</div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-white truncate">{session.templateName}</div>
        <div className="text-xs text-gray-400 mt-0.5">{formatted}</div>
      </div>
      <div className="flex-shrink-0">
        <div
          className={`text-sm font-semibold ${
            pct === 100 ? 'text-green-400' : pct >= 50 ? 'text-accent' : 'text-gray-400'
          }`}
        >
          {pct}%
        </div>
      </div>
    </button>
  )
}
