import { getDB } from './db'
import type { Exercise } from '../types/exercise'

function isActive(ex: Exercise): boolean {
  return ex.active !== false // handles old records without the field
}

export async function getExercisesForTemplate(templateId: string): Promise<Exercise[]> {
  const db = await getDB()
  const exercises = await db.getAllFromIndex('exercises', 'by-template', templateId)
  return exercises.filter(isActive).sort((a, b) => a.sortOrder - b.sortOrder)
}

export async function getAllExercisesForTemplate(templateId: string): Promise<Exercise[]> {
  const db = await getDB()
  const exercises = await db.getAllFromIndex('exercises', 'by-template', templateId)
  return exercises.map((ex) => ({ ...ex, active: isActive(ex) })).sort((a, b) => a.sortOrder - b.sortOrder)
}

export async function getExercise(id: string): Promise<Exercise | undefined> {
  const db = await getDB()
  return db.get('exercises', id)
}

export async function updateExercise(exercise: Exercise): Promise<void> {
  const db = await getDB()
  await db.put('exercises', exercise)
}

export async function addExercise(
  templateId: string,
  name: string,
  setsReps: string,
  isWeighted: boolean
): Promise<Exercise> {
  const db = await getDB()
  const existing = await db.getAllFromIndex('exercises', 'by-template', templateId)
  const maxSort = existing.reduce((max, ex) => Math.max(max, ex.sortOrder), -1)

  const exercise: Exercise = {
    id: `ex-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
    templateId,
    name,
    setsReps,
    isWeighted,
    sortOrder: maxSort + 1,
    active: true,
    createdAt: new Date().toISOString(),
  }
  await db.put('exercises', exercise)
  return exercise
}
