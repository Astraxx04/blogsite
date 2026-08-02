import type { Config } from 'tailwindcss';

const config: Config = {
    darkMode: 'class',
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            /* Semantic tokens resolve to the CSS variables declared in
               globals.css, so every colour flips with the light/dark class.
               Do not use the `/opacity` modifier on these — a var() value
               cannot carry <alpha-value>. */
            colors: {
                bg: 'var(--bg)',
                'bg-soft': 'var(--bg-soft)',
                'bg-translucent': 'var(--bg-translucent)',
                card: 'var(--card)',
                'card-hover': 'var(--card-hover)',
                line: 'var(--line)',
                'line-strong': 'var(--line-strong)',
                fg: 'var(--fg)',
                'fg-muted': 'var(--fg-muted)',
                'fg-subtle': 'var(--fg-subtle)',
                accent: 'var(--accent)',
                link: 'var(--link)',
                'link-hover': 'var(--link-hover)',
                brand: {
                    pink: '#aa367c',
                    purple: '#4a2fbd',
                    'pink-light': '#e05fae',
                    'purple-light': '#7d63ff',
                    rose: '#d17ab3',
                },
            },
            fontFamily: {
                sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
                serif: ['var(--font-serif)', 'Georgia', 'serif'],
                mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
            },
            fontSize: {
                /* Reading sizes carry their own leading so body copy never
                   inherits a tight UI line-height. */
                'body-sm': ['1.0625rem', { lineHeight: '1.75' }],
                body: ['1.1875rem', { lineHeight: '1.8' }],
            },
            maxWidth: {
                /* ~68 characters — the readable measure for long-form prose. */
                reading: '44rem',
                shell: '72rem',
            },
            backgroundImage: {
                'brand-gradient':
                    'linear-gradient(90.21deg, #aa367c -5.91%, #4a2fbd 111.58%)',
                'brand-text':
                    'linear-gradient(90deg, #e05fae 0%, #7d63ff 100%)',
            },
            boxShadow: {
                card: '0 1px 2px rgba(0, 0, 0, 0.04), 0 8px 24px rgba(0, 0, 0, 0.06)',
                lift: '0 18px 40px rgba(170, 54, 124, 0.18)',
            },
            letterSpacing: {
                tighter: '-.03em',
            },
            keyframes: {
                rise: {
                    from: { opacity: '0', transform: 'translateY(20px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
            },
            animation: {
                rise: 'rise 0.7s ease-out both',
            },
        },
    },
    plugins: [],
};
export default config;
