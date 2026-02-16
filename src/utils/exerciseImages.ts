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
  'push up': '/images/exercises/push-up.png',
  'push ups': '/images/exercises/push-up.png',
  'push-up': '/images/exercises/push-up.png',
  'push-ups': '/images/exercises/push-up.png',
  'pushup': '/images/exercises/push-up.png',
  'pushups': '/images/exercises/push-up.png',
  'bentover arm rows': '/images/exercises/bentover-rows.png',
  'bent over arm rows': '/images/exercises/bentover-rows.png',
  'bentover rows': '/images/exercises/bentover-rows.png',
  'bent over rows': '/images/exercises/bentover-rows.png',
}

export function getExerciseImage(name: string): string | null {
  return EXERCISE_IMAGES[name.toLowerCase().trim()] ?? null
}
