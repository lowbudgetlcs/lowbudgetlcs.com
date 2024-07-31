/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      'orange': '#e8a012',
      'light-orange': '#F3C363',
      'gray': '#363636',
      'white': '#F5F5F5',
      'black': '#1a1a1a',
      'light-blue': '#d9dbf1',
      'dark-blue': '#1B1E48',
      'transparent': '#1a1a1a00'
    },
    animation: {
      'slide-in-300': 'slide-in 0.8s 300ms forwards',
      'slide-in-400': 'slide-in 0.8s 400ms forwards',
      'slide-in-500': 'slide-in 0.8s 500ms forwards',
      'slide-in-600': 'slide-in 0.8s 600ms forwards',
      'slide-in-700': 'slide-in 0.8s 700ms forwards',
      'slide-in-800': 'slide-in 0.8s 800ms forwards',
      'slide-in-900': 'slide-in 0.8s 900ms forwards',
      'slide-in-1000': 'slide-in 0.8s 1000ms forwards',
      
    },
    keyframes: {
      'slide-in': {
        '0%': { opacity: 0, transform: 'translateX(-40px)' },
        '100%': { opacity: 1, transform: 'translateX(0)' },
      },
    },
    fontFamily: {
      'serif': ['Roboto', 'Helvetica', 'Arial', 'sans-serif']
    },
    extend: {},
    screens: {
      xl: '1440px',
      lg: '1024px',
      md: '768px',
      sm: '375px',
      
    }
  },
  plugins: [],
}

