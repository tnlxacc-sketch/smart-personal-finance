// Minimal UX/calculation patch. Preserves storage key, data schema, layout and existing plan logic.
(function(){
  const incomeLabel='เงินสำหรับใช้จ่าย/เดือน (หลังแยกเงินออมแล้ว)';

  function renameInputLabel(id){
    const input=document.getElementById(id);
    const label=input&&input.closest('label');
    if(!label)return;
    const node=[...label.childNodes].find(n=>n.nodeType===Node.TEXT_NODE&&n.nodeValue.trim());
    if(node)node.nodeValue=incomeLabel;
  }

  function renameNetWorth(){
    document.querySelectorAll('small,h2,h3,span').forEach(el=>{
      if(el.textContent.trim()==='Net Worth') el.textContent='มูลค่าทรัพย์สินสุทธิ';
    });
  }

  function applyActualToRemain(){
    if(typeof plan!=='function'||typeof txMonth!=='function'||typeof sum!=='function'||typeof fm!=='function')return;
    const p=plan();
    const tm=txMonth();
    const actualIncome=sum(tm.filter(x=>x.type==='income'),'amount');
    const actualExpense=sum(tm.filter(x=>x.type==='expense'),'amount');
    const remain=(+p.remain||0)+actualIncome-actualExpense;
    const el=document.getElementById('dRemain');
    if(!el)return;
    el.classList.remove('red');
    if(remain<0){
      el.classList.add('red');
      el.textContent='⚠ ใช้เกินแผน '+fm(Math.abs(remain));
    }else{
      el.textContent=fm(remain);
    }
  }

  function apply(){
    renameInputLabel('sIncome');
    renameInputLabel('oIncome');
    renameNetWorth();
    applyActualToRemain();
  }

  if(typeof render==='function'){
    const baseRender=render;
    render=function(){
      baseRender();
      apply();
    };
  }

  apply();
})();
