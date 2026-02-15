import { useState } from 'react'
import { TemplateCard } from '../components/templates/TemplateCard'
import type { TemplateWithMeta } from '../hooks/useTemplates'

interface HomeScreenProps {
  templates: TemplateWithMeta[]
  onSelect: (templateId: string) => void
  onAdd: (name: string) => void
  onDelete: (id: string) => void
}

export function HomeScreen({ templates, onSelect, onAdd, onDelete }: HomeScreenProps) {
  const [adding, setAdding] = useState(false)
  const [newName, setNewName] = useState('')

  const handleAdd = () => {
    if (!newName.trim()) return
    onAdd(newName.trim())
    setNewName('')
    setAdding(false)
  }

  return (
    <div className="px-4 py-4 space-y-4">
      {templates.map((t) => (
        <TemplateCard
          key={t.id}
          template={t}
          onSelect={onSelect}
          onDelete={onDelete}
        />
      ))}

      {adding ? (
        <div className="bg-surface-card rounded-2xl p-5">
          <input
            autoFocus
            placeholder="Workout name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAdd()
              if (e.key === 'Escape') { setNewName(''); setAdding(false) }
            }}
            className="text-lg text-white font-bold bg-transparent border-b border-accent outline-none w-full mb-4 placeholder:text-gray-600"
          />
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              disabled={!newName.trim()}
              className="bg-accent hover:bg-accent-dark disabled:opacity-40 text-white font-semibold px-5 py-2 rounded-xl text-sm transition-colors"
            >
              Add
            </button>
            <button
              onClick={() => { setNewName(''); setAdding(false) }}
              className="text-gray-400 hover:text-white px-4 py-2 text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="w-full border-2 border-dashed border-gray-800 rounded-2xl p-5 text-gray-500 hover:text-accent hover:border-accent/30 transition-colors text-sm font-medium"
        >
          + Add Workout
        </button>
      )}
    </div>
  )
}
