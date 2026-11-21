export function formProtection(project,preview=false){
 if(preview||project.infrastructure.publicFormsEnabled===false)return {mode:'unavailable',siteKey:''};
 if(project.environment==='local')return {mode:'local',siteKey:''};
 const siteKey=project.infrastructure.turnstileSiteKey??'';
 return {mode:siteKey?'turnstile':'unavailable',siteKey};
}
