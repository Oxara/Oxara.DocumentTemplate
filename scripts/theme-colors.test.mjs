import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {checkThemeColors} from './theme-colors.mjs';
const source=await checkThemeColors();
const blocks=[...source.matchAll(/(?:^|\n)(:root, \[data-theme="light"\]|\[data-theme="dark"\]) \{([\s\S]*?)\n\}/g)];
const modes=Object.fromEntries(blocks.map((b,i)=>[i?'dark':'light',Object.fromEntries([...b[2].matchAll(/--([\w-]+):\s*([^;]+);/g)].map(x=>[x[1],x[2].trim()]))]));
function value(tokens,key){const raw=tokens[key];assert.ok(raw,'Missing token '+key);const m=/^var\(--([\w-]+)\)$/.exec(raw);return m?value(tokens,m[1]):raw;}
function rgb(raw,bg=[0,0,0]){if(/^#[\da-f]{3}$/i.test(raw))raw='#'+raw.slice(1).split('').map(x=>x+x).join('');if(/^#[\da-f]{6}$/i.test(raw))return raw.slice(1).match(/../g).map(x=>parseInt(x,16));const m=/^rgba\(([^)]+)\)$/.exec(raw);if(m){const [r,g,b,a]=m[1].split(',').map(Number);return [r,g,b].map((v,i)=>v*a+bg[i]*(1-a));}throw Error('Unsupported contrast color '+raw);}
const lum=a=>a.map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((n,v,i)=>n+v*[.2126,.7152,.0722][i],0);
const ratio=(a,b)=>(Math.max(lum(a),lum(b))+.05)/(Math.min(lum(a),lum(b))+.05);
for(const [mode,tokens]of Object.entries(modes))test(`${mode}: normal text, links, status and code remain readable`,()=>{
 const page=rgb(value(tokens,'bg'));
 const check=(fg,bg,min=4.5)=>{const back=rgb(value(tokens,bg),page),front=rgb(value(tokens,fg),back),r=ratio(front,back);assert.ok(r>=min,`${mode} ${fg}/${bg}: ${r.toFixed(2)} < ${min}`);};
 check('ui-primary-foreground','ui-primary');check('ui-primary-foreground','ui-primary-hover');
 for(const bg of ['bg','surface','surface-2'])for(const fg of ['text','text-muted','text-dim','ui-link','ui-link-hover'])check(fg,bg);
 for(const bg of ['code-bg','code-surface'])for(const fg of ['code-text','code-keyword','code-string','code-number','code-punctuation','code-tag','code-attr','code-comment'])check(fg,bg);
 for(const type of ['success','warning','error','info'])check(type,type+'-bg');
 check('success-foreground','success');
 for(const [fg,bg]of [['svg-text','svg-box'],['svg-muted','svg-box'],['svg-brand-s','svg-brand-bg'],['svg-ok-s','svg-ok-bg'],['svg-warn-s','svg-warn-bg'],['svg-err-s','svg-err-bg']])check(fg,bg);
 check('svg-line','svg-box',3);
 check('search-match-text','search-match-bg');check('search-match-text','search-match-active-bg');
 for(const bg of ['bg','surface','surface-2'])check('ui-focus',bg,3);
});
test('dark source has no coal surface fallback; both themes define hover roles',()=>{
 assert.equal(value(modes.dark,'bg'),'#0B1D29');assert.equal(value(modes.dark,'surface'),'#173344');
 for(const t of Object.values(modes))assert.equal(value(t,'surface-muted'),value(t,'surface-2'));
 for(const color of ['#0f1117','#161921','#1c2028','#0d1117','#111827'])assert.ok(!source.toLowerCase().includes(color),'Retired coal surface '+color);
});
test('feature catalogue keeps every registered component and shared theme dependency',async()=>{
 const features=JSON.parse(await readFile(new URL('../features/features.json',import.meta.url)));
 assert.equal(Object.keys(features).length,16);
 assert.ok(features['document-hero']);assert.ok(features['illustrated-card']);
 assert.deepEqual(features.base.css,['features/base/base.css']);
 const base=await readFile(new URL('../features/base/base.css',import.meta.url),'utf8');assert.ok(base.includes("@import url('./theme-colors.css')"));
});
