/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FFFFFF', // white background
        secondary: '#F5F5F5', // light gray
        accent: '#E63946', // UM6P red
        orange: '#F77F00', // UM6P orange
        dark: '#1A1A1A', // dark text
        text: '#1A1A1A', // dark text
        cream: '#FAFAFA', // light cream background
        gray: '#666666', // medium gray for secondary text
        'um6p-grey': '#F5F5F5', // UM6P grey background
      },
      fontFamily: {
        inter: ['Inter', 'system-ui', 'sans-serif'],
        mont: ['Montserrat', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 25px -10px rgba(0, 0, 0, 0.1)',
        um6p: '0 2px 8px rgba(0, 0, 0, 0.1)'
      },
      borderRadius: {
        mdx: '12px',
      },
    },
  },
  plugins: [],
}
