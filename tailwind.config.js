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
        background: '#0B0F14',
        surface: {
          DEFAULT: '#131922',
          elevated: '#1A222E',
          hover: '#222B3A',
          subtle: '#2A3547'
        },
        border: 'rgba(255, 255, 255, 0.09)',
        // Physical Metallurgy Tokens (Reclaimed Electronic Elements)
        copper: {
          DEFAULT: '#C86432',
          light: '#E07E4A',
          dark: '#9A451A',
          glow: 'rgba(200, 100, 50, 0.35)'
        },
        gold: {
          DEFAULT: '#EAB308',
          light: '#FDE047',
          dark: '#A16207',
          glow: 'rgba(234, 179, 8, 0.35)'
        },
        palladium: {
          DEFAULT: '#94A3B8',
          light: '#CBD5E1',
          dark: '#64748B'
        },
        // Environmental & Status Tokens
        emerald: {
          DEFAULT: '#30D158',
          light: '#5EE082',
          dark: '#248A3D',
          glow: 'rgba(48, 209, 88, 0.35)'
        },
        cyan: {
          DEFAULT: '#64D2FF',
          light: '#98E2FF',
          dark: '#0A84FF',
          glow: 'rgba(100, 210, 255, 0.35)'
        },
        lavender: {
          DEFAULT: '#BF5AF2',
          light: '#DA8FFF',
          dark: '#8944AB',
          glow: 'rgba(191, 90, 242, 0.3)'
        },
        pink: {
          DEFAULT: '#FF7AB6',
          light: '#FFA6CE',
          dark: '#D03E7E',
          glow: 'rgba(255, 122, 182, 0.3)'
        },
        amber: {
          DEFAULT: '#FFD60A',
          light: '#FFE043',
          dark: '#FF9F0A',
          glow: 'rgba(255, 214, 10, 0.35)'
        },
        text: {
          primary: '#F5F5F7',
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
        'card': '20px',
        'modal': '24px',
        'pill': '9999px',
      },
      boxShadow: {
        'spatial': '0 24px 48px -12px rgba(0, 0, 0, 0.75), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
        'spatial-subtle': '0 12px 28px -6px rgba(0, 0, 0, 0.6), inset 0 1px 0 0 rgba(255, 255, 255, 0.06)',
        'liquid-glass': '0 24px 50px -12px rgba(0, 0, 0, 0.8), inset 0 1px 1px 0 rgba(255, 255, 255, 0.22), inset 0 -1px 1px 0 rgba(0, 0, 0, 0.5)',
        'liquid-pill': '0 10px 30px -4px rgba(0, 0, 0, 0.6), inset 0 1px 1px 0 rgba(255, 255, 255, 0.25), inset 0 -1px 1px 0 rgba(0, 0, 0, 0.4)',
        'specular-glow': '0 0 20px -2px rgba(255, 255, 255, 0.12), inset 0 1px 1px 0 rgba(255, 255, 255, 0.35)',
        'emerald-glow': '0 0 24px rgba(48, 209, 88, 0.3)',
        'cyan-glow': '0 0 24px rgba(100, 210, 255, 0.3)',
        'lavender-glow': '0 0 24px rgba(191, 90, 242, 0.25)',
        'amber-glow': '0 0 24px rgba(255, 214, 10, 0.3)',
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
