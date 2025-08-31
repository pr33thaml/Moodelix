import { NextRequest, NextResponse } from 'next/server'
import { getWallpaperUrl } from '@/lib/s3'

export async function POST(request: NextRequest) {
  try {
    const { s3Key } = await request.json()
    
    console.log('🎬 Wallpaper API called with key:', s3Key)
    
    if (!s3Key) {
      return NextResponse.json({ error: 'S3 key is required' }, { status: 400 })
    }
    
    const signedUrl = await getWallpaperUrl(s3Key)
    
    console.log('✅ Generated URL:', signedUrl)
    
    return NextResponse.json({ signedUrl })
  } catch (error) {
    console.error('❌ Error generating signed URL:', error)
    return NextResponse.json({ error: 'Failed to generate signed URL' }, { status: 500 })
  }
}
