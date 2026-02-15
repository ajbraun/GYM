import { getDB } from './db'
import type { Exercise } from '../types/exercise'

export async function getExercisesForTemplate(templateId: string): Promise<Exercise[]> {
  const db = await getDB()
  const exercises = await db.getAllFromIndex('exercises', 'by-template', templateId)
  return exercises.sort((a, b) => a.sortOrder - b.sortOrder)
}

export async function getExercise(id: string): Promise<Exercise | undefined> {
  const db = await getDB()
  return db.get('exercises', id)
}
