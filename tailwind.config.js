/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        starbucks: {
          green: '#006241',
          accent: '#00754A',
          house: '#1E3932',
          uplift: '#2b5148',
          light: '#d4e9e2',
          gold: '#cba258',
          goldLight: '#dfc49d',
          goldLightest: '#faf6ee',
          canvas: '#f2f0eb',
          ceramic: '#edebe9',
          textBlack: 'rgba(0, 0, 0, 0.87)',
          textBlackSoft: 'rgba(0, 0, 0, 0.58)',
        }
      },
      borderRadius: {
        'pill': '50px',
        'card': '12px',
      }
    }
  },
  plugins: [],
}
