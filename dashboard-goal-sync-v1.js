// M Personal Finance — keep Dashboard financial goal in sync with Future goal editor.
// Presentation sync only; reads existing S.goals and does not change storage/schema/formulas.
(function(){
  const n=v=>{const x=Number(String(v??'').replace(/,/g,''));return Number.isFinite(x)?x:0};
  const money=v=>'฿'+Math.round(n(v)).toLocaleString('th-TH');
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  function goal(){
    if(typeof S==='undefined'||!Array.isArray(S.goals))return null;
    return S.goals.filter(g=>n(g.target)>0).map(g=>({...g,left:Math.max(0,n(g.target)-n(g.current))})).sort((a,b)=>a.left-b.left)[0]||null;
  }
  function section(){
    const root=document.getElementById('dashV2');if(!root)return null;
    return [...root.querySelectorAll('.dv2-sec')].find(s=>s.querySelector('.dv2-head b')?.textContent.trim()==='เป้าหมายการเงิน')||null;
  }
  function paint(){
    const sec=section();if(!sec)return;
    const g=goal();
    let body=sec.querySelector('.mpf-goal-live');
    if(!body){
      [...sec.children].forEach((el,i)=>{if(i>0)el.remove()});
      body=document.createElement('div');body.className='mpf-goal-live';sec.appendChild(body);
    }
    if(!g){body.innerHTML='<div class="sub">ยังไม่มีเป้าหมายการเงิน</div>';return;}
    const pc=n(g.target)?Math.min(100,Math.max(0,n(g.current)/n(g.target)*100)):0;
    body.innerHTML=`<div class="dv2-row"><div><div class="dv2-goal-name">${esc(g.name||'เป้าหมาย')}</div><div class="dv2-goal-meta">${money(g.current)} / ${money(g.target)}</div></div><b>${Math.round(pc)}%</b></div><div class="dv2-progress"><i style="width:${pc}%"></i></div>`;
  }
  function after(fn){if(typeof window[fn]!=='function'||window[fn].__mpfGoalSync)return;const base=window[fn];const wrap=function(){const r=base.apply(this,arguments);setTimeout(paint,0);return r};wrap.__mpfGoalSync=true;window[fn]=wrap}
  ['mpfAddGoal','mpfEditGoal','mpfDeleteGoal','fhAddGoal','fhDelGoal'].forEach(after);
  document.addEventListener('click',e=>{const b=e.target.closest?.('[data-p="dash"]');if(b)setTimeout(paint,30)},true);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)setTimeout(paint,0)});
  window.addEventListener('pageshow',()=>setTimeout(paint,0));
  const obs=new MutationObserver(()=>{if(document.getElementById('dashV2'))setTimeout(paint,0)});obs.observe(document.documentElement,{childList:true,subtree:true});
  setTimeout(paint,0);
})();
