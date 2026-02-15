import { getDB } from './db'
import type { WorkoutSession } from '../types/session'

function generateId(): string {
  return `sess-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export async function createSession(templateId: string): Promise<WorkoutSession> {
  const db = await getDB()
  const session: WorkoutSession = {
    id: generateId(),
    templateId,
    startedAt: new Date().toISOString(),
    completedAt: null,
    notes: '',
  }
  await db.put('sessions', session)
  await db.put('meta', { key: 'activeSessionId', value: session.id })
  return session
}

export async function completeSession(id: string): Promise<void> {
  const db = await getDB()
  const session = await db.get('sessions', id)
  if (!session) return
  await db.put('sessions', { ...session, completedAt: new Date().toISOString() })
  await db.delete('meta', 'activeSessionId')
}

export async function getSession(id: string): Promise<WorkoutSession | undefined> {
  const db = await getDB()
  return db.get('sessions', id)
}

export async function getActiveSessionId(): Promise<string | null> {
  const db = await getDB()
  const meta = await db.get('meta', 'activeSessionId')
  return meta?.value ?? null
}

export async function getSessionsByTemplate(templateId: string): Promise<WorkoutSession[]> {
  const db = await getDB()
  const sessions = await db.getAllFromIndex('sessions', 'by-template', templateId)
  return sessions.sort((a, b) => b.startedAt.localeCompare(a.startedAt))
}

export async function getAllSessions(): Promise<WorkoutSession[]> {
  const db = await getDB()
  const sessions = await db.getAll('sessions')
  return sessions
    .filter((s) => s.completedAt !== null)
    .sort((a, b) => b.startedAt.localeCompare(a.startedAt))
}

export async function getLastCompletedSession(templateId: string): Promise<WorkoutSession | undefined> {
  const sessions = await getSessionsByTemplate(templateId)
  return sessions.find((s) => s.completedAt !== null)
}
