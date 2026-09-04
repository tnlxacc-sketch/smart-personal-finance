// V3.4 calculation/UX patch. Keeps localStorage key spfm_public_v1 unchanged.
(function(){
  const isPropertyAsset=x=>x.assetClass==='property'||/บ้าน|คอนโด|ที่ดิน|รถ|อสังหาริมทรัพย์/.test(String(x.name||''));
  const isHomeAsset=x=>isPropertyAsset(x)&&/บ้าน|คอนโด/.test(String((x.assetType||'')+' '+(x.name||'')));
  const isHomeDebt=x=>x.debtType==='บ้าน'||/บ้าน/.test(String(x.name||''));

  // Migrate existing rows without changing their values.
  S.assets=(S.assets||[]).map(x=>Object.assign({assetClass:isPropertyAsset(x)?'property':'financial',assetType:isPropertyAsset(x)?'บ้าน/คอนโด':'เงิน/การลงทุน'},x));
  S.debts=(S.debts||[]).map(x=>Object.assign({debtType:isHomeDebt(x)?'บ้าน':(/รถ/.test(String(x.name||''))?'รถ':'อื่นๆ')},x));
  save();

  // Source of truth: every asset value is included in total assets.
  ac=function(){
    const total=sum(S.assets,'value');
    const financial=sum(S.assets.filter(x=>(x.assetClass||'financial')==='financial'),'value');
    const property=sum(S.assets.filter(x=>(x.assetClass||'financial')==='property'),'value');
    const liq=sum(S.assets.filter(x=>x.kind==='พร้อมใช้'),'value');
    const inv=sum(S.assets.filter(x=>x.kind==='ลงทุน'),'value');
    const em=sum(S.assets.filter(x=>x.kind==='Emergency'),'value');
    const debt=sum(S.debts,'balance');
    return {total,financial,property,liq,inv,em,debt,net:total-debt};
  };

  const position=document.getElementById('position');
  position.innerHTML=`
    <div class="grid g2">
      <div class="card"><div class="itemtop"><div><h2>เงินและการลงทุน</h2><div class="sub">เงินสด เงินฝาก หุ้น กองทุน สลาก เงินเกษียณ ฯลฯ</div></div><button class="btn gold" onclick="addAsset('financial')">+ เพิ่ม</button></div><div id="financialAssets"></div></div>
      <div class="card"><div class="itemtop"><div><h2>ทรัพย์สินอื่น</h2><div class="sub">บ้าน/คอนโด ที่ดิน รถ หรือทรัพย์สินที่มีมูลค่า</div></div><button class="btn gold" onclick="addAsset('property')">+ เพิ่ม</button></div><div id="propertyAssets"></div></div>
    </div>
    <div class="card"><div class="itemtop"><div><h2>หนี้สินทั้งหมด</h2><div class="sub">หนี้บ้าน รถ บัตรเครดิต สินเชื่อ</div></div><button class="btn gold" onclick="addDebt()">+ เพิ่ม</button></div><div id="debts"></div></div>
    <div class="card">
      <h2>สรุปฐานะการเงินทั้งหมด</h2>
      <div class="row"><span>เงินและการลงทุนรวม</span><b id="sumFinancial">฿0</b></div>
      <div class="row"><span>ทรัพย์สินอื่นรวม</span><b id="sumProperty">฿0</b></div>
      <div class="row"><span><b>ทรัพย์สินรวมทั้งหมด</b></span><b id="sumAssets">฿0</b></div>
      <div class="row"><span>หนี้สินรวมทั้งหมด</span><b id="sumDebts">฿0</b></div>
      <div class="row"><span><b>มูลค่าทรัพย์สินสุทธิ</b><div class="sub">ทรัพย์สินรวมทั้งหมด − หนี้สินรวมทั้งหมด</div></span><b id="sumNet">฿0</b></div>
      <div id="homeAssetWarning" class="warn" style="display:none;margin-top:10px"></div>
      <div class="warn" style="margin-top:10px">บ้าน/คอนโดและรถ ให้ใส่ “มูลค่าปัจจุบันโดยประมาณ” ไม่ใช่ราคาซื้อเดิม ระบบจะไม่เดามูลค่าให้</div>
    </div>`;

  const dNet=document.getElementById('dNet');
  if(dNet){
    const card=dNet.closest('.card');
    const label=card&&card.querySelector('small'); if(label)label.textContent='มูลค่าทรัพย์สินสุทธิ';
    if(card&&!document.getElementById('dNetFormula'))card.insertAdjacentHTML('beforeend','<div class="sub" id="dNetFormula">ทรัพย์สินรวม − หนี้สินรวม</div>');
  }
  const dash=document.getElementById('dash');
  const firstKpiGrid=dash&&dash.querySelector('.grid.g4');
  if(firstKpiGrid&&!document.getElementById('positionSummaryDash'))firstKpiGrid.insertAdjacentHTML('afterend','<div id="positionSummaryDash" class="card"><h2>ฐานะการเงินทั้งหมด</h2><div class="grid g2"><div class="row"><span>ทรัพย์สินรวมทั้งหมด</span><b id="dashAssetsTotal">฿0</b></div><div class="row"><span>หนี้สินรวมทั้งหมด</span><b id="dashDebtsTotal">฿0</b></div></div><div class="sub" id="dashNetExplain" style="margin-top:8px"></div></div>');

  function assetRow(x,i,property){
    const typeOptions=property?['บ้าน/คอนโด','ที่ดิน','รถ','ทอง/ของมีค่า','ทรัพย์สินอื่น']:['เงินสด','เงินฝาก','หุ้น','กองทุน','สลาก/พันธบัตร','เงินเกษียณ','ทอง','อื่นๆ'];
    const kinds=['พร้อมใช้','ลงทุน','Emergency','เกษียณ'];
    return `<div class="item"><input value="${String(x.name||'').replace(/"/g,'&quot;')}" onchange="S.assets[${i}].name=this.value;save();render()"><div class="grid g2"><label>ประเภท<select onchange="S.assets[${i}].assetType=this.value;save();render()">${typeOptions.map(t=>`<option ${x.assetType===t?'selected':''}>${t}</option>`).join('')}</select></label><label>${property?'มูลค่าปัจจุบันโดยประมาณ':'มูลค่า'}<input class="money" value="${mi(x.value)}" inputmode="decimal" oninput="moneyTyping(this);assetValueLive(${i},this.value)"></label>${property?'':`<label>กลุ่ม<select onchange="S.assets[${i}].kind=this.value;save();render()">${kinds.map(t=>`<option ${x.kind===t?'selected':''}>${t}</option>`).join('')}</select></label>`}</div><button class="btn danger" onclick="S.assets.splice(${i},1);save();render()">ลบ</button></div>`;
  }

  window.renderPosition=function(){
    const fin=S.assets.map((x,i)=>({x,i})).filter(o=>(o.x.assetClass||'financial')==='financial');
    const prop=S.assets.map((x,i)=>({x,i})).filter(o=>(o.x.assetClass||'financial')==='property');
    financialAssets.innerHTML=fin.length?fin.map(o=>assetRow(o.x,o.i,false)).join(''):'<div class="sub">ยังไม่มีเงิน/การลงทุน</div>';
    propertyAssets.innerHTML=prop.length?prop.map(o=>assetRow(o.x,o.i,true)).join(''):'<div class="sub">ยังไม่มีบ้าน/รถ/ทรัพย์สินอื่น</div>';
    debts.innerHTML=S.debts.length?S.debts.map((x,i)=>`<div class="item"><input value="${String(x.name||'').replace(/"/g,'&quot;')}" onchange="S.debts[${i}].name=this.value;save();render()"><div class="grid g2"><label>ประเภท<select onchange="S.debts[${i}].debtType=this.value;save();render()"><option ${x.debtType==='บ้าน'?'selected':''}>บ้าน</option><option ${x.debtType==='รถ'?'selected':''}>รถ</option><option ${x.debtType==='บัตรเครดิต'?'selected':''}>บัตรเครดิต</option><option ${x.debtType==='สินเชื่อ'?'selected':''}>สินเชื่อ</option><option ${x.debtType==='อื่นๆ'?'selected':''}>อื่นๆ</option></select></label><label>ยอดคงเหลือ<input class="money" value="${mi(x.balance)}" inputmode="decimal" oninput="moneyTyping(this);debtValueLive(${i},'balance',this.value)"></label><label>ค่างวด/เดือน<input class="money" value="${mi(x.payment)}" inputmode="decimal" oninput="moneyTyping(this);debtValueLive(${i},'payment',this.value)"></label></div><button class="btn danger" onclick="S.debts.splice(${i},1);save();render()">ลบ</button></div>`).join(''):'<div class="sub">ยังไม่มีหนี้</div>';
    refreshV34();
  };

  window.addAsset=function(assetClass='financial'){
    if(assetClass==='property')S.assets.push({name:'บ้าน/ทรัพย์สินใหม่',value:0,kind:'ทรัพย์สิน',assetClass:'property',assetType:'บ้าน/คอนโด'});
    else S.assets.push({name:'บัญชี/ทรัพย์สินใหม่',value:0,kind:'พร้อมใช้',assetClass:'financial',assetType:'เงินฝาก'});
    save();render();
  };
  window.addDebt=function(){S.debts.push({name:'หนี้ใหม่',balance:0,payment:0,debtType:'อื่นๆ'});save();render()};
  window.assetValueLive=function(i,v){S.assets[i].value=val(v);save();refreshV34()};
  window.debtValueLive=function(i,k,v){S.debts[i][k]=val(v);save();refreshV34()};

  function refreshV34(){
    const a=ac();
    if(document.getElementById('dNet'))dNet.textContent=fm(a.net);
    const f=document.getElementById('dNetFormula');if(f)f.textContent=`${fm(a.total)} − ${fm(a.debt)}`;
    const map={sumFinancial:a.financial,sumProperty:a.property,sumAssets:a.total,sumDebts:a.debt,sumNet:a.net,dashAssetsTotal:a.total,dashDebtsTotal:a.debt};
    Object.entries(map).forEach(([id,v])=>{const e=document.getElementById(id);if(e)e.textContent=fm(v)});
    const de=document.getElementById('dashNetExplain');if(de)de.textContent=`ทรัพย์สินรวม ${fm(a.total)} − หนี้สินรวม ${fm(a.debt)} = มูลค่าทรัพย์สินสุทธิ ${fm(a.net)}`;
    const w=document.getElementById('homeAssetWarning');if(w){const show=S.debts.some(isHomeDebt)&&!S.assets.some(isHomeAsset);w.style.display=show?'block':'none';w.textContent=show?'พบหนี้บ้าน แต่ยังไม่พบมูลค่าบ้าน/คอนโดในทรัพย์สิน กรุณาเพิ่มมูลค่าปัจจุบันโดยประมาณของบ้าน เพื่อให้มูลค่าทรัพย์สินสุทธิสะท้อนภาพจริง':'';}
  }
  window.refreshV34=refreshV34;

  const baseRender=render;
  render=function(){baseRender();refreshV34()};
  render();
})();