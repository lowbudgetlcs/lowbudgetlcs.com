/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'selector',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      // Main Colors
      'orange': '#e8a012',
      'light-orange': '#F3C363',
      'gray': '#363636',
      'light-gray': '#252525',
      'white': '#F5F5F5',
      'black': '#1a1a1a',
      'light-blue': '#d9dbf1',
      'dark-blue': '#1B1E48',
      'transparent': '#1a1a1a00',
      'blue': '#125AE8',
      'lblcs-light-blue': '#d9dbf1',
      // For Stats
      'red' : '#e84057',
      'yellow' : '#f3c623',
      'vision-blue': '#e84057',
      'purple' : '#8a2be2',
      'green' : '#28a745',
      // For Gradients
      'gold-light': '#C89B5F',
      'gold-dark': '#44311A',
      'platinum-light': '#86E1ED',
      'platinum-dark': '#074754',
      'emerald-light': '#5EE0A4',
      'emerald-dark': '#064035',
      'challenger-blue': '#6485E3',
      'challenger-gold': '#B49A5E',

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
      'spin': 'spin 1s linear infinite'
    },
    keyframes: {
      'slide-in': {
        '0%': { opacity: 0, transform: 'translateX(-40px)' },
        '100%': { opacity: 1, transform: 'translateX(0)' },
      },
      spin: {
        '0%': { transform: 'rotate(0deg)' },
        '100%': { transform: 'rotate(360deg)' },
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

