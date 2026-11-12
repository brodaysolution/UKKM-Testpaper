// Google Apps Script — simpan lead ke Google Sheet.
// 1. Buka Sheet > Extensions > Apps Script > tampal kod ini (data masuk tab 'UKKM Leads').
// 2. Deploy > New deployment > Web app > Execute as: Me, Access: Anyone.
// 3. Salin URL /exec dan letak dalam index.html (SHEET_URL).
function doPost(e) {
  var ss = SpreadsheetApp.openById('1qBaIZEs44eDkddgbt18QPG8SgC9Xwjd6YG77FaZz5Us');
  var sh = ss.getSheetByName('UKKM Leads') || ss.insertSheet('UKKM Leads');
  if (sh.getLastRow() === 0) sh.appendRow(['Masa','Nama Ibu/Bapa','WhatsApp','Emel','Nama Anak','Pakej','utm_source','utm_medium','utm_campaign','fbclid','Kod Agent']);
  var p = e.parameter;
  sh.appendRow([new Date(), p.nama, "'" + p.wa, p.emel, p.anak, p.pakej, p.utm_source, p.utm_medium, p.utm_campaign, p.fbclid, p.agent]);
  return ContentService.createTextOutput('ok');
}
