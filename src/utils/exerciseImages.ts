const EXERCISE_IMAGES: Record<string, string> = {
  'goblet squat': '/images/exercises/goblet-squat.png',
  'goblet squats': '/images/exercises/goblet-squat.png',
  'romanian deadlift': '/images/exercises/romanian-deadlift.png',
  'romanian deadlifts': '/images/exercises/romanian-deadlift.png',
  'walking lunges': '/images/exercises/walking-lunges.png',
  'walking lunge': '/images/exercises/walking-lunges.png',
  'glute bridge': '/images/exercises/glute-bridge.png',
  'glute bridges': '/images/exercises/glute-bridge.png',
}

export function getExerciseImage(name: string): string | null {
  return EXERCISE_IMAGES[name.toLowerCase().trim()] ?? null
}
