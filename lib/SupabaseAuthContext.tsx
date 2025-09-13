'use client'

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
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
  const [fetchingProfile, setFetchingProfile] = useState(false)
  const [lastUpdateTime, setLastUpdateTime] = useState(0)

  const fetchUserProfile = async (userId: string, currentSession?: Session | null) => {
    // Prevent multiple simultaneous fetches
    if (fetchingProfile) {
      console.log('⏸️ Profile fetch already in progress, skipping...')
      return
    }

    try {
      console.log('🔍 Fetching user profile for ID:', userId)
      setFetchingProfile(true)
      setLoading(true)
      
      // Fetch data separately to avoid JOIN issues
      console.log('🔄 Starting parallel data fetch...')
      const [profileResult, streakResult, preferencesResult] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).single(),
        supabase.from('streak_data').select('*').eq('id', userId).single(),
        supabase.from('user_preferences').select('*').eq('id', userId).single()
      ])

      console.log('🔍 Profile result:', profileResult)
      console.log('🔍 Streak result:', streakResult)
      console.log('🔍 Preferences result:', preferencesResult)

      if (profileResult.error) {
        console.error('❌ Error fetching profile:', profileResult.error)
        console.error('❌ Profile error details:', {
          message: profileResult.error.message,
          details: profileResult.error.details,
          hint: profileResult.error.hint,
          code: profileResult.error.code
        })
        
        // If profile doesn't exist, try to create it
        if (profileResult.error.code === 'PGRST116') {
          console.log('🔄 Profile not found, creating new profile...')
          try {
            const { data: newProfile, error: createError } = await supabase
              .from('profiles')
              .insert({
                id: userId,
                email: session?.user?.email || '',
                name: session?.user?.user_metadata?.full_name || '',
                image_url: session?.user?.user_metadata?.avatar_url || ''
              })
              .select()
              .single()
            
            if (createError) {
              console.error('❌ Error creating profile:', createError)
            } else {
              console.log('✅ Profile created successfully:', newProfile)
              // Retry fetching profile
              const retryResult = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single()
              profileResult.data = retryResult.data
              profileResult.error = retryResult.error as any
            }
          } catch (createErr) {
            console.error('❌ Error in profile creation:', createErr)
          }
        } else {
          setLoading(false)
          setFetchingProfile(false)
          return
        }
      }

      if (streakResult.error) {
        console.error('❌ Error fetching streak data:', streakResult.error)
        console.error('❌ Streak error details:', {
          message: streakResult.error.message,
          details: streakResult.error.details,
          hint: streakResult.error.hint,
          code: streakResult.error.code
        })
        
        // If streak_data doesn't exist, try to create it
        if (streakResult.error.code === 'PGRST116') {
          console.log('🔄 Streak data not found, creating new streak data...')
          try {
            const { data: newStreakData, error: createError } = await supabase
              .from('streak_data')
              .insert({
                id: userId,
                current_streak: 0,
                total_focused_hours: 0,
                daily_goal: 4,
                today_focused_minutes: 0,
                last_focus_date: null
              })
              .select()
              .single()
            
            if (createError) {
              console.error('❌ Error creating streak data:', createError)
            } else {
              console.log('✅ Streak data created successfully:', newStreakData)
              // Retry fetching streak data
              const retryResult = await supabase
                .from('streak_data')
                .select('*')
                .eq('id', userId)
                .single()
              streakResult.data = retryResult.data
              streakResult.error = retryResult.error as any
            }
          } catch (createErr) {
            console.error('❌ Error in streak data creation:', createErr)
          }
        } else {
          setLoading(false)
          setFetchingProfile(false)
          return
        }
      }

      if (preferencesResult.error) {
        console.error('❌ Error fetching preferences:', preferencesResult.error)
        console.error('❌ Preferences error details:', {
          message: preferencesResult.error.message,
          details: preferencesResult.error.details,
          hint: preferencesResult.error.hint,
          code: preferencesResult.error.code
        })
        
        // If user_preferences doesn't exist, try to create it
        if (preferencesResult.error.code === 'PGRST116') {
          console.log('🔄 User preferences not found, creating new preferences...')
          try {
            const { data: newPreferences, error: createError } = await supabase
              .from('user_preferences')
              .insert({
                id: userId,
                timer_durations: { focus: 25, shortBreak: 5, longBreak: 15 },
                auto_break_settings: { enabled: true, breakDuration: 10, skipBreaks: false },
                blur_intensity: 10,
                wallpaper_brightness: 'normal',
                sound_effects_enabled: false
              })
              .select()
              .single()
            
            if (createError) {
              console.error('❌ Error creating user preferences:', createError)
            } else {
              console.log('✅ User preferences created successfully:', newPreferences)
              // Retry fetching preferences
              const retryResult = await supabase
                .from('user_preferences')
                .select('*')
                .eq('id', userId)
                .single()
              preferencesResult.data = retryResult.data
              preferencesResult.error = retryResult.error as any
            }
          } catch (createErr) {
            console.error('❌ Error in user preferences creation:', createErr)
          }
        } else {
          setLoading(false)
          setFetchingProfile(false)
          return
        }
      }

      const profile = profileResult.data
      const streakData = streakResult.data
      const preferences = preferencesResult.data

      console.log('✅ All data fetched successfully')

      if (profile) {
        const userProfile: UserProfile = {
          id: profile.id,
          email: profile.email || currentSession?.user?.email || currentSession?.user?.user_metadata?.email || '',
          name: profile.name || currentSession?.user?.user_metadata?.full_name || currentSession?.user?.user_metadata?.name || '',
          image_url: profile.image_url || currentSession?.user?.user_metadata?.avatar_url || currentSession?.user?.user_metadata?.picture || '',
          streakData: {
            current_streak: streakData?.current_streak || 0,
            total_focused_hours: streakData?.total_focused_hours || 0,
            daily_goal: streakData?.daily_goal || 4,
            today_focused_minutes: streakData?.today_focused_minutes || 0,
            last_focus_date: streakData?.last_focus_date || null
          },
          preferences: {
            timer_durations: preferences?.timer_durations || {
              focus: 25,
              shortBreak: 5,
              longBreak: 15
            },
            auto_break_settings: preferences?.auto_break_settings || {
              enabled: true,
              breakDuration: 10,
              skipBreaks: false
            },
            blur_intensity: preferences?.blur_intensity || 10,
            wallpaper_brightness: preferences?.wallpaper_brightness || 'normal',
            sound_effects_enabled: preferences?.sound_effects_enabled || false
          }
        }
        console.log('✅ Setting user profile:', userProfile)
        setUser(userProfile)
      } else {
        console.log('❌ No profile data returned')
        // Even if profile fetch fails, we still have a valid session
        // Create a basic user profile with session data
        if (currentSession?.user) {
          const basicUserProfile: UserProfile = {
            id: currentSession.user.id,
            email: currentSession.user.email || currentSession.user.user_metadata?.email || '',
            name: currentSession.user.user_metadata?.full_name || currentSession.user.user_metadata?.name || '',
            image_url: currentSession.user.user_metadata?.avatar_url || currentSession.user.user_metadata?.picture || '',
            streakData: {
              current_streak: 0,
              total_focused_hours: 0,
              daily_goal: 4,
              today_focused_minutes: 0,
              last_focus_date: null
            },
            preferences: {
              timer_durations: { focus: 25, shortBreak: 5, longBreak: 15 },
              auto_break_settings: { enabled: true, breakDuration: 10, skipBreaks: false },
              blur_intensity: 10,
              wallpaper_brightness: 'normal',
              sound_effects_enabled: false
            }
          }
          console.log('✅ Using basic user profile from session:', basicUserProfile)
          setUser(basicUserProfile)
        }
      }
      setLoading(false)
      setFetchingProfile(false)
    } catch (error) {
      console.error('❌ Error fetching user profile:', error)
      setLoading(false)
      setFetchingProfile(false)
    }
  }

  const updateUserData = useCallback(async (data: Partial<UserProfile>) => {
    if (!user) return

    // Add protection against rapid updates
    if (fetchingProfile) {
      console.log('⏸️ Profile fetch in progress, skipping update')
      return
    }

    // Debounce updates - prevent updates more frequent than 1 second
    const now = Date.now()
    if (now - lastUpdateTime < 1000) {
      console.log('⏸️ Update too frequent, skipping...')
      return
    }

    try {
      console.log('🔄 Updating user data:', data)
      setLastUpdateTime(now)
      
      // Update profile
      if (data.name || data.image_url) {
        const { error } = await supabase
          .from('profiles')
          .update({
            name: data.name,
            image_url: data.image_url
          })
          .eq('id', user.id)
        
        if (error) {
          console.error('❌ Error updating profile:', error)
          return
        }
      }

      // Update streak data
      if (data.streakData) {
        const { error } = await supabase
          .from('streak_data')
          .update(data.streakData)
          .eq('id', user.id)
        
        if (error) {
          console.error('❌ Error updating streak data:', error)
          return
        }
      }

      // Update preferences
      if (data.preferences) {
        const { error } = await supabase
          .from('user_preferences')
          .update(data.preferences)
          .eq('id', user.id)
        
        if (error) {
          console.error('❌ Error updating preferences:', error)
          return
        }
      }

      // Update local state instead of re-fetching
      setUser(prevUser => prevUser ? { ...prevUser, ...data } : null)
      console.log('✅ User data updated successfully')
    } catch (error) {
      console.error('❌ Error updating user data:', error)
    }
  }, [user, fetchingProfile, lastUpdateTime])

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
    
    // Give a small delay for session restoration
    const timeout = setTimeout(async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        console.log('🔧 Initial session check:', { 
          session: !!session, 
          userId: session?.user?.id,
          email: session?.user?.email,
          expiresAt: session?.expires_at,
          error,
          currentUrl: typeof window !== 'undefined' ? window.location.href : 'server'
        })
        
        setSession(session)
        
        if (session?.user?.id) {
          console.log('🔧 User found, fetching profile...')
          await fetchUserProfile(session.user.id, session)
        } else {
          console.log('🔧 No user found')
        }
      } catch (error) {
        console.error('🔧 Error getting session:', error)
      } finally {
        setLoading(false)
      }
    }, 100) // Small delay to allow session restoration
    
    return () => clearTimeout(timeout)

    // Also listen for auth changes immediately
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', { 
          event, 
          email: session?.user?.email,
          userId: session?.user?.id,
          hasSession: !!session
        })
        setSession(session)
        if (session?.user?.id) {
          console.log('🔄 User authenticated, fetching profile...')
          // Only fetch if we don't already have user data or if it's a different user
          if (!user || user.id !== session.user.id) {
            // Add timeout for profile fetching
            const profileTimeout = setTimeout(() => {
              console.log('⏰ Profile fetch timeout - showing guest interface')
              setLoading(false)
            }, 10000) // 10 second timeout for profile fetch
            
            try {
              await fetchUserProfile(session.user.id, session)
            } finally {
              clearTimeout(profileTimeout)
            }
          } else {
            console.log('🔄 User data already exists, skipping fetch')
            setLoading(false)
          }
        } else {
          console.log('🔄 No user, clearing user data')
          setUser(null)
        }
        setLoading(false)
      }
    )


    return () => {
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
