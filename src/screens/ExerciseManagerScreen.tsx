import { useState, useEffect, useCallback } from 'react'
import type { Exercise } from '../types/exercise'
import type { WorkoutTemplate } from '../types/template'
import { getAllExercisesForTemplate, updateExercise, addExercise } from '../services/exerciseService'
import { getTemplate } from '../services/templateService'

interface ExerciseManagerScreenProps {
  templateId: string
  onBack: () => void
}

export function ExerciseManagerScreen({ templateId, onBack }: ExerciseManagerScreenProps) {
  const [template, setTemplate] = useState<WorkoutTemplate | null>(null)
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [adding, setAdding] = useState(false)

  const load = useCallback(async () => {
    const [tpl, exs] = await Promise.all([
      getTemplate(templateId),
      getAllExercisesForTemplate(templateId),
    ])
    if (tpl) setTemplate(tpl)
    setExercises(exs)
  }, [templateId])

  useEffect(() => { load() }, [load])

  const activeExercises = exercises.filter((e) => e.active)
  const inactiveExercises = exercises.filter((e) => !e.active)

  const handleToggleActive = async (exercise: Exercise) => {
    await updateExercise({ ...exercise, active: !exercise.active })
    await load()
  }

  const handleUpdateName = async (exercise: Exercise, name: string) => {
    if (name.trim() && name.trim() !== exercise.name) {
      await updateExercise({ ...exercise, name: name.trim() })
      await load()
    }
  }

  const handleUpdateSetsReps = async (exercise: Exercise, setsReps: string) => {
    if (setsReps.trim() && setsReps.trim() !== exercise.setsReps) {
      await updateExercise({ ...exercise, setsReps: setsReps.trim() })
      await load()
    }
  }

  const handleToggleWeighted = async (exercise: Exercise) => {
    await updateExercise({ ...exercise, isWeighted: !exercise.isWeighted })
    await load()
  }

  const handleMoveUp = async (exercise: Exercise) => {
    const list = activeExercises
    const idx = list.findIndex((e) => e.id === exercise.id)
    if (idx <= 0) return
    const prev = list[idx - 1]
    await Promise.all([
      updateExercise({ ...exercise, sortOrder: prev.sortOrder }),
      updateExercise({ ...prev, sortOrder: exercise.sortOrder }),
    ])
    await load()
  }

  const handleMoveDown = async (exercise: Exercise) => {
    const list = activeExercises
    const idx = list.findIndex((e) => e.id === exercise.id)
    if (idx < 0 || idx >= list.length - 1) return
    const next = list[idx + 1]
    await Promise.all([
      updateExercise({ ...exercise, sortOrder: next.sortOrder }),
      updateExercise({ ...next, sortOrder: exercise.sortOrder }),
    ])
    await load()
  }

  const handleAdd = async (name: string, setsReps: string, isWeighted: boolean) => {
    await addExercise(templateId, name, setsReps, isWeighted)
    setAdding(false)
    await load()
  }

  if (!template) {
    return (
      <div className="min-h-dvh bg-gray-950 flex items-center justify-center">
        <div className="text-accent animate-pulse">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-gray-950">
      <header className="sticky top-0 z-10 bg-gray-950/95 backdrop-blur-sm border-b border-gray-800/50 pt-safe">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={onBack} className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xl">{template.emoji}</span>
            <h1 className="text-base font-bold text-white truncate">{template.name}</h1>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-4 pb-24">
        {/* Active exercises */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Active</h2>
          <button
            onClick={() => setAdding(true)}
            className="text-accent text-sm font-medium hover:text-accent-light transition-colors"
          >
            + Add
          </button>
        </div>

        {adding && (
          <AddExerciseForm
            onSave={handleAdd}
            onCancel={() => setAdding(false)}
          />
        )}

        <div className="space-y-2 mb-8">
          {activeExercises.map((ex, idx) => (
            <ExerciseEditorRow
              key={ex.id}
              exercise={ex}
              canMoveUp={idx > 0}
              canMoveDown={idx < activeExercises.length - 1}
              onUpdateName={(name) => handleUpdateName(ex, name)}
              onUpdateSetsReps={(sr) => handleUpdateSetsReps(ex, sr)}
              onToggleWeighted={() => handleToggleWeighted(ex)}
              onToggleActive={() => handleToggleActive(ex)}
              onMoveUp={() => handleMoveUp(ex)}
              onMoveDown={() => handleMoveDown(ex)}
            />
          ))}
          {activeExercises.length === 0 && !adding && (
            <p className="text-gray-500 text-sm py-4 text-center">No active exercises</p>
          )}
        </div>

        {/* Inactive exercises */}
        {inactiveExercises.length > 0 && (
          <>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Inactive</h2>
            <div className="space-y-2">
              {inactiveExercises.map((ex) => (
                <div
                  key={ex.id}
                  className="bg-surface-card/50 rounded-lg p-3 flex items-center gap-3 opacity-60"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-400">{ex.name}</div>
                    <div className="text-xs text-gray-600">{ex.setsReps}</div>
                  </div>
                  <button
                    onClick={() => handleToggleActive(ex)}
                    className="text-xs text-accent font-medium hover:text-accent-light transition-colors px-2 py-1"
                  >
                    Restore
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}

function ExerciseEditorRow({
  exercise,
  canMoveUp,
  canMoveDown,
  onUpdateName,
  onUpdateSetsReps,
  onToggleWeighted,
  onToggleActive,
  onMoveUp,
  onMoveDown,
}: {
  exercise: Exercise
  canMoveUp: boolean
  canMoveDown: boolean
  onUpdateName: (name: string) => void
  onUpdateSetsReps: (setsReps: string) => void
  onToggleWeighted: () => void
  onToggleActive: () => void
  onMoveUp: () => void
  onMoveDown: () => void
}) {
  const [editingName, setEditingName] = useState(false)
  const [editingSets, setEditingSets] = useState(false)
  const [nameValue, setNameValue] = useState(exercise.name)
  const [setsValue, setSetsValue] = useState(exercise.setsReps)

  return (
    <div className="bg-surface-card rounded-lg p-3">
      <div className="flex items-start gap-2">
        {/* Reorder buttons */}
        <div className="flex flex-col gap-0.5 pt-0.5 flex-shrink-0">
          <button
            onClick={onMoveUp}
            disabled={!canMoveUp}
            className={`w-5 h-5 flex items-center justify-center rounded ${
              canMoveUp ? 'text-gray-400 hover:text-white' : 'text-gray-700'
            }`}
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>
          </button>
          <button
            onClick={onMoveDown}
            disabled={!canMoveDown}
            className={`w-5 h-5 flex items-center justify-center rounded ${
              canMoveDown ? 'text-gray-400 hover:text-white' : 'text-gray-700'
            }`}
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Name + sets/reps */}
        <div className="flex-1 min-w-0">
          {editingName ? (
            <input
              autoFocus
              value={nameValue}
              onChange={(e) => setNameValue(e.target.value)}
              onBlur={() => { onUpdateName(nameValue); setEditingName(false) }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') { onUpdateName(nameValue); setEditingName(false) }
                if (e.key === 'Escape') { setNameValue(exercise.name); setEditingName(false) }
              }}
              className="text-sm text-white font-medium bg-transparent border-b border-accent outline-none w-full"
            />
          ) : (
            <div
              onClick={() => setEditingName(true)}
              className="text-sm text-white font-medium cursor-pointer hover:text-accent-light transition-colors truncate"
            >
              {exercise.name}
            </div>
          )}

          <div className="flex items-center gap-2 mt-1">
            {editingSets ? (
              <input
                autoFocus
                value={setsValue}
                onChange={(e) => setSetsValue(e.target.value)}
                onBlur={() => { onUpdateSetsReps(setsValue); setEditingSets(false) }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') { onUpdateSetsReps(setsValue); setEditingSets(false) }
                  if (e.key === 'Escape') { setSetsValue(exercise.setsReps); setEditingSets(false) }
                }}
                className="text-xs text-gray-400 bg-transparent border-b border-gray-600 outline-none w-24"
              />
            ) : (
              <span
                onClick={() => setEditingSets(true)}
                className="text-xs text-gray-500 cursor-pointer hover:text-gray-300 transition-colors"
              >
                {exercise.setsReps}
              </span>
            )}

            <button
              onClick={onToggleWeighted}
              className={`text-[10px] px-1.5 py-0.5 rounded transition-colors ${
                exercise.isWeighted
                  ? 'bg-accent/20 text-accent'
                  : 'bg-gray-800 text-gray-500'
              }`}
            >
              {exercise.isWeighted ? 'Weighted' : 'No weight'}
            </button>
          </div>
        </div>

        {/* Remove button */}
        <button
          onClick={onToggleActive}
          className="text-gray-600 hover:text-red-400 transition-colors flex-shrink-0 p-1"
          title="Remove from workout"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}

function AddExerciseForm({
  onSave,
  onCancel,
}: {
  onSave: (name: string, setsReps: string, isWeighted: boolean) => void
  onCancel: () => void
}) {
  const [name, setName] = useState('')
  const [setsReps, setSetsReps] = useState('3 × 10')
  const [isWeighted, setIsWeighted] = useState(true)

  const handleSubmit = () => {
    if (!name.trim()) return
    onSave(name.trim(), setsReps.trim() || '3 × 10', isWeighted)
  }

  return (
    <div className="bg-surface-card rounded-lg p-3 mb-3 border border-accent/30">
      <input
        autoFocus
        placeholder="Exercise name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit() }}
        className="text-sm text-white bg-transparent border-b border-gray-600 outline-none w-full mb-2 focus:border-accent placeholder:text-gray-600"
      />
      <div className="flex items-center gap-2 mb-3">
        <input
          placeholder="3 × 10"
          value={setsReps}
          onChange={(e) => setSetsReps(e.target.value)}
          className="text-xs text-gray-400 bg-transparent border-b border-gray-700 outline-none w-24 focus:border-accent placeholder:text-gray-700"
        />
        <button
          onClick={() => setIsWeighted(!isWeighted)}
          className={`text-[10px] px-1.5 py-0.5 rounded transition-colors ${
            isWeighted ? 'bg-accent/20 text-accent' : 'bg-gray-800 text-gray-500'
          }`}
        >
          {isWeighted ? 'Weighted' : 'No weight'}
        </button>
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          disabled={!name.trim()}
          className="text-xs bg-accent hover:bg-accent-dark disabled:opacity-40 text-white font-medium px-3 py-1.5 rounded-md transition-colors"
        >
          Add
        </button>
        <button
          onClick={onCancel}
          className="text-xs text-gray-400 hover:text-white px-3 py-1.5 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
