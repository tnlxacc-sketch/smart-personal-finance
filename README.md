# M Personal Finance — Clean Baseline

สาขา `clean-baseline` คือโค้ดฐานสะอาดของ M Personal Finance ที่เขียนใหม่จากหน้าจอและหลักการใช้งานปัจจุบัน โดยไม่โหลด patch หรือ UI รุ่นเก่า

## Runtime files

- `index.html` — โครงหน้าจอปัจจุบันทั้งหมด
- `clean.css` — UI/Responsive/Mobile style เดียว
- `clean-app.js` — Business logic + navigation + popup + charts + settings + goals + What-if
- `service-worker.js` — PWA cache แบบตรงไปตรงมา ไม่มีการ inject script
- `manifest.webmanifest` + icons — PWA metadata

## Data principles

- Local-first ไม่มี Login และไม่มีฐานข้อมูลกลาง
- ใช้ `localStorage` key `spfm_public_v1` เพื่อรองรับข้อมูลโครงสร้างเดิมเมื่อย้ายไปใช้จริง
- ค่าใช้จ่ายประจำ/รายปีเป็น Plan
- รายการในเมนูบันทึกเป็น Actual
- Goals ใช้ข้อมูลชุดเดียวกันใน Future / Dashboard / What-if
- เงินทุกช่องเก็บเป็นตัวเลข แต่แสดง comma เฉพาะ Presentation
- วันที่รายการใช้ `dd/mm/yyyy` บนหน้าจอ

## QA

มีชุดทดสอบเดียว `tools/qa-clean.mjs` และ workflow `Clean Baseline QA` สำหรับตรวจมือถือ, ทุกเมนู, สูตรหลัก, กราฟ, popup, backup และ PWA path
