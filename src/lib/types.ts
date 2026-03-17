export interface Student {
  id: string
  adi_id: string
  name: string
  dob: string | null
  driver_number: string | null
  logbook_number: string | null
  created_at: string
}

export interface Lesson {
  id: string
  student_id: string
  lesson_number: number
  completed: boolean
  completion_date: string | null
  uploaded_to_rsa: boolean
  notes: string | null
  updated_at: string
}

export interface StudentWithProgress extends Student {
  lessons: Lesson[]
  completedCount: number
  uploadedCount: number
}
