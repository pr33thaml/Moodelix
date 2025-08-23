import { NextResponse } from 'next/server'
import { readdir } from 'fs/promises'
import { join } from 'path'

export async function GET() {
  try {
    const publicDir = join(process.cwd(), 'public', 'wallpaper')
    
    // Scan live wallpapers folder
    const liveWallpapersDir = join(publicDir, 'live wallpapers')
    let liveWallpapers: string[] = []
    try {
      const liveFiles = await readdir(liveWallpapersDir)
      liveWallpapers = liveFiles
        .filter(file => file.match(/\.(mp4|webm|mov)$/i))
        .map(file => `/wallpaper/live wallpapers/${file}`)
    } catch (error) {
      console.log('Live wallpapers folder not found or empty')
    }

    // Scan photo wallpapers folder
    const photoWallpapersDir = join(publicDir, 'photo wallpaper')
    let photoWallpapers: string[] = []
    try {
      const photoFiles = await readdir(photoWallpapersDir)
      photoWallpapers = photoFiles
        .filter(file => file.match(/\.(jpg|jpeg|png|gif|webp)$/i))
        .map(file => `/wallpaper/photo wallpaper/${file}`)
    } catch (error) {
      console.log('Photo wallpapers folder not found or empty')
    }

    const allWallpapers = [...liveWallpapers, ...photoWallpapers]
    
    return NextResponse.json({
      wallpapers: allWallpapers,
      liveCount: liveWallpapers.length,
      photoCount: photoWallpapers.length,
      total: allWallpapers.length
    })
  } catch (error) {
    console.error('Error scanning wallpapers:', error)
    return NextResponse.json(
      { error: 'Failed to scan wallpapers' },
      { status: 500 }
    )
  }
}
