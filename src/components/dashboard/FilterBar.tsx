'use client'

export type FilterType = 'all' | 'pending' | 'uploaded'

interface FilterBarProps {
  active: FilterType
  onChange: (f: FilterType) => void
  counts: { all: number; pending: number; uploaded: number }
}

const filters: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'All Students' },
  { key: 'pending', label: 'Pending Upload' },
  { key: 'uploaded', label: 'Fully Uploaded' },
]

export default function FilterBar({ active, onChange, counts }: FilterBarProps) {
  return (
    <div className="flex gap-1 bg-gray-100 dark:bg-slate-700 rounded-xl p-1">
      {filters.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`flex-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
            active === key
              ? 'bg-white dark:bg-slate-600 text-brand dark:text-white shadow-sm'
              : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200'
          }`}
        >
          {label}
          <span className={`ml-1.5 text-xs ${active === key ? 'text-brand/70 dark:text-white/70' : 'text-gray-400 dark:text-slate-500'}`}>
            ({counts[key]})
          </span>
        </button>
      ))}
    </div>
  )
}
