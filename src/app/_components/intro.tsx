export function Intro() {
    return (
        <section className="flex-col md:flex-row flex items-center md:justify-between mt-16 mb-16 md:mb-12">
            <h1 className="text-5xl md:text-8xl font-bold tracking-tighter leading-tight md:pr-8">
                Insights Repo.
            </h1>
            <h4 className="text-center md:text-left text-lg mt-5 md:pl-8">
                A developer's take on building, breaking, and learning through
                code. <br />
                <a
                    href="https://sgagan.dev"
                    className="text-blue-300 hover:text-blue-600 duration-200 transition-colors"
                >
                    Gagan S
                </a>
            </h4>
        </section>
    );
}
