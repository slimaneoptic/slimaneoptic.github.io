/* Music catalog vs DISCO inventory: reconciliation in the browser. Nothing is uploaded. */
(function () {
  'use strict';
  var $ = function (s) { return document.querySelector(s); };
  var MAX_ROWS = 500;

  var M_FIELDS = [['title', 'Title', 1], ['artists', 'Artists', 1], ['version', 'Version', 0], ['isrc', 'ISRC', 0], ['duration', 'Duration', 0]];
  var D_FIELDS = [['tid', 'Track ID', 1], ['title', 'Title', 1], ['artists', 'Artist', 1], ['version', 'Version', 0], ['isrc', 'ISRC', 0],
                  ['duration', 'Duration', 0], ['format', 'File format', 0], ['link', 'Track link', 0]];
  var SYN = {
    tid: ['track id', 'disco track id', 'disco id', 'trackid', 'id', 'track_id'],
    title: ['title', 'track title', 'song title', 'track name', 'song', 'name'],
    artists: ['artists', 'artist', 'artist s', 'main artist', 'artist name', 'performer', 'performers'],
    version: ['version', 'version type', 'mix', 'mix version'],
    isrc: ['isrc', 'isrc code'],
    duration: ['duration', 'length', 'track length', 'time', 'runtime'],
    format: ['file format', 'format', 'file type', 'filetype', 'codec', 'type'],
    link: ['track link', 'link', 'disco link', 'url', 'share link', 'track url']
  };

  var state = { m: null, d: null, mapM: {}, mapD: {}, res: null, tab: 'matched' };

  // ---------- text helpers ----------
  function deacc(s) { return String(s == null ? '' : s).normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function clean(s) { return deacc(s).toLowerCase().replace(/[’'`]/g, '').replace(/[^a-z0-9]+/g, ' ').trim(); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  var VWORD = /\b(instrumental|inst|instr|clean|radio|edit|extended|remix|mix|acoustic|live|remaster|remastered|a cappella|acappella|acapella|version|tv|explicit|stripped|underscore)\b/;
  var FEAT_LEAD = /^\s*(?:feat\.?|ft\.?|featuring|with)\s+/i;

  function canonVersion(v) {
    var s = clean(v);
    if (!s || /^(original|original mix|original version|album version|main|main version|full|full mix)$/.test(s)) return '';
    if (/\b(inst|instr|instrumental)\b/.test(s)) return 'instrumental';
    if (/\bclean\b/.test(s)) return 'clean';
    if (/\bradio\b/.test(s)) return 'radio edit';
    if (/\bextended\b/.test(s)) return 'extended';
    if (/\b(a cappella|acappella|acapella)\b/.test(s)) return 'a cappella';
    if (/\bremix\b/.test(s)) return s.replace(/\s+(mix|version)$/, '');
    if (/\bacoustic\b/.test(s)) return 'acoustic';
    if (/\blive\b/.test(s)) return 'live';
    if (/\bremaster(ed)?\b/.test(s)) return 'remastered';
    if (/\bedit\b/.test(s)) return 'edit';
    return s.replace(/\s+version$/, '');
  }

  function parseTitle(raw) {
    var t = String(raw == null ? '' : raw).trim(), feats = [], vers = [];
    t = t.replace(/[(\[]([^)\]]*)[)\]]/g, function (m, inner) {
      if (FEAT_LEAD.test(inner)) { feats.push(inner.replace(FEAT_LEAD, '')); return ' '; }
      if (VWORD.test(clean(inner))) { vers.push(inner); return ' '; }
      return m;
    });
    var fm = t.match(/\s+(?:feat\.?|ft\.?|featuring)\s+(.+)$/i);
    if (fm) { feats.push(fm[1]); t = t.slice(0, fm.index); }
    var dm = t.match(/\s+[-–—]\s+([^-–—]+)$/);
    if (dm && VWORD.test(clean(dm[1]))) { vers.push(dm[1]); t = t.slice(0, dm.index); }
    return { base: clean(t), feats: feats, vers: vers };
  }

  function artistKey(str, extra) {
    var all = [String(str == null ? '' : str)].concat(extra || []).join(', ');
    var parts = deacc(all).toLowerCase().split(/\s*(?:,|;|\/|&|\+|\bfeat\b\.?|\bft\b\.?|\bfeaturing\b|\band\b|\bwith\b|\bx\b|\bvs\b\.?)\s*/);
    var seen = {}, out = [];
    parts.forEach(function (p) { var c = clean(p); if (c && !seen[c]) { seen[c] = 1; out.push(c); } });
    return out.sort().join('|');
  }

  function parseDur(v) {
    if (v == null) return null;
    var s = String(v).trim();
    if (!s) return null;
    if (/^\d+(\.\d+)?$/.test(s)) { var n = +s; if (n < 1) return Math.round(n * 86400); if (n > 36000) return Math.round(n / 1000); return Math.round(n); }
    var p = s.split(':').map(Number);
    if (p.some(isNaN)) return null;
    if (p.length === 2) return Math.round(p[0] * 60 + p[1]);
    if (p.length === 3) return Math.round(p[0] * 3600 + p[1] * 60 + p[2]);
    return null;
  }
  function fmtDur(s) { if (s == null) return ''; return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2); }
  function normIsrc(v) { var s = String(v == null ? '' : v).toUpperCase().replace(/[^A-Z0-9]/g, ''); return s.length === 12 ? s : ''; }
  function fmtIsrc(s) { return s ? s.slice(0, 2) + '-' + s.slice(2, 5) + '-' + s.slice(5, 7) + '-' + s.slice(7) : ''; }
  function normFmt(v) { var s = clean(v).toUpperCase(); if (/WAV|WAVE/.test(s)) return 'WAV'; if (/MP3|MPEG/.test(s)) return 'MP3'; if (/AIF/.test(s)) return 'AIFF'; if (/FLAC/.test(s)) return 'FLAC'; return s; }
  var LOSSLESS = { WAV: 1, AIFF: 1, FLAC: 1 };

  function dice(a, b) {
    a = a.replace(/ /g, ''); b = b.replace(/ /g, '');
    if (a === b) return a ? 1 : 0;
    if (a.length < 2 || b.length < 2) return 0;
    var m = {}, i, g, inter = 0;
    for (i = 0; i < a.length - 1; i++) { g = a.substr(i, 2); m[g] = (m[g] || 0) + 1; }
    for (i = 0; i < b.length - 1; i++) { g = b.substr(i, 2); if (m[g]) { inter++; m[g]--; } }
    return 2 * inter / (a.length + b.length - 2);
  }

  // ---------- reading files ----------
  function tableFromWorkbook(wb, name) {
    var best = null;
    wb.SheetNames.forEach(function (sn) {
      var aoa = XLSX.utils.sheet_to_json(wb.Sheets[sn], { header: 1, raw: false, defval: '' });
      var n = aoa.filter(function (r) { return r.some(function (c) { return String(c).trim() !== ''; }); }).length;
      if (!best || n > best.n) best = { sn: sn, aoa: aoa, n: n };
    });
    if (!best || best.n < 2) throw new Error(name + ': no table with a header row and data found.');
    var aoa = best.aoa, h = 0;
    while (h < aoa.length && aoa[h].filter(function (c) { return String(c).trim() !== ''; }).length < 2) h++;
    var headers = aoa[h].map(function (c, i) { return String(c).trim() || ('Column ' + (i + 1)); });
    var rows = [];
    for (var r = h + 1; r < aoa.length; r++) {
      if (!aoa[r].some(function (c) { return String(c).trim() !== ''; })) continue;
      rows.push({ cells: aoa[r], excelRow: r + 1 });
    }
    return { name: name, sheet: best.sn, headers: headers, headerRow: h, aoa: aoa, rows: rows };
  }
  function readAny(name, data) {
    var wb;
    if (/\.csv$|\.txt$/i.test(name) || typeof data === 'string') {
      var text = typeof data === 'string' ? data : new TextDecoder('utf-8').decode(data);
      wb = XLSX.read(text.replace(/^﻿/, ''), { type: 'string', raw: true });
    } else {
      wb = XLSX.read(data, { type: 'array' });
    }
    return tableFromWorkbook(wb, name);
  }

  function guessMap(headers, fields) {
    var map = {}, used = {};
    var ch = headers.map(clean);
    fields.forEach(function (f) {
      var syn = SYN[f[0]], idx = -1;
      for (var k = 0; k < syn.length && idx < 0; k++) { idx = ch.findIndex(function (h, i) { return !used[i] && h === syn[k]; }); }
      if (idx < 0) for (k = 0; k < syn.length && idx < 0; k++) { idx = ch.findIndex(function (h, i) { return !used[i] && syn[k].length > 2 && (' ' + h + ' ').indexOf(' ' + syn[k] + ' ') >= 0; }); }
      map[f[0]] = idx; if (idx >= 0) used[idx] = 1;
    });
    return map;
  }

  function buildMapUI(box, tbl, fields, map, side) {
    box.querySelectorAll('label').forEach(function (l) { l.remove(); });
    fields.forEach(function (f) {
      var lab = document.createElement('label');
      var opts = '<option value="-1">(none)</option>' + tbl.headers.map(function (h, i) { return '<option value="' + i + '"' + (map[f[0]] === i ? ' selected' : '') + '>' + esc(h) + '</option>'; }).join('');
      lab.innerHTML = '<span>' + f[1] + (f[2] ? ' *' : '') + '</span><select data-side="' + side + '" data-f="' + f[0] + '">' + opts + '</select>';
      box.appendChild(lab);
    });
  }

  // ---------- matching ----------
  function cell(row, idx) { return idx >= 0 ? String(row.cells[idx] == null ? '' : row.cells[idx]).trim() : ''; }
  function prep(row, i, map, isDisco) {
    var title = cell(row, map.title), pt = parseTitle(title);
    var verRaw = [cell(row, map.version)].concat(pt.vers).filter(Boolean);
    var ver = '';
    verRaw.forEach(function (v) { var c = canonVersion(v); if (c && !ver) ver = c; });
    var o = { i: i, excelRow: row.excelRow, title: title, artists: cell(row, map.artists), base: pt.base,
              akey: artistKey(cell(row, map.artists), pt.feats), ver: ver,
              verLabel: ver ? verRaw.filter(function (v) { return canonVersion(v); })[0] : '',
              isrc: normIsrc(cell(row, map.isrc)), isrcRaw: cell(row, map.isrc), dur: parseDur(cell(row, map.duration)) };
    if (isDisco) { o.tid = cell(row, map.tid) || ('row ' + row.excelRow); o.fmt = normFmt(cell(row, map.format)); o.link = cell(row, map.link); }
    return o;
  }

  function reconcile() {
    var t0 = performance.now();
    var M = state.m.rows.map(function (r, i) { return prep(r, i, state.mapM, false); });
    var D = state.d.rows.map(function (r, i) { return prep(r, i, state.mapD, true); });
    var byIsrc = {}, byKey = {};
    M.forEach(function (m) {
      if (m.isrc && !byIsrc[m.isrc]) byIsrc[m.isrc] = m;
      var k = m.base + '#' + m.akey; (byKey[k] = byKey[k] || []).push(m);
      m.files = []; m.uncertain = []; m.alts = []; m.notes = [];
    });
    D.forEach(function (d) {
      if (d.isrc && byIsrc[d.isrc]) { d.cls = 'match'; d.m = byIsrc[d.isrc]; d.how = 'ISRC'; return; }
      var cands = byKey[d.base + '#' + d.akey] || [];
      if (cands.length) {
        var best = null, bd = 1e9;
        cands.forEach(function (m) {
          if (m.ver !== d.ver) return;
          var diff = (d.dur != null && m.dur != null) ? Math.abs(d.dur - m.dur) : 0;
          if (diff < bd) { best = m; bd = diff; }
        });
        if (best) {
          if (d.isrc && best.isrc && d.isrc !== best.isrc) {
            d.cls = 'alt'; d.m = best; d.reason = 'Same title, artists and version, but a different ISRC (DISCO ' + fmtIsrc(d.isrc) + ', master ' + fmtIsrc(best.isrc) + ')';
          } else if (bd <= 1) {
            d.cls = 'match'; d.m = best; d.how = 'Title + artists + version + length';
          } else if (bd <= 5) {
            d.cls = 'unc'; d.m = best; d.score = Math.round(100 * (1 - bd / 20));
            d.reason = 'Same title, artists and version, no ISRC to decide, and the length differs by ' + bd + ' s';
          } else {
            d.cls = 'alt'; d.m = best; d.reason = 'Length differs by ' + bd + ' s from the master (' + fmtDur(best.dur) + ' vs ' + fmtDur(d.dur) + '): a different edit';
          }
        } else {
          var parent = cands.filter(function (m) { return m.ver === ''; })[0] || cands[0];
          d.cls = 'alt'; d.m = parent;
          d.reason = 'Version "' + (d.verLabel || 'original') + '" of this song is not in the master as its own row';
        }
        return;
      }
      var bm = null, bs = 0, bt = 0;
      M.forEach(function (m) {
        var t = dice(d.base, m.base); if (t < 0.5) return;
        var s = 0.7 * t + 0.25 * dice(d.akey.replace(/\|/g, ' '), m.akey.replace(/\|/g, ' ')) + 0.05 * (m.ver === d.ver ? 1 : 0);
        if (s > bs) { bs = s; bm = m; bt = t; }
      });
      if (bm && bs >= 0.75) {
        d.cls = 'unc'; d.m = bm; d.score = Math.round(bs * 100);
        var why = [];
        if (bt < 1) why.push('title close but not equal ("' + d.title + '" vs "' + bm.title + '")');
        if (d.akey !== bm.akey) why.push('artists differ ("' + d.artists + '" vs "' + bm.artists + '")');
        if (bm.ver !== d.ver) why.push('version differs');
        d.reason = why.join('; ') || 'close match';
      } else {
        d.cls = 'notin'; d.score = bm ? Math.round(bs * 100) : 0; d.closest = bm;
        d.reason = bm ? 'Closest master title "' + bm.title + '" scores ' + Math.round(bs * 100) + '%, under 75%' : 'No master title is close';
      }
    });
    // group files of one recording: formats linked vs duplicates
    var groups = {}, kgroups = {};
    D.forEach(function (d) {
      if (d.cls === 'unc') return;
      var key;
      if (d.cls === 'match') key = 'M' + d.m.i;
      else if (d.isrc) key = 'I' + d.isrc;
      else {
        var kb = d.base + '#' + d.akey + '#' + d.ver, list = kgroups[kb] = kgroups[kb] || [], hit = null;
        list.forEach(function (g) { if (!hit && (g.dur == null || d.dur == null || Math.abs(g.dur - d.dur) <= 1)) hit = g; });
        if (!hit) { hit = { key: 'K' + kb + '#' + list.length, dur: d.dur }; list.push(hit); }
        key = hit.key;
      }
      (groups[key] = groups[key] || []).push(d);
    });
    Object.keys(groups).forEach(function (k) {
      var g = groups[k];
      if (g.length < 2) return;
      g.sort(function (a, b) { return ((LOSSLESS[a.fmt] ? 0 : 1) - (LOSSLESS[b.fmt] ? 0 : 1)) || (a.i - b.i); });
      var prim = g[0], seen = {}; seen[prim.fmt] = 1;
      for (var j = 1; j < g.length; j++) {
        var d = g[j];
        d.primary = prim; d.baseCls = d.cls;
        if (!seen[d.fmt]) { seen[d.fmt] = 1; d.cls = 'fmt'; d.reason = d.fmt + ' file of the same recording as ' + prim.fmt + ' track ' + prim.tid; }
        else {
          d.cls = 'dup';
          d.reason = (d.isrc && d.isrc === prim.isrc) ? 'Same ISRC ' + fmtIsrc(d.isrc) + ' and same format (' + (d.fmt || 'unknown') + ') as track ' + prim.tid
            : 'No ISRC; same title, artists, version and length (within 1 s) and same format as track ' + prim.tid;
        }
      }
    });
    // write back to master rows
    D.forEach(function (d) {
      if (!d.m) return;
      var m = d.m;
      if (d.cls === 'match') { m.primary = d; m.files.push(d); }
      else if ((d.cls === 'fmt' || d.cls === 'dup') && d.baseCls === 'match') { m.files.push(d); }
      else if (d.cls === 'unc') m.uncertain.push(d);
      else if (d.cls === 'alt') m.alts.push(d);
    });
    M.forEach(function (m) {
      if (m.primary) {
        m.status = 'In DISCO';
        var p = m.primary;
        if (!m.isrc && p.isrc) m.notes.push('ISRC missing in master; DISCO has ' + fmtIsrc(p.isrc));
        if (p.how !== 'ISRC' || p.base !== m.base) { if (p.base !== m.base) m.notes.push('Title in DISCO: "' + p.title + '"'); }
        if (p.dur != null && m.dur != null && Math.abs(p.dur - m.dur) === 1) m.notes.push('Length differs by 1 s');
        var dups = m.files.filter(function (f) { return f.cls === 'dup'; });
        if (dups.length) m.notes.push(dups.length + ' duplicate upload(s) awaiting approval: ' + dups.map(function (f) { return f.tid; }).join(', '));
      } else if (m.uncertain.length) {
        m.status = 'Uncertain - check';
        m.notes.push('Possible DISCO match: ' + m.uncertain.map(function (u) { return u.tid + ' (' + u.score + '%)'; }).join(', '));
      } else m.status = 'Missing in DISCO';
      if (m.alts.length) m.notes.push('Other versions in DISCO, not in master: ' + m.alts.map(function (a) { return a.tid + ' ' + (a.verLabel || a.title); }).join('; '));
    });
    var res = { M: M, D: D, ms: Math.round(performance.now() - t0) };
    res.lists = {
      matched: M.filter(function (m) { return m.status === 'In DISCO'; }),
      missing: M.filter(function (m) { return m.status === 'Missing in DISCO'; }),
      notin: D.filter(function (d) { return d.cls === 'notin'; }),
      dup: D.filter(function (d) { return d.cls === 'dup'; }),
      alt: D.filter(function (d) { return d.cls === 'alt'; }),
      fmt: D.filter(function (d) { return d.cls === 'fmt'; }),
      unc: D.filter(function (d) { return d.cls === 'unc'; })
    };
    return res;
  }

  // ---------- rendering ----------
  var TABS = [
    ['matched', 'Matched', 'Master recordings found in DISCO. The DISCO Track ID and link are written back into the master.'],
    ['missing', 'Missing in DISCO', 'Master recordings with no DISCO track and no possible match. To upload, or to check the master.'],
    ['notin', 'Not in master', 'DISCO tracks with no master row. Add them to the master, or check whether they belong in DISCO.'],
    ['dup', 'Possible duplicates', 'A second file of a recording already in DISCO, in the same format. Proposed: remove after your approval.'],
    ['alt', 'Alternate versions', 'Versions of a known song that are not in the master as their own row. Kept and linked to the song.'],
    ['fmt', 'Formats linked', 'Another format (for example MP3) of a recording whose WAV is in DISCO. Linked, not a duplicate.'],
    ['unc', 'Uncertain', 'Close but not certain. Each has a score and a reason, and waits for your decision.']
  ];
  function link(u, t) { return u && /^https?:\/\//i.test(u) ? '<a href="' + esc(u) + '" rel="noopener nofollow" target="_blank">' + esc(t || u) + '</a>' : esc(t || u || ''); }
  function mref(m) { return m ? 'Row ' + m.excelRow + ': ' + m.title + (m.ver ? ' (' + (m.verLabel || m.ver) + ')' : '') + ' / ' + m.artists : ''; }
  function rowsFor(tab) {
    var L = state.res.lists[tab];
    var H, R;
    if (tab === 'matched') {
      H = ['Master row', 'Title', 'Artists', 'Version', 'ISRC (master)', 'DISCO Track ID', 'Matched by', 'Formats', 'Note'];
      R = L.map(function (m) { var p = m.primary; return [[m.excelRow, 'num'], [m.title], [m.artists], [m.verLabel || ''], [fmtIsrc(m.isrc), 'mono'], [link(p.link, p.tid), 'mono', 1], [p.how], [m.files.filter(function (f) { return f.cls !== 'dup'; }).map(function (f) { return f.fmt; }).join(' + ')], [m.notes.join('; '), 'why']]; });
    } else if (tab === 'missing') {
      H = ['Master row', 'Title', 'Artists', 'Version', 'ISRC', 'Duration'];
      R = L.map(function (m) { return [[m.excelRow, 'num'], [m.title], [m.artists], [m.verLabel || ''], [fmtIsrc(m.isrc) || '(none)', 'mono'], [fmtDur(m.dur), 'num']]; });
    } else if (tab === 'notin') {
      H = ['DISCO Track ID', 'Title', 'Artist', 'ISRC', 'Duration', 'Format', 'Why'];
      R = L.map(function (d) { return [[link(d.link, d.tid), 'mono', 1], [d.title], [d.artists], [fmtIsrc(d.isrc) || '(none)', 'mono'], [fmtDur(d.dur), 'num'], [d.fmt], [d.reason, 'why']]; });
    } else if (tab === 'dup') {
      H = ['Duplicate Track ID', 'Keep Track ID', 'Title', 'Artist', 'ISRC', 'Format', 'Why', 'Proposed action'];
      R = L.map(function (d) { return [[link(d.link, d.tid), 'mono', 1], [link(d.primary.link, d.primary.tid), 'mono', 1], [d.title], [d.artists], [fmtIsrc(d.isrc) || '(none)', 'mono'], [d.fmt], [d.reason, 'why'], ['Remove after your approval']]; });
    } else if (tab === 'alt') {
      H = ['DISCO Track ID', 'Title in DISCO', 'Version', 'ISRC', 'Duration', 'Song in master', 'Why'];
      R = L.map(function (d) { return [[link(d.link, d.tid), 'mono', 1], [d.title], [d.verLabel || 'none'], [fmtIsrc(d.isrc) || '(none)', 'mono'], [fmtDur(d.dur), 'num'], [mref(d.m)], [d.reason, 'why']]; });
    } else if (tab === 'fmt') {
      H = ['Track ID', 'Format', 'Linked to Track ID', 'Title', 'ISRC', 'Master row'];
      R = L.map(function (d) { return [[link(d.link, d.tid), 'mono', 1], [d.fmt], [link(d.primary.link, d.primary.tid + ' (' + d.primary.fmt + ')'), 'mono', 1], [d.title], [fmtIsrc(d.isrc) || '(none)', 'mono'], [d.m ? d.m.excelRow : '', 'num']]; });
    } else {
      H = ['DISCO Track ID', 'DISCO title / artist / length', 'Best master candidate', 'Length', 'Score', 'Why'];
      R = L.map(function (d) { return [[link(d.link, d.tid), 'mono', 1], [d.title + ' / ' + d.artists + ' / ' + fmtDur(d.dur)], [mref(d.m)], [fmtDur(d.m.dur), 'num'], ['<span class="sc">' + d.score + '%</span>', 'num', 1], [d.reason, 'why']]; });
    }
    return { H: H, R: R };
  }
  function renderTable() {
    var t = rowsFor(state.tab), q = clean($('#q').value);
    var rows = q ? t.R.filter(function (r) { return clean(r.map(function (c) { return String(c[0]).replace(/<[^>]+>/g, ' '); }).join(' ')).indexOf(q) >= 0; }) : t.R;
    $('#list thead').innerHTML = '<tr>' + t.H.map(function (h) { return '<th scope="col">' + esc(h) + '</th>'; }).join('') + '</tr>';
    $('#list tbody').innerHTML = rows.slice(0, MAX_ROWS).map(function (r) {
      return '<tr>' + r.map(function (c) { return '<td' + (c[1] ? ' class="' + c[1] + '"' : '') + '>' + (c[2] ? c[0] : esc(c[0])) + '</td>'; }).join('') + '</tr>';
    }).join('') || '<tr><td colspan="' + t.H.length + '">Nothing in this list.</td></tr>';
    $('#shown').textContent = rows.length > MAX_ROWS ? 'Showing the first ' + MAX_ROWS + ' of ' + rows.length + ' rows; the downloads hold all of them.' : (q ? rows.length + ' of ' + t.R.length + ' rows match the filter.' : '');
    var tab = TABS.filter(function (x) { return x[0] === state.tab; })[0];
    $('#tabnote').textContent = tab[2];
  }
  function selectTab(id) {
    state.tab = id;
    document.querySelectorAll('#tabs button').forEach(function (b) { b.setAttribute('aria-selected', b.dataset.tab === id ? 'true' : 'false'); });
    document.querySelectorAll('#tiles .tile').forEach(function (b) { b.classList.toggle('on', b.dataset.tab === id); });
    renderTable();
  }
  function render() {
    var res = state.res, L = res.lists;
    $('#tiles').innerHTML = TABS.map(function (t) { return '<button type="button" class="tile" data-tab="' + t[0] + '">' + t[1] + '<b>' + L[t[0]].length + '</b></button>'; }).join('');
    $('#tabs').innerHTML = TABS.map(function (t) { return '<button type="button" role="tab" data-tab="' + t[0] + '">' + t[1] + ' <span class="n">' + L[t[0]].length + '</span></button>'; }).join('');
    var nM = res.M.length, nD = res.D.length, unc = L.unc.length;
    var mU = res.M.filter(function (m) { return m.status === 'Uncertain - check'; }).length;
    $('#runline').textContent = 'Read ' + nM + ' master recordings and ' + nD + ' DISCO tracks in ' + res.ms + ' ms.';
    var dm = res.D.filter(function (d) { return d.cls === 'match'; }).length;
    $('#checkline').textContent = 'Check: every DISCO track is in exactly one list: ' + dm + ' matched + ' + L.fmt.length + ' formats linked + ' + L.dup.length + ' duplicates + ' + L.alt.length + ' alternate versions + ' + unc + ' uncertain + ' + L.notin.length + ' not in master = ' + (dm + L.fmt.length + L.dup.length + L.alt.length + unc + L.notin.length) + ' of ' + nD + '. Master: ' + L.matched.length + ' in DISCO + ' + L.missing.length + ' missing + ' + mU + ' waiting on an uncertain match = ' + (L.matched.length + L.missing.length + mU) + ' of ' + nM + '.';
    document.querySelectorAll('#tiles .tile, #tabs button').forEach(function (b) { b.addEventListener('click', function () { selectTab(b.dataset.tab); }); });
    selectTab(state.tab);
    var cls = {}, ms = {};
    res.D.forEach(function (d) { cls[d.tid] = d.cls; });
    res.M.forEach(function (m) { ms[m.excelRow] = m.status; });
    window.__disco = { counts: Object.keys(L).reduce(function (o, k) { o[k] = L[k].length; return o; }, {}), cls: cls, master: ms, discoRows: nD, masterRows: nM };
  }

  function run() {
    $('#err').hidden = true;
    try {
      ['title', 'artists'].forEach(function (f) { if (state.mapM[f] < 0) throw new Error('Master catalog: choose the ' + f + ' column in Column mapping.'); });
      ['tid', 'title', 'artists'].forEach(function (f) { if (state.mapD[f] < 0) throw new Error('DISCO export: choose the ' + (f === 'tid' ? 'Track ID' : f) + ' column in Column mapping.'); });
      state.res = reconcile();
      render();
    } catch (e) { showErr(e); $('#mapbox').open = true; }
  }
  function showErr(e) { $('#err').textContent = String(e && e.message || e); $('#err').hidden = false; }

  function setSide(side, tbl, label) {
    if (side === 'm') { state.m = tbl; state.mapM = guessMap(tbl.headers, M_FIELDS); buildMapUI($('#map-m'), tbl, M_FIELDS, state.mapM, 'm'); }
    else { state.d = tbl; state.mapD = guessMap(tbl.headers, D_FIELDS); buildMapUI($('#map-d'), tbl, D_FIELDS, state.mapD, 'd'); }
    var z = side === 'm' ? $('#z-master .fn') : $('#z-disco .fn');
    z.textContent = label;
  }
  function updateNames() {
    $('#names').textContent = (state.m ? 'Master: ' + state.m.name + ' (sheet "' + state.m.sheet + '", ' + state.m.rows.length + ' rows)' : 'Master: none') +
      ' · ' + (state.d ? 'DISCO: ' + state.d.name + ' (' + state.d.rows.length + ' rows)' : 'DISCO: none');
  }

  function loadSamples() {
    $('#names').textContent = 'Loading the sample files…';
    return Promise.all([
      fetch('master_catalog.xlsx').then(function (r) { if (!r.ok) throw new Error('master_catalog.xlsx: HTTP ' + r.status); return r.arrayBuffer(); }),
      fetch('disco_inventory.csv').then(function (r) { if (!r.ok) throw new Error('disco_inventory.csv: HTTP ' + r.status); return r.text(); })
    ]).then(function (x) {
      setSide('m', readAny('master_catalog.xlsx', x[0]), 'master_catalog.xlsx (sample)');
      setSide('d', readAny('disco_inventory.csv', x[1]), 'disco_inventory.csv (sample)');
      updateNames(); run();
    }).catch(showErr);
  }

  function handleFile(side, file) {
    if (!file) return;
    var p = /\.(csv|txt)$/i.test(file.name) ? file.text() : file.arrayBuffer();
    p.then(function (data) {
      setSide(side, readAny(file.name, data), file.name);
      updateNames(); run();
    }).catch(showErr);
  }
  function wireZone(id, side) {
    var z = $(id), inp = z.querySelector('input');
    inp.addEventListener('change', function () { handleFile(side, inp.files[0]); inp.value = ''; });
    ['dragenter', 'dragover'].forEach(function (ev) { z.addEventListener(ev, function (e) { e.preventDefault(); z.classList.add('over'); }); });
    ['dragleave', 'drop'].forEach(function (ev) { z.addEventListener(ev, function (e) { e.preventDefault(); z.classList.remove('over'); }); });
    z.addEventListener('drop', function (e) { handleFile(side, e.dataTransfer.files[0]); });
  }

  // ---------- downloads ----------
  function issues() {
    var res = state.res, out = [];
    function mcols(m) { return m ? [m.excelRow, m.title, m.artists, m.verLabel || ''] : ['', '', '', '']; }
    function dcols(d) { return [d.tid, d.title, d.artists, fmtIsrc(d.isrc), fmtDur(d.dur), d.fmt]; }
    res.lists.missing.forEach(function (m) { out.push(['Missing in DISCO', '', '', '', '', '', ''].concat(mcols(m), ['', 'No DISCO track found (master ISRC ' + (fmtIsrc(m.isrc) || 'none') + ', length ' + fmtDur(m.dur) + ')', 'Upload to DISCO, or confirm it should not be there'])); });
    res.lists.notin.forEach(function (d) { out.push(['Not in master'].concat(dcols(d), mcols(null), [d.score ? d.score + '%' : '', d.reason, 'Add to the master, or confirm it should not be in DISCO'])); });
    res.lists.dup.forEach(function (d) { out.push(['Possible duplicate'].concat(dcols(d), mcols(d.m), ['', d.reason, 'Remove track ' + d.tid + ' after your approval; keep ' + d.primary.tid])); });
    res.lists.alt.forEach(function (d) { out.push(['Alternate version'].concat(dcols(d), mcols(d.m), ['', d.reason, 'Keep; add as its own master row linked to the song'])); });
    res.lists.unc.forEach(function (d) { out.push(['Uncertain'].concat(dcols(d), mcols(d.m), [d.score + '%', d.reason, 'Confirm or reject the match'])); });
    res.lists.fmt.forEach(function (d) { out.push(['Formats linked'].concat(dcols(d), mcols(d.m), ['', d.reason, 'Link as another format of track ' + d.primary.tid])); });
    res.M.forEach(function (m) { if (m.primary && !m.isrc && m.primary.isrc) out.push(['Master data fix', m.primary.tid, m.primary.title, m.primary.artists, fmtIsrc(m.primary.isrc), fmtDur(m.primary.dur), m.primary.fmt].concat(mcols(m), ['', 'ISRC missing in master; DISCO has ' + fmtIsrc(m.primary.isrc), 'Add the ISRC to the master after checking it'])); });
    return [['Category', 'DISCO Track ID', 'DISCO Title', 'DISCO Artist', 'DISCO ISRC', 'DISCO Duration', 'Format', 'Master Row', 'Master Title', 'Master Artists', 'Master Version', 'Score', 'Reason', 'Proposed Action']].concat(out);
  }
  function save(blob, name) {
    var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
  }
  function stem(n) { return n.replace(/\.[^.]+$/, ''); }
  function dlCsv() {
    if (!state.res) return;
    var csv = issues().map(function (r) { return r.map(function (c) { var s = String(c == null ? '' : c); return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; }).join(','); }).join('\r\n');
    save(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }), 'disco_reconciliation_issues.csv');
  }
  function dlXlsx() {
    if (!state.res) return;
    var t = state.m, res = state.res;
    var extra = ['DISCO Track ID', 'DISCO Link', 'DISCO Formats', 'DISCO Status', 'DISCO Match Rule', 'DISCO Notes'];
    var width = t.headers.length;
    var aoa = [t.headers.concat(extra)];
    var byRow = {}; res.M.forEach(function (m) { byRow[m.excelRow] = m; });
    for (var r = t.headerRow + 1; r < t.aoa.length; r++) {
      var src = t.aoa[r].slice(0, width); while (src.length < width) src.push('');
      var m = byRow[r + 1];
      if (!m) { if (src.some(function (c) { return String(c).trim() !== ''; })) aoa.push(src); continue; }
      var p = m.primary;
      aoa.push(src.concat([p ? p.tid : '', p ? p.link : '', m.files.filter(function (f) { return f.cls !== 'dup'; }).map(function (f) { return f.fmt + ' ' + f.tid; }).join('; '),
        m.status, p ? p.how : '', m.notes.join('; ')]));
    }
    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.aoa_to_sheet(aoa);
    ws['!cols'] = aoa[0].map(function (h, i) { return { wch: i >= width ? [12, 34, 22, 18, 26, 60][i - width] : Math.min(40, Math.max(10, String(h).length + 4)) }; });
    XLSX.utils.book_append_sheet(wb, ws, (t.sheet || 'Master').slice(0, 31));
    var is = XLSX.utils.aoa_to_sheet(issues());
    is['!cols'] = [18, 12, 28, 26, 16, 9, 7, 8, 24, 26, 16, 7, 60, 44].map(function (w) { return { wch: w }; });
    XLSX.utils.book_append_sheet(wb, is, 'Issues');
    XLSX.writeFile(wb, stem(t.name) + '_with_disco.xlsx');
  }

  function init() {
    if (!window.XLSX) { showErr('The spreadsheet reader did not load. Reload the page.'); return; }
    wireZone('#z-master', 'm'); wireZone('#z-disco', 'd');
    $('#samples').addEventListener('click', loadSamples);
    $('#q').addEventListener('input', function () { if (state.res) renderTable(); });
    $('#mapbox').addEventListener('change', function (e) {
      var s = e.target; if (!s.dataset || !s.dataset.f) return;
      (s.dataset.side === 'm' ? state.mapM : state.mapD)[s.dataset.f] = +s.value;
      run();
    });
    $('#dl-xlsx').addEventListener('click', dlXlsx);
    $('#dl-csv').addEventListener('click', dlCsv);
    loadSamples();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
