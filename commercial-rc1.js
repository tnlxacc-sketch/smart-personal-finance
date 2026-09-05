// Moji Commercial RC1 — additive only. Preserves finance formulas, storage key, theme and 5-tab navigation.
(function(){
  const LAST_BACKUP='spfm_last_backup_v1';
  const PRO_BADGE='<span class="rc-pro-badge">PRO</span>';
  const $=id=>document.getElementById(id);
  const num=v=>{const x=Number(String(v==null?'':v).replace(/,/g,''));return Number.isFinite(x)?x:0};
  const money=v=>typeof fm==='function'?fm(v):'฿'+Math.round(num(v)).toLocaleString('th-TH');
  const esc=v=>String(v==null?'':v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const ymNow=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')};
  const txYm=x=>String(x&&x.date||'').slice(0,7);
  const monthTx=(ym=ymNow())=>(typeof S!=='undefined'&&Array.isArray(S.tx)?S.tx:[]).filter(x=>txYm(x)===ym);
  const sumAmt=(xs,type)=>xs.filter(x=>!type||x.type===type).reduce((s,x)=>s+num(x.amount),0);
  const planNow=()=>typeof plan==='function'?plan():{inc:0,ex:0,an:0,remain:0};
  const posNow=()=>typeof ac==='function'?ac():{total:0,liq:0,inv:0,em:0,debt:0,net:0};

  function css(){if($('rc1Css'))return;const s=document.createElement('style');s.id='rc1Css';s.textContent=`
    .rc-monthly{padding:12px 14px}.rc-monthly-line{font-size:13px;line-height:1.65}.rc-monthly-line b{color:var(--n)}
    .rc-pro-badge{display:inline-block;margin-left:6px;padding:2px 7px;border:1px solid #b79248;border-radius:999px;font-size:9px;letter-spacing:.5px;color:#7b5a23;background:#fffaf0;vertical-align:middle}
    .rc-goal-forecast{margin-top:8px;padding:9px 10px;border-radius:10px;background:#fbf7ef;border:1px solid #eadfc9;font-size:12px;line-height:1.55}.rc-mini-btn{border:0;background:transparent;color:#7b5a23;font-weight:800;padding:4px 0;text-decoration:underline}
    .rc-export{margin-top:12px;padding-top:12px;border-top:1px solid #eadfc9}.rc-export-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:9px}.rc-export-grid .btn{width:100%}.rc-backup-note{margin-top:9px;font-size:12px;line-height:1.5}.rc-muted{color:#786f65}
    @media(max-width:520px){.rc-export-grid{grid-template-columns:1fr}}
  `;document.head.appendChild(s)}

  // 1) Backdated transaction: after a successful save, show the month that was actually entered.
  function wrapBackdate(){
    if(window.__rcBackdateWrapped||typeof window.saveTx!=='function')return;window.__rcBackdateWrapped=true;
    const base=window.saveTx;
    window.saveTx=function(){
      const raw=$('qDate')?.value||'';const m=raw.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);const ym=m?m[3]+'-'+m[2]:'';
      const before=(typeof S!=='undefined'&&Array.isArray(S.tx))?S.tx.length:0;
      const out=base.apply(this,arguments);
      setTimeout(()=>{const after=(typeof S!=='undefined'&&Array.isArray(S.tx))?S.tx.length:0;if(after>before&&ym){const f=$('qListMonth');if(f){f.value=ym;f.dispatchEvent(new Event('change',{bubbles:true}))}}},0);
      return out;
    };
  }

  // 2) One-sentence monthly control summary; does not replace or recalculate the approved KPI cards.
  function mountMonthly(){
    const dash=$('dash');if(!dash)return;let box=$('rcMonthlySummary');
    if(!box){box=document.createElement('div');box.id='rcMonthlySummary';box.className='card rc-monthly';const firstGrid=[...dash.children].find(x=>x.classList&&x.classList.contains('g4'));if(firstGrid)firstGrid.insertAdjacentElement('afterend',box);else dash.insertBefore(box,dash.firstChild)}
    const p=planNow(),tx=monthTx(),inc=sumAmt(tx,'income'),exp=sumAmt(tx,'expense'),remain=num(p.remain)+inc-exp;
    box.innerHTML=`<div class="sub">สรุปเดือนนี้</div><div class="rc-monthly-line"><b>เริ่มต้น ${money(p.remain)}</b> • ใช้เพิ่ม ${money(exp)}${inc?` • รายรับเพิ่ม ${money(inc)}`:''} • <b class="${remain<0?'red':''}">เหลือ ${money(remain)}</b></div>`;
  }

  // 3) Goal forecast with an optional monthly amount per goal.
  window.rcSetGoalMonthly=function(id){
    if(typeof S==='undefined'||!Array.isArray(S.goals))return;const g=S.goals.find(x=>x.id===id);if(!g)return;
    const v=prompt('ต้องการเก็บเงินให้เป้าหมายนี้เดือนละเท่าไร (บาท)',String(num(g.monthly)||''));if(v===null)return;g.monthly=num(v);
    if(typeof save==='function')save();if(typeof render==='function')render();
  };
  function goalForecast(){
    if(typeof S==='undefined'||!Array.isArray(S.goals))return;const body=document.querySelector('[data-fh="goals"] .fhbody');if(!body)return;
    const goals=[...S.goals].sort((a,b)=>(num(a.target)-num(a.current))-(num(b.target)-num(b.current)));
    const cards=[...body.querySelectorAll(':scope > .item')];
    cards.forEach((card,i)=>{const g=goals[i];if(!g)return;card.querySelector('.rc-goal-forecast')?.remove();const left=Math.max(0,num(g.target)-num(g.current)),monthly=num(g.monthly);let text='';
      if(left<=0)text='✅ เป้าหมายนี้ถึงยอดแล้ว';
      else if(monthly>0){const months=Math.ceil(left/monthly),d=new Date();d.setMonth(d.getMonth()+months);const when=new Intl.DateTimeFormat('th-TH',{month:'long',year:'numeric'}).format(d);text=`ถ้าเก็บ ${money(monthly)}/เดือน คาดว่าจะถึงเป้าประมาณ <b>${months} เดือน</b> (${esc(when)})`;}
      else text='ตั้งเงินเก็บต่อเดือน เพื่อให้ Moji คาดการณ์ว่าจะถึงเป้าเมื่อไร';
      const div=document.createElement('div');div.className='rc-goal-forecast';div.innerHTML=`${text}<br><button class="rc-mini-btn" onclick="rcSetGoalMonthly('${esc(g.id)}')">${monthly?'แก้เงินเก็บ/เดือน':'ตั้งเงินเก็บ/เดือน'}</button>`;card.appendChild(div);
    });
    const head=document.querySelector('[data-fh="goals"] h2');if(head&&!head.querySelector('.rc-pro-badge'))head.insertAdjacentHTML('beforeend',PRO_BADGE);
  }

  function markPro(){
    const what=$('whatIfCard')?.querySelector('h2');if(what&&!what.querySelector('.rc-pro-badge'))what.insertAdjacentHTML('beforeend',PRO_BADGE);
    const asst=document.querySelector('[data-fh="assistant"] h2');if(asst&&!asst.querySelector('.rc-pro-badge'))asst.insertAdjacentHTML('beforeend',PRO_BADGE);
    const hi=$('histInsights');if(hi){hi.querySelectorAll('h2,h3').forEach((h,i)=>{if(i<2&&!h.querySelector('.rc-pro-badge'))h.insertAdjacentHTML('beforeend',PRO_BADGE)})}
  }

  function downloadText(name,mime,text){
    if(window.MojiAndroid&&typeof window.MojiAndroid.saveTextFile==='function'){try{window.MojiAndroid.saveTextFile(name,mime,text);return}catch(e){}}
    const blob=new Blob([text],{type:mime+';charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
  }
  function csvCell(v){const s=String(v==null?'':v);return '"'+s.replace(/"/g,'""')+'"'}
  window.rcExportCsv=function(){
    const rows=[['วันที่','ประเภท','หมวด','หมายเหตุ','จำนวนเงิน']];
    (S.tx||[]).slice().sort((a,b)=>String(a.date).localeCompare(String(b.date))).forEach(x=>rows.push([typeof thDate==='function'?thDate(x.date):x.date,x.type==='income'?'รายรับ':'ค่าใช้จ่าย',x.cat||'',x.note||'',num(x.amount).toFixed(2)]));
    downloadText('moji-transactions-'+ymNow()+'.csv','text/csv','\ufeff'+rows.map(r=>r.map(csvCell).join(',')).join('\r\n'));
  };
  function reportShell(title,body){return `<!doctype html><html lang="th"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${esc(title)}</title><style>@page{size:A4;margin:14mm}body{font-family:system-ui,-apple-system,"Segoe UI",Tahoma,sans-serif;color:#342d25;font-size:12px}h1{font-size:22px;margin:0 0 4px}h2{font-size:15px;margin:18px 0 6px}.sub{color:#766f66;margin-bottom:12px}.k{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}.box{border:1px solid #d8c9ae;border-radius:10px;padding:10px}.box small{display:block;color:#766f66}.box b{font-size:16px}.row{display:flex;justify-content:space-between;border-bottom:1px solid #eee2d2;padding:6px 0;gap:12px}.row:last-child{border:0}table{width:100%;border-collapse:collapse;margin-top:8px}th,td{border-bottom:1px solid #eee2d2;padding:6px;text-align:left}th{background:#f8f2e7}.r{text-align:right}.foot{margin-top:18px;color:#8b8175;font-size:10px}@media print{button{display:none}}</style></head><body><h1>Moji • ${esc(title)}</h1><div class="sub">สร้างจากข้อมูลในเครื่องของผู้ใช้ • ${new Intl.DateTimeFormat('th-TH',{dateStyle:'long'}).format(new Date())}</div>${body}<div class="foot">Moji Personal Finance • รายงานนี้เป็นข้อมูลสรุปเพื่อการวางแผนส่วนบุคคล</div></body></html>`}
  function printHtml(title,html){
    if(window.MojiAndroid&&typeof window.MojiAndroid.printReport==='function'){try{window.MojiAndroid.printReport(title,html);return}catch(e){}}
    const w=window.open('','_blank');if(!w){alert('กรุณาอนุญาตหน้าต่างใหม่เพื่อพิมพ์รายงาน');return}w.document.open();w.document.write(html);w.document.close();setTimeout(()=>{w.focus();w.print()},350);
  }
  window.rcExportMonthlyPdf=function(){
    const p=planNow(),tx=monthTx(),inc=sumAmt(tx,'income'),exp=sumAmt(tx,'expense'),remain=num(p.remain)+inc-exp;
    const body=`<div class="k"><div class="box"><small>เงินใช้ได้ตามแผนเริ่มต้น</small><b>${money(p.remain)}</b></div><div class="box"><small>เหลือหลังรายการเพิ่มเติม</small><b>${money(remain)}</b></div></div><h2>ฐานแผนรายเดือน</h2><div class="row"><span>เงินสำหรับใช้จ่าย/เดือน</span><b>${money(p.inc)}</b></div><div class="row"><span>ค่าใช้จ่ายประจำ</span><b>${money(p.ex)}</b></div><div class="row"><span>ค่าใช้จ่ายรายปีเฉลี่ย/เดือน</span><b>${money(p.an)}</b></div><h2>รายการเพิ่มเติมเดือนนี้</h2><div class="row"><span>รายรับเพิ่มเติม</span><b>${money(inc)}</b></div><div class="row"><span>รายจ่ายเพิ่มเติม</span><b>${money(exp)}</b></div><table><thead><tr><th>วันที่</th><th>รายการ</th><th>หมวด</th><th class="r">จำนวน</th></tr></thead><tbody>${tx.slice().sort((a,b)=>String(a.date).localeCompare(String(b.date))).map(x=>`<tr><td>${esc(typeof thDate==='function'?thDate(x.date):x.date)}</td><td>${esc(x.note||'')}</td><td>${esc(x.cat||'')}</td><td class="r">${x.type==='expense'?'-':'+'}${money(x.amount)}</td></tr>`).join('')||'<tr><td colspan="4">ยังไม่มีรายการเพิ่มเติมเดือนนี้</td></tr>'}</tbody></table>`;
    printHtml('สรุปรายเดือน',reportShell('สรุปรายเดือน',body));
  };
  window.rcExportPositionPdf=function(){
    const a=posNow();const assets=S.assets||[],debts=S.debts||[];
    const body=`<div class="k"><div class="box"><small>ทรัพย์สินรวมทั้งหมด</small><b>${money(a.total)}</b></div><div class="box"><small>หนี้สินรวมทั้งหมด</small><b>${money(a.debt)}</b></div><div class="box"><small>มูลค่าทรัพย์สินสุทธิ</small><b>${money(a.net)}</b></div><div class="box"><small>เงินสำรองฉุกเฉิน</small><b>${money(a.em)}</b></div></div><h2>ทรัพย์สิน</h2><table><thead><tr><th>รายการ</th><th>ประเภท</th><th class="r">มูลค่า</th></tr></thead><tbody>${assets.map(x=>`<tr><td>${esc(x.name||'')}</td><td>${esc(x.kind||'')}</td><td class="r">${money(x.value)}</td></tr>`).join('')||'<tr><td colspan="3">ยังไม่มีข้อมูล</td></tr>'}</tbody></table><h2>หนี้สิน</h2><table><thead><tr><th>รายการ</th><th class="r">ยอดคงเหลือ</th><th class="r">ค่างวด/เดือน</th></tr></thead><tbody>${debts.map(x=>`<tr><td>${esc(x.name||'')}</td><td class="r">${money(x.balance)}</td><td class="r">${money(x.payment)}</td></tr>`).join('')||'<tr><td colspan="3">ยังไม่มีข้อมูล</td></tr>'}</tbody></table>`;
    printHtml('ฐานะการเงิน',reportShell('ฐานะการเงิน',body));
  };

  // 4) Backup reminder. Timestamp is set only after successful Android write via rcBackupSuccess().
  window.rcBackupSuccess=function(){try{localStorage.setItem(LAST_BACKUP,String(Date.now()))}catch(e){}updateBackupNote()};
  function backupAge(){const t=num(localStorage.getItem(LAST_BACKUP));return t?Math.floor((Date.now()-t)/86400000):null}
  function updateBackupNote(){const el=$('rcBackupNote');if(!el)return;const d=backupAge();if(d===null)el.innerHTML='<span class="warn" style="display:block">ยังไม่พบประวัติการสำรองข้อมูลในเครื่องนี้ แนะนำให้สำรองก่อนเปลี่ยนเครื่องหรือล้างข้อมูลแอป</span>';else if(d>=30)el.innerHTML=`<span class="warn" style="display:block">ไม่ได้สำรองข้อมูลมา ${d} วัน แนะนำให้สำรองข้อมูลอีกครั้ง</span>`;else el.innerHTML=`<span class="ok" style="display:block">สำรองข้อมูลล่าสุดประมาณ ${d===0?'วันนี้':d+' วันที่แล้ว'}</span>`}
  function wrapWebBackup(){if(window.__rcBackupWrapped||typeof window.backup!=='function'||window.MojiAndroid)return;window.__rcBackupWrapped=true;const base=window.backup;window.backup=function(){const r=base.apply(this,arguments);setTimeout(window.rcBackupSuccess,100);return r}}

  // 5) Commercial export area; features remain unlocked during RC testing. Billing lock comes in the Play Billing step.
  function mountSettings(){
    const sheet=$('settings')?.querySelector('.sheet');if(!sheet)return;let box=$('rcExportArea');if(!box){box=document.createElement('div');box.id='rcExportArea';box.className='rc-export';box.innerHTML=`<h3 style="margin-bottom:3px">ส่งออกและความปลอดภัย ${PRO_BADGE}</h3><div class="sub">ข้อมูลยังอยู่ในเครื่องเหมือนเดิม • ฟังก์ชัน PRO เปิดให้ทดสอบใน Commercial RC1</div><div id="rcBackupNote" class="rc-backup-note"></div><div class="rc-export-grid"><button class="btn ghost" onclick="rcExportCsv()">CSV ประวัติรายการ</button><button class="btn ghost" onclick="rcExportMonthlyPdf()">PDF สรุปรายเดือน</button><button class="btn ghost" onclick="rcExportPositionPdf()">PDF ฐานะการเงิน</button></div>`;sheet.appendChild(box)}updateBackupNote();
  }

  function apply(){css();wrapBackdate();wrapWebBackup();mountMonthly();goalForecast();markPro();mountSettings()}
  if(typeof window.render==='function'&&!window.__rcRenderWrapped){window.__rcRenderWrapped=true;const base=window.render;window.render=function(){const r=base.apply(this,arguments);setTimeout(apply,0);return r}}
  if(typeof window.settings==='function'&&!window.__rcSettingsWrapped){window.__rcSettingsWrapped=true;const base=window.settings;window.settings=function(v){const r=base.apply(this,arguments);if(v)setTimeout(mountSettings,0);return r}}
  apply();
})();