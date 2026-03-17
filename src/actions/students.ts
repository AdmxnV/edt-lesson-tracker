'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { TOTAL_LESSONS } from '@/lib/constants'

export async function addStudent(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const name = formData.get('name') as string
  const dob = (formData.get('dob') as string) || null
  const driver_number = (formData.get('driver_number') as string) || null
  const logbook_number = (formData.get('logbook_number') as string) || null

  if (!name?.trim()) throw new Error('Name is required')

  const { data: student, error: studentError } = await supabase
    .from('students')
    .insert({ adi_id: user.id, name: name.trim(), dob, driver_number, logbook_number })
    .select('id')
    .single()

  if (studentError) throw new Error(studentError.message)

  // Pre-create all 12 lesson rows
  const lessonRows = Array.from({ length: TOTAL_LESSONS }, (_, i) => ({
    student_id: student.id,
    lesson_number: i + 1,
    completed: false,
    uploaded_to_rsa: false,
  }))

  const { error: lessonsError } = await supabase.from('lessons').insert(lessonRows)
  if (lessonsError) throw new Error(lessonsError.message)

  revalidatePath('/')
  return { id: student.id }
}

export async function deleteStudent(id: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('students')
    .delete()
    .eq('id', id)
    .eq('adi_id', user.id)

  if (error) throw new Error(error.message)

  revalidatePath('/')
}
