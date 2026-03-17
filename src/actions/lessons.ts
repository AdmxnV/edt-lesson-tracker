'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

interface UpsertLessonPayload {
  student_id: string
  lesson_number: number
  completed: boolean
  completion_date: string | null
  uploaded_to_rsa: boolean
  notes: string | null
}

export async function upsertLesson(payload: UpsertLessonPayload) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Enforce business rule: can't be uploaded if not completed
  const safePayload = {
    ...payload,
    uploaded_to_rsa: payload.completed ? payload.uploaded_to_rsa : false,
    completion_date: payload.completed ? payload.completion_date : null,
  }

  const { error } = await supabase
    .from('lessons')
    .upsert(safePayload, { onConflict: 'student_id,lesson_number' })

  if (error) throw new Error(error.message)

  revalidatePath(`/students/${payload.student_id}`)
  revalidatePath('/')
}
