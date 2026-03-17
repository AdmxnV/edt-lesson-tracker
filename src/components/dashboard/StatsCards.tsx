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

interface StatsCardsProps {
  totalStudents: number
  lessonsCompleted: number
  pendingUpload: number
  fullyUploaded: number
  passRate: number | null
}

export default function StatsCards({
  totalStudents,
  lessonsCompleted,
  pendingUpload,
  fullyUploaded,
  passRate,
}: StatsCardsProps) {
  const passRateDisplay = passRate !== null ? `${Math.round(passRate)}%` : '—'

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
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
      <StatCard
        label="Pass Rate"
        value={passRateDisplay}
        sub={passRate !== null ? 'excl. external students' : 'no attempts recorded'}
        accent="bg-purple-50 dark:bg-purple-900/20"
        icon={
          <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        }
      />
    </div>
  )
}
