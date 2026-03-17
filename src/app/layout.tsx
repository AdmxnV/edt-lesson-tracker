import type { Metadata } from 'next'
import './globals.css'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/layout/Navbar'
import ThemeProvider from '@/components/layout/ThemeProvider'

export const metadata: Metadata = {
  title: 'EDT Lesson Tracker',
  description: 'Track Essential Driver Training lessons for RSA compliance',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-gray-50 dark:bg-slate-900 min-h-screen">
        <ThemeProvider>
          {user && <Navbar email={user.email} />}
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
