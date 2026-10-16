/* Operations workbook demo page. Every section is drawn from window.OPS_DATA (data.js); the HTML holds no data.
   The page computes only: the reconciliation and test-case sums, group counts, date comparisons, sorting and the
   timeline filters. Everything else (stock, alerts, exceptions, test-case results) comes from the workbook export. */
(function () {
  "use strict";

  var doc = document;
  var D = window.OPS_DATA;
  var $ = function (id) { return doc.getElementById(id); };
  var SVGNS = "http://www.w3.org/2000/svg";

  if (!D || typeof D !== "object" || !D.meta) {
    var le = $("load-error");
    if (le) { le.hidden = false; le.textContent = "The sample data file (data.js) did not load, so the sections below are empty."; }
    return;
  }

  /* ---------- helpers ---------- */
  function append(el, kids) {
    if (kids == null || kids === false) return el;
    if (!Array.isArray(kids)) kids = [kids];
    for (var i = 0; i < kids.length; i++) {
      var c = kids[i];
      if (c == null || c === false) continue;
      if (Array.isArray(c)) append(el, c);
      else el.appendChild(typeof c === "object" ? c : doc.createTextNode(String(c)));
    }
    return el;
  }
  function h(tag, attrs, kids) {
    var el = doc.createElement(tag);
    if (attrs) {
      for (var k in attrs) {
        if (!Object.prototype.hasOwnProperty.call(attrs, k)) continue;
        var v = attrs[k];
        if (v == null || v === false) continue;
        if (k === "class") el.className = v;
        else el.setAttribute(k, v === true ? "" : String(v));
      }
    }
    return append(el, kids);
  }
  function icon(name, cls) {
    var s = doc.createElementNS(SVGNS, "svg");
    s.setAttribute("class", "ico" + (cls ? " " + cls : ""));
    s.setAttribute("aria-hidden", "true");
    s.setAttribute("focusable", "false");
    var u = doc.createElementNS(SVGNS, "use");
    u.setAttribute("href", "#i-" + name);
    s.appendChild(u);
    return s;
  }
  function sr(text) { return h("span", { class: "sr-only" }, text); }
  function arr(x) { return Array.isArray(x) ? x : []; }
  function isNum(v) { return typeof v === "number" && isFinite(v); }
  function str(v) { return v == null ? "" : String(v); }
  function same(a, b) { return Math.abs(a - b) < 1e-6; }
  function equal(a, b) { return isNum(a) && isNum(b) ? same(a, b) : a === b; }
  function plural(n, one, many) { return n === 1 ? one : (many || one + "s"); }
  function has(o, k) { return o != null && Object.prototype.hasOwnProperty.call(o, k); }
  function listText(a) { return a.length < 2 ? a.join("") : a.slice(0, -1).join(", ") + " and " + a[a.length - 1]; }

  var MINUS = "\u2212";
  var NF = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });
  function fmt(v) { return isNum(v) ? (v < 0 ? MINUS + NF.format(-v) : NF.format(v)) : ""; }
  function fmtSigned(v) { return v > 0 ? "+" + NF.format(v) : v < 0 ? MINUS + NF.format(-v) : "0"; }
  var CUR = str(D.meta.currency) || "USD";
  var MF0 = null, MF2 = null;
  try {
    MF0 = new Intl.NumberFormat("en-US", { style: "currency", currency: CUR, minimumFractionDigits: 0, maximumFractionDigits: 0 });
    MF2 = new Intl.NumberFormat("en-US", { style: "currency", currency: CUR, minimumFractionDigits: 2, maximumFractionDigits: 2 });
  } catch (e) { MF0 = MF2 = null; }
  function money(v) {
    var a = Math.abs(v), f = Math.round(a) === a ? MF0 : MF2;
    var s = f ? f.format(a) : NF.format(a) + " " + CUR;
    return v < 0 ? MINUS + s : s;
  }
  function notSupplied() { return h("span", { class: "ns", title: "Not supplied: left blank, never estimated" }, "not supplied"); }
  function numTd(v, cls) { return h("td", { class: "n" + (cls ? " " + cls : "") }, isNum(v) ? fmt(v) : notSupplied()); }
  function moneyTd(v, cls) { return h("td", { class: "n" + (cls ? " " + cls : "") }, isNum(v) ? money(v) : notSupplied()); }

  /* dates: ISO yyyy-mm-dd, day numbers in UTC so no time zone can shift a date */
  function dayNum(s) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(str(s));
    if (!m) return null;
    var y = +m[1], mo = +m[2] - 1, d = +m[3], t = Date.UTC(y, mo, d), dt = new Date(t);
    if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== mo || dt.getUTCDate() !== d) return null;
    return Math.round(t / 86400000);
  }
  var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var WD = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  function weekday(s) { var n = dayNum(s); return n == null ? "" : WD[new Date(n * 86400000).getUTCDay()]; }
  function monthKey(s) { return dayNum(s) == null ? "none" : str(s).slice(0, 7); }
  function monthLabel(key) { return key === "none" ? "No valid date" : MONTHS[+key.slice(5, 7) - 1] + " " + key.slice(0, 4); }
  var AS_OF = str(D.meta.as_of), AS_OF_N = dayNum(AS_OF);

  /* status colours: exact names only; an unknown status stays grey, it is never guessed */
  var STATUS_CLASS = {};
  function put(cls, names) { for (var i = 0; i < names.length; i++) STATUS_CLASS[names[i]] = cls; }
  put("allow", ["ok", "done", "complete", "completed", "approved", "launched", "received", "delivered", "closed", "accepted", "released", "ready", "pass"]);
  put("info", ["in progress", "on track", "live", "active", "running", "in production", "in transit", "shipped"]);
  put("review", ["below reorder", "pending", "pending approval", "awaiting approval", "in review", "under review", "needs review", "waiting", "draft", "partially received", "on hold", "quarantine"]);
  put("block", ["negative", "expired", "at risk", "late", "overdue", "blocked", "rejected", "failed", "delayed", "missed", "fail"]);
  function statusClass(s) { return STATUS_CLASS[str(s).trim().toLowerCase()] || "neutral"; }
  // statuses that close an action item (used only for the "due date passed" mark)
  var CLOSED = { "done": 1, "complete": 1, "completed": 1, "closed": 1, "cancelled": 1, "canceled": 1, "resolved": 1 };
  function isClosed(s) { return CLOSED[str(s).trim().toLowerCase()] === 1; }
  function pill(text, cls) { return h("span", { class: "pill " + (cls || statusClass(text)) }, str(text) || "No status"); }

  function safeUrl(u) {
    u = str(u).trim();
    if (!u) return "";
    if (/^https?:\/\//i.test(u)) return u;
    if (/^[a-z][a-z0-9+.-]*:/i.test(u) || u.indexOf("//") === 0) return ""; // other schemes are not links here
    return u; // relative link
  }
  function shortUrl(u) { return u.replace(/^https?:\/\//i, ""); }

  /* data, guarded so one missing list never stops the page */
  var K = D.kpis || {};
  var stock = arr(D.stock), pos = arr(D.pos), batches = arr(D.batches), campaigns = arr(D.campaigns);
  var timeline = arr(D.timeline), tasks = arr(D.tasks), defs = arr(D.metric_definitions);
  var IMP = D.import_check || {}, REC = D.reconciliation || null, WB = D.workbook || {};
  var BRAND = str(D.meta.brand);
  // extras: what the workbook calculates beyond the first data contract (held units, lot totals, Config, checks...)
  var X = D.extras || {};
  var XTILES = arr(X.dashboard_tiles), XSTOCK = arr(X.stock_check), XHELD = arr(X.held_lots), XRES = arr(X.reservations);
  var XRL = X.recon_lots || null, XCFG = X.config || null, XRC = arr(X.record_checks), XDUP = arr(X.duplicate_kept);
  var XCOLS = arr(X.columns), XTC = arr(X.test_cases);
  function xTile(label) { for (var i = 0; i < XTILES.length; i++) if (XTILES[i] && XTILES[i].label === label) return XTILES[i].value; return null; }
  var stockX = {};
  XSTOCK.forEach(function (s) { if (s && s.sku) stockX[s.sku] = s; });
  var cfgRule = {};
  if (XCFG) arr(XCFG.status_rules).forEach(function (t) { if (t && t.list) cfgRule[t.list] = t; });
  // the statuses of a Config status table whose flag column says Yes
  function flagged(list, column) {
    var t = cfgRule[list];
    if (!t) return null;
    var j = arr(t.columns).indexOf(column);
    if (j < 0) return null;
    return arr(t.rows).filter(function (r) { return str(r[j + 1]).toLowerCase() === "yes"; }).map(function (r) { return str(r[0]); });
  }
  // an expiry window code from the workbook ("<=30", "31-60", ">90", "Expired") in words; other text unchanged
  function windowLabel(v) {
    var t = str(v), m;
    if ((m = /^<=(\d+)$/.exec(t))) return "0-" + m[1] + " days";
    if ((m = /^(\d+)-(\d+)$/.exec(t))) return m[1] + "-" + m[2] + " days";
    if ((m = /^>(\d+)$/.exec(t))) return "more than " + m[1] + " days";
    return t;
  }
  var WIN = XCFG && arr(XCFG.expiry_windows).length === 3 && XCFG.expiry_windows.every(isNum) ? XCFG.expiry_windows : null;

  var skuName = {};
  stock.forEach(function (s) { if (s && s.sku) skuName[s.sku] = str(s.name); });
  batches.forEach(function (b) { if (b && b.sku && !skuName[b.sku] && b.name) skuName[b.sku] = str(b.name); });
  timeline.forEach(function (t) { if (t && t.kind === "Product" && t.ref && !skuName[t.ref] && t.name) skuName[t.ref] = str(t.name); });
  var nameToSku = {};
  Object.keys(skuName).forEach(function (s) { if (skuName[s]) nameToSku[skuName[s].toLowerCase()] = s; });
  function toSku(p) { p = str(p); return skuName[p] !== undefined ? p : (nameToSku[p.toLowerCase()] || p); }
  var campById = {}, campSkus = {};
  campaigns.forEach(function (c) {
    if (!c || !c.id) return;
    campById[c.id] = c;
    campSkus[c.id] = arr(c.products).map(toSku);
  });

  function skuCode(sku) {
    var nm = skuName[sku];
    return h("code", nm ? { title: nm } : null, str(sku));
  }

  /* movements: shipments always reduce stock, whatever sign the file uses; receipts and adjustments keep their sign */
  function effect(type, qty) {
    if (!isNum(qty)) return null;
    return str(type).toLowerCase() === "shipment" ? -Math.abs(qty) : qty;
  }
  function movementsGive(r) {
    if (!isNum(r.opening) || !isNum(r.receipts) || !isNum(r.shipments) || !isNum(r.adjustments)) return null;
    return r.opening + r.receipts - Math.abs(r.shipments) + r.adjustments;
  }

  function fail(sectionId, e) {
    var sec = $(sectionId);
    if (sec) sec.appendChild(h("p", { class: "load-error", role: "alert" }, "This part could not be shown from the data file."));
    if (window.console && console.error) console.error("[ops-workbook] " + sectionId + ": " + (e && e.message ? e.message : e));
  }
  function run(sectionId, fn) { try { fn(); } catch (e) { fail(sectionId, e); } }

  /* ---------- header ---------- */
  function renderFacts() {
    var row = $("facts-row");
    append(row, [
      h("span", { class: "fact" }, [h("strong", null, BRAND)]),
      h("span", { class: "fact" }, ["Data as of ", h("strong", null, AS_OF)]),
      h("span", { class: "fact" }, ["Amounts in ", h("strong", null, CUR)]),
      arr(WB.sheets).length ? h("span", { class: "fact" }, ["Workbook: ", h("strong", null, fmt(arr(WB.sheets).length) + " tabs")]) : null
    ]);
  }

  /* ---------- 1. dashboard ---------- */
  // Which batches the expiry KPIs count (all listed batches, or only those with stock on hand) and how
  // (per window, or cumulative). Decided once from the numbers themselves, so no tile can mislabel them.
  var EXPIRY = (function () {
    function counts(f) {
      var c = { "<=30": 0, "31-60": 0, "61-90": 0 };
      batches.forEach(function (b) { if (b && f(b) && Object.prototype.hasOwnProperty.call(c, b.window)) c[b.window]++; });
      return c;
    }
    function modeOf(c) {
      if (K.expiring_30 === c["<=30"] && K.expiring_60 === c["31-60"] && K.expiring_90 === c["61-90"]) return "window";
      if (K.expiring_30 === c["<=30"] && K.expiring_60 === c["<=30"] + c["31-60"] && K.expiring_90 === c["<=30"] + c["31-60"] + c["61-90"]) return "cumulative";
      return null;
    }
    var all = modeOf(counts(function () { return true; }));
    if (all) return { mode: all, stockedOnly: false };
    var zero = batches.some(function (b) { return b && !(isNum(b.qty) && b.qty > 0); });
    var stocked = zero ? modeOf(counts(function (b) { return isNum(b.qty) && b.qty > 0; })) : null;
    if (stocked) return { mode: stocked, stockedOnly: true };
    return { mode: "unknown", stockedOnly: false };
  })();

  function renderKPIs() {
    var mode = EXPIRY.mode, who = "Batches";
    var EXP = {
      window: [who + " expiring in 0-30 days", who + " expiring in 31-60 days", who + " expiring in 61-90 days"],
      cumulative: [who + " expiring within 30 days", who + " expiring within 60 days", who + " expiring within 90 days"],
      unknown: ["30-day expiry alert", "60-day expiry alert", "90-day expiry alert"]
    }[mode];
    // [key, label, link, link text, alert when > 0, value]; contract KPIs first, workbook Dashboard extras by label
    var tiles = [
      ["skus", "SKUs tracked", "#stock", "Stock by SKU", false, K.skus],
      ["below_reorder", "Below reorder point", "#h-reorder", "Reorder alerts", true, K.below_reorder],
      ["open_pos", "Open purchase orders", "#purchasing", "Purchase orders", false, K.open_pos],
      ["overdue_pos", "Overdue deliveries", "#purchasing", "Purchase orders", true, K.overdue_pos],
      ["x_expired", "Expired batches with stock", "#expiry", "Batch expiry", true, xTile("Expired lots with stock")],
      ["expiring_30", EXP[0], "#expiry", "Batch expiry", true, K.expiring_30],
      ["expiring_60", EXP[1], "#expiry", "Batch expiry", false, K.expiring_60],
      ["expiring_90", EXP[2], "#expiry", "Batch expiry", false, K.expiring_90],
      ["x_ready", "Import rows ready to post", "#import", "Import check", false, xTile("Import rows ready")],
      ["exceptions", "Import exceptions to review", "#import", "Import check", true, K.exceptions],
      ["x_record_issues", "Missing or inconsistent records", "#h-rc", "Record checks", true, xTile("Record issues")],
      ["open_tasks", "Open tasks", "#tasks", "Action items", false, K.open_tasks]
    ];
    var box = $("kpis");
    tiles.forEach(function (t) {
      if (t[0].indexOf("x_") === 0 && !isNum(t[5])) return; // an extras tile only when the export has it
      var v = t[5], alert = t[4] && isNum(v) && v > 0;
      box.appendChild(h("a", { class: "kpi", href: t[2], "data-kpi": t[0] }, [
        h("span", { class: "k-label" }, [alert ? icon("warn", "ico-warn") : null, h("span", null, t[1])]),
        h("span", { class: "k-val" }, isNum(v) ? fmt(v) : notSupplied()),
        h("span", { class: "k-go" }, [t[3] + " ", h("span", { "aria-hidden": "true" }, "\u2192")])
      ]));
    });
    $("dash-intro").textContent = "As of " + AS_OF + ". The same figures as the workbook\u2019s Dashboard tab, where every tile is a formula over the record tabs. Each tile opens the list behind it.";
  }

  /* ---------- 2. stock by SKU ---------- */
  function renderStock() {
    var RANK = { "negative": 0, "below reorder": 1, "ok": 2 };
    var hasX = XSTOCK.length > 0;
    function lotTotal(r) { var x = stockX[r.sku]; return x && isNum(x.lot_total) ? x.lot_total : null; }
    function diffOf(r) { var lt = lotTotal(r); return lt != null && isNum(r.recorded) ? r.recorded - lt : null; }
    function heldOf(r) { var x = stockX[r.sku]; return x && isNum(x.held) ? x.held : null; }
    function skuTh(r) { return h("th", { scope: "row", class: "sku-cell" }, [h("code", null, str(r.sku)), h("span", { class: "nm" }, str(r.name))]); }
    function headTh(label, op, num) { return h("th", { scope: "col", class: num ? "n" : null }, [op ? h("span", { class: "op", "aria-hidden": "true" }, op) : null, label]); }

    // 2a. reconciliation by SKU: movements give the recorded stock, which must equal the sum of the lot balances
    var rt = $("recsku-table");
    rt.tHead.appendChild(h("tr", null, [headTh("SKU / product"), headTh("Opening", null, 1), headTh("Receipts", "+", 1), headTh("Shipments", MINUS, 1),
      headTh("Adjustments", "\u00b1", 1), headTh("Recorded", "=", 1), hasX ? headTh("Sum of lot balances", null, 1) : null, hasX ? headTh("Difference", null, 1) : null]));
    var tot = { opening: 0, receipts: 0, shipments: 0, adjustments: 0, recorded: 0, lots: 0 }, totOk = true;
    stock.forEach(function (r) {
      var give = movementsGive(r), rec = r.recorded, recCell;
      if (isNum(rec) && give != null && same(give, rec)) {
        recCell = h("td", { class: "n" }, h("span", { class: "sum-ok" }, [fmt(rec), icon("ok", "ico-ok"), sr(" (movements add up)")]));
      } else if (isNum(rec) && give != null) {
        recCell = h("td", { class: "n" }, [fmt(rec), h("span", { class: "sum-bad" }, "movements give " + fmt(give))]);
      } else {
        recCell = numTd(rec);
      }
      var cells = [skuTh(r), numTd(r.opening), numTd(r.receipts), numTd(isNum(r.shipments) ? Math.abs(r.shipments) : r.shipments),
        h("td", { class: "n" }, isNum(r.adjustments) ? fmtSigned(r.adjustments) : notSupplied()), recCell];
      if (hasX) {
        var d = diffOf(r);
        cells.push(numTd(lotTotal(r)));
        cells.push(d == null ? numTd(null) : same(d, 0)
          ? h("td", { class: "n diff-ok", "data-diff": "0" }, [h("span", { class: "zero" }, ["0", icon("ok", "ico-ok"), sr(" (lot balances equal the recorded stock)")])])
          : h("td", { class: "n diff-bad", "data-diff": String(d) }, [fmtSigned(d), sr(" (lot balances do not equal the recorded stock)")]));
      }
      ["opening", "receipts", "adjustments", "recorded"].forEach(function (k) { if (isNum(r[k])) tot[k] += r[k]; else totOk = false; });
      if (isNum(r.shipments)) tot.shipments += Math.abs(r.shipments); else totOk = false;
      if (hasX) { if (lotTotal(r) != null) tot.lots += lotTotal(r); else totOk = false; }
      rt.tBodies[0].appendChild(h("tr", { "data-sku": str(r.sku) }, cells));
    });
    if (stock.length && totOk) {
      var td = tot.recorded - tot.lots;
      rt.tFoot.appendChild(h("tr", { class: "closing" }, [h("th", { scope: "row" }, "All SKUs"), numTd(tot.opening), numTd(tot.receipts), numTd(tot.shipments),
        h("td", { class: "n" }, fmtSigned(tot.adjustments)), numTd(tot.recorded), hasX ? numTd(tot.lots) : null,
        hasX ? h("td", { class: "n" + (same(td, 0) ? "" : " diff-bad") }, same(td, 0) ? "0" : fmtSigned(td)) : null]));
    }

    // 2b. available stock and reorder alerts (sortable)
    var cols = [
      { key: "sku", label: "SKU / product", text: true },
      { key: "recorded", label: "Recorded" },
      { key: "reserved", label: "Reserved", op: hasX ? MINUS : null },
      hasX ? { key: "held", label: "Held in lots", op: MINUS, get: heldOf } : null,
      { key: "available", label: "Available", op: hasX ? "=" : null },
      { key: "reorder_point", label: "Reorder point" },
      { key: "reorder_qty", label: "Reorder qty" },
      { key: "status", label: "Status", text: true, get: function (r) { var k = str(r.status).toLowerCase(); return Object.prototype.hasOwnProperty.call(RANK, k) ? RANK[k] : 3; } }
    ].filter(Boolean);
    var byKey = {};
    cols.forEach(function (c) { byKey[c.key] = c; });
    function val(c, r) { if (c.get) return c.get(r); var v = r[c.key]; return c.text ? (v == null ? null : str(v)) : (isNum(v) ? v : null); }

    var table = $("stock-table"), head = table.tHead, body = table.tBodies[0];
    var tr = h("tr");
    cols.forEach(function (c) {
      var th = h("th", { scope: "col", class: c.text ? null : "n", "data-key": c.key });
      th.appendChild(h("button", { type: "button", class: "sort", "data-key": c.key }, [
        c.op ? h("span", { class: "op", "aria-hidden": "true" }, c.op) : null,
        c.label,
        (function () { var s = doc.createElementNS(SVGNS, "svg"); s.setAttribute("class", "si"); s.setAttribute("aria-hidden", "true"); s.setAttribute("focusable", "false"); var u = doc.createElementNS(SVGNS, "use"); u.setAttribute("href", "#i-sort"); s.appendChild(u); return s; })()
      ]));
      tr.appendChild(th);
    });
    head.appendChild(tr);

    var state = { key: null, dir: 1 };
    function rowFor(r) {
      var below = str(r.status).toLowerCase() !== "ok";
      var cells = [skuTh(r), numTd(r.recorded), numTd(r.reserved)];
      if (hasX) cells.push(numTd(heldOf(r)));
      cells.push(numTd(r.available, below ? "flag" : null), numTd(r.reorder_point), numTd(r.reorder_qty), h("td", null, pill(r.status)));
      return h("tr", { "data-sku": str(r.sku) }, cells);
    }
    function draw() {
      var list = stock.map(function (r, i) { return { r: r, i: i }; });
      if (state.key) {
        var c = byKey[state.key];
        list.sort(function (a, b) {
          var va = val(c, a.r), vb = val(c, b.r);
          if (va == null || vb == null) return va == null && vb == null ? a.i - b.i : (va == null ? 1 : -1);
          var d = typeof va === "number" && typeof vb === "number" ? va - vb : String(va).localeCompare(String(vb), "en", { numeric: true });
          return d !== 0 ? d * state.dir : a.i - b.i;
        });
      }
      body.textContent = "";
      list.forEach(function (x) { body.appendChild(rowFor(x.r)); });
      Array.prototype.forEach.call(head.querySelectorAll("th"), function (th) {
        if (th.getAttribute("data-key") === state.key) th.setAttribute("aria-sort", state.dir === 1 ? "ascending" : "descending");
        else th.removeAttribute("aria-sort");
      });
    }
    head.addEventListener("click", function (e) {
      var b = e.target.closest ? e.target.closest("button.sort") : null;
      if (!b) return;
      var k = b.getAttribute("data-key");
      if (state.key === k) state.dir = -state.dir; else { state.key = k; state.dir = 1; }
      draw();
    });
    draw();

    // intro: counts by status, and whether every row adds up (all computed here from the rows)
    var counts = {}, order = [];
    stock.forEach(function (r) { var s = str(r.status) || "No status"; if (!counts[s]) { counts[s] = 0; order.push(s); } counts[s]++; });
    order.sort(function (a, b) { var ra = RANK[a.toLowerCase()], rb = RANK[b.toLowerCase()]; return (ra == null ? 3 : ra) - (rb == null ? 3 : rb); });
    var checked = 0, ok = 0, lotOk = 0, lotChecked = 0, availOk = 0, availChecked = 0;
    stock.forEach(function (r) {
      var g = movementsGive(r);
      if (g != null && isNum(r.recorded)) { checked++; if (same(g, r.recorded)) ok++; }
      var d = diffOf(r);
      if (d != null) { lotChecked++; if (same(d, 0)) lotOk++; }
      var hd = hasX ? heldOf(r) : 0;
      if (isNum(r.recorded) && isNum(r.reserved) && isNum(r.available) && isNum(hd)) { availChecked++; if (same(r.recorded - r.reserved - hd, r.available)) availOk++; }
    });
    var intro = $("stock-intro");
    append(intro, [
      h("strong", null, fmt(stock.length) + " " + plural(stock.length, "SKU")), ". By status: ",
      order.map(function (s, i) { return [i ? " " : "", pill(s + " \u00b7 " + fmt(counts[s]), statusClass(s))]; }),
      " "
    ]);
    var lines = [];
    if (checked === stock.length && ok === checked && checked > 0) lines.push("All " + fmt(checked) + " rows add up from the opening balance to the recorded stock");
    else if (checked > 0) lines.push(fmt(checked - ok) + " of " + fmt(checked) + " rows do not add up from the opening balance (marked in the table)");
    if (lotChecked === stock.length && lotOk === lotChecked && lotChecked > 0) lines.push("on every row the lot balances add up to the recorded stock (difference 0)");
    else if (lotChecked > 0) lines.push(fmt(lotChecked - lotOk) + " " + plural(lotChecked - lotOk, "row") + " where the lot balances differ from the recorded stock (shown in red)");
    if (availChecked === stock.length && availOk === availChecked && availChecked > 0) lines.push("and available = recorded " + MINUS + " reserved" + (hasX ? " " + MINUS + " held" : "") + " on every row");
    if (lines.length) intro.appendChild(doc.createTextNode(lines.join("; ") + ". Checked again in your browser."));

    // the rules, from Config
    var box = $("stock-rules");
    var basis = XCFG ? str(XCFG.reorder_basis) : "";
    var resSt = flagged("Reservation statuses", "Holds stock"), lotSt = flagged("Lot statuses", "Holds stock");
    var items = [];
    if (basis) items.push([h("strong", null, "Reorder alert: "), basis.toLowerCase() + " stock below the SKU\u2019s reorder point (Config: reorder test uses " + basis + "). A SKU exactly at its reorder point is not below it."]);
    if (hasX) items.push([h("strong", null, "Available stock: "), "recorded stock " + MINUS + " reserved " + MINUS + " units held in lots."]);
    if (resSt) items.push([h("strong", null, "Reserved: "), "reservations whose status holds stock on Config (" + listText(resSt) + "), counted from the start date to the release date, both included. No release date means reserved until released by hand."]);
    if (lotSt && XCFG) items.push([h("strong", null, "Held in lots: "), "units in lots whose status holds stock on Config (" + listText(lotSt) + ")" + (str(XCFG.expired_lots_held).toLowerCase() === "yes" ? ", and units in expired lots, because Config says expired lots are held." : ".")]);
    if (items.length) box.appendChild(h("ul", { class: "rule-list" }, items.map(function (k) { return h("li", null, k); })));
    else box.hidden = true;
  }

  /* ---------- 2b. reservations and held lots: why available is lower than recorded ---------- */
  function renderAvail() {
    if (!XRES.length && !XHELD.length) {
      [$("h-avail"), $("avail-intro")].forEach(function (el) { if (el) el.hidden = true; });
      var tc = $("res-table").closest(".two-col");
      if (tc) tc.hidden = true;
      return;
    }
    var resHolds = {}, resSt = flagged("Reservation statuses", "Holds stock") || [];
    resSt.forEach(function (s) { resHolds[s.toLowerCase()] = 1; });
    // gap per SKU explained by counted reservations and held lots
    var gapSku = 0, explained = 0;
    stock.forEach(function (r) {
      if (!isNum(r.recorded) || !isNum(r.available)) return;
      var gap = r.recorded - r.available;
      if (same(gap, 0)) return;
      gapSku++;
      var res = XRES.filter(function (x) { return x.sku === r.sku && x.counts; }).reduce(function (s, x) { return s + (isNum(x.counted) ? x.counted : 0); }, 0);
      var held = XHELD.filter(function (x) { return x.sku === r.sku; }).reduce(function (s, x) { return s + (isNum(x.held) ? x.held : 0); }, 0);
      if (same(res + held, gap)) explained++;
    });
    append($("avail-intro"), [
      "Available is lower than recorded on ", h("strong", null, fmt(gapSku) + " of " + fmt(stock.length) + " SKUs"), ". ",
      explained === gapSku ? "Every unit of each gap is one of the counted reservations or held lots below (checked in your browser). " : fmt(gapSku - explained) + " " + plural(gapSku - explained, "gap") + " not explained by the rows below. ",
      "The rule is applied on the as-of date, " + AS_OF + "."
    ]);
    var rb = $("res-table").tBodies[0];
    XRES.forEach(function (x) {
      var why;
      var st = str(x.status).toLowerCase(), s = dayNum(x.start), rel = dayNum(x.release);
      if (!resHolds[st]) why = "status does not hold stock";
      else if (s != null && AS_OF_N != null && s > AS_OF_N) why = "starts after the as-of date";
      else if (rel != null && AS_OF_N != null && rel < AS_OF_N) why = "release date has passed";
      else why = "in its reservation period";
      rb.appendChild(h("tr", { "data-res": str(x.id) }, [
        h("th", { scope: "row" }, h("code", null, str(x.id))),
        h("td", null, skuCode(x.sku)),
        numTd(x.qty),
        h("td", null, pill(x.status)),
        h("td", { class: "mono" }, str(x.start)),
        h("td", { class: "mono" }, x.release ? str(x.release) : h("span", { class: "ns" }, "none")),
        h("td", null, [x.counts ? pill("Counts \u00b7 " + fmt(x.counted), "info") : pill("Not counted", "neutral"), h("span", { class: "why" }, why)])
      ]));
    });
    if (!XRES.length) rb.appendChild(h("tr", null, h("td", { colspan: "7" }, "No reservations in the data.")));
    var hb = $("held-table").tBodies[0];
    XHELD.forEach(function (x) {
      var why = [];
      if (x.status_holds_stock) why.push("status " + str(x.status) + " holds stock (Config)");
      if (x.expired) why.push("expired " + str(x.expiry) + ", and Config holds expired lots");
      hb.appendChild(h("tr", { "data-lot": str(x.lot) }, [
        h("th", { scope: "row" }, h("code", null, str(x.lot))),
        h("td", null, skuCode(x.sku)),
        numTd(x.held),
        h("td", { class: "wrap-cell" }, why.join("; ") || "held")
      ]));
    });
    if (!XHELD.length) hb.appendChild(h("tr", null, h("td", { colspan: "4" }, "No lot is held.")));
  }

  /* ---------- 3. one SKU, reconciled ---------- */
  function renderRecon() {
    var intro = $("recon-intro");
    if (!REC || !REC.sku) { intro.textContent = "The data file has no reconciliation example."; $("recon-sum").hidden = true; return; }
    var rows = arr(REC.rows).map(function (r, i) { return { r: r, i: i, d: dayNum(r.date) }; });
    rows.sort(function (a, b) { if (a.d == null || b.d == null) return a.d == null && b.d == null ? a.i - b.i : (a.d == null ? 1 : -1); return a.d - b.d || a.i - b.i; });
    // opening balance split by lot when the lot openings add up to it (Batches tab)
    var openLots = XRL && XRL.sku === REC.sku ? arr(XRL.lots).filter(function (l) { return isNum(l.opening) && l.opening > 0; }) : [];
    var openSum = openLots.reduce(function (s, l) { return s + l.opening; }, 0);
    var byLot = openLots.length && isNum(REC.opening) && same(openSum, REC.opening);
    append(intro, [h("code", null, str(REC.sku)), " ", str(REC.name), ": the opening balance", byLot ? " of each lot on " + str(XRL.opening_date) : "",
      ", then every receipt, shipment and adjustment in Inventory_Ledger, in date order. Each row names its batch (lot). The running total has to end at the recorded stock."]);
    $("recon-cap").textContent = "Movements of " + str(REC.sku) + " in date order, from the opening balance to the recorded stock";

    var tbl = $("recon-table"), body = tbl.tBodies[0];
    var running = 0;
    var tot = { receipt: 0, shipment: 0, adjustment: 0, other: 0 }, nOther = 0, bad = 0;
    if (byLot) {
      openLots.forEach(function (l) {
        running += l.opening;
        body.appendChild(h("tr", { class: "opening", "data-type": "Opening" }, [
          h("td", { class: "mono" }, str(XRL.opening_date)), h("td", null, "Opening"),
          h("td", { class: "n chg-pos" }, fmtSigned(l.opening)), h("td", { class: "n" }, fmt(running)),
          h("td", null, h("span", { class: "muted" }, "Batches tab")), h("td", null, h("code", null, str(l.lot))),
          h("td", { class: "note" }, "Opening quantity of the lot")
        ]));
      });
    } else {
      running = isNum(REC.opening) ? REC.opening : 0;
      body.appendChild(h("tr", { class: "opening", "data-type": "Opening" }, [h("td", { colspan: "2" }, "Opening balance"), h("td", { class: "n" }, ""), numTd(REC.opening), h("td", { colspan: "3" }, "")]));
    }
    rows.forEach(function (x) {
      var r = x.r, e = effect(r.type, r.qty), t = str(r.type).toLowerCase();
      if (e == null) bad++;
      else {
        running += e;
        if (t === "receipt") tot.receipt += e;
        else if (t === "shipment") tot.shipment += -e;
        else if (t === "adjustment") tot.adjustment += e;
        else { tot.other += e; nOther++; }
      }
      body.appendChild(h("tr", { "data-type": str(r.type) }, [
        h("td", { class: "mono" }, str(r.date)),
        h("td", null, str(r.type)),
        h("td", { class: "n " + (e > 0 ? "chg-pos" : e < 0 ? "chg-neg" : "") }, e == null ? "not a number" : fmtSigned(e)),
        h("td", { class: "n" }, fmt(running)),
        h("td", null, h("code", null, str(r.ref))),
        h("td", null, r.batch ? h("code", null, str(r.batch)) : ""),
        h("td", { class: "note" }, str(r.note))
      ]));
    });
    var match = isNum(REC.recorded) && bad === 0 && same(running, REC.recorded);
    tbl.tFoot.appendChild(h("tr", { class: "closing" }, [
      h("th", { scope: "row", colspan: "3" }, "Recorded stock"),
      h("td", { class: "n" }, match ? h("span", { class: "sum-ok" }, [fmt(REC.recorded), icon("ok", "ico-ok"), sr(" (equal to the running total)")]) : (isNum(REC.recorded) ? fmt(REC.recorded) : notSupplied())),
      h("td", { colspan: "3" }, "")
    ]));

    var eq = $("recon-eq");
    function line(label, value, cls) { append(eq, [h("dt", { class: cls || null }, label), h("dd", { class: cls || null }, value)]); }
    line(byLot ? "Opening balance (" + fmt(openLots.length) + " " + plural(openLots.length, "lot") + ")" : "Opening balance", isNum(REC.opening) ? fmt(REC.opening) : "not supplied");
    line("+ Receipts", fmt(tot.receipt));
    line(MINUS + " Shipments", fmt(tot.shipment));
    line("\u00b1 Adjustments", fmtSigned(tot.adjustment));
    if (nOther) line("\u00b1 Other movements", fmtSigned(tot.other));
    line("= Movements give", fmt(running), "total");
    line("Recorded stock", isNum(REC.recorded) ? fmt(REC.recorded) : "not supplied", "total");
    var sx = stockX[REC.sku];
    if (sx && isNum(sx.lot_total)) line("Sum of lot balances", fmt(sx.lot_total), "total");

    var m = $("recon-match");
    var lotsOk = !sx || !isNum(sx.lot_total) || same(sx.lot_total, REC.recorded);
    m.className = "match " + (match && lotsOk ? "ok" : "bad");
    m.appendChild(icon(match && lotsOk ? "ok" : "no"));
    m.appendChild(h("span", null, match
      ? ["Equal: the " + fmt(rows.length) + " movements take the opening balance to exactly the recorded stock, ", h("strong", null, fmt(REC.recorded)),
        sx && isNum(sx.lot_total) ? (lotsOk ? ", which is also the sum of the lot balances" : "; the lot balances add up to " + fmt(sx.lot_total) + " instead") : "", ". Recomputed in your browser."]
      : (bad ? "Some movements have no numeric quantity, so the rows cannot be added up." : "Not equal: the movements give " + fmt(running) + ", the recorded stock is " + fmt(REC.recorded) + ".")));

    // the same SKU in the stock table: the ledger totals must equal that row
    var srow = null;
    stock.forEach(function (s) { if (s && s.sku === REC.sku) srow = s; });
    var vs = $("recon-vs");
    if (!srow) { vs.appendChild(h("p", { class: "small muted" }, "This SKU is not in the stock table.")); return; }
    var pairs = [
      ["Opening", REC.opening, srow.opening],
      ["Receipts", tot.receipt, srow.receipts],
      ["Shipments", tot.shipment, isNum(srow.shipments) ? Math.abs(srow.shipments) : null],
      ["Adjustments", tot.adjustment, srow.adjustments],
      ["Recorded", REC.recorded, srow.recorded]
    ];
    var tb = h("tbody");
    var allOk = true;
    pairs.forEach(function (p) {
      var ok = isNum(p[1]) && isNum(p[2]) && same(p[1], p[2]);
      if (!ok) allOk = false;
      tb.appendChild(h("tr", null, [
        h("th", { scope: "row" }, p[0]),
        h("td", { class: "n" }, isNum(p[1]) ? (p[0] === "Adjustments" ? fmtSigned(p[1]) : fmt(p[1])) : "\u2014"),
        h("td", { class: "n" }, isNum(p[2]) ? (p[0] === "Adjustments" ? fmtSigned(p[2]) : fmt(p[2])) : "\u2014"),
        h("td", null, [icon(ok ? "ok" : "no", ok ? "ico-ok" : "ico-no"), sr(ok ? "equal" : "different")])
      ]));
    });
    vs.appendChild(h("table", { class: "vs-table" }, [
      h("caption", null, allOk ? "Ledger totals equal the stock table row for this SKU." : "Ledger totals against the stock table row: differences are marked."),
      h("thead", null, h("tr", null, [h("th", { scope: "col" }, sr("Total")), h("th", { scope: "col", class: "n" }, "Ledger"), h("th", { scope: "col", class: "n" }, "Stock table"), h("th", { scope: "col" }, sr("Check"))])),
      tb
    ]));
  }

  /* ---------- 4. worked test cases ---------- */
  function renderTests() {
    var grid = $("tc-grid"), intro = $("tc-intro");
    if (!XTC.length) { intro.textContent = "The data file has no worked test cases."; return; }
    var nPass = 0;
    XTC.forEach(function (c) {
      var steps = arr(c.steps), total = null, stepsOk = true;
      if (c.kind === "sum") {
        total = 0;
        steps.forEach(function (s) { total += (s.op === "-" ? -1 : 1) * (isNum(s.value) ? s.value : NaN); });
        stepsOk = isNum(total) && equal(total, c.expected);
      }
      var pass = stepsOk && equal(c.expected, c.workbook) && c.pass === true;
      if (pass) nPass++;
      var opSym = { "+": "+", "-": MINUS };
      var ol = h("ol", { class: "tc-steps" }, steps.map(function (s, i) {
        // a sum step adds or subtracts its value; "+ -60" is shown as "- 60"
        var neg = c.kind === "sum" && s.op === "+" && isNum(s.value) && s.value < 0;
        var sym = c.kind === "sum" ? (i === 0 && s.op === "+" ? "" : neg ? MINUS : opSym[s.op] || "") : "";
        var shown = isNum(s.value) ? fmt(neg ? -s.value : s.value) : "";
        return h("li", null, [
          h("span", { class: "tc-op", "aria-hidden": "true" }, sym),
          h("span", { class: "tc-text" }, [str(s.text), sym ? sr(sym === "+" ? " (add)" : " (subtract)") : null]),
          h("span", { class: "tc-val" }, shown)
        ]);
      }));
      if (c.kind === "sum") ol.appendChild(h("li", { class: "tc-total" }, [h("span", { class: "tc-op", "aria-hidden": "true" }, "="), h("span", { class: "tc-text" }, "Total, re-added in your browser"), h("span", { class: "tc-val" }, isNum(total) ? fmt(total) : "not a number")]));
      var show = function (v) { return isNum(v) ? fmt(v) : windowLabel(v); };
      grid.appendChild(h("article", { class: "tc " + (pass ? "pass" : "fail"), id: "tc-" + str(c.id).toLowerCase(), "aria-labelledby": "tc-h-" + str(c.id) }, [
        h("header", { class: "tc-head" }, [
          h("span", { class: "tc-id" }, str(c.id)),
          h("h3", { id: "tc-h-" + str(c.id) }, str(c.title)),
          pill(pass ? "PASS" : "FAIL", pass ? "allow" : "block")
        ]),
        h("p", { class: "tc-rule" }, str(c.rule)),
        ol,
        h("dl", { class: "tc-res" }, [
          h("div", null, [h("dt", null, c.kind === "sum" ? "Worked result" : "Worked answer"), h("dd", null, show(c.expected))]),
          h("div", null, [h("dt", null, ["Workbook, cell ", h("code", null, str(c.cell))]), h("dd", null, show(c.workbook))])
        ])
      ]));
    });
    append(intro, [
      "Each case was worked out step by step from the raw sample records (the CSV files), separately from the workbook formulas, and then compared with one cell of the recalculated workbook. Your browser re-adds every sum and compares again: ",
      h("strong", null, fmt(nPass) + " of " + fmt(XTC.length) + " PASS"), "."
    ]);
  }

  /* ---------- 5. purchase orders ---------- */
  // PO statuses that mean "not outstanding" (received, cancelled, not yet placed). The split is used only when it
  // gives exactly the dashboard's open PO count; otherwise every PO stays in one list with neutral wording.
  var PO_CLOSED = { "received": 1, "fully received": 1, "closed": 1, "cancelled": 1, "canceled": 1, "draft": 1, "rejected": 1, "complete": 1, "completed": 1, "delivered": 1, "void": 1 };
  function poOpen(p) { return !PO_CLOSED[str(p && p.status).trim().toLowerCase()]; }
  function renderPOs() {
    var nOpen = pos.filter(poOpen).length;
    var split = isNum(K.open_pos) && nOpen === K.open_pos && nOpen !== pos.length;
    var allOpen = isNum(K.open_pos) && pos.length === K.open_pos;
    var list = pos.map(function (p, i) { return { p: p, i: i, open: split ? poOpen(p) : true }; });
    list.sort(function (a, b) {
      if (a.open !== b.open) return a.open ? -1 : 1;
      var ao = a.p.overdue ? 0 : 1, bo = b.p.overdue ? 0 : 1;
      if (ao !== bo) return ao - bo;
      if (!ao) { var dl = (isNum(b.p.days_late) ? b.p.days_late : 0) - (isNum(a.p.days_late) ? a.p.days_late : 0); if (dl) return dl; }
      var ea = dayNum(a.p.expected), eb = dayNum(b.p.expected);
      if (ea != null && eb != null && ea !== eb) return ea - eb;
      return a.i - b.i;
    });
    var nOver = pos.filter(function (p) { return p && p.overdue; }).length;
    var closedNames = [];
    list.forEach(function (x) { var s = str(x.p.status); if (!x.open && closedNames.indexOf(s) < 0) closedNames.push(s); });
    function orList(a) { a = a.map(function (s) { return s.toLowerCase(); }); return a.length < 2 ? a.join("") : a.slice(0, -1).join(", ") + " or " + a[a.length - 1]; }
    var intro = $("po-intro");
    var openSt = flagged("PO statuses", "Counts as open");
    if (split || allOpen) {
      append(intro, [h("strong", null, fmt(nOpen) + " outstanding " + plural(nOpen, "purchase order")), "; ", h("strong", null, fmt(nOver) + " overdue"),
        " as of " + AS_OF + ". Overdue orders come first, the most days late at the top, then the rest by expected date."]);
      if (split) intro.appendChild(doc.createTextNode(" Below them, the " + fmt(pos.length - nOpen) + " other " + plural(pos.length - nOpen, "order") + " (" + orList(closedNames) + ")."));
    } else {
      append(intro, [h("strong", null, fmt(pos.length) + " " + plural(pos.length, "purchase order")), "; ", h("strong", null, fmt(nOver) + " overdue"),
        " as of " + AS_OF + ". Overdue orders come first, the most days late at the top, then the rest by expected date."]);
    }
    if (openSt) intro.appendChild(doc.createTextNode(" Outstanding = status counts as open on Config (" + listText(openSt.map(function (s) { return s.toLowerCase(); })) + ") and not fully received in the ledger; overdue = outstanding and the expected date is before the as-of date."));
    var table = $("po-table");
    var body = null, group = null;
    list.forEach(function (x) {
      var g = split ? (x.open ? "open" : "other") : "all";
      if (g !== group) {
        group = g;
        body = h("tbody", { "data-group": g });
        if (split) {
          var n = list.filter(function (y) { return y.open === x.open; }).length;
          body.appendChild(h("tr", { class: "grp" }, h("th", { colspan: "8", scope: "rowgroup" },
            (x.open ? "Outstanding" : "Not outstanding: " + orList(closedNames)) + " \u00b7 " + fmt(n) + " " + plural(n, "order"))));
        }
        table.appendChild(body);
      }
      var p = x.p, late;
      if (p.overdue) late = pill(isNum(p.days_late) && p.days_late > 0 ? fmt(p.days_late) + " " + plural(p.days_late, "day") + " late" : "Overdue", "block");
      else late = [h("span", { class: "muted", "aria-hidden": "true" }, "\u2014"), sr("not late")];
      body.appendChild(h("tr", { "data-po": str(p.po) }, [
        h("th", { scope: "row" }, h("code", null, str(p.po))),
        h("td", { class: "mono" }, str(p.expected)),
        h("td", { class: "po-late" }, late),
        h("td", null, pill(p.status)),
        h("td", null, skuCode(p.sku)),
        numTd(p.qty),
        h("td", { class: "supplier" }, str(p.supplier)),
        h("td", { class: "mono" }, str(p.ordered))
      ]));
    });
    if (!pos.length) table.appendChild(h("tbody", null, h("tr", null, h("td", { colspan: "8" }, "No purchase orders in the data."))));
  }

  /* ---------- 6. batch expiry ---------- */
  function renderBatches() {
    var w = WIN || [30, 60, 90];
    var W = [
      { key: "Expired", label: "Expired", cls: "block" },
      { key: "<=30", label: "0-" + w[0] + " days", cls: "review" },
      { key: "31-60", label: (w[0] + 1) + "-" + w[1] + " days", cls: "neutral" },
      { key: "61-90", label: (w[1] + 1) + "-" + w[2] + " days", cls: "neutral" },
      { key: ">90", label: "More than " + w[2] + " days", cls: "neutral" }
    ];
    var groups = {};
    W.forEach(function (x) { groups[x.key] = []; });
    var other = [];
    batches.forEach(function (b, i) { (groups[b.window] || other).push({ b: b, i: i }); });
    if (other.length) {
      W.push({ key: "__other", label: "Other window", cls: "neutral" });
      groups.__other = other;
    }
    var heldLot = {};
    XHELD.forEach(function (x) { if (x && x.lot) heldLot[x.lot] = x; });

    // When the dashboard counts only batches with stock on hand, the window tiles count the same way.
    var only = EXPIRY.stockedOnly;
    function stocked(x) { return isNum(x.b.qty) && x.b.qty > 0; }
    var allStocked = batches.every(function (b) { return isNum(b.qty) && b.qty > 0; });
    var intro = $("exp-intro");
    append(intro, [
      fmt(batches.length) + " " + plural(batches.length, "batch", "batches") + (allStocked ? " with stock on hand" : "") + " as of ",
      h("strong", null, AS_OF), ". ",
      WIN ? "The alert windows are set on the Config tab: expired, 0-" + w[0] + ", " + (w[0] + 1) + "-" + w[1] + " and " + (w[1] + 1) + "-" + w[2] + " days left. " : "",
      "Days left = expiry date " + MINUS + " as-of date. The as-of date is a fixed setting on Config, not today\u2019s date, so these flags stay the same whenever this page is read."
    ]);
    if (only) intro.appendChild(doc.createTextNode(" The counts below, like the dashboard alerts, include only batches with stock on hand; batches with none are listed and marked."));

    var wins = $("windows");
    W.forEach(function (x) {
      var n = only ? groups[x.key].filter(stocked).length : groups[x.key].length;
      wins.appendChild(h("div", { class: "win", "data-window": x.key }, [
        h("span", { class: "w-n" }, fmt(n)),
        pill(x.label, x.cls),
        sr(plural(n, "batch", "batches") + (only ? " with stock on hand" : ""))
      ]));
    });

    var table = $("batch-table");
    W.forEach(function (x) {
      var g = groups[x.key];
      if (!g.length) return;
      g.sort(function (a, b) { var da = isNum(a.b.days_left) ? a.b.days_left : Infinity, db = isNum(b.b.days_left) ? b.b.days_left : Infinity; return da - db || a.i - b.i; });
      var tb = h("tbody", { "data-window": x.key });
      var withStock = g.filter(stocked).length;
      tb.appendChild(h("tr", { class: "grp" }, h("th", { colspan: "6", scope: "rowgroup" },
        x.label + " \u00b7 " + fmt(g.length) + " " + plural(g.length, "batch", "batches") + (only && withStock !== g.length ? ", " + fmt(withStock) + " with stock on hand" : ""))));
      g.forEach(function (y) {
        var b = y.b, hl = heldLot[b.lot];
        tb.appendChild(h("tr", { "data-lot": str(b.lot) }, [
          h("th", { scope: "row" }, h("code", null, str(b.lot))),
          h("td", { class: "mono" }, str(b.expiry)),
          h("td", { class: "n" }, isNum(b.days_left) ? fmt(b.days_left) : notSupplied()),
          h("td", null, h("code", null, str(b.sku))),
          h("td", { class: "prod" }, [str(b.name || skuName[b.sku]), only && !stocked(y) ? [" ", h("span", { class: "tag" }, "No stock on hand")] : null,
            hl ? [" ", h("span", { class: "tag held" }, "Held: " + [hl.status_holds_stock ? str(hl.status) : "", hl.expired ? "expired" : ""].filter(Boolean).join(", "))] : null]),
          numTd(b.qty)
        ]));
      });
      table.appendChild(tb);
    });
    if (!batches.length) table.appendChild(h("tbody", null, h("tr", null, h("td", { colspan: "6" }, "No batches in the data."))));
  }

  /* ---------- 7. import check ---------- */
  // The seven checks of the brief, in its words, and the workbook issue names (Config catalog) behind each one.
  var SEVEN = [
    { name: "Duplicate identifier", issues: ["duplicate id"] },
    { name: "Missing required field", issues: ["missing required field"] },
    { name: "Invalid date or quantity", issues: ["invalid date", "invalid quantity"] },
    { name: "Unknown product or supplier reference", issues: ["unknown product", "unknown supplier", "unknown lot"] },
    { name: "Unsupported status value", issues: ["unsupported status", "unsupported type"] },
    { name: "Negative inventory balance (needs review)", issues: ["negative inventory"] },
    { name: "Missing source link", issues: ["missing source link"] }
  ];
  function sevenOf(issue) {
    var k = str(issue).toLowerCase().replace(/_/g, " ");
    for (var i = 0; i < SEVEN.length; i++) if (SEVEN[i].issues.indexOf(k) >= 0) return i;
    return -1;
  }
  function renderImport() {
    var cols = arr(IMP.columns), rows = arr(IMP.rows), exc = arr(IMP.exceptions);
    var colIdx = {};
    cols.forEach(function (c, i) { colIdx[c] = i; });
    var rowByNo = {};
    rows.forEach(function (r) { rowByNo[r.row] = r; });
    var idCol = cols.indexOf("movement_id") >= 0 ? "movement_id" : cols[0];
    function recordId(rowNo) { var r = rowByNo[rowNo]; var v = r && r.values ? str(r.values[idCol]).trim() : ""; return v; }
    var byCell = {}, byRowOnly = {}, rowsWithExc = {}, perRow = {};
    exc.forEach(function (e) {
      rowsWithExc[e.row] = true;
      perRow[e.row] = (perRow[e.row] || 0) + 1;
      if (Object.prototype.hasOwnProperty.call(colIdx, e.field)) (byCell[e.row + "\u0000" + e.field] = byCell[e.row + "\u0000" + e.field] || []).push(e);
      else (byRowOnly[e.row] = byRowOnly[e.row] || []).push(e);
    });
    var nExcRows = Object.keys(rowsWithExc).length;
    var multi = Object.keys(perRow).filter(function (k) { return perRow[k] > 1; }).length;
    // Ready / rejected per row only when the counts in the file say exactly that; otherwise neutral labels.
    var exact = isNum(IMP.accepted) && isNum(IMP.rejected) && nExcRows === IMP.rejected && rows.length - nExcRows === IMP.accepted;
    function issueLabel(s) { return str(s).replace(/_/g, " "); }
    var catalog = XCFG ? arr(XCFG.import_checks) : [];

    append($("imp-intro"), [
      "The sample file ", h("code", null, str(IMP.file)), ": ",
      h("strong", null, fmt(rows.length) + " " + plural(rows.length, "row") + " read"), ", ",
      h("strong", null, (isNum(IMP.accepted) ? fmt(IMP.accepted) : "not supplied") + " ready to append"), ", ",
      h("strong", null, (isNum(IMP.rejected) ? fmt(IMP.rejected) : "not supplied") + " sent to the exceptions report"),
      exc.length ? " with " + fmt(exc.length) + " " + plural(exc.length, "problem") + (multi ? " (" + fmt(multi) + " " + plural(multi, "row has", "rows have") + " more than one)" : "") + ". The problems were planted on purpose to show each check." : ". No problems found."
    ]);
    if (catalog.length) $("flow-checks").textContent = "Formulas run the " + fmt(catalog.length) + " import checks listed on the Config tab on every row. Rejected rows are listed in the Exceptions tab in plain words, with what to do.";
    append($("imp-top"), [
      pill("Rows read \u00b7 " + fmt(rows.length), "neutral"),
      pill("Ready to append \u00b7 " + (isNum(IMP.accepted) ? fmt(IMP.accepted) : "not supplied"), "allow"),
      pill("Sent to exceptions \u00b7 " + (isNum(IMP.rejected) ? fmt(IMP.rejected) : "not supplied"), "block"),
      pill(fmt(exc.length) + " " + plural(exc.length, "problem") + " found", "neutral")
    ]);

    // the seven checks
    var caught = SEVEN.map(function () { return []; }), unmapped = [];
    exc.forEach(function (e) { var k = sevenOf(e.issue); if (k >= 0) caught[k].push(e); else unmapped.push(e); });
    var sb = $("seven-table").tBodies[0];
    SEVEN.forEach(function (s, k) {
      var codes = catalog.filter(function (c) { return s.issues.indexOf(str(c.issue).toLowerCase()) >= 0; });
      var rowsCaught = [];
      caught[k].forEach(function (e) { if (rowsCaught.indexOf(e.row) < 0) rowsCaught.push(e.row); });
      // explicit table roles: on a phone the rows become cards (display: grid), which drops native table semantics
      sb.appendChild(h("tr", { role: "row", "data-check": String(k + 1), "data-caught": String(caught[k].length) }, [
        h("td", { class: "n", role: "cell" }, fmt(k + 1)),
        h("th", { scope: "row", role: "rowheader" }, s.name),
        h("td", { class: "caught-cell", role: "cell" }, caught[k].length
          ? [pill(fmt(caught[k].length) + " " + plural(caught[k].length, "problem"), "block"), " ",
            h("span", { class: "rows-caught" }, rowsCaught.map(function (rn, i) { var id = recordId(rn); return [i ? ", " : "", h("span", { class: "nobr" }, [h("a", { href: "#imp-r" + rn }, "row " + rn), id ? " (" + id + ")" : ""])]; }))]
          : h("span", { class: "muted" }, "none in this file")),
        h("td", { class: "codes-cell", role: "cell", "data-label": "Workbook checks" }, codes.length ? h("span", { class: "codes" }, codes.map(function (c) { return h("code", { title: str(c.action) }, str(c.code)); })) : h("span", { class: "muted" }, "\u2014"))
      ]));
    });
    var allCaught = caught.every(function (c) { return c.length > 0; });
    $("seven-intro").textContent = (allCaught ? "Each of the seven checks caught at least one planted problem in the sample file. " : fmt(caught.filter(function (c) { return c.length; }).length) + " of the seven checks caught a problem in this file. ") +
      (catalog.length ? "Behind them, the Config tab lists " + fmt(catalog.length) + " workbook checks (hover a code to see what to do)." : "");

    // exceptions report: source row, record ID, check (brief wording), field, plain-English message
    var counts = SEVEN.map(function () { return 0; });
    exc.forEach(function (e) { var k = sevenOf(e.issue); if (k >= 0) counts[k]++; });
    var issues = $("imp-issues");
    SEVEN.forEach(function (s, k) { if (counts[k]) issues.appendChild(h("span", { class: "tag line chk" }, s.name + " \u00b7 " + fmt(counts[k]))); });
    unmapped.forEach(function (e) { issues.appendChild(h("span", { class: "tag line chk" }, issueLabel(e.issue))); });
    var list = $("exc-list");
    exc.map(function (e, i) { return { e: e, i: i }; }).sort(function (a, b) {
      var ra = isNum(a.e.row) ? a.e.row : Infinity, rb = isNum(b.e.row) ? b.e.row : Infinity;
      if (ra !== rb) return ra - rb;
      var ca = colIdx[a.e.field], cb = colIdx[b.e.field];
      return (ca == null ? 999 : ca) - (cb == null ? 999 : cb) || a.i - b.i;
    }).forEach(function (x) {
      var e = x.e, inRows = !!rowByNo[e.row], k = sevenOf(e.issue), id = recordId(e.row);
      list.appendChild(h("li", { "data-row": String(e.row) }, [
        icon("warn"),
        h("div", { class: "exc-where" }, [
          inRows ? h("a", { href: "#imp-r" + str(e.row) }, "Row " + str(e.row)) : h("span", { class: "mono" }, "Row " + str(e.row)),
          id ? h("code", { class: "rid", title: "Record ID (" + idCol + ")" }, id) : h("span", { class: "blank" }, "(no ID)"),
          h("span", { class: "tag chk" }, k >= 0 ? SEVEN[k].name : issueLabel(e.issue)),
          e.field ? h("span", { class: "fld" }, ["field ", h("code", null, str(e.field))]) : null
        ]),
        h("p", { class: "exc-msg" }, str(e.message))
      ]));
    });
    if (!exc.length) list.appendChild(h("li", null, [icon("ok", "ico-ok"), h("p", { class: "exc-msg" }, "No problems found in this file.")]));

    // a row whose ID is already in the ledger: the ledger row is kept, the file row is not imported
    var dup = $("dup-panel");
    if (!XDUP.length) dup.hidden = true;
    XDUP.forEach(function (d) {
      var r = rowByNo[d.row], v = (r && r.values) || {}, kept = d.kept || {};
      var fields = [["Movement ID", d.id, v.movement_id], ["Date", kept.date, v.date], ["Type", kept.type, v.type], ["SKU", kept.sku, v.sku],
        ["Lot", kept.lot, v.lot], ["Qty", isNum(kept.qty) ? fmt(kept.qty) : kept.qty, v.qty], ["Reference", kept.reference, v.reference], ["Source link", kept.source_link, v.source_link]];
      append(dup, [
        h("h3", { class: "sub-head", id: "h-dup-" + str(d.row) }, "Existing record kept, row not imported"),
        h("p", { class: "sec-intro" }, ["Row " + str(d.row) + " of the file carries movement ID ", h("code", null, str(d.id)), ", which is already row " + str(d.ledger_row) + " of Inventory_Ledger. The ledger row stays exactly as it was and the file row goes to the exceptions report, so the same movement cannot be counted twice."]),
        h("div", { class: "tbl-box narrow", role: "region", "aria-labelledby": "cap-dup-" + str(d.row), tabindex: "0" }, h("table", { class: "dup-table" }, [
          h("caption", { class: "sr-only", id: "cap-dup-" + str(d.row) }, "The kept ledger row next to the rejected file row"),
          h("thead", null, h("tr", null, [h("th", { scope: "col" }, "Field"), h("th", { scope: "col" }, ["Kept: Inventory_Ledger row " + str(d.ledger_row)]), h("th", { scope: "col" }, "Not imported: file row " + str(d.row))])),
          h("tbody", null, fields.map(function (f) {
            var a = str(f[1]), b = str(f[2]);
            return h("tr", null, [h("th", { scope: "row" }, f[0]), h("td", { class: "mono kept" }, a || h("span", { class: "blank" }, "(blank)")), h("td", { class: "mono rej" }, [b || h("span", { class: "blank" }, "(blank)"), a === b ? sr(" (same as the kept row)") : null])]);
          }))
        ]))
      ]);
    });

    var table = $("imp-table");
    table.tHead.appendChild(h("tr", null, [h("th", { scope: "col", class: "n" }, "Row"), h("th", { scope: "col" }, "Result")].concat(cols.map(function (c) { return h("th", { scope: "col" }, c); }))));
    var body = table.tBodies[0];
    rows.forEach(function (r) {
      var vals = r.values || {};
      var rowOnly = byRowOnly[r.row];
      var rh = h("th", { scope: "row", class: "n" + (rowOnly ? " bad" : ""), title: rowOnly ? rowOnly.map(function (e) { return e.message; }).join(" ") : null },
        [rowOnly ? icon("warn") : null, fmt(r.row), rowOnly ? sr(" problem: " + rowOnly.map(function (e) { return issueLabel(e.issue); }).join(", ")) : null]);
      var cells = cols.map(function (c) {
        var v = vals[c], blank = v == null || str(v).trim() === "";
        var es = byCell[r.row + "\u0000" + c];
        var content = blank ? h("span", { class: "blank" }, "(blank)") : str(v);
        var link = !blank && /^https?:\/\//i.test(str(v));
        return h("td", { class: (es ? "bad" : "") + (link ? " link-cell" : "") || null, title: es ? es.map(function (e) { return e.message; }).join(" ") : (link ? str(v) : null) },
          [es ? icon("warn") : null, link ? shortUrl(str(v)) : content, es ? sr(" problem: " + es.map(function (e) { return issueLabel(e.issue); }).join(", ")) : null]);
      });
      var hasE = !!rowsWithExc[r.row];
      var result = exact ? pill(hasE ? "Rejected" : "Ready", hasE ? "block" : "allow") : pill(hasE ? "Has problems" : "No problems", hasE ? "block" : "allow");
      body.appendChild(h("tr", { id: "imp-r" + str(r.row) }, [rh, h("td", { class: "res" }, result)].concat(cells)));
    });
  }

  /* ---------- 8. marketing ---------- */
  function renderMarketing() {
    var table = $("mkt-table");
    table.classList.add("sticky1");
    var hd = table.tHead;
    hd.appendChild(h("tr", null, [
      h("th", { scope: "col", rowspan: "2" }, "Campaign"),
      h("th", { scope: "col", rowspan: "2" }, "Featured products"),
      h("th", { scope: "col", rowspan: "2" }, "Launch"),
      h("th", { scope: "col", rowspan: "2" }, "Status"),
      h("th", { scope: "colgroup", colspan: "2", class: "grp-h sep" }, "Spend"),
      h("th", { scope: "colgroup", colspan: "2", class: "grp-h sep" }, "Revenue, kept separate")
    ]));
    hd.appendChild(h("tr", null, [
      h("th", { scope: "col", class: "n sep" }, "Planned"),
      h("th", { scope: "col", class: "n" }, "Actual"),
      h("th", { scope: "col", class: "n sep" }, "Platform-attributed"),
      h("th", { scope: "col", class: "n" }, "Company sales")
    ]));
    var list = campaigns.map(function (c, i) { return { c: c, i: i, d: dayNum(c.launch) }; });
    list.sort(function (a, b) { if (a.d == null || b.d == null) return a.d == null && b.d == null ? a.i - b.i : (a.d == null ? 1 : -1); return a.d - b.d || a.i - b.i; });
    var body = table.tBodies[0];
    list.forEach(function (x) {
      var c = x.c;
      body.appendChild(h("tr", null, [
        h("th", { scope: "row", class: "sku-cell" }, [
          h("code", null, str(c.id)), h("span", { class: "nm" }, str(c.name)),
          c.objective ? h("span", { class: "meta-line" }, "Objective: " + str(c.objective)) : null,
          h("span", { class: "meta-line" }, "Channel: " + (str(c.channel) || "not supplied") + " \u00b7 Owner: " + (str(c.owner) || "not supplied"))
        ]),
        h("td", null, h("span", { class: "chips" }, arr(c.products).map(function (p) { return skuCode(toSku(p)); }))),
        h("td", { class: "mono" }, str(c.launch)),
        h("td", null, pill(c.status)),
        moneyTd(c.planned_spend, "sep"),
        moneyTd(c.actual_spend),
        moneyTd(c.attributed_revenue, "sep"),
        moneyTd(c.company_sales)
      ]));
    });
    if (!campaigns.length) body.appendChild(h("tr", null, h("td", { colspan: "8" }, "No campaigns in the data.")));
  }

  /* ---------- 13. metric definitions ---------- */
  function renderMetrics() {
    var gl = $("glossary");
    defs.forEach(function (d) { gl.appendChild(h("div", { class: "g-item" }, [h("dt", null, str(d.metric)), h("dd", null, str(d.definition))])); });
    $("metrics-intro").textContent = defs.length ? fmt(defs.length) + " " + plural(defs.length, "definition") + ", from the workbook\u2019s Metric_Definitions tab, the same data file as the numbers above." : "The data file has no metric definitions.";
  }

  /* ---------- 9. launch timeline ---------- */
  function renderTimeline() {
    var rows = timeline.map(function (r, i) {
      var feat = r.kind === "Campaign" ? (campSkus[r.ref] || []) : [];
      var hay = [r.date, r.kind, r.ref, r.name, r.milestone, r.owner, r.status, feat.join(" "), feat.map(function (s) { return skuName[s] || ""; }).join(" ")].join(" \u0001 ").toLowerCase();
      return { r: r, i: i, d: dayNum(r.date), feat: feat, hay: hay };
    });
    rows.sort(function (a, b) { if (a.d == null || b.d == null) return a.d == null && b.d == null ? a.i - b.i : (a.d == null ? 1 : -1); return a.d - b.d || a.i - b.i; });

    // filter options, all from the data
    var prod = {}, prodList = [];
    function addProd(s) { if (s && !Object.prototype.hasOwnProperty.call(prod, s)) { prod[s] = skuName[s] || ""; prodList.push(s); } }
    rows.forEach(function (x) { if (x.r.kind === "Product") addProd(x.r.ref); });
    rows.forEach(function (x) { x.feat.forEach(addProd); });
    prodList.sort(function (a, b) { return a.localeCompare(b, "en", { numeric: true }); });
    var camp = {}, campList = [];
    rows.forEach(function (x) { if (x.r.kind === "Campaign" && x.r.ref && !Object.prototype.hasOwnProperty.call(camp, x.r.ref)) { camp[x.r.ref] = str(x.r.name || (campById[x.r.ref] || {}).name); campList.push(x.r.ref); } });
    campList.sort(function (a, b) { return a.localeCompare(b, "en", { numeric: true }); });
    var stat = [];
    rows.forEach(function (x) { var s = str(x.r.status); if (s && stat.indexOf(s) < 0) stat.push(s); });
    stat.sort(function (a, b) { return a.localeCompare(b, "en"); });

    var q = $("tl-q"), selP = $("tl-product"), selC = $("tl-campaign"), selT = $("tl-type"), selS = $("tl-status"), from = $("tl-from"), to = $("tl-to");
    prodList.forEach(function (s) { selP.appendChild(h("option", { value: s }, s + (prod[s] ? " \u00b7 " + prod[s] : ""))); });
    campList.forEach(function (c) { selC.appendChild(h("option", { value: c }, c + (camp[c] ? " \u00b7 " + camp[c] : ""))); });
    stat.forEach(function (s) { selS.appendChild(h("option", { value: s }, s)); });
    var dated = rows.filter(function (x) { return x.d != null; });
    if (dated.length) {
      var lo = dated[0].r.date, hi = dated[dated.length - 1].r.date;
      from.min = to.min = lo; from.max = to.max = hi;
    }

    var table = $("tl-table");
    var count = $("tl-count");
    var TOTAL = rows.length;

    function readState() {
      return { q: q.value, product: selP.value, campaign: selC.value, type: selT.value, status: selS.value, from: from.value, to: to.value };
    }
    function matcher(st) {
      var terms = st.q.toLowerCase().split(/\s+/).filter(Boolean);
      var f = dayNum(st.from), t = dayNum(st.to);
      return function (x) {
        var r = x.r;
        if (st.type && r.kind !== st.type) return false;
        if (st.status && str(r.status) !== st.status) return false;
        if (st.product) {
          if (r.kind === "Product") { if (r.ref !== st.product) return false; }
          else if (x.feat.indexOf(st.product) < 0) return false;
        }
        if (st.campaign) {
          if (r.kind === "Campaign") { if (r.ref !== st.campaign) return false; }
          else if ((campSkus[st.campaign] || []).indexOf(r.ref) < 0) return false;
        }
        if (f != null && (x.d == null || x.d < f)) return false;
        if (t != null && (x.d == null || x.d > t)) return false;
        for (var i = 0; i < terms.length; i++) if (x.hay.indexOf(terms[i]) < 0) return false;
        return true;
      };
    }
    function describe(st) {
      var parts = [];
      if (st.q.trim()) parts.push("search \u201c" + st.q.trim() + "\u201d");
      if (st.product) parts.push("product " + st.product);
      if (st.campaign) parts.push("campaign " + st.campaign);
      if (st.type) parts.push(st.type === "Product" ? "products only" : "campaigns only");
      if (st.status) parts.push("status " + st.status);
      if (st.from) parts.push("from " + st.from);
      if (st.to) parts.push("to " + st.to);
      return parts;
    }
    function rowEl(x) {
      var r = x.r, url = safeUrl(r.link), ext = /^https?:\/\//i.test(url);
      var linkKids = url
        ? [h("a", ext ? { class: "scr", href: url, target: "_blank", rel: "noopener noreferrer" } : { class: "scr", href: url },
            ["Open", ext ? icon("ext") : null, sr(" link for " + str(r.milestone) + " (" + str(r.ref) + ")" + (ext ? ", opens in a new tab" : ""))]),
          h("span", { class: "prt" }, shortUrl(url))]
        : [h("span", { class: "muted", "aria-hidden": "true" }, "\u2014"), sr("no link")];
      var kindCls = r.kind === "Campaign" ? "k-campaign" : "k-product";
      return h("tr", { class: "tl-row", role: "row", "data-i": String(x.i) }, [
        h("td", { class: "tl-date", role: "cell", "data-label": "Date" }, [str(r.date), h("span", { class: "tl-wd" }, weekday(r.date))]),
        h("td", { class: "tl-item", role: "cell", "data-label": "Product or campaign" }, [
          h("span", { class: "kind " + kindCls }, str(r.kind)), h("code", { class: "ref" }, str(r.ref)),
          h("span", { class: "nm" }, str(r.name)),
          x.feat.length ? h("span", { class: "feat" }, ["Features "].concat(x.feat.map(function (f, k) { return [k ? ", " : "", h("span", { class: "nobr" }, f)]; }))) : null
        ]),
        h("td", { class: "tl-ms", role: "cell", "data-label": "Milestone" }, str(r.milestone)),
        h("td", { class: "tl-owner", role: "cell", "data-label": "Responsible" }, str(r.owner)),
        h("td", { class: "tl-status", role: "cell", "data-label": "Status" }, pill(r.status)),
        h("td", { class: "tl-link", role: "cell", "data-label": "Link" }, linkKids)
      ]);
    }
    function stamp() {
      var d = new Date(), p = function (n) { return (n < 10 ? "0" : "") + n; };
      $("ph-meta").textContent = BRAND + " \u00b7 data as of " + AS_OF + " \u00b7 printed " + d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate()) + " " + p(d.getHours()) + ":" + p(d.getMinutes());
    }
    function render() {
      var st = readState();
      [q, selP, selC, selT, selS, from, to].forEach(function (el) { el.classList.toggle("on", el.value.trim() !== ""); });
      var list = rows.filter(matcher(st));
      Array.prototype.slice.call(table.tBodies).forEach(function (tb) { table.removeChild(tb); });
      if (!list.length) {
        var tb0 = h("tbody", { role: "rowgroup" }, h("tr", { class: "tl-erow", role: "row" }, h("td", { colspan: "6", "aria-colspan": "6", role: "cell", class: "tl-empty" }, [
          h("p", null, "No milestones match these filters."),
          h("button", { type: "button", class: "btn", "data-reset": "1" }, [icon("reset"), "Reset filters"])
        ])));
        table.appendChild(tb0);
      }
      var perMonth = {};
      list.forEach(function (x) { var mk = monthKey(x.r.date); perMonth[mk] = (perMonth[mk] || 0) + 1; });
      var cur = null, tb = null;
      list.forEach(function (x) {
        var mk = monthKey(x.r.date);
        if (mk !== cur) {
          cur = mk;
          var n = perMonth[mk];
          tb = h("tbody", { role: "rowgroup", "data-month": mk }, h("tr", { class: "tl-mrow", role: "row" },
            h("th", { colspan: "6", "aria-colspan": "6", scope: "rowgroup", role: "rowheader" }, monthLabel(mk) + " \u00b7 " + fmt(n) + " " + plural(n, "milestone"))));
          table.appendChild(tb);
        }
        tb.appendChild(rowEl(x));
      });
      var bad = st.from && st.to && dayNum(st.from) != null && dayNum(st.to) != null && dayNum(st.from) > dayNum(st.to);
      count.textContent = "";
      append(count, list.length === TOTAL
        ? ["Showing all " + fmt(TOTAL) + " " + plural(TOTAL, "milestone")]
        : ["Showing " + fmt(list.length) + " of " + fmt(TOTAL) + " " + plural(TOTAL, "milestone")]);
      if (bad) append(count, h("span", { class: "muted" }, " \u00b7 the From date is after the To date"));
      var parts = describe(st);
      $("ph-filters").textContent = parts.length ? "Filters: " + parts.join(" \u00b7 ") : "Filters: none (all milestones)";
      $("ph-count").textContent = (list.length === TOTAL ? "All " + fmt(TOTAL) : fmt(list.length) + " of " + fmt(TOTAL)) + " " + plural(TOTAL, "milestone") + ", in date order.";
      table.setAttribute("data-shown", String(list.length));
    }
    function reset() {
      q.value = ""; selP.value = ""; selC.value = ""; selT.value = ""; selS.value = ""; from.value = ""; to.value = "";
      render();
    }

    $("tl-form").addEventListener("submit", function (e) { e.preventDefault(); render(); });
    q.addEventListener("input", render);
    [selP, selC, selT, selS].forEach(function (s) { s.addEventListener("change", render); });
    [from, to].forEach(function (d) { d.addEventListener("change", render); d.addEventListener("input", render); });
    $("tl-reset").addEventListener("click", reset);
    table.addEventListener("click", function (e) {
      var b = e.target.closest ? e.target.closest("button[data-reset]") : null;
      if (b) { reset(); q.focus(); }
    });
    $("tl-print").addEventListener("click", function () { stamp(); window.print(); });
    window.addEventListener("beforeprint", stamp);
    stamp();
    render();
  }

  /* ---------- 10. action items ---------- */
  function renderTasks() {
    var list = tasks.map(function (t, i) { return { t: t, i: i, d: dayNum(t.due) }; });
    list.sort(function (a, b) { if (a.d == null || b.d == null) return a.d == null && b.d == null ? a.i - b.i : (a.d == null ? 1 : -1); return a.d - b.d || a.i - b.i; });
    var passed = 0, open = 0;
    var openSt = flagged("Task statuses", "Counts as open");
    var openSet = {};
    if (openSt) openSt.forEach(function (s) { openSet[s.toLowerCase()] = 1; });
    var body = $("task-table").tBodies[0];
    list.forEach(function (x) {
      var t = x.t, late = x.d != null && AS_OF_N != null && x.d < AS_OF_N && !isClosed(t.status);
      if (late) passed++;
      if (openSt ? openSet[str(t.status).toLowerCase()] : !isClosed(t.status)) open++;
      body.appendChild(h("tr", null, [
        h("th", { scope: "row" }, h("code", null, str(t.id))),
        h("td", { class: "wrap-cell" }, str(t.task)),
        h("td", { class: "mono" }, [str(t.due), late ? h("span", { class: "past" }, pill("Due date passed", "review")) : null]),
        h("td", null, pill(t.status)),
        h("td", { class: "tl-owner" }, str(t.owner))
      ]));
    });
    if (!tasks.length) body.appendChild(h("tr", null, h("td", { colspan: "5" }, "No action items in the data.")));
    append($("task-intro"), [
      h("strong", null, fmt(tasks.length) + " action " + plural(tasks.length, "item")), " with owners, by due date; ",
      h("strong", null, fmt(open) + " open"), openSt ? " (status " + listText(openSt.map(function (s) { return s.toLowerCase(); })) + ", as set on Config)" : "", ". ",
      "\u201cDue date passed\u201d marks an item that is still open and was due before " + AS_OF + " (" + fmt(passed) + " " + plural(passed, "item") + ")."
    ]);
  }

  /* ---------- 11. config ---------- */
  function renderConfig() {
    var sec = $("config");
    if (!XCFG) { $("cfg-intro").textContent = "The data file has no Config export."; sec.querySelector(".cfg-grid").hidden = true; $("h-cfg-lists").hidden = true; return; }
    var w = arr(XCFG.expiry_windows);
    var rows = [
      ["As-of date", str(XCFG.as_of), "All day counts, overdue flags and expiry windows use this date, so the alerts do not move until it is changed."],
      ["Opening balance date", str(XCFG.opening_date), "Opening balances in Products and Batches are the units on hand on this date."],
      ["Expiry windows (days left)", w.map(fmt).join(" / "), "Lots are alerted in these windows; a lot beyond the last one is not alerted."],
      ["Reorder test uses", str(XCFG.reorder_basis), "Which stock is compared with each SKU\u2019s reorder point (set per SKU on Products): Available or Recorded."],
      ["Expired lots are held", str(XCFG.expired_lots_held), "Yes = units in expired lots are not available."]
    ];
    var tb = $("cfg-settings").tBodies[0];
    rows.forEach(function (r) {
      tb.appendChild(h("tr", null, [h("th", { scope: "row" }, r[0]), h("td", { class: "mono strong" }, r[1]), h("td", null, r[2])]));
    });
    var box = $("cfg-rules");
    box.appendChild(h("h3", { class: "mini-head", id: "h-cfg-rules" }, "Status rules"));
    var grid = h("div", { class: "rule-tables" });
    arr(XCFG.status_rules).forEach(function (t, k) {
      var cap = "cap-cfg-rule-" + k;
      grid.appendChild(h("div", { class: "tbl-box", role: "region", "aria-labelledby": cap, tabindex: "0" }, h("table", { class: "mini-table" }, [
        h("caption", { id: cap }, str(t.list)),
        h("thead", null, h("tr", null, [h("th", { scope: "col" }, "Status")].concat(arr(t.columns).map(function (c) { return h("th", { scope: "col" }, c); })))),
        h("tbody", null, arr(t.rows).map(function (r) {
          return h("tr", null, [h("th", { scope: "row" }, str(r[0]))].concat(r.slice(1).map(function (v) {
            return h("td", null, h("span", { class: "yn " + (str(v).toLowerCase() === "yes" ? "yes" : "no") }, str(v)));
          })));
        }))
      ])));
    });
    box.appendChild(grid);
    var dl = $("cfg-lists");
    arr(XCFG.lists).forEach(function (l) {
      dl.appendChild(h("div", { class: "cl-item" }, [h("dt", null, str(l.name)), h("dd", null, arr(l.values).map(function (v) { return h("span", { class: "chip" }, str(v)); }))]));
    });
  }

  /* ---------- 12. workbook ---------- */
  // What each record tab covers (the brief's list) and which tabs point to its ID (dropdowns and record checks in the workbook).
  var COVERS = {
    Products: "Product catalog", Suppliers: "Suppliers and manufacturing partners", Purchase_Orders: "Purchase orders and expected deliveries",
    Inventory_Ledger: "Inventory receipts, shipments and adjustments", Batches: "Batch and expiration records", Reservations: "Stock reserved for orders and campaigns",
    Marketing: "Marketing calendar and campaign results", Milestones: "Product and campaign milestones (source of the timeline)", Tasks: "Action items and owners",
    Documents: "Product document register"
  };
  var USED_IN = {
    Products: ["Purchase_Orders", "Inventory_Ledger", "Batches", "Reservations", "Marketing", "Milestones"],
    Suppliers: ["Products", "Purchase_Orders", "Batches"],
    Purchase_Orders: ["Inventory_Ledger (receipt reference)"],
    Inventory_Ledger: ["Import_Staging (duplicate check)"],
    Batches: ["Inventory_Ledger"],
    Marketing: ["Milestones"]
  };
  function renderWorkbook() {
    var file = /^[\w.-]+\.xlsx$/i.test(str(WB.file)) ? str(WB.file) : "Ops-Workbook-demo.xlsx";
    var sheets = arr(WB.sheets);
    append($("dl-row"), [
      h("a", { class: "btn primary", href: file, download: file }, [icon("down"), "Download " + file]),
      h("p", { class: "prose" }, ["Excel format (.xlsx), " + fmt(sheets.length) + " " + plural(sheets.length, "tab") + ". It was built and recalculated with LibreOffice; its formulas use only functions that Excel and Google Sheets also have. If Google Sheets drops the sheet protection when it converts the .xlsx file, the Start_Here tab gives the steps to switch it back on."])
    ]);

    // tabs and IDs
    var tb = $("tab-table").tBodies[0];
    var capOf = {};
    XCOLS.forEach(function (c) {
      capOf[c.sheet] = c.capacity;
      var used = USED_IN[c.sheet] || [];
      tb.appendChild(h("tr", { "data-sheet": str(c.sheet) }, [
        h("th", { scope: "row" }, h("strong", null, str(c.sheet))),
        h("td", null, COVERS[c.sheet] || ""),
        h("td", null, [str(c.id_column), c.example_id ? [" ", h("span", { class: "muted" }, "e.g. "), h("code", null, str(c.example_id))] : null]),
        h("td", { class: "small" }, used.length ? used.join(", ") : h("span", { class: "muted" }, "\u2014")),
        numTd(c.records),
        numTd(c.capacity)
      ]));
    });
    if (!XCOLS.length) $("tab-table").closest(".tbl-box").hidden = true;
    var others = sheets.map(function (s) { return str(s.name); }).filter(function (n) { return !XCOLS.some(function (c) { return c.sheet === n; }); });
    $("tabs-intro").textContent = "Each record type has its own tab whose first column is a stable ID. Other tabs point to a record by that ID: SKU, supplier and lot IDs are picked from dropdown lists of the IDs that exist, and the Record check column flags a SKU, supplier, lot or campaign ID that does not exist." +
      (others.length ? " The other " + fmt(others.length) + " tabs are " + listText(others) + "." : "");

    // input vs calculated columns
    var led = null;
    XCOLS.forEach(function (c) { if (c.sheet === "Inventory_Ledger") led = c; });
    append($("cols-intro"), ["Header colours as in the workbook. Staff type only in the dark blue input columns; grey columns are formulas and are locked by sheet protection. Formulas are already filled down to the last spare row of each tab",
      led && isNum(led.capacity) ? " (" + fmt(led.capacity) + " rows on Inventory_Ledger)" : "",
      ", so a record typed into the next empty row calculates by itself and nobody copies formulas. An asterisk marks a required field."]);
    var legend = $("legend");
    [["in", "Input: you type here (unlocked)"], ["calc", "Calculated by formula (locked)"], ["helper", "Helper for the Dashboard and Exceptions lists (locked)"]].forEach(function (l) {
      legend.appendChild(h("li", null, [h("span", { class: "sw sw-" + l[0], "aria-hidden": "true" }), l[1]]));
    });
    var cl = $("cols-list");
    // the stock tabs first and open; the other record tabs in a closed details element
    var FIRST_TABS = ["Inventory_Ledger", "Products", "Batches"];
    var firstCols = FIRST_TABS.map(function (n) { return XCOLS.filter(function (c) { return c.sheet === n; })[0]; }).filter(Boolean);
    var restCols = XCOLS.filter(function (c) { return FIRST_TABS.indexOf(c.sheet) < 0; });
    var more = null;
    if (restCols.length) {
      more = h("details", { class: "more-cols" }, h("summary", null, "Columns of the other " + fmt(restCols.length) + " record tabs"));
    }
    firstCols.concat(restCols).forEach(function (c) {
      var host = FIRST_TABS.indexOf(c.sheet) >= 0 || !more ? cl : more;
      var req = {};
      arr(c.required).forEach(function (n) { req[n] = 1; });
      host.appendChild(h("div", { class: "col-row", "data-sheet": str(c.sheet) }, [
        h("h4", { class: "col-sheet" }, [str(c.sheet), h("span", { class: "muted small" }, " \u00b7 " + fmt(arr(c.input).length) + " input, " + fmt(arr(c.calculated).length) + " calculated" + (c.helper ? ", " + fmt(c.helper) + " helper" : ""))]),
        h("div", { class: "col-chips" }, [
          arr(c.input).map(function (n) { return h("span", { class: "cc cc-in" }, n + (req[n] ? " *" : "")); }),
          arr(c.calculated).map(function (n) { return h("span", { class: "cc cc-calc" }, [icon("lock", "lk"), n]); })
        ])
      ]));
    });
    if (more) cl.appendChild(more);

    // record checks
    var rb = $("rc-table").tBodies[0], totRows = 0, totIss = 0;
    XRC.forEach(function (r) {
      if (isNum(r.rows)) totRows += r.rows;
      if (isNum(r.issues)) totIss += r.issues;
      rb.appendChild(h("tr", null, [h("th", { scope: "row" }, str(r.sheet)), numTd(r.rows), h("td", { class: "n" + (r.issues ? " bad-n" : "") }, fmt(r.issues))]));
    });
    if (XRC.length) $("rc-table").tFoot.appendChild(h("tr", null, [h("th", { scope: "row" }, "Total"), numTd(totRows), h("td", { class: "n" + (totIss ? " bad-n" : "") }, fmt(totIss))]));
    var tileIss = xTile("Record issues");
    $("rc-intro").textContent = XRC.length
      ? "Every record tab has a Record check column. It says OK, or names the first problem in the row: a missing required field, a duplicate ID, an unknown SKU or supplier, an opening balance that differs from the lot openings, or lot balances that differ from the recorded stock. The Dashboard counts every row that is not OK" +
        (isNum(tileIss) ? " (Missing or inconsistent records: " + fmt(tileIss) + " on this sample data)." : ".")
      : "The data file has no record check counts.";
    if (!XRC.length) $("rc-table").closest(".tbl-box").hidden = true;

    var body = $("sheet-table").tBodies[0];
    sheets.forEach(function (s, i) {
      body.appendChild(h("tr", null, [h("td", { class: "n" }, fmt(i + 1)), h("th", { scope: "row" }, h("strong", null, str(s.name))), h("td", null, str(s.purpose))]));
    });
  }

  run("main", renderFacts);
  run("dashboard", renderKPIs);
  run("stock", renderStock);
  run("stock", renderAvail);
  run("reconcile", renderRecon);
  run("tests", renderTests);
  run("purchasing", renderPOs);
  run("expiry", renderBatches);
  run("import", renderImport);
  run("marketing", renderMarketing);
  run("timeline", renderTimeline);
  run("tasks", renderTasks);
  run("config", renderConfig);
  run("workbook", renderWorkbook);
  run("metrics", renderMetrics);
  doc.body.setAttribute("data-ready", "1");

  // a link straight to a section: scroll again now that the sections have their full height
  if (location.hash.length > 1) {
    var target = null;
    try { target = doc.getElementById(decodeURIComponent(location.hash.slice(1))); } catch (e) { target = null; }
    if (target) target.scrollIntoView();
  }
})();
