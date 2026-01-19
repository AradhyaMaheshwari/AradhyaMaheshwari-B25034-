/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-up': 'slideUp 0.4s ease-out',
                'slide-down': 'slideDown 0.4s ease-out',
                'bounce-slow': 'bounce 2s infinite',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'shimmer': 'shimmer 2s infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideDown: {
                    '0%': { transform: 'translateY(-20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-1000px 0' },
                    '100%': { backgroundPosition: '1000px 0' },
                },
            },
            boxShadow: {
                'royal': '0 10px 40px -10px rgba(30, 64, 175, 0.5)',
                'royal-lg': '0 20px 60px -15px rgba(30, 64, 175, 0.6)',
            },
        }
    },
    plugins: [require("daisyui")],
    darkMode: ["class", '[data-theme="royalDark"]'],
    daisyui: {
        themes: [
            {
                royalLight: {
                    primary: "#1e40af",
                    secondary: "#3b82f6",
                    accent: "#60a5fa",
                    neutral: "#1e293b",
                    "base-100": "#ffffff",
                    "base-200": "#f8fafc",
                    "base-300": "#e2e8f0",
                    "base-content": "#0f172a",
                    info: "#3b82f6",
                    success: "#10b981",
                    warning: "#f59e0b",
                    error: "#ef4444"
                },
                royalDark: {
                    primary: "#3b82f6",
                    secondary: "#60a5fa",
                    accent: "#93c5fd",
                    neutral: "#1e293b",
                    "base-100": "#0f172a",
                    "base-200": "#1e293b",
                    "base-300": "#334155",
                    "base-content": "#f1f5f9",
                    info: "#60a5fa",
                    success: "#34d399",
                    warning: "#fbbf24",
                    error: "#f87171"
                }
            }
        ],
        darkTheme: "royalDark"
    }
};
