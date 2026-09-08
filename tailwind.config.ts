import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-instrument-sans)", "system-ui", "sans-serif"],
      },
      colors: {
        ink: "#0A0A0A",
        paper: "#FAFAF7",
        themePink: "#FFD9E6",
        themeBlue: "#C8E1FF",
      },
      letterSpacing: {
        editorial: "0.18em",
        wideEditorial: "0.32em",
      },
    },
  },
  plugins: [],
};

export default config;