/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        moss: {
          50: '#f0f7ee',
          100: '#dcedd8',
          200: '#b9dbb2',
          300: '#8ec286',
          400: '#65a85d',
          500: '#458c3d',
          600: '#35702f',
          700: '#2b5926',
          800: '#244820',
          900: '#1e3b1b',
        },
        cream: {
          50: '#fefdf8',
          100: '#fdf9ed',
          200: '#faf2d6',
          300: '#f5e7b3',
          400: '#efd78a',
          500: '#e8c462',
        },
        amber: {
          warm: '#d97706',
        },
      },
      fontFamily: {
        display: ['Georgia', 'serif'],
        body: ['system-ui', 'sans-serif'],
      },
      animation: {
        'float-slow': 'floatUp 20s infinite linear',
        'float-medium': 'floatUp 15s infinite linear',
        'float-fast': 'floatUp 10s infinite linear',
        'bounce-gentle': 'bounceGentle 2s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'confetti-fall': 'confettiFall 3s ease-in forwards',
      },
      keyframes: {
        floatUp: {
          '0%': { transform: 'translateY(100vh) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '0.6' },
          '90%': { opacity: '0.4' },
          '100%': { transform: 'translateY(-100px) rotate(360deg)', opacity: '0' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        confettiFall: {
          '0%': { transform: 'translateY(-50px) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};
