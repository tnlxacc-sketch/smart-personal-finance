// Future what-if simulator. Read-only against the user's real finance data.
(function(){
  function n(v){
    const x=Number(String(v||'').replace(/,/g,''));
    return Number.isFinite(x)?x:0;
  }
  function money(v){
    return typeof fm==='function'?fm(v):new Intl.NumberFormat('th-TH',{style:'currency',currency:'THB',maximumFractionDigits:0}).format(v||0);
  }
  function pct(v){return (Number.isFinite(v)?v:0).toFixed(1)+'%'}
  function payment(principal,annualRate,years){
    principal=n(principal); annualRate=n(annualRate); years=n(years);
    if(principal<=0||years<=0)return 0;
    const months=Math.round(years*12), r=annualRate/100/12;
    if(!r)return principal/months;
    return principal*r*Math.pow(1+r,months)/(Math.pow(1+r,months)-1);
  }
  function current(){
    const p=typeof plan==='function'?plan():{inc:0,ex:0,an:0,remain:0};
    const a=typeof ac==='function'?ac():{liq:0,em:0,debt:0,total:0,net:0};
    const debtPay=(typeof S!=='undefined'&&Array.isArray(S.debts)&&typeof sum==='function')?sum(S.debts,'payment'):0;
    const saving=(typeof S!=='undefined'&&S.profile)?n(S.profile.saving):0;
    const base=n(p.ex)+n(p.an);
    return {p,a,debtPay,saving,emMonths:base?n(a.em)/base:0};
  }
  function field(id,label,placeholder,type){
    if(type==='select') return `<label>${label}<select id="${id}" onchange="futureMode();futureCalc()"><option value="car">ซื้อรถ</option><option value="home">ซื้อ/ปลูกบ้าน</option><option value="prepay">โปะบ้าน/โปะหนี้</option><option value="other">ภาระใหม่อื่น ๆ</option></select></label>`;
    return `<label>${label}<input id="${id}" class="money" inputmode="decimal" placeholder="${placeholder||'0'}" oninput="if(typeof moneyTyping==='function')moneyTyping(this);futureCalc()"></label>`;
  }
  function mount(){
    const page=document.getElementById('future');
    if(!page||document.getElementById('whatIfCard'))return;
    const card=document.createElement('div');
    card.className='card'; card.id='whatIfCard';
    card.innerHTML=`
      <h2>ลองแผนก่อนตัดสินใจ • What-if</h2>
      <div class="sub" style="margin-bottom:9px">ใช้ข้อมูลการเงินจริงในเครื่องมาช่วยวิเคราะห์ แต่การลองแผนตรงนี้จะไม่แก้ไขยอดเงินจริงและไม่สร้างหนี้จริง</div>
      <div class="grid g2">
        ${field('wfType','ต้องการลองเรื่องอะไร','','select')}
        ${field('wfPrice','ราคา/งบทั้งหมด','เช่น 1,500,000')}
        ${field('wfCash','เงินสดที่จะจ่ายทันที','เช่น เงินดาวน์ / เงินโปะ')}
        ${field('wfLoan','วงเงินกู้หรือหนี้ใหม่','เว้นว่างให้ระบบคำนวณจากราคา - เงินสด')}
        ${field('wfRate','ดอกเบี้ยต่อปี (%)','เช่น 3.25')}
        ${field('wfYears','ระยะเวลาผ่อน (ปี)','เช่น 7')}
        ${field('wfPayment','ค่างวด/ภาระเพิ่มต่อเดือน','เว้นว่างให้ระบบคำนวณจากวงเงินกู้')}
        ${field('wfExtra','ค่าใช้จ่ายเพิ่มต่อเดือน','เช่น ค่าน้ำมัน/ค่าส่วนกลาง')}
      </div>
      <div id="wfPrepayHelp" class="sub" style="display:none;margin-top:8px">กรณีโปะหนี้: ใส่ “เงินสดที่จะจ่ายทันที” เป็นยอดโปะ และใส่ “ค่างวด/ภาระเพิ่มต่อเดือน” เฉพาะกรณีค่างวดหลังโปะเปลี่ยน ระบบจะไม่เดาเงื่อนไขธนาคารให้เอง</div>
      <div id="wfResult" style="margin-top:10px"></div>
      <button class="btn ghost" style="width:100%;margin-top:8px" onclick="futureReset()">ล้างตัวเลขทดลอง</button>`;
    page.appendChild(card);
    window.futureMode();
    window.futureCalc();
  }
  window.futureMode=function(){
    const t=document.getElementById('wfType'),help=document.getElementById('wfPrepayHelp');
    if(help)help.style.display=t&&t.value==='prepay'?'block':'none';
  };
  window.futureCalc=function(){
    const box=document.getElementById('wfResult'); if(!box)return;
    const c=current();
    const type=document.getElementById('wfType')?.value||'car';
    const price=n(document.getElementById('wfPrice')?.value);
    const cash=n(document.getElementById('wfCash')?.value);
    let loan=n(document.getElementById('wfLoan')?.value);
    const rate=n(document.getElementById('wfRate')?.value);
    const years=n(document.getElementById('wfYears')?.value);
    const manualPay=n(document.getElementById('wfPayment')?.value);
    const extra=n(document.getElementById('wfExtra')?.value);
    if(!loan&&type!=='prepay'&&price>0)loan=Math.max(0,price-cash);
    const calcPay=manualPay||payment(loan,rate,years);
    const monthlyAdd=(type==='prepay'?manualPay:calcPay)+extra;
    const remainAfter=n(c.p.remain)-monthlyAdd;
    const debtPayAfter=c.debtPay+(type==='prepay'?0:calcPay);
    const debtRate=c.p.inc?debtPayAfter/n(c.p.inc)*100:0;
    const liquidAfter=Math.max(0,n(c.a.liq)-cash);
    const base=n(c.p.ex)+n(c.p.an)+monthlyAdd;
    const emerAfter=base?n(c.a.em)/base:0;
    const totalInterest=(loan>0&&calcPay>0&&years>0)?Math.max(0,calcPay*Math.round(years*12)-loan):0;
    let cls='ok',title='✅ แผนนี้ยังมีกระแสเงินสดเหลือ';
    if(remainAfter<0){cls='warn';title='⚠ แผนนี้ทำให้เงินตามแผนติดลบ';}
    else if(c.p.inc&&remainAfter/c.p.inc<0.05){cls='warn';title='⚠ แผนนี้เหลือเงินค่อนข้างบาง';}
    const rows=[];
    rows.push(`<div class="row"><span>เงินเหลือตามแผนก่อนลอง</span><b>${money(c.p.remain)}</b></div>`);
    if(type!=='prepay'){
      if(loan>0)rows.push(`<div class="row"><span>วงเงินกู้/หนี้ใหม่</span><b>${money(loan)}</b></div>`);
      if(calcPay>0)rows.push(`<div class="row"><span>ค่างวดประมาณการ/เดือน</span><b>${money(calcPay)}</b></div>`);
      if(totalInterest>0)rows.push(`<div class="row"><span>ดอกเบี้ยรวมโดยประมาณตลอดสัญญา</span><b>${money(totalInterest)}</b></div>`);
    }
    if(cash>0)rows.push(`<div class="row"><span>เงินพร้อมใช้หลังจ่ายเงินก้อน</span><b>${money(liquidAfter)}</b></div>`);
    if(extra>0)rows.push(`<div class="row"><span>ค่าใช้จ่ายเพิ่ม/เดือน</span><b>${money(extra)}</b></div>`);
    rows.push(`<div class="row"><span>เงินเหลือหลังรับภาระใหม่</span><b class="${remainAfter<0?'red':''}">${money(remainAfter)}</b></div>`);
    rows.push(`<div class="row"><span>ภาระผ่อนต่อรายรับหลังลอง</span><b>${pct(debtRate)}</b></div>`);
    rows.push(`<div class="row"><span>เงินฉุกเฉินรองรับหลังลอง</span><b>${emerAfter.toFixed(1)} เดือน</b></div>`);
    box.innerHTML=`<div class="${cls}"><b>${title}</b><div class="sub" style="margin-top:5px">คำนวณจากข้อมูลปัจจุบันในแอป + ตัวเลขที่ทดลอง โดยไม่บันทึกเป็นรายการจริง</div></div><div class="card" style="margin-top:9px;margin-bottom:0">${rows.join('')}</div>`;
  };
  window.futureReset=function(){
    ['wfPrice','wfCash','wfLoan','wfRate','wfYears','wfPayment','wfExtra'].forEach(id=>{const e=document.getElementById(id);if(e)e.value='';});
    window.futureCalc();
  };
  function apply(){mount(); if(document.getElementById('whatIfCard'))window.futureCalc();}
  if(typeof render==='function'&&!window.__futureWhatIfWrapped){
    window.__futureWhatIfWrapped=true;
    const baseRender=render;
    render=function(){baseRender();apply();};
  }
  apply();
})();