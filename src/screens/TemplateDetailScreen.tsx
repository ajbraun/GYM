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
        <div className="text-accent animate-pulse text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-gray-950">
      <header className="sticky top-0 z-10 bg-gray-950/95 backdrop-blur-sm border-b border-white/5 safe-top">
        <div className="max-w-lg mx-auto px-5 py-3 flex items-center gap-3">
          <button onClick={onBack} className="text-gray-400 hover:text-white transition-colors p-1 -ml-1">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <span className="text-2xl">{template.emoji}</span>
            <h1 className="text-lg font-bold text-white truncate">{template.name}</h1>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-5 py-6">
        {exercises.length > 0 ? (
          <>
            <button
              onClick={() => onStart(templateId)}
              className="w-full bg-accent hover:bg-accent-dark text-white font-bold py-4 rounded-2xl text-lg transition-colors active:scale-[0.98] mb-8"
            >
              Start Workout
            </button>

            <div className="space-y-3 mb-8">
              {exercises.map((ex) => (
                <div key={ex.id} className="bg-surface-card rounded-2xl px-5 py-4 flex items-center justify-between">
                  <div>
                    <div className="text-base font-semibold text-white">{ex.name}</div>
                    <div className="text-sm text-gray-500 mt-0.5">{ex.setsReps}</div>
                  </div>
                  {ex.isWeighted && (
                    <span className="text-xs text-gray-500 bg-white/5 px-2.5 py-1 rounded-lg">Weighted</span>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => onEditExercises(templateId)}
              className="w-full border border-white/10 text-gray-400 hover:text-white hover:border-white/20 font-medium py-3.5 rounded-2xl text-sm transition-colors"
            >
              Edit Workout
            </button>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">{template.emoji}</div>
            <p className="text-gray-400 mb-6">No exercises yet</p>
            <button
              onClick={() => onEditExercises(templateId)}
              className="bg-accent hover:bg-accent-dark text-white font-semibold px-8 py-3.5 rounded-2xl transition-colors"
            >
              Add Exercises
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
