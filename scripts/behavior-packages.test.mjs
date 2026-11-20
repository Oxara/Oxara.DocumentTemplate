import test from 'node:test';
import assert from 'node:assert/strict';
import {runInNewContext} from 'node:vm';
import {core,full,loadBehaviorPackage} from './behavior-packages.mjs';
function page(buttons=[]){
 const scripts=[],warnings=[];
 const document={readyState:'complete',querySelectorAll:()=>buttons,currentScript:{src:'https://example.test/feature-packages/core.js'},scripts,createElement:()=>({}),head:{appendChild(node){scripts.push(node);}}};
 const context={document,window:{location:{href:'https://example.test/docs/'},console:{warn:message=>warnings.push(message)}},URL,Map,Promise};
 const load=(name,files)=>runInNewContext(`(${loadBehaviorPackage.toString()})(${JSON.stringify(name)},${JSON.stringify(files)})`,context);
 return {scripts,warnings,context,load};
}
test('full starts every download before any completes, preserving ordered evaluation',async()=>{
 const p=page();p.load('full',full);
 assert.equal(p.scripts.length,full.length);
 assert.deepEqual(p.scripts.map(node=>new URL(node.src).pathname),full.map(file=>'/features/'+file));
 assert.ok(p.scripts.every(node=>node.async===false));
 let settled=false;p.context.window.full.load().then(()=>settled=true);
 p.scripts.slice(0,-1).forEach(node=>node.onload());await Promise.resolve();assert.equal(settled,false);
 p.scripts.at(-1).onload();await p.context.window.full.load();assert.equal(settled,true);
});

function button(handler,disabled=false){
 const attrs=new Map([['onclick',handler]]);
 return {disabled,getAttribute:key=>attrs.has(key)?attrs.get(key):null,setAttribute:(key,value)=>attrs.set(key,value),removeAttribute:key=>attrs.delete(key)};
}
test('inline controls cannot call unloaded APIs and restore as each feature becomes ready',async()=>{
 const search=button('search.openSearch()'),theme=button('theme.toggleTheme()',true),p=page([search,theme]);
 p.load('full',full);
 assert.equal(search.disabled,true);assert.equal(search.getAttribute('aria-busy'),'true');
 p.context.window.search={openSearch(){}};p.scripts.find(n=>n.src.endsWith('/search/search.js')).onload();await Promise.resolve();
 assert.equal(search.disabled,false);assert.equal(search.getAttribute('aria-busy'),null);
 assert.equal(theme.disabled,true,'original disabled state is preserved');
 p.context.window.theme={};p.scripts.find(n=>n.src.endsWith('/theme/theme.js')).onload();await Promise.resolve();
 assert.equal(theme.disabled,true);assert.equal(theme.getAttribute('aria-busy'),null);
});
test('overlapping packages do not release a control before its shared dependency',async()=>{
 const theme=button('theme.toggleTheme()'),p=page([theme]);p.load('core',core);p.load('full',full);
 assert.equal(theme.disabled,true);
 p.scripts.filter(n=>!n.src.endsWith('/theme/theme.js')).forEach(n=>n.onload());await Promise.resolve();assert.equal(theme.disabled,true);
 p.context.window.theme={};p.scripts.find(n=>n.src.endsWith('/theme/theme.js')).onload();await p.context.window.full.load();assert.equal(theme.disabled,false);
});
test('core/full overlap waits for in-flight shared scripts and inserts each URL once',async()=>{
 const p=page();p.load('core',core);p.load('full',full);
 assert.equal(p.scripts.length,full.length);assert.equal(new Set(p.scripts.map(node=>node.src)).size,full.length);
 let settled=false;p.context.window.full.load().then(()=>settled=true);
 p.scripts.filter(node=>!node.src.endsWith('/theme/theme.js')).forEach(node=>node.onload());
 await Promise.resolve();assert.equal(settled,false);
 p.scripts[0].onload();await Promise.all([p.context.window.core.load(),p.context.window.full.load()]);assert.equal(settled,true);
});
test('a failed feature rejects load rather than claiming readiness',async()=>{
 const p=page();p.load('core',core);p.scripts[0].onerror();
 await assert.rejects(p.context.window.core.load(),/theme\/theme.js/);
 assert.equal(p.warnings.length,1);
});
