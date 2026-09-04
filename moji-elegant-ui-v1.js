(()=>{
  const NS='mojiElegantV2';
  if(document.documentElement.dataset[NS]) return;
  document.documentElement.dataset[NS]='1';

  const svg=(name)=>{
    const paths={
      home:'<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10.5V20h13v-9.5"/><path d="M9.5 20v-6h5v6"/>',
      entry:'<circle cx="12" cy="12" r="9"/><path d="M12 7v10M7 12h10"/>',
      history:'<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/>',
      wallet:'<path d="M4 6.5h13a3 3 0 0 1 3 3v8.5H5a2 2 0 0 1-2-2V6.5A2.5 2.5 0 0 1 5.5 4H17"/><path d="M15 11h5v4h-5a2 2 0 0 1 0-4Z"/>',
      future:'<path d="M4 19V9M10 19V5M16 19v-8M22 19V3"/><path d="M2 19h21"/>',
      settings:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21H9.6v-.1a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H3V9.6h.1A1.7 1.7 0 0 0 4.7 8.5a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V3h4v.1A1.7 1.7 0 0 0 15.5 4.7a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 9c.14.38.36.72.65 1 .29.28.65.47 1.05.55h.1v4h-.1A1.7 1.7 0 0 0 19.4 15Z"/>',
      chart:'<path d="M4 19V5M4 19h17"/><path d="m7 15 4-4 3 2 5-7"/>',
      target:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><path d="M12 12 20 4M17 4h3v3"/>',
      shield:'<path d="M12 3 5 6v5c0 4.6 3 8 7 10 4-2 7-5.4 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-5"/>',
      calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18"/>',
      pie:'<path d="M11 3a9 9 0 1 0 9 9h-9V3Z"/><path d="M14 3.5V9h5.5A7 7 0 0 0 14 3.5Z"/>',
      food:'<path d="M7 3v7M4 3v4a3 3 0 0 0 6 0V3M7 10v11M17 3c-2 3-2 7 0 9v9M17 3c3 2 3 7 0 9"/>',
      coffee:'<path d="M5 8h11v5a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5V8Z"/><path d="M16 10h2a2 2 0 0 1 0 4h-2M8 3c1 1 0 2 1 3M12 3c1 1 0 2 1 3"/>',
      car:'<path d="m5 16 1-5h12l1 5"/><path d="m8 11 2-4h4l2 4M4 16h16v4h-2v-2H6v2H4v-4Z"/><circle cx="7" cy="16" r="1"/><circle cx="17" cy="16" r="1"/>',
      shop:'<path d="M5 9h14l-1 12H6L5 9Z"/><path d="M9 9V7a3 3 0 0 1 6 0v2"/>',
      gift:'<rect x="4" y="9" width="16" height="11" rx="1"/><path d="M12 9v11M3 6h18v3H3zM12 6c-1-3-5-3-5-1 0 1 1 1 5 1ZM12 6c1-3 5-3 5-1 0 1-1 1-5 1Z"/>',
      phone:'<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M10 5h4M11 19h2"/>',
      health:'<path d="M12 21s-7-4.7-7-11a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 6.3-7 11-7 11Z"/><path d="M8 12h2l1-2 2 4 1-2h2"/>',
      home2:'<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10.5V20h13v-9.5"/>',
      book:'<path d="M4 5a4 4 0 0 1 4-1h4v16H8a4 4 0 0 0-4 1V5ZM20 5a4 4 0 0 0-4-1h-4v16h4a4 4 0 0 1 4 1V5Z"/>',
      plane:'<path d="m2 16 20-8-8 20-3-9-9-3Z"/><path d="m11 19 4-4"/>',
      coin:'<circle cx="12" cy="12" r="9"/><path d="M15 8.5c-.8-.7-1.8-1-3-1-1.7 0-3 .8-3 2s1 1.8 3 2 3 1 3 2.2-1.3 2.3-3 2.3c-1.2 0-2.3-.4-3.1-1.2M12 5.5v13"/>'
    };
    return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${paths[name]||paths.coin}</svg>`;
  };

  window.mojiIconForCategory=function(txt){
    txt=String(txt||'').toLowerCase();
    if(/อาหาร|ข้าว|กิน/.test(txt)) return 'food';
    if(/กาแฟ|เครื่องดื่ม/.test(txt)) return 'coffee';
    if(/รถ|เดินทาง|น้ำมัน|แท็กซี่/.test(txt)) return 'car';
    if(/บ้าน|ที่อยู่|เช่า|คอนโด/.test(txt)) return 'home2';
    if(/ช้อป|ซื้อของ|เสื้อ|ของใช้/.test(txt)) return 'shop';
    if(/ของขวัญ/.test(txt)) return 'gift';
    if(/โทร|สื่อสาร|มือถือ|เน็ต/.test(txt)) return 'phone';
    if(/สุขภาพ|หมอ|ยา/.test(txt)) return 'health';
    if(/ศึกษา|หนังสือ|เรียน/.test(txt)) return 'book';
    if(/เที่ยว|ท่อง/.test(txt)) return 'plane';
    if(/ลงทุน|หุ้น|กองทุน/.test(txt)) return 'chart';
    if(/ประกัน/.test(txt)) return 'shield';
    if(/ออม|เป้าหมาย/.test(txt)) return 'target';
    return 'wallet';
  };
  window.mojiSvgIcon=svg;

  const old=document.getElementById('mojiElegantStyleV1'); if(old)old.remove();
  const style=document.createElement('style');
  style.id='mojiElegantStyleV2';
  style.textContent=`
    :root{--n:#2f2922!important;--g:#b1843c!important;--bg:#f7f3eb!important;--gr:#496e58!important;--r:#9e514b!important;--m:#7a746c!important;--moji-ivory:#fcfaf6;--moji-beige:#efe7da;--moji-line:#e4dbce;--moji-ink:#2f2922;--moji-soft:#f2ece2;--moji-gold:#b1843c;--moji-taupe:#c9baa7}
    html,body{background:#f7f3eb!important;color:var(--moji-ink)!important}
    body{background:linear-gradient(180deg,#f6f1e8 0,#fbfaf7 44%,#f6f1e8 100%)!important}
    header{background:#2f2922!important;border-bottom:1px solid rgba(177,132,60,.45)!important;box-shadow:0 8px 24px rgba(47,41,34,.13)!important}
    header .top{padding:2px 0}.top b{letter-spacing:.2px;color:#fffaf2!important}.top small{color:#d8cec1!important}
    header .ghost{background:#f6f0e7!important;color:#2f2922!important;border:1px solid #e6dccf!important}
    header button svg{width:21px;height:21px}
    .card{background:rgba(255,253,249,.97)!important;border:1px solid var(--moji-line)!important;border-radius:20px!important;box-shadow:0 9px 24px rgba(63,52,41,.07)!important}
    .btn{border-radius:14px!important}.gold{background:#b1843c!important;color:white!important}.ghost{background:#f2ece2!important;color:#2f2922!important}.navy{background:#2f2922!important;color:#fff!important}
    input,select{border-color:#d9cfc2!important;border-radius:14px!important;min-height:46px;background:#fffdf9!important;color:#2f2922!important}
    input:focus,select:focus{outline:none!important;border-color:#b1843c!important;box-shadow:0 0 0 3px rgba(177,132,60,.13)!important}
    .warn{background:#f8f0df!important;color:#76591e!important;border:1px solid #e7d4ad!important}.ok{background:#edf2ee!important;color:#45624f!important}
    .tabs{background:rgba(252,250,246,.985)!important;border-top:1px solid var(--moji-line)!important;box-shadow:0 -7px 22px rgba(63,52,41,.08)!important;padding:7px 5px calc(7px + env(safe-area-inset-bottom))!important}
    .tabs button{color:#7f7972!important;border-radius:14px!important;transition:.18s ease}.tabs button.on{color:#2f2922!important;background:#eee5d7!important}.tabs b{height:25px;display:flex!important;align-items:center;justify-content:center}.tabs svg{width:22px;height:22px}.tabs button.on svg{color:#a87931!important}
    .fab{background:#b1843c!important;color:white!important;box-shadow:0 10px 22px rgba(101,74,27,.24)!important;border:4px solid #fcfaf6!important}
    h2,h3{color:#2f2922!important}.kpi{position:relative;overflow:hidden}.kpi:after{content:"";position:absolute;width:54px;height:54px;border-radius:50%;right:-18px;top:-18px;background:rgba(177,132,60,.075)}
    .kpi b{color:#2f2922!important}.row{border-bottom-color:#ece3d8!important}
    .fold-btn{background:#f2ece2!important;color:#2f2922!important}.hist-summary-only{background:#f5f0e8!important;color:#746d65!important}.bar-fill{background:#b1843c!important;box-shadow:0 4px 10px rgba(177,132,60,.18)!important}.hist-donut-hole{background:#fffdf9!important}
    .moji-section-icon{display:inline-flex;width:34px;height:34px;border-radius:12px;align-items:center;justify-content:center;background:#efe7da;color:#8b652a;margin-right:8px;vertical-align:middle;border:1px solid #e1d6c7}.moji-section-icon svg{width:18px;height:18px}
    .moji-title-wrap{display:flex;align-items:center;gap:2px}.moji-title-wrap h2,.moji-title-wrap h3{margin-bottom:0!important}
    .moji-icon-strip{display:flex;gap:8px;overflow-x:auto;padding:7px 2px 10px;scrollbar-width:none}.moji-icon-strip::-webkit-scrollbar{display:none}.moji-icon-chip{flex:0 0 auto;min-width:66px;border:1px solid #e4dbce;background:#fcfaf6;border-radius:16px;padding:8px 7px;text-align:center;color:#5f5a54;font-size:10px;font-weight:750}.moji-icon-chip .ico{width:34px;height:34px;border-radius:12px;background:#efe7da;color:#8b652a;display:flex;align-items:center;justify-content:center;margin:0 auto 5px}.moji-icon-chip .ico svg{width:19px;height:19px}.moji-icon-chip.on{border-color:#b1843c;background:#f7efe1;color:#2f2922;box-shadow:0 4px 12px rgba(177,132,60,.11)}
    .top3 .row>span{display:flex;align-items:center;gap:9px}.top3-ico{width:29px;height:29px;flex:0 0 29px;border-radius:10px;background:#efe7da;color:#8b652a;display:inline-flex;align-items:center;justify-content:center;border:1px solid #e1d6c7}.top3-ico svg{width:16px;height:16px}
    #future .card:first-child{border-top:3px solid #b1843c!important}.sheet{background:#fcfaf6!important}.item{border-color:#e8dfd3!important;border-radius:16px!important}
    @media(max-width:650px){main{padding:10px!important}.card{border-radius:18px!important}.g4{gap:8px!important}.kpi b{font-size:20px!important}}
  `;
  document.head.appendChild(style);

  const navMap={dash:'home',quick:'entry',hist:'history',position:'wallet',future:'future'};
  document.querySelectorAll('.tabs button[data-p]').forEach(btn=>{const b=btn.querySelector('b');if(b)b.innerHTML=svg(navMap[btn.dataset.p]||'coin');});
  const headerSettings=[...document.querySelectorAll('header button')].find(b=>/⚙/.test(b.textContent)); if(headerSettings)headerSettings.innerHTML=svg('settings');

  const titleIcons=[['#dash h2','chart'],['#quick h2','entry'],['#hist h2','pie'],['#position h2','wallet'],['#future h2','future']];
  titleIcons.forEach(([sel,icon])=>document.querySelectorAll(sel).forEach(h=>{if(h.closest('.moji-title-wrap'))return;const w=document.createElement('div');w.className='moji-title-wrap';const i=document.createElement('span');i.className='moji-section-icon';i.innerHTML=svg(icon);h.parentNode.insertBefore(w,h);w.append(i,h);}));

  function addCategoryStrip(){
    const sel=document.getElementById('qCat'); if(!sel)return;
    let strip=document.querySelector('.moji-icon-strip');
    if(!strip){strip=document.createElement('div');strip.className='moji-icon-strip';strip.setAttribute('aria-label','หมวดหมู่ด่วน');const label=sel.closest('label');if(label)label.parentNode.insertBefore(strip,label);}
    const values=[...sel.options].filter(o=>o.value);
    const sig=values.map(o=>o.value).join('|'); if(strip.dataset.sig===sig)return; strip.dataset.sig=sig; strip.innerHTML='';
    values.forEach(opt=>{const b=document.createElement('button');b.type='button';b.className='moji-icon-chip';b.dataset.value=opt.value;b.innerHTML=`<span class="ico">${svg(window.mojiIconForCategory(opt.textContent))}</span><span>${opt.textContent}</span>`;b.onclick=()=>{sel.value=opt.value;sel.dispatchEvent(new Event('change',{bubbles:true}));paintStrip();};strip.appendChild(b);});
    function paintStrip(){strip.querySelectorAll('.moji-icon-chip').forEach(x=>x.classList.toggle('on',x.dataset.value===sel.value));}
    sel.addEventListener('change',paintStrip);paintStrip();
  }
  addCategoryStrip(); const q=document.getElementById('qCat'); if(q)new MutationObserver(addCategoryStrip).observe(q,{childList:true});

  function paintTop3Icons(){document.querySelectorAll('.top3 .row').forEach(row=>{const s=row.querySelector('span');if(!s||s.querySelector('.top3-ico'))return;const txt=s.textContent.replace(/^\s*\d+\.\s*/,'').trim();const i=document.createElement('i');i.className='top3-ico';i.innerHTML=svg(window.mojiIconForCategory(txt));s.prepend(i);});}
  paintTop3Icons(); new MutationObserver(paintTop3Icons).observe(document.body,{childList:true,subtree:true});
})();