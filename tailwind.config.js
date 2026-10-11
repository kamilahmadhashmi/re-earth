/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#07080A',
        surface: {
          DEFAULT: '#0D0F14',
          elevated: '#13161E',
          hover: '#1A1E28',
          subtle: '#212634'
        },
        border: 'rgba(255, 255, 255, 0.08)',
        // Physical Metallurgy Tokens (Reclaimed Electronic Elements)
        copper: {
          DEFAULT: '#C86432',
          light: '#E07E4A',
          dark: '#9A451A',
          glow: 'rgba(200, 100, 50, 0.15)'
        },
        gold: {
          DEFAULT: '#F59E0B',
          light: '#FBBF24',
          dark: '#D97706',
          glow: 'rgba(245, 158, 11, 0.15)'
        },
        palladium: {
          DEFAULT: '#94A3B8',
          light: '#CBD5E1',
          dark: '#64748B'
        },
        // Environmental & Status Tokens
        emerald: {
          DEFAULT: '#10B981',
          light: '#34D399',
          dark: '#059669',
          glow: 'rgba(16, 185, 129, 0.15)'
        },
        cyan: {
          DEFAULT: '#38BDF8',
          light: '#7DD3FC',
          dark: '#0284C7',
          glow: 'rgba(56, 189, 248, 0.15)'
        },
        lavender: {
          DEFAULT: '#A855F7',
          light: '#C084FC',
          dark: '#7E22CE',
          glow: 'rgba(168, 85, 247, 0.15)'
        },
        pink: {
          DEFAULT: '#F43F5E',
          light: '#FB7185',
          dark: '#BE123C',
          glow: 'rgba(244, 63, 94, 0.15)'
        },
        amber: {
          DEFAULT: '#F59E0B',
          light: '#FBBF24',
          dark: '#D97706',
          glow: 'rgba(245, 158, 11, 0.15)'
        },
        text: {
          primary: '#F9FAFB',
          secondary: '#A1A1AA',
          muted: '#71717A',
          subtle: '#52525B'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"SF Pro Text"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"SF Mono"', 'Menlo', 'monospace'],
      },
      borderRadius: {
        'card': '16px',
        'modal': '20px',
        'pill': '9999px',
      },
      boxShadow: {
        'spatial': '0 1px 2px rgba(0, 0, 0, 0.4), 0 12px 32px -4px rgba(0, 0, 0, 0.6), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
        'spatial-subtle': '0 1px 2px rgba(0, 0, 0, 0.3), 0 6px 16px -2px rgba(0, 0, 0, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
        'liquid-glass': '0 1px 3px rgba(0, 0, 0, 0.5), 0 16px 40px -8px rgba(0, 0, 0, 0.7), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
        'liquid-pill': '0 1px 2px rgba(0, 0, 0, 0.4), 0 8px 20px -4px rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.12)',
        'specular-glow': '0 1px 3px rgba(0, 0, 0, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.15)',
        'emerald-glow': '0 0 16px rgba(16, 185, 129, 0.15)',
        'cyan-glow': '0 0 16px rgba(56, 189, 248, 0.15)',
        'lavender-glow': '0 0 16px rgba(168, 85, 247, 0.12)',
        'amber-glow': '0 0 16px rgba(245, 158, 11, 0.15)',
      },
      backdropBlur: {
        'spatial': '24px',
        'liquid': '28px',
      },
      transitionTimingFunction: {
        'apple-spring': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'apple-ease': 'cubic-bezier(0.25, 1, 0.5, 1)',
      }
    },
  },
  plugins: [],
}
