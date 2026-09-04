(()=>{
  if(document.documentElement.dataset.mojiUiSkinV2)return;
  document.documentElement.dataset.mojiUiSkinV2='1';
  const ICON={
    home:'<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10.5V20h13v-9.5"/>',
    plus:'<circle cx="12" cy="12" r="9"/><path d="M12 7v10M7 12h10"/>',
    history:'<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/>',
    wallet:'<path d="M4 6.5h13a3 3 0 0 1 3 3v8.5H5a2 2 0 0 1-2-2V6.5A2.5 2.5 0 0 1 5.5 4H17"/><path d="M15 11h5v4h-5a2 2 0 0 1 0-4Z"/>',
    future:'<path d="M4 19V9M10 19V5M16 19v-8M22 19V3"/><path d="M2 19h21"/>',
    pie:'<path d="M11 3a9 9 0 1 0 9 9h-9V3Z"/><path d="M14 3.5V9h5.5A7 7 0 0 0 14 3.5Z"/>',
    target:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><path d="M12 12 20 4M17 4h3v3"/>',
    more:'<circle cx="5" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="19" cy="12" r="1.2"/>',
    food:'<path d="M7 3v7M4 3v4a3 3 0 0 0 6 0V3M7 10v11M17 3c-2 3-2 7 0 9v9"/>',
    coffee:'<path d="M5 8h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5V8Z"/><path d="M16 10h2a2 2 0 0 1 0 4h-2"/>',
    car:'<path d="m5 16 1-5h12l1 5"/><path d="m8 11 2-4h4l2 4M4 16h16v4h-2v-2H6v2H4v-4Z"/>',
    home2:'<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10.5V20h13v-9.5"/>',
    shop:'<path d="M5 9h14l-1 12H6L5 9Z"/><path d="M9 9V7a3 3 0 0 1 6 0v2"/>',
    gift:'<rect x="4" y="9" width="16" height="11" rx="1"/><path d="M12 9v11M3 6h18v3H3z"/>',
    phone:'<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M10 5h4"/>',
    health:'<path d="M12 21s-7-4.7-7-11a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 6.3-7 11-7 11Z"/>',
    book:'<path d="M4 5a4 4 0 0 1 4-1h4v16H8a4 4 0 0 0-4 1V5ZM20 5a4 4 0 0 0-4-1h-4v16h4a4 4 0 0 1 4 1V5Z"/>',
    plane:'<path d="m2 16 20-8-8 20-3-9-9-3Z"/><path d="m11 19 4-4"/>',
    chart:'<path d="M4 19V5M4 19h17"/><path d="m7 15 4-4 3 2 5-7"/>',
    shield:'<path d="M12 3 5 6v5c0 4.6 3 8 7 10 4-2 7-5.4 7-10V6l-7-3Z"/>'
  };
  const svg=n=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[n]||ICON.wallet}</svg>`;
  const iconFor=t=>{t=String(t||'').toLowerCase();if(/อาหาร|ข้าว/.test(t))return'food';if(/กาแฟ|เครื่องดื่ม/.test(t))return'coffee';if(/รถ|เดินทาง|น้ำมัน/.test(t))return'car';if(/บ้าน|ที่อยู่|คอนโด|เช่า/.test(t))return'home2';if(/ช้อป|เสื้อ|ของใช้/.test(t))return'shop';if(/ของขวัญ/.test(t))return'gift';if(/โทร|มือถือ|เน็ต|สื่อสาร/.test(t))return'phone';if(/สุขภาพ|หมอ|ยา/.test(t))return'health';if(/หนังสือ|เรียน|ศึกษา/.test(t))return'book';if(/เที่ยว/.test(t))return'plane';if(/ลงทุน|หุ้น|กองทุน/.test(t))return'chart';if(/ประกัน/.test(t))return'shield';return'wallet'};
  window.mojiSvgIcon=svg; window.mojiIconForCategory=iconFor;

  ['mojiElegantStyleV1','mojiElegantStyleV2'].forEach(id=>document.getElementById(id)?.remove());
  const st=document.createElement('style'); st.id='mojiUiSkinV2Style'; st.textContent=`
  :root{--n:#342d25!important;--g:#b58a45!important;--bg:#f6f1e9!important;--r:#9b4c46!important;--gr:#4e755d!important;--m:#7c756d!important}
  html,body{background:#f6f1e9!important;color:#342d25!important}body{background:linear-gradient(180deg,#f4efe7 0,#fbfaf7 45%,#f4efe7 100%)!important}
  header{background:#342d25!important;border-bottom:1px solid #b58a4566!important;box-shadow:0 8px 22px #342d2518!important}.top b{color:#fffaf2!important}.top small{color:#d9d0c5!important}
  header .ghost{background:#f8f3eb!important;color:#342d25!important;border:1px solid #e6dccf!important}.navy{background:#342d25!important}.gold{background:#b58a45!important;color:#fff!important}.ghost{background:#f1eadf!important;color:#342d25!important}
  .card{background:#fffdf9!important;border:1px solid #e5dccf!important;border-radius:21px!important;box-shadow:0 10px 26px #594a3810!important}.item{background:#fffdfa!important;border-color:#e8dfd4!important;border-radius:17px!important}
  h2,h3,.kpi b{color:#342d25!important}.row{border-bottom-color:#eee6dd!important}input,select{background:#fffdf9!important;border-color:#d9cec0!important;border-radius:14px!important;color:#342d25!important}
  input:focus,select:focus{outline:none!important;border-color:#b58a45!important;box-shadow:0 0 0 3px #b58a4522!important}.warn{background:#f8f0df!important;color:#755a2a!important;border:1px solid #ead8b5!important}.ok{background:#edf3ee!important;color:#496653!important}
  .tabs{background:#fcfaf6fa!important;border-top:1px solid #e5dccf!important;box-shadow:0 -7px 22px #594a3810!important}.tabs button{color:#827b73!important;border-radius:15px!important}.tabs button.on{background:#eee5d8!important;color:#342d25!important}.tabs button.on svg{color:#a97a34!important}.tabs b{display:flex!important;height:26px;align-items:center;justify-content:center}.tabs svg{width:22px;height:22px}.fab{background:#b58a45!important;color:white!important;border:4px solid #fffaf4!important;box-shadow:0 10px 24px #76551f3d!important}
  .fold-btn{background:#f1eadf!important;color:#342d25!important}.hist-summary-only{background:#f5f0e8!important;color:#766e65!important}.bar-fill{background:#b58a45!important;box-shadow:none!important}.hist-donut-hole{background:#fffdf9!important}
  .moji-section-icon,.moji-cat-icon,.moji-quick-icon{display:inline-flex;align-items:center;justify-content:center;border-radius:14px;background:#efe7db;color:#8a672f;border:1px solid #e2d6c6}.moji-section-icon{width:36px;height:36px;margin-right:8px}.moji-section-icon svg,.moji-cat-icon svg,.moji-quick-icon svg{width:20px;height:20px}
  .moji-quick-actions{display:grid;grid-template-columns:repeat(7,1fr);gap:8px;padding:10px 0 2px;overflow-x:auto}.moji-quick-action{min-width:72px;border:0;background:transparent;color:#514a43;font-weight:700;font-size:11px;text-align:center;padding:4px}.moji-quick-icon{width:44px;height:44px;margin:0 auto 6px;background:#f2ebe1;color:#7d5c2b}.moji-quick-action:active .moji-quick-icon{background:#eadcc8}
  .moji-top3-title{display:flex;align-items:center;gap:8px}.top3 .row>span{display:flex;align-items:center;gap:9px}.moji-top3-ico{flex:0 0 auto;width:34px;height:34px;border-radius:12px;background:#efe7db;color:#7c5d2c;border:1px solid #e1d5c5;display:inline-flex;align-items:center;justify-content:center}.moji-top3-ico svg{width:18px;height:18px}
  .moji-icon-strip{display:flex!important;gap:9px!important;overflow-x:auto!important;padding:8px 1px 12px!important}.moji-icon-chip{background:#fcfaf6!important;border-color:#e4d9cc!important;color:#5e5750!important}.moji-icon-chip .ico{background:#efe7db!important;color:#7c5d2c!important}.moji-icon-chip.on{background:#f4ead9!important;border-color:#b58a45!important;color:#342d25!important}
  #future .card{border-color:#dfd2c0!important}#future .card:first-child{border-top:3px solid #b58a45!important}.sheet{background:#fbf8f2!important}
  @media(max-width:640px){main{padding:10px!important}.moji-quick-actions{grid-template-columns:repeat(7,72px)}.card{border-radius:18px!important}}
  `; document.head.appendChild(st);

  const nav={dash:'home',quick:'plus',hist:'history',position:'wallet',future:'future'};
  document.querySelectorAll('.tabs button[data-p]').forEach(b=>{const x=b.querySelector('b');if(x)x.innerHTML=svg(nav[b.dataset.p])});

  function quickActions(){
    const dash=document.getElementById('dash'); if(!dash||document.getElementById('mojiQuickActions'))return;
    const first=dash.querySelector('.card'); if(!first)return;
    const box=document.createElement('div'); box.id='mojiQuickActions'; box.className='card';
    const actions=[['home','ภาพรวม',()=>go('dash')],['plus','บันทึก',()=>go('quick')],['history','ประวัติ',()=>go('hist')],['wallet','เงินทั้งหมด',()=>go('position')],['pie','วิเคราะห์',()=>go('hist')],['future','อนาคต',()=>go('future')],['more','เพิ่มเติม',()=>settings(true)]];
    box.innerHTML='<h2 style="margin-bottom:4px">เมนูการเงิน</h2><div class="moji-quick-actions">'+actions.map((a,i)=>`<button type="button" class="moji-quick-action" data-i="${i}"><span class="moji-quick-icon">${svg(a[0])}</span>${a[1]}</button>`).join('')+'</div>';
    first.parentNode.insertBefore(box,first); box.querySelectorAll('button').forEach((b,i)=>b.onclick=actions[i][2]);
  }

  function sectionIcons(){
    const map=[['#dash h2','home'],['#quick h2','plus'],['#hist h2','pie'],['#position h2','wallet'],['#future h2','future']];
    map.forEach(([sel,ic])=>document.querySelectorAll(sel).forEach(h=>{if(h.dataset.mojiIcon)return;h.dataset.mojiIcon='1';const s=document.createElement('span');s.className='moji-section-icon';s.innerHTML=svg(ic);h.prepend(s)}));
  }

  const muted=['#c99f61','#aeb9a8','#c8b8a4','#8798ad','#d2a69d','#b8aa91','#809887','#b9a6bc','#9a8b78','#d3c5ae'];
  function polishCharts(){
    const donut=document.querySelector('.hist-donut'); const rows=[...document.querySelectorAll('.legend-row')];
    if(donut&&rows.length){let p=0,stops=[];rows.forEach((r,i)=>{const pct=parseFloat(r.querySelector('.legend-pct')?.textContent)||0;const s=p;p+=pct;stops.push(`${muted[i%muted.length]} ${s}% ${p}%`);const dot=r.querySelector('.legend-dot');if(dot)dot.style.background=muted[i%muted.length]});donut.style.background=`conic-gradient(${stops.join(',')})`;}
    document.querySelectorAll('.bar-fill').forEach(x=>x.style.setProperty('background','#b58a45','important'));
  }

  function top3Icons(){
    document.querySelectorAll('.top3').forEach(top=>{
      const h=top.querySelector('h3'); if(h&&!h.dataset.mojiTop){h.dataset.mojiTop='1';h.classList.add('moji-top3-title');const s=document.createElement('span');s.className='moji-cat-icon';s.innerHTML=svg('pie');h.prepend(s)}
      top.querySelectorAll('.row').forEach(r=>{const span=r.querySelector('span');if(!span||span.querySelector('.moji-top3-ico'))return;const txt=span.textContent.replace(/^\s*\d+\.\s*/,'');const i=document.createElement('span');i.className='moji-top3-ico';i.innerHTML=svg(iconFor(txt));span.prepend(i)});
    });
  }

  function refresh(){quickActions();sectionIcons();top3Icons();polishCharts()}
  refresh(); new MutationObserver(()=>requestAnimationFrame(refresh)).observe(document.body,{childList:true,subtree:true});
})();