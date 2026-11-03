/* Self-storage revenue model demo. Everything runs in the browser; files are never uploaded. */
(function () {
  "use strict";
  var $ = function (s) { return document.querySelector(s); };
  var DAY = 864e5;
  var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var RINGS = ["0-3 mi", "3-10 mi", "10-25 mi"];

  // ---------- settings (editable defaults) ----------
  var DEF = { t1: 90, p1: 70, t2: 80, p2: 50, p3: 40, w0: 3, w1: 2, w2: 1, callAge: 90, stale: 21,
    hold: 5, holdWeeks: 4, cap: 10, band: 2, seasW: 10, seasCap: 3, smooth: "yes",
    maxLate: 30, minTen: 6, minSince: 6, minGap: 4, share: 50, maxInc: 12, base: "rec", attr: 5 };
  var S = Object.assign({}, DEF);
  var RULES = [
    ["Target percentile by occupancy", [["t1", "High tier: occupancy at or above (%)"], ["p1", "High tier percentile"], ["t2", "Mid tier: at or above (%)"], ["p2", "Mid tier percentile"], ["p3", "Low tier percentile", "wide"]]],
    ["Comp set", [["w0", "Weight 0-3 mi"], ["w1", "Weight 3-10 mi"], ["w2", "Weight 10-25 mi"], ["stale", "Web rate max age (days)"], ["callAge", "Call-around max age (days)", "wide"]]],
    ["Guardrails", [["hold", "Hold if close comps cut more than (%)"], ["holdWeeks", "over this many weeks"], ["cap", "Max change per week (%)"], ["band", "Dead band: skip moves under (%)"]]],
    ["Seasonality", [["seasW", "Share of the move-in swing used (%)"], ["seasCap", "Max seasonal move (%)"], ["smooth", "Month factor", "wide", [["yes", "smoothed with the months either side (1-2-1)"], ["no", "raw, this month only"]]]]],
    ["ECRI rules", [["maxLate", "Skip if days late over"], ["minTen", "Min tenure (months)"], ["minSince", "Min months since last increase"], ["minGap", "Skip if gap to street under (%)"], ["share", "Close this share of the gap (%)"], ["maxInc", "Max increase (%)"], ["base", "Compare rent to", "wide", [["rec", "recommended street rate"], ["cur", "current street rate"]]], ["attr", "Expected move-outs from ECRI letters (%)", "wide"]]]
  ];

  // ---------- data specs and column matching ----------
  var SPECS = {
    comps: { label: "Competitor rate export", zone: "#z-comps", fields: [
      ["date", "Date collected", 1, ["date collected", "collection date", "date", "week", "survey date"]],
      ["store", "Store name", 1, ["store name", "competitor", "facility name", "facility", "store", "name"]],
      ["dist", "Distance (mi)", 1, ["distance (mi)", "distance", "miles", "dist"]],
      ["size", "Unit size", 1, ["unit size", "size", "unit type", "dimensions"]],
      ["climate", "Climate controlled", 0, ["climate controlled", "climate", "cc", "features"]],
      ["rate", "Web rate", 1, ["web rate", "online rate", "online price", "web price", "rate", "price", "street rate"]],
      ["promo", "Promotion", 0, ["promotion", "promo", "special", "specials"]]] },
    roll: { label: "Rent roll", zone: "#z-roll", fields: [
      ["id", "Tenant ID", 1, ["tenant id", "tenant", "account", "customer", "id", "name"]],
      ["unit", "Unit", 0, ["unit", "unit number", "unit no", "unit #", "unit id", "space"]],
      ["size", "Unit size", 1, ["unit size", "size", "unit type"]],
      ["movein", "Move-in date", 1, ["move-in date", "move in date", "movein", "move in", "start date", "lease start"]],
      ["rent", "Current rent", 1, ["current rent", "rent", "monthly rent", "rent rate", "rate"]],
      ["lastinc", "Last increase date", 0, ["last increase date", "last increase", "last rate change", "last ecri", "last rent change"]],
      ["late", "Days late", 0, ["days late", "days past due", "past due days", "delinquent days"]]] },
    moves: { label: "Move-in history", zone: "#z-moves", fields: [
      ["week", "Week start", 1, ["week start", "week", "date", "week of"]],
      ["size", "Unit size", 0, ["unit size", "size", "unit type"]],
      ["mi", "Move-ins", 1, ["move-ins", "move ins", "moveins", "rentals", "move in"]],
      ["mo", "Move-outs", 0, ["move-outs", "move outs", "moveouts", "vacates"]]] }
  };
  var norm = function (s) { return String(s == null ? "" : s).toLowerCase().replace(/[^a-z0-9]/g, ""); };

  function autoMap(spec, headers) {
    var used = {}, map = {}, H = headers.map(norm);
    spec.fields.forEach(function (f) {
      var hit = -1;
      f[3].some(function (syn) { var i = H.indexOf(norm(syn)); if (i >= 0 && !used[i]) { hit = i; return true; } return false; });
      if (hit < 0) f[3].some(function (syn) {
        var n = norm(syn); if (n.length < 4) return false;
        for (var i = 0; i < H.length; i++) if (!used[i] && H[i].indexOf(n) >= 0) { hit = i; return true; }
        return false;
      });
      if (hit >= 0) { used[hit] = 1; map[f[0]] = headers[hit]; } else map[f[0]] = "";
    });
    return map;
  }
  function mapScore(spec, headers) {
    var m = autoMap(spec, headers), s = 0;
    spec.fields.forEach(function (f) { if (m[f[0]]) s += f[2] ? 2 : 1; });
    return s;
  }

  // ---------- value parsing ----------
  function toDay(v) {
    if (v == null || v === "") return null;
    if (v instanceof Date) return isNaN(v) ? null : Math.round(Date.UTC(v.getFullYear(), v.getMonth(), v.getDate()) / DAY);
    if (typeof v === "number") return v > 20000 && v < 80000 ? Math.round(v - 25569) : null;
    var s = String(v).trim(), m;
    if ((m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/))) return Date.UTC(+m[1], +m[2] - 1, +m[3]) / DAY;
    if ((m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})/))) { var y = +m[3]; if (y < 100) y += 2000; return Date.UTC(y, +m[1] - 1, +m[2]) / DAY; }
    if (/^\d{5}(\.\d+)?$/.test(s)) return toDay(+s);
    var t = Date.parse(s); return isNaN(t) ? null : Math.round(t / DAY);
  }
  function toNum(v) {
    if (typeof v === "number") return isFinite(v) ? v : null;
    var s = String(v == null ? "" : v).replace(/[$,\s]/g, ""); if (!s) return null;
    var n = parseFloat(s); return isFinite(n) ? n : null;
  }
  function normSize(v) {
    var m = String(v == null ? "" : v).match(/(\d+(?:\.\d+)?)\s*'?\s*[x×*]\s*(\d+(?:\.\d+)?)/i);
    if (!m) return String(v || "").trim();
    var a = +m[1], b = +m[2]; return Math.min(a, b) + "x" + Math.max(a, b);
  }
  function toClimate(v) { return /^\s*(y|yes|true|1|cc|climate)/i.test(String(v == null ? "" : v)); }
  var isoDay = function (d) { return d == null ? "" : new Date(d * DAY).toISOString().slice(0, 10); };
  var monthOf = function (d) { return new Date(d * DAY).getUTCMonth(); };

  // ---------- state ----------
  var state = { raw: {}, files: {}, maps: {}, comps: [], roll: [], moves: [], mix: [], calls: [], result: null, sample: true };
  window.storageRM = { state: state, S: S, DEF: DEF, compute: function () { return compute(); } };

  function parseDataset(key) {
    var raw = state.raw[key], map = state.maps[key];
    if (!raw) return [];
    var g = function (r, f) { return map[f] ? r[map[f]] : ""; };
    if (key === "comps") return raw.map(function (r) {
      return { date: toDay(g(r, "date")), store: String(g(r, "store")).trim(), dist: toNum(g(r, "dist")), size: normSize(g(r, "size")),
        climate: toClimate(g(r, "climate")), rate: toNum(g(r, "rate")), promo: String(g(r, "promo") || "").trim() };
    }).filter(function (r) { return r.date != null && r.store && r.rate != null && r.rate > 0 && r.dist != null; });
    if (key === "roll") return raw.map(function (r, i) {
      return { id: String(g(r, "id") || ("row " + (i + 2))).trim(), unit: String(g(r, "unit") || "").trim(), size: normSize(g(r, "size")),
        movein: toDay(g(r, "movein")), rent: toNum(g(r, "rent")), lastinc: toDay(g(r, "lastinc")), late: toNum(g(r, "late")) || 0 };
    }).filter(function (r) { return r.size && r.rent != null && r.rent > 0; });
    if (key === "moves") return raw.map(function (r) {
      return { week: toDay(g(r, "week")), size: map.size ? normSize(g(r, "size")) : "", mi: toNum(g(r, "mi")) || 0, mo: toNum(g(r, "mo")) || 0 };
    }).filter(function (r) { return r.week != null; });
    return [];
  }

  function sheetRows(wb, spec) {
    var best = null;
    wb.SheetNames.forEach(function (n) {
      var ws = wb.Sheets[n], aoa = XLSX.utils.sheet_to_json(ws, { header: 1, raw: true, defval: "" });
      if (!aoa.length) return;
      var headers = aoa[0].map(function (h) { return String(h).trim(); });
      var sc = mapScore(spec, headers);
      if (!best || sc > best.sc) best = { sc: sc, name: n, headers: headers, rows: XLSX.utils.sheet_to_json(ws, { raw: true, defval: "" }) };
    });
    return best;
  }

  function readBuffer(key, name, buf) {
    var spec = SPECS[key], wb;
    if (/\.(csv|txt)$/i.test(name)) wb = XLSX.read(new TextDecoder("utf-8").decode(buf), { type: "string", raw: true });
    else wb = XLSX.read(new Uint8Array(buf), { type: "array", cellDates: true });
    var b = sheetRows(wb, spec);
    if (!b) throw new Error(name + ": no rows found");
    state.raw[key] = b.rows; state.maps[key] = autoMap(spec, b.headers);
    state.files[key] = { name: name, sheet: wb.SheetNames.length > 1 ? b.name : "", headers: b.headers, n: b.rows.length };
    state[key] = parseDataset(key);
  }

  function csvObjects(text) {
    var wb = XLSX.read(text, { type: "string", raw: true });
    return XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { raw: true, defval: "" });
  }

  function loadSample() {
    var names = { comps: "comp_rates_stortrack.csv", roll: "rent_roll.csv", moves: "own_moves_weekly.csv" };
    var all = ["comp_rates_stortrack.csv", "rent_roll.csv", "own_moves_weekly.csv", "unit_mix.csv", "call_around.csv"];
    $("#loadline").textContent = "Loading the sample data…";
    return Promise.all(all.map(function (f) {
      return fetch(f, { cache: "no-cache" }).then(function (r) { if (!r.ok) throw new Error(f + " " + r.status); return r.arrayBuffer(); });
    })).then(function (bufs) {
      Object.keys(names).forEach(function (k, i) { readBuffer(k, names[k], bufs[i]); state.files[k].sample = true; });
      var dec = function (b) { return new TextDecoder("utf-8").decode(b); };
      state.mix = csvObjects(dec(bufs[3])).map(function (r) {
        return { size: normSize(r["Unit Size"]), sqft: toNum(r["Sq Ft"]), units: toNum(r["Units"]), street: toNum(r["Street Rate"]), climate: toClimate(r["Climate Controlled"]) };
      });
      state.calls = csvObjects(dec(bufs[4])).map(function (r) {
        return { store: r["Competitor"], dist: toNum(r["Distance (mi)"]), size: normSize(r["Unit Size"]), rate: toNum(r["Quoted Rate"]), date: isoDay(toDay(r["Date Called"])), note: r["Notes"] || "" };
      });
      state.sample = true;
      renderMix(); renderCalls(); renderMaps(); run();
    }).catch(showErr);
  }

  function showErr(e) { var el = $("#err"); el.hidden = false; el.textContent = String(e && e.message || e); document.body.dataset.ready = "1"; }

  // ---------- math ----------
  function pctInc(vals, p) {
    if (!vals.length) return null;
    var v = vals.slice().sort(function (a, b) { return a - b; }), h = (v.length - 1) * p, lo = Math.floor(h);
    return lo + 1 >= v.length ? v[lo] : v[lo] + (h - lo) * (v[lo + 1] - v[lo]);
  }
  var median = function (v) { return pctInc(v, 0.5); };
  var ringOf = function (m) { return m == null ? null : m <= 3 ? 0 : m <= 10 ? 1 : m <= 25 ? 2 : null; };
  function rateAt(list, d, stale) {
    var best = null;
    for (var i = 0; i < list.length; i++) { var o = list[i]; if (o.date <= d && o.date >= d - stale && (!best || o.date > best.date)) best = o; }
    return best;
  }

  // ---------- the model ----------
  function compute() {
    var comps = state.comps, roll = state.roll, mix = state.mix.filter(function (u) { return u.size && u.units > 0 && u.street > 0; });
    if (!comps.length) throw new Error("The competitor file has no usable rows (check the column match).");
    var asof = comps.reduce(function (m, r) { return Math.max(m, r.date); }, -Infinity);
    var month = monthOf(asof), W = [S.w0, S.w1, S.w2];

    // seasonality: average weekly move-ins by month / all-year average weekly move-ins
    var wk = {}, bySizeMonth = {}, yearsByMonth = {};
    state.moves.forEach(function (r) {
      wk[r.week] = (wk[r.week] || 0) + r.mi;
      var mo = monthOf(r.week), y = new Date(r.week * DAY).getUTCFullYear(), k = (r.size || "*") + "|" + mo;
      bySizeMonth[k] = (bySizeMonth[k] || 0) + r.mi;
      (yearsByMonth[mo] = yearsByMonth[mo] || {})[y] = 1;
    });
    var weeks = Object.keys(wk).map(Number), allAvg = weeks.length ? weeks.reduce(function (s, w) { return s + wk[w]; }, 0) / weeks.length : 0;
    var factors = [];
    for (var m = 0; m < 12; m++) {
      var ws = weeks.filter(function (w) { return monthOf(w) === m; });
      var avg = ws.length ? ws.reduce(function (s, w) { return s + wk[w]; }, 0) / ws.length : null;
      factors.push({ m: m, weeks: ws.length, avg: avg, raw: avg != null && allAvg > 0 ? avg / allAvg : null });
    }
    // a small facility has only a few move-ins a month, so by default each month is averaged 1-2-1 with its neighbours
    factors.forEach(function (x, i) {
      if (S.smooth !== "yes") { x.f = x.raw; return; }
      var sw = 0, sv = 0;
      [[(i + 11) % 12, 1], [i, 2], [(i + 1) % 12, 1]].forEach(function (q) { var v = factors[q[0]].raw; if (v != null) { sv += v * q[1]; sw += q[1]; } });
      x.f = sw ? sv / sw : null;
    });
    var fac = factors[month].f == null ? 1 : factors[month].f;
    var adj = Math.min(1 + S.seasCap / 100, Math.max(1 - S.seasCap / 100, 1 + S.seasW / 100 * (fac - 1)));
    var nYears = Object.keys(yearsByMonth[month] || {}).length || 1;
    var unitsTotal = mix.reduce(function (s, u) { return s + u.units; }, 0);

    // observations per competitor and size
    var obs = {}, dist = {}, climateSkipped = 0;
    var climateOf = {}; mix.forEach(function (u) { climateOf[u.size] = !!u.climate; });
    comps.forEach(function (r) {
      if (!(r.size in climateOf)) return;
      if (r.climate !== climateOf[r.size]) { climateSkipped++; return; }
      var k = r.store + "|" + r.size; (obs[k] = obs[k] || []).push(r); dist[r.store] = r.dist;
    });
    var stores = Object.keys(dist), occBy = {};
    roll.forEach(function (t) { occBy[t.size] = (occBy[t.size] || 0) + 1; });

    var recs = mix.map(function (u) {
      var occupied = occBy[u.size] || 0, occ = occupied / u.units;
      var tier = occ * 100 >= S.t1 ? { key: "high", label: S.t1 + "%+", p: S.p1 } : occ * 100 >= S.t2 ? { key: "mid", label: S.t2 + "-" + S.t1 + "%", p: S.p2 } : { key: "low", label: "under-" + S.t2 + "%", p: S.p3 };
      var used = [], have = {};
      stores.forEach(function (st) {
        var o = obs[st + "|" + u.size]; if (!o) return;
        var g = ringOf(dist[st]); if (g == null) return;
        var a = rateAt(o, asof, S.stale); if (!a) return;
        used.push({ store: st, dist: dist[st], ring: g, rate: a.rate, src: "web", date: a.date, promo: a.promo }); have[norm(st)] = 1;
      });
      var oldCalls = 0;
      state.calls.forEach(function (c) {
        if (normSize(c.size) !== u.size || toNum(c.rate) == null || have[norm(c.store)]) return;
        var d = toDay(c.date), g = ringOf(toNum(c.dist)); if (d == null || g == null) return;
        if (asof - d > S.callAge) { oldCalls++; return; }
        used.push({ store: c.store, dist: toNum(c.dist), ring: g, rate: toNum(c.rate), src: "call", date: d, promo: c.note || "" });
      });
      used.sort(function (a, b) { return a.dist - b.dist; });
      var expanded = [];
      used.forEach(function (c) { for (var i = 0; i < Math.max(0, Math.round(W[c.ring])); i++) expanded.push(c.rate); });
      var target = pctInc(expanded, tier.p / 100);

      // trend of close comps over the hold window (same competitors then and now)
      var trend = null, trendRing = null, trendN = 0;
      for (var mr = 0; mr <= 1 && trend == null; mr++) {
        var now = [], past = [];
        stores.forEach(function (st) {
          var o = obs[st + "|" + u.size], g = ringOf(dist[st]); if (!o || g == null || g > mr) return;
          var a = rateAt(o, asof, S.stale), b = rateAt(o, asof - 7 * S.holdWeeks, S.stale);
          if (a && b) { now.push(a.rate); past.push(b.rate); }
        });
        if (now.length) { trend = median(now) / median(past) - 1; trendRing = mr; trendN = now.length; }
      }
      var rings = [0, 1, 2].map(function (g) {
        var inR = used.filter(function (c) { return c.ring === g; }), v = inR.map(function (c) { return c.rate; });
        var now = [], past = [];
        stores.forEach(function (st) {
          var o = obs[st + "|" + u.size]; if (!o || ringOf(dist[st]) !== g) return;
          var a = rateAt(o, asof, S.stale), b = rateAt(o, asof - 7 * S.holdWeeks, S.stale);
          if (a && b) { now.push(a.rate); past.push(b.rate); }
        });
        var md = median(v);
        return { ring: g, n: inR.length, nCall: inR.filter(function (c) { return c.src === "call"; }).length, p25: pctInc(v, .25), med: md, p75: pctInc(v, .75),
          chg: now.length ? median(now) / median(past) - 1 : null, pos: md ? u.street / md - 1 : null };
      });

      var cur = u.street, cand = target == null ? null : target * adj, nw = cur, action;
      if (target == null) action = "none";
      else if (trend != null && trend < -S.hold / 100) action = "hold";
      else if (Math.abs(cand - cur) / cur < S.band / 100) action = "band";
      else {
        nw = Math.round(cand); action = nw > cur ? "up" : "down";
        if (nw > cur * (1 + S.cap / 100)) { nw = Math.floor(cur * (1 + S.cap / 100) + 1e-9); action = "capup"; }
        if (nw < cur * (1 - S.cap / 100)) { nw = Math.ceil(cur * (1 - S.cap / 100) - 1e-9); action = "capdown"; }
        if (nw === cur) action = "band";
      }
      var key = u.size + "|" + month, expMi = bySizeMonth[key] != null ? bySizeMonth[key] / nYears
        : bySizeMonth["*|" + month] != null ? bySizeMonth["*|" + month] / nYears * u.units / unitsTotal : 0;
      var r = { size: u.size, sqft: u.sqft, units: u.units, occupied: occupied, occ: occ, tier: tier, used: used, nComps: used.length,
        nCall: used.filter(function (c) { return c.src === "call"; }).length, oldCalls: oldCalls, target: target, factor: fac, adj: adj, cand: cand,
        trend: trend, trendRing: trendRing, trendN: trendN, rings: rings, cur: cur, nw: nw, chg: nw / cur - 1, action: action, expMi: expMi };
      r.why = whyText(r, month);
      return r;
    });

    // ECRI
    var recBy = {}; recs.forEach(function (r) { recBy[r.size] = r; });
    var ecri = roll.map(function (t) {
      var r = recBy[t.size], e = { t: t, street: r ? (S.base === "cur" ? r.cur : r.nw) : null, ten: t.movein == null ? null : (asof - t.movein) / 30.4375,
        since: t.lastinc == null ? null : (asof - t.lastinc) / 30.4375, ok: false, reason: "", inc: 0, newRent: t.rent };
      e.gap = e.street ? (e.street - t.rent) / t.rent : null;
      if (!r) e.reason = "unit size not in unit mix";
      else if (t.late > S.maxLate) e.reason = "over " + S.maxLate + " days late";
      else if (e.ten == null) e.reason = "no move-in date";
      else if (e.ten < S.minTen) e.reason = "tenure under " + S.minTen + " months";
      else if (e.since != null && e.since < S.minSince) e.reason = "increased in the last " + S.minSince + " months";
      else if (t.rent >= e.street) e.reason = "at or above street rate";
      else if (e.gap < S.minGap / 100) e.reason = "gap to street under " + S.minGap + "%";
      else {
        var pct = Math.min(S.share / 100 * e.gap, S.maxInc / 100);
        e.newRent = Math.min(e.street, Math.max(t.rent + 1, Math.round(t.rent * (1 + pct))));
        e.inc = e.newRent / t.rent - 1; e.ok = true;
      }
      return e;
    });
    var elig = ecri.filter(function (e) { return e.ok; }), reasons = {};
    ecri.forEach(function (e) { if (!e.ok) reasons[e.reason] = (reasons[e.reason] || 0) + 1; });
    var before = roll.reduce(function (s, t) { return s + t.rent; }, 0);
    var gain = elig.reduce(function (s, e) { return s + e.newRent - e.t.rent; }, 0);
    var lost = S.attr / 100 * elig.reduce(function (s, e) { return s + e.newRent; }, 0);
    var sqft = mix.reduce(function (s, u) { return s + (u.sqft || 0) * u.units; }, 0);
    var occNow = roll.filter(function (t) { return recBy[t.size]; }).length, occAfter = occNow - S.attr / 100 * elig.length;
    var potBefore = mix.reduce(function (s, u) { return s + u.units * u.street; }, 0), potAfter = recs.reduce(function (s, r) { return s + r.units * r.nw; }, 0);
    var after = before + gain - lost;
    var streetEffect = recs.reduce(function (s, r) { return s + r.expMi * (r.nw - r.cur); }, 0), expMi = recs.reduce(function (s, r) { return s + r.expMi; }, 0);
    var summary = { before: before, after: after, gain: gain, lost: lost, sqft: sqft, units: unitsTotal, occNow: occNow, occAfter: occAfter,
      potBefore: potBefore, potAfter: potAfter, streetEffect: streetEffect, expMi: expMi, avgInc: elig.length ? elig.reduce(function (s, e) { return s + e.inc; }, 0) / elig.length : 0 };
    return { asof: asof, month: month, factors: factors, fac: fac, adj: adj, recs: recs, ecri: ecri, elig: elig.length, reasons: reasons,
      summary: summary, climateSkipped: climateSkipped, nComps: comps.length, nStores: stores.length };
  }

  // ---------- plain-English reasons ----------
  var $0 = function (v) { return v == null ? "-" : "$" + Math.round(v).toLocaleString("en-US"); };
  var $2 = function (v) { return v == null ? "-" : "$" + v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); };
  var p1 = function (v) { return v == null ? "-" : (Math.abs(v) * 100).toFixed(1) + "%"; };
  var p1s = function (v) { return v == null ? "-" : (v > 0 ? "+" : v < 0 ? "−" : "") + (Math.abs(v) * 100).toFixed(1) + "%"; };
  var p0 = function (v) { return Math.round(v * 100) + "%"; };
  var ord = function (n) { var s = ["th", "st", "nd", "rd"], v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); };

  function whyText(r, month) {
    var t = [];
    t.push(p0(r.occ) + " occupied (" + r.occupied + " of " + r.units + "), so the " + r.tier.label + " tier aims at the " + ord(r.tier.p) + " percentile of local comps.");
    if (r.target == null) { t.push("No comp rate was found for this size within 25 miles, so the rate stays where it is."); return t.join(" "); }
    t.push("Across " + r.nComps + " comps" + (r.nCall ? " (" + r.nCall + " from a call-around)" : "") + ", with 0-3 mile rates counted " + S.w0 + "x and 3-10 mile " + S.w1 + "x, that is " + $2(r.target) + ".");
    if (Math.abs(r.adj - 1) >= 0.0005) t.push(MONTHS[month] + " move-ins" + (S.smooth === "yes" ? " (averaged with the months either side)" : "") + " run at " + r.factor.toFixed(2) + "x your weekly average, so the target is " + (r.adj < 1 ? "trimmed " : "raised ") + p1(r.adj - 1) + " to " + $2(r.cand) + ".");
    var where = r.trendRing === 1 ? "Comps within 10 miles (none within 3 report both weeks)" : "Close comps (0-3 mi)";
    if (r.action === "hold") t.push(where + " cut this size " + p1(r.trend) + " over the last " + S.holdWeeks + " weeks, more than the " + S.hold + "% hold limit, so the rate holds at " + $0(r.cur) + (r.cand < r.cur ? " instead of following them down." : " until they settle."));
    else if (r.action === "band") t.push("That is within " + S.band + "% of today's " + $0(r.cur) + ", so no change this week.");
    else if (r.action === "capup") t.push("That is " + p1s(r.cand / r.cur - 1) + " on today's " + $0(r.cur) + ", more than the " + S.cap + "% weekly limit, so the rate goes to " + $0(r.nw) + " this week and the rest can follow next week.");
    else if (r.action === "capdown") t.push("That is " + p1s(r.cand / r.cur - 1) + " on today's " + $0(r.cur) + ", more than the " + S.cap + "% weekly limit, so the cut stops at " + $0(r.nw) + " this week.");
    else if (r.action === "up") t.push("That is a " + p1(r.chg) + " increase, from " + $0(r.cur) + " to " + $0(r.nw) + ".");
    else if (r.action === "down") t.push("That is a " + p1(r.chg) + " cut, from " + $0(r.cur) + " to " + $0(r.nw) + ", inside the " + S.cap + "% weekly limit.");
    if (r.tier.key === "low" && r.action !== "hold") t.push("Occupancy is under " + S.t2 + "%, so a move-in promotion is worth testing too.");
    return t.join(" ");
  }

  // ---------- rendering ----------
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var TAGS = { up: "Raise", down: "Cut", capup: "Raise, capped", capdown: "Cut, capped", hold: "Hold", band: "No change", none: "No comps" };

  function render(res) {
    var s = res.summary;
    $("#asof").textContent = "Week of " + isoDay(res.asof) + " (newest date in the competitor file). " + res.nStores + " competitors posting web rates, " +
      res.nComps.toLocaleString("en-US") + " comp rows" + (res.climateSkipped ? ", " + res.climateSkipped.toLocaleString("en-US") + " climate-controlled rows left out (your units are non-climate)" : "") + ".";
    $("#recs").innerHTML = res.recs.map(function (r) {
      var cls = r.chg > 0 ? "pos" : r.chg < 0 ? "neg" : "";
      return '<article class="card rec" data-size="' + esc(r.size) + '"><header><h3>' + esc(r.size) + " <small>" + (r.sqft || "?") + " sq ft &middot; " + r.units + ' units</small></h3><span class="tag t-' + r.action + '">' + TAGS[r.action] + "</span></header>" +
        '<div class="rate">' + (r.nw !== r.cur ? '<span class="old">' + $0(r.cur) + "</span> &rarr; " : "") + '<b class="new">' + $0(r.nw) + '</b><span class="chg ' + cls + '">' + (r.nw !== r.cur ? p1s(r.chg) : "unchanged") + "</span></div>" +
        '<dl class="facts"><dt>Occupancy</dt><dd>' + p0(r.occ) + " (" + r.occupied + "/" + r.units + ")</dd><dt>Tier, target</dt><dd>" + esc(r.tier.label) + ", P" + r.tier.p + "</dd>" +
        "<dt>Comp target</dt><dd>" + $2(r.target) + "</dd><dt>After season</dt><dd>" + $2(r.cand) + "</dd><dt>Close comps, " + S.holdWeeks + " wk</dt><dd>" + (r.trend == null ? "no data" : p1s(r.trend)) + "</dd></dl>" +
        '<p class="why"><b>Why:</b> ' + esc(r.why) + "</p></article>";
    }).join("");

    // market index
    var h = '<thead><tr><th>Unit</th><th>Ring</th><th class="n">Comps</th><th class="n">P25</th><th class="n">Median</th><th class="n">P75</th><th class="n">Median, ' + S.holdWeeks + ' wk</th><th class="n">Your rate vs median</th></tr></thead><tbody>';
    res.recs.forEach(function (r) {
      r.rings.forEach(function (g, i) {
        h += "<tr>" + (i === 0 ? '<td rowspan="3"><b>' + esc(r.size) + "</b><br><span class=\"note\">" + $0(r.cur) + " today</span></td>" : "") + "<td>" + RINGS[g.ring] + '</td><td class="n">' + g.n +
          (g.nCall ? ' <span class="call">' + g.nCall + " call</span>" : "") + '</td><td class="n">' + $2(g.p25) + '</td><td class="n">' + $2(g.med) + '</td><td class="n">' + $2(g.p75) +
          '</td><td class="n">' + (g.chg == null ? "-" : p1s(g.chg)) + '</td><td class="n">' + (g.pos == null ? "-" : p1s(g.pos)) + "</td></tr>";
      });
    });
    $("#ringtab").innerHTML = h + "</tbody>";
    var c = '<thead><tr><th>Unit</th><th>Competitor</th><th class="n">Miles</th><th>Ring</th><th class="n">Rate</th><th>Source</th><th>Date</th><th>Promotion / note</th></tr></thead><tbody>';
    res.recs.forEach(function (r) {
      r.used.forEach(function (u) {
        c += "<tr><td>" + esc(r.size) + "</td><td>" + esc(u.store) + '</td><td class="n">' + u.dist + "</td><td>" + RINGS[u.ring] + '</td><td class="n">' + $2(u.rate) + "</td><td>" +
          (u.src === "call" ? '<span class="call">call-around</span>' : "web") + "</td><td>" + isoDay(u.date) + "</td><td>" + esc(u.promo) + "</td></tr>";
      });
      if (r.oldCalls) c += '<tr><td>' + esc(r.size) + '</td><td colspan="7" class="note">' + r.oldCalls + " call-around price(s) older than " + S.callAge + " days not used</td></tr>";
    });
    $("#comptab").innerHTML = c + "</tbody>";

    renderSeason(res);

    // ECRI
    var tiles = [["", "All tenants", res.ecri.length], ["eligible", "Eligible", res.elig]];
    Object.keys(res.reasons).sort(function (a, b) { return res.reasons[b] - res.reasons[a]; }).forEach(function (k) { tiles.push([k, "Skip: " + k, res.reasons[k]]); });
    $("#etiles").innerHTML = tiles.map(function (t) { return '<button type="button" class="tile' + (filter === t[0] ? " on" : "") + '" data-f="' + esc(t[0]) + '">' + esc(t[1]) + "<b>" + t[2] + "</b></button>"; }).join("");
    $("#eline").textContent = res.elig + " of " + res.ecri.length + " tenants eligible; average increase " + p1(s.avgInc) + ", +" + $0(s.gain) + " a month before move-outs. Compared with the " +
      (S.base === "cur" ? "current" : "recommended") + " street rate of each size. Click a tile to filter.";
    renderEcri(res);

    // summary
    var row = function (lab, b, a, f, d) { return "<tr><td>" + lab + '</td><td class="n">' + f(b) + '</td><td class="n">' + f(a) + '</td><td class="n">' + (d || "") + "</td></tr>"; };
    var rpB = s.before / s.sqft, rpA = s.after / s.sqft;
    $("#sum").innerHTML = '<thead><tr><th>Monthly, existing tenants</th><th class="n">Before</th><th class="n">After</th><th class="n">Change</th></tr></thead><tbody>' +
      row("Rent from the rent roll", s.before, s.after, $0, (s.after >= s.before ? "+" : "−") + $0(Math.abs(s.after - s.before)) + " (" + p1s(s.after / s.before - 1) + ")") +
      row("Occupied units", s.occNow, s.occAfter, function (v) { return v.toFixed(v % 1 ? 1 : 0); }, (s.occAfter - s.occNow).toFixed(1)) +
      row("Physical occupancy", s.occNow / s.units, s.occAfter / s.units, p1, p1s(s.occAfter / s.units - s.occNow / s.units).replace("%", " pts")) +
      row("Economic occupancy (rent / units x street)", s.before / s.potBefore, s.after / s.potAfter, p1, "") +
      row("RevPAF ($ per available sq ft per month)", rpB, rpA, function (v) { return "$" + v.toFixed(3); }, p1s(rpA / rpB - 1)) +
      "</tbody>";
    $("#assume").textContent = "Assumptions: " + s.sqft.toLocaleString("en-US") + " rentable sq ft, " + s.units + " units. After = the same tenants with the ECRI increases, minus " + S.attr +
      "% of increase letters moving out (that rent is lost). Street-rate changes reach only new move-ins: about " + s.expMi.toFixed(1) + " move-ins expected in " + MONTHS[res.month] +
      " (average of the same month in your history) at the new rates is " + (s.streetEffect >= 0 ? "+" : "−") + $0(Math.abs(s.streetEffect)) + " a month, not included above. No price elasticity is applied: the model does not predict how many more or fewer people rent at the new rates.";
    document.body.dataset.ready = "1";
  }

  var filter = "";
  function renderEcri(res) {
    var rows = res.ecri.filter(function (e) { return !filter || (filter === "eligible" ? e.ok : e.reason === filter); });
    var h = '<thead><tr><th>Tenant</th><th>Unit</th><th>Size</th><th>Move-in</th><th class="n">Tenure (mo)</th><th>Last increase</th><th class="n">Days late</th><th class="n">Rent</th><th class="n">Street</th><th class="n">Gap</th><th>Decision</th><th class="n">Increase</th><th class="n">New rent</th></tr></thead><tbody>';
    rows.forEach(function (e) {
      var t = e.t;
      h += "<tr><td>" + esc(t.id) + "</td><td>" + esc(t.unit) + "</td><td>" + esc(t.size) + "</td><td>" + isoDay(t.movein) + '</td><td class="n">' + (e.ten == null ? "-" : e.ten.toFixed(1)) + "</td><td>" + (isoDay(t.lastinc) || "never") +
        '</td><td class="n">' + t.late + '</td><td class="n">' + $2(t.rent) + '</td><td class="n">' + $0(e.street) + '</td><td class="n">' + (e.gap == null ? "-" : p1s(e.gap)) + "</td><td>" +
        (e.ok ? '<span class="ok">Eligible</span>' : '<span class="skip">Skip: ' + esc(e.reason) + "</span>") + '</td><td class="n">' + (e.ok ? p1s(e.inc) : "") + '</td><td class="n">' + (e.ok ? $2(e.newRent) : "") + "</td></tr>";
    });
    $("#ecri").innerHTML = h + "</tbody>";
  }

  function renderSeason(res) {
    var f = res.factors, max = Math.max(1.2, Math.max.apply(null, f.map(function (x) { return x.f || 0; }))) * 1.08;
    var Wd = 720, Ht = 200, L = 34, B = 26, T = 16, bw = (Wd - L - 8) / 12, y = function (v) { return T + (Ht - T - B) * (1 - v / max); };
    var s = '<svg viewBox="0 0 ' + Wd + " " + Ht + '" role="img" aria-label="Move-in seasonality factor by month">';
    [0, 0.5, 1, 1.5].forEach(function (v) { if (v <= max) s += '<text class="lbl" x="' + (L - 6) + '" y="' + (y(v) + 4) + '" text-anchor="end">' + v.toFixed(1) + "</text>"; });
    s += '<line class="axis" x1="' + L + '" x2="' + Wd + '" y1="' + y(0) + '" y2="' + y(0) + '"/>';
    f.forEach(function (x, i) {
      var v = x.f || 0, bx = L + i * bw + 3, h = y(0) - y(v), on = i === res.month;
      var tip = MONTHS[i] + ": " + (x.f == null ? "no data" : x.f.toFixed(2) + (S.smooth === "yes" ? " smoothed, " + x.raw.toFixed(2) + " raw" : "") + " (" + x.avg.toFixed(2) + " move-ins a week over " + x.weeks + " weeks)");
      s += '<g data-tip="' + esc(tip) + '"><rect class="hit" x="' + (L + i * bw) + '" y="' + T + '" width="' + bw + '" height="' + (Ht - T) + '"/>' +
        '<path class="b' + (on ? " on" : "") + '" d="M' + bx + "," + y(0) + "v" + (-Math.max(0, h - 4)) + "q0,-4 4,-4h" + (bw - 14) + "q4,0 4,4v" + Math.max(0, h - 4) + 'z"/>' +
        '<text class="lbl" x="' + (bx + (bw - 6) / 2) + '" y="' + (Ht - 8) + '" text-anchor="middle">' + MONTHS[i].slice(0, 3) + "</text>" +
        (on ? '<text class="val" x="' + (bx + (bw - 6) / 2) + '" y="' + (y(v) - 6) + '" text-anchor="middle">' + v.toFixed(2) + "</text>" : "") + "</g>";
    });
    s += '<line class="ref" x1="' + L + '" x2="' + Wd + '" y1="' + y(1) + '" y2="' + y(1) + '"/></svg>';
    $("#season").innerHTML = s;
    $("#seasnote").textContent = "Average weekly move-ins in each month divided by the all-year average (1.0 = an average month, dashed line)" + (S.smooth === "yes" ? ", averaged 1-2-1 with the months either side" : "") + ". Pricing month " + MONTHS[res.month] + ": factor " +
      res.fac.toFixed(2) + ", so the comp target moves " + p1s(res.adj - 1) + " (" + S.seasW + "% of the swing, capped at " + S.seasCap + "%).";
    $("#seastab").innerHTML = '<thead><tr><th>Month</th><th class="n">Weeks</th><th class="n">Move-ins a week</th><th class="n">Raw factor</th><th class="n">Factor used</th></tr></thead><tbody>' + f.map(function (x) {
      return "<tr><td>" + MONTHS[x.m] + '</td><td class="n">' + x.weeks + '</td><td class="n">' + (x.avg == null ? "-" : x.avg.toFixed(2)) + '</td><td class="n">' + (x.raw == null ? "-" : x.raw.toFixed(2)) + '</td><td class="n">' + (x.f == null ? "-" : x.f.toFixed(2)) + "</td></tr>";
    }).join("") + "</tbody>";
  }

  function renderRules() {
    var h = "";
    RULES.forEach(function (g) {
      h += "<fieldset><legend>" + g[0] + "</legend>";
      g[1].forEach(function (f) {
        var k = f[0], wide = f[2] === "wide" ? ' class="wide"' : "";
        if (f[3]) h += "<label" + wide + ' data-k="' + k + '">' + f[1] + ' <span class="d">default: ' + f[3].filter(function (o) { return o[0] === DEF[k]; })[0][1] + '</span><select id="s-' + k + '">' +
          f[3].map(function (o) { return '<option value="' + o[0] + '"' + (S[k] === o[0] ? " selected" : "") + ">" + o[1] + "</option>"; }).join("") + "</select></label>";
        else h += "<label" + wide + ' data-k="' + k + '">' + f[1] + ' <span class="d">default: ' + DEF[k] + '</span><input type="number" step="any" id="s-' + k + '" value="' + S[k] + '"></label>';
      });
      h += "</fieldset>";
    });
    $("#rules").innerHTML = h;
  }
  function markChanged() {
    var n = 0;
    Object.keys(DEF).forEach(function (k) { var l = document.querySelector('label[data-k="' + k + '"]'); var ch = S[k] !== DEF[k]; if (l) l.classList.toggle("changed", ch); if (ch) n++; });
    $("#changed").textContent = n ? n + " rule" + (n > 1 ? "s" : "") + " changed from the default (outlined)." : "All rules at their defaults.";
  }

  function renderMaps() {
    var h = "";
    Object.keys(SPECS).forEach(function (k) {
      var f = state.files[k], spec = SPECS[k]; if (!f) return;
      var m = state.maps[k], ok = spec.fields.filter(function (x) { return m[x[0]]; }).length, miss = spec.fields.filter(function (x) { return x[2] && !m[x[0]]; });
      h += '<details class="map"' + (miss.length || !f.sample ? " open" : "") + ' data-k="' + k + '"><summary>' + spec.label + ": columns read from " + esc(f.name) + (f.sheet ? " (sheet " + esc(f.sheet) + ")" : "") +
        ", " + ok + " of " + spec.fields.length + " matched" + (miss.length ? ' <span class="neg">(missing: ' + miss.map(function (x) { return x[1]; }).join(", ") + ")</span>" : "") + '</summary><div class="mapgrid">';
      spec.fields.forEach(function (x) {
        h += "<label>" + x[1] + (x[2] ? "" : " (optional)") + '<select data-k="' + k + '" data-f="' + x[0] + '"><option value="">(none)</option>' +
          f.headers.map(function (hd) { return "<option" + (hd === m[x[0]] ? " selected" : "") + ">" + esc(hd) + "</option>"; }).join("") + "</select></label>";
      });
      h += "</div></details>";
      var z = $(spec.zone); z.querySelector(".fn").textContent = f.name + (f.sample ? " (sample)" : "") + " · " + state[k].length.toLocaleString("en-US") + " rows read";
    });
    $("#maps").innerHTML = h;
  }

  function renderMix() {
    var h = '<thead><tr><th>Unit size</th><th class="n">Sq ft</th><th class="n">Units</th><th class="n">Street rate today ($)</th><th>Climate</th><th></th></tr></thead><tbody>';
    state.mix.forEach(function (u, i) {
      h += '<tr data-i="' + i + '"><td><input type="text" data-m="size" value="' + esc(u.size) + '" aria-label="Unit size"></td><td><input type="number" data-m="sqft" value="' + (u.sqft == null ? "" : u.sqft) + '" aria-label="Square feet"></td>' +
        '<td><input type="number" data-m="units" value="' + (u.units == null ? "" : u.units) + '" aria-label="Units"></td><td><input type="number" step="any" data-m="street" value="' + (u.street == null ? "" : u.street) + '" aria-label="Street rate"></td>' +
        '<td><select data-m="climate" aria-label="Climate controlled"><option value="0"' + (u.climate ? "" : " selected") + '>No</option><option value="1"' + (u.climate ? " selected" : "") + '>Yes</option></select></td>' +
        '<td><button type="button" class="btn ghost sm" data-del="mix" aria-label="Remove">Remove</button></td></tr>';
    });
    $("#mixtab").innerHTML = h + "</tbody>";
  }
  function renderCalls() {
    var h = '<thead><tr><th>Competitor</th><th class="n">Miles</th><th>Unit size</th><th class="n">Quoted rate ($)</th><th>Date called</th><th>Note</th><th></th></tr></thead><tbody>';
    state.calls.forEach(function (c, i) {
      h += '<tr data-i="' + i + '"><td><input type="text" data-c="store" value="' + esc(c.store) + '" aria-label="Competitor"></td><td><input type="number" step="any" data-c="dist" value="' + (c.dist == null ? "" : c.dist) + '" aria-label="Miles"></td>' +
        '<td><input type="text" data-c="size" value="' + esc(c.size) + '" aria-label="Unit size"></td><td><input type="number" step="any" data-c="rate" value="' + (c.rate == null ? "" : c.rate) + '" aria-label="Quoted rate"></td>' +
        '<td><input type="date" data-c="date" value="' + esc(c.date) + '" aria-label="Date called"></td><td><input type="text" data-c="note" value="' + esc(c.note) + '" aria-label="Note"></td>' +
        '<td><button type="button" class="btn ghost sm" data-del="call" aria-label="Remove">Remove</button></td></tr>';
    });
    $("#calltab").innerHTML = h + "</tbody>";
  }

  // ---------- run ----------
  var timer = null;
  function run() {
    try { $("#err").hidden = true; state.result = compute(); window.storageRM.result = state.result; render(state.result); markChanged(); }
    catch (e) { showErr(e); }
    var f = state.files;
    $("#loadline").textContent = state.sample && Object.keys(f).every(function (k) { return f[k].sample; }) ? "Showing the sample data." : "Showing your files where loaded; the rest is sample data.";
  }
  function later() { document.body.dataset.ready = "0"; clearTimeout(timer); timer = setTimeout(run, 120); }

  function exportXlsx() {
    var r = state.result; if (!r) return;
    var wb = XLSX.utils.book_new(), add = function (name, aoa) { XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(aoa), name); };
    var r2 = function (v) { return v == null ? "" : Math.round(v * 100) / 100; }, r4 = function (v) { return v == null ? "" : Math.round(v * 10000) / 10000; };
    add("Street rates", [["Week of", isoDay(r.asof)], ["Sample data, fictional, unless you loaded your own files"], [],
      ["Unit size", "Units", "Occupied", "Occupancy", "Tier", "Target percentile", "Comps used", "Call-around comps", "Comp target", "Seasonal factor", "Seasonal adjustment", "After season", "Close comps change", "Current rate", "Recommended rate", "Change", "Action", "Why"]]
      .concat(r.recs.map(function (x) { return [x.size, x.units, x.occupied, r4(x.occ), x.tier.label, x.tier.p, x.nComps, x.nCall, r2(x.target), r4(x.factor), r4(x.adj), r2(x.cand), x.trend == null ? "" : r4(x.trend), x.cur, x.nw, r4(x.chg), TAGS[x.action], x.why]; })));
    var mi = [["Unit size", "Ring", "Comps", "Call-around", "P25", "Median", "P75", "Median change over hold window", "Your rate vs median"]];
    r.recs.forEach(function (x) { x.rings.forEach(function (g) { mi.push([x.size, RINGS[g.ring], g.n, g.nCall, r2(g.p25), r2(g.med), r2(g.p75), g.chg == null ? "" : r4(g.chg), g.pos == null ? "" : r4(g.pos)]); }); });
    mi.push([]); mi.push(["Unit size", "Competitor", "Miles", "Ring", "Rate", "Source", "Date", "Promotion / note"]);
    r.recs.forEach(function (x) { x.used.forEach(function (u) { mi.push([x.size, u.store, u.dist, RINGS[u.ring], u.rate, u.src === "call" ? "call-around" : "web", isoDay(u.date), u.promo]); }); });
    add("Market index", mi);
    add("ECRI", [["Tenant", "Unit", "Size", "Move-in", "Tenure (months)", "Last increase", "Days late", "Rent", "Street", "Gap", "Decision", "Skip reason", "Increase", "New rent", "Monthly gain"]]
      .concat(r.ecri.map(function (e) { var t = e.t; return [t.id, t.unit, t.size, isoDay(t.movein), e.ten == null ? "" : Math.round(e.ten * 10) / 10, isoDay(t.lastinc), t.late, t.rent, e.street == null ? "" : e.street, e.gap == null ? "" : r4(e.gap), e.ok ? "Eligible" : "Skip", e.reason, e.ok ? r4(e.inc) : "", e.ok ? e.newRent : "", e.ok ? r2(e.newRent - t.rent) : ""]; })));
    var s = r.summary;
    add("Summary", [["Monthly, existing tenants", "Before", "After"], ["Rent from the rent roll", r2(s.before), r2(s.after)], ["Occupied units", s.occNow, Math.round(s.occAfter * 10) / 10],
      ["Physical occupancy", r4(s.occNow / s.units), r4(s.occAfter / s.units)], ["Economic occupancy", r4(s.before / s.potBefore), r4(s.after / s.potAfter)], ["RevPAF per month", r4(s.before / s.sqft), r4(s.after / s.sqft)],
      [], ["ECRI eligible", r.elig], ["ECRI monthly gain before move-outs", r2(s.gain)], ["Rent lost to assumed ECRI move-outs", r2(s.lost)], ["Expected move-ins this month", Math.round(s.expMi * 10) / 10], ["New move-in effect of street changes (not in After)", r2(s.streetEffect)]]);
    var rules = [["Rule", "Value", "Default"]];
    RULES.forEach(function (g) { g[1].forEach(function (f) { rules.push([g[0] + ": " + f[1], S[f[0]], DEF[f[0]]]); }); });
    add("Rules", rules);
    XLSX.writeFile(wb, "storage-rm-" + isoDay(r.asof) + ".xlsx");
  }

  // ---------- events ----------
  function bindZone(key) {
    var z = $(SPECS[key].zone), inp = z.querySelector("input");
    var take = function (file) {
      if (!file) return;
      document.body.dataset.ready = "0";
      file.arrayBuffer().then(function (buf) { readBuffer(key, file.name, buf); state.sample = false; renderMaps(); run(); }).catch(showErr);
    };
    inp.addEventListener("change", function () { take(inp.files[0]); inp.value = ""; });
    z.addEventListener("dragover", function (e) { e.preventDefault(); z.classList.add("over"); });
    z.addEventListener("dragleave", function () { z.classList.remove("over"); });
    z.addEventListener("drop", function (e) { e.preventDefault(); z.classList.remove("over"); take(e.dataTransfer.files[0]); });
  }

  function init() {
    if (!window.XLSX) { showErr("The spreadsheet reader did not load."); return; }
    renderRules();
    Object.keys(SPECS).forEach(bindZone);
    $("#rules").addEventListener("input", function (e) {
      var k = e.target.id.replace(/^s-/, ""); if (!(k in DEF)) return;
      if (typeof DEF[k] === "string") S[k] = e.target.value;
      else { var v = parseFloat(e.target.value); if (!isFinite(v)) return; S[k] = v; }
      later();
    });
    $("#reset").addEventListener("click", function () { Object.assign(S, DEF); renderRules(); run(); });
    $("#maps").addEventListener("change", function (e) {
      var sel = e.target; if (!sel.dataset.f) return;
      state.maps[sel.dataset.k][sel.dataset.f] = sel.value; state[sel.dataset.k] = parseDataset(sel.dataset.k); renderMaps(); run();
    });
    $("#mixtab").addEventListener("input", function (e) {
      var tr = e.target.closest("tr"), m = e.target.dataset.m; if (!tr || !m) return;
      var u = state.mix[+tr.dataset.i]; u[m] = m === "size" ? normSize(e.target.value) : m === "climate" ? e.target.value === "1" : toNum(e.target.value); later();
    });
    $("#calltab").addEventListener("input", function (e) {
      var tr = e.target.closest("tr"), k = e.target.dataset.c; if (!tr || !k) return;
      var c = state.calls[+tr.dataset.i]; c[k] = k === "dist" || k === "rate" ? toNum(e.target.value) : e.target.value; later();
    });
    document.addEventListener("click", function (e) {
      var d = e.target.closest("[data-del]");
      if (d) { var i = +d.closest("tr").dataset.i; if (d.dataset.del === "mix") { state.mix.splice(i, 1); renderMix(); } else { state.calls.splice(i, 1); renderCalls(); } run(); return; }
      var t = e.target.closest(".tile[data-f]");
      if (t) { filter = filter === t.dataset.f ? "" : t.dataset.f; document.querySelectorAll(".tile").forEach(function (b) { b.classList.toggle("on", b.dataset.f === filter && filter !== ""); }); renderEcri(state.result); }
    });
    $("#addmix").addEventListener("click", function () { state.mix.push({ size: "10x15", sqft: 150, units: 0, street: null, climate: false }); renderMix(); });
    $("#addcall").addEventListener("click", function () { state.calls.push({ store: "", dist: null, size: "", rate: null, date: state.result ? isoDay(state.result.asof) : "", note: "" }); renderCalls(); });
    $("#sample").addEventListener("click", function () { document.body.dataset.ready = "0"; Object.assign(S, DEF); renderRules(); loadSample(); });
    $("#xlsx").addEventListener("click", exportXlsx);
    var tip = $("#tip");
    $("#season").addEventListener("mousemove", function (e) {
      var g = e.target.closest("[data-tip]"); if (!g) { tip.hidden = true; return; }
      tip.textContent = g.dataset.tip; tip.hidden = false;
      tip.style.left = Math.min(e.clientX + 12, window.innerWidth - tip.offsetWidth - 8) + "px"; tip.style.top = (e.clientY + 14) + "px";
    });
    $("#season").addEventListener("mouseleave", function () { tip.hidden = true; });
    loadSample();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
