import {z} from 'zod';
import {parseMediaSource} from '../content/media.mjs';
const optional=schema=>z.preprocess(value=>value==null||value===''?undefined:value,schema.optional());
const position=z.enum(['center','left center','right center','top','bottom','50% 50%','65% center']);
export const appearanceSchema=z.strictObject({surface:z.enum(['default','muted','accent']),colorScheme:z.enum(['auto','light']).optional(),backgroundColor:optional(z.string().regex(/^#[a-f0-9]{6}$/i)),backgroundImage:optional(z.string().refine(value=>{try{parseMediaSource(value);return true;}catch{return false;}},'Choose an original local upload')),imageEnabled:z.boolean().default(false),imagePosition:optional(position),imagePositionMobile:optional(position),imageOpacity:optional(z.number().min(0).max(1)),imageOpacityMobile:optional(z.number().min(0).max(1)),overlayOpacity:optional(z.number().min(0).max(1))});
export function sectionAppearanceCSS(pageId,section){
 if(!/^[a-z][a-z0-9_]{0,79}$/.test(pageId)||!/^[a-z][a-z0-9_]{0,79}$/.test(section.id))throw Error('Unsafe appearance identity');
 const a=appearanceSchema.parse(section.appearance),rules=[];
 if(a.colorScheme==='light')for(const role of ['surface','surface-muted','text-primary','text-muted','eyebrow-text','brand-accent','focus','border','control-border','notice-surface','notice-border'])rules.push('--color-'+role+':var(--color-light-'+(role==='brand-accent'?'accent':role)+')');
 if(a.surface==='muted')rules.push('--section-background-surface:var(--color-surface-muted)');if(a.surface==='accent')rules.push('--section-background-surface:var(--color-notice-surface)');
 if(a.backgroundColor)rules.push('--section-background-surface:'+a.backgroundColor,'--hero-background-surface:'+a.backgroundColor);
 const variables={imageOpacity:['--section-background-opacity','--hero-background-opacity'],imageOpacityMobile:['--section-background-opacity-mobile','--hero-background-opacity-mobile'],overlayOpacity:['--section-background-scrim','--hero-background-scrim-mid','--hero-background-scrim-edge'],imagePosition:['--section-background-position','--hero-background-position'],imagePositionMobile:['--section-background-position-mobile','--hero-background-position-mobile']};
 for(const [key,names] of Object.entries(variables))if(a[key]!==undefined)for(const name of names)rules.push(name+':'+(key==='overlayOpacity'?(a[key]*100)+'%':a[key]));
 return '[data-page-id="'+pageId+'"][data-page-section="'+section.id+'"]{'+rules.join(';')+'}';
}
