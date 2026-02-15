import type { TemplateWithMeta } from '../../hooks/useTemplates'

interface TemplateCardProps {
  template: TemplateWithMeta
  onSelect: (templateId: string) => void
  onDelete: (id: string) => void
}

export function TemplateCard({ template, onSelect, onDelete }: TemplateCardProps) {
  const staleness =
    template.daysSinceLastDone === null
      ? 'Never done'
      : template.daysSinceLastDone === 0
        ? 'Done today'
        : template.daysSinceLastDone === 1
          ? 'Done yesterday'
          : `${template.daysSinceLastDone}d ago`

  return (
    <button
      onClick={() => onSelect(template.id)}
      className="w-full bg-surface-card rounded-2xl p-5 text-left transition-all active:scale-[0.98] active:bg-surface-hover"
    >
      <div className="flex items-center gap-4">
        <div className="text-4xl">{template.emoji}</div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg text-white font-bold truncate">{template.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-gray-400">{staleness}</span>
            <span className="text-gray-600">·</span>
            <span className="text-sm text-gray-500">{template.exerciseCount} exercise{template.exerciseCount !== 1 ? 's' : ''}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <div
            role="button"
            onClick={(e) => { e.stopPropagation(); onDelete(template.id) }}
            className="text-gray-700 hover:text-red-400 transition-colors p-1.5"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </button>
  )
}
