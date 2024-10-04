import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Adjust the paths based on your project structure
    './public/index.html', // Include your HTML file(s) if applicable
  ],
  theme: {
    extend: {
      // add custom theme configurations here
    },
  },
  plugins: [],
  prefix: 'vn-', // This adds the prefix to all your Tailwind classes
} satisfies Config
