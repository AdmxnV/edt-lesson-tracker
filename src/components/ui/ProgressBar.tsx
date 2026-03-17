interface ProgressBarProps {
  value: number  // 0–12
  max?: number
}

export default function ProgressBar({ value, max = 12 }: ProgressBarProps) {
  const pct = Math.round((value / max) * 100)
  const isComplete = value === max

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-500">{value}/{max} lessons</span>
        <span className={`text-xs font-medium ${isComplete ? 'text-brand' : 'text-gray-400'}`}>
          {pct}%
        </span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${isComplete ? 'bg-brand' : 'bg-brand/60'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
