/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#fefcf4',
        sage: {
          DEFAULT: '#4d644e',
          light: '#e4ffe2',
        },
        surface: {
          DEFAULT: '#fefcf4',
          low: '#fbfaef',
          high: '#e8ead8',
        },
        on: {
          surface: '#36392d',
          'surface-variant': '#636658',
        },
        danger: '#a54731',
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
