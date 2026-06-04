import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#24191f",
        muted: "#735e66",
        line: "#e6d9bb",
        surface: "#fffaf0",
        parchment: "#f5ecd6",
        watermark: "#eadfbd",
        wine: {
          50: "#fff1f7",
          100: "#f8d6e4",
          200: "#e7a8c4",
          500: "#96164d",
          600: "#780b3d",
          700: "#5f082f",
          800: "#43051f"
        },
        school: {
          50: "#fff1f7",
          100: "#f8d6e4",
          500: "#96164d",
          600: "#780b3d",
          700: "#5f082f"
        }
      },
      boxShadow: {
        soft: "0 10px 30px rgba(67, 5, 31, 0.10)"
      }
    }
  },
  plugins: []
};

export default config;
