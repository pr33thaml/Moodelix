'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import EnhancedMusicPlayer from '@/components/EnhancedMusicPlayer'
import BackgroundMusicPlayer from '@/components/BackgroundMusicPlayer'
import CenterMenu from '@/components/CenterMenu'
import BugReportPopup from '@/components/BugReportPopup'
import UserButton from '@/components/UserButton'
import TodoList from '@/components/TodoList'
import { useSoundEffects } from '@/lib/useSoundEffects'
import { useSupabaseAuth } from '@/lib/SupabaseAuthContext'
import Tooltip from '@/components/Tooltip'
import { wallpapers as staticWallpapers, getRandomWallpaper, getLiveWallpapers, getPhotoWallpapers } from '@/lib/wallpaperData'
import { fetchTodos, updateTodo, addTodo, type Todo } from '@/lib/todos'

export default function HomePage() {
  const { user, session, loading, signOut, updateUserData } = useSupabaseAuth()
  const [timeString, setTimeString] = useState('')
  const [mounted, setMounted] = useState(false)
  const [bgMode, setBgMode] = useState<'video' | 'image'>('video')
  const [bgUrl, setBgUrl] = useState('')
  const [quoteIndex, setQuoteIndex] = useState(0)
  const [typed, setTyped] = useState('')
  const [showMusic, setShowMusic] = useState(false)
  const [isMusicPlaying, setIsMusicPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState<{
    title: string
    platform: 'youtube' | 'spotify'
  } | null>(null)
  const [backgroundMusicUrl, setBackgroundMusicUrl] = useState<string>('')
  const [backgroundMusicType, setBackgroundMusicType] = useState<'youtube' | 'spotify'>('youtube')
  const [showBackgroundPlayer, setShowBackgroundPlayer] = useState(true)
  const [isMusicMinimized, setIsMusicMinimized] = useState(false)

  const [logoSize, setLogoSize] = useState<'small' | 'medium' | 'large'>('large')
  const [quoteSize, setQuoteSize] = useState<'small' | 'medium' | 'large'>('large')
  const [buttonSize, setButtonSize] = useState<'small' | 'medium' | 'large'>('medium')
  const [currentFont, setCurrentFont] = useState<'space-grotesk' | 'handwriting' | 'inter' | 'poppins' | 'roboto' | 'cinzel' | 'playfair' | 'merriweather' | 'lora' | 'crimson' | 'source-serif' | 'libre-baskerville' | 'vollkorn' | 'bree-serif' | 'josefin-sans' | 'quicksand' | 'comfortaa' | 'fredoka' | 'nunito' | 'montserrat'>('space-grotesk')
  const [audioVolume, setAudioVolume] = useState(0.7)
  const [audioMuted, setAudioMuted] = useState(false)
  const [wallpaperBrightness, setWallpaperBrightness] = useState<'darker' | 'dark' | 'normal' | 'bright'>('normal')
  const [hideEverything, setHideEverything] = useState(false)

  // Music control functions
  const handleMusicPlay = (platform: 'youtube' | 'spotify', title: string, embedUrl: string) => {
    console.log('🎵 Music Play triggered:', { platform, title, embedUrl })
    setIsMusicPlaying(true)
    setCurrentTrack({ title, platform })
    setBackgroundMusicUrl(embedUrl)
    setBackgroundMusicType(platform)
    setIsMusicMinimized(false) // Reset minimized state when new music starts
    console.log('🎵 State updated:', { isMusicPlaying: true, backgroundMusicUrl: embedUrl })
  }

  const handleMusicStop = () => {
    setIsMusicPlaying(false)
    setCurrentTrack(null)
    setBackgroundMusicUrl('')
  }

  const handleMusicTabClose = () => {
    setShowMusic(false)
    // Don't stop the music, just close the tab
  }

  // Debug background player state
  useEffect(() => {
    console.log('🎵 Background Player State Changed:', {
      backgroundMusicUrl,
      backgroundMusicType,
      isMusicPlaying,
      showBackgroundPlayer,
      isVisible: isMusicPlaying && showBackgroundPlayer
    })
  }, [backgroundMusicUrl, backgroundMusicType, isMusicPlaying, showBackgroundPlayer])
  const [showTodo, setShowTodo] = useState(false)
  const [slideshowEnabled, setSlideshowEnabled] = useState(false)
  const [slideshowRandomized, setSlideshowRandomized] = useState(true)
  const [slideshowSpeed, setSlideshowSpeed] = useState<number>(10) // 5s to 60s in seconds
  const [blurIntensity, setBlurIntensity] = useState<number>(10) // 0 to 20 for backdrop-blur
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showFocus, setShowFocus] = useState(false)
  const [showSlideshow, setShowSlideshow] = useState(true)
  const [showBottomMenu, setShowBottomMenu] = useState(true)
  const [showTitle, setShowTitle] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [showFontPanel, setShowFontPanel] = useState(false)
  const [showSupportPanel, setShowSupportPanel] = useState(false)
  const [showBugReport, setShowBugReport] = useState(false)
  const [todos, setTodos] = useState<Todo[]>([])
  const [focusMode, setFocusMode] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus')
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [newFocusTask, setNewFocusTask] = useState('')
  
  // Customizable timer durations (in minutes)
  const [timerDurations, setTimerDurations] = useState({
    focus: 25,
    shortBreak: 5,
    longBreak: 15
  })
  
  // Streak system state
  const [streakData, setStreakData] = useState({
    currentStreak: 0,
    totalFocusedHours: 0,
    dailyGoal: 1, // hours - default to 1 hour
    todayFocusedMinutes: 0,
    lastFocusDate: null as string | null
  })
  
  // Auto break system state
  const [autoBreakSettings, setAutoBreakSettings] = useState({
    enabled: true,
    breakDuration: 10, // minutes - will be calculated dynamically
    skipBreaks: false
  })
  const [scheduledBreaks, setScheduledBreaks] = useState<Array<{
    id: string
    time: number // minutes from start
    completed: boolean
    skipped: boolean
  }>>([])
  const [currentSessionStart, setCurrentSessionStart] = useState<number | null>(null)
  
  const [wallpapers, setWallpapers] = useState<string[]>([])
  const [allWallpapers, setAllWallpapers] = useState<string[]>([])
  const [currentWallpaperIndex, setCurrentWallpaperIndex] = useState(0)
  const [wallpaperType, setWallpaperType] = useState<'live' | 'photo'>('live')
  
  // Cache for signed URLs to avoid repeated API calls
  const [urlCache, setUrlCache] = useState<Map<string, string>>(new Map())
  
  // Loading state for better UX
  const [isLoadingWallpaper, setIsLoadingWallpaper] = useState(false)
  
  // Sound effects
  const { playClickSound, playExitSound, playToggleSound } = useSoundEffects()
  const [soundEffectsEnabled, setSoundEffectsEnabled] = useState(false)
  
  // Wrapper functions that check if sound effects are enabled
  const playClickSoundIfEnabled = () => soundEffectsEnabled && playClickSound()
  const playExitSoundIfEnabled = () => soundEffectsEnabled && playExitSound()
  const playToggleSoundIfEnabled = () => soundEffectsEnabled && playToggleSound()
  
  const quotes = useMemo(
    () => [
      'Small steps every day.',
      'Focus is a skill. Practice it.',
      'You become what you repeat.',
      'Deep work beats shallow busyness.',
      'Consistency compounds.',
    ],
    []
  )

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false)
            if (focusMode === 'focus') {
              // Check if we have more focus segments or if this is the end
              const remainingBreaks = scheduledBreaks.filter(b => !b.completed && !b.skipped)
              
              if (remainingBreaks.length > 0 && autoBreakSettings.enabled && !autoBreakSettings.skipBreaks) {
                // Take a break
              setFocusMode('shortBreak')
                setTimeLeft(autoBreakSettings.breakDuration * 60)
                completeBreak(remainingBreaks[0].id)
              } else {
                // Session complete
                updateStreakOnFocusComplete()
                setFocusMode('shortBreak')
                setTimeLeft(timerDurations.shortBreak * 60)
              }
            } else if (focusMode === 'shortBreak') {
              // Check if there are more focus segments
              const remainingBreaks = scheduledBreaks.filter(b => !b.completed && !b.skipped)
              
              if (remainingBreaks.length > 0) {
                // Continue with next focus segment
              setFocusMode('focus')
                setTimeLeft(remainingBreaks[0].time * 60)
            } else {
                // All segments complete, start new session
              setFocusMode('focus')
                setTimeLeft(timerDurations.focus * 60)
              }
            } else {
              setFocusMode('focus')
              setTimeLeft(timerDurations.focus * 60)
            }
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isTimerRunning, timeLeft, focusMode, timerDurations, scheduledBreaks, autoBreakSettings])

  // Todo management functions
  const fetchTodosFromAPI = async () => {
    if (!session) {
      console.log('No session, clearing todos')
      setTodos([])
      return
    }

    try {
      console.log('🔄 Fetching todos for deep work zone:', session.user.id)
      const data = await fetchTodos()
      setTodos(data)
      console.log('✅ Todos fetched for deep work zone:', data)
    } catch (error) {
      console.error('❌ Error fetching todos for deep work zone:', error)
      setTodos([])
    }
  }

  const toggleTodo = async (id: string) => {
    if (!session) return
    
    try {
      const todo = todos.find(t => t.id === id)
      if (!todo) return
      
      const updatedTodo = await updateTodo(id, { completed: !todo.completed })
      if (updatedTodo) {
        await fetchTodosFromAPI()
        console.log('✅ Todo toggled successfully in deep work zone')
      }
    } catch (error) {
      console.error('❌ Error toggling todo in deep work zone:', error)
    }
  }

  const addTodoFromFocus = async (title: string) => {
    if (!session || !title.trim()) return
    
    try {
      const newTodo = await addTodo(title)
      if (newTodo) {
        await fetchTodosFromAPI()
        console.log('✅ Todo added from deep work zone:', newTodo)
      }
    } catch (error) {
      console.error('❌ Error adding todo from deep work zone:', error)
    }
  }

  // Fetch todos when session changes
  useEffect(() => {
    fetchTodosFromAPI()
  }, [session])

  // Calculate task progress
  const taskProgress = useMemo(() => {
    if (todos.length === 0) return 0
    const completedTasks = todos.filter(todo => todo.completed).length
    return Math.round((completedTasks / todos.length) * 100)
  }, [todos])

  // Calculate focus streak progress
  const focusProgress = useMemo(() => {
    const goalMinutes = streakData.dailyGoal * 60
    if (goalMinutes === 0) return 0
    return Math.min(Math.round((streakData.todayFocusedMinutes / goalMinutes) * 100), 100)
  }, [streakData.todayFocusedMinutes, streakData.dailyGoal])

  // Calculate optimal break duration based on session length
  const calculateBreakDuration = (sessionMinutes: number) => {
    if (sessionMinutes >= 240) return 15 // 15 min breaks for 240+ min sessions
    if (sessionMinutes >= 150) return 12 // 12 min breaks for 150-239 min sessions
    if (sessionMinutes >= 120) return 10 // 10 min breaks for 120-149 min sessions
    if (sessionMinutes >= 90) return 8  // 8 min breaks for 90-119 min sessions
    return 5 // 5 min breaks for shorter sessions
  }

  const startTimer = () => {
    if (focusMode === 'focus') {
      startFocusSession()
    } else {
      setIsTimerRunning(true)
    }
  }
  const pauseTimer = () => setIsTimerRunning(false)
  
  const resetTimer = () => {
    setIsTimerRunning(false)
    if (focusMode === 'focus') {
      setTimeLeft(timerDurations.focus * 60)
    } else if (focusMode === 'shortBreak') {
      setTimeLeft(timerDurations.shortBreak * 60)
    } else {
      setTimeLeft(timerDurations.longBreak * 60)
    }
  }

  // Timer duration control functions
  const increaseTimerDuration = (mode: 'focus' | 'shortBreak' | 'longBreak') => {
    const maxMinutes = mode === 'focus' ? 240 : 60 // Focus sessions can go up to 240 minutes
    setTimerDurations(prev => ({
      ...prev,
      [mode]: Math.min(prev[mode] + 1, maxMinutes)
    }))
    
    // If this is the current mode and timer is not running, update the display
    if (focusMode === mode && !isTimerRunning) {
      setTimeLeft((prev) => Math.min(prev + 60, maxMinutes * 60))
    }
  }

  const decreaseTimerDuration = (mode: 'focus' | 'shortBreak' | 'longBreak') => {
    const minMinutes = mode === 'focus' ? 25 : 1 // Focus sessions minimum 25 minutes
    setTimerDurations(prev => ({
      ...prev,
      [mode]: Math.max(prev[mode] - 1, minMinutes)
    }))
    
    // If this is the current mode and timer is not running, update the display
    if (focusMode === mode && !isTimerRunning) {
      setTimeLeft((prev) => Math.max(prev - 60, minMinutes * 60)) // Subtract 1 minute, respect minimum
    }
  }

  // Streak system functions
  const updateStreakOnFocusComplete = () => {
    const today = new Date().toDateString()
    const focusDurationMinutes = timerDurations.focus
    
    setStreakData(prev => {
      const isNewDay = prev.lastFocusDate !== today
      const newTodayFocusedMinutes = isNewDay ? focusDurationMinutes : prev.todayFocusedMinutes + focusDurationMinutes
      const newTotalFocusedHours = prev.totalFocusedHours + (focusDurationMinutes / 60)
      
      // Calculate new streak
      let newStreak = prev.currentStreak
      if (isNewDay) {
        // Check if yesterday had focus (streak continues) or if this is the first day
        if (prev.lastFocusDate) {
          const yesterday = new Date()
          yesterday.setDate(yesterday.getDate() - 1)
          const yesterdayString = yesterday.toDateString()
          
          if (prev.lastFocusDate === yesterdayString) {
            newStreak = prev.currentStreak + 1
          } else {
            newStreak = 1 // Reset streak if gap in days
          }
        } else {
          newStreak = 1 // First day
        }
      }
      
      const updatedStreakData = {
        ...prev,
        currentStreak: newStreak,
        totalFocusedHours: newTotalFocusedHours,
        todayFocusedMinutes: newTodayFocusedMinutes,
        lastFocusDate: today
      }

      // Sync with server if user is authenticated
      if (user) {
        updateUserData({ 
          streakData: {
            current_streak: updatedStreakData.currentStreak,
            total_focused_hours: updatedStreakData.totalFocusedHours,
            daily_goal: updatedStreakData.dailyGoal,
            today_focused_minutes: updatedStreakData.todayFocusedMinutes,
            last_focus_date: updatedStreakData.lastFocusDate
          }
        })
      }

      return updatedStreakData
    })
  }

  const updateDailyGoal = (newGoal: number) => {
    const updatedStreakData = {
      ...streakData,
      dailyGoal: Math.max(1, Math.min(12, newGoal)) // Between 1-12 hours
    }
    setStreakData(updatedStreakData)
    
    // Sync with server if user is authenticated
    if (user) {
      updateUserData({ 
        streakData: {
          current_streak: updatedStreakData.currentStreak,
          total_focused_hours: updatedStreakData.totalFocusedHours,
          daily_goal: updatedStreakData.dailyGoal,
          today_focused_minutes: updatedStreakData.todayFocusedMinutes,
          last_focus_date: updatedStreakData.lastFocusDate
        }
      })
    }
  }

  // Auto break system functions
  const calculateAutoBreaks = (totalMinutes: number) => {
    if (!autoBreakSettings.enabled || autoBreakSettings.skipBreaks) return []
    
    const breaks: Array<{ id: string; time: number; completed: boolean; skipped: boolean }> = []
    
    // Dynamic break calculation based on session duration
    if (totalMinutes >= 240) {
      // 240+ minutes: 7 breaks with 21-minute segments
      const segmentDuration = 21
      for (let i = 1; i <= 7; i++) {
        breaks.push({
          id: `break-${i}`,
          time: segmentDuration * i,
          completed: false,
          skipped: false
        })
      }
    } else if (totalMinutes >= 150 && totalMinutes < 240) {
      // 150-165 minutes: 4 breaks
      const segmentDuration = Math.floor(totalMinutes / 5) // Divide into 5 segments (4 breaks)
      for (let i = 1; i <= 4; i++) {
        breaks.push({
          id: `break-${i}`,
          time: segmentDuration * i,
          completed: false,
          skipped: false
        })
      }
    } else if (totalMinutes >= 120 && totalMinutes < 150) {
      // 120-149 minutes: 3 breaks
      const segmentDuration = Math.floor(totalMinutes / 4) // Divide into 4 segments (3 breaks)
      for (let i = 1; i <= 3; i++) {
        breaks.push({
          id: `break-${i}`,
          time: segmentDuration * i,
          completed: false,
          skipped: false
        })
      }
    } else if (totalMinutes >= 90 && totalMinutes < 120) {
      // 90-119 minutes: 2 breaks
      const segmentDuration = Math.floor(totalMinutes / 3) // Divide into 3 segments (2 breaks)
      for (let i = 1; i <= 2; i++) {
        breaks.push({
          id: `break-${i}`,
          time: segmentDuration * i,
          completed: false,
          skipped: false
        })
      }
    } else if (totalMinutes >= 60 && totalMinutes < 90) {
      // 60-89 minutes: 1 break
      const segmentDuration = Math.floor(totalMinutes / 2) // Divide into 2 segments (1 break)
      breaks.push({
        id: 'break-1',
        time: segmentDuration,
        completed: false,
        skipped: false
      })
    }
    
    return breaks
  }

  const startFocusSession = () => {
    const now = Date.now()
    setCurrentSessionStart(now)
    
    // Calculate optimal break duration based on session length
    const optimalBreakDuration = calculateBreakDuration(timerDurations.focus)
    setAutoBreakSettings(prev => ({ ...prev, breakDuration: optimalBreakDuration }))
    
    // Calculate breaks for current focus duration
    const breaks = calculateAutoBreaks(timerDurations.focus)
    setScheduledBreaks(breaks)
    
    // Reset timer to first segment
    if (breaks.length > 0) {
      setTimeLeft(breaks[0].time * 60) // Start with first break time
    } else {
      setTimeLeft(timerDurations.focus * 60) // No breaks, use full duration
    }
    
    setIsTimerRunning(true)
  }

  const skipBreak = (breakId: string) => {
    setScheduledBreaks(prev => 
      prev.map(breakItem => 
        breakItem.id === breakId 
          ? { ...breakItem, skipped: true }
          : breakItem
      )
    )
  }

  const completeBreak = (breakId: string) => {
    setScheduledBreaks(prev => 
      prev.map(breakItem => 
        breakItem.id === breakId 
          ? { ...breakItem, completed: true }
          : breakItem
      )
    )
  }

  const switchMode = (mode: 'focus' | 'shortBreak' | 'longBreak') => {
    setFocusMode(mode)
    setIsTimerRunning(false)
    if (mode === 'focus') {
      setTimeLeft(timerDurations.focus * 60)
    } else if (mode === 'shortBreak') {
      setTimeLeft(timerDurations.shortBreak * 60)
    } else {
      setTimeLeft(timerDurations.longBreak * 60)
    }
  }

  // Helper function to get signed URL from API
  const getSignedUrl = async (s3Key: string): Promise<string> => {
    // Check cache first for instant response
    if (urlCache.has(s3Key)) {
      return urlCache.get(s3Key)!
    }
    
    try {
      const response = await fetch('/api/wallpapers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ s3Key })
      })
      
      if (!response.ok) {
        throw new Error('Failed to get signed URL')
      }
      
      const data = await response.json()
      const signedUrl = data.signedUrl
      setUrlCache(prev => new Map(prev).set(s3Key, signedUrl))
      return signedUrl
    } catch (error) {
      console.error('Error getting signed URL:', error)
      throw error
    }
  }

  // Wallpaper functions - Fast loading with S3 signed URLs
  const loadWallpapers = useCallback(async () => {
    try {
      setIsLoadingWallpaper(true)
      
      // Get wallpaper data
      const liveWallpapers = getLiveWallpapers()
      const photoWallpapers = getPhotoWallpapers()
      
      // Store wallpaper keys for selection
      setWallpapers(liveWallpapers.map(w => w.url))
      setAllWallpapers([...liveWallpapers.map(w => w.url), ...photoWallpapers.map(w => w.url)])
      
      if (liveWallpapers.length > 0) {
        // Show UI instantly with loading state
        const randomIndex = Math.floor(Math.random() * liveWallpapers.length)
        setCurrentWallpaperIndex(randomIndex)
        setBgMode('video')
        
        // Start loading the wallpaper immediately
        const randomWallpaperKey = liveWallpapers[randomIndex].url
        
        try {
          const randomWallpaperUrl = await getSignedUrl(randomWallpaperKey)
          setBgUrl(randomWallpaperUrl)
          setIsLoadingWallpaper(false)
          
          // Start preloading next few wallpapers in background for instant switching
          const preloadIndices = [
            (randomIndex + 1) % liveWallpapers.length,
            (randomIndex - 1 + liveWallpapers.length) % liveWallpapers.length,
            (randomIndex + 2) % liveWallpapers.length
          ]
          
          // Preload in background without blocking UI
          preloadIndices.forEach(async (index) => {
            try {
              const key = liveWallpapers[index].url
              if (!urlCache.has(key)) {
                await getSignedUrl(key)
              }
            } catch (error) {
              // Silent fail for background preloading
            }
          })
          
        } catch (error) {
          console.error('Error loading wallpaper:', error)
          // Keep the beautiful animated background instead of falling back to white
          setBgMode('video')
          setBgUrl('')
          setIsLoadingWallpaper(false)
        }
        
      } else {
        setIsLoadingWallpaper(false)
      }
    } catch (error) {
      console.error('Error loading wallpapers:', error)
      setIsLoadingWallpaper(false)
    }
  }, [])

  const handleWallpaperChange = async (s3Key: string) => {
    try {
      setIsLoadingWallpaper(true)
      
      // Check cache first for instant response
      if (urlCache.has(s3Key)) {
        const cachedUrl = urlCache.get(s3Key)!
        setBgUrl(cachedUrl)
        
        // Check if it's a live wallpaper (for slideshow compatibility)
        const isLiveWallpaper = s3Key.match(/\.(mp4|webm|mov)$/i)
        
        if (isLiveWallpaper) {
          const wallpaperKeys = getLiveWallpapers().map(w => w.url)
          const index = wallpaperKeys.indexOf(s3Key)
          setCurrentWallpaperIndex(index >= 0 ? index : 0)
        } else {
          setCurrentWallpaperIndex(-1)
        }
        
        setBgMode(isLiveWallpaper ? 'video' : 'image')
        setIsLoadingWallpaper(false)
        
        // Preload next few wallpapers in background for instant switching
        if (isLiveWallpaper) {
          const liveWallpapers = getLiveWallpapers()
          const currentIndex = liveWallpapers.findIndex(w => w.url === s3Key)
          if (currentIndex >= 0) {
            const preloadIndices = [
              (currentIndex + 1) % liveWallpapers.length,
              (currentIndex - 1 + liveWallpapers.length) % liveWallpapers.length,
              (currentIndex + 2) % liveWallpapers.length
            ]
            
            // Preload in background without blocking UI
            preloadIndices.forEach(async (index) => {
              try {
                const key = liveWallpapers[index].url
                if (!urlCache.has(key)) {
                  await getSignedUrl(key)
                }
              } catch (error) {
                // Silent fail for background preloading
              }
            })
          }
        }
        
        return
      }
      
              // Convert S3 key to signed URL
        const wallpaperUrl = await getSignedUrl(s3Key)
      
      // Check if it's a live wallpaper (for slideshow compatibility)
      const isLiveWallpaper = s3Key.match(/\.(mp4|webm|mov)$/i)
      
      if (isLiveWallpaper) {
        // For live wallpapers, find index in the slideshow wallpapers
        const wallpaperKeys = getLiveWallpapers().map(w => w.url)
        const index = wallpaperKeys.indexOf(s3Key)
        setCurrentWallpaperIndex(index >= 0 ? index : 0)
      } else {
        // For photo wallpapers, set a special index to indicate it's not in slideshow
        setCurrentWallpaperIndex(-1)
      }
      
      if (isLiveWallpaper) {
        setBgMode('video')
      } else {
        setBgMode('image')
      }
      
      setBgUrl(wallpaperUrl)
      setIsLoadingWallpaper(false)
      
      // Cache the URL for future use
      setUrlCache(prev => new Map(prev).set(s3Key, wallpaperUrl))
      
      // Preload next few wallpapers in background for instant switching
      if (isLiveWallpaper) {
        const liveWallpapers = getLiveWallpapers()
        const currentIndex = liveWallpapers.findIndex(w => w.url === s3Key)
        if (currentIndex >= 0) {
          const preloadIndices = [
            (currentIndex + 1) % liveWallpapers.length,
            (currentIndex - 1 + liveWallpapers.length) % liveWallpapers.length,
            (currentIndex + 2) % liveWallpapers.length
          ]
          
                      // Preload in background without blocking UI
            preloadIndices.forEach(async (index) => {
              try {
                const key = liveWallpapers[index].url
                if (!urlCache.has(key)) {
                  await getSignedUrl(key)
                }
              } catch (error) {
                // Silent fail for background preloading
              }
            })
        }
      }
    } catch (error) {
      console.error('Error loading wallpaper:', error)
      // Keep the beautiful animated background instead of falling back to white
      setBgMode('video')
      setBgUrl('')
      setIsLoadingWallpaper(false)
    }
  }

  // Sync user data when user changes
  useEffect(() => {
    if (user) {
      // Load user preferences
      if (user.preferences.timer_durations) {
        setTimerDurations(user.preferences.timer_durations)
      }
      if (user.preferences.auto_break_settings) {
        setAutoBreakSettings(user.preferences.auto_break_settings)
      }
      if (user.preferences.blur_intensity !== undefined) {
        setBlurIntensity(user.preferences.blur_intensity)
      }
      if (user.preferences.wallpaper_brightness) {
        setWallpaperBrightness(user.preferences.wallpaper_brightness)
      }
      if (user.preferences.sound_effects_enabled !== undefined) {
        setSoundEffectsEnabled(user.preferences.sound_effects_enabled)
      }
      
      // Load user streak data
      if (user.streakData) {
        console.log('🔄 Loading streak data from user:', user.streakData)
        setStreakData({
          currentStreak: user.streakData.current_streak,
          totalFocusedHours: user.streakData.total_focused_hours,
          dailyGoal: user.streakData.daily_goal,
          todayFocusedMinutes: user.streakData.today_focused_minutes,
          lastFocusDate: user.streakData.last_focus_date
        })
        console.log('✅ Streak data loaded:', {
          currentStreak: user.streakData.current_streak,
          totalFocusedHours: user.streakData.total_focused_hours,
          dailyGoal: user.streakData.daily_goal,
          todayFocusedMinutes: user.streakData.today_focused_minutes
        })
      } else {
        console.log('❌ No streak data found in user profile')
      }
    }
  }, [user])

  // Sync preferences to server when they change
  useEffect(() => {
    if (user) {
      updateUserData({
        preferences: {
          timer_durations: timerDurations,
          auto_break_settings: autoBreakSettings,
          blur_intensity: blurIntensity,
          wallpaper_brightness: wallpaperBrightness,
          sound_effects_enabled: soundEffectsEnabled
        }
      })
    }
  }, [timerDurations, autoBreakSettings, blurIntensity, wallpaperBrightness, soundEffectsEnabled, user])

  useEffect(() => {
    setMounted(true)
    setTimeString(new Date().toLocaleTimeString())
    loadWallpapers()
    
    // Preload first few wallpapers immediately for faster switching
    const preloadInitial = async () => {
      try {
        const liveWallpapers = getLiveWallpapers()
        const photoWallpapers = getPhotoWallpapers()
        
        // Preload first 3 wallpapers in background
        const preloadKeys = [
          ...liveWallpapers.slice(0, 2).map(w => w.url),
          ...photoWallpapers.slice(0, 1).map(w => w.url)
        ]
        
        console.log('🚀 Preloading initial wallpapers...')
        
        // Preload in parallel without blocking UI
        preloadKeys.forEach(async (key) => {
          try {
            if (!urlCache.has(key)) {
              await getSignedUrl(key)
            }
          } catch (error) {
            // Silent fail for background preloading
          }
        })
        
      } catch (error) {
        console.error('Error in initial preloading:', error)
      }
    }
    
    // Start preloading after a short delay
    setTimeout(preloadInitial, 500)
  }, [loadWallpapers])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  // Clean up URL hash after successful authentication
  useEffect(() => {
    if (user && window.location.hash) {
      console.log('🧹 Cleaning up URL hash after successful login')
      // Remove the hash from URL without causing a page reload
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
    }
  }, [user])

  // Handle auth errors from URL parameters
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const error = urlParams.get('error')
      const details = urlParams.get('details')
      
      if (error === 'auth_failed') {
        console.error('❌ Auth failed:', details)
        // Clean up the URL
        window.history.replaceState(null, '', window.location.pathname)
      }
    }
  }, [])

  // Debug auth state
  useEffect(() => {
    console.log('🔍 Auth Debug:', {
      user: !!user,
      session: !!session,
      loading,
      userEmail: user?.email,
      sessionEmail: session?.user?.email,
      userId: user?.id,
      sessionUserId: session?.user?.id
    })
  }, [user, session, loading])

  useEffect(() => {
    if (!mounted) return
    const clock = setInterval(() => setTimeString(new Date().toLocaleTimeString()), 1000)
    const quoteTimer = setInterval(() => setQuoteIndex((i) => (i + 1) % quotes.length), 8000)
    return () => {
      clearInterval(clock)
      clearInterval(quoteTimer)
    }
  }, [quotes.length, mounted])

  useEffect(() => {
    setTyped('')
    const target = quotes[quoteIndex]
    let i = 0
    const id = setInterval(() => {
      i += 1
      setTyped(target.slice(0, i))
              // No typing sound - just advance character
      if (i >= target.length) clearInterval(id)
    }, 60)
    return () => clearInterval(id)
  }, [quoteIndex, quotes])

    // Slideshow functionality
  useEffect(() => {
    if (!slideshowEnabled || wallpapers.length === 0) return
    
    const slideshowTimer = setInterval(async () => {
      try {
        const liveWallpapers = getLiveWallpapers()
        if (liveWallpapers.length === 0) return
        
        let nextIndex: number
        if (slideshowRandomized) {
          // Get a random index different from current
          do {
            nextIndex = Math.floor(Math.random() * liveWallpapers.length)
          } while (nextIndex === currentWallpaperIndex && liveWallpapers.length > 1)
        } else {
          nextIndex = (currentWallpaperIndex + 1) % liveWallpapers.length
        }
        
        const nextWallpaperKey = liveWallpapers[nextIndex].url
        
        // Check cache first for instant response
        if (urlCache.has(nextWallpaperKey)) {
          const cachedUrl = urlCache.get(nextWallpaperKey)!
          setBgUrl(cachedUrl)
          setCurrentWallpaperIndex(nextIndex)
        } else {
          // Load the wallpaper
          const signedUrl = await getSignedUrl(nextWallpaperKey)
          setBgUrl(signedUrl)
          setCurrentWallpaperIndex(nextIndex)
        }
        
      } catch (error) {
        console.error('Error in slideshow:', error)
      }
    }, slideshowSpeed * 1000) // Convert seconds to milliseconds
    
    return () => clearInterval(slideshowTimer)
  }, [slideshowEnabled, wallpapers.length, slideshowRandomized, slideshowSpeed, urlCache, currentWallpaperIndex])

  // Ensure individual wallpapers loop when slideshow is disabled
  useEffect(() => {
    if (slideshowEnabled || !bgUrl || bgMode !== 'video') return
    
    // When slideshow is disabled and we have a video wallpaper, ensure it loops
    // The video element already has the 'loop' attribute, but we need to ensure
    // the slideshow timer doesn't interfere with individual wallpaper loops
    setCurrentWallpaperIndex(-1) // Mark as not in slideshow mode
  }, [slideshowEnabled, bgUrl, bgMode])

  // Control audio volume for all audio/video elements
  useEffect(() => {
    const videoElements = document.querySelectorAll('video')
    const audioElements = document.querySelectorAll('audio')
    
    videoElements.forEach(video => {
      video.volume = audioMuted ? 0 : audioVolume
      video.muted = audioMuted
    })
    
    audioElements.forEach(audio => {
      audio.volume = audioMuted ? 0 : audioVolume
      audio.muted = audioMuted
    })
  }, [audioVolume, audioMuted])

  // Font mapping for dynamic classes
  const fontClasses = {
    'space-grotesk': 'font-space-grotesk',
    'handwriting': 'font-handwriting',
    'inter': 'font-inter',
    'poppins': 'font-poppins',
    'roboto': 'font-roboto',
    'cinzel': 'font-cinzel',
    'playfair': 'font-playfair',
    'merriweather': 'font-merriweather',
    'lora': 'font-lora',
    'crimson': 'font-crimson',
    'source-serif': 'font-source-serif',
    'libre-baskerville': 'font-libre-baskerville',
    'vollkorn': 'font-vollkorn',
    'bree-serif': 'font-bree-serif',
    'josefin-sans': 'font-josefin-sans',
    'quicksand': 'font-quicksand',
    'comfortaa': 'font-comfortaa',
    'fredoka': 'font-fredoka',
    'nunito': 'font-nunito',
    'montserrat': 'font-montserrat'
  }



  return (
    <main className={`relative min-h-screen w-full overflow-hidden ${fontClasses[currentFont]}`}>

      
      {/* Background */}
      {bgMode === 'video' && bgUrl ? (
        <video 
          className={`video-bg ${
            wallpaperBrightness === 'darker' ? 'brightness-50' :
            wallpaperBrightness === 'dark' ? 'brightness-75' :
            wallpaperBrightness === 'normal' ? 'brightness-100' : 'brightness-120'
          }`} 
          autoPlay muted loop playsInline 
          preload="auto" 
          src={bgUrl}
          onLoadStart={() => console.log('🎬 Video loading started')}
          onCanPlay={() => console.log('🎬 Video can play')}
          onLoadedData={() => console.log('🎬 Video data loaded')}
          onError={(e) => {
            console.error('🎬 Video error:', e)
            // Fallback to animated background if video fails
            setBgMode('video')
            setBgUrl('')
          }}
        />
      ) : bgMode === 'image' && bgUrl ? (
        <img 
          className={`video-bg object-cover ${
            wallpaperBrightness === 'darker' ? 'brightness-50' :
            wallpaperBrightness === 'dark' ? 'brightness-75' :
            wallpaperBrightness === 'normal' ? 'brightness-100' : 'brightness-120'
          }`} 
          src={bgUrl} alt="background" 
        />
      ) : (
        <div className="video-bg bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
          {/* Enhanced animated background elements to prevent any white/grey flash */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-pulse-glow" style={{animationDelay: '2s'}}></div>
            <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-cyan-500/20 rounded-full blur-2xl animate-bounce" style={{animationDelay: '0.5s'}}></div>
            <div className="absolute bottom-1/4 left-1/4 w-56 h-56 bg-emerald-500/20 rounded-full blur-2xl animate-ping" style={{animationDelay: '1.5s'}}></div>
          </div>
          
          <div className="text-center text-white/60 relative z-10">
            {isLoadingWallpaper ? (
              <>
                <div className="text-6xl mb-4 animate-pulse">🎬</div>
                <div className="text-xl font-medium mb-2">Loading Live Wallpaper...</div>
                <div className="text-sm text-white/40">This will take just a moment</div>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4">🎨</div>
                <div className="text-xl font-medium mb-2">No Wallpapers Available</div>
              </>
            )}
          </div>
        </div>
      )}
      <div className="video-overlay" />

      {/* Hide Everything Toggle - Always Visible */}
        <div className="fixed bottom-6 left-6 z-[40]">
        <Tooltip content={hideEverything ? 'Show Everything' : 'Hide Everything'}>
          <button
            onClick={() => {
              playClickSoundIfEnabled()
              setHideEverything(!hideEverything)
            }}
            className={`w-10 h-10 rounded-full border backdrop-blur flex items-center justify-center transition-all duration-200 ${
              hideEverything 
                ? 'bg-white/30 border-white/40 text-white' 
                : 'bg-black/30 border-white/20 text-white/80 hover:bg-white/20'
            }`}
          >
          {hideEverything ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
            </svg>
                      )}
          </button>
          </Tooltip>
        </div>
        
      {/* Main Content - Hidden when hideEverything is true */}
      {!hideEverything && (
        <>
          {/* Header */}
      <div className="fixed top-8 inset-x-8 z-[80] flex items-center justify-between">
        <div className="flex items-center gap-2">
          {showSlideshow && (
            <>
          <span className="text-white/60 text-xs font-medium">Slideshow</span>
              <div className="rounded-xl bg-white/10 border border-white/20 px-3 py-2 backdrop-blur">
          <button
            onClick={() => {
              playToggleSoundIfEnabled()
              setSlideshowEnabled(!slideshowEnabled)
            }}
            className={`relative inline-flex h-5 w-10 items-center rounded-full transition-all duration-200 focus:outline-none ${
              slideshowEnabled ? 'bg-white/30' : 'bg-white/20'
            }`}
          >
            <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white/90 transition-all duration-200 ${
                slideshowEnabled ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </button>
              </div>
              
              {/* Refresh button */}
              <button
                onClick={loadWallpapers}
                className="rounded-lg bg-white/10 border border-white/20 px-2 py-1 text-white/60 hover:text-white/90 transition-colors text-xs"
                title="Refresh wallpapers"
              >
                ↻
              </button>
              
              {slideshowEnabled && wallpapers.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                    {[0, 1, 2].map((index) => (
                  <div
                    key={index}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                          index === (currentWallpaperIndex % 3) ? 'bg-white/80' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
                </div>
              )}
              {wallpapers.length > 0 && (
                <span className="text-white/40 text-xs font-medium">
                  {wallpapers.length} wallpapers loaded
              </span>
              )}
              
              {/* Cache status indicator */}
              {urlCache.size > 0 && (
                <span className="text-white/30 text-xs font-medium">
                  {urlCache.size} cached
                </span>
              )}
              
              {/* Loading indicator */}
              {isLoadingWallpaper && (
                <div className="flex items-center gap-2 text-white/40 text-xs">
                  <div className="w-3 h-3 border-2 border-white/20 border-t-white/60 rounded-full animate-spin"></div>
                  <span>Loading...</span>
                </div>
              )}
            </>
          )}
        </div>
        
        {showTitle && (
          <div className="absolute left-1/2 transform -translate-x-1/2 rounded-xl bg-white/10 border border-white/20 px-4 py-2 backdrop-blur">
            <h1 className={`font-semibold tracking-[0.25em] uppercase text-white/90 ${
              logoSize === 'small' ? 'text-sm md:text-base' :
              logoSize === 'medium' ? 'text-lg md:text-xl' :
              'text-xl md:text-2xl'
            }`}>Moodelix</h1>
          </div>
        )}
        
        <div className="flex items-center gap-3">
          {/* User Button - First in the row */}
          <UserButton 
            onClick={playClickSoundIfEnabled}
            blurIntensity={blurIntensity}
          />
          
          <Tooltip content={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}>
            <button
              onClick={() => {
                playClickSoundIfEnabled()
                if (!document.fullscreenElement) {
                  document.documentElement.requestFullscreen();
                  setIsFullscreen(true);
                } else {
                  document.exitFullscreen();
                  setIsFullscreen(false);
                }
              }}
              className="w-10 h-10 rounded-full bg-white/10 border border-white/20 backdrop-blur flex items-center justify-center transition-all duration-200 hover:bg-white/20"
            >
            {isFullscreen ? (
              <svg className="w-5 h-5 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 3v3a2 2 0 01-2 2H3m18 0h-3a2 2 0 01-2-2V3m0 18v-3a2 2 0 012-2h3M3 16h3a2 2 0 012 2v3"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
              </svg>
            )}
          </button>
          </Tooltip>
          
          <Tooltip content="Change Font">
            <button
              onClick={() => {
                playClickSoundIfEnabled()
                setShowFontPanel(!showFontPanel)
              }}
              className="w-10 h-10 rounded-full bg-white/10 border border-white/20 backdrop-blur flex items-center justify-center transition-all duration-200 hover:bg-white/20"
            >
            <svg className="w-5 h-5 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 4h12M6 4v16M6 12h8" />
            </svg>
          </button>
          </Tooltip>

          <Tooltip content="Support & Links">
            <button
              onClick={() => {
                playClickSoundIfEnabled()
                setShowSupportPanel(!showSupportPanel)
              }}
              className="w-10 h-10 rounded-full bg-white/10 border border-white/20 backdrop-blur flex items-center justify-center transition-all duration-200 hover:bg-white/20"
            >
              <svg className="w-5 h-5 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          </Tooltip>

          <Tooltip content="Settings">
            <button 
              onClick={() => {
                playClickSoundIfEnabled()
                setShowSettings(!showSettings)
              }}
              className="setting-btn"
            >
            <span className="bar bar1"></span>
            <span className="bar bar2"></span>
            <span className="bar bar1"></span>
          </button>
          </Tooltip>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
                  <div className="fixed inset-0 z-[99] bg-black/20" onClick={() => {
            playExitSoundIfEnabled()
            setShowSettings(false)
          }}>
          <div className="fixed top-24 right-8 bg-black/30 border border-white/20 rounded-lg p-4 min-w-[280px] z-[100]" style={{backdropFilter: `blur(${blurIntensity}px)`}} onClick={(e) => e.stopPropagation()}>
          <div className="text-white text-sm font-medium mb-4">Settings</div>
          
          <div className="flex items-center justify-between mb-3">
            <span className="text-white/80 text-xs">Show Slideshow</span>
            <div className="rounded-xl bg-white/10 border border-white/20 px-3 py-2 backdrop-blur">
              <button
                onClick={() => {
                  playToggleSoundIfEnabled()
                  setShowSlideshow(!showSlideshow)
                }}
                className={`relative inline-flex h-5 w-10 items-center rounded-full transition-all duration-200 focus:outline-none ${
                  showSlideshow ? 'bg-white/30' : 'bg-white/20'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white/90 transition-all duration-200 ${
                    showSlideshow ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mb-3">
            <span className="text-white/80 text-xs">Show Bottom Menu</span>
            <div className="rounded-xl bg-white/10 border border-white/20 px-3 py-2 backdrop-blur">
              <button
                onClick={() => {
                  playToggleSoundIfEnabled()
                  setShowBottomMenu(!showBottomMenu)
                }}
                className={`relative inline-flex h-5 w-10 items-center rounded-full transition-all duration-200 focus:outline-none ${
                  showBottomMenu ? 'bg-white/30' : 'bg-white/20'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white/90 transition-all duration-200 ${
                    showBottomMenu ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mb-3">
            <span className="text-white/80 text-xs">Show Title</span>
            <div className="rounded-xl bg-white/10 border border-white/20 px-3 py-2 backdrop-blur">
              <button
                onClick={() => {
                  playToggleSoundIfEnabled()
                  setShowTitle(!showTitle)
                }}
                className={`relative inline-flex h-5 w-10 items-center rounded-full transition-all duration-200 focus:outline-none ${
                  showTitle ? 'bg-white/30' : 'bg-white/20'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white/90 transition-all duration-200 ${
                    showTitle ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mb-3">
            <span className="text-white/80 text-xs">Randomize Slideshow</span>
            <div className="rounded-xl bg-white/10 border border-white/20 px-3 py-2 backdrop-blur">
              <button
                onClick={() => {
                  playToggleSoundIfEnabled()
                  setSlideshowRandomized(!slideshowRandomized)
                }}
                className={`relative inline-flex h-5 w-10 items-center rounded-full transition-all duration-200 focus-outline-none ${
                  slideshowRandomized ? 'bg-white/30' : 'bg-white/20'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white/90 transition-all duration-200 ${
                    slideshowRandomized ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
            <span className="text-white/80 text-xs">Slideshow Speed</span>
              <span className="text-white/60 text-xs">{slideshowSpeed}s</span>
            </div>
            <div className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg backdrop-blur">
              <input
                type="range"
                min="5"
                max="60"
                value={slideshowSpeed}
                onChange={(e) => setSlideshowSpeed(Number(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.3) ${((slideshowSpeed - 5) / 55) * 100}%, rgba(255,255,255,0.1) ${((slideshowSpeed - 5) / 55) * 100}%, rgba(255,255,255,0.1) 100%)`
                }}
              />
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/80 text-xs">Blur Intensity</span>
              <span className="text-white/60 text-xs">{blurIntensity}px</span>
            </div>
            <div className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg backdrop-blur">
              <input
                type="range"
                min="0"
                max="20"
                value={blurIntensity}
                onChange={(e) => setBlurIntensity(Number(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.3) ${(blurIntensity / 20) * 100}%, rgba(255,255,255,0.1) ${(blurIntensity / 20) * 100}%, rgba(255,255,255,0.1) 100%)`
                }}
              />
            </div>
          </div>



          <div className="flex items-center justify-between mb-3">
            <span className="text-white/80 text-xs">Logo Size</span>
            <div className="flex gap-1">
              {(['small', 'medium', 'large'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => setLogoSize(size)}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    logoSize === size
                      ? 'bg-white/30 text-white'
                      : 'bg-white/10 text-white/60 hover:text-white/80'
                  }`}
                >
                  {size.charAt(0).toUpperCase() + size.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between mb-3">
            <span className="text-white/80 text-xs">Quote Size</span>
            <div className="flex gap-1">
              {(['small', 'medium', 'large'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => setQuoteSize(size)}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    quoteSize === size
                      ? 'bg-white/30 text-white'
                      : 'bg-white/10 text-white/60 hover:text-white/80'
                  }`}
                >
                  {size.charAt(0).toUpperCase() + size.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between mb-3">
            <span className="text-white/80 text-xs">Button Size</span>
            <div className="flex gap-1">
              {(['small', 'medium', 'large'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => setButtonSize(size)}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    buttonSize === size
                      ? 'bg-white/30 text-white'
                      : 'bg-white/10 text-white/60 hover:text-white/80'
                  }`}
                >
                  {size.charAt(0).toUpperCase() + size.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between mb-3">
            <span className="text-white/80 text-xs">Music Player</span>
            <div className="rounded-xl bg-white/10 border border-white/20 px-3 py-2 backdrop-blur">
              <button
                onClick={() => {
                  playToggleSoundIfEnabled()
                  setShowBackgroundPlayer(!showBackgroundPlayer)
                }}
                className={`relative inline-flex h-5 w-10 items-center rounded-full transition-all duration-200 focus:outline-none ${
                  showBackgroundPlayer ? 'bg-white/30' : 'bg-white/20'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white/90 transition-all duration-200 ${
                    showBackgroundPlayer ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mb-3">
            <span className="text-white/80 text-xs">Sound Effects</span>
            <div className="rounded-xl bg-white/10 border border-white/20 px-3 py-2 backdrop-blur">
              <button
                onClick={() => {
                  playToggleSoundIfEnabled()
                  setSoundEffectsEnabled(!soundEffectsEnabled)
                }}
                className={`relative inline-flex h-5 w-10 items-center rounded-full transition-all duration-200 focus:outline-none ${
                  soundEffectsEnabled ? 'bg-white/30' : 'bg-white/20'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white/90 transition-all duration-200 ${
                    soundEffectsEnabled ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mb-3">
            <span className="text-white/80 text-xs">Wallpaper Brightness</span>
            <div className="flex gap-1">
              {(['darker', 'dark', 'normal', 'bright'] as const).map((brightness) => (
                <button
                  key={brightness}
                  onClick={() => {
                    playClickSoundIfEnabled()
                    setWallpaperBrightness(brightness)
                  }}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    wallpaperBrightness === brightness
                      ? 'bg-white/30 text-white'
                      : 'bg-white/10 text-white/60 hover:text-white/80'
                  }`}
                  title={
                    brightness === 'darker' ? 'Darker (70% brightness)' :
                    brightness === 'dark' ? 'Dark (85% brightness)' :
                    brightness === 'normal' ? 'Normal (100% brightness)' :
                    'Bright (120% brightness)'
                  }
                >
                  {brightness.charAt(0).toUpperCase() + brightness.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
        </div>
      )}

      {/* Support Panel */}
      {showSupportPanel && (
        <div className="fixed inset-0 z-[99] bg-black/20" onClick={() => {
          playExitSoundIfEnabled()
          setShowSupportPanel(false)
        }}>
          <div className="fixed top-24 right-8 bg-black/30 border border-white/20 rounded-lg p-4 min-w-[280px] z-[100]" style={{backdropFilter: `blur(${blurIntensity}px)`}} onClick={(e) => e.stopPropagation()}>
            <div className="text-white text-sm font-medium mb-4">Support & Links</div>
            
            <div className="space-y-3">
              {/* Wallpaper Request */}
              <a
                href="mailto:preethaml99@outlook.com?subject=Wallpaper%20Request%20-%20Attach%20Your%20Wallpaper%20and%20Send%20Thanks!"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition-colors text-white/90 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm">Request Wallpaper</span>
              </a>

              {/* Buy Me a Coffee */}
              <a
                href="https://buymeacoffee.com/pr33thaml"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition-colors text-white/90 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="text-sm">Buy Me a Coffee</span>
              </a>

              {/* Report Bug */}
              <button
                onClick={() => {
                  playClickSoundIfEnabled()
                  setShowBugReport(true)
                }}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition-colors text-white/90 hover:text-white w-full text-left"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className="text-sm">Report Bug</span>
              </button>

              {/* GitHub */}
              <a
                href="https://github.com/pr33thaml"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition-colors text-white/90 hover:text-white"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span className="text-sm">GitHub</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Bug Report Popup */}
      <BugReportPopup
        isOpen={showBugReport}
        onClose={() => setShowBugReport(false)}
        onClick={playClickSoundIfEnabled}
        blurIntensity={blurIntensity}
      />

      {/* Font Panel */}
      {showFontPanel && (
        <div className="fixed inset-0 z-[99] bg-black/20" onClick={() => {
          playExitSoundIfEnabled()
          setShowFontPanel(false)
        }}>
          <div className="fixed top-24 right-8 bg-black/30 border border-white/20 rounded-lg p-3 min-w-[220px] max-w-[240px] z-[100]" style={{backdropFilter: `blur(${blurIntensity}px)`}} onClick={(e) => e.stopPropagation()}>
            <div className="text-white text-sm font-medium mb-3">Font Settings</div>
            
            <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent pr-2">
              {[
                { key: 'space-grotesk', name: 'Space Grotesk', preview: 'AaBbCcDd', category: 'Modern' },
                { key: 'handwriting', name: 'Architects Daughter', preview: 'AaBbCcDd', category: 'Handwriting' },
                { key: 'inter', name: 'Inter', preview: 'AaBbCcDd', category: 'Clean' },
                { key: 'poppins', name: 'Poppins', preview: 'AaBbCcDd', category: 'Friendly' },
                { key: 'roboto', name: 'Roboto', preview: 'AaBbCcDd', category: 'Google' },
                { key: 'cinzel', name: 'Cinzel', preview: 'AaBbCcDd', category: 'Elegant' },
                { key: 'playfair', name: 'Playfair Display', preview: 'AaBbCcDd', category: 'Classic' },
                { key: 'merriweather', name: 'Merriweather', preview: 'AaBbCcDd', category: 'Serif' },
                { key: 'lora', name: 'Lora', preview: 'AaBbCcDd', category: 'Serif' },
                { key: 'crimson', name: 'Crimson Text', preview: 'AaBbCcDd', category: 'Serif' },
                { key: 'source-serif', name: 'Source Serif Pro', preview: 'AaBbCcDd', category: 'Serif' },
                { key: 'libre-baskerville', name: 'Libre Baskerville', preview: 'AaBbCcDd', category: 'Classic' },
                { key: 'vollkorn', name: 'Vollkorn', preview: 'AaBbCcDd', category: 'Serif' },
                { key: 'bree-serif', name: 'Bree Serif', preview: 'AaBbCcDd', category: 'Serif' },
                { key: 'josefin-sans', name: 'Josefin Sans', preview: 'AaBbCcDd', category: 'Sans' },
                { key: 'quicksand', name: 'Quicksand', preview: 'AaBbCcDd', category: 'Rounded' },
                { key: 'comfortaa', name: 'Comfortaa', preview: 'AaBbCcDd', category: 'Rounded' },
                { key: 'fredoka', name: 'Fredoka One', preview: 'AaBbCcDd', category: 'Fun' },
                { key: 'nunito', name: 'Nunito', preview: 'AaBbCcDd', category: 'Friendly' },
                { key: 'montserrat', name: 'Montserrat', preview: 'AaBbCcDd', category: 'Modern' }
              ].map((font) => (
                <button
                  key={font.key}
                  onClick={() => {
                    playClickSoundIfEnabled()
                    setCurrentFont(font.key as any)
                  }}
                  className={`w-full p-2 rounded-lg border transition-all text-left ${
                    currentFont === font.key
                      ? 'bg-white/20 border-white/40 text-white'
                      : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/15'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-sm font-medium">{font.name}</div>
                    <div className="text-xs text-white/60 bg-white/10 px-1.5 py-0.5 rounded-full">{font.category}</div>
                  </div>
                  <div className={`text-base ${fontClasses[font.key as keyof typeof fontClasses]}`}>
                    {font.preview}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      {showTodo ? (
        /* Todo Panel - Replaces main content */
        <div className="relative z-30 min-h-screen px-4 text-center pb-32">
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-xl mx-auto">
            <div className="bg-black/30 border border-white/20 rounded-lg p-4" style={{backdropFilter: `blur(${blurIntensity}px)`}}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white text-xl font-semibold">My Tasks</h2>
                <button
                  onClick={() => setShowTodo(false)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <TodoList onTodosChange={fetchTodosFromAPI} />
            </div>
          </div>
        </div>
      ) : showFocus ? (
        /* Focus Panel - Replaces main content */
        <div className="relative z-30 min-h-screen px-4 text-center pb-32">
          <div className="fixed top-32 left-1/2 transform -translate-x-1/2 w-full max-w-6xl mx-auto max-h-[calc(100vh-20rem)] overflow-y-auto custom-scrollbar">
            <div className="bg-black/30 border border-white/20 rounded-lg p-10" style={{backdropFilter: `blur(${blurIntensity}px)`}}>
              <div className="flex items-center justify-center mb-6">
                <h2 className="text-white text-2xl font-semibold">Deep Work Zone</h2>
              </div>

              <div className="text-center mb-8">
                <div className="text-8xl font-bold text-white mb-4">
                  {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:{(timeLeft % 60).toString().padStart(2, '0')}
                </div>
                <div className="text-white/60 text-xl capitalize mb-3">{focusMode === 'focus' ? 'Deep Work' : focusMode === 'shortBreak' ? 'Quick Rest' : 'Long Break'} Session</div>
                
                {/* Timer Duration Controls */}
                <div className="flex items-center justify-center gap-6 mb-4">
                  <button
                    onClick={() => decreaseTimerDuration(focusMode)}
                    disabled={timerDurations[focusMode] <= (focusMode === 'focus' ? 25 : 1) || isTimerRunning}
                    className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                  >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                    </svg>
                  </button>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      max={focusMode === 'focus' ? 240 : 60}
                      value={timerDurations[focusMode]}
                      onChange={(e) => {
                        const value = parseInt(e.target.value)
                        const maxValue = focusMode === 'focus' ? 240 : 60
                        if (!isNaN(value) && value >= 1 && value <= maxValue) {
                          setTimerDurations(prev => ({
                            ...prev,
                            [focusMode]: value
                          }))
                          
                          // If this is the current mode and timer is not running, update the display
                          if (!isTimerRunning) {
                            setTimeLeft(value * 60)
                          }
                        }
                      }}
                      onBlur={(e) => {
                        const value = parseInt(e.target.value)
                        const minValue = focusMode === 'focus' ? 25 : 1
                        const maxValue = focusMode === 'focus' ? 240 : 60
                        if (isNaN(value) || value < minValue || value > maxValue) {
                          setTimerDurations(prev => ({
                            ...prev,
                            [focusMode]: Math.max(minValue, Math.min(maxValue, value || minValue))
                          }))
                          if (!isTimerRunning) {
                            setTimeLeft(minValue * 60)
                          }
                        } else if (value > 60) {
                          setTimerDurations(prev => ({
                            ...prev,
                            [focusMode]: 60
                          }))
                          if (!isTimerRunning) {
                            setTimeLeft(60 * 60)
                          }
                        }
                      }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.currentTarget.blur()
                        }
                      }}
                      disabled={isTimerRunning}
                      className="w-20 px-3 py-2 text-center bg-white/10 border border-white/20 rounded text-white text-xl font-medium focus:outline-none focus:border-white/40 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <span className="text-white/80 text-xl">min</span>
                  </div>
                  
                  <button
                    onClick={() => increaseTimerDuration(focusMode)}
                    disabled={timerDurations[focusMode] >= 60 || isTimerRunning}
                    className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                  >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                </div>
                
                <div className="text-white/50 text-sm">
                  {isTimerRunning ? 'Timer running - adjust after reset' : 'Adjust timer duration (type or use +/- buttons)'}
                </div>
                
                {/* Break Schedule Indicator */}
                {scheduledBreaks.length > 0 && autoBreakSettings.enabled && !autoBreakSettings.skipBreaks && (
                  <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                    <div className="text-orange-400 text-sm font-medium mb-2">📅 Break Schedule</div>
                    <div className="text-white/80 text-sm">
                      {scheduledBreaks.length} break{scheduledBreaks.length > 1 ? 's' : ''} at {scheduledBreaks.map((b, i) => `${b.time} min`).join(', ')}
                    </div>
                  </div>
                )}

                {/* Timer Controls */}
                <div className="flex gap-4 justify-center mt-6">
                  <button
                    onClick={resetTimer}
                    className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors flex items-center justify-center gap-2 text-base font-medium"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Reset Timer
                  </button>
                  {isTimerRunning ? (
                    <button
                      onClick={pauseTimer}
                      className="px-6 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors flex items-center justify-center gap-2 text-base font-medium"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Pause Timer
                    </button>
                  ) : (
                    <button
                      onClick={startTimer}
                      className="px-6 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors flex items-center justify-center gap-2 text-base font-medium"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Start Timer
                    </button>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mb-8 justify-center">
                {(['focus', 'shortBreak', 'longBreak'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => switchMode(mode)}
                    className={`px-6 py-3 rounded-lg text-lg font-medium transition-colors ${
                      focusMode === mode
                        ? 'bg-white/20 text-white'
                        : 'bg-white/10 text-white/60 hover:text-white/80'
                    }`}
                  >
                    {mode === 'focus' ? 'Deep Work' : mode === 'shortBreak' ? 'Quick Rest' : 'Long Break'}
                  </button>
                ))}
              </div>

              {/* Streak System */}
              <div className="mb-6">
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white text-lg font-semibold flex items-center gap-2">
                      <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      Focus Streak
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-white/60 text-sm">Goal:</span>
                      <input
                        type="number"
                        min="1"
                        max="12"
                        value={streakData.dailyGoal}
                        onChange={(e) => updateDailyGoal(parseInt(e.target.value) || 1)}
                        className="w-12 px-2 py-1 text-center bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:border-white/40"
                      />
                      <span className="text-white/60 text-sm">hrs</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-3">
                    {/* Current Streak */}
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-400">{streakData.currentStreak}</div>
                      <div className="text-white/60 text-sm">Day Streak</div>
                    </div>
                    
                    {/* Today's Progress */}
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">
                        {(streakData.todayFocusedMinutes / 60).toFixed(1)}
                      </div>
                      <div className="text-white/60 text-sm">Hours Today</div>
                    </div>
                    
                    {/* Total Hours */}
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">
                        {streakData.totalFocusedHours.toFixed(1)}
                      </div>
                      <div className="text-white/60 text-sm">Total Hours</div>
                    </div>
                    
                    {/* Goal Progress */}
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">
                        {focusProgress}%
                      </div>
                      <div className="text-white/60 text-sm">Goal Progress</div>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${focusProgress}%` 
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-white/60 mt-1">
                      <span>0h</span>
                      <span>{streakData.dailyGoal}h goal</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Task Progress */}
              {todos.length > 0 && (
                <div className="mb-6">
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-white text-lg font-semibold flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        Task Progress
                      </h3>
                      <span className="text-white/60 text-sm">
                        {todos.filter(t => t.completed).length} of {todos.length} completed
                      </span>
                    </div>
                    
                    {/* Task Progress Bar */}
                    <div className="w-full bg-white/10 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-blue-400 to-purple-400 h-3 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${taskProgress}%` 
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-white/60 mt-2">
                      <span>0%</span>
                      <span className="text-blue-400 font-medium">{taskProgress}% Complete</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Auto Break Settings */}
              <div className="mb-6">
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white text-lg font-semibold flex items-center gap-2">
                      <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      Auto Break Settings
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-white/60 text-sm">Enabled</span>
                      <button
                        onClick={() => setAutoBreakSettings(prev => ({ ...prev, enabled: !prev.enabled }))}
                        className={`relative inline-flex h-5 w-10 items-center rounded-full transition-all duration-200 focus:outline-none ${
                          autoBreakSettings.enabled ? 'bg-orange-500' : 'bg-white/20'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all duration-200 ${
                            autoBreakSettings.enabled ? 'translate-x-5' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                  
                  {autoBreakSettings.enabled && (
                    <>
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-white/80 text-sm font-medium">Break Duration</span>
                          <span className="text-white/60 text-sm">{autoBreakSettings.breakDuration} min</span>
                        </div>
                        <div className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg">
                          <input
                            type="range"
                            min="5"
                            max="30"
                            value={autoBreakSettings.breakDuration}
                            onChange={(e) => setAutoBreakSettings(prev => ({ ...prev, breakDuration: Number(e.target.value) }))}
                            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                            style={{
                              background: `linear-gradient(to right, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.3) ${((autoBreakSettings.breakDuration - 5) / 25) * 100}%, rgba(255,255,255,0.1) ${((autoBreakSettings.breakDuration - 5) / 25) * 100}%, rgba(255,255,255,0.1) 100%)`
                            }}
                          />
                          <div className="flex justify-between text-xs text-white/50 mt-2">
                            <span>5 min</span>
                            <span>30 min</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <div className="flex items-center justify-between">
                          <span className="text-white/80 text-sm font-medium">Skip All Breaks</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setAutoBreakSettings(prev => ({ ...prev, skipBreaks: !prev.skipBreaks }))}
                              disabled={isTimerRunning}
                              className={`relative inline-flex h-5 w-10 items-center rounded-full transition-all duration-200 focus:outline-none ${
                                autoBreakSettings.skipBreaks ? 'bg-orange-500' : 'bg-white/20'
                              } ${isTimerRunning ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all duration-200 ${
                                  autoBreakSettings.skipBreaks ? 'translate-x-5' : 'translate-x-0.5'
                                }`}
                              />
                            </button>
                            {isTimerRunning && (
                              <span className="text-white/40 text-xs">Session running</span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Break Schedule Preview */}
                      {scheduledBreaks.length > 0 && (
                        <div className="mt-6">
                          <div className="text-white/80 text-sm font-medium mb-3">Scheduled Breaks:</div>
                          <div className="space-y-2">
                            {scheduledBreaks.map((breakItem, index) => (
                              <div key={breakItem.id} className="flex items-center justify-between p-2 bg-white/5 rounded">
                                <span className="text-white/80 text-sm">
                                  Break {index + 1}: {breakItem.time} min
                                </span>
                                <div className="flex items-center gap-2">
                                  {breakItem.completed && <span className="text-green-400 text-xs">✓ Completed</span>}
                                  {breakItem.skipped && <span className="text-orange-400 text-xs">⏭ Skipped</span>}
                                  {!breakItem.completed && !breakItem.skipped && !isTimerRunning && (
                                    <button
                                      onClick={() => skipBreak(breakItem.id)}
                                      className="text-orange-400 text-xs hover:text-orange-300"
                                    >
                                      Skip
                                    </button>
                                  )}
                                  {!breakItem.completed && !breakItem.skipped && isTimerRunning && (
                                    <span className="text-white/40 text-xs">Session running</span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                          {isTimerRunning && (
                            <div className="mt-3 p-2 bg-orange-500/10 border border-orange-500/20 rounded text-orange-400 text-xs">
                              ⚠️ Cannot skip breaks during active session
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-white/80 text-base">Current Mission:</span>
                </div>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newFocusTask}
                    onChange={(e) => setNewFocusTask(e.target.value)}
                    placeholder="What's your main focus today?"
                    className="flex-1 px-6 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/40 text-lg"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && newFocusTask.trim()) {
                        addTodoFromFocus(newFocusTask.trim())
                        setNewFocusTask('')
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      if (newFocusTask.trim()) {
                        addTodoFromFocus(newFocusTask.trim())
                        setNewFocusTask('')
                      }
                    }}
                    className="px-6 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors text-base font-medium"
                  >
                    Add Mission
                  </button>
                </div>
              </div>

              {todos.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-white/80 text-base mb-3">Active Missions:</h3>
                  <div className="space-y-2 max-h-24 overflow-y-auto custom-scrollbar">
                    {todos.map((todo) => (
                      <div
                        key={todo.id}
                        className={`flex items-center gap-2 p-2 rounded-lg text-sm ${
                          todo.completed
                            ? 'bg-white/5 text-white/40'
                            : 'bg-white/10 text-white'
                        }`}
                      >
                        <button
                          onClick={() => toggleTodo(todo.id)}
                          className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                            todo.completed
                              ? 'bg-green-500 border-green-500'
                              : 'border-white/40 hover:border-white/60'
                          }`}
                        >
                          {todo.completed && (
                            <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                        <span className={`flex-1 text-xs ${todo.completed ? 'line-through' : ''}`}>
                          {todo.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      ) : (
        /* Default Clock/Timer View */
      <div className="relative z-20 min-h-screen px-4 text-center pb-32">
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 space-y-6">
          <div>
            {mounted && timeString && (() => { 
              const m = timeString.match(/(.*?)(?:\s*)(AM|PM|am|pm)$/); 
              const main = m? m[1] : timeString; 
              const suffix = m? m[2].toLowerCase() : ''; 
                
                // Split time into parts for individual animation
                const timeParts = main.split(':');
                const hours = timeParts[0] || '00';
                const minutes = timeParts[1] || '00';
                const seconds = timeParts[2] || '00';
                
              return (
                  <div className="tabular-nums text-6xl md:text-8xl lg:text-9xl drop-shadow-sm text-white/90 flex items-baseline justify-center">
                    <span key={hours} className="transition-all duration-500 ease-in-out transform">{hours}</span>
                    <span className="mx-1">:</span>
                    <span key={minutes} className="transition-all duration-500 ease-in-out transform">{minutes}</span>
                    {seconds && (
                      <>
                        <span className="mx-1">:</span>
                        <span key={seconds} className="transition-all duration-500 ease-in-out transform">{seconds}</span>
                      </>
                    )}
                    {suffix && <span key={suffix} className="ml-3 text-2xl align-baseline text-white/90 transition-all duration-500 ease-in-out transform">{suffix}</span>}
                </div>
              )
            })()}
          </div>
          <p className={`mx-auto max-w-2xl text-white/90 min-h-[1.5em] ${
            quoteSize === 'small' ? 'text-base md:text-lg' :
            quoteSize === 'medium' ? 'text-lg md:text-2xl' :
            'text-xl md:text-3xl'
          }`}>{typed}</p>
        </div>
      </div>
      )}



      {/* Bottom Menu */}
      {showBottomMenu && (
        <footer className="fixed inset-x-0 bottom-6 grid place-items-center z-[90] pointer-events-none">
        <div className="pointer-events-auto">
            <CenterMenu 
              onMusic={() => setShowMusic(true)} 
              onWallpaperChange={handleWallpaperChange} 
              onTodo={() => {
                console.log('Todo button clicked, setting showTodo to true')
                setShowFocus(false)
                setShowTodo(true)
              }}
              onFocus={() => {
                console.log('Focus button clicked, setting showFocus to true')
                setShowTodo(false)
                setShowFocus(true)
              }}
              onHome={() => {
                console.log('Home button clicked, closing all panels')
                setShowFocus(false)
                setShowTodo(false)
              }}
              wallpapers={getLiveWallpapers().map(w => w.url).concat(getPhotoWallpapers().map(w => w.url))}
              buttonSize={buttonSize}
              blurIntensity={blurIntensity}
              onClick={playClickSoundIfEnabled}
            />
        </div>
      </footer>
      )}
        </>
      )}

      {/* Music Player */}
      {showMusic && (
        <div className="fixed inset-0 z-30 grid place-items-center bg-black/60 p-4" onClick={() => {
          playExitSoundIfEnabled()
          handleMusicTabClose()
        }}>
          <div onClick={(e) => e.stopPropagation()}>
            <EnhancedMusicPlayer 
              onClose={handleMusicTabClose} 
              onMusicPlay={handleMusicPlay}
              isPlaying={isMusicPlaying}
              onTogglePlay={() => setIsMusicPlaying(!isMusicPlaying)}
              blurIntensity={blurIntensity}
            />
          </div>
        </div>
      )}


      {/* Background Music Player */}
      <BackgroundMusicPlayer
        url={backgroundMusicUrl}
        type={backgroundMusicType}
        isVisible={isMusicPlaying && showBackgroundPlayer && !isMusicMinimized}
        isPlaying={isMusicPlaying}
        onMinimize={() => setIsMusicMinimized(true)}
        blurIntensity={blurIntensity}
      />

            {/* Music Player Button - Only visible when music player is enabled in settings */}
      {showBackgroundPlayer && (
        <div className="fixed bottom-6 right-6 z-30">
              <button
          onClick={() => {
            if (isMusicPlaying && isMusicMinimized) {
              // Restore the background player
              setIsMusicMinimized(false)
            } else if (isMusicPlaying && showBackgroundPlayer) {
              // Minimize the background player
              setIsMusicMinimized(true)
            } else if (isMusicPlaying && !showBackgroundPlayer) {
              // Show the background player
              setShowBackgroundPlayer(true)
              setIsMusicMinimized(false)
            } else {
              // Open the music tab
              setShowMusic(true)
            }
          }}
          className={`w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/20 shadow-2xl transition-all duration-300 hover:scale-110 ${
            isMusicPlaying ? 'hover:bg-black/60' : 'hover:bg-black/60'
          }`}
          title={isMusicPlaying ? (isMusicMinimized ? `Restore Music Player - ${currentTrack?.title || 'Now Playing'}` : showBackgroundPlayer ? `Minimize Music Player - ${currentTrack?.title || 'Now Playing'}` : `Show Music Player - ${currentTrack?.title || 'Now Playing'}`) : "Open Music Player"}
        >
          <div className="w-full h-full flex items-center justify-center">
            {isMusicPlaying ? (
              <div className="relative">
                {currentTrack?.platform === 'youtube' ? (
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.6-1.061.6-4.17 0-7.46-1.5-9.41-3.9 2.82 1.86 5.46 2.7 8.87 2.7 1.62 0 3.26-.21 4.99-.6.46-.14.89-.48 1.08-.9.2-.43.14-.9-.09-1.27-.23-.37-.66-.6-1.08-.6-.48 0-.87.21-1.08.6-.2.43-.14.9.09 1.27.23.37.66.6 1.08.6z"/>
                </svg>
                )}
                {/* Animated pulse ring when playing */}
                <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping"></div>
            </div>
            ) : (
              <svg className="w-6 h-6 text-white/60" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </div>
          </button>
        </div>
      )}




      {/* Footer Info */}
      <div className="fixed bottom-2 inset-x-0 flex items-center justify-center text-xs text-white/70 z-[80]">
        <div className="text-center">
          <span className="block">Moodelix - vibe, study, focus and get stuff done</span>
        </div>
      </div>
    </main>
  )
}


