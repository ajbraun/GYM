import type { SessionWithMeta } from '../hooks/useSessionHistory'
import { SessionCard } from '../components/history/SessionCard'

interface HistoryScreenProps {
  sessions: SessionWithMeta[]
  onViewSession: (sessionId: string) => void
}

export function HistoryScreen({ sessions, onViewSession }: HistoryScreenProps) {
  if (sessions.length === 0) {
    return (
      <div className="px-4 py-12 text-center text-gray-500">
        No workouts completed yet. Start one from the Home tab!
      </div>
    )
  }

  return (
    <div className="px-4 py-4 space-y-3">
      {sessions.map((s) => (
        <SessionCard key={s.id} session={s} onClick={() => onViewSession(s.id)} />
      ))}
    </div>
  )
}
