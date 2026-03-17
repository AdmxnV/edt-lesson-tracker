import Link from 'next/link'
import ProgressBar from '@/components/ui/ProgressBar'
import Badge from '@/components/ui/Badge'
import { STUDENT_TYPES } from '@/lib/constants'
import type { StudentWithProgress } from '@/lib/types'

interface StudentCardProps { student: StudentWithProgress; onDelete: (id: string) => void }

const studentTypeBadgeVariant: Record<string, 'blue' | 'purple' | 'yellow' | 'gray'> = {
  full: 'blue',
  transfer: 'purple',
  pre_test: 'yellow',
  external: 'gray',
}

export default function StudentCard({ student, onDelete }: StudentCardProps) {
  const { completedCount, uploadedCount } = student
  const pendingUpload = completedCount - uploadedCount
  const isComplete = completedCount === 12

  const typeInfo = STUDENT_TYPES.find((t) => t.value === student.student_type)
  const typeVariant = studentTypeBadgeVariant[student.student_type] ?? 'gray'

  const attemptCount = student.attemptCount ?? 0
  const passCount = student.passCount ?? 0

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-5 hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between mb-4">
        <div className="min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white truncate">{student.name}</h3>
          {student.driver_number && (
            <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">Driver No: {student.driver_number}</p>
          )}
        </div>
        <div className="flex items-center gap-1 ml-2 shrink-0 flex-wrap justify-end">
          {typeInfo && <Badge variant={typeVariant}>{typeInfo.label}</Badge>}
          {isComplete && <Badge variant="green">Complete</Badge>}
          <button
            onClick={() => onDelete(student.id)}
            className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors opacity-0 group-hover:opacity-100"
            title="Delete student"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      <ProgressBar value={completedCount} />

      <div className="flex items-center gap-3 mt-4 flex-wrap">
        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-slate-400">
          <svg className="w-3.5 h-3.5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{uploadedCount} uploaded to RSA</span>
        </div>
        {pendingUpload > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-amber-600">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{pendingUpload} pending upload</span>
          </div>
        )}
        {attemptCount > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-purple-600 dark:text-purple-400">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span>{attemptCount} attempt{attemptCount !== 1 ? 's' : ''} &bull; {passCount} pass{passCount !== 1 ? 'es' : ''}</span>
          </div>
        )}
      </div>

      <Link
        href={`/students/${student.id}`}
        className="mt-4 flex items-center justify-center w-full py-2 rounded-lg bg-gray-50 dark:bg-slate-700 hover:bg-brand/5 dark:hover:bg-slate-600 text-sm font-medium text-gray-600 dark:text-slate-300 hover:text-brand dark:hover:text-white transition-colors border border-gray-200 dark:border-slate-600 hover:border-brand/30"
      >
        View Lessons
        <svg className="w-4 h-4 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  )
}
