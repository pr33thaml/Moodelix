'use client'

import { useState, useEffect } from 'react'
import { useSupabaseAuth } from '@/lib/SupabaseAuthContext'

interface UserPanelProps {
  isOpen: boolean
  onClose: () => void
  onClick?: () => void
  blurIntensity?: number
}

export default function UserPanel({ isOpen, onClose, onClick, blurIntensity = 10 }: UserPanelProps) {
  const { user, session, loading, signIn, signOut } = useSupabaseAuth()

  console.log('👤 UserPanel render - isOpen:', isOpen, 'user:', !!user, 'loading:', loading)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[99] bg-black/20" onClick={() => {
      console.log('👤 Backdrop clicked, closing panel')
      onClick?.()
      onClose()
    }}>
      <div 
        className="fixed top-32 right-8 bg-black/90 border-4 border-red-500 rounded-xl p-6 min-w-[320px] max-w-[400px] z-[100] shadow-2xl backdrop-blur-md" 
        onClick={(e) => {
          console.log('👤 Panel content clicked, preventing close')
          e.stopPropagation()
        }}
      >
        <div className="text-white text-sm font-medium mb-4">User Account</div>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-white/20 border-t-white/60 rounded-full animate-spin"></div>
            <span className="ml-2 text-white/60">Loading...</span>
          </div>
        ) : user ? (
          <div className="space-y-4">
            {/* User Info */}
            <div className="flex items-center gap-3 p-3 bg-white/10 border border-white/20 rounded-lg">
              {user.image_url ? (
                <img
                  src={user.image_url}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-white font-medium text-lg">
                    {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
              )}
              <div className="flex-1">
                <div className="text-white font-medium">{user.name || 'User'}</div>
                <div className="text-white/60 text-sm">{user.email}</div>
              </div>
            </div>

            {/* Sync Status */}
            <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm font-medium">Data Synced</span>
            </div>

            {/* User Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white/5 border border-white/10 rounded-lg text-center">
                <div className="text-2xl font-bold text-yellow-400">{user.streakData.current_streak}</div>
                <div className="text-white/60 text-xs">Day Streak</div>
              </div>
              <div className="p-3 bg-white/5 border border-white/10 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {user.streakData.total_focused_hours.toFixed(1)}h
                </div>
                <div className="text-white/60 text-xs">Total Focus</div>
              </div>
            </div>

            {/* Sign Out Button */}
            <button
              onClick={() => {
                onClick?.()
                signOut()
                onClose()
              }}
              className="w-full p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/30 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Guest Status */}
            <div className="flex items-center gap-3 p-3 bg-white/10 border border-white/20 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-white font-medium">Guest User</div>
                <div className="text-white/60 text-sm">Not signed in</div>
              </div>
            </div>

            {/* Not Synced Status */}
            <div className="flex items-center gap-2 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              <span className="text-orange-400 text-sm font-medium">Not Synced</span>
            </div>

            {/* Sign In Button */}
            <button
              onClick={() => {
                onClick?.()
                signIn()
                onClose()
              }}
              className="w-full p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400 hover:bg-blue-500/30 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign in with Google
            </button>

            {/* Benefits */}
            <div className="text-white/60 text-xs space-y-1">
              <div>• Sync your data across devices</div>
              <div>• Save your focus streaks</div>
              <div>• Backup your tasks and preferences</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
