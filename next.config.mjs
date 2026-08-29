/** @type {import('next').NextConfig} */
const nextConfig = {
    // `next dev --turbopack` and `next build` both write to `.next/` by default,
    // so running a build while the dev server is up replaces the chunks it is
    // serving — the dev overlay then fails with "missing required error
    // components, refreshing..." and only a restart clears it.
    // `npm run build:check` sets NEXT_DIST_DIR so local verification builds get
    // their own directory. Deploys leave it unset and still use `.next/`.
    distDir: process.env.NEXT_DIST_DIR || '.next',
};

export default nextConfig;
