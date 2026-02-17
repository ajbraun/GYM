import type { TemplateWithMeta } from '../../hooks/useTemplates'
import { getTemplateImage } from '../../utils/templateImages'

interface TemplateCardProps {
  template: TemplateWithMeta
  isActive: boolean
  onSelect: (templateId: string) => void
  onDelete: (id: string) => void
}

const GRADIENTS: Record<string, string> = {
  '💪': 'from-orange-900/80 to-amber-800/60',
  '🦵': 'from-emerald-900/80 to-teal-800/60',
  '⚡': 'from-yellow-900/80 to-amber-700/60',
  '🔥': 'from-red-900/80 to-orange-800/60',
  '❤️': 'from-rose-900/80 to-pink-800/60',
  '🏋️': 'from-slate-800/80 to-zinc-700/60',
  '🎯': 'from-indigo-900/80 to-blue-800/60',
  '💥': 'from-amber-900/80 to-red-800/60',
  '✨': 'from-purple-900/80 to-violet-800/60',
  '🧘': 'from-cyan-900/80 to-teal-700/60',
}

export function TemplateCard({ template, isActive, onSelect, onDelete }: TemplateCardProps) {
  const staleness =
    template.daysSinceLastDone === null
      ? 'Never done'
      : template.daysSinceLastDone === 0
        ? 'Done today'
        : template.daysSinceLastDone === 1
          ? 'Done yesterday'
          : `${template.daysSinceLastDone}d ago`

  const gradient = GRADIENTS[template.emoji] ?? 'from-gray-800/80 to-gray-700/60'
  const image = getTemplateImage(template.name)

  return (
    <button
      onClick={() => onSelect(template.id)}
      className={`relative w-full aspect-[3/4] rounded-2xl overflow-hidden text-left transition-all active:scale-[0.97] ${
        isActive ? 'ring-2 ring-accent ring-offset-2 ring-offset-[#0f1420]' : ''
      }`}
    >
      {/* Background: image or gradient */}
      {image ? (
        <img src={image} alt={template.name} className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <>
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.08)_0%,transparent_60%)]" />
          <div className="absolute inset-0 flex items-center justify-center pb-10">
            <span className="text-7xl drop-shadow-lg select-none">{template.emoji}</span>
          </div>
        </>
      )}

      {/* Delete button */}
      {!isActive && (
        <div
          role="button"
          onClick={(e) => { e.stopPropagation(); onDelete(template.id) }}
          className="absolute top-3 right-3 z-10 text-white/40 hover:text-red-400 transition-colors p-1.5 bg-black/20 rounded-full"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      )}

      {/* Bottom overlay with name + meta */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent pt-10 pb-5 px-5">
        <h3 className="text-white font-bold text-base leading-tight truncate drop-shadow-sm">
          {template.name}
        </h3>
        <p className="text-white/60 text-xs mt-0.5">
          {isActive ? (
            <span className="text-accent font-medium">In Progress</span>
          ) : (
            <>
              {staleness} · {template.exerciseCount} exercise{template.exerciseCount !== 1 ? 's' : ''}
            </>
          )}
        </p>
      </div>
    </button>
  )
}
