interface WeightInputProps {
  value: number | null
  suggestedWeight?: number | null
  onChange: (weight: number | null) => void
}

export function WeightInput({ value, suggestedWeight, onChange }: WeightInputProps) {
  const displayValue = value ?? ''
  const placeholder = suggestedWeight ? String(suggestedWeight) : '0'

  return (
    <div className="flex items-center gap-1">
      <input
        type="number"
        inputMode="numeric"
        pattern="[0-9]*"
        value={displayValue}
        placeholder={placeholder}
        onChange={(e) => {
          const v = e.target.value
          onChange(v === '' ? null : Number(v))
        }}
        className={`w-14 h-8 text-center text-sm rounded-md border border-gray-700 bg-gray-800/50 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-colors ${
          suggestedWeight && !value ? 'placeholder:text-accent/50' : 'placeholder:text-gray-600'
        }`}
      />
      <span className="text-xs text-gray-500">lbs</span>
    </div>
  )
}
