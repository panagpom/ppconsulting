import {it,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import {parseProject} from '../packages/config/project.mjs';
import {readContent} from '../packages/content/read.mjs';
import {localizeContent} from '../packages/content/localize.mjs';
import {beforeSubmit} from '../tina/validation';
import {sectionCopyFields} from '../tina/fields/section-copy';
import {parseMDX} from '@tinacms/mdx';
import {signupSchema} from '../packages/contracts';
import {createNewsletterRequest} from '../apps/site/src/scripts/newsletter-form';
import {settingsSchema} from '../packages/content/schemas.mjs';
const project=parseProject(JSON.parse(readFileSync('project.json','utf8')));
const snapshot=()=>readContent(process.cwd(),project);

it('keeps the newsletter prompt and hosted form protection off for the informational release',async()=>{
 const {formProtection}=await import('../packages/config/form-protection.mjs');
 const {resolveNewsletterExperience}=await import('../packages/content/newsletter.mjs');
 const settings=localizeContent(snapshot(),'el',project).settings;
 const hosted=parseProject({...project,environment:'production',siteUrl:'https://ppconsulting.cc',infrastructure:{...project.infrastructure,turnstileSiteKey:'site-key',publicFormsEnabled:false}});
 expect(formProtection(hosted)).toEqual({mode:'unavailable',siteKey:''});
 expect(resolveNewsletterExperience(settings,hosted,{locale:'el',privacyHref:'/el/privacy',pageKind:'home',localProtectionAvailable:false})).toBeNull();
 expect(formProtection(project).mode).toBe('local');
});

it('shares optional local brand assets across languages and rejects external image URLs',()=>{
 const source=snapshot();
 const logo='/uploads/ppconsulting-logo.png',logoRetina='/uploads/ppconsulting-logo-2x.png';
 source.settings=settingsSchema.parse({...source.settings,brand:{...source.settings.brand,logo,logoRetina}});
 expect(localizeContent(source,'el',project).settings.brand).toMatchObject({logo,logoRetina});
 expect(settingsSchema.safeParse({...source.settings,brand:{...source.settings.brand,logo:'https://example.com/logo.png'}}).success).toBe(false);
});

it('requires a recognised subscriber type and includes it in the newsletter request',async()=>{
 const requestKey='73be6d40-f858-4eb7-9c36-719986c16cc4';
 const payload={requestKey,email:'visitor@example.com',consent:true,interest:'updates',turnstileToken:'local'};
 expect(signupSchema.safeParse(payload).success).toBe(false);
 expect(signupSchema.safeParse({...payload,subscriberType:'unknown'}).success).toBe(false);
 expect(signupSchema.parse({...payload,subscriberType:'individual'}).subscriberType).toBe('individual');
 let submitted:unknown;
 const request=createNewsletterRequest({interest:'updates',coordinator:{busy:false,listeners:new Set()},token:()=>payload.turnstileToken,uuid:()=>requestKey,onAccepted:()=>{},fetch:async(_url,options)=>{
  submitted=JSON.parse(String(options?.body));
  return new Response(null,{status:202});
 }});
 expect(await request.submit(payload.email,true,'')).toBe('invalid');
 expect(await request.submit(payload.email,true,'business')).toBe('accepted');
 expect(submitted).toEqual({...payload,subscriberType:'business'});
});
it('preserves the complete bilingual financial catalog, relationships and inert delivery',()=>{
 const source=snapshot();expect(source.pages).toHaveLength(6);expect(source.offerings).toHaveLength(7);expect(source.articles).toHaveLength(2);expect(source.people).toHaveLength(1);
 expect(project.infrastructure.sendingEnabled).toBe(false);expect(project.infrastructure.marketingEnabled).toBe(false);expect(source.settings.brand.name).toBe('PPConsulting');
 for(const locale of ['en','el']){const c=localizeContent(source,locale,project);expect(c.pages.find(p=>p._template==='offerings')!.path).toBe('/'+locale+'/offerings');expect(c.offerings.map(o=>o.slug)).toContain('investment-planning');expect(c.articles.every(a=>a.authorId==='alex'&&c.offerings.some(o=>o.contentId===a.offeringId))).toBe(true);expect(JSON.stringify(c)).not.toContain('AXIA');expect(JSON.stringify(c)).not.toContain('?offering=');}
});
it('section appearance and localized native editor values survive validation without AST mutation',()=>{
 const current=JSON.parse(readFileSync('content/pages/home.json','utf8'));const candidate=structuredClone(current);
 candidate.sections.find((s:any)=>s.id==='perspective').appearance.backgroundColor='#20364f';
 const entry=candidate.copy.sections.find((s:any)=>s.id==='hero');entry.eyebrow=parseMDX('A **clearer** view',{name:'eyebrow',type:'rich-text',templates:[]},u=>u);
 const original=structuredClone(candidate);expect(beforeSubmit(candidate,'page',project,current)).toBe(candidate);expect(candidate).toEqual(original);
 expect(sectionCopyFields('hero').find(f=>f.name==='eyebrow')!.type).toBe('rich-text');expect(sectionCopyFields('steps').some(f=>f.name==='link')).toBe(true);
});
it('optional visibility keeps required capabilities and preserves translated copy',()=>{
 const current=JSON.parse(readFileSync('content/pages/home.json','utf8'));const candidate=structuredClone(current);candidate.sections.find((s:any)=>s.id==='perspective').enabled=false;
 expect(beforeSubmit(candidate,'page',project,current)).toBe(candidate);expect(candidate.translations.el.copy.sections.some((s:any)=>s.id==='perspective')).toBe(true);
 candidate.sections[0].enabled=false;expect(()=>beforeSubmit(candidate,'page',project,current)).toThrow();
});

it('background controls reuse registered native fields instead of raw schema descriptors',async()=>{
 const {appearanceChildFields}=await import('../tina/fields/composition');const Native=()=>null;
 const fields=appearanceChildFields({fields:[{name:'appearance',fields:[{name:'surface',component:'select'},{name:'backgroundImage',component:Native},{name:'imageOpacity',component:'number'}]}]},2);
 expect(fields.map((f:any)=>f.name)).toEqual(['sections.2.appearance.backgroundImage','sections.2.appearance.imageOpacity']);expect(fields[0].component).toBe(Native);
});

it('CMS receives the selected theme without infrastructure credentials',async()=>{
 const {createCmsDescriptor}=await import('../scripts/cms-descriptor.mjs');const value=createCmsDescriptor(process.cwd(),project);expect(value.project.design.theme).toBe('advisory');expect(value.project).not.toHaveProperty('infrastructure');
});
