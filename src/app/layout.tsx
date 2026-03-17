import type { Metadata } from 'next'
import './globals.css'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/layout/Navbar'

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
    <html lang="en">
      <body className="antialiased bg-gray-50 min-h-screen">
        {user && <Navbar email={user.email} />}
        {children}
      </body>
    </html>
  )
}
