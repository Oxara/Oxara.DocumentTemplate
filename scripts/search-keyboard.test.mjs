import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const source=await readFile(new URL('../features/search/search.js',import.meta.url),'utf8');
function fixture(){
 let document; const events={};
 function node(){const classes=new Set(),attrs={};return {hidden:false,isConnected:true,style:{},value:'',clicks:0,classList:{contains:x=>classes.has(x),add:x=>classes.add(x),remove:x=>classes.delete(x)},setAttribute(k,v){attrs[k]=v;},getAttribute:k=>attrs[k],hasAttribute:k=>k in attrs,addEventListener(){},focus(){document.activeElement=this;},select(){},scrollIntoView(){},click(){this.clicks++;}};}
 const input=node(),close=node(),links=[node(),node(),node()],results=node(),modal=node(),overlay=node();
 results.querySelectorAll=()=>[];modal.querySelectorAll=()=>[input,close,...links];modal.contains=n=>[input,close,...links].includes(n);overlay.querySelector=()=>modal;
 document={readyState:'complete',activeElement:input,body:{style:{}},getElementById:id=>({searchOverlay:overlay,searchInput:input,searchResults:results})[id],querySelector:()=>null,querySelectorAll:selector=>selector==='.search-result-item'?links:[],addEventListener(k,fn){(events[k]??=[]).push(fn);},removeEventListener(){}};
 const window={location:{},search:{},matchMedia:()=>({matches:true})};
 vm.runInNewContext(source,{window,document,setTimeout(){},clearTimeout(){}});window.search.openSearch();
 function key(key,extra={}){let prevented=false;const event={key,target:document.activeElement,preventDefault(){prevented=true;},...extra};for(const fn of events.keydown??[])fn(event);return prevented;}
 return{key,links,input,document};
}
test('focused result anchors keep native Enter and modified Enter activation',()=>{
 for(const extra of [{},{ctrlKey:true},{metaKey:true},{shiftKey:true}]){const f=fixture();f.links[1].focus();assert.equal(f.key('Enter',extra),false);assert.equal(f.links.reduce((n,x)=>n+x.clicks,0),0);}
});
test('input Enter opens first result, but modified Enter does not synthesize a click',()=>{
 const f=fixture();assert.equal(f.key('Enter'),true);assert.equal(f.links[0].clicks,1);const modified=fixture();assert.equal(modified.key('Enter',{ctrlKey:true}),false);assert.equal(modified.links[0].clicks,0);
});
test('ArrowDown and ArrowUp keep result selection and keyboard focus together',()=>{
 const f=fixture();f.key('ArrowDown');f.key('ArrowDown');assert.equal(f.document.activeElement,f.links[1]);f.key('ArrowUp');assert.equal(f.document.activeElement,f.links[0]);
});
