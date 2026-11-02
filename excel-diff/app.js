/* Excel model comparison. Runs fully in the browser: SheetJS reads both workbooks (formulas + cached values),
   sheets are matched by name, rows by their column-A label, and every cell change is classified. */
(function () {
  "use strict";
  var TYPES = {
    input:   { name: "Input value changed",      short: "Input",      glyph: "I" },
    formula: { name: "Formula changed",          short: "Formula",    glyph: "F" },
    calc:    { name: "Calculated value changed", short: "Calculated", glyph: "C" },
    added:   { name: "Row added",                short: "Row added",  glyph: "+" },
    removed: { name: "Row removed",              short: "Row removed", glyph: "−" }
  };
  var ORDER = ["input", "formula", "calc", "added", "removed"];
  var HEAT_MAX_ROWS = 300, HEAT_MAX_COLS = 40;
  var $ = function (s) { return document.querySelector(s); };
  var state = { files: { old: null, "new": null }, result: null, chartMode: "abs", filterType: "", filterSheet: "", q: "" };

  // ---------- reading ----------
  function readBook(buf) {
    var wb = XLSX.read(buf, { type: "array", cellFormula: true, cellNF: true, cellText: true });
    var sheets = [];
    wb.SheetNames.forEach(function (name) {
      var ws = wb.Sheets[name], rows = new Map(), maxC = 0;
      if (!ws["!ref"]) { sheets.push({ name: name, rows: rows, maxC: 0 }); return; }
      Object.keys(ws).forEach(function (addr) {
        if (addr[0] === "!") return;
        var cell = ws[addr], rc = XLSX.utils.decode_cell(addr);
        if (cell.v === undefined && !cell.f) return;
        if (cell.v === "" && !cell.f) return;
        var r = rc.r + 1, c = rc.c;
        if (!rows.has(r)) rows.set(r, { r: r, cells: new Map() });
        rows.get(r).cells.set(c, { v: cell.v, f: cell.f || null, w: cell.w, z: cell.z, t: cell.t });
        if (c > maxC) maxC = c;
      });
      var list = Array.from(rows.values()).sort(function (a, b) { return a.r - b.r; });
      var seen = {};
      list.forEach(function (row) {
        var a = row.cells.get(0), label = a && a.v != null ? String(a.v).trim() : "";
        var k = label.toLowerCase().replace(/\s+/g, " ");
        seen[k] = (seen[k] || 0) + 1;
        row.label = label;
        row.key = (k || "#blank") + "#" + seen[k];
      });
      sheets.push({ name: name, rows: rows, list: list, maxC: maxC });
    });
    return sheets;
  }

  // ---------- formula references ----------
  var REF = /(?<![A-Za-z0-9_.$])((?:'(?:[^']|'')+'|[A-Za-z_][A-Za-z0-9_.]*)!)?(\$?)([A-Z]{1,3})(\$?)(\d+)(?::(\$?)([A-Z]{1,3})(\$?)(\d+))?(?![A-Za-z0-9_(!])/g;
  function sheetOf(prefix, cur) {
    if (!prefix) return cur;
    var s = prefix.slice(0, -1);
    if (s[0] === "'") s = s.slice(1, -1).replace(/''/g, "'");
    return s;
  }
  function eachCodePart(f, fn) { // skip string literals
    return f.split(/("(?:[^"]|"")*")/).map(function (part, i) { return i % 2 ? part : fn(part); }).join("");
  }
  function mapRow(map, r) {
    if (!map) return r;
    if (map.has(r)) return map.get(r);
    var best = null; // nearest lower row that still exists: keep its offset
    map.forEach(function (to, from) { if (to != null && from < r && (best === null || from > best)) best = from; });
    return best === null ? r : map.get(best) + (r - best);
  }
  function translate(f, cur, maps) {
    return eachCodePart(f, function (code) {
      return code.replace(REF, function (m, pre, d1, c1, d2, r1, d3, c2, d4, r2) {
        var sh = sheetOf(pre, cur).toLowerCase(), map = maps[sh];
        if (!map) return m;
        var a = mapRow(map, +r1), out = (pre || "") + d1 + c1 + d2 + (a == null ? "#DELETED" : a);
        if (r2) { var b = mapRow(map, +r2); out += ":" + d3 + c2 + d4 + (b == null ? "#DELETED" : b); }
        return out;
      });
    });
  }
  function normF(f) { return String(f).replace(/^=/, "").replace(/\s+/g, "").toUpperCase(); }
  function refsOf(f, cur) { // precedents of a formula: [{sheet, r, c}] (ranges expanded, capped)
    var out = [];
    eachCodePart(f, function (code) {
      code.replace(REF, function (m, pre, d1, c1, d2, r1, d3, c2, d4, r2) {
        var sh = sheetOf(pre, cur).toLowerCase();
        var ca = XLSX.utils.decode_col(c1), ra = +r1, cb = c2 ? XLSX.utils.decode_col(c2) : ca, rb = r2 ? +r2 : ra;
        if ((Math.abs(rb - ra) + 1) * (Math.abs(cb - ca) + 1) > 20000) return m;
        for (var r = Math.min(ra, rb); r <= Math.max(ra, rb); r++)
          for (var c = Math.min(ca, cb); c <= Math.max(ca, cb); c++) out.push({ sheet: sh, r: r, c: c });
        return m;
      });
      return code;
    });
    return out;
  }

  // ---------- comparison ----------
  function differ(a, b) {
    if (typeof a === "number" && typeof b === "number") return Math.abs(a - b) > 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));
    return String(a == null ? "" : a) !== String(b == null ? "" : b);
  }
  function compare(b1, b2) {
    var byName2 = {}, maps = {}, pairs = [], changes = [], notes = [];
    b2.forEach(function (s) { byName2[s.name.trim().toLowerCase()] = s; });
    b1.forEach(function (s1) {
      var s2 = byName2[s1.name.trim().toLowerCase()];
      if (!s2) { notes.push("Sheet “" + s1.name + "” is only in the old file."); return; }
      s2.matched = true;
      var keys2 = new Map(); (s2.list || []).forEach(function (row) { keys2.set(row.key, row); });
      var map = new Map(), keys1 = new Set();
      (s1.list || []).forEach(function (row) { keys1.add(row.key); var m = keys2.get(row.key); map.set(row.r, m ? m.r : null); });
      maps[s1.name.trim().toLowerCase()] = map;
      pairs.push({ s1: s1, s2: s2, keys2: keys2, keys1: keys1 });
    });
    b2.forEach(function (s2) { if (!s2.matched) notes.push("Sheet “" + s2.name + "” is only in the new file."); });

    var sheets = [];
    pairs.forEach(function (p) {
      var s1 = p.s1, s2 = p.s2, cur1 = s1.name, cellStat = new Map(), rowStat = new Map(), removedRows = [];
      var maxC = Math.max(s1.maxC, s2.maxC);
      (s1.list || []).forEach(function (row1) {
        var row2 = p.keys2.get(row1.key);
        if (!row2) {
          removedRows.push(row1);
          changes.push(rowChange("removed", s2.name, row1, "v1 row " + row1.r));
          return;
        }
        for (var c = 1; c <= maxC; c++) {
          var a = row1.cells.get(c), b = row2.cells.get(c);
          if (!a && !b) continue;
          var type = null;
          if ((a && a.f) || (b && b.f)) {
            if (!(a && a.f) || !(b && b.f) || normF(translate(a.f, cur1, maps)) !== normF(b.f)) type = "formula";
            else if (differ(a.v, b.v)) type = "calc";
          } else if (differ(a && a.v, b && b.v)) type = "input";
          if (!type) continue;
          var addr = XLSX.utils.encode_col(c) + row2.r;
          cellStat.set(row2.r + "," + c, type);
          changes.push(cellChange(type, s2.name, addr, row2.label, a, b));
        }
      });
      (s2.list || []).forEach(function (row2) {
        if (!p.keys1.has(row2.key)) { rowStat.set(row2.r, "added"); changes.push(rowChange("added", s2.name, row2, "row " + row2.r)); }
      });
      sheets.push({ name: s2.name, s1: s1, s2: s2, cellStat: cellStat, rowStat: rowStat, removedRows: removedRows, map: maps[cur1.trim().toLowerCase()], maxC: maxC });
    });
    var res = { changes: changes, sheets: sheets, notes: notes, maps: maps, b1: b1, b2: b2 };
    res.headline = findHeadline(res);
    return res;
  }
  function num(x) { return typeof x === "number" && isFinite(x) ? x : null; }
  function cellChange(type, sheet, addr, label, a, b) {
    var o = a ? a.v : null, n = b ? b.v : null, d = null, pct = null;
    if (num(o) !== null && num(n) !== null) { d = n - o; pct = o !== 0 ? d / Math.abs(o) * 100 : null; }
    return { type: type, sheet: sheet, cell: addr, label: label, old: o, "new": n, oldTxt: show(a), newTxt: show(b),
             delta: d, pct: pct, isPct: !!((b && /%/.test(b.z || "")) || (a && /%/.test(a.z || ""))),
             oldF: a && a.f ? "=" + a.f : "", newF: b && b.f ? "=" + b.f : "" };
  }
  function rowChange(type, sheet, row, where) {
    var vals = [];
    row.cells.forEach(function (cell, c) { if (c > 0 && vals.length < 4) vals.push(show(cell)); });
    var txt = vals.join(", ") + (row.cells.size - 1 > 4 ? ", …" : "");
    return { type: type, sheet: sheet, cell: where, label: row.label || "(no label)", old: null, "new": null,
             oldTxt: type === "removed" ? txt : "", newTxt: type === "added" ? txt : "", delta: null, pct: null, rowR: row.r };
  }
  function show(cell) {
    if (!cell || cell.v == null) return "";
    if (cell.w != null && cell.w !== "") return String(cell.w).trim();
    return typeof cell.v === "number" ? fmtNum(cell.v) : String(cell.v);
  }
  function fmtNum(x, signed) {
    if (x == null || !isFinite(x)) return "";
    var ax = Math.abs(x), dp = ax >= 1000 ? 0 : ax >= 10 ? 1 : ax >= 1 ? 2 : 4;
    var s = ax.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: dp });
    return (x < 0 ? "−" : signed && x > 0 ? "+" : "") + s;
  }
  function fmtDelta(ch) {
    if (ch.delta == null) return "";
    if (ch.isPct) return (ch.delta > 0 ? "+" : ch.delta < 0 ? "−" : "") + Math.abs(ch.delta * 100).toFixed(2) + " pp";
    return fmtNum(ch.delta, true);
  }
  function fmtPct(p) { return p == null ? "" : (p > 0 ? "+" : p < 0 ? "−" : "") + Math.abs(p).toFixed(1) + "%"; }

  // ---------- headline output + what feeds it ----------
  var HEAD = [/^enterprise value\b/i, /^equity value\b/i, /(value|price) per share/i, /\bnpv\b|net present value/i, /^irr\b|internal rate of return/i];
  function findHeadline(res) {
    var found = [];
    res.sheets.forEach(function (sh) {
      (sh.s2.list || []).forEach(function (row2) {
        if (!HEAD.some(function (re) { return re.test(row2.label); }) || sh.rowStat.has(row2.r)) return;
        var row1 = sh.s1.list.find(function (r) { return r.key === row2.key; });
        if (!row1) return;
        for (var c = 1; c <= sh.maxC; c++) {
          var a = row1.cells.get(c), b = row2.cells.get(c);
          if (b && num(b.v) !== null && a && num(a.v) !== null) {
            found.push({ sheet: sh.name, addr: XLSX.utils.encode_col(c) + row2.r, r: row2.r, c: c, label: row2.label, ch: cellChange("calc", sh.name, "", row2.label, a, b) });
            break;
          }
        }
      });
    });
    found = found.slice(0, 3);
    if (!found.length) { // no recognisable output label: use the biggest calculated move
      var top = res.changes.filter(function (c) { return c.type === "calc" && c.delta != null; })
        .sort(function (x, y) { return Math.abs(y.delta) - Math.abs(x.delta); })[0];
      if (top) { var rc = XLSX.utils.decode_cell(top.cell); found.push({ sheet: top.sheet, addr: top.cell, r: rc.r + 1, c: rc.c, label: top.label, ch: top, fallback: true }); }
    }
    if (found.length) res.feeds = upstream(res, found[0]);
    return found;
  }
  function upstream(res, h) { // which root edits sit upstream of the headline cell (new file, plus old file for removed rows)
    function walk(book, sheet, r, c) {
      var idx = {}; book.forEach(function (s) { idx[s.name.trim().toLowerCase()] = s; });
      var seen = new Set(), stack = [{ sheet: sheet.toLowerCase(), r: r, c: c }], n = 0;
      while (stack.length && n < 200000) {
        var x = stack.pop(), k = x.sheet + "!" + x.r + "," + x.c;
        if (seen.has(k)) continue;
        seen.add(k); n++;
        var s = idx[x.sheet], row = s && s.rows.get(x.r), cell = row && row.cells.get(x.c);
        if (cell && cell.f) refsOf(cell.f, s.name).forEach(function (p) { stack.push(p); });
      }
      return seen;
    }
    var seen2 = walk(res.b2, h.sheet, h.r, h.c);
    var sh = res.sheets.find(function (s) { return s.name === h.sheet; });
    var r1 = null; sh.map.forEach(function (to, from) { if (to === h.r) r1 = from; });
    var seen1 = r1 ? walk(res.b1, sh.s1.name, r1, h.c) : new Set();
    var hits = new Set();
    res.changes.forEach(function (ch, i) {
      var key = ch.sheet.toLowerCase();
      if (ch.type === "input" || ch.type === "formula") {
        var rc = XLSX.utils.decode_cell(ch.cell);
        if (seen2.has(key + "!" + (rc.r + 1) + "," + rc.c)) hits.add(i);
      } else if (ch.type === "added" || ch.type === "removed") {
        var set = ch.type === "added" ? seen2 : seen1, pre = key + "!" + ch.rowR + ",";
        for (var k of set) if (k.indexOf(pre) === 0) { hits.add(i); break; }
      }
    });
    return hits;
  }

  // ---------- rendering ----------
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function counts(res) {
    var n = { input: 0, formula: 0, calc: 0, added: 0, removed: 0 };
    res.changes.forEach(function (c) { n[c.type]++; });
    return n;
  }
  function render() {
    var res = state.result;
    if (!res) return;
    var n = counts(res);
    $("#tiles").innerHTML = ORDER.map(function (t) {
      return '<button type="button" class="tile' + (state.filterType === t ? " on" : "") + '" data-type="' + t + '" aria-pressed="' + (state.filterType === t) + '">' +
        '<span class="sw sw-' + t + '" aria-hidden="true">' + TYPES[t].glyph + '</span><span class="tl">' + TYPES[t].name + '</span><b>' + n[t] + '</b></button>';
    }).join("");
    $("#tiles").querySelectorAll(".tile").forEach(function (b) {
      b.addEventListener("click", function () { state.filterType = state.filterType === b.dataset.type ? "" : b.dataset.type; $("#f-type").value = state.filterType; render(); });
    });
    var total = res.changes.length;
    $("#runline").textContent = res.sheets.length + " sheets matched by name, " + total + " changes found." + (res.notes.length ? " " + res.notes.join(" ") : "");
    renderHeadline(res);
    renderChart(res);
    renderHeat(res);
    renderList(res);
  }
  function renderHeadline(res) {
    var box = $("#answer");
    if (!res.headline.length) { box.innerHTML = "<p>No numeric output found to headline.</p>"; return; }
    var h0 = res.headline[0];
    var rows = res.headline.map(function (h) {
      var ch = h.ch;
      return '<div class="ans"><span class="al">' + esc(h.label) + ' <small>' + esc(h.sheet) + "!" + esc(h.addr) + '</small></span>' +
        '<span class="av"><span>Old <b>' + esc(ch.oldTxt) + '</b></span><span>New <b>' + esc(ch.newTxt) + '</b></span>' +
        '<span class="dl ' + (ch.delta < 0 ? "neg" : ch.delta > 0 ? "pos" : "") + '">Delta <b>' + esc(fmtDelta(ch)) + (ch.pct != null ? " (" + fmtPct(ch.pct) + ")" : "") + '</b></span></span></div>';
    }).join("");
    var feeds = res.changes.map(function (c, i) { return { c: c, i: i }; })
      .filter(function (x) { return x.c.type !== "calc" && res.feeds && res.feeds.has(x.i); });
    var list = feeds.map(function (x) {
      var c = x.c, what = c.type === "added" || c.type === "removed" ? TYPES[c.type].name + ": " + esc(c.label)
        : esc(c.label) + " (" + esc(c.cell) + "): " + (c.type === "formula" ? '<code>' + esc(c.oldF || c.oldTxt) + '</code> → <code>' + esc(c.newF || c.newTxt) + '</code>' : esc(c.oldTxt) + " → " + esc(c.newTxt));
      return '<li><span class="sw sw-' + c.type + '" aria-hidden="true">' + TYPES[c.type].glyph + '</span> <span class="lt">' + esc(c.sheet) + '</span> ' + what + '</li>';
    }).join("");
    var rootTotal = res.changes.filter(function (c) { return c.type !== "calc"; }).length;
    box.innerHTML = rows +
      (h0.fallback ? '<p class="note">No output label (enterprise value, equity value, NPV, IRR) was found, so this shows the biggest calculated change.</p>' : "") +
      '<h3>Edits that feed ' + esc(h0.label) + ' <small>' + feeds.length + " of " + rootTotal + ' edits, traced through the formulas</small></h3>' +
      (list ? '<ul class="roots">' + list + "</ul>" : '<p class="note">None of the edits feed this cell.</p>') +
      '<p class="note">How much of the delta each edit explains (a step-by-step bridge from old to new) is a delivery step, not part of this demo.</p>';
  }

  var tip = null;
  function tipOn(root) {
    root.addEventListener("mousemove", function (e) {
      var t = e.target.closest("[data-tip]");
      if (!t) { tip.hidden = true; return; }
      tip.innerHTML = t.getAttribute("data-tip");
      tip.hidden = false;
      var x = e.clientX + 14, y = e.clientY + 14, w = tip.offsetWidth, hgt = tip.offsetHeight;
      if (x + w > window.innerWidth - 8) x = e.clientX - w - 14;
      if (y + hgt > window.innerHeight - 8) y = e.clientY - hgt - 14;
      tip.style.left = Math.max(8, x) + "px"; tip.style.top = Math.max(8, y) + "px";
    });
    root.addEventListener("mouseleave", function () { tip.hidden = true; });
  }
  function tipText(c) {
    return "<b>" + esc(c.sheet) + "!" + esc(c.cell) + "</b> " + esc(c.label) + "<br>" + esc(c.oldTxt || "(empty)") + " → " + esc(c.newTxt || "(empty)") +
      (c.delta != null ? "<br>" + esc(fmtDelta(c)) + (c.pct != null ? " (" + fmtPct(c.pct) + ")" : "") : "") +
      (c.type === "formula" ? "<br><code>" + esc(c.oldF || "(constant)") + "</code> → <code>" + esc(c.newF || "(constant)") + "</code>" : "") +
      "<br>" + TYPES[c.type].name;
  }

  function renderChart(res) {
    var mode = state.chartMode;
    var pool = res.changes.filter(function (c) { return (c.type === "calc" || c.type === "formula") && c.delta != null && (mode === "abs" || c.pct != null); });
    pool.sort(function (a, b) { return mode === "abs" ? Math.abs(b.delta) - Math.abs(a.delta) : Math.abs(b.pct) - Math.abs(a.pct); });
    var top = pool.slice(0, 10), el = $("#chart");
    if (!top.length) { el.innerHTML = '<p class="note">No changed calculated values.</p>'; return; }
    var W = Math.max(280, el.clientWidth), rowH = 44, H = top.length * rowH + 8, mid = W / 2, half = W / 2 - 4;
    var mx = Math.max.apply(null, top.map(function (c) { return Math.abs(mode === "abs" ? c.delta : c.pct); })) || 1;
    var svg = '<svg width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Top ' + top.length + ' changed calculated values">';
    svg += '<line x1="' + mid + '" y1="0" x2="' + mid + '" y2="' + H + '" class="axis"/>';
    top.forEach(function (c, i) {
      var v = mode === "abs" ? c.delta : c.pct, len = Math.max(2, Math.abs(v) / mx * half), y = i * rowH;
      var x = v < 0 ? mid - len : mid, val = mode === "abs" ? fmtDelta(c) + (c.pct != null ? "  (" + fmtPct(c.pct) + ")" : "") : fmtPct(c.pct) + "  (" + fmtDelta(c) + ")";
      var name = c.label + " · " + c.sheet + "!" + c.cell;
      svg += '<g class="bar" data-tip="' + esc(tipText(c)) + '">' +
        '<rect x="0" y="' + y + '" width="' + W + '" height="' + rowH + '" class="hit"/>' +
        '<text x="2" y="' + (y + 15) + '" class="bl">' + esc(clip(name, Math.floor((W - 135) / 6.3))) + '</text>' +
        '<text x="' + (W - 2) + '" y="' + (y + 15) + '" class="bv" text-anchor="end">' + esc(val) + '</text>' +
        '<path d="' + barPath(x, y + 22, len, 14, v < 0) + '" class="fill-' + c.type + '"/></g>';
    });
    svg += "</svg>";
    var types = {}; top.forEach(function (c) { types[c.type] = 1; });
    var legend = Object.keys(types).length > 1 ? '<div class="legend">' + Object.keys(types).map(function (t) { return '<span><i class="sw sw-' + t + '">' + TYPES[t].glyph + "</i>" + TYPES[t].name + "</span>"; }).join("") + "</div>" : "";
    el.innerHTML = svg + legend;
  }
  function barPath(x, y, w, h, leftEnd) { // 4px rounded data end, square at the zero line
    var r = Math.min(4, w / 2);
    if (leftEnd) return "M" + (x + w) + "," + y + " H" + (x + r) + " Q" + x + "," + y + " " + x + "," + (y + r) + " V" + (y + h - r) + " Q" + x + "," + (y + h) + " " + (x + r) + "," + (y + h) + " H" + (x + w) + " Z";
    return "M" + x + "," + y + " H" + (x + w - r) + " Q" + (x + w) + "," + y + " " + (x + w) + "," + (y + r) + " V" + (y + h - r) + " Q" + (x + w) + "," + (y + h) + " " + (x + w - r) + "," + (y + h) + " H" + x + " Z";
  }
  function clip(s, n) { n = Math.max(12, n); return s.length > n ? s.slice(0, n - 1) + "…" : s; }

  function renderHeat(res) {
    var byKey = {}; res.changes.forEach(function (c) { if (c.type !== "added" && c.type !== "removed") byKey[c.sheet + "!" + c.cell] = c; });
    $("#heat").innerHTML = res.sheets.map(function (sh) {
      // unified row order: rows of the new file, with removed rows slotted in after their old neighbour
      var after = new Map(), top = [];
      sh.removedRows.forEach(function (row1) {
        var prev = null;
        sh.s1.list.forEach(function (r) { if (r.r < row1.r && sh.map.get(r.r) != null) prev = sh.map.get(r.r); });
        if (prev == null) top.push(row1); else { if (!after.has(prev)) after.set(prev, []); after.get(prev).push(row1); }
      });
      var seq = top.map(function (r) { return { row: r, gone: true }; });
      (sh.s2.list || []).forEach(function (row2) {
        seq.push({ row: row2 });
        (after.get(row2.r) || []).forEach(function (r) { seq.push({ row: r, gone: true }); });
      });
      var cols = Math.min(sh.maxC, HEAT_MAX_COLS), cut = seq.length > HEAT_MAX_ROWS || sh.maxC > HEAT_MAX_COLS;
      seq = seq.slice(0, HEAT_MAX_ROWS);
      var nChanged = 0;
      var head = '<tr><th class="rl" scope="col">Row</th>';
      for (var c = 1; c <= cols; c++) head += '<th scope="col">' + XLSX.utils.encode_col(c) + "</th>";
      head += "</tr>";
      var body = seq.map(function (it) {
        var row = it.row, rs = it.gone ? "removed" : sh.rowStat.get(row.r);
        var tr = '<tr' + (rs ? ' class="r-' + rs + '"' : "") + '><th class="rl" scope="row"><span class="rn">' + (it.gone ? "v1 " : "") + row.r + "</span> " + esc(clip(row.label || "(no label)", 30)) + "</th>";
        for (var c = 1; c <= cols; c++) {
          var cell = row.cells.get(c), cls = "", tipS = "", g = "";
          if (rs) {
            if (cell) { cls = "x-" + rs; g = TYPES[rs].glyph; tipS = "<b>" + esc(sh.name) + (it.gone ? " (old) " : "!") + XLSX.utils.encode_col(c) + row.r + "</b> " + esc(row.label) + "<br>" + esc(show(cell)) + "<br>" + TYPES[rs].name; }
          } else {
            var ch = byKey[sh.name + "!" + XLSX.utils.encode_col(c) + row.r];
            if (ch) { cls = "x-" + ch.type; g = TYPES[ch.type].glyph; tipS = tipText(ch); nChanged++; }
            else if (cell) { cls = "x-same"; tipS = "<b>" + esc(sh.name) + "!" + XLSX.utils.encode_col(c) + row.r + "</b> " + esc(row.label) + "<br>" + esc(show(cell)) + "<br>Unchanged"; }
          }
          tr += "<td" + (cls ? ' class="' + cls + '"' : "") + (tipS ? ' data-tip="' + esc(tipS) + '"' : "") + ">" + g + "</td>";
        }
        return tr + "</tr>";
      }).join("");
      var rowsAR = sh.rowStat.size + sh.removedRows.length;
      return '<section class="hs"><h3>' + esc(sh.name) + ' <small>' + nChanged + " changed cells" + (rowsAR ? ", " + sh.rowStat.size + " added and " + sh.removedRows.length + " removed rows" : "") + '</small></h3>' +
        '<div class="scroll"><table class="heat">' + head + body + "</table></div>" + (cut ? '<p class="note">Showing the first ' + HEAT_MAX_ROWS + " rows and " + HEAT_MAX_COLS + " columns.</p>" : "") + "</section>";
    }).join("");
  }

  function filtered(res) {
    var q = state.q.toLowerCase();
    return res.changes.filter(function (c) {
      return (!state.filterType || c.type === state.filterType) && (!state.filterSheet || c.sheet === state.filterSheet) &&
        (!q || (c.label + " " + c.cell + " " + c.sheet).toLowerCase().indexOf(q) >= 0);
    });
  }
  function renderList(res) {
    var sel = $("#f-sheet"), cur = state.filterSheet;
    sel.innerHTML = '<option value="">All sheets</option>' + res.sheets.map(function (s) { return '<option' + (s.name === cur ? " selected" : "") + ">" + esc(s.name) + "</option>"; }).join("");
    var list = filtered(res);
    $("#f-count").textContent = list.length + " of " + res.changes.length + " changes";
    $("#list tbody").innerHTML = list.map(function (c) {
      return '<tr class="t-' + c.type + '"><td>' + esc(c.sheet) + "</td><td class=\"mono\">" + esc(c.cell) + "</td><td>" + esc(c.label) +
        '</td><td class="num">' + (c.type === "formula" && c.oldF ? '<code>' + esc(c.oldF) + "</code><br>" : "") + esc(c.oldTxt) +
        '</td><td class="num">' + (c.type === "formula" && c.newF ? '<code>' + esc(c.newF) + "</code><br>" : "") + esc(c.newTxt) +
        '</td><td class="num">' + esc(fmtPct(c.pct)) + '</td><td><span class="sw sw-' + c.type + '" aria-hidden="true">' + TYPES[c.type].glyph + "</span> " + TYPES[c.type].short + "</td></tr>";
    }).join("") || '<tr><td colspan="7" class="note">No changes match.</td></tr>';
  }
  function csv() {
    var res = state.result; if (!res) return;
    var q = function (v) { v = v == null ? "" : String(v); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
    var lines = [["Sheet", "Cell", "Label", "Old", "New", "Old formula", "New formula", "Change", "% change", "Type"].join(",")];
    filtered(res).forEach(function (c) {
      lines.push([c.sheet, c.cell, c.label, c.old != null ? c.old : c.oldTxt, c["new"] != null ? c["new"] : c.newTxt, c.oldF, c.newF,
        c.delta != null ? c.delta : "", c.pct != null ? c.pct.toFixed(4) : "", TYPES[c.type].name].map(q).join(","));
    });
    var blob = new Blob([lines.join("\r\n") + "\r\n"], { type: "text/csv" }), a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "excel-model-changes.csv";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
  }

  // ---------- loading ----------
  function run(bufOld, bufNew, nameOld, nameNew) {
    try {
      var t0 = performance.now();
      state.result = compare(readBook(bufOld), readBook(bufNew));
      state.result.ms = performance.now() - t0;
      $("#names").innerHTML = "Comparing <b>" + esc(nameOld) + "</b> (old) with <b>" + esc(nameNew) + "</b> (new). Took " + Math.round(state.result.ms) + " ms in your browser.";
      $("#err").hidden = true;
      render();
      document.body.dataset.ready = "1";
    } catch (e) {
      $("#err").hidden = false; $("#err").textContent = "Could not read the files: " + e.message;
    }
  }
  function loadSamples() {
    state.files = { old: null, "new": null };
    ["old", "new"].forEach(function (k) { $("#z-" + k + " .fn").textContent = "No file yet"; });
    Promise.all(["model_v1.xlsx", "model_v2.xlsx"].map(function (u) { return fetch(u).then(function (r) { if (!r.ok) throw new Error(u + " " + r.status); return r.arrayBuffer(); }); }))
      .then(function (b) { run(b[0], b[1], "model_v1.xlsx (sample)", "model_v2.xlsx (sample)"); })
      .catch(function (e) { $("#err").hidden = false; $("#err").textContent = "Could not load the sample files: " + e.message; });
  }
  function setFile(k, file) {
    state.files[k] = file;
    $("#z-" + k + " .fn").textContent = file.name;
    if (state.files.old && state.files["new"]) {
      Promise.all([state.files.old.arrayBuffer(), state.files["new"].arrayBuffer()])
        .then(function (b) { run(b[0], b[1], state.files.old.name, state.files["new"].name); });
    }
  }
  function wireZone(k) {
    var z = $("#z-" + k), inp = z.querySelector("input");
    inp.addEventListener("change", function () {
      if (inp.files.length >= 2 && k === "old") { setFile("old", inp.files[0]); setFile("new", inp.files[1]); }
      else if (inp.files[0]) setFile(k, inp.files[0]);
    });
    ["dragenter", "dragover"].forEach(function (ev) { z.addEventListener(ev, function (e) { e.preventDefault(); z.classList.add("over"); }); });
    ["dragleave", "drop"].forEach(function (ev) { z.addEventListener(ev, function () { z.classList.remove("over"); }); });
    z.addEventListener("drop", function (e) {
      e.preventDefault();
      var fs = Array.from(e.dataTransfer.files || []);
      if (fs.length >= 2) { fs.sort(function (a, b) { return a.name.localeCompare(b.name); }); setFile("old", fs[0]); setFile("new", fs[1]); }
      else if (fs[0]) setFile(k, fs[0]);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    tip = $("#tip");
    tipOn($("#chart")); tipOn($("#heat"));
    wireZone("old"); wireZone("new");
    $("#samples").addEventListener("click", loadSamples);
    $("#csv").addEventListener("click", csv);
    $("#f-type").addEventListener("change", function (e) { state.filterType = e.target.value; render(); });
    $("#f-sheet").addEventListener("change", function (e) { state.filterSheet = e.target.value; renderList(state.result); });
    $("#f-q").addEventListener("input", function (e) { state.q = e.target.value; renderList(state.result); });
    document.querySelectorAll("[data-mode]").forEach(function (b) {
      b.addEventListener("click", function () {
        state.chartMode = b.dataset.mode;
        document.querySelectorAll("[data-mode]").forEach(function (x) { x.setAttribute("aria-pressed", x === b); });
        renderChart(state.result);
      });
    });
    var rt; window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(function () { if (state.result) renderChart(state.result); }, 150); });
    window.excelDiff = { state: state, counts: function () { return state.result && counts(state.result); } };
    loadSamples();
  });
})();
