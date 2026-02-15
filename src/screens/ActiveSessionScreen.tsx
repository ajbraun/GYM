import type { Exercise } from '../types/exercise'
import type { ExerciseLog } from '../types/exerciseLog'
import type { GoUpSuggestion } from '../hooks/useGoUpSuggestions'
import { SessionHeader } from '../components/session/SessionHeader'
import { ExerciseRow } from '../components/session/ExerciseRow'

interface ActiveSessionScreenProps {
  emoji: string
  name: string
  elapsed: number
  exercises: Exercise[]
  logs: Map<string, ExerciseLog>
  previousWeights: Map<string, ExerciseLog>
  goUpSuggestions: Map<string, GoUpSuggestion>
  onFinish: () => void
  onToggleComplete: (exerciseId: string) => void
  onSetWeight: (exerciseId: string, weight: number | null) => void
  onToggleGoUp: (exerciseId: string) => void
}

export function ActiveSessionScreen({
  emoji,
  name,
  elapsed,
  exercises,
  logs,
  previousWeights,
  goUpSuggestions,
  onFinish,
  onToggleComplete,
  onSetWeight,
  onToggleGoUp,
}: ActiveSessionScreenProps) {
  return (
    <div className="min-h-dvh bg-gray-950">
      <SessionHeader emoji={emoji} name={name} elapsed={elapsed} onFinish={onFinish} />

      <main className="max-w-lg mx-auto px-4 py-4 space-y-2">
        {exercises.map((ex) => {
          const log = logs.get(ex.id)
          if (!log) return null
          const prevLog = previousWeights.get(ex.id)
          const prevWeight = prevLog?.weightUsed ?? null
          const suggestion = goUpSuggestions.get(ex.id) ?? null

          return (
            <ExerciseRow
              key={ex.id}
              exercise={ex}
              log={log}
              previousWeight={prevWeight}
              goUpSuggestion={suggestion}
              onToggleComplete={onToggleComplete}
              onSetWeight={onSetWeight}
              onToggleGoUp={onToggleGoUp}
            />
          )
        })}
      </main>
    </div>
  )
}
