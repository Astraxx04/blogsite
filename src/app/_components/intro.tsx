export function Intro() {
    return (
        <section className="animate-rise pb-14 pt-16 md:pb-20 md:pt-24">
            <span className="eyebrow">Notes from the terminal</span>
            <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-[1.08] tracking-tighter sm:text-5xl md:text-6xl">
                Insights <span className="gradient-text">Repo</span>.
            </h1>
            <p className="mt-5 max-w-xl text-body-sm text-fg-muted">
                A developer&apos;s take on building, breaking, and learning
                through code — deep dives, walkthroughs and the odd hard-earned
                lesson.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                    href="https://sgagan.dev"
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary"
                >
                    Written by Gagan S
                </a>
                <a
                    href="https://github.com/Astraxx04"
                    target="_blank"
                    rel="noreferrer"
                    className="btn-ghost"
                >
                    GitHub
                </a>
            </div>
        </section>
    );
}
