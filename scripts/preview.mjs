import http from 'node:http';
import path from 'node:path';
import {readFile, realpath, stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const types = {'.html':'text/html; charset=utf-8','.md':'text/plain; charset=utf-8','.txt':'text/plain; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.ico':'image/x-icon','.woff2':'font/woff2','.ttf':'font/ttf'};

// Development only: keep the browser cache enabled, but validate every reuse.
// Content validators also detect edits with unchanged size/second-resolution mtime.
export function createPreviewServer(directory = root) {
    return http.createServer(async (request, response) => {
        response.setHeader('Cache-Control', 'no-cache');
        response.setHeader('X-Content-Type-Options', 'nosniff');
        if (!['GET', 'HEAD'].includes(request.method)) {
            response.writeHead(405, {Allow:'GET, HEAD'}).end(); return;
        }
        try {
            const pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
            const base = await realpath(directory);
            let file = path.resolve(base, '.' + pathname);
            const inside = candidate => candidate === base || candidate.startsWith(base + path.sep);
            if (!inside(file)) { response.writeHead(403).end(); return; }
            if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html');
            file = await realpath(file);
            if (!inside(file)) { response.writeHead(403).end(); return; }
            const body = await readFile(file);
            const etag = '"' + createHash('sha256').update(body).digest('hex') + '"';
            response.setHeader('ETag', etag);
            response.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
            if ((request.headers['if-none-match'] || '').split(',').some(value => value.trim().replace(/^W\//, '') === etag || value.trim() === '*')) {
                response.writeHead(304).end(); return;
            }
            response.setHeader('Content-Length', body.length);
            response.writeHead(200).end(request.method === 'HEAD' ? undefined : body);
        } catch (error) {
            response.writeHead(error instanceof URIError ? 400 : ['ENOENT', 'ENOTDIR'].includes(error.code) ? 404 : 500).end();
        }
    });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    const port = Number(process.argv[2] || 4203);
    if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Expected a port between 1 and 65535');
    const server = createPreviewServer();
    server.on('error', error => { console.error(error.message); process.exitCode = 1; });
    server.listen(port, '127.0.0.1', () => console.log(`DocumentTemplate preview: http://127.0.0.1:${port}/ (cache revalidation enabled)`));
}
