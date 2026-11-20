import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {parse} from 'parse5';
import {publicPagePath} from '../../scripts/public-route-addresses.mjs';

export const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
export async function readJson(file){return JSON.parse(await fs.readFile(file,'utf8'));}
export async function writeJson(file,value){await fs.mkdir(path.dirname(file),{recursive:true});await fs.writeFile(file,JSON.stringify(value,null,2)+'\n');}
export async function inventory(root){
 const rows=[];
 async function walk(dir){for(const entry of await fs.readdir(dir,{withFileTypes:true})){
  const file=path.join(dir,entry.name),relative=path.relative(root,file).replaceAll('\\','/');
  if(entry.isSymbolicLink())throw Error(`Symlink in public artifact: ${relative}`);
  if(entry.isDirectory())await walk(file);
  else{const bytes=await fs.readFile(file);rows.push({file:relative,size:bytes.length,sha256:sha(bytes)});}
 }}
 await walk(root);return rows.sort((a,b)=>a.file.localeCompare(b.file,'en'));
}
export const digest=rows=>sha(JSON.stringify(rows));
export function elements(html){
 const result=[];const walk=node=>{if(node.tagName)result.push({tag:node.tagName,attrs:Object.fromEntries((node.attrs||[]).map(a=>[a.name,a.value])),node});for(const child of node.childNodes||[])walk(child);};
 walk(parse(html));return result;
}
const nodeText=node=>(node.childNodes||[]).map(n=>n.nodeName==='#text'?n.value:nodeText(n)).join('');
export function inside(root,file){return file===root||file.startsWith(root+path.sep);}
export async function targetFile(root,pathname,mode='files'){
 let decoded;try{decoded=decodeURIComponent(pathname);}catch{return null;}
 const file=path.resolve(root,'.'+decoded);if(!inside(root,file))return null;
 const stat=await fs.stat(file).catch(()=>null);if(!stat){if(mode==='cloudflare-pages'&&!pathname.endsWith('/'))return await fs.stat(file+'.html').then(s=>s.isFile()?file+'.html':null,()=>null);return null;}
 const candidate=stat.isDirectory()?path.join(file,'index.html'):file;
 return await fs.stat(candidate).then(s=>s.isFile()?candidate:null,()=>null);
}

