'use client'

import { useState, useTransition } from 'react'
import StudentCard from './StudentCard'
import FilterBar, { type FilterType } from './FilterBar'
import AddStudentModal from './AddStudentModal'
import CsvUploadModal from './CsvUploadModal'
import BulkActionBar from './BulkActionBar'
import { deleteStudent } from '@/actions/students'
import type { StudentWithProgress } from '@/lib/types'

interface StudentListProps { students: StudentWithProgress[] }

export default function StudentList({ students }: StudentListProps) {
  const [filter, setFilter] = useState<FilterType>('all')
  const [search, setSearch] = useState('')
  const [addOpen, setAddOpen] = useState(false)
  const [csvOpen, setCsvOpen] = useState(false)
  const [bulkMode, setBulkMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [, startTransition] = useTransition()

  const allCount = students.length
  const pendingCount = students.filter((s) => s.completedCount > s.uploadedCount).length
  const uploadedCount = students.filter((s) => s.completedCount === 12 && s.uploadedCount === 12).length

  const searchLower = search.trim().toLowerCase()

  const filtered = students.filter((s) => {
    if (filter === 'pending' && !(s.completedCount > s.uploadedCount)) return false
    if (filter === 'uploaded' && !(s.completedCount === 12 && s.uploadedCount === 12)) return false
    if (searchLower) {
      const matchName = s.name.toLowerCase().includes(searchLower)
      const matchDriver = (s.driver_number ?? '').toLowerCase().includes(searchLower)
      if (!matchName && !matchDriver) return false
    }
    return true
  })

  const allFilteredSelected = filtered.length > 0 && filtered.every((s) => selectedIds.has(s.id))

  function toggleSelectAll() {
    if (allFilteredSelected) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filtered.map((s) => s.id)))
    }
  }

  function handleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function handleDelete(id: string) {
    if (!confirm('Delete this student and all their lesson records? This cannot be undone.')) return
    startTransition(async () => { await deleteStudent(id) })
  }

  function exitBulkMode() {
    setBulkMode(false)
    setSelectedIds(new Set())
  }

  return (
    <div className={bulkMode ? 'pb-24' : ''}>
      {/* Search bar */}
      <div className="mb-4">
        <div className="relative max-w-md">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or driver number…"
            className="w-full pl-9 pr-9 py-2.5 border border-gray-200 dark:border-slate-600 rounded-xl text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300"
              aria-label="Clear search"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 flex-1 max-w-lg flex-wrap">
          <FilterBar
            active={filter}
            onChange={setFilter}
            counts={{ all: allCount, pending: pendingCount, uploaded: uploadedCount }}
          />
          {/* Bulk mode: select all toggle */}
          {bulkMode && filtered.length > 0 && (
            <button
              onClick={toggleSelectAll}
              className="text-xs font-medium text-brand dark:text-blue-400 hover:underline whitespace-nowrap"
            >
              {allFilteredSelected ? 'Deselect all' : `Select all (${filtered.length})`}
            </button>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {!bulkMode ? (
            <>
              <button
                onClick={() => setBulkMode(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 dark:border-slate-600 text-gray-600 dark:text-slate-300 bg-white dark:bg-slate-800 rounded-xl text-sm font-medium hover:border-brand hover:text-brand transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                Bulk Select
              </button>
              <button
                onClick={() => setCsvOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 border border-brand dark:border-blue-400 text-brand dark:text-blue-400 bg-white dark:bg-transparent rounded-xl text-sm font-medium hover:bg-brand/5 dark:hover:bg-blue-400/10 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                Import CSV
              </button>
              <button
                onClick={() => setAddOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand text-white rounded-xl text-sm font-medium hover:bg-brand-dark transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Student
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-slate-400">
                {selectedIds.size} selected
              </span>
              <button
                onClick={exitBulkMode}
                className="px-4 py-2.5 border border-gray-300 dark:border-slate-600 text-gray-600 dark:text-slate-300 bg-white dark:bg-slate-800 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-slate-700 mb-4">
            <svg className="w-6 h-6 text-gray-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p className="text-gray-500 dark:text-slate-400 font-medium">
            {searchLower
              ? `No students match "${search}"`
              : filter === 'all'
              ? 'No students yet'
              : 'No students match this filter'}
          </p>
          {filter === 'all' && !searchLower && (
            <p className="text-gray-400 dark:text-slate-500 text-sm mt-1">
              Add a student manually or import a CSV to get started
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              onDelete={handleDelete}
              bulkMode={bulkMode}
              selected={selectedIds.has(student.id)}
              onSelect={handleSelect}
            />
          ))}
        </div>
      )}

      <AddStudentModal open={addOpen} onClose={() => setAddOpen(false)} />
      <CsvUploadModal open={csvOpen} onClose={() => setCsvOpen(false)} />

      {bulkMode && (
        <BulkActionBar
          selectedCount={selectedIds.size}
          selectedIds={Array.from(selectedIds)}
          onClearSelection={() => setSelectedIds(new Set())}
          onDone={exitBulkMode}
        />
      )}
    </div>
  )
}
