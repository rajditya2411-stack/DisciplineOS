/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        background: '#F8F9FB',
        card: '#FFFFFF',
        sidebar: '#000000',
        primary: '#000000',
        success: '#6B7280',
        warning: '#9CA3AF',
        danger: '#000000',
        'text-primary': '#1F2937',
        'text-secondary': '#6B7280',
        border: '#E5E7EB',
        'sidebar-hover': '#1a1a1a',
        'heat-0': '#EBEDF0',
        'heat-1': '#E5E7EB',
        'heat-2': '#D1D5DB',
        'heat-3': '#9CA3AF',
        'heat-4': '#374151',
      },
      fontSize: {
        'stats': '32px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.1)',
      },
    },
  },
  plugins: [],
}
