import type { PassStats } from '@/lib/types'

interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  icon: React.ReactNode
  accent: string
}

function StatCard({ label, value, sub, icon, accent }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-5 flex items-start gap-4">
      <div className={`flex items-center justify-center w-11 h-11 rounded-xl shrink-0 ${accent}`}>{icon}</div>
      <div className="min-w-0">
        <p className="text-2xl font-bold text-gray-900 dark:text-white leading-none">{value}</p>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1 leading-snug">{label}</p>
        {sub && <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

interface PassStatPillProps {
  label: string
  rate: number
  count: number
  sat: number
  colour: string
}

function PassStatPill({ label, rate, count, sat, colour }: PassStatPillProps) {
  return (
    <div className="flex-1 min-w-0">
      <p className={`text-2xl font-bold leading-none ${colour}`}>{Math.round(rate)}%</p>
      <p className="text-sm font-medium text-gray-700 dark:text-slate-200 mt-1 leading-snug">{label}</p>
      <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{count} of {sat} students</p>
    </div>
  )
}

interface StatsCardsProps {
  totalStudents: number
  lessonsCompleted: number
  pendingUpload: number
  fullyUploaded: number
  passStats: PassStats | null
}

export default function StatsCards({
  totalStudents,
  lessonsCompleted,
  pendingUpload,
  fullyUploaded,
  passStats,
}: StatsCardsProps) {
  return (
    <div className="space-y-4 mb-8">
      {/* Top row: 4 stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Students"
          value={totalStudents}
          accent="bg-brand/10"
          icon={
            <svg className="w-5 h-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        />
        <StatCard
          label="Lessons Completed"
          value={lessonsCompleted}
          sub={`of ${totalStudents * 12} total`}
          accent="bg-emerald-50 dark:bg-emerald-900/20"
          icon={
            <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          label="Pending RSA Upload"
          value={pendingUpload}
          sub="lessons awaiting upload"
          accent="bg-amber-50 dark:bg-amber-900/20"
          icon={
            <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          label="Fully Uploaded"
          value={fullyUploaded}
          sub="all 12 lessons on RSA"
          accent="bg-blue-50 dark:bg-blue-900/20"
          icon={
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          }
        />
      </div>

      {/* Pass rate section */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-900/20 shrink-0">
            <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-slate-200">Test Pass Rates</h3>
            <p className="text-xs text-gray-400 dark:text-slate-500">
              {passStats
                ? `Based on ${passStats.sat} student${passStats.sat !== 1 ? 's' : ''} who sat the test · excludes external students`
                : 'No test attempts recorded yet'}
            </p>
          </div>
        </div>

        {passStats ? (
          <div className="flex flex-col sm:flex-row gap-6 sm:divide-x sm:divide-gray-100 sm:dark:divide-slate-700">
            <PassStatPill
              label="Overall Pass Rate"
              rate={passStats.overallRate}
              count={passStats.overallCount}
              sat={passStats.sat}
              colour="text-emerald-600 dark:text-emerald-400"
            />
            <div className="sm:pl-6">
              <PassStatPill
                label="First Time Pass"
                rate={passStats.firstTimeRate}
                count={passStats.firstTimeCount}
                sat={passStats.sat}
                colour="text-brand dark:text-blue-400"
              />
            </div>
            <div className="sm:pl-6">
              <PassStatPill
                label="Multi-Attempt Pass"
                rate={passStats.multiAttemptRate}
                count={passStats.multiAttemptCount}
                sat={passStats.sat}
                colour="text-purple-600 dark:text-purple-400"
              />
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-400 dark:text-slate-500 italic">
            Add test attempts on student detail pages to see pass rate statistics here.
          </p>
        )}
      </div>
    </div>
  )
}
