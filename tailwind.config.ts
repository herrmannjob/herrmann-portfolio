import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#07100C",
        night: "#0B1611",
        panel: "#101D17",
        forest: "#0A7C15",
        leaf: "#A8D965",
        mint: "#58AE8D",
        mist: "#E8FEF6",
        signal: "#EACE43",
        paper: "#EEF4EA",
        moss: "#1F3A2A",
      },
      fontFamily: {
        display: ['"Big Shoulders Display"', "Impact", "sans-serif"],
        sans: ['"Inter Tight Variable"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono Variable"', "ui-monospace", "monospace"],
      },
      letterSpacing: { tightest: "-0.04em" },
      keyframes: {
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        blink: { "0%,49%": { opacity: "1" }, "50%,100%": { opacity: "0" } },
        scan: { from: { transform: "translateY(-100%)" }, to: { transform: "translateY(100%)" } },
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        blink: "blink 1.1s steps(1) infinite",
        scan: "scan 6s linear infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
