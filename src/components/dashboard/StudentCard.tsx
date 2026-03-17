import Link from 'next/link'
import ProgressBar from '@/components/ui/ProgressBar'
import Badge from '@/components/ui/Badge'
import type { StudentWithProgress } from '@/lib/types'

interface StudentCardProps {
  student: StudentWithProgress
  onDelete: (id: string) => void
}

export default function StudentCard({ student, onDelete }: StudentCardProps) {
  const { completedCount, uploadedCount } = student
  const pendingUpload = completedCount - uploadedCount
  const isComplete = completedCount === 12

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between mb-4">
        <div className="min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{student.name}</h3>
          {student.driver_number && (
            <p className="text-xs text-gray-400 mt-0.5">Driver No: {student.driver_number}</p>
          )}
        </div>
        <div className="flex items-center gap-1 ml-2 shrink-0">
          {isComplete && (
            <Badge variant="green">Complete</Badge>
          )}
          <button
            onClick={() => onDelete(student.id)}
            className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
            title="Delete student"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      <ProgressBar value={completedCount} />

      <div className="flex items-center gap-3 mt-4">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
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
      </div>

      <Link
        href={`/students/${student.id}`}
        className="mt-4 flex items-center justify-center w-full py-2 rounded-lg bg-gray-50 hover:bg-brand/5 text-sm font-medium text-gray-600 hover:text-brand transition-colors border border-gray-200 hover:border-brand/30"
      >
        View Lessons
        <svg className="w-4 h-4 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  )
}
