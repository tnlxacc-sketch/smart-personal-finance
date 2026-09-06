// Dashboard purpose card + Help wording only. No finance logic/data changes.
(function(){
 function applyDash(){
  const dash=document.getElementById('dash'); if(!dash)return;
  let q=null; dash.querySelectorAll(':scope > .card').forEach(c=>{const h=c.querySelector('h2');if(h&&(h.textContent.includes('Quick Guide')||h.textContent.includes('M Personal Finance ช่วยอะไร?')))q=c});
  if(!q)return;
  q.dataset.mpfPurpose='1';
  const h=q.querySelector('h2');
  h.textContent='M Personal Finance ช่วยอะไร?';
  h.style.margin='0 0 8px';
  let purpose=q.querySelector('.qg-purpose');
  if(!purpose){purpose=document.createElement('div');purpose.className='qg-purpose';h.insertAdjacentElement('afterend',purpose)}
  purpose.style.cssText='margin:0 0 9px;color:#0b1f33;font-size:14px;line-height:1.55';
  purpose.innerHTML='<b>รู้เงินที่ควรใช้จริงในแต่ละเดือน</b><br>หลังแยกเงินออมและกันค่าใช้จ่ายจำเป็นแล้ว พร้อมเห็น <b>ทรัพย์สิน • หนี้ • มูลค่าทรัพย์สินสุทธิ</b> ในที่เดียว';
  q.querySelectorAll('.grid,.row').forEach(el=>{if(!el.closest('.qg-purpose'))el.style.display='none'});
  const warn=q.querySelector('.warn');
  if(warn){warn.style.display='block';warn.innerHTML='<b>เงินใช้ได้</b> = เงินหลังแยกออม − ค่าใช้จ่ายประจำ − ค่าใช้จ่ายรายปีเฉลี่ย<br><span style="font-weight:400"><b>ปุ่ม +</b> บันทึกเฉพาะรายรับ/รายจ่ายเพิ่มเติมจากรายการประจำ</span>'}
 }
 function applyGuide(){
  const g=document.getElementById('guide'); if(!g)return;
  g.querySelectorAll('.card').forEach(c=>{
    const h=c.querySelector('h3'),sub=c.querySelector('.sub'); if(!h||!sub)return;
    if(h.textContent.includes('1. PLAN')||h.textContent.includes('1. ตั้งค่าฐานการเงิน')){h.textContent='1. ตั้งค่าฐานการเงิน';sub.textContent='ใส่เงินหลังแยกออม ค่าใช้จ่ายประจำ และรายปี เพื่อรู้ว่าเหลือเงินใช้จริงเท่าไหร่'}
    if(h.textContent.includes('2. ACTUAL')||h.textContent.includes('2. บันทึกรายการเพิ่มเติม')){h.textContent='2. บันทึกรายการเพิ่มเติม';sub.innerHTML='กด <b>+</b> เฉพาะรายการนอกเหนือจากที่ตั้งไว้ เช่น รายรับพิเศษ/ถูกหวย หรือค่าข้าว ค่าเที่ยว ของใช้ ไม่ต้องบันทึกรายการประจำซ้ำ'}
    if(h.textContent.includes('3. HISTORY')||h.textContent.includes('3. ประวัติรายการเพิ่มเติม')){h.textContent='3. ประวัติ';sub.textContent='ดูรายการเพิ่มเติมย้อนหลัง พร้อมสรุปและกราฟค่าใช้จ่าย'}
    if(h.textContent.includes('4. POSITION')||h.textContent.includes('4. เงินทั้งหมด')){h.textContent='4. เงินทั้งหมด';sub.textContent='รวมเงินฝาก เงินลงทุน ทรัพย์สิน และหนี้ เพื่อเห็นมูลค่าทรัพย์สินสุทธิ'}
  });
 }
 function apply(){applyDash();applyGuide()}
 if(typeof render==='function'&&!window.__qgCopyWrapped){const base=render;window.render=function(){base();setTimeout(apply,0)};window.__qgCopyWrapped=true}
 const oldGuide=window.guide;if(typeof oldGuide==='function'&&!window.__qgGuideWrapped){window.guide=function(x){oldGuide(x);if(x)setTimeout(applyGuide,0)};window.__qgGuideWrapped=true}
 apply();
})();