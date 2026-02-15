import { useState, useEffect, useCallback, useRef } from 'react'
import type { WorkoutSession } from '../types/session'
import type { Exercise } from '../types/exercise'
import type { ExerciseLog } from '../types/exerciseLog'
import { createSession, completeSession, getSession, getActiveSessionId } from '../services/sessionService'
import { getExercisesForTemplate } from '../services/exerciseService'
import { getOrCreateLog, updateLog, getLogsForSession } from '../services/exerciseLogService'

export interface ActiveSessionState {
  session: WorkoutSession | null
  exercises: Exercise[]
  logs: Map<string, ExerciseLog>
  elapsed: number // seconds
}

export function useActiveSession() {
  const [state, setState] = useState<ActiveSessionState>({
    session: null,
    exercises: [],
    logs: new Map(),
    elapsed: 0,
  })
  const [loading, setLoading] = useState(true)
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined)
  const debounceTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  // Timer
  useEffect(() => {
    if (!state.session) {
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }
    const startTime = new Date(state.session.startedAt).getTime()
    const tick = () => {
      setState((s) => ({ ...s, elapsed: Math.floor((Date.now() - startTime) / 1000) }))
    }
    tick()
    timerRef.current = setInterval(tick, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [state.session?.id, state.session?.startedAt])

  // Resume active session on mount
  useEffect(() => {
    async function resume() {
      const activeId = await getActiveSessionId()
      if (activeId) {
        const session = await getSession(activeId)
        if (session && !session.completedAt) {
          const exercises = await getExercisesForTemplate(session.templateId)
          const logList = await getLogsForSession(session.id)
          const logs = new Map(logList.map((l) => [l.exerciseId, l]))
          setState({ session, exercises, logs, elapsed: 0 })
        }
      }
      setLoading(false)
    }
    resume()
  }, [])

  const start = useCallback(async (templateId: string) => {
    const session = await createSession(templateId)
    const exercises = await getExercisesForTemplate(templateId)
    // Pre-create logs for all exercises
    const logs = new Map<string, ExerciseLog>()
    for (const ex of exercises) {
      const log = await getOrCreateLog(session.id, ex.id)
      logs.set(ex.id, log)
    }
    setState({ session, exercises, logs, elapsed: 0 })
  }, [])

  const finish = useCallback(async () => {
    if (!state.session) return
    // Flush any pending debounced saves
    for (const timer of debounceTimers.current.values()) clearTimeout(timer)
    debounceTimers.current.clear()
    await completeSession(state.session.id)
    setState({ session: null, exercises: [], logs: new Map(), elapsed: 0 })
  }, [state.session])

  const toggleComplete = useCallback(async (exerciseId: string) => {
    if (!state.session) return
    const log = await getOrCreateLog(state.session.id, exerciseId)
    const updated: ExerciseLog = {
      ...log,
      completed: !log.completed,
      completedAt: !log.completed ? new Date().toISOString() : null,
    }
    await updateLog(updated)
    setState((s) => {
      const logs = new Map(s.logs)
      logs.set(exerciseId, updated)
      return { ...s, logs }
    })
  }, [state.session])

  const setWeight = useCallback((exerciseId: string, weight: number | null) => {
    if (!state.session) return
    const sessionId = state.session.id

    // Optimistic UI update
    setState((s) => {
      const logs = new Map(s.logs)
      const existing = logs.get(exerciseId)
      if (existing) {
        logs.set(exerciseId, { ...existing, weightUsed: weight })
      }
      return { ...s, logs }
    })

    // Debounced save
    const existing = debounceTimers.current.get(exerciseId)
    if (existing) clearTimeout(existing)
    debounceTimers.current.set(
      exerciseId,
      setTimeout(async () => {
        const log = await getOrCreateLog(sessionId, exerciseId)
        await updateLog({ ...log, weightUsed: weight })
        debounceTimers.current.delete(exerciseId)
      }, 300)
    )
  }, [state.session])

  const toggleGoUp = useCallback(async (exerciseId: string) => {
    if (!state.session) return
    const log = await getOrCreateLog(state.session.id, exerciseId)
    const updated: ExerciseLog = { ...log, goUp: !log.goUp }
    await updateLog(updated)
    setState((s) => {
      const logs = new Map(s.logs)
      logs.set(exerciseId, updated)
      return { ...s, logs }
    })
  }, [state.session])

  return {
    ...state,
    loading,
    start,
    finish,
    toggleComplete,
    setWeight,
    toggleGoUp,
    isActive: state.session !== null,
  }
}
