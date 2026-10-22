import {it,expect} from 'vitest';
import {chromium} from '@playwright/test';
const base=process.env.SITE_TEST_URL;
it.skipIf(!base)('floating controls are keyboard operable, persistent, resettable and support both languages',async()=>{
 const browser=await chromium.launch({headless:true});try{for(const locale of ['en','el']){
  const context=await browser.newContext({viewport:{width:1440,height:950},reducedMotion:'reduce'});const page=await context.newPage();await page.goto(base+'/'+locale);
  expect(await page.locator('[data-accessibility-open]').count()).toBe(1);const opener=page.locator('[data-accessibility-open]');await opener.waitFor({state:'visible'});await opener.focus();await page.keyboard.press('Enter');expect(await page.locator('[data-accessibility-dialog]').evaluate((e:any)=>e.open)).toBe(true);
  await page.locator('[data-a11y-control="textSize"]').click();expect(await page.locator('html').getAttribute('data-a11y-text-size')).toBe('1');await page.locator('[data-a11y-control="contrast"]').click();expect(await page.locator('html').getAttribute('data-a11y-contrast')).toBe('1');await page.locator('[data-a11y-control="links"]').click();await page.locator('[data-a11y-control="reduceMotion"]').click();
  await page.keyboard.press('Escape');expect(await opener.evaluate(e=>e===document.activeElement)).toBe(true);await page.goto(base+'/'+locale+'/contact');await page.locator('[data-accessibility-open]').waitFor({state:'visible'});expect(await page.locator('html').getAttribute('data-a11y-text-size')).toBe('1');expect(await page.locator('html').getAttribute('data-a11y-contrast')).toBe('1');
  await page.locator('[data-accessibility-open]').click();await page.locator('[data-accessibility-reset]').click();expect(await page.locator('html').getAttribute('data-a11y-text-size')).toBe('0');expect(await page.evaluate(()=>localStorage.getItem('accessibility:ppconsulting:v1'))).toBeNull();await context.close();
 }}finally{await browser.close();}
},30000);

it.skipIf(!base)('Greek FAQ reflows at 320px with 200% text and maximum spacing',async()=>{
 const browser=await chromium.launch({headless:true});const context=await browser.newContext({viewport:{width:320,height:950},reducedMotion:'reduce'});try{
 await context.addInitScript(()=>localStorage.setItem('accessibility:ppconsulting:v1',JSON.stringify({version:1,textSize:4,spacing:2,lineHeight:2,readableFont:true})));
 const page=await context.newPage();for(const path of ['/el','/el/about']){await page.goto(base+path);await page.waitForFunction(()=>document.documentElement.dataset.a11yTextSize==='4');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}
 }finally{await browser.close();}
},15000);

it.skipIf(!base)('blocked storage stays functional and keyboard focus remains inside the native panel',async()=>{
 const browser=await chromium.launch({headless:true});const context=await browser.newContext({viewport:{width:320,height:950},reducedMotion:'reduce'});try{
 await context.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw Error('blocked')}}));const page=await context.newPage();await page.goto(base+'/en/contact');await page.locator('[data-accessibility-open]').click();
 await page.keyboard.press('Shift+Tab');expect(await page.locator('[data-accessibility-reset]').evaluate(e=>e===document.activeElement)).toBe(true);await page.keyboard.press('Tab');
 for(let i=0;i<18;i++){await page.keyboard.press('Tab');expect(await page.locator('[data-accessibility-dialog]').evaluate(e=>e.contains(document.activeElement))).toBe(true);}
 await page.locator('[data-a11y-control="contrast"]').click();expect(await page.locator('[data-accessibility-status]').innerText()).toContain('storage is unavailable');expect(await page.locator('html').getAttribute('data-a11y-contrast')).toBe('1');await page.keyboard.press('Escape');expect(await page.locator('[data-accessibility-open]').evaluate(e=>e===document.activeElement)).toBe(true);
 }finally{await browser.close();}
},15000);

it.skipIf(!base)('display controls change computed styles and preferences synchronize across tabs',async()=>{
 const browser=await chromium.launch({headless:true});const context=await browser.newContext({viewport:{width:1440,height:950},reducedMotion:'reduce'});try{
 const page=await context.newPage();await page.goto(base+'/en');await page.locator('[data-accessibility-open]').waitFor({state:'visible'});await page.evaluate(()=>{window.scrollTo(0,450);document.dispatchEvent(new Event('scroll'));});expect(await page.locator('[data-accessibility-open]').evaluate(e=>getComputedStyle(e).visibility)).toBe('visible');await page.locator('[data-accessibility-open]').click();
 const click=(key:string)=>page.locator('[data-a11y-control="'+key+'"]').click();const style=(selector:string,property:string)=>page.locator(selector).first().evaluate((e,p)=>getComputedStyle(e).getPropertyValue(p),property);
 await click('textSize');expect(await style('html','font-size')).toBe('20px');await click('spacing');expect(parseFloat(await style('main p','letter-spacing'))).toBeGreaterThan(0);await click('lineHeight');expect(parseFloat(await style('main p','line-height'))).toBeGreaterThan(parseFloat(await style('main p','font-size')));await click('links');expect(await style('main a','text-decoration-line')).toBe('underline');await click('readableFont');expect(await style('main h1','font-family')).toBe(await style('body','font-family'));await click('hideImages');expect(await style('.hero-background','visibility')).toBe('hidden');await click('saturation');expect(await style('main img','filter')).toBe('saturate(0.45)');await click('alignment');expect(await style('main h1','text-align')).toBe('left');await click('largePointer');expect(await style('body','cursor')).toContain('accessibility-cursor.svg');
 const before=await page.locator('[data-accessibility-dialog]').evaluate(e=>e.getBoundingClientRect().width);await click('largePanel');expect(await page.locator('[data-accessibility-dialog]').evaluate(e=>e.getBoundingClientRect().width)).toBeGreaterThan(before);await page.locator('[data-accessibility-reset]').click();await page.keyboard.press('Escape');
 const second=await context.newPage();await second.goto(base+'/en/contact');await second.locator('[data-accessibility-open]').waitFor({state:'visible'});await page.locator('[data-accessibility-open]').click();await click('links');await second.waitForFunction(()=>document.documentElement.dataset.a11yLinks==='1');await page.locator('[data-accessibility-reset]').click();await second.waitForFunction(()=>document.documentElement.dataset.a11yLinks==='0');
 }finally{await browser.close();}
},20000);

it.skipIf(!process.env.SITE_STATIC_TEST_URL)('public controls and newsletter initialize under the strict static CSP without eval violations',async()=>{
 const browser=await chromium.launch({headless:true});const context=await browser.newContext({reducedMotion:'reduce'});try{
 await context.addInitScript(()=>{(window as any).__policyViolations=[];document.addEventListener('securitypolicyviolation',event=>(window as any).__policyViolations.push(event.effectiveDirective+':'+event.blockedURI));});const page=await context.newPage();const response=await page.goto(process.env.SITE_STATIC_TEST_URL+'/en');expect(response?.headers()['content-security-policy']).toContain("script-src 'self'");await page.locator('[data-visitor-experience] [data-newsletter-open]').first().waitFor({state:'visible'});await page.locator('[data-accessibility-open]').click();await page.locator('[data-a11y-control="contrast"]').click();expect(await page.evaluate(()=>(window as any).__policyViolations)).toEqual([]);
 }finally{await browser.close();}
},15000);
