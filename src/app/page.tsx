import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import StudentList from '@/components/dashboard/StudentList'
import StatsCards from '@/components/dashboard/StatsCards'
import type { StudentWithProgress } from '@/lib/types'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: students } = await supabase
    .from('students')
    .select('*, lessons(*)')
    .eq('adi_id', user.id)
    .order('created_at', { ascending: false })

  const studentsWithProgress: StudentWithProgress[] = (students ?? []).map((s) => {
    const lessons = s.lessons ?? []
    return {
      ...s,
      lessons,
      completedCount: lessons.filter((l: { completed: boolean }) => l.completed).length,
      uploadedCount: lessons.filter((l: { uploaded_to_rsa: boolean }) => l.uploaded_to_rsa).length,
    }
  })

  const totalStudents = studentsWithProgress.length
  const lessonsCompleted = studentsWithProgress.reduce((sum, s) => sum + s.completedCount, 0)
  const pendingUpload = studentsWithProgress.reduce(
    (sum, s) => sum + Math.max(0, s.completedCount - s.uploadedCount),
    0
  )
  const fullyUploaded = studentsWithProgress.filter((s) => s.uploadedCount === 12).length

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Overview of your students and EDT lesson progress
        </p>
      </div>

      {/* Stats overview */}
      <StatsCards
        totalStudents={totalStudents}
        lessonsCompleted={lessonsCompleted}
        pendingUpload={pendingUpload}
        fullyUploaded={fullyUploaded}
      />

      {/* Student list */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Students</h2>
        <StudentList students={studentsWithProgress} />
      </div>
    </main>
  )
}
