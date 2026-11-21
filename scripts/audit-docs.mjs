import {readFile,writeFile,stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {parse} from 'parse5';
const rootFlag=process.argv.indexOf('--root');
const root=rootFlag>=0?path.resolve(process.argv[rootFlag+1]):path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const pages=['index.html',...JSON.parse(await readFile(path.join(root,'docs/pages.json'),'utf8')).pages.map(p=>'docs/'+p.file),'docs/theme-preview.html'];
const attr=(n,k)=>n.attrs?.find(x=>x.name===k)?.value;
function all(n,p,a=[]){if(p(n))a.push(n);for(const c of n.childNodes??[])all(c,p,a);return a;}
const trees=new Map(),errors=[],checkedCss=new Set();let links=0,assets=0,aria=0;
async function tree(file){if(!trees.has(file))trees.set(file,parse(await readFile(file,'utf8')));return trees.get(file);}
async function local(owner,value,kind){
 if(!value||/^(?:[a-z]+:|\/\/)/i.test(value))return;
 const url=new URL(value,'https://local.invalid/'+path.relative(root,owner).replaceAll(path.sep,'/'));
 const file=path.join(root,decodeURIComponent(url.pathname));
 try{if(!(await stat(file)).isFile())throw Error('not a file');}catch{errors.push({owner:path.relative(root,owner),kind,value,error:'missing local file'});return;}
 if(kind==='link')links++;else assets++;
 if(url.hash&&file.endsWith('.html')){
  const ids=all(await tree(file),n=>attr(n,'id')).map(n=>attr(n,'id'));
  if(!ids.includes(decodeURIComponent(url.hash.slice(1))))errors.push({owner:path.relative(root,owner),kind,value,error:'missing anchor'});
 }
 if(file.endsWith('.css'))await css(file);
}
async function css(file){
 if(checkedCss.has(file))return;checkedCss.add(file);
 const source=await readFile(file,'utf8');
 for(const m of source.matchAll(/url\(\s*(["']?)(.*?)\1\s*\)/g))await local(file,m[2],'css-asset');
 for(const m of source.matchAll(/@import\s+(["'])(.*?)\1/g))await local(file,m[2],'css-asset');
}
for(const relative of pages){
 const file=path.join(root,relative),doc=await tree(file);
 const ids=all(doc,n=>attr(n,'id')).map(n=>attr(n,'id'));
 for(const id of new Set(ids))if(ids.filter(i=>i===id).length>1)errors.push({owner:relative,error:'duplicate id',id});
 if(all(doc,n=>n.tagName==='h1').length!==1)errors.push({owner:relative,error:'expected one h1'});
 if(!attr(doc.childNodes.find(n=>n.tagName==='html'),'lang'))errors.push({owner:relative,error:'missing document language'});
 if(all(doc,n=>n.tagName==='title'&&(n.childNodes??[]).some(c=>c.value?.trim())).length!==1)errors.push({owner:relative,error:'missing unique title'});
 for(const name of ['description','viewport'])if(all(doc,n=>n.tagName==='meta'&&attr(n,'name')===name&&attr(n,'content')).length!==1)errors.push({owner:relative,error:'missing unique metadata',name});
 for(const n of all(doc,n=>n.tagName==='a'&&attr(n,'href')))await local(file,attr(n,'href'),'link');
 for(const n of all(doc,n=>['img','script','link','source'].includes(n.tagName))){
  const src=attr(n,'src')||(n.tagName==='link'?attr(n,'href'):null);
  if(src)await local(file,src,'asset');
  if(n.tagName==='img'&&attr(n,'alt')===undefined)errors.push({owner:relative,error:'image without alt',src});
 }
 for(const n of all(doc,n=>attr(n,'aria-labelledby')||attr(n,'aria-controls'))){
  for(const token of [attr(n,'aria-labelledby'),attr(n,'aria-controls')].filter(Boolean).join(' ').split(/\s+/)){
   aria++;if(!ids.includes(token))errors.push({owner:relative,error:'missing ARIA target',token});
  }
 }
}
const registry=JSON.parse(await readFile(path.join(root,'features/features.json'),'utf8'));
for(const [id,feature] of Object.entries(registry)){
 for(const dep of feature.requires??[])if(!registry[dep])errors.push({owner:id,error:'missing feature dependency',dep});
 for(const relative of [...feature.css,...feature.js,...(feature.assets??[])])try{await stat(path.join(root,relative));}catch{errors.push({owner:id,error:'missing feature file',relative});}
}
const report={status:errors.length?'fail':'pass',htmlPages:pages.length,localLinks:links,localAssets:assets,cssFiles:checkedCss.size,ariaReferences:aria,features:Object.keys(registry).length,errors};
const out=process.argv.indexOf('--report');if(out>=0)await writeFile(process.argv[out+1],JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));if(errors.length)process.exitCode=1;
