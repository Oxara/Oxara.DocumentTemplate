import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {readFile, mkdtemp, mkdir, cp, writeFile, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {createHash} from 'node:crypto';
import {buildPublicDocs} from './build-public-docs.mjs';
const root = fileURLToPath(new URL('../', import.meta.url));
const registry = JSON.parse(await readFile(path.join(root, 'features/features.json'), 'utf8'));

test('standalone features include every local CSS dependency, fonts and font licenses', async () => {
    for (const id of Object.keys(registry)) {
        const available = new Set();
        function collect(key) {
            const feature = registry[key];
            for (const file of [...feature.css, ...feature.js, ...(feature.assets || [])]) available.add(file);
            for (const dependency of feature.requires) collect(dependency);
        }
        collect(id);
        for (const file of available) {
            if (!file.endsWith('.css')) continue;
            for (const match of (await readFile(path.join(root, file), 'utf8')).matchAll(/url\(\s*["']?([^\s"')]+)["']?\s*\)/g)) {
                if (/^(?:[a-z]+:|\/\/|#)/i.test(match[1])) continue;
                const dependency = path.posix.normalize(path.posix.join(path.posix.dirname(file), match[1]));
                assert.ok(available.has(dependency), `${id}: missing ${dependency} required by ${file}`);
            }
        }
    }
    const provenance = JSON.parse(await readFile(path.join(root, 'assets/fonts/provenance.json'), 'utf8'));
    for (const font of provenance.files) {
        assert.ok(registry.base.assets.includes(font.path));
        assert.equal(createHash('sha256').update(await readFile(path.join(root, font.path))).digest('hex'), font.sha256);
    }
});

test('public build excludes private source roots and rejects artifact injection', async t => {
    const fixture = await mkdtemp(path.join(tmpdir(), 'dt-public-'));
    t.after(async () => { assert.ok(path.resolve(fixture).startsWith(path.resolve(tmpdir()) + path.sep)); await rm(fixture, {recursive:true, force:true}); });
    for (const directory of ['docs', 'features', 'feature-packages', 'assets']) await cp(path.join(root, directory), path.join(fixture, directory), {recursive:true});
    for (const file of ['index.html', 'LICENSE', 'apple-touch-icon.png', 'favicon-48.png']) await cp(path.join(root, file), path.join(fixture, file));
    await mkdir(path.join(fixture, 'work'), {recursive:true}); await writeFile(path.join(fixture, 'work', 'private.txt'), 'private');
    await writeFile(path.join(fixture, 'AGENTS.md'), 'private');
    const built = await buildPublicDocs(fixture);
    const manifest = JSON.parse(await readFile(path.join(built.output, 'public-manifest.json'), 'utf8'));
    const metadata = JSON.parse(await readFile(path.join(fixture,'docs/site-metadata.json'),'utf8'));
    assert.ok(manifest.files[metadata.imagePath], 'Absolute OG image must be explicitly included in the public artifact');
    assert.ok(!Object.keys(manifest.files).some(file => /^(?:work|\.planning|scripts|tools|node_modules)\//.test(file) || file === 'AGENTS.md'));
    await buildPublicDocs(fixture, {check:true});
    await writeFile(path.join(built.output, 'AGENTS.md'), 'injected');
    await assert.rejects(buildPublicDocs(fixture, {check:true}), /Unexpected/);
});
