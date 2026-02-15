import { getAllSessions } from './sessionService'
import { getAllTemplates } from './templateService'
import { getLogsForSession } from './exerciseLogService'
import { getExercisesForTemplate } from './exerciseService'
import type { WorkoutTemplate } from '../types/template'

export async function exportToCsv(): Promise<void> {
  const [sessions, templates] = await Promise.all([getAllSessions(), getAllTemplates()])
  const templateMap = new Map<string, WorkoutTemplate>(templates.map((t) => [t.id, t]))

  const rows: string[] = ['Date,Workout,Exercise,Set,Weight (lbs),Reps,Completed']

  for (const session of sessions) {
    const template = templateMap.get(session.templateId)
    const exercises = await getExercisesForTemplate(session.templateId)
    const logs = await getLogsForSession(session.id)
    const logMap = new Map(logs.map((l) => [l.exerciseId, l]))
    const date = new Date(session.startedAt).toLocaleDateString('en-US')

    for (const ex of exercises) {
      const log = logMap.get(ex.id)
      if (!log) continue

      if (log.sets && log.sets.length > 0) {
        for (const set of log.sets) {
          rows.push([
            date,
            csvEscape(template?.name ?? 'Unknown'),
            csvEscape(ex.name),
            set.setNumber,
            set.weight ?? '',
            set.actualReps ?? '',
            set.completed ? 'Yes' : 'No',
          ].join(','))
        }
      } else {
        rows.push([
          date,
          csvEscape(template?.name ?? 'Unknown'),
          csvEscape(ex.name),
          '',
          log.weightUsed ?? '',
          '',
          log.completed ? 'Yes' : 'No',
        ].join(','))
      }
    }
  }

  const csv = rows.join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = `compound-workouts-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

function csvEscape(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}
