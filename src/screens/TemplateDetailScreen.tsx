import { useState, useEffect, useCallback } from 'react'
import type { Exercise } from '../types/exercise'
import type { WorkoutTemplate } from '../types/template'
import { getExercisesForTemplate } from '../services/exerciseService'
import { getTemplate } from '../services/templateService'
import { getExerciseImage } from '../utils/exerciseImages'

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

            <div className="grid grid-cols-2 gap-3 mb-8">
              {exercises.map((ex, i) => {
                const gradient = EXERCISE_GRADIENTS[i % EXERCISE_GRADIENTS.length]
                const image = getExerciseImage(ex.name)
                return (
                  <div
                    key={ex.id}
                    className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden"
                  >
                    {image ? (
                      <img src={image} alt={ex.name} className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <>
                        <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.08)_0%,transparent_60%)]" />
                        <div className="absolute inset-0 flex items-center justify-center pb-10">
                          <span className="text-4xl drop-shadow-lg select-none">{ex.isWeighted ? '🏋️' : '💪'}</span>
                        </div>
                      </>
                    )}

                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent pt-10 pb-3 px-3">
                      <h3 className="text-white font-bold text-sm leading-tight truncate drop-shadow-sm">
                        {ex.name}
                      </h3>
                      <p className="text-white/50 text-xs mt-0.5">{ex.setsReps}</p>
                    </div>
                  </div>
                )
              })}
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
