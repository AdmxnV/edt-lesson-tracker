import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import StudentList from '@/components/dashboard/StudentList'
import type { StudentWithProgress, TestAttempt } from '@/lib/types'

export default async function StudentsPage() {
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

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Students</h1>
        <p className="text-gray-500 dark:text-slate-400 mt-1">
          Manage your students and track their EDT lessons
        </p>
      </div>

      <StudentList students={studentsWithProgress} />
    </main>
  )
}
