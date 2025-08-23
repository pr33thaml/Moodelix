import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'space-grotesk': ['Space Grotesk', 'sans-serif'],
        'handwriting': ['Architects Daughter', 'cursive'],
        'inter': ['Inter', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'],
        'roboto': ['Roboto', 'sans-serif'],
        'cinzel': ['Cinzel', 'serif'],
        'playfair': ['Playfair Display', 'serif'],
        'merriweather': ['Merriweather', 'serif'],
        'lora': ['Lora', 'serif'],
        'crimson': ['Crimson Text', 'serif'],
        'source-serif': ['Source Serif Pro', 'serif'],
        'libre-baskerville': ['Libre Baskerville', 'serif'],
        'vollkorn': ['Vollkorn', 'serif'],
        'bree-serif': ['Bree Serif', 'serif'],
        'josefin-sans': ['Josefin Sans', 'sans-serif'],
        'quicksand': ['Quicksand', 'sans-serif'],
        'comfortaa': ['Comfortaa', 'sans-serif'],
        'fredoka': ['Fredoka One', 'sans-serif'],
        'nunito': ['Nunito', 'sans-serif'],
        'montserrat': ['Montserrat', 'sans-serif'],
      },
      colors: {
        brand: {
          DEFAULT: '#111827',
          accent: '#60a5fa',
        },
      },
      keyframes: {
        fadeSlide: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeSlide: 'fadeSlide 600ms ease-out both',
      },
    },
  },
  plugins: [],
} satisfies Config


