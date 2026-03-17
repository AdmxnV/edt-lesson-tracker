'use client'

import { useState, useTransition } from 'react'
import Badge from '@/components/ui/Badge'
import { addTestAttempt, deleteTestAttempt } from '@/actions/testAttempts'
import type { TestAttempt } from '@/lib/types'

interface TestAttemptsSectionProps {
  studentId: string
  attempts: TestAttempt[]
}

export default function TestAttemptsSection({ studentId, attempts }: TestAttemptsSectionProps) {
  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: currentYear - 2009 }, (_, i) => currentYear - i)

  const [showForm, setShowForm] = useState(false)
  const [result, setResult] = useState<'pass' | 'fail'>('fail')
  const [year, setYear] = useState<string>(String(currentYear))
  const [centre, setCentre] = useState('')
  const [notes, setNotes] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const passCount = attempts.filter((a) => a.result === 'pass').length
  const failCount = attempts.filter((a) => a.result === 'fail').length

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)
    startTransition(async () => {
      try {
        await addTestAttempt(studentId, {
          attempt_year: year ? Number(year) : null,
          result,
          test_centre: centre || undefined,
          notes: notes || undefined,
        })
        setShowForm(false)
        setYear(String(currentYear))
        setCentre('')
        setNotes('')
        setResult('fail')
      } catch (err) {
        setFormError(err instanceof Error ? err.message : 'Failed to add attempt')
      }
    })
  }

  function handleDelete(attemptId: string) {
    if (!confirm('Delete this test attempt? This cannot be undone.')) return
    startTransition(async () => {
      try {
        await deleteTestAttempt(attemptId, studentId)
      } catch {
        // silently fail — page will re-render
      }
    })
  }

  function displayYear(dateStr: string | null) {
    if (!dateStr) return '—'
    return new Date(dateStr).getFullYear()
  }

  const sorted = [...attempts].sort((a, b) => a.attempt_number - b.attempt_number)

  const inputClass = 'w-full px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors'
  const labelClass = 'block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1'

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Test Attempts</h2>
          {attempts.length > 0 && (
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
              {attempts.length} attempt{attempts.length !== 1 ? 's' : ''} &bull; {passCount} pass{passCount !== 1 ? 'es' : ''} &bull; {failCount} fail{failCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center gap-2 px-3 py-2 bg-brand text-white rounded-lg text-sm font-medium hover:bg-brand-dark transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showForm ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'} />
          </svg>
          {showForm ? 'Cancel' : 'Add Attempt'}
        </button>
      </div>

      {/* Inline add form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl border border-gray-200 dark:border-slate-600 space-y-4">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-slate-200">New Test Attempt</h3>
          {formError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">{formError}</div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Year</label>
              <select value={year} onChange={(e) => setYear(e.target.value)} className={inputClass}>
                <option value="">— Not recorded —</option>
                {yearOptions.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Result <span className="text-red-500">*</span></label>
              <div className="flex gap-3 mt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="result"
                    value="pass"
                    checked={result === 'pass'}
                    onChange={() => setResult('pass')}
                    className="accent-brand"
                  />
                  <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">Pass</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="result"
                    value="fail"
                    checked={result === 'fail'}
                    onChange={() => setResult('fail')}
                    className="accent-brand"
                  />
                  <span className="text-sm text-red-600 dark:text-red-400 font-medium">Fail</span>
                </label>
              </div>
            </div>
            <div>
              <label className={labelClass}>Test Centre</label>
              <input type="text" value={centre} onChange={(e) => setCentre(e.target.value)} placeholder="e.g. Raheny" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Notes</label>
              <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional notes" className={inputClass} />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => { setShowForm(false); setFormError(null) }}
              className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 bg-brand text-white rounded-lg text-sm font-medium hover:bg-brand-dark transition-colors disabled:opacity-60"
            >
              {isPending ? 'Saving…' : 'Save Attempt'}
            </button>
          </div>
        </form>
      )}

      {/* Attempts table */}
      {sorted.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-gray-400 dark:text-slate-500">No test attempts recorded yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-slate-700">
                <th className="pb-2 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide w-12">#</th>
                <th className="pb-2 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide">Year</th>
                <th className="pb-2 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide">Result</th>
                <th className="pb-2 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide hidden sm:table-cell">Test Centre</th>
                <th className="pb-2 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide hidden md:table-cell">Notes</th>
                <th className="pb-2 w-10" />
              </tr>
            </thead>
            <tbody>
              {sorted.map((attempt) => (
                <tr key={attempt.id} className="border-b border-gray-50 dark:border-slate-700/50 last:border-0">
                  <td className="py-3 text-sm font-medium text-gray-500 dark:text-slate-400">{attempt.attempt_number}</td>
                  <td className="py-3 text-sm text-gray-900 dark:text-white">
                    {displayYear(attempt.attempt_date)}
                  </td>
                  <td className="py-3">
                    <Badge variant={attempt.result === 'pass' ? 'green' : 'red'}>
                      {attempt.result === 'pass' ? 'Pass' : 'Fail'}
                    </Badge>
                  </td>
                  <td className="py-3 text-sm text-gray-500 dark:text-slate-400 hidden sm:table-cell">{attempt.test_centre ?? '—'}</td>
                  <td className="py-3 text-sm text-gray-500 dark:text-slate-400 hidden md:table-cell max-w-xs truncate">{attempt.notes ?? '—'}</td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => handleDelete(attempt.id)}
                      className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      title="Delete attempt"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
