// Simplify Financial Health into plain-language, actionable Thai. Presentation only.
(function(){
  function num(s){const m=String(s||'').match(/-?\d+(?:\.\d+)?/);return m?Number(m[0]):0}
  function statusCash(v){return v<0?['ใช้เกินแผน','red']:v<10?['ค่อนข้างต่ำ','red']:v<20?['พอใช้','']:['ดี','green']}
  function statusSave(v){return v<10?['ควรเพิ่ม','red']:v<20?['พอใช้','']:['ดี','green']}
  function statusDebt(v){return v>40?['ค่อนข้างสูง','red']:v>30?['เริ่มสูง','']:['อยู่ในระดับดี','green']}
  function apply(){
    const sec=document.querySelector('[data-fh="health"]');if(!sec)return;
    const head=sec.querySelector('.itemtop span');if(head){const h=head.querySelector('h2');const sub=head.querySelector('.sub');if(h)h.textContent='สุขภาพการเงินของฉัน';if(sub)sub.textContent='ดูแล้วรู้ทันทีว่าควรระวังอะไร'}
    const body=sec.querySelector('.fhbody');if(!body)return;
    const rows=[...body.querySelectorAll('.row')];
    const cash=num(rows[0]?.querySelector('b')?.textContent),save=num(rows[1]?.querySelector('b')?.textContent),debt=num(rows[2]?.querySelector('b')?.textContent);
    const cs=statusCash(cash),ss=statusSave(save),ds=statusDebt(debt);
    let note='ภาพรวมยังพอควบคุมได้';
    if(debt>40)note='จุดที่ควรระวัง: ภาระผ่อนค่อนข้างสูง ควรคิดให้รอบคอบก่อนเพิ่มหนี้ใหม่';
    else if(cash<10)note='จุดที่ควรระวัง: เงินเหลือหลังแผนค่อนข้างต่ำ ควรเผื่อสภาพคล่องเพิ่ม';
    else if(save<10)note='จุดที่ควรปรับ: เงินออมยังต่ำ ควรเพิ่มเงินออมเมื่อทำได้';
    body.innerHTML=`<div class="row"><span>เงินเหลือหลังแผน</span><span style="text-align:right"><b>${cash.toFixed(1)}%</b><div class="sub ${cs[1]}">${cs[0]}</div></span></div><div class="row"><span>อัตราออม</span><span style="text-align:right"><b>${save.toFixed(1)}%</b><div class="sub ${ss[1]}">${ss[0]}</div></span></div><div class="row"><span>ภาระผ่อน</span><span style="text-align:right"><b>${debt.toFixed(1)}%</b><div class="sub ${ds[1]}">${ds[0]}</div></span></div><div class="${debt>40||cash<10||save<10?'warn':'ok'}" style="margin-top:10px">${note}</div>`;
  }
  if(typeof render==='function'&&!window.__healthSimpleWrapped){const base=render;window.render=function(){base();apply()};window.__healthSimpleWrapped=true}
  apply();
})();