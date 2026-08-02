type Props = {
    name: string;
    picture: string;
    size?: 'sm' | 'md';
};

const Avatar = ({ name, picture, size = 'md' }: Props) => {
    const box = size === 'sm' ? 'h-8 w-8' : 'h-11 w-11';

    return (
        <div className="flex items-center gap-3">
            {/* Gradient ring echoes the portrait treatment on the portfolio. */}
            <span
                className={`${box} shrink-0 rounded-full bg-brand-gradient p-[1.5px]`}
            >
                <img
                    src={picture}
                    className="h-full w-full rounded-full object-cover"
                    alt=""
                />
            </span>
            <span
                className={
                    size === 'sm'
                        ? 'text-sm font-semibold text-fg-muted'
                        : 'text-[15px] font-semibold text-fg'
                }
            >
                {name}
            </span>
        </div>
    );
};

export default Avatar;
