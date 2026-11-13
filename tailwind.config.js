/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ivory: '#F8F7F2',
        forest: '#245746',
        ink: '#252724',
        gold: '#B69A61',
        neutralgray: '#EAE9E3',
        darkink: '#161816',
        darkoffwhite: '#E8E6DF',
        darkforest: '#3B7A64',
        darkgold: '#C5A86E'
      },
      fontFamily: {
        burmese: ['May-Medium', 'Padauk', 'Myanmar Text', 'Noto Sans Myanmar', 'sans-serif'],
      }
    },
  },
  plugins: [],
}