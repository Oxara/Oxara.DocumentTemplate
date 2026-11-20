import test from 'node:test';
import assert from 'node:assert/strict';
import {runInNewContext} from 'node:vm';
import {core,full,loadBehaviorPackage} from './behavior-packages.mjs';
function page(){
 const scripts=[],warnings=[];
 const document={currentScript:{src:'https://example.test/feature-packages/core.js'},scripts,createElement:()=>({}),head:{appendChild(node){scripts.push(node);}}};
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
