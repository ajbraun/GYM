const EXERCISE_IMAGES: Record<string, string> = {
  'goblet squat': '/images/exercises/goblet-squat.png',
  'goblet squats': '/images/exercises/goblet-squat.png',
}

export function getExerciseImage(name: string): string | null {
  return EXERCISE_IMAGES[name.toLowerCase().trim()] ?? null
}
