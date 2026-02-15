import { useState, useEffect, useCallback, useRef } from 'react'
import type { WorkoutSession } from '../types/session'
import type { Exercise } from '../types/exercise'
import type { ExerciseLog } from '../types/exerciseLog'
import { createSession, completeSession, getSession, getActiveSessionId } from '../services/sessionService'
import { getExercisesForTemplate } from '../services/exerciseService'
import { getOrCreateLog, updateLog, getLogsForSession } from '../services/exerciseLogService'
import { getLastCompletedSession } from '../services/sessionService'

export interface ActiveSessionState {
  session: WorkoutSession | null
  exercises: Exercise[]
  logs: Map<string, ExerciseLog>
  elapsed: number
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

    // Get previous session's weights for pre-filling
    const prevSession = await getLastCompletedSession(templateId)
    let prevLogs: ExerciseLog[] = []
    if (prevSession) {
      prevLogs = await getLogsForSession(prevSession.id)
    }
    const prevWeightMap = new Map(prevLogs.map((l) => [l.exerciseId, l.weightUsed]))

    const logs = new Map<string, ExerciseLog>()
    for (const ex of exercises) {
      const prevWeight = prevWeightMap.get(ex.id) ?? null
      const log = await getOrCreateLog(session.id, ex.id, ex.setsReps, prevWeight)
      logs.set(ex.id, log)
    }
    setState({ session, exercises, logs, elapsed: 0 })
  }, [])

  const finish = useCallback(async () => {
    if (!state.session) return
    await completeSession(state.session.id)
    setState({ session: null, exercises: [], logs: new Map(), elapsed: 0 })
  }, [state.session])

  const completeSet = useCallback(async (
    exerciseId: string,
    setNumber: number,
    weight: number | null,
    actualReps: number | null
  ) => {
    if (!state.session) return
    const log = await getOrCreateLog(state.session.id, exerciseId)
    const sets = [...log.sets]
    const idx = sets.findIndex((s) => s.setNumber === setNumber)
    if (idx === -1) return

    sets[idx] = {
      ...sets[idx],
      weight,
      actualReps,
      completed: true,
      completedAt: new Date().toISOString(),
    }

    const allDone = sets.every((s) => s.completed)
    // Use the last completed set's weight as the summary weight
    const lastWeight = [...sets].reverse().find((s) => s.completed)?.weight ?? weight

    const updated: ExerciseLog = {
      ...log,
      sets,
      completed: allDone,
      weightUsed: lastWeight,
      completedAt: allDone ? new Date().toISOString() : null,
    }
    await updateLog(updated)
    setState((s) => {
      const logs = new Map(s.logs)
      logs.set(exerciseId, updated)
      return { ...s, logs }
    })
  }, [state.session])

  const updateSetBeforeStart = useCallback(async (
    exerciseId: string,
    setNumber: number,
    updates: { weight?: number | null; targetReps?: string }
  ) => {
    if (!state.session) return
    const log = await getOrCreateLog(state.session.id, exerciseId)
    const sets = [...log.sets]
    const idx = sets.findIndex((s) => s.setNumber === setNumber)
    if (idx === -1) return

    sets[idx] = {
      ...sets[idx],
      ...(updates.weight !== undefined ? { weight: updates.weight } : {}),
      ...(updates.targetReps !== undefined ? { targetReps: updates.targetReps } : {}),
    }

    const updated: ExerciseLog = { ...log, sets }
    await updateLog(updated)
    setState((s) => {
      const logs = new Map(s.logs)
      logs.set(exerciseId, updated)
      return { ...s, logs }
    })
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
    completeSet,
    updateSetBeforeStart,
    toggleGoUp,
    isActive: state.session !== null,
  }
}
