// Clarify Quick Guide wording only. No finance logic changes.
(function(){
 function apply(){
  const dash=document.getElementById('dash');
  if(!dash)return;
  const cards=dash.querySelectorAll(':scope > .card');
  let q=null;
  cards.forEach(c=>{const h=c.querySelector('h2');if(h&&h.textContent.includes('Quick Guide'))q=c});
  if(!q)return;
  const rows=q.querySelectorAll('.row');
  rows.forEach(r=>{
    const b=r.querySelector('b'); if(!b)return;
    if(b.textContent.includes('ตั้งค่า')){
      const sub=r.querySelector('.sub');
      if(sub)sub.textContent='เงินสำหรับใช้จ่าย/เดือน (หลังแยกเงินออมแล้ว) + ค่าใช้จ่ายประจำ + ค่าใช้จ่ายรายปี';
    }
  });
  let warn=q.querySelector('.warn');
  if(warn)warn.innerHTML='<b>เงินที่ใช้ได้ในเดือน</b> = เงินสำหรับใช้จ่าย/เดือน หลังแยกเงินออมแล้ว − ค่าใช้จ่ายประจำ − ค่าใช้จ่ายรายปีเฉลี่ยต่อเดือน<br><span style="font-weight:400">ค่าใช้จ่ายประจำคือยอดที่กำหนดไว้เพื่อหักออกก่อน เพื่อให้รู้ว่าเหลือเงินใช้จริงเท่าไหร่ และช่วยควบคุมไม่ให้ใช้เกินเงินที่เหลือ</span>';
 }
 if(typeof render==='function'&&!window.__qgCopyWrapped){const base=render;window.render=function(){base();setTimeout(apply,0)};window.__qgCopyWrapped=true}
 apply();
})();