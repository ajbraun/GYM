interface PreviousWeightBadgeProps {
  weight: number
}

export function PreviousWeightBadge({ weight }: PreviousWeightBadgeProps) {
  return (
    <span className="text-[10px] text-gray-500 bg-gray-800 px-1.5 py-0.5 rounded">
      Last: {weight} lbs
    </span>
  )
}
