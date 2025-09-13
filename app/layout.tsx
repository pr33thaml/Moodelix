import './globals.css'
import type { Metadata } from 'next'
import { SupabaseAuthProvider } from '@/lib/SupabaseAuthContext'

export const metadata: Metadata = {
  title: 'Moodelix',
  description: 'Focus dashboard with mood playlists, tasks, and live wallpapers',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <SupabaseAuthProvider>
          {children}
        </SupabaseAuthProvider>
      </body>
    </html>
  )
}


