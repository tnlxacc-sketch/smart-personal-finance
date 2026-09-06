// First-start UX only: do not force the setup wizard. Show a simple reminder to begin at Settings.
// No finance formulas, storage schema, menus, or existing data are changed.
(function(){
  const NOTICE_KEY='mpf_first_start_notice_v1';

  function closeLegacySetup(){
    const setup=document.getElementById('setup');
    if(setup) setup.classList.remove('on');
  }

  function css(){
    if(document.getElementById('mpf-first-start-css')) return;
    const s=document.createElement('style');
    s.id='mpf-first-start-css';
    s.textContent=`
      #mpfFirstStart{position:fixed;inset:0;background:rgba(25,20,15,.52);z-index:220;display:flex;align-items:center;justify-content:center;padding:20px}
      #mpfFirstStart .box{width:min(420px,100%);background:#fffdf8;border-radius:22px;padding:22px;border:1px solid rgba(177,132,60,.3);box-shadow:0 20px 60px rgba(37,29,22,.24);text-align:center}
      #mpfFirstStart .icon{font-size:38px;line-height:1;margin-bottom:10px}
      #mpfFirstStart h2{margin:0 0 8px;font-size:21px;color:#342d25}
      #mpfFirstStart p{margin:0;color:#6f6255;line-height:1.6;font-size:14px}
      #mpfFirstStart .primary{width:100%;margin-top:16px;border:0;border-radius:14px;padding:13px 16px;background:#3b3127;color:#fff;font:inherit;font-weight:900}
      #mpfFirstStart .later{margin-top:8px;border:0;background:transparent;color:#7b6c5c;font:inherit;font-weight:700;padding:8px 12px}
    `;
    document.head.appendChild(s);
  }

  function dismiss(markSeen=true){
    document.getElementById('mpfFirstStart')?.remove();
    if(markSeen){try{localStorage.setItem(NOTICE_KEY,'1')}catch(_){}}
  }

  window.mpfFirstStartGoSettings=function(){
    dismiss(true);
    if(typeof settings==='function') settings(true);
  };
  window.mpfFirstStartLater=function(){dismiss(true)};

  function showNotice(){
    closeLegacySetup();
    let seen=false;
    try{seen=localStorage.getItem(NOTICE_KEY)==='1'}catch(_){}
    if(seen || document.getElementById('mpfFirstStart')) return;
    css();
    const m=document.createElement('div');
    m.id='mpfFirstStart';
    m.innerHTML=`<div class="box"><div class="icon">⚙️</div><h2>เริ่มต้นที่ “ตั้งค่า”</h2><p>ก่อนใช้งาน ให้กำหนดเงินสำหรับใช้จ่าย/เดือน เงินออม ค่าใช้จ่ายประจำ และค่าใช้จ่ายรายปี ระบบจะคำนวณเงินที่ควรใช้จริงให้</p><button class="primary" type="button" onclick="window.mpfFirstStartGoSettings()">ไปที่ตั้งค่า</button><button class="later" type="button" onclick="window.mpfFirstStartLater()">ไว้ก่อน</button></div>`;
    document.body.appendChild(m);
  }

  function init(){
    closeLegacySetup();
    let initialized=false;
    try{initialized=!!(window.S&&S.profile&&S.profile.initialized)}catch(_){}
    if(!initialized) setTimeout(showNotice,250);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
  else init();
})();
