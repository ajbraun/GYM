import { useState, useEffect, useCallback } from 'react'
import type { Exercise } from '../types/exercise'
import type { WorkoutTemplate } from '../types/template'
import { getExercisesForTemplate, updateExercise } from '../services/exerciseService'
import { getTemplate } from '../services/templateService'
import { parseSetsReps } from '../services/exerciseLogService'

interface TemplateDetailScreenProps {
  templateId: string
  onBack: () => void
  onStart: (templateId: string) => void
  onEditExercises: (templateId: string) => void
}

export function TemplateDetailScreen({ templateId, onBack, onStart, onEditExercises }: TemplateDetailScreenProps) {
  const [template, setTemplate] = useState<WorkoutTemplate | null>(null)
  const [exercises, setExercises] = useState<Exercise[]>([])

  const load = useCallback(async () => {
    const [tpl, exs] = await Promise.all([
      getTemplate(templateId),
      getExercisesForTemplate(templateId),
    ])
    if (tpl) setTemplate(tpl)
    setExercises(exs)
  }, [templateId])

  useEffect(() => { load() }, [load])

  const handleUpdateSetsReps = async (exercise: Exercise, newSetsReps: string) => {
    await updateExercise({ ...exercise, setsReps: newSetsReps })
    await load()
  }

  if (!template) {
    return (
      <div className="min-h-dvh bg-gray-950 flex items-center justify-center">
        <div className="text-accent animate-pulse">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-gray-950">
      <header className="sticky top-0 z-10 bg-gray-950/95 backdrop-blur-sm border-b border-gray-800/50 safe-top">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={onBack} className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-2xl">{template.emoji}</span>
            <h1 className="text-lg font-bold text-white truncate">{template.name}</h1>
          </div>
          <button
            onClick={() => onEditExercises(templateId)}
            className="text-sm text-gray-400 hover:text-accent transition-colors"
          >
            Edit
          </button>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-4 pb-28">
        <div className="space-y-3">
          {exercises.map((ex) => (
            <ExerciseStepperCard
              key={ex.id}
              exercise={ex}
              onUpdateSetsReps={(sr) => handleUpdateSetsReps(ex, sr)}
            />
          ))}
          {exercises.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-3">No exercises yet</p>
              <button
                onClick={() => onEditExercises(templateId)}
                className="text-accent text-sm font-medium"
              >
                Add exercises
              </button>
            </div>
          )}
        </div>
      </main>

      {exercises.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 safe-bottom bg-gray-950/95 backdrop-blur-sm border-t border-gray-800/50">
          <div className="max-w-lg mx-auto">
            <button
              onClick={() => onStart(templateId)}
              className="w-full bg-accent hover:bg-accent-dark text-white font-bold py-4 rounded-2xl text-lg transition-colors active:scale-[0.98]"
            >
              Start Workout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function adjustSets(setsReps: string, delta: number): string {
  const { setCount, targetReps } = parseSetsReps(setsReps)
  const newSets = Math.max(1, setCount + delta)
  return `${newSets} × ${targetReps}`
}

function adjustReps(setsReps: string, delta: number): string {
  const { setCount, targetReps } = parseSetsReps(setsReps)

  // Range like "8-10"
  const rangeMatch = targetReps.match(/^(\d+)\s*-\s*(\d+)(.*)$/)
  if (rangeMatch) {
    const low = Math.max(1, parseInt(rangeMatch[1]) + delta)
    const high = Math.max(1, parseInt(rangeMatch[2]) + delta)
    return `${setCount} × ${low}-${high}${rangeMatch[3]}`
  }

  // Single number like "10" or "10/leg"
  const singleMatch = targetReps.match(/^(\d+)(.*)$/)
  if (singleMatch) {
    const num = Math.max(1, parseInt(singleMatch[1]) + delta)
    return `${setCount} × ${num}${singleMatch[2]}`
  }

  // Non-numeric (e.g. "failure", "20-30 min") — don't adjust
  return setsReps
}

function canAdjustReps(setsReps: string): boolean {
  const { targetReps } = parseSetsReps(setsReps)
  return /^\d+/.test(targetReps)
}

function ExerciseStepperCard({
  exercise,
  onUpdateSetsReps,
}: {
  exercise: Exercise
  onUpdateSetsReps: (setsReps: string) => void
}) {
  const { setCount, targetReps } = parseSetsReps(exercise.setsReps)
  const repsAdjustable = canAdjustReps(exercise.setsReps)

  return (
    <div className="bg-surface-card rounded-2xl p-5">
      <div className="text-base font-semibold text-white mb-4">{exercise.name}</div>

      <div className="flex items-center gap-6">
        {/* Sets stepper */}
        <div className="flex-1">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">Sets</div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onUpdateSetsReps(adjustSets(exercise.setsReps, -1))}
              disabled={setCount <= 1}
              className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-gray-700 disabled:opacity-30 text-white text-lg font-bold flex items-center justify-center transition-colors active:scale-95"
            >
              −
            </button>
            <span className="text-2xl font-bold text-white tabular-nums w-8 text-center">{setCount}</span>
            <button
              onClick={() => onUpdateSetsReps(adjustSets(exercise.setsReps, 1))}
              className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-gray-700 text-white text-lg font-bold flex items-center justify-center transition-colors active:scale-95"
            >
              +
            </button>
          </div>
        </div>

        {/* Reps stepper or display */}
        <div className="flex-1">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">Reps</div>
          {repsAdjustable ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => onUpdateSetsReps(adjustReps(exercise.setsReps, -1))}
                className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-gray-700 disabled:opacity-30 text-white text-lg font-bold flex items-center justify-center transition-colors active:scale-95"
              >
                −
              </button>
              <span className="text-2xl font-bold text-white tabular-nums text-center min-w-8">{targetReps}</span>
              <button
                onClick={() => onUpdateSetsReps(adjustReps(exercise.setsReps, 1))}
                className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-gray-700 text-white text-lg font-bold flex items-center justify-center transition-colors active:scale-95"
              >
                +
              </button>
            </div>
          ) : (
            <div className="text-2xl font-bold text-white h-10 flex items-center">{targetReps}</div>
          )}
        </div>
      </div>
    </div>
  )
}
