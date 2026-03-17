/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef9ee', 100: '#fdf0d5', 200: '#fadea6', 300: '#f7c56c',
          400: '#f4a830', 500: '#f18d0e', 600: '#e27009', 700: '#bb530b',
          800: '#954110', 900: '#793711', 950: '#411a05',
        },
        forest: {
          50: '#f0fdf4', 500: '#22c55e', 600: '#16a34a',
          700: '#15803d', 800: '#166534', 900: '#14532d',
        }
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
      }
    },
  },
  plugins: [],
}