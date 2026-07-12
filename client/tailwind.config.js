/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        purple: {
          DEFAULT: "#6B21A8",
          50: "#F5EEFB",
          100: "#EADCF6",
          500: "#8B31C7",
          600: "#7E22CE",
          700: "#6B21A8",
          800: "#581C87",
          900: "#3B0764",
        },
        lavender: {
          50: "#FAF8FF",
          100: "#F3EEFC",
          200: "#E6DBF7",
        },
        gold: {
          DEFAULT: "#F59E0B",
          400: "#FBBF4E",
          500: "#F59E0B",
          600: "#D97706",
        },
      },
      fontFamily: {
        sans: ["Poppins", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(107, 33, 168, 0.08)",
        card: "0 8px 30px -8px rgba(107, 33, 168, 0.15)",
        glow: "0 0 40px -8px rgba(245, 158, 11, 0.35)",
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(135deg, #3B0764 0%, #6B21A8 45%, #7E22CE 75%, #A855F7 100%)",
        "soft-gradient": "linear-gradient(135deg, #FAF8FF 0%, #F3EEFC 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "fade-in-up": "fadeInUp 0.7s ease-out forwards",
        "float": "float 6s ease-in-out infinite",
        "float-slow": "float 9s ease-in-out infinite",
        "twinkle": "twinkle 3s ease-in-out infinite",
        "pulse-soft": "pulseSoft 2.4s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        fadeInUp: {
          "0%": { opacity: 0, transform: "translateY(16px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        twinkle: {
          "0%, 100%": { opacity: 0.3 },
          "50%": { opacity: 1 },
        },
        pulseSoft: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.55 },
        },
      },
    },
  },
  plugins: [],
};
