// Money input formatting patch: presentation only. No formulas, storage, workflow, or business logic changes.
(function(){
  function isMoneyInput(el){
    if(!el || el.tagName!=='INPUT') return false;
    const id=String(el.id||'').toLowerCase();
    const ph=String(el.placeholder||'').toLowerCase();
    const label=String(el.closest('label')?.textContent||'');
    if(/rate|interest|year|month|date|search|name|note|cat|emer.?target/.test(id)) return false;
    if(/ดอกเบี้ย|อัตรา|เปอร์เซ็นต์|%|ระยะเวลา|เดือน\)|วันที่|ชื่อ|หมายเหตุ|ค้นหา/.test(label)) return false;
    if(el.classList.contains('money')) return true;
    return /(amount|amt|price|cash|loan|payment|balance|value|income|saving|expense|annual|debt|prepay|extra|target|current)/.test(id) || /(บาท|เงิน|ยอด|มูลค่า|ราคา|ค่างวด|หนี้|รายรับ|รายจ่าย)/.test(label) || /1,?500,?000|100,?000|20,?000/.test(ph);
  }
  function format(el){
    if(!isMoneyInput(el)) return;
    if(typeof moneyTyping==='function') moneyTyping(el);
  }
  function bind(root){
    const list=[];
    if(root && root.matches && root.matches('input')) list.push(root);
    if(root && root.querySelectorAll) root.querySelectorAll('input').forEach(el=>list.push(el));
    list.forEach(el=>{
      if(!isMoneyInput(el) || el.dataset.moneyCommaBound==='1') return;
      el.dataset.moneyCommaBound='1';
      el.classList.add('money');
      el.addEventListener('input',function(){ format(this); });
      el.addEventListener('blur',function(){ format(this); });
      if(el.value) format(el);
    });
  }
  bind(document);
  new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(node=>{if(node.nodeType===1)bind(node)}))).observe(document.documentElement,{childList:true,subtree:true});
})();
