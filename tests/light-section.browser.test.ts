import {it,expect} from 'vitest';
import {chromium} from '@playwright/test';
import {contrast} from '../packages/design-system/theme-validation.mjs';
const base=process.env.SITE_TEST_URL;
const hex=(rgb:string)=>'#'+rgb.match(/[\d.]+/g)!.slice(0,3).map(n=>Math.round(Number(n)).toString(16).padStart(2,'0')).join('');
it.skipIf(!base)('article rows and homepage titles have readable contrast in EN/EL at both widths',async()=>{
 const browser=await chromium.launch({headless:true});
 try{for(const width of [1440,375])for(const locale of ['en','el']){
  const page=await browser.newPage({viewport:{width,height:950},reducedMotion:'reduce'});await page.goto(base+'/'+locale+'/insights');
  const section=page.locator('[data-page-section="articles"]');await section.scrollIntoViewIfNeeded();
  const background=await section.evaluate(e=>getComputedStyle(e).backgroundColor);
  for(const selector of ['h2','.article-card h3'])for(const element of await section.locator(selector).all()){
   const foreground=await element.evaluate(e=>getComputedStyle(e).color);expect(contrast(hex(foreground),hex(background))).toBeGreaterThanOrEqual(4.5);
  }
  const card=section.locator('.article-card').first();await card.hover();
  const foreground=await card.locator('h3').evaluate(e=>getComputedStyle(e).color);expect(contrast(hex(foreground),hex(background))).toBeGreaterThanOrEqual(4.5);
  const cards=section.locator('.article-card');
  expect(await cards.evaluateAll(elements=>elements.map(e=>getComputedStyle(e).borderBlockStartWidth))).toEqual(['0px','1px']);
  expect(await cards.nth(1).evaluate(e=>e.getBoundingClientRect().top)).toBeGreaterThan(await card.evaluate(e=>e.getBoundingClientRect().bottom-1));
  await page.goto(base+'/'+locale);
  const digest=page.locator('[data-page-section="insights"]');
  const digestBackground=await digest.evaluate(e=>getComputedStyle(e).backgroundColor);
  for(const heading of await digest.locator('h2,h3').all()){
   const foreground=await heading.evaluate(e=>getComputedStyle(e).color);
   expect(contrast(hex(foreground),hex(digestBackground))).toBeGreaterThanOrEqual(4.5);
  }
  await page.close();
 }}finally{await browser.close();}
},30000);
