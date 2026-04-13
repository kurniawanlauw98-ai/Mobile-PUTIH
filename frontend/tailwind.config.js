/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0F2C59', // Biru Tua UT
          light: '#EAEAEA', // Light Gray
          accent: '#DAC0A3', // Accent Gold/Brownish
          blue: '#1A5D1A', // Alternative Green
        }
      }
    },
  },
  plugins: [],
}
