import { useState } from 'react'
import type { TemplateWithMeta } from '../../hooks/useTemplates'

interface TemplateCardProps {
  template: TemplateWithMeta
  onStart: (templateId: string) => void
  onEdit: (templateId: string) => void
  onRename: (id: string, name: string) => void
}

export function TemplateCard({ template, onStart, onEdit, onRename }: TemplateCardProps) {
  const staleness =
    template.daysSinceLastDone === null
      ? 'Never done'
      : template.daysSinceLastDone === 0
        ? 'Done today'
        : template.daysSinceLastDone === 1
          ? 'Done yesterday'
          : `${template.daysSinceLastDone} days ago`

  return (
    <div className="bg-surface-card rounded-xl p-4 flex items-center gap-4">
      <div className="text-3xl flex-shrink-0">{template.emoji}</div>

      <div className="flex-1 min-w-0">
        <TemplateName name={template.name} id={template.id} onRename={onRename} />
        <div className="flex items-center gap-3 mt-1">
          <span className="text-xs text-gray-400">{staleness}</span>
          <button
            onClick={() => onEdit(template.id)}
            className="text-xs text-gray-500 hover:text-accent transition-colors"
          >
            {template.exerciseCount} exercise{template.exerciseCount !== 1 ? 's' : ''} &middot; Edit
          </button>
        </div>
      </div>

      <button
        onClick={() => onStart(template.id)}
        className="bg-accent hover:bg-accent-dark text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors flex-shrink-0"
      >
        Start
      </button>
    </div>
  )
}

function TemplateName({
  name,
  id,
  onRename,
}: {
  name: string
  id: string
  onRename: (id: string, name: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(name)

  const save = () => {
    const trimmed = value.trim()
    if (trimmed && trimmed !== name) {
      onRename(id, trimmed)
    } else {
      setValue(name)
    }
    setEditing(false)
  }

  if (editing) {
    return (
      <input
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={save}
        onKeyDown={(e) => {
          if (e.key === 'Enter') save()
          if (e.key === 'Escape') {
            setValue(name)
            setEditing(false)
          }
        }}
        className="text-white font-semibold bg-transparent border-b border-accent outline-none w-full"
      />
    )
  }

  return (
    <h3
      onClick={() => setEditing(true)}
      className="text-white font-semibold truncate cursor-pointer hover:text-accent-light transition-colors"
    >
      {name}
    </h3>
  )
}
