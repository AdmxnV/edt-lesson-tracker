'use client'

import { useState, useTransition } from 'react'
import Modal from '@/components/ui/Modal'
import { addStudent } from '@/actions/students'

interface AddStudentModalProps {
  open: boolean
  onClose: () => void
}

export default function AddStudentModal({ open, onClose }: AddStudentModalProps) {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const form = e.currentTarget
    const formData = new FormData(form)

    startTransition(async () => {
      try {
        await addStudent(formData)
        form.reset()
        onClose()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to add student')
      }
    })
  }

  function handleClose() {
    setError(null)
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose} title="Add New Student">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors"
            placeholder="Jane Smith"
          />
        </div>

        <div>
          <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">
            Date of birth
          </label>
          <input
            id="dob"
            name="dob"
            type="date"
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors"
          />
        </div>

        <div>
          <label htmlFor="driver_number" className="block text-sm font-medium text-gray-700 mb-1">
            Driver number
          </label>
          <input
            id="driver_number"
            name="driver_number"
            type="text"
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors"
            placeholder="e.g. D12345678"
          />
        </div>

        <div>
          <label htmlFor="logbook_number" className="block text-sm font-medium text-gray-700 mb-1">
            Logbook number
          </label>
          <input
            id="logbook_number"
            name="logbook_number"
            type="text"
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors"
            placeholder="e.g. LB-2024-001"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 px-4 py-2.5 bg-brand text-white rounded-lg text-sm font-medium hover:bg-brand-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? 'Adding…' : 'Add Student'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
