import Link from 'next/link';
import { ThemeToggle } from './theme-switcher';

const ExternalIcon = () => (
    <svg
        className="h-3 w-3 opacity-70"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        aria-hidden
    >
        <path d="M14 4h6v6M20 4l-8.5 8.5" />
        <path d="M18 14.5V19a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h4.5" />
    </svg>
);

export function SiteHeader() {
    return (
        <header className="sticky top-0 z-50 border-b border-line bg-bg-translucent backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-shell items-center justify-between gap-4 px-5 md:px-8">
                <Link
                    href="/"
                    className="group flex items-center gap-2.5 text-[15px] font-bold tracking-tight text-fg md:text-base"
                >
                    <span className="h-2.5 w-2.5 rounded-full bg-brand-gradient transition-transform group-hover:scale-125" />
                    Insights Repo
                </Link>

                <nav className="flex items-center gap-1 sm:gap-2">
                    <Link
                        href="/"
                        className="rounded-full px-3 py-2 text-sm font-medium text-fg-muted transition-colors hover:text-fg"
                    >
                        Posts
                    </Link>
                    <Link
                        href="/tags"
                        className="rounded-full px-3 py-2 text-sm font-medium text-fg-muted transition-colors hover:text-fg"
                    >
                        Tags
                    </Link>
                    <a
                        href="https://sgagan.dev"
                        target="_blank"
                        rel="noreferrer"
                        className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-fg-muted transition-colors hover:text-fg sm:flex"
                    >
                        Portfolio
                        <ExternalIcon />
                    </a>
                    <a
                        href="https://github.com/Astraxx04"
                        target="_blank"
                        rel="noreferrer"
                        className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-fg-muted transition-colors hover:text-fg sm:flex"
                    >
                        GitHub
                        <ExternalIcon />
                    </a>
                    <span
                        className="mx-1 hidden h-5 w-px bg-line sm:block"
                        aria-hidden
                    />
                    <ThemeToggle />
                </nav>
            </div>
        </header>
    );
}

export default SiteHeader;
