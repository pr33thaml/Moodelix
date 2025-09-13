# 🎨 Moodelix - Vibe and Study and Focus and Get Stuff Done

A beautiful, customizable web application with dynamic wallpapers, music integration, and productivity tools.

## ✨ Features

- **Dynamic Wallpapers**: Live video wallpapers and photo wallpapers
- **Music Integration**: YouTube and Spotify support with background player
- **Productivity Tools**: Todo list and Pomodoro focus timer
- **Customizable UI**: Font selection, button sizes, wallpaper brightness
- **Sound Effects**: Click sounds and audio feedback
- **Responsive Design**: Works on all devices
- **Settings Panel**: Comprehensive customization options

## 🚀 Quick Deploy to Vercel

### Option 1: Vercel Dashboard (Recommended)
1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Deploy! 🎉

### Option 2: Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

## 🔧 Setup for Production

### 1. Environment Variables
Create a `.env.local` file in your project root:

```bash
# Cloudinary Configuration (for wallpaper storage)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Supabase Configuration (Required for user authentication)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Google OAuth Configuration (for Supabase)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 2. Cloudinary Setup (Recommended for 2GB+ wallpapers)
1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Get your credentials from the dashboard
3. Upload your wallpapers to Cloudinary
4. Update `lib/wallpaperData.ts` with your Cloudinary URLs

### 3. Alternative: Git LFS for Large Files
```bash
# Install Git LFS
git lfs install

# Track large files
git lfs track "public/wallpaper/**/*"
git lfs track "public/sounds/**/*"

# Add and commit
git add .gitattributes
git add public/wallpaper/
git add public/sounds/
git commit -m "Add wallpapers with Git LFS"
git push
```

## 📁 Project Structure

```
Moodelix/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/             # React components
│   ├── BackgroundMusicPlayer.tsx
│   ├── CenterMenu.tsx
│   ├── EnhancedMusicPlayer.tsx
│   ├── TodoList.tsx
│   ├── WallpaperButton.tsx
│   └── YouTubeMoodPlayer.tsx
├── lib/                    # Utility functions
│   ├── cloudinary.ts       # Cloudinary configuration
│   ├── supabase.ts         # Supabase client
│   ├── useSoundEffects.ts  # Sound effects hook
│   └── wallpaperData.ts    # Wallpaper data
├── models/                 # Data models
├── public/                 # Static assets
│   ├── sounds/             # Sound effects
│   └── wallpaper/          # Wallpapers (not in Git)
└── package.json
```

## 🎵 Music Player Setup

The music player supports:
- **YouTube**: Videos, live streams
- **Spotify**: Tracks, playlists, albums

### Features:
- Background playback
- Minimizable player
- Volume control
- Platform auto-detection

## 🖼️ Wallpaper System

### Current Setup:
- **Placeholder wallpapers** for immediate deployment
- **Sample videos** from sample-videos.com
- **Random images** from Picsum Photos

### Production Setup:
1. **Upload to Cloudinary** (recommended)
2. **Update `lib/wallpaperData.ts`** with your URLs
3. **Remove placeholder URLs**

## 🎨 Customization

### Available Settings:
- **Logo Size**: Small, Medium, Large
- **Quote Size**: Small, Medium, Large
- **Button Size**: Small, Medium, Large
- **Font Selection**: 20+ beautiful fonts
- **Wallpaper Brightness**: Darker, Dark, Normal, Bright
- **Sound Effects**: On/Off toggle
- **Music Player**: Show/Hide toggle

## 🔧 Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check
```

## 🌐 Deployment Notes

### What Gets Deployed:
- ✅ All source code
- ✅ Components and utilities
- ✅ Static assets (sounds, small images)
- ✅ Configuration files

### What Doesn't Get Deployed:
- ❌ Large wallpaper files (2GB+)
- ❌ `.env.local` file
- ❌ `node_modules/`

### Solutions:
1. **Cloudinary** (recommended for large files)
2. **Git LFS** (for version control of large files)
3. **External CDN** (AWS S3, Supabase, etc.)

## 🚨 Troubleshooting

### Build Errors:
- ✅ **Fixed**: Invalid iframe attributes
- ✅ **Fixed**: TypeScript compilation issues

### Common Issues:
1. **No wallpapers showing**: Check `lib/wallpaperData.ts`
2. **Music not playing**: Verify iframe permissions
3. **Build failing**: Run `npm run build` locally first

## 📱 Browser Support

- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers

## 🔮 Future Features

- [ ] User accounts and settings sync
- [ ] Custom wallpaper uploads
- [ ] Playlist management
- [ ] Advanced timer features
- [ ] Dark/Light theme toggle

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

**Made with ❤️ for productivity and vibes**
