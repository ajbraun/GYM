import { TemplateCard } from '../components/templates/TemplateCard'
import type { TemplateWithMeta } from '../hooks/useTemplates'

interface HomeScreenProps {
  templates: TemplateWithMeta[]
  onStart: (templateId: string) => void
  onEdit: (templateId: string) => void
  onRename: (id: string, name: string) => void
}

export function HomeScreen({ templates, onStart, onEdit, onRename }: HomeScreenProps) {
  return (
    <div className="px-4 py-4 space-y-3">
      {templates.map((t) => (
        <TemplateCard key={t.id} template={t} onStart={onStart} onEdit={onEdit} onRename={onRename} />
      ))}
      {templates.length === 0 && (
        <div className="text-center text-gray-500 py-12">No workouts yet</div>
      )}
    </div>
  )
}
