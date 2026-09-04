// Collapsible dashboard Quick Guide. Presentation only; no finance data changes.
(function(){
  const K='spfm_ui_quickguide_v1';
  function mount(){
    const dash=document.getElementById('dash');if(!dash)return;
    const h=[...dash.querySelectorAll('h2')].find(x=>x.textContent.trim().startsWith('Quick Guide'));
    const card=h&&h.closest('.card');if(!card||card.dataset.foldReady)return;
    card.dataset.foldReady='1';
    const open=localStorage.getItem(K)!=='0';
    const body=document.createElement('div');body.id='quickGuideBody';
    while(h.nextSibling)body.appendChild(h.nextSibling);
    const head=document.createElement('div');head.style.cssText='display:flex;align-items:center;justify-content:space-between;gap:8px;cursor:pointer';
    h.style.margin='0';h.parentNode.insertBefore(head,h);head.appendChild(h);
    const b=document.createElement('button');b.type='button';b.className='btn ghost';head.appendChild(b);
    head.onclick=function(e){e.preventDefault();const show=body.style.display==='none';body.style.display=show?'block':'none';b.textContent=show?'▲ ย่อ':'▼ เปิด';try{localStorage.setItem(K,show?'1':'0')}catch(_){}};
    card.appendChild(body);body.style.display=open?'block':'none';b.textContent=open?'▲ ย่อ':'▼ เปิด';
  }
  if(typeof render==='function'&&!window.__quickGuideFoldWrapped){const base=render;window.render=function(){base();mount()};window.__quickGuideFoldWrapped=true;}
  mount();
})();