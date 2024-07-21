/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      'orange': '#e8a012',
      'light-orange': '#da9b22',
      'gray': '#f4f4f4',
      'white': '#F4F5FB',
      'black': '#1a1a1a',
      'light-blue': '#d9dbf1',
      'dark-blue': '#1B1E48',
    },
    fontFamily: {},
    backgroundImage: {
      'gradient-radial-dark': 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(36,46,34,1) 65%);',
      'gradient-radial-light': 'linear-gradient(180deg, rgba(0,0,0,0) 60%,  #F4F5FB 86%);'
    },
    extend: {},
  },
  plugins: [],
}

