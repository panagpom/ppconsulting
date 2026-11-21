import {DEFAULT_PREFERENCES,parsePreferences,preferenceKey,readPreferences,savePreferences,type AccessibilityPreferences,type PreferenceStorage} from '../../../../../packages/accessibility/preferences.mjs';
import {accessibilityMessages,type ControlKey} from './messages';
export const preferenceEvent='ppconsulting:accessibility-change';
export function initAccessibility(root:HTMLElement){
 const document=root.ownerDocument,win=document.defaultView!;
 const opener=root.querySelector<HTMLButtonElement>('[data-accessibility-open]')!;
 const dialog=root.querySelector<HTMLDialogElement>('[data-accessibility-dialog]')!;
 if(typeof dialog.showModal!=='function')return ()=>{};
 const key=preferenceKey(root.dataset.projectName!),messages=accessibilityMessages(root.dataset.locale!);
 let storage:PreferenceStorage|null=null;try{storage=win.localStorage;}catch{/* session-only preferences remain usable */}
 let state:AccessibilityPreferences=readPreferences(storage,key),disposed=false;
 const status=root.querySelector<HTMLElement>('[data-accessibility-status]')!;
 const controls=Array.from(root.querySelectorAll<HTMLButtonElement>('[data-a11y-control]'));
 const abort=new AbortController(),options={signal:abort.signal};
 const attributeNames:Record<ControlKey,string>={textSize:'text-size',contrast:'contrast',links:'links',spacing:'spacing',lineHeight:'line-height',reduceMotion:'motion',hideImages:'images',readableFont:'font',largePointer:'pointer',alignment:'alignment',saturation:'saturation',largePanel:'panel'};
 function apply(){
  for(const [key,name]of Object.entries(attributeNames) as [ControlKey,string][]){const value=state[key];document.documentElement.setAttribute('data-a11y-'+name,typeof value==='boolean'?(value?'1':'0'):String(value));}
  for(const button of controls){const key=button.dataset.a11yControl as ControlKey;const value=state[key];const definition=messages.controls.find(c=>c.key===key)!;const label=definition.states?.[Number(value)]??(value?messages.on:messages.off);button.setAttribute('aria-pressed',String(Boolean(value)));button.setAttribute('aria-label',definition.label+': '+label);button.querySelector('[data-a11y-value]')!.textContent=label;}
  document.dispatchEvent(new CustomEvent(preferenceEvent,{detail:{reduceMotion:state.reduceMotion}}));
 }
 function persist(reset=false){const stored=savePreferences(storage,key,state);status.textContent=stored?(reset?messages.resetDone:messages.saved):messages.sessionOnly;}
 for(const button of controls)button.addEventListener('click',()=>{const key=button.dataset.a11yControl as ControlKey;const definition=messages.controls.find(c=>c.key===key)!;const value=state[key];state=parsePreferences({...state,[key]:typeof value==='boolean'?!value:(value+1)%(definition.states?.length??1)});apply();persist();},options);
 opener.addEventListener('click',()=>{if(document.querySelector('dialog[open]'))return;try{dialog.showModal();opener.setAttribute('aria-expanded','true');root.querySelector<HTMLButtonElement>('[data-accessibility-close]')?.focus();}catch{/* HTML remains usable without dialog enhancement */}},options);
 root.querySelector('[data-accessibility-close]')!.addEventListener('click',()=>dialog.close(),options);
 dialog.addEventListener('keydown',event=>{
  if(event.key!=='Tab'||event.altKey||event.ctrlKey||event.metaKey)return;
  const buttons=Array.from(dialog.querySelectorAll<HTMLButtonElement>('button:not([disabled])')).filter(button=>button.getClientRects().length>0);
  const first=buttons[0],last=buttons.at(-1);if(!first||!last)return;
  if(event.shiftKey&&(document.activeElement===first||document.activeElement===dialog)){event.preventDefault();last.focus();}
  else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
 },options);
 dialog.addEventListener('close',()=>{opener.setAttribute('aria-expanded','false');if(!document.querySelector('dialog[open]'))opener.focus();},options);
 root.querySelector('[data-accessibility-reset]')!.addEventListener('click',()=>{state={...DEFAULT_PREFERENCES};apply();persist(true);},options);
 win.addEventListener('storage',event=>{if(event.key!==key&&event.key!==null)return;state=readPreferences(storage,key);apply();},options);
 // Do not let a floating control obscure an input or keyboard-focused page link.
 function avoidObscuring(){const target=document.activeElement;if(!(target instanceof HTMLElement)||target===document.body||target===document.documentElement||root.contains(target)){opener.removeAttribute('data-obscures-focus');return;}const a=target.getBoundingClientRect(),b=opener.getBoundingClientRect();const overlap=a.width>0&&a.height>0&&a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top;opener.toggleAttribute('data-obscures-focus',overlap);}
 document.addEventListener('focusin',avoidObscuring,options);win.addEventListener('resize',avoidObscuring,options);document.addEventListener('scroll',avoidObscuring,{...options,passive:true});
 apply();opener.hidden=false;
 return ()=>{if(disposed)return;disposed=true;abort.abort();if(dialog.open)dialog.close();opener.hidden=true;};
}
