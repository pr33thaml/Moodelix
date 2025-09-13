'use client'

import { useState, useEffect } from 'react'

interface MiniPlayerControlProps {
  isPlaying: boolean
  onToggle: () => void
  onClose: () => void
  onToggleBackground: () => void
  showBackground: boolean
  currentTrack?: {
    title: string
    platform: 'youtube' | 'spotify'
  }
}

export default function MiniPlayerControl({ 
  isPlaying, 
  onToggle, 
  onClose, 
  onToggleBackground,
  showBackground,
  currentTrack 
}: MiniPlayerControlProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isPlaying) {
      setIsVisible(true)
    } else {
      // Delay hiding to show the animation
      const timer = setTimeout(() => setIsVisible(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isPlaying])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-6 right-6 z-40 animate-in slide-in-from-bottom-2 duration-500">
      <div className="bg-black/40 backdrop-blur-md border border-white/20 rounded-full p-3 shadow-lg hover:scale-105 transition-transform duration-300">
        <div className="flex items-center gap-3">
          {/* Play/Pause Button */}
          <button
            onClick={onToggle}
            className={`w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 ${
              isPlaying ? 'animate-pulse' : ''
            }`}
          >
            {isPlaying ? (
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
              </svg>
            ) : (
              <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>

          {/* Track Info */}
          {currentTrack && (
            <div className="text-white min-w-0">
              <div className="text-sm font-medium truncate max-w-32">
                {currentTrack.title}
              </div>
              <div className="text-xs text-white/60 capitalize">
                {currentTrack.platform}
              </div>
            </div>
          )}

          {/* Background Toggle Button */}
          <button
            onClick={onToggleBackground}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 ${
              showBackground ? 'bg-white/30 text-white' : 'bg-white/10 text-white/60'
            }`}
            title={showBackground ? 'Hide Background Player' : 'Show Background Player'}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
          >
            <svg className="w-4 h-4 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
