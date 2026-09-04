// Restores the richer finance dashboard without replacing the user's existing data or core screens.
(function(){
  const OPEN_KEY='spfm_ui_open_v1';
  function n(v){const x=Number(v||0);return Number.isFinite(x)?x:0}
  function money(v){return typeof fm==='function'?fm(v):'฿'+Math.round(n(v)).toLocaleString('th-TH')}
  function pct(v){return (Number.isFinite(v)?v:0).toFixed(1)+'%'}
  function monthTx(){return typeof txMonth==='function'?txMonth():[]}
  function actualRemain(){
    const p=typeof plan==='function'?plan():{remain:0};
    const tm=monthTx();
    const inc=typeof sum==='function'?sum(tm.filter(x=>x.type==='income'),'amount'):0;
    const ex=typeof sum==='function'?sum(tm.filter(x=>x.type==='expense'),'amount'):0;
    return n(p.remain)+inc-ex;
  }
  function metrics(){
    const p=typeof plan==='function'?plan():{inc:0,ex:0,an:0,remain:0};
    const a=typeof ac==='function'?ac():{total:0,liq:0,inv:0,em:0,debt:0,net:0};
    const saving=(typeof S!=='undefined'&&S.profile)?n(S.profile.saving):0;
    const inflow=n(p.inc)+saving;
    const sr=inflow?saving/inflow*100:0;
    const debtPay=(typeof S!=='undefined'&&Array.isArray(S.debts)&&typeof sum==='function')?sum(S.debts,'payment'):0;
    const dr=n(p.inc)?debtPay/n(p.inc)*100:0;
    const base=n(p.ex)+n(p.an);
    const em=base?n(a.em)/base:0;
    const rem=actualRemain();
    const cfr=n(p.inc)?rem/n(p.inc)*100:0;
    const target=(typeof S!=='undefined'&&S.profile)?n(S.profile.emerTarget)||6:6;
    const cashScore=Math.max(0,Math.min(35,cfr<=0?0:cfr>=20?35:cfr/20*35));
    const saveScore=Math.max(0,Math.min(25,sr>=20?25:sr/20*25));
    const debtScore=Math.max(0,Math.min(20,dr<=20?20:dr>=50?0:(50-dr)/30*20));
    const emerScore=Math.max(0,Math.min(20,target?Math.min(1,em/target)*20:0));
    return {p,a,saving,inflow,sr,dr,em,target,rem,cfr,score:Math.round(cashScore+saveScore+debtScore+emerScore),debtPay};
  }
  function openState(id,def=true){
    try{const s=JSON.parse(localStorage.getItem(OPEN_KEY)||'{}'); return Object.prototype.hasOwnProperty.call(s,id)?!!s[id]:def}catch(e){return def}
  }
  function setOpen(id,v){
    try{const s=JSON.parse(localStorage.getItem(OPEN_KEY)||'{}');s[id]=!!v;localStorage.setItem(OPEN_KEY,JSON.stringify(s))}catch(e){}
  }
  function section(id,title,subtitle,body,def=true){
    const open=openState(id,def);
    return `<div class="card fhsec" data-fh="${id}"><div class="itemtop" style="cursor:pointer" onclick="fhToggle('${id}')"><span><h2 style="margin-bottom:2px">${title}</h2>${subtitle?`<div class="sub">${subtitle}</div>`:''}</span><button class="btn ghost" type="button" aria-label="ย่อหรือขยาย">${open?'▲ ย่อ':'▼ เปิด'}</button></div><div class="fhbody" style="display:${open?'block':'none'};margin-top:10px">${body}</div></div>`;
  }
  window.fhToggle=function(id){
    const sec=document.querySelector(`[data-fh="${id}"]`);if(!sec)return;
    const body=sec.querySelector('.fhbody'),btn=sec.querySelector('button');
    const next=body.style.display==='none';body.style.display=next?'block':'none';btn.textContent=next?'▲ ย่อ':'▼ เปิด';setOpen(id,next);
  };
  function ensureGoals(){if(typeof S!=='undefined'&&!Array.isArray(S.goals))S.goals=[]}
  function goalHtml(){
    ensureGoals();
    const g=(S.goals||[]).slice().sort((a,b)=>n(a.target)-n(a.current)- (n(b.target)-n(b.current)));
    if(!g.length)return `<div class="sub" style="text-align:center;padding:12px">ยังไม่มีเป้าหมาย</div><button class="btn gold" style="width:100%" onclick="fhAddGoal()">+ เพิ่มเป้าหมาย</button>`;
    return g.map(x=>{const target=n(x.target),cur=n(x.current),left=Math.max(0,target-cur),pc=target?Math.min(100,cur/target*100):0;return `<div class="item"><div class="itemtop"><span><b>${x.name||'เป้าหมาย'}</b><div class="sub">สะสม ${money(cur)} จาก ${money(target)}</div></span><button class="btn danger" onclick="fhDelGoal('${x.id}')">ลบ</button></div><div style="height:8px;background:#eef2f7;border-radius:999px;overflow:hidden;margin:8px 0"><div style="height:100%;width:${pc}%;background:var(--g)"></div></div><div class="row"><span>ยังขาด</span><b>${money(left)}</b></div></div>`}).join('')+`<button class="btn gold" style="width:100%;margin-top:8px" onclick="fhAddGoal()">+ เพิ่มเป้าหมาย</button>`;
  }
  window.fhAddGoal=function(){
    ensureGoals();
    const name=prompt('ชื่อเป้าหมาย เช่น รถใหม่ / ปลูกบ้าน / เงินเที่ยว');if(!name)return;
    const target=Number(String(prompt('ยอดเป้าหมาย (บาท)','0')||'0').replace(/,/g,''))||0;
    const current=Number(String(prompt('มีเงินสำหรับเป้าหมายนี้แล้ว (บาท)','0')||'0').replace(/,/g,''))||0;
    S.goals.push({id:Date.now().toString(36),name,target,current});if(typeof save==='function')save();if(typeof render==='function')render();
  };
  window.fhDelGoal=function(id){if(!confirm('ลบเป้าหมายนี้?'))return;ensureGoals();S.goals=S.goals.filter(x=>x.id!==id);if(typeof save==='function')save();if(typeof render==='function')render()};
  function decision(m){
    const out=[];
    if(m.rem<0)out.push(`<div class="warn">⚠ ใช้เกินแผน ${money(Math.abs(m.rem))} เดือนนี้ ควรชะลอภาระใหม่ก่อน</div>`);
    else if(m.cfr<10)out.push(`<div class="warn">เงินเหลือตามแผนค่อนข้างต่ำ ${pct(m.cfr)} ของรายรับ การเพิ่มค่างวดใหม่จะทำให้สภาพคล่องตึง</div>`);
    else out.push(`<div class="ok">กระแสเงินสดยังเป็นบวก เหลือ ${money(m.rem)} หรือ ${pct(m.cfr)} ของรายรับ</div>`);
    if(m.em<m.target)out.push(`<div class="warn" style="margin-top:8px">เงินสำรองฉุกเฉินครอบคลุม ${m.em.toFixed(1)} เดือน เป้าหมาย ${m.target} เดือน ยังขาดประมาณ ${money(Math.max(0,(m.target-m.em)*(n(m.p.ex)+n(m.p.an))))}</div>`);
    else out.push(`<div class="ok" style="margin-top:8px">เงินสำรองฉุกเฉินถึงเป้าหมายแล้ว ${m.em.toFixed(1)} เดือน</div>`);
    if(m.dr>40)out.push(`<div class="warn" style="margin-top:8px">ภาระผ่อนอยู่ที่ ${pct(m.dr)} ของรายรับ ควรระวังการเพิ่มหนี้ใหม่</div>`);
    if(m.sr<10)out.push(`<div class="warn" style="margin-top:8px">อัตราออมจากเงินไหลเข้ารวม ${pct(m.sr)} ค่อนข้างต่ำ</div>`);
    return out.join('');
  }
  function mount(){
    const dash=document.getElementById('dash');if(!dash)return;
    let wrap=document.getElementById('fhRestore');
    if(!wrap){wrap=document.createElement('div');wrap.id='fhRestore';dash.appendChild(wrap)}
    const m=metrics();
    const health=`<div class="row"><span>เงินเหลือ / รายรับ</span><b>${pct(m.cfr)}</b></div><div class="row"><span>อัตราออมจากเงินไหลเข้ารวม</span><b>${pct(m.sr)}</b></div><div class="row"><span>ภาระผ่อน / รายรับ</span><b>${pct(m.dr)}</b></div><div class="row"><span>คะแนนสุขภาพการเงิน*</span><b>${m.score}/100</b></div><div class="sub" style="margin-top:7px">*คะแนนเป็นตัวช่วยดูแนวโน้มจาก Cash Flow, เงินสำรอง, ภาระหนี้ และการออม</div>`;
    const pos=`<div class="grid g2"><div class="item"><div class="sub">เงินสด/เงินฝากพร้อมใช้</div><b style="font-size:20px">${money(m.a.liq)}</b></div><div class="item"><div class="sub">เงินลงทุน</div><b style="font-size:20px">${money(m.a.inv)}</b></div><div class="item"><div class="sub">ทรัพย์สินรวมทั้งหมด</div><b style="font-size:20px">${money(m.a.total)}</b></div><div class="item"><div class="sub">หนี้ทั้งหมด</div><b style="font-size:20px">${money(m.a.debt)}</b></div></div><div class="row" style="margin-top:7px"><span><b>มูลค่าทรัพย์สินสุทธิ</b><div class="sub">ทรัพย์สินรวมทั้งหมด − หนี้สินรวมทั้งหมด</div></span><b>${money(m.a.net)}</b></div>`;
    const need=Math.max(0,(m.target-m.em)*(n(m.p.ex)+n(m.p.an)));
    const emer=`<div class="row"><span>เงินที่กำหนดเป็น Emergency</span><b>${money(m.a.em)}</b></div><div class="row"><span>ครอบคลุมค่าใช้จ่าย</span><b>${m.em.toFixed(1)} เดือน</b></div><div style="height:9px;background:#eef2f7;border-radius:999px;overflow:hidden;margin:8px 0"><div style="height:100%;width:${Math.min(100,m.target?m.em/m.target*100:0)}%;background:var(--g)"></div></div><div class="sub">เป้าหมาย ${m.target} เดือน ${need>0?'• ยังขาดประมาณ '+money(need):'• ถึงเป้าหมายแล้ว'}</div>`;
    wrap.innerHTML=section('health','Financial Health','สุขภาพการเงิน',health,true)+section('position','ฐานะทั้งหมด','Financial Position',pos,true)+section('emergency','เงินสำรองฉุกเฉิน','Protection',emer,true)+section('goals','เป้าหมายที่ใกล้ที่สุด','Goals',goalHtml(),true)+section('assistant','ระบบวิเคราะห์ให้','Decision Assistant',decision(m),true);
  }
  function makeFutureCollapsible(){
    const page=document.getElementById('future');if(!page)return;
    [...page.children].forEach((el,i)=>{
      if(!el.classList.contains('card')||el.dataset.folded==='1')return;
      el.dataset.folded='1';
      const h=el.querySelector('h2');if(!h)return;
      const id=el.id||('futurecard'+i);if(!el.id)el.id=id;
      const btn=document.createElement('button');btn.className='btn ghost';btn.type='button';btn.textContent='▲ ย่อ';btn.style.float='right';
      const nodes=[...el.childNodes].filter(n=>n!==h);
      const body=document.createElement('div');body.className='futureFoldBody';nodes.forEach(n=>body.appendChild(n));
      const head=document.createElement('div');head.className='itemtop';h.parentNode&&h.parentNode.removeChild(h);head.appendChild(h);head.appendChild(btn);el.insertBefore(head,el.firstChild);el.appendChild(body);
      const open=openState(id,true);body.style.display=open?'block':'none';btn.textContent=open?'▲ ย่อ':'▼ เปิด';
      btn.onclick=function(){const next=body.style.display==='none';body.style.display=next?'block':'none';btn.textContent=next?'▲ ย่อ':'▼ เปิด';setOpen(id,next)};
    });
  }
  function apply(){ensureGoals();mount();setTimeout(makeFutureCollapsible,0)}
  if(typeof render==='function'&&!window.__fhWrapped){window.__fhWrapped=true;const baseRender=render;render=function(){baseRender();apply()}}
  apply();
})();