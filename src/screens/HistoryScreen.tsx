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
    <div className="px-4 py-4">
      {sessions.length === 0 ? (
        <div className="py-12 text-center text-gray-500">
          No workouts completed yet. Start one from the Home tab!
        </div>
      ) : (
        <div className="space-y-3 mb-6">
          {sessions.map((s) => (
            <SessionCard key={s.id} session={s} onClick={() => onViewSession(s.id)} />
          ))}
        </div>
      )}

      <div className="border-t border-gray-800/50 pt-4 space-y-3">
        {sessions.length > 0 && (
          <button
            onClick={onExportCsv}
            className="w-full py-3 text-sm text-gray-400 hover:text-white border border-gray-800 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Export to CSV
          </button>
        )}

        <button
          onClick={onClearAll}
          className="w-full py-3 text-sm text-red-400/60 hover:text-red-400 transition-colors"
        >
          Clear all data
        </button>
      </div>
    </div>
  )
}
