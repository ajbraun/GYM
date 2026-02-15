import { useState } from 'react'
import type { TemplateWithMeta } from '../../hooks/useTemplates'

interface TemplateCardProps {
  template: TemplateWithMeta
  onSelect: (templateId: string) => void
  onRename: (id: string, name: string) => void
  onDelete: (id: string) => void
}

export function TemplateCard({ template, onSelect, onRename, onDelete }: TemplateCardProps) {
  const staleness =
    template.daysSinceLastDone === null
      ? 'Never done'
      : template.daysSinceLastDone === 0
        ? 'Done today'
        : template.daysSinceLastDone === 1
          ? 'Done yesterday'
          : `${template.daysSinceLastDone} days ago`

  return (
    <div className="bg-surface-card rounded-2xl p-5 active:scale-[0.98] transition-all">
      <div className="flex items-start gap-4">
        <button
          onClick={() => onSelect(template.id)}
          className="flex items-start gap-4 flex-1 min-w-0 text-left"
        >
          <div className="text-4xl">{template.emoji}</div>
          <div className="flex-1 min-w-0">
            <TemplateName name={template.name} id={template.id} onRename={onRename} />
            <div className="text-sm text-gray-400 mt-0.5">{staleness}</div>
            <div className="text-xs text-gray-500 mt-1">
              {template.exerciseCount} exercise{template.exerciseCount !== 1 ? 's' : ''}
            </div>
          </div>
        </button>
        <button
          onClick={() => onDelete(template.id)}
          className="text-gray-700 hover:text-red-400 transition-colors p-1 -mt-1 -mr-1"
          title="Delete workout"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
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
          if (e.key === 'Escape') { setValue(name); setEditing(false) }
        }}
        onClick={(e) => e.stopPropagation()}
        className="text-lg text-white font-bold bg-transparent border-b border-accent outline-none w-full"
      />
    )
  }

  return (
    <h3
      onClick={(e) => { e.stopPropagation(); setEditing(true) }}
      className="text-lg text-white font-bold truncate cursor-pointer hover:text-accent-light transition-colors"
    >
      {name}
    </h3>
  )
}
