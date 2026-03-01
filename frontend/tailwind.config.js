/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        amd: {
          black: '#0A0A0A',  // Deep black background
          orange: '#FF6200', // AMD Ryzen orange accent
          gray: '#1E1E1E',   // Secondary panel color
          red: '#ED1C24'     // Radeon red
        }
      }
    },
  },
  plugins: [],
}