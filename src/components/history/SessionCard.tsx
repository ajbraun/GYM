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
      className="w-full bg-surface-card rounded-2xl p-5 flex items-center gap-4 text-left transition-all active:scale-[0.98] active:bg-surface-hover"
    >
      <div className="text-3xl flex-shrink-0">{session.templateEmoji}</div>
      <div className="flex-1 min-w-0">
        <div className="text-base font-semibold text-white truncate">{session.templateName}</div>
        <div className="text-sm text-gray-500 mt-0.5">{formatted}</div>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <div
          className={`text-sm font-bold tabular-nums ${
            pct === 100 ? 'text-success' : pct >= 50 ? 'text-accent' : 'text-gray-400'
          }`}
        >
          {pct}%
        </div>
        <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  )
}
