import { chromium } from 'playwright';
import fs from 'node:fs';

const OUT='manual-screenshots';
fs.mkdirSync(OUT,{recursive:true});
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:430,height:932},deviceScaleFactor:1,isMobile:true,hasTouch:true});
const page=await context.newPage();
const url='https://tnlxacc-sketch.github.io/smart-personal-finance/';

async function waitApp(){
  await page.waitForLoadState('networkidle').catch(()=>{});
  await page.waitForTimeout(2500);
}
async function shot(name,fullPage=true){
  await page.screenshot({path:`${OUT}/${name}.png`,fullPage});
}
async function tab(id){
  const b=page.locator(`.tabs button[data-p="${id}"]`);
  await b.click();
  await page.waitForTimeout(700);
}
async function expandAll(){
  const btns=page.locator('.fold-btn');
  const n=await btns.count();
  for(let i=0;i<n;i++){
    const b=btns.nth(i);
    try{
      const txt=(await b.innerText()).trim();
      if(/ดูรายละเอียด|แสดง|เปิด|เพิ่มเติม|ดูทั้งหมด|ขยาย/.test(txt)) await b.click();
    }catch{}
  }
  await page.waitForTimeout(500);
}

await page.goto(url,{waitUntil:'domcontentloaded',timeout:120000});
await waitApp();

// Use representative demo values only inside this isolated browser profile.
await page.evaluate(()=>{
  const key='spfm_public_v1';
  let s={};
  try{s=JSON.parse(localStorage.getItem(key)||'{}')||{}}catch{}
  s.profile={...(s.profile||{}),name:'M Personal Finance',income:46000,saving:8000,emerTarget:6,initialized:true};
  if(!Array.isArray(s.plans)||!s.plans.length)s.plans=[
    {id:'p1',name:'ค่าบ้าน',amount:15000},{id:'p2',name:'ค่าเดินทาง',amount:3500},{id:'p3',name:'โทรศัพท์/อินเทอร์เน็ต',amount:1500},{id:'p4',name:'ค่าใช้จ่ายครอบครัว',amount:6500}
  ];
  if(!Array.isArray(s.annual)||!s.annual.length)s.annual=[
    {id:'a1',name:'ประกันชีวิต',amount:50000},{id:'a2',name:'ประกันรถ',amount:25000}
  ];
  if(!Array.isArray(s.assets)||!s.assets.length)s.assets=[
    {id:'as1',name:'เงินฝากธนาคาร',kind:'พร้อมใช้',value:180000},
    {id:'as2',name:'หุ้นและกองทุน',kind:'ลงทุน',value:420000},
    {id:'as3',name:'เงินสำรองฉุกเฉิน',kind:'Emergency',value:120000},
    {id:'as4',name:'บ้าน',kind:'ทรัพย์สิน',value:6500000}
  ];
  if(!Array.isArray(s.debts)||!s.debts.length)s.debts=[
    {id:'d1',name:'สินเชื่อบ้าน',balance:1600000,payment:20000,rate:5}
  ];
  if(!Array.isArray(s.goals))s.goals=[];
  if(!Array.isArray(s.tx))s.tx=[];
  localStorage.setItem(key,JSON.stringify(s));
});
await page.reload({waitUntil:'domcontentloaded',timeout:120000});
await waitApp();

await tab('dash'); await expandAll(); await shot('01-dashboard-overview');

// Quick Guide modal
const guideBtn=page.locator('header button').filter({hasText:'วิธีใช้'}).first();
if(await guideBtn.count()){await guideBtn.click();await page.waitForTimeout(400);await shot('02-quick-guide',false);await page.keyboard.press('Escape').catch(()=>{});const close=page.locator('#guide button').filter({hasText:'ปิด'}).first();if(await close.count())await close.click();}

// Settings modal
const settingsBtn=page.locator('header button').last();
await settingsBtn.click(); await page.waitForTimeout(500); await expandAll(); await shot('03-settings',true);
const setClose=page.locator('#settings button').filter({hasText:'ปิด'}).first(); if(await setClose.count())await setClose.click();

await tab('quick'); await shot('04-add-transaction',true);
await tab('hist'); await expandAll(); await shot('05-history-analysis',true);
await tab('position'); await expandAll(); await shot('06-assets-debts',true);
await tab('future'); await expandAll(); await shot('07-future-what-if',true);

// Capture install card when visible on web.
await tab('dash');
const installCard=page.locator('#mpfInstallCard');
if(await installCard.count() && await installCard.isVisible()) await shot('08-pwa-install',false);

await browser.close();
console.log(`Saved screenshots to ${OUT}`);
