'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

interface AddTestAttemptData {
  attempt_year?: number | null  // year only (stored as YYYY-01-01)
  result: 'pass' | 'fail'
  test_centre?: string
  notes?: string
}

export async function addTestAttempt(studentId: string, data: AddTestAttemptData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Verify ownership
  const { data: student, error: studentError } = await supabase
    .from('students')
    .select('id')
    .eq('id', studentId)
    .eq('adi_id', user.id)
    .single()

  if (studentError || !student) throw new Error('Student not found')

  // Count existing attempts to auto-calculate attempt_number
  const { count } = await supabase
    .from('test_attempts')
    .select('*', { count: 'exact', head: true })
    .eq('student_id', studentId)

  const attempt_number = (count ?? 0) + 1

  const { error } = await supabase.from('test_attempts').insert({
    student_id: studentId,
    attempt_number,
    attempt_date: data.attempt_year ? `${data.attempt_year}-01-01` : null,
    result: data.result,
    test_centre: data.test_centre || null,
    notes: data.notes || null,
  })

  if (error) throw new Error(error.message)

  revalidatePath(`/students/${studentId}`)
  revalidatePath('/')
}

export async function deleteTestAttempt(attemptId: string, studentId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Verify ownership via student
  const { data: student, error: studentError } = await supabase
    .from('students')
    .select('id')
    .eq('id', studentId)
    .eq('adi_id', user.id)
    .single()

  if (studentError || !student) throw new Error('Student not found')

  const { error } = await supabase
    .from('test_attempts')
    .delete()
    .eq('id', attemptId)
    .eq('student_id', studentId)

  if (error) throw new Error(error.message)

  revalidatePath(`/students/${studentId}`)
  revalidatePath('/')
}
