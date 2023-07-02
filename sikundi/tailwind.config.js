/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./layouts/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#CA2128",
                secondary: "#283848",
                accent: "#CED9E0",
                tertiary: "#EFF3F9",
                quaternary: "#D4D4D4",
                background: "#1A2530",
                success: "#03DE73",
                danger: "#F52D56"
            },
            fontFamily: {
                inter: ['Inter']
            }
        },
    },
    plugins: [],
}