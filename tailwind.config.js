/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          'primary': {
            50: '#eef2ff',
            100: '#e0e7ff',
            200: '#c7d2fe',
            300: '#a5b4fc',
            400: '#818cf8',
            500: '#6366f1',
            600: '#4f46e5',
            700: '#4338ca',
            800: '#3730a3',
            900: '#312e81',
            950: '#1e1b4b',
          },
        },
        animation: {
          'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          'spin-slow': 'spin 3s linear infinite',
        },
        boxShadow: {
          'health': '0 0 15px rgba(16, 185, 129, 0.5)',
          'energy': '0 0 15px rgba(59, 130, 246, 0.5)',
          'warning': '0 0 15px rgba(245, 158, 11, 0.5)',
          'danger': '0 0 15px rgba(239, 68, 68, 0.5)',
        },
        minHeight: {
          '56': '14rem',
        },
      },
    },
    plugins: [],
  }