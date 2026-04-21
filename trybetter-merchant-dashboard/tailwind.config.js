/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#7C3AED',
        primaryHover: '#6D28D9',
        accent: '#16A34A',
        accentLight: '#DCFCE7',
        purpleLight: '#F3F0FF',
        background: '#F8F7FF',
        card: '#FFFFFF',
        border: '#E5E7EB',
        textPrimary: '#111827',
        textMuted: '#6B7280',
      },
      fontFamily: {
        jakarta: ['"Plus Jakarta Sans"', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

