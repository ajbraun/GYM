const EXERCISE_IMAGES: Record<string, string> = {
  'goblet squat': '/images/exercises/goblet-squat.png',
  'goblet squats': '/images/exercises/goblet-squat.png',
  'romanian deadlift': '/images/exercises/romanian-deadlift.png',
  'romanian deadlifts': '/images/exercises/romanian-deadlift.png',
  'walking lunges': '/images/exercises/walking-lunges.png',
  'walking lunge': '/images/exercises/walking-lunges.png',
  'glute bridge': '/images/exercises/glute-bridge.png',
  'glute bridges': '/images/exercises/glute-bridge.png',
  'seated calf raise': '/images/exercises/seated-calf-raise.png',
  'seated calf raises': '/images/exercises/seated-calf-raise.png',
  'db overhead press': '/images/exercises/db-overhead-press.png',
  'lat pulldown': '/images/exercises/lat-pulldown.png',
  'lat pulldowns': '/images/exercises/lat-pulldown.png',
}

export function getExerciseImage(name: string): string | null {
  return EXERCISE_IMAGES[name.toLowerCase().trim()] ?? null
}
