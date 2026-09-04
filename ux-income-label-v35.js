// UX-only label clarification. No calculation, storage key, or user data changes.
(function(){
  const text='เงินสำหรับใช้จ่าย/เดือน (หลังแยกเงินออมแล้ว)';
  function renameInputLabel(id){
    const input=document.getElementById(id);
    const label=input&&input.closest('label');
    if(!label)return;
    const node=[...label.childNodes].find(n=>n.nodeType===Node.TEXT_NODE&&n.nodeValue.trim());
    if(node)node.nodeValue=text;
  }
  renameInputLabel('sIncome');
  renameInputLabel('oIncome');
})();
