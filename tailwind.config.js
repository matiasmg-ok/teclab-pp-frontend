/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    fontFamily: {
      roboto: ['Roboto', 'sans-serif'],
      poppins: ['Poppins', 'sans-serif'],
    },
    extend: {
      colors: {
        'primary': '#1B224E',
        'complementary': '#25ABB9',
        'midpoint': '#19737C',
      }
    },
  },
  plugins: [
    require('tailwindcss-animated')
  ],
}

