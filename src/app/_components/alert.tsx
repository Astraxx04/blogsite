import Container from '@/app/_components/container';

type Props = {
    preview?: boolean;
};

const Alert = ({ preview }: Props) => {
    if (!preview) return null;

    return (
        <div className="border-b border-line bg-bg-soft">
            <Container>
                <div className="py-2.5 text-center text-sm text-fg-muted">
                    This page is a preview.{' '}
                    <a
                        href="/api/exit-preview"
                        className="font-semibold text-link underline underline-offset-2 transition-colors hover:text-link-hover"
                    >
                        Click here
                    </a>{' '}
                    to exit preview mode.
                </div>
            </Container>
        </div>
    );
};

export default Alert;
