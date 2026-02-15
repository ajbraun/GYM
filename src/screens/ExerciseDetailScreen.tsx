import { useState } from 'react'
import type { Exercise } from '../types/exercise'
import type { ExerciseLog } from '../types/exerciseLog'
import type { GoUpSuggestion } from '../hooks/useGoUpSuggestions'

interface ExerciseDetailScreenProps {
  exercise: Exercise
  log: ExerciseLog
  previousWeight: number | null
  goUpSuggestion: GoUpSuggestion | null
  onBack: () => void
  onCompleteSet: (exerciseId: string, setNumber: number, weight: number | null, actualReps: number | null) => void
  onToggleGoUp: (exerciseId: string) => void
}

export function ExerciseDetailScreen({
  exercise,
  log,
  previousWeight,
  goUpSuggestion,
  onBack,
  onCompleteSet,
  onToggleGoUp,
}: ExerciseDetailScreenProps) {
  const sets = log.sets
  const currentSetIdx = sets.findIndex((s) => !s.completed)
  const currentSet = currentSetIdx !== -1 ? sets[currentSetIdx] : null
  const allDone = sets.every((s) => s.completed)

  // Local state for the current set's weight and reps inputs
  const [weight, setWeight] = useState<string>(
    currentSet?.weight != null ? String(currentSet.weight) : ''
  )
  const [reps, setReps] = useState<string>('')

  const handleCompleteSet = () => {
    if (!currentSet) return
    const w = weight === '' ? null : Number(weight)
    const r = reps === '' ? null : Number(reps)
    onCompleteSet(exercise.id, currentSet.setNumber, w, r)

    // Advance to next set's weight (carry forward)
    const nextIdx = currentSetIdx + 1
    if (nextIdx < sets.length) {
      const nextSet = sets[nextIdx]
      setWeight(nextSet.weight != null ? String(nextSet.weight) : weight)
      setReps('')
    }
  }

  return (
    <div className="min-h-dvh bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-gray-950/95 backdrop-blur-sm border-b border-gray-800/50 safe-top">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={onBack} className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-white truncate">{exercise.name}</h1>
            <p className="text-xs text-gray-400">{exercise.setsReps}</p>
          </div>
          {exercise.isWeighted && (
            <button
              onClick={() => onToggleGoUp(exercise.id)}
              className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all ${
                log.goUp ? 'bg-accent/20 text-accent' : 'text-gray-600 hover:text-gray-400'
              }`}
              title={log.goUp ? 'Going up next time' : 'Tap to go up next time'}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
              </svg>
            </button>
          )}
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        {/* Go-up reminder */}
        {goUpSuggestion && (
          <div className="bg-accent/10 border border-accent/20 rounded-lg px-4 py-3 mb-6 flex items-center gap-2">
            <svg className="w-4 h-4 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>
            <span className="text-sm text-accent">
              Go up! Try {goUpSuggestion.suggestedWeight} lbs (was {goUpSuggestion.previousWeight})
            </span>
          </div>
        )}

        {/* Current set - big focused card */}
        {currentSet && !allDone && (
          <div className="bg-surface-card rounded-2xl p-6 mb-6">
            <div className="text-center mb-6">
              <div className="text-sm text-gray-400 mb-1">
                Set {currentSet.setNumber} of {sets.length}
              </div>
              <div className="text-lg font-bold text-white">
                {currentSet.targetReps} reps
              </div>
            </div>

            {/* Weight input */}
            {exercise.isWeighted && (
              <div className="mb-4">
                <label className="text-xs text-gray-400 mb-1.5 block">Weight (lbs)</label>
                <input
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={weight}
                  placeholder={goUpSuggestion ? String(goUpSuggestion.suggestedWeight) : previousWeight ? String(previousWeight) : '0'}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full h-14 text-center text-2xl font-bold rounded-xl border border-gray-700 bg-gray-800/50 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-colors placeholder:text-gray-600"
                />
              </div>
            )}

            {/* Actual reps input */}
            <div className="mb-6">
              <label className="text-xs text-gray-400 mb-1.5 block">Reps completed</label>
              <input
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                value={reps}
                placeholder={currentSet.targetReps.replace(/[^0-9]/g, '').slice(0, 2) || '—'}
                onChange={(e) => setReps(e.target.value)}
                className="w-full h-14 text-center text-2xl font-bold rounded-xl border border-gray-700 bg-gray-800/50 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-colors placeholder:text-gray-600"
              />
            </div>

            <button
              onClick={handleCompleteSet}
              className="w-full bg-accent hover:bg-accent-dark text-white font-bold py-4 rounded-xl text-lg transition-colors active:scale-[0.98]"
            >
              Complete Set {currentSet.setNumber}
            </button>
          </div>
        )}

        {/* All done message */}
        {allDone && (
          <div className="text-center py-8 mb-6">
            <div className="text-4xl mb-3">
              {exercise.isWeighted ? '💪' : '✅'}
            </div>
            <div className="text-lg font-bold text-accent mb-1">All sets complete!</div>
            <p className="text-sm text-gray-400">Great work on {exercise.name}</p>
          </div>
        )}

        {/* Completed sets log */}
        {sets.some((s) => s.completed) && (
          <div>
            <h3 className="text-xs text-gray-500 uppercase tracking-wide mb-2">Completed Sets</h3>
            <div className="space-y-2">
              {sets.filter((s) => s.completed).map((s) => (
                <div key={s.setNumber} className="bg-surface-card/50 rounded-lg px-4 py-3 flex items-center justify-between">
                  <span className="text-sm text-gray-400">Set {s.setNumber}</span>
                  <div className="flex items-center gap-3">
                    {s.weight != null && (
                      <span className="text-sm text-white">{s.weight} lbs</span>
                    )}
                    {s.actualReps != null && (
                      <span className="text-sm text-gray-400">{s.actualReps} reps</span>
                    )}
                    <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Back button at bottom */}
        <button
          onClick={onBack}
          className="w-full mt-6 py-3 text-gray-400 text-sm hover:text-white transition-colors"
        >
          Back to workout
        </button>
      </main>
    </div>
  )
}
