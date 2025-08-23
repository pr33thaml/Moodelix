import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default cloudinary

// Helper function to get optimized video URLs
export const getOptimizedVideoUrl = (publicId: string, options: {
  quality?: 'auto' | 'low' | 'medium' | 'high'
  format?: 'mp4' | 'webm'
  width?: number
  height?: number
} = {}) => {
  const { quality = 'auto', format = 'mp4', width, height } = options
  
  let url = cloudinary.url(publicId, {
    resource_type: 'video',
    quality,
    format,
    ...(width && { width }),
    ...(height && { height }),
    fetch_format: format,
    flags: 'attachment'
  })
  
  return url
}

// Helper function to get optimized image URLs
export const getOptimizedImageUrl = (publicId: string, options: {
  quality?: 'auto' | 'low' | 'medium' | 'high'
  format?: 'auto' | 'webp' | 'jpg' | 'png'
  width?: number
  height?: number
} = {}) => {
  const { quality = 'auto', format = 'auto', width, height } = options
  
  let url = cloudinary.url(publicId, {
    resource_type: 'image',
    quality,
    format,
    ...(width && { width }),
    ...(height && { height }),
    fetch_format: format
  })
  
  return url
}
