import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp, writeFile, utimes, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {once} from 'node:events';
import {createPreviewServer} from './preview.mjs';

test('preview revalidates HTML and scripts and detects same-size same-mtime edits', async t => {
    const root = await mkdtemp(path.join(tmpdir(), 'dt-preview-'));
    const server = createPreviewServer(root);
    t.after(async () => { await new Promise(resolve => server.close(resolve)); await rm(root, {recursive:true, force:true}); });
    server.listen(0, '127.0.0.1'); await once(server, 'listening');
    const origin = `http://127.0.0.1:${server.address().port}`;
    const modified = new Date('2026-01-01T00:00:00Z');
    for (const file of ['index.html', 'docs-layout.js', 'docs-layout.css']) {
        const target = path.join(root, file);
        await writeFile(target, 'old menu'); await utimes(target, modified, modified);
        const before = await fetch(origin + '/' + file);
        assert.equal(before.headers.get('cache-control'), 'no-cache');
        const etag = before.headers.get('etag'); assert.ok(etag);
        assert.equal(await before.text(), 'old menu');
        const unchanged = await fetch(origin + '/' + file, {headers:{'If-None-Match':etag}});
        assert.equal(unchanged.status, 304);
        assert.equal(unchanged.headers.get('cache-control'), 'no-cache');
        await writeFile(target, 'new menu'); await utimes(target, modified, modified);
        const after = await fetch(origin + '/' + file, {headers:{'If-None-Match':etag, 'If-Modified-Since':modified.toUTCString()}});
        assert.equal(after.status, 200);
        assert.notEqual(after.headers.get('etag'), etag);
        assert.equal(await after.text(), 'new menu');
        const legacy = await fetch(origin + '/' + file, {headers:{'If-Modified-Since':new Date('2030-01-01').toUTCString()}});
        assert.equal(legacy.status, 200, 'a legacy date-only validator must receive the current bytes and policy');
        await legacy.text();
    }
});
