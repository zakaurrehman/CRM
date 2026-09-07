import type { Config } from "tailwindcss";

/**
 * IMS design system.
 *
 * The two blues below are sampled directly from the company logo:
 * brand-700 (#0068B0) is the bright IMS blue, navy-700 (#103878) the deep mark.
 * Everything else is a cool neutral so that blue stays a deliberate accent
 * rather than a background wash.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./data/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#EFF7FD", 100: "#DBEDFB", 200: "#BFE1F8", 300: "#92CEF3",
          400: "#5EB4EB", 500: "#3897DE", 600: "#1E79C7", 700: "#0068B0",
          800: "#0A5490", 900: "#0F4577", 950: "#0A2C4E",
        },
        navy: {
          50: "#F1F4FA", 100: "#E1E8F4", 200: "#C6D3EA", 300: "#9CB2DA",
          400: "#6B89C5", 500: "#4767AE", 600: "#2E4C90", 700: "#103878",
          800: "#142C63", 900: "#101F45", 950: "#0A142E",
        },
        steel: {
          50: "#F7F9FB", 100: "#EEF2F6", 200: "#DFE5EC", 300: "#C7D1DC",
          400: "#9AA8B8", 500: "#5F6C79", 600: "#566270", 700: "#414B57",
          800: "#2B333C", 900: "#1A2028", 950: "#0E1319",
        },
        success: { 50: "#ECFDF3", 500: "#12A150", 600: "#0A7539", 700: "#0A6F36" },
        warning: { 50: "#FFF8EB", 500: "#C77A0A", 600: "#A96208", 700: "#874E06" },
        danger: { 50: "#FEF2F2", 500: "#D92D20", 600: "#B42318", 700: "#912018" },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        display: ["var(--font-archivo)", "var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      fontSize: {
        "display-xl": ["clamp(2.75rem, 6vw, 5rem)", { lineHeight: "1.02", letterSpacing: "-0.033em", fontWeight: "700" }],
        "display-lg": ["clamp(2.25rem, 4.6vw, 3.75rem)", { lineHeight: "1.05", letterSpacing: "-0.028em", fontWeight: "700" }],
        "display-md": ["clamp(1.875rem, 3.4vw, 2.75rem)", { lineHeight: "1.1", letterSpacing: "-0.022em", fontWeight: "700" }],
        "display-sm": ["clamp(1.5rem, 2.4vw, 2rem)", { lineHeight: "1.16", letterSpacing: "-0.017em", fontWeight: "700" }],
        eyebrow: ["0.75rem", { lineHeight: "1", letterSpacing: "0.16em", fontWeight: "600" }],
      },
      /* 13 backs the `lg` button height; 18/22/30 the section rhythm. */
      spacing: { 13: "3.25rem", 18: "4.5rem", 22: "5.5rem", 30: "7.5rem" },
      borderRadius: { xs: "2px", sm: "3px", DEFAULT: "4px", md: "6px", lg: "8px", xl: "12px" },
      boxShadow: {
        subtle: "0 1px 2px rgba(14,19,25,0.05), 0 1px 1px rgba(14,19,25,0.03)",
        card: "0 1px 3px rgba(14,19,25,0.06), 0 6px 20px -8px rgba(14,19,25,0.10)",
        lift: "0 2px 6px rgba(14,19,25,0.07), 0 18px 40px -14px rgba(14,19,25,0.20)",
        inset: "inset 0 1px 0 rgba(255,255,255,0.06)",
      },
      maxWidth: { container: "84rem", prose: "68ch" },
      transitionTimingFunction: { swift: "cubic-bezier(0.22, 1, 0.36, 1)" },
      keyframes: {
        "fade-up": { from: { opacity: "0", transform: "translateY(14px)" }, to: { opacity: "1", transform: "none" } },
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "slide-down": { from: { opacity: "0", transform: "translateY(-6px)" }, to: { opacity: "1", transform: "none" } },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.22,1,0.36,1) both",
        "fade-in": "fade-in 0.5s ease both",
        "slide-down": "slide-down 0.18s cubic-bezier(0.22,1,0.36,1) both",
      },
    },
  },
  plugins: [],
};

export default config;
