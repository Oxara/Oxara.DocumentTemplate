import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp, mkdir, writeFile, readFile, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {buildDocsRuntime} from './docs-runtime.mjs';

test('docs revisions cover nested CSS assets and package-loaded scripts; old graphs stay immutable', async t => {
    const root = await mkdtemp(path.join(tmpdir(), 'dt-runtime-'));
    t.after(() => rm(root, {recursive:true, force:true}));
    const files = {
        'index.html':'<link rel="stylesheet" href="style.css"><script src="feature-packages/core.js"></script>',
        'style.css':'@import "nested.css";', 'nested.css':'body { background: url("image.svg"); }',
        'image.svg':'<svg>old</svg>', 'feature-packages/core.js':'/* loader */',
        'features/theme/theme.js':'/* theme */', 'features/docs-layout/docs-layout.js':'/* old */',
        'features/navigation-progress/navigation-progress.js':'/* progress */', 'features/document-hero/document-hero.js':'/* hero */'
    };
    for (const [file, body] of Object.entries(files)) { await mkdir(path.dirname(path.join(root, file)), {recursive:true}); await writeFile(path.join(root, file), body); }
    const first = await buildDocsRuntime(root, ['index.html']);
    await buildDocsRuntime(root, ['index.html'], {check:true});
    assert.equal((await buildDocsRuntime(root, ['index.html'])).revision, first.revision);
    await writeFile(path.join(root, 'features/docs-layout/docs-layout.js'), '/* new */');
    await assert.rejects(buildDocsRuntime(root, ['index.html'], {check:true}));
    const second = await buildDocsRuntime(root, ['index.html']);
    assert.notEqual(second.revision, first.revision);
    assert.equal(await readFile(path.join(root, 'assets/docs-runtime', first.revision, 'features/docs-layout/docs-layout.js'), 'utf8'), '/* old */');
    assert.ok((await readFile(path.join(root, 'index.html'), 'utf8')).includes(second.revision));
    await writeFile(path.join(root, 'image.svg'), '<svg>new</svg>');
    const third = await buildDocsRuntime(root, ['index.html']);
    assert.notEqual(third.revision, second.revision, 'nested CSS image must invalidate the complete graph');
    await buildDocsRuntime(root, ['index.html'], {check:true});
});
