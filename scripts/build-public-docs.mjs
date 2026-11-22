import {readFile, writeFile, readdir, mkdir, rm} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {parse} from 'parse5';
import {buildDocsRuntime} from './docs-runtime.mjs';
import {buildDocsMetadata} from './docs-metadata.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const slash = value => value.split(path.sep).join('/');
const attr = (node, name) => node.attrs?.find(a => a.name === name)?.value;
function nodes(node, out = []) { out.push(node); for (const child of node.childNodes || []) nodes(child, out); return out; }
async function list(directory, prefix = '') {
    const files = [];
    for (const entry of await readdir(directory, {withFileTypes:true})) {
        const relative = prefix + entry.name;
        if (entry.isDirectory()) files.push(...await list(path.join(directory, entry.name), relative + '/'));
        else files.push(relative);
    }
    return files;
}

export async function buildPublicDocs(directory = root, {check = false} = {}) {
    const {pages} = JSON.parse(await readFile(path.join(directory, 'docs/pages.json'), 'utf8'));
    const html = ['index.html', ...pages.map(p => 'docs/' + p.file), 'docs/theme-preview.html'];
    const graph = await buildDocsRuntime(directory, html, {check:true});
    const metadata = await buildDocsMetadata(directory, {check:true});
    // Absolute OG/Twitter meta URLs are not local src/href dependencies. Include their verified source explicitly.
    const selected = new Set([...html, 'docs/pages.json', 'LICENSE', ...metadata.publicFiles]);
    for (const folder of ['features', 'feature-packages']) {
        for (const file of await list(path.join(directory, folder))) selected.add(folder + '/' + file);
    }
    // Public technical guides are intentional; evidence/agent/task records are not.
    for (const file of await readdir(path.join(directory, 'docs'))) if (file.endsWith('.md')) selected.add('docs/' + file);
    for (const [file] of Object.entries(graph.files)) {
        selected.add(file);
        selected.add('assets/docs-runtime/' + graph.revision + '/' + file);
    }
    const registry = JSON.parse(await readFile(path.join(directory, 'features/features.json'), 'utf8'));
    for (const feature of Object.values(registry)) for (const file of feature.assets || []) selected.add(file);
    for (const file of html) {
        for (const node of nodes(parse(await readFile(path.join(directory, file), 'utf8')))) {
            const value = attr(node, 'src') || (node.tagName === 'link' ? attr(node, 'href') : null);
            if (!value || /^(?:[a-z]+:|\/\/|#)/i.test(value)) continue;
            const url = new URL(value, 'https://local.invalid/' + file);
            selected.add(decodeURIComponent(url.pathname.slice(1)));
        }
    }
    const files = {};
    for (const file of [...selected].sort()) {
        if (/^(?:\.planning|work|\.git|node_modules|scripts|tools|dist)\//.test(file) || file === 'AGENTS.md' || file.includes('..')) throw Error('Private or escaping artifact path: ' + file);
        files[file] = hash(await readFile(path.join(directory, file)));
    }
    const inventoryDigest = hash(JSON.stringify(files));
    const manifest = {generator:'dt-public-docs-v1', runtimeRevision:graph.revision, inventoryDigest, files};
    const output = path.resolve(directory, 'dist/docs');
    if (check) {
        const actual = (await list(output)).filter(file => file !== 'public-manifest.json').sort();
        if (JSON.stringify(actual) !== JSON.stringify(Object.keys(files))) throw Error('Unexpected/missing public artifact files');
        for (const [file, expected] of Object.entries(files)) if (hash(await readFile(path.join(output, file))) !== expected) throw Error('Stale public file: ' + file);
        if (await readFile(path.join(output, 'public-manifest.json'), 'utf8') !== JSON.stringify(manifest, null, 2) + '\n') throw Error('Stale public manifest');
    } else {
        // Delete only this generator's known output, never an arbitrary directory.
        if (output !== path.join(path.resolve(directory), 'dist', 'docs')) throw Error('Invalid public output boundary');
        let existing;
        try { existing = JSON.parse(await readFile(path.join(output, 'public-manifest.json'), 'utf8')); }
        catch (error) { if (error.code !== 'ENOENT') throw error; }
        if (existing && existing.generator !== 'dt-public-docs-v1') throw Error('Output belongs to another generator');
        if (!existing) {
            try { if ((await readdir(output)).length) throw Error('Refusing to replace unowned output'); }
            catch (error) { if (error.code !== 'ENOENT') throw error; }
        }
        await rm(output, {recursive:true, force:true});
        for (const file of Object.keys(files)) {
            const target = path.join(output, file); await mkdir(path.dirname(target), {recursive:true});
            await writeFile(target, await readFile(path.join(directory, file)));
        }
        await writeFile(path.join(output, 'public-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
    }
    return {output, fileCount:Object.keys(files).length, inventoryDigest, runtimeRevision:graph.revision};
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) console.log(JSON.stringify(await buildPublicDocs(root, {check:process.argv.includes('--check')}), null, 2));
