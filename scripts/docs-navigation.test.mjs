import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {parse} from 'parse5';
import {buildDocsNavigation} from './build-docs-navigation.mjs';
const root=new URL('../',import.meta.url);
const {pages}=JSON.parse(await readFile(new URL('docs/pages.json',root),'utf8'));
const attr=(n,k)=>n.attrs?.find(x=>x.name===k)?.value;
const cls=(n,c)=>(attr(n,'class')??'').split(/\s+/).includes(c);
function all(n,p,a=[]){if(p(n))a.push(n);for(const c of n.childNodes??[])all(c,p,a);return a;}
test('every published guide keeps the complete navigation and one current page, including without JS',async()=>{
 const registered=new Set(pages.map(p=>p.file));
 for(const file of await readdir(new URL('docs/',root))){
  if(!file.endsWith('.html'))continue;
  const html=await readFile(new URL('docs/'+file,root),'utf8'),tree=parse(html);
  const sidebar=all(tree,n=>n.tagName==='aside'&&cls(n,'docs-sidebar'));
  if(!sidebar.length)continue;
  assert.ok(registered.has(file),'unregistered guide: '+file);
  const links=all(sidebar[0],n=>n.tagName==='a');
  for(const target of pages)assert.equal(links.filter(n=>attr(n,'href')===target.file).length,1,file+' → '+target.file);
  const current=links.filter(n=>attr(n,'aria-current')==='page');
  assert.equal(current.length,1,file);assert.equal(attr(current[0],'href'),file);
 }
});
test('reading next/previous follows a complete reversible chain through Hero ve Kartlar',async()=>{
 for(const [index,page] of pages.entries()){
  const tree=parse(await readFile(new URL('docs/'+page.file,root),'utf8'));
  const previous=all(tree,n=>n.tagName==='a'&&cls(n,'docs-page-previous'));
  const next=all(tree,n=>n.tagName==='a'&&cls(n,'docs-page-next'));
  assert.equal(previous.length,index?1:0,page.file);
  assert.equal(next.length,index<pages.length-1?1:0,page.file);
  if(index)assert.equal(attr(previous[0],'href'),pages[index-1].file);
  if(next.length)assert.equal(attr(next[0],'href'),pages[index+1].file);
 }
});
test('search on each guide can reach every other guide and generated content has no drift',async()=>{
 for(const page of pages){
  const html=await readFile(new URL('docs/'+page.file,root),'utf8');
  const tree=parse(html);
  const scripts=all(tree,n=>n.tagName==='script'&&!attr(n,'src')&&!attr(n,'type'));
  const configs=scripts.map(n=>(n.childNodes??[]).map(c=>c.value??'').join('')).filter(s=>s.includes('window.SEARCH_CONFIG'));
  assert.equal(configs.length,1,page.file+' executable search config');
  const config=JSON.parse(/window\.SEARCH_CONFIG\s*=\s*(.*?);(?=\s*(?:window\.|$))/s.exec(configs[0])[1]);
  assert.deepEqual(new Set(config.externalItems.map(p=>p.url)),new Set(pages.filter(p=>p.file!==page.file).map(p=>p.file)));
  assert.ok(!config.externalItems.some(p=>p.title==='Görselli Sunum'));
  if(page.file==='configuration.html')assert.ok(html.includes("window.SEARCH_CONFIG = { contentSelector: '.container', maxResults: 50, debounceMs: 200 };"),'documented example must remain independent of executable site configuration');
 }
 await buildDocsNavigation({check:true});
});
