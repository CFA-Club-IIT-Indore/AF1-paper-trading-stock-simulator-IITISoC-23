/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/*.{html,js,ejs }" , "./public/**/*"],
  theme: {
    extend: {},
  },
  plugins: [],
  darkMode: ['class', '[data-mode="dark"]'],
}

