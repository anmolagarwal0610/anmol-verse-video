import { type Config } from "tailwindcss";

const config = {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
        sans: ['Raleway', 'sans-serif'],
      },
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))', // Cool Lilac in dark, Off-Black in light
					foreground: 'hsl(var(--primary-foreground))' // Off-Black on Cool Lilac, Cloud White on Off-Black
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))', // Slightly lighter Off-Black in dark, Light Gray in light
					foreground: 'hsl(var(--secondary-foreground))' // Cloud White on Lighter Off-Black, Off-Black on Light Gray
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))', // Darker Muted BG in dark, Lighter Gray in light
					foreground: 'hsl(var(--muted-foreground))' // Lighter gray muted text in dark, Darker Gray in light
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))', // Sky Blue Tint
					foreground: 'hsl(var(--accent-foreground))' // Off-Black on Sky Blue Tint
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))', // Darker Card BG #0C131A in dark, White in light
					foreground: 'hsl(var(--card-foreground))' // Cloud White on Darker Card, Off-Black on White
				},
        // Explicit palette colors for direct use if needed
        'off-black': 'hsl(var(--color-off-black))',
        'cool-lilac': 'hsl(var(--color-cool-lilac))',
        'sky-blue-tint': 'hsl(var(--color-sky-blue-tint))',
        'light-cyan': 'hsl(var(--color-light-cyan))',
        'cloud-white': 'hsl(var(--color-cloud-white))',
        'card-dark': 'hsl(var(--color-card-dark))',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0', opacity: '0' },
					to: { height: 'var(--radix-accordion-content-height)', opacity: '1' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)', opacity: '1' },
					to: { height: '0', opacity: '0' }
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'fade-out': {
					'0%': {
						opacity: '1',
						transform: 'translateY(0)'
					},
					'100%': {
						opacity: '0',
						transform: 'translateY(10px)'
					}
				},
				'scale-in': {
					'0%': {
						transform: 'scale(0.95)',
						opacity: '0'
					},
					'100%': {
						transform: 'scale(1)',
						opacity: '1'
					}
				},
				'scale-out': {
					from: { transform: 'scale(1)', opacity: '1' },
					to: { transform: 'scale(0.95)', opacity: '0' }
				},
				'slide-in-right': {
					'0%': { transform: 'translateX(100%)' },
					'100%': { transform: 'translateX(0)' }
				},
				'slide-out-right': {
					'0%': { transform: 'translateX(0)' },
					'100%': { transform: 'translateX(100%)' }
				},
				pulse: {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.5' }
				},
				shimmer: {
					'0%': { backgroundPosition: '-200% 0' },
					'100%': { backgroundPosition: '200% 0' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'fade-out': 'fade-out 0.3s ease-out',
				'scale-in': 'scale-in 0.2s ease-out',
				'scale-out': 'scale-out 0.2s ease-out',
				'slide-in-right': 'slide-in-right 0.3s ease-out',
				'slide-out-right': 'slide-out-right 0.3s ease-out',
				'enter': 'fade-in 0.3s ease-out, scale-in 0.2s ease-out',
				'exit': 'fade-out 0.3s ease-out, scale-out 0.2s ease-out',
				'pulse': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'shimmer': 'shimmer 2s linear infinite'
			},
			fontFamily: {
				'dejavu-sans': ['DejaVu Sans', 'sans-serif'],
				'dejavu-serif': ['DejaVu Serif', 'serif'],
				'dejavu-mono': ['DejaVu Sans Mono', 'monospace'],
				'liberation-sans': ['Liberation Sans', 'sans-serif'],
				'liberation-serif': ['Liberation Serif', 'serif'],
				'liberation-mono': ['Liberation Mono', 'monospace'],
				'lohit-devanagari': ['Lohit Devanagari', 'sans-serif'],
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
