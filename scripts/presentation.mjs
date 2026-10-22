import {writeFileSync,readFileSync,existsSync} from 'node:fs';
import {designOptionDeclarations} from '../packages/design-system/design-options.mjs';
import {sectionAppearanceCSS} from '../packages/design-system/presentation.mjs';
export function generatePresentation(project,snapshot){
 const {motion,...design}=project.design;
 const css='/* Generated from project design and canonical Page appearance. */\n:root[data-theme]{'+designOptionDeclarations(design).join('')+(design.radius?'--radius-control:'+design.radius+';':'')+'}\n'+snapshot.pages.flatMap(page=>page.sections.map(section=>sectionAppearanceCSS(page.contentId,section))).join('\n');
 const path='apps/site/public/presentation.css';if(!existsSync(path)||readFileSync(path,'utf8')!==css)writeFileSync(path,css);
}
