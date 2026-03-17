'use client'

import LessonRow from './LessonRow'
import { EDT_LESSONS } from '@/lib/constants'
import type { Lesson } from '@/lib/types'

interface LessonTableProps {
  lessons: Lesson[]
}

export default function LessonTable({ lessons }: LessonTableProps) {
  // Sort by lesson_number
  const sorted = [...lessons].sort((a, b) => a.lesson_number - b.lesson_number)

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-slate-700/50 border-b border-gray-200 dark:border-slate-700">
              <th className="py-3 pl-4 pr-2 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide w-10">#</th>
              <th className="py-3 px-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide">Lesson</th>
              <th className="py-3 px-3 text-center text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide w-24">Completed</th>
              <th className="py-3 px-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide w-44">Date</th>
              <th className="py-3 px-3 text-center text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide w-28">RSA Upload</th>
              <th className="py-3 px-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide">Notes</th>
              <th className="py-3 px-3 pr-4 w-16" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((lesson) => (
              <LessonRow
                key={lesson.id}
                lesson={lesson}
                lessonName={EDT_LESSONS[lesson.lesson_number - 1]}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
