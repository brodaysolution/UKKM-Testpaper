// Google Apps Script — simpan lead ke Google Sheet.
// 1. Buat Google Sheet baru > Extensions > Apps Script > tampal kod ini.
// 2. Deploy > New deployment > Web app > Execute as: Me, Access: Anyone.
// 3. Salin URL /exec dan letak dalam index.html (SHEET_URL).
function doPost(e) {
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (sh.getLastRow() === 0) sh.appendRow(['Masa','Nama Ibu/Bapa','WhatsApp','Emel','Nama Anak','Pakej','utm_source','utm_medium','utm_campaign','fbclid']);
  var p = e.parameter;
  sh.appendRow([new Date(), p.nama, "'" + p.wa, p.emel, p.anak, p.pakej, p.utm_source, p.utm_medium, p.utm_campaign, p.fbclid]);
  return ContentService.createTextOutput('ok');
}
