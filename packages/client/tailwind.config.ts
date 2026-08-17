/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ink: "var(--color-ink)",
        atlas: "var(--color-atlas)",
        periwinkle: "var(--color-periwinkle)",
        saffron: "var(--color-saffron)",
        persimmon: "var(--color-persimmon)",
        cloud: "var(--color-cloud)",
        border: "var(--color-border)",
        foreground: "var(--color-foreground)",
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-serif", "Georgia", "serif"],
        body: [
          "var(--font-body)",
          "ui-sans-serif",
          "system-ui",
          "Noto Sans",
          "sans-serif",
        ],
        mono: ["var(--font-mono)", "ui-monospace", "Menlo", "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 200ms ease-out",
        "slide-up": "slideUp 200ms ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
