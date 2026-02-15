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
        <div className="text-accent animate-pulse">Loading...</div>
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
      <header className="sticky top-0 z-10 bg-gray-950/95 backdrop-blur-sm border-b border-gray-800/50 safe-top">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={onBack} className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xl">{template?.emoji ?? '?'}</span>
            <div>
              <h1 className="text-base font-bold text-white truncate">{template?.name ?? 'Workout'}</h1>
              <p className="text-xs text-gray-400">{date}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-4 space-y-2 pb-24">
        {exercises.map((ex) => {
          const log = logMap.get(ex.id)
          return (
            <div key={ex.id} className="bg-surface-card rounded-lg p-3 flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 ${
                  log?.completed ? 'bg-accent text-white' : 'border border-gray-600'
                }`}
              >
                {log?.completed && (
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-sm ${log?.completed ? 'text-gray-400' : 'text-white'}`}>
                  {ex.name}
                </div>
                <div className="text-xs text-gray-500">{ex.setsReps}</div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {log?.weightUsed !== null && log?.weightUsed !== undefined && (
                  <span className="text-sm text-gray-300">{log.weightUsed} lbs</span>
                )}
                {log?.goUp && (
                  <span className="text-accent text-xs">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                    </svg>
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </main>
    </div>
  )
}
