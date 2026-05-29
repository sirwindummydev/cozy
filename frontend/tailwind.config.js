/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f3f8',
          100: '#b3d9eb',
          200: '#80bfde',
          300: '#4da5d1',
          400: '#268bbf',
          500: '#1a6b8a',
          600: '#155874',
          700: '#10455e',
          800: '#0b3248',
          900: '#061f32',
        },
        accent: {
          50: '#fef9ec',
          100: '#fdefc4',
          200: '#fbe59c',
          300: '#f9db74',
          400: '#f7d14c',
          500: '#f4a321',
          600: '#c8841a',
          700: '#9c6514',
          800: '#70460d',
          900: '#442707',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'hero-pattern': "linear-gradient(135deg, rgba(26,107,138,0.9) 0%, rgba(6,31,50,0.85) 100%)",
      },
    },
  },
  plugins: [],
}
