import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import SummaryCards from '@/components/student-detail/SummaryCards'
import LessonTable from '@/components/student-detail/LessonTable'
import TestAttemptsSection from '@/components/student-detail/TestAttemptsSection'
import StudentNotesSection from '@/components/student-detail/StudentNotesSection'
import Badge from '@/components/ui/Badge'
import { STUDENT_TYPES } from '@/lib/constants'
import type { Lesson, TestAttempt } from '@/lib/types'

interface Props {
  params: Promise<{ id: string }>
}

const studentTypeBadgeVariant: Record<string, 'blue' | 'purple' | 'yellow' | 'gray'> = {
  full: 'blue',
  transfer: 'purple',
  pre_test: 'yellow',
  external: 'gray',
}

export default async function StudentDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: student } = await supabase
    .from('students')
    .select('*')
    .eq('id', id)
    .eq('adi_id', user.id)
    .single()

  if (!student) notFound()

  const { data: lessons } = await supabase
    .from('lessons')
    .select('*')
    .eq('student_id', id)
    .order('lesson_number', { ascending: true })

  const { data: testAttempts } = await supabase
    .from('test_attempts')
    .select('*')
    .eq('student_id', id)
    .order('attempt_number', { ascending: true })

  const lessonList: Lesson[] = lessons ?? []
  const attemptList: TestAttempt[] = testAttempts ?? []
  const completedCount = lessonList.filter((l) => l.completed).length
  const uploadedCount = lessonList.filter((l) => l.uploaded_to_rsa).length
  const attemptCount = attemptList.length
  const passCount = attemptList.filter((a) => a.result === 'pass').length

  const dobFormatted = student.dob
    ? new Date(student.dob).toLocaleDateString('en-IE', { day: 'numeric', month: 'long', year: 'numeric' })
    : null

  const typeInfo = STUDENT_TYPES.find((t) => t.value === student.student_type)
  const typeVariant = studentTypeBadgeVariant[student.student_type as string] ?? 'gray'

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-white mb-6 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Students
      </Link>

      {/* Student header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{student.name}</h1>
            {typeInfo && <Badge variant={typeVariant}>{typeInfo.label}</Badge>}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
            {dobFormatted && (
              <span className="text-sm text-gray-500 dark:text-slate-400">DOB: {dobFormatted}</span>
            )}
            {student.driver_number && (
              <span className="text-sm text-gray-500 dark:text-slate-400">Driver No: {student.driver_number}</span>
            )}
            {student.logbook_number && (
              <span className="text-sm text-gray-500 dark:text-slate-400">Logbook: {student.logbook_number}</span>
            )}
          </div>
        </div>
        <div className="shrink-0">
          <span className="text-xs text-gray-400 dark:text-slate-500">
            Added {new Date(student.created_at).toLocaleDateString('en-IE')}
          </span>
        </div>
      </div>

      <SummaryCards
        completedCount={completedCount}
        uploadedCount={uploadedCount}
        attemptCount={attemptCount}
        passCount={passCount}
      />

      <StudentNotesSection studentId={id} initialNotes={student.notes ?? null} />

      <TestAttemptsSection studentId={id} attempts={attemptList} />

      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">EDT Lessons</h2>
        <p className="text-xs text-gray-400 dark:text-slate-500">Changes save automatically</p>
      </div>

      <LessonTable lessons={lessonList} />
    </main>
  )
}
