import { getDB } from './db'
import type { WorkoutTemplate } from '../types/template'

export async function getAllTemplates(): Promise<WorkoutTemplate[]> {
  const db = await getDB()
  const templates = await db.getAll('templates')
  return templates.sort((a, b) => a.sortOrder - b.sortOrder)
}

export async function getTemplate(id: string): Promise<WorkoutTemplate | undefined> {
  const db = await getDB()
  return db.get('templates', id)
}

export async function updateTemplateName(id: string, name: string): Promise<void> {
  const db = await getDB()
  const template = await db.get('templates', id)
  if (!template) return
  await db.put('templates', { ...template, name, updatedAt: new Date().toISOString() })
}
