import type { Exercise } from '../../types/exercise'
import type { ExerciseLog } from '../../types/exerciseLog'
import type { GoUpSuggestion } from '../../hooks/useGoUpSuggestions'
import { WeightInput } from './WeightInput'
import { GoUpButton } from './GoUpButton'
import { PreviousWeightBadge } from './PreviousWeightBadge'
import { GoUpReminder } from './GoUpReminder'

interface ExerciseRowProps {
  exercise: Exercise
  log: ExerciseLog
  previousWeight: number | null
  goUpSuggestion: GoUpSuggestion | null
  onToggleComplete: (exerciseId: string) => void
  onSetWeight: (exerciseId: string, weight: number | null) => void
  onToggleGoUp: (exerciseId: string) => void
}

export function ExerciseRow({
  exercise,
  log,
  previousWeight,
  goUpSuggestion,
  onToggleComplete,
  onSetWeight,
  onToggleGoUp,
}: ExerciseRowProps) {
  return (
    <div className={`p-3 rounded-lg transition-colors ${log.completed ? 'bg-surface-hover/50' : 'bg-surface-card'}`}>
      <div className="flex items-center gap-3">
        {/* Checkbox */}
        <button
          onClick={() => onToggleComplete(exercise.id)}
          className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
            log.completed
              ? 'bg-accent border-accent text-white'
              : 'border-gray-600 hover:border-gray-400'
          }`}
        >
          {log.completed && (
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        {/* Name + sets/reps */}
        <div className="flex-1 min-w-0">
          <div className={`text-sm font-medium ${log.completed ? 'text-gray-400 line-through' : 'text-white'}`}>
            {exercise.name}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-gray-500">{exercise.setsReps}</span>
            {previousWeight !== null && <PreviousWeightBadge weight={previousWeight} />}
          </div>
          {goUpSuggestion && <GoUpReminder suggestedWeight={goUpSuggestion.suggestedWeight} />}
        </div>

        {/* Weight + go up */}
        {exercise.isWeighted && (
          <div className="flex items-center gap-1 flex-shrink-0">
            <WeightInput
              value={log.weightUsed}
              suggestedWeight={goUpSuggestion?.suggestedWeight ?? null}
              onChange={(w) => onSetWeight(exercise.id, w)}
            />
            <GoUpButton active={log.goUp} onToggle={() => onToggleGoUp(exercise.id)} />
          </div>
        )}
      </div>
    </div>
  )
}
