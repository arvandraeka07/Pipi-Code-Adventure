/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#123B2A',
        ink2: '#1E5B40',
        leaf: '#2FBF71',
        leafDark: '#159A55',
        mint: '#D8F7E4',
        cream: '#FFF9E9',
        sun: '#FFC93C',
        sunDark: '#F0A81E',
        grape: '#CDBAF9',
        grapeDark: '#8266E6',
        sky: '#BFE9FF',
        coral: '#FF8A7A',
        rose: '#FFD9E3',
        paper: '#FFFEF8',
      },
      fontFamily: {
        display: ['"Baloo 2"', 'system-ui', 'sans-serif'],
        body: ['Nunito', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        pop: '0 6px 0 #123B2A',
        'pop-sm': '0 3px 0 #123B2A',
        'pop-lg': '0 10px 0 #123B2A',
        soft: '0 18px 40px -18px rgba(18, 59, 42, 0.35)',
        'inner-soft': 'inset 0 2px 0 rgba(255,255,255,0.55)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.75rem',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        bob: {
          '0%,100%': { transform: 'translateY(0) rotate(-1deg)' },
          '50%': { transform: 'translateY(-6px) rotate(1deg)' },
        },
        wiggle: {
          '0%,100%': { transform: 'rotate(-4deg)' },
          '50%': { transform: 'rotate(4deg)' },
        },
        'pop-in': {
          '0%': { transform: 'scale(.7)', opacity: '0' },
          '70%': { transform: 'scale(1.05)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'fade-up': {
          '0%': { transform: 'translateY(14px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        shake: {
          '0%,100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-7px) rotate(-2deg)' },
          '40%': { transform: 'translateX(7px) rotate(2deg)' },
          '60%': { transform: 'translateX(-5px)' },
          '80%': { transform: 'translateX(5px)' },
        },
        sparkle: {
          '0%,100%': { transform: 'scale(.6) rotate(0deg)', opacity: '.35' },
          '50%': { transform: 'scale(1.1) rotate(90deg)', opacity: '1' },
        },
        breathe: {
          '0%,100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.025)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        bob: 'bob 3s ease-in-out infinite',
        wiggle: 'wiggle .6s ease-in-out infinite',
        'pop-in': 'pop-in .35s cubic-bezier(.2,.9,.3,1.4) both',
        'fade-up': 'fade-up .45s ease-out both',
        shake: 'shake .45s ease-in-out',
        sparkle: 'sparkle 2.4s ease-in-out infinite',
        breathe: 'breathe 3.4s ease-in-out infinite',
        'slide-up': 'slide-up .3s ease-out both',
        'spin-slow': 'spin-slow 14s linear infinite',
        shimmer: 'shimmer 2.5s linear infinite',
      },
    },
  },
  plugins: [],
}
