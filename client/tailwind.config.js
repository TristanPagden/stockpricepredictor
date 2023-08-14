/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: {
      'main': '#4BC0F0',
      'light': '#90B8CC',
      'lighter': '#F0EFEC',
      'dark' : '#646466',
      'darker' : '#111F35',
      'hoverMain' : '#62caf5',
      'hoverLighter' : '#B8D7E2',
    },
    fontFamily: {
      'logo': ['Fira Sans', 'sans-serif'],
      'links': ["Roboto", "Helvetica", "Arial", 'sans-serif'],
    },
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
