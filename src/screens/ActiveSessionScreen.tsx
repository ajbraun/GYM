import type { Exercise } from '../types/exercise'
import type { ExerciseLog } from '../types/exerciseLog'
import type { GoUpSuggestion } from '../hooks/useGoUpSuggestions'
import { SessionHeader } from '../components/session/SessionHeader'

interface ActiveSessionScreenProps {
  emoji: string
  name: string
  elapsed: number
  exercises: Exercise[]
  logs: Map<string, ExerciseLog>
  previousWeights: Map<string, ExerciseLog>
  goUpSuggestions: Map<string, GoUpSuggestion>
  onFinish: () => void
  onSelectExercise: (exerciseId: string) => void
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
  onSelectExercise,
}: ActiveSessionScreenProps) {
  const totalExercises = exercises.length
  const completedExercises = exercises.filter((ex) => logs.get(ex.id)?.completed).length

  return (
    <div className="min-h-dvh bg-gray-950">
      <SessionHeader emoji={emoji} name={name} elapsed={elapsed} onFinish={onFinish} />

      <main className="max-w-lg mx-auto px-4 py-4">
        {/* Progress summary */}
        <div className="mb-5 flex items-center gap-3">
          <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-300"
              style={{ width: `${totalExercises ? (completedExercises / totalExercises) * 100 : 0}%` }}
            />
          </div>
          <span className="text-sm text-gray-400 tabular-nums flex-shrink-0">
            {completedExercises}/{totalExercises}
          </span>
        </div>

        <div className="space-y-4">
          {exercises.map((ex) => {
            const log = logs.get(ex.id)
            const isComplete = log?.completed ?? false
            const setsCompleted = log?.sets.filter((s) => s.completed).length ?? 0
            const totalSets = log?.sets.length ?? 0
            const suggestion = goUpSuggestions.get(ex.id)
            const prevLog = previousWeights.get(ex.id)
            const lastWeight = prevLog?.weightUsed

            return (
              <button
                key={ex.id}
                onClick={() => onSelectExercise(ex.id)}
                className={`w-full text-left rounded-2xl p-5 transition-all active:scale-[0.98] ${
                  isComplete
                    ? 'bg-accent/10 border border-accent/20'
                    : 'bg-surface-card hover:bg-surface-hover'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className={`text-base font-semibold mb-1 ${isComplete ? 'text-accent' : 'text-white'}`}>
                      {ex.name}
                    </div>
                    <div className="text-sm text-gray-500 mb-3">{ex.setsReps}</div>

                    <div className="flex items-center gap-3 flex-wrap">
                      {ex.isWeighted && lastWeight != null && (
                        <span className="text-xs text-gray-400 bg-gray-800/80 px-2 py-1 rounded-md">
                          Last: {lastWeight} lbs
                        </span>
                      )}
                      {suggestion && (
                        <span className="text-xs text-accent font-medium bg-accent/10 px-2 py-1 rounded-md">
                          ↑ Try {suggestion.suggestedWeight} lbs
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 flex-shrink-0 pt-1">
                    {/* Set progress dots */}
                    <div className="flex items-center gap-1.5">
                      {log?.sets.map((s) => (
                        <div
                          key={s.setNumber}
                          className={`w-3 h-3 rounded-full ${
                            s.completed ? 'bg-accent' : 'bg-gray-700'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">
                      {setsCompleted}/{totalSets} sets
                    </span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </main>
    </div>
  )
}
