import React from 'react'
import WallpaperButton from '@/components/WallpaperButton'
import { useSupabaseAuth } from '@/lib/SupabaseAuthContext'

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
            if (!user) {
              signIn()
            }
          }}
          className={`link ${getButtonSizeClasses()}`}
          title={user ? "User Profile" : "Sign In to Sync Data"}
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
          <span className="link-title">{user ? user.name?.split(' ')[0] || "Profile" : "Sign In"}</span>
        </button>

        {/* User Profile Dropdown - Only show when signed in */}
        {user && (
          <div className="absolute bottom-full left-0 mb-2 w-64 bg-black/30 border border-white/20 rounded-lg p-4 z-[100]">
            <div className="flex items-center gap-3 mb-4">
              {user.image_url ? (
                <img
                  src={user.image_url}
                  alt={user.name}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
              )}
              <div>
                <p className="text-white font-medium">{user.name}</p>
                <p className="text-white/60 text-xs">{user.email}</p>
              </div>
            </div>

            <div className="space-y-3 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-white/80">Current Streak:</span>
                <span className="text-white font-medium">{user.streakData.current_streak} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/80">Total Hours:</span>
                <span className="text-white font-medium">{user.streakData.total_focused_hours.toFixed(1)}h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/80">Today's Progress:</span>
                <span className="text-white font-medium">
                  {user.streakData.today_focused_minutes}min / {user.streakData.daily_goal * 60}min
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/20">
              <button
                onClick={() => {
                  onClick?.()
                  signOut()
                }}
                className="w-full px-3 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-300 text-sm font-medium transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


