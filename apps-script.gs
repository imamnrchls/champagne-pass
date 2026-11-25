/**
 * Backend RSVP & Ucapan — Lembar Kabar (Google Sheets)
 *
 * Cara pasang:
 * 1. Buat Google Sheet baru, mis. "RSVP Rizky & Ayu".
 * 2. Extensions > Apps Script > ganti seluruh isi Code.gs dengan file ini > Save.
 * 3. Deploy > New deployment > Web app:
 *      Execute as: Me
 *      Who has access: Anyone
 * 4. Salin Web App URL (/exec) ke `rsvp_endpoint` di data/invitation.js.
 *
 * Kompatibel dengan format lama (4 kolom: ts, name, att, msg)
 * dan format baru (5 kolom: ts, name, att, guests, msg) dengan dukungan
 * kehadiran: hadir | tidak | ragu, jumlah tamu 1–5, dan batas baca 50 terbaru.
 */
const SHEET_NAME = 'Ucapan';
const HEADER = ['ts', 'name', 'att', 'guests', 'msg'];
const MAX_READ = 50;

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(HEADER);
    sh.setFrozenRows(1);
  }
  return sh;
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function normalizeAtt_(raw) {
  const v = String(raw || '').toLowerCase().trim();
  if (v === 'hadir' || v === 'y') return 'hadir';
  if (v === 'tidak' || v === 'n') return 'tidak';
  if (v === 'ragu' || v === 'm') return 'ragu';
  return '';
}

function doGet(e) {
  const sh = sheet_();
  const last = sh.getLastRow();
  if (last < 2) return json_([]);

  const cols = Math.min(Math.max(sh.getLastColumn(), 4), 5);
  const header = sh.getRange(1, 1, 1, cols).getValues()[0].map(h => String(h).trim().toLowerCase());
  const hasGuests = header[3] === 'guests';

  const rows = sh.getRange(2, 1, last - 1, cols).getValues();
  const limitParam = e && e.parameter && Number(e.parameter.limit);
  const limit = limitParam > 0 && limitParam <= 100 ? limitParam : MAX_READ;

  const data = rows
    .map(r => {
      const att = normalizeAtt_(r[2]) || 'hadir';
      const guests = hasGuests ? Math.min(5, Math.max(1, Number(r[3]) || 1)) : 1;
      const msg = String(hasGuests ? (r[4] || '') : (r[3] || ''));
      return {
        ts: Number(r[0]) || 0,
        name: String(r[1] || ''),
        att: att,
        guests: guests,
        msg: msg
      };
    })
    .filter(item => item.name)
    .sort((a, b) => b.ts - a.ts)
    .slice(0, limit);

  return json_(data);
}

function doPost(e) {
  let d;
  try {
    d = JSON.parse(e.postData.contents);
  } catch (err) {
    return json_({ ok: false, error: 'invalid json' });
  }

  // Lindungi dari formula injection di Google Sheets.
  const clean = (s, n) => String(s || '').trim().slice(0, n).replace(/^[=+\-@]/, "'$&");
  const name = clean(d.name, 60);
  const att = normalizeAtt_(d.att);
  const guests = Math.min(5, Math.max(1, parseInt(d.guests, 10) || 1));
  const msg = clean(d.msg, 500) || '-';

  if (!name || !att) {
    return json_({ ok: false, error: 'missing fields' });
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sh = sheet_();
    const cols = Math.min(Math.max(sh.getLastColumn(), 4), 5);
    const header = sh.getRange(1, 1, 1, cols).getValues()[0].map(h => String(h).trim().toLowerCase());
    const hasGuests = header[3] === 'guests';

    const last = sh.getLastRow();
    if (last >= 2) {
      const from = Math.max(2, last - 19);
      const recent = sh.getRange(from, 1, last - from + 1, cols).getValues();
      const now = Date.now();
      const msgIdx = hasGuests ? 4 : 3;
      if (recent.some(r => String(r[1]) === name && String(r[msgIdx]) === msg && now - Number(r[0]) < 120000)) {
        return json_({ ok: true, duplicate: true });
      }
    }

    if (hasGuests) {
      sh.appendRow([Date.now(), name, att, guests, msg]);
    } else {
      const legacyAtt = att === 'tidak' ? 'n' : 'y';
      sh.appendRow([Date.now(), name, legacyAtt, msg]);
    }
  } finally {
    lock.releaseLock();
  }

  return json_({ ok: true });
}
