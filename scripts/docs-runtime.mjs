import {readFile, writeFile, mkdir} from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {parse} from 'parse5';
import {core, full} from './behavior-packages.mjs';

const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const slash = value => value.split(path.sep).join('/');
const attr = (node, name) => node.attrs?.find(a => a.name === name)?.value;
function nodes(node, result = []) { result.push(node); for (const child of node.childNodes || []) nodes(child, result); return result; }
function canonical(root, owner, value) {
    if (!value || /^(?:[a-z]+:|\/\/|#)/i.test(value)) return null;
    let relative = slash(path.relative(root, path.resolve(root, path.dirname(owner), value.split(/[?#]/)[0])));
    relative = relative.replace(/^assets\/docs-runtime\/[a-f0-9]+\//, '');
    if (relative.startsWith('../') || path.isAbsolute(relative)) throw Error('Runtime asset outside repository: ' + value);
    return relative;
}

// A mirrored immutable graph preserves existing CSS imports and classic loader
// paths without maintaining a second implementation or changing consumer APIs.
export async function buildDocsRuntime(root, htmlFiles, {check = false} = {}) {
    const html = new Map(), graph = new Map(), references = new Map();
    async function visit(relative) {
        if (graph.has(relative)) return;
        const bytes = await readFile(path.join(root, relative)); graph.set(relative, bytes);
        if (relative.endsWith('.css')) {
            const source = bytes.toString('utf8');
            for (const match of source.matchAll(/url\(\s*["']?([^\s"')]+)["']?\s*\)|@import\s+["']([^"']+)["']/g)) {
                const dependency = canonical(root, relative, match[1] || match[2]);
                if (dependency) await visit(dependency);
            }
        }
        const scripts = relative === 'feature-packages/core.js' ? core : relative === 'feature-packages/full.js' ? full : [];
        for (const script of scripts) await visit('features/' + script);
    }
    for (const file of htmlFiles) {
        const source = await readFile(path.join(root, file), 'utf8'); html.set(file, source);
        const refs = [];
        for (const node of nodes(parse(source, {sourceCodeLocationInfo:true}))) {
            const key = node.tagName === 'script' ? 'src' : node.tagName === 'link' && attr(node, 'rel') === 'stylesheet' ? 'href' : null;
            if (!key || !attr(node, key)) continue;
            const relative = canonical(root, file, attr(node, key));
            if (!relative) continue;
            await visit(relative);
            refs.push({relative, key, location:node.sourceCodeLocation.attrs[key]});
        }
        references.set(file, refs);
    }
    const files = Object.fromEntries([...graph].sort(([a], [b]) => a.localeCompare(b, 'en')).map(([file, bytes]) => [file, hash(bytes)]));
    const revision = hash(JSON.stringify(files));
    const output = 'assets/docs-runtime/' + revision;
    for (const [file, bytes] of graph) {
        const target = path.join(root, output, file);
        if (check) {
            if (hash(await readFile(target)) !== files[file]) throw Error('Stale docs runtime: ' + file);
        } else {
            await mkdir(path.dirname(target), {recursive:true}); await writeFile(target, bytes);
        }
    }
    for (const [file, source] of html) {
        let next = source;
        for (const {relative, key, location} of references.get(file).sort((a, b) => b.location.startOffset - a.location.startOffset)) {
            const value = slash(path.relative(path.dirname(file), output + '/' + relative));
            next = next.slice(0, location.startOffset) + `${key}="${value}"` + next.slice(location.endOffset);
        }
        if (check) { if (next !== source) throw Error('Stale docs runtime references: ' + file); }
        else await writeFile(path.join(root, file), next);
    }
    return {revision, files, htmlFiles};
}
