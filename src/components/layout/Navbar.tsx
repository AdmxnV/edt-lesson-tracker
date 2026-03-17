'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useTheme } from './ThemeProvider'

interface NavbarProps {
  email?: string
}

const navLinks = [
  { href: '/', label: 'Overview' },
  { href: '/students', label: 'Students' },
]

export default function Navbar({ email }: NavbarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { dark, toggle } = useTheme()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">

          {/* Left: logo + nav links */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand">
                <svg className="w-4.5 h-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white text-sm">EDT Tracker</span>
            </Link>

            {email && (
              <nav className="flex items-center gap-1">
                {navLinks.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive(href)
                        ? 'bg-brand/10 text-brand dark:bg-brand/20 dark:text-blue-400'
                        : 'text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            )}
          </div>

          {/* Right: dark mode toggle + user */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggle}
              className="p-2 rounded-lg text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {dark ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {email && (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500 dark:text-slate-400 hidden sm:block">{email}</span>
                <button
                  onClick={handleSignOut}
                  className="text-sm text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-white font-medium transition-colors"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  )
}
