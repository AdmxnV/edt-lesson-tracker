import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import StudentList from '@/components/dashboard/StudentList'
import StatsCards from '@/components/dashboard/StatsCards'
import type { StudentWithProgress, TestAttempt, PassStats } from '@/lib/types'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: students } = await supabase
    .from('students')
    .select('*, lessons(*), test_attempts(*)')
    .eq('adi_id', user.id)
    .order('created_at', { ascending: false })

  const studentsWithProgress: StudentWithProgress[] = (students ?? []).map((s) => {
    const lessons = s.lessons ?? []
    const testAttempts: TestAttempt[] = s.test_attempts ?? []
    return {
      ...s,
      lessons,
      completedCount: lessons.filter((l: { completed: boolean }) => l.completed).length,
      uploadedCount: lessons.filter((l: { uploaded_to_rsa: boolean }) => l.uploaded_to_rsa).length,
      testAttempts,
    }
  })

  const totalStudents = studentsWithProgress.length
  const lessonsCompleted = studentsWithProgress.reduce((sum, s) => sum + s.completedCount, 0)
  const pendingUpload = studentsWithProgress.reduce(
    (sum, s) => sum + Math.max(0, s.completedCount - s.uploadedCount),
    0
  )
  const fullyUploaded = studentsWithProgress.filter((s) => s.uploadedCount === 12).length

  // Pass stats: student-level (did the student pass? how many attempts did it take?)
  // Exclude external students who came in without doing EDT with us
  const studentsWhoSat = studentsWithProgress.filter(
    (s) => s.student_type !== 'external' && s.testAttempts.length > 0
  )
  const sat = studentsWhoSat.length

  const overallPassCount = studentsWhoSat.filter(
    (s) => s.testAttempts.some((a) => a.result === 'pass')
  ).length

  const firstTimePassCount = studentsWhoSat.filter((s) => {
    // Sort by attempt_number ascending, then check if the first one is a pass
    const sorted = [...s.testAttempts].sort((a, b) => a.attempt_number - b.attempt_number)
    return sorted[0]?.result === 'pass'
  }).length

  const multiAttemptPassCount = overallPassCount - firstTimePassCount

  const passStats: PassStats | null = sat > 0
    ? {
        sat,
        overallCount: overallPassCount,
        firstTimeCount: firstTimePassCount,
        multiAttemptCount: multiAttemptPassCount,
        overallRate: (overallPassCount / sat) * 100,
        firstTimeRate: (firstTimePassCount / sat) * 100,
        multiAttemptRate: (multiAttemptPassCount / sat) * 100,
      }
    : null

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-slate-400 mt-1">
          Overview of your students and EDT lesson progress
        </p>
      </div>

      {/* Stats overview */}
      <StatsCards
        totalStudents={totalStudents}
        lessonsCompleted={lessonsCompleted}
        pendingUpload={pendingUpload}
        fullyUploaded={fullyUploaded}
        passStats={passStats}
      />

      {/* Student list */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-slate-200 mb-4">Students</h2>
        <StudentList students={studentsWithProgress} />
      </div>
    </main>
  )
}
