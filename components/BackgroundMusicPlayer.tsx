'use client'

import { useRef, useEffect } from 'react'

interface BackgroundMusicPlayerProps {
  url: string
  type: 'youtube' | 'spotify'
  isVisible: boolean
  onClose?: () => void
  isPlaying: boolean
  onMinimize: () => void
}

export default function BackgroundMusicPlayer({ url, type, isVisible, onClose, isPlaying, onMinimize }: BackgroundMusicPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        if (type === 'youtube') {
          // YouTube iframe API commands
          iframeRef.current.contentWindow.postMessage(
            JSON.stringify({
              event: 'command',
              func: isPlaying ? 'playVideo' : 'pauseVideo'
            }),
            '*'
          )
        } else {
          // Spotify iframe API commands
          iframeRef.current.contentWindow.postMessage(
            JSON.stringify({
              event: 'command',
              func: isPlaying ? 'resume' : 'pause'
            }),
            '*'
          )
        }
      } catch (error) {
        console.log('Iframe control not available')
      }
    }
  }, [isPlaying, type])

  if (!url || !isVisible) return null

  return (
    <div className="fixed top-6 right-6 z-30 w-80 h-48 bg-black/30 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden shadow-2xl transition-all duration-300">
      <div className="p-3 bg-white/5 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              type === 'youtube' ? 'bg-red-500' : 'bg-green-500'
            } ${isPlaying ? 'animate-pulse' : ''}`} />
            <span className="text-white/70 text-xs font-medium capitalize">
              {type}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {/* Minimize Button */}
            <button
              onClick={onMinimize}
              className="text-white/60 hover:text-white transition-colors p-1 hover:bg-white/10 rounded"
              title="Minimize"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {/* Close Button */}
            {onClose && (
              <button
                onClick={onClose}
                className="text-white/60 hover:text-white transition-colors p-1 hover:bg-white/10 rounded"
                title="Close"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="w-full h-full">
        <iframe
          ref={iframeRef}
          className="w-full h-full"
          src={url}
          title={`Background ${type} player`}
          allow={type === 'youtube' 
            ? "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            : "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          }
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    </div>
  )
}
