import {it,expect} from 'vitest';
import source from '../project.json';
import {parseProject} from '../packages/config/project.mjs';
import {sectionSchema,sectionCopySchemas,offeringSchema,articleSchema} from '../packages/content/schemas.mjs';
import {publicAssetHeaders} from '../packages/config/security-headers.mjs';
import {latestArticleDigest} from '../packages/content/publication.mjs';

it('selects five articles by creation date and falls back to publication for older records',()=>{
 const articles=Array.from({length:7},(_,i)=>({contentId:`article-${i}`,publishAt:`2026-11-0${7-i}T00:00:00Z`,createdAt:i===0?undefined:`2026-11-0${i+1}T00:00:00Z`}));
 expect(latestArticleDigest(articles).map(article=>article.contentId)).toEqual(['article-0','article-6','article-5','article-4','article-3']);
 expect(articles[1].contentId).toBe('article-1');
});
it('validates advisory presentation controls without accepting arbitrary CSS/config',()=>{
 const project=parseProject({...source,design:{...source.design,radius:'3px',typography:{emphasisScale:.88,emphasisOpacity:.8},eyebrows:{treatment:'soft-highlight'},dividers:{serviceRows:true,faqItems:true,sections:false,footer:true},footer:{columnGap:64}}});
 expect(project.design.typography?.emphasisScale).toBe(.88);
 expect(()=>parseProject({...source,design:{...source.design,typography:{emphasisScale:2}}})).toThrow();
 expect(()=>parseProject({...source,design:{...source.design,typography:{customCSS:'bad'}}})).toThrow();
});
it('preserves editable eyebrows/actions and safe background appearance in canonical section schemas',()=>{
 expect(sectionCopySchemas.hero.parse({title:'A considered step',eyebrow:'Our work',description:'Hello',actions:[{label:'Contact',href:'/contact',icon:'conversation'}]})).toHaveProperty('actions');
 const section=sectionSchema.parse({id:'perspective',_template:'rich-text',variant:'editorial',enabled:true,appearance:{surface:'muted',backgroundColor:'#1b3048',backgroundImage:'/uploads/photo.webp',imageEnabled:true,imageOpacity:.6,overlayOpacity:.84}});
 expect(section.appearance.backgroundImage).toBe('/uploads/photo.webp');
 for(const bad of [{backgroundImage:'https://evil.test/image.png'},{backgroundColor:'red;}'},{imageOpacity:2}])expect(()=>sectionSchema.parse({...section,appearance:{...section.appearance,...bad}})).toThrow();
 expect(()=>sectionCopySchemas.hero.parse({title:'Title',description:'',actions:[{label:'Bad',href:'javascript:evil()'}]})).toThrow();
});
it('preserves audience/order and localized article preview metadata as CMS-owned fields',()=>{
 const record={contentId:'accounting',slug:'accounting',status:'published',title:'Accounting',description:'Support',body:'Useful body',seoDescription:'',translations:{}};
 expect(offeringSchema.parse({...record,audience:'individual',number:'05'})).toHaveProperty('audience','individual');
 expect(articleSchema.parse({...record,contentId:'story',publishAt:'2026-10-01T00:00:00Z',image:{src:'/uploads/story.webp',crop:'center'},imagePosition:'right center',imageAlt:'',category:'Perspective'})).toHaveProperty('category','Perspective');
});
it('generates scoped appearance CSS while retaining strict public CSP',async()=>{
 const {sectionAppearanceCSS}=await import('../packages/design-system/presentation.mjs');
 const css=sectionAppearanceCSS('home',{id:'perspective',appearance:{surface:'muted',backgroundColor:'#1b3048',imageOpacity:.6,overlayOpacity:.84}});
 expect(css).toContain('[data-page-id="home"][data-page-section="perspective"]');expect(css).toContain('--section-background-surface:#1b3048');expect(css).toContain('--section-background-scrim:84%');expect(css).toContain('--hero-background-scrim-mid:84%');
 expect(publicAssetHeaders(false)).toContain("style-src 'self';");expect(publicAssetHeaders(false)).not.toContain('unsafe-inline');
 expect(()=>sectionAppearanceCSS('bad"]{}',{id:'x',appearance:{surface:'default'}})).toThrow();
});

it('light sections remap and validate eyebrow text contrast',async()=>{
 const {sectionAppearanceCSS}=await import('../packages/design-system/presentation.mjs');const {validateTheme,contrast}=await import('../packages/design-system/theme-validation.mjs');const {readFileSync}=await import('node:fs');const theme=JSON.parse(readFileSync('packages/design-system/themes/advisory.json','utf8'));
 expect(sectionAppearanceCSS('home',{id:'insights',appearance:{surface:'muted',colorScheme:'light'}})).toContain('--color-eyebrow-text:var(--color-light-eyebrow-text)');
 const color=(role:string)=>theme.primitiveColors[theme.semanticColors[role]];expect(contrast(color('lightEyebrowText'),color('lightSurfaceMuted'))).toBeGreaterThanOrEqual(4.5);
 expect(theme.semanticColors.lightSurfaceMuted).toBe(theme.semanticColors.surfaceMuted);
 const bad=structuredClone(theme);bad.semanticColors.lightEyebrowText=theme.semanticColors.lightSurfaceMuted;expect(()=>validateTheme(bad)).toThrow(/contrast/);
});
