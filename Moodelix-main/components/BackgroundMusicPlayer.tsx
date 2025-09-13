'use client'

import { useRef, useEffect, useState } from 'react'

interface BackgroundMusicPlayerProps {
  url: string
  type: 'youtube' | 'spotify'
  isVisible: boolean
  isPlaying: boolean
  onMinimize: () => void
  blurIntensity?: number
}

export default function BackgroundMusicPlayer({ url, type, isVisible, isPlaying, onMinimize, blurIntensity = 10 }: BackgroundMusicPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [size, setSize] = useState({ width: 480, height: 288 }) // Medium default size

  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        if (type === 'youtube') {
          // YouTube iframe API commands with better performance
          iframeRef.current.contentWindow.postMessage(
            JSON.stringify({
              event: 'command',
              func: isPlaying ? 'playVideo' : 'pauseVideo',
              args: []
            }),
            '*'
          )
          
          // Additional YouTube optimizations
          if (isPlaying) {
            iframeRef.current.contentWindow.postMessage(
              JSON.stringify({
                event: 'command',
                func: 'setPlaybackQuality',
                args: ['medium']
              }),
              '*'
            )
          }
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

  if (!url) return null

  // Ensure smooth YouTube playback by preloading
  const enhancedUrl = type === 'youtube' && url.includes('youtube.com/embed') 
    ? `${url}&enablejsapi=1&origin=${window.location.origin}&rel=0&controls=1&showinfo=1&iv_load_policy=1&playsinline=1&autoplay=1&mute=0&vq=medium&preload=auto&buffering=1`
    : url

  return (
    <div 
      className={`fixed bottom-20 right-6 z-30 bg-black/30 border border-white/20 rounded-xl overflow-hidden shadow-2xl transition-all duration-300 ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
      }`}
      style={{ 
        width: size.width, 
        height: size.height,
        backdropFilter: `blur(${blurIntensity}px)`
      }}
    >
      <div className="p-3 bg-white/5 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              type === 'youtube' ? 'bg-red-500' : 'bg-green-500'
            } ${isPlaying ? 'animate-pulse' : ''}`} />
            <span className="text-white/70 text-xs font-medium capitalize">
              {type}
            </span>
            
            {/* Simple Size Buttons */}
            <div className="flex gap-1 ml-2">
              <button
                onClick={() => setSize({ width: 400, height: 240 })}
                className="px-2 py-1 text-xs bg-white/10 hover:bg-white/20 text-white/70 hover:text-white rounded transition-colors"
                title="Compact Size"
              >
                Compact
              </button>
              <button
                onClick={() => setSize({ width: 600, height: 360 })}
                className="px-2 py-1 text-xs bg-white/10 hover:bg-white/20 text-white/70 hover:text-white rounded transition-colors"
                title="Large Size"
              >
                Large
              </button>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {/* Minimize Button */}
            <button
              onClick={onMinimize}
              className="text-white/60 hover:text-white transition-colors p-1 hover:bg-white/10 rounded"
              title="Minimize to Music Button"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <div className="w-full h-full">
        <iframe
          ref={iframeRef}
          className="w-full h-full"
          src={enhancedUrl}
          title={`Background ${type} player`}
          allow={type === 'youtube' 
            ? "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; autoplay=1; fullscreen"
            : "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          }
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
      

    </div>
  )
}
