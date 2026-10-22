// Finite presentation preferences only; never store personal data or arbitrary CSS.
export const DEFAULT_PREFERENCES=Object.freeze({version:1,textSize:0,contrast:0,links:false,spacing:0,lineHeight:0,reduceMotion:false,hideImages:false,readableFont:false,largePointer:false,alignment:0,saturation:0,largePanel:false});
const limits={textSize:4,contrast:2,spacing:2,lineHeight:2,alignment:3,saturation:2};
export function parsePreferences(raw){
 const fallback=()=>({...DEFAULT_PREFERENCES});
 if(!raw||typeof raw!=='object'||Array.isArray(raw)||raw.version!==1||Object.keys(raw).some(k=>!Object.hasOwn(DEFAULT_PREFERENCES,k)))return fallback();
 for(const [key,value]of Object.entries(raw)){if(key==='version')continue;if(key in limits){if(!Number.isInteger(value)||value<0||value>limits[key])return fallback();}else if(typeof value!=='boolean')return fallback();}
 return {...DEFAULT_PREFERENCES,...raw};
}
export const preferenceKey=name=>'accessibility:'+name+':v1';
export function readPreferences(storage,key){try{const raw=storage?.getItem(key);return raw?parsePreferences(JSON.parse(raw)):{...DEFAULT_PREFERENCES};}catch{return {...DEFAULT_PREFERENCES};}}
export function savePreferences(storage,key,state){try{if(!storage)return false;const value=parsePreferences(state);if(Object.keys(DEFAULT_PREFERENCES).every(k=>value[k]===DEFAULT_PREFERENCES[k]))storage.removeItem(key);else storage.setItem(key,JSON.stringify(value));return true;}catch{return false;}}
