import { useState, useEffect } from 'react'
import type { Exercise } from '../types/exercise'
import { getExercisesForTemplate } from '../services/exerciseService'

export function useExercises(templateId: string | null) {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!templateId) {
      setExercises([])
      return
    }
    setLoading(true)
    getExercisesForTemplate(templateId).then((exs) => {
      setExercises(exs)
      setLoading(false)
    })
  }, [templateId])

  return { exercises, loading }
}
