import {connectVisitorLifecycle} from './visitor-lifecycle';
// This tiny bootstrap is shared. Disabled sites never request the controller chunk.
if (document.documentElement.dataset.motion === 'on') {
 let stop:(()=>void)|undefined,ended=false,generation=0;
 const sync=()=>{const current=++generation;stop?.();stop=undefined;if(ended||document.documentElement.dataset.a11yMotion==='1')return;void import('./motion').then(({initMotion})=>{if(!ended&&current===generation&&document.documentElement.dataset.a11yMotion!=='1')stop=initMotion(document);}).catch(()=>{});};
 let previousReduced=document.documentElement.dataset.a11yMotion==='1';
 document.addEventListener('ppconsulting:accessibility-change',()=>{const reduced=document.documentElement.dataset.a11yMotion==='1';if(reduced!==previousReduced){previousReduced=reduced;sync();}});
 window.addEventListener('pagehide',()=>{ended=true;++generation;stop?.();stop=undefined;});
 window.addEventListener('pageshow',event=>{if(event.persisted){ended=false;sync();}});
 sync();
}

const visitorRoot=document.querySelector<HTMLElement>('[data-visitor-experience]');
if(visitorRoot)connectVisitorLifecycle(visitorRoot,window,()=>import('./visitor-experience'));

const accessibilityRoot=document.querySelector<HTMLElement>('[data-accessibility]');
if(accessibilityRoot){let stop:(()=>void)|undefined,ended=false;window.addEventListener('pagehide',()=>{ended=true;stop?.();});void import('./accessibility/controller').then(({initAccessibility})=>{if(!ended)stop=initAccessibility(accessibilityRoot);});window.addEventListener('pageshow',event=>{if(event.persisted){ended=false;void import('./accessibility/controller').then(({initAccessibility})=>{stop?.();stop=initAccessibility(accessibilityRoot);});}});}
