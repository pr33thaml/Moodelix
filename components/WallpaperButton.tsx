'use client'

import { useEffect, useState } from 'react'
import { wallpapers as staticWallpapers } from '@/lib/wallpaperData'

export default function WallpaperButton({ 
  onWallpaperChange, 
  wallpapers, 
  buttonSize = 'medium',
  onClick 
}: { 
  onWallpaperChange?: (url: string) => void, 
  wallpapers: string[]
  buttonSize?: 'small' | 'medium' | 'large'
  onClick?: () => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'live' | 'photo'>('live')
  const [formattedWallpapers, setFormattedWallpapers] = useState<Array<{
    key: string
    label: string
    url: string
    thumbnail: string
    type: 'video' | 'image'
    isS3Thumbnail?: boolean
  }>>([])
  const [loading, setLoading] = useState(false)

  // Format wallpapers from prop
  useEffect(() => {
    if (wallpapers && wallpapers.length > 0) {
      const formatted = wallpapers.map((url: string, index: number) => {
        const filename = url.split('/').pop() || ''
        const name = filename.split('.')[0] || 'Unknown'
        const type = url.match(/\.(mp4|webm|mov)$/i) ? 'video' : 'image'
        
        // Try to find a matching wallpaper object to get the proper name and thumbnail
        const wallpaperData = staticWallpapers.find((w: any) => w.url === url)
        
        return {
          key: `wallpaper-${index}`,
          label: wallpaperData?.name || name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          url: url,
          thumbnail: wallpaperData?.thumbnail || url,
          type: type,
          isS3Thumbnail: wallpaperData?.thumbnail?.startsWith('live-wallpapers/') || wallpaperData?.thumbnail?.startsWith('photo-wallpaper/')
        }
      })
      setFormattedWallpapers(formatted as {
        key: string
        label: string
        url: string
        thumbnail: string
        type: 'video' | 'image'
        isS3Thumbnail?: boolean
      }[])
    }
  }, [wallpapers])

  const handleThemeSelect = (url: string, label: string) => {
    console.log('Wallpaper selected:', label, url)
    onClick?.()
    if (onWallpaperChange) {
      onWallpaperChange(url)
    }
    setIsOpen(false)
    setPreviewUrl(null)
  }

  const handleButtonClick = () => {
    console.log('Wallpaper button clicked!')
    setIsOpen(!isOpen)
  }

  // Filter wallpapers by type
  const liveWallpapers = formattedWallpapers.filter(w => w.type === 'video')
  const photoWallpapers = formattedWallpapers.filter(w => w.type === 'image')

  const getButtonSizeClasses = () => {
    switch (buttonSize) {
      case 'small':
        return 'w-12 h-12 text-xs'
      case 'large':
        return 'w-16 h-16 text-base'
      default: // medium
        return 'w-14 h-14 text-sm'
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => {
          onClick?.()
          handleButtonClick()
        }}
        className={`link ${getButtonSizeClasses()}`}
      >
        <span className="link-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" fill="currentColor" viewBox="0 0 256 256">
            <rect width="256" height="256" fill="none"></rect>
            <rect x="40" y="40" width="176" height="176" rx="16" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></rect>
            <path d="M40,168l32-32,32,32,48-48,32,32,32-32v48H40Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></path>
            <circle cx="100" cy="92" r="12" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></circle>
          </svg>
        </span>
        <span className="link-title">Theme</span>
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 bg-black/30 border border-white/20 rounded-lg p-3 min-w-[320px] z-[100] backdrop-blur-sm">
          <div className="text-white text-sm font-medium mb-3">Select Wallpaper</div>
          
          {/* Tab Navigation */}
          <div className="flex mb-3 border-b border-white/20">
            <button
              onClick={() => {
                onClick?.()
                setActiveTab('live')
              }}
              className={`px-3 py-2 text-xs font-medium transition-colors ${
                activeTab === 'live' 
                  ? 'text-white border-b-2 border-white' 
                  : 'text-white/80'
              }`}
            >
              Live ({liveWallpapers.length})
            </button>
            <button
              onClick={() => {
                onClick?.()
                setActiveTab('photo')
              }}
              className={`px-3 py-2 text-xs font-medium transition-colors ${
                activeTab === 'photo' 
                  ? 'text-white border-b-2 border-white' 
                  : 'text-white/80'
              }`}
            >
              Photo ({photoWallpapers.length})
            </button>
          </div>

          {loading ? (
            <div className="text-white/60 text-sm">Loading wallpapers...</div>
          ) : (
            <>
              {/* Preview Section */}
              {previewUrl && (
                <div className="mb-3 p-2 bg-white/10 rounded-lg">
                  {previewUrl.match(/\.(mp4|webm|mov)$/i) ? (
                    <video 
                      src={previewUrl} 
                      className="w-full h-28 object-cover rounded"
                      autoPlay 
                      muted 
                      loop 
                      playsInline
                    />
                  ) : (
                    <img 
                      src={previewUrl} 
                      className="w-full h-28 object-cover rounded"
                      alt="Preview"
                    />
                  )}
                </div>
              )}
              
              {/* Live Wallpapers Tab */}
              {activeTab === 'live' && (
                <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                  {liveWallpapers.length === 0 ? (
                    <div className="text-white/40 text-sm text-center py-4">No live wallpapers found</div>
                  ) : (
                    liveWallpapers.map((wallpaper) => (
                      <button
                        key={wallpaper.key}
                        onClick={() => handleThemeSelect(wallpaper.url, wallpaper.label)}
                        onMouseEnter={() => setPreviewUrl(wallpaper.url)}
                        onMouseLeave={() => setPreviewUrl(null)}
                        className="w-full flex items-center gap-3 p-2 rounded text-sm transition-colors text-white/80 hover:bg-white/10 hover:text-white"
                      >
                        <div className="w-12 h-8 bg-white/10 rounded overflow-hidden flex-shrink-0">
                          <video 
                            src={wallpaper.thumbnail} 
                            className="w-full h-full object-cover"
                            muted 
                            loop 
                            playsInline
                          />
                        </div>
                        <span className="text-left text-xs">{wallpaper.label}</span>
                      </button>
                    ))
                  )}
                </div>
              )}

              {/* Photo Wallpapers Tab */}
              {activeTab === 'photo' && (
                <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                  {photoWallpapers.length === 0 ? (
                    <div className="text-white/40 text-sm text-center py-4">No photo wallpapers found</div>
                  ) : (
                    photoWallpapers.map((wallpaper) => (
                      <button
                        key={wallpaper.key}
                        onClick={() => handleThemeSelect(wallpaper.url, wallpaper.label)}
                        onMouseEnter={() => setPreviewUrl(wallpaper.url)}
                        onMouseLeave={() => setPreviewUrl(null)}
                        className="w-full flex items-center gap-3 p-2 rounded text-sm transition-colors text-white/80 hover:bg-white/10 hover:text-white"
                      >
                        <div className="w-12 h-8 bg-white/10 rounded overflow-hidden flex-shrink-0">
                          {wallpaper.isS3Thumbnail ? (
                            <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
                              <span className="text-white/60 text-xs">📷</span>
                            </div>
                          ) : (
                            <img 
                              src={wallpaper.thumbnail} 
                              className="w-full h-full object-cover"
                              alt={wallpaper.label}
                            />
                          )}
                        </div>
                        <span className="text-left text-xs">{wallpaper.label}</span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
