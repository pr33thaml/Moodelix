import React, { useState } from 'react'
import WallpaperButton from '@/components/WallpaperButton'
import { useSupabaseAuth } from '@/lib/SupabaseAuthContext'
import UserPanel from './UserPanel'

interface CenterMenuProps {
  onMusic: () => void
  onWallpaperChange: (url: string) => void
  onTodo: () => void
  onFocus: () => void
  onHome: () => void
  wallpapers: string[]
  buttonSize?: 'small' | 'medium' | 'large'
  onClick?: () => void
  blurIntensity?: number
}

export default function CenterMenu({ onMusic, onWallpaperChange, onTodo, onFocus, onHome, wallpapers, buttonSize = 'medium', onClick, blurIntensity = 10 }: CenterMenuProps) {
  const { user, signIn, signOut } = useSupabaseAuth()
  const [showUserPanel, setShowUserPanel] = useState(false)
  
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
    <div className="center-menu">
      <button 
        onClick={() => {
          onClick?.()
          onHome && onHome()
        }}
        className={`link ${getButtonSizeClasses()}`}
      >
        <span className="link-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="192"
            height="192"
            fill="currentColor"
            viewBox="0 0 256 256"
          >
            <rect width="256" height="256" fill="none"></rect>
            <path d="M213.3815,109.61945,133.376,36.88436a8,8,0,0,0-10.76339.00036l-79.9945,72.73477A8,8,0,0,0,40,115.53855V208a8,8,0,0,0,8,8H208a8,8,0,0,0,8-8V115.53887A8,8,0,0,0,213.3815,109.61945Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></path>
          </svg>
        </span>
        <span className="link-title">Home</span>
      </button>

      <button 
        onClick={() => {
          onClick?.()
          onTodo && onTodo()
        }}
        className={`link ${getButtonSizeClasses()}`}
      >
        <span className="link-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="192"
            height="192"
            fill="currentColor"
            viewBox="0 0 256 256"
          >
            <rect width="256" height="256" fill="none"></rect>
            <rect x="40" y="40" width="176" height="176" rx="8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></rect>
            <circle cx="68" cy="92" r="8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></circle>
            <circle cx="68" cy="128" r="8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></circle>
            <circle cx="68" cy="164" r="8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></circle>
            <line x1="96" y1="92" x2="192" y2="92" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></line>
            <line x1="96" y1="128" x2="192" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></line>
            <line x1="96" y1="164" x2="160" y2="164" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></line>
          </svg>
        </span>
        <span className="link-title">Todo</span>
      </button>

      <button 
        onClick={() => {
          onClick?.()
          onMusic && onMusic()
        }}
        className={`link ${getButtonSizeClasses()}`}
      >
        <span className="link-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="192"
            height="192"
            fill="currentColor"
            viewBox="0 0 256 256"
          >
            <rect width="256" height="256" fill="none"></rect>
            <path d="M88,64V208a24,24,0,1,1-16-22.62V64a8,8,0,0,1,16,0Z" fill="currentColor"></path>
            <path d="M168,32V176a24,24,0,1,1-16-22.62V80L88,96V64l80-32Z" fill="currentColor"></path>
          </svg>
        </span>
        <span className="link-title">Music</span>
      </button>

      <button 
        onClick={() => {
          onClick?.()
          onFocus && onFocus()
        }}
        className={`link ${getButtonSizeClasses()}`}
      >
        <span className="link-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="192"
            height="192"
            fill="currentColor"
            viewBox="0 0 256 256"
          >
            <rect width="256" height="256" fill="none"></rect>
            <circle cx="128" cy="128" r="88" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></circle>
            <circle cx="128" cy="128" r="56" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></circle>
            <circle cx="128" cy="128" r="24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></circle>
            <circle cx="128" cy="128" r="8" fill="currentColor"></circle>
          </svg>
        </span>
        <span className="link-title">Focus</span>
      </button>

      <WallpaperButton 
        onWallpaperChange={onWallpaperChange} 
        wallpapers={wallpapers}
        buttonSize={buttonSize}
        onClick={onClick}
        blurIntensity={blurIntensity}
      />

      {/* User Profile Button - Show for both authenticated and non-authenticated users */}
      <div className="relative">
        <button 
          onClick={() => {
            onClick?.()
            setShowUserPanel(true)
          }}
          className={`link ${getButtonSizeClasses()}`}
          title={user ? "User Profile" : "User Account"}
        >
          <span className="link-icon">
            {user ? (
              // Show user's profile picture or initials
              user.image_url ? (
                <img
                  src={user.image_url}
                  alt={user.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
              )
            ) : (
              // User profile icon for non-authenticated users
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="192"
                height="192"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <rect width="256" height="256" fill="none"></rect>
                <circle cx="128" cy="96" r="64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></circle>
                <path d="M31,216a112,112,0,0,1,194,0" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></path>
              </svg>
            )}
          </span>
          <span className="link-title">{user ? (user.name || 'User') : 'User'}</span>
        </button>
      </div>

      {/* User Panel */}
      <UserPanel
        isOpen={showUserPanel}
        onClose={() => setShowUserPanel(false)}
        onClick={onClick}
        blurIntensity={blurIntensity}
      />
    </div>
  )
}


