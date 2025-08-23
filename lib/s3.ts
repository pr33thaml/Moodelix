import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
  },
})

const BUCKET_NAME = process.env.NEXT_PUBLIC_AWS_S3_BUCKET!

// Get signed URL for wallpaper (expires in 1 hour)
export async function getWallpaperUrl(key: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  })
  
  return await getSignedUrl(s3Client, command, { expiresIn: 3600 })
}

// Get all wallpaper URLs
export async function getAllWallpaperUrls(): Promise<string[]> {
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
