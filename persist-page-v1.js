// Persist current main tab across refresh. Presentation/navigation state only.
(function(){
 const KEY='spfm_last_page_v1';
 const VALID=new Set(['dash','quick','hist','position','future']);
 function savePage(id){if(VALID.has(id)){try{localStorage.setItem(KEY,id)}catch(e){}}}
 function restore(){let id='';try{id=localStorage.getItem(KEY)||''}catch(e){}if(!VALID.has(id)||id==='dash')return;const page=document.getElementById(id);if(!page)return;document.querySelectorAll('.page').forEach(x=>x.classList.remove('on'));page.classList.add('on');document.querySelectorAll('.tabs button[data-p]').forEach(x=>x.classList.toggle('on',x.dataset.p===id));if(typeof render==='function')setTimeout(()=>{try{render()}catch(e){}},0)}
 if(typeof window.go==='function'&&!window.__persistPageWrapped){const base=window.go;window.go=function(id){savePage(id);return base.apply(this,arguments)};window.__persistPageWrapped=true}
 document.querySelectorAll('.tabs button[data-p]').forEach(b=>b.addEventListener('click',()=>savePage(b.dataset.p),{capture:true}));
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(restore,0));else setTimeout(restore,0);
})();