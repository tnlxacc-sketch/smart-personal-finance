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

// IMPORTANT: manual screenshots must use synthetic demo data only.
// This isolated browser profile never imports or reads any real user's finance data.
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
      {id:'demo-t1',type:'expense',amount:280,cat:'อาหาร',date:'05/09/2026',note:'อาหารกลางวัน'},
      {id:'demo-t2',type:'expense',amount:650,cat:'เดินทาง',date:'04/09/2026',note:'เติมน้ำมัน'},
      {id:'demo-t3',type:'income',amount:2200,cat:'รายได้เสริม',date:'03/09/2026',note:'งานพิเศษ'},
      {id:'demo-t4',type:'expense',amount:890,cat:'ช้อปปิ้ง',date:'02/09/2026',note:'ของใช้ในบ้าน'},
      {id:'demo-t5',type:'expense',amount:120,cat:'กาแฟ',date:'01/09/2026',note:'เครื่องดื่ม'}
    ]
  };
  localStorage.setItem('spfm_public_v1',JSON.stringify(demo));
});
await page.reload({waitUntil:'domcontentloaded',timeout:120000});
await waitApp();

await tab('dash'); await expandAll(); await shot('01-dashboard-overview');

const guideBtn=page.locator('header button').filter({hasText:'วิธีใช้'}).first();
if(await guideBtn.count()){await guideBtn.click();await page.waitForTimeout(400);await shot('02-quick-guide',false);const close=page.locator('#guide button').filter({hasText:'ปิด'}).first();if(await close.count())await close.click();}

const settingsBtn=page.locator('header button').last();
await settingsBtn.click(); await page.waitForTimeout(500); await expandAll(); await shot('03-settings',true);
const setClose=page.locator('#settings button').filter({hasText:'ปิด'}).first(); if(await setClose.count())await setClose.click();

await tab('quick'); await shot('04-add-transaction',true);
await tab('hist'); await expandAll(); await shot('05-history-analysis',true);
await tab('position'); await expandAll(); await shot('06-assets-debts',true);
await tab('future'); await expandAll(); await shot('07-future-what-if',true);

await tab('dash');
const installCard=page.locator('#mpfInstallCard');
if(await installCard.count() && await installCard.isVisible()) await shot('08-pwa-install',false);

await browser.close();
console.log(`Saved screenshots to ${OUT} using synthetic DEMO data only.`);
