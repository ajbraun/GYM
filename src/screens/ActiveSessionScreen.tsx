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

      <main className="max-w-lg mx-auto px-5 py-5">
        {/* Progress summary */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex-1 h-2.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-500 ease-out"
              style={{ width: `${totalExercises ? (completedExercises / totalExercises) * 100 : 0}%` }}
            />
          </div>
          <span className="text-sm text-gray-400 tabular-nums flex-shrink-0 font-medium">
            {completedExercises}/{totalExercises}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
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
                className={`text-left rounded-2xl p-4 transition-all active:scale-[0.97] flex flex-col min-h-[130px] ${
                  isComplete
                    ? 'bg-success/10 border border-success/20'
                    : 'bg-surface-card active:bg-surface-hover'
                }`}
              >
                <div className={`text-sm font-semibold mb-1 leading-tight ${isComplete ? 'text-success' : 'text-white'}`}>
                  {ex.name}
                </div>
                <div className="text-xs text-gray-500 mb-3">{ex.setsReps}</div>

                <div className="mt-auto">
                  {ex.isWeighted && lastWeight != null && !suggestion && (
                    <div className="text-xs text-gray-400 mb-2">{lastWeight} lbs</div>
                  )}
                  {suggestion && (
                    <div className="text-xs text-accent font-medium mb-2">{suggestion.suggestedWeight} lbs</div>
                  )}

                  {/* Set progress dots */}
                  <div className="flex items-center gap-1.5">
                    {log?.sets.map((s) => (
                      <div
                        key={s.setNumber}
                        className={`w-2.5 h-2.5 rounded-full transition-colors ${
                          s.completed
                            ? isComplete ? 'bg-success' : 'bg-accent'
                            : 'bg-white/10'
                        }`}
                      />
                    ))}
                    <span className="text-[11px] text-gray-500 ml-auto tabular-nums">
                      {setsCompleted}/{totalSets}
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
