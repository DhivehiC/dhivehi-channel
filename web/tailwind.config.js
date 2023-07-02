/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}'
    ],
    theme: {
        extend: {
            colors: {
                primary: "#126A3A",
                secondary: "#FEB242",
                tertiary: "#454545",
                accent: "#AFAFAF",
                "dark-accent": "#1F1F1F"
            },
            fontFamily: {
                sans: ['var(--font-inter)'],
            },
            container: {
                screens: {
                    'sm': '540px',
                    'md': '720px',
                    'lg': '960px',
                    'xl': '1140px',
                    '2xl': '1320px'
                }
            },
            screens: {
                'sm': '540px',
                'md': '720px',
                'lg': '960px',
                'xl': '1140px',
                '2xl': '1320px'
            }
        },
    },
    plugins: [],
}
