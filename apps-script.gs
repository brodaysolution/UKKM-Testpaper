// Google Apps Script — simpan lead ke Google Sheet + hantar event Lead ke Meta Conversions API (CAPI).
// Token CAPI JANGAN tulis dalam kod ini. Simpan di: Project Settings (⚙️) > Script Properties >
//   Property: META_TOKEN   Value: <access token dari Events Manager>
// Selepas edit: Deploy > Manage deployments > ✏️ > Version: New version > Deploy (URL kekal sama).
var PIXEL_ID = '884628334286994';
var TEST_CODE = ''; // isi kod dari Events Manager > Test Events untuk uji; kosongkan bila live

function doPost(e) {
  var p = e.parameter;
  var ss = SpreadsheetApp.openById('1qBaIZEs44eDkddgbt18QPG8SgC9Xwjd6YG77FaZz5Us');
  if (p.jenis === 'temujanji') {   // borang dari halatuju.testpaper.com -> Sheet berasingan
    var tss = SpreadsheetApp.openById('1FsuXEtCoxeoUb-iZJkAhoUIx9t9UKHV_pSyeDhWIBmA');
    var tj = tss.getSheetByName('Temu Janji') || tss.insertSheet('Temu Janji');
    if (tj.getLastRow() === 0) tj.appendRow(['Masa','Nama Ibu/Bapa','WhatsApp','Emel','Nama Anak','Tahap','Bil. Anak','Sekolah Sasaran','Khidmat','Tarikh','Slot Masa','Catatan','Lokasi','utm_source','utm_medium','utm_campaign','fbclid','Kod Agent','Status']);
    tj.appendRow([new Date(), p.nama, "'" + p.wa, p.emel, p.anak, p.tahap, "'" + p.pax, p.sasaran, p.servis, "'" + p.tarikh, "'" + p.masa, p.catatan, p.lokasi, p.utm_source, p.utm_medium, p.utm_campaign, p.fbclid, p.agent, 'Belum disahkan']);
    return ContentService.createTextOutput('ok');
  }
  var sh = ss.getSheetByName('UKKM Leads') || ss.insertSheet('UKKM Leads');
  if (sh.getLastRow() === 0) sh.appendRow(['Masa','Nama Ibu/Bapa','WhatsApp','Emel','Nama Anak','Pakej','utm_source','utm_medium','utm_campaign','fbclid','Kod Agent']);
  sh.appendRow([new Date(), p.nama, "'" + p.wa, p.emel, p.anak, p.pakej, p.utm_source, p.utm_medium, p.utm_campaign, p.fbclid, p.agent]);
  try { sendCapi(p); } catch (err) { console.error('CAPI gagal: ' + err); }
  return ContentService.createTextOutput('ok');
}

function sendCapi(p) {
  var token = PropertiesService.getScriptProperties().getProperty('META_TOKEN');
  if (!token) return;
  var phone = String(p.wa || '').replace(/\D/g, '');
  if (phone.indexOf('0') === 0) phone = '6' + phone;           // 012... -> 6012...
  var name = String(p.nama || '').trim().toLowerCase().split(/\s+/);
  var user = {
    em: [sha(String(p.emel || '').trim().toLowerCase())],
    ph: [sha(phone)],
    fn: [sha(name[0] || '')],
    country: [sha('my')],
    client_user_agent: p.ua || ''
  };
  if (name.length > 1) user.ln = [sha(name.slice(1).join(' '))];
  if (p.fbp) user.fbp = p.fbp;
  if (p.fbc) user.fbc = p.fbc;
  var body = {
    data: [{
      event_name: 'Lead',
      event_time: Math.floor(Date.now() / 1000),
      event_id: p.event_id,
      action_source: 'website',
      event_source_url: p.url,
      user_data: user,
      custom_data: { content_name: p.pakej, value: Number(p.value) || 0, currency: 'MYR' }
    }]
  };
  if (TEST_CODE) body.test_event_code = TEST_CODE;
  var res = UrlFetchApp.fetch('https://graph.facebook.com/v21.0/' + PIXEL_ID + '/events?access_token=' + token, {
    method: 'post', contentType: 'application/json', payload: JSON.stringify(body), muteHttpExceptions: true
  });
  console.log('CAPI ' + res.getResponseCode() + ' ' + res.getContentText());
}

function sha(s) {
  if (!s) return '';
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, s, Utilities.Charset.UTF_8)
    .map(function (b) { return ('0' + (b & 0xff).toString(16)).slice(-2); }).join('');
}
