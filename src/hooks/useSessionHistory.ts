import { useState, useEffect, useCallback } from 'react'
import type { WorkoutSession } from '../types/session'
import type { WorkoutTemplate } from '../types/template'
import type { ExerciseLog } from '../types/exerciseLog'
import { getAllSessions, getSession } from '../services/sessionService'
import { getAllTemplates, getTemplate } from '../services/templateService'
import { getLogsForSession } from '../services/exerciseLogService'
import { getExercisesForTemplate } from '../services/exerciseService'

export interface SessionWithMeta extends WorkoutSession {
  templateName: string
  templateEmoji: string
  completionRatio: number // 0-1
}

export function useSessionHistory() {
  const [sessions, setSessions] = useState<SessionWithMeta[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    const [allSessions, allTemplates] = await Promise.all([getAllSessions(), getAllTemplates()])
    const templateMap = new Map<string, WorkoutTemplate>(allTemplates.map((t) => [t.id, t]))

    const withMeta: SessionWithMeta[] = await Promise.all(
      allSessions.map(async (s) => {
        const template = templateMap.get(s.templateId)
        const logs = await getLogsForSession(s.id)
        const exercises = await getExercisesForTemplate(s.templateId)
        const completed = logs.filter((l) => l.completed).length
        const total = exercises.length || 1

        return {
          ...s,
          templateName: template?.name ?? 'Unknown',
          templateEmoji: template?.emoji ?? '?',
          completionRatio: completed / total,
        }
      })
    )

    setSessions(withMeta)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  return { sessions, loading, reload: load }
}

export async function getSessionDetail(sessionId: string) {
  const session = await getSession(sessionId)
  if (!session) return null

  const [logs, exercises, template] = await Promise.all([
    getLogsForSession(sessionId),
    getExercisesForTemplate(session.templateId),
    getTemplate(session.templateId),
  ])

  const exerciseMap = new Map(exercises.map((e) => [e.id, e]))
  const logMap = new Map<string, ExerciseLog>(logs.map((l) => [l.exerciseId, l]))

  return { session, template, exercises, exerciseMap, logMap }
}