export async function audit(config,root){
 const artifact=path.resolve(root,config.artifact),rows=await inventory(artifact),issues=[],warnings=[];
 const fail=(file,rule,detail)=>issues.push({file,rule,detail});
 const origin=new URL(config.origin).origin,indexed=new Map(),redirects=new Map();
 const resolveTarget=pathname=>targetFile(artifact,pathname,config.routingMode);
 const forbidden=config.forbiddenPublicSegments||['work','.planning','.git','node_modules'];
 for(const row of rows)if(row.file.split('/').some(p=>forbidden.includes(p)))fail(row.file,'public-boundary','Private/dependency path in public artifact');
 for(const required of config.requiredFiles||[])if(!rows.some(r=>r.file===required))fail(required,'required-file','Missing from public artifact');
 const redirectSource=await fs.readFile(path.join(artifact,'_redirects'),'utf8').catch(()=>'');
 for(const line of redirectSource.split(/\r?\n/).filter(l=>l.trim()&&!l.startsWith('#'))){const [from,to,status,...extra]=line.trim().split(/\s+/);if(!from||!to||!/^30[1278]$/.test(status)||extra.length)fail('_redirects','redirect-syntax',line);else if(redirects.has(from))fail('_redirects','duplicate-redirect',from);else redirects.set(from,{to,status:Number(status)});}
 for(const [from,{to}]of redirects){if(from.includes('*')){fail('_redirects','unsupported-rule','Use explicit redirects for auditable page migrations');continue;}if(redirects.has(to))fail('_redirects','redirect-chain',`${from} -> ${to}`);const destination=new URL(to,origin);if(destination.origin===origin&&!await resolveTarget(destination.pathname))fail('_redirects','missing-target',to);}
 let htmlCount=0,jsonLdCount=0,linkCount=0;
 for(const row of rows.filter(r=>r.file.endsWith('.html'))){
  htmlCount++;const html=await fs.readFile(path.join(artifact,row.file),'utf8'),nodes=elements(html);
  const page=new URL(publicPagePath('/'+row.file.replace(/index\.html$/,''),config.routingMode),origin);
  const metas=nodes.filter(n=>n.tag==='meta'),noindex=metas.some(n=>n.attrs.name==='robots'&&/noindex/i.test(n.attrs.content||''));
  const canonicals=nodes.filter(n=>n.tag==='link'&&n.attrs.rel==='canonical');
  if(row.file!=='404.html'){
   if(canonicals.length!==1)fail(row.file,'canonical-count',canonicals.length);
   else{const canonical=canonicals[0].attrs.href;if(!/^https:\/\//.test(canonical||''))fail(row.file,'canonical-absolute',canonical);else if(!noindex&&canonical!==page.href)fail(row.file,'canonical-address',canonical);}
   if(!noindex){indexed.set(page.href,row.file);const og=metas.filter(n=>n.attrs.property==='og:url');if(og.length!==1||og[0].attrs.content!==page.href)fail(row.file,'og-url','Must match canonical');}
  }
  if(!nodes.some(n=>n.tag==='title'&&nodeText(n.node).trim()))fail(row.file,'page-title','Missing title');
  if(!metas.some(n=>n.attrs.name==='viewport'))fail(row.file,'viewport','Missing responsive viewport');
  for(const script of nodes.filter(n=>n.tag==='script'&&n.attrs.type==='application/ld+json')){jsonLdCount++;try{JSON.parse(nodeText(script.node));}catch{fail(row.file,'json-ld','Invalid JSON');}}
  for(const node of nodes){
   const candidates=[];if(node.attrs.href)candidates.push(node.attrs.href);if(node.attrs.src)candidates.push(node.attrs.src);if(node.attrs.poster)candidates.push(node.attrs.poster);
   if(node.tag==='meta'&&/^(?:og:image|twitter:image)$/.test(node.attrs.property||node.attrs.name||'')){
    const raw=node.attrs.content;if(!/^https:\/\//.test(raw||''))fail(row.file,'social-image-absolute',raw);else candidates.push(raw);
   }
   for(const raw of candidates){if(/^(?:#|data:|mailto:|tel:)/i.test(raw))continue;let url;try{url=new URL(raw,page);}catch{fail(row.file,'invalid-url',raw);continue;}
    if(url.origin!==origin)continue;linkCount++;
    if(!noindex&&redirects.has(url.pathname))fail(row.file,'legacy-link',raw);
    if(!await resolveTarget(url.pathname))fail(row.file,'missing-local-link',raw);
   }
  }
  for(const phrase of config.forbiddenPublicText||[])if(html.includes(phrase))fail(row.file,'private-source-reference','Disallowed local production reference');
 }
 for(const row of rows.filter(r=>r.file.endsWith('.css'))){
  const css=await fs.readFile(path.join(artifact,row.file),'utf8'),base=new URL('/'+row.file,origin);
  for(const match of css.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)){const raw=match[1].trim();if(/^(data:|#)/i.test(raw)||raw.includes('var('))continue;let url;try{url=new URL(raw,base);}catch{continue;}if(url.origin===origin&&!await resolveTarget(url.pathname))fail(row.file,'missing-css-asset',raw);}
 }
 for(const row of rows.filter(r=>/\.(?:mjs|js)$/.test(r.file))){
  const result=spawnSync(process.execPath,['--check',path.join(artifact,row.file)],{encoding:'utf8',timeout:15000});
  if(result.status!==0)fail(row.file,'javascript-syntax',result.stderr);
 }
 const robots=await fs.readFile(path.join(artifact,'robots.txt'),'utf8').catch(()=>'');
 if(/^Disallow:\s*\/\s*$/im.test(robots))fail('robots.txt','index-block','Site-wide disallow');
 if(!robots.includes(`Sitemap: ${origin}/sitemap.xml`))fail('robots.txt','sitemap-declaration','Missing canonical sitemap');
 const sitemap=await fs.readFile(path.join(artifact,'sitemap.xml'),'utf8').catch(()=>'');
 const urls=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]),unique=new Set(urls);
 if(unique.size!==urls.length)fail('sitemap.xml','duplicate-url','Repeated URL');
 for(const url of urls)if(!indexed.has(url))fail('sitemap.xml','noncanonical-url',url);
 for(const url of indexed.keys())if(!unique.has(url))fail('sitemap.xml','missing-indexable-url',url);
 for(const route of config.requiredRoutes||[])if(!indexed.has(origin+route))fail('sitemap.xml','required-route',route);
 return {schemaVersion:1,tool:'document-template-release-checks',stage:'audit',status:issues.length?'failed':'passed',configSha256:sha(JSON.stringify(config)),artifactDigest:digest(rows),counts:{files:rows.length,html:htmlCount,indexable:indexed.size,jsonLd:jsonLdCount,localLinks:linkCount},issues,warnings,files:rows};
}

export async function quality(config,root,auditReport){
 const issues=[],commands=[];
 if(auditReport.status!=='passed')issues.push({rule:'audit-required'});
 const now=await inventory(path.resolve(root,config.artifact));
 if(digest(now)!==auditReport.artifactDigest)issues.push({rule:'stale-artifact'});
 if(sha(JSON.stringify(config))!==auditReport.configSha256)issues.push({rule:'stale-config'});
 for(const item of config.commands||[]){
  const cwd=path.resolve(root,item.cwd||'.');
  const result=spawnSync(process.execPath,item.args,{cwd,encoding:'utf8',timeout:item.timeoutMs||120000,maxBuffer:16*1024*1024,env:{...process.env,...Object.fromEntries(Object.entries(item.env||{}).map(([k,v])=>[k,path.resolve(root,v)]))}});
  commands.push({name:item.name,status:result.status===0?'passed':'failed',exitCode:result.status,stdout:result.stdout||'',stderr:result.stderr||'',error:result.error?.message});
  if(result.status!==0)issues.push({rule:'command-failed',name:item.name});
 }
 if(config.protectedFiles){for(const entry of await readJson(path.resolve(root,config.protectedFiles))){const bytes=await fs.readFile(path.resolve(root,entry.file)).catch(()=>null);if(!bytes||sha(bytes)!==entry.sha256)issues.push({rule:'protected-document-changed',file:entry.file});}}
 let browser;
 if(config.runtimeEvidence){
  browser=await readJson(path.resolve(root,config.runtimeEvidence)).catch(()=>null);
  if(!browser||browser.artifactDigest!==auditReport.artifactDigest)issues.push({rule:'fresh-browser-evidence-required'});
  else{
   for(const id of config.requiredRuntimeCases||[]){const item=browser.cases?.find(c=>c.id===id);if(!item||item.passed!==true)issues.push({rule:'browser-case-required',id});}
   for(const screenshot of browser.screenshots||[])if(!await fs.stat(path.resolve(root,screenshot)).then(s=>s.size>1000,()=>false))issues.push({rule:'missing-screenshot',file:screenshot});
   if(!browser.screenshots?.length)issues.push({rule:'screenshots-required'});
   if(browser.errors?.length)issues.push({rule:'browser-errors',count:browser.errors.length});
  }
 }
 // A command is not allowed to silently change the artifact it was validating.
 if(digest(await inventory(path.resolve(root,config.artifact)))!==auditReport.artifactDigest)issues.push({rule:'command-mutated-artifact'});
 return {schemaVersion:1,tool:'document-template-release-checks',stage:'quality',status:issues.length?'failed':'passed',artifactDigest:auditReport.artifactDigest,configSha256:auditReport.configSha256,auditSha256:sha(JSON.stringify(auditReport)),commands,browser,issues};
}

export async function finalize(config,root,auditReport,qualityReport){
 const rows=await inventory(path.resolve(root,config.artifact)),issues=[];
 if(auditReport.status!=='passed'||qualityReport.status!=='passed')issues.push({rule:'gates-required'});
 if(qualityReport.artifactDigest!==auditReport.artifactDigest||digest(rows)!==auditReport.artifactDigest)issues.push({rule:'stale-artifact'});
 if(sha(JSON.stringify(config))!==auditReport.configSha256||qualityReport.configSha256!==auditReport.configSha256)issues.push({rule:'stale-config'});
 if(qualityReport.auditSha256!==sha(JSON.stringify(auditReport)))issues.push({rule:'audit-report-mismatch'});
 return {schemaVersion:1,tool:'document-template-release-checks',stage:'finalize',status:issues.length?'failed':'ready-for-owner-approval',requiresOwnerApproval:true,published:false,artifactDigest:digest(rows),auditSha256:sha(JSON.stringify(auditReport)),qualitySha256:sha(JSON.stringify(qualityReport)),issues,files:rows};
}
