import Footer from '@/app/_components/footer';
import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Source_Serif_4 } from 'next/font/google';
import cn from 'classnames';
import { ThemeScript } from './_components/theme-switcher';
import SiteHeader from './_components/site-header';
import { AUTHOR, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site';

import './globals.css';

/* Sans for UI and headings, serif for the reading column, mono for code. */
const sans = Inter({
    subsets: ['latin'],
    variable: '--font-sans',
    display: 'swap',
});

const serif = Source_Serif_4({
    subsets: ['latin'],
    variable: '--font-serif',
    display: 'swap',
});

const mono = JetBrains_Mono({
    subsets: ['latin'],
    variable: '--font-mono',
    display: 'swap',
});

export const metadata: Metadata = {
    /* Every relative URL below (and in each post) resolves against this. */
    metadataBase: new URL(SITE_URL),
    title: {
        default: SITE_NAME,
        template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    authors: [{ name: AUTHOR.name, url: AUTHOR.url }],
    alternates: {
        canonical: '/',
        types: {
            'application/rss+xml': `${SITE_URL}/feed.xml`,
        },
    },
    openGraph: {
        type: 'website',
        siteName: SITE_NAME,
        title: SITE_NAME,
        description: SITE_DESCRIPTION,
        url: SITE_URL,
        images: ['/assets/constants/spider-kid.jpg'],
    },
    twitter: {
        card: 'summary_large_image',
        title: SITE_NAME,
        description: SITE_DESCRIPTION,
        images: ['/assets/constants/spider-kid.jpg'],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link
                    rel="apple-touch-icon"
                    sizes="180x180"
                    href="/favicon/apple-touch-icon.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="32x32"
                    href="/favicon/favicon-32x32.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="16x16"
                    href="/favicon/favicon-16x16.png"
                />
                <link rel="manifest" href="/favicon/site.webmanifest" />
                <link
                    rel="mask-icon"
                    href="/favicon/safari-pinned-tab.svg"
                    color="#aa367c"
                />
                <link rel="shortcut icon" href="/favicon/favicon.ico" />
                <meta name="msapplication-TileColor" content="#121212" />
                <meta
                    name="msapplication-config"
                    content="/favicon/browserconfig.xml"
                />
                <meta name="theme-color" content="#121212" />
                {/* The RSS <link rel="alternate"> comes from metadata.alternates. */}
                <ThemeScript />
            </head>
            <body
                className={cn(
                    sans.variable,
                    serif.variable,
                    mono.variable,
                    'font-sans bg-bg text-fg'
                )}
            >
                <div className="page-glow" aria-hidden />
                <a href="#content" className="skip-link">
                    Skip to content
                </a>
                <SiteHeader />
                <div className="min-h-screen">{children}</div>
                <Footer />
            </body>
        </html>
    );
}
