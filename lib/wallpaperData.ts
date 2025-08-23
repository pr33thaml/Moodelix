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
    thumbnail: 'https://via.placeholder.com/200x150/1f2937/ffffff?text=GTA+VI',
    category: 'live'
  },
  {
    id: '2',
    name: 'Minecraft Autumn Mountains',
    type: 'video',
    url: 'live-wallpapers/minecraft-autumn-mountains.mp4',
    thumbnail: 'https://via.placeholder.com/200x150/1f2937/ffffff?text=Minecraft',
    category: 'live'
  },
  {
    id: '3',
    name: 'Cyberpunk',
    type: 'video',
    url: 'live-wallpapers/cyberpunk.mp4',
    thumbnail: 'https://via.placeholder.com/200x150/1f2937/ffffff?text=Cyberpunk',
    category: 'live'
  },
  {
    id: '4',
    name: 'Lilac Field at Night',
    type: 'video',
    url: 'live-wallpapers/lilac-field-at-night-minecraft.mp4',
    thumbnail: 'https://via.placeholder.com/200x150/1f2937/ffffff?text=Lilac+Field',
    category: 'live'
  },
  {
    id: '5',
    name: 'Scarlet Rock Shrine',
    type: 'video',
    url: 'live-wallpapers/scarlet-rock-shrine-ghost-of-tsushima.mp4',
    thumbnail: 'https://via.placeholder.com/200x150/1f2937/ffffff?text=Scarlet+Rock',
    category: 'live'
  },
  {
    id: '6',
    name: 'Cartethiya',
    type: 'video',
    url: 'live-wallpapers/cartethiya.mp4',
    thumbnail: 'https://via.placeholder.com/200x150/1f2937/ffffff?text=Cartethiya',
    category: 'live'
  },
  {
    id: '7',
    name: 'Ferrari Testarossa',
    type: 'video',
    url: 'live-wallpapers/ferrari-testarossa-highway-cruise.mp4',
    thumbnail: 'https://via.placeholder.com/200x150/1f2937/ffffff?text=Ferrari',
    category: 'live'
  },
  {
    id: '8',
    name: 'Sunset Drive Synthwave',
    type: 'video',
    url: 'live-wallpapers/sunset-drive-synthwave.mp4',
    thumbnail: 'https://via.placeholder.com/200x150/1f2937/ffffff?text=Sunset+Drive',
    category: 'live'
  },
  {
    id: '9',
    name: 'Synthwave Cyberpunk',
    type: 'video',
    url: 'live-wallpapers/synthwave-cyberpunk.mp4',
    thumbnail: 'https://via.placeholder.com/200x150/1f2937/ffffff?text=Synthwave',
    category: 'live'
  },
  {
    id: '10',
    name: 'Purrple Cat Picnic',
    type: 'video',
    url: 'live-wallpapers/purrple-cat-picnic-universe.mp4',
    thumbnail: 'https://via.placeholder.com/200x150/1f2937/ffffff?text=Purrple+Cat',
    category: 'live'
  },
  {
    id: '11',
    name: 'Black Hole',
    type: 'video',
    url: 'live-wallpapers/black-hole.mp4',
    thumbnail: 'https://via.placeholder.com/200x150/1f2937/ffffff?text=Black+Hole',
    category: 'live'
  },
  {
    id: '12',
    name: 'Void Hole',
    type: 'video',
    url: 'live-wallpapers/void-hole.mp4',
    thumbnail: 'https://via.placeholder.com/200x150/1f2937/ffffff?text=Void+Hole',
    category: 'live'
  },
  {
    id: '13',
    name: 'Ghost Ready for Battle',
    type: 'video',
    url: 'live-wallpapers/ghost-ready-for-battle.mp4',
    thumbnail: 'https://via.placeholder.com/200x150/1f2937/ffffff?text=Ghost+Ready',
    category: 'live'
  },
  {
    id: '14',
    name: 'Asuka Evangelion',
    type: 'video',
    url: 'live-wallpapers/asuka-x-evangelion.mp4',
    thumbnail: 'https://via.placeholder.com/200x150/1f2937/ffffff?text=Asuka',
    category: 'live'
  },
  {
    id: '15',
    name: 'Toyota AE86 Trueno',
    type: 'video',
    url: 'live-wallpapers/toyota-ae86-trueno.mp4',
    thumbnail: 'https://via.placeholder.com/200x150/1f2937/ffffff?text=Toyota+AE86',
    category: 'live'
  },
  
  // Photo Wallpapers (Images) - Only fast-loading photos (< 2MB)
  {
    id: '16',
    name: 'Photo 1',
    type: 'image',
    url: 'photo-wallpaper/1 (1).jpg',
    thumbnail: 'https://via.placeholder.com/200x150/374151/ffffff?text=Photo+1',
    category: 'photo'
  },
  {
    id: '17',
    name: 'Photo 2',
    type: 'image',
    url: 'photo-wallpaper/1 (18).jpg',
    thumbnail: 'https://via.placeholder.com/200x150/374151/ffffff?text=Photo+2',
    category: 'photo'
  },
  {
    id: '18',
    name: 'Photo 3',
    type: 'image',
    url: 'photo-wallpaper/1 (21).jpg',
    thumbnail: 'https://via.placeholder.com/200x150/374151/ffffff?text=Photo+3',
    category: 'photo'
  },
  {
    id: '19',
    name: 'Photo 4',
    type: 'image',
    url: 'photo-wallpaper/1 (29).jpg',
    thumbnail: 'https://via.placeholder.com/200x150/374151/ffffff?text=Photo+4',
    category: 'photo'
  },
  {
    id: '20',
    name: 'Photo 5',
    type: 'image',
    url: 'photo-wallpaper/1 (33).jpg',
    thumbnail: 'https://via.placeholder.com/200x150/374151/ffffff?text=Photo+5',
    category: 'photo'
  },
  {
    id: '21',
    name: 'Photo 6',
    type: 'image',
    url: 'photo-wallpaper/1 (5).jpg',
    thumbnail: 'https://via.placeholder.com/200x150/374151/ffffff?text=Photo+6',
    category: 'photo'
  },
  {
    id: '22',
    name: 'Photo 7',
    type: 'image',
    url: 'photo-wallpaper/1 (7).jpg',
    thumbnail: 'https://via.placeholder.com/200x150/374151/ffffff?text=Photo+7',
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
