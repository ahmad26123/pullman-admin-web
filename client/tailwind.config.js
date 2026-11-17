/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pullman: {
          orange: '#F15A24',
          'orange-hover': '#DF4B16',
          'orange-light': '#FFF3ED',
          'orange-border': '#FFDCD0',
          dark: '#151824',
          'dark-card': '#1E2333',
          'dark-hover': '#24293D',
          gray: {
            bg: '#F8F9FC',
            card: '#FFFFFF',
            border: '#ECEFF4',
            text: '#1C2230',
            muted: '#8A92A6',
            light: '#F3F5F9'
          }
        }
      },
      fontFamily: {
        sans: ['Cairo', 'Tajawal', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
};

