import { useCallback, useEffect, useRef, useState } from 'react'

interface SoundEffects {
  click: string
  click2: string
  exit: string
  toggle: string
}

export function useSoundEffects() {
  const [sounds, setSounds] = useState<SoundEffects>({
    click: '',
    click2: '',
    exit: '',
    toggle: ''
  })
  const [isLoaded, setIsLoaded] = useState(false)
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({})

  // Load sound effects from API
  useEffect(() => {
    const loadSounds = async () => {
      try {
        const response = await fetch('/api/sounds')
        if (response.ok) {
          const data = await response.json()
          const soundFiles = data.sounds || []
          
          // Map sound files to their types based on filename
          const soundMap: SoundEffects = {
            click: soundFiles.find((s: string) => s.includes('click') && !s.includes('click 2')) || '',
            click2: soundFiles.find((s: string) => s.includes('click 2')) || '',
            exit: soundFiles.find((s: string) => s.includes('exit')) || '',
            toggle: soundFiles.find((s: string) => s.includes('toggle')) || ''
          }
          
          setSounds(soundMap)
          
          // Preload audio elements
          Object.entries(soundMap).forEach(([key, url]) => {
            if (url) {
              const audio = new Audio(url)
              audio.preload = 'auto'
              audio.volume = 0.3 // Set default volume
              audioRefs.current[key] = audio
            }
          })
          
          setIsLoaded(true)
        }
      } catch (error) {
        console.error('Error loading sounds:', error)
        setIsLoaded(true) // Set loaded even if sounds fail to load
      }
    }

    loadSounds()
  }, [])

  // Play sound effect
  const playSound = useCallback((type: keyof SoundEffects) => {
    const audio = audioRefs.current[type]
    if (audio && sounds[type]) {
      // Reset audio to beginning and play
      audio.currentTime = 0
      audio.play().catch(error => {
        console.log('Audio play failed:', error)
      })
    }
  }, [sounds])

  // Alternating click sounds
  const [clickAlternator, setClickAlternator] = useState(false)
  const playClickSound = useCallback(() => {
    const soundType = clickAlternator ? 'click2' : 'click'
    if (sounds[soundType]) {
      playSound(soundType)
      setClickAlternator(!clickAlternator)
    }
  }, [sounds, clickAlternator, playSound])

  // Play exit sound
  const playExitSound = useCallback(() => {
    if (sounds.exit) {
      playSound('exit')
    }
  }, [sounds.exit, playSound])

  // Play toggle sound
  const playToggleSound = useCallback(() => {
    if (sounds.toggle) {
      playSound('toggle')
    }
  }, [sounds.toggle, playSound])

  // Set volume for all sounds
  const setVolume = useCallback((volume: number) => {
    Object.values(audioRefs.current).forEach(audio => {
      audio.volume = Math.max(0, Math.min(1, volume))
    })
  }, [])

  return {
    isLoaded,
    playClickSound,
    playExitSound,
    playToggleSound,
    setVolume
  }
}
