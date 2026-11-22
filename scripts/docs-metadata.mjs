import {parse} from 'parse5';
import {readFile, writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const attr = (node, name) => node.attrs?.find(item => item.name === name)?.value;
function nodes(node, result = []) { result.push(node); for (const child of node.childNodes || []) nodes(child, result); return result; }
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const managed = node => node.tagName === 'link' && attr(node, 'rel') === 'canonical'
    || node.tagName === 'meta' && (['robots', 'twitter:card', 'twitter:title', 'twitter:description', 'twitter:image', 'twitter:image:alt'].includes(attr(node, 'name'))
    || ['og:type', 'og:site_name', 'og:title', 'og:description', 'og:url', 'og:image', 'og:image:type', 'og:image:width', 'og:image:height', 'og:image:alt'].includes(attr(node, 'property')));

export function pageMetadata({baseUrl, file, title, description, siteName, image}) {
    const base = new URL(baseUrl);
    if (base.protocol !== 'https:' || !base.pathname.endsWith('/') || base.search || base.hash) throw Error('Metadata base must be an absolute HTTPS directory URL');
    if (!image || !image.path || /^(?:[a-z]+:|\/|#)/i.test(image.path) || image.path.split('/').includes('..')) throw Error('Expected a local public cover path');
    if (!Number.isInteger(image.width) || !Number.isInteger(image.height) || Math.min(image.width, image.height) < 1 || !/^image\/(?:png|jpeg|webp)$/.test(image.mimeType) || !image.alt) throw Error('Incomplete cover metadata');
    const canonical = new URL(file === 'index.html' ? './' : file, base).href;
    const cover = new URL(image.path, base).href;
    const meta = (key, value, property = false) => `<meta ${property ? 'property' : 'name'}="${key}" content="${escape(value)}">`;
    return [`<link rel="canonical" href="${escape(canonical)}">`,
        ...(file === 'docs/theme-preview.html' ? [meta('robots', 'noindex,follow')] : []),
        ...Object.entries({'og:type':'website', 'og:site_name':siteName, 'og:title':title, 'og:description':description, 'og:url':canonical, 'og:image':cover,
            'og:image:type':image.mimeType, 'og:image:width':image.width, 'og:image:height':image.height, 'og:image:alt':image.alt}).map(([key,value]) => meta(key,value,true)),
        ...Object.entries({'twitter:card':'summary_large_image', 'twitter:title':title, 'twitter:description':description, 'twitter:image':cover, 'twitter:image:alt':image.alt}).map(([key,value]) => meta(key,value))].join('\n');
}

export function applyPageMetadata(html, config) {
    const tree = parse(html, {sourceCodeLocationInfo:true});
    const edits = nodes(tree).filter(managed).map(node => [node.sourceCodeLocation.startOffset, node.sourceCodeLocation.endOffset]);
    for (const [start,end] of edits.sort((a,b) => b[0]-a[0])) html = html.slice(0,start) + html.slice(end);
    // Keep the block adjacent to the existing description; all page content remains owned by its source.
    const description = /<meta name="description" content="[^"]*">/.exec(html);
    if (!description) throw Error('Expected one page description before metadata');
    const at = description.index + description[0].length;
    // Removing generated tags leaves whitespace; consume only that gap to make repeated builds stable.
    const rest = html.slice(at).replace(/^\s*/, '\n');
    return html.slice(0,at) + '\n' + pageMetadata(config) + rest;
}

const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
function publicPath(value) {
    if (typeof value !== 'string' || !/^(?:assets|docs)\/[a-zA-Z0-9._/-]+$/.test(value) || value.split('/').some(part => part === '..' || part === '.')) throw Error('Invalid public metadata dependency path');
    return value;
}

export async function loadCoverMetadata(directory) {
    const configPath = 'docs/site-metadata.json';
    const config = JSON.parse(await readFile(path.join(directory, configPath), 'utf8'));
    const manifestPath = publicPath(config.manifestPath);
    const manifestBytes = await readFile(path.join(directory, manifestPath));
    if (sha256(manifestBytes) !== config.manifestSha256) throw Error('Brand cover manifest hash mismatch');
    const manifest = JSON.parse(manifestBytes);
    if (manifest.profile !== 'product-covers') throw Error('Expected the canonical Brand product-covers profile');
    const matches = manifest.outputs.filter(output => output.logicalAssetId === config.outputId);
    if (matches.length !== 1) throw Error('Expected one Brand cover output');
    const output = matches[0];
    if (output.product?.canonicalUrl !== config.baseUrl || !output.openGraph) throw Error('Brand cover belongs to a different product URL');
    const imagePath = publicPath(config.imagePath);
    const imageBytes = await readFile(path.join(directory, imagePath));
    if (sha256(imageBytes) !== output.sha256) throw Error('Brand cover image hash mismatch');
    // This consumer uses the canonical PNG export; no local rasterization or transformation.
    if (output.mediaType !== 'image/png' || imageBytes.length < 24 || imageBytes.subarray(0,8).toString('hex') !== '89504e470d0a1a0a'
        || imageBytes.readUInt32BE(16) !== output.width || imageBytes.readUInt32BE(20) !== output.height
        || output.openGraph.imageType !== output.mediaType || output.openGraph.width !== output.width || output.openGraph.height !== output.height) throw Error('Cover dimensions or MIME differ from the Brand export');
    const image = {path:imagePath, sha256:output.sha256, width:output.width, height:output.height, mimeType:output.mediaType, alt:config.imageAlt};
    pageMetadata({...config, image, file:'index.html', title:config.siteName, description:config.imageAlt});
    return {...config, image, publicFiles:[configPath, manifestPath, imagePath]};
}

export async function buildDocsMetadata(directory, {check = false} = {}) {
    const config = await loadCoverMetadata(directory);
    const {pages} = JSON.parse(await readFile(path.join(directory, 'docs/pages.json'), 'utf8'));
    const files = ['index.html', ...pages.map(page => 'docs/' + page.file), 'docs/theme-preview.html'];
    for (const file of files) {
        const filename = path.join(directory,file), html = await readFile(filename,'utf8');
        const tree = parse(html);
        const titles = nodes(tree).filter(node => node.tagName === 'title');
        const descriptions = nodes(tree).filter(node => node.tagName === 'meta' && attr(node,'name') === 'description');
        if (titles.length !== 1 || descriptions.length !== 1) throw Error('Expected one page title/description: ' + file);
        const title = titles[0].childNodes.map(node => node.value || '').join('');
        const next = applyPageMetadata(html,{...config, file, title, description:attr(descriptions[0],'content')});
        if (check && next !== html) throw Error('Stale or duplicate page metadata: ' + file);
        if (!check && next !== html) await writeFile(filename,next);
    }
    return {pages:files.length, publicFiles:config.publicFiles, imageSha256:config.image.sha256};
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    const rootAt = process.argv.indexOf('--root');
    const root = rootAt < 0 ? fileURLToPath(new URL('../',import.meta.url)) : path.resolve(process.argv[rootAt+1]);
    console.log(JSON.stringify(await buildDocsMetadata(root,{check:process.argv.includes('--check')}),null,2));
}
