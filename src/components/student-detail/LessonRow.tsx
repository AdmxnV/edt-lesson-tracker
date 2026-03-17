'use client'

import { useState, useEffect, useRef } from 'react'
import { upsertLesson } from '@/actions/lessons'
import type { Lesson } from '@/lib/types'

interface LessonRowProps {
  lesson: Lesson
  lessonName: string
}

export default function LessonRow({ lesson, lessonName }: LessonRowProps) {
  const [completed, setCompleted] = useState(lesson.completed)
  const [completionDate, setCompletionDate] = useState(lesson.completion_date ?? '')
  const [uploadedToRsa, setUploadedToRsa] = useState(lesson.uploaded_to_rsa)
  const [notes, setNotes] = useState(lesson.notes ?? '')
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isMounted = useRef(true)

  useEffect(() => {
    isMounted.current = true
    return () => { isMounted.current = false }
  }, [])

  function save(data: {
    completed: boolean
    completionDate: string
    uploadedToRsa: boolean
    notes: string
  }) {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    setSaveStatus('saving')

    debounceRef.current = setTimeout(async () => {
      try {
        await upsertLesson({
          student_id: lesson.student_id,
          lesson_number: lesson.lesson_number,
          completed: data.completed,
          completion_date: data.completed && data.completionDate ? data.completionDate : null,
          uploaded_to_rsa: data.completed ? data.uploadedToRsa : false,
          notes: data.notes || null,
        })
        if (isMounted.current) setSaveStatus('saved')
        setTimeout(() => {
          if (isMounted.current) setSaveStatus('idle')
        }, 1500)
      } catch {
        if (isMounted.current) setSaveStatus('error')
      }
    }, 500)
  }

  function handleCompletedChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.checked
    setCompleted(value)
    if (!value) {
      setUploadedToRsa(false)
      setCompletionDate('')
    }
    save({ completed: value, completionDate: value ? completionDate : '', uploadedToRsa: value ? uploadedToRsa : false, notes })
  }

  function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setCompletionDate(value)
    save({ completed, completionDate: value, uploadedToRsa, notes })
  }

  function handleUploadedChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.checked
    setUploadedToRsa(value)
    save({ completed, completionDate, uploadedToRsa: value, notes })
  }

  function handleNotesChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const value = e.target.value
    setNotes(value)
    save({ completed, completionDate, uploadedToRsa, notes: value })
  }

  return (
    <tr className={`border-b border-gray-100 last:border-0 transition-colors ${completed ? 'bg-white' : 'bg-gray-50/50'}`}>
      {/* Lesson number */}
      <td className="py-3 pl-4 pr-2 w-10">
        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${completed ? 'bg-brand text-white' : 'bg-gray-200 text-gray-500'}`}>
          {lesson.lesson_number}
        </span>
      </td>

      {/* Lesson name */}
      <td className="py-3 px-3">
        <span className={`text-sm ${completed ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
          {lessonName}
        </span>
      </td>

      {/* Completed checkbox */}
      <td className="py-3 px-3 text-center w-24">
        <input
          type="checkbox"
          checked={completed}
          onChange={handleCompletedChange}
          className="w-4 h-4 accent-brand rounded cursor-pointer"
          aria-label={`Mark lesson ${lesson.lesson_number} as completed`}
        />
      </td>

      {/* Completion date */}
      <td className="py-3 px-3 w-44">
        <input
          type="date"
          value={completionDate}
          onChange={handleDateChange}
          disabled={!completed}
          className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors disabled:bg-gray-50 disabled:text-gray-300 disabled:cursor-not-allowed"
        />
      </td>

      {/* Uploaded to RSA */}
      <td className="py-3 px-3 text-center w-28">
        <input
          type="checkbox"
          checked={uploadedToRsa}
          onChange={handleUploadedChange}
          disabled={!completed}
          className="w-4 h-4 accent-brand rounded cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
          aria-label={`Mark lesson ${lesson.lesson_number} as uploaded to RSA`}
        />
      </td>

      {/* Notes */}
      <td className="py-3 px-3 pr-4">
        <textarea
          value={notes}
          onChange={handleNotesChange}
          rows={1}
          placeholder="Notes…"
          className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors resize-none"
        />
      </td>

      {/* Save status */}
      <td className="py-3 px-3 w-16 text-right">
        {saveStatus === 'saving' && (
          <svg className="w-4 h-4 text-gray-400 animate-spin inline" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {saveStatus === 'saved' && (
          <svg className="w-4 h-4 text-brand inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )}
        {saveStatus === 'error' && (
          <svg className="w-4 h-4 text-red-500 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
      </td>
    </tr>
  )
}
