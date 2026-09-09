/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Served behind a reverse proxy at abstergo.space/photobooth (aaPanel nginx
  // preserves the /photobooth/ prefix → upstream receives /photobooth/...).
  // basePath makes Next emit routes, /_next assets, public files and metadata
  // under the prefix. RAW asset URLs in the data-driven asset tables
  // (effects/stickers/stripPacks) are prefixed via withBasePath() in
  // lib/utils/paths.ts — keep that literal in sync with basePath here.
  basePath: "/photobooth",
  // Serve the canonical URL with a trailing slash so the page renders 200
  // directly (no 308 redirect to /photobooth, which the reverse-proxy
  // location ^~ /photobooth/ would not match). nginx adds a 301 from the
  // bare /photobooth → /photobooth/ for users who omit the slash.
  trailingSlash: true,
};

export default nextConfig;