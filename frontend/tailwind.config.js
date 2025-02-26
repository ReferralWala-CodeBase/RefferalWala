/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      maxWidth: {
        '8xl': '90rem',
      },
      margin: {
        '10p': '10%',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms', 'tailwind-scrollbar'),
  ],
}

