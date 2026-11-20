// Canonical dependency order for generated classic-script entry packages.
export const core=['theme/theme.js','docs-layout/docs-layout.js','navigation-progress/navigation-progress.js','document-hero/document-hero.js'];
export const full=['theme/theme.js','code-highlight/code-highlight.js','copy-code/copy-code.js','copy-table/copy-table.js','code-tabs/code-tabs.js','docs-layout/docs-layout.js','sidemenu/sidemenu.js','search/search.js','scroll-top/scroll-top.js','reading-progress/reading-progress.js','navigation-progress/navigation-progress.js','document-hero/document-hero.js'];

export function loadBehaviorPackage(name,scripts){
    'use strict';
    var entry=document.currentScript;
    var root=entry?new URL('../features/',entry.src):new URL('features/',window.location.href);
    var registry=window.documentTemplateScripts||(window.documentTemplateScripts=new Map());
    var promise;
    function load(){
        if(promise)return promise;
        // Insert every ordered classic script in one turn: downloads overlap,
        // async=false preserves evaluation order and DOM-dependent initialization.
        promise=Promise.all(scripts.map(function(file){
            var src=new URL(file,root).href;
            if(registry.has(src))return registry.get(src);
            if(Array.from(document.scripts).some(function(node){return node.src===src;}))return Promise.resolve();
            var pending=new Promise(function(resolve,reject){
                var node=document.createElement('script');
                node.async=false;node.src=src;
                node.onload=resolve;
                node.onerror=function(){reject(new Error('Failed to load '+file));};
                document.head.appendChild(node);
            });
            registry.set(src,pending);return pending;
        }));
        return promise;
    }
    window[name]={load:load};
    load().catch(function(error){if(window.console&&console.warn)window.console.warn(error.message);});
}
