import WallpaperButton from '@/components/WallpaperButton'
import { useState } from 'react'

export default function CenterMenu({ onMusic, onWallpaperChange, onTodo }: { onMusic?: () => void, onWallpaperChange?: (url: string) => void, onTodo?: () => void }) {

  const handleWallpaperChange = (url: string) => {
    console.log('Wallpaper change requested:', url)
    if (onWallpaperChange) {
      onWallpaperChange(url)
    }
  }

  return (
    <>
      <div className="center-menu p-3">
        <div className="menu">
          <a href="#" className="link" onClick={(e)=>{ e.preventDefault(); onMusic && onMusic(); }}>
            <span className="link-icon">
              {/* YouTube icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 256 256" fill="currentColor">
                <rect width="256" height="256" fill="none"></rect>
                <path d="M230.3,84.2a32,32,0,0,0-22.5-22.6C191.7,56,128,56,128,56s-63.7,0-79.8,5.6A32,32,0,0,0,25.7,84.2C20,100.3,20,128,20,128s0,27.7,5.7,43.8a32,32,0,0,0,22.5,22.6C64.3,200,128,200,128,200s63.7,0,79.8-5.6a32,32,0,0,0,22.5-22.6C236,155.7,236,128,236,128S236,100.3,230.3,84.2Z"></path>
                <polygon points="112 160 160 128 112 96 112 160" fill="#000"></polygon>
              </svg>
            </span>
            <span className="link-title">YouTube</span>
          </a>
          <button 
            onClick={() => onTodo && onTodo()} 
            className="link"
          >
            <span className="link-icon">
              {/* Book icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" fill="currentColor" viewBox="0 0 256 256">
                <rect width="256" height="256" fill="none"></rect>
                <path d="M48,40H208a8,8,0,0,1,8,8V200a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V48A8,8,0,0,1,48,40Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></path>
                <path d="M48,40V88a8,8,0,0,0,8,8H200a8,8,0,0,0,8-8V40" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></path>
                <line x1="88" y1="104" x2="168" y2="104" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></line>
                <line x1="88" y1="136" x2="168" y2="136" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></line>
                <line x1="88" y1="168" x2="120" y2="168" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></line>
              </svg>
            </span>
            <span className="link-title">Todo</span>
          </button>

          {onWallpaperChange && (
            <WallpaperButton onWallpaperChange={handleWallpaperChange} />
          )}
        </div>
      </div>


    </>
  )
}


