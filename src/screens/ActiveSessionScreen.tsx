import type { Exercise } from '../types/exercise'
import type { ExerciseLog } from '../types/exerciseLog'
import type { GoUpSuggestion } from '../hooks/useGoUpSuggestions'
import { SessionHeader } from '../components/session/SessionHeader'
import { getExerciseImage } from '../utils/exerciseImages'

interface ActiveSessionScreenProps {
  emoji: string
  name: string
  elapsed: number
  exercises: Exercise[]
  logs: Map<string, ExerciseLog>
  previousWeights: Map<string, ExerciseLog>
  goUpSuggestions: Map<string, GoUpSuggestion>
  onBack: () => void
  onFinish: () => void
  onSelectExercise: (exerciseId: string) => void
}

const EXERCISE_GRADIENTS = [
  'from-orange-900/80 to-amber-800/60',
  'from-emerald-900/80 to-teal-800/60',
  'from-indigo-900/80 to-blue-800/60',
  'from-rose-900/80 to-pink-800/60',
  'from-purple-900/80 to-violet-800/60',
  'from-cyan-900/80 to-teal-700/60',
  'from-yellow-900/80 to-amber-700/60',
  'from-red-900/80 to-orange-800/60',
  'from-slate-800/80 to-zinc-700/60',
  'from-amber-900/80 to-red-800/60',
]

export function ActiveSessionScreen({
  emoji,
  name,
  elapsed,
  exercises,
  logs,
  previousWeights,
  goUpSuggestions,
  onBack,
  onFinish,
  onSelectExercise,
}: ActiveSessionScreenProps) {
  const totalExercises = exercises.length
  const completedExercises = exercises.filter((ex) => logs.get(ex.id)?.completed).length

  return (
    <div className="min-h-dvh bg-gray-950">
      <SessionHeader emoji={emoji} name={name} elapsed={elapsed} onBack={onBack} onFinish={onFinish} />

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
          {exercises.map((ex, i) => {
            const log = logs.get(ex.id)
            const isComplete = log?.completed ?? false
            const setsCompleted = log?.sets.filter((s) => s.completed).length ?? 0
            const totalSets = log?.sets.length ?? 0
            const suggestion = goUpSuggestions.get(ex.id)
            const prevLog = previousWeights.get(ex.id)
            const lastWeight = prevLog?.weightUsed
            const gradient = EXERCISE_GRADIENTS[i % EXERCISE_GRADIENTS.length]
            const image = getExerciseImage(ex.name)

            return (
              <button
                key={ex.id}
                onClick={() => onSelectExercise(ex.id)}
                className={`relative w-full aspect-[3/4] rounded-2xl overflow-hidden text-left transition-all active:scale-[0.97] ${
                  isComplete ? 'ring-2 ring-success ring-offset-2 ring-offset-[#0f1420]' : ''
                }`}
              >
                {/* Background: image or gradient */}
                {image ? (
                  <img src={image} alt={ex.name} className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <>
                    <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.08)_0%,transparent_60%)]" />
                  </>
                )}

                {/* Completion checkmark */}
                {isComplete && (
                  <div className="absolute top-3 right-3 z-10">
                    <svg className="w-6 h-6 text-success drop-shadow-sm" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                  </div>
                )}

                {/* Weight / suggestion info (only when no image) */}
                {!image && (
                  <div className="absolute inset-0 flex items-center justify-center pb-10">
                    {suggestion ? (
                      <span className="text-2xl font-bold text-accent drop-shadow-lg">{suggestion.suggestedWeight} lbs</span>
                    ) : ex.isWeighted && lastWeight != null ? (
                      <span className="text-2xl font-bold text-white/70 drop-shadow-lg">{lastWeight} lbs</span>
                    ) : (
                      <span className="text-4xl drop-shadow-lg select-none">{ex.isWeighted ? '🏋️' : '💪'}</span>
                    )}
                  </div>
                )}

                {/* Bottom overlay with name + meta */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent pt-10 pb-3 px-3">
                  <h3 className={`font-bold text-sm leading-tight truncate drop-shadow-sm ${isComplete ? 'text-success' : 'text-white'}`}>
                    {ex.name}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    {log?.sets.map((s) => (
                      <div
                        key={s.setNumber}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          s.completed
                            ? isComplete ? 'bg-success' : 'bg-accent'
                            : 'bg-white/20'
                        }`}
                      />
                    ))}
                    <span className="text-[11px] text-white/50 ml-auto tabular-nums">
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
