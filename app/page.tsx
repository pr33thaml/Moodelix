'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import EnhancedMusicPlayer from '@/components/EnhancedMusicPlayer'
import MiniPlayerControl from '@/components/MiniPlayerControl'
import BackgroundMusicPlayer from '@/components/BackgroundMusicPlayer'
import CenterMenu from '@/components/CenterMenu'
import { useSoundEffects } from '@/lib/useSoundEffects'

export default function HomePage() {
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
  const [slideshowSpeed, setSlideshowSpeed] = useState<'slow' | 'medium' | 'fast'>('fast')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showFocus, setShowFocus] = useState(false)
  const [showSlideshow, setShowSlideshow] = useState(true)
  const [showBottomMenu, setShowBottomMenu] = useState(true)
  const [showTitle, setShowTitle] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [tasks, setTasks] = useState<Array<{id: string, text: string, completed: boolean, createdAt: Date}>>([])
  const [focusMode, setFocusMode] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus')
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [newTaskText, setNewTaskText] = useState('')
  const [newFocusTask, setNewFocusTask] = useState('')
  
  const [wallpapers, setWallpapers] = useState<string[]>([])
  const [allWallpapers, setAllWallpapers] = useState<string[]>([])
  const [currentWallpaperIndex, setCurrentWallpaperIndex] = useState(0)
  const [wallpaperType, setWallpaperType] = useState<'live' | 'photo'>('live')
  
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
              setFocusMode('shortBreak')
              setTimeLeft(5 * 60)
            } else if (focusMode === 'shortBreak') {
              setFocusMode('focus')
              setTimeLeft(25 * 60)
            } else {
              setFocusMode('focus')
              setTimeLeft(25 * 60)
            }
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isTimerRunning, timeLeft, focusMode])

  // Task management functions
  const addTask = (text: string) => {
    const newTask = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: new Date()
    }
    setTasks(prev => [...prev, newTask])
  }

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id))
  }

  const startTimer = () => setIsTimerRunning(true)
  const pauseTimer = () => setIsTimerRunning(false)
  
  const resetTimer = () => {
    setIsTimerRunning(false)
    if (focusMode === 'focus') {
      setTimeLeft(25 * 60)
    } else if (focusMode === 'shortBreak') {
      setTimeLeft(5 * 60)
    } else {
      setTimeLeft(15 * 60)
    }
  }

  const switchMode = (mode: 'focus' | 'shortBreak' | 'longBreak') => {
    setFocusMode(mode)
    setIsTimerRunning(false)
    if (mode === 'focus') {
      setTimeLeft(25 * 60)
    } else if (mode === 'shortBreak') {
      setTimeLeft(5 * 60)
    } else {
      setTimeLeft(15 * 60)
    }
  }

  // Wallpaper functions
  const loadWallpapers = useCallback(async () => {
    try {
      const response = await fetch('/api/wallpapers')
      if (response.ok) {
        const data = await response.json()
        // Set default wallpapers (only live wallpapers for page reload)
        setWallpapers(data.wallpapers)
        // Store all wallpapers for wallpaper selection
        setAllWallpapers(data.allWallpapers || [])
        
        if (data.wallpapers.length > 0) {
          const randomIndex = Math.floor(Math.random() * data.wallpapers.length)
          const randomWallpaper = data.wallpapers[randomIndex]
          setBgUrl(randomWallpaper)
          setCurrentWallpaperIndex(randomIndex)
          
          if (randomWallpaper.match(/\.(mp4|webm|mov)$/i)) {
            setBgMode('video')
          } else {
            setBgMode('image')
          }
        }
      }
    } catch (error) {
      console.error('Error loading wallpapers:', error)
    }
  }, [])

  const handleWallpaperChange = (url: string) => {
    setBgUrl(url)
    
    // Check if it's a live wallpaper (for slideshow compatibility)
    const isLiveWallpaper = url.match(/\.(mp4|webm|mov)$/i)
    
    if (isLiveWallpaper) {
      // For live wallpapers, find index in the slideshow wallpapers
      const index = wallpapers.indexOf(url)
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
  }

  useEffect(() => {
    setMounted(true)
    setTimeString(new Date().toLocaleTimeString())
    loadWallpapers()
  }, [loadWallpapers])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

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

  // Wallpaper slideshow effect
  useEffect(() => {
    if (!slideshowEnabled || wallpapers.length === 0) return
    
    const getSlideshowSpeed = () => {
      switch (slideshowSpeed) {
        case 'slow': return 60000    // 60 seconds
        case 'medium': return 30000  // 30 seconds
        case 'fast': return 10000     // 10seconds
        default: return 10000
      }
    }
    
    const slideshowTimer = setInterval(() => {
      setCurrentWallpaperIndex((prevIndex) => {
        let newIndex
        if (wallpapers.length === 1) {
          newIndex = 0
        } else if (slideshowRandomized) {
          do {
            newIndex = Math.floor(Math.random() * wallpapers.length)
          } while (newIndex === prevIndex)
        } else {
          newIndex = (prevIndex + 1) % wallpapers.length
        }
        
        const newWallpaper = wallpapers[newIndex]
        setBgUrl(newWallpaper)
        setBgMode('video')
        
        return newIndex
      })
    }, getSlideshowSpeed())
    
    return () => clearInterval(slideshowTimer)
  }, [slideshowEnabled, wallpapers.length, slideshowRandomized, slideshowSpeed])

  // Ensure individual wallpapers loop when slideshow is disabled
  useEffect(() => {
    if (slideshowEnabled || !bgUrl || bgMode !== 'video') return
    
    // When slideshow is disabled and we have a video wallpaper, ensure it loops
    // The video element already has the 'loop' attribute, but we need to ensure
    // the slideshow timer doesn't interfere with individual wallpaper loops
    setCurrentWallpaperIndex(-1) // Mark as not in slideshow mode
  }, [slideshowEnabled, bgUrl, bgMode])

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      {/* Background */}
      {bgMode === 'video' && bgUrl ? (
        <video className="video-bg" autoPlay muted loop playsInline src={bgUrl} />
      ) : bgMode === 'image' && bgUrl ? (
        <img className="video-bg object-cover" src={bgUrl} alt="background" />
      ) : (
        <div className="video-bg bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
          <div className="text-center text-white/60">
            <div className="text-6xl mb-4">🎨</div>
            <div className="text-xl font-medium mb-2">No Wallpapers Available</div>
          </div>
        </div>
      )}
      <div className="video-overlay" />

      {/* Header */}
      <div className="fixed top-8 inset-x-8 z-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {showSlideshow && (
            <>
          <span className="text-white/60 text-xs font-medium">Slideshow</span>
              <div className="rounded-xl bg-white/10 border border-white/20 px-3 py-2 backdrop-blur">
          <button
            onClick={() => setSlideshowEnabled(!slideshowEnabled)}
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
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
                  <div className="fixed inset-0 z-[99] bg-black/20" onClick={() => {
            playExitSoundIfEnabled()
            setShowSettings(false)
          }}>
          <div className="fixed top-24 right-8 bg-black/30 border border-white/20 rounded-lg p-4 min-w-[280px] z-[100] backdrop-blur-sm" onClick={(e) => e.stopPropagation()}>
          <div className="text-white text-sm font-medium mb-4">Settings</div>
          
          <div className="flex items-center justify-between mb-3">
            <span className="text-white/80 text-xs">Show Slideshow</span>
            <div className="rounded-xl bg-white/10 border border-white/20 px-3 py-2 backdrop-blur">
              <button
                onClick={() => setShowSlideshow(!showSlideshow)}
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
                onClick={() => setShowBottomMenu(!showBottomMenu)}
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
                onClick={() => setShowTitle(!showTitle)}
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
                onClick={() => setSlideshowRandomized(!slideshowRandomized)}
                className={`relative inline-flex h-5 w-10 items-center rounded-full transition-all duration-200 focus:outline-none ${
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

          <div className="flex items-center justify-between mb-3">
            <span className="text-white/80 text-xs">Slideshow Speed</span>
            <div className="flex gap-1">
              {(['slow', 'medium', 'fast'] as const).map((speed) => (
                <button
                  key={speed}
                  onClick={() => setSlideshowSpeed(speed)}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    slideshowSpeed === speed
                      ? 'bg-white/30 text-white'
                      : 'bg-white/10 text-white/60 hover:text-white/80'
                  }`}
                >
                  {speed.charAt(0).toUpperCase() + speed.slice(1)}
                </button>
              ))}
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
            <span className="text-white/80 text-xs">Music Player</span>
            <div className="rounded-xl bg-white/10 border border-white/20 px-3 py-2 backdrop-blur">
              <button
                onClick={() => setShowBackgroundPlayer(!showBackgroundPlayer)}
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
        </div>
        </div>
      )}

      {/* Main Content */}
      {showTodo ? (
        /* Todo Panel - Replaces main content */
        <div className="relative z-10 grid place-items-center min-h-screen px-4 text-center">
          <div className="w-full max-w-4xl">
            <div className="bg-black/30 border border-white/20 rounded-lg p-8 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-white text-2xl font-semibold">My Tasks</h2>
                <button
                  onClick={() => setShowTodo(false)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex gap-3 mb-8">
                <input
                  type="text"
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  placeholder="What do you want to accomplish?"
                  className="flex-1 px-6 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/40 text-lg"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && newTaskText.trim()) {
                      addTask(newTaskText.trim())
                      setNewTaskText('')
                    }
                  }}
                />
                <button
                  onClick={() => {
                    if (newTaskText.trim()) {
                      addTask(newTaskText.trim())
                      setNewTaskText('')
                    }
                  }}
                  className="px-8 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors text-lg font-medium"
                >
                  Add Task
                </button>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                {tasks.length === 0 ? (
                  <div className="text-center text-white/60 py-12">
                    <div className="text-xl">No tasks yet. Start building your success!</div>
                  </div>
                ) : (
                  tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                        task.completed
                          ? 'bg-white/5 border-white/10 text-white/60'
                          : 'bg-white/10 border-white/20 text-white'
                      }`}
                    >
                      <button
                        onClick={() => toggleTask(task.id)}
                        className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                          task.completed
                            ? 'bg-green-500 border-green-500'
                            : 'border-white/40 hover:border-white/60'
                        }`}
                      >
                        {task.completed && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                      <span className={`flex-1 text-lg ${task.completed ? 'line-through' : ''}`}>
                        {task.text}
                      </span>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-white/40 hover:text-red-400 transition-colors p-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      ) : showFocus ? (
        /* Focus Panel - Replaces main content */
        <div className="relative z-10 grid place-items-center min-h-screen px-4 text-center">
          <div className="w-full max-w-4xl">
            <div className="bg-black/30 border border-white/20 rounded-lg p-8 backdrop-blur-sm">
              <div className="flex items-center justify-center mb-8">
                <h2 className="text-white text-2xl font-semibold">Deep Work Zone</h2>
              </div>

              <div className="text-center mb-8">
                <div className="text-8xl font-mono font-bold text-white mb-4">
                  {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:{(timeLeft % 60).toString().padStart(2, '0')}
                </div>
                <div className="text-white/60 text-xl capitalize">{focusMode === 'focus' ? 'Deep Work' : focusMode === 'shortBreak' ? 'Quick Rest' : 'Long Break'} Session</div>
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

              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-white/80 text-lg">Current Mission:</span>
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
                        addTask(newFocusTask.trim())
                        setNewFocusTask('')
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      if (newFocusTask.trim()) {
                        addTask(newFocusTask.trim())
                        setNewFocusTask('')
                      }
                    }}
                    className="px-8 py-4 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors text-lg font-medium"
                  >
                    Add Mission
                  </button>
                </div>
              </div>

              {tasks.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-white/80 text-lg mb-4">Active Missions:</h3>
                  <div className="space-y-3 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                    {tasks.slice(0, 5).map((task) => (
                      <div
                        key={task.id}
                        className={`flex items-center gap-3 p-3 rounded-lg text-lg ${
                          task.completed
                            ? 'bg-white/5 text-white/40'
                            : 'bg-white/10 text-white'
                        }`}
                      >
                        <button
                          onClick={() => toggleTask(task.id)}
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                            task.completed
                              ? 'bg-green-500 border-green-500'
                              : 'border-white/40 hover:border-white/60'
                          }`}
                        >
                          {task.completed && (
                            <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                        <span className={`flex-1 ${task.completed ? 'line-through' : ''}`}>
                          {task.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-4 justify-center">
                <button
                  onClick={resetTimer}
                  className="px-8 py-4 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors flex items-center justify-center gap-3 text-lg font-medium"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reset Timer
                </button>
                {isTimerRunning ? (
                  <button
                    onClick={pauseTimer}
                    className="px-8 py-4 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors flex items-center justify-center gap-3 text-lg font-medium"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Pause
                  </button>
                ) : (
                  <button
                    onClick={startTimer}
                    className="px-8 py-4 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors flex items-center justify-center gap-3 text-lg font-medium"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Start Timer
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Default Clock/Timer View */
      <div className="relative z-10 grid place-items-center min-h-screen px-4 text-center">
        <div className="space-y-6">
          <div>
            {mounted && timeString && (() => { 
              const m = timeString.match(/(.*?)(?:\s*)(AM|PM|am|pm)$/); 
              const main = m? m[1] : timeString; 
              const suffix = m? m[2].toLowerCase() : ''; 
              return (
                <div className="font-mono tabular-nums text-6xl md:text-8xl lg:text-9xl drop-shadow-sm text-white/90">
                  {main}
                  {suffix && <span className="ml-3 text-2xl align-baseline text-white/90">{suffix}</span>}
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
        <footer className="fixed inset-x-0 bottom-6 grid place-items-center z-50 pointer-events-none">
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
                setShowTodo(false)
                setShowFocus(false)
              }}
              wallpapers={allWallpapers}

              onClick={playClickSoundIfEnabled}
            />
        </div>
      </footer>
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
      <div className="fixed bottom-2 inset-x-0 flex items-center justify-center text-xs text-white/70 z-10">
        <div className="text-center">
          <span className="block">Moodelix - vibe, study, focus and get stuff done</span>
        </div>
      </div>
    </main>
  )
}


