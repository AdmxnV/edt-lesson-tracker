export interface Student {
  id: string
  adi_id: string
  name: string
  dob: string | null
  driver_number: string | null
  logbook_number: string | null
  student_type: 'full' | 'transfer' | 'pre_test' | 'external'
  notes: string | null
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

export interface TestAttempt {
  id: string
  student_id: string
  attempt_number: number
  attempt_date: string
  result: 'pass' | 'fail'
  test_centre: string | null
  notes: string | null
  created_at: string
}

export interface StudentWithProgress extends Student {
  lessons: Lesson[]
  completedCount: number
  uploadedCount: number
  testAttempts?: TestAttempt[]
  passCount?: number
  attemptCount?: number
}
