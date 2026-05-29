/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      colors: {
        brand: {
          50: '#edfcfc',
          100: '#d0f7f9',
          200: '#a6eef3',
          300: '#6ce1eb',
          400: '#2bcbda',
          500: '#0faebd',
          600: '#0e8c9e',
          700: '#137180',
          800: '#185c69',
          900: '#184d59',
          950: '#09323b',
        },
        dark: {
          50: '#f0f4ff',
          100: '#e0e9ff',
          200: '#b9c8ff',
          300: '#8aa2ff',
          400: '#5571ff',
          500: '#3046ff',
          600: '#1826f5',
          700: '#1318e1',
          800: '#1315b6',
          900: '#14178f',
          950: '#0a0b2e',
        },
        surface: {
          DEFAULT: '#080c14',
          card: '#0d1424',
          border: '#1a2540',
          hover: '#141c30',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(15, 174, 189, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(15, 174, 189, 0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}