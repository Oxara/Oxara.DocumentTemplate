import {readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {parse} from 'parse5';
import {buildDocsRuntime} from './docs-runtime.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
const has=(n,c)=>(attr(n,'class')??'').split(/\s+/).includes(c);
function all(n,p,out=[]){if(p(n))out.push(n);for(const c of n.childNodes??[])all(c,p,out);return out;}
const text=n=>n.nodeName==='#text'?n.value:(n.childNodes??[]).map(text).join('');
export async function buildDocsNavigation({check=false}={}){
 const {pages}=JSON.parse(await readFile(path.join(root,'docs/pages.json'),'utf8'));
 if(new Set(pages.map(p=>p.file)).size!==pages.length)throw Error('Duplicate documentation route');
 for(const [index,page] of pages.entries()){
  const file=path.join(root,'docs',page.file),original=await readFile(file,'utf8');
  const tree=parse(original,{sourceCodeLocationInfo:true});
  const sidebar=all(tree,n=>n.tagName==='aside'&&has(n,'docs-sidebar'));
  const article=all(tree,n=>n.tagName==='article'&&has(n,'docs-article'));
  if(sidebar.length!==1||article.length!==1)throw Error('Expected one documentation shell: '+page.file);
  const edits=[];
  const groups=['Başlangıç','Feature’lar','Feature Paketleri','Referans'];
  const groupHtml=groups.map(group=>{
   const links=group==='Feature Paketleri'?'<a class="docs-nav-link" href="reference.html#hazir-paketler">Hazır Paketler</a>':pages.filter(p=>p.group===group).map(p=>`<a class="docs-nav-link${p.file===page.file?' active':''}" href="${p.file}"${p.file===page.file?' aria-current="page"':''}>${esc(p.label)}</a>`).join('\n');
   return `<div class="docs-nav-group"><div class="docs-nav-label">${esc(group)}</div>${links}${group==='Referans'?'<a class="docs-nav-link" href="https://github.com/Oxara/Oxara.DocumentTemplate">GitHub</a>':''}</div>`;
  }).join('\n');
  const side=`<aside class="docs-sidebar" id="docs-navigation" data-docs-sidebar><div class="docs-sidebar-inner">\n${groupHtml}\n</div></aside>`;
  edits.push([sidebar[0].sourceCodeLocation.startOffset,sidebar[0].sourceCodeLocation.endOffset,side]);
  const link=(p,previous)=>`<a class="docs-page-link docs-page-${previous?'previous':'next'}" href="${p.file}"><span>${previous?'Önceki':'Sonraki'}</span><strong>${esc(p.title)}</strong></a>`;
  const pagination=`<nav class="docs-pagination" aria-label="Sayfalar">${index?link(pages[index-1],true):'<span></span>'}${index<pages.length-1?link(pages[index+1],false):''}</nav>`;
  const oldPagination=all(article[0],n=>n.tagName==='nav'&&has(n,'docs-pagination'));
  if(oldPagination.length>1)throw Error('Duplicate pagination: '+page.file);
  if(oldPagination.length)edits.push([oldPagination[0].sourceCodeLocation.startOffset,oldPagination[0].sourceCodeLocation.endOffset,pagination]);
  else edits.push([article[0].sourceCodeLocation.endTag.startOffset,article[0].sourceCodeLocation.endTag.startOffset,pagination+'\n']);
  const existing=new Set(all(tree,n=>!!attr(n,'id')).map(n=>attr(n,'id')));
  for(const section of article[0].childNodes.filter(n=>n.tagName==='section'))for(const heading of section.childNodes.filter(n=>['h2','h3'].includes(n.tagName)&&!attr(n,'id'))){
   const base='h-'+text(heading).toLocaleLowerCase('tr').replaceAll('ı','i').replaceAll('ğ','g').replaceAll('ü','u').replaceAll('ş','s').replaceAll('ö','o').replaceAll('ç','c').replace(/[^a-z0-9]+/g,'-').replace(/-$/,'');
   let id=base,i=1;while(existing.has(id))id=base+'-'+(++i);existing.add(id);
   const at=heading.sourceCodeLocation.startTag.endOffset-1;edits.push([at,at,` id="${id}"`]);
  }
  const configScripts=all(tree,n=>n.tagName==='script'&&!attr(n,'src')&&!attr(n,'type')&&text(n).includes('window.SEARCH_CONFIG'));
  if(configScripts.length!==1)throw Error('Expected one executable search configuration: '+page.file);
  const configScript=configScripts[0],configText=original.slice(configScript.sourceCodeLocation.startTag.endOffset,configScript.sourceCodeLocation.endTag.startOffset);
  const pattern=/window\.SEARCH_CONFIG\s*=\s*.*?;+(?=\s*(?:window\.|$))/s;
  const match=pattern.exec(configText);if(!match)throw Error('Missing search configuration: '+page.file);
  const externalItems=pages.filter(p=>p.file!==page.file).map(p=>({title:p.title,text:p.description,keywords:p.title+' '+p.group,url:p.file,sectionType:'Sayfa'}));
  const configOffset=configScript.sourceCodeLocation.startTag.endOffset+match.index;
  edits.push([configOffset,configOffset+match[0].length,'window.SEARCH_CONFIG = '+JSON.stringify({contentSelector:'.docs-article',maxResults:30,externalItems})+';']);
  const description=/<meta name="description" content="[^"]*">/.exec(original);
  if(description)edits.push([description.index,description.index+description[0].length,`<meta name="description" content="${esc(page.description)}">`]);
  let next=original;for(const [start,end,value] of edits.sort((a,b)=>b[0]-a[0]))next=next.slice(0,start)+value+next.slice(end);
  if(check){if(next!==original)throw Error('Stale shared documentation navigation: '+page.file);}
  else await writeFile(file,next);
 }
 const runtime=await buildDocsRuntime(root,['index.html',...pages.map(p=>'docs/'+p.file),'docs/theme-preview.html'],{check});
 console.log(`${check?'Verified':'Generated'} shared sidebar/search/pagination for ${pages.length} documentation pages; runtime ${runtime.revision}.`);
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))await buildDocsNavigation({check:process.argv.includes('--check')});
