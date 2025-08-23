// Wallpaper data with Cloudinary URLs
// Replace these with your actual Cloudinary public IDs after uploading

export interface WallpaperItem {
  id: string
  name: string
  type: 'video' | 'image'
  url: string
  thumbnail?: string
  category: 'live' | 'photo'
}

export const wallpapers: WallpaperItem[] = [
  // Live Wallpapers (Videos) - Using placeholder URLs that work immediately
  {
    id: '1',
    name: 'Sample Video 1',
    type: 'video',
    url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    category: 'live'
  },
  {
    id: '2',
    name: 'Sample Video 2',
    type: 'video',
    url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
    category: 'live'
  },
  {
    id: '3',
    name: 'Sample Video 3',
    type: 'video',
    url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4',
    category: 'live'
  },
  
  // Photo Wallpapers (Images) - Using placeholder images that work immediately
  {
    id: '4',
    name: 'Abstract Art',
    type: 'image',
    url: 'https://picsum.photos/1920/1080?random=1',
    category: 'photo'
  },
  {
    id: '5',
    name: 'Nature Landscape',
    type: 'image',
    url: 'https://picsum.photos/1920/1080?random=2',
    category: 'photo'
  },
  {
    id: '6',
    name: 'City Night',
    type: 'image',
    url: 'https://picsum.photos/1920/1080?random=3',
    category: 'photo'
  },
  {
    id: '7',
    name: 'Mountain View',
    type: 'image',
    url: 'https://picsum.photos/1920/1080?random=4',
    category: 'photo'
  },
  {
    id: '8',
    name: 'Ocean Waves',
    type: 'image',
    url: 'https://picsum.photos/1920/1080?random=5',
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
