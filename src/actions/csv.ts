'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { TOTAL_LESSONS } from '@/lib/constants'

export interface CsvStudentRow {
  name: string
  dob: string | null
  driver_number: string | null
  logbook_number: string | null
  student_type?: 'full' | 'transfer' | 'pre_test' | 'external'
}

export async function importStudentsFromCsv(rows: CsvStudentRow[]) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  if (!rows.length) throw new Error('No valid rows to import')

  const validTypes = ['full', 'transfer', 'pre_test', 'external']

  const studentInserts = rows.map((r) => ({
    adi_id: user.id,
    name: r.name.trim(),
    dob: r.dob || null,
    driver_number: r.driver_number || null,
    logbook_number: r.logbook_number || null,
    student_type: r.student_type && validTypes.includes(r.student_type) ? r.student_type : 'full',
  }))

  const { data: inserted, error: studentError } = await supabase
    .from('students')
    .insert(studentInserts)
    .select('id')

  if (studentError) throw new Error(studentError.message)

  // Pre-create 12 lesson rows for every imported student
  const lessonRows = (inserted ?? []).flatMap((s) =>
    Array.from({ length: TOTAL_LESSONS }, (_, i) => ({
      student_id: s.id,
      lesson_number: i + 1,
      completed: false,
      uploaded_to_rsa: false,
    }))
  )

  if (lessonRows.length) {
    const { error: lessonsError } = await supabase.from('lessons').insert(lessonRows)
    if (lessonsError) throw new Error(lessonsError.message)
  }

  revalidatePath('/')
  return { count: inserted?.length ?? 0 }
}
