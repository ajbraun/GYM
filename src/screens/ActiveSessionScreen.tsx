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
        <div className="mb-4 flex items-center gap-3">
          <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-300"
              style={{ width: `${totalExercises ? (completedExercises / totalExercises) * 100 : 0}%` }}
            />
          </div>
          <span className="text-xs text-gray-400 tabular-nums flex-shrink-0">
            {completedExercises}/{totalExercises}
          </span>
        </div>

        <div className="space-y-3">
          {exercises.map((ex) => {
            const log = logs.get(ex.id)
            const isComplete = log?.completed ?? false
            const suggestion = goUpSuggestions.get(ex.id)
            const prevLog = previousWeights.get(ex.id)
            const lastWeight = prevLog?.weightUsed

            return (
              <button
                key={ex.id}
                onClick={() => onSelectExercise(ex.id)}
                className={`w-full text-left rounded-xl p-4 transition-all ${
                  isComplete
                    ? 'bg-accent/10 border border-accent/20'
                    : 'bg-surface-card hover:bg-surface-hover active:scale-[0.98]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className={`font-medium ${isComplete ? 'text-accent' : 'text-white'}`}>
                      {ex.name}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">{ex.setsReps}</span>
                      {ex.isWeighted && lastWeight != null && (
                        <span className="text-[10px] text-gray-500 bg-gray-800 px-1.5 py-0.5 rounded">
                          Last: {lastWeight} lbs
                        </span>
                      )}
                      {suggestion && (
                        <span className="text-[10px] text-accent font-medium">
                          Go up! {suggestion.suggestedWeight} lbs
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Set progress */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {log?.sets.map((s) => (
                      <div
                        key={s.setNumber}
                        className={`w-2.5 h-2.5 rounded-full ${
                          s.completed ? 'bg-accent' : 'bg-gray-700'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Chevron */}
                  <svg className="w-4 h-4 text-gray-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            )
          })}
        </div>
      </main>
    </div>
  )
}
