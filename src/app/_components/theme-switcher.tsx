'use client';

import { memo, useEffect, useState, type ReactElement } from 'react';

declare global {
    var updateDOM: () => void;
}

type ColorSchemePreference = 'system' | 'dark' | 'light';

const STORAGE_KEY = 'gagan-insights-repo';
const modes: ColorSchemePreference[] = ['system', 'dark', 'light'];

/* Switching to light mode is gently discouraged. The button refuses this many
   times — with a quip each time — before it gives in. */
const LIGHT_MODE_NAGS = [
    'Are you serious? It is so cosy in here.',
    'Do you have your sunglasses on? Last warning.',
    'Fine, but my retinas are billing you for this.',
];

/** function to be injected in script tag for avoiding FOUC (Flash of Unstyled Content) */
export const NoFOUCScript = (storageKey: string) => {
    /* can not use outside constants or function as this script will be injected in a different context */
    const [SYSTEM, DARK, LIGHT] = ['system', 'dark', 'light'];

    /** Modify transition globally to avoid patched transitions */
    const modifyTransition = () => {
        const css = document.createElement('style');
        css.textContent = '*,*:after,*:before{transition:none !important;}';
        document.head.appendChild(css);

        return () => {
            /* Force restyle */
            getComputedStyle(document.body);
            /* Wait for next tick before removing */
            setTimeout(() => document.head.removeChild(css), 1);
        };
    };

    const media = matchMedia(`(prefers-color-scheme: ${DARK})`);

    /** function to add remove dark class */
    window.updateDOM = () => {
        const restoreTransitions = modifyTransition();
        /* Dark is the house style: an unset preference resolves to it rather
           than to whatever the operating system asks for. */
        const mode = localStorage.getItem(storageKey) ?? DARK;
        const systemMode = media.matches ? DARK : LIGHT;
        const resolvedMode = mode === SYSTEM ? systemMode : mode;
        const classList = document.documentElement.classList;
        if (resolvedMode === DARK) classList.add(DARK);
        else classList.remove(DARK);
        document.documentElement.setAttribute('data-mode', mode);
        restoreTransitions();
    };
    window.updateDOM();
    media.addEventListener('change', window.updateDOM);
};

let updateDOM: () => void;

const icons: Record<ColorSchemePreference, ReactElement> = {
    system: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
            <rect
                x="2.5"
                y="4"
                width="19"
                height="13"
                rx="2"
                strokeWidth="1.7"
            />
            <path d="M8 20.5h8" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
    ),
    dark: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
            <path
                d="M20 14.2A8.2 8.2 0 1 1 9.8 4a6.6 6.6 0 0 0 10.2 10.2Z"
                strokeWidth="1.7"
                strokeLinejoin="round"
            />
        </svg>
    ),
    light: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
            <circle cx="12" cy="12" r="4.2" strokeWidth="1.7" />
            <path
                d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6"
                strokeWidth="1.7"
                strokeLinecap="round"
            />
        </svg>
    ),
};

const labels: Record<ColorSchemePreference, string> = {
    system: 'System theme',
    dark: 'Dark theme',
    light: 'Light theme',
};

/**
 * Icon button cycling system -> dark -> light. Sits in the site header instead
 * of floating over the page corner. Dark is the default, and the step into
 * light mode is heckled a few times before it is allowed through.
 */
export const ThemeToggle = () => {
    /* Stays null until mounted: the stored preference is only known on the
       client, and reading it during the first render would make the icon
       disagree with the server HTML (hydration mismatch). */
    const [mode, setMode] = useState<ColorSchemePreference | null>(null);
    /* How many times the user has been told no on their way to light mode. */
    const [nagCount, setNagCount] = useState(0);
    const [nag, setNag] = useState<string | null>(null);

    useEffect(() => {
        // store global functions to local variables to avoid any interference
        updateDOM = window.updateDOM;
        setMode(
            (localStorage.getItem(STORAGE_KEY) ??
                'dark') as ColorSchemePreference
        );
        /** Sync the tabs */
        addEventListener('storage', (e: StorageEvent): void => {
            e.key === STORAGE_KEY &&
                setMode(e.newValue as ColorSchemePreference);
        });
    }, []);

    useEffect(() => {
        if (!mode) return;
        localStorage.setItem(STORAGE_KEY, mode);
        updateDOM();
    }, [mode]);

    /* Each quip clears itself, so the toast never outstays its welcome. */
    useEffect(() => {
        if (!nag) return;
        const timer = setTimeout(() => setNag(null), 4500);
        return () => clearTimeout(timer);
    }, [nag]);

    const current = mode ?? 'dark';

    /** toggle mode */
    const handleModeSwitch = () => {
        const index = modes.indexOf(current);
        const next = modes[(index + 1) % modes.length];

        /* Stall on the way into light mode, then relent on the fourth try. */
        if (next === 'light' && nagCount < LIGHT_MODE_NAGS.length) {
            setNag(LIGHT_MODE_NAGS[nagCount]);
            setNagCount(nagCount + 1);
            return;
        }

        setNagCount(0);
        setNag(null);
        setMode(next);
    };

    return (
        <div className="relative">
            <button
                onClick={handleModeSwitch}
                title={`${labels[current]} — click to change`}
                aria-label={`${labels[current]}. Click to switch theme.`}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-card text-fg-muted transition-colors hover:border-brand-rose hover:text-fg"
            >
                <span className="block h-[18px] w-[18px]">
                    {icons[current]}
                </span>
            </button>
            {nag && (
                <span
                    role="status"
                    className="animate-rise absolute right-0 top-12 z-50 w-max max-w-[15rem] rounded-lg border border-line bg-card px-3 py-2 text-xs text-fg shadow-card"
                >
                    {nag}
                </span>
            )}
        </div>
    );
};

export const ThemeScript = memo(() => (
    <script
        dangerouslySetInnerHTML={{
            __html: `(${NoFOUCScript.toString()})('${STORAGE_KEY}')`,
        }}
    />
));
ThemeScript.displayName = 'ThemeScript';
