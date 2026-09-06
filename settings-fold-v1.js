// Settings UX: compact mobile layout + collapsible monthly/annual sections.
// UI only; no finance data, formulas, storage keys or workflow changes.
(function(){
 const KEY='spfm_ui_settings_fold_v1';
 function getState(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){return{}}}
 function put(k,v){const s=getState();s[k]=v;localStorage.setItem(KEY,JSON.stringify(s))}
 function css(){
  if(document.getElementById('sfCss'))return;
  const s=document.createElement('style');s.id='sfCss';
  s.textContent=`
  #settings .sheet{padding:0 16px 20px;scroll-padding-top:78px}
  #settings .sheet>.itemtop:first-child{position:sticky;top:0;z-index:8;margin:0 -16px 12px;padding:13px 16px 10px;background:var(--bg,#fff);border-bottom:1px solid rgba(120,100,75,.14)}
  #settings .sheet>.itemtop:first-child h2{margin:0}
  #settings .grid{gap:8px}
  #settings label{display:block;margin-bottom:2px}
  #settings input,#settings select{min-height:48px}
  #settings .card{margin-bottom:10px;padding:12px}
  #settings .sf-head{display:flex;align-items:center;gap:8px;min-height:52px}
  #settings .sf-head h3{margin:0;flex:1;line-height:1.25}
  #settings .sf-toggle{white-space:nowrap;min-width:94px}
  #settings .sf-body{margin-top:8px}
  #settings .sf-card.sf-closed .sf-body{display:none}
  #settings .sf-card.sf-closed{padding-bottom:10px}
  #settings .sf-backup-row{display:grid!important;grid-template-columns:1fr 1fr;gap:8px!important;margin-top:10px}
  #settings .sf-backup-row>.btn,#settings .sf-backup-row>button{width:100%!important;margin:0!important;min-height:48px}
  #settings .sf-save-primary{width:100%!important;min-height:52px;margin-top:10px!important}
  @media(max-width:420px){
    #settings .sheet{padding-left:12px;padding-right:12px}
    #settings .sheet>.itemtop:first-child{margin-left:-12px;margin-right:-12px;padding-left:12px;padding-right:12px}
    #settings .sf-backup-row{grid-template-columns:1fr 1fr}
    #settings .sf-head h3{font-size:16px}
    #settings .sf-toggle{min-width:90px;padding-left:9px;padding-right:9px}
  }`;
  document.head.appendChild(s)
 }
 function wrap(containerId,key,title){
  const body=document.getElementById(containerId);if(!body)return;
  const card=body.closest('.card');if(!card)return;card.classList.add('sf-card');
  const head=card.querySelector('.itemtop');if(!head)return;head.classList.add('sf-head');
  const h=head.querySelector('h3,h2');if(h)h.textContent=title;
  body.classList.add('sf-body');
  let btn=head.querySelector('.sf-toggle');if(!btn){btn=document.createElement('button');btn.type='button';btn.className='btn ghost sf-toggle';head.appendChild(btn)}
  const open=getState()[key]===true;card.classList.toggle('sf-closed',!open);btn.textContent=open?'▲ ย่อ':'▼ เปิดดู';
  btn.onclick=function(){const willOpen=card.classList.contains('sf-closed');card.classList.toggle('sf-closed',!willOpen);btn.textContent=willOpen?'▲ ย่อ':'▼ เปิดดู';put(key,willOpen)}
 }
 function compactActions(){
  const sheet=document.querySelector('#settings .sheet');if(!sheet)return;
  const buttons=[...sheet.querySelectorAll('button')];
  const backup=buttons.find(b=>/สำรองข้อมูลลงเครื่อง|backup/i.test(b.textContent||''));
  const restore=buttons.find(b=>/กู้คืนข้อมูลจากไฟล์|restore/i.test(b.textContent||''));
  if(backup&&restore){
   const p1=backup.parentElement,p2=restore.parentElement;
   if(p1===p2){p1.classList.add('sf-backup-row')}
   else if(p1&&p2&&p1.parentElement===p2.parentElement){p1.parentElement.classList.add('sf-backup-row')}
  }
  const saveBtn=buttons.find(b=>/^\s*บันทึก(?:การตั้งค่า)?\s*$/.test(b.textContent||''));
  if(saveBtn)saveBtn.classList.add('sf-save-primary')
 }
 function apply(){css();wrap('plans','monthly','ค่าใช้จ่ายประจำ / งบต่อเดือน');wrap('annuals','annual','ค่าใช้จ่ายรายปี');compactActions()}
 if(typeof renderSettings==='function'&&!window.__sfWrapped){const base=renderSettings;window.renderSettings=function(){const r=base.apply(this,arguments);setTimeout(apply,0);return r};window.__sfWrapped=true}
 if(typeof settings==='function'&&!window.__sfSettingsWrapped){const baseS=settings;window.settings=function(x){const r=baseS.apply(this,arguments);if(x)setTimeout(()=>{apply();const sh=document.querySelector('#settings .sheet');if(sh)sh.scrollTop=0},0);return r};window.__sfSettingsWrapped=true}
 [0,80,300].forEach(ms=>setTimeout(apply,ms));
})();