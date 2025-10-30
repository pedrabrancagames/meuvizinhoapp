/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./App.tsx"
  ],
  theme: {
    extend: {
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