'use client'

import { useEffect, useMemo, useState } from 'react'
import TodoList from '@/components/TodoList'
import YouTubeMoodPlayer from '@/components/YouTubeMoodPlayer'
import CenterMenu from '@/components/CenterMenu'

// removed unused menuItems

export default function HomePage() {
  const [timeString, setTimeString] = useState('')
  const [mounted, setMounted] = useState(false)
  const [bgMode, setBgMode] = useState<'video' | 'image'>('video')
  const [bgUrl, setBgUrl] = useState('/wallpaper/autumn-fuji-moewalls-com.mp4')
  const [quoteIndex, setQuoteIndex] = useState(0)
  const [typed, setTyped] = useState('')
  const [showMusic, setShowMusic] = useState(false)
  const [showTodo, setShowTodo] = useState(false)
  const [backgroundVideoId, setBackgroundVideoId] = useState('UI5NKkW8acM')
  const [showBackgroundPlayer, setShowBackgroundPlayer] = useState(true)
  const [slideshowEnabled, setSlideshowEnabled] = useState(false)
  
  // Wallpaper slideshow array - using actual available files
  const wallpapers = [
    '/wallpaper/autumn-fuji-moewalls-com.mp4',
    '/wallpaper/minecraft-autumn-mountains-moewalls-com.mp4',
    '/wallpaper/toyota-ae86-trueno-drifting-initial-d-moewalls-com.mp4',
    '/wallpaper/asuka-x-evangelion-unit-02-moewalls-com.mp4',
    '/wallpaper/cherry-blossom-tree-on-volcano-moewalls-com.mp4',
    '/wallpaper/japanese-town-cloudy-day-moewalls-com.mp4',
    '/wallpaper/torii-gate-fuji-mountain-sakura-lake-moewalls-com.mp4',
    '/wallpaper/winter-night-train-moewalls-com.mp4'
  ]
  const [currentWallpaperIndex, setCurrentWallpaperIndex] = useState(0)
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

  useEffect(() => {
    setMounted(true)
    setTimeString(new Date().toLocaleTimeString())
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    const clock = setInterval(() => setTimeString(new Date().toLocaleTimeString()), 1000)
    const quoteTimer = setInterval(() => setQuoteIndex((i) => (i + 1) % quotes.length), 7000)
    
    return () => {
      clearInterval(clock)
      clearInterval(quoteTimer)
    }
  }, [quotes.length, mounted])

  // Wallpaper slideshow effect
  useEffect(() => {
    if (!slideshowEnabled) return
    
    const slideshowTimer = setInterval(() => {
      setCurrentWallpaperIndex((prevIndex) => (prevIndex + 1) % wallpapers.length)
    }, 10000) // Change wallpaper every 10 seconds
    
    return () => clearInterval(slideshowTimer)
  }, [slideshowEnabled, wallpapers.length])

  // simple typewriter effect for the current quote
  useEffect(() => {
    setTyped('')
    const target = quotes[quoteIndex]
    let i = 0
    const id = setInterval(() => {
      i += 1
      setTyped(target.slice(0, i))
      if (i >= target.length) clearInterval(id)
    }, 60)
    return () => clearInterval(id)
  }, [quoteIndex, quotes])

  const handleWallpaperChange = (url: string) => {
    console.log('Main page: Wallpaper change requested:', url)
    setBgUrl(url)
    setBgMode('video')
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      {bgMode === 'video' && (slideshowEnabled ? wallpapers[currentWallpaperIndex] : bgUrl) ? (
        <video className="video-bg" autoPlay muted loop playsInline src={slideshowEnabled ? wallpapers[currentWallpaperIndex] : bgUrl} />
      ) : bgMode === 'image' && (slideshowEnabled ? wallpapers[currentWallpaperIndex] : bgUrl) ? (
        <img className="video-bg object-cover" src={slideshowEnabled ? wallpapers[currentWallpaperIndex] : bgUrl} alt="background" />
      ) : null}
      <div className="video-overlay" />

      {/* top header with logo and slideshow toggle */}
      <div className="fixed top-8 inset-x-8 z-20 flex items-center justify-between">
        {/* Logo - reduced size */}
        <div className="rounded-xl bg-white/10 border border-white/20 px-4 py-2 backdrop-blur">
          <h1 className="text-lg md:text-xl font-semibold tracking-[0.25em] uppercase text-white/90">Moodify</h1>
        </div>
        
        {/* Slideshow Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-white/60 text-xs font-medium">Slideshow</span>
          <button
            onClick={() => setSlideshowEnabled(!slideshowEnabled)}
            className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors focus:outline-none focus:ring-1 focus:ring-white/30 focus:ring-offset-1 focus:ring-offset-transparent ${
              slideshowEnabled ? 'bg-white/30' : 'bg-white/20'
            }`}
          >
            <span
              className={`inline-block h-3 w-3 transform rounded-full bg-white/90 transition-transform ${
                slideshowEnabled ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </button>
          {slideshowEnabled && (
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {wallpapers.map((_, index) => (
                  <div
                    key={index}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      index === currentWallpaperIndex ? 'bg-white/80' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
              <span className="text-white/60 text-xs font-medium">
                {currentWallpaperIndex === 0 && 'Autumn Fuji'}
                {currentWallpaperIndex === 1 && 'Minecraft Autumn Mountains'}
                {currentWallpaperIndex === 2 && 'Toyota AE86'}
                {currentWallpaperIndex === 3 && 'Evangelion'}
                {currentWallpaperIndex === 4 && 'Cherry Blossom Volcano'}
                {currentWallpaperIndex === 5 && 'Japanese Town'}
                {currentWallpaperIndex === 6 && 'Torii Gate & Fuji'}
                {currentWallpaperIndex === 7 && 'Winter Night Train'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* center content */}
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
          <p className="mx-auto max-w-2xl text-white/90 text-lg md:text-2xl min-h-[1.5em]">{typed}</p>
        </div>
      </div>

      {/* bottom-centered menu */}
      <footer className="fixed inset-x-0 bottom-6 grid place-items-center z-20 pointer-events-none">
        <div className="pointer-events-auto">
          <CenterMenu onMusic={() => setShowMusic(true)} onWallpaperChange={handleWallpaperChange} onTodo={() => setShowTodo(true)} />
        </div>
      </footer>

      {/* Todo list is now shown as a modal when the todo button is clicked */}

      {/* music player is hidden until requested */}
      {showMusic && (
        <div className="fixed inset-0 z-30 grid place-items-center bg-black/60 p-4" onClick={()=>setShowMusic(false)}>
          <div className="w-full max-w-3xl" onClick={(e)=>e.stopPropagation()}>
            <YouTubeMoodPlayer onVideoChange={setBackgroundVideoId} />
            <div className="mt-3 flex justify-end">
              <button className="px-3 py-2 rounded bg-transparent hover:bg-white/10 text-white/90 hover:text-white border border-white/20 transition-colors" onClick={()=>setShowMusic(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Todo list modal */}
      {showTodo && (
        <div className="fixed inset-0 z-30 grid place-items-center bg-black/60 p-4" onClick={()=>setShowTodo(false)}>
          <div className="w-full max-w-2xl" onClick={(e)=>e.stopPropagation()}>
            <TodoList />
            <div className="mt-3 flex justify-end">
              <button className="px-3 py-2 rounded bg-transparent hover:bg-white/10 text-white/90 hover:text-white border border-white/20 transition-colors" onClick={()=>setShowTodo(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Auto-playing YouTube Background Music */}
      {showBackgroundPlayer && (
        <div className="fixed bottom-6 right-6 z-20">
          <div className="bg-black rounded-lg shadow-2xl overflow-hidden">
            <div className="bg-red-600 text-white px-3 py-2 text-center flex items-center justify-between">
              <span className="text-sm font-medium">🎵 Background Music</span>
              <button
                onClick={() => setShowBackgroundPlayer(false)}
                className="text-white hover:text-gray-200 transition-colors"
                title="Hide Background Music"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <iframe
              src={`https://www.youtube.com/embed/${backgroundVideoId}?autoplay=1&controls=0&modestbranding=1&rel=0&showinfo=0&loop=1&mute=0&enablejsapi=1`}
              className="w-64 h-36"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Background Music"
            />
          </div>
        </div>
      )}

      {/* Show Background Music Button (when hidden) */}
      {!showBackgroundPlayer && (
        <div className="fixed bottom-6 right-6 z-20">
          <button
            onClick={() => setShowBackgroundPlayer(true)}
            className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-lg transition-colors"
            title="Show Background Music"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
          </button>
        </div>
      )}

      <div className="fixed bottom-2 inset-x-0 flex items-center justify-center text-xs text-white/70 z-10">
        <span>Focus & Study App • 4K Wallpapers • YouTube Background Music</span>
      </div>
    </main>
  )
}


