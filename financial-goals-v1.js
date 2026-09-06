// M Personal Finance — financial goals editor and cross-page goal sync.
// Uses existing S.goals storage only; no schema/key/formula changes.
(function(){
  const n=v=>{const x=Number(String(v??'').replace(/,/g,''));return Number.isFinite(x)?x:0};
  const money=v=>'฿'+Math.round(n(v)).toLocaleString('th-TH');
  function ensure(){if(typeof S!=='undefined'&&!Array.isArray(S.goals))S.goals=[]}
  function persist(){if(typeof save==='function')save();if(typeof render==='function')render();setTimeout(apply,0)}
  function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
  function goals(){ensure();return (S.goals||[]).slice()}
  function row(g){const t=n(g.target),c=n(g.current),pc=t?Math.min(100,Math.max(0,c/t*100)):0;return `<div class="item" style="margin-top:9px"><div class="itemtop"><div><b>${esc(g.name||'เป้าหมาย')}</b><div class="sub">${money(c)} / ${money(t)} • ${Math.round(pc)}%</div></div><div><button class="btn ghost" type="button" onclick="mpfEditGoal('${esc(g.id)}')">แก้ไข</button> <button class="btn danger" type="button" onclick="mpfDeleteGoal('${esc(g.id)}')">ลบ</button></div></div><div style="height:9px;background:#ede6dc;border-radius:999px;overflow:hidden;margin-top:8px"><div style="height:100%;width:${pc}%;background:var(--g)"></div></div></div>`}

  function hideDuplicateFutureSummary(){
    const marker=document.getElementById('fSave');
    const card=marker?.closest('.card');
    if(card)card.style.display='none';
  }

  function mount(){
    const page=document.getElementById('future');if(!page)return;ensure();
    let card=document.getElementById('mpfGoalsEditor');
    if(!card){card=document.createElement('div');card.className='card';card.id='mpfGoalsEditor';const before=document.getElementById('whatIfCard');before?page.insertBefore(card,before):page.appendChild(card)}
    const gs=goals();
    card.innerHTML=`<div class="itemtop"><div><h2 style="margin-bottom:2px">เป้าหมายการเงิน</h2><div class="sub">ตั้งเป้าหมายและติดตามความคืบหน้า</div></div><button class="btn gold" type="button" onclick="mpfAddGoal()">+ เพิ่ม</button></div>${gs.length?gs.map(row).join(''):'<div class="sub" style="padding:14px 0;text-align:center">ยังไม่มีเป้าหมายการเงิน</div>'}`;
  }

  function guessType(name){
    const s=String(name||'').toLowerCase();
    if(s.includes('รถ')||s.includes('car'))return 'car';
    if(s.includes('บ้าน')||s.includes('home')||s.includes('house'))return 'home';
    return 'other';
  }

  function syncWhatIfGoals(){
    const card=document.getElementById('whatIfCard');if(!card)return;ensure();
    let wrap=document.getElementById('wfGoalWrap');
    if(!wrap){
      wrap=document.createElement('label');wrap.id='wfGoalWrap';wrap.style.display='block';wrap.style.marginBottom='9px';
      const sub=card.querySelector('.sub');
      if(sub)sub.insertAdjacentElement('afterend',wrap);else card.prepend(wrap);
    }
    const gs=goals().filter(g=>n(g.target)>0);
    const current=document.getElementById('wfGoal')?.value||'';
    wrap.innerHTML=`ใช้เป้าหมายจากเมนูอนาคต<select id="wfGoal" onchange="mpfUseGoal(this.value)"><option value="">— เลือกเป้าหมาย —</option>${gs.map(g=>`<option value="${esc(g.id)}"${String(g.id)===String(current)?' selected':''}>${esc(g.name||'เป้าหมาย')} • ${money(g.current)} / ${money(g.target)}</option>`).join('')}</select>`;
  }

  function dashboardSection(){
    const root=document.getElementById('dashV2');if(!root)return null;
    return Array.from(root.querySelectorAll('.dv2-sec')).find(s=>s.querySelector('.dv2-head b')?.textContent.trim()==='เป้าหมายการเงิน')||null;
  }

  function syncDashboardGoals(){
    const sec=dashboardSection();if(!sec)return;
    let body=sec.querySelector('.mpf-goal-live');
    if(!body){
      Array.from(sec.children).forEach((el,i)=>{if(i>0)el.remove()});
      body=document.createElement('div');body.className='mpf-goal-live';sec.appendChild(body);
    }
    const gs=goals().filter(g=>n(g.target)>0);
    if(!gs.length){body.innerHTML='<div class="sub">ยังไม่มีเป้าหมายการเงิน</div>';return;}
    body.innerHTML=gs.slice(0,3).map(g=>{
      const pc=Math.min(100,Math.max(0,n(g.current)/n(g.target)*100));
      return `<div style="margin-top:10px"><div class="dv2-row"><div><div class="dv2-goal-name">${esc(g.name||'เป้าหมาย')}</div><div class="dv2-goal-meta">${money(g.current)} / ${money(g.target)}</div></div><b>${Math.round(pc)}%</b></div><div class="dv2-progress"><i style="width:${pc}%"></i></div></div>`;
    }).join('')+(gs.length>3?`<div class="sub" style="margin-top:8px">และอีก ${gs.length-3} เป้าหมาย • ดูทั้งหมดที่เมนูอนาคต</div>`:'');
  }

  window.mpfUseGoal=function(id){
    ensure();if(!id)return;
    const g=S.goals.find(x=>String(x.id)===String(id));if(!g)return;
    const type=document.getElementById('wfType');if(type)type.value=guessType(g.name);
    const price=document.getElementById('wfPrice');if(price)price.value=n(g.target)?Math.round(n(g.target)).toLocaleString('en-US'):'';
    const cash=document.getElementById('wfCash');if(cash)cash.value=n(g.current)?Math.round(n(g.current)).toLocaleString('en-US'):'';
    const loan=document.getElementById('wfLoan');if(loan)loan.value='';
    if(typeof futureMode==='function')futureMode();
    if(typeof futureCalc==='function')futureCalc();
  };

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

  function apply(){hideDuplicateFutureSummary();mount();syncWhatIfGoals();syncDashboardGoals()}
  if(typeof render==='function'&&!window.__mpfGoalsWrapped){const base=render;window.render=function(){base();setTimeout(apply,0)};window.__mpfGoalsWrapped=true}
  document.addEventListener('click',e=>{if(e.target.closest?.('[data-p="dash"],[data-p="future"]'))setTimeout(apply,30)},true);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)setTimeout(apply,0)});
  window.addEventListener('pageshow',()=>setTimeout(apply,0));
  const obs=new MutationObserver(()=>{if(document.getElementById('future')||document.getElementById('dashV2'))setTimeout(apply,0)});obs.observe(document.documentElement,{childList:true,subtree:true});
  apply();
})();
