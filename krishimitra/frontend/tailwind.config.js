/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#4CAF50',    // Agriculture Green
                secondary: '#2196F3',  // Blue
                accent: '#FF9800',     // Orange
                success: '#4CAF50',
                warning: '#FFC107',
                danger: '#F44336',
                info: '#2196F3',
            },
            fontFamily: {
                sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
