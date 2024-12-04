/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
            },
            fontFamily: {
                display: "Oswald, ui-serif", // Adds a new `font-display` class
            },
        },
    },
    daisyui: {
        themes: ["aqua", "dark"],
    },
    plugins: [require("@tailwindcss/typography"), require("daisyui")],
};
