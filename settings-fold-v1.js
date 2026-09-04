// Collapsible monthly/annual expense sections in Settings. UI only; no finance data changes.
(function(){
 const KEY='spfm_ui_settings_fold_v1';
 function getState(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){return{}}}
 function put(k,v){let s=getState();s[k]=v;localStorage.setItem(KEY,JSON.stringify(s))}
 function css(){if(document.getElementById('sfCss'))return;let s=document.createElement('style');s.id='sfCss';s.textContent=`#settings .sf-head{display:flex;align-items:center;gap:7px}#settings .sf-head h3{margin:0;flex:1}#settings .sf-toggle{white-space:nowrap}#settings .sf-body{margin-top:8px}#settings .sf-card.sf-closed .sf-body{display:none}#settings .sf-card.sf-closed{padding-bottom:12px}`;document.head.appendChild(s)}
 function wrap(containerId,key,title){let body=document.getElementById(containerId);if(!body)return;let card=body.closest('.card');if(!card)return;card.classList.add('sf-card');let head=card.querySelector('.itemtop');if(!head)return;head.classList.add('sf-head');let h=head.querySelector('h3');if(h)h.textContent=title;
  if(!body.classList.contains('sf-body'))body.classList.add('sf-body');
  let btn=head.querySelector('.sf-toggle');if(!btn){btn=document.createElement('button');btn.type='button';btn.className='btn ghost sf-toggle';head.appendChild(btn)}
  let open=getState()[key]===true;card.classList.toggle('sf-closed',!open);btn.textContent=open?'▲ ย่อ':'▼ เปิดดู';btn.onclick=function(){let willOpen=card.classList.contains('sf-closed');card.classList.toggle('sf-closed',!willOpen);btn.textContent=willOpen?'▲ ย่อ':'▼ เปิดดู';put(key,willOpen)};
 }
 function apply(){css();wrap('plans','monthly','ค่าใช้จ่ายประจำ / งบต่อเดือน');wrap('annuals','annual','ค่าใช้จ่ายรายปี')}
 if(typeof renderSettings==='function'&&!window.__sfWrapped){let base=renderSettings;window.renderSettings=function(){base();setTimeout(apply,0)};window.__sfWrapped=true}
 if(typeof settings==='function'&&!window.__sfSettingsWrapped){let baseS=settings;window.settings=function(x){baseS(x);if(x)setTimeout(apply,0)};window.__sfSettingsWrapped=true}
 apply();
})();