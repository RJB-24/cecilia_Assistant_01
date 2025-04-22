
import type { Config } from "tailwindcss";

export default {
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
				orbitron: ['Orbitron', 'Montserrat', 'Inter', 'Arial', 'sans-serif'],
				mono: ['Roboto Mono', 'monospace'],
				sans: ['Montserrat', 'Inter', 'sans-serif'],
			},
			colors: {
				jarvis: {
					primary: "#9b87f5",
					secondary: "#7E69AB",
					dark: "#1A1F2C",
					light: "#D6BCFA",
					blue: "#1EAEDB",
					sky: "#33C3F0",
					bg: "#131A22",
					glow: "rgba(30,174,219,0.2)",
					border: "#232C3B",
				},
				groqflow: {
					navy: "#102542",
					teal: "#2D9CDB",
					lightgray: "#F5F7FA",
					success: "#4CAF50",
					warning: "#FFC107",
					error: "#FF5252",
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
			},
			boxShadow: {
				"jarvis-glow": "0 0 30px 5px #1EAEDB40, 0 0 2px 1px #9b87f580",
			},
			borderRadius: {
				jarvis: "1.25rem"
			},
			animation: {
				"glow": "jarvisGlow 2.5s ease-in-out infinite alternate",
			},
			keyframes: {
				jarvisGlow: {
					'0%': { boxShadow: '0 0 30px 5px #1EAEDB40' },
					'100%': { boxShadow: '0 0 60px 10px #1EAEDB60' },
				},
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

