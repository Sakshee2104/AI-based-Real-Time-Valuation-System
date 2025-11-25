/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        // Dark Theme Palette
        'bg-dark-primary': '#0a0e18',
        'bg-dark-secondary': '#0f1624',
        'bg-dark-card': '#141b29',

        // Brand/Accent Colors (Gold/Blue/Orange)
        'brand-accent': '#e0b84f',
        'brand-primary': '#1D4ED8',
        'brand-secondary': '#F97316',
        'text-light': '#FFFFFF',
        'text-muted': '#BBB',
      },
      fontFamily: {
        sans: ['"Open Sans"', 'sans-serif'],
      },
      backgroundImage: {
        'hero-house': "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1500&q=80')",
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideInRight: {
          '0%': { transform: 'translateX(20px)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}