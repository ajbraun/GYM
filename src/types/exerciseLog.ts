export interface SetLog {
  setNumber: number
  targetReps: string // e.g. "8-10" or "failure"
  actualReps: number | null
  weight: number | null
  completed: boolean
  completedAt: string | null
}

export interface ExerciseLog {
  id: string // sessionId-exerciseId
  sessionId: string
  exerciseId: string
  completed: boolean
  weightUsed: number | null // kept for backwards compat + summary
  goUp: boolean
  completedAt: string | null
  sets: SetLog[]
}
