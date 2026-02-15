import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { WorkoutTemplate } from '../types/template'
import type { Exercise } from '../types/exercise'
import type { WorkoutSession } from '../types/session'
import type { ExerciseLog } from '../types/exerciseLog'

interface WorkoutTrackerDB extends DBSchema {
  templates: {
    key: string
    value: WorkoutTemplate
  }
  exercises: {
    key: string
    value: Exercise
    indexes: {
      'by-template': string
    }
  }
  sessions: {
    key: string
    value: WorkoutSession
    indexes: {
      'by-template': string
      'by-startedAt': string
    }
  }
  exerciseLogs: {
    key: string
    value: ExerciseLog
    indexes: {
      'by-session': string
      'by-exercise': string
    }
  }
  meta: {
    key: string
    value: { key: string; value: string }
  }
}

let dbInstance: IDBPDatabase<WorkoutTrackerDB> | null = null

export async function getDB(): Promise<IDBPDatabase<WorkoutTrackerDB>> {
  if (dbInstance) return dbInstance

  dbInstance = await openDB<WorkoutTrackerDB>('workout-tracker-v2', 1, {
    upgrade(db) {
      db.createObjectStore('templates', { keyPath: 'id' })

      const exerciseStore = db.createObjectStore('exercises', { keyPath: 'id' })
      exerciseStore.createIndex('by-template', 'templateId')

      const sessionStore = db.createObjectStore('sessions', { keyPath: 'id' })
      sessionStore.createIndex('by-template', 'templateId')
      sessionStore.createIndex('by-startedAt', 'startedAt')

      const logStore = db.createObjectStore('exerciseLogs', { keyPath: 'id' })
      logStore.createIndex('by-session', 'sessionId')
      logStore.createIndex('by-exercise', 'exerciseId')

      db.createObjectStore('meta', { keyPath: 'key' })
    },
  })

  return dbInstance
}

export async function clearAllData(): Promise<void> {
  const db = await getDB()
  const tx = db.transaction(['templates', 'exercises', 'sessions', 'exerciseLogs', 'meta'], 'readwrite')
  await Promise.all([
    tx.objectStore('templates').clear(),
    tx.objectStore('exercises').clear(),
    tx.objectStore('sessions').clear(),
    tx.objectStore('exerciseLogs').clear(),
    tx.objectStore('meta').clear(),
    tx.done,
  ])
}

export type { WorkoutTrackerDB }
