import { useState, useEffect } from 'react'
import type { ExerciseLog } from '../types/exerciseLog'
import { getLastCompletedSession } from '../services/sessionService'
import { getLogsForSession } from '../services/exerciseLogService'

export function usePreviousWeights(templateId: string | null) {
  const [previousLogs, setPreviousLogs] = useState<Map<string, ExerciseLog>>(new Map())

  useEffect(() => {
    if (!templateId) {
      setPreviousLogs(new Map())
      return
    }
    async function load() {
      const lastSession = await getLastCompletedSession(templateId!)
      if (!lastSession) {
        setPreviousLogs(new Map())
        return
      }
      const logs = await getLogsForSession(lastSession.id)
      setPreviousLogs(new Map(logs.map((l) => [l.exerciseId, l])))
    }
    load()
  }, [templateId])

  return previousLogs
}
