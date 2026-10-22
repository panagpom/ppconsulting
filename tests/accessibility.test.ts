import {it,expect} from 'vitest';
import {settingsSchema} from '../packages/content/schemas.mjs';
import {DEFAULT_PREFERENCES,parsePreferences,readPreferences,savePreferences,preferenceKey} from '../packages/accessibility/preferences.mjs';
import {readContent} from '../packages/content/read.mjs';
import {localizeContent} from '../packages/content/localize.mjs';
import {parseProject} from '../packages/config/project.mjs';
import {readFileSync} from 'node:fs';
it('accepts only bounded appearance values and falls back safely on malformed persisted state',()=>{
 expect(parsePreferences({version:1,textSize:4,contrast:2})).toMatchObject({textSize:4,contrast:2});
 for(const value of [null,[],{version:2,textSize:4},{version:1,textSize:99},{version:1,contrast:'red;}'},{version:1,reduceMotion:'true'},{version:1,extra:'unknown'}])expect(parsePreferences(value)).toEqual(DEFAULT_PREFERENCES);
 expect(preferenceKey('ppconsulting')).not.toBe(preferenceKey('other-app'));
});
it('persists only appearance choices and handles unavailable browser storage',()=>{
 const values=new Map<string,string>();const store={getItem:(k:string)=>values.get(k)??null,setItem:(k:string,v:string)=>{values.set(k,v)},removeItem:(k:string)=>{values.delete(k)}};
 const key=preferenceKey('ppconsulting');expect(readPreferences(store,key)).toEqual(DEFAULT_PREFERENCES);expect(savePreferences(store,key,{...DEFAULT_PREFERENCES,textSize:2})).toBe(true);expect(readPreferences(store,key).textSize).toBe(2);
 expect(savePreferences(store,key,DEFAULT_PREFERENCES)).toBe(true);expect(values.has(key)).toBe(false);
 const blocked={getItem(){throw Error('blocked')},setItem(){throw Error('blocked')},removeItem(){throw Error('blocked')}};expect(readPreferences(blocked,key)).toEqual(DEFAULT_PREFERENCES);expect(savePreferences(blocked,key,DEFAULT_PREFERENCES)).toBe(false);
});
it('settings control launcher placement consistently across languages',()=>{
 const project=parseProject(JSON.parse(readFileSync('project.json','utf8')));const snapshot=readContent(process.cwd(),project);const settings=settingsSchema.parse({...snapshot.settings,accessibility:{enabled:true,position:'right-middle'}});snapshot.settings=settings;
 for(const locale of ['en','el'])expect(localizeContent(snapshot,locale,project).settings.accessibility).toEqual({enabled:true,position:'right-middle'});
 expect(()=>settingsSchema.parse({...snapshot.settings,accessibility:{enabled:true,position:'anywhere'}})).toThrow();
});
