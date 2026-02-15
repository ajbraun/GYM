import type { SessionWithMeta } from '../hooks/useSessionHistory'
import { SessionCard } from '../components/history/SessionCard'

interface HistoryScreenProps {
  sessions: SessionWithMeta[]
  onViewSession: (sessionId: string) => void
  onClearAll: () => void
  onExportCsv: () => void
}

export function HistoryScreen({ sessions, onViewSession, onClearAll, onExportCsv }: HistoryScreenProps) {
  return (
    <div className="px-5 py-5">
      {sessions.length === 0 ? (
        <div className="py-20 text-center">
          <div className="text-5xl mb-4">🏋️</div>
          <p className="text-gray-400 text-base mb-1">No workouts yet</p>
          <p className="text-gray-600 text-sm">Complete a workout to see it here</p>
        </div>
      ) : (
        <div className="space-y-3 mb-8">
          {sessions.map((s) => (
            <SessionCard key={s.id} session={s} onClick={() => onViewSession(s.id)} />
          ))}
        </div>
      )}

      <div className="border-t border-white/5 pt-5 space-y-3">
        {sessions.length > 0 && (
          <button
            onClick={onExportCsv}
            className="w-full py-3.5 text-sm text-gray-400 hover:text-white border border-white/10 rounded-2xl transition-colors flex items-center justify-center gap-2 font-medium"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Export to CSV
          </button>
        )}

        <button
          onClick={onClearAll}
          className="w-full py-3.5 text-sm text-red-400/50 hover:text-red-400 transition-colors font-medium"
        >
          Clear all data
        </button>
      </div>
    </div>
  )
}
