import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const source=await readFile(new URL('../features/sidemenu/sidemenu.js',import.meta.url),'utf8');
test('Escape and close are harmless when a full-package page has no legacy drawer',()=>{
 const handlers={};const context={window:{},document:{readyState:'loading',getElementById:()=>null,addEventListener:(name,fn)=>{handlers[name]=fn;}},console};
 vm.runInNewContext(source,context);
 assert.doesNotThrow(()=>context.window.sidemenu.closeSidenav());
 assert.doesNotThrow(()=>context.window.sidemenu.toggleSidenav());
 assert.doesNotThrow(()=>handlers.keydown({key:'Escape'}));
});
