/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    fontFamily: {
      'sans': ['Montserrat','Roboto', 'sans-serif']      
    },
    extend: {
      backgroundImage: {
        "home": "url('/assets/back.header.png')"
      }
    },
  },
  plugins: [],
}

