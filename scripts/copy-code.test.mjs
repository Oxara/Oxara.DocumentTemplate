import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
const source=await readFile(new URL('../features/copy-code/copy-code.js',import.meta.url),'utf8');
function setup({clipboard,command=false}={}) {
  let listener, button;
  const wrapper={querySelector:s=>s==='code'?{textContent:'sample source'}:null,appendChild:b=>{button=b;}};
  const document={activeElement:null,readyState:'complete',querySelectorAll:()=>[wrapper],body:{appendChild(){}},execCommand:()=>command,createElement(tag){
    const attrs=new Map(),classes=new Set();
    return {style:{},disabled:false,textContent:'',classList:{add:x=>classes.add(x),remove:(...xs)=>xs.forEach(x=>classes.delete(x)),contains:x=>classes.has(x)},setAttribute:(k,v)=>attrs.set(k,v),getAttribute:k=>attrs.get(k),removeAttribute:k=>attrs.delete(k),addEventListener:(name,fn)=>{listener=fn;},select(){document.activeElement=this;},remove(){if(document.activeElement===this)document.activeElement=document.body;},focus(){if(!this.disabled)document.activeElement=this;}};
  }};
  vm.runInNewContext(source,{document,navigator:clipboard?{clipboard}:{},setTimeout(){},clearTimeout(){}});
  return {get button(){return button;},setCommand:value=>{command=value;},focused:()=>document.activeElement===button,click:()=>{document.activeElement=button;listener();}};
}
const settle=async()=>{for(let i=0;i<12;i++)await Promise.resolve();};
test('unavailable clipboard plus failed fallback reports failure, never copied',async()=>{
  const ui=setup();ui.click();await settle();assert.equal(ui.button.textContent,'Copy failed');assert.equal(ui.button.classList.contains('is-copied'),false);assert.equal(ui.button.disabled,false);assert.equal(ui.button.getAttribute('aria-busy'),undefined);assert.equal(ui.focused(),true);
});
test('rejected clipboard uses successful fallback',async()=>{
  const ui=setup({clipboard:{writeText:()=>Promise.reject(Error('denied'))},command:true});ui.click();await settle();assert.equal(ui.button.textContent,'✓ Copied');assert.equal(ui.button.classList.contains('is-error'),false);assert.equal(ui.focused(),true);
});
test('pending operation prevents duplicate activation and exposes busy until settled',async()=>{
  let complete;let received;const ui=setup({clipboard:{writeText:text=>{received=text;return new Promise(resolve=>complete=resolve);}}});ui.click();assert.equal(received,'sample source');assert.equal(ui.button.disabled,true);assert.equal(ui.button.getAttribute('aria-busy'),'true');complete();await settle();assert.equal(ui.button.disabled,false);assert.equal(ui.button.textContent,'✓ Copied');
});

test('a failed retry clears earlier success and restores focus',async()=>{
  const ui=setup({clipboard:{writeText:()=>Promise.reject(Error('denied'))},command:true});ui.click();await settle();assert.equal(ui.button.classList.contains('is-copied'),true);ui.setCommand(false);ui.click();await settle();assert.equal(ui.button.textContent,'Copy failed');assert.equal(ui.button.classList.contains('is-copied'),false);assert.equal(ui.focused(),true);
});
