/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bis: {
          navy: '#0A2540',
          saffron: '#FF6B00',
          green: '#00875A',
          lightBg: '#F8FAFC',
          card: '#FFFFFF',
          border: '#CBD5E1'
        }
      }
    },
  },
  plugins: [],
}
