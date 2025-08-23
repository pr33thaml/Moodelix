import { NextResponse } from 'next/server'
import { readdir } from 'fs/promises'
import { join } from 'path'

export async function GET() {
  try {
    const publicDir = join(process.cwd(), 'public', 'sounds')
    let soundFiles: string[] = []
    
    try {
      const files = await readdir(publicDir)
      soundFiles = files
        .filter(file => file.match(/\.(mp3|wav|ogg|m4a)$/i))
        .map(file => `/sounds/${file}`)
    } catch (error) {
      console.log('Sounds folder not found or empty')
    }
    
    return NextResponse.json({
      sounds: soundFiles,
      count: soundFiles.length
    })
  } catch (error) {
    console.error('Error scanning sounds:', error)
    return NextResponse.json(
      { error: 'Failed to scan sounds' },
      { status: 500 }
    )
  }
}
