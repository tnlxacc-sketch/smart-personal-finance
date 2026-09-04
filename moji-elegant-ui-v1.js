(()=>{
  const NS='mojiElegantV1';
  if(document.documentElement.dataset[NS]) return;
  document.documentElement.dataset[NS]='1';

  const svg=(name)=>{
    const paths={
      home:'<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10.5V20h13v-9.5"/><path d="M9.5 20v-6h5v6"/>',
      entry:'<path d="M12 3v18M3 12h18"/><circle cx="12" cy="12" r="9"/>',
      history:'<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/>',
      wallet:'<path d="M4 6.5h13a3 3 0 0 1 3 3v8.5H5a2 2 0 0 1-2-2V6.5A2.5 2.5 0 0 1 5.5 4H17"/><path d="M15 11h5v4h-5a2 2 0 0 1 0-4Z"/>',
      future:'<path d="M4 19V9M10 19V5M16 19v-8M22 19V3"/><path d="M2 19h21"/>',
      settings:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21H9.6v-.1a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H3V9.6h.1A1.7 1.7 0 0 0 4.7 8.5a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V3h4v.1A1.7 1.7 0 0 0 15.5 4.7a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 9c.14.38.36.72.65 1 .29.28.65.47 1.05.55h.1v4h-.1A1.7 1.7 0 0 0 19.4 15Z"/>',
      chart:'<path d="M4 19V5M4 19h17"/><path d="m7 15 4-4 3 2 5-7"/><circle cx="7" cy="15" r="1"/><circle cx="11" cy="11" r="1"/><circle cx="14" cy="13" r="1"/><circle cx="19" cy="6" r="1"/>',
      target:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><path d="M12 12 20 4M17 4h3v3"/>',
      shield:'<path d="M12 3 5 6v5c0 4.6 3 8 7 10 4-2 7-5.4 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-5"/>',
      calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18"/>',
      pie:'<path d="M11 3a9 9 0 1 0 9 9h-9V3Z"/><path d="M14 3.5V9h5.5A7 7 0 0 0 14 3.5Z"/>',
      coin:'<circle cx="12" cy="12" r="9"/><path d="M15 8.5c-.8-.7-1.8-1-3-1-1.7 0-3 .8-3 2s1 1.8 3 2 3 1 3 2.2-1.3 2.3-3 2.3c-1.2 0-2.3-.4-3.1-1.2M12 5.5v13"/>'
    };
    return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths[name]||paths.coin}</svg>`;
  };

  const style=document.createElement('style');
  style.id='mojiElegantStyleV1';
  style.textContent=`
    :root{--n:#102a43!important;--g:#b68a3a!important;--bg:#f7f4ee!important;--gr:#2f6b52!important;--r:#a53d3d!important;--m:#6f7780!important;--moji-ivory:#fbfaf7;--moji-beige:#eee7dc;--moji-line:#e6ded2;--moji-ink:#243446;--moji-soft:#f2eee7}
    body{background:linear-gradient(180deg,#f7f4ee 0,#f5f7f9 46%,#f7f4ee 100%)!important;color:var(--moji-ink)!important}
    header{background:#102a43!important;border-bottom:1px solid rgba(182,138,58,.32);box-shadow:0 8px 24px rgba(16,42,67,.12)}
    header .top{padding:1px 0}.top b{letter-spacing:.2px}.top small{color:#d7dee5!important}
    .card{background:rgba(255,255,255,.96)!important;border:1px solid var(--moji-line)!important;border-radius:20px!important;box-shadow:0 9px 24px rgba(27,42,57,.065)!important}
    .btn{border-radius:14px!important}.gold{background:#b68a3a!important;color:white!important}.ghost{background:#f2eee7!important;color:#102a43!important}.navy{background:#102a43!important}
    input,select{border-color:#d9d4cc!important;border-radius:14px!important;min-height:46px;background:#fff!important}
    input:focus,select:focus{outline:none!important;border-color:#b68a3a!important;box-shadow:0 0 0 3px rgba(182,138,58,.12)!important}
    .warn{background:#f8f0df!important;color:#76591e!important;border:1px solid #ead9b4!important}.ok{background:#e9f2ed!important;color:#315d49!important}
    .tabs{background:rgba(251,250,247,.98)!important;border-top:1px solid var(--moji-line)!important;box-shadow:0 -7px 22px rgba(27,42,57,.07)!important;padding:7px 5px calc(7px + env(safe-area-inset-bottom))!important}
    .tabs button{color:#7b838d!important;border-radius:14px!important;transition:.18s ease}.tabs button.on{color:#102a43!important;background:#eee7dc!important}.tabs b{height:25px;display:flex!important;align-items:center;justify-content:center}.tabs svg{width:22px;height:22px}.tabs button.on svg{color:#b68a3a}
    .fab{background:#b68a3a!important;color:white!important;box-shadow:0 10px 22px rgba(101,74,27,.25)!important;border:4px solid #fbfaf7!important}
    h2,h3{color:#102a43!important}.kpi{position:relative;overflow:hidden}.kpi:after{content:"";position:absolute;width:54px;height:54px;border-radius:50%;right:-18px;top:-18px;background:rgba(182,138,58,.08)}
    .kpi b{color:#102a43!important}.row{border-bottom-color:#ece7df!important}
    .moji-section-icon{display:inline-flex;width:33px;height:33px;border-radius:12px;align-items:center;justify-content:center;background:#f1ece4;color:#8f6b2f;margin-right:8px;vertical-align:middle;border:1px solid #e5ddd2}.moji-section-icon svg{width:18px;height:18px}
    .moji-title-wrap{display:flex;align-items:center;gap:2px}.moji-title-wrap h2,.moji-title-wrap h3{margin-bottom:0!important}
    .moji-icon-strip{display:flex;gap:8px;overflow-x:auto;padding:7px 2px 10px;scrollbar-width:none}.moji-icon-strip::-webkit-scrollbar{display:none}.moji-icon-chip{flex:0 0 auto;min-width:62px;border:1px solid #e6ded2;background:#fbfaf7;border-radius:16px;padding:8px 7px;text-align:center;color:#425466;font-size:10px;font-weight:750}.moji-icon-chip .ico{width:32px;height:32px;border-radius:12px;background:#f1ece4;color:#8f6b2f;display:flex;align-items:center;justify-content:center;margin:0 auto 5px}.moji-icon-chip .ico svg{width:18px;height:18px}.moji-icon-chip.on{border-color:#b68a3a;background:#f8f1e5;color:#102a43;box-shadow:0 4px 12px rgba(182,138,58,.10)}
    #future .card:first-child{border-top:3px solid #b68a3a!important}.sheet{background:#fbfaf7!important}.item{border-color:#e8e1d7!important;border-radius:16px!important}
    @media(max-width:650px){main{padding:10px!important}.card{border-radius:18px!important}.g4{gap:8px!important}.kpi b{font-size:20px!important}}
  `;
  document.head.appendChild(style);

  const navMap={dash:'home',quick:'entry',hist:'history',position:'wallet',future:'future'};
  document.querySelectorAll('.tabs button[data-p]').forEach(btn=>{
    const b=btn.querySelector('b'); if(b) b.innerHTML=svg(navMap[btn.dataset.p]||'coin');
  });

  const headerSettings=[...document.querySelectorAll('header button')].find(b=>/⚙/.test(b.textContent));
  if(headerSettings) headerSettings.innerHTML=svg('settings');

  const future=document.querySelector('#future .card h2');
  if(future && !future.parentElement.querySelector('.moji-title-wrap')){
    const w=document.createElement('div');w.className='moji-title-wrap';
    const i=document.createElement('span');i.className='moji-section-icon';i.innerHTML=svg('future');
    future.parentNode.insertBefore(w,future);w.append(i,future);
  }

  const titleIcons=[
    ['#dash h2','chart'],['#quick h2','entry'],['#hist h2','pie'],['#position h2','wallet']
  ];
  titleIcons.forEach(([sel,icon])=>document.querySelectorAll(sel).forEach(h=>{
    if(h.closest('.moji-title-wrap'))return;
    const w=document.createElement('div');w.className='moji-title-wrap';
    const i=document.createElement('span');i.className='moji-section-icon';i.innerHTML=svg(icon);
    h.parentNode.insertBefore(w,h);w.append(i,h);
  }));

  function addCategoryStrip(){
    const sel=document.getElementById('qCat'); if(!sel||sel.dataset.mojiStrip==='1'||sel.options.length<2)return;
    sel.dataset.mojiStrip='1';
    const strip=document.createElement('div');strip.className='moji-icon-strip';strip.setAttribute('aria-label','หมวดหมู่ด่วน');
    const iconFor=(txt)=>{
      txt=(txt||'').toLowerCase();
      if(/อาหาร|กาแฟ|เครื่องดื่ม/.test(txt)) return 'coin';
      if(/บ้าน|ที่อยู่|เช่า/.test(txt)) return 'home';
      if(/รถ|เดินทาง|น้ำมัน/.test(txt)) return 'future';
      if(/ลงทุน|หุ้น|กองทุน/.test(txt)) return 'chart';
      if(/ประกัน|สุขภาพ/.test(txt)) return 'shield';
      if(/ภาษี/.test(txt)) return 'coin';
      if(/เป้าหมาย|ออม/.test(txt)) return 'target';
      return 'wallet';
    };
    [...sel.options].slice(0,8).forEach(opt=>{
      if(!opt.value)return;
      const b=document.createElement('button');b.type='button';b.className='moji-icon-chip';b.dataset.value=opt.value;
      b.innerHTML=`<span class="ico">${svg(iconFor(opt.textContent))}</span><span>${opt.textContent}</span>`;
      b.onclick=()=>{sel.value=opt.value;sel.dispatchEvent(new Event('change',{bubbles:true}));paintStrip();};strip.appendChild(b);
    });
    const label=sel.closest('label'); if(label) label.parentNode.insertBefore(strip,label);
    function paintStrip(){strip.querySelectorAll('.moji-icon-chip').forEach(x=>x.classList.toggle('on',x.dataset.value===sel.value));}
    sel.addEventListener('change',paintStrip);paintStrip();
  }
  addCategoryStrip();
  const obs=new MutationObserver(addCategoryStrip); const q=document.getElementById('qCat'); if(q)obs.observe(q,{childList:true});
})();