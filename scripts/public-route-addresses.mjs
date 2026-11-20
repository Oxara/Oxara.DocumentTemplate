// Hosting URL policy, independent of document filenames and product identity.
export function publicPagePath(pathname, mode='files') {
    if (!['files', 'cloudflare-pages'].includes(mode)) throw Error(`Unknown routing mode: ${mode}`);
    if (mode === 'files') return pathname;
    return pathname.replace(/\/index\.html$/, '/').replace(/\.html$/, '');
}
