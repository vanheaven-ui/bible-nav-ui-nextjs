// tailwind.config.js
// This file defines your Tailwind CSS configuration using a modern ES Module syntax.

import type { Config } from "tailwindcss";

const config: Config = {
  // Essential: Configure files to scan for Tailwind classes.
  // Tailwind will only generate CSS for classes found in these files.
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}", // Crucial for App Router pages and layouts
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}", // For any shared React components
    "./src/app/globals.css", // Explicitly include globals.css for @apply directives
    // If you use the 'pages' directory for routing, also include:
    // "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    // Extend Tailwind's default theme here if needed (e.g., custom fonts, colors)
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      // If you plan to use custom fonts, define them here:
      // fontFamily: {
      //   sans: ["Inter", "sans-serif"],
      //   serif: ["Playfair Display", "serif"],
      // },
    },
  },
  plugins: [], // Add any Tailwind plugins here
};

export default config; // Export using ES Module syntax
