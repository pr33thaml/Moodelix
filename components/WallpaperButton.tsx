'use client'

import { useState } from 'react'

export default function WallpaperButton({ onWallpaperChange }: { onWallpaperChange: (url: string) => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleThemeSelect = (url: string, label: string) => {
    console.log('Wallpaper selected:', label, url)
    onWallpaperChange(url)
    setIsOpen(false)
    setPreviewUrl(null)
  }

  const handleButtonClick = () => {
    console.log('Wallpaper button clicked!')
    setIsOpen(!isOpen)
  }

  const wallpapers = [
    {
      key: "autumn-fuji",
      label: "Autumn Fuji",
      url: "/wallpaper/autumn-fuji-moewalls-com.mp4",
      thumbnail: "/wallpaper/autumn-fuji-moewalls-com.mp4"
    },
    {
      key: "cherry-blossom",
      label: "Cherry Blossom",
      url: "/wallpaper/cherry-blossom-tree-on-volcano-moewalls-com.mp4",
      thumbnail: "/wallpaper/cherry-blossom-tree-on-volcano-moewalls-com.mp4"
    },
    {
      key: "east-town",
      label: "East Town",
      url: "/wallpaper/japanese-town-cloudy-day-moewalls-com.mp4",
      thumbnail: "/wallpaper/japanese-town-cloudy-day-moewalls-com.mp4"
    },
    {
      key: "spring",
      label: "Spring",
      url: "/wallpaper/torii-gate-fuji-mountain-sakura-lake-moewalls-com.mp4",
      thumbnail: "/wallpaper/torii-gate-fuji-mountain-sakura-lake-moewalls-com.mp4"
    },
    {
      key: "winter-night",
      label: "Winter Night",
      url: "/wallpaper/winter-night-train-moewalls-com.mp4",
      thumbnail: "/wallpaper/winter-night-train-moewalls-com.mp4"
    }
  ]

  return (
    <div className="relative">
      <button
        onClick={handleButtonClick}
        className="link"
      >
        <span className="link-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" fill="currentColor" viewBox="0 0 256 256">
            <rect width="256" height="256" fill="none"></rect>
            <path d="M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM80,200a16,16,0,0,1-16-16V88a16,16,0,0,1,16-16h96a16,16,0,0,1,16,16v96a16,16,0,0,1-16,16Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></path>
            <circle cx="88" cy="72" r="8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></circle>
          </svg>
        </span>
        <span className="link-title">Wallpaper</span>
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 bg-black/90 border border-white/20 rounded-lg p-3 min-w-[280px] z-[100]">
          <div className="text-white text-sm font-medium mb-3">Select Wallpaper</div>
          
          {/* Preview Section */}
          {previewUrl && (
            <div className="mb-3 p-2 bg-white/10 rounded-lg">
              <div className="text-white text-xs mb-2">Preview:</div>
              <video 
                src={previewUrl} 
                className="w-full h-24 object-cover rounded"
                autoPlay 
                muted 
                loop 
                playsInline
              />
            </div>
          )}
          
          <div className="space-y-2">
            {wallpapers.map((wallpaper) => (
              <button
                key={wallpaper.key}
                onClick={() => handleThemeSelect(wallpaper.url, wallpaper.label)}
                onMouseEnter={() => setPreviewUrl(wallpaper.url)}
                onMouseLeave={() => setPreviewUrl(null)}
                className="w-full flex items-center gap-3 p-2 rounded text-sm transition-colors text-gray-300 hover:bg-white/10 hover:text-white"
              >
                <div className="w-12 h-8 bg-gray-800 rounded overflow-hidden flex-shrink-0">
                  <video 
                    src={wallpaper.thumbnail} 
                    className="w-full h-full object-cover"
                    muted 
                    loop 
                    playsInline
                  />
                </div>
                <span className="text-left">{wallpaper.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
