export interface ExerciseLog {
  id: string // sessionId-exerciseId
  sessionId: string
  exerciseId: string
  completed: boolean
  weightUsed: number | null
  goUp: boolean
  completedAt: string | null
}
