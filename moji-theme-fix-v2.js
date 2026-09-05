(()=>{
  const PALETTE=['#b1843c','#8f7a63','#6f846f','#7f8898','#b49378','#9b7c73','#c0a46b','#65756c','#8a8177','#a89786'];
  function recolorCharts(){
    document.querySelectorAll('.hist-donut').forEach(d=>{
      const rows=[...d.closest('.donut-wrap')?.querySelectorAll('.legend-row')||[]];if(!rows.length)return;let pos=0,parts=[];
      rows.forEach((r,i)=>{const p=parseFloat(r.querySelector('.legend-pct')?.textContent)||0;const start=pos;pos+=p;parts.push(`${PALETTE[i%PALETTE.length]} ${start}% ${pos}%`);const dot=r.querySelector('.legend-dot');if(dot)dot.style.background=PALETTE[i%PALETTE.length];});if(parts.length)d.style.background=`conic-gradient(${parts.join(',')})`;
    });document.querySelectorAll('.bar-fill').forEach(x=>{x.style.background='#b1843c';x.style.boxShadow='0 4px 10px rgba(177,132,60,.18)';});
  }
  function top3Icons(){if(typeof window.mojiSvgIcon!=='function'||typeof window.mojiIconForCategory!=='function')return;document.querySelectorAll('.top3 .row').forEach(row=>{const s=row.querySelector('span');if(!s||s.querySelector('.top3-ico'))return;const txt=s.textContent.replace(/^\s*\d+\.\s*/,'').trim();const i=document.createElement('i');i.className='top3-ico';i.innerHTML=window.mojiSvgIcon(window.mojiIconForCategory(txt));s.prepend(i);});}
  function assertMenus(){const spec={dash:['ภาพรวม','home'],quick:['บันทึก','entry'],hist:['ประวัติ','history'],position:['เงินทั้งหมด','wallet'],future:['อนาคต','future']};Object.entries(spec).forEach(([p,v])=>{const b=document.querySelector(`.tabs button[data-p="${p}"]`);if(!b)return;b.style.display='';const icon=b.querySelector('b');if(icon&&typeof window.mojiSvgIcon==='function')icon.innerHTML=window.mojiSvgIcon(v[1]);const nodes=[...b.childNodes].filter(n=>n.nodeType===3);if(nodes.length)nodes[nodes.length-1].nodeValue=v[0];});}
  function brand(){
    const name='M Personal Finance';
    document.title=name;
    const apple=document.querySelector('meta[name="apple-mobile-web-app-title"]');if(apple)apple.setAttribute('content',name);
    const t=document.getElementById('title');if(t){const v=(t.textContent||'').trim();if(!v||['Smart Personal Finance','Smart Personal Finance Manager','My Finance','Moji','Moji RC1'].includes(v))t.textContent=name;}
  }
  function header(){
    const h=document.querySelector('header');if(h){h.style.background='#2f2922';h.style.borderBottomColor='rgba(177,132,60,.45)';}
    const b=[...document.querySelectorAll('header button')].find(x=>(x.getAttribute('onclick')||'').includes('settings(true)'));
    if(b){b.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="#342d25" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:27px;height:27px;display:block"><circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="7"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12"/></svg>';b.setAttribute('aria-label','ตั้งค่า');b.setAttribute('title','ตั้งค่า');b.style.display='inline-flex';b.style.alignItems='center';b.style.justifyContent='center';
    }
  }
  function run(){brand();header();assertMenus();recolorCharts();top3Icons();}
  run();let queued=false;new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;run();});}).observe(document.body,{childList:true,subtree:true});
})();