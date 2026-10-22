// One-way public-content importer. The source project is always read-only.
import {readFileSync,readdirSync,mkdirSync,writeFileSync,copyFileSync,existsSync} from 'node:fs';
import {resolve,join,relative} from 'node:path';
import {createHash} from 'node:crypto';
const args=process.argv.slice(2),source=resolve(args[args.indexOf('--source')+1]||'');
if(!args.includes('--source')||source===process.cwd())throw Error('Supply a separate read-only --source project');
const apply=args.includes('--apply'),root=process.cwd();
if(JSON.parse(readFileSync('project.json')).name!=='ppconsulting')throw Error('This importer only owns the initialized ppconsulting app');
const read=p=>JSON.parse(readFileSync(join(source,p),'utf8'));
const clean=v=>typeof v==='string'?v.replaceAll('AXIA','PPConsulting').replaceAll('?offering=','?contextId='):Array.isArray(v)?v.map(clean):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).map(([k,x])=>[k,clean(x)])):v;
const folders=['pages','offerings','articles','people','settings','experience'];
const archive=Object.fromEntries(folders.map(folder=>[folder,Object.fromEntries(readdirSync(join(source,'content',folder)).filter(f=>f.endsWith('.json')).map(f=>[f,read('content/'+folder+'/'+f)]))]));
const digest=createHash('sha256').update(JSON.stringify(archive)).digest('hex');
if(existsSync('docs/migration/source-public-content.json')&&apply)throw Error('Import already applied; edit canonical CMS content instead');
const out=new Map(),put=(path,v)=>out.set(path,clean(v));
const legacy=archive.pages;
const appearance=a=>({...(a?.colorScheme==='light'?{colorScheme:'light'}:{}),surface:a?.background==='muted'?'muted':'default',...Object.fromEntries(Object.entries(a??{}).filter(([k,v])=>['backgroundColor','backgroundImage','imageEnabled','imagePosition','imagePositionMobile','imageOpacity','imageOpacityMobile','overlayOpacity'].includes(k)&&v!==''))});
for(const [filename,d] of Object.entries(legacy)){
 const sections=[],base=[],el=[];const t=d.translations.el;
 function add(id,type,s,ts){
  const ref={id,_template:type,variant:'editorial',enabled:s.enabled!==false,appearance:appearance(s.appearance)};
  const copy=(v)=>({id,_template:type,title:v.title||d.title,...(v.eyebrow?{eyebrow:v.eyebrow}:{}),...(['rich-text'].includes(type)?{body:v.body??v.description??''}:{description:v.description??''})});
  const b=copy(s),l=copy(ts);
  if(type==='steps'||type==='faq'){
   const values=type==='steps'?s.steps:s.items,translated=type==='steps'?ts.steps:ts.items;
   ref.items=values.map((_,i)=>({id:'item_'+(i+1)}));
   for(const [target,items] of [[b,values],[l,translated]])target.items=items.map((v,i)=>({id:ref.items[i].id,...(type==='steps'?{title:v.title,body:v.text}:{question:v.question,answer:v.answer})}));
  }
  if(s.ctaHeading){b.contactTitle=s.ctaHeading;l.contactTitle=ts.ctaHeading;b.link={label:s.ctaLabel,href:'/contact'};l.link={label:ts.ctaLabel,href:'/contact'};}
  if(d.contentId==='home'&&type==='hero')for(const [target,actions] of [[b,d.actions],[l,{contact:{...d.actions.contact,...t.actions.contact},services:{...d.actions.services,...t.actions.services}}]])target.actions=[{...actions.contact,icon:'conversation'},{...actions.services,icon:'briefcase'}];
  if(d.contentId==='home'&&['steps','article-list'].includes(type)){const key=type==='steps'?'about':'allStories';b.link=d.actions[key];l.link={...d.actions[key],...t.actions[key]};}
  sections.push(ref);base.push(b);el.push(l);
 }
 if(d.contentId==='home')for(const [id,s] of Object.entries(d.sections))add(id,{hero:'hero',perspective:'rich-text',services:'offering-list',approach:'steps',insights:'article-list',questions:'faq'}[id],s,t.sections[id]);
 else{
  add('intro','hero',d.header,t.header);
  if(d.body)add(d.contentId==='privacy'?'privacy_details':'body','rich-text',{title:d.title,body:d.body},{title:t.title||d.title,body:t.body});
  if(d.method)add('method','steps',d.method,t.method);
  if(d.faq)add('questions','faq',d.faq,t.faq);
  if(d.contentId==='services')add('services','offering-list',{title:d.header.title},{title:t.header.title});
  if(d.contentId==='insights')add('articles','article-list',{title:d.header.title},{title:t.header.title});
 }
 const meta=v=>({title:v.meta.title,seoDescription:v.meta.description??'',noindex:v.meta.noindex??d.meta.noindex??false});
 put('content/pages/'+filename,{contentId:d.contentId,_template:d.contentId==='privacy'?'standard':d.contentId==='services'?'offerings':d._template,slug:d.contentId==='home'?'':d.contentId==='services'?'offerings':d.contentId,status:'published',meta:meta(d),sections,copy:{sections:base},translations:{el:{status:'published',meta:meta(t),copy:{sections:el}}}});
}
for(const folder of ['offerings','articles','people'])for(const [filename,d] of Object.entries(archive[folder])){
 const person=folder==='people',article=folder==='articles';
 const fields=v=>({status:v.status??'published',title:person?v.name:v.title,description:person?v.bio:v.description,body:person?v.bio:v.body,seoDescription:v.seoDescription??'',...(person?{role:v.role}:{}),...(article?{publishAt:(v.publishedAt??d.publishedAt)+'T00:00:00.000Z',...(d.updatedAt?{updatedAt:(v.updatedAt??d.updatedAt)+'T00:00:00.000Z'}:{}),imageAlt:v.imageAlt??'',category:v.category??d.category??''}:{})});
 put('content/'+folder+'/'+filename,{contentId:d.contentId,slug:d.slug,...fields(d),...(folder==='offerings'?{audience:d.audience,number:d.number}:{}),...(article?{authorId:d.authorId,offeringId:d.offeringId,image:{src:d.image,crop:'center'},imagePosition:d.imagePosition}:{}),translations:{el:fields(d.translations.el)}});
}
const project=JSON.parse(readFileSync('project.json'));const oldProject=read('project.json');
project.design={...oldProject.design,motion:{enabled:true,durationMs:900,distancePx:32,staggerMs:100,interactionMs:240}};
project.profile='newsletter';project.modules.newsletterPrompt=true;project.modules.visitorPreferences=true;project.infrastructure.sender='PPConsulting <hello@example.com>';put('project.json',project);
const old=archive.settings['site.json'],experience=archive.experience['site.json'];
const labels={en:['Home','Services','About','Insights','Contact'],el:['Αρχική','Υπηρεσίες','Σχετικά','Άρθρα','Επικοινωνία']},ids=['home','services','about','insights','contact'];
const newsletter=(v,locale)=>({title:v.title,body:v.body,footerPrompt:locale==='el'?'Χρήσιμες ιδέες και ενημερώσεις στο email σας.':'Useful ideas and updates in your inbox.',emailLabel:'Email',submitLabel:v.button,consentLabel:v.consent,privacyLinkLabel:locale==='el'?'Πολιτική απορρήτου':'Privacy notice',dismissLabel:v.dismiss,successTitle:locale==='el'?'Ελέγξτε το email σας':'Check your inbox',successBody:v.success});
put('content/settings/site.json',{brand:{name:'PPConsulting',tagline:old.seoDescription},legal:{businessName:'PPConsulting — demonstration company',privacyVersion:old.privacyVersion,notice:'Demonstration website. Business details and privacy wording require review before launch.'},contact:{email:old.email,phone:old.phone,address:old.location},social:{...old.social,facebook:'',whatsapp:'',showInHeader:true},navigation:ids.map((pageId,i)=>({pageId,label:labels.en[i]})),newsletterPrompt:{enabled:true,modalEnabled:true,autoOpen:true,footerMode:'open-modal',delaySeconds:experience.delaySeconds,dismissDays:experience.cooldownDays,acceptedDays:experience.requestedDays,interestId:'updates',...newsletter(experience,'en')},translations:{el:{brand:{tagline:old.translations.el.seoDescription},legal:{notice:'Ενδεικτικός ιστότοπος. Τα επιχειρηματικά στοιχεία και η πολιτική απορρήτου χρειάζονται έλεγχο πριν τη δημοσίευση.'},contact:{address:old.translations.el.location},navigation:ids.map((pageId,i)=>({pageId,label:labels.el[i]})),newsletterPrompt:newsletter(experience.translations.el,'el')}}});
// Validate every staged document and cross-record relationship before modifying canonical files.
import {parseProject} from '../packages/config/project.mjs';
import {normalizePageDocument,normalizeSettingsDocument} from '../packages/content/documents.mjs';
import {offeringSchema,personSchema,articleSchema} from '../packages/content/schemas.mjs';
const parsed=parseProject(out.get('project.json'));
for(const [path,value] of out){if(path.startsWith('content/pages/'))normalizePageDocument(value);if(path.includes('/settings/'))normalizeSettingsDocument(value);for(const [folder,schema] of Object.entries({offerings:offeringSchema,people:personSchema,articles:articleSchema}))if(path.startsWith('content/'+folder+'/'))schema.parse(value);}
const report={source,sourcePublicContentSha256:digest,files:[...out.keys()],retiredFields:['offerings.detail/features preserved in archive; not rendered in approved reference','experience.scrollPercent/confirmedDays/consentVersion/consentDays and cookie labels retained in archive; v2 uses its own tested consent/preferences lifecycle','home.actions.about/allStories mapped to localized section links'],sendingEnabled:parsed.infrastructure.sendingEnabled};
if(apply){
 for(const folder of ['pages','offerings','articles','people']){const expected=[...out.keys()].filter(p=>p.startsWith('content/'+folder+'/')).map(p=>p.split('/').at(-1));const existing=readdirSync('content/'+folder).filter(f=>f.endsWith('.json'));const extras=existing.filter(f=>!expected.includes(f)&&!(folder==='pages'&&f==='rooms.json'));if(extras.length)throw Error('Remove only verified scaffold records before apply: '+folder+'/'+extras.join(','));}
 for(const [path,value] of out){mkdirSync(resolve(path,'..'),{recursive:true});writeFileSync(path,JSON.stringify(value,null,2)+'\n');}
 mkdirSync('docs/migration',{recursive:true});writeFileSync('docs/migration/source-public-content.json',JSON.stringify(archive,null,2)+'\n');writeFileSync('docs/migration/import-report.json',JSON.stringify(report,null,2)+'\n');
 for(const name of readdirSync(join(source,'apps/site/public/uploads'))){if([...out.values()].some(value=>JSON.stringify(value).includes('/uploads/'+name))){mkdirSync('apps/site/public/uploads',{recursive:true});copyFileSync(join(source,'apps/site/public/uploads',name),'apps/site/public/uploads/'+name);}}
}
console.log(JSON.stringify({...report,applied:apply},null,2));
