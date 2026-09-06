// Dashboard intro is intentionally kept compact and always visible.
// Presentation only; no finance data or calculation changes.
(function(){
 function clean(){
  const dash=document.getElementById('dash');if(!dash)return;
  const card=[...dash.querySelectorAll(':scope > .card')].find(c=>{const h=c.querySelector('h2');return h&&(h.textContent.includes('Quick Guide')||h.textContent.includes('M Personal Finance ช่วยอะไร?'))});
  if(!card)return;
  const body=card.querySelector('#quickGuideBody');
  if(body){while(body.firstChild)card.appendChild(body.firstChild);body.remove()}
  const head=card.querySelector('h2')?.parentElement;
  if(head&&head!==card&&head.querySelector('h2')){const h=head.querySelector('h2');card.insertBefore(h,head);head.remove()}
  card.querySelectorAll('.pe-fold,button').forEach(b=>{if(/ย่อ|เปิด/.test(b.textContent||''))b.remove()});
 }
 if(typeof render==='function'&&!window.__quickGuideFoldWrapped){const base=render;window.render=function(){base();setTimeout(clean,0)};window.__quickGuideFoldWrapped=true}
 clean();
})();