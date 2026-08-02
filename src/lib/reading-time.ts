/** Minutes to read, at 220 words per minute. Fenced code counts at a slower
 *  rate since nobody skims code at prose speed. */
export function readingTime(markdown: string): number {
    const withoutFrontMatterNoise = markdown.replace(/```[\s\S]*?```/g, '');
    const words = withoutFrontMatterNoise.trim().split(/\s+/).length;
    const codeLines = (markdown.match(/```[\s\S]*?```/g) ?? []).reduce(
        (total, block) => total + block.split('\n').length,
        0
    );
    const minutes = words / 220 + codeLines / 40;
    return Math.max(1, Math.round(minutes));
}
