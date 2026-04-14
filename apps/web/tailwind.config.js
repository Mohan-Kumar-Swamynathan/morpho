/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          bg: '#f5f5f5',
          surface: '#ffffff',
          border: '#e5e7eb',
        },
        morpho: {
          primary: '#3b82f6',
          secondary: '#6b7280',
        },
      },
    },
  },
  plugins: [],
}
