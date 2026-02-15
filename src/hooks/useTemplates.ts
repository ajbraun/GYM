import { useState, useEffect, useCallback } from 'react'
import type { WorkoutTemplate } from '../types/template'
import { getAllTemplates, updateTemplateName } from '../services/templateService'
import { getLastCompletedSession } from '../services/sessionService'
import { getExercisesForTemplate } from '../services/exerciseService'
import { seedIfEmpty } from '../services/seed'

export interface TemplateWithMeta extends WorkoutTemplate {
  lastDoneAt: string | null
  daysSinceLastDone: number | null
  exerciseCount: number
}

export function useTemplates() {
  const [templates, setTemplates] = useState<TemplateWithMeta[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    await seedIfEmpty()
    const all = await getAllTemplates()

    const withMeta: TemplateWithMeta[] = await Promise.all(
      all.map(async (t) => {
        const lastSession = await getLastCompletedSession(t.id)
        const exercises = await getExercisesForTemplate(t.id)
        const lastDoneAt = lastSession?.completedAt ?? null
        const daysSinceLastDone = lastDoneAt
          ? Math.floor((Date.now() - new Date(lastDoneAt).getTime()) / (1000 * 60 * 60 * 24))
          : null

        return { ...t, lastDoneAt, daysSinceLastDone, exerciseCount: exercises.length }
      })
    )

    // Sort by staleness: never-done first, then longest since last done
    withMeta.sort((a, b) => {
      if (a.daysSinceLastDone === null && b.daysSinceLastDone === null) return a.sortOrder - b.sortOrder
      if (a.daysSinceLastDone === null) return -1
      if (b.daysSinceLastDone === null) return 1
      return b.daysSinceLastDone - a.daysSinceLastDone
    })

    setTemplates(withMeta)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const rename = useCallback(async (id: string, name: string) => {
    await updateTemplateName(id, name)
    await load()
  }, [load])

  return { templates, loading, reload: load, rename }
}
