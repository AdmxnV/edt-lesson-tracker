'use client'

import { useState, useTransition } from 'react'
import StudentCard from './StudentCard'
import FilterBar, { type FilterType } from './FilterBar'
import AddStudentModal from './AddStudentModal'
import CsvUploadModal from './CsvUploadModal'
import { deleteStudent } from '@/actions/students'
import type { StudentWithProgress } from '@/lib/types'

interface StudentListProps {
  students: StudentWithProgress[]
}

export default function StudentList({ students }: StudentListProps) {
  const [filter, setFilter] = useState<FilterType>('all')
  const [addOpen, setAddOpen] = useState(false)
  const [csvOpen, setCsvOpen] = useState(false)
  const [, startTransition] = useTransition()

  const allCount = students.length
  const pendingCount = students.filter(
    (s) => s.completedCount > s.uploadedCount
  ).length
  const uploadedCount = students.filter(
    (s) => s.completedCount === 12 && s.uploadedCount === 12
  ).length

  const filtered = students.filter((s) => {
    if (filter === 'pending') return s.completedCount > s.uploadedCount
    if (filter === 'uploaded') return s.completedCount === 12 && s.uploadedCount === 12
    return true
  })

  function handleDelete(id: string) {
    if (!confirm('Delete this student and all their lesson records? This cannot be undone.')) return
    startTransition(async () => {
      await deleteStudent(id)
    })
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex-1 max-w-lg">
          <FilterBar
            active={filter}
            onChange={setFilter}
            counts={{ all: allCount, pending: pendingCount, uploaded: uploadedCount }}
          />
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setCsvOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-brand text-brand bg-white rounded-xl text-sm font-medium hover:bg-brand/5 transition-colors"
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
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
            <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">
            {filter === 'all' ? 'No students yet' : 'No students match this filter'}
          </p>
          {filter === 'all' && (
            <p className="text-gray-400 text-sm mt-1">
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
            />
          ))}
        </div>
      )}

      <AddStudentModal open={addOpen} onClose={() => setAddOpen(false)} />
      <CsvUploadModal open={csvOpen} onClose={() => setCsvOpen(false)} />
    </div>
  )
}
