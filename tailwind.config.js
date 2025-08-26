/** @type {import('tailwindcss').Config} */
export default {
	darkMode: 'class', // Enable class-based dark mode
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				// Brand colors (legacy - keeping for backward compatibility)
				brand: {
					'blue-primary': '#1e40af',
					'blue-secondary': '#3b82f6',
					'blue-light': '#dbeafe',
					'blue-dark': '#1e3a8a',
					'orange-warm': '#ea580c',
					'orange-light': '#fed7aa',
					'yellow-accent': '#fbbf24',
				},
				neutral: {
					charcoal: '#374151',
					'gray-light': '#f8fafc',
				},
				// Theme-aware colors using CSS custom properties
				theme: {
					// Primary colors
					primary: 'var(--color-primary)',
					'primary-hover': 'var(--color-primary-hover)',
					'primary-active': 'var(--color-primary-active)',
					
					// Secondary colors
					secondary: 'var(--color-secondary)',
					'secondary-hover': 'var(--color-secondary-hover)',
					'secondary-active': 'var(--color-secondary-active)',
					
					// Background colors
					bg: 'var(--color-background)',
					'bg-secondary': 'var(--color-background-secondary)',
					'bg-tertiary': 'var(--color-background-tertiary)',
					
					// Text colors
					text: 'var(--color-text)',
					'text-secondary': 'var(--color-text-secondary)',
					'text-muted': 'var(--color-text-muted)',
					
					// Border and divider colors
					border: 'var(--color-border)',
					'border-hover': 'var(--color-border-hover)',
					divider: 'var(--color-divider)',
					
					// Status colors
					success: 'var(--color-success)',
					warning: 'var(--color-warning)',
					error: 'var(--color-error)',
					info: 'var(--color-info)',
					
					// Special colors
					accent: 'var(--color-accent)',
					shadow: 'var(--color-shadow)',
					overlay: 'var(--color-overlay)',
				},
			},
			fontFamily: {
				heading: ['Montserrat', 'sans-serif'],
				body: ['Open Sans', 'sans-serif'],
				accent: ['Dancing Script', 'cursive'],
			},
			container: {
				center: true,
				padding: {
					DEFAULT: '1rem',
					sm: '2rem',
					lg: '3rem',
					xl: '4rem',
				},
				screens: {
					sm: '640px',
					md: '768px',
					lg: '1024px',
					xl: '1200px',
				},
			},
			transitionProperty: {
				'theme': 'background-color, border-color, color, fill, stroke, box-shadow',
			},
			transitionDuration: {
				'theme-fast': 'var(--transition-duration-fast, 150ms)',
				'theme-normal': 'var(--transition-duration-normal, 300ms)',
				'theme-slow': 'var(--transition-duration-slow, 500ms)',
			},
			transitionTimingFunction: {
				'theme-standard': 'var(--transition-easing-standard, cubic-bezier(0.4, 0.0, 0.2, 1))',
				'theme-emphasized': 'var(--transition-easing-emphasized, cubic-bezier(0.0, 0.0, 0.2, 1))',
				'theme-decelerated': 'var(--transition-easing-decelerated, cubic-bezier(0.0, 0.0, 0.2, 1))',
			},
			boxShadow: {
				'theme-sm': '0 1px 2px 0 var(--color-shadow)',
				'theme': '0 1px 3px 0 var(--color-shadow), 0 1px 2px 0 var(--color-shadow)',
				'theme-md': '0 4px 6px -1px var(--color-shadow), 0 2px 4px -1px var(--color-shadow)',
				'theme-lg': '0 10px 15px -3px var(--color-shadow), 0 4px 6px -2px var(--color-shadow)',
				'theme-xl': '0 20px 25px -5px var(--color-shadow), 0 10px 10px -5px var(--color-shadow)',
			},
		},
	},
	plugins: [],
};