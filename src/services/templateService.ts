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

const EMOJI_OPTIONS = ['💪', '🦵', '⚡', '🔥', '❤️', '🏋️', '🎯', '💥', '✨', '🧘']

export async function addTemplate(name: string, emoji?: string): Promise<WorkoutTemplate> {
  const db = await getDB()
  const all = await db.getAll('templates')
  const maxSort = all.reduce((max, t) => Math.max(max, t.sortOrder), -1)
  const now = new Date().toISOString()

  const template: WorkoutTemplate = {
    id: `tpl-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
    name,
    emoji: emoji ?? EMOJI_OPTIONS[all.length % EMOJI_OPTIONS.length],
    sortOrder: maxSort + 1,
    createdAt: now,
    updatedAt: now,
  }
  await db.put('templates', template)
  return template
}

export async function deleteTemplate(id: string): Promise<void> {
  const db = await getDB()
  await db.delete('templates', id)
}
