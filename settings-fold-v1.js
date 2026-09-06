// Settings UX: agreed compact mobile layout.
// Presentation only: no finance formulas, data schema, storage keys, PWA install or popup logic changes.
(function(){
 const KEY='spfm_ui_settings_fold_v1';
 function getState(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){return{}}}
 function put(k,v){const s=getState();s[k]=v;localStorage.setItem(KEY,JSON.stringify(s))}
 function css(){
  if(document.getElementById('sfCss'))return;
  const s=document.createElement('style');s.id='sfCss';
  s.textContent=`
  #settings .sheet{padding:0 14px 20px;scroll-padding-top:84px;background:#fbf8f2!important}
  #settings .sheet>.itemtop:first-child{position:sticky;top:0;z-index:12;margin:0 -14px 12px;padding:12px 14px 11px;background:#fbf8f2f7!important;border-bottom:1px solid #e2d7c9;backdrop-filter:blur(10px)}
  #settings .sheet>.itemtop:first-child h2{margin:0!important;font-size:21px!important;display:flex;align-items:center;gap:8px}
  #settings .sheet>.itemtop:first-child h2:before{content:'⚙';font-size:20px}
  #settings .sf-title-sub{font-size:12.5px;color:#7e756b;margin-top:1px;line-height:1.35}
  #settings .sf-close{background:#fffaf1!important;color:#8a672f!important;border:1px solid #c9a35f!important;min-width:76px;min-height:45px}
  #settings .sf-close:before{content:'× ';font-size:18px}
  #settings .sf-basic{background:#fffdf9;border:1px solid #e5dccf;border-radius:18px;padding:12px;margin-bottom:10px;box-shadow:0 8px 22px #594a380d}
  #settings .sf-basic-title{font-size:17px;font-weight:900;margin:0 0 9px;color:#342d25}
  #settings .sf-basic .grid{gap:7px!important;grid-template-columns:1fr!important}
  #settings .sf-basic label{margin:0!important;font-size:14px;display:grid;grid-template-columns:minmax(0,1fr) minmax(112px,38%);gap:9px;align-items:center}
  #settings .sf-basic label input{margin:0!important;min-height:45px!important;text-align:right}
  #settings .sf-basic label:first-of-type{display:block}
  #settings .sf-basic label:first-of-type input{text-align:left;margin-top:5px!important;width:100%}
  #settings .sf-info{margin-top:8px;background:#f5f0e7;border-radius:12px;padding:8px 10px;font-size:12px;color:#746b61;line-height:1.4}
  #settings .sf-info:before{content:'ⓘ ';font-weight:900;color:#8a672f}
  #settings .grid{gap:8px}
  #settings label{display:block;margin-bottom:2px}
  #settings input,#settings select{min-height:46px}
  #settings .card{margin-bottom:10px;padding:12px;border-radius:17px!important}
  #settings .sf-head{display:flex;align-items:center;gap:8px;min-height:50px}
  #settings .sf-head h3,#settings .sf-head h2{margin:0;flex:1;line-height:1.22;font-size:16.5px!important}
  #settings .sf-section-sub{display:block;font-size:11.5px;color:#857c72;font-weight:500;margin-top:3px}
  #settings .sf-head .gold{margin-left:auto;white-space:nowrap}
  #settings .sf-toggle{white-space:nowrap;min-width:86px;margin-left:0}
  #settings .sf-body{margin-top:8px}
  #settings .sf-card.sf-closed .sf-body{display:none}
  #settings .sf-card.sf-closed{padding-bottom:10px}
  #settings .sf-backup-card{background:#fffdf9;border:1px solid #e5dccf;border-radius:17px;padding:12px;margin:10px 0}
  #settings .sf-backup-title{font-size:16.5px;font-weight:900;margin-bottom:9px;color:#342d25}
  #settings .sf-backup-row{display:grid!important;grid-template-columns:1fr 1fr;gap:8px!important;margin:0!important}
  #settings .sf-backup-row>.btn,#settings .sf-backup-row>button{width:100%!important;margin:0!important;min-height:48px;padding:9px!important;font-size:13.5px!important}
  #settings .sf-backup-note{font-size:11.5px;color:#82796f;line-height:1.4;margin-top:8px}
  #settings .sf-save-primary{width:100%!important;min-height:54px;margin-top:10px!important;font-size:17px!important}
  @media(max-width:420px){
    #settings .sheet{padding-left:12px;padding-right:12px}
    #settings .sheet>.itemtop:first-child{margin-left:-12px;margin-right:-12px;padding-left:12px;padding-right:12px}
    #settings .sf-basic label{grid-template-columns:minmax(0,1fr) 118px;font-size:13px}
    #settings .sf-backup-row{grid-template-columns:1fr 1fr}
    #settings .sf-head h3,#settings .sf-head h2{font-size:15.5px!important}
    #settings .sf-section-sub{font-size:10.8px}
    #settings .sf-toggle{min-width:82px;padding-left:8px;padding-right:8px}
  }`;
  document.head.appendChild(s)
 }
 function header(){
  const sheet=document.querySelector('#settings .sheet');if(!sheet)return;
  const top=sheet.querySelector(':scope>.itemtop:first-child');if(!top)return;
  const h=top.querySelector('h2');if(h)h.textContent='ตั้งค่าการเงิน';
  let holder=top.querySelector('.sf-title-wrap');
  if(!holder&&h){holder=document.createElement('div');holder.className='sf-title-wrap';h.parentNode.insertBefore(holder,h);holder.appendChild(h)}
  if(holder&&!holder.querySelector('.sf-title-sub')){const sub=document.createElement('div');sub.className='sf-title-sub';sub.textContent='ปรับข้อมูลให้ตรงกับสถานะปัจจุบันของคุณ';holder.appendChild(sub)}
  const close=[...top.querySelectorAll('button')].find(b=>/ปิด/.test(b.textContent||''));if(close)close.classList.add('sf-close')
 }
 function basic(){
  const sheet=document.querySelector('#settings .sheet');if(!sheet)return;
  const name=document.getElementById('sName'),income=document.getElementById('sIncome'),saving=document.getElementById('sSaving'),emer=document.getElementById('sEmerTarget');
  if(!name||!income||!saving||!emer)return;
  let wrap=sheet.querySelector('.sf-basic');
  if(!wrap){
    const grid=name.closest('.grid')||name.parentElement?.parentElement;if(!grid)return;
    wrap=document.createElement('div');wrap.className='sf-basic';grid.parentNode.insertBefore(wrap,grid);wrap.appendChild(grid);
    const title=document.createElement('div');title.className='sf-basic-title';title.textContent='ข้อมูลพื้นฐาน';wrap.insertBefore(title,grid);
    const note=document.createElement('div');note.className='sf-info';note.textContent='เป้าหมายเงินฉุกเฉินแนะนำโดยทั่วไป 3–6 เดือนของค่าใช้จ่ายจำเป็น';wrap.appendChild(note)
  }
 }
 function wrap(containerId,key,title,subtitle){
  const body=document.getElementById(containerId);if(!body)return;
  const card=body.closest('.card');if(!card)return;card.classList.add('sf-card');
  const head=card.querySelector('.itemtop');if(!head)return;head.classList.add('sf-head');
  const h=head.querySelector('h3,h2');if(h){h.textContent=title;const sub=document.createElement('span');sub.className='sf-section-sub';sub.textContent=subtitle;h.appendChild(sub)}
  body.classList.add('sf-body');
  let btn=head.querySelector('.sf-toggle');if(!btn){btn=document.createElement('button');btn.type='button';btn.className='btn ghost sf-toggle';head.appendChild(btn)}
  const open=getState()[key]===true;card.classList.toggle('sf-closed',!open);btn.textContent=open?'▲ ย่อ':'▼ เปิดดู';
  btn.onclick=function(){const willOpen=card.classList.contains('sf-closed');card.classList.toggle('sf-closed',!willOpen);btn.textContent=willOpen?'▲ ย่อ':'▼ เปิดดู';put(key,willOpen)}
 }
 function backup(){
  const sheet=document.querySelector('#settings .sheet');if(!sheet)return;
  const buttons=[...sheet.querySelectorAll('button')];
  const b1=buttons.find(b=>/สำรองข้อมูลลงเครื่อง|สำรอง JSON|backup/i.test(b.textContent||''));
  const b2=buttons.find(b=>/กู้คืนข้อมูลจากไฟล์|นำเข้า JSON|restore/i.test(b.textContent||''));
  if(!b1||!b2)return;
  let row=b1.parentElement===b2.parentElement?b1.parentElement:null;
  if(!row&&b1.parentElement&&b2.parentElement&&b1.parentElement.parentElement===b2.parentElement.parentElement)row=b1.parentElement.parentElement;
  if(!row)return;row.classList.add('sf-backup-row');
  let card=row.closest('.sf-backup-card');
  if(!card){card=document.createElement('div');card.className='sf-backup-card';row.parentNode.insertBefore(card,row);card.appendChild(row);const t=document.createElement('div');t.className='sf-backup-title';t.textContent='สำรองและกู้คืนข้อมูล';card.insertBefore(t,row);const n=document.createElement('div');n.className='sf-backup-note';n.textContent='ควรสำรองไว้เป็นระยะ โดยเฉพาะก่อนเปลี่ยนเครื่องหรือล้างข้อมูล Browser';card.appendChild(n)}
  if(!b1.dataset.sfIcon){b1.dataset.sfIcon='1';b1.textContent='⇩ สำรองข้อมูลลงเครื่อง'}
  if(!b2.dataset.sfIcon){b2.dataset.sfIcon='1';b2.textContent='⇧ กู้คืนข้อมูลจากไฟล์'}
 }
 function save(){
  const sheet=document.querySelector('#settings .sheet');if(!sheet)return;
  const btn=[...sheet.querySelectorAll('button')].find(b=>/^\s*บันทึก(?:การตั้งค่า)?\s*$/.test(b.textContent||''));
  if(btn){btn.classList.add('sf-save-primary');btn.textContent='บันทึกการตั้งค่า'}
 }
 function apply(){css();header();basic();wrap('plans','monthly','ค่าใช้จ่ายประจำ / งบต่อเดือน','เช่น ค่าบ้าน ค่าเดินทาง ค่าอาหาร ฯลฯ');wrap('annuals','annual','ค่าใช้จ่ายรายปี','เช่น ประกัน ภาษี ท่องเที่ยว ฯลฯ');backup();save()}
 if(typeof renderSettings==='function'&&!window.__sfWrapped){const base=renderSettings;window.renderSettings=function(){const r=base.apply(this,arguments);setTimeout(apply,0);return r};window.__sfWrapped=true}
 if(typeof settings==='function'&&!window.__sfSettingsWrapped){const baseS=settings;window.settings=function(x){const r=baseS.apply(this,arguments);if(x)setTimeout(()=>{apply();const sh=document.querySelector('#settings .sheet');if(sh)sh.scrollTop=0},0);return r};window.__sfSettingsWrapped=true}
 [0,80,300].forEach(ms=>setTimeout(apply,ms));
})();