// Clarify Quick Guide wording only. No finance logic changes.
(function(){
 function applyDash(){
  const dash=document.getElementById('dash'); if(!dash)return;
  let q=null; dash.querySelectorAll(':scope > .card').forEach(c=>{const h=c.querySelector('h2');if(h&&h.textContent.includes('Quick Guide'))q=c});
  if(!q)return;
  q.querySelectorAll('.row').forEach(r=>{
    const b=r.querySelector('b'),sub=r.querySelector('.sub'); if(!b||!sub)return;
    if(b.textContent.includes('ตั้งค่า')) sub.textContent='เงินสำหรับใช้จ่าย/เดือน (หลังแยกเงินออมแล้ว) + ค่าใช้จ่ายประจำ + ค่าใช้จ่ายรายปี';
    if(b.textContent.includes('ปุ่ม +')) sub.textContent='บันทึกรายรับ/รายจ่ายเพิ่มเติม ที่ไม่ได้รวมไว้ในรายได้ประจำหรือค่าใช้จ่ายประจำ';
  });
  const warn=q.querySelector('.warn');
  if(warn)warn.innerHTML='<b>เงินที่ใช้ได้ในเดือน</b> = เงินสำหรับใช้จ่าย/เดือน หลังแยกเงินออมแล้ว − ค่าใช้จ่ายประจำ − ค่าใช้จ่ายรายปีเฉลี่ยต่อเดือน<br><span style="font-weight:400">ค่าใช้จ่ายประจำคือยอดที่กำหนดไว้ให้หักออกก่อน ส่วนปุ่ม + ใช้บันทึกเงินเข้า/เงินออกเพิ่มเติมที่เกิดขึ้นจริงนอกเหนือจากรายการประจำ</span>';
 }
 function applyGuide(){
  const g=document.getElementById('guide'); if(!g)return;
  const cards=g.querySelectorAll('.card');
  cards.forEach(c=>{
    const h=c.querySelector('h3'),sub=c.querySelector('.sub'); if(!h||!sub)return;
    if(h.textContent.includes('1. PLAN')){
      h.textContent='1. ตั้งค่าฐานการเงิน';
      sub.textContent='ใส่เงินสำหรับใช้จ่าย/เดือนหลังแยกเงินออมแล้ว กำหนดค่าใช้จ่ายประจำ และค่าใช้จ่ายรายปี เพื่อให้ระบบคำนวณว่าเหลือเงินใช้จริงเท่าไหร่';
    }
    if(h.textContent.includes('2. ACTUAL')){
      h.textContent='2. บันทึกรายการเพิ่มเติม';
      sub.innerHTML='กด <b>+</b> เฉพาะรายรับหรือรายจ่ายที่ <b>นอกเหนือจากรายการประจำที่ตั้งค่าไว้แล้ว</b><br><br><b>รายรับเพิ่มเติม</b> เช่น ถูกหวย โบนัส เงินคืน หรือรายได้พิเศษ<br><b>รายจ่ายเพิ่มเติม</b> เช่น ค่าข้าว ค่าเที่ยว ของใช้ ช้อปปิ้ง หรือค่าใช้จ่ายอื่นที่ไม่ได้ฟิกซ์ไว้ในค่าใช้จ่ายประจำ<br><br>ไม่ต้องบันทึกรายได้ประจำหรือค่าใช้จ่ายประจำซ้ำอีก';
    }
    if(h.textContent.includes('3. HISTORY')){
      h.textContent='3. ประวัติรายการเพิ่มเติม';
      sub.textContent='ดูรายการรายรับ/รายจ่ายเพิ่มเติมย้อนหลัง กรองตามเดือน ประเภท และหมวด พร้อมดูสรุปและกราฟค่าใช้จ่าย';
    }
    if(h.textContent.includes('4. POSITION')){
      h.textContent='4. เงินทั้งหมด';
      sub.textContent='รวมเงินฝาก เงินลงทุน ทรัพย์สิน และหนี้ เพื่อให้เห็นภาพรวมฐานะการเงินและมูลค่าทรัพย์สินสุทธิของตัวเอง';
    }
  });
 }
 function apply(){applyDash();applyGuide()}
 if(typeof render==='function'&&!window.__qgCopyWrapped){const base=render;window.render=function(){base();setTimeout(apply,0)};window.__qgCopyWrapped=true}
 const oldGuide=window.guide;
 if(typeof oldGuide==='function'&&!window.__qgGuideWrapped){window.guide=function(x){oldGuide(x);if(x)setTimeout(applyGuide,0)};window.__qgGuideWrapped=true}
 apply();
})();