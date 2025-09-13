'use client'

import { useState } from 'react'

interface YouTubeMoodPlayerProps {
  onVideoChange?: (videoId: string) => void
}

export default function YouTubeMoodPlayer({ onVideoChange }: YouTubeMoodPlayerProps) {
  const [videoUrl, setVideoUrl] = useState('')
  const [currentVideoId, setCurrentVideoId] = useState('UI5NKkW8acM') // Default to your live stream
  const [error, setError] = useState('')

  const extractVideoId = (url: string): string | null => {
    // Handle various YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/live\/([a-zA-Z0-9_-]{11})/
    ]
    
    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) return match[1]
    }
    return null
  }

  const handleVideoSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!videoUrl.trim()) {
      setError('Please enter a YouTube video URL')
      return
    }

    const videoId = extractVideoId(videoUrl)
    if (!videoId) {
      setError('Invalid YouTube URL. Please check the link and try again.')
      return
    }

    setCurrentVideoId(videoId)
    setVideoUrl('')
    
    if (onVideoChange) {
      onVideoChange(videoId)
    }
  }

  return (
    <div className="bg-white/10 border border-white/10 rounded-xl p-3 w-full max-w-2xl">
      {/* Search Input */}
      <form onSubmit={handleVideoSubmit} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="Paste YouTube video URL here..."
            className="flex-1 px-3 py-2 bg-white/20 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
          >
            Play
          </button>
        </div>
        {error && (
          <p className="text-red-400 text-sm mt-2">{error}</p>
        )}
      </form>

      {/* Current Video Info */}
      <div className="mb-3 p-2 bg-white/10 rounded-lg">
        <p className="text-white/80 text-sm">
          <span className="font-medium">Current Video:</span> {currentVideoId}
        </p>
        <p className="text-white/60 text-xs mt-1">
          This will update the background mini player
        </p>
      </div>

      {/* Video Player */}
      <div className="aspect-video w-full overflow-hidden rounded-lg">
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=0&mute=0&controls=1&modestbranding=1&rel=0&showinfo=0`}
          title="YouTube player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>

      {/* Help Text */}
      <div className="mt-3 text-center">
        <p className="text-white/60 text-xs">
          💡 Paste any YouTube video link above to change the background music
        </p>
      </div>
    </div>
  )
}


