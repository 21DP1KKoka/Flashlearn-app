/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js}",
  ],
  theme: {
    extend: {
      margin: {
        'c20': '21.0%',
        'c17': '17.6%',
        'c16': '16.6%',
        'c15': '15.5%',
      },
      padding: {
        'c1/6': '16.6%'
      },
      height: {
        '100%': '100%',
      },
    },
  },
  plugins: [],
}

