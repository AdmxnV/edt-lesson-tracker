import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import StatsCards from '@/components/dashboard/StatsCards'
import type { TestAttempt, PassStats } from '@/lib/types'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: students } = await supabase
    .from('students')
    .select('*, lessons(*), test_attempts(*)')
    .eq('adi_id', user.id)

  const list = students ?? []

  const totalStudents = list.length
  const lessonsCompleted = list.reduce(
    (sum, s) => sum + (s.lessons ?? []).filter((l: { completed: boolean }) => l.completed).length,
    0
  )
  const pendingUpload = list.reduce((sum, s) => {
    const completed = (s.lessons ?? []).filter((l: { completed: boolean }) => l.completed).length
    const uploaded = (s.lessons ?? []).filter((l: { uploaded_to_rsa: boolean }) => l.uploaded_to_rsa).length
    return sum + Math.max(0, completed - uploaded)
  }, 0)
  const fullyUploaded = list.filter((s) => {
    const uploaded = (s.lessons ?? []).filter((l: { uploaded_to_rsa: boolean }) => l.uploaded_to_rsa).length
    return uploaded === 12
  }).length

  // Pass stats: student-level, exclude external students
  const studentsWhoSat = list.filter(
    (s) => s.student_type !== 'external' && (s.test_attempts ?? []).length > 0
  )
  const sat = studentsWhoSat.length

  const overallPassCount = studentsWhoSat.filter(
    (s) => (s.test_attempts as TestAttempt[]).some((a) => a.result === 'pass')
  ).length

  const firstTimePassCount = studentsWhoSat.filter((s) => {
    const sorted = [...(s.test_attempts as TestAttempt[])].sort((a, b) => a.attempt_number - b.attempt_number)
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Overview</h1>
        <p className="text-gray-500 dark:text-slate-400 mt-1">Your EDT training stats at a glance</p>
      </div>

      <StatsCards
        totalStudents={totalStudents}
        lessonsCompleted={lessonsCompleted}
        pendingUpload={pendingUpload}
        fullyUploaded={fullyUploaded}
        passStats={passStats}
      />

      {/* Quick nav cards */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/students"
          className="group flex items-center gap-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-brand dark:hover:border-brand transition-all"
        >
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-brand/10 shrink-0 group-hover:bg-brand/20 transition-colors">
            <svg className="w-5 h-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 dark:text-white group-hover:text-brand transition-colors">
              Students
            </p>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
              {totalStudents === 0
                ? 'No students yet — add your first'
                : `${totalStudents} student${totalStudents !== 1 ? 's' : ''} · manage lessons & records`}
            </p>
          </div>
          <svg className="w-5 h-5 text-gray-300 dark:text-slate-600 group-hover:text-brand transition-colors ml-auto shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>

        <div className="flex items-center gap-4 bg-white dark:bg-slate-800 border border-dashed border-gray-200 dark:border-slate-700 rounded-2xl p-5 opacity-50 select-none">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gray-100 dark:bg-slate-700 shrink-0">
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-gray-500 dark:text-slate-400">Reports</p>
            <p className="text-sm text-gray-400 dark:text-slate-500 mt-0.5">Coming soon</p>
          </div>
        </div>
      </div>
    </main>
  )
}
