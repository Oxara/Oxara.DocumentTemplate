import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const source=await readFile(new URL('../features/document-hero/document-hero.js',import.meta.url),'utf8');
function fixture(count=2){
 const events={},frames=new Map(),observers=[],media=[];let id=0;
 const listen=(name,fn,options={})=>{(events[name]??=[]).push(fn);options.signal?.addEventListener('abort',()=>events[name].splice(events[name].indexOf(fn),1));};
 const nodes=Array.from({length:count},(_,index)=>({dataset:{},style:{values:{},setProperty(k,v){this.values[k]=v;},removeProperty(k){delete this.values[k];}},matches:()=>true,querySelector:()=>null,querySelectorAll:()=>[],getBoundingClientRect:()=>({top:-100*(index+1)})}));
 const document={hidden:false,readyState:'complete',querySelectorAll:()=>nodes,addEventListener:listen};
 class Observer{constructor(fn){this.fn=fn;observers.push(this);}observe(){}unobserve(){}disconnect(){this.disconnected=true;}}
 const context={document,window:{},AbortController,Map,IntersectionObserver:Observer,matchMedia:()=>{const query={matches:false,addEventListener:listen};media.push(query);return query;},addEventListener:listen,requestAnimationFrame:fn=>{frames.set(++id,fn);return id;},cancelAnimationFrame:i=>frames.delete(i)};
 vm.runInNewContext(source,context);
 const flush=()=>{const pending=[...frames.values()];frames.clear();pending.forEach(fn=>fn());};
 return{context,document,nodes,media,events,frames,observers,flush,api:context.window.documentHero};
}
test('default props use one shared scheduler; repeated init does not duplicate listeners',()=>{
 const f=fixture();f.api.init();assert.equal(f.observers.length,1);assert.equal(f.events.scroll.length,1);
 f.observers[0].fn(f.nodes.map(target=>({target,isIntersecting:true})));f.flush();
 assert.deepEqual(f.nodes.map(n=>n.style.values['--document-book-y']),['4px','8px']);
});
test('offscreen, reduced motion and hidden pages pause and reset depth',()=>{
 const f=fixture(1);f.observers[0].fn([{target:f.nodes[0],isIntersecting:true}]);f.flush();
 f.media[0].matches=true;f.events.change[0]();assert.equal(f.nodes[0].style.values['--document-book-y'],'0px');assert.equal(f.frames.size,0);
 f.media[0].matches=false;f.document.hidden=true;f.events.visibilitychange[0]();assert.equal(f.nodes[0].dataset.heroMotion,'paused');
 f.document.hidden=false;f.observers[0].fn([{target:f.nodes[0],isIntersecting:false}]);f.flush();assert.equal(f.nodes[0].dataset.heroMotion,'paused');
});
test('destroy removes lifecycle state and leaves no scheduled work',()=>{
 const f=fixture();f.api.destroy();assert.equal(f.frames.size,0);assert.equal(f.events.scroll.length,0);assert.ok(f.observers[0].disconnected);
 for(const n of f.nodes){assert.equal(n.dataset.heroMotion,undefined);assert.equal(n.style.values['--document-book-y'],undefined);}
});
test('pages without a hero do not attach motion observers or listeners',()=>{
 const f=fixture(0);assert.equal(f.observers.length,0);assert.equal(f.events.scroll,undefined);
});
