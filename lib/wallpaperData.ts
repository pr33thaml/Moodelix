// Wallpaper data with your real wallpaper files
// These are now your actual uploaded wallpapers from the public folder

export interface WallpaperItem {
  id: string
  name: string
  type: 'video' | 'image'
  url: string
  thumbnail?: string
  category: 'live' | 'photo'
}

export const wallpapers: WallpaperItem[] = [
  // Live Wallpapers (Videos) - Your real wallpaper files
  {
    id: '1',
    name: 'Grand Theft Auto VI',
    type: 'video',
    url: './wallpaper/live wallpapers/grand-theft-auto-vi.mp4',
    category: 'live'
  },
  {
    id: '2',
    name: 'Minecraft Autumn Mountains',
    type: 'video',
    url: './wallpaper/live wallpapers/minecraft-autumn-mountains.mp4',
    category: 'live'
  },
  {
    id: '3',
    name: 'Cyberpunk',
    type: 'video',
    url: './wallpaper/live wallpapers/cyberpunk.mp4',
    category: 'live'
  },
  {
    id: '4',
    name: 'Lilac Field at Night',
    type: 'video',
    url: './wallpaper/live wallpapers/lilac-field-at-night-minecraft.mp4',
    category: 'live'
  },
  {
    id: '5',
    name: 'Scarlet Rock Shrine',
    type: 'video',
    url: './wallpaper/live wallpapers/scarlet-rock-shrine-ghost-of-tsushima.mp4',
    category: 'live'
  },
  {
    id: '6',
    name: 'Cartethiya',
    type: 'video',
    url: './wallpaper/live wallpapers/cartethiya.mp4',
    category: 'live'
  },
  {
    id: '7',
    name: 'Ferrari Testarossa',
    type: 'video',
    url: './wallpaper/live wallpapers/ferrari-testarossa-highway-cruise.mp4',
    category: 'live'
  },
  {
    id: '8',
    name: 'Sunset Drive Synthwave',
    type: 'video',
    url: './wallpaper/live wallpapers/sunset-drive-synthwave.mp4',
    category: 'live'
  },
  {
    id: '9',
    name: 'Synthwave Cyberpunk',
    type: 'video',
    url: './wallpaper/live wallpapers/synthwave-cyberpunk.mp4',
    category: 'live'
  },
  {
    id: '10',
    name: 'Purrple Cat Picnic',
    type: 'video',
    url: './wallpaper/live wallpapers/purrple-cat-picnic-universe.mp4',
    category: 'live'
  },
  {
    id: '11',
    name: 'Black Hole',
    type: 'video',
    url: './wallpaper/live wallpapers/black-hole.mp4',
    category: 'live'
  },
  {
    id: '12',
    name: 'Void Hole',
    type: 'video',
    url: './wallpaper/live wallpapers/void-hole.mp4',
    category: 'live'
  },
  {
    id: '13',
    name: 'Ghost Ready for Battle',
    type: 'video',
    url: './wallpaper/live wallpapers/ghost-ready-for-battle.mp4',
    category: 'live'
  },
  {
    id: '14',
    name: 'Asuka Evangelion',
    type: 'video',
    url: './wallpaper/live wallpapers/asuka-x-evangelion.mp4',
    category: 'live'
  },
  {
    id: '15',
    name: 'Toyota AE86 Trueno',
    type: 'video',
    url: './wallpaper/live wallpapers/toyota-ae86-trueno.mp4',
    category: 'live'
  },
  
  // Photo Wallpapers (Images) - Your real photo wallpapers
  {
    id: '16',
    name: 'Photo 1',
    type: 'image',
    url: './wallpaper/photo wallpaper/1 (1).jpg',
    category: 'photo'
  },
  {
    id: '17',
    name: 'Photo 2',
    type: 'image',
    url: './wallpaper/photo wallpaper/1 (1).png',
    category: 'photo'
  },
  {
    id: '18',
    name: 'Photo 3',
    type: 'image',
    url: './wallpaper/photo wallpaper/1 (18).jpg',
    category: 'photo'
  },
  {
    id: '19',
    name: 'Photo 4',
    type: 'image',
    url: './wallpaper/photo wallpaper/1 (19).jpg',
    category: 'photo'
  },
  {
    id: '20',
    name: 'Photo 5',
    type: 'image',
    url: './wallpaper/photo wallpaper/1 (2).png',
    category: 'photo'
  },
  {
    id: '21',
    name: 'Photo 6',
    type: 'image',
    url: './wallpaper/photo wallpaper/1 (21).jpg',
    category: 'photo'
  },
  {
    id: '22',
    name: 'Photo 7',
    type: 'image',
    url: './wallpaper/photo wallpaper/1 (25).jpg',
    category: 'photo'
  },
  {
    id: '23',
    name: 'Photo 8',
    type: 'image',
    url: './wallpaper/photo wallpaper/1 (29).jpg',
    category: 'photo'
  },
  {
    id: '24',
    name: 'Photo 9',
    type: 'image',
    url: './wallpaper/photo wallpaper/1 (3).png',
    category: 'photo'
  },
  {
    id: '25',
    name: 'Photo 10',
    type: 'image',
    url: './wallpaper/photo wallpaper/1 (33).jpg',
    category: 'photo'
  },
  {
    id: '26',
    name: 'Photo 11',
    type: 'image',
    url: './wallpaper/photo wallpaper/1 (5).jpg',
    category: 'photo'
  },
  {
    id: '27',
    name: 'Photo 12',
    type: 'image',
    url: './wallpaper/photo wallpaper/1 (7).jpg',
    category: 'photo'
  },
  {
    id: '28',
    name: 'Photo 13',
    type: 'image',
    url: './wallpaper/photo wallpaper/1 (8).png',
    category: 'photo'
  }
]

// Helper function to get wallpapers by category
export const getWallpapersByCategory = (category: 'live' | 'photo') => {
  return wallpapers.filter(wallpaper => wallpaper.category === category)
}

// Helper function to get random wallpaper
export const getRandomWallpaper = (category?: 'live' | 'photo') => {
  const filtered = category ? getWallpapersByCategory(category) : wallpapers
  if (filtered.length === 0) return null
  return filtered[Math.floor(Math.random() * filtered.length)]
}

// Helper function to get live wallpapers only
export const getLiveWallpapers = () => getWallpapersByCategory('live')

// Helper function to get photo wallpapers only
export const getPhotoWallpapers = () => getWallpapersByCategory('photo')
