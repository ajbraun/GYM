import { useState, useEffect } from 'react'
import { getSessionDetail } from '../hooks/useSessionHistory'
import type { Exercise } from '../types/exercise'
import type { ExerciseLog } from '../types/exerciseLog'
import type { WorkoutTemplate } from '../types/template'
import type { WorkoutSession } from '../types/session'

interface SessionDetailScreenProps {
  sessionId: string
  onBack: () => void
}

interface DetailData {
  session: WorkoutSession
  template: WorkoutTemplate | undefined
  exercises: Exercise[]
  logMap: Map<string, ExerciseLog>
}

export function SessionDetailScreen({ sessionId, onBack }: SessionDetailScreenProps) {
  const [data, setData] = useState<DetailData | null>(null)

  useEffect(() => {
    getSessionDetail(sessionId).then((d) => {
      if (d) setData(d)
    })
  }, [sessionId])

  if (!data) {
    return (
      <div className="min-h-dvh bg-gray-950 flex items-center justify-center">
        <div className="text-accent animate-pulse text-lg">Loading...</div>
      </div>
    )
  }

  const { session, template, exercises, logMap } = data
  const date = new Date(session.startedAt).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="min-h-dvh bg-gray-950">
      <header className="sticky top-0 z-10 bg-gray-950/95 backdrop-blur-sm border-b border-white/5 safe-top">
        <div className="max-w-lg mx-auto px-5 py-3 flex items-center gap-3">
          <button onClick={onBack} className="text-gray-400 hover:text-white transition-colors p-1 -ml-1">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-xl">{template?.emoji ?? '?'}</span>
            <div>
              <h1 className="text-lg font-bold text-white truncate">{template?.name ?? 'Workout'}</h1>
              <p className="text-xs text-gray-500">{date}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-5 py-5 space-y-3 pb-8">
        {exercises.map((ex) => {
          const log = logMap.get(ex.id)
          const hasSets = log?.sets && log.sets.length > 0

          return (
            <div key={ex.id} className="bg-surface-card rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    log?.completed ? 'bg-success/20 text-success' : 'border border-white/10'
                  }`}
                >
                  {log?.completed && (
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-base font-semibold ${log?.completed ? 'text-white' : 'text-gray-400'}`}>
                    {ex.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">{ex.setsReps}</div>
                </div>
                {log?.goUp && (
                  <span className="text-accent">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                    </svg>
                  </span>
                )}
              </div>

              {hasSets && (
                <div className="ml-9 space-y-1.5">
                  {log!.sets.filter((s) => s.completed).map((s) => (
                    <div key={s.setNumber} className="flex items-center gap-4 text-sm">
                      <span className="text-gray-500 w-12 font-medium">Set {s.setNumber}</span>
                      {s.weight != null && (
                        <span className="text-white">{s.weight} lbs</span>
                      )}
                      {s.actualReps != null && (
                        <span className="text-gray-500">{s.actualReps} reps</span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {!hasSets && log?.weightUsed != null && (
                <div className="ml-9 text-sm text-white">{log.weightUsed} lbs</div>
              )}
            </div>
          )
        })}
      </main>
    </div>
  )
}
