// Money input formatting patch: presentation only. No formulas, storage, workflow, or business logic changes.
(function(){
  function isMoneyInput(el){
    if(!el || el.tagName!=='INPUT') return false;
    if(el.classList.contains('money')) return true;
    const id=String(el.id||'').toLowerCase();
    const ph=String(el.placeholder||'').toLowerCase();
    const label=String(el.closest('label')?.textContent||'');
    if(/rate|year|month|date|search|name|note|cat|emer.?target/.test(id)) return false;
    if(/ดอกเบี้ย|เปอร์เซ็นต์|%|ระยะเวลา|เดือน\)|วันที่|ชื่อ|หมายเหตุ|ค้นหา/.test(label)) return false;
    return /(amount|amt|price|cash|loan|payment|balance|value|income|saving|expense|annual|debt|prepay|extra)/.test(id) || /(บาท|เงิน|ยอด|มูลค่า|ราคา|ค่างวด|หนี้|รายรับ|รายจ่าย)/.test(label) || /1,?500,?000|100,?000|20,?000/.test(ph);
  }
  function format(el){
    if(!isMoneyInput(el) || document.activeElement===el) return;
    if(typeof moneyTyping==='function') moneyTyping(el);
  }
  function bind(root){
    (root||document).querySelectorAll('input').forEach(el=>{
      if(!isMoneyInput(el) || el.dataset.moneyCommaBound==='1') return;
      el.dataset.moneyCommaBound='1';
      el.classList.add('money');
      el.addEventListener('input',function(){ if(typeof moneyTyping==='function') moneyTyping(this); });
      el.addEventListener('blur',function(){ format(this); });
      format(el);
    });
  }
  bind(document);
  new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeType===1)bind(n)}))).observe(document.documentElement,{childList:true,subtree:true});
  document.addEventListener('focusin',e=>{if(isMoneyInput(e.target))format(e.target)},true);
})();
