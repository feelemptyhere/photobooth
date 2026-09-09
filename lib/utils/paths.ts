/**
 * lib/utils/paths.ts — basePath-aware asset URL helper.
 *
 * The app is reverse-proxied under a subpath (abstergo.space/photobooth), so
 * Next.js `basePath` is set in next.config.mjs. Next auto-prefixes /_next,
 * next/link, next/image and metadata — but RAW asset URLs in our data-driven
 * asset tables (effects / stickers / stripPacks textures) are plain
 * root-absolute strings consumed by <img src> and canvas `new Image()`, which
 * are NOT auto-prefixed. Routing them through withBasePath() makes them resolve
 * under the subpath (canvas export would otherwise 404 the sticker/effect
 * images and taint-free toDataURL would still fail to composite them).
 *
 * The literal here MUST mirror `basePath` in next.config.mjs.
 */
export const BASE_PATH = "/photobooth";

/** Prefix a root-absolute public-asset path (e.g. "/assets/x.svg") with basePath. */
export const withBasePath = (p: string): string => `${BASE_PATH}${p}`;
