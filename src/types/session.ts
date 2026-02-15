export interface WorkoutSession {
  id: string
  templateId: string
  startedAt: string
  completedAt: string | null
  notes: string
}
