/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				brand: {
					'blue-primary': '#1e40af', // Deep blue for main elements
					'blue-secondary': '#3b82f6', // Lighter blue for hover states
					'orange-warm': '#ea580c', // Orange for accent elements
					'yellow-accent': '#fbbf24', // Yellow for highlights
				},
				neutral: {
					charcoal: '#374151', // Dark gray for text
					'gray-light': '#f8fafc', // Light gray for backgrounds
				},
			},
			fontFamily: {
				heading: ['Montserrat', 'sans-serif'], // For headings
				body: ['Open Sans', 'sans-serif'], // For body text
				accent: ['Dancing Script', 'cursive'], // For decorative text
			},
			container: {
				center: true,
				padding: {
					DEFAULT: '1rem', // Mobile padding
					sm: '2rem', // Small screens
					lg: '3rem', // Large screens
					xl: '4rem', // Extra large screens
				},
				screens: {
					sm: '640px',
					md: '768px',
					lg: '1024px',
					xl: '1200px',
				},
			},
		},
	},
	plugins: [],
};
