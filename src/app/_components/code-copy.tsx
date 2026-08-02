'use client';

import { useEffect } from 'react';

const COPY = 'Copy';
const DONE = 'Copied';

/** Adds a copy button to every code block in the rendered post HTML. The body
 *  comes from dangerouslySetInnerHTML, so the buttons are attached after mount
 *  rather than rendered by React. */
export function CodeCopy() {
    useEffect(() => {
        const blocks = document.querySelectorAll<HTMLPreElement>(
            '[data-post-body] pre'
        );

        const cleanups: Array<() => void> = [];

        blocks.forEach((block) => {
            if (block.querySelector('.code-copy-btn')) return;

            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'code-copy-btn';
            button.textContent = COPY;
            button.setAttribute('aria-label', 'Copy code to clipboard');

            const onClick = async () => {
                const code = block.querySelector('code')?.innerText ?? '';
                try {
                    await navigator.clipboard.writeText(code);
                    button.textContent = DONE;
                    button.dataset.copied = 'true';
                    setTimeout(() => {
                        button.textContent = COPY;
                        delete button.dataset.copied;
                    }, 1600);
                } catch {
                    button.textContent = 'Press ⌘C';
                    setTimeout(() => (button.textContent = COPY), 1600);
                }
            };

            button.addEventListener('click', onClick);
            block.appendChild(button);

            cleanups.push(() => {
                button.removeEventListener('click', onClick);
                button.remove();
            });
        });

        return () => cleanups.forEach((cleanup) => cleanup());
    }, []);

    return null;
}

export default CodeCopy;
