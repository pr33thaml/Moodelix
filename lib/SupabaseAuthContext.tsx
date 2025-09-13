'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from './supabase'

interface UserProfile {
  id: string
  email: string
  name: string
  image_url?: string
  streakData: {
    current_streak: number
    total_focused_hours: number
    daily_goal: number
    today_focused_minutes: number
    last_focus_date: string | null
  }
  preferences: {
    timer_durations: {
      focus: number
      shortBreak: number
      longBreak: number
    }
    auto_break_settings: {
      enabled: boolean
      breakDuration: number
      skipBreaks: boolean
    }
    blur_intensity: number
    wallpaper_brightness: 'darker' | 'dark' | 'normal' | 'bright'
    sound_effects_enabled: boolean
  }
}

interface SupabaseAuthContextType {
  user: UserProfile | null
  session: Session | null
  loading: boolean
  signIn: () => Promise<void>
  signOut: () => Promise<void>
  updateUserData: (data: Partial<UserProfile>) => Promise<void>
}

const SupabaseAuthContext = createContext<SupabaseAuthContextType | undefined>(undefined)

export function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('🔍 Fetching user profile for ID:', userId)
      setLoading(true)
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select(`
          *,
          streak_data (*),
          user_preferences (*)
        `)
        .eq('id', userId)
        .single()

      if (error) {
        console.error('❌ Error fetching profile:', error)
        console.error('❌ Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        setLoading(false)
        return
      }

      console.log('✅ Profile data:', profile)

      if (profile) {
        const userProfile: UserProfile = {
          id: profile.id,
          email: profile.email,
          name: profile.name || '',
          image_url: profile.image_url,
          streakData: {
            current_streak: profile.streak_data?.current_streak || 0,
            total_focused_hours: profile.streak_data?.total_focused_hours || 0,
            daily_goal: profile.streak_data?.daily_goal || 4,
            today_focused_minutes: profile.streak_data?.today_focused_minutes || 0,
            last_focus_date: profile.streak_data?.last_focus_date || null
          },
          preferences: {
            timer_durations: profile.user_preferences?.timer_durations || {
              focus: 25,
              shortBreak: 5,
              longBreak: 15
            },
            auto_break_settings: profile.user_preferences?.auto_break_settings || {
              enabled: true,
              breakDuration: 10,
              skipBreaks: false
            },
            blur_intensity: profile.user_preferences?.blur_intensity || 10,
            wallpaper_brightness: profile.user_preferences?.wallpaper_brightness || 'normal',
            sound_effects_enabled: profile.user_preferences?.sound_effects_enabled || false
          }
        }
        console.log('✅ Setting user profile:', userProfile)
        setUser(userProfile)
      } else {
        console.log('❌ No profile data returned')
      }
      setLoading(false)
    } catch (error) {
      console.error('❌ Error fetching user profile:', error)
      setLoading(false)
    }
  }

  const updateUserData = async (data: Partial<UserProfile>) => {
    if (!user) return

    try {
      // Update profile
      if (data.name || data.image_url) {
        await supabase
          .from('profiles')
          .update({
            name: data.name,
            image_url: data.image_url
          })
          .eq('id', user.id)
      }

      // Update streak data
      if (data.streakData) {
        await supabase
          .from('streak_data')
          .update(data.streakData)
          .eq('id', user.id)
      }

      // Update preferences
      if (data.preferences) {
        await supabase
          .from('user_preferences')
          .update(data.preferences)
          .eq('id', user.id)
      }

      // Refresh user data
      if (session?.user?.id) {
        await fetchUserProfile(session.user.id)
      }
    } catch (error) {
      console.error('Error updating user data:', error)
    }
  }

  const signIn = async () => {
    console.log('🔐 Starting Google sign-in...')
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      console.log('🔐 Sign-in response:', { data, error })
    } catch (error) {
      console.error('🔐 Sign-in error:', error)
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
  }

  useEffect(() => {
    console.log('🔧 SupabaseAuthProvider initializing...')
    
    // Very aggressive fallback - show guest interface immediately if no session
    const immediateTimeout = setTimeout(() => {
      console.log('⏰ Immediate timeout - showing guest interface')
      setLoading(false)
    }, 500) // 500ms timeout - very fast
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log('🔧 Initial session check:', { 
        session: !!session, 
        userId: session?.user?.id,
        email: session?.user?.email,
        expiresAt: session?.expires_at,
        error 
      })
      clearTimeout(immediateTimeout)
      setSession(session)
      if (session?.user?.id) {
        console.log('🔧 User found, fetching profile...')
        // Add timeout for profile fetching too
        const profileTimeout = setTimeout(() => {
          console.log('⏰ Profile fetch timeout - showing guest interface')
          setLoading(false)
        }, 2000)
        
        fetchUserProfile(session.user.id).finally(() => {
          clearTimeout(profileTimeout)
        })
      } else {
        console.log('🔧 No user found, setting loading to false')
        setLoading(false)
      }
    }).catch((error) => {
      console.error('🔧 Error getting session:', error)
      clearTimeout(immediateTimeout)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', { 
          event, 
          email: session?.user?.email,
          userId: session?.user?.id,
          hasSession: !!session
        })
        clearTimeout(immediateTimeout)
        setSession(session)
        if (session?.user?.id) {
          console.log('🔄 User authenticated, fetching profile...')
          // Add timeout for profile fetching
          const profileTimeout = setTimeout(() => {
            console.log('⏰ Profile fetch timeout - showing guest interface')
            setLoading(false)
          }, 2000)
          
          try {
            await fetchUserProfile(session.user.id)
          } finally {
            clearTimeout(profileTimeout)
          }
        } else {
          console.log('🔄 No user, clearing user data')
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => {
      clearTimeout(immediateTimeout)
      subscription.unsubscribe()
    }
  }, [])

  return (
    <SupabaseAuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn,
        signOut,
        updateUserData,
      }}
    >
      {children}
    </SupabaseAuthContext.Provider>
  )
}

export function useSupabaseAuth() {
  const context = useContext(SupabaseAuthContext)
  if (context === undefined) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider')
  }
  return context
}
