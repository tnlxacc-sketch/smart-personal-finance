// History + current-month transaction UX patch. Uses Actual transactions only and preserves existing data schema/storage.
(function(){
  const UIKEY='spfm_ui_history_v1';
  function ui(){try{return JSON.parse(localStorage.getItem(UIKEY)||'{}')}catch(e){return{}}}
  function setUi(k,v){const x=ui();x[k]=v;try{localStorage.setItem(UIKEY,JSON.stringify(x))}catch(e){}}
  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
  function money(v){return typeof fm==='function'?fm(v):'฿'+Number(v||0).toLocaleString('th-TH')}
  function ymNow(){const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')}
  function txYm(x){return String(x&&x.date||'').slice(0,7)}
  function allCats(){
    const out=[];
    if(typeof cats!=='undefined'&&Array.isArray(cats)) cats.forEach(c=>{if(c&&!out.includes(c))out.push(c)});
    if(typeof S!=='undefined'&&Array.isArray(S.tx)) S.tx.forEach(x=>{if(x.cat&&!out.includes(x.cat))out.push(x.cat)});
    return out;
  }
  function injectCss(){
    if(document.getElementById('histUxCss'))return;
    const s=document.createElement('style');s.id='histUxCss';s.textContent=`
      .fold-head{display:flex;align-items:center;justify-content:space-between;gap:8px;cursor:pointer}
      .fold-btn{border:0;background:#eef3f7;color:var(--n);border-radius:9px;padding:7px 10px;font-weight:800}
      .hist-donut{width:170px;height:170px;border-radius:50%;margin:12px auto;position:relative;background:#e5e7eb}
      .hist-donut:after{content:'';position:absolute;inset:31px;background:#fff;border-radius:50%}
      .legend-row{display:grid;grid-template-columns:16px 1fr auto;gap:8px;align-items:center;padding:6px 0;border-bottom:1px dashed #e5e7eb}
      .legend-dot{width:11px;height:11px;border-radius:50%;background:var(--n);opacity:.85}
      .trend-month{padding:9px 0;border-bottom:1px dashed #e5e7eb}.trend-month:last-child{border-bottom:0}
      .trend-line{display:grid;grid-template-columns:42px 1fr 86px;gap:8px;align-items:center;margin-top:5px}
      .trend-bar{height:10px;background:#eef3f7;border-radius:999px;overflow:hidden}
      .trend-fill.in{height:100%;background:#15803d;border-radius:999px}.trend-fill.out{height:100%;background:#b91c1c;border-radius:999px}
      .hist-summary-only{margin-top:8px;padding:9px 10px;background:#f8fafc;border-radius:10px;color:#64748b;font-size:12px}
      @media(max-width:420px){.trend-line{grid-template-columns:38px 1fr 78px;font-size:12px}}
    `;document.head.appendChild(s);
  }
  function foldHtml(id,title,open){return `<div class="fold-head" onclick="histToggle('${id}')"><h2 style="margin:0">${title}</h2><button type="button" class="fold-btn" id="${id}Btn">${open?'▲ ย่อ':'▼ เปิด'}</button></div>`}
  window.histToggle=function(id){
    const body=document.getElementById(id),btn=document.getElementById(id+'Btn');if(!body)return;
    const open=body.style.display==='none';body.style.display=open?'block':'none';if(btn)btn.textContent=open?'▲ ย่อ':'▼ เปิด';setUi(id,open);
  };
  function currentRecent(){
    const box=document.getElementById('recent');if(!box||typeof S==='undefined'||!Array.isArray(S.tx))return;
    const card=box.closest('.card');const head=card&&card.querySelector('.itemtop');
    const open=ui().recentMonth!==false;
    if(head){
      const h=head.querySelector('h2');if(h)h.textContent='รายการเดือนปัจจุบัน';
      let b=document.getElementById('recentMonthBtn');
      if(!b){b=document.createElement('button');b.id='recentMonthBtn';b.className='fold-btn';b.type='button';b.onclick=()=>histToggle('recent');head.appendChild(b)}
      b.textContent=open?'▲ ย่อ':'▼ เปิด';
      const old=[...head.querySelectorAll('button')].find(x=>x!==b&&x.textContent.trim()==='ดูทั้งหมด');if(old)old.remove();
    }
    box.style.display=open?'block':'none';
    const m=ymNow();const l=[...S.tx].filter(x=>txYm(x)===m).sort((a,b)=>(String(b.date)+String(b.id)).localeCompare(String(a.date)+String(a.id)));
    box.innerHTML=l.length?l.map(x=>`<div class="item"><div class="itemtop"><span><b>${esc(x.note||x.cat)}</b><div class="sub">${esc(x.cat)} • ${typeof thDate==='function'?thDate(x.date):esc(x.date)}</div></span><span style="text-align:right"><b class="${x.type==='expense'?'red':'green'}">${x.type==='expense'?'-':'+'}${money(x.amount)}</b><br><button class="btn danger" style="margin-top:6px" onclick="delTx('${esc(x.id)}')">ลบ</button></span></div></div>`).join(''):'<div class="sub" style="padding:9px 0">ยังไม่มีรายการในเดือนนี้</div>';
  }
  function ensureHistoryControls(){
    const search=document.getElementById('hSearch');if(search){const label=search.closest('label');if(label)label.style.display='none'}
    const anchor=document.getElementById('hType')?.closest('label');if(!anchor)return;
    if(!document.getElementById('hCat')){
      const catLabel=document.createElement('label');catLabel.innerHTML='หมวด<select id="hCat" onchange="renderHistory()"></select>';
      anchor.parentNode.appendChild(catLabel);
    }
    const sel=document.getElementById('hCat'),keep=sel.value||'all';
    sel.innerHTML='<option value="all">ทุกหมวด</option>'+allCats().map(c=>`<option value="${esc(c)}">${esc(c)}</option>`).join('');
    if([...sel.options].some(o=>o.value===keep))sel.value=keep;
  }
  function expenseComposition(monthTx){
    const map={};monthTx.filter(x=>x.type==='expense').forEach(x=>{const k=x.cat||'ไม่ระบุหมวด';map[k]=(map[k]||0)+Number(x.amount||0)});
    return Object.entries(map).sort((a,b)=>b[1]-a[1]);
  }
  function donutGradient(rows,total){
    if(!total)return '#e5e7eb';
    let pos=0;return 'conic-gradient('+rows.map((r,i)=>{const start=pos;pos+=r[1]/total*100;const hue=(i*67+205)%360;return `hsl(${hue} 48% 54%) ${start.toFixed(2)}% ${pos.toFixed(2)}%`}).join(',')+')';
  }
  function monthLabel(ym){const [y,m]=ym.split('-').map(Number);return new Intl.DateTimeFormat('th-TH',{month:'short',year:'2-digit'}).format(new Date(y,m-1,1))}
  function trendData(){
    const now=new Date(),arr=[];
    for(let i=11;i>=0;i--){const d=new Date(now.getFullYear(),now.getMonth()-i,1),ym=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0');let inc=0,exp=0;(S.tx||[]).filter(x=>txYm(x)===ym).forEach(x=>{if(x.type==='income')inc+=Number(x.amount||0);else if(x.type==='expense')exp+=Number(x.amount||0)});arr.push({ym,inc,exp})}
    return arr;
  }
  function ensureInsights(monthTx){
    const hist=document.getElementById('history');if(!hist)return;
    let wrap=document.getElementById('histInsights');
    if(!wrap){wrap=document.createElement('div');wrap.id='histInsights';hist.parentNode.insertBefore(wrap,hist)}
    const state=ui(),compOpen=state.histComp!==false,trendOpen=state.histTrend===true;
    const comp=expenseComposition(monthTx),total=comp.reduce((s,r)=>s+r[1],0),top=comp.slice(0,3);
    const compBody=total?`<div class="hist-donut" style="background:${donutGradient(comp,total)}"></div>${comp.map((r,i)=>`<div class="legend-row"><span class="legend-dot" style="filter:hue-rotate(${i*67}deg)"></span><span>${esc(r[0])}<div class="sub">${(r[1]/total*100).toFixed(1)}%</div></span><b>${money(r[1])}</b></div>`).join('')}<h3 style="margin-top:12px">Top 3 ค่าใช้จ่าย</h3>${top.map((r,i)=>`<div class="row"><span>${i+1}. ${esc(r[0])}</span><b>${money(r[1])}</b></div>`).join('')}`:'<div class="sub" style="padding:12px 0">ยังไม่มีค่าใช้จ่ายในเดือนที่เลือก</div>';
    const tr=trendData(),mx=Math.max(1,...tr.map(x=>Math.max(x.inc,x.exp)));
    const trendBody='<div class="sub" style="margin:8px 0 4px"><b class="green">รับ</b> = รายรับจริง &nbsp; • &nbsp; <b class="red">จ่าย</b> = ค่าใช้จ่ายจริง</div>'+tr.map(x=>`<div class="trend-month"><b>${monthLabel(x.ym)}</b><div class="trend-line"><span class="green">รับ</span><div class="trend-bar"><div class="trend-fill in" style="width:${(x.inc/mx*100).toFixed(1)}%"></div></div><b class="green" style="text-align:right">${money(x.inc)}</b></div><div class="trend-line"><span class="red">จ่าย</span><div class="trend-bar"><div class="trend-fill out" style="width:${(x.exp/mx*100).toFixed(1)}%"></div></div><b class="red" style="text-align:right">${money(x.exp)}</b></div></div>`).join('');
    wrap.innerHTML=`<div class="card" style="margin-top:11px">${foldHtml('histComp','สัดส่วนค่าใช้จ่ายเดือนนี้',compOpen)}<div id="histComp" style="display:${compOpen?'block':'none'}">${compBody}</div></div><div class="card">${foldHtml('histTrend','แนวโน้มรายรับ–รายจ่าย 12 เดือน',trendOpen)}<div id="histTrend" style="display:${trendOpen?'block':'none'}">${trendBody}</div></div>`;
  }
  function renderHist(){
    if(typeof S==='undefined'||!Array.isArray(S.tx))return;
    ensureHistoryControls();
    const month=document.getElementById('hMonth')?.value||ymNow(),type=document.getElementById('hType')?.value||'all',cat=document.getElementById('hCat')?.value||'all';
    const monthTx=S.tx.filter(x=>txYm(x)===month);
    const l=monthTx.filter(x=>(type==='all'||x.type===type)&&(cat==='all'||x.cat===cat));
    const inc=l.filter(x=>x.type==='income').reduce((s,x)=>s+Number(x.amount||0),0),exp=l.filter(x=>x.type==='expense').reduce((s,x)=>s+Number(x.amount||0),0);
    const hi=document.getElementById('hInc'),he=document.getElementById('hExp');if(hi)hi.textContent=money(inc);if(he)he.textContent=money(exp);
    const box=document.getElementById('history');if(box)box.innerHTML='<div class="hist-summary-only">หน้านี้แสดงเฉพาะสรุปและการวิเคราะห์ รายการแต่ละรายการดูได้ที่ “บันทึก” ในรายการเดือนปัจจุบัน</div>';
    ensureInsights(l);
  }
  function init(){
    injectCss();ensureHistoryControls();
    const hm=document.getElementById('hMonth');if(hm&&!hm.value)hm.value=ymNow();
    currentRecent();renderHist();
  }
  window.renderQuick=currentRecent;
  window.renderHistory=renderHist;
  if(typeof render==='function'&&!window.__histInsightsWrapped){
    window.__histInsightsWrapped=true;const base=render;window.render=function(){base();currentRecent();renderHist()};
  }
  init();
})();