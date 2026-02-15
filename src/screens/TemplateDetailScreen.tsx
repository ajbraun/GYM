import { useState, useEffect, useCallback } from 'react'
import type { Exercise } from '../types/exercise'
import type { WorkoutTemplate } from '../types/template'
import { getExercisesForTemplate } from '../services/exerciseService'
import { getTemplate } from '../services/templateService'

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
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        {exercises.length > 0 ? (
          <>
            <button
              onClick={() => onStart(templateId)}
              className="w-full bg-accent hover:bg-accent-dark text-white font-bold py-4 rounded-2xl text-lg transition-colors active:scale-[0.98] mb-6"
            >
              Start Workout
            </button>

            <div className="space-y-3 mb-6">
              {exercises.map((ex) => (
                <div key={ex.id} className="bg-surface-card rounded-2xl p-5 flex items-center justify-between">
                  <div>
                    <div className="text-base font-semibold text-white">{ex.name}</div>
                    <div className="text-sm text-gray-500 mt-0.5">{ex.setsReps}</div>
                  </div>
                  {ex.isWeighted && (
                    <span className="text-xs text-gray-500 bg-gray-800/80 px-2 py-1 rounded-md">Weighted</span>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => onEditExercises(templateId)}
              className="w-full border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 font-medium py-3 rounded-2xl text-sm transition-colors"
            >
              Edit Workout
            </button>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No exercises yet</p>
            <button
              onClick={() => onEditExercises(templateId)}
              className="bg-accent hover:bg-accent-dark text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Add Exercises
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
