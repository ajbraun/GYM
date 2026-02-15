import { getDB } from './db'
import type { WorkoutTemplate } from '../types/template'
import type { Exercise } from '../types/exercise'

const now = new Date().toISOString()

const defaultTemplates: WorkoutTemplate[] = [
  { id: 'tpl-leg', name: 'Leg Day', emoji: '🦵', sortOrder: 0, createdAt: now, updatedAt: now },
  { id: 'tpl-upper', name: 'Upper Body', emoji: '💪', sortOrder: 1, createdAt: now, updatedAt: now },
  { id: 'tpl-full', name: 'Full Body', emoji: '⚡', sortOrder: 2, createdAt: now, updatedAt: now },
  { id: 'tpl-recovery', name: 'Active Recovery', emoji: '❤️', sortOrder: 3, createdAt: now, updatedAt: now },
]

const defaultExercises: Exercise[] = [
  // Leg Day
  { id: 'ex-1', templateId: 'tpl-leg', name: 'Goblet Squats', setsReps: '3 × 8-10', isWeighted: true, active: true, sortOrder: 0, createdAt: now },
  { id: 'ex-2', templateId: 'tpl-leg', name: 'Romanian Deadlifts', setsReps: '3 × 10-12', isWeighted: true, active: true, sortOrder: 1, createdAt: now },
  { id: 'ex-3', templateId: 'tpl-leg', name: 'Walking Lunges', setsReps: '3 × 10/leg', isWeighted: true, active: true, sortOrder: 2, createdAt: now },
  { id: 'ex-4', templateId: 'tpl-leg', name: 'Glute Bridges', setsReps: '3 × 15', isWeighted: true, active: true, sortOrder: 3, createdAt: now },

  // Upper Body
  { id: 'ex-5', templateId: 'tpl-upper', name: 'DB Overhead Press', setsReps: '3 × 8-10', isWeighted: true, active: true, sortOrder: 0, createdAt: now },
  { id: 'ex-6', templateId: 'tpl-upper', name: 'Bent Over Rows', setsReps: '3 × 10-12', isWeighted: true, active: true, sortOrder: 1, createdAt: now },
  { id: 'ex-7', templateId: 'tpl-upper', name: 'Push-Ups', setsReps: '3 × failure', isWeighted: true, active: true, sortOrder: 2, createdAt: now },
  { id: 'ex-8', templateId: 'tpl-upper', name: 'Lat Pulldowns', setsReps: '3 × 10-12', isWeighted: true, active: true, sortOrder: 3, createdAt: now },

  // Full Body
  { id: 'ex-9', templateId: 'tpl-full', name: 'Deadlifts', setsReps: '3 × 5-8', isWeighted: true, active: true, sortOrder: 0, createdAt: now },
  { id: 'ex-10', templateId: 'tpl-full', name: 'Bench Press', setsReps: '3 × 8-10', isWeighted: true, active: true, sortOrder: 1, createdAt: now },
  { id: 'ex-11', templateId: 'tpl-full', name: 'Bulgarian Split Squats', setsReps: '3 × 8-10/leg', isWeighted: true, active: true, sortOrder: 2, createdAt: now },
  { id: 'ex-12', templateId: 'tpl-full', name: 'Plank Rows', setsReps: '3 × 10/arm', isWeighted: true, active: true, sortOrder: 3, createdAt: now },

  // Active Recovery
  { id: 'ex-13', templateId: 'tpl-recovery', name: 'Light Cardio', setsReps: '1 × 20-30 min', isWeighted: false, active: true, sortOrder: 0, createdAt: now },
  { id: 'ex-14', templateId: 'tpl-recovery', name: 'Mobility Work', setsReps: '1 × 15 min', isWeighted: false, active: true, sortOrder: 1, createdAt: now },
  { id: 'ex-15', templateId: 'tpl-recovery', name: 'Yoga/Stretching', setsReps: '1 × 15 min', isWeighted: false, active: true, sortOrder: 2, createdAt: now },
]

export async function seedIfEmpty(): Promise<void> {
  const db = await getDB()
  const existingTemplates = await db.count('templates')
  if (existingTemplates > 0) return

  const tx = db.transaction(['templates', 'exercises'], 'readwrite')
  for (const template of defaultTemplates) {
    await tx.objectStore('templates').put(template)
  }
  for (const exercise of defaultExercises) {
    await tx.objectStore('exercises').put(exercise)
  }
  await tx.done
}
