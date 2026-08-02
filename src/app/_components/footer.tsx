import Container from '@/app/_components/container';

const socials = [
    {
        href: 'https://github.com/Astraxx04',
        icon: '/assets/constants/github.png',
        label: 'GitHub',
    },
    {
        href: 'https://www.linkedin.com/in/gagan-s-105706202/',
        icon: '/assets/constants/linkedin.png',
        label: 'LinkedIn',
    },
    {
        href: 'mailto:gagan200254@gmail.com',
        icon: '/assets/constants/gmail.png',
        label: 'Email',
    },
];

export function Footer() {
    return (
        <footer className="mt-8 border-t border-line bg-bg-soft">
            <Container>
                <div className="flex flex-col items-start gap-8 py-14 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
                            Get in <span className="gradient-text">touch</span>.
                        </h2>
                        <p className="mt-2 max-w-sm text-sm text-fg-muted">
                            Questions, corrections or an idea for a post — all
                            welcome.
                        </p>
                    </div>

                    <ul className="flex items-center gap-3">
                        {socials.map((social) => (
                            <li key={social.label}>
                                <a
                                    href={social.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label={social.label}
                                    title={social.label}
                                    className="flex h-12 w-12 items-center justify-center rounded-full border border-line bg-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-rose"
                                >
                                    <img
                                        className="h-5 w-5 object-contain"
                                        src={social.icon}
                                        alt=""
                                    />
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex flex-col gap-2 border-t border-line py-6 text-xs text-fg-subtle sm:flex-row sm:items-center sm:justify-between">
                    <span>© {new Date().getFullYear()} Gagan S</span>
                    <a
                        href="https://sgagan.dev"
                        target="_blank"
                        rel="noreferrer"
                        className="text-fg-subtle transition-colors hover:text-fg"
                    >
                        sgagan.dev
                    </a>
                </div>
            </Container>
        </footer>
    );
}

export default Footer;
