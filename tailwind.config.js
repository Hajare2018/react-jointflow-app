/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}',
    './node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        body: '#F0F1F1',
        light: '#19233a',
        primary: '#5A7DB3',
        secondary: '#3ebb80',
        danger: '#ED5454',
        success: '#3EBB80',
      },
    },
  },
  plugins: [],
  important: true,
  darkMode: 'class',
};
