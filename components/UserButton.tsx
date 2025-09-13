'use client'

import React, { useState } from 'react'
import { useSupabaseAuth } from '@/lib/SupabaseAuthContext'
import UserPanel from './UserPanel'
import Tooltip from './Tooltip'

interface UserButtonProps {
  onClick?: () => void
  blurIntensity?: number
}

export default function UserButton({ onClick, blurIntensity = 10 }: UserButtonProps) {
  const { user } = useSupabaseAuth()
  const [showUserPanel, setShowUserPanel] = useState(false)

  return (
    <>
      {/* User Button */}
      <Tooltip content={user ? "User Profile" : "User Account"}>
        <button
          onClick={() => {
            onClick?.()
            setShowUserPanel(true)
          }}
          className="w-10 h-10 rounded-full bg-white/10 border border-white/20 backdrop-blur flex items-center justify-center transition-all duration-200 hover:bg-white/20 group"
        >
        {user ? (
          // Show user's profile picture or initials
          user.image_url ? (
            <img
              src={user.image_url}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
          )
        ) : (
          // User profile icon for non-authenticated users
          <svg
            className="w-6 h-6 text-white group-hover:text-blue-400 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        )}
        </button>
      </Tooltip>

      {/* User Panel */}
      <UserPanel
        isOpen={showUserPanel}
        onClose={() => {
          setShowUserPanel(false)
        }}
        onClick={onClick}
        blurIntensity={blurIntensity}
      />
    </>
  )
}
