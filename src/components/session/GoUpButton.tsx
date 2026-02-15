interface GoUpButtonProps {
  active: boolean
  onToggle: () => void
}

export function GoUpButton({ active, onToggle }: GoUpButtonProps) {
  return (
    <button
      onClick={onToggle}
      className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all ${
        active
          ? 'bg-accent/20 text-accent'
          : 'text-gray-600 hover:text-gray-400 hover:bg-surface-hover'
      }`}
      aria-label={active ? 'Remove go up marker' : 'Mark to go up next time'}
      title={active ? 'Going up next time' : 'Tap to go up next time'}
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
      </svg>
    </button>
  )
}
