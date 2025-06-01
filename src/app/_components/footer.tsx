import Container from '@/app/_components/container';

export function Footer() {
    return (
        <footer className="bg-neutral-50 border-t border-neutral-200 dark:bg-black">
            <Container>
                <div className="flex flex-col lg:flex-row items-center lg:mx-32 md:mx-32">
                    <h4 className="text-3xl pt-4 lg:text-[2.5rem] font-bold tracking-tighter leading-tight text-center lg:text-left mb-6 lg:mb-0 lg:pr-4 lg:w-1/2">
                        Get In Touch.
                    </h4>
                    <div className="flex flex-col lg:flex-row lg:justify-end justify-center lg:items-end lg:pl-4 lg:w-1/2 w-2/3">
                        <div className="social-icon flex justify-between lg:pt-5 md:pt-0 mr-0 pb-4 gap-x-6">
                            <div className="lg:size-16 md:size-16 size-12">
                                <a
                                    href="https://github.com/Astraxx04"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <img
                                        className="icon"
                                        src={`/assets/constants/github.png`}
                                        alt="Github Icon"
                                    />
                                </a>
                            </div>
                            <div className="lg:size-16 md:size-16 size-12">
                                <a
                                    href="https://www.linkedin.com/in/gagan-s-105706202/"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <img
                                        className="icon"
                                        src={`/assets/constants/linkedin.png`}
                                        alt="LinkedIn Icon"
                                    />
                                </a>
                            </div>
                            <div className="lg:size-16 md:size-16 size-12">
                                <a
                                    href="mailto:gagan200254@gmail.com"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <img
                                        className="icon"
                                        src={`/assets/constants/gmail.png`}
                                        alt="Gmail Icon"
                                    />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </footer>
    );
}

export default Footer;
