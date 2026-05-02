/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          primary: '#FFFFFF',
          secondary: '#F5F5F5',
          card: '#FFFFFF',
          elevated: '#FFFFFF',
        },
        accent: {
          primary: '#000000',
          secondary: '#333333',
        },
        text: {
          primary: '#000000',
          secondary: '#333333',
          muted: '#666666',
        },
        border: {
          DEFAULT: '#E5E5E5',
          hover: '#CCCCCC',
        },
        status: {
          success: '#000000',
          error: '#000000',
          warning: '#000000',
        },
        surface: {
          glass: 'rgba(255,255,255,0.85)',
          'glass-hover': 'rgba(255,255,255,0.98)',
        }
      },
      fontFamily: {
        heading: ['"Clash Display"', 'sans-serif'],
        body: ['"Outfit"', 'sans-serif'],
        mono: ['"Space Grotesk"', 'monospace'],
      },
      letterSpacing: {
        heading: '-0.02em',
        body: '0.01em',
      },
      backgroundImage: {
        'gradient-accent': 'linear-gradient(135deg, #000000, #333333)',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        '300': '300ms',
        '500': '500ms',
      }
    },
  },
  plugins: [],
}
