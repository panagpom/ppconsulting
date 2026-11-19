/** Pure publication and URL helpers; safe to import in a browser bundle. */
export function localizedValue(record,locale,project) {
  if(locale===project.locale){const {translations,...base}=record;return structuredClone(base);}
  const translation=record.translations[locale];
  if(!translation)return null;
  const {translations,...base}=record;
  return structuredClone({...base,...translation,publishAt:translation.publishAt,...('updatedAt' in base?{updatedAt:translation.updatedAt}:{})});
}
export function isPublished(record,now) {
 return !!record && record.status==='published' && (!record.publishAt || Date.parse(record.publishAt)<=Date.parse(now));
}
/** Select from already localized and public articles. Older records use publication as their date. */
export function latestArticleDigest(articles) {
 const date=article=>Date.parse(article.createdAt??article.publishAt);
 return [...articles].sort((a,b)=>date(b)-date(a)||a.contentId.localeCompare(b.contentId)).slice(0,5);
}
export function requiredPage(page,project) {
 return ['home','contact','offerings',...(project.articles?['insights']:[])].includes(page._template)||page.contentId==='privacy';
}
export function joinPath(locale,...parts) {return '/'+[locale,...parts].filter(Boolean).join('/');}
export function activeRecords(source,locale,project) {
 const visible=list=>list.map(record=>localizedValue(record,locale,project)).filter(record=>isPublished(record,source.now));
 const pages=visible(source.pages), offerings=visible(source.offerings), people=visible(source.people);
 const authorIds=new Set(people.map(r=>r.contentId)),offeringIds=new Set(offerings.map(r=>r.contentId));
 const articles=project.articles?visible(source.articles).filter(a=>(!a.authorId||authorIds.has(a.authorId))&&(!a.offeringId||offeringIds.has(a.offeringId))):[];
 return {pages,offerings,people,articles};
}
