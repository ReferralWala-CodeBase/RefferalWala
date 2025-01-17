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
        '10p': '10%', // Custom class for 10% margin
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

