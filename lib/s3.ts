import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// Only create S3 client on server side
let s3Client: S3Client | null = null
let BUCKET_NAME: string | null = null

if (typeof window === 'undefined') {
  // Server side only
  s3Client = new S3Client({
    region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  })
  
  BUCKET_NAME = process.env.NEXT_PUBLIC_AWS_S3_BUCKET!
}

// Get signed URL for wallpaper (expires in 1 hour)
export async function getWallpaperUrl(key: string): Promise<string> {
  // Check if we have proper S3 credentials
  if (s3Client && BUCKET_NAME && process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
    try {
      const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      })
      
      return await getSignedUrl(s3Client, command, { expiresIn: 3600 })
    } catch (error) {
      console.error('S3 error, falling back to local files:', error)
    }
  }
  
  // Fallback to local files if S3 is not configured
  console.log('Using local file fallback for:', key)
  
  // Convert S3 key to local public path
  if (key.startsWith('live-wallpapers/')) {
    const filename = key.replace('live-wallpapers/', '')
    return `/wallpaper/live wallpapers/${filename}`
  } else if (key.startsWith('photo-wallpaper/')) {
    const filename = key.replace('photo-wallpaper/', '')
    return `/wallpaper/photo wallpaper/${filename}`
  }
  
  // If no pattern matches, return the key as-is (for backward compatibility)
  return key
}

// Get all wallpaper URLs
export async function getAllWallpaperUrls(): Promise<string[]> {
  if (!s3Client || !BUCKET_NAME) {
    throw new Error('S3 client not initialized - server side only')
  }
  
  // For now, return hardcoded keys - you'll upload these to S3
  const wallpaperKeys = [
    'live-wallpapers/grand-theft-auto-vi.mp4',
    'live-wallpapers/cyberpunk.mp4',
    'live-wallpapers/minecraft-autumn-mountains.mp4',
    // Add all your wallpaper keys here
  ]

  const urls = await Promise.all(
    wallpaperKeys.map(key => getWallpaperUrl(key))
  )

  return urls
}
