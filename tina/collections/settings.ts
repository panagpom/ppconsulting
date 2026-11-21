import {newsletterFields} from '../fields/newsletter';
import {createElement as h} from 'react';
import {getDisabledDomainPages} from '../../packages/content/domain-registry.mjs';
import type { ProjectConfig } from '../../packages/config/project.mjs';
import { navigationLabels } from '../fields/section-copy';
import { NavigationControls } from '../fields/navigation';
import { text, object } from '../fields/common';
import { contactFields, socialFields } from '../fields/contact';
import { rich } from '../fields/rich-text';
import { collection } from './common';
export function settings(p: ProjectConfig) {
  const disabledPageFiles=[...getDisabledDomainPages(p).map(page=>page.filename),...(!p.articles?['insights.json']:[])];
  const navigation=()=>({...navigationLabels(),label:'Main navigation',ui:{component:(props:any)=>h(NavigationControls,{...props,disabledPageFiles,languages:p.languages,defaultLocale:p.locale})}});
  const translated = [
    ...newsletterFields(p,{translated:true}),
    object('brand', [text('tagline')]),
    object('legal', [rich('notice')]),
    object('contact', contactFields().filter(field => field.name === 'address')),
    navigation(),
  ];
  return {
    ...collection(
      'settings',
      'content/settings',
      [
        {name:'accessibility',label:'Accessibility controls',type:'object',description:'Visitor presentation preferences. These controls do not replace accessibility checks of the underlying site.',fields:[{name:'enabled',label:'Show accessibility controls',type:'boolean'},{name:'position',label:'Desktop launcher position',type:'string',options:[{value:'right-middle',label:'Right middle'},{value:'right-bottom',label:'Right bottom'}],description:'Small screens always use right bottom.'}]},
        ...newsletterFields(p),
        object('brand', [text('name'), text('tagline'),
          {name:'logo',label:'Logo',type:'image'},
          {name:'logoRetina',label:'Logo (2×)',type:'image',description:'Optional higher-resolution version of the same logo.'},
        ]),
        object('legal', [
          text('businessName'),
          text('privacyVersion'),
          rich('notice'),
        ]),
        object('contact', contactFields()),
        { ...object('social', socialFields()), label: 'Social channels' },
        navigation(),
        object(
          'translations',
          p.languages
            .filter((l) => l.code !== p.locale)
            .map((l) => ({
              ...object(l.code.replaceAll('-', '_'), translated),
              label: l.label,
            })),
        ),
      ],
      p,
      true,
    ),
    match: { include: 'site' },
  };
}
