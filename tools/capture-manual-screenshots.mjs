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
async function expandAll(root='body'){
  const btns=page.locator(`${root} .fold-btn`);
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
async function elementShot(locator,name){
  if(await locator.count()){
    try{await locator.first().scrollIntoViewIfNeeded();await page.waitForTimeout(250);await locator.first().screenshot({path:`${OUT}/${name}.png`});return true}catch{}
  }
  return false;
}
async function captureReport(fnName,name){
  const html=await page.evaluate((fnName)=>{
    window.__manualReportHtml='';
    const oldOpen=window.open;
    window.open=()=>({
      document:{open(){},write(h){window.__manualReportHtml=h},close(){}},
      focus(){},print(){}
    });
    try{if(typeof window[fnName]==='function')window[fnName]()}finally{window.open=oldOpen}
    return window.__manualReportHtml||'';
  },fnName);
  if(!html)return false;
  const rp=await context.newPage();
  await rp.setViewportSize({width:794,height:1123});
  await rp.setContent(html,{waitUntil:'domcontentloaded'});
  await rp.screenshot({path:`${OUT}/${name}.png`,fullPage:true});
  await rp.close();
  return true;
}

await page.goto(url,{waitUntil:'domcontentloaded',timeout:120000});
await waitApp();

// IMPORTANT: screenshots use a brand-new isolated browser context with synthetic DEMO data only.
// No real user's localStorage, amounts, assets, debts, transactions or backup files are read.
await page.evaluate(()=>{
  const demo={
    profile:{name:'M Personal Finance • DEMO',income:38500,saving:4500,emerTarget:6,initialized:true},
    plans:[
      {id:'demo-p1',name:'ค่าเช่าบ้าน',amount:9500},
      {id:'demo-p2',name:'ค่าเดินทาง',amount:3200},
      {id:'demo-p3',name:'โทรศัพท์/อินเทอร์เน็ต',amount:1200},
      {id:'demo-p4',name:'ค่าอาหารประจำ',amount:5800},
      {id:'demo-p5',name:'ช่วยครอบครัว',amount:3000}
    ],
    annual:[
      {id:'demo-a1',name:'ประกันรถ',amount:18000},
      {id:'demo-a2',name:'ประกันสุขภาพ',amount:24000},
      {id:'demo-a3',name:'ภาษี/ค่าบำรุงรายปี',amount:12000}
    ],
    assets:[
      {id:'demo-as1',name:'บัญชีเงินฝาก A',kind:'พร้อมใช้',value:95000},
      {id:'demo-as2',name:'กองทุนตัวอย่าง',kind:'ลงทุน',value:210000},
      {id:'demo-as3',name:'เงินสำรองฉุกเฉิน',kind:'Emergency',value:65000},
      {id:'demo-as4',name:'บ้านตัวอย่าง',kind:'ทรัพย์สิน',value:2800000}
    ],
    debts:[
      {id:'demo-d1',name:'สินเชื่อบ้านตัวอย่าง',balance:1250000,payment:12500,rate:4.25}
    ],
    goals:[
      {id:'demo-g1',name:'ท่องเที่ยวปลายปี',target:60000,current:18000,monthly:3000}
    ],
    tx:[
      {id:'demo-t1',type:'expense',amount:280,cat:'อาหาร',date:'2026-09-05',note:'อาหารกลางวัน'},
      {id:'demo-t2',type:'expense',amount:650,cat:'เดินทาง',date:'2026-09-04',note:'เติมน้ำมัน'},
      {id:'demo-t3',type:'income',amount:2200,cat:'รายได้เสริม',date:'2026-09-03',note:'งานพิเศษ'},
      {id:'demo-t4',type:'expense',amount:890,cat:'ช้อปปิ้ง',date:'2026-09-02',note:'ของใช้ในบ้าน'},
      {id:'demo-t5',type:'expense',amount:120,cat:'กาแฟ',date:'2026-09-01',note:'เครื่องดื่ม'}
    ]
  };
  localStorage.setItem('spfm_public_v1',JSON.stringify(demo));
  localStorage.setItem('spfm_last_backup_v1','2026-09-01T09:00:00.000Z');
});
await page.reload({waitUntil:'domcontentloaded',timeout:120000});
await waitApp();

// 01 Dashboard
await tab('dash'); await expandAll(); await shot('01-dashboard-overview');

// 02 Quick Guide
const guideBtn=page.locator('header button').filter({hasText:'วิธีใช้'}).first();
if(await guideBtn.count()){
  await guideBtn.click();await page.waitForTimeout(400);
  await shot('02-quick-guide',false);
  const close=page.locator('#guide button').filter({hasText:'ปิด'}).first();if(await close.count())await close.click();
}

// 03 Settings — force the scrollable sheet fully open so the manual contains every settings section.
const settingsBtn=page.locator('header button').last();
await settingsBtn.click(); await page.waitForTimeout(500); await expandAll('#settings');
await page.evaluate(()=>{
  const m=document.querySelector('#settings'),s=document.querySelector('#settings .sheet');
  if(m){m.style.position='absolute';m.style.alignItems='flex-start';m.style.minHeight='100vh';m.style.height='auto';}
  if(s){s.style.maxHeight='none';s.style.height='auto';s.style.overflow='visible';s.style.margin='0 auto';}
});
await page.waitForTimeout(300);
await shot('03-settings-complete',true);

// Separate settings screenshots for an easy-to-read manual.
await elementShot(page.locator('#settings .sheet').first(),'03a-settings-all-fields');
let recurring=page.getByText('ค่าใช้จ่ายประจำ',{exact:false}).first();
if(await recurring.count()){
  const card=recurring.locator('xpath=ancestor::*[contains(@class,"card")][1]');
  await elementShot(card,'03b-settings-recurring-expenses');
}
let annual=page.getByText('ค่าใช้จ่ายรายปี',{exact:false}).first();
if(await annual.count()){
  const card=annual.locator('xpath=ancestor::*[contains(@class,"card")][1]');
  await elementShot(card,'03c-settings-annual-expenses');
}
let backupTxt=page.getByText(/สำรองข้อมูล|Backup/i).first();
if(await backupTxt.count()){
  let box=backupTxt.locator('xpath=ancestor::*[contains(@class,"card")][1]');
  if(!(await box.count()))box=backupTxt.locator('xpath=..');
  await elementShot(box,'03d-backup-restore');
}

// Restore settings modal to normal and close it.
await page.evaluate(()=>{
  const m=document.querySelector('#settings'),s=document.querySelector('#settings .sheet');
  if(m){m.style.position='';m.style.alignItems='';m.style.minHeight='';m.style.height='';}
  if(s){s.style.maxHeight='';s.style.height='';s.style.overflow='';s.style.margin='';}
});
const setClose=page.locator('#settings button').filter({hasText:'ปิด'}).first(); if(await setClose.count())await setClose.click();

// 04 Transaction entry
await tab('quick'); await shot('04-add-transaction',true);

// 05 History + export controls
await tab('hist'); await expandAll(); await shot('05-history-analysis',true);
const histExport=page.locator('#hist .rc-export').first();
await elementShot(histExport,'05a-export-monthly-pdf-csv-buttons');

// 06 Assets/debts + export controls
await tab('position'); await expandAll(); await shot('06-assets-debts',true);
const posExport=page.locator('#position .rc-export').first();
await elementShot(posExport,'06a-export-position-pdf-button');

// 07 Future / What-if
await tab('future'); await expandAll(); await shot('07-future-what-if',true);

// 08 PWA install
await tab('dash');
const installCard=page.locator('#mpfInstallCard');
if(await installCard.count() && await installCard.isVisible()) await shot('08-pwa-install',false);

// 09/10 Actual report pages generated by the app's real PDF/export functions.
await captureReport('rcExportMonthlyPdf','09-pdf-monthly-report-example');
await captureReport('rcExportPositionPdf','10-pdf-financial-position-example');

await browser.close();
console.log(`Saved complete manual screenshots to ${OUT} using synthetic DEMO data only.`);
