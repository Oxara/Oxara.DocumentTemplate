import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {audit,quality,finalize,writeJson,sha} from './lib.mjs';

async function fixture(t){
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'document-release-test-'));
 t.after(async()=>{if(!root.startsWith(path.join(os.tmpdir(),'document-release-test-')))throw Error('Unsafe cleanup');await fs.rm(root,{recursive:true,force:true});});
 const artifact=path.join(root,'public');await fs.mkdir(artifact);
 const html=`<!doctype html><html lang="en"><head><meta name="viewport" content="width=device-width"><title>Actual page</title><link rel="canonical" href="https://example.test/"><meta property="og:url" content="https://example.test/"><script type="application/ld+json">{"@type":"Person","name":"Example"}</script></head><body><h1>Actual page</h1><a href="/">Home</a></body></html>`;
 await fs.writeFile(path.join(artifact,'index.html'),html);
 await fs.writeFile(path.join(artifact,'robots.txt'),'User-agent: *\nAllow: /\nSitemap: https://example.test/sitemap.xml\n');
 await fs.writeFile(path.join(artifact,'sitemap.xml'),'<urlset><url><loc>https://example.test/</loc></url></urlset>');
 await fs.writeFile(path.join(artifact,'_redirects'),'/old/ / 301\n');
 return{root,artifact,html,config:{projectRoot:'.',artifact:'public',reports:'reports',origin:'https://example.test',requiredFiles:['index.html','robots.txt','sitemap.xml'],requiredRoutes:['/'],commands:[]}};
}
test('complete unchanged candidate finalizes only for owner approval',async t=>{const f=await fixture(t),a=await audit(f.config,f.root),q=await quality(f.config,f.root,a),r=await finalize(f.config,f.root,a,q);assert.equal(a.status,'passed');assert.equal(q.status,'passed');assert.equal(r.status,'ready-for-owner-approval');assert.equal(r.published,false);assert.equal(r.requiresOwnerApproval,true);});
test('broken local destination is rejected',async t=>{const f=await fixture(t);await fs.writeFile(path.join(f.artifact,'index.html'),f.html.replace('href="/"','href="/missing/"'));const a=await audit(f.config,f.root);assert.ok(a.issues.some(i=>i.rule==='missing-local-link'));});

test('Cloudflare mode audits final extensionless URLs while file mode stays strict',async t=>{
 const f=await fixture(t);
 await fs.writeFile(path.join(f.artifact,'note.html'),f.html.replaceAll('https://example.test/','https://example.test/note'));
 await fs.appendFile(path.join(f.artifact,'sitemap.xml'),'<url><loc>https://example.test/note</loc></url>');
 const before=await audit(f.config,f.root);
 assert.ok(before.issues.some(i=>i.rule==='canonical-address'));
 const hosted=await audit({...f.config,routingMode:'cloudflare-pages'},f.root);
 assert.equal(hosted.status,'passed',JSON.stringify(hosted.issues));
 await fs.writeFile(path.join(f.artifact,'note.html'),f.html.replaceAll('https://example.test/','https://example.test/note.html'));
 const redirected=await audit({...f.config,routingMode:'cloudflare-pages'},f.root);
 assert.ok(redirected.issues.some(i=>i.rule==='canonical-address'));
});
test('redirect cycle and active legacy link are rejected',async t=>{const f=await fixture(t);await fs.writeFile(path.join(f.artifact,'_redirects'),'/old/ /older/ 301\n/older/ /old/ 301');await fs.writeFile(path.join(f.artifact,'index.html'),f.html.replace('href="/"','href="/old/"'));const a=await audit(f.config,f.root);assert.ok(a.issues.some(i=>i.rule==='redirect-chain'));assert.ok(a.issues.some(i=>i.rule==='legacy-link'));});
test('noindex page cannot appear in sitemap',async t=>{const f=await fixture(t);await fs.writeFile(path.join(f.artifact,'index.html'),f.html.replace('<title>','<meta name="robots" content="noindex"><title>'));const a=await audit(f.config,f.root);assert.ok(a.issues.some(i=>i.rule==='noncanonical-url'));});
test('invalid structured data, robots block and CSS missing assets are rejected',async t=>{const f=await fixture(t);await fs.writeFile(path.join(f.artifact,'index.html'),f.html.replace('{"@type":"Person","name":"Example"}','{broken}'));await fs.writeFile(path.join(f.artifact,'robots.txt'),'User-agent: *\nDisallow: /');await fs.writeFile(path.join(f.artifact,'site.css'),'body{background:url("/lost.png")}');const a=await audit(f.config,f.root);for(const rule of ['json-ld','index-block','missing-css-asset'])assert.ok(a.issues.some(i=>i.rule===rule),rule);});
test('private production paths are rejected',async t=>{const f=await fixture(t);await fs.mkdir(path.join(f.artifact,'work'));await fs.writeFile(path.join(f.artifact,'work','source.txt'),'private source');const a=await audit(f.config,f.root);assert.ok(a.issues.some(i=>i.rule==='public-boundary'));});
test('artifact changes after audit or quality invalidate finalization',async t=>{const f=await fixture(t),a=await audit(f.config,f.root),q=await quality(f.config,f.root,a);await fs.appendFile(path.join(f.artifact,'index.html'),'<!-- modified -->');const r=await finalize(f.config,f.root,a,q);assert.equal(r.status,'failed');assert.ok(r.issues.some(i=>i.rule==='stale-artifact'));});
test('config mutation and substituted audit reports are rejected',async t=>{const f=await fixture(t),a=await audit(f.config,f.root),q=await quality(f.config,f.root,a);const r=await finalize({...f.config,requiredRoutes:['/different/']},f.root,{...a,counts:{}},q);assert.equal(r.status,'failed');for(const rule of ['stale-config','audit-report-mismatch'])assert.ok(r.issues.some(i=>i.rule===rule));});
test('failed command and protected content drift block quality',async t=>{const f=await fixture(t);await fs.writeFile(path.join(f.root,'protected.txt'),'approved');await writeJson(path.join(f.root,'protected.json'),[{file:'protected.txt',sha256:sha('approved')}]);f.config.protectedFiles='protected.json';f.config.commands=[{name:'real-failure',args:['-e','process.exit(7)']}];const a=await audit(f.config,f.root);await fs.writeFile(path.join(f.root,'protected.txt'),'changed');const q=await quality(f.config,f.root,a);for(const rule of ['command-failed','protected-document-changed'])assert.ok(q.issues.some(i=>i.rule===rule));});
test('browser evidence must match artifact and include every required case/screenshots',async t=>{const f=await fixture(t);f.config.runtimeEvidence='browser.json';f.config.requiredRuntimeCases=['keyboard'];const a=await audit(f.config,f.root);await writeJson(path.join(f.root,'browser.json'),{artifactDigest:a.artifactDigest,cases:[],screenshots:[],errors:[]});const q=await quality(f.config,f.root,a);assert.ok(q.issues.some(i=>i.rule==='browser-case-required'));assert.ok(q.issues.some(i=>i.rule==='screenshots-required'));await writeJson(path.join(f.root,'browser.json'),{artifactDigest:'stale',cases:[{id:'keyboard',passed:true}],screenshots:['missing.jpg'],errors:[]});const stale=await quality(f.config,f.root,a);assert.ok(stale.issues.some(i=>i.rule==='fresh-browser-evidence-required'));});
