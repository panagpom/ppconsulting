import type {Collection} from 'tinacms';
import type {ProjectConfig} from '../../packages/config/project.mjs';
import registry from '../../packages/design-system/themes.generated.json';
import {validateTheme} from '../../packages/design-system/theme-validation.mjs';
export function theme(project:ProjectConfig):Collection {
 const active=(registry as Record<string,any>)[project.design.theme],hidden=(name:string)=>({name,type:'string' as const,ui:{component:'hidden'}});
 return {name:'theme',label:'Theme colours',path:'packages/design-system/themes',format:'json',match:{include:project.design.theme},ui:{global:true,allowedActions:{create:false,delete:false,createFolder:false,createNestedFolder:false},beforeSubmit:async({values}:any)=>{validateTheme(values);return values;}},fields:[hidden('label'),hidden('description'),{name:'primitiveColors',label:'Palette',type:'object',fields:Object.keys(active.primitiveColors).map(name=>({name,type:'string',required:true,ui:{component:'color',colorFormat:'hex'}}))},...['semanticColors','fonts','layout'].map(name=>({name,type:'object' as const,ui:{component:'hidden'},fields:Object.keys(active[name]).map(hidden)})),hidden('radius'),{name:'sectionSpace',type:'number',ui:{component:'hidden'}},{name:'mobileSectionSpace',type:'number',ui:{component:'hidden'}}]};
}
