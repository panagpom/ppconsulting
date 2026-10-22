export interface AccessibilityPreferences {version:1;textSize:number;contrast:number;links:boolean;spacing:number;lineHeight:number;reduceMotion:boolean;hideImages:boolean;readableFont:boolean;largePointer:boolean;alignment:number;saturation:number;largePanel:boolean}
export interface PreferenceStorage {getItem(key:string):string|null;setItem(key:string,value:string):void;removeItem(key:string):void}
export const DEFAULT_PREFERENCES:Readonly<AccessibilityPreferences>;
export function parsePreferences(raw:unknown):AccessibilityPreferences;
export function preferenceKey(name:string):string;
export function readPreferences(storage:PreferenceStorage|null|undefined,key:string):AccessibilityPreferences;
export function savePreferences(storage:PreferenceStorage|null|undefined,key:string,state:AccessibilityPreferences):boolean;
