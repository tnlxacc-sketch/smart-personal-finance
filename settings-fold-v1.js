// Settings UX: agreed compact mobile layout + collapsible monthly/annual sections.
// UI only; no finance data, formulas, storage keys, install flow or popup logic changes.
(function(){
 const KEY='spfm_ui_settings_fold_v1';
 function getState(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){return{}}}
 function put(k,v){const s=getState();s[k]=v;localStorage.setItem(KEY,JSON.stringify(s))}
 function css(){
  if(document.getElementById('sfCss'))return;
  const s=document.createElement('style');s.id='sfCss';
  s.textContent=`
  #settings .sheet{padding:0 14px calc(20px + env(safe-area-inset-bottom));scroll-padding-top:72px}
  #settings .sheet>.itemtop:first-child{position:sticky;top:0;z-index:8;margin:0 -14px 10px;padding:12px 14px 9px;background:#fbf8f2;border-bottom:1px solid rgba(120,100,75,.14)}
  #settings .sheet>.itemtop:first-child h2{margin:0;font-size:20px!important}
  #settings .sheet>.grid.g2:first-of-type{grid-template-columns:1fr 1fr!important;gap:8px!important}
  #settings .sheet>.grid.g2:first-of-type>label:first-child{grid-column:1/-1}
  #settings .sheet>.grid.g2:first-of-type>label:last-child{grid-column:1/-1;max-width:48%}
  #settings label{display:block;margin:0;font-size:14px;line-height:1.3}
  #settings input,#settings select{min-height:44px!important;margin-top:5px;padding:9px 11px!important}
  #settings .card{margin:9px 0!important;padding:10px 11px!important;border-radius:17px!important}
  #settings .sf-head{display:flex;align-items:center;gap:7px;min-height:48px}
  #settings .sf-head h3{margin:0;flex:1;line-height:1.2;font-size:16px!important}
  #settings .sf-head>.gold{min-width:76px;padding:9px 10px!important}
  #settings .sf-toggle{white-space:nowrap;min-width:88px;padding:9px 9px!important}
  #settings .sf-body{margin-top:7px}
  #settings .sf-card.sf-closed .sf-body{display:none}
  #settings .sf-card.sf-closed{padding-bottom:9px!important}
  #settings .sf-backup-row{display:grid!important;grid-template-columns:1fr 1fr!important;gap:8px!important;margin-top:9px!important}
  #settings .sf-backup-row>.btn,#settings .sf-backup-row>button{width:100%!important;margin:0!important;min-height:46px!important;padding:9px 8px!important;line-height:1.25}
  #settings .sf-save-primary{width:100%!important;min-height:50px!important;margin-top:9px!important;border-radius:14px!important}
  @media(max-width:380px){
    #settings .sheet{padding-left:11px;padding-right:11px}
    #settings .sheet>.itemtop:first-child{margin-left:-11px;margin-right:-11px;padding-left:11px;padding-right:11px}
    #settings .sheet>.grid.g2:first-of-type{grid-template-columns:1fr 1fr!important}
    #settings .sf-head h3{font-size:15px!important}
    #settings .sf-head>.gold{min-width:70px;font-size:14px!important}
    #settings .sf-toggle{min-width:82px;font-size:14px!important}
    #settings .sf-backup-row>.btn,#settings .sf-backup-row>button{font-size:14px!important}
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
  const backup=buttons.find(b=>/สำรองข้อมูลลงเครื่อง|สำรอง JSON|backup/i.test(b.textContent||''));
  const restore=buttons.find(b=>/กู้คืนข้อมูลจากไฟล์|นำเข้า JSON|restore/i.test(b.textContent||''));
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