/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#0f172a", // Deep Midnight Blue
                foreground: "#f8fafc", // Slate 50
                primary: {
                    DEFAULT: "#d97706", // Amber 600 (Goldish)
                    hover: "#b45309",
                    foreground: "#ffffff",
                },
                secondary: {
                    DEFAULT: "#1e293b", // Slate 800
                    foreground: "#e2e8f0",
                },
                accent: {
                    DEFAULT: "#8b5cf6", // Violet 500 (Subtle pop)
                    foreground: "#ffffff",
                },
                muted: {
                    DEFAULT: "#334155", // Slate 700
                    foreground: "#94a3b8", // Slate 400
                },
                card: {
                    DEFAULT: "rgba(30, 41, 59, 0.7)", // Glassmorphism base
                    foreground: "#f1f5f9",
                },
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                heading: ['Playfair Display', 'serif'], // Premium feel
            },
            boxShadow: {
                'glow': '0 0 20px rgba(217, 119, 6, 0.5)',
                'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            },
        },
    },
    plugins: [],
}
