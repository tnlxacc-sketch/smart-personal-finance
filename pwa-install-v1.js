(()=>{
  if(new URLSearchParams(location.search).has('android')) return;

  let deferredPrompt=null;
  const isStandalone=()=>window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true;
  const isIOS=/iphone|ipad|ipod/i.test(navigator.userAgent);

  function style(){
    if(document.getElementById('mpf-pwa-style')) return;
    const s=document.createElement('style');
    s.id='mpf-pwa-style';
    s.textContent=`
      #mpfInstallCard{background:linear-gradient(135deg,#fffaf1,#f3eadc);border:1px solid rgba(177,132,60,.35);border-radius:18px;padding:16px;margin:0 0 12px;box-shadow:0 8px 24px rgba(74,56,38,.08)}
      #mpfInstallCard .mpf-install-title{font-weight:900;font-size:17px;color:#342d25;margin-bottom:4px}
      #mpfInstallCard .mpf-install-sub{font-size:12.5px;line-height:1.5;color:#74685b;margin-bottom:12px}
      #mpfInstallBtn{width:100%;border:0;border-radius:14px;padding:14px 16px;font:inherit;font-size:16px;font-weight:900;background:#3b3127;color:#fff;box-shadow:0 8px 18px rgba(59,49,39,.18);display:flex;align-items:center;justify-content:center;gap:9px}
      #mpfInstallBtn:active{transform:translateY(1px)}
      #mpfInstallBtn svg{width:22px;height:22px;flex:0 0 auto}
      #mpfInstallHelp{display:none;margin-top:10px;padding:10px 12px;border-radius:12px;background:#fff;color:#65594d;font-size:12px;line-height:1.55;border:1px solid rgba(177,132,60,.25)}
    `;
    document.head.appendChild(s);
  }

  function ensureCard(){
    if(isStandalone()) return;
    if(document.getElementById('mpfInstallCard')) return;
    const dash=document.getElementById('dash');
    if(!dash) return;
    style();
    const card=document.createElement('div');
    card.id='mpfInstallCard';
    card.innerHTML=`
      <div class="mpf-install-title">M Personal Finance บนหน้าจอมือถือ</div>
      <div class="mpf-install-sub">ติดตั้งจากเว็บนี้ได้เลย • ไม่ต้องใช้ Play Store • ข้อมูลยังอยู่ในเครื่องของคุณ</div>
      <button id="mpfInstallBtn" type="button" aria-label="ติดตั้ง M Personal Finance">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14a2 2 0 0 0 2-2v-3"/><path d="M3 16v3a2 2 0 0 0 2 2"/></svg>
        ติดตั้ง M Personal Finance
      </button>
      <div id="mpfInstallHelp"></div>`;
    dash.insertBefore(card,dash.firstChild);
    document.getElementById('mpfInstallBtn').addEventListener('click',install);
  }

  async function install(){
    const help=document.getElementById('mpfInstallHelp');
    if(deferredPrompt){
      try{
        deferredPrompt.prompt();
        const result=await deferredPrompt.userChoice;
        deferredPrompt=null;
        if(result&&result.outcome==='accepted'){
          const card=document.getElementById('mpfInstallCard');
          if(card) card.style.display='none';
          return;
        }
      }catch(e){}
    }
    if(!help) return;
    help.style.display='block';
    if(isIOS){
      help.innerHTML='บน iPhone/iPad: แตะปุ่ม <b>แชร์</b> ของ Safari → เลือก <b>เพิ่มไปยังหน้าจอโฮม</b> → กด <b>เพิ่ม</b>';
    }else{
      help.innerHTML='ถ้ายังไม่ขึ้นหน้าติดตั้ง: เปิดเมนูเบราว์เซอร์ <b>⋮</b> → เลือก <b>ติดตั้งแอป</b> หรือ <b>เพิ่มไปยังหน้าจอหลัก</b>';
    }
  }

  window.addEventListener('beforeinstallprompt',e=>{
    e.preventDefault();
    deferredPrompt=e;
    ensureCard();
  });
  window.addEventListener('appinstalled',()=>{
    deferredPrompt=null;
    const card=document.getElementById('mpfInstallCard');
    if(card) card.style.display='none';
  });

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',ensureCard);
  else ensureCard();
})();