import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const source=await readFile(new URL('../features/docs-layout/docs-layout.js',import.meta.url),'utf8');
function fixture(){
 const events={},mediaEvents={};let document;
 function node(href){const attrs={},classes=new Set(),listeners={};return {isConnected:true,hidden:false,id:'',style:{},classList:{contains:x=>classes.has(x),add:x=>classes.add(x),remove:x=>classes.delete(x),toggle(x,on){if(on)classes.add(x);else classes.delete(x);}},setAttribute(k,v){attrs[k]=v;},removeAttribute(k){delete attrs[k];},getAttribute(k){return k==='href'?href:attrs[k]??null;},addEventListener(k,fn){listeners[k]=fn;},focus(){document.activeElement=this;},listeners};}
 const button=node(),links=[node('getting-started.html'),node('reference.html#hazir-paketler'),node('reference.html')],sidebar=node(),overlay=node();
 sidebar.querySelector=()=>links[0];sidebar.querySelectorAll=()=>links;sidebar.contains=n=>links.includes(n);
 document={readyState:'complete',body:{style:{overflow:'scroll'}},activeElement:button,querySelector(s){return s==='[data-docs-sidebar]'?sidebar:s==='[data-docs-overlay]'?overlay:null;},querySelectorAll(s){return s==='[data-docs-nav-toggle]'?[button]:s==='.docs-nav-link'?links:[];},addEventListener(k,fn){events[k]=fn;}};
 const mobile={matches:true,addEventListener(k,fn){mediaEvents[k]=fn;}};
 const window={location:{href:'https://example.test/docs/reference.html'},matchMedia:()=>mobile,addEventListener(){},scrollY:0};
 vm.runInNewContext(source,{document,window,URL,Array});
 return {button,links,sidebar,overlay,document,mobile,mediaEvents,events,api:window.docsLayout};
}
test('closed mobile drawer is inert and exposes its controlled collapsed state',()=>{
 const f=fixture();assert.equal(f.sidebar.inert,true);assert.equal(f.button.getAttribute('aria-expanded'),'false');assert.equal(f.button.getAttribute('aria-controls'),'docs-navigation');
});
test('opening traps focus; Escape restores focus and the previous body overflow',()=>{
 const f=fixture();f.api.toggleNavigation();assert.equal(f.button.getAttribute('aria-expanded'),'true');assert.equal(f.document.activeElement,f.links[0]);assert.equal(f.sidebar.getAttribute('aria-modal'),'true');
 f.events.keydown({key:'Tab',shiftKey:true,preventDefault(){}});assert.equal(f.document.activeElement,f.links.at(-1));
 f.events.keydown({key:'Tab',shiftKey:false,preventDefault(){}});assert.equal(f.document.activeElement,f.links[0]);
 f.events.keydown({key:'Escape',preventDefault(){}});assert.equal(f.document.activeElement,f.button);assert.equal(f.document.body.style.overflow,'scroll');assert.equal(f.sidebar.inert,true);
});
test('desktop resize closes the drawer and restores available page navigation',()=>{
 const f=fixture();f.api.toggleNavigation();f.mobile.matches=false;f.mediaEvents.change();assert.equal(f.sidebar.inert,false);assert.equal(f.sidebar.getAttribute('aria-hidden'),null);assert.equal(f.sidebar.classList.contains('open'),false);assert.equal(f.document.body.style.overflow,'scroll');
});
test('a same-page package anchor does not become a second current page',()=>{
 const f=fixture();assert.equal(f.links[1].classList.contains('active'),false);assert.equal(f.links[2].classList.contains('active'),true);assert.equal(f.links[2].getAttribute('aria-current'),'page');
});
