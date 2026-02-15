import { getDB } from './db'
import type { ExerciseLog, SetLog } from '../types/exerciseLog'

function logId(sessionId: string, exerciseId: string): string {
  return `${sessionId}-${exerciseId}`
}

export function parseSetsReps(setsReps: string): { setCount: number; targetReps: string } {
  // Parse patterns like "3 × 8-10", "3 × 10/leg", "3 × failure", "1 × 20-30 min"
  const match = setsReps.match(/^(\d+)\s*[×x]\s*(.+)$/i)
  if (match) {
    return { setCount: parseInt(match[1]), targetReps: match[2].trim() }
  }
  return { setCount: 1, targetReps: setsReps }
}

function createDefaultSets(setsReps: string, previousWeight: number | null): SetLog[] {
  const { setCount, targetReps } = parseSetsReps(setsReps)
  return Array.from({ length: setCount }, (_, i) => ({
    setNumber: i + 1,
    targetReps,
    actualReps: null,
    weight: previousWeight,
    completed: false,
    completedAt: null,
  }))
}

export async function getOrCreateLog(
  sessionId: string,
  exerciseId: string,
  setsReps?: string,
  previousWeight?: number | null
): Promise<ExerciseLog> {
  const db = await getDB()
  const id = logId(sessionId, exerciseId)
  const existing = await db.get('exerciseLogs', id)
  if (existing) {
    // Backwards compat: old logs without sets array
    if (!existing.sets) {
      existing.sets = setsReps ? createDefaultSets(setsReps, existing.weightUsed) : []
    }
    return existing
  }

  const log: ExerciseLog = {
    id,
    sessionId,
    exerciseId,
    completed: false,
    weightUsed: null,
    goUp: false,
    completedAt: null,
    sets: setsReps ? createDefaultSets(setsReps, previousWeight ?? null) : [],
  }
  await db.put('exerciseLogs', log)
  return log
}

export async function updateLog(log: ExerciseLog): Promise<void> {
  const db = await getDB()
  await db.put('exerciseLogs', log)
}

export async function getLogsForSession(sessionId: string): Promise<ExerciseLog[]> {
  const db = await getDB()
  const logs = await db.getAllFromIndex('exerciseLogs', 'by-session', sessionId)
  // Backwards compat
  return logs.map((l) => ({ ...l, sets: l.sets ?? [] }))
}

export async function getLogsForExercise(exerciseId: string): Promise<ExerciseLog[]> {
  const db = await getDB()
  return db.getAllFromIndex('exerciseLogs', 'by-exercise', exerciseId)
}

export async function getLogForSessionExercise(
  sessionId: string,
  exerciseId: string
): Promise<ExerciseLog | undefined> {
  const db = await getDB()
  const log = await db.get('exerciseLogs', logId(sessionId, exerciseId))
  if (log && !log.sets) log.sets = []
  return log
}
