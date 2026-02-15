interface GoUpReminderProps {
  suggestedWeight: number
}

export function GoUpReminder({ suggestedWeight }: GoUpReminderProps) {
  return (
    <div className="flex items-center gap-1 text-accent text-[11px] font-medium">
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
      </svg>
      Go up! Try {suggestedWeight} lbs
    </div>
  )
}
