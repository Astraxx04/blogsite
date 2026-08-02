import Link from 'next/link';
import Container from '@/app/_components/container';

export default function NotFound() {
    return (
        <main id="content">
            <Container>
                <section className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
                    <span className="eyebrow">404</span>
                    <h1 className="mt-6 text-3xl font-bold tracking-tighter sm:text-4xl">
                        This page went{' '}
                        <span className="gradient-text">missing</span>.
                    </h1>
                    <p className="mt-4 max-w-md text-body-sm text-fg-muted">
                        The post you were after may have been renamed or never
                        existed.
                    </p>
                    <Link href="/" className="btn-primary mt-8">
                        Back to all posts
                    </Link>
                </section>
            </Container>
        </main>
    );
}
