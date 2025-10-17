import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'fade-in':{
          '0%':{ opacity: 0 },
          '100%':{ opacity: 1 }
        }
      },

      animation: {
        'fade-in': 'fade-in 0.9s ease-in-out'
      }
    },
  },
  plugins: [
    require("tailwind-scrollbar"),
  ],
} satisfies Config;