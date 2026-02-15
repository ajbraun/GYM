import { getDB } from './db'
import type { ExerciseLog } from '../types/exerciseLog'

function logId(sessionId: string, exerciseId: string): string {
  return `${sessionId}-${exerciseId}`
}

export async function getOrCreateLog(sessionId: string, exerciseId: string): Promise<ExerciseLog> {
  const db = await getDB()
  const id = logId(sessionId, exerciseId)
  const existing = await db.get('exerciseLogs', id)
  if (existing) return existing

  const log: ExerciseLog = {
    id,
    sessionId,
    exerciseId,
    completed: false,
    weightUsed: null,
    goUp: false,
    completedAt: null,
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
  return db.getAllFromIndex('exerciseLogs', 'by-session', sessionId)
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
  return db.get('exerciseLogs', logId(sessionId, exerciseId))
}
