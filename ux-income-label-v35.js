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
    el.style.color='';
    if(remain<0){
      el.classList.add('red');
      el.style.color='var(--r)';
      el.textContent='⚠ ใช้เกินแผน '+fm(Math.abs(remain));
    }else{
      el.textContent=fm(remain);
    }
  }

  function renderRecentWithDelete(){
    const box=document.getElementById('recent');
    if(!box||typeof S==='undefined'||!Array.isArray(S.tx)||typeof thDate!=='function'||typeof fm!=='function')return;
    const l=[...S.tx].sort((a,b)=>(b.date+b.id).localeCompare(a.date+a.id)).slice(0,8);
    box.innerHTML=l.length?l.map(x=>`<div class="item"><div class="itemtop"><span><b>${x.note||x.cat}</b><div class="sub">${x.cat} • ${thDate(x.date)}</div></span><span style="text-align:right"><b class="${x.type==='expense'?'red':'green'}">${x.type==='expense'?'-':'+'}${fm(x.amount)}</b><br><button class="btn danger" style="margin-top:6px" onclick="delTx('${x.id}')">ลบ</button></span></div></div>`).join(''):'<div class="sub">ยังไม่มีรายการ</div>';
  }

  function apply(){
    renameInputLabel('sIncome');
    renameInputLabel('oIncome');
    renameNetWorth();
    applyActualToRemain();
    renderRecentWithDelete();
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
