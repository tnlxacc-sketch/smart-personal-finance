// M Personal Finance — financial goals editor.
// Uses existing S.goals storage only; no schema/key/formula changes.
(function(){
  const n=v=>{const x=Number(String(v??'').replace(/,/g,''));return Number.isFinite(x)?x:0};
  const money=v=>'฿'+Math.round(n(v)).toLocaleString('th-TH');
  function ensure(){if(typeof S!=='undefined'&&!Array.isArray(S.goals))S.goals=[]}
  function persist(){if(typeof save==='function')save();if(typeof render==='function')render();setTimeout(mount,0)}
  function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
  function goals(){ensure();return (S.goals||[]).slice()}
  function row(g){const t=n(g.target),c=n(g.current),pc=t?Math.min(100,Math.max(0,c/t*100)):0;return `<div class="item" style="margin-top:9px"><div class="itemtop"><div><b>${esc(g.name||'เป้าหมาย')}</b><div class="sub">${money(c)} / ${money(t)} • ${Math.round(pc)}%</div></div><div><button class="btn ghost" type="button" onclick="mpfEditGoal('${esc(g.id)}')">แก้ไข</button> <button class="btn danger" type="button" onclick="mpfDeleteGoal('${esc(g.id)}')">ลบ</button></div></div><div style="height:9px;background:#ede6dc;border-radius:999px;overflow:hidden;margin-top:8px"><div style="height:100%;width:${pc}%;background:var(--g)"></div></div></div>`}
  function mount(){
    const page=document.getElementById('future');if(!page)return;ensure();
    let card=document.getElementById('mpfGoalsEditor');
    if(!card){card=document.createElement('div');card.className='card';card.id='mpfGoalsEditor';const before=document.getElementById('whatIfCard');before?page.insertBefore(card,before):page.appendChild(card)}
    const gs=goals();
    card.innerHTML=`<div class="itemtop"><div><h2 style="margin-bottom:2px">เป้าหมายการเงิน</h2><div class="sub">ตั้งเป้าหมายและติดตามความคืบหน้า</div></div><button class="btn gold" type="button" onclick="mpfAddGoal()">+ เพิ่ม</button></div>${gs.length?gs.map(row).join(''):'<div class="sub" style="padding:14px 0;text-align:center">ยังไม่มีเป้าหมายการเงิน</div>'}`;
  }
  window.mpfAddGoal=function(){
    ensure();const name=prompt('ชื่อเป้าหมาย เช่น รถใหม่ / บ้าน / ท่องเที่ยว');if(!name||!name.trim())return;
    const target=n(prompt('ยอดเป้าหมาย (บาท)','0'));if(target<=0){alert('กรุณาใส่ยอดเป้าหมายมากกว่า 0');return}
    const current=Math.max(0,n(prompt('มีเงินสำหรับเป้าหมายนี้แล้ว (บาท)','0')));
    S.goals.push({id:Date.now().toString(36)+Math.random().toString(36).slice(2,6),name:name.trim(),target,current});persist();
  };
  window.mpfEditGoal=function(id){
    ensure();const g=S.goals.find(x=>String(x.id)===String(id));if(!g)return;
    const name=prompt('ชื่อเป้าหมาย',g.name||'');if(name===null||!name.trim())return;
    const target=n(prompt('ยอดเป้าหมาย (บาท)',String(n(g.target))));if(target<=0){alert('กรุณาใส่ยอดเป้าหมายมากกว่า 0');return}
    const current=Math.max(0,n(prompt('มีเงินสำหรับเป้าหมายนี้แล้ว (บาท)',String(n(g.current)))));
    g.name=name.trim();g.target=target;g.current=current;persist();
  };
  window.mpfDeleteGoal=function(id){ensure();if(!confirm('ลบเป้าหมายนี้?'))return;S.goals=S.goals.filter(x=>String(x.id)!==String(id));persist()};
  function apply(){mount()}
  if(typeof render==='function'&&!window.__mpfGoalsWrapped){const base=render;window.render=function(){base();setTimeout(apply,0)};window.__mpfGoalsWrapped=true}
  apply();
})();
