import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Moodboard Focus',
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
        {children}
      </body>
    </html>
  )
}


