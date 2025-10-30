/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./**/*.{html,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      },
      colors: {
        'v-primary': '#FF888E', // coral suave
        'v-secondary': '#5FAFBD', // azul-turquesa
        'v-accent': '#19cc61', // verde
        'v-neutral': '#827072', // marrom acinzentado
        'v-tertiary': '#D2CAC2', // bege
        'v-warning': '#FFA500', // laranja
        'v-light-bg': '#F7F2EF',
        'v-light-gray': '#EAE5E1',
      },
    },
  },
  plugins: [],
  darkMode: 'class'
}