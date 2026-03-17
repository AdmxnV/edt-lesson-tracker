'use client'

import { useState, useTransition, useRef } from 'react'
import Modal from '@/components/ui/Modal'
import { importStudentsFromCsv, type CsvStudentRow } from '@/actions/csv'

interface CsvUploadModalProps {
  open: boolean
  onClose: () => void
}

function parseDate(raw: string): string | null {
  if (!raw?.trim()) return null
  // Accept DD/MM/YYYY or YYYY-MM-DD
  const dmyMatch = raw.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (dmyMatch) {
    const [, d, m, y] = dmyMatch
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`
  }
  const isoMatch = raw.trim().match(/^\d{4}-\d{2}-\d{2}$/)
  if (isoMatch) return raw.trim()
  return null
}

function parseCsv(text: string): CsvStudentRow[] {
  const lines = text.trim().split(/\r?\n/).filter(Boolean)
  if (lines.length < 2) return []

  // Normalise header names
  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/\s+/g, '_'))

  const nameIdx = headers.findIndex((h) => h === 'name' || h === 'full_name')
  const dobIdx = headers.findIndex((h) => h === 'dob' || h === 'date_of_birth')
  const driverIdx = headers.findIndex((h) => h === 'driver_number' || h === 'driver_no')
  const logbookIdx = headers.findIndex((h) => h === 'logbook_number' || h === 'logbook_no')
  const typeIdx = headers.findIndex((h) => h === 'student_type' || h === 'type')

  const validTypes = ['full', 'transfer', 'pre_test', 'external']

  if (nameIdx === -1) return []

  return lines.slice(1).reduce<CsvStudentRow[]>((acc, line) => {
    const cols = line.split(',').map((c) => c.trim().replace(/^"|"$/g, ''))
    const name = nameIdx >= 0 ? cols[nameIdx] : ''
    if (!name) return acc
    const rawType = typeIdx >= 0 ? cols[typeIdx]?.toLowerCase() : ''
    const student_type = validTypes.includes(rawType)
      ? (rawType as 'full' | 'transfer' | 'pre_test' | 'external')
      : undefined
    acc.push({
      name,
      dob: dobIdx >= 0 ? parseDate(cols[dobIdx]) : null,
      driver_number: driverIdx >= 0 ? cols[driverIdx] || null : null,
      logbook_number: logbookIdx >= 0 ? cols[logbookIdx] || null : null,
      student_type,
    })
    return acc
  }, [])
}

export default function CsvUploadModal({ open, onClose }: CsvUploadModalProps) {
  const [csvText, setCsvText] = useState('')
  const [preview, setPreview] = useState<CsvStudentRow[]>([])
  const [parseError, setParseError] = useState<string | null>(null)
  const [importError, setImportError] = useState<string | null>(null)
  const [success, setSuccess] = useState<number | null>(null)
  const [isPending, startTransition] = useTransition()
  const fileRef = useRef<HTMLInputElement>(null)

  function handleTextChange(text: string) {
    setCsvText(text)
    setParseError(null)
    setImportError(null)
    setSuccess(null)
    if (!text.trim()) { setPreview([]); return }
    const rows = parseCsv(text)
    if (!rows.length) {
      setParseError('Could not parse CSV. Make sure the first row has a "name" column header.')
      setPreview([])
    } else {
      setPreview(rows)
    }
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => handleTextChange(ev.target?.result as string)
    reader.readAsText(file)
  }

  function handleImport() {
    if (!preview.length) return
    setImportError(null)
    startTransition(async () => {
      try {
        const { count } = await importStudentsFromCsv(preview)
        setSuccess(count)
        setCsvText('')
        setPreview([])
      } catch (err) {
        setImportError(err instanceof Error ? err.message : 'Import failed')
      }
    })
  }

  function handleClose() {
    setCsvText('')
    setPreview([])
    setParseError(null)
    setImportError(null)
    setSuccess(null)
    if (fileRef.current) fileRef.current.value = ''
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose} title="Import Students via CSV">
      <div className="space-y-4">

        {/* Format hint */}
        <div className="bg-brand/5 border border-brand/20 rounded-xl p-3.5 text-xs text-gray-600 space-y-1">
          <p className="font-medium text-brand">Expected CSV format</p>
          <p className="font-mono text-gray-500">name,dob,driver_number,logbook_number</p>
          <p className="font-mono text-gray-500">Jane Smith,15/06/1998,D12345678,LB-001</p>
          <p className="mt-1 text-gray-400">Date: DD/MM/YYYY or YYYY-MM-DD. Only <span className="font-medium">name</span> is required.</p>
        </div>

        {/* File picker */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Upload a .csv file</label>
          <input
            ref={fileRef}
            type="file"
            accept=".csv,text/csv"
            onChange={handleFile}
            className="block w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-brand file:text-white hover:file:bg-brand-dark file:cursor-pointer transition-colors"
          />
        </div>

        {/* Or paste */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Or paste CSV text</label>
          <textarea
            rows={5}
            value={csvText}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="name,dob,driver_number,logbook_number&#10;Jane Smith,15/06/1998,D12345678,LB-001"
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors resize-none"
          />
        </div>

        {/* Parse error */}
        {parseError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
            {parseError}
          </div>
        )}

        {/* Import error */}
        {importError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
            {importError}
          </div>
        )}

        {/* Success */}
        {success !== null && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-2 rounded-lg text-sm font-medium">
            {success} student{success !== 1 ? 's' : ''} imported successfully!
          </div>
        )}

        {/* Preview table */}
        {preview.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              Preview — {preview.length} student{preview.length !== 1 ? 's' : ''} found
            </p>
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-xs">
                <thead className="bg-gray-50 text-gray-500 uppercase tracking-wide">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium">Name</th>
                    <th className="px-3 py-2 text-left font-medium">DOB</th>
                    <th className="px-3 py-2 text-left font-medium">Driver No.</th>
                    <th className="px-3 py-2 text-left font-medium">Logbook No.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {preview.slice(0, 8).map((row, i) => (
                    <tr key={i} className="bg-white">
                      <td className="px-3 py-2 font-medium text-gray-800">{row.name}</td>
                      <td className="px-3 py-2 text-gray-500">{row.dob ?? '—'}</td>
                      <td className="px-3 py-2 text-gray-500">{row.driver_number ?? '—'}</td>
                      <td className="px-3 py-2 text-gray-500">{row.logbook_number ?? '—'}</td>
                    </tr>
                  ))}
                  {preview.length > 8 && (
                    <tr className="bg-gray-50">
                      <td colSpan={4} className="px-3 py-2 text-gray-400 text-center">
                        …and {preview.length - 8} more
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {success !== null ? 'Close' : 'Cancel'}
          </button>
          <button
            type="button"
            onClick={handleImport}
            disabled={isPending || !preview.length}
            className="flex-1 px-4 py-2.5 bg-brand text-white rounded-lg text-sm font-medium hover:bg-brand-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'Importing…' : `Import ${preview.length > 0 ? preview.length : ''} Student${preview.length !== 1 ? 's' : ''}`}
          </button>
        </div>
      </div>
    </Modal>
  )
}
