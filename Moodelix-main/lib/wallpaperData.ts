// Wallpaper data with S3 URLs
// These are now your actual wallpapers stored in AWS S3

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
    url: 'live-wallpapers/grand-theft-auto-vi.mp4',
    thumbnail: 'live-wallpapers/grand-theft-auto-vi.mp4',
    category: 'live'
  },
  {
    id: '2',
    name: 'Minecraft Autumn Mountains',
    type: 'video',
    url: 'live-wallpapers/minecraft-autumn-mountains.mp4',
    thumbnail: 'live-wallpapers/minecraft-autumn-mountains.mp4',
    category: 'live'
  },
  {
    id: '3',
    name: 'Cyberpunk',
    type: 'video',
    url: 'live-wallpapers/cyberpunk.mp4',
    thumbnail: 'live-wallpapers/cyberpunk.mp4',
    category: 'live'
  },
  {
    id: '4',
    name: 'Lilac Field at Night',
    type: 'video',
    url: 'live-wallpapers/lilac-field-at-night-minecraft.mp4',
    thumbnail: 'live-wallpapers/lilac-field-at-night-minecraft.mp4',
    category: 'live'
  },
  {
    id: '5',
    name: 'Scarlet Rock Shrine',
    type: 'video',
    url: 'live-wallpapers/scarlet-rock-shrine-ghost-of-tsushima.mp4',
    thumbnail: 'live-wallpapers/scarlet-rock-shrine-ghost-of-tsushima.mp4',
    category: 'live'
  },
  {
    id: '6',
    name: 'Cartethiya',
    type: 'video',
    url: 'live-wallpapers/cartethiya.mp4',
    thumbnail: 'live-wallpapers/cartethiya.mp4',
    category: 'live'
  },
  {
    id: '7',
    name: 'Ferrari Testarossa',
    type: 'video',
    url: 'live-wallpapers/ferrari-testarossa-highway-cruise.mp4',
    thumbnail: 'live-wallpapers/ferrari-testarossa-highway-cruise.mp4',
    category: 'live'
  },
  {
    id: '8',
    name: 'Sunset Drive Synthwave',
    type: 'video',
    url: 'live-wallpapers/sunset-drive-synthwave.mp4',
    thumbnail: 'live-wallpapers/sunset-drive-synthwave.mp4',
    category: 'live'
  },
  {
    id: '9',
    name: 'Synthwave Cyberpunk',
    type: 'video',
    url: 'live-wallpapers/synthwave-cyberpunk.mp4',
    thumbnail: 'live-wallpapers/synthwave-cyberpunk.mp4',
    category: 'live'
  },
  {
    id: '10',
    name: 'Purrple Cat Picnic',
    type: 'video',
    url: 'live-wallpapers/purrple-cat-picnic-universe.mp4',
    thumbnail: 'live-wallpapers/purrple-cat-picnic-universe.mp4',
    category: 'live'
  },
  {
    id: '11',
    name: 'Black Hole',
    type: 'video',
    url: 'live-wallpapers/black-hole.mp4',
    thumbnail: 'live-wallpapers/black-hole.mp4',
    category: 'live'
  },
  {
    id: '12',
    name: 'Void Hole',
    type: 'video',
    url: 'live-wallpapers/void-hole.mp4',
    thumbnail: 'live-wallpapers/void-hole.mp4',
    category: 'live'
  },
  {
    id: '13',
    name: 'Ghost Ready for Battle',
    type: 'video',
    url: 'live-wallpapers/ghost-ready-for-battle.mp4',
    thumbnail: 'live-wallpapers/ghost-ready-for-battle.mp4',
    category: 'live'
  },
  {
    id: '14',
    name: 'Asuka Evangelion',
    type: 'video',
    url: 'live-wallpapers/asuka-x-evangelion.mp4',
    thumbnail: 'live-wallpapers/asuka-x-evangelion.mp4',
    category: 'live'
  },
  {
    id: '15',
    name: 'Toyota AE86 Trueno',
    type: 'video',
    url: 'live-wallpapers/toyota-ae86-trueno.mp4',
    thumbnail: 'live-wallpapers/toyota-ae86-trueno.mp4',
    category: 'live'
  },
  
  // Photo Wallpapers (Images) - Only fast-loading photos (< 2MB)
  {
    id: '16',
    name: 'Photo 1',
    type: 'image',
    url: 'photo-wallpaper/1 (1).jpg',
    thumbnail: 'photo-wallpaper/1 (1).jpg', // Use actual S3 file as thumbnail
    category: 'photo'
  },
  {
    id: '17',
    name: 'Photo 2',
    type: 'image',
    url: 'photo-wallpaper/1 (18).jpg',
    thumbnail: 'photo-wallpaper/1 (18).jpg', // Use actual S3 file as thumbnail
    category: 'photo'
  },
  {
    id: '18',
    name: 'Photo 3',
    type: 'image',
    url: 'photo-wallpaper/1 (21).jpg',
    thumbnail: 'photo-wallpaper/1 (21).jpg', // Use actual S3 file as thumbnail
    category: 'photo'
  },
  {
    id: '19',
    name: 'Photo 4',
    type: 'image',
    url: 'photo-wallpaper/1 (29).jpg',
    thumbnail: 'photo-wallpaper/1 (29).jpg', // Use actual S3 file as thumbnail
    category: 'photo'
  },
  {
    id: '20',
    name: 'Photo 5',
    type: 'image',
    url: 'photo-wallpaper/1 (33).jpg',
    thumbnail: 'photo-wallpaper/1 (33).jpg', // Use actual S3 file as thumbnail
    category: 'photo'
  },
  {
    id: '21',
    name: 'Photo 6',
    type: 'image',
    url: 'photo-wallpaper/1 (5).jpg',
    thumbnail: 'photo-wallpaper/1 (5).jpg', // Use actual S3 file as thumbnail
    category: 'photo'
  },
  {
    id: '22',
    name: 'Photo 7',
    type: 'image',
    url: 'photo-wallpaper/1 (7).jpg',
    thumbnail: 'photo-wallpaper/1 (7).jpg', // Use actual S3 file as thumbnail
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
