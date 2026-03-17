'use client'

import { useState, useTransition } from 'react'
import { bulkCompleteStudentLessons } from '@/actions/students'

interface BulkActionBarProps {
  selectedCount: number
  selectedIds: string[]
  onClearSelection: () => void
  onDone: () => void
}

export default function BulkActionBar({
  selectedCount,
  selectedIds,
  onClearSelection,
  onDone,
}: BulkActionBarProps) {
  const today = new Date().toISOString().split('T')[0]
  const [completionDate, setCompletionDate] = useState(today)
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<string | null>(null)

  function handleComplete() {
    if (!selectedCount) return
    if (!confirm(`Mark all 12 lessons as completed for ${selectedCount} student${selectedCount !== 1 ? 's' : ''}? This will overwrite any existing completion dates for incomplete lessons.`)) return

    setResult(null)
    startTransition(async () => {
      try {
        const { count } = await bulkCompleteStudentLessons(selectedIds, completionDate || null)
        setResult(`✓ ${count} student${count !== 1 ? 's' : ''} updated`)
        onClearSelection()
      } catch (err) {
        setResult(`Error: ${err instanceof Error ? err.message : 'Failed'}`)
      }
    })
  }

  if (selectedCount === 0 && !result) return null

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4">
      <div className="bg-brand dark:bg-slate-800 border border-brand-dark dark:border-slate-600 rounded-2xl shadow-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-3">

        {/* Left: count + date */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/20 dark:bg-brand/30 shrink-0">
            <span className="text-sm font-bold text-white">{selectedCount}</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white leading-tight">
              {selectedCount} student{selectedCount !== 1 ? 's' : ''} selected
            </p>
            {result && (
              <p className="text-xs text-white/80 mt-0.5">{result}</p>
            )}
          </div>
        </div>

        {/* Centre: date picker */}
        <div className="flex items-center gap-2 shrink-0">
          <label className="text-xs text-white/70 whitespace-nowrap">Completion date</label>
          <input
            type="date"
            value={completionDate}
            onChange={(e) => setCompletionDate(e.target.value)}
            className="px-2 py-1.5 rounded-lg text-sm border border-white/30 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white/40"
          />
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onClearSelection}
            className="px-3 py-2 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            Clear
          </button>
          <button
            onClick={handleComplete}
            disabled={isPending || selectedCount === 0}
            className="px-4 py-2 rounded-lg text-sm font-semibold bg-white text-brand hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            {isPending ? (
              <>
                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Updating…
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Mark all complete
              </>
            )}
          </button>
          <button
            onClick={onDone}
            className="px-3 py-2 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
