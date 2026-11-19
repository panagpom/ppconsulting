import type {ZodType} from 'zod';
export interface SectionAppearance {surface:'default'|'muted'|'accent';colorScheme?:'auto'|'light';backgroundColor?:string;backgroundImage?:string;secondaryImage?:string;imageEnabled?:boolean;imagePosition?:string;imagePositionMobile?:string;imageOpacity?:number;imageOpacityMobile?:number;overlayOpacity?:number}
export const appearanceSchema:ZodType<SectionAppearance>;
export function sectionAppearanceCSS(pageId:string,section:{id:string;appearance:unknown}):string;
