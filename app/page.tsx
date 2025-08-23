'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import EnhancedMusicPlayer from '@/components/EnhancedMusicPlayer'
import BackgroundMusicPlayer from '@/components/BackgroundMusicPlayer'
import CenterMenu from '@/components/CenterMenu'
import BugReportPopup from '@/components/BugReportPopup'
import { useSoundEffects } from '@/lib/useSoundEffects'
import Tooltip from '@/components/Tooltip'
import { wallpapers as staticWallpapers, getRandomWallpaper, getLiveWallpapers, getPhotoWallpapers } from '@/lib/wallpaperData'

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
  const [slideshowSpeed, setSlideshowSpeed] = useState<'slow' | 'medium' | 'fast'>('fast')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showFocus, setShowFocus] = useState(false)
  const [showSlideshow, setShowSlideshow] = useState(true)
  const [showBottomMenu, setShowBottomMenu] = useState(true)
  const [showTitle, setShowTitle] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [showFontPanel, setShowFontPanel] = useState(false)
  const [showSupportPanel, setShowSupportPanel] = useState(false)
  const [showBugReport, setShowBugReport] = useState(false)
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

  // Helper function to get signed URL from API
  const getSignedUrl = async (s3Key: string): Promise<string> => {
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
      return data.signedUrl
    } catch (error) {
      console.error('Error getting signed URL:', error)
      throw error
    }
  }

  // Wallpaper functions - Lazy loading for better performance
  const loadWallpapers = useCallback(async () => {
    try {
      // Get wallpaper data (just the keys, not URLs yet)
      const liveWallpapers = getLiveWallpapers()
      const photoWallpapers = getPhotoWallpapers()
      
      // Store wallpaper keys for selection (not URLs)
      setWallpapers(liveWallpapers.map(w => w.url))
      setAllWallpapers([...liveWallpapers.map(w => w.url), ...photoWallpapers.map(w => w.url)])
      
      if (liveWallpapers.length > 0) {
        // Only load ONE random wallpaper initially (lazy loading)
        const randomIndex = Math.floor(Math.random() * liveWallpapers.length)
        const randomWallpaperKey = liveWallpapers[randomIndex].url
        
        // Convert only this one to signed URL
        const randomWallpaperUrl = await getSignedUrl(randomWallpaperKey)
        
        setBgUrl(randomWallpaperUrl)
        setCurrentWallpaperIndex(randomIndex)
        setBgMode('video')
      }
    } catch (error) {
      console.error('Error loading wallpapers:', error)
    }
  }, [])

  const handleWallpaperChange = async (s3Key: string) => {
    try {
      // Convert S3 key to signed URL
      const signedUrl = await getSignedUrl(s3Key)
      
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
      
      setBgUrl(signedUrl)
    } catch (error) {
      console.error('Error loading wallpaper:', error)
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
        
        // Determine if it's a video or image based on file extension
        if (newWallpaper.match(/\.(mp4|webm|mov)$/i)) {
    setBgMode('video')
        } else {
          setBgMode('image')
        }
        
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
          autoPlay muted loop playsInline preload="auto" src={bgUrl} 
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
        <div className="video-bg bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
          <div className="text-center text-white/60">
            <div className="text-6xl mb-4">🎨</div>
            <div className="text-xl font-medium mb-2">No Wallpapers Available</div>
          </div>
        </div>
      )}
      <div className="video-overlay" />

      {/* Hide Everything Toggle - Always Visible */}
      <div className="fixed bottom-6 left-6 z-[60]">
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
      <div className="fixed top-8 inset-x-8 z-20 flex items-center justify-between">
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
          <div className="fixed top-24 right-8 bg-black/30 border border-white/20 rounded-lg p-4 min-w-[280px] z-[100] backdrop-blur-sm" onClick={(e) => e.stopPropagation()}>
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
          <div className="fixed top-24 right-8 bg-black/30 border border-white/20 rounded-lg p-4 min-w-[280px] z-[100] backdrop-blur-sm" onClick={(e) => e.stopPropagation()}>
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
      />

      {/* Font Panel */}
      {showFontPanel && (
        <div className="fixed inset-0 z-[99] bg-black/20" onClick={() => {
          playExitSoundIfEnabled()
          setShowFontPanel(false)
        }}>
          <div className="fixed top-24 right-8 bg-black/30 border border-white/20 rounded-lg p-3 min-w-[220px] max-w-[240px] z-[100] backdrop-blur-sm" onClick={(e) => e.stopPropagation()}>
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
                <div className="text-8xl font-bold text-white mb-4">
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                <div className="tabular-nums text-6xl md:text-8xl lg:text-9xl drop-shadow-sm text-white/90">
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
                setShowFocus(false)
                setShowTodo(false)
              }}
              wallpapers={getLiveWallpapers().map(w => w.url).concat(getPhotoWallpapers().map(w => w.url))}
              buttonSize={buttonSize}
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


