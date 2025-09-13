'use client'

import { useState } from 'react'

interface EnhancedMusicPlayerProps {
  onClose: () => void
  onMusicPlay: (platform: 'youtube' | 'spotify', title: string, embedUrl: string) => void
  isPlaying: boolean
  onTogglePlay: () => void
  blurIntensity?: number
}

export default function EnhancedMusicPlayer({ onClose, onMusicPlay, isPlaying, onTogglePlay, blurIntensity = 10 }: EnhancedMusicPlayerProps) {
  const [url, setUrl] = useState('')
  const [currentContent, setCurrentContent] = useState<{
    type: 'youtube' | 'spotify'
    id: string
    url: string
  } | null>(null)
  const [error, setError] = useState('')

  const detectPlatform = (url: string): { type: 'youtube' | 'spotify'; id: string } | null => {
    // YouTube patterns
    const youtubePatterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/live\/([a-zA-Z0-9_-]{11})/
    ]
    
    // Spotify patterns
    const spotifyPatterns = [
      /spotify\.com\/track\/([a-zA-Z0-9]+)/,
      /spotify\.com\/playlist\/([a-zA-Z0-9]+)/,
      /spotify\.com\/album\/([a-zA-Z0-9]+)/
    ]
    
    // Check YouTube first
    for (const pattern of youtubePatterns) {
      const match = url.match(pattern)
      if (match) return { type: 'youtube', id: match[1] }
    }
    
    // Check Spotify
    for (const pattern of spotifyPatterns) {
      const match = url.match(pattern)
      if (match) return { type: 'spotify', id: match[1] }
    }
    
    return null
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!url.trim()) {
      setError('Please enter a URL')
      return
    }

    const detected = detectPlatform(url)
    if (!detected) {
      setError('Invalid URL. Please enter a valid YouTube or Spotify link.')
      return
    }

    // Generate embed URL directly
    let embedUrl = ''
    if (detected.type === 'youtube') {
      embedUrl = `https://www.youtube.com/embed/${detected.id}?autoplay=1&mute=0&controls=1&rel=0&showinfo=1&iv_load_policy=1&vq=medium&preload=auto&buffering=1`
    } else {
      // Determine Spotify content type
      const isTrack = url.includes('/track/')
      const isPlaylist = url.includes('/playlist/')
      const isAlbum = url.includes('/album/')
      
      let contentType = 'track'
      if (isPlaylist) contentType = 'playlist'
      else if (isAlbum) contentType = 'album'
      
      embedUrl = `https://open.spotify.com/embed/${contentType}/${detected.id}?utm_source=generator`
    }
    
    setCurrentContent({
      type: detected.type,
      id: detected.id,
      url: url
    })
    
    // Trigger music play with the generated URL
    onMusicPlay(detected.type, detected.type === 'youtube' ? 'YouTube Video' : 'Spotify Music', embedUrl)
    
    setUrl('')
    setError('')
  }

  const getEmbedUrl = () => {
    if (!currentContent) return ''
    
    if (currentContent.type === 'youtube') {
      return `https://www.youtube.com/embed/${currentContent.id}?autoplay=1&mute=0&controls=1&rel=0&showinfo=1&iv_load_policy=1&vq=medium&preload=auto&buffering=1`
    } else {
      // Determine Spotify content type
      const isTrack = currentContent.url.includes('/track/')
      const isPlaylist = currentContent.url.includes('/playlist/')
      const isAlbum = currentContent.url.includes('/album/')
      
      let contentType = 'track'
      if (isPlaylist) contentType = 'playlist'
      else if (isAlbum) contentType = 'album'
      
      return `https://open.spotify.com/embed/${contentType}/${currentContent.id}?utm_source=generator`
    }
  }

  return (
    <div 
      className="bg-black/30 border border-white/20 rounded-xl p-6 w-full max-w-5xl backdrop-blur-sm"
      style={{ backdropFilter: `blur(${blurIntensity}px)` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-2xl font-semibold">Music Player</h2>
        <div className="flex items-center gap-3">
          {/* Play/Pause Button */}
          <button
            onClick={onTogglePlay}
            className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
              </svg>
            ) : (
              <svg className="w-5 h-5 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Single URL Input */}
      <div className="mb-6">
        <form onSubmit={handleSubmit}>
          <div className="flex gap-3">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste YouTube or Spotify URL here..."
              className="flex-1 px-4 py-3 bg-white/20 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 text-lg"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-white/20 hover:bg-white/30 border border-white/20 text-white rounded-lg transition-all duration-300 font-medium text-lg hover:scale-105"
            >
              Play
            </button>
          </div>
        </form>
        
        {error && (
          <p className="text-red-400 text-sm mt-3 text-center">{error}</p>
        )}
      </div>

      {/* Default Playlist Button */}
      <div className="mb-6">
        <button
          onClick={() => {
            const spotifyUrl = 'https://open.spotify.com/playlist/2Al9G2jrWkwDlRFMZaw1GX?si=34a5fce8b5364808'
            const embedUrl = 'https://open.spotify.com/embed/playlist/2Al9G2jrWkwDlRFMZaw1GX?utm_source=generator'
            setCurrentContent({
              type: 'spotify',
              id: '2Al9G2jrWkwDlRFMZaw1GX',
              url: spotifyUrl
            })
            onMusicPlay('spotify', 'Lofi Study Music', embedUrl)
          }}
          className="w-full px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg transition-all duration-300 font-medium text-lg hover:scale-105 flex items-center justify-center gap-3"
        >
          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
          Lofi Study Music
        </button>
      </div>

      {/* Content Display */}
      {currentContent && (
        <div className="space-y-4">
          {/* Platform Indicator */}
          <div className="flex items-center justify-center">
            <div className={`px-4 py-2 rounded-full text-white font-medium ${
              currentContent.type === 'youtube' 
                ? 'bg-red-600' 
                : 'bg-green-600'
            }`}>
              {currentContent.type === 'youtube' ? 'YouTube' : 'Spotify'}
            </div>
          </div>

          {/* Player */}
          <div className={`overflow-hidden rounded-lg ${
            currentContent.type === 'youtube' ? 'aspect-video' : 'h-80'
          }`}>
            <iframe
              className="w-full h-full"
              src={getEmbedUrl()}
              title={`${currentContent.type} player`}
              allow={currentContent.type === 'youtube' 
                ? "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                : "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              }
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="mt-6 text-center">
        <p className="text-white/60 text-sm">
          Supports YouTube videos and Spotify tracks, playlists, and albums
        </p>
      </div>
    </div>
  )
}
