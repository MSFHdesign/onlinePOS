/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#6466f1', // Indigo color for light mode
          dark: '#818cf8',  // Lighter indigo for dark mode
        },
        secondary: {
          light: '#64748b', // Slate color for light mode
          dark: '#94a3b8',  // Lighter slate for dark mode
        },
        background: {
          light: '#ffffff',
          dark: '#1e293b',  // Slate 800
        },
        surface: {
          light: '#f8fafc',  // Slate 50
          dark: '#334155',   // Slate 700
        },
        text: {
          light: '#334155',  // Slate 700
          dark: '#f1f5f9',   // Slate 100
        }
      }
    },
  },
  plugins: [],
}
