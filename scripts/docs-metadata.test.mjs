import test from 'node:test';
import assert from 'node:assert/strict';
import {pageMetadata, applyPageMetadata, loadCoverMetadata} from './docs-metadata.mjs';
import {mkdtemp, mkdir, writeFile, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {createHash} from 'node:crypto';

const config = {baseUrl:'https://example.com/template/', siteName:'DocumentTemplate', title:'A & B', description:'Technical guides',
    image:{path:'assets/social/cover.png',width:1200,height:630,mimeType:'image/png',alt:'DocumentTemplate — technical guides'}};
test('canonical and cover URLs preserve a repository subpath', () => {
    assert.match(pageMetadata({...config,file:'index.html'}), /href="https:\/\/example.com\/template\/"/);
    const docs = pageMetadata({...config,file:'docs/reference.html'});
    assert.match(docs,/content="https:\/\/example.com\/template\/docs\/reference.html"/);
    assert.match(docs,/content="https:\/\/example.com\/template\/assets\/social\/cover.png"/);
    assert.match(docs,/A &amp; B/);
});
test('theme demo has its own canonical and stays out of indexing', () => {
    const html = pageMetadata({...config,file:'docs/theme-preview.html'});
    assert.match(html,/name="robots" content="noindex,follow"/);
    assert.match(html,/href="https:\/\/example.com\/template\/docs\/theme-preview.html"/);
    assert.doesNotMatch(pageMetadata({...config,file:'index.html'}),/noindex/);
});
test('rebuilding replaces managed metadata without duplication or content changes', () => {
    const html = '<html><head><title>Guide</title><meta name="description" content="Guide"><link rel="canonical" href="https://old.example/"><meta property="og:image" content="old.png"><link rel="icon" href="icon.svg"></head><body>Guide</body></html>';
    const once = applyPageMetadata(html,{...config,file:'index.html'});
    assert.equal(applyPageMetadata(once,{...config,file:'index.html'}),once);
    assert.equal((once.match(/rel="canonical"/g)||[]).length,1);
    assert.match(once,/<link rel="icon" href="icon.svg">/);
    assert.match(once,/<body>Guide<\/body>/);
});
test('unusable image metadata and escaping public paths are rejected', () => {
    for(const path of ['../private.png','/outside.png','https://other.example/a.png']) assert.throws(()=>pageMetadata({...config,file:'index.html',image:{...config.image,path}}));
    assert.throws(()=>pageMetadata({...config,file:'index.html',image:{...config.image,width:0}}));
});

test('consumer rejects altered export bytes and manifest dimension drift', async t => {
    const root = await mkdtemp(path.join(tmpdir(),'dt-cover-'));
    t.after(async()=>{assert.ok(path.resolve(root).startsWith(path.resolve(tmpdir())+path.sep));await rm(root,{recursive:true,force:true});});
    await mkdir(path.join(root,'docs'),{recursive:true});await mkdir(path.join(root,'assets'),{recursive:true});
    const png=Buffer.alloc(24);Buffer.from('89504e470d0a1a0a','hex').copy(png);png.writeUInt32BE(1200,16);png.writeUInt32BE(630,20);
    const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
    const output={logicalAssetId:'cover',sha256:hash(png),mediaType:'image/png',width:1200,height:630,product:{canonicalUrl:config.baseUrl},openGraph:{imageType:'image/png',width:1200,height:630}};
    async function setup(){const manifest=JSON.stringify({profile:'product-covers',outputs:[output]});await writeFile(path.join(root,'docs/export.json'),manifest);await writeFile(path.join(root,'docs/site-metadata.json'),JSON.stringify({baseUrl:config.baseUrl,siteName:config.siteName,manifestPath:'docs/export.json',manifestSha256:hash(manifest),outputId:'cover',imagePath:'assets/cover.png',imageAlt:config.image.alt}));}
    await writeFile(path.join(root,'assets/cover.png'),png);await setup();
    assert.equal((await loadCoverMetadata(root)).image.width,1200);
    await writeFile(path.join(root,'assets/cover.png'),Buffer.from('changed'));
    await assert.rejects(loadCoverMetadata(root),/image hash mismatch/);
    await writeFile(path.join(root,'assets/cover.png'),png);output.width=1199;await setup();
    await assert.rejects(loadCoverMetadata(root),/dimensions or MIME/);
});
