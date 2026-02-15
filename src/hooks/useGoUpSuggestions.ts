import type { ExerciseLog } from '../types/exerciseLog'

const WEIGHT_INCREMENT = 5

export interface GoUpSuggestion {
  previousWeight: number
  suggestedWeight: number
}

export function getGoUpSuggestions(previousLogs: Map<string, ExerciseLog>): Map<string, GoUpSuggestion> {
  const suggestions = new Map<string, GoUpSuggestion>()

  for (const [exerciseId, log] of previousLogs) {
    if (log.goUp) {
      const prev = log.weightUsed ?? 0
      suggestions.set(exerciseId, {
        previousWeight: prev,
        suggestedWeight: prev + WEIGHT_INCREMENT,
      })
    }
  }

  return suggestions
}
